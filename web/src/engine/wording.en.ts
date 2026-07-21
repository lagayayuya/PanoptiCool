// Wording EN — la prose du MOTEUR, en anglais. Périmètre ratifiable n°1, moitié anglaise.
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ TRADUCTION PROVISOIRE — À RELIRE PAR yuya, ligne à ligne, comme la moitié française.       │
// │ Les propriétés de cadrage sont tenues par `wording.test.ts` ; le TON ne l'est pas.         │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
//
// LA FORME EST TENUE PAR `wording.fr.ts`. Ce fichier s'annote `WordingBundle` (= `typeof FR`) :
// une entrée oubliée, une clé en trop ou une signature qui diverge sont des erreurs de COMPILATION.
// Ce qu'aucun compilateur ne voit : qu'une entrée soit réellement TRADUITE. Recopier le français ici
// passerait tous les filets — cette moitié-là est une relecture humaine, et elle n'en a pas d'autre.
//
// ─── LE REGISTRE EST DE LA DOCTRINE, PAS DU STYLE ───────────────────────────────────────────────
// ADR-0003 (*Le cadrage*) : le moteur montre ce qu'une plateforme POURRAIT déduire, et ne rend
// jamais de verdict. Le français est non assertif à dessein, et l'anglais dérive vers l'accusatoire
// avec une facilité qu'il faut nommer :
//   - on ne traduit pas MOT À MOT, on traduit le SENS. « simple curiosité » devient « curiosity »
//     et non « simple curiosity » — parce que c'est le meilleur anglais, pas parce que « simple »
//     serait dangereux ;
//   - l'ÉVENTAIL doit rester un éventail. Les trois lectures d'un même axe se pèsent l'une l'autre :
//     si l'une prend du poids en anglais, `equal` cesse d'être `equal` et l'outil CHIFFRE sans le
//     dire, ce qu'ADR-0003 (*L'incertitude*) interdit — `ranked` ordonne, il ne chiffre pas.
//
// ORTHOGRAPHE : américaine (`OG_LOCALE.en = 'en_US'`) — « analyze », « maximize », « unfavorable ».
//
// TROIS CHOIX N'ÉTAIENT PAS DES TRADUCTIONS MAIS DES DÉCISIONS ÉDITORIALES — `Football`,
// `Engagement`, `Conflictuel`. Tous trois RATIFIÉS par yuya ; le raisonnement est consigné à
// l'entrée concernée, parce qu'une décision qui ne dit pas sa raison se re-tranche à chaque
// relecture, et parfois dans l'autre sens.

import type { WordingBundle } from './wording';

