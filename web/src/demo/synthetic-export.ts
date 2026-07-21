// Échantillon synthétique bundlé — persona démo (PANO R&D, refonte session « démo honnête »).
// Reconstruit en `TikTokExport` (via `validTikTokExport` + Comment/Searches/Watch History/Following/
// Like List peuplés) pour exercer le PRÉ-TRAITEMENT RÉEL (`ingestExportStreaming` + `computeInsights`),
// pas un raccourci qui saute le moteur : chaque thème affiché par la démo est ce que le moteur détecte
// VRAIMENT sur ces items (D1/D2, `engine/detect/detect.ts`), verrouillé par `synthetic-export.test.ts`.
//
// Aucun contenu de vrai export : persona 100 % inventée, zéro PII (CLAUDE.md). Deux variantes,
// MÊME persona et MÊMES chiffres agrégés (vues, likes, suivis, 14 commentaires, 24 recherches,
// rythme) : à volume égal, l'écart de sortie entre les deux mesure la LANGUE et rien d'autre.
//
// Les deux listes sont écrites comme des personnes, jamais comme des jeux de déclencheurs — ce que
// le détecteur en tire est une MESURE, prise après coup, et elle vit dans `synthetic-export.test.ts`
// (pipeline réel, D1 + D2). Aucun décompte de thèmes n'est annoncé ici : un en-tête qui prédit la
// sortie du moteur devient faux au premier lot de lexique, sans que rien ne le signale.

import { strToU8, zipSync } from 'fflate';
import { validTikTokExport } from '../engine/valid-export.fixture';
import type { Locale } from '../i18n/locales';

interface SyntheticItem {
  kind: 'comment' | 'search';
  text: string;
}

// --- Items FR (38 : 14 commentaires + 24 recherches) — ordre = ordre d'apparition, filler d'abord ---
// (le panneau « peu de données », `AnalysisPage.tsx`, tronque aux N PREMIERS items : les premiers
// restent neutres à dessein, les items qui déclenchent un thème arrivent après).
//
// Vérifié par `synthetic-export.test.ts` en faisant tourner `detectLabels` (D1 + D2 réels) sur EXACTEMENT
// ces textes : D1 → {mental_health, conflictual} ; D2 (après plancher PANO-75) → {chats (2 items),
// cinema_series (3 items : « spin off », « kubrick »/« cinéma », et le « netflix » du commentaire
// conflictual — un item PARTAGÉ entre les deux thèmes, cf. plus bas)}. Rien d'autre ne franchit le
// plancher (`sneakers`/`voitures`/`coiffure` effleurent 1 item chacun, sous le plancher de 2 — un effet
// de bord honnête du lexique réel, pas une fixture triée sur le volet).
const SYNTHETIC_ITEMS_FR: readonly SyntheticItem[] = [
  { kind: 'search', text: 'horaires ouverture pharmacie dimanche' },
  { kind: 'search', text: 'météo demain matin' },
  { kind: 'comment', text: 'enfin le week-end, j’ai trop hâte de dormir un peu plus' },
  { kind: 'search', text: 'prix billet train pas cher' },
  { kind: 'comment', text: 'le nouveau resto du quartier est sympa, faudra y retourner' },
  { kind: 'search', text: 'combien de temps cuire un œuf dur' },
  { kind: 'comment', text: 'il pleut encore aujourd’hui, marre de ce temps' },
  { kind: 'search', text: 'comment nettoyer des baskets blanches' },
  { kind: 'comment', text: 'petit tour au marché ce matin, plein de monde' },
  { kind: 'search', text: 'adresse mairie plus proche' },
  // --- chats (D2, plancher 2 items) ---
  { kind: 'comment', text: 'miaou' },
  { kind: 'comment', text: 'quand le mien était encore chaton il était pareil' },
  { kind: 'search', text: 'heure ouverture supermarché dimanche' },
  // --- cinema_series (D2) ---
  {
    kind: 'comment',
    text: 'on attend toujours le spin off..',
  },
  {
    kind: 'comment',
    text: 'si tu veux du vrai cinéma regarde un kubrick',
  },
  { kind: 'search', text: 'comment faire une capture écran' },
  // --- conflictual (D1, item-level) + cinema_series (3ᵉ item, « netflix ») : insulte émise, cible 2ᵉ
  // personne — le même commentaire nourrit les deux thèmes (magasin de preuves partagé, C5).

  {
    kind: 'comment',
    text: 'tu es juste stupide, les séries netflix ne valent pas le détour',
  },
  { kind: 'search', text: 'différence entre thym et origan' },
  { kind: 'comment', text: 'vivement les vacances, j’ai besoin de changer d’air' },
  { kind: 'search', text: 'comment se désinscrire d’une newsletter' },
  { kind: 'comment', text: 'j’ai enfin fini de ranger l’appart, ça fait du bien' },
  { kind: 'search', text: 'prix moyen loyer studio' },
  { kind: 'comment', text: 'merci pour les conseils, ça m’a bien aidé' },
  { kind: 'search', text: 'comment plier une chemise' },
  { kind: 'comment', text: 'content pour toi, bonne nouvelle !' },
  { kind: 'search', text: 'durée de vie moyenne ampoule led' },
  { kind: 'comment', text: 'petite balade au parc cet après-midi, il faisait beau' },
  { kind: 'search', text: 'comment réinitialiser un mot de passe' },
  { kind: 'search', text: 'numéro service client la poste' },
  // --- mental_health (D1, explicite) : recherche sur des témoignages de burnout ---
  { kind: 'search', text: 'témoignages burn out' },
  { kind: 'search', text: 'comment enlever une tache de gras' },
  { kind: 'search', text: 'distance paris marseille en voiture' },
  { kind: 'search', text: 'comment éteindre les notifications d’une appli' },
  { kind: 'search', text: 'prix moyen coupe de cheveux' },
  { kind: 'search', text: 'comment désembuer un pare-brise' },
  { kind: 'search', text: 'horaires bus ligne 12' },
  { kind: 'search', text: 'comment congeler du pain' },
  { kind: 'search', text: 'comment changer la pile d’une télécommande' },
];

