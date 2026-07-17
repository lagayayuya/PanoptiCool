// Helpers PARTAGÉS par les producteurs (ex-`rule.ts`, Refonte A lot A1).
//
// Ce qui a disparu avec le fichier `rule.ts` : le type `Rule`/`EvidenceRule` (il n'y a plus de
// registre à typer — `analyze.ts` appelle chaque producteur par son nom), les fabriques d'`Insight`
// par `kind` (l'union `Insight` n'existe plus), `capVerbatim`/`SAMPLE_SIGNALS_CAP` (leur seul client
// était `InferredValue.sampleSignals`, sans lecteur à l'écran), et les trois fabriques d'`EvidenceId`
// (`commentEvidenceId`/`searchEvidenceId`/`channelEvidenceId`) — la preuve est désormais une
// référence DIRECTE portant `channel` + `sourceIndex`, il n'y a plus de chaîne à fabriquer ni à
// re-parser (§5.4).
//
// Le plafond de confiance de l'inféré n'a plus besoin d'un type dédié (`InferredLevel`) : sur le
// sensible il est porté par l'union `Deduction` elle-même (`sensitive: true` ⇒ `low | medium`,
// `high` interdit À LA COMPILATION).

/**
 * Item de texte candidat au matching lexical, avec son CANAL d'origine (PANO-80).
 *
 * Sa forme est exactement celle d'`Evidence` moins les champs de citation (`triggerTerms`,
 * `readings`) : depuis §5.4, `resolve()` rend directement de quoi construire une preuve — c'est
 * l'aller-retour stringly-typed en moins, pas seulement une `Map`.
 */
export interface ChannelText {
  channel: 'comment' | 'search';
  /** Index dans SA liste source (comments OU searches) — jamais dans le corpus concaténé. */
  sourceIndex: number;
  /** Texte verbatim (le `comment` ou le `SearchTerm`). */
  text: string;
  /** Date source brute (format §1.1), verbatim. */
  date: string;
}

/**
 * Corpus COMMENTAIRES + RECHERCHES combiné pour une détection uniforme (PANO-80, adaptateur Searches
 * PANO-70 §1.6). Concatène les deux listes en UN corpus (commentaires d'abord, puis recherches) pour
 * UNE seule passe `detectLabels` : la machinerie d'agrégation par label tourne à travers les deux
 * canaux sans qu'aucun producteur n'ait à la ré-implémenter par canal. `resolve(itemIndex)` retrouve
 * le canal + l'item source d'un index du corpus concaténé.
 */
export function buildChannelCorpus(
  comments: readonly { comment: string; date: string }[],
  searches: readonly { SearchTerm: string; Date: string }[],
): { texts: string[]; resolve: (itemIndex: number) => ChannelText } {
  const texts = [...comments.map((c) => c.comment), ...searches.map((s) => s.SearchTerm)];
  const nComments = comments.length;
  function resolve(itemIndex: number): ChannelText {
    if (itemIndex < nComments) {
      const c = comments[itemIndex];
      return {
        channel: 'comment',
        sourceIndex: itemIndex,
        text: c?.comment ?? '',
        date: c?.date ?? '',
      };
    }
    const sourceIndex = itemIndex - nComments;
    const s = searches[sourceIndex];
    return {
      channel: 'search',
      sourceIndex,
      text: s?.SearchTerm ?? '',
      date: s?.Date ?? '',
    };
  }
  return { texts, resolve };
}

/**
 * Parse une date source brute (contrat §1.1 : `YYYY-MM-DD HH:MM:SS` nu OU suffixe `… UTC`) en epoch
 * ms UTC. `null` si non parsable. Étape INTERNE du moteur (jamais à la frontière) : retire ` UTC`,
 * normalise l'espace en `T`, force le fuseau `Z` — sinon `Date.parse` appliquerait le fuseau LOCAL
 * de l'environnement d'exécution (dérive selon la machine).
 */
export function parseRawDateUTC(raw: string): number | null {
  const t = Date.parse(`${raw.trim().replace(/ UTC$/, '').replace(' ', 'T')}Z`);
  return Number.isNaN(t) ? null : t;
}
