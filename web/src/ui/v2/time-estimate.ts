// Estimation du temps passé, en phrase — le constat FORT de `ActivitySection.RhythmCard`
// (« ~X jours de ta vie »). Wording BROUILLON (PANO-45).
//
// POURQUOI CETTE PHRASE N'EST PAS DANS `engine/wording.ts` : elle s'adresse à l'utilisateur à la
// 2ᵉ personne (« ta vie »), ce que le fichier de wording s'interdit — sa propriété (a) proscrit le
// « tu ». Sa maison est donc le catalogue d'interface (`ui/copy.ts`), qui existe exactement pour
// cette prose-là ; ce module n'en garde que le CALCUL (bascule 24 h, singuliers, accords).

import { UI_TIME_ESTIMATE } from '../copy';

import { formatDecimal, formatInt } from '../format';

/**
 * Estimation du temps passé (D) en phrase (BROUILLON PANO-45). Bascule EXACTE à 24 h (correction
 * PANO-85, point 2) :
 *   - ≥ 24 h → « ~X jours de ta vie passé(s) cette année sur TikTok, soit ~Y h » ;
 *   - < 24 h → « ~X heures de ta vie passée(s) cette année sur TikTok » (format HEURES, pas de « soit »).
 * Singulier géré (~1 jour / ~1 heure) et accord du participe (jour → passé, heure → passée). « cette
 * année » ≈ la fenêtre de visionnage (note de wording PANO-45).
 */
export function timeEstimateSentence(estimatedMinutes: number): string {
  const totalHours = estimatedMinutes / 60;
  if (estimatedMinutes >= 24 * 60) {
    // `formatDecimal` rend « 1 » et non « 1,0 » quand le compte tombe rond — c'est ce que le singulier
    // juste en dessous teste pour choisir « jour » plutôt que « jours ».
    const daysStr = formatDecimal(totalHours / 24);
    const oneDay = daysStr === '1';
    return UI_TIME_ESTIMATE.days(
      daysStr,
      oneDay ? UI_TIME_ESTIMATE.dayOne : UI_TIME_ESTIMATE.dayMany,
      oneDay ? UI_TIME_ESTIMATE.daySpentOne : UI_TIME_ESTIMATE.daySpentMany,
      formatInt(Math.round(totalHours)),
    );
  }
  const hours = Math.round(totalHours);
  const oneHour = hours === 1;
  return UI_TIME_ESTIMATE.hours(
    formatInt(hours),
    oneHour ? UI_TIME_ESTIMATE.hourOne : UI_TIME_ESTIMATE.hourMany,
    oneHour ? UI_TIME_ESTIMATE.hourSpentOne : UI_TIME_ESTIMATE.hourSpentMany,
  );
}
