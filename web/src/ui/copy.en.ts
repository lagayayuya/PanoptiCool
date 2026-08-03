// INTERFACE EN copy — the components' prose, in English. Ratifiable perimeter no. 2.
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ PROVISIONAL TRANSLATION — TO BE REVIEWED BY yuya, line by line, like the French half.       │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
//
// THE FORM IS HELD BY `copy.fr.ts`: this file annotates itself `UiCopy` (= `typeof FR`), so a
// forgotten entry, an extra key or a diverging signature are COMPILATION errors.
// What no compiler sees: whether an entry is actually TRANSLATED.
//
// ⚠ THE ARRAY LENGTHS ARE NOT HELD BY THE TYPE (`T[]`, not a tuple):
// `copy-parity.test.ts` compares them at runtime. A shorter English array would compile.
//
// ─── THE REGISTER, AND WHAT DISTINGUISHES IT FROM THE ENGINE ─────────────────────────────────────
// HERE, THE 2nd PERSON IS THE NORM — it is the INTERFACE that speaks to the person (« ton export »,
// « tu peux »), and English says « your export », « you can » plainly. It is the exact inverse of
// `engine/wording.en.ts`, where « you » is FORBIDDEN by doctrine (ADR-0003: the engine never addresses
// the person). The two files are separate for this precise reason.
//
// French "tu" is direct and familiar without being sloppy. English has no
// tu/vous choice: the register plays out elsewhere — contractions (« you're », « doesn't »), short sentences,
// no administrative vocabulary. « Your data stays with you », not « User data is retained
// locally ».
//
// WE TRANSLATE THE MEANING, NOT THE WORDS. Where French plays on a turn of phrase without an equivalent, we write
// the best English rather than the closest calque — the accepted gaps are commented.
//
// SPELLING: American (`OG_LOCALE.en = 'en_US'`), like `wording.en.ts`.

import type { UiCopy } from './copy';
import { plural } from './format';

const UNITS = {
  search: (n: number) => plural(n, 'search', 'searches'),
  comment: (n: number) => plural(n, 'comment', 'comments'),
  item: (n: number) => plural(n, 'item', 'items'),
};

