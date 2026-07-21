// Copy FR de l'INTERFACE — la prose des composants, en français. Périmètre ratifiable n°2.
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ WORDING PROVISOIRE — À RELIRE PAR yuya, au même titre que `engine/wording.fr.ts`.         │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
//
// CE FICHIER EST L'ORACLE DE FORME du périmètre n°2. `copy.ts` dérive `UiCopy = typeof FR`, et
// `copy.en.ts` s'en annote : une entrée ajoutée ici et oubliée en anglais est une erreur de
// COMPILATION.
//
// ⚠ NE PAS ANNOTER LES GROUPES `Readonly<Record<string, string>>` ni les figer `as const`. Le
// premier efface les clés du type et laisse compiler une traduction VIDE (mesuré, cf.
// `engine/wording.ts`) ; le second fige les chaînes en types LITTÉRAUX, et l'anglais ne peut alors
// plus satisfaire le français. Les littéraux nus sont le seul point d'équilibre : clés exactes,
// valeurs `string`. Les `satisfies` existants sont conservés — ils VÉRIFIENT sans élargir.
//
// ⚠ LES TABLEAUX NE SONT PAS À PARITÉ DE LONGUEUR. `typeof` d'un tableau donne `T[]`, pas un
// n-uplet : une traduction anglaise peut en fournir 2 là où le français en a 3, et compiler.
// `copy-parity.test.ts` compare les longueurs au RUNTIME — c'est le seul filet sur ce point.
//
// POURQUOI CE PÉRIMÈTRE EST SÉPARÉ DE `engine/wording.*` : `wording.test.ts` y interdit la 2ᵉ
// personne (le moteur ne s'adresse jamais à la personne, ADR-0003), or presque toute phrase
// d'interface tutoie (« ton export », « tu peux »). L'interdiction EXILAIT donc la prose d'interface
// hors du fichier ratifiable. D'où DEUX périmètres, un fichier par langue chacun.
//
// FORME. Un objet PLAT par surface : une clé absente ou mal tapée est une erreur de COMPILATION au
// point d'appel. Les phrases À TROUS sont des FONCTIONS qui rendent la phrase ENTIÈRE — jamais des
// fragments « préfixe » / « suffixe » dont l'espace final serait porteur : un relecteur ne peut pas
// vérifier ce qu'il ne voit pas d'un bloc.
//
// CE QUI N'ENTRE PAS ICI :
//   - les glyphes purement décoratifs (« · », « › », « ▲ ») restent dans le composant — ce n'est
//     pas de la prose, et les extraire nuirait à la lecture du balisage ;
//   - le TEXTE LÉGAL de `pages/fr/mentions-legales.astro` (décision yuya) — c'est un texte de
//     RÉFÉRENCE, qui se lit d'un bloc et non par entrées de table, et dont la version anglaise
//     est une page JUMELLE écrite par un humain, pas des chaînes traduites.
//
// ─── ORDRE DE LECTURE : LE PARCOURS, PAS L'ARBORESCENCE ────────────────────────────────────────
// Les groupes suivent l'ordre dans lequel une personne RENCONTRE les textes, pas l'ordre des
// fichiers. Auditer « tout ce que le produit dit » se fait alors dans le sens où le produit le dit.
//
//   1. VOCABULAIRE PARTAGÉ  — identité, unités comptées, niveaux de confiance
//   1 bis. RACINE           — `pages/index.astro`, la page qui envoie vers une langue
//   2. ACCUEIL              — `ui/v2/LandingPage.tsx`
//   3. ANALYSE              — `ui/v2/AnalysisPage.tsx` (dépôt, chargement, échecs)
//   4. RÉSULTATS            — `ui/v2/ResultsView.tsx` et ses sections
//   5. CHROME               — barre de site, pied de page, panneaux « pour comprendre »

import type { ModelChoice, Os } from '../ai/install-help';
import type { Volumes } from '../engine/analysis';
import { plural } from './format';

// Les unités comptées sont HISSÉES hors du bundle : plusieurs groupes les référencent (section IA,
// carte « aucune déduction »), et une référence croisée n'est pas résoluble à l'intérieur du
// littéral qui la contient.
const UNITS = {
  search: (n: number) => plural(n, 'recherche', 'recherches'),
  comment: (n: number) => plural(n, 'commentaire', 'commentaires'),
  item: (n: number) => plural(n, 'item', 'items'),
};

