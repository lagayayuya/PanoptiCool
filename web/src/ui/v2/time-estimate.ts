// Time-spent estimate, as a sentence — the STRONG finding of `ActivitySection.RhythmCard`
// (« ~X jours de ta vie »). DRAFT wording (PANO-45).
//
// WHY THIS SENTENCE IS NOT IN `engine/wording.ts`: it addresses the user in the
// 2nd person (« ta vie »), which the wording file forbids itself — its property (a) proscribes the
// « tu ». Its home is therefore the interface catalog (`ui/copy.ts`), which exists exactly for
// that prose; this module keeps only the COMPUTATION (24 h switch, singulars, agreements).

import { UI_TIME_ESTIMATE } from '../copy';

import { formatDecimal, formatInt } from '../format';

/**
 * Time-spent estimate (D) as a sentence (PANO-45 DRAFT). EXACT switch at 24 h (PANO-85
 * fix, point 2):
 *   - ≥ 24 h → « ~X jours de ta vie passé(s) cette année sur TikTok, soit ~Y h »;
 *   - < 24 h → « ~X heures de ta vie passée(s) cette année sur TikTok » (HOURS format, no « soit »).
 * Singular handled (~1 jour / ~1 heure) and participle agreement (jour → passé, heure → passée). « cette
 * année » ≈ the watching window (PANO-45 wording note).
 */
export function timeEstimateSentence(estimatedMinutes: number): string {
  const totalHours = estimatedMinutes / 60;
  if (estimatedMinutes >= 24 * 60) {
    // `formatDecimal` renders « 1 » and not « 1,0 » when the count comes out round — it is what the singular
    // just below tests to choose « jour » rather than « jours ».
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
