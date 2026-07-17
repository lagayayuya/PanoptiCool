// Normalisation FR INDEXÉE pour le matching lexical (PANO-71, machinerie PANO-70 §2.3).
//
// Minuscules + accents retirés + apostrophes typographiques unifiées + tirets→espaces (PANO-36 :
// « burn-out » / « burn out » = une seule entrée de lexique).
// Point clé : la normalisation est INDEXÉE. Chaque caractère du texte normalisé
// garde l'offset de son caractère d'origine, pour qu'un match dans le normalisé se re-projette
// EXACTEMENT sur le texte original. C'est ce qui permet à `triggerTerms` de porter la FORME DE
// SURFACE (« Dépréssion » tel que tapé, pas « depression » normalisé) : l'invariant
// `triggerTerms ⊂ texte` (PANO-70 §2.4) est vrai au caractère près, surlignable sans re-matching.
//
// PANO-36 ajoute la SQUELETTISATION indexée (répétitions d'un même caractère réduites à une
// occurrence) : le second espace de matching pour les allongements expressifs (« ftgggg »,
// « connnnard ») — voir detect.ts, fallback CONDITIONNÉ à un allongement visible dans la surface.
//
// TS pur, sans DOM, zéro dépendance (ADR-0002).

/** Marques combinantes Unicode (accents décomposés par NFD) — retirées du normalisé. */
const COMBINING_MARK = /\p{M}/gu;

/** Texte normalisé + carte de re-projection vers l'original. */
export interface NormalizedText {
  /** Texte original, intact (source des formes de surface). */
  readonly original: string;
  /** Texte normalisé : minuscules, sans accents, apostrophes `'`. */
  readonly norm: string;
  /** `starts[i]` = offset (code units) du caractère original dont provient `norm[i]`. */
  readonly starts: readonly number[];
  /** `ends[i]` = offset APRÈS ce caractère original (borne exclusive). */
  readonly ends: readonly number[];
}

/**
 * Normalise en conservant la carte d'offsets. Itération par POINT DE CODE (pas par code unit) :
 * un caractère original peut produire 0 (marque seule), 1 ou plusieurs caractères normalisés —
 * tous pointent vers le même caractère d'origine.
 */
export function normalizeFr(text: string): NormalizedText {
  let norm = '';
  const starts: number[] = [];
  const ends: number[] = [];
  let offset = 0;
  for (const char of text) {
    const next = offset + char.length;
    // Apostrophe typographique → droite ; tiret → espace (PANO-36 : « burn-out » ≡ « burn out »,
    // une seule entrée de lexique couvre les deux graphies).
    const replaced = char === '’' ? "'" : char === '-' ? ' ' : char;
    const stripped = replaced.normalize('NFD').replace(COMBINING_MARK, '').toLowerCase();
    for (const out of stripped) {
      norm += out;
      starts.push(offset);
      ends.push(next);
    }
    offset = next;
  }
  return { original: text, norm, starts, ends };
}

/**
 * SQUELETTISATION indexée (PANO-36) : toute répétition d'un même caractère est réduite à UNE
 * occurrence, la carte d'offsets absorbant le run entier (la forme de surface d'un match
 * squelettisé reste le segment original complet, allongement inclus — `triggerTerms ⊂ texte`
 * tient). Second espace de matching pour les allongements expressifs ; le déclenchement est
 * gardé côté detect.ts (allongement ≥ 3 visible dans la surface), pour que « cône » (→ « cone »)
 * ne puisse jamais matcher « conne » (→ « cone ») sur du texte non allongé.
 */
export function skeletonize(text: NormalizedText): NormalizedText {
  let norm = '';
  const starts: number[] = [];
  const ends: number[] = [];
  for (let i = 0; i < text.norm.length; i++) {
    const char = text.norm.charAt(i);
    if (norm.length > 0 && norm.charAt(norm.length - 1) === char) {
      ends[ends.length - 1] = text.ends[i] ?? 0; // étend le run : la surface couvre l'allongement
      continue;
    }
    norm += char;
    starts.push(text.starts[i] ?? 0);
    ends.push(text.ends[i] ?? 0);
  }
  return { original: text.original, norm, starts, ends };
}

/** Squelette d'une chaîne déjà normalisée (pour les MARQUEURS : « connard » → « conard »). */
export function collapseRuns(normalized: string): string {
  return normalized.replace(/(.)\1+/g, '$1');
}

/**
 * Forme de surface du segment `[start, end)` DU NORMALISÉ, découpée dans l'ORIGINAL via la carte.
 * Contrat : `start < end`, bornes dans le normalisé (garanties par le matching, pas revérifiées).
 */
export function surfaceForm(text: NormalizedText, start: number, end: number): string {
  const from = text.starts[start];
  const to = text.ends[end - 1];
  if (from === undefined || to === undefined) {
    return ''; // bornes hors carte : segment vide plutôt qu'une exception (défensif, jamais attendu)
  }
  return text.original.slice(from, to);
}
