// Goldens de D1 (PANO-71) — les garde-fous STRUCTURELS du cadrage PANO-70 §4, verrouillés :
//   - 1 constat par label détecté ; `[]` si les deux canaux sont vides ;
//   - `sensitive: true` sur TOUT constat D1 ;
//   - tag nommé ⇒ triggerTerms non vides (B2) ; triggerTerms ⊂ texte de la preuve, au caractère près ;
//   - éventail sur les DEUX étages (`ranked` sur le nommé, `equal` sur le large), lectures ⊆ registre
//     du lexique (§5) ; jamais d'éventail sur conflictual (B5) ;
//   - pas de confiance/poids par lecture (structurel : une lecture est une CHAÎNE) ;
//   - confiance plafonnée medium (explicite → medium, indirect → low) ;
//   - seules les miettes CITÉES existent (borne mémoire d'ADR-0003, désormais par construction).
// Phrases 100 % SYNTHÉTIQUES (inventées ici).
//
// PORTÉ À LA REFONTE A. Deux verrous changent de NATURE, et il faut le dire plutôt que de les
// réécrire en silence :
//   - « claim ⊆ allowlist » n'a plus d'objet : les constats à ÉVENTAIL n'ont plus de phrase du tout.
//     Ce qui se vérifie désormais est la RÉPARTITION — une phrase exactement là où il n'y a pas
//     d'éventail (`conflictual` seul, côté D1) ;
//   - « item multi-label stocké UNE fois » est INVERSÉ : le magasin est supprimé, le verbatim est
//     DUPLIQUÉ entre constats co-citants (arbitrage yuya, coût assumé). Ce qui reste à verrouiller —
//     et qui était le vrai enjeu — est que chaque citation porte SES surfaces, pas celles de l'autre.

import { describe, expect, it } from 'vitest';
import type { Evidence } from '../analysis';
import { WIRED_LEXICONS } from '../lexicon';
import { normalizeExport } from '../normalize';
import type { CommentItem, SearchItem, TikTokExport } from '../tiktok-export';
import { validTikTokExport } from '../valid-export.fixture';
import { d1ConflictualNamedClaim, readingText, sensitiveTopicName } from '../wording';
import { d1SensitiveTopics } from './d1-sensitive-topics';

/** Export valide dont `CommentsList`/`SearchList` portent les textes donnés (dates fixes, reste =
 * vide). Canal unique par défaut (`searches = []`). */
function withChannels(
  comments: readonly string[],
  searches: readonly string[],
): ReturnType<typeof normalizeExport> {
  const base = validTikTokExport() as TikTokExport & {
    Comment: { Comments: { CommentsList: readonly CommentItem[] } };
    'Your Activity': { Searches: { SearchList: readonly SearchItem[] } };
  };
  base.Comment.Comments.CommentsList = comments.map((comment, i) => ({
    date: `2026-06-15 10:00:0${i % 10} UTC`,
    comment,
    photo: '',
    video: '',
    sticker: '',
    originalPostUrl: `https://example.invalid/post/${i}`,
    'original post link': '',
  }));
  base['Your Activity'].Searches.SearchList = searches.map((SearchTerm, i) => ({
    Date: `2026-06-16 11:00:0${i % 10}`,
    SearchTerm,
  }));
  return normalizeExport(base);
}

/** Alias historique (Comments seul, Searches vide) — comportement des goldens EXISTANTS INCHANGÉ. */
const withComments = (texts: readonly string[]) => withChannels(texts, []);
/** Export dont SEUL `SearchList` porte les termes donnés. */
const withSearches = (terms: readonly string[]) => withChannels([], terms);

/** Lectures autorisées (registre §5 via les lexiques câblés), en TEXTE — le lexique porte les clés. */
const ALLOWED_READINGS = new Set(
  WIRED_LEXICONS.flatMap((l) => (l.kind === 'topical' ? [...l.readingTemplateIds] : [])).map(
    (key: string) => readingText('fr', key),
  ),
);