// --- Items EN (38 : 14 commentaires + 24 recherches), MÊME agencement que FR ------------------------
// MÊME personne que la liste FR, transposée dans une vie anglophone (registre US) : le chat, le goût
// du cinéma, la fatigue de fond, un moment d'humeur, des corvées. Ce n'est PAS une traduction — les
// corvées d'un francophone traduites en anglais ne décrivent personne (« city hall address » n'est
// l'errand de personne aux États-Unis).
//
// Trois règles d'écriture reprises de la liste FR, parce que ce sont elles qui font tenir la persona :
//   1. un commentaire est la MOITIÉ d'une conversation — une réponse à une vidéo qu'on ne voit pas,
//      jamais un avis autoportant. « mine does this exact thing at 4am » se lit ; une critique
//      complète et ponctuée ne se lit pas comme un commentaire ;
//   2. le sensible passe par une RECHERCHE et à distance (« burnout recovery stories » — le sujet
//      des autres), tandis que la fatigue est diluée dans des commentaires qui ne diagnostiquent
//      rien. C'est le propos du produit : la déduction naît de l'accumulation banale, pas d'un aveu ;
//   3. plancher de bruit élevé et volontaire — l'écrasante majorité des items ne veut rien dire.
//
// MÊMES agrégats que FR (14/24) : à volume identique, un écart de sortie FR↔EN mesure la langue et
// rien d'autre. Ce que ces textes déclenchent RÉELLEMENT est mesuré par `synthetic-export.test.ts`,
// qui fait tourner le vrai détecteur — jamais annoncé ici.
const SYNTHETIC_ITEMS_EN: readonly SyntheticItem[] = [
  { kind: 'search', text: 'pharmacy hours sunday' },
  { kind: 'search', text: 'weather tomorrow morning' },
  { kind: 'comment', text: 'friday finally, sleeping in til noon and nobody can stop me' },
  { kind: 'search', text: 'cheapest way to book train tickets' },
  { kind: 'comment', text: 'the new place on the corner is actually good, going back friday' },
  { kind: 'search', text: 'how long to boil an egg' },
  { kind: 'comment', text: 'raining again, i give up' },
  { kind: 'search', text: 'how to clean white sneakers' },
  { kind: 'comment', text: 'went to the farmers market this morning, way too many people' },
  { kind: 'search', text: 'dmv appointment near me' },
  // --- chats ---
  { kind: 'comment', text: 'mine does this exact thing at 4am' },
  { kind: 'comment', text: 'he was like this as a kitten too and never grew out of it' },
  { kind: 'search', text: 'grocery store hours sunday' },
  // --- cinema_series ---
  { kind: 'comment', text: 'still waiting on the spin off..' },
  { kind: 'comment', text: 'if you want actual cinema go watch a kubrick' },
  { kind: 'search', text: 'how to take a screenshot on windows' },
  // --- humeur ciblée (2ᵉ personne) + « netflix » : un même item peut nourrir deux thèmes (C5) ---
  { kind: 'comment', text: 'nah you’re just stupid, netflix shows aren’t worth the time' },
  { kind: 'search', text: 'thyme vs oregano difference' },
  { kind: 'comment', text: 'vacation cannot come soon enough, i need out of here' },
  { kind: 'search', text: 'how to unsubscribe from emails' },
  { kind: 'comment', text: 'finally cleaned the whole apartment, feels like a different place' },
  { kind: 'search', text: 'average rent one bedroom' },
  { kind: 'comment', text: 'thanks for this, genuinely helped' },
  { kind: 'search', text: 'how to fold a fitted sheet' },
  { kind: 'comment', text: 'happy for you!! big news' },
  { kind: 'search', text: 'how long do led bulbs last' },
  { kind: 'comment', text: 'walked around the park all afternoon, actually nice out' },
  { kind: 'search', text: 'how to reset password' },
  { kind: 'search', text: 'usps customer service number' },
  // --- fatigue, à distance : le sujet est celui des autres ---
  { kind: 'search', text: 'burnout recovery stories' },
  { kind: 'search', text: 'how to get grease stain out' },
  { kind: 'search', text: 'chicago to detroit drive time' },
  { kind: 'search', text: 'turn off app notifications' },
  { kind: 'search', text: 'average haircut price' },
  { kind: 'search', text: 'how to defog windshield fast' },
  { kind: 'search', text: 'bus schedule route 12' },
  { kind: 'search', text: 'can you freeze bread' },
  { kind: 'search', text: 'how to change remote battery' },
];

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;

