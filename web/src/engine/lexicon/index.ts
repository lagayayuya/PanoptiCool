// Registre des lexiques CÂBLÉS (PANO-70 §2.1) — le périmètre progressif rendu mécanique :
// câbler un label = ajouter un module de données + une ligne ici. Le détecteur ne change pas.
//
// Passe 1 (PANO-71, décision C) : mental_health · politics · conflictual.
// Extension (passe suivante) : health_physical · sexuality · religion.

import { CONFLICTUAL_LEXICON } from './conflictual';
import { HEALTH_PHYSICAL_LEXICON } from './health-physical';
import { MENTAL_HEALTH_LEXICON } from './mental-health';
import { POLITICS_LEXICON } from './politics';
import { RELIGION_LEXICON } from './religion';
import { SEXUALITY_LEXICON } from './sexuality';
import type { LabelLexicon } from './types';

/** Les lexiques actifs, dans l'ordre d'émission des insights D1. */
export const WIRED_LEXICONS: readonly LabelLexicon[] = [
  MENTAL_HEALTH_LEXICON,
  POLITICS_LEXICON,
  CONFLICTUAL_LEXICON,
  HEALTH_PHYSICAL_LEXICON,
  SEXUALITY_LEXICON,
  RELIGION_LEXICON,
];
