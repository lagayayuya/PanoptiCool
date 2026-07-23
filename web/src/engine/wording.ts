// ENGINE wording — THE SELECTOR. No prose lives here.
//
// THREE FILES, ONE SCOPE (structure ratified by yuya, i18n-EN batch):
//   - `wording.fr.ts` — the French prose. SHAPE ORACLE: the bundle type is derived from it.
//   - `wording.en.ts` — the English prose, annotated `WordingBundle`.
//   - THIS FILE — the `(locale, key) → text` resolution, and nothing else.
//
// CLAUDE.md's obligation is that one can re-read in one pass EVERYTHING the machine dares to deduce.
// An interleaved `{fr, en}` table per entry would be re-read twice at half — the English reviewer
// would skip every other line, and the French they do not read is precisely what they should be
// comparing against. One file per language keeps the property that matters, and doubles it.
//
// ─── PARITY IS HELD BY THE COMPILER, IN BOTH DIRECTIONS ─────────────────────────────────────────
// `WordingBundle = typeof FR`; `wording.en.ts` annotates itself with it. An entry added in French
// and forgotten in English does not compile; nor does an English key that does not exist in French.
// This is what makes this batch safe to run while the lexicon moves elsewhere: a reading ratified
// three weeks from now CANNOT ship untranslated.
//
// ⚠ THE CONDITION THAT HOLDS THIS GUARANTEE IS NOT VISIBLE ON READING. It rests on the fact that
// the tables of `wording.fr.ts` are UNANNOTATED LITERALS. Annotating them
// `Readonly<Record<string, string>>` — the natural reflex, and what the ex-monolingual file did —
// erases the keys from the type: an EMPTY English table would then compile without an error
// (measured). `wording-parity.test.ts` pins the guarantee so it cannot fall silently; that is its
// sole reason to exist.
//
// WHY A `locale` PARAMETER AND NOT AN AMBIENT LANGUAGE. `ui/copy.ts` reads the page's language once,
// at module load (`<html lang>`, cf. `i18n/current.ts`). The engine CANNOT: it passes the 2nd
// `tsc -p src/engine/tsconfig.json` pass, without DOM, and so has no `document` to read. The
// asymmetry between the two scopes is one of PRINCIPLE, not convenience.

import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';
import type { SensitiveLabel } from './lexicon/types';
import { EN } from './wording.en';
import { FR } from './wording.fr';

/** The shape of a wording bundle — derived from French, which is the oracle. */
export type WordingBundle = typeof FR;

const BUNDLES: Record<Locale, WordingBundle> = { fr: FR, en: EN };

function bundle(locale: Locale): WordingBundle {
  // `?? BUNDLES[DEFAULT_LOCALE]` is not defensive paranoia: `Locale` is a closed union, but the
  // language crosses the worker boundary via `postMessage`, where the type does not survive. An
  // unknown language returns French rather than a crash — same arbitration as `i18n/current.ts`.
  return BUNDLES[locale] ?? BUNDLES[DEFAULT_LOCALE];
}

/** VISIBLE fallback for an unrouted lexicon key — never a silent empty string, so that a
 * lexicon/wording drift jumps to the eye rather than rendering a blank. */
export const MISSING_WORDING_PREFIX = '[gabarit manquant : ';

function resolve(table: Readonly<Record<string, string>>, key: string): string {
  return table[key] ?? `${MISSING_WORDING_PREFIX}${key}]`;
}

// --- CLAIMS ------------------------------------------------------------------------------------
// The claim is the ONLY line rendered (PANO-56): it is the one the doctrine guardrail "never a
// verdict on the person" bears on (property (c) of `wording.test.ts`). SPARE style (yuya's
// decision): a SHORT PHRASE with no explicit subject — the counts live in the tiles.

export function opacitySemanticWallClaim(locale: Locale): string {
  return bundle(locale).opacitySemanticWallClaim();
}

export function opacitySemanticWallExplainer(locale: Locale): string {
  return bundle(locale).opacitySemanticWallExplainer();
}

export function d1ConflictualNamedClaim(locale: Locale): string {
  return bundle(locale).d1ConflictualNamedClaim();
}

export function d2InterestClaim(locale: Locale, signalCount: number): string {
  return bundle(locale).d2InterestClaim(signalCount);
}

// --- RESOLVERS ---------------------------------------------------------------------------------

/** Short name of the topic of a sensitive signal. */
export function sensitiveTopicName(locale: Locale, label: SensitiveLabel): string {
  return bundle(locale).sensitiveTopicName[label];
}

/** Text of a reading, from the key carried by the sensitive lexicon. */
export function readingText(locale: Locale, key: string): string {
  return resolve(bundle(locale).readings, key);
}

/**
 * The DECLARED reading keys — so the net can verify the OTHER direction of coverage: that no
 * ratified text stays wired to nothing. Exposes the keys, never the texts.
 *
 * Returned from FRENCH, and that is correct BECAUSE parity is held by the compiler: both bundles
 * carry the same set of keys by construction, so covering one covers the other. This reasoning has
 * an invisible link — if parity fell, this would become false silently. That is exactly what
 * `wording-parity.test.ts` pins.
 */
export function readingKeys(): readonly string[] {
  return Object.keys(FR.readings);
}

export function hasReading(key: string): boolean {
  return key in FR.readings;
}

/** Text of a theme's name, from the key carried by the interest lexicon. */
export function themeLabelText(locale: Locale, key: string): string {
  return resolve(bundle(locale).themeLabels, key);
}

/** Routed label keys — for the D2 coverage test. See `readingKeys` on the FR. */
export function hasThemeLabel(key: string): boolean {
  return key in FR.themeLabels;
}

/** Text of a usage, from the key carried by the interest lexicon. */
export function usageText(locale: Locale, key: string): string {
  return resolve(bundle(locale).usages, key);
}

/** Routed usage keys — for the D2 coverage test. See `readingKeys` on the FR. */
export function hasUsage(key: string): boolean {
  return key in FR.usages;
}

/** Routed actor keys — for the D2 coverage test. See `readingKeys` on the FR.
 *
 * ⚠ EXISTS BECAUSE AN ASSERTION WAS LYING. The D2 net checked an actor's routing by requiring
 * `actorLabel(k) !== k` — "a real label, not the key". In French the two coincided; in English,
 * `advertiser` translates to `advertiser`, and the assertion failed on a table that was nonetheless
 * perfectly routed. It therefore checked what it REACHED (the text differs from the key), not what
 * it ASSERTED (the key is routed) — the two only diverged at the first language where a word
 * translates to itself. */
export function hasActorLabel(actor: string): boolean {
  return actor in FR.actorLabels;
}

/** An actor's label; falls back to the raw key if unknown (behavior kept from `actorLabel`). */
export function actorLabel(locale: Locale, actor: string): string {
  const labels: Readonly<Record<string, string>> = bundle(locale).actorLabels;
  return labels[actor] ?? actor;
}
