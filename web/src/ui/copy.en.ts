// Copy EN de l'INTERFACE — la prose des composants, en anglais. Périmètre ratifiable n°2.
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ TRADUCTION PROVISOIRE — À RELIRE PAR yuya, ligne à ligne, comme la moitié française.       │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
//
// LA FORME EST TENUE PAR `copy.fr.ts` : ce fichier s'annote `UiCopy` (= `typeof FR`), donc une
// entrée oubliée, une clé en trop ou une signature qui diverge sont des erreurs de COMPILATION.
// Ce qu'aucun compilateur ne voit : qu'une entrée soit réellement TRADUITE.
//
// ⚠ LES LONGUEURS DE TABLEAU NE SONT PAS TENUES PAR LE TYPE (`T[]`, pas un n-uplet) :
// `copy-parity.test.ts` les compare au runtime. Un tableau anglais plus court compilerait.
//
// ─── LE REGISTRE, ET CE QUI LE DISTINGUE DU MOTEUR ──────────────────────────────────────────────
// ICI, LA 2ᵉ PERSONNE EST LA NORME — c'est l'INTERFACE qui parle à la personne (« ton export »,
// « tu peux »), et l'anglais dit « your export », « you can » sans détour. C'est l'exact inverse de
// `engine/wording.en.ts`, où « you » est INTERDIT par doctrine (ADR-0003 : le moteur ne s'adresse
// jamais à la personne). Les deux fichiers sont séparés pour cette raison précise.
//
// Le tutoiement français est direct et familier sans être relâché. L'anglais n'a pas le choix
// tu/vous : le registre se joue ailleurs — contractions (« you're », « doesn't »), phrases courtes,
// pas de vocabulaire administratif. « Your data stays with you », pas « User data is retained
// locally ».
//
// ON TRADUIT LE SENS, PAS LES MOTS. Là où le français joue d'une tournure sans équivalent, on écrit
// le meilleur anglais plutôt que le calque le plus proche — les écarts assumés sont commentés.
//
// ORTHOGRAPHE : américaine (`OG_LOCALE.en = 'en_US'`), comme `wording.en.ts`.

import type { UiCopy } from './copy';
import { plural } from './format';

const UNITS = {
  search: (n: number) => plural(n, 'search', 'searches'),
  comment: (n: number) => plural(n, 'comment', 'comments'),
  item: (n: number) => plural(n, 'item', 'items'),
};