export const EN: UiCopy = {
  UI_UNITS: UNITS,

  // Identity does not translate: a product name, an address, a URL.
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

  UI_HEAD: {
    homeTitle: 'PanoptiCool — Find out what TikTok and Instagram know about you.',
    homeDescription:
      'PanoptiCool opens your TikTok or Instagram export in your browser and makes it readable — 100% local, nothing is sent.',
    analyseTitle: 'PanoptiCool — what TikTok could infer',
    analyseDescription:
      'Analyse your TikTok export entirely in your browser: rhythms, themes, sensitive signals — nothing leaves your machine.',
    roadmapTitle: 'PanoptiCool — roadmap',
    roadmapDescription:
      "What's done, what's coming: the steps of PanoptiCool, one platform at a time.",
    legalTitle: 'PanoptiCool — legal notice',
    legalDescription: 'Publisher, host, and what PanoptiCool does not collect.',
    ogImageAlt:
      'PanoptiCool — find out what your social networks know about you. 100% local, open source, no account.',
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
    roadmapLabel: 'Roadmap',
  },

  UI_FOOTER: {
    tagline: 'PanoptiCool — your data stays with you.',
    legalLink: 'Legal notice',
    credits: 'Built by Yuya and Claude',
  },

  UI_LEARN: {
    close: 'close ✕',
    open: (label: string) => `understand · ${label}`,
  },

  UI_ACTIVITY: {
    rhythmTitle: 'Activity rhythm',
    rhythmNote: 'your typical day · hour by hour',
    // Tick marks in 12 h format: « 0h » does not exist in everyday English, and « 00:00 » sounds
    // administrative on an axis one reads at a glance.
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
    // ⚠ ENGLISH DOES NOT AGREE THE PARTICIPLE. The four `*Spent*` entries exist because
    // French distinguishes passé/passés/passée/passées; in English it is « spent » in all four
    // cases. Keeping them identical is NOT a translation oversight: it is what the language does.
    // Merging them would break form parity with the French, for nothing.
    daySpentOne: 'spent',
    daySpentMany: 'spent',
    hourOne: 'hour',
    hourMany: 'hours',
    hourSpentOne: 'spent',
    hourSpentMany: 'spent',
  },

  UI_LANDING: {
    heroTitle: 'Find out what TikTok and Instagram know about you.',
    heroLede:
      'These apps have to hand you a copy of everything they recorded. PanoptiCool opens that file in your browser and makes it readable.',
    trust: ['Free, no account', 'Nothing is sent over the internet', 'Open source'],

    instagramName: 'Instagram',
    instagramLede:
      'One of the richest exports there is. It holds every photo, video and voice note you exchanged, put back in place year by year.',
    instagramBullets: [
      'Every one of your conversations, and the photos you exchanged',
      'All your interactions with other accounts',
      'What your account is worth, your interests, and the identity inferred from them',
    ],
    instagramOpen: 'Open my Instagram data',
    instagramDemo: 'Try the Instagram demo',

    tiktokName: 'TikTok',
    tiktokLede:
      'What the algorithm could infer about you, subject by subject. Mostly built on the comments you left and the searches you typed.',
    tiktokBullets: [
      'All your figures and your activity rhythm',
      'Your searches and comments, listed and analyzed — with or without AI',
      'A look at how the algorithms and the data market actually work',
    ],
    tiktokOpen: 'Open my TikTok data',
    tiktokDemo: 'Try the TikTok demo',

    platformSoon: 'YouTube, Google and X are coming.',
    platformComingSoon: 'Analysis coming soon',

    rightTitle:
      'You have the right to get your data back. Being able to read it is another matter.',
    rightLaw:
      'The GDPR requires Instagram, TikTok or Google to hand you a copy of what they keep on you, on request. The law works: the export arrives.',
    rightArchive:
      'What arrives is a technical archive: folders of files, built to be compliant, not to be read. Transparency stops at the format.',
    rightProduct:
      'PanoptiCool opens that archive and makes it readable: what you wrote, what was inferred, and what it all adds up to. Everything happens in your browser — you can cut the internet before you start.',

    statMessages: '+80,000',
    statMessagesLabel: 'messages recovered from a single Instagram account.',
    statValue: '$500',
    statValueLabel: 'Average of what an Instagram account created 10 years ago can earn Meta.',

    marketTitle: 'This data does not stay where you think it does.',
    marketLede:
      'An advertising profile is not a plain list of interests: it is a file that gets cross-referenced, resold, and that sometimes ends up freely downloadable.',
    consequences: [
      {
        kicker: 'The model',
        title: 'It gets resold',
        text: 'Ad networks, data brokers and third-party apps buy ready-made segments: “25-34, online at night, looking for housing”. You were never a party to the transaction.',
      },
      {
        kicker: 'The accident',
        title: 'It leaks',
        text: 'No database is impregnable. In 2021 the details of more than 500 million Facebook accounts, phone numbers included, ended up freely downloadable. A leak cannot be taken back.',
      },
      {
        kicker: 'The use',
        title: 'It decides things',
        text: 'A profile does not only pick an advert: it can steer a price, a recommendation, the order of what you see. You live with the conclusions without ever getting to read them.',
      },
    ],

    whyKicker: 'why “panopticool”?',
    // Same imposed fragmentation as the French: « panopticon » is italicized mid-sentence.
    whyTextBefore: 'The panopticon (in French, ',
    whyTextItalic: 'panoptique',
    whyTextAfter:
      ') is a prison where a single guard can watch everyone without ever being seen. Platforms work a little like that, except here you’re the one watching, from your own computer, and that’s... cool?',
    whyDemoTikTok: 'TikTok demo, made-up data →',
    whyDemoInstagram: 'Instagram demo, made-up data →',

    learnKicker: 'Understand',
    learnTitle: 'Read further',
    learnLede:
      'What the law says, who enforces it, and why privacy is not just a matter for people with something to hide.',
    learnLinks: [
      { name: 'La Quadrature du Net', note: 'A French group defending digital rights' },
      { name: 'noyb', note: 'The collective complaints against the tech giants' },
      {
        name: 'Privacy Guides — why it matters',
        note: 'Privacy, secrecy, anonymity: what sets them apart',
      },
    ],

    actKicker: 'Act',
    actTitle: 'Test yourself, and protect yourself',
    actLede: 'Free tools to measure your exposure and pick alternatives, at your own pace.',
    actLinks: [
      { name: 'Have I Been Pwned', note: 'Check whether your address has already leaked' },
      {
        name: 'Threat modeling',
        note: 'Five minutes to work out what you actually need to protect',
      },
      { name: 'Privacy Guides — tools', note: 'Recommended alternatives, by use case' },
    ],
  },

  UI_GUIDE: {
    openLabel: 'How do I get my data?',
    pickTitle: 'Which file are you after?',
    pickLede: 'You ask for it inside the app, in a handful of steps.',
    close: 'Close',
    back: 'Back',
    previous: 'Previous step',
    next: 'Next step',
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    waitDot: 'And then: the wait',

    waitTitle: 'The file arrives in a few days.',
    waitText:
      'The platform builds the archive on its side. There is nothing to do until then — but a request made on a Thursday evening is an easy thing to forget.',
    reminderButton: 'Add a reminder to my calendar',
    reminderNote: 'Once downloaded, open this file and pick your calendar app.',
    reminderSummaryTikTok: 'Collect my TikTok export',
    reminderSummaryInstagram: 'Collect my Instagram export',
    reminderDescription:
      'The file should be ready. Grab the .zip from the app, then drop it on PanoptiCool.',

    tiktok: {
      label: 'TikTok',
      lede: 'Six steps inside the app. JSON is not the format it offers by default.',
      steps: [
        {
          text: 'Open your profile, then the ☰ menu at the top right.',
          alt: 'TikTok’s Profile tab, with the menu icon at the top right.',
        },
        {
          text: 'Scroll to the very bottom of the menu, to “Settings and privacy”.',
          alt: 'TikTok’s side menu, open on the “Settings and privacy” row.',
        },
        {
          text: 'Under the “Account” section, open “Account”.',
          alt: 'The Settings and privacy screen, showing the Account section.',
        },
        {
          text: 'At the very bottom of the list: “Download your data”.',
          alt: 'The Account screen, with the “Download your data” row at the bottom.',
        },
        {
          text: 'Pick the JSON format — that is the one PanoptiCool reads — then “Select all”.',
          alt: 'The format picker open on JSON, with all ten categories ticked.',
        },
        {
          text: 'Submit, then come back a few days later to the “Download data” tab to collect the .zip.',
          alt: 'The “Download data” tab, showing the pending request.',
        },
      ],
    },

    instagram: {
      label: 'Instagram',
      lede: 'Seven steps. Remember to ask for “All time”: by default, Meta only hands over a year.',
      steps: [
        {
          text: 'Open “Settings and activity”, then “Accounts Center” at the very top.',
          alt: 'Instagram’s Settings and activity screen, with Accounts Center first.',
        },
        {
          text: 'Inside Accounts Center: “Your information and permissions”.',
          alt: 'The Accounts Center panel, showing the “Your information and permissions” row.',
        },
        {
          text: 'Open “Export your information”.',
          alt: 'The “Your information and permissions” screen, with “Export your information”.',
        },
        {
          text: 'Tap “Create export”.',
          alt: 'The Export your information screen, with the “Create export” button.',
        },
        {
          text: 'Choose “Export to device” — not to an external service.',
          alt: 'The “Choose where to export” screen, with both destinations.',
        },
        {
          text: 'Set the three rows: date range “All time”, format JSON, and lower media quality so the archive stays openable.',
          alt: 'The options screen, set to All time, JSON and lower quality.',
        },
        {
          text: 'Submit. Meta prepares the file and emails you a link — expect a few days.',
          alt: 'The Current activity tab, with the request pending.',
        },
      ],
    },
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

  // The STATUS of each step is not translated — it lives in the component's spine
  // (`ROADMAP_STEPS`), cf. the French half. What is here is the prose, in the SAME order.
  //
  // The dates are written in the American form (`OG_LOCALE.en = 'en_US'`, like the rest of the file):
  // « 31 juillet 2026 » becomes « July 31, 2026 » and not « 31 July 2026 ».
  UI_ROADMAP: {
    kicker: 'roadmap',
    titleLine1: 'What’s done,',
    titleLine2: 'what’s coming',
    lede: 'The plan is to move forward one platform at a time, taking the time to build an analysis that is coherent, accessible and genuinely explanatory for each one.',

    statusDone: 'Done',
    statusNow: 'In progress',
    statusNext: 'Planned',

    steps: [
      {
        date: 'May 2026',
        title: 'TikTok analysis, by lexicon and local AI',
        text: 'Drop your export and see what it reveals: rhythms, interests, sensitive signals. Everything happens in the browser, nothing is sent.',
      },
      {
        date: 'July 2026',
        title: 'English version',
        text: 'Full translation of the machinery, the lexicons, the site and the GitHub repository, from French into English.',
      },
      {
        date: 'July 31, 2026',
        title: 'Instagram analysis',
        text: 'The Instagram export is far richer than TikTok’s, which calls for an entirely different approach to make that data readable: a map of locations, an analysis of conversations…',
      },
      {
        date: 'upcoming',
        title: 'Browser extension to delete your own content automatically',
        text: 'An Instagram export can contain the messages and the media — photos, videos, audio — sent in your conversations, which makes it especially sensitive. What this extension is for: pick what you want to unsend from within PanoptiCool, then let it delete the selected content for you.',
      },
      {
        date: 'upcoming',
        title: 'Email generator for partial GDPR / CCPA data erasure',
        text: 'Generating a personalized email from the data you selected in PanoptiCool, plus other recommended categories, to cut down how much the platforms keep about you without having to delete your account.',
      },
    ],

    helpKicker: 'want to help?',
    helpTitle: 'What I won’t have time to do alone',
    helpLede:
      'A few examples of where a hand would be precious — this list is neither exhaustive nor ordered by priority.',
    helpItems: [
      'Enriching the analysis lexicons, in French as much as in English: suggesting words, phrases, colloquial variants. No technical skill needed.',
      'Digging through your own export to spot what could still be drawn from it. The TikTok analysis was built from mine, where a lot of fields were empty: I have never posted content and ad personalization is off on my accounts, so whole sections remain unexplored. Don’t send me your export — just tell me what you find in it.',
      'And more broadly: feedback, a bug, a sentence that rings wrong, a criticism, a piece of advice or an idea.',
    ],
    helpGithub: 'Browse the GitHub repository',
    helpContact: 'Get in touch',
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
  },

  UI_CARD: {
    sensitiveTag: 'sensitive',
    headSources: (n: number) => `${n} ${plural(n, 'source', 'sources')}`,
    // Glyphs: identical in both languages BY DESIGN, cf. the French comment. The non-copy
    // witness of `copy-parity.test.ts` tolerates a margin of identical entries for this.
    caretClosed: '▾',
    caretOpen: '▴',

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
    tocTitle: 'Contents',
    tocNote: 'Everything is read on your computer. Nothing is sent.',
    tocNoteDemo: 'Made-up data. Everything is read on your computer.',

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
    summaryActorsTitle: 'What can be drawn from it',
    summaryActorTakeaways: [
      'interests and consumption habits',
      'availability, tiredness, exploitable windows of attention',
      'sensitive signals — mental health, political opinion, hostility — each with a confidence level',
      'segments that can be sold on to advertisers, data brokers, even authorities',
    ],
    summaryFoot:
      'PanoptiCool passes no judgment: it only shows what TikTok could infer — so you can decide what to expose.',
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
          // As in French: the page no longer displays levels — this panel therefore no longer
          // refers to mentions the reader will see nowhere.
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
    // ⚠ ENGLISH DOES NOT AGREE THE PARTICIPLE: « left out » does not vary. The NOUN, for its part, agrees,
    // and `UNITS.item` carries that part — via `Intl.PluralRules`, so 0 in the PLURAL.
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
    // ENGLISH quotation marks (« “ ” »), not the French chevrons: it is a typographic convention
    // of the language, not a decoration — keeping it French would sound foreign around an English
    // verbatim.
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
