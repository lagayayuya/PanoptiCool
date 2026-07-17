// Wording FR — LE fichier unique où vit la prose (Refonte A, lot A2).
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ WORDING PROVISOIRE — À RELIRE PAR yuya.                                                      │
// │ Premier jet volontairement brouillon : le ton n'est PAS validé. Seules les PROPRIÉTÉS de   │
// │ cadrage sont tenues (cf. wording.test.ts) — pas la qualité rédactionnelle.                 │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
//
// CE QUI CHANGE AU LOT A2 (ex-`ui/templates.ts`). Les entrées étaient DÉJÀ des fonctions, mais
// atteintes par une chaîne (`CATALOG[ref.templateId]`) : un id absent ou mal tapé rendait
// « [gabarit manquant] », et un param absent un « ? » — au RUNTIME, en silence. Chaque claim est
// désormais un export NOMMÉ et TYPÉ : l'appelant l'importe, donc une disparition ou une faute de
// frappe est une erreur de COMPILATION, et `signalCount` est un `number` exigé par la signature.
// `TemplateRef`/`templateId`/`CATALOG`/`renderTemplate`/allowlists sont retirés avec cette bascule.
// Les CHAÎNES elles-mêmes sont reprises VERBATIM de `templates.ts` : A2 déplace la prose, ne la
// réécrit pas (le golden de rendu le prouve à l'octet).
//
// POURQUOI CE FICHIER VIT DANS `engine/`. Le moteur émet désormais du TEXTE (`Analysis` porte
// `claim`/`label`, cf. `analysis.ts`) : c'est la bascule actée par ADR-0004, qui lève le « le moteur
// n'émet pas de prose » du contrat d'origine. L'UI cesse en retour d'importer le moteur (lot A3). Le
// fichier reste PUR (aucun DOM) — il passe la 2ᵉ passe `tsc -p src/engine/tsconfig.json`.
//
// POURQUOI DEUX FORMES ICI (décision A2, à ne pas lire comme une inconséquence) :
//   - les CLAIMS sont choisis sur des unions FERMÉES (D1 : `SensitiveLabel` × étage ; D2 : une
//     paire générique ; opacity : nommé) → export nommé, exhaustivité tenue par le COMPILATEUR ;
//   - les LIBELLÉS DE THÈME, USAGES, LECTURES et ACTEURS sont choisis sur des clés OUVERTES portées
//     par les lexiques (`InterestLexicon.themeLabel: string`, `readingTemplateIds: string[]`).
//     `lexicon/` est INTOUCHABLE et l'obligation « wording ratifiable en UN fichier » impose que ces
//     textes vivent ICI, pas dans les 57 modules de lexique — donc le lexique garde sa clé et ce
//     fichier la résout. L'exhaustivité y est tenue par TEST (`d1/d2-wording-coverage.test.ts`), son
//     plafond réel : elle exigerait sinon de retyper le lexique. Ce n'est PAS le routage tué par A2
//     (l'UI ne résout plus rien, `Analysis` porte le texte) : c'est une résolution INTERNE au moteur,
//     d'une donnée de lexique vers son texte.

import type { SensitiveLabel } from './lexicon/types';

/** Repli VISIBLE d'une clé de lexique non routée — jamais une chaîne vide silencieuse, pour qu'une
 * dérive lexique/wording saute aux yeux plutôt que de rendre un blanc. */
export const MISSING_WORDING_PREFIX = '[gabarit manquant : ';

function resolve(table: Readonly<Record<string, string>>, key: string): string {
  return table[key] ?? `${MISSING_WORDING_PREFIX}${key}]`;
}

// --- CLAIMS : exports nommés, exhaustivité tenue par le compilateur --------------------------
// Le claim est la SEULE ligne rendue (PANO-56) : c'est sur lui que porte le garde-fou de doctrine
// « jamais de verdict sur la personne » (propriété (c) de `wording.test.ts`). Style ÉPURÉ (PANO-56,
// décision yuya) : un SYNTAGME COURT sans sujet explicite — les comptes vivent dans les tuiles, pas
// répétés dans la phrase.

// --- opacity semantic-wall -------------------------------------------------------------------
// Sujet = PanoptiCool (pas « vos données ») : le « vous » reste réservé au header (PANO-54), seul
// endroit autorisé — cf. propriété (a) de wording.test.ts, qui balaie TOUT ce fichier.
export function opacitySemanticWallClaim(): string {
  return `PanoptiCool ne peut analyser qu'une fraction des données de cet export.`;
}

