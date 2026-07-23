// FR wording — the ENGINE's prose, in French. Ratifiable scope #1, French half.
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ PROVISIONAL WORDING — TO BE REVIEWED BY yuya.                                              │
// │ Deliberately rough first draft: the tone is NOT validated. Only the framing PROPERTIES     │
// │ are held (cf. wording.test.ts) — not the writing quality.                                  │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
//
// THIS FILE IS THE SHAPE ORACLE. `wording.ts` derives the bundle type from `typeof FR`, and
// `wording.en.ts` annotates itself with it: an entry added HERE and forgotten in English is a
// COMPILE error. This is what makes the English batch safe to run while the lexicon moves elsewhere.
//
// ⚠ DO NOT ANNOTATE THE OPEN TABLES `Readonly<Record<string, string>>` — it is the annotation, not
// the opening of the keys, that destroys parity: `typeof` of a table annotated that way erases the
// keys, and an EMPTY English table then compiles without an error (measured). Left as literals,
// `typeof` captures the exact keys and the compiler holds both directions. The CLOSED-union tables
// (`Record<SensitiveLabel, string>`) keep their annotation: the union being closed, `typeof` yields
// their exact keys anyway, and the annotation adds exhaustiveness over the label.
//
// The STRINGS are taken VERBATIM from the ex-monolingual `wording.ts`: this batch moves the French
// prose, it does not rewrite it (the two goldens prove it to the byte).

import type { SensitiveLabel } from './lexicon/types';

