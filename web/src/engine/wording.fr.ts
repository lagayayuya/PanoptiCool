// Wording FR — la prose du MOTEUR, en français. Périmètre ratifiable n°1, moitié française.
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ WORDING PROVISOIRE — À RELIRE PAR yuya.                                                   │
// │ Premier jet volontairement brouillon : le ton n'est PAS validé. Seules les PROPRIÉTÉS de   │
// │ cadrage sont tenues (cf. wording.test.ts) — pas la qualité rédactionnelle.                 │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
//
// CE FICHIER EST L'ORACLE DE FORME. `wording.ts` dérive le type du bundle de `typeof FR`, et
// `wording.en.ts` s'annote avec lui : une entrée ajoutée ICI et oubliée en anglais est une erreur de
// COMPILATION. C'est ce qui rend le lot anglais sûr à mener pendant que le lexique bouge ailleurs.
//
// ⚠ NE PAS ANNOTER LES TABLES OUVERTES `Readonly<Record<string, string>>` — c'est l'annotation, et
// non l'ouverture des clés, qui détruit la parité : `typeof` d'une table annotée ainsi efface les
// clés, et une table anglaise VIDE compile alors sans une erreur (mesuré). Laissées en littéraux,
// `typeof` capture les clés exactes et le compilateur tient les deux sens. Les tables à union FERMÉE
// (`Record<SensitiveLabel, string>`) gardent leur annotation : l'union étant close, `typeof` en rend
// les clés exactes de toute façon, et l'annotation ajoute l'exhaustivité sur le label.
//
// Les CHAÎNES sont reprises VERBATIM de l'ex-`wording.ts` monolingue : ce lot déplace la prose
// française, il ne la réécrit pas (les deux goldens le prouvent à l'octet).

import type { SensitiveLabel } from './lexicon/types';

