// Surlignage des mots déclencheurs dans un texte-source (ex-`evidence-v2.ts`).
//
// Extrait tel quel de `evidence-v2.ts`, retiré au lot A1 : ce module ne résolvait plus rien une fois
// le magasin de preuves supprimé (la preuve porte son verbatim), mais le SURLIGNAGE, lui, reste un
// mécanisme de rendu à part entière — la maquette « ThemeCardNavy » souligne le mot repéré. Aucune
// ligne de logique n'a changé.

/** Fragment de texte-source, marqué ou non (surlignage des mots déclencheurs). */
export interface TextPart {
  text: string;
  marked: boolean;
}

/** Découpe `text` en fragments marqués/non marqués selon `terms` (insensible à la casse) — le
 * mécanisme de surlignage de la maquette. Sans terme : un seul fragment non marqué.
 *
 * Frontières de mot UNICODE-SAFE (pas `\b`, ASCII-only en JS — casserait sur les accents : « série »,
 * « déjà »). Lookarounds `(?<![\p{L}\p{N}])…(?![\p{L}\p{N}])` avec `giu`, même logique de frontière que
 * le détecteur (`detect.ts` — `isAlnum`/frontières de mot). Sans ça, un marqueur matchait un MORCEAU
 * de mot voisin (« série » surligné à l'intérieur de « sérieux ») — un terme qui n'a jamais déclenché
 * se présentait comme preuve (bug d'affichage, le moteur lui-même ne renvoie que les vraies surfaces).
 * Termes triés du plus long au plus court : à position égale, la regex retient le PREMIER de
 * l'alternation — trier évite qu'un terme court masque un terme long qui le contient. */
export function splitTriggerTerms(text: string, terms: readonly string[] | undefined): TextPart[] {
  if (terms === undefined || terms.length === 0) {
    return [{ text, marked: false }];
  }
  const escaped = [...terms]
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(${escaped.join('|')})(?![\\p{L}\\p{N}])`, 'giu');
  const parts: TextPart[] = [];
  let last = 0;
  let m = re.exec(text);
  while (m !== null) {
    if (m.index > last) {
      parts.push({ text: text.slice(last, m.index), marked: false });
    }
    parts.push({ text: m[0], marked: true });
    last = m.index + m[0].length;
    if (re.lastIndex === m.index) {
      re.lastIndex++;
    }
    m = re.exec(text);
  }
  if (last < text.length) {
    parts.push({ text: text.slice(last), marked: false });
  }
  return parts;
}