/** `YYYY-MM-DD HH:MM:SS` (UTC, contrat §1.1) depuis un epoch — jamais de fuseau machine. */
function fmtUtc(ms: number): string {
  const iso = new Date(ms).toISOString(); // 2026-07-16T10:20:30.000Z
  return `${iso.slice(0, 10)} ${iso.slice(11, 19)}`;
}

function fmtUtcSuffixed(ms: number): string {
  return `${fmtUtc(ms)} UTC`;
}

/** Minuit UTC du jour contenant `ms`. */
function dayFloor(ms: number): number {
  return Math.floor(ms / DAY_MS) * DAY_MS;
}

/** Comments/Searches : dates étalées sur les ~55 derniers jours avant `now`, dans l'ordre du tableau
 * (le plus ancien en premier — reflète un export où les items les plus récents ferment la liste). */
function withDates(
  items: readonly SyntheticItem[],
  now: number,
): (SyntheticItem & { ms: number })[] {
  const spanMs = 55 * DAY_MS;
  const stepMs = spanMs / items.length;
  return items.map((item, i) => ({ ...item, ms: now - spanMs + i * stepMs }));
}

/**
 * Rythme de visionnage (PANO-57/85, honnête cette fois : c'est `Watch History` réel qui nourrit le
 * graphe, pas un histogramme tapé à la main). UNE session/jour, biais nocturne (cycle d'heures à
 * majorité 23h–4h, la fenêtre « nuit » du produit — `activity-rhythm.ts`) :
 *   - 30 jours récents × 14 vidéos/jour = 420 (fenêtre 30 jours) ;
 *   - 335 jours plus anciens (31→365 j) totalisant 5680 (320 jours à 17, 15 jours à 16) ;
 *   - total = 6100 (fenêtre 12 mois, `videosWatched.last12Months`) ;
 *   - un écart de 16 s entre vidéos d'une même session (jamais deux sessions/jour → aucun risque de
 *     fusion inter-session, `SESSION_GAP_MS` = 5 min dans `activity-rhythm.ts`) donne une estimation
 *     d'environ 28-29 h de visionnage — calcul RÉEL fait par la règle, pas une valeur recopiée.
 */