export const FR = {
  // --- opacity semantic-wall -----------------------------------------------------------------
  // Subject = PanoptiCool (not "your data"): the "you" stays reserved for the header (PANO-54), the
  // only place allowed — cf. property (a) of wording.test.ts, which sweeps ALL of this file.
  opacitySemanticWallClaim: (): string =>
    `PanoptiCool ne peut analyser qu'une fraction des données de cet export.`,

  /** Draft (PANO-45, human gate) — accompanies the pie chart (PANO-57): makes explicit what the
   * ratio MEANS, not just the figure already in the legend. */
  opacitySemanticWallExplainer: (): string =>
    `L'export ne rend visible que la partie émergée de l'iceberg. Le reste n'est accessible que pour TikTok et ses partenaires.`,

  // --- D1 sensitive-topics detector — ONLY ONE SENTENCE SURVIVES -------------------------------
  // The ten sentences of the five fan labels are REMOVED: they repeated the title of the card one
  // had just clicked, and the fan of readings now carries the meaning. What stays here is the only
  // case where the sentence still informs — `conflictual` has no fan (B5: the emitted insult IS the
  // signal), and its sentence carries the admission CRITERION, not the topic: a remark EMITTED,
  // DIRECTED AT another user. "Conflict" does not say it.
  //
  // NO CHANNEL IN THESE SENTENCES, and this is a correction of FACT, not of style. They all said
  // "spotted in comments" whereas D1 reads comments AND searches: evidence drawn from a search was
  // therefore announced as a comment. A maintainer read it on a rendered card — "spotted in
  // comments" above a single search.
  //
  // The channel moreover has TWO homes: each evidence card already carries its own, per item.
  // Repeating it here means maintaining it in two places, only one of which is recomputed — the
  // other goes stale silently. Do not reintroduce it: the only correct home is the item.
  d1ConflictualNamedClaim: (): string => `Propos agressif adressé à un autre utilisateur.`,

  // --- D2 interests detector (PANO-75) ---------------------------------------------------------
  /** ONE generic function (an interest is framed the same whatever the theme; the theme's NAME lives
   * in the theme label, not in the claim). `signalCount` is a `number` REQUIRED by the signature —
   * the old `p(q, 'signalCount')` returned "?" if the param was missing, silently. */
  d2InterestClaim: (signalCount: number): string => {
    // NUMBER AGREEMENT (fix): it returned "déduit de 1 commentaires" as soon as a theme rested on a
    // single piece of evidence — a common case, not an edge case. The rule is written HERE, by hand,
    // rather than imported from a UI helper: this file is PURE and passes the 2nd
    // `tsc -p src/engine/tsconfig.json` pass — the engine does not depend on the UI, nor the reverse.
    // French puts 0 IN THE SINGULAR, hence `<= 1` and not `=== 1`. (English does the reverse: see
    // the note in `wording.en.ts`, which therefore CANNOT copy this line.)
    const word = signalCount <= 1 ? 'commentaire' : 'commentaires';
    return `Centre d'intérêt déduit de ${signalCount} ${word} sur le même thème.`;
  },

  // --- SHORT NAME of a sensitive topic (title of `SignalCardNavy`) -----------------------------
  /**
   * Short word per sensitive label — the title of a signal's card, in place of the claim-sentence
   * (it created a dissonance with the theme cards; yuya's decision, 2026-07-15 refonte).
   *
   * `Record<SensitiveLabel, string>`: a CLOSED union, so exhaustiveness held by the COMPILER — a
   * blessed label with no name does not compile.
   */
  sensitiveTopicName: {
    mental_health: 'Santé mentale',
    politics: 'Politique',
    conflictual: 'Conflictuel',
    health_physical: 'Santé physique',
    sexuality: 'Sexualité',
    religion: 'Religion',
  } as Record<SensitiveLabel, string>,

  // --- READINGS (fan, ADR-0003): lexicon key → text --------------------------------------------
  // Short fragments, NOT subject to property (c): "a personal experience" is not an assertive
  // sentence. Keys carried by `LabelLexicon.readingTemplateIds` (untouchable lexicon).
  readings: {
    // THE "FOR WHOM" AXIS — `mental_health`, `health_physical`, `sexuality` share the same three
    // mechanisms, hence the same three words: it's me · it's someone else · it's no one. Three
    // labels for a single mechanism would be, to the letter, what "three mechanisms, not three
    // degrees" forbids — the rule holds within a label as it does between them. `politics` and
    // `religion` keep their own wording because it names a real SECOND MEANING (following, cultural
    // interest), not a style variant.
    'sensitive.mental-health.reading.lived': 'vécu personnel',
    'sensitive.mental-health.reading.relative': 'préoccupation pour un proche',
    'sensitive.mental-health.reading.curiosity': 'simple curiosité',
    // `politics` — RATIFIED: three MECHANISMS, not three degrees. `irony` is RECOVERED (the only one
    // of the six to name a mechanism no other covers: the signal does not represent the person, and
    // it is the reading that protects the most on a label where getting it wrong is costly). Three
    // leave: `partisan` was a DEGREE of `engaged`; `mockery` described a remark DIRECTED AT someone,
    // i.e. `conflictual`; `avis personnel` was the intermediate degree between engagement and
    // following, with no mechanism of its own.
    'sensitive.politics.reading.engaged': 'engagement politique sincère',
    'sensitive.politics.reading.irony': 'ironie ou provocation',
    'sensitive.politics.reading.watch': 'curiosité / veille',
    'sensitive.health-physical.reading.lived': 'vécu personnel',
    'sensitive.health-physical.reading.relative': 'préoccupation pour un proche',
    'sensitive.health-physical.reading.curiosity': 'simple curiosité',
    'sensitive.sexuality.reading.lived': 'vécu personnel',
    'sensitive.sexuality.reading.ally': 'proximité / allié',
    'sensitive.sexuality.reading.curiosity': 'simple curiosité',
    'sensitive.religion.reading.practice': 'pratique / appartenance',
    'sensitive.religion.reading.opinion': 'avis personnel',
    'sensitive.religion.reading.curiosity': 'curiosité / intérêt',
  },

  // --- THEME LABELS: lexicon key → text --------------------------------------------------------
  // Keys carried by `InterestLexicon.themeLabel` (untouchable lexicon). Short labels, draft.
  themeLabels: {
    'theme.cuisine.label': 'Cuisine',
    'theme.engagement.label': 'Engagement',
    'theme.mental-health.label': 'Santé mentale',
    'theme.politics.label': 'Politique',
    'theme.conflictual.label': 'Conflictuel',
    // D2 seed theme (PANO-75).
    'theme.gaming.label': 'Jeux vidéo',
    // D2 themes batch 1 (PANO-76).
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
    // D2 themes batch 2 (PANO-77). `theme.fitness.label` corrects the old label "Musculation"
    // (seed remnant): fitness/cross-training is a theme DISTINCT from weight training.
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
    // D2 themes batch 3 (PANO-78).
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
    // D2 themes batch 4 (PANO-89) — completes the catalogue.
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
  },

  // --- USAGES per theme (ADR-0003): lexicon key → text -----------------------------------------
  // STRUCTURE settled, content = draft (the real/sourced content is PANO-55's remit, out of scope).
  usages: {
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
    // Usages of the D2 themes (PANO-75/76, draft — sourced content PANO-55).
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
    // Usages of the D2 themes batch 2 (PANO-77, draft — sourced content PANO-55).
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
    // Usages of the D2 themes batch 3 (PANO-78, draft — sourced content PANO-55).
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
    'usage.advertiser.dance-classes':
      'ciblage cours et stages, tenues et billetterie de spectacles',
    'usage.advertiser.coffee-gear':
      'ciblage machines et grains, abonnements de torréfacteurs et ustensiles',
    'usage.advertiser.plant-based':
      'ciblage substituts et produits végétaux, box repas et enseignes spécialisées',
    'usage.advertiser.music-gear': 'ciblage instruments et matériel, méthodes en ligne et lutherie',
    'usage.advertiser.books':
      'ciblage livres et liseuses, abonnements de lecture et box littéraires',
    'usage.advertiser.event-tickets':
      'ciblage billetterie de concerts et d’expositions, festivals et voyages associés',
    'usage.advertiser.motorcycle-gear':
      'ciblage motos et équipement, permis moto, financement et assurances deux-roues',
    // Usages of the D2 themes batch 4 (PANO-89, draft). For the DISCIPLINES, SOBER usage
    // (publishing/edtech/MOOC): a learning segment, not a fake aggressive marketing profile.
    'usage.advertiser.art-supplies':
      'ciblage matériel de dessin et logiciels, tablettes graphiques et cours en ligne',
    'usage.advertiser.gardening': 'ciblage graines et outils, jardineries et box potager',
    'usage.advertiser.diy-tools':
      'ciblage outillage et matériaux, enseignes de bricolage et location de matériel',
    'usage.advertiser.craft-supplies': 'ciblage laines et fournitures, patrons et kits créatifs',
    'usage.advertiser.edtech':
      'ciblage manuels, cours en ligne et éditions spécialisées — un segment d’apprentissage plutôt qu’un profil marketing agressif',
  },

  // --- ACTORS (`ThemeUsage.actor`): lexicon key → label ----------------------------------------
  actorLabels: {
    advertiser: 'annonceur',
    insurer_employer: 'assureur / employeur',
    broker: 'courtier de données',
    political_actor: 'acteur politique',
    state_authority: 'état / autorité',
    platform: 'plateforme',
  },
};