export const EN: UiCopy = {
  UI_UNITS: UNITS,

  // L'identité ne se traduit pas : un nom de produit, une adresse, une URL.
  UI_BRAND: {
    name: 'PanoptiCool',
    contactMail: 'yuya@panopti.cool',
    githubUrl: 'https://github.com/lagayayuya/PanoptiCool',
  },

  UI_ROOT: {
    title: 'PanoptiCool',
    description: 'PanoptiCool — find out what your social networks know about you.',
    fallbackLink: 'Continue to PanoptiCool →',
  },

  UI_HEADER: {
    homeAriaLabel: 'PanoptiCool — home',
    logoAlt: 'PanoptiCool',
    wordmark: 'PanoptiCool',
    langGroupAriaLabel: 'Language',
    langFr: 'FR',
    langEn: 'EN',
    langUnavailableTitle: 'coming soon',
    githubLabel: 'GitHub',
    githubAriaLabel: 'View the code on GitHub',
    tocAriaLabel: 'Contents',
  },

  UI_FOOTER: {
    tagline: 'PanoptiCool — your data stays with you.',
    legalLink: 'Legal notice',
    credits: 'Built by Yuya and Claude (Sonnet 5, Opus 4.8 and Fable 5)',
  },

  UI_LEARN: {
    kicker: 'to understand',
    close: 'close ✕',
    open: (label: string) => `understand · ${label}`,
  },

  UI_ACTIVITY: {
    rhythmTitle: 'Activity rhythm',
    rhythmNote: 'your typical day · hour by hour',
    // Graduations en format 12 h : « 0h » n'existe pas en anglais courant, et « 00:00 » sonne
    // administratif sur un axe qu'on lit d'un coup d'œil.
    hourMarks: ['12am', '6am', '12pm', '6pm', '11pm'],
    legendNight: 'night · risk window',
    legendDay: 'day',

    counterApprox: (n: string) => `≈ ${n}`,
    counter12MonthsLabel: 'videos watched · last 12 months',
    counter30DaysLabel: 'videos watched · last 30 days',

    volumesTitle: 'Volumes in your export',
    volumesNote: 'over the period the export covers (~1 year)',
    volumeTileLabels: {
      endorsements: 'likes, favorites and reposts',
      comments: 'comments posted',
      searches: 'searches typed',
      follows: 'accounts followed',
    },
    volumeTileVideosWatched: 'videos viewed',

    opacityTitle: 'What can actually be analyzed',
    opacityUnderOnePercent: (onePercent: string) => `< ${onePercent}`,
    opacityDonutAriaLabel: (pctLabel: string) => `${pctLabel} of items are readable offline`,
    opacityReadableLegend: (count: string, n: number) =>
      `readable offline · ${count} ${UNITS.item(n)}`,
    opacityOpaqueLegend: (count: string, n: number) =>
      `opaque (mute links) · ${count} ${UNITS.item(n)}`,
    estimateTag: 'estimate',
  },

  UI_TIME_ESTIMATE: {
    days: (days: string, dayWord: string, spent: string, hours: string) =>
      `~${days} ${dayWord} of your life ${spent} on TikTok this year, or ~${hours} h.`,
    hours: (hours: string, hourWord: string, spent: string) =>
      `~${hours} ${hourWord} of your life ${spent} on TikTok this year.`,
    dayOne: 'day',
    dayMany: 'days',
    // ⚠ L'ANGLAIS N'ACCORDE PAS LE PARTICIPE. Les quatre entrées `*Spent*` existent parce que le
    // français distingue passé/passés/passée/passées ; en anglais c'est « spent » dans les quatre
    // cas. Les garder identiques n'est PAS un oubli de traduction : c'est ce que la langue fait.
    // Les fusionner casserait la parité de forme avec le français, pour rien.
    daySpentOne: 'spent',
    daySpentMany: 'spent',
    hourOne: 'hour',
    hourMany: 'hours',
    hourSpentOne: 'spent',
    hourSpentMany: 'spent',
  },

  UI_LANDING: {
    heroKicker: 'your data exports, decoded on your own machine',
    heroTitle: 'Find out what your social networks know about you.',
    heroLede:
      'Every platform has to hand over your data if you ask for it. PanoptiCool reads those exports and shows you what an algorithm could infer from them: your rhythms, your interests, and the sensitive signals you don’t think you’re leaving behind.',

    pickLabel: 'choose your platform',
    platformTikTok: 'TikTok',
    platformAvailable: 'available',
    platformSoon: 'Instagram, YouTube… coming soon',

    ctaAnalyse: 'Analyze my TikTok data',
    ctaDemo: 'or try it first with made-up data →',
    trust: ['100% local — nothing is sent', 'open source', 'free, no account'],

    howTitle: 'How it works',
    howNote: 'with TikTok',
    steps: [
      {
        n: '1',
        title: 'Get your TikTok export',
        text: 'In the app: Profile → Settings → Account → Download your data. Choose the JSON format — the file can take anywhere from 1 to 48 hours to be ready.',
      },
      {
        n: '2',
        title: 'Drop it here',
        text: 'The file is read directly in your browser. It never leaves your computer, and the code is open if you want to check.',
      },
      {
        n: '3',
        title: 'Explore the inferences',
        text: 'Rhythms, topics, sensitive signals with their confidence level. And if you want, a local AI takes the analysis further.',
      },
    ],

    discoverTitle: 'What you’re about to find',
    feats: [
      {
        tag: 'analysis',
        title: 'Your profile, as an algorithm sees it',
        text: 'Every inference is tied to the exact data feeding it — searches, comments, metadata — with a confidence score.',
      },
      {
        tag: 'local ai',
        title: 'An AI that runs on your machine',
        text: 'Install a small open-source model and let it analyze your traces. Cut the wifi if you like: it all works offline.',
        mobileBadge: 'on desktop',
        mobileText:
          'Install a small open-source model and let it analyze your traces. For now, this analysis is only available on a computer.',
      },
      {
        tag: 'to understand',
        title: 'Learn as you explore',
        text: 'In every section, expandable explanations: how an algorithm guesses, where profiles end up, what a token is, your GDPR rights.',
      },
    ],

    whyKicker: 'why “panopticool”?',
    whyTextBefore: 'The ',
    whyTextItalic: 'panopticon',
    // ⚠ FRAGMENTS SUBIS (le mot est en italique au milieu de la phrase), et la coupe DIFFÈRE du
    // français : « le panoptique (en anglais, panopticon) » gloses un mot que l'anglais n'a pas à
    // gloser — le terme EST anglais. Le « before » se réduit donc à l'article, et la parenthèse
    // disparaît. Traduire la glose mot à mot aurait produit « the panopticon (in English,
    // panopticon) », ce qui est du charabia.
    whyTextAfter:
      ' is a prison where a single guard can watch everyone without being seen. Platforms work a little like that, except here you’re the one watching, from your own computer, and that’s... cool?',
    whyLink: 'See the demo with made-up data →',
  },

  UI_CONSENT: {
    dialogAriaLabel: 'Before you continue',
    kicker: 'before you continue',
    closeAriaLabel: 'Close',
    title: 'You’re about to look at your data very closely.',

    line1Before: 'Your export contains ',
    line1Strong: 'personal data, sometimes sensitive or intimate',
    line1Middle:
      ': messages, searches, late-night activity, locations. Seeing it gathered and interpreted can be ',
    line1Strong2: 'unsettling',

    line2Before: 'Everything is analyzed ',
    line2Strong: 'locally, in your browser',
    line2After: '. Nothing is sent, nothing is kept once you close the tab.',

    line3Before: 'If you’re on a ',
    line3DeviceDesktop: 'shared or public computer',
    line3DeviceMobile: 'shared phone',
    line3After: ', remember to close the tab and delete the export file afterwards.',

    consentCheckbox: 'I understand what this data is, and I choose to view my analysis.',
    continueButton: 'Continue to the export →',
    laterButton: 'Not now',
  },

  UI_ANALYSE: {
    kicker: 'local analysis',
    titleDesktop: 'Drop your TikTok export',
    titleMobile: 'Choose your TikTok export',
    ledeLead: 'The file is read and analyzed entirely on this device — it never leaves. ',
    ledeDesktop: 'Drag in the .zip you got from TikTok, or click to choose it.',
    ledeMobile: 'Select the .zip you got from TikTok (often in “Files” or “Downloads”).',
    dropMain: 'Drag your export here',
    dropSub: 'or click to choose the file (.zip)',
    pickButtonMobile: 'Choose my .zip file',

    loadingMain: 'Analyzing…',
    loadingSub: 'everything happens on this device, nothing is sent.',

    hintLead:
      'No export yet? In the TikTok app: Profile → Settings → Account → Download your data (JSON format). ',
    hintDemoLink: 'Or try it with made-up data →',

    badgeDemo: 'demo · made-up data',
    badgeReal: 'local analysis',

    tocActivity: 'Activity',
    tocDeductions: 'Inferences',
    tocSummary: 'Summary',
    tocAi: 'Local AI',

    errorTooLarge: (size: string, limit: string) =>
      `Export too large for this version (${size}, limit ${limit}).`,
    errorMegabytes: (n: string) => `${n} MB`,
    errorValidate:
      'The structure of this export doesn’t match what’s expected — some sections differ or are missing.',
    errorNoJson:
      'Unsupported format: no JSON export found in the archive. PanoptiCool only reads the JSON format — check that choice when you request the export from TikTok.',
    errorUnreadable:
      'File unreadable or corrupted: check that you selected the .zip of your TikTok export.',
    errorUnexpected: 'This file can’t be analyzed.',

    devPanelLabel: '🧪 temporary — edge case testing',
    devCaseNormal: 'Normal',
    devCaseNoDeductions: 'Case: no inferences',
    devCaseLowData: 'Case: little data',
  },

  UI_CARD: {
    sensitiveTag: 'sensitive',
    headSources: (n: number) => `${n} ${plural(n, 'source', 'sources')}`,

    channelSearch: 'search',
    channelComment: 'comment',

    fanMain: 'primary',
    fanSecondary: 'secondary',

    readingsHeading: 'Several interpretations are plausible.',
    readingsHeadingNone: 'No plausible interpretations.',

    sourceReused: 'cross-used',
    sourceReuseLead: '↳ also used by: ',

    usageTitle: 'What can be done with it — depending on who gets access',
  },

  UI_RESULTS: {
    kicker: 'analysis results',
    kickerDemo: 'analysis results · demo, made-up data',
    heroTitleLine1: 'What TikTok',
    heroTitleLine2: 'could infer',
    heroLede:
      'From what you search for, watch and comment on, TikTok tries to deduce things about you. These are guesses, not certainties.',
    heroSub:
      'Four steps, from the most factual to the most interpreted: your raw activity, then the inferences topic by topic — each tied to the exact data feeding it.',

    tocAriaLabel: 'Contents',
    tocTitle: 'contents',

    tocActivity: 'Your activity',
    tocDeductions: 'Inferences',
    tocSummary: 'Summary',
    tocAi: 'Local AI',

    sec01Title: 'Your activity in numbers',
    sec01Sub: 'When you use the app, and how many traces you leave.',
    sec01LearnLabel: 'metadata',
    sec02Title: 'Inferences by topic',
    sec02Sub: (tapVerb: string) =>
      `What the algorithm could conclude, topic by topic. ${tapVerb} a card to see the evidence:`,
    sec02FramingLead:
      'These inferences are hypotheses: they illustrate what an algorithm could infer, with no guarantee of reliability. They say nothing about who you really are. The ',
    sec02FramingHighlightWord: 'highlight',
    sec02FramingMiddle: ' shows the word that was matched, and each source offers a ',
    sec02FramingPrimaryWord: 'primary',
    sec02FramingTail:
      ' and a secondary reading — or several equally plausible ones when nothing settles it.',
    sec02TapVerbMobile: 'Tap',
    sec02TapVerbDesktop: 'Click',
    sec02LearnLabel: 'the algorithm',
    sec03Title: 'Summary',
    sec03LearnLabel: 'the data market',

    summaryLede:
      'Taken one by one, this data is unremarkable. Cross-referenced, it sketches a profile — and one harmless item can feed several readings at once.',
    summaryDataTypesTitle: 'Types of data read',
    summaryDataTypes: ['searches', 'comments', 'session metadata', 'interactions', 'viewing'],
    summaryActorsTitle: 'What players like TikTok or aggregators can draw from it',
    summaryActorTakeaways: [
      'interests and consumption habits',
      'availability, tiredness, exploitable windows of attention',
      'sensitive signals — mental health, political opinion, hostility — each with a confidence level',
      'segments that can be sold on to advertisers, data brokers, even authorities',
    ],
  },

  UI_LEARN_PANELS: {
    rhythm: {
      question: 'Why does TikTok care what time I’m online?',
      columns: [
        {
          title: 'What gets measured',
          text: 'Every time you open the app, every video and every pause is timestamped. This isn’t your content: it’s metadata — data about your behavior.',
        },
        {
          title: 'What that enables',
          text: 'Put end to end, it maps out your daily rhythm: sleep, commutes, idle moments. The algorithm uses it to reach you when you’re most receptive.',
        },
        {
          title: 'Why it’s sensitive',
          text: 'These traces look harmless, but they reveal tiredness, insomnia or availability — states that can be monetized, without you having “posted” anything.',
        },
      ],
    },
    deductions: {
      question: 'How does an algorithm “guess”?',
      columns: [
        {
          title: 'By comparison',
          text: 'It doesn’t understand your words: it compares your traces to those of millions of other accounts. If people who search for X often do Y, you get filed under Y.',
        },
        {
          title: 'With a score',
          // Comme en français : la page n'affiche plus de niveaux — ce panneau ne renvoie donc
          // plus à des mentions que le lecteur ne verra nulle part.
          text: 'Every inference carries an internal confidence level: the more the signals line up, the higher the score.',
        },
        {
          title: 'And so, fallible',
          text: 'It’s a statistical correlation, not proof: searching “how to help someone who’s depressed” doesn’t say who’s depressed. But the label stays attached to the profile.',
        },
      ],
      footnote:
        'And PanoptiCool, in this section? None of that: we simply match your words against topic word lists (cooking, health, politics…) — that’s the highlighting you see. Far cruder than the platforms’ models, but enough to show the principle.',
    },
    market: {
      question: 'Where do these profiles go next?',
      columns: [
        {
          title: 'Real-time bidding',
          text: 'Every time content is shown, advertisers bid within milliseconds to reach your profile. The segments (“cooking”, “likely anxiety”) set the price.',
        },
        {
          title: 'Data brokers',
          text: 'Middlemen aggregate segments from dozens of apps and sell them on — to brands, insurers, sometimes authorities.',
        },
        {
          title: 'Your rights (GDPR)',
          text: 'In Europe, you can request access to your data, have it erased, and object to profiling. The export you’re analyzing here comes from that right of access.',
        },
      ],
    },
  },

  UI_AI: {
    kicker: '04 · going further',
    title: 'Analyze with a local AI',
    localBadge: '100% local and free',
    learnLabel: 'the model',
    lede: 'The model runs on your computer: nothing is sent over the Internet. Three steps — install, choose a prompt, run.',

    lowDataCounts: (comments: number, searches: number) =>
      `Your export contains very little text: ${comments} ${UNITS.comment(comments)} and ${searches} ${UNITS.search(searches)}.`,
    lowDataText: (threshold: number) =>
      `Below ${threshold} items, every sentence carries too much weight: the model will over-interpret and reach shaky conclusions. You can still run the analysis — just read the result as a hypothesis, not a portrait.`,
    lowDataCountSuffix: ' — very little data',
    lowDataHint: 'Little data: the result will be indicative, read it with some distance.',

    browserFallbackName: 'your browser',
    bwCompatTitle: (browser: string) => `You’re browsing with ${browser}: compatible.`,
    bwCompatTextFirefox:
      'This browser can connect to a model running on your machine. It will simply ask for your permission on first contact: a small window will appear at the top left, under the address bar — click “Allow”.',
    bwCompatTextChromium:
      'This browser can connect to a model running on your machine — but it won’t offer it on its own: if the connection fails, click the icon to the left of this site’s address, set “Local network” to “Allow”, then reload the page.',
    bwBlockedTitle: (browser: string) =>
      `You’re browsing with ${browser}: this site won’t be able to see the model on your machine.`,
    bwBlockedText: (browser: string) =>
      `${browser} blocks connections from a website to your own machine, with no way to allow them. Two ways out: reopen this page in Firefox, Chrome, Brave or Edge — or follow option B below. Option A is disabled; option B works everywhere.`,
    bwUnknownTitle: 'Browser not recognized.',
    bwUnknownText:
      'No way to tell whether your browser lets a site reach a model on your machine. Try option A; if it fails, option B works everywhere.',

    readyTitle: 'Everything is ready: the site and the model are already running on your machine.',
    readyText:
      'Nothing to install. Go straight to step 2 to choose your prompt, then run the analysis.',

    step1Label: 'Install',
    osPickLabel: 'your system:',

    termClosed: 'never opened a terminal? ▾',
    termOpened: 'never opened a terminal? ✕',
    termIntro:
      'A terminal is just a window where you paste text and press Enter. The commands on this page can’t break anything on your computer.',
    termHowLead: (osLabel: string, how: string) => `To open it on ${osLabel}: ${how}`,
    termHows: {
      macos: 'press ⌘ + Space, type “Terminal”, then Enter.',
      windows: 'open the Start menu, type “PowerShell”, then Enter.',
      linux: 'press Ctrl + Alt + T, or look for “Terminal” in your applications.',
    },

    step1InstallText:
      'Open a terminal and paste this command: it installs llama.cpp, the small open-source engine that runs the model. Same command whichever path you choose next:',
    brewNoteLead: 'Command not recognized? Install Homebrew first — a single command, shown on ',
    brewNoteLinkLabel: 'brew.sh',
    brewNoteAfter: '.',
    step1ChooseText: 'Choose a model, from best to lightest. The heaviest needs the most memory:',

    routeIntro: 'One last choice: two paths to run this model, same result.',
    routeSiteTitle: 'A · From this site',
    routeSiteText:
      'You stay on this page: just one more command to run. Requires Chrome, Brave, Edge or Firefox.',
    routeSiteUnavailable: (browser: string) => `unavailable with ${browser}`,
    routeLocalTitle: 'B · Everything on your machine',
    routeLocalText:
      'You download the site too: everything runs locally, with any browser — even without Internet afterwards.',

    step1ServeText:
      'Start the server; it downloads the model on first run, then stays open in the background:',
    modelSize: (gb: string) => `${gb} GB`,
    modelNotes: {
      recommended: 'recommended',
      borderline: 'borderline, but workable',
    },

    permNoteFirefox: (browser: string) =>
      `When you click “check the connection”, ${browser} will ask for permission to reach the local network: a small window will appear at the top left, under the address bar — click “Allow”.`,
    permNoteChromium: (browser: string) =>
      `${browser} will NOT open a permission window for you: if the check fails, click the icon to the left of this site’s address, set “Local network” to “Allow”, then reload the page.`,
    permNoteGeneric:
      'Depending on your browser, you may need to allow it to reach your computer. If the connection fails, this page will tell you what to do.',

    step1AddressLabel: 'server address',
    step1AddressAria: 'Server address',
    step1Foot:
      'You can change this address to point at any compatible server, and so run an entirely different model if you prefer.',
    probeOk: 'server detected',
    probeChecking: 'checking…',
    probeIdle: 'not checked',
    probeErrorAbsent: 'server not detected',
    probeErrorUnknown: 'connection failed',
    probeModelSuffix: (modelId: string) => ` : ${modelId}`,
    probeCheckAction: 'check the connection',
    probeCheckAria: 'Check the connection to the server',

    localDownloadText:
      'Download the local version of the site — here, or from GitHub if you want to check the code:',
    localZipButton: (zipName: string) => `⬇ ${zipName}`,
    localGithubLink: 'Check the source on GitHub ↗',
    localCmdText:
      'Then paste this command in your terminal: it unpacks the site and starts everything together. The model chosen above downloads on first run:',
    localCmdExplain:
      'What the command does: goes to Downloads → unpacks the zip → starts the site and the model together.',
    localOpenBefore: 'When the terminal shows “llama_server: listening on...”, open ',
    localOpenAfter:
      ' in any browser: you’ll find this page again, served from your machine and already connected to the model. The next step happens over there.',

    step2MergedLabel: 'Prompt & run',
    step2WaitingBefore:
      'You chose option B, “Everything on your machine”. To continue, finish the steps above (download the site and run the terminal command), then open ',
    step2WaitingAfter: ' in a browser: you’ll find this section there, ready to run the analysis.',

    step2Label: 'Analysis prompt',
    step2PresetDefault: 'Default prompt',
    step2PresetSafety: '“Safety net” prompt',
    step2PromptAria: 'Analysis prompt',
    step2ItemsLoading: 'Reading comments and searches…',
    step2ItemsError: (message: string) =>
      `Couldn’t re-read the export for the AI analysis: ${message}`,
    includedCounts: (comments: number, searches: number) =>
      `${comments} ${UNITS.comment(comments)} · ${searches} ${UNITS.search(searches)} included · `,
    tokensExact: (n: string) => `${n} tokens (verified)`,
    tokensEstimated: (n: string) => `≈ ${n} tokens`,
    // ⚠ L'ANGLAIS N'ACCORDE PAS LE PARTICIPE : « left out » ne varie pas. Le NOM, lui, s'accorde,
    // et `UNITS.item` porte cette part — via `Intl.PluralRules`, donc 0 au PLURIEL.
    tokensDropped: (dropped: number, contextWindow: string) =>
      ` · ${dropped} ${UNITS.item(dropped)} left out (${contextWindow}-token window)`,
    payloadShow: 'see exactly what will be sent ▾',
    payloadHide: 'hide what will be sent ▴',
    verifyChecking: 'Checking the exact token count with the server…',
    verifyUnavailable:
      'This server doesn’t expose /tokenize (older build) — the count above is an estimate, deliberately pessimistic.',
    recentOnly: (comments: number, searches: number) =>
      `Most recent first: only the most recent comments fit in the model’s window (${comments} ${UNITS.comment(comments)} and ${searches} ${UNITS.search(searches)} in total).`,
    searchesTruncated: (droppedSearches: number) =>
      `All the comments fit, plus the most recent searches (${droppedSearches} older ${UNITS.search(droppedSearches)} left out).`,
    payloadPreview: (systemPrompt: string, userMessage: string) =>
      `[system]\n${systemPrompt}\n\n[items]\n${userMessage}`,

    step3Label: 'Run',
    step3Stop: '■ Stop',
    step3Run: 'Run the analysis',
    step3Running: 'analyzing…',
    step3WarnIdle:
      'Server not checked — start it (step 1) then click “check the connection”. This page only ever contacts the server running on your own machine, and nothing else.',
    step3WarnAbsent: 'Server not detected — start it (step 1) then click “check the connection”.',
    step3WarnBlocked:
      'Your browser is blocking access to your own computer — your server may well be running fine. To allow it: click the icon to the left of this site’s address, set “Local network” to “Allow”, then reload the page. Your browser will not offer this on its own.',
    step3WarnFirefox:
      'Server not detected — start it (step 1). If Firefox shows a permission request (top left, under the address bar), accept it, then check again.',
    step3WarnUnknown:
      'No way to tell whether your server is off or your browser blocked the connection. First check that the server is running (step 1). If it is, it’s your browser — option B, “Everything on your machine”, works everywhere.',
    runInterrupted: 'Analysis interrupted (partial output) — ',
    runStats: (promptTokens: string, completionTokens: string, seconds: string) =>
      `${promptTokens} tokens read · ${completionTokens} generated · ${seconds} s`,
    runElapsed: (seconds: string) => `${seconds} s`,
    runThroughput: (tokPerSec: string) => ` · ${tokPerSec} tok/s`,

    copyButton: 'copy',
    copyButtonDone: 'copied ✓',
    copyCommandAria: 'Copy the command',
  },

  UI_AI_LEARN: {
    question: 'How does the model running on your machine work?',
    columns: [
      {
        title: 'Predicting the next word',
        text: 'A language model doesn’t “think”: it predicts the most likely fragment of a word, thousands of times in a row. That stream is what you see being written.',
      },
      {
        title: 'Tokens',
        text: 'Your text is cut into “tokens” (~¾ of a word each). It’s the unit counted everywhere here: prompt size, speed in tok/s, length of the answer.',
      },
      {
        title: 'Quantization (Q4, Q3…)',
        text: 'The variants on offer are the same model, more or less compressed to fit your memory. The more compressed, the lighter — and the less precise.',
      },
      {
        title: 'Local = private',
        text: 'The model is just a file on your disk. Once downloaded, you can cut the Internet: the analysis still works, and nothing leaves your machine.',
      },
    ],
  },

  UI_AI_MOBILE: {
    sectionNumber: '04',
    calloutTitle: 'AI analysis is only available on a computer for now.',
    calloutText:
      'The model runs locally on your machine and needs a computer. Open PanoptiCool on your desktop for this step — nothing changes for the rest of the analysis.',
    previewCommand: 'brew install llama.cpp',
    previewModelOn: 'UD-Q4_K_XL',
    previewModelOff: 'IQ4_XS',
    previewModelOnSizeGb: 2.2,
    previewModelOffSizeGb: 2.0,
    previewPrompt:
      'You are an analyst. From the TikTok searches and comments below, cautiously infer: interests, habits, daily rhythm…',
  },

  UI_NO_DEDUCTION: {
    title: 'No inferences come out of your export',
    reasonLowData:
      'The most likely reason: your export contains very little text to read — almost nothing to compare against the topic word lists (cooking, health, politics…). This isn’t a fault, just a lack of material.',
    reasonNoMatch:
      'Your export does contain text: it’s your vocabulary that doesn’t overlap with the topics PanoptiCool knows how to spot (cooking, health, politics…). Our word lists are crude — you can help us fill them out, below.',
    warn: 'That doesn’t mean TikTok infers nothing: the export only shows ~26% of the data collected, and their models analyze far more finely than our word lists.',

    dataTitle: 'Your data, all the same',
    dataCounts: (searches: number, comments: number) =>
      `${searches} ${UNITS.search(searches)} · ${comments} ${UNITS.comment(comments)}`,
    dataToggleOpen: 'view ▾',
    dataToggleClose: 'hide ▴',
    dataColSearches: 'searches',
    dataColComments: 'comments',
    dataEmptySearches: 'no searches in the export',
    dataEmptyComments: 'no comments in the export',
    // Guillemets ANGLAIS (« “ ” »), pas les chevrons français : c'est une convention typographique
    // de langue, pas une décoration — la garder française sonnerait étranger autour d'un verbatim
    // anglais.
    dataQuote: (text: string) => `“${text}”`,
    dataFoot: 'This is exactly the text our word lists went through without finding a match.',

    enrichTitle: 'Help us grow the vocabulary',
    enrichText:
      'Your export contains text, but our word lists didn’t recognize it. If you spot words in your data that we should have understood, suggest them anonymously: everyone benefits. Nothing is sent without your click.',
    enrichPlaceholder: 'e.g. “batch cooking”, “air fryer”, “mid” …',
    enrichAriaLabel: 'Words to suggest',
    enrichGithubButton: 'Suggest on GitHub',
    enrichMailButton: (mail: string) => `or by email → ${mail}`,
    enrichIssueTitle: 'Word suggestions for the lexicons',
    enrichMailSubject: 'Words to add to the PanoptiCool lexicons',
    enrichBodyPlaceholder: '(list your words here)',
    enrichBody: (text: string) => `${text}\n\n—\nSuggested from the PanoptiCool results page.`,

    tip1Title: 'Check your export',
    tip1Text: 'JSON format, every category ticked: a partial export happens easily.',
    tip2Title: 'Try the local AI',
    tip2Text: 'It reads your data more finely than the word lists: ',
    tip2Mobile: 'on a computer, ',
    tip2Link: 'section 04 →',
    tip3Title: 'Come back later',
    tip3Text: 'A new export in a few weeks will hold more traces to read.',
  },
};
