// Registry of WIRED lexicons (PANO-70 §2.1) — the progressive scope made mechanical:
// wiring a label = adding a data module + one line here. The detector does not change.
//
// Pass 1 (PANO-71, decision C): mental_health · politics · conflictual.
// Extension (next pass): health_physical · sexuality · religion.

import { CONFLICTUAL_LEXICON } from './conflictual';
import { HEALTH_PHYSICAL_LEXICON } from './health-physical';
import { MENTAL_HEALTH_LEXICON } from './mental-health';
import { POLITICS_LEXICON } from './politics';
import { RELIGION_LEXICON } from './religion';
import { SEXUALITY_LEXICON } from './sexuality';
import type { LabelLexicon } from './types';

/** The active lexicons, in the order the D1 insights are emitted. */
export const WIRED_LEXICONS: readonly LabelLexicon[] = [
  MENTAL_HEALTH_LEXICON,
  POLITICS_LEXICON,
  CONFLICTUAL_LEXICON,
  HEALTH_PHYSICAL_LEXICON,
  SEXUALITY_LEXICON,
  RELIGION_LEXICON,
];