/** Brouillon (PANO-45, porte humaine) — accompagne le camembert (PANO-57) : explicite ce que le
 * ratio SIGNIFIE, pas seulement le chiffre déjà dans la légende. */
export function opacitySemanticWallExplainer(): string {
  return `L'export ne rend visible que la partie émergée de l'iceberg. Le reste n'est accessible que pour TikTok et ses partenaires.`;
}

// --- D1 détecteur de sujets sensibles (PANO-71/72) — wording BROUILLON, ratification PANO-45 ---
// Deux étages par label (B1) : `named` (terme écrit → tag nommé) / `broad` (topical répété → tag
// large). `conflictual` : nommé seulement (B5).
export function d1MentalHealthNamedClaim(): string {
  return `Terme de santé mentale écrit en toutes lettres, repéré dans des commentaires.`;
}
export function d1MentalHealthBroadClaim(): string {
  return `Signal indirect associable à la santé mentale, répété dans les commentaires.`;
}
export function d1PoliticsNamedClaim(): string {
  return `Positionnement politique écrit en toutes lettres, repéré dans des commentaires.`;
}
export function d1PoliticsBroadClaim(): string {
  return `Signal indirect d'intérêt politique, répété dans les commentaires.`;
}
export function d1ConflictualNamedClaim(): string {
  return `Propos agressif adressé à un autre utilisateur, repéré dans des commentaires.`;
}
export function d1HealthPhysicalNamedClaim(): string {
  return `Condition de santé physique nommée, repérée dans des commentaires.`;
}
export function d1HealthPhysicalBroadClaim(): string {
  return `Signal indirect associable à un enjeu de santé physique, répété dans les commentaires.`;
}
export function d1SexualityNamedClaim(): string {
  return `Orientation ou identité déclarée, repérée dans des commentaires.`;
}
export function d1SexualityBroadClaim(): string {
  return `Signal indirect associable à une orientation ou une communauté, repéré dans des commentaires.`;
}
export function d1ReligionNamedClaim(): string {
  return `Appartenance ou pratique religieuse déclarée, repérée dans des commentaires.`;
}
export function d1ReligionBroadClaim(): string {
  return `Signal indirect associable à un sujet religieux, répété dans les commentaires.`;
}

// --- D2 détecteur d'intérêts (PANO-75) -------------------------------------------------------
/** UNE fonction générique (un intérêt se cadre pareil quel que soit le thème ; le NOM du thème vit
 * dans le libellé de thème, pas dans le claim). `signalCount` est désormais un `number` EXIGÉ par la
 * signature — l'ancien `p(q, 'signalCount')` rendait « ? » si le param manquait, en silence. */
export function d2InterestClaim(signalCount: number): string {
  return `Centre d'intérêt déduit de ${signalCount} commentaires sur le même thème.`;
}

// --- NOM COURT d'un sujet sensible (titre de `SignalCardNavy`) --------------------------------
/**
 * Mot court par label sensible — titre de la carte d'un signal, à la place de la phrase-claim (elle
 * créait une dissonance avec les cartes de thème ; décision yuya, refonte 2026-07-15).
 *
 * Vient de `SENSITIVE_LABEL_WORD` (ex-`ThemeCardNavy.tsx`) : c'est de la PROSE, elle rejoint donc le
 * fichier unique. Elle était atteinte en INVERSANT l'allowlist `D1_TEMPLATE_IDS` (templateId de claim
 * → label) — inversion impossible dès lors que le claim est un texte, et de toute façon fragile.
 * D1 émet désormais ce nom directement (`Signal.label`). `Record<SensitiveLabel, string>` : union
 * FERMÉE, donc exhaustivité tenue par le COMPILATEUR — un label béni sans nom ne compile pas.
 */
const SENSITIVE_TOPIC_NAME: Record<SensitiveLabel, string> = {
  mental_health: 'Santé mentale',
  politics: 'Politique',
  conflictual: 'Conflictuel',
  health_physical: 'Santé physique',
  sexuality: 'Sexualité',
  religion: 'Religion',
};

/** Nom court du sujet d'un signal sensible. */
export function sensitiveTopicName(label: SensitiveLabel): string {
  return SENSITIVE_TOPIC_NAME[label];
}

