// INTERFACE FR copy — the components' prose, in French. Ratifiable perimeter no. 2.
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ PROVISIONAL WORDING — TO BE REVIEWED BY yuya, on the same footing as `engine/wording.fr.ts`. │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
//
// THIS FILE IS THE FORM ORACLE of perimeter no. 2. `copy.ts` derives `UiCopy = typeof FR`, and
// `copy.en.ts` annotates itself with it: an entry added here and forgotten in English is a
// COMPILATION error.
//
// ⚠ DO NOT ANNOTATE THE GROUPS `Readonly<Record<string, string>>` nor freeze them `as const`. The
// first erases the type's keys and lets an EMPTY translation compile (measured, cf.
// `engine/wording.ts`); the second freezes the strings into LITERAL types, and English can then
// no longer satisfy French. Bare literals are the only balance point: exact keys,
// `string` values. The existing `satisfies` are kept — they VERIFY without widening.
//
// ⚠ THE ARRAYS ARE NOT AT LENGTH PARITY. `typeof` of an array gives `T[]`, not a
// tuple: an English translation can provide 2 where French has 3, and compile.
// `copy-parity.test.ts` compares the lengths at RUNTIME — it is the only net on this point.
//
// WHY THIS PERIMETER IS SEPARATE FROM `engine/wording.*`: `wording.test.ts` forbids there the 2nd
// person (the engine never addresses the person, ADR-0003), yet almost every interface
// sentence uses "tu" (« ton export », « tu peux »). The prohibition therefore EXILED the interface prose
// out of the ratifiable file. Hence TWO perimeters, one file per language each.
//
// SHAPE. A FLAT object per surface: an absent or mistyped key is a COMPILATION error at the
// call point. FILL-IN sentences are FUNCTIONS that render the WHOLE sentence — never
// « préfixe » / « suffixe » fragments whose trailing space would be load-bearing: a reviewer cannot
// verify what he does not see as a block.
//
// WHAT DOES NOT ENTER HERE:
//   - purely decorative glyphs (« · », « › », « ▲ ») stay in the component — it is
//     not prose, and extracting them would hurt the reading of the markup;
//   - the LEGAL TEXT of `pages/fr/mentions-legales.astro` (yuya's decision) — it is a
//     REFERENCE text, read as a block and not by table entries, and whose English version
//     is a TWIN page written by a human, not translated strings.
//
// ─── READING ORDER: THE JOURNEY, NOT THE TREE ──────────────────────────────────────────────────
// The groups follow the order in which a person ENCOUNTERS the texts, not the order of the
// files. Auditing "everything the product says" is then done in the direction the product says it.
//
//   1. SHARED VOCABULARY   — identity, counted units, confidence levels
//   1 bis. ROOT             — `pages/index.astro`, the page that sends to a language
//   2. HOME                 — `ui/v2/LandingPage.tsx`
//   3. ANALYSIS             — `ui/v2/AnalysisPage.tsx` (upload, loading, failures)
//   4. RESULTS              — `ui/v2/ResultsView.tsx` and its sections
//   5. CHROME               — site bar, footer, « pour comprendre » panels

import type { ModelChoice, Os } from '../ai/install-help';
import type { Volumes } from '../engine/analysis';
import { plural } from './format';

// The counted units are HOISTED out of the bundle: several groups reference them (AI section,
// « aucune déduction » card), and a cross-reference is not resolvable inside the
// literal that contains it.
const UNITS = {
  search: (n: number) => plural(n, 'recherche', 'recherches'),
  comment: (n: number) => plural(n, 'commentaire', 'commentaires'),
  item: (n: number) => plural(n, 'item', 'items'),
};