const NIGHT_BIASED_HOUR_CYCLE = [23, 0, 1, 2, 22, 3, 20, 21, 14, 10, 19, 4];
const RECENT_DAYS = 30;
const RECENT_PER_DAY = 14; // 30 * 14 = 420
const OLDER_DAYS = 335;
const OLDER_BASE_PER_DAY = 16;
const OLDER_BONUS_DAYS = 320; // 320*17 + 15*16 = 5680
const INTRA_SESSION_GAP_MS = 16 * 1000;

function watchSessionsFor(now: number, days: number, perDay: (dayIndex: number) => number) {
  const sessions: { startMs: number; size: number }[] = [];
  for (let d = 0; d < days; d++) {
    const dayStart = dayFloor(now) - d * DAY_MS;
    const hour = NIGHT_BIASED_HOUR_CYCLE[d % NIGHT_BIASED_HOUR_CYCLE.length] ?? 0;
    const minute = (d * 7) % 60;
    sessions.push({ startMs: dayStart + hour * HOUR_MS + minute * MINUTE_MS, size: perDay(d) });
  }
  return sessions;
}

function buildWatchHistory(now: number): { Date: string; Link: string; Title: string }[] {
  const recent = watchSessionsFor(now, RECENT_DAYS, () => RECENT_PER_DAY);
  // Décalage de 31 jours pour ouvrir la fenêtre « ancienne » (30 jours récents, jamais recouverts).
  const older = watchSessionsFor(now - 31 * DAY_MS, OLDER_DAYS, (d) =>
    d < OLDER_BONUS_DAYS ? OLDER_BASE_PER_DAY + 1 : OLDER_BASE_PER_DAY,
  );
  const items: { Date: string; Link: string; Title: string }[] = [];
  let i = 0;
  for (const session of [...recent, ...older]) {
    for (let k = 0; k < session.size; k++) {
      items.push({
        Date: fmtUtc(session.startMs + k * INTRA_SESSION_GAP_MS),
        Link: `https://www.tiktokv.com/share/video/synthetic-${i}/`,
        Title: '',
      });
      i++;
    }
  }
  return items;
}

/** 300 comptes suivis synthétiques (R3, `comptes suivis`) — usernames inventés, zéro PII. */
function buildFollowing(now: number): { Date: string; UserName: string }[] {
  const count = 300;
  return Array.from({ length: count }, (_, i) => ({
    Date: fmtUtc(now - (count - i) * DAY_MS * 0.6),
    UserName: `compte_suivi_${String(i + 1).padStart(4, '0')}`,
  }));
}

/** 2700 likes synthétiques (R5, « likes, favoris et republications » — favoris/republications à 0
 * ici, le compte affiché est donc exactement 2700). */
function buildLikes(now: number): { date: string; link: string }[] {
  const count = 2700;
  return Array.from({ length: count }, (_, i) => ({
    date: fmtUtc(now - (count - i) * HOUR_MS * 3),
    link: `https://www.tiktokv.com/share/video/synthetic-like-${i}/`,
  }));
}

function buildComments(items: readonly (SyntheticItem & { ms: number })[]) {
  return items
    .filter((i) => i.kind === 'comment')
    .map((i) => ({
      date: fmtUtcSuffixed(i.ms),
      comment: i.text,
      photo: '',
      video: '',
      sticker: '',
      originalPostUrl: '',
      'original post link': '',
    }));
}

