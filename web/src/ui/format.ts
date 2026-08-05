// NUMBER formatting — THE only place that decides on a separator, in the page's language.
//
// WHY THIS FILE EXISTS. The thousands grouping was written BY HAND, twice, with the
// SAME regex — and two DIFFERENT separators: `ActivitySection` placed an ASCII space,
// `time-estimate` a narrow no-break space (U+202F). The golden showed it without anyone reading it:
// « 50 000 » was rendered there with the ASCII space, and not a single U+202F appeared in it. The divergence was
// LATENT — the time estimate never exceeds 1,000 h in the persona, so its separator
// was never rendered. A duplication does not merely repeat itself: it starts to lie, and
// the witness does not see it.
//
// FR typography distinguishes TWO spaces, and it is subtler than what one writes from memory:
// a NARROW no-break space (U+202F) for thousands, but an ORDINARY no-break space (U+00A0) before « % ».
// The hand-written code placed neither. `Intl.NumberFormat` follows CLDR and places both in the
// right spot — the main reason not to write them oneself anymore.
//
// ─── THIS FILE WAS PINNED TO `fr-FR`, AND THE NAMES SAID SO (i18n-EN batch) ─────────────────────
// The six formatters built `Intl.NumberFormat('fr-FR')` HARD-CODED. In English, that would have
// rendered — measured, not assumed:
//   « 50 000 » with a U+202F where English writes « 50,000» ;
//   « 42 % » with a U+00A0 where English writes « 42% » ;
//   « 0 comment » IN THE SINGULAR, because French puts zero in the singular and English in the plural.
// The `fr` prefix of the names (`frInt`, `frPercent`…) would then have become a lie — hence the
// rename, which is not cosmetic: a name that lies costs more than a mechanical rename.
//
// THE LANGUAGE RESOLVES ONCE, AT MODULE LOAD, as in `ui/copy.ts` and for the same
// reason: it is constant for the life of the page (`<html lang>`, cf. `i18n/current.ts`), and
// passing it as a parameter would have rewritten 57 call sites without teaching anyone anything.
//
// ⚠ CONSEQUENCE FOR THE TESTS, and it also holds for `ui/copy.ts`: rendering English in Node
// requires setting `document.documentElement.lang` BEFORE the module's import, so `vi.resetModules()`
// + a dynamic import. Forgetting ONE of the two files would render an English tree with French
// numbers — a defect invisible to the eye, that a golden would freeze without anyone reading it.
//
// ⚠ WHAT THE COUPLING TO `Intl` COSTS, and what must stay visible: the output depends on the version
// of ICU bundled by Node. fr-FR only emits U+202F from ICU 72 (Node ≥ 18.1); before, it was
// U+00A0. The render golden therefore freezes, indirectly, an ICU version. If CI turns red on
// an invisible separator, it is HERE one must look — the fallback is a hand-written helper
// that places U+202F without going through `Intl`, deterministic and without coupling.
//
// NOT HERE: CSS values (`EyeLogo` writes `${ang.toFixed(1)}deg`). CSS requires the decimal
// point — formatting it "the French way" would produce an invalid declaration.

import { currentLocale } from '../i18n/current';
import type { Locale } from '../i18n/locales';

/** The full BCP 47 tag that `Intl` expects. `<html lang>` carries « fr »/« en »; CLDR wants the REGION
 *  to decide the separators (`en-US` groups with the comma, `en-IN` by lakhs). Aligned on
 *  `OG_LOCALE`, which already declares `en_US` for this site. */
const INTL_TAG: Record<Locale, string> = { fr: 'fr-FR', en: 'en-US' };

/**
 * ⚠ EXPORTED, because dates need the same tag and were not getting it. Two Instagram pieces called
 * `toLocaleDateString(currentLocale())` with the BARE « fr »/« en » — which drops the region the
 * comment above says CLDR needs, and leaves the runtime to pick one. One home for the tag, so a date
 * and a number in the same sentence cannot come from two different locales.
 */
export const TAG = INTL_TAG[currentLocale()];

const INT = new Intl.NumberFormat(TAG, { maximumFractionDigits: 0 });
const ONE_DECIMAL = new Intl.NumberFormat(TAG, { maximumFractionDigits: 1 });
const PERCENT = new Intl.NumberFormat(TAG, { style: 'percent', maximumFractionDigits: 0 });

/** Integer grouped by thousands (« 50 000 » / « 50,000 »). Rounded, as the counters were. */
export function formatInt(n: number): string {
  return INT.format(Math.round(n));
}

/**
 * Number with AT MOST one decimal — an integer when it comes out round.
 * The "at most" is the point: it avoids « 1,0 jour » where the singular expects « 1 jour »
 * (`Number.isInteger` + `toFixed(1)` did this work by hand, up to the decimal point).
 */
export function formatDecimal(n: number): string {
  return ONE_DECIMAL.format(n);
}

const FIXED_ONE_DECIMAL = new Intl.NumberFormat(TAG, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/**
 * Number with EXACTLY one decimal — « 2,0 » and not « 2 ».
 *
 * ⚠ DO NOT CONFUSE WITH `formatDecimal`, of which it is the exact opposite, and both are intended:
 *   - `formatDecimal` drops the null decimal, because « 1 jour » reads and « 1,0 jour » does not;
 *   - this one KEEPS it, for a COLUMN of comparable values (the model sizes) where « 2 Go »
 *     in the middle of « 2,2 / 1,9 / 1,5 » breaks the alignment and suggests a different precision.
 * The rule is therefore not "one decimal" but "one decimal NEXT TO WHAT".
 */
export function formatFixedDecimal(n: number): string {
  return FIXED_ONE_DECIMAL.format(n);
}

/**
 * Percentage from a RATIO (0–1). An ordinary no-break space (U+00A0) before « % » in French,
 * nothing at all in English — CLDR decides, not this file.
 * ⚠ Takes a ratio, not a 0–100 value: it is `Intl`'s convention, and respecting it avoids
 * the factor-100 error that a « percent(n: number) » signature invites.
 */
export function formatPercent(ratio: number): string {
  return PERCENT.format(ratio);
}

const PLURAL = new Intl.PluralRules(TAG);

/**
 * Number agreement — ⚠ FRENCH PUTS 0 IN THE SINGULAR (« 0 commentaire »), ENGLISH IN THE PLURAL
 * (« 0 comments »). This is exactly the reason to use `Intl.PluralRules` rather than a hand-written
 * `n > 1`: the rule is carried by CLDR, not by the memory of whoever writes the line — and
 * it CHANGES from one language to another, on the case nobody tests.
 *
 * Replaces the « commentaire(s) » dodges — a parenthesis is not an agreement, it is the admission of
 * not having made it, and it reads aloud as badly as it is written.
 */
export function plural(n: number, one: string, many: string): string {
  return PLURAL.select(n) === 'one' ? one : many;
}