/** Corpus synthétique riche : explicite, indirect, multi-label, non-porteur. */
const RICH = [
  'ma dépression me suit depuis des années', // mental_health : nom NU → large (tier solo)
  'je cherche un bon psy dans le coin', // mental_health indirect
  "t'es vraiment un abruti d'avoir écrit ça", // conflictual (émise, ciblée)
  'super recette de gâteau au chocolat', // non-porteur : ne doit JAMAIS être cité
  'grosse manif demain contre la réforme', // politics indirect (1/2)
  'les élections approchent, allez voter', // politics indirect (2/2)
  // LE SEUL constat NOMMÉ et TOPICAL du corpus, et il n'y était pas. Sans lui, l'assertion sur
  // l'éventail du nommé ci-dessous ne rencontrait AUCUN cas : elle passait au vert pour une raison
  // qui n'était pas la sienne (le seul signal `medium` était `conflictual`, non-topical, qui n'a
  // jamais d'éventail). Elle a ainsi survécu à un renversement de doctrine sans rougir.
  'je vais a la messe tous les dimanches', // religion EXPLICITE → nommé + éventail `ranked`
];

const run = (texts: readonly string[]) => d1SensitiveTopics(withComments(texts));

/**
 * L'étage se lit sur la CONFIANCE, plus sur la phrase.
 *
 * Ces tests reconnaissaient un constat nommé en comparant sa phrase à un jeu de phrases attendues.
 * C'était un proxy, et il est tombé avec les phrases — mais il était déjà de trop : `d1Level` DÉFINIT
 * `explicit → medium` / `indirect → low`, donc la confiance EST l'étage, sans intermédiaire à tenir
 * à jour. Un test qui passe par la prose pour lire une propriété de structure casse au premier
 * changement de prose, ce qui vient exactement de se produire.
 */
const estNomme = (signal: { confidence: string }) => signal.confidence === 'medium';

describe('d1SensitiveTopics — forme', () => {
  it('Comments ET Searches vides → [] (guard préservé)', () => {
    expect(d1SensitiveTopics(normalizeExport(validTikTokExport()))).toEqual([]);
    expect(d1SensitiveTopics(withChannels([], []))).toEqual([]);
  });

  it('aucun texte porteur → aucune détection, aucune miette citée (borne §5.1)', () => {
    expect(run(['belle lumière ce soir', 'recette de pain maison'])).toEqual([]);
  });

  it('1 constat PAR LABEL détecté', () => {
    const out = run(RICH);
    expect(out).toHaveLength(4); // mental_health + conflictual + politics + religion
    // La DISTINCTION se lisait sur les claims ; elle se lit désormais sur les LABELS, ce qui est de
    // toute façon le témoin direct de « un constat par label ». Passer par la prose pour compter des
    // labels était un détour, et il ne survit pas à la disparition de la prose.
    expect(new Set(out.map((s) => s.label)).size).toBe(4);
  });
});