function buildSearches(items: readonly (SyntheticItem & { ms: number })[]) {
  return items
    .filter((i) => i.kind === 'search')
    .map((i) => ({ Date: fmtUtc(i.ms), SearchTerm: i.text }));
}

/**
 * Construit un `.zip` d'export TikTok synthétique in-memory (jamais écrit sur disque), pour une
 * langue donnée (items déjà dans la bonne langue).
 *
 * `maxItems` (optionnel, panneau de test des cas limites, `ui/v2/AnalysisPage.tsx`) : ne garde que les
 * N premiers items (commentaires + recherches confondus, ordre du tableau source) au lieu de la liste
 * complète. `now` (optionnel, testabilité) : horloge injectée, défaut = `Date.now()` — Watch
 * History/Following/Like List et les dates de commentaires/recherches sont TOUJOURS calculées relatives
 * à `now`, jamais des dates 2026 en dur : la démo reste correcte quelle que soit la date d'exécution.
 */
function buildZip(
  sourceItems: readonly SyntheticItem[],
  maxItems: number | undefined,
  now: number,
): Uint8Array {
  const base = structuredClone(validTikTokExport());
  const sliced = maxItems === undefined ? sourceItems : sourceItems.slice(0, Math.max(0, maxItems));
  const dated = withDates(sliced, now);

  const comments = buildComments(dated);
  const searches = buildSearches(dated);
  const following = buildFollowing(now);
  const likes = buildLikes(now);
  const watchHistory = buildWatchHistory(now);

  const merged = {
    ...base,
    Comment: { Comments: { App: 0, CommentsList: comments } },
    'Likes and Favorites': {
      ...base['Likes and Favorites'],
      'Like List': { App: 0, ItemFavoriteList: likes },
    },
    'Profile And Settings': {
      ...base['Profile And Settings'],
      Following: { App: 0, IsFastLane: false, Following: following },
    },
    'Your Activity': {
      ...base['Your Activity'],
      'Activity Summary': {
        ActivitySummaryMap: {
          note: '',
          videosCommentedOnSinceAccountRegistration: comments.length,
          videosSharedSinceAccountRegistration: 0,
          // ALL-TIME (vues jusqu'au bout depuis l'inscription) — chiffre cible de la démo.
          videosWatchedToTheEndSinceAccountRegistration: 50_000,
        },
      },
      Searches: { SearchList: searches },
      'Watch History': { VideoList: watchHistory },
    },
  };

  const json = JSON.stringify(merged);
  return zipSync({ 'user_data_tiktok.json': strToU8(json) });
}

/** Variante FR (celle branchée sur le bouton « Analyser les données test »). */
export function buildSyntheticExportZip(maxItems?: number, now: number = Date.now()): Uint8Array {
  return buildZip(SYNTHETIC_ITEMS_FR, maxItems, now);
}

/**
 * Variante EN — mêmes chiffres agrégés, même persona, textes en anglais. À volume et persona
 * identiques, ce qui manque en anglais se lit dans l'ÉCART avec la sortie FR
 * (`synthetic-export.test.ts`) : c'est sa première raison d'être, et elle ne change pas.
 */
export function buildSyntheticExportZipEn(maxItems?: number, now: number = Date.now()): Uint8Array {
  return buildZip(SYNTHETIC_ITEMS_EN, maxItems, now);
}

/**
 * La persona de la DÉMO, dans la langue de la page.
 *
 * ⚠ CE N'EST PAS UN CONFORT DE TRADUCTION. Les preuves affichées sont des VERBATIMS : la démo
 * dépliée montre le texte exact qui a déclenché chaque déduction, terme surligné compris. Servir la
 * persona française sous l'interface anglaise afficherait donc des commentaires FRANÇAIS comme
 * preuves — sur la page dont toute la fonction est de faire lire à la personne ce qui a été lu
 * d'elle. La langue de la démo n'est pas une étiquette, c'est la donnée elle-même.
 */
export function buildDemoExportZip(locale: Locale, maxItems?: number): Uint8Array {
  return locale === 'en' ? buildSyntheticExportZipEn(maxItems) : buildSyntheticExportZip(maxItems);
}