export const FR = {
  // --- opacity semantic-wall -----------------------------------------------------------------
  // Sujet = PanoptiCool (pas « vos données ») : le « vous » reste réservé au header (PANO-54), seul
  // endroit autorisé — cf. propriété (a) de wording.test.ts, qui balaie TOUT ce fichier.
  opacitySemanticWallClaim: (): string =>
    `PanoptiCool ne peut analyser qu'une fraction des données de cet export.`,

  /** Brouillon (PANO-45, porte humaine) — accompagne le camembert (PANO-57) : explicite ce que le
   * ratio SIGNIFIE, pas seulement le chiffre déjà dans la légende. */
  opacitySemanticWallExplainer: (): string =>
    `L'export ne rend visible que la partie émergée de l'iceberg. Le reste n'est accessible que pour TikTok et ses partenaires.`,

  // --- D1 détecteur de sujets sensibles — UNE SEULE PHRASE SURVIT ------------------------------
  // Les dix phrases des cinq labels à éventail sont RETIRÉES : elles répétaient le titre de la carte
  // qu'on venait de cliquer, et l'éventail de lectures porte désormais le sens. Ce qui reste ici est
  // le seul cas où la phrase informe encore — `conflictual` n'a pas d'éventail (B5 : l'insulte émise
  // EST le signal), et sa phrase porte le CRITÈRE d'admission, pas le sujet : propos ÉMIS, VISANT un
  // autre utilisateur. « Conflictuel » ne le dit pas.
  //
  // AUCUN CANAL DANS CES PHRASES, et c'est une correction de FAIT, pas de style. Elles disaient
  // toutes « repéré dans des commentaires » alors que D1 lit les commentaires ET les recherches :
  // une preuve tirée d'une recherche était donc annoncée comme un commentaire. Un mainteneur l'a lu
  // sur une carte rendue — « repéré dans des commentaires » au-dessus d'une unique recherche.
  //
  // Le canal a par ailleurs DEUX maisons : chaque carte de preuve porte déjà le sien, par item. Le
  // répéter ici, c'est le maintenir à deux endroits dont un seul est recalculé — l'autre périme en
  // silence. Ne pas le réintroduire : la seule maison correcte est l'item.
  d1ConflictualNamedClaim: (): string => `Propos agressif adressé à un autre utilisateur.`,

  // --- D2 détecteur d'intérêts (PANO-75) -------------------------------------------------------
  /** UNE fonction générique (un intérêt se cadre pareil quel que soit le thème ; le NOM du thème vit
   * dans le libellé de thème, pas dans le claim). `signalCount` est un `number` EXIGÉ par la
   * signature — l'ancien `p(q, 'signalCount')` rendait « ? » si le param manquait, en silence. */
  d2InterestClaim: (signalCount: number): string => {
    // ACCORD EN NOMBRE (correction) : rendait « déduit de 1 commentaires » dès qu'un thème ne tenait
    // qu'à une seule preuve — cas courant, pas un cas limite. La règle est écrite ICI, à la main,
    // plutôt qu'importée d'un helper d'interface : ce fichier est PUR et passe la 2ᵉ passe
    // `tsc -p src/engine/tsconfig.json` — le moteur ne dépend pas de l'UI, et l'inverse non plus.
    // Le français met 0 AU SINGULIER, d'où `<= 1` et non `=== 1`. (L'anglais fait l'inverse : voir
    // la note de `wording.en.ts`, qui ne peut donc PAS recopier cette ligne.)
    const word = signalCount <= 1 ? 'commentaire' : 'commentaires';
    return `Centre d'intérêt déduit de ${signalCount} ${word} sur le même thème.`;
  },

  // --- NOM COURT d'un sujet sensible (titre de `SignalCardNavy`) -------------------------------
  /**
   * Mot court par label sensible — titre de la carte d'un signal, à la place de la phrase-claim
   * (elle créait une dissonance avec les cartes de thème ; décision yuya, refonte 2026-07-15).
   *
   * `Record<SensitiveLabel, string>` : union FERMÉE, donc exhaustivité tenue par le COMPILATEUR —
   * un label béni sans nom ne compile pas.
   */
  sensitiveTopicName: {
    mental_health: 'Santé mentale',
    politics: 'Politique',
    conflictual: 'Conflictuel',
    health_physical: 'Santé physique',
    sexuality: 'Sexualité',
    religion: 'Religion',
  } as Record<SensitiveLabel, string>,

  // --- LECTURES (éventail, ADR-0003) : clé de lexique → texte ----------------------------------
  // Fragments courts, NON soumis à la propriété (c) : « un vécu personnel » n'est pas une phrase
  // assertive. Clés portées par `LabelLexicon.readingTemplateIds` (lexique intouchable).
  readings: {
    // L'AXE « POUR QUI » — `mental_health`, `health_physical`, `sexuality` partagent les trois mêmes
    // mécanismes, donc les trois mêmes mots : c'est moi · c'est quelqu'un d'autre · ce n'est
    // personne. Trois libellés pour un mécanisme unique serait, à la lettre, ce que « trois
    // mécanismes, pas trois degrés » interdit — la règle vaut à l'intérieur d'un label comme entre
    // eux. `politics` et `religion` gardent leur formulation propre parce qu'elle nomme un SECOND
    // SENS réel (la veille, l'intérêt culturel), pas une variante de style.
    'sensitive.mental-health.reading.lived': 'vécu personnel',
    'sensitive.mental-health.reading.relative': 'préoccupation pour un proche',
    'sensitive.mental-health.reading.curiosity': 'simple curiosité',
    // `politics` — RATIFIÉ : trois MÉCANISMES, pas trois degrés. `irony` est RÉCUPÉRÉ (seul des six
    // à nommer un mécanisme qu'aucun autre ne couvre : le signal ne représente pas la personne, et
    // c'est la lecture qui protège le plus sur un label où se tromper coûte cher). Trois sortent :
    // `partisan` était un DEGRÉ d'`engaged` ; `mockery` décrivait un propos VISANT quelqu'un,
    // c'est-à-dire `conflictual` ; `avis personnel` était le degré intermédiaire entre l'engagement
    // et la veille, sans mécanisme propre.
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

  // --- LIBELLÉS DE THÈME : clé de lexique → texte ----------------------------------------------
  // Clés portées par `InterestLexicon.themeLabel` (lexique intouchable). Libellés courts, brouillon.
  themeLabels: {
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
  },

  // --- USAGES par thème (ADR-0003) : clé de lexique → texte ------------------------------------
  // STRUCTURE actée, contenu = brouillon (le contenu réel/sourcé relève de PANO-55, hors périmètre).
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
  },

  // --- ACTEURS (`ThemeUsage.actor`) : clé de lexique → libellé ----------------------------------
  actorLabels: {
    advertiser: 'annonceur',
    insurer_employer: 'assureur / employeur',
    broker: 'courtier de données',
    political_actor: 'acteur politique',
    state_authority: 'état / autorité',
    platform: 'plateforme',
  },
};