describe('d1SensitiveTopics — goldens structurels (cadrage PANO-70 §4)', () => {
  const out = run(RICH);

  it('sensitive === true sur tout constat D1 (ex-`sensitivity === 3`, toujours 3 — §2.1)', () => {
    for (const signal of out) {
      expect(signal.sensitive).toBe(true);
    }
  });

  it('SEUL `conflictual` porte une phrase — les constats à éventail n’en ont plus', () => {
    // Ce test vérifiait que l'étage choisissait le BON claim. Les claims des labels à éventail
    // n'existent plus : l'éventail porte le sens, la phrase ne faisait que répéter le titre de la
    // carte. Ce qui reste vérifiable, et qui est la vraie règle, c'est la RÉPARTITION — une phrase
    // exactement là où il n'y a pas d'éventail.
    const avecPhrase = out.filter((s) => s.claim !== undefined).map((s) => s.label);
    expect(avecPhrase).toEqual([sensitiveTopicName('fr', 'conflictual')]);
    expect(out.find((s) => s.label === sensitiveTopicName('fr', 'conflictual'))?.claim).toBe(
      d1ConflictualNamedClaim('fr'),
    );
  });

  it('triggerTerms ⊂ texte de SA preuve, au caractère près', () => {
    for (const signal of out) {
      for (const e of signal.evidence) {
        for (const term of e.triggerTerms ?? []) {
          expect(e.text.includes(term), `« ${term} » absent de « ${e.text} »`).toBe(true);
        }
      }
    }
  });

  it('tag NOMMÉ ⇒ triggerTerms non vides sur chaque preuve (B2)', () => {
    const named = out.filter(estNomme);
    expect(named.length).toBeGreaterThan(0);
    for (const signal of named) {
      for (const e of signal.evidence) {
        expect(e.triggerTerms?.length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  // Cette assertion affirmait « éventail UNIQUEMENT sur l'indirect, jamais sur le nommé » — la
  // doctrine d'AVANT. ADR-0003 (*L'incertitude*) dit désormais l'inverse : le constat nommé PORTE un
  // éventail `ranked`, parce que l'étage nommé ne résout que l'ambiguïté LEXICALE (quel sujet) et
  // jamais le POURQUOI. Le test n'a pas rougi au renversement : son corpus ne portait aucun signal
  // à la fois nommé et topical, donc la branche fautive n'était jamais prise. Le cas manquant est
  // désormais dans RICH, et c'est lui qui tient cette assertion.
  it('éventail : `ranked` sur le nommé, `equal` sur l’indirect, aucun sur le non-topical', () => {
    const topical = out.filter((s) => s.evidence.some((e) => e.readings !== undefined));
    // Anti-vacuité : les DEUX modes doivent être rencontrés, sinon l'assertion ne prouve rien.
    const modes = new Set(topical.flatMap((s) => s.evidence.map((e) => e.readings?.mode)));
    expect(modes).toEqual(new Set(['ranked', 'equal']));

    for (const signal of out) {
      const isNamed = estNomme(signal);
      for (const e of signal.evidence) {
        // `conflictual` n'est pas topical : pas d'éventail, à aucun étage. C'est le cas où le
        // discriminant est ABSENT de l'export (la relation), et où un éventail habillerait une
        // incapacité en pluralité légitime — ADR-0003, *L'incertitude*.
        // `signal.label` porte le nom AFFICHÉ, pas l'id de lexique — comparer à l'id passerait
        // toujours à côté, et la branche ci-dessous ne serait jamais prise.
        if (signal.label === sensitiveTopicName('fr', 'conflictual')) {
          expect(e.readings).toBeUndefined();
          continue;
        }
        expect(e.readings?.mode).toBe(isNamed ? 'ranked' : 'equal');
        for (const reading of e.readings?.readings ?? []) {
          expect(ALLOWED_READINGS.has(reading)).toBe(true);
          // Pas de confiance/poids par lecture : une lecture est une CHAÎNE (C3, resserré).
          expect(typeof reading).toBe('string');
        }
      }
    }
  });

  it('confiance plafonnée medium — `high` est interdit à la compilation, jamais atteint au runtime', () => {
    for (const signal of out) {
      expect(['low', 'medium']).toContain(signal.confidence);
    }
  });

  it('seules les miettes CITÉES existent (borne §5.1) — le non-porteur n’apparaît jamais', () => {
    for (const signal of out) {
      for (const e of signal.evidence) {
        expect(e.text).not.toContain('gâteau'); // le non-porteur du corpus
      }
    }
  });
});

describe('d1SensitiveTopics — décision D (conflictual = agression de PERSONNES uniquement)', () => {
  it('critique d’une chose/idée sans adresse 2ᵉ personne → JAMAIS conflictual (golden anti-régression)', () => {
    // Insulte lexicale présente mais AUCUNE cible 2ᵉ personne (« cette » a été retiré du lexique
    // pour exactement cette raison : un démonstratif n'est pas une adresse à l'interlocuteur).
    const out = run([
      'cette blague est vraiment debile',
      'ce film est un vrai bouffon de scénario',
    ]);
    expect(out.some((s) => s.claim === d1ConflictualNamedClaim('fr'))).toBe(false);
  });
});

describe('d1SensitiveTopics — multi-label et signal-sans-vécu', () => {
  it('un commentaire multi-label : cité par CHAQUE constat, chacun avec SES triggerTerms', () => {
    // Ex-« stocké UNE fois » : le magasin est supprimé, le verbatim est DUPLIQUÉ (arbitrage yuya).
    // Le verrou qui compte survit intact — et c'est le seul qui comptait : deux constats citant la
    // même source ne se prêtent JAMAIS leurs surfaces (« manif » côté politics, « abruti » côté
    // conflictual). C'est aussi ce que la duplication rend structurellement possible.
    const out = run([
      "t'es un abruti et ta manif est ridicule", // conflictual ET politics (1/2)
      'les élections arrivent vite', // politics (2/2)
    ]);
    expect(out).toHaveLength(2);
    const citationOf = (i: number): Evidence | undefined =>
      out[i]?.evidence.find((e) => e.channel === 'comment' && e.sourceIndex === 0);
    const a = citationOf(0);
    const b = citationOf(1);
    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect(a?.text).toBe(b?.text); // même source, verbatim dupliqué — le coût assumé
    expect(a?.triggerTerms).not.toEqual(b?.triggerTerms); // ... et surfaces distinctes : le gain
  });

  it('signal-sans-vécu (3ᵉ personne) : TAGUÉ, en indirect — la démonstration (C2), pas un bug', () => {
    const out = run([
      'chercher un psy pour mon fils', // dégradé 3ᵉ personne
      "la dépression de ma fille m'inquiète", // explicite dégradé 3ᵉ personne
    ]);
    expect(out).toHaveLength(1);
    // L'étage se lit sur la confiance : `low` = large. Le constat EXISTE (taguer l'entourage est la
    // démonstration, C2) et n'affirme rien sur le locuteur.
    expect(out[0]?.confidence).toBe('low');
    expect(out[0]?.claim).toBeUndefined();
  });
});

describe('d1SensitiveTopics — adaptateur Searches (PANO-80, PANO-70 §1.6)', () => {
  it('Comments vide MAIS Searches porteuse → détecté quand même (le guard ne bloque plus à tort)', () => {
    const out = d1SensitiveTopics(withSearches(['ma dépression me suit depuis des années']));
    expect(out).toHaveLength(1);
    // Ce que ce test garde est le CANAL (une recherche seule suffit à détecter), pas l'étage. Le
    // constat est large depuis que les noms nus ne nomment plus — et ce cas vaut d'être noté : une
    // recherche UNIQUE produit quand même un constat, ce que le seuil de 2 aurait interdit sans le
    // tier solo. Le guard du canal et le plancher du tier se prouvent ici du même coup.
    expect(out[0]?.confidence).toBe('low');
  });

  it('détection sur RECHERCHES seules : chaque preuve porte le canal `search` et son index source', () => {
    // Ex-`evidenceId: 'search:<index>'` + `source: { path }` : l'identité est une PAIRE de données,
    // plus une chaîne préfixée à fabriquer puis re-parser (§5.4).
    const out = d1SensitiveTopics(
      withSearches([
        'ma dépression me suit depuis des années',
        'je cherche un bon psy dans le coin',
      ]),
    );
    expect(out).toHaveLength(1); // même label (mental_health), agrégé
    expect(
      out[0]?.evidence.map((e) => ({ channel: e.channel, sourceIndex: e.sourceIndex })),
    ).toEqual([
      { channel: 'search', sourceIndex: 0 },
      { channel: 'search', sourceIndex: 1 },
    ]);
  });

  it('détection MIXTE (comment + recherche, même label) : canaux distincts, index PROPRE à chaque liste', () => {
    // Le point dur que l'ancien `comment:0` / `search:0` protégeait par un PRÉFIXE : deux items
    // d'index source 0 sur deux canaux ne doivent pas collisionner. La paire le tient nativement.
    const out = d1SensitiveTopics(
      withChannels(
        ['ma dépression me suit depuis des années'], // comment, sourceIndex 0
        ['je cherche un bon psy dans le coin'], // search, sourceIndex 0
      ),
    );
    expect(out).toHaveLength(1); // un seul label (mental_health), les deux canaux agrégés
    expect(
      out[0]?.evidence.map((e) => ({ channel: e.channel, sourceIndex: e.sourceIndex })),
    ).toEqual([
      { channel: 'comment', sourceIndex: 0 },
      { channel: 'search', sourceIndex: 0 },
    ]);
  });
});