// --- LECTURES (éventail §5) : clé de lexique → texte -------------------------------------------
// Fragments courts, NON soumis à la propriété (c) : « un vécu personnel » n'est pas une phrase
// assertive. Clés portées par `LabelLexicon.readingTemplateIds` (lexique intouchable).
const READINGS: Readonly<Record<string, string>> = {
  'sensitive.mental-health.reading.lived': 'vécu personnel',
  'sensitive.mental-health.reading.relative': 'préoccupation pour un proche',
  'sensitive.mental-health.reading.curiosity': 'simple curiosité',
  'sensitive.politics.reading.engaged': 'engagement politique sincère',
  'sensitive.politics.reading.irony': 'ironie ou provocation',
  'sensitive.politics.reading.partisan': 'position partisane tranchée',
  'sensitive.politics.reading.mockery': 'moquerie ciblée',
  'sensitive.politics.reading.opinion': 'avis personnel',
  'sensitive.politics.reading.watch': 'curiosité / veille',
  'sensitive.health-physical.reading.lived': 'vécu personnel',
  'sensitive.health-physical.reading.relative': 'préoccupation pour un proche',
  'sensitive.health-physical.reading.curiosity': 'curiosité',
  'sensitive.sexuality.reading.lived': 'vécu personnel',
  'sensitive.sexuality.reading.ally': 'proximité / allié',
  'sensitive.sexuality.reading.curiosity': 'curiosité',
  'sensitive.religion.reading.practice': 'pratique / appartenance',
  'sensitive.religion.reading.opinion': 'avis personnel',
  'sensitive.religion.reading.curiosity': 'curiosité / intérêt',
};

/** Texte d'une lecture, depuis la clé portée par le lexique sensible. */
export function readingText(key: string): string {
  return resolve(READINGS, key);
}

/** Clés de lecture routées — permet au test de couverture D1 de balayer sans exposer la table. */
export function hasReading(key: string): boolean {
  return key in READINGS;
}

// --- LIBELLÉS DE THÈME : clé de lexique → texte -----------------------------------------------
// Clés portées par `InterestLexicon.themeLabel` (lexique intouchable). Libellés courts, brouillon.
const THEME_LABELS: Readonly<Record<string, string>> = {
  'theme.cuisine.label': 'Cuisine',
  'theme.engagement.label': 'Engagement',
  'theme.mental-health.label': 'Santé mentale',
  'theme.politics.label': 'Politique',
  'theme.conflictual.label': 'Conflictuel',
  // Thème-graine D2 (PANO-75).
  'theme.gaming.label': 'Jeux vidéo',
  // Thèmes D2 lot 1 (PANO-76).
  'theme.muscu.label': 'Musculation',
  'theme.running.label': 'Running',
  'theme.football.label': 'Football',
  'theme.ia.label': 'Intelligence artificielle',
  'theme.crypto.label': 'Crypto',
  'theme.maquillage.label': 'Maquillage',
  'theme.skincare.label': 'Skincare',
  'theme.sneakers.label': 'Sneakers',
  'theme.kpop.label': 'K-pop',
  'theme.manga-anime.label': 'Manga & anime',
  // Thèmes D2 lot 2 (PANO-77). `theme.fitness.label` corrige l'ancien libellé « Musculation »
  // (reliquat graine) : fitness/cross-training est un thème DISTINCT de muscu.
  'theme.mode.label': 'Mode',
  'theme.cinema-series.label': 'Cinéma & séries',
  'theme.chiens.label': 'Chiens',
  'theme.chats.label': 'Chats',
  'theme.voyage.label': 'Voyage',
  'theme.voitures.label': 'Voitures & tuning',
  'theme.rap.label': 'Rap / hip-hop',
  'theme.photographie.label': 'Photographie',
  'theme.patisserie.label': 'Pâtisserie',
  'theme.fitness.label': 'Fitness',
  'theme.coiffure.label': 'Coiffure',
  'theme.tech.label': 'Tech',
  // Thèmes D2 lot 3 (PANO-78).
  'theme.basket.label': 'Basket',
  'theme.cyclisme.label': 'Cyclisme',
  'theme.randonnee.label': 'Randonnée',
  'theme.skate.label': 'Skate',
  'theme.sports-combat.label': 'Sports de combat',
  'theme.danse.label': 'Danse',
  'theme.esport.label': 'Esport',
  'theme.cafe.label': 'Café',
  'theme.cuisine-vege.label': 'Cuisine végé',
  'theme.electro.label': 'Musique électro',
  'theme.guitare.label': 'Guitare & instruments',
  'theme.lecture.label': 'Lecture',
  'theme.expo-concert.label': 'Concerts & expos',
  'theme.motos.label': 'Motos',
  // Thèmes D2 lot 4 (PANO-89) — achève le catalogue.
  'theme.lapins.label': 'Lapins',
  'theme.dessin.label': 'Dessin & illustration',
  'theme.jardinage.label': 'Jardinage',
  'theme.diy.label': 'DIY & bricolage',
  'theme.tricot.label': 'Tricot & crochet',
  'theme.philosophie.label': 'Philosophie',
  'theme.sociologie.label': 'Sociologie',
  'theme.psychologie.label': 'Psychologie',
  'theme.histoire.label': 'Histoire',
  'theme.economie.label': 'Économie',
  'theme.biologie.label': 'Biologie',
  'theme.physique.label': 'Physique',
  'theme.mathematiques.label': 'Mathématiques',
  'theme.astronomie.label': 'Astronomie & espace',
};

