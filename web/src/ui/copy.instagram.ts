// INSTAGRAM INTERFACE copy — THE SELECTOR. No prose lives here.
//
// Same three-file arrangement as `copy.ts`, and it resolves the language the same way: at module
// evaluation, from `<html lang>`, because these components are `client:only` islands and the page's
// language is constant for its lifetime. What that buys is that no call site carries a locale —
// `UI_IG_RAIL.title` stays `UI_IG_RAIL.title` in every component that reads it.
//
// ⚠ A SEPARATE PAIR FROM `copy.{fr,en}.ts`, not a section of it. CLAUDE.md's rule is that a
// ratifiable perimeter is worth what a human can re-read in ONE PASS: the TikTok copy is already
// ~930 lines, and folding the Instagram shell and its six modules in would double it. A reviewer who
// skims has ratified nothing.
//
// The two pairs never merge, and neither does this one with `wording.instagram.*` — see that file's
// header on why the second person makes them opposite.

import { currentLocale } from '../i18n/current';
import { EN_INSTAGRAM } from './copy.instagram.en';
import { FR_INSTAGRAM } from './copy.instagram.fr';

/** The shape of the Instagram catalog — derived from the French, which is the oracle. */
export type InstagramCopy = typeof FR_INSTAGRAM;

const B: InstagramCopy = currentLocale() === 'en' ? EN_INSTAGRAM : FR_INSTAGRAM;

export const UI_IG_SHELL = B.UI_IG_SHELL;
export const UI_IG_RAIL = B.UI_IG_RAIL;
export const UI_IG_IDENTITY = B.UI_IG_IDENTITY;
export const UI_IG_MESSAGES = B.UI_IG_MESSAGES;
export const UI_IG_ANALYSE = B.UI_IG_ANALYSE;
export const UI_IG_CONTROLS = B.UI_IG_CONTROLS;
export const UI_IG_MAP = B.UI_IG_MAP;
export const UI_IG_SPACE = B.UI_IG_SPACE;
export const UI_IG_UNIVERSE = B.UI_IG_UNIVERSE;
export const UI_IG_QUERY = B.UI_IG_QUERY;
export const UI_IG_MAP_DETAIL = B.UI_IG_MAP_DETAIL;
export const UI_IG_READER = B.UI_IG_READER;