export const FR = {
  // --- Unités comptées — PARTAGÉES ---------------------------------------------------------------
  // Les mêmes mots se comptent sur plusieurs surfaces (carte « aucune déduction », section IA). Les
  // écrire à chaque appel, c'était garantir qu'un endroit finirait par accorder et l'autre non — ce
  // qui était EXACTEMENT l'état avant cette passe.
  UI_UNITS: UNITS,

  // --- Identité et contact (partagés par plusieurs surfaces) ------------------------------------
  // `contactMail` était écrit DEUX fois (pied de page et carte « aucune déduction ») : une adresse
  // qui change se serait mise à diverger.
  UI_BRAND: {
    name: 'PanoptiCool',
    contactMail: 'yuya@panopti.cool',
    githubUrl: 'https://github.com/lagayayuya/PanoptiCool',
  },

  // --- Racine (`pages/index.astro`) --------------------------------------------------------------
  // La racine envoie vers la langue par défaut. Ce texte n'est vu QUE si la redirection automatique
  // ne part pas (redirection désactivée, robot, connexion coupée en plein vol) : c'est un filet, pas
  // un écran. Il reste écrit ici quand même — « aucun littéral visible dans un composant » ne
  // s'assouplit pas parce qu'un texte est rare, sinon la règle ne veut plus rien dire.
  UI_ROOT: {
    title: 'PanoptiCool',
    description: 'PanoptiCool — découvre ce que tes réseaux savent de toi.',
    fallbackLink: 'Continuer vers PanoptiCool →',
  },

  // --- Barre de site (`ui/v2/SiteHeader.tsx`) ---------------------------------------------------
  UI_HEADER: {
    homeAriaLabel: 'PanoptiCool — accueil',
    logoAlt: 'PanoptiCool',
    wordmark: 'PanoptiCool',
    langGroupAriaLabel: 'Langue',
    langFr: 'FR',
    langEn: 'EN',
    /** Info-bulle d'une langue DÉCLARÉE mais pas encore publiée — plus « EN » en dur : la règle vaut
     * pour toute langue qu'on routerait sans l'assumer. */
    langUnavailableTitle: 'bientôt disponible',
    githubLabel: 'GitHub',
    githubAriaLabel: 'Voir le code sur GitHub',
    tocAriaLabel: 'Sommaire',
  },

  // --- Pied de page (`ui/v2/SiteFooter.tsx`) ----------------------------------------------------
  UI_FOOTER: {
    tagline: 'PanoptiCool — tes données restent chez toi.',
    legalLink: 'Mentions légales',
    credits: 'Développé par Yuya et Claude (Sonnet 5, Opus 4.8 et Fable 5)',
  },

  // --- Panneaux « pour comprendre » (`ui/v2/LearnPanel.tsx`) ------------------------------------
  UI_LEARN: {
    kicker: 'pour comprendre',
    close: 'fermer ✕',
    /** Bouton pointillé d'en-tête de section — `label` nomme ce que le panneau explique. */
    open: (label: string) => `comprendre · ${label}`,
  },

  // --- Section 01 · activité (`ui/v2/ActivitySection.tsx`) --------------------------------------
  UI_ACTIVITY: {
    rhythmTitle: "Rythme d'activité",
    rhythmNote: 'ta journée type · heure par heure',
    /** Graduations de l'axe des heures — libellés d'axe, pas des données du moteur. */
    hourMarks: ['0h', '6h', '12h', '18h', '23h'],
    /** « créneau à risque » revient dans la légende par décision de la maquette retouchée
     * (2026-07-20) — ex-PANO-85, qui l'en avait retiré. */
    legendNight: 'nuit · créneau à risque',
    legendDay: 'journée',

    // Compteurs du pied de carte (retouche 2026-07-20) : nombre approché en gras + libellé. Le
    // total n'est plus compté ici — il vit en tuile dans les volumes.
    counterApprox: (n: string) => `≈ ${n}`,
    counter12MonthsLabel: 'vidéos vues · 12 derniers mois',
    counter30DaysLabel: 'vidéos vues · 30 derniers jours',

    volumesTitle: 'Volumes dans ton export',
    volumesNote: "sur la période couverte par l'export (~1 an)",
    /** `Record` sur une union FERMÉE (`keyof Volumes`) : un champ de volume sans libellé ne compile
     * pas — garantie plus forte que l'accès par clé, et elle vaut au point de DÉFINITION. */
    volumeTileLabels: {
      endorsements: 'likes, favoris et republications',
      comments: 'commentaires postés',
      searches: 'recherches tapées',
      follows: 'comptes suivis',
    } satisfies Record<keyof Omit<Volumes, 'allTime'>, string>,
    /** Tuile hors `Volumes` : le total vient du rythme (`videosWatched.total`), pas des règles R. */
    volumeTileVideosWatched: 'vidéos visionnées',

    opacityTitle: "Ce qu'on peut vraiment analyser",
    /** Repli quand le pourcentage est non nul mais arrondirait à « 0 % » — afficher « 0 % » dirait
     * l'inverse du constat (« rien de lisible » au lieu de « presque rien »). Le « 1 % » est PASSÉ,
     * pas écrit : il vient du même formateur que les autres pourcentages. */
    opacityUnderOnePercent: (onePercent: string) => `< ${onePercent}`,
    opacityDonutAriaLabel: (pctLabel: string) => `${pctLabel} des items sont lisibles hors-ligne`,
    opacityReadableLegend: (count: string, n: number) =>
      `lisible hors-ligne · ${count} ${UNITS.item(n)}`,
    opacityOpaqueLegend: (count: string, n: number) =>
      `opaque (liens muets) · ${count} ${UNITS.item(n)}`,
    estimateTag: 'estimation',
  },

  // --- Estimation du temps passé (`ui/v2/time-estimate.ts`) -------------------------------------
  // Le constat FORT de la carte « rythme ». Il TUTOIE (« ta vie ») : c'est exactement la prose que
  // `engine/wording.ts` ne peut pas héberger, et la raison d'être de ce fichier.
  UI_TIME_ESTIMATE: {
    /** ≥ 24 h — le total en heures accompagne le compte en jours (« soit ~Y h »). */
    days: (days: string, dayWord: string, spent: string, hours: string) =>
      `~${days} ${dayWord} de ta vie ${spent} cette année sur TikTok, soit ~${hours} h.`,
    /** < 24 h — format HEURES, sans « soit ». */
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

  // --- 2. ACCUEIL (`ui/v2/LandingPage.tsx`) ------------------------------------------------------
  UI_LANDING: {
    heroKicker: 'tes exports de données, décodés chez toi',
    heroTitle: 'Découvre ce que tes réseaux savent de toi.',
    heroLede:
      'Chaque plateforme doit te remettre tes données si tu les demandes. PanoptiCool lit ces exports et te montre ce qu’un algorithme pourrait en déduire : tes rythmes, tes centres d’intérêt et les signaux sensibles que tu ne penses pas laisser.',

    pickLabel: 'choisis ta plateforme',
    platformTikTok: 'TikTok',
    platformAvailable: 'disponible',
    platformSoon: 'Instagram, YouTube… bientôt',

    ctaAnalyse: 'Analyser mes données TikTok',
    ctaDemo: 'ou essaie d’abord avec des données fictives →',
    trust: ['100 % local — rien n’est envoyé', 'open source', 'gratuit, sans compte'],

    howTitle: 'Comment ça marche',
    howNote: 'avec TikTok',
    steps: [
      {
        n: '1',
        title: 'Récupère ton export TikTok',
        text: 'Dans l’app : Profil → Paramètres → Compte → Télécharger tes données. Choisis le format JSON — le fichier peut prendre 1 h à 48 h pour être disponible.',
      },
      {
        n: '2',
        title: 'Dépose-le ici',
        text: 'Le fichier est lu directement dans ton navigateur. Il ne quitte jamais ton ordinateur, le code est ouvert si tu veux vérifier.',
      },
      {
        n: '3',
        title: 'Explore les déductions',
        text: 'Rythmes, thèmes, signaux sensibles avec leur niveau de confiance. Et si tu veux, une IA locale pousse l’analyse plus loin.',
      },
    ],

    discoverTitle: 'Ce que tu vas découvrir',
    /** Les trois cartes. Couleurs et bordures restent dans le composant : ce n'est pas de la prose. */
    feats: [
      {
        tag: 'analyse',
        title: 'Ton profil, tel qu’un algorithme le voit',
        text: 'Chaque déduction est reliée aux données exactes qui la nourrissent — recherches, commentaires, métadonnées — avec un score de confiance.',
      },
      {
        tag: 'ia locale',
        title: 'Une IA qui tourne chez toi',
        text: 'Installe un petit modèle open source et fais-lui analyser tes traces. Coupe le wifi si tu veux : tout fonctionne hors ligne.',
        // Sur MOBILE l'analyse locale n'est pas disponible — badge + texte adaptés, pas une omission.
        mobileBadge: 'sur ordinateur',
        mobileText:
          'Installe un petit modèle open source et fais-lui analyser tes traces. Pour l’instant, cette analyse n’est disponible que sur ordinateur.',
      },
      {
        tag: 'pour comprendre',
        title: 'Apprendre en explorant',
        text: 'À chaque section, des explications dépliables : comment un algorithme devine, où vont les profils, ce qu’est un token, tes droits RGPD.',
      },
    ],

    whyKicker: 'pourquoi « panopticool » ?',
    /** ⚠ FRAGMENTS SUBIS, pas choisis : « panopticon » est en ITALIQUE au milieu de la phrase. Un
     * balisage inline au cœur d'un texte ne peut pas tenir en une chaîne — cf. aussi la modale. */
    whyTextBefore: 'Le panoptique (en anglais, ',
    whyTextItalic: 'panopticon',
    whyTextAfter:
      ") est une prison où un seul gardien peut observer tout le monde sans être vu. Les plateformes fonctionnent un peu pareil, mais ici c'est toi qui observes depuis ton ordinateur, et ça c'est... cool?",
    whyLink: 'Voir la démo avec des données fictives →',
  },

  // --- 2 bis. Modale de consentement (`LandingPage.ConsentModal`) --------------------------------
  // La porte d'entrée du produit : c'est ELLE qui prévient de ce qu'on s'apprête à regarder. Groupe
  // séparé parce qu'elle se relit d'un bloc — c'est le texte le plus sensible de la page.
  // ⚠ Ses trois puces portent des passages EN GRAS au milieu de la phrase : les fragments sont donc
  // subis. Ils sont nommés dans l'ordre de lecture pour rester relisibles bout à bout.
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

  // --- 3. ANALYSE · dépôt, chargement, échecs (`ui/v2/AnalysisPage.tsx`) -------------------------
  UI_ANALYSE: {
    /** Zone de dépôt. Le verbe change avec le support : on ne « glisse » pas au doigt. */
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

    /** Badge de la barre de site une fois l'analyse rendue. Volontairement DISTINCT de `kicker`
     * ci-dessus bien que « analyse locale » s'y répète : ce sont deux rôles d'interface, et les
     * confondre ferait bouger l'un en changeant l'autre. La répétition est ici VISIBLE, donc arbitrable. */
    badgeDemo: 'démo · données fictives',
    badgeReal: 'analyse locale',

    /** Sommaire MOBILE (chips) — libellés plus courts que ceux du sommaire desktop (`UI_RESULTS`),
     * faute de place à 390 px. Deux jeux à dessein, pas une divergence. */
    tocActivity: 'Activité',
    tocDeductions: 'Déductions',
    tocSummary: 'Résumé',
    tocAi: 'IA locale',

    // --- Messages d'échec (`errorMessage`) ---
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

    /** Panneau TEMPORAIRE de test des cas limites (masqué hors démo, cf. `SHOW_DEV_EDGE_CASE_PANEL`).
     * Il vit ici comme le reste : du texte affiché est du texte affiché, même provisoire. */
    devPanelLabel: '🧪 temporaire — test des cas limites',
    devCaseNormal: 'Normal',
    devCaseNoDeductions: 'Cas : aucune déduction',
    devCaseLowData: 'Cas : peu de données',
  },

  // --- Cartes de déduction (`ui/v2/ThemeCardNavy.tsx`) -------------------------------------------
  // Itération 2026-07-20 (design v4, tests utilisateurs) : l'appareil de confiance est RETIRÉ de
  // l'affichage — plus de légende, de puces ni de « confiance moyenne / incertaine » sur les cartes.
  // Le mot ajoutait de la confusion pour peu de gain ; le cadrage (« des hypothèses, pas un
  // verdict ») vit désormais dans l'intro de la section 02 (`UI_RESULTS.sec02Framing`). Le MOTEUR,
  // lui, garde `confidence` : le classement des cartes (`compareCards`) lit le même niveau
  // qu'avant — seul l'affichage a bougé.
  UI_CARD: {
    /** Badge d'un constat sensible (D1). */
    sensitiveTag: 'sensible',
    /** En-tête fermé : « N sources » — preuves DISTINCTES, seul chiffre que la carte annonce. */
    headSources: (n: number) => `${n} ${plural(n, 'source', 'sources')}`,

    /** Canal d'une preuve — union FERMÉE (`Evidence['channel']`), cf. le `Record` du composant. */
    channelSearch: 'recherche',
    channelComment: 'commentaire',

    fanMain: 'principale',
    fanSecondary: 'secondaire',

    /** Titre uniforme d'une inférence (retouche 2026-07-20) : quand les preuves portent un
     * éventail, il remplace le claim — l'éventail EST la lecture. Sans claim ni éventail, la
     * variante « aucune » tient la ligne plutôt que de la faire disparaître. */
    readingsHeading: 'Plusieurs lectures pertinentes.',
    readingsHeadingNone: 'Aucune lecture pertinente.',

    sourceReused: 'recoupé',
    sourceReuseLead: '↳ aussi exploité par : ',

    usageTitle: 'Ce qui peut en être fait — selon qui y accède',
  },

  // --- Vue de résultats (`ui/v2/ResultsView.tsx`) ------------------------------------------------
  UI_RESULTS: {
    kicker: 'résultats d’analyse',
    /** Mobile + démo : le badge du header n'a pas la place, l'info passe dans le kicker. */
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
    /** Le verbe change avec le support : on ne « clique » pas sur un téléphone. */
    sec02Sub: (tapVerb: string) =>
      `Ce que l'algorithme pourrait conclure, thème par thème. ${tapVerb} une carte pour voir les preuves :`,
    /** Le CADRAGE de la section — c'est ici que vit ce que l'appareil de confiance disait
     * (maladroitement) carte par carte : des hypothèses, jamais un verdict (ADR-0003).
     * ⚠ FRAGMENTS SUBIS : « surlignage » porte le style du surlignage lui-même, « principale » la
     * teinte de la lecture principale — deux mots-exemples au cœur de la phrase (maquette). */
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

  // --- Panneaux pédagogiques de la vue de résultats ----------------------------------------------
  // Contenu STATIQUE repris de la maquette (validé par yuya dans Claude Design) — pas un gabarit
  // moteur. Trois panneaux, un par section dépliable.
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
          // « interne » et rien d'autre : depuis l'itération 2026-07-20, la page n'affiche plus de
          // niveaux (« moyenne / incertaine » retirés partout) — ce panneau ne peut donc plus
          // renvoyer à des mentions que le lecteur ne verra nulle part.
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

  // --- Section 04 · IA locale (`ui/v2/AiSection.tsx`) --------------------------------------------
  UI_AI: {
    kicker: '04 · aller plus loin',
    title: 'Analyser avec une IA locale',
    localBadge: '100 % local et gratuit',
    learnLabel: 'le modèle',
    lede: "Le modèle tourne sur ton ordinateur : rien n'est envoyé sur Internet. Trois étapes — installer, choisir un prompt, lancer.",

    // --- Bannière « peu de données » ---
    lowDataCounts: (comments: number, searches: number) =>
      `Ton export contient très peu de texte : ${comments} ${UNITS.comment(comments)} et ${searches} ${UNITS.search(searches)}.`,
    lowDataText: (threshold: number) =>
      `En dessous de ${threshold} items, chaque phrase pèse trop lourd : le modèle va sur-interpréter et tirer des conclusions fragiles. Tu peux quand même lancer l'analyse — lis simplement le résultat comme une hypothèse, pas comme un portrait.`,
    lowDataCountSuffix: ' — très peu de données',
    lowDataHint: 'Peu de données : le résultat sera indicatif, à lire avec recul.',

    // --- Bannière navigateur (avant l'étape 1) ---
    // ADR-0006 : trois moteurs, trois discours — Firefox demande tout seul, Chromium exige sans
    // proposer, WebKit ne peut pas marcher. La bannière le dit AVANT que la personne n'installe
    // quoi que ce soit, et remplace l'ex-pastille « bloqué par le navigateur » (retirée : elle
    // s'affichait aussi quand le blocage n'était pas la cause).
    browserFallbackName: 'ton navigateur',
    bwCompatTitle: (browser: string) => `Tu navigues avec ${browser} : compatible.`,
    bwCompatTextFirefox:
      'Ce navigateur sait se connecter à un modèle qui tourne chez toi. Il demandera simplement ton accord au premier contact : une petite fenêtre apparaîtra en haut à gauche, sous la barre d’adresse — clique « Autoriser ».',
    /** Chromium n'ouvre JAMAIS la fenêtre de lui-même (ADR-0006, décision 3) : on donne le chemin
     * manuel d'emblée, plutôt que de laisser guetter un dialogue qui ne vient pas. */
    bwCompatTextChromium:
      'Ce navigateur sait se connecter à un modèle qui tourne chez toi — mais il ne te le proposera pas de lui-même : si la connexion échoue, clique sur l’icône à gauche de l’adresse de ce site, mets « Réseau local » sur « Autoriser », puis recharge la page.',
    bwBlockedTitle: (browser: string) =>
      `Tu navigues avec ${browser} : ce site ne pourra pas voir le modèle sur ta machine.`,
    bwBlockedText: (browser: string) =>
      `${browser} bloque les connexions d’un site web vers ta propre machine, sans offrir de l’autoriser. Deux solutions : rouvrir cette page dans Firefox, Chrome, Brave ou Edge — ou suivre l’option B ci-dessous. L’option A est désactivée, l’option B fonctionne partout.`,
    /** Navigateur non reconnu : on ne nomme AUCUNE cause (ADR-0006, décision 4) — ni compatible,
     * ni bloqué. L'option A reste ouverte, l'option B est l'issue sûre. */
    bwUnknownTitle: 'Navigateur non reconnu.',
    bwUnknownText:
      'Impossible de dire si ton navigateur laisse un site joindre un modèle sur ta machine. Essaie l’option A ; si elle échoue, l’option B fonctionne partout.',

    // --- Mode localhost (le site est servi depuis la machine, route B aboutie) ---
    readyTitle: 'Tout est prêt : le site et le modèle tournent déjà sur ta machine.',
    readyText:
      'Rien à installer. Passe directement à l’étape 2 pour choisir ton prompt, puis lance l’analyse.',

    // --- Étape 1 · installer ---
    step1Label: 'Installer',
    osPickLabel: 'ton système :',

    termClosed: 'jamais ouvert de terminal ? ▾',
    termOpened: 'jamais ouvert de terminal ? ✕',
    termIntro:
      'Un terminal, c’est une simple fenêtre où tu colles du texte et tu appuies sur Entrée. Les commandes de cette page ne peuvent rien casser sur ton ordinateur.',
    termHowLead: (osLabel: string, how: string) => `Pour l’ouvrir sur ${osLabel} : ${how}`,
    /** `Record` sur l'union FERMÉE des OS : un système ajouté sans son mode d'emploi ne compile pas. */
    termHows: {
      macos: 'appuie sur ⌘ + Espace, tape « Terminal », puis Entrée.',
      windows: 'ouvre le menu Démarrer, tape « PowerShell », puis Entrée.',
      linux: 'appuie sur Ctrl + Alt + T, ou cherche « Terminal » dans tes applications.',
    } satisfies Record<Os, string>,

    step1InstallText:
      'Ouvre un terminal et colle cette commande : elle installe llama.cpp, le petit moteur libre qui fait tourner le modèle. Même commande quel que soit le chemin choisi ensuite :',
    /** ⚠ FRAGMENTS SUBIS : « brew.sh » est un lien au cœur de la phrase. */
    brewNoteLead:
      'Commande non reconnue ? Installe d’abord Homebrew — une seule commande, indiquée sur ',
    brewNoteLinkLabel: 'brew.sh',
    brewNoteAfter: '.',
    step1ChooseText:
      'Choisis un modèle, du meilleur au plus léger. Le plus lourd demande le plus de mémoire :',

    // --- Étape 1 · le choix des deux routes ---
    routeIntro: 'Dernier choix : deux chemins pour lancer ce modèle, même résultat.',
    routeSiteTitle: 'A · Depuis ce site',
    /** Edge figure dans la liste (ADR-0006 : les Chromium marchent, cadenas compris) — la maquette
     * l'omettait, l'ADR fait foi. */
    routeSiteText:
      'Tu restes sur cette page : plus qu’une commande à lancer. Nécessite Chrome, Brave, Edge ou Firefox.',
    routeSiteUnavailable: (browser: string) => `indisponible avec ${browser}`,
    routeLocalTitle: 'B · Tout sur ta machine',
    routeLocalText:
      'Tu télécharges aussi le site : tout tourne en local, avec n’importe quel navigateur — même sans Internet ensuite.',

    // --- Route A · lancer le serveur depuis ce site ---
    step1ServeText:
      'Lance le serveur, il télécharge le modèle au premier lancement, puis reste ouvert en arrière-plan :',
    /** Taille d'un modèle. Le NOMBRE vient de `format.ts`, l'UNITÉ est du texte et vit donc ici —
     * même partage que `UI_ANALYSE.errorMegabytes`. */
    modelSize: (gb: string) => `${gb} Go`,
    /** Jugement du produit sur un modèle — `Record` sur l'union FERMÉE de `ModelChoice['note']`,
     * donc une note ajoutée sans texte ne compile pas. */
    modelNotes: {
      recommended: 'recommandé',
      borderline: 'limite, mais fonctionnel',
    } satisfies Record<NonNullable<ModelChoice['note']>, string>,
    /** La note de permission AVANT le premier clic, adaptée au navigateur reconnu (ADR-0006) —
     * Firefox ouvrira une fenêtre, Chromium jamais. Quand le navigateur n'est pas reconnu, la
     * version générique ne promet rien. */
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
    /** État du sondage de `localhost`. « non vérifié » tant que rien n'a été tenté : la page ne
     * contacte le serveur QUE sur clic explicite (invariant de privacy) — sauf en mode localhost,
     * où le serveur sondé est celui qui vient de servir la page. */
    probeOk: 'serveur détecté',
    probeChecking: 'vérification…',
    probeIdle: 'non vérifié',
    /** DEUX étiquettes d'échec, plus trois (itération 2026-07-20) : l'ex-pastille « bloqué par le
     * navigateur » s'affichait aussi quand le blocage n'était pas certain. La pastille ne dit plus
     * que ce qu'on SAIT — « non détecté » quand la permission était accordée (le réseau a vraiment
     * été atteint), « connexion impossible » sinon. Le DIAGNOSTIC, lui, vit dans le texte d'aide
     * sous le bouton de lancement, où la permission lue départage (ADR-0006, décision 2). */
    probeErrorAbsent: 'serveur non détecté',
    probeErrorUnknown: 'connexion impossible',
    probeModelSuffix: (modelId: string) => ` : ${modelId}`,
    /** Le MÊME libellé avant et après le premier sondage (retouche 2026-07-20) : l'ex-glyphe ⟳
     * cachait l'action derrière un symbole. */
    probeCheckAction: 'vérifier la connexion',
    probeCheckAria: 'Vérifier la connexion au serveur',

    // --- Route B · télécharger le site et tout lancer en local ---
    localDownloadText:
      'Télécharge la version locale du site — ici, ou depuis GitHub si tu veux vérifier le code :',
    localZipButton: (zipName: string) => `⬇ ${zipName}`,
    localGithubLink: 'Vérifier la source sur GitHub ↗',
    localCmdText:
      'Puis colle cette commande dans ton terminal : elle décompresse le site et lance tout ensemble. Le modèle choisi plus haut se télécharge au premier lancement :',
    localCmdExplain:
      'Ce que fait la commande : va dans Téléchargements → décompresse le zip → lance le site et le modèle ensemble.',
    /** ⚠ FRAGMENTS SUBIS : l'adresse est mise en évidence au cœur de la phrase. */
    localOpenBefore: 'Quand le terminal affiche « llama_server: listening on... », ouvre ',
    localOpenAfter:
      ' dans n’importe quel navigateur : tu retrouves cette page, servie depuis ta machine et déjà branchée au modèle. L’étape suivante se passe là-bas.',

    // --- Étape 2 · prompt & lancement (carte fusionnée, maquette v4) ---
    step2MergedLabel: 'Prompt & lancement',
    /** ⚠ FRAGMENTS SUBIS : même mise en évidence de l'adresse. */
    step2WaitingBefore:
      'Tu as choisi l’option B « Tout sur ta machine ». Pour continuer, termine les étapes ci-dessus (téléchargement du site et commande dans le terminal), puis ouvre ',
    step2WaitingAfter:
      ' dans un navigateur : tu retrouveras cette section là-bas, prête à lancer l’analyse.',

    // --- Étape 2 · prompt ---
    /** Consommé par l'aperçu décoratif MOBILE (la maquette mobile garde les 3 cartes d'avant). */
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
    /** L'accord porte sur DEUX mots — le nom et le participe. « 1 items laissés » se trompait deux
     * fois ; n'accorder que le nom l'aurait corrigé à moitié. */
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
    /** Aperçu brut de la charge utile — étiquettes techniques, volontairement non traduites. */
    payloadPreview: (systemPrompt: string, userMessage: string) =>
      `[système]\n${systemPrompt}\n\n[items]\n${userMessage}`,

    // --- Étape 3 · lancer ---
    /** Consommé par l'aperçu décoratif MOBILE — la carte desktop fusionnée porte `step2MergedLabel`. */
    step3Label: 'Lancer',
    step3Stop: '■ Arrêter',
    step3Run: 'Lancer l’analyse',
    step3Running: 'analyse en cours…',
    /** ⚠ Ne promet PLUS de fenêtre de permission. Le navigateur décide seul d'en ouvrir une, et
     * certains n'en ouvrent jamais (ADR-0006) — la phrase envoyait donc guetter un dialogue qui ne
     * vient pas. Ce qui reste est ce qui est vrai : la page ne parle qu'au serveur local. */
    step3WarnIdle:
      'Serveur non vérifié — lance-le (étape 1) puis clique sur « vérifier la connexion ». Cette page ne contacte que le serveur qui tourne chez toi, et rien d’autre.',
    /** QUATRE aides d'échec, choisies sur ce qu'on SAIT (permission lue + moteur reconnu,
     * ADR-0006, décisions 2-4) — jamais une cause affirmée sans preuve. */
    step3WarnAbsent:
      'Serveur non détecté — lance-le (étape 1) puis clique sur « vérifier la connexion ».',
    /** Le navigateur CONNAÎT la permission et ne l'a pas accordée. On donne le chemin exact, et on
     * prévient qu'il ne le proposera pas : sur Chromium la fenêtre ne s'ouvre jamais d'elle-même
     * (ADR-0006), donc quelqu'un qui attend un dialogue attend indéfiniment. */
    step3WarnBlocked:
      'Ton navigateur bloque l’accès à ton propre ordinateur — ton serveur, lui, tourne peut-être très bien. Pour l’autoriser : clique sur l’icône à gauche de l’adresse de ce site, mets « Réseau local » sur « Autoriser », puis recharge la page. Ton navigateur ne te le proposera pas de lui-même.',
    /** Firefox reconnu, permission illisible : la fenêtre spontanée est SON comportement mesuré
     * (ADR-0006) — on peut donc la nommer sans mentir. */
    step3WarnFirefox:
      'Serveur non détecté — lance-le (étape 1). Si Firefox affiche une demande d’autorisation (en haut à gauche, sous la barre d’adresse), accepte-la, puis relance la vérification.',
    /** Ni permission lisible, ni moteur reconnu : on ne nomme AUCUNE cause, et l'issue sûre est la
     * route B — servir le site depuis la machine marche dans tous les moteurs (ADR-0006, déc. 5). */
    step3WarnUnknown:
      'Impossible de dire si ton serveur est éteint ou si ton navigateur a bloqué la connexion. Vérifie d’abord que le serveur tourne (étape 1). S’il tourne, c’est ton navigateur — l’option B « Tout sur ta machine » fonctionne partout.',
    runInterrupted: 'Analyse interrompue (sortie partielle) — ',
    runStats: (promptTokens: string, completionTokens: string, seconds: string) =>
      `${promptTokens} tokens lus · ${completionTokens} générés · ${seconds} s`,
    runElapsed: (seconds: string) => `${seconds} s`,
    runThroughput: (tokPerSec: string) => ` · ${tokPerSec} tok/s`,

    copyButton: 'copier',
    copyButtonDone: 'copié ✓',
    /** La rangée de commande copie au clic — l'étiquette n'est plus un bouton, l'aria le dit. */
    copyCommandAria: 'Copier la commande',
  },

  // --- Panneau « pour comprendre » de la section IA ----------------------------------------------
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

  // --- Section 04 en variante MOBILE (`AiMobileNotice`) ------------------------------------------
  // L'IA locale demande un ordinateur : sur mobile, un encart explicatif remplace la section, suivi
  // d'un APERÇU DÉCORATIF (aria-hidden) des trois étapes.
  UI_AI_MOBILE: {
    sectionNumber: '04',
    calloutTitle: "L'analyse par IA n'est disponible que sur ordinateur pour l'instant.",
    calloutText:
      "Le modèle tourne localement sur ta machine et demande un ordinateur. Ouvre PanoptiCool sur ton ordi pour cette étape — rien ne change pour le reste de l'analyse.",
    /** Valeurs FIGÉES de l'aperçu décoratif : elles IMITENT `MODEL_CHOICES` sans le lire, pour que la
     * vignette reste stable si le catalogue de modèles bouge. Ce sont des décors, pas des données. */
    previewCommand: 'brew install llama.cpp',
    previewModelOn: 'UD-Q4_K_XL',
    previewModelOff: 'IQ4_XS',
    /** Tailles de l'aperçu : des NOMBRES, formatés au rendu comme celles du vrai tableau — une
     * virgule figée dans une chaîne échapperait au formatage central (cf. `ModelChoice.sizeGb`).
     * Elles restent DÉLIBÉRÉMENT indépendantes de `MODEL_CHOICES` : la vignette est un décor figé,
     * elle ne doit pas bouger quand le catalogue de modèles change. */
    previewModelOnSizeGb: 2.2,
    previewModelOffSizeGb: 2.0,
    previewPrompt:
      "Tu es un analyste. À partir des recherches et commentaires TikTok ci-dessous, déduis prudemment : centres d'intérêt, habitudes, rythme de vie…",
  },

  // --- Cas limite « aucune déduction » (`ui/v2/NoDeductionCard.tsx`) ------------------------------
  UI_NO_DEDUCTION: {
    title: 'Aucune déduction ne ressort de ton export',
    /** Deux raisons possibles, choisies sur le VOLUME de texte disponible (`lowData`). */
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
    /** Les verbatims sont encadrés de guillemets français — l'item lui-même vient de l'export. */
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
    /** Titre et corps de l'issue GitHub / de l'e-mail pré-remplis. RIEN ne part sans clic. */
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