/** Texte du nom d'un thème, depuis la clé portée par le lexique d'intérêt. */
export function themeLabelText(key: string): string {
  return resolve(THEME_LABELS, key);
}

/** Clés de libellé routées — pour le test de couverture D2. */
export function hasThemeLabel(key: string): boolean {
  return key in THEME_LABELS;
}

// --- USAGES par thème (ADR-0003) : clé de lexique → texte -----------------------------------
// STRUCTURE actée, contenu = brouillon (le contenu réel/sourcé relève de PANO-55, hors périmètre).
const USAGES: Readonly<Record<string, string>> = {
  'usage.advertiser.vulnerability': 'ciblage de moments de vulnérabilité',
  'usage.insurer.silent-sort': 'tri silencieux, décision défavorable jamais explicitée',
  'usage.broker.resale': 'revente d’un segment « santé » à des tiers',
  'usage.political.microtargeting': 'micro-ciblage de message selon orientation présumée',
  'usage.platform.feed-tuning': 'affinage du fil pour maximiser le temps passé',
  'usage.advertiser.recipe-targeting':
    'ciblage produits et recettes, partenariats marques alimentaires',
  'usage.platform.retention-testing':
    'optimisation du temps d’écran, tests de rétention sur les formats qui retiennent le plus',
  'usage.advertiser.attention-windows':
    'achat des fenêtres d’attention les plus captives, aux heures de forte présence',
  // Usages des thèmes D2 (PANO-75/76, brouillon — contenu sourcé PANO-55).
  'usage.advertiser.gaming-hardware':
    'ciblage matériel et jeux, partenariats éditeurs et fabricants de consoles',
  'usage.advertiser.supplements':
    'ciblage compléments alimentaires, abonnements salles et coaching sportif',
  'usage.advertiser.running-gear':
    'ciblage chaussures et montres GPS, dossards de courses et applications d’entraînement',
  'usage.advertiser.football-merch':
    'ciblage maillots et abonnements de diffusion, produits dérivés de clubs',
  'usage.advertiser.ai-tools':
    'ciblage abonnements à des outils génératifs, formations et services d’automatisation',
  'usage.advertiser.crypto-platforms':
    'ciblage plateformes d’échange et portefeuilles, un segment à fort risque d’arnaque',
  'usage.advertiser.cosmetics':
    'ciblage produits de maquillage et coffrets, partenariats marques de beauté',
  'usage.advertiser.skincare-products':
    'ciblage soins et routines, abonnements et coffrets dermo-cosmétiques',
  'usage.advertiser.sneaker-drops':
    'ciblage sorties limitées et reventes, alertes de drops et plateformes de revente',
  'usage.advertiser.fandom-merch':
    'ciblage produits dérivés et billetterie, un public de fans à forte intention d’achat',
  'usage.advertiser.anime-merch':
    'ciblage figurines et éditions, abonnements de streaming et conventions',
  // Usages des thèmes D2 lot 2 (PANO-77, brouillon — contenu sourcé PANO-55).
  'usage.advertiser.fast-fashion':
    'ciblage vêtements et tendances, relances panier et déstockage éphémère',
  'usage.advertiser.streaming':
    'ciblage abonnements de streaming, offres groupées et fenêtres de sortie',
  'usage.advertiser.pet-supplies':
    'ciblage alimentation et accessoires animaliers, abonnements et assurances',
  'usage.advertiser.travel-booking':
    'ciblage vols, hébergements et séjours, relances de réservation abandonnée',
  'usage.advertiser.automotive':
    'ciblage véhicules, financement et équipement, concessions et assurances auto',
  'usage.advertiser.music-streaming':
    'ciblage abonnements musicaux, billetterie de concerts et produits dérivés',
  'usage.advertiser.photo-gear':
    'ciblage boîtiers, objectifs et logiciels, offres reconditionné et formation',
  'usage.advertiser.haircare':
    'ciblage soins et coloration, salons partenaires et produits capillaires',
  'usage.advertiser.consumer-tech':
    'ciblage appareils et gadgets, précommandes et reprises, extensions de garantie',
  // Usages des thèmes D2 lot 3 (PANO-78, brouillon — contenu sourcé PANO-55).
  'usage.advertiser.basketball-gear':
    'ciblage chaussures et maillots, abonnements de diffusion et produits dérivés de franchises',
  'usage.advertiser.cycling-gear':
    'ciblage vélos et composants, tenues et applications d’entraînement',
  'usage.advertiser.outdoor-gear':
    'ciblage matériel de randonnée et de bivouac, marques outdoor et assurances montagne',
  'usage.advertiser.skate-gear':
    'ciblage planches et chaussures, marques de skate et vidéos sponsorisées',
  'usage.advertiser.combat-sports':
    'ciblage équipement et salles, abonnements de diffusion et paris (segment surveillé)',
  'usage.advertiser.dance-classes': 'ciblage cours et stages, tenues et billetterie de spectacles',
  'usage.advertiser.coffee-gear':
    'ciblage machines et grains, abonnements de torréfacteurs et ustensiles',
  'usage.advertiser.plant-based':
    'ciblage substituts et produits végétaux, box repas et enseignes spécialisées',
  'usage.advertiser.music-gear': 'ciblage instruments et matériel, méthodes en ligne et lutherie',
  'usage.advertiser.books': 'ciblage livres et liseuses, abonnements de lecture et box littéraires',
  'usage.advertiser.event-tickets':
    'ciblage billetterie de concerts et d’expositions, festivals et voyages associés',
  'usage.advertiser.motorcycle-gear':
    'ciblage motos et équipement, permis moto, financement et assurances deux-roues',
  // Usages des thèmes D2 lot 4 (PANO-89, brouillon). Pour les DISCIPLINES, usage SOBRE
  // (édition/edtech/MOOC) : un segment d'apprentissage, pas un faux profil marketing agressif.
  'usage.advertiser.art-supplies':
    'ciblage matériel de dessin et logiciels, tablettes graphiques et cours en ligne',
  'usage.advertiser.gardening': 'ciblage graines et outils, jardineries et box potager',
  'usage.advertiser.diy-tools':
    'ciblage outillage et matériaux, enseignes de bricolage et location de matériel',
  'usage.advertiser.craft-supplies': 'ciblage laines et fournitures, patrons et kits créatifs',
  'usage.advertiser.edtech':
    'ciblage manuels, cours en ligne et éditions spécialisées — un segment d’apprentissage plutôt qu’un profil marketing agressif',
};

/** Texte d'un usage, depuis la clé portée par le lexique d'intérêt. */
export function usageText(key: string): string {
  return resolve(USAGES, key);
}

/** Clés d'usage routées — pour le test de couverture D2. */
export function hasUsage(key: string): boolean {
  return key in USAGES;
}

// --- ACTEURS (`ThemeUsage.actor`) : clé de lexique → libellé -----------------------------------
const ACTOR_LABELS: Readonly<Record<string, string>> = {
  advertiser: 'annonceur',
  insurer_employer: 'assureur / employeur',
  broker: 'courtier de données',
  political_actor: 'acteur politique',
  state_authority: 'état / autorité',
  platform: 'plateforme',
};

/** Libellé d'un acteur ; repli sur la clé brute si inconnue (comportement conservé de `actorLabel`). */
export function actorLabel(actor: string): string {
  return ACTOR_LABELS[actor] ?? actor;
}
