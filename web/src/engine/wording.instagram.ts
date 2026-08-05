// INSTAGRAM ENGINE wording — THE SELECTOR. No prose lives here.
//
// Same three-file arrangement as `wording.ts`, for the same reason: what the machine dares to say
// must be re-readable in one pass, one language at a time (`CLAUDE.md`). A separate pair from the
// TikTok one because the two connectors say different things about different data — merging them
// would make each review twice as long and half as attentive.
//
// ⚠ PARITY IS HELD BY THE COMPILER, in both directions, ON ONE CONDITION THAT IS NOT VISIBLE ON
// READING: the tables of `wording.instagram.fr.ts` must stay UNANNOTATED LITERALS. Annotating one
// `Record<string, string>` erases its keys from the type, and an EMPTY English table would then
// compile — measured on the TikTok side, and the sole reason its parity test exists. The same
// witness covers this pair.

import { DEFAULT_LOCALE, type Locale } from '../i18n/locales';
import { EN } from './wording.instagram.en';
import { FR } from './wording.instagram.fr';

/** The shape of the bundle — derived from French, which is the oracle. */
export type InstagramWording = typeof FR;

const BUNDLES: Record<Locale, InstagramWording> = { fr: FR, en: EN };

/**
 * The bundle for a locale.
 *
 * The `??` is not defensive paranoia: `Locale` is a closed union, but the language crosses the
 * worker boundary through `postMessage`, where the type does not survive. An unknown language
 * returns French rather than crashing — same arbitration as `wording.ts` and `i18n/current.ts`.
 */
export function instagramWording(locale: Locale): InstagramWording {
  return BUNDLES[locale] ?? BUNDLES[DEFAULT_LOCALE];
}
