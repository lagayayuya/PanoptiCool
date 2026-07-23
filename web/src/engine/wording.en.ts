// EN wording — the ENGINE's prose, in English. Ratifiable scope #1, English half.
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ PROVISIONAL TRANSLATION — TO BE REVIEWED BY yuya, line by line, like the French half.      │
// │ The framing properties are held by `wording.test.ts`; the TONE is not.                     │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
//
// THE SHAPE IS HELD BY `wording.fr.ts`. This file annotates itself `WordingBundle` (= `typeof FR`):
// a forgotten entry, an extra key, or a diverging signature are COMPILE errors. What no compiler
// sees: whether an entry is actually TRANSLATED. Copying the French here would pass every net —
// this half is a human review, and it has no other.
//
// ─── THE REGISTER IS DOCTRINE, NOT STYLE ────────────────────────────────────────────────────────
// ADR-0003 (*The framing*): the engine shows what a platform COULD deduce, and never renders a
// verdict. The French is non-assertive on purpose, and English drifts toward the accusatory with an
// ease that must be named:
//   - we do not translate WORD FOR WORD, we translate the MEANING. "simple curiosité" becomes
//     "curiosity" and not "simple curiosity" — because it is the best English, not because "simple"
//     would be dangerous;
//   - the FAN must stay a fan. The three readings of a single axis weigh against one another: if one
//     gains weight in English, `equal` stops being `equal` and the tool QUANTIFIES without saying
//     so, which ADR-0003 (*The uncertainty*) forbids — `ranked` orders, it does not quantify.
//
// SPELLING: American (`OG_LOCALE.en = 'en_US'`) — "analyze", "maximize", "unfavorable".
//
// THREE CHOICES WERE NOT TRANSLATIONS BUT EDITORIAL DECISIONS — `Football`, `Engagement`,
// `Conflictuel`. All three RATIFIED by yuya; the reasoning is recorded at the entry concerned,
// because a decision that does not state its reason gets re-settled at every review, and sometimes
// the other way.

import type { WordingBundle } from './wording';

export const EN: WordingBundle = {
  opacitySemanticWallClaim: (): string =>
    `PanoptiCool can only analyze a fraction of the data in this export.`,

  opacitySemanticWallExplainer: (): string =>
    `The export only makes the tip of the iceberg visible. The rest is available to TikTok and its partners alone.`,

  // The claim carries the admission CRITERION of `conflictual` (a remark EMITTED, DIRECTED AT
  // another user), not the topic — that is what must survive the translation.
  //
  // "aggressive" AND NOT "abusive", and this is not a nuance of strength: "abusive" qualifies the
  // PERSON writing ("an abusive user"), whereas "aggressive remark" qualifies the REMARK. ADR-0003
  // forbids exactly this slide — the author of the finding describes a signal, never a state placed
  // on someone. "directed at another user" carries the "targeting another"; without it, the
  // sentence would cover the target-less curse ("damn this bug"), which doctrine excludes.
  d1ConflictualNamedClaim: (): string => `Aggressive remark directed at another user.`,

  d2InterestClaim: (signalCount: number): string => {
    // ⚠ THIS LINE CANNOT BE COPIED FROM THE FRENCH, and it is the easiest trap of the batch. French
    // puts ZERO in the singular ("0 commentaire"), hence its `<= 1`; English puts zero in the PLURAL
    // ("0 comments"). A `<= 1` translated as-is would return "0 comment", wrong, and invisible to
    // the goldens — which carry realistic volumes, hence always plural. `Intl.PluralRules` carries
    // the rule via CLDR rather than via the memory of whoever writes the line; it is not DOM, so it
    // passes the 2nd `tsc -p src/engine/tsconfig.json` pass.
    const word =
      new Intl.PluralRules('en-US').select(signalCount) === 'one' ? 'comment' : 'comments';
    return `Interest inferred from ${signalCount} ${word} on the same topic.`;
  },

  sensitiveTopicName: {
    mental_health: 'Mental health',
    politics: 'Politics',
    // RATIFIED yuya. "Conflict" and not "Conflictual": the adjective exists but belongs to the
    // learned register, and a card title must read without a dictionary (accessibility goal).
    // "Hostility" and "Aggression" read even more clearly, and that is exactly why they are set
    // aside: they ACCUSE, where the French is deliberately gentle — ADR-0003's non-verdictive
    // doctrine rules against clarity here.
    conflictual: 'Conflict',
    health_physical: 'Physical health',
    sexuality: 'Sexuality',
    religion: 'Religion',
  },

  readings: {
    // The "for whom" axis: it's me · it's someone else · it's no one. The three weigh against one
    // another, and none must come out heavier than the others.
    // "personal experience" rather than "lived experience": the latter is correct but carries an
    // activist/therapeutic register that weighs it down against "curiosity". Bare "curiosity" and
    // not "just curiosity" — better English, and the "just" would have lightened the third at the
    // moment the first already weighs.
    'sensitive.mental-health.reading.lived': 'personal experience',
    'sensitive.mental-health.reading.relative': 'concern for someone close',
    'sensitive.mental-health.reading.curiosity': 'curiosity',
    // `politics` — three MECHANISMS, not three degrees (cf. the French note).
    'sensitive.politics.reading.engaged': 'genuine political engagement',
    'sensitive.politics.reading.irony': 'irony or provocation',
    // "veille" has no English word: neither "watch" (which surveils) nor "monitoring" (which
    // professionalizes) conveys the ordinary following of a topic. "staying informed" states the
    // real mechanism — following without endorsing — at the cost of one more syllable.
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
    // RATIFIED yuya. Bare "engagement" is an EXACT mistranslation here: on a platform, the word
    // denotes measured interaction (the engagement rate), i.e. the opposite of intent. But
    // "Activism" narrows — the French covers BROAD civic involvement, not militancy. "Civic
    // engagement" keeps the breadth and kills the ambiguity.
    'theme.engagement.label': 'Civic engagement',
    'theme.mental-health.label': 'Mental health',
    'theme.politics.label': 'Politics',
    'theme.conflictual.label': 'Conflict',
    'theme.gaming.label': 'Gaming',
    'theme.muscu.label': 'Weight training',
    'theme.running.label': 'Running',
    // RATIFIED yuya, and REVOCABLE — the reasoning is recorded so it can be reopened. "Football" in
    // en-US means American football, so the risk of mistranslation is real. It is kept anyway for
    // two reasons: the product is European by context, and above all THE EVIDENCE CORRECTS ITSELF —
    // an American reader who reads "Football" above comments on the Premier League understands
    // immediately. "Soccer" would ring false everywhere else, to avoid a misunderstanding the next
    // line already dispels.
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