export const FR = {
  // --- Counted units — SHARED --------------------------------------------------------------------
  // The same words are counted on several surfaces (« aucune déduction » card, AI section). Writing
  // them at each call was a guarantee that one place would end up agreeing and the other not — which
  // was EXACTLY the state before this pass.
  UI_UNITS: UNITS,

  // --- Identity and contact (shared by several surfaces) ----------------------------------------
  // `contactMail` was written TWICE (footer and « aucune déduction » card): an address
  // that changes would have started to diverge.
  UI_BRAND: {
    name: 'PanoptiCool',
    contactMail: 'yuya@panopti.cool',
    githubUrl: 'https://github.com/lagayayuya/PanoptiCool',
  },

  // --- Root (`pages/index.astro`) ----------------------------------------------------------------
  // The root sends to the default language. This text is seen ONLY if the automatic redirect
  // does not fire (redirect disabled, bot, connection cut mid-flight): it is a net, not
  // a screen. It stays written here anyway — "no literal visible in a component" does not
  // relax because a text is rare, otherwise the rule no longer means anything.
  UI_ROOT: {
    title: 'PanoptiCool',
    description: 'PanoptiCool — découvre ce que tes réseaux savent de toi.',
    fallbackLink: 'Continuer vers PanoptiCool →',
  },

  // --- <head> of the pages (`layouts/Page.astro` via `ui/head-copy.ts`) --------------------------
  // The title and the description of a page are the ONLY prose a search engine and a share
  // preview really read — and until this group existed they were hard-coded in each of the eight
  // `.astro` files, i.e. OUTSIDE the ratifiable perimeter. A reviewer auditing "everything the
  // product says" did not see them.
  //
  // They could not simply read `copy.ts`: that selector resolves the language by reading
  // `document.documentElement.lang`, which does not exist in Node at build time — an English page
  // would have emitted a FRENCH title. `head-copy.ts` therefore takes the locale as a PARAMETER,
  // exactly as `engine/wording.ts` does and for the same reason. The prose stays here; only the
  // resolution differs.
  UI_HEAD: {
    homeTitle: 'PanoptiCool — Découvre ce que TikTok et Instagram savent de toi.',
    homeDescription:
      "PanoptiCool ouvre ton export TikTok ou Instagram dans ton navigateur et te le rend lisible — 100 % local, rien n'est envoyé.",
    analyseTitle: 'PanoptiCool — ce que TikTok pourrait déduire',
    analyseDescription:
      'Analyse ton export TikTok entièrement dans ton navigateur : rythmes, thèmes, signaux sensibles — rien ne quitte ta machine.',
    roadmapTitle: 'PanoptiCool — feuille de route',
    roadmapDescription:
      'Ce qui est fait, ce qui arrive : les étapes de PanoptiCool, une plateforme à la fois.',
    legalTitle: 'PanoptiCool — mentions légales',
    legalDescription: 'Éditeur, hébergeur, et ce que PanoptiCool ne collecte pas.',
    // The alternative text of the share image. It was written ONCE, in French, in
    // `SiteHead.astro` — so the English tree served a French alt to every preview bot and every
    // screen reader that reached it.
    ogImageAlt:
      'PanoptiCool — découvre ce que tes réseaux savent de toi. 100 % local, open source, sans compte.',
  },

  // --- Site bar (`ui/v2/SiteHeader.tsx`) --------------------------------------------------------
  UI_HEADER: {
    homeAriaLabel: 'PanoptiCool — accueil',
    logoAlt: 'PanoptiCool',
    wordmark: 'PanoptiCool',
    langGroupAriaLabel: 'Langue',
    langFr: 'FR',
    langEn: 'EN',
    /** Tooltip of a language DECLARED but not yet published — no longer « EN » hard-coded: the rule holds
     * for any language one would route without owning it. */
    langUnavailableTitle: 'bientôt disponible',
    githubLabel: 'GitHub',
    githubAriaLabel: 'Voir le code sur GitHub',
    tocAriaLabel: 'Sommaire',
    /** Roadmap link — visible label on desktop, ACCESSIBLE NAME of the icon on mobile. A single
     * entry for the two: the gloss they carried (« — où en est le projet ») was removed from the
     * bar by yuya, and an accessible name that no longer says more than the label is the label. */
    roadmapLabel: 'Feuille de route',
  },

  // --- Footer (`ui/v2/SiteFooter.tsx`) ----------------------------------------------------------
  UI_FOOTER: {
    tagline: 'PanoptiCool — tes données restent chez toi.',
    legalLink: 'Mentions légales',
    credits: 'Développé par Yuya et Claude',
  },

  // --- « pour comprendre » panels (`ui/v2/LearnPanel.tsx`) --------------------------------------
  UI_LEARN: {
    kicker: 'pour comprendre',
    close: 'fermer ✕',
    /** Dotted section-header button — `label` names what the panel explains. */
    open: (label: string) => `comprendre · ${label}`,
  },

  // --- Section 01 · activity (`ui/v2/ActivitySection.tsx`) --------------------------------------
  UI_ACTIVITY: {
    rhythmTitle: "Rythme d'activité",
    rhythmNote: 'ta journée type · heure par heure',
    /** Hour-axis tick marks — axis labels, not engine data. */
    hourMarks: ['0h', '6h', '12h', '18h', '23h'],
    /** « créneau à risque » returns to the legend by decision of the retouched mockup
     * (2026-07-20) — ex-PANO-85, which had removed it. */
    legendNight: 'nuit · créneau à risque',
    legendDay: 'journée',

    // Card-foot counters (2026-07-20 retouch): an approximate number in bold + a label. The
    // total is no longer counted here — it lives as a tile in the volumes.
    counterApprox: (n: string) => `≈ ${n}`,
    counter12MonthsLabel: 'vidéos vues · 12 derniers mois',
    counter30DaysLabel: 'vidéos vues · 30 derniers jours',

    volumesTitle: 'Volumes dans ton export',
    volumesNote: "sur la période couverte par l'export (~1 an)",
    /** `Record` over a CLOSED union (`keyof Volumes`): a volume field without a label does not
     * compile — a stronger guarantee than access by key, and it holds at the DEFINITION point. */
    volumeTileLabels: {
      endorsements: 'likes, favoris et republications',
      comments: 'commentaires postés',
      searches: 'recherches tapées',
      follows: 'comptes suivis',
    } satisfies Record<keyof Omit<Volumes, 'allTime'>, string>,
    /** Tile outside `Volumes`: the total comes from the rhythm (`videosWatched.total`), not the R rules. */
    volumeTileVideosWatched: 'vidéos visionnées',

    opacityTitle: "Ce qu'on peut vraiment analyser",
    /** Fallback when the percentage is non-null but would round to « 0 % » — displaying « 0 % » would say
     * the opposite of the finding (« rien de lisible » instead of « presque rien »). The « 1 % » is PASSED,
     * not written: it comes from the same formatter as the other percentages. */
    opacityUnderOnePercent: (onePercent: string) => `< ${onePercent}`,
    opacityDonutAriaLabel: (pctLabel: string) => `${pctLabel} des items sont lisibles hors-ligne`,
    opacityReadableLegend: (count: string, n: number) =>
      `lisible hors-ligne · ${count} ${UNITS.item(n)}`,
    opacityOpaqueLegend: (count: string, n: number) =>
      `opaque (liens muets) · ${count} ${UNITS.item(n)}`,
    estimateTag: 'estimation',
  },

  // --- Time-spent estimate (`ui/v2/time-estimate.ts`) -------------------------------------------
  // The STRONG finding of the « rythme » card. It uses "tu" (« ta vie »): it is exactly the prose
  // `engine/wording.ts` cannot host, and the reason this file exists.
  UI_TIME_ESTIMATE: {
    /** ≥ 24 h — the total in hours accompanies the count in days (« soit ~Y h »). */
    days: (days: string, dayWord: string, spent: string, hours: string) =>
      `~${days} ${dayWord} de ta vie ${spent} cette année sur TikTok, soit ~${hours} h.`,
    /** < 24 h — HOURS format, without « soit ». */
    hours: (hours: string, hourWord: string, spent: string) =>
      `~${hours} ${hourWord} de ta vie ${spent} cette année sur TikTok.`,
    dayOne: 'jour',
    dayMany: 'jours',
    daySpentOne: 'passé',
    daySpentMany: 'passés',
    hourOne: 'heure',
    hourMany: 'heures',
    hourSpentOne: 'passée',
    hourSpentMany: 'passées',
  },

  // --- 2. HOME (`ui/v2/LandingPage.tsx`) ---------------------------------------------------------
  // Rebuilt on the « Accueil v4 » mockup. What DISAPPEARS with it, and why it is not a loss:
  // `steps` (« Comment ça marche », three numbered cards) and `feats` (« Ce que tu vas découvrir »,
  // three cards) both described the TikTok journey in the abstract. The two platform cards below
  // say the same thing concretely, per connector, and the export guide says the rest — in
  // screenshots rather than in a paragraph. Keeping them would have been three ways of saying
  // « you drop a file and we read it ».
  //
  // ⚠ NO NEWSLETTER, deliberately (yuya's decision). The mockup has a subscribe form; the site is a
  // static build with no server, so the form would either do nothing or hand an address to a third
  // party. A field that pretends to subscribe you is the one thing this product cannot ship.
  UI_LANDING: {
    heroTitle: 'Découvre ce que TikTok et Instagram savent de toi.',
    heroLede:
      'Ces applications doivent te remettre une copie de tout ce qu’elles ont enregistré. PanoptiCool ouvre ce fichier dans ton navigateur et te le rend lisible.',
    trust: ['Gratuit, sans compte', 'Rien n’est envoyé sur internet', 'Code ouvert'],

    // --- The two connector cards ---
    // The bullets say what the READER gets out of each export, not what the engine does. The two
    // lists are deliberately different in nature: an Instagram export is a corpus, a TikTok export
    // is a set of deductions.
    instagramName: 'Instagram',
    instagramLede:
      'Un des exports les plus riches. Contient notamment toutes les photos, vidéos et vocaux que tu as échangés, replacés année par année.',
    instagramBullets: [
      'L’intégralité de tes conversations et des photos échangées',
      'Toutes tes interactions avec les autres comptes',
      'La valeur de ton compte, tes centres d’intérêt et ton identité déduite',
    ],
    instagramOpen: 'Ouvrir mes données Instagram',
    instagramDemo: 'Essayer la démo Instagram',

    tiktokName: 'TikTok',
    tiktokLede:
      'Ce que l’algorithme a pu déduire de toi, sujet par sujet. Se concentre principalement sur les commentaires et recherches effectuées.',
    tiktokBullets: [
      'Toutes tes statistiques et ton rythme d’activité',
      'Les recherches et commentaires listés et analysés, avec ou sans IA',
      'Apprentissage des algorithmes et du marché des données',
    ],
    tiktokOpen: 'Ouvrir mes données TikTok',
    tiktokDemo: 'Essayer la démo TikTok',

    platformSoon: 'YouTube, Google, X arrivent.',
    platformComingSoon: 'Analyse bientôt disponible',

    // --- The right, and what it actually gets you ---
    rightTitle: 'Tu as le droit de récupérer tes données. Encore faut-il pouvoir les lire.',
    rightLaw:
      'Le RGPD oblige Instagram, TikTok ou Google à te remettre une copie de ce qu’ils conservent sur toi, sur simple demande. Le droit fonctionne : l’export arrive.',
    rightArchive:
      'Ce qui arrive, c’est une archive technique : des dossiers de fichiers, conçus pour être conformes, pas pour être parcourus. La transparence s’arrête au format.',
    rightProduct:
      'PanoptiCool ouvre cette archive et la rend lisible : ce que tu as écrit, ce qui a été déduit, et ce que ça permet de reconstituer. Tout se passe dans ton navigateur — tu peux couper internet avant de commencer.',

    // ⚠ TWO ORDERS OF MAGNITUDE, NOT TWO VALUES. The repo's invariant lets a STATISTIC cross the
    // border from a real export, never a value: « +80 000 » is a rounded count, and the account it
    // comes from is the maintainer's own, under consent. The euro figure is an ESTIMATE of what an
    // account yields in advertising — it rests on published ARPU tables, and the reference document
    // that carries them arrives with the Instagram connector. Until then it is a claim this repo
    // cannot source, and that is worth knowing before it is quoted anywhere else.
    statMessages: '+80 000',
    statMessagesLabel: 'messages récupérés depuis un seul compte Instagram.',
    statValue: '500 $',
    statValueLabel:
      'Valeur moyenne de ce qu’un compte Instagram créé il y a 10 ans peut rapporter à Meta.',

    // --- Where the profiles go ---
    marketTitle: 'Ces données ne restent pas où tu crois.',
    marketLede:
      'Un profil publicitaire n’est pas une simple liste de centres d’intérêt : c’est un dossier qui se recoupe, se revend, et qui finit parfois en libre accès sur internet.',
    consequences: [
      {
        kicker: 'Le modèle',
        title: 'Elles se revendent',
        text: 'Régies publicitaires, courtiers en données et applications tierces achètent des segments prêts à l’emploi : « 25-34 ans, connectée la nuit, en recherche de logement ». Tu n’es jamais partie à la transaction.',
      },
      {
        kicker: 'L’accident',
        title: 'Elles fuitent',
        text: 'Aucune base n’est inviolable. En 2021, les informations de plus de 500 millions de comptes Facebook, numéros de téléphone compris, se sont retrouvées en téléchargement libre. Une fuite ne se rétracte pas.',
      },
      {
        kicker: 'L’usage',
        title: 'Elles servent à décider',
        text: 'Un profil ne sert pas qu’à choisir une publicité : il peut orienter un prix, une recommandation, l’ordre de ce que tu vois. Tu subis les conclusions sans jamais pouvoir les relire.',
      },
    ],

    whyKicker: 'pourquoi « panopticool » ?',
    /** ⚠ IMPOSED FRAGMENTS, not chosen: « panopticon » is in ITALICS in the middle of the sentence. An
     * inline markup at the heart of a text cannot hold in a single string — cf. also the modal. */
    whyTextBefore: 'Le panoptique (en anglais, ',
    whyTextItalic: 'panopticon',
    whyTextAfter:
      ') est une prison où un seul gardien peut observer tout le monde sans jamais être vu. Les plateformes fonctionnent un peu pareil, mais ici c’est toi qui observes depuis ton ordinateur, et ça c’est... cool ?',
    whyDemoTikTok: 'Démo TikTok, données fictives →',
    whyDemoInstagram: 'Démo Instagram, données fictives →',

    // --- The two resource rails ---
    // ⚠ THE LINKS ARE PAIRED BY INDEX with the URL spine in `ui/v2/LandingPage.tsx`, exactly as the
    // roadmap steps are — a URL is an address, not prose, and it does not translate. `landing.test.ts`
    // holds the pairing, because nothing else would notice a list gaining an entry on one side only.
    learnKicker: 'Comprendre',
    learnTitle: 'En apprendre plus',
    learnLede:
      'Ce que dit la loi, qui la fait appliquer, et pourquoi la vie privée n’est pas qu’une affaire de gens qui ont des choses à cacher.',
    learnLinks: [
      { name: 'La Quadrature du Net', note: 'Association qui défend les libertés numériques' },
      { name: 'noyb', note: 'Les plaintes collectives contre les géants du web' },
      {
        name: 'Privacy Guides — pourquoi ça compte',
        note: 'Vie privée, secret, anonymat : ce qui les distingue',
      },
    ],

    actKicker: 'Agir',
    actTitle: 'Tester et se protéger',
    actLede:
      'Des outils gratuits pour mesurer ton exposition et choisir des alternatives, à ton rythme.',
    actLinks: [
      { name: 'Have I Been Pwned', note: 'Vérifier si ton adresse a déjà fuité' },
      {
        name: 'Modèle de menace',
        note: 'Cinq minutes pour cerner ce que tu dois vraiment protéger',
      },
      { name: 'Privacy Guides — outils', note: 'Alternatives recommandées, par usage' },
    ],
  },

  // --- Export guide (`ui/v2/ExportGuide.tsx`) ----------------------------------------------------
  // The step-by-step for asking a platform for your file. It is the first obstacle, and by a wide
  // margin: the menu is buried, the JSON format is not the default, and the file takes days to
  // arrive. Everything else in the product is useless to someone who never gets past this.
  //
  // ⚠ THE CAPTIONS DESCRIBE THE SCREENSHOTS, WHICH ARE DATED. `public/guides/**` was captured on
  // 2026-07-31; a platform that moves a menu makes these sentences false while every test stays
  // green — no net can see that. When a step stops matching, three things move together: the
  // screenshot, its caption here, and the rectangle framing the control in `ui/v2/ExportGuide.tsx`.
  //
  // The number of steps DIFFERS BY PLATFORM (TikTok 6, Instagram 7) and that is not an oversight:
  // the two flows do not have the same number of screens. The component reads the array's length.
  UI_GUIDE: {
    openLabel: 'Comment accéder à mes données',
    pickTitle: 'Tu veux récupérer quel fichier ?',
    pickLede: 'La demande se fait dans l’application, en quelques étapes.',
    close: 'Fermer',
    back: 'Retour',
    previous: 'Étape précédente',
    next: 'Étape suivante',
    stepOf: (n: number, total: number) => `Étape ${n} sur ${total}`,
    /** The last dot is NOT a step — it is the slide about the wait. Labelling it « Étape 8 sur 7 »
     * is what a screen reader announced before this key existed. */
    waitDot: 'Et après : l’attente',

    waitTitle: 'Le fichier arrive dans quelques jours.',
    waitText:
      'La plateforme prépare l’archive de son côté. Tu n’as rien à faire d’ici là — mais on oublie facilement une demande faite un jeudi soir.',
    reminderButton: 'Ajouter un rappel à mon agenda',
    reminderNote: 'Une fois téléchargé, ouvre ce fichier et sélectionne ton application d’agenda.',
    reminderSummaryTikTok: 'Récupérer mon export TikTok',
    reminderSummaryInstagram: 'Récupérer mon export Instagram',
    reminderDescription:
      'Le fichier devrait être prêt. Récupère le .zip dans l’application, puis dépose-le sur PanoptiCool.',

    tiktok: {
      label: 'TikTok',
      lede: 'Six étapes dans l’application. Le format JSON n’est pas celui proposé par défaut.',
      steps: [
        {
          text: 'Ouvre ton profil, puis le menu ☰ en haut à droite.',
          alt: 'L’onglet Profil de TikTok, avec l’icône du menu en haut à droite.',
        },
        {
          text: 'Descends tout en bas du menu, jusqu’à « Paramètres et confidentialité ».',
          alt: 'Le menu latéral de TikTok, ouvert sur la ligne « Paramètres et confidentialité ».',
        },
        {
          text: 'Dans la section « Compte », ouvre « Compte ».',
          alt: 'L’écran Paramètres et confidentialité, avec la section Compte.',
        },
        {
          text: 'Tout en bas de la liste : « Télécharger tes données ».',
          alt: 'L’écran Compte, avec la ligne « Télécharger tes données » en bas.',
        },
        {
          text: 'Choisis le format JSON — c’est celui que PanoptiCool lit — puis « Tout sélectionner ».',
          alt: 'Le sélecteur de format ouvert sur JSON, et les dix catégories cochées.',
        },
        {
          text: 'Valide, puis reviens quelques jours plus tard dans l’onglet « Télécharger les données » pour récupérer le .zip.',
          alt: 'L’onglet « Télécharger les données », avec la demande en cours.',
        },
      ],
    },

    instagram: {
      label: 'Instagram',
      lede: 'Sept étapes. Pense à demander « Depuis le début » : par défaut, Meta ne donne qu’un an.',
      steps: [
        {
          text: 'Ouvre « Paramètres et activité », puis « Espace Comptes » tout en haut.',
          alt: 'L’écran Paramètres et activité d’Instagram, avec Espace Comptes en premier.',
        },
        {
          text: 'Dans Espace Comptes : « Vos informations et autorisations ».',
          alt: 'Le panneau Espace Comptes, avec la ligne « Vos informations et autorisations ».',
        },
        {
          text: 'Ouvre « Exporter vos informations ».',
          alt: 'L’écran « Vos informations et autorisations », avec « Exporter vos informations ».',
        },
        {
          text: 'Appuie sur « Créer une exportation ».',
          alt: 'L’écran Exporter vos informations, avec le bouton « Créer une exportation ».',
        },
        {
          text: 'Choisis « Exporter sur mon appareil » — pas vers un service externe.',
          alt: 'L’écran « Choisir où exporter », avec les deux destinations possibles.',
        },
        {
          text: 'Règle les trois lignes : période « Depuis le début », format JSON, et qualité inférieure pour que l’archive reste ouvrable.',
          alt: 'L’écran des options, réglé sur Depuis le début, JSON et qualité inférieure.',
        },
        {
          text: 'Valide. Meta prépare le fichier et t’envoie un lien par e-mail — compte quelques jours.',
          alt: 'L’onglet Activité en cours, avec la demande en attente.',
        },
      ],
    },
  },

  // --- 2 bis. Consent modal (`LandingPage.ConsentModal`) -----------------------------------------
  // The product's front door: it is IT that warns of what one is about to look at. A separate
  // group because it is reread as a block — it is the most sensitive text of the page.
  // ⚠ Its three bullets carry BOLD passages in the middle of the sentence: the fragments are therefore
  // imposed. They are named in reading order to stay rereadable end to end.
  UI_CONSENT: {
    dialogAriaLabel: 'Avant de continuer',
    kicker: 'avant de continuer',
    closeAriaLabel: 'Fermer',
    title: 'Tu vas regarder tes données de très près.',

    line1Before: 'Ton export contient des données ',
    line1Strong: 'personnelles, parfois sensibles ou intimes',
    line1Middle:
      ' : messages, recherches, horaires nocturnes, lieux. Les voir rassemblées et interprétées peut être ',
    line1Strong2: 'déstabilisant',

    line2Before: 'Tout est analysé ',
    line2Strong: 'localement, dans ton navigateur',
    line2After: '. Rien n’est envoyé, rien n’est conservé après fermeture de l’onglet.',

    line3Before: 'Si tu es sur un ',
    line3DeviceDesktop: 'ordinateur partagé ou public',
    line3DeviceMobile: 'téléphone partagé',
    line3After: ', pense à fermer l’onglet et supprimer le fichier d’export après usage.',

    consentCheckbox:
      'J’ai compris la nature de ces données et je choisis de consulter mon analyse.',
    continueButton: 'Continuer vers l’export →',
    laterButton: 'Pas maintenant',
  },

  // --- 2 bis. ROADMAP · `ui/v2/RoadmapPage.tsx` -------------------------------------------------
  // The page reached from the site bar. Only the PROSE lives here.
  //
  // THE STATUS OF EACH STEP IS NOT IN THIS FILE, and that is deliberate: « terminé / en cours /
  // prévu » is a fact about the project, identical in every language, and a fact written twice
  // starts diverging the day one of the two is updated. Its home is the spine `ROADMAP_STEPS`
  // of the component, which also carries the order. Here, the prose of each step, in the same
  // order — the two lists are held at the same length by `ui/v2/roadmap.test.ts`, which no type
  // can do (`typeof` of an array gives `T[]`, not a tuple).
  //
  // The tag WORDS, for their part, are prose: they are keyed by status, below.
  UI_ROADMAP: {
    kicker: 'feuille de route',
    // The title is written in TWO LINES because the mockup breaks it there: the break is part of
    // the balance of the block, not of the sentence. Joined by a space, it reads the same.
    titleLine1: 'Ce qui est fait,',
    titleLine2: 'ce qui arrive',
    lede: 'L’objectif est d’avancer une plateforme à la fois, en prenant le temps de proposer une analyse cohérente, accessible et pédagogique adaptée à chaque plateforme.',

    /** The tag of a step, keyed by its status (the spine names the status, this file names it). */
    statusDone: 'Terminé',
    statusNow: 'En cours',
    statusNext: 'Prévu',

    steps: [
      {
        date: 'mai 2026',
        title: 'Analyse TikTok via lexique et IA locale',
        text: 'Déposer son export et découvrir ce qu’il révèle : rythmes, centres d’intérêt, signaux sensibles. Tout se passe dans le navigateur, rien n’est envoyé.',
      },
      {
        date: 'juillet 2026',
        title: 'Version anglaise',
        text: 'Traduction intégrale de la machinerie, des lexiques, du site et du dépôt GitHub, du français vers l’anglais.',
      },
      {
        date: '31 juillet 2026',
        title: 'Analyse Instagram',
        text: 'L’export Instagram est beaucoup plus riche que celui de TikTok, ce qui implique une tout autre logique pour rendre ces données accessibles : carte des localisations, analyse des conversations…',
      },
      {
        date: 'à venir',
        title: 'Extension de navigateur pour supprimer automatiquement son contenu',
        text: 'L’export Instagram peut contenir les messages et les médias — photos, vidéos, audios — envoyés dans les discussions, ce qui le rend particulièrement sensible. L’objectif de cette extension : sélectionner depuis PanoptiCool ce que tu veux désenvoyer, puis la laisser supprimer automatiquement le contenu sélectionné.',
      },
      {
        date: 'à venir',
        title: 'Générateur d’email pour retrait partiel des données RGPD / CCPA',
        text: 'Génération d’un email personnalisé à partir des données sélectionnées sur PanoptiCool et d’autres catégories recommandées afin de réduire la quantité de données conservées par les plateformes sans avoir à supprimer son compte.',
      },
    ],

    helpKicker: "envie d'aider ?",
    helpTitle: 'Ce que je n’aurai pas le temps de faire seul',
    helpLede:
      'Quelques exemples de ce sur quoi un coup de main serait précieux, sans que cette liste soit exhaustive ni classée par priorité.',
    helpItems: [
      'Enrichir les lexiques d’analyse, en français comme en anglais : proposer des mots, des expressions, des variantes familières. Aucune compétence technique requise.',
      'Éplucher ton propre export pour repérer ce qu’on pourrait encore en tirer. L’analyse TikTok a été construite à partir du mien, où beaucoup de champs étaient vides : je n’ai jamais publié de contenu et la personnalisation publicitaire est désactivée sur mes comptes, des sections entières restent donc inexplorées. Ne m’envoie pas ton export, dis-moi juste ce que tu y trouves.',
      'Et plus largement : un retour, un bug, une formulation qui cloche, une critique, un conseil ou une idée.',
    ],
    helpGithub: 'Consulter le dépôt GitHub',
    helpContact: 'Me contacter',
  },

  // --- 3. ANALYSIS · upload, loading, failures (`ui/v2/AnalysisPage.tsx`) ------------------------
  UI_ANALYSE: {
    /** Drop zone. The verb changes with the device: one does not « glisse » with a finger. */
    kicker: 'analyse locale',
    titleDesktop: 'Dépose ton export TikTok',
    titleMobile: 'Choisis ton export TikTok',
    ledeLead: "Le fichier est lu et analysé entièrement sur cet appareil — il n'en sort jamais. ",
    ledeDesktop: 'Glisse le .zip reçu de TikTok, ou clique pour le choisir.',
    ledeMobile:
      'Sélectionne le .zip reçu de TikTok (souvent dans « Fichiers » ou « Téléchargements »).',
    dropMain: 'Glisse ton export ici',
    dropSub: 'ou clique pour choisir le fichier (.zip)',
    pickButtonMobile: 'Choisir mon fichier .zip',

    loadingMain: 'Analyse en cours…',
    loadingSub: "tout se passe sur cet appareil, rien n'est envoyé.",

    hintLead:
      "Pas encore d'export ? Dans l'app TikTok : Profil → Paramètres → Compte → Télécharger tes données (format JSON). ",
    hintDemoLink: 'Ou essaie avec des données fictives →',

    /** Site-bar badge once the analysis is rendered. Deliberately DISTINCT from `kicker`
     * above even though « analyse locale » repeats in it: they are two interface roles, and
     * confusing them would move one by changing the other. The repetition is VISIBLE here, thus arbitrable. */
    badgeDemo: 'démo · données fictives',
    badgeReal: 'analyse locale',

    /** MOBILE table of contents (chips) — shorter labels than those of the desktop TOC (`UI_RESULTS`),
     * for lack of room at 390 px. Two sets on purpose, not a divergence. */
    tocActivity: 'Activité',
    tocDeductions: 'Déductions',
    tocSummary: 'Résumé',
    tocAi: 'IA locale',

    // --- Failure messages (`errorMessage`) ---
    errorTooLarge: (size: string, limit: string) =>
      `Export trop volumineux pour cette version (${size}, limite ${limit}).`,
    errorMegabytes: (n: string) => `${n} Mo`,
    errorValidate:
      'La structure de cet export ne correspond pas à ce qui est attendu — certaines sections diffèrent ou manquent.',
    errorNoJson:
      'Format non pris en charge : aucun export JSON trouvé dans l’archive. PanoptiCool lit uniquement le format JSON — vérifie ce choix lors de la demande d’export à TikTok.',
    errorUnreadable:
      'Fichier illisible ou corrompu : vérifie que tu as bien sélectionné le .zip de ton export TikTok.',
    errorUnexpected: 'Impossible d’analyser ce fichier.',
  },

  // --- Deduction cards (`ui/v2/ThemeCardNavy.tsx`) -----------------------------------------------
  // 2026-07-20 iteration (design v4, user tests): the confidence apparatus is REMOVED from
  // the display — no more legend, bullets nor « confiance moyenne / incertaine » on the cards.
  // The word added confusion for little gain; the framing (« des hypothèses, pas un
  // verdict ») now lives in the intro of section 02 (`UI_RESULTS.sec02Framing`). The ENGINE,
  // for its part, keeps `confidence`: the card ranking (`compareCards`) reads the same level
  // as before — only the display has moved.
  UI_CARD: {
    /** Badge of a sensitive finding (D1). */
    sensitiveTag: 'sensible',
    /** Closed header: « N sources » — DISTINCT pieces of evidence, the only number the card announces. */
    headSources: (n: number) => `${n} ${plural(n, 'source', 'sources')}`,

    /** Channel of a piece of evidence — CLOSED union (`Evidence['channel']`), cf. the component's `Record`. */
    channelSearch: 'recherche',
    channelComment: 'commentaire',

    fanMain: 'principale',
    fanSecondary: 'secondaire',

    /** Uniform title of an inference (2026-07-20 retouch): when the evidence carries a
     * fan, it replaces the claim — the fan IS the reading. Without a claim or a fan, the
     * « aucune » variant holds the line rather than making it disappear. */
    readingsHeading: 'Plusieurs lectures pertinentes.',
    readingsHeadingNone: 'Aucune lecture pertinente.',

    sourceReused: 'recoupé',
    sourceReuseLead: '↳ aussi exploité par : ',

    usageTitle: 'Ce qui peut en être fait — selon qui y accède',
  },

  // --- Results view (`ui/v2/ResultsView.tsx`) ----------------------------------------------------
  UI_RESULTS: {
    kicker: 'résultats d’analyse',
    /** Mobile + demo: the header badge has no room, the info moves into the kicker. */
    kickerDemo: 'résultats d’analyse · démo, données fictives',
    heroTitleLine1: 'Ce que TikTok',
    heroTitleLine2: 'pourrait déduire',
    heroLede:
      'À partir de ce que tu cherches, regardes et commentes, TikTok essaie de deviner des choses sur toi. Ce sont des suppositions, pas des certitudes.',
    heroSub:
      'Quatre étapes, du plus factuel au plus interprété : ton activité brute, puis les déductions thème par thème — chacune reliée aux données exactes qui la nourrissent.',

    tocAriaLabel: 'Sommaire',
    tocTitle: 'sommaire',

    tocActivity: 'Ton activité',
    tocDeductions: 'Déductions',
    tocSummary: 'En résumé',
    tocAi: 'IA locale',

    sec01Title: 'Ton activité en chiffres',
    sec01Sub: "Quand tu utilises l'app, et combien de traces tu laisses.",
    sec01LearnLabel: 'les métadonnées',
    sec02Title: 'Déductions par thème',
    /** The verb changes with the device: one does not « clique » on a phone. */
    sec02Sub: (tapVerb: string) =>
      `Ce que l'algorithme pourrait conclure, thème par thème. ${tapVerb} une carte pour voir les preuves :`,
    /** The section's FRAMING — this is where what the confidence apparatus said
     * (clumsily) card by card lives: hypotheses, never a verdict (ADR-0003).
     * ⚠ IMPOSED FRAGMENTS: « surlignage » carries the style of the highlight itself, « principale » the
     * tint of the main reading — two example-words at the heart of the sentence (mockup). */
    sec02FramingLead:
      'Ces déductions sont des hypothèses, elles illustrent ce qu’un algorithme pourrait inférer, sans garantie de fiabilité. Elles ne disent rien de qui tu es vraiment. Le ',
    sec02FramingHighlightWord: 'surlignage',
    sec02FramingMiddle: ' montre le mot repéré, et chaque source propose une lecture ',
    sec02FramingPrimaryWord: 'principale',
    sec02FramingTail: ' et une secondaire — ou plusieurs à égalité quand rien ne tranche.',
    sec02TapVerbMobile: 'Touche',
    sec02TapVerbDesktop: 'Clique sur',
    sec02LearnLabel: 'l’algorithme',
    sec03Title: 'En résumé',
    sec03LearnLabel: 'le marché des données',

    summaryLede:
      'Prises une à une, ces données sont banales. Recoupées, elles dessinent un profil — et une même donnée anodine nourrit plusieurs lectures à la fois.',
    summaryDataTypesTitle: 'Types de données lues',
    summaryDataTypes: [
      'recherches',
      'commentaires',
      'métadonnées de session',
      'interactions',
      'visionnage',
    ],
    summaryActorsTitle: 'Ce que des acteurs comme TikTok ou des agrégateurs peuvent en tirer',
    summaryActorTakeaways: [
      'centres d’intérêt et habitudes de consommation',
      'disponibilité, fatigue, fenêtres d’attention exploitables',
      'signaux sensibles — santé mentale, opinion politique, conflictualité — assortis d’un niveau de confiance',
      'des segments revendables à des annonceurs, courtiers de données, voire autorités',
    ],
  },

  // --- Educational panels of the results view ----------------------------------------------------
  // STATIC content taken from the mockup (validated by yuya in Claude Design) — not an engine
  // template. Three panels, one per collapsible section.
  UI_LEARN_PANELS: {
    rhythm: {
      question: 'Pourquoi mes horaires intéressent-ils TikTok ?',
      columns: [
        {
          title: 'Ce qui est mesuré',
          text: 'Chaque ouverture de l’app, chaque vidéo et chaque pause est horodatée. Ce ne sont pas tes contenus : ce sont des métadonnées — des données sur ton comportement.',
        },
        {
          title: 'Ce que ça permet',
          text: 'Mises bout à bout, elles dessinent ton rythme de vie : sommeil, trajets, moments creux. L’algorithme s’en sert pour te solliciter quand tu es le plus réceptif.',
        },
        {
          title: 'Pourquoi c’est sensible',
          text: 'Ces traces paraissent anodines, mais elles révèlent fatigue, insomnie ou disponibilité — des états exploitables commercialement, sans que tu aies rien « publié ».',
        },
      ],
    },
    deductions: {
      question: 'Comment un algorithme « devine »-t-il ?',
      columns: [
        {
          title: 'Par comparaison',
          text: 'Il ne comprend pas tes mots : il compare tes traces à celles de millions d’autres comptes. Si ceux qui cherchent X font souvent Y, tu es rangé dans la case Y.',
        },
        {
          title: 'Avec un score',
          // « interne » and nothing else: since the 2026-07-20 iteration, the page no longer displays
          // levels (« moyenne / incertaine » removed everywhere) — this panel can therefore no longer
          // refer to mentions the reader will see nowhere.
          text: 'Chaque déduction porte un niveau de confiance interne : plus les signaux se recoupent, plus le score monte.',
        },
        {
          title: 'Donc faillible',
          text: 'C’est une corrélation statistique, pas une preuve : chercher « aider quelqu’un qui déprime » ne dit pas qui déprime. Mais la case, elle, reste attachée au profil.',
        },
      ],
      footnote:
        'Et PanoptiCool, dans cette section ? Rien de tout ça : on repère simplement tes mots dans des lexiques thématiques (cuisine, santé, politique…) — c’est le surlignage que tu vois. Bien plus rudimentaire que les modèles des plateformes, mais ça suffit à montrer le principe.',
    },
    market: {
      question: 'Où vont ces profils ensuite ?',
      columns: [
        {
          title: 'Enchères en temps réel',
          text: 'À chaque contenu affiché, des annonceurs enchérissent en quelques millisecondes pour toucher ton profil. Les segments (« cuisine », « anxiété probable ») fixent le prix.',
        },
        {
          title: 'Courtiers de données',
          text: 'Des intermédiaires agrègent des segments venus de dizaines d’apps et les revendent — à des marques, des assureurs, parfois des autorités.',
        },
        {
          title: 'Tes droits (RGPD)',
          text: 'En Europe, tu peux demander l’accès à tes données, leur effacement, et t’opposer au profilage. L’export que tu analyses ici vient de ce droit d’accès.',
        },
      ],
    },
  },

  // --- Section 04 · local AI (`ui/v2/AiSection.tsx`) --------------------------------------------
  UI_AI: {
    kicker: '04 · aller plus loin',
    title: 'Analyser avec une IA locale',
    localBadge: '100 % local et gratuit',
    learnLabel: 'le modèle',
    lede: "Le modèle tourne sur ton ordinateur : rien n'est envoyé sur Internet. Trois étapes — installer, choisir un prompt, lancer.",

    // --- « peu de données » banner ---
    lowDataCounts: (comments: number, searches: number) =>
      `Ton export contient très peu de texte : ${comments} ${UNITS.comment(comments)} et ${searches} ${UNITS.search(searches)}.`,
    lowDataText: (threshold: number) =>
      `En dessous de ${threshold} items, chaque phrase pèse trop lourd : le modèle va sur-interpréter et tirer des conclusions fragiles. Tu peux quand même lancer l'analyse — lis simplement le résultat comme une hypothèse, pas comme un portrait.`,
    lowDataCountSuffix: ' — très peu de données',
    lowDataHint: 'Peu de données : le résultat sera indicatif, à lire avec recul.',

    // --- Browser banner (before step 1) ---
    // ADR-0006: three engines, three discourses — Firefox asks on its own, Chromium requires without
    // offering, WebKit cannot work. The banner says it BEFORE the person installs
    // anything, and replaces the ex-pill « bloqué par le navigateur » (removed: it
    // also showed when the block was not the cause).
    browserFallbackName: 'ton navigateur',
    bwCompatTitle: (browser: string) => `Tu navigues avec ${browser} : compatible.`,
    bwCompatTextFirefox:
      'Ce navigateur sait se connecter à un modèle qui tourne chez toi. Il demandera simplement ton accord au premier contact : une petite fenêtre apparaîtra en haut à gauche, sous la barre d’adresse — clique « Autoriser ».',
    /** Chromium NEVER opens the window on its own (ADR-0006, decision 3): we give the manual
     * path straight away, rather than letting one watch for a dialog that does not come. */
    bwCompatTextChromium:
      'Ce navigateur sait se connecter à un modèle qui tourne chez toi — mais il ne te le proposera pas de lui-même : si la connexion échoue, clique sur l’icône à gauche de l’adresse de ce site, mets « Réseau local » sur « Autoriser », puis recharge la page.',
    bwBlockedTitle: (browser: string) =>
      `Tu navigues avec ${browser} : ce site ne pourra pas voir le modèle sur ta machine.`,
    bwBlockedText: (browser: string) =>
      `${browser} bloque les connexions d’un site web vers ta propre machine, sans offrir de l’autoriser. Deux solutions : rouvrir cette page dans Firefox, Chrome, Brave ou Edge — ou suivre l’option B ci-dessous. L’option A est désactivée, l’option B fonctionne partout.`,
    /** Unrecognized browser: we name NO cause (ADR-0006, decision 4) — neither compatible,
     * nor blocked. Option A stays open, option B is the safe outcome. */
    bwUnknownTitle: 'Navigateur non reconnu.',
    bwUnknownText:
      'Impossible de dire si ton navigateur laisse un site joindre un modèle sur ta machine. Essaie l’option A ; si elle échoue, l’option B fonctionne partout.',

    // --- localhost mode (the site is served from the machine, route B completed) ---
    readyTitle: 'Tout est prêt : le site et le modèle tournent déjà sur ta machine.',
    readyText:
      'Rien à installer. Passe directement à l’étape 2 pour choisir ton prompt, puis lance l’analyse.',

    // --- Step 1 · install ---
    step1Label: 'Installer',
    osPickLabel: 'ton système :',

    termClosed: 'jamais ouvert de terminal ? ▾',
    termOpened: 'jamais ouvert de terminal ? ✕',
    termIntro:
      'Un terminal, c’est une simple fenêtre où tu colles du texte et tu appuies sur Entrée. Les commandes de cette page ne peuvent rien casser sur ton ordinateur.',
    termHowLead: (osLabel: string, how: string) => `Pour l’ouvrir sur ${osLabel} : ${how}`,
    /** `Record` over the CLOSED union of OSes: a system added without its instructions does not compile. */
    termHows: {
      macos: 'appuie sur ⌘ + Espace, tape « Terminal », puis Entrée.',
      windows: 'ouvre le menu Démarrer, tape « PowerShell », puis Entrée.',
      linux: 'appuie sur Ctrl + Alt + T, ou cherche « Terminal » dans tes applications.',
    } satisfies Record<Os, string>,

    step1InstallText:
      'Ouvre un terminal et colle cette commande : elle installe llama.cpp, le petit moteur libre qui fait tourner le modèle. Même commande quel que soit le chemin choisi ensuite :',
    /** ⚠ IMPOSED FRAGMENTS: « brew.sh » is a link at the heart of the sentence. */
    brewNoteLead:
      'Commande non reconnue ? Installe d’abord Homebrew — une seule commande, indiquée sur ',
    brewNoteLinkLabel: 'brew.sh',
    brewNoteAfter: '.',
    step1ChooseText:
      'Choisis un modèle, du meilleur au plus léger. Le plus lourd demande le plus de mémoire :',

    // --- Step 1 · the choice of the two routes ---
    routeIntro: 'Dernier choix : deux chemins pour lancer ce modèle, même résultat.',
    routeSiteTitle: 'A · Depuis ce site',
    /** Edge is in the list (ADR-0006: the Chromiums work, padlock included) — the mockup
     * omitted it, the ADR prevails. */
    routeSiteText:
      'Tu restes sur cette page : plus qu’une commande à lancer. Nécessite Chrome, Brave, Edge ou Firefox.',
    routeSiteUnavailable: (browser: string) => `indisponible avec ${browser}`,
    routeLocalTitle: 'B · Tout sur ta machine',
    routeLocalText:
      'Tu télécharges aussi le site : tout tourne en local, avec n’importe quel navigateur — même sans Internet ensuite.',

    // --- Route A · launch the server from this site ---
    step1ServeText:
      'Lance le serveur, il télécharge le modèle au premier lancement, puis reste ouvert en arrière-plan :',
    /** Size of a model. The NUMBER comes from `format.ts`, the UNIT is text and thus lives here —
     * same sharing as `UI_ANALYSE.errorMegabytes`. */
    modelSize: (gb: string) => `${gb} Go`,
    /** The product's judgment on a model — `Record` over the CLOSED union of `ModelChoice['note']`,
     * so a note added without text does not compile. */
    modelNotes: {
      recommended: 'recommandé',
      borderline: 'limite, mais fonctionnel',
    } satisfies Record<NonNullable<ModelChoice['note']>, string>,
    /** The permission note BEFORE the first click, adapted to the recognized browser (ADR-0006) —
     * Firefox will open a window, Chromium never. When the browser is not recognized, the
     * generic version promises nothing. */
    permNoteFirefox: (browser: string) =>
      `Lorsque tu cliqueras sur « vérifier la connexion », ${browser} te demandera l’autorisation d’accéder au réseau local : une petite fenêtre apparaîtra en haut à gauche, sous la barre d’adresse — clique « Autoriser ».`,
    permNoteChromium: (browser: string) =>
      `${browser} ne t’ouvrira PAS de fenêtre d’autorisation : si la vérification échoue, clique sur l’icône à gauche de l’adresse de ce site, mets « Réseau local » sur « Autoriser », puis recharge la page.`,
    permNoteGeneric:
      'Selon ton navigateur, il faudra peut-être l’autoriser à joindre ton ordinateur. Si la connexion échoue, cette page te dira quoi faire.',

    step1AddressLabel: 'adresse du serveur',
    step1AddressAria: 'Adresse du serveur',
    step1Foot:
      "Tu peux changer cette adresse pour pointer vers n'importe quel serveur compatible, et donc faire tourner un tout autre modèle si tu préfères.",
    /** State of the `localhost` probe. « non vérifié » as long as nothing has been attempted: the page
     * contacts the server ONLY on an explicit click (privacy invariant) — except in localhost mode,
     * where the probed server is the one that just served the page. */
    probeOk: 'serveur détecté',
    probeChecking: 'vérification…',
    probeIdle: 'non vérifié',
    /** TWO failure labels, no longer three (2026-07-20 iteration): the ex-pill « bloqué par le
     * navigateur » also showed when the block was not certain. The pill now says
     * only what we KNOW — « non détecté » when the permission was granted (the network was really
     * reached), « connexion impossible » otherwise. The DIAGNOSIS, for its part, lives in the help text
     * under the launch button, where the read permission decides (ADR-0006, decision 2). */
    probeErrorAbsent: 'serveur non détecté',
    probeErrorUnknown: 'connexion impossible',
    probeModelSuffix: (modelId: string) => ` : ${modelId}`,
    /** The SAME label before and after the first probe (2026-07-20 retouch): the ex-glyph ⟳
     * hid the action behind a symbol. */
    probeCheckAction: 'vérifier la connexion',
    probeCheckAria: 'Vérifier la connexion au serveur',

    // --- Route B · download the site and launch everything locally ---
    localDownloadText:
      'Télécharge la version locale du site — ici, ou depuis GitHub si tu veux vérifier le code :',
    localZipButton: (zipName: string) => `⬇ ${zipName}`,
    localGithubLink: 'Vérifier la source sur GitHub ↗',
    localCmdText:
      'Puis colle cette commande dans ton terminal : elle décompresse le site et lance tout ensemble. Le modèle choisi plus haut se télécharge au premier lancement :',
    localCmdExplain:
      'Ce que fait la commande : va dans Téléchargements → décompresse le zip → lance le site et le modèle ensemble.',
    /** ⚠ IMPOSED FRAGMENTS: the address is highlighted at the heart of the sentence. */
    localOpenBefore: 'Quand le terminal affiche « llama_server: listening on... », ouvre ',
    localOpenAfter:
      ' dans n’importe quel navigateur : tu retrouves cette page, servie depuis ta machine et déjà branchée au modèle. L’étape suivante se passe là-bas.',

    // --- Step 2 · prompt & launch (merged card, v4 mockup) ---
    step2MergedLabel: 'Prompt & lancement',
    /** ⚠ IMPOSED FRAGMENTS: same highlighting of the address. */
    step2WaitingBefore:
      'Tu as choisi l’option B « Tout sur ta machine ». Pour continuer, termine les étapes ci-dessus (téléchargement du site et commande dans le terminal), puis ouvre ',
    step2WaitingAfter:
      ' dans un navigateur : tu retrouveras cette section là-bas, prête à lancer l’analyse.',

    // --- Step 2 · prompt ---
    /** Consumed by the MOBILE decorative preview (the mobile mockup keeps the previous 3 cards). */
    step2Label: "Prompt d'analyse",
    step2PresetDefault: 'Prompt par défaut',
    step2PresetSafety: 'Prompt « filet de sécurité »',
    step2PromptAria: "Prompt d'analyse",
    step2ItemsLoading: 'Lecture des commentaires et des recherches…',
    step2ItemsError: (message: string) =>
      `Impossible de relire l'export pour l'analyse IA : ${message}`,
    includedCounts: (comments: number, searches: number) =>
      `${comments} ${UNITS.comment(comments)} · ${searches} ${UNITS.search(searches)} inclus · `,
    tokensExact: (n: string) => `${n} tokens (vérifié)`,
    tokensEstimated: (n: string) => `≈ ${n} tokens`,
    /** The agreement bears on TWO words — the noun and the participle. « 1 items laissés » got it wrong
     * twice; agreeing only the noun would have fixed it halfway. */
    tokensDropped: (dropped: number, contextWindow: string) =>
      ` · ${dropped} ${UNITS.item(dropped)} ${plural(dropped, 'laissé', 'laissés')} de côté (fenêtre de ${contextWindow} tokens)`,
    payloadShow: 'voir exactement ce qui sera envoyé ▾',
    payloadHide: 'masquer ce qui sera envoyé ▴',
    verifyChecking: 'Vérification du nombre exact de tokens auprès du serveur…',
    verifyUnavailable:
      "Ce serveur n'expose pas /tokenize (build ancien) — le compte ci-dessus est une estimation, volontairement pessimiste.",
    recentOnly: (comments: number, searches: number) =>
      `Priorité au plus récent : seuls les commentaires les plus récents tiennent dans la fenêtre du modèle (${comments} ${UNITS.comment(comments)} et ${searches} ${UNITS.search(searches)} au total).`,
    searchesTruncated: (droppedSearches: number) =>
      `Tous les commentaires tiennent, plus les recherches les plus récentes (${droppedSearches} ${UNITS.search(droppedSearches)} ${plural(droppedSearches, 'plus ancienne laissée', 'plus anciennes laissées')} de côté).`,
    /** Raw preview of the payload — technical labels, deliberately not translated. */
    payloadPreview: (systemPrompt: string, userMessage: string) =>
      `[système]\n${systemPrompt}\n\n[items]\n${userMessage}`,

    // --- Step 3 · launch ---
    /** Consumed by the MOBILE decorative preview — the merged desktop card carries `step2MergedLabel`. */
    step3Label: 'Lancer',
    step3Stop: '■ Arrêter',
    step3Run: 'Lancer l’analyse',
    step3Running: 'analyse en cours…',
    /** ⚠ NO LONGER promises a permission window. The browser alone decides to open one, and
     * some never open one (ADR-0006) — the sentence therefore sent one to watch for a dialog that does
     * not come. What remains is what is true: the page only talks to the local server. */
    step3WarnIdle:
      'Serveur non vérifié — lance-le (étape 1) puis clique sur « vérifier la connexion ». Cette page ne contacte que le serveur qui tourne chez toi, et rien d’autre.',
    /** FOUR failure helpers, chosen on what we KNOW (read permission + recognized engine,
     * ADR-0006, decisions 2-4) — never a cause asserted without evidence. */
    step3WarnAbsent:
      'Serveur non détecté — lance-le (étape 1) puis clique sur « vérifier la connexion ».',
    /** The browser KNOWS the permission and did not grant it. We give the exact path, and we
     * warn that it will not offer it: on Chromium the window never opens on its own
     * (ADR-0006), so someone waiting for a dialog waits indefinitely. */
    step3WarnBlocked:
      'Ton navigateur bloque l’accès à ton propre ordinateur — ton serveur, lui, tourne peut-être très bien. Pour l’autoriser : clique sur l’icône à gauche de l’adresse de ce site, mets « Réseau local » sur « Autoriser », puis recharge la page. Ton navigateur ne te le proposera pas de lui-même.',
    /** Firefox recognized, permission unreadable: the spontaneous window is ITS measured behavior
     * (ADR-0006) — we can therefore name it without lying. */
    step3WarnFirefox:
      'Serveur non détecté — lance-le (étape 1). Si Firefox affiche une demande d’autorisation (en haut à gauche, sous la barre d’adresse), accepte-la, puis relance la vérification.',
    /** Neither a readable permission, nor a recognized engine: we name NO cause, and the safe outcome is
     * route B — serving the site from the machine works in all engines (ADR-0006, dec. 5). */
    step3WarnUnknown:
      'Impossible de dire si ton serveur est éteint ou si ton navigateur a bloqué la connexion. Vérifie d’abord que le serveur tourne (étape 1). S’il tourne, c’est ton navigateur — l’option B « Tout sur ta machine » fonctionne partout.',
    runInterrupted: 'Analyse interrompue (sortie partielle) — ',
    runStats: (promptTokens: string, completionTokens: string, seconds: string) =>
      `${promptTokens} tokens lus · ${completionTokens} générés · ${seconds} s`,
    runElapsed: (seconds: string) => `${seconds} s`,
    runThroughput: (tokPerSec: string) => ` · ${tokPerSec} tok/s`,

    copyButton: 'copier',
    copyButtonDone: 'copié ✓',
    /** The command row copies on click — the label is no longer a button, the aria says so. */
    copyCommandAria: 'Copier la commande',
  },

  // --- « pour comprendre » panel of the AI section -----------------------------------------------
  UI_AI_LEARN: {
    question: 'Comment fonctionne le modèle qui tourne chez toi ?',
    columns: [
      {
        title: 'Prédire le mot suivant',
        text: 'Un modèle de langage ne « pense » pas : il prédit le fragment de mot le plus probable, des milliers de fois de suite. C’est ce flux que tu vois s’écrire.',
      },
      {
        title: 'Tokens',
        text: 'Ton texte est découpé en « tokens » (~¾ de mot chacun). C’est l’unité comptée partout ici : taille du prompt, vitesse en tok/s, longueur de la réponse.',
      },
      {
        title: 'Quantisation (Q4, Q3…)',
        text: 'Les variantes proposées sont le même modèle plus ou moins compressé pour tenir dans ta mémoire. Plus c’est compressé, plus c’est léger — et moins c’est fin.',
      },
      {
        title: 'Local = privé',
        text: 'Le modèle est un simple fichier sur ton disque. Une fois téléchargé, tu peux couper Internet : l’analyse fonctionne toujours, et rien ne sort de ta machine.',
      },
    ],
  },

  // --- Section 04 in MOBILE variant (`AiMobileNotice`) -------------------------------------------
  // Local AI requires a computer: on mobile, an explanatory callout replaces the section, followed
  // by a DECORATIVE PREVIEW (aria-hidden) of the three steps.
  UI_AI_MOBILE: {
    sectionNumber: '04',
    calloutTitle: "L'analyse par IA n'est disponible que sur ordinateur pour l'instant.",
    calloutText:
      "Le modèle tourne localement sur ta machine et demande un ordinateur. Ouvre PanoptiCool sur ton ordi pour cette étape — rien ne change pour le reste de l'analyse.",
    /** FROZEN values of the decorative preview: they IMITATE `MODEL_CHOICES` without reading it, so that the
     * thumbnail stays stable if the model catalog moves. They are props, not data. */
    previewCommand: 'brew install llama.cpp',
    previewModelOn: 'UD-Q4_K_XL',
    previewModelOff: 'IQ4_XS',
    /** Preview sizes: NUMBERS, formatted at render like those of the real table — a
     * comma frozen into a string would escape the central formatting (cf. `ModelChoice.sizeGb`).
     * They stay DELIBERATELY independent of `MODEL_CHOICES`: the thumbnail is a frozen prop,
     * it must not move when the model catalog changes. */
    previewModelOnSizeGb: 2.2,
    previewModelOffSizeGb: 2.0,
    previewPrompt:
      "Tu es un analyste. À partir des recherches et commentaires TikTok ci-dessous, déduis prudemment : centres d'intérêt, habitudes, rythme de vie…",
  },

  // --- « aucune déduction » edge case (`ui/v2/NoDeductionCard.tsx`) -------------------------------
  UI_NO_DEDUCTION: {
    title: 'Aucune déduction ne ressort de ton export',
    /** Two possible reasons, chosen on the VOLUME of available text (`lowData`). */
    reasonLowData:
      'La raison la plus probable : ton export contient très peu de texte à lire — presque rien à comparer aux lexiques thématiques (cuisine, santé, politique…). Ce n’est pas une anomalie, juste un manque de matière.',
    reasonNoMatch:
      'Ton export contient pourtant du texte : c’est ton vocabulaire qui ne recoupe pas les thèmes que PanoptiCool sait repérer (cuisine, santé, politique…). Nos lexiques sont rudimentaires, tu peux nous aider à les compléter, plus bas.',
    warn: "Ça ne veut pas dire que TikTok ne déduit rien : l'export ne montre que ~26 % des données collectées, et leurs modèles analysent bien plus finement que nos lexiques.",

    dataTitle: 'Tes données, quand même',
    dataCounts: (searches: number, comments: number) =>
      `${searches} ${UNITS.search(searches)} · ${comments} ${UNITS.comment(comments)}`,
    dataToggleOpen: 'consulter ▾',
    dataToggleClose: 'masquer ▴',
    dataColSearches: 'recherches',
    dataColComments: 'commentaires',
    dataEmptySearches: "aucune recherche dans l'export",
    dataEmptyComments: "aucun commentaire dans l'export",
    /** The verbatims are wrapped in French quotation marks — the item itself comes from the export. */
    dataQuote: (text: string) => `« ${text} »`,
    dataFoot:
      "C'est exactement ce texte que nos lexiques ont parcouru sans trouver de correspondance.",

    enrichTitle: 'Aide-nous à enrichir le vocabulaire',
    enrichText:
      "Ton export contient du texte, mais nos lexiques ne l'ont pas reconnu. Si tu repères dans tes données des mots qu'on aurait dû comprendre, propose-les anonymement : ils profiteront à tout le monde. Rien n'est envoyé sans ton clic.",
    enrichPlaceholder: 'ex. « batch cooking », « air fryer », « mid » …',
    enrichAriaLabel: 'Mots à proposer',
    enrichGithubButton: 'Proposer sur GitHub',
    enrichMailButton: (mail: string) => `ou par e-mail → ${mail}`,
    /** Pre-filled title and body of the GitHub issue / of the email. NOTHING goes out without a click. */
    enrichIssueTitle: 'Proposition de mots pour les lexiques',
    enrichMailSubject: 'Mots à ajouter aux lexiques PanoptiCool',
    enrichBodyPlaceholder: '(liste tes mots ici)',
    enrichBody: (text: string) => `${text}\n\n—\nProposé depuis la page résultats de PanoptiCool.`,

    tip1Title: 'Vérifie ton export',
    tip1Text: 'Format JSON, toutes les catégories cochées : un export partiel arrive vite.',
    tip2Title: "Essaie l'IA locale",
    tip2Text: 'Elle lit tes données plus finement que les lexiques : ',
    tip2Mobile: 'sur ordinateur, ',
    tip2Link: 'section 04 →',
    tip3Title: 'Reviens plus tard',
    tip3Text: 'Un nouvel export dans quelques semaines contiendra plus de traces à lire.',
  },
};