export const EN: WordingBundle = {
  opacitySemanticWallClaim: (): string =>
    `PanoptiCool can only analyze a fraction of the data in this export.`,

  opacitySemanticWallExplainer: (): string =>
    `The export only makes the tip of the iceberg visible. The rest is available to TikTok and its partners alone.`,

  // Le claim porte le CRITÈRE d'admission de `conflictual` (propos ÉMIS, VISANT un autre
  // utilisateur), pas le sujet — c'est ce qui doit survivre à la traduction.
  //
  // « aggressive » ET NON « abusive », et ce n'est pas une nuance de force : « abusive » qualifie
  // la PERSONNE qui écrit (« an abusive user »), là où « aggressive remark » qualifie le PROPOS.
  // ADR-0003 interdit exactement ce glissement — l'auteur du constat décrit un signal, jamais un
  // état posé sur quelqu'un. « directed at another user » porte le « visant autrui » ; sans lui, la
  // phrase couvrirait le juron sans cible (« putain ce bug »), que la doctrine exclut.
  d1ConflictualNamedClaim: (): string => `Aggressive remark directed at another user.`,

  d2InterestClaim: (signalCount: number): string => {
    // ⚠ CETTE LIGNE NE PEUT PAS ÊTRE RECOPIÉE DU FRANÇAIS, et c'est le piège le plus facile du lot.
    // Le français met ZÉRO au singulier (« 0 commentaire »), d'où son `<= 1` ; l'anglais met zéro
    // au PLURIEL (« 0 comments »). Un `<= 1` traduit tel quel rendrait « 0 comment », faux, et
    // invisible aux goldens — qui portent des volumes réalistes, donc toujours pluriels.
    // `Intl.PluralRules` porte la règle par CLDR plutôt que par la mémoire de qui écrit la ligne ;
    // il n'est pas du DOM, donc il passe la 2ᵉ passe `tsc -p src/engine/tsconfig.json`.
    const word =
      new Intl.PluralRules('en-US').select(signalCount) === 'one' ? 'comment' : 'comments';
    return `Interest inferred from ${signalCount} ${word} on the same topic.`;
  },

  sensitiveTopicName: {
    mental_health: 'Mental health',
    politics: 'Politics',
    // RATIFIÉ yuya. « Conflict » et non « Conflictual » : l'adjectif existe mais appartient au
    // registre savant, et un titre de carte doit se lire sans dictionnaire (objectif
    // d'accessibilité). « Hostility » et « Aggression » se lisent plus clairement encore, et c'est
    // exactement pourquoi ils sont écartés : ils ACCUSENT, là où le français est délibérément
    // doux — la doctrine non verdictive d'ADR-0003 tranche contre la clarté ici.
    conflictual: 'Conflict',
    health_physical: 'Physical health',
    sexuality: 'Sexuality',
    religion: 'Religion',
  },

  readings: {
    // L'axe « pour qui » : c'est moi · c'est quelqu'un d'autre · ce n'est personne. Les trois se
    // pèsent, et aucune ne doit sortir plus lourde que les autres.
    // « personal experience » plutôt que « lived experience » : le second est correct mais porte un
    // registre militant/thérapeutique qui l'alourdit face à « curiosity ». « curiosity » nu et non
    // « just curiosity » — meilleur anglais, et le « just » aurait allégé la troisième face au
    // moment où la première pèse déjà.
    'sensitive.mental-health.reading.lived': 'personal experience',
    'sensitive.mental-health.reading.relative': 'concern for someone close',
    'sensitive.mental-health.reading.curiosity': 'curiosity',
    // `politics` — trois MÉCANISMES, pas trois degrés (cf. la note française).
    'sensitive.politics.reading.engaged': 'genuine political engagement',
    'sensitive.politics.reading.irony': 'irony or provocation',
    // « veille » n'a pas de mot anglais : ni « watch » (qui surveille) ni « monitoring » (qui
    // professionnalise) ne rendent le suivi ordinaire d'un sujet. « staying informed » dit le
    // mécanisme réel — suivre sans adhérer — au prix d'une syllabe de plus.
    'sensitive.politics.reading.watch': 'curiosity / staying informed',
    'sensitive.health-physical.reading.lived': 'personal experience',
    'sensitive.health-physical.reading.relative': 'concern for someone close',
    'sensitive.health-physical.reading.curiosity': 'curiosity',
    'sensitive.sexuality.reading.lived': 'personal experience',
    'sensitive.sexuality.reading.ally': 'closeness / ally',
    'sensitive.sexuality.reading.curiosity': 'curiosity',
    'sensitive.religion.reading.practice': 'practice / belonging',
    'sensitive.religion.reading.opinion': 'personal opinion',
    'sensitive.religion.reading.curiosity': 'curiosity / interest',
  },

  themeLabels: {
    'theme.cuisine.label': 'Cooking',
    // RATIFIÉ yuya. « engagement » nu est un contresens EXACT ici : sur une plateforme, le mot
    // désigne l'interaction mesurée (le taux d'engagement), soit l'inverse de l'intention. Mais
    // « Activism » rétrécit — le français couvre l'implication civique LARGE, pas le militantisme.
    // « Civic engagement » garde l'ampleur et tue l'ambiguïté.
    'theme.engagement.label': 'Civic engagement',
    'theme.mental-health.label': 'Mental health',
    'theme.politics.label': 'Politics',
    'theme.conflictual.label': 'Conflict',
    'theme.gaming.label': 'Gaming',
    'theme.muscu.label': 'Weight training',
    'theme.running.label': 'Running',
    // RATIFIÉ yuya, et RÉVOCABLE — le raisonnement est consigné pour qu'on puisse le rouvrir.
    // « Football » en-US désigne le football américain, donc le risque de contresens est réel. Il
    // est gardé quand même pour deux raisons : le produit est européen par contexte, et surtout LA
    // PREUVE SE CORRIGE ELLE-MÊME — un lecteur américain qui lit « Football » au-dessus de
    // commentaires sur la Premier League comprend immédiatement. « Soccer » sonnerait faux partout
    // ailleurs pour éviter un malentendu que la ligne suivante lève déjà.
    'theme.football.label': 'Football',
    'theme.ia.label': 'Artificial intelligence',
    'theme.crypto.label': 'Crypto',
    'theme.maquillage.label': 'Makeup',
    'theme.skincare.label': 'Skincare',
    'theme.sneakers.label': 'Sneakers',
    'theme.kpop.label': 'K-pop',
    'theme.manga-anime.label': 'Manga & anime',
    'theme.mode.label': 'Fashion',
    'theme.cinema-series.label': 'Film & TV',
    'theme.chiens.label': 'Dogs',
    'theme.chats.label': 'Cats',
    'theme.voyage.label': 'Travel',
    'theme.voitures.label': 'Cars & tuning',
    'theme.rap.label': 'Rap / hip-hop',
    'theme.photographie.label': 'Photography',
    'theme.patisserie.label': 'Baking & pastry',
    'theme.fitness.label': 'Fitness',
    'theme.coiffure.label': 'Hair',
    'theme.tech.label': 'Tech',
    'theme.basket.label': 'Basketball',
    'theme.cyclisme.label': 'Cycling',
    'theme.randonnee.label': 'Hiking',
    'theme.skate.label': 'Skateboarding',
    'theme.sports-combat.label': 'Combat sports',
    'theme.danse.label': 'Dance',
    'theme.esport.label': 'Esports',
    'theme.cafe.label': 'Coffee',
    'theme.cuisine-vege.label': 'Plant-based cooking',
    'theme.electro.label': 'Electronic music',
    'theme.guitare.label': 'Guitar & instruments',
    'theme.lecture.label': 'Reading',
    'theme.expo-concert.label': 'Concerts & exhibitions',
    'theme.motos.label': 'Motorcycles',
    'theme.lapins.label': 'Rabbits',
    'theme.dessin.label': 'Drawing & illustration',
    'theme.jardinage.label': 'Gardening',
    'theme.diy.label': 'DIY & home improvement',
    'theme.tricot.label': 'Knitting & crochet',
    'theme.philosophie.label': 'Philosophy',
    'theme.sociologie.label': 'Sociology',
    'theme.psychologie.label': 'Psychology',
    'theme.histoire.label': 'History',
    'theme.economie.label': 'Economics',
    'theme.biologie.label': 'Biology',
    'theme.physique.label': 'Physics',
    'theme.mathematiques.label': 'Mathematics',
    'theme.astronomie.label': 'Astronomy & space',
  },

  usages: {
    'usage.advertiser.vulnerability': 'targeting moments of vulnerability',
    'usage.insurer.silent-sort': 'silent sorting, an unfavorable decision never spelled out',
    'usage.broker.resale': 'resale of a “health” segment to third parties',
    'usage.political.microtargeting': 'message microtargeting based on presumed leaning',
    'usage.platform.feed-tuning': 'feed tuning to maximize time spent',
    'usage.advertiser.recipe-targeting': 'targeting products and recipes, food brand partnerships',
    'usage.platform.retention-testing':
      'screen-time optimization, retention tests on the formats that hold attention longest',
    'usage.advertiser.attention-windows':
      'buying the most captive attention windows, at peak hours',
    'usage.advertiser.gaming-hardware':
      'targeting hardware and games, publisher and console maker partnerships',
    'usage.advertiser.supplements': 'targeting supplements, gym memberships and personal training',
    'usage.advertiser.running-gear':
      'targeting shoes and GPS watches, race entries and training apps',
    'usage.advertiser.football-merch':
      'targeting jerseys and broadcast subscriptions, club merchandise',
    'usage.advertiser.ai-tools':
      'targeting generative tool subscriptions, courses and automation services',
    'usage.advertiser.crypto-platforms':
      'targeting exchanges and wallets, a segment at high risk of scams',
    'usage.advertiser.cosmetics':
      'targeting makeup products and gift sets, beauty brand partnerships',
    'usage.advertiser.skincare-products':
      'targeting treatments and routines, subscriptions and dermo-cosmetic sets',
    'usage.advertiser.sneaker-drops':
      'targeting limited releases and resales, drop alerts and resale platforms',
    'usage.advertiser.fandom-merch':
      'targeting merchandise and ticketing, a fan audience with high purchase intent',
    'usage.advertiser.anime-merch':
      'targeting figures and special editions, streaming subscriptions and conventions',
    'usage.advertiser.fast-fashion':
      'targeting clothing and trends, cart reminders and flash clearance',
    'usage.advertiser.streaming': 'targeting streaming subscriptions, bundles and release windows',
    'usage.advertiser.pet-supplies':
      'targeting pet food and accessories, subscriptions and insurance',
    'usage.advertiser.travel-booking':
      'targeting flights, accommodation and trips, abandoned booking reminders',
    'usage.advertiser.automotive':
      'targeting vehicles, financing and equipment, dealerships and car insurance',
    'usage.advertiser.music-streaming':
      'targeting music subscriptions, concert ticketing and merchandise',
    'usage.advertiser.photo-gear':
      'targeting bodies, lenses and software, refurbished deals and training',
    'usage.advertiser.haircare': 'targeting care and coloring, partner salons and hair products',
    'usage.advertiser.consumer-tech':
      'targeting devices and gadgets, pre-orders and trade-ins, extended warranties',
    'usage.advertiser.basketball-gear':
      'targeting shoes and jerseys, broadcast subscriptions and franchise merchandise',
    'usage.advertiser.cycling-gear': 'targeting bikes and components, kit and training apps',
    'usage.advertiser.outdoor-gear':
      'targeting hiking and camping equipment, outdoor brands and mountain insurance',
    'usage.advertiser.skate-gear': 'targeting boards and shoes, skate brands and sponsored videos',
    'usage.advertiser.combat-sports':
      'targeting equipment and gyms, broadcast subscriptions and betting (a monitored segment)',
    'usage.advertiser.dance-classes': 'targeting classes and workshops, outfits and show ticketing',
    'usage.advertiser.coffee-gear':
      'targeting machines and beans, roaster subscriptions and equipment',
    'usage.advertiser.plant-based':
      'targeting substitutes and plant-based products, meal boxes and specialist retailers',
    'usage.advertiser.music-gear':
      'targeting instruments and equipment, online lessons and instrument making',
    'usage.advertiser.books': 'targeting books and e-readers, reading subscriptions and book boxes',
    'usage.advertiser.event-tickets':
      'targeting concert and exhibition ticketing, festivals and associated travel',
    'usage.advertiser.motorcycle-gear':
      'targeting motorcycles and gear, licenses, financing and two-wheeler insurance',
    'usage.advertiser.art-supplies':
      'targeting drawing materials and software, graphics tablets and online courses',
    'usage.advertiser.gardening': 'targeting seeds and tools, garden centers and vegetable boxes',
    'usage.advertiser.diy-tools': 'targeting tools and materials, DIY chains and equipment rental',
    'usage.advertiser.craft-supplies': 'targeting yarn and supplies, patterns and craft kits',
    'usage.advertiser.edtech':
      'targeting textbooks, online courses and specialist publishing — a learning segment rather than an aggressive marketing profile',
  },

  actorLabels: {
    advertiser: 'advertiser',
    insurer_employer: 'insurer / employer',
    broker: 'data broker',
    political_actor: 'political actor',
    state_authority: 'state / authority',
    platform: 'platform',
  },
};
