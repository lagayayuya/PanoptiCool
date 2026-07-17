// Estimation du temps passé, en phrase — le constat FORT de `ActivitySection.RhythmCard`
// (« ~X jours de ta vie »). Wording BROUILLON (PANO-45).
//
// POURQUOI CETTE PHRASE N'EST PAS DANS `engine/wording.ts` : elle s'adresse à l'utilisateur à la
// 2ᵉ personne (« ta vie »), ce que le fichier de wording s'interdit — sa propriété (a) proscrit le
// « tu ». C'est une chaîne de composant assumée, comme « ta journée type » ; la déplacer vers le
// wording casserait cette propriété, testée.

/** Groupe les milliers avec une fine espace insécable (convention FR) — pour les grands compteurs. */
function frInt(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/** Nombre de jours affiché : entier quand rond (« 1 », « 2 »), sinon une décimale à la virgule
 * (« 4,2 ») — évite « 1,0 jour » au singulier. */
function formatDays(days: number): string {
  const rounded = Math.round(days * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace('.', ',');
}

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
    const daysStr = formatDays(totalHours / 24);
    const oneDay = daysStr === '1';
    const dayWord = oneDay ? 'jour' : 'jours';
    const spent = oneDay ? 'passé' : 'passés';
    const hours = Math.round(totalHours);
    return `~${daysStr} ${dayWord} de ta vie ${spent} cette année sur TikTok, soit ~${frInt(hours)} h.`;
  }
  const hours = Math.round(totalHours);
  const oneHour = hours === 1;
  const hourWord = oneHour ? 'heure' : 'heures';
  const spent = oneHour ? 'passée' : 'passées';
  return `~${frInt(hours)} ${hourWord} de ta vie ${spent} cette année sur TikTok.`;
}
