// INSTAGRAM INTERFACE copy, ENGLISH.
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ PROVISIONAL TRANSLATION — TO BE REVIEWED BY yuya, line by line, like the French half.     │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
//
// The form is held by `copy.instagram.fr.ts`: this file annotates itself `InstagramCopy`, so a
// forgotten entry, an extra key or a diverging signature are COMPILATION errors. What no compiler
// sees is whether an entry is actually translated.
//
// ⚠ THE ARRAY LENGTHS ARE NOT HELD BY THE TYPE (`T[]`, never a tuple) — `copy-parity.test.ts`
// compares them at runtime, and this pair adds two arrays to the list it enumerates.
//
// HERE THE SECOND PERSON IS THE NORM, exactly as in `copy.en.ts` and exactly opposite to
// `wording.instagram.en.ts`. « your export », « your messages ». That inversion is the whole reason
// the two files are separate.

import type { InstagramCopy } from './copy.instagram';

export const EN_INSTAGRAM: InstagramCopy = {
  UI_IG_SHELL: {
    /** The glyph carries the state; the label never moves. Same convention as « never opened
     * a terminal? » and as the TikTok product. */
    learnGlyphClosed: '▾',
    learnGlyphOpen: '✕',
    badgeDemo: 'Instagram · demo',
    badgeReal: 'Instagram · local analysis',

    kicker: 'read-only · on your device',
    titleLead: 'Here is what ',
    titlePlatform: 'Instagram',
    titleTail: ' kept about you.',
    lede: 'Years of traces, handed over by the platform itself. We read them entirely on your device and show you the shape of the file. No verdict: a mirror.',

    openZip: 'Open my export (.zip)',
    openFolder: 'or point at the unzipped folder',
    folderHint:
      'The folder route only works on Chrome, Edge, Brave or Arc. The .zip works everywhere.',

    guarantees: [
      'Nothing is uploaded, nothing is stored',
      'Your messages are only read if you open a conversation, and are never kept',
      'Works offline',
    ],

    sizeNote:
      'An export of several gigabytes will open: the archive is read in pieces, never decompressed whole.',

    analysingKicker: 'reading the file',
    analysingSub: 'The pieces are built one after another while you explore.',

    errorKicker: 'reading interrupted',
    errorRetry: 'Try again',
    errorNotInstagram:
      'This file does not look like an Instagram export. Check that it is the archive you received by email, in JSON format.',
    errorWorker:
      'The analysis could not start on this device. Try again: your file is not the problem.',
    errorUnreadable:
      'The archive could not be read. It may be incomplete, or the download may have been interrupted.',

    lowCoverage: (matched: string, total: string) =>
      `Only ${matched} of ${total} field names were recognised: this export is probably in a language this version does not know yet. The empty sections are likely empty for that reason.`,

    noGeoDatabase:
      'The geolocation database is not installed: the map shows the real GPS points, without the layer inferred from logins.',
  },

  UI_IG_RAIL: {
    title: 'Contents',
    items: [
      { id: 'identity', index: '01', label: 'Identity' },
      { id: 'map', index: '02', label: 'The map' },
      { id: 'messages', index: '03', label: 'Messages' },
      { id: 'interactions', index: '04', label: 'Interactions' },
      { id: 'files', index: '05', label: 'Files' },
      { id: 'ai', index: '06', label: 'AI analysis' },
    ],
    stateLoading: 'loading',
    stateSoon: 'coming',
    note: 'Read on your computer. Nothing is sent.',
    comingSoon: 'This piece is coming.',
  },

  UI_IG_IDENTITY: {
    h1: 'Instagram',
    lede: (years: string) =>
      `${years} years of activity: what you wrote yourself, and what was inferred.`,
    sub: 'Six parts: your identity as it has been reassembled, the places you passed through, your conversations, the accounts you cross, the files received and sent. The last part is optional and lets you run a local AI model to analyse your conversations.',

    learnOpen: 'understand · the inferred data',
    learnTitle: 'Where does what you never wrote come from?',
    learnCols: [
      {
        k: 'What you declare',
        p: 'Handle, email, phone, date of birth: the fields you filled in yourself. You can read them back, correct them, erase them.',
      },
      {
        k: 'What is inferred',
        p: 'Your city comes from your internet address, your language from your phone, your probable age and your interests from your usage.',
      },
      {
        k: 'Why it matters',
        p: 'These guessed fields are the ones used for ad targeting. A wrong inference stays in your profile: you can neither see it in the app nor correct it.',
      },
    ],

    openedIn: (when: string) => `Account opened in ${when}`,
    openedUnknown: 'Opening date absent from the export',
    age: 'Age',
    ageValue: (years: string) => `${years} years`,
    logins: 'Logins',
    fieldsFilled: 'Fields filled',
    fieldsFilledValue: (filled: string, total: string) => `${filled} of ${total}`,

    declaredTitle: 'What you gave',
    declaredSub: (n: number) =>
      `${n} piece${n > 1 ? 's' : ''} of information you entered yourself.`,
    guessedTitle: 'What Meta guessed',
    guessedSub: (n: number) => `${n} piece${n > 1 ? 's' : ''} of information nobody asked you for.`,
    guessedFoot: 'Inferred from your IP address, your contacts and your usage.',

    fields: {
      name: 'Name',
      handle: 'Handle',
      dob: 'Birth',
      gender: 'Gender',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      secondPhone: 'Second phone',
      adTargeting: 'Ad targeting',
      privateAccount: 'Private account',
    },
    notes: {
      cityNeverGiven: 'You never filled it in',
      phoneNeverGiven: 'You never gave it',
      adsNeverChosen: 'You never chose them',
    },
    adCategories: (n: string) => `${n} categories`,

    actionsTitle: 'What you did',
    actionsCount: (n: string) => `${n} actions recorded one by one.`,
    viewGroupLabel: 'Actions view',
    viewOverview: 'Overview',
    viewDetail: 'In detail',
    actionsMore: (parts: string) => `Plus ${parts}.`,
    gestures: {
      likes: 'Posts liked',
      saves: 'Posts saved',
      storyLikes: 'Stories liked',
      comments: 'Comments posted',
      commentLikes: 'Comments liked',
      polls: 'Polls answered',
    },
    storiesViewedPart: (n: string) => `${n} stories viewed (last 30 days)`,

    detailGesturesTitle: 'All your actions',
    detailStoriesNote: (n: string) =>
      `Plus ${n} stories viewed — Instagram only keeps 30 days of those, so this counter says nothing about the years before.`,
    lifeTitle: 'The account’s life',
    lifeLede:
      'These lines are not actions: they are the events Meta logs about the account itself, including your export requests.',
    life: {
      logins: 'Logins',
      checkpoints: 'Security checkpoints',
      passwords: 'Password changes',
      privacy: 'Visibility changes',
      exports: 'Export requests',
    },
    pastTitle: 'What you used to be',
    pastLede: (n: number) =>
      `An abandoned handle, a changed name, a replaced address: the previous value stays archived. ${n} earlier identit${n > 1 ? 'ies appear' : 'y appears'} in your export.`,
    pastFields: { username: 'handle', displayName: 'display name' },
    pastUnknownDate: 'date unknown',

    suiteTitle: 'The rest of the file',
    suiteStateLoading: 'analysing…',
    suiteStateSoon: 'coming',
    suite: {
      mapLabel: '01 · The map',
      mapBig: (n: string) => `${n} places`,
      mapSub: (ips: string, gps: string) =>
        `${ips} distinct internet addresses, ${gps} geotagged posts.`,
      messagesLabel: '02 · Messages',
      messagesBig: (n: string) => `${n} messages`,
      messagesSub: (threads: string, people: string) => `${threads} threads with ${people} people.`,
      interactionsLabel: '03 · Interactions',
      interactionsBig: (n: string) => `${n} following`,
      interactionsSub: (followers: string, pending: string) =>
        `${followers} followers, ${pending} requests sent, and every other public interaction.`,
      filesLabel: '04 · Files',
      filesBig: (n: string) => `${n} media`,
      filesSub: 'Photos, videos and voice notes exchanged, all kept.',
    },

    foot: 'Every value shown comes from your export and stays on this device.',
  },

  UI_IG_MESSAGES: {
    h1: (years: string) => `${years} years of conversations, kept message by message.`,
    lede: (span: string) =>
      `${span},  every message, photo, video, and voice note exchanged with your contacts has been saved. You can access the details of each conversation on this page.`,
    spanFromTo: (from: string, to: string) => `From ${from} to ${to}`,
    spanAll: 'Across the whole archive',
    learnOpen: 'understand · the messages kept',
    learnTitle: 'What is left of a private conversation?',
    learnKeptK: 'What is kept',
    learnKeptP:
      'Every message with its author and timestamp, the reactions, the length of calls, the voice ' +
      'notes. A thread deleted from the app can remain in the export.',
    learnCryptK: 'Not encrypted by default',
    learnCryptP:
      'Instagram messages are not end-to-end encrypted unless you turned it on. Meta can therefore ' +
      'read them, and a legal request or a leak exposes them.',
    learnFormK: 'The content, but the shape too',
    learnFormP:
      'Even without reading a word, the hours and the rhythm of the exchanges are enough to spot ' +
      'who matters to you, when a relationship starts and when it fades.',

    tileMessages: 'messages exchanged',
    tilePeople: 'different people',
    tileThreads: (groups: string) => `threads, ${groups} of them groups`,
    tileSelf: (n: string) => `written by you (${n})`,

    count: (n: string) => `${n} conversations`,
    viewGroupLabel: 'Display',
    viewTrame: 'Over time',
    viewFile: 'In detail',

    grain: 'Grain',
    grains: { month: 'Month', quarter: 'Quarter', year: 'Year' },
    orient: 'Direction',
    orientH: 'Horizontal',
    orientV: 'Vertical',
    page: 'page ',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    hint: 'click a row to open the thread',
    scaleLess: 'less',
    scaleMore: 'more',
    hoverCell: (title: string, when: string, n: string) => `${title} · ${when} · ${n} messages`,
    hoverRow: (title: string, n: string) => `${title} — ${n} messages in all`,

    tableThread: 'Thread',
    tableBalance: 'Balance',
    tableMessages: 'Messages',
    tableEmpty: 'No thread answers this query.',
    tableLegend:
      'Balance: the share of messages sent by you (warm) against received (cool). No message ' +
      'content is read.',
    tablePeopleShort: 'them',
    groupMark: 'group conversation',
    balanceTitle: (pct: string) => `${pct} % from you`,

    beyondTitle: 'Beyond the text',
    beyondLede: 'Everything you sent in these threads is kept exactly as it was.',

    contentLabels: {
      photos: 'Photos',
      videos: 'Videos',
      audio: 'Voice notes',
      shares: 'Shares',
      calls: 'Calls',
    },
    searchPlaceholder: 'thread starting with...',
    searchLabel: 'Filter threads by name',
    filters: {
      contents: 'Contents',
      contentsAll: 'All',
      contentsChecked: (n: string) => `${n} ticked`,
      balance: 'Balance',
      time: 'Age',
      reset: 'clear all',
    },
    directionLabels: { any: 'Any', self: 'Sent by you', others: 'Received' },
    balanceLabels: { any: 'Any', self: 'Mostly you', others: 'Mostly them' },
    timeLabels: {
      any: 'Any',
      recent: 'Less than a year',
      fading: '1 to 5 years',
      dormant: 'More than 5 years',
    },
    phraseNone: 'No active filter, every conversation in your export.',
    phraseActive: (parts: string) => `Active filters — ${parts}.`,
    phraseSearch: (q: string) => `starting with « ${q} »`,

    panel: {
      close: 'Close',
      meta: (kind: string, from: string, to: string) => `${kind} · ${from} → ${to}`,
      kindGroup: (n: string) => `group · ${n} participants`,
      kindSolo: 'one-to-one conversation',
      viewFiche: 'The measures',
      viewThread: 'The conversation',
      messages: 'messages',
      messagesIn: (span: string) => `messages over ${span}`,
      replyMedian: 'median reply time',
      versus: 'against',
      calls: (n: string) => `calls · ${n}`,
      callsNoDuration: 'calls',
      whoWrites: 'Who writes?',
      you: 'you',
      whatSent: 'What you sent each other',
      reactions: 'Reactions',
      seeFiles: 'See the files',
      fileAll: 'all',
      filePhotos: 'photos',
      fileVideos: 'videos',
      fileAudio: 'voice notes',
      rhythm: (from: string, to: string) => `The rhythm · ${from} → ${to}`,
      noFiles: 'No file in this thread.',
    },
  },

  UI_IG_ANALYSE: {
    h1: 'Have your conversations interpreted by an AI that runs on your device.',
    lede:
      'Four steps, once. The model installs on your computer: your conversations never leave the ' +
      'device.',
    learnOpen: 'understand · the model',
    learnTitle: 'How does the model running on your device work?',
    learnCols: [
      {
        k: 'Predicting the next word',
        p:
          'A language model does not « think »: it predicts the most probable word fragment, ' +
          'thousands of times over. That stream is what you see being written.',
      },
      {
        k: 'Tokens',
        p:
          'Your text is cut into « tokens » (about ¾ of a word each). It is the unit counted ' +
          'everywhere here: prompt size, speed, answer length.',
      },
      {
        k: 'Quantisation (Q4, Q3…)',
        p:
          'The variants offered are the same model, more or less compressed to fit in your ' +
          'memory. The more compressed, the lighter — and the less fine.',
      },
      {
        k: 'Local = private',
        p:
          'The model is a plain file on your disk. Once downloaded you can cut the internet: the ' +
          'analysis still works, and nothing leaves your device.',
      },
    ],

    /** ⚠ FOUR states, not two: the browser's ENGINE decides three different speeches (ADR-0006),
     *  and an unknown engine is not a verdict — neither compatible nor blocked, simply unnamed. */
    bannerLocalT: 'This page comes from your device',
    bannerLocalP: 'It is served from your local loopback: no network permission is involved.',
    bannerOkT: (name: string) => `${name} can reach your computer`,
    bannerOkP: 'Route A works: one command, and you stay on this page.',
    bannerKoT: (name: string) => `${name} cannot reach your computer`,
    bannerKoP:
      'Its engine forbids a page from reaching your own machine. Take route B, which works ' +
      'everywhere.',
    bannerUnknownT: 'Browser not recognised',
    bannerUnknownP:
      'There is no telling in advance whether route A will work. Try it: if it fails, route B ' +
      'works everywhere.',

    warnK: 'read before launching',
    warnH: 'What you are about to read is not a verdict.',
    warnCols: [
      {
        t: 'The model can, and will be wrong',
        p:
          'It produces the most probable continuation, not the truth. It will mistake irony for ' +
          'an opinion, a joke for a habit, a one-off contact for a close friend.',
      },
      {
        t: 'It is deliberately modest',
        p:
          'Three billion parameters, compressed to fit on your device: that is the bottom of the ' +
          'range. Everything it guesses here, an industrial model guesses better, faster, and on ' +
          'far more data.',
      },
      {
        t: 'What this demonstrates',
        p:
          'A 3 GB model running on your computer already produces relevant deductions. Meta runs ' +
          'the same computation continuously, on your data and your contacts’, to rank your feed ' +
          'and sell you to advertisers.',
      },
    ],
    warnFootB: 'The reflex is worth more than this page',
    warnFootP:
      ': What you share with an online AI goes to servers and can be used without your knowledge, and its response should be taken with caution. ' +
      'Here, same caution but nothing comes out of your device.',

    step1: 'Start the model',
    step2: 'Check that the page sees it',
    step3: 'Choose the conversations',
    step4: 'Analyse',

    osLabel: 'your system',
    terminalMacos: 'press ⌘ + Space, type « Terminal », then Enter.',
    terminalWindows: 'open the Start menu, type « PowerShell », then Enter.',
    terminalLinux: 'press Ctrl + Alt + T, or look for « Terminal » in your applications.',
    terminalSummary: 'Never opened a terminal?',
    /** Two columns, as in the TikTok product: the gesture first, the definition second. */
    terminalPanelTitle: 'The terminal, in two words',
    terminalHowTitle: (osName: string) => `Opening it on ${osName}`,
    terminalWhatTitle: 'What it is',
    terminalWhat:
      'Just a window where you paste text and press Enter. The commands on this page cannot break ' +
      'anything on your computer.',
    terminalBody: (osName: string, howto: string) =>
      `To open it on ${osName}: ${howto} It is a window where one pastes commands: nothing is ` +
      'irreversible here, the lines below install then start the engine.',
    installBefore: 'Install ',
    installAfter: ', the small free engine that runs the model.',
    brewNote: 'Command not found? Install Homebrew first — one command, given on ',
    modelsLegend:
      'Choose a model — from the finest to the lightest. The heaviest asks the most memory.',
    modelSize: (gb: string) => `${gb} GB`,
    modelRecommended: 'recommended',
    modelBorderline: 'borderline, but it works',
    copy: 'copy',
    copied: 'copied',

    routeIntro: 'One last choice: two ways to start this model, same result.',
    routeAT: 'A · From this site',
    routeAP: 'You stay on this page: one command to run. Needs Chrome, Brave or Firefox.',
    routeAOff: (name: string) => `unavailable with ${name}`,
    routeBT: 'B · Everything on your device',
    routeBP: 'llama-server also serves the application: everything runs locally, with any browser.',
    routeAServe:
      'Start the server: it downloads the model on the first launch, then stays open in the ' +
      'background.',
    routeAFirefox: (name: string) =>
      `On the first click on « check », ${name} will ask for permission to reach the local ` +
      'network: a window appears under the address bar — click « Allow ».',
    routeAChromium: (name: string) =>
      `${name} will NOT open a permission window: if the check fails, click the icon left of the ` +
      'address, set « Local network » to « Allow », then reload the page.',
    routeAUnknown:
      'Depending on your browser, you may have to allow it to reach your computer. If the ' +
      'connection fails, this page will tell you what to do.',
    /** ⚠ ROUTE B DOWNLOADS THE SITE, where the prototype pointed at a `dist/` you build yourself:
     *  the archive is a build artifact of THIS site, so the two cannot drift. */
    localDownload:
      'Download the local version of the site — here, or from GitHub if you want to check the ' +
      'code:',
    localZipButton: (zipName: string) => `⬇ ${zipName}`,
    localGithubLink: 'Check the source on GitHub ↗',
    localCmd:
      'Then start everything together — the server serves the application AND the model on the ' +
      'same port, so there is no permission question left:',
    localOpenBefore: 'Then reopen ',
    localOpenAfter: ' in your browser, and come back to this piece.',

    urlAria: 'Local server address',
    check: 'check the connection',
    checking: 'checking…',
    probeOk: (model: string, ctx: string) =>
      `Server detected${model} · context window ${ctx} tokens`,
    probeModelSuffix: (id: string) => `: ${id}`,
    probeKoNotFound: 'Server not detected.',
    probeKoImpossible: 'Connection impossible.',
    probeKoLocal:
      'This page comes from your device: no permission is involved, so it is the server that is ' +
      'not running yet.',
    probeKoBlocked: (name: string) =>
      `${name} blocks access to the local network. Allow it in the padlock of the address bar, ` +
      'then reload the page. Route B works everywhere.',
    probeKoGranted:
      'The browser allows the local network: so it is the server that is not running yet.',
    probeKoUnknown: (name: string) =>
      'Two possible causes, and this page cannot tell them apart: the server is not started, or ' +
      `${name} blocks access to the local network. Try route A; if it fails, route B works ` +
      'everywhere.',
    probeDetail: (err: string) => `technical detail: ${err}`,

    searchPlaceholder: 'thread starting with…',
    pickerAria: 'Conversation to analyse',
    pickNone: 'No conversation chosen — pick one.',
    picked: (title: string) => `Conversation chosen: ${title}`,
    loadingSuffix: ' · reading…',
    loadError: (err: string) =>
      `A thread could not be read back: ${err}. The folder may have been closed — reopen the ` +
      'export.',

    promptLabel: 'Question put to the model',
    promptDefaultBtn: 'Default prompt',
    promptSafetyBtn: 'Safety-net prompt',
    promptDraft: 'a draft — edit it',
    safetyLabel: 'Add the safety net on sensitive subjects',

    sampleK: 'Sample sent:',
    sampleBudget: (sent: string, total: string, seq: string, plural: boolean, tokens: string) =>
      `${sent} messages out of ${total} · ${seq} sequence${plural ? 's' : ''} · ${tokens} tokens`,
    sampleReal: '(exact count from the server)',
    sampleEstimate: '(estimate)',
    samplePeriod: (from: string, to: string) => ` · from ${from} to ${to}`,
    sampleP:
      'The thread is not read in full: extracts spread from its beginning to its end are selected, ' +
      'as many as the model’s window accepts. The prompt announces each period, so the model knows ' +
      'it is comparing distant moments.',
    over: (window: string) =>
      `This extract exceeds what the window can receive (${window} tokens for the prompt, the ` +
      'rest kept for the answer). The server will truncate the beginning, or refuse.',

    run: 'Run the analysis',
    runningLabel: 'analysing…',
    stop: 'stop',
    hintServer: 'check the server first (step 2)',
    hintThread: 'pick a conversation first (step 3)',

    payloadShow: 'See the final prompt ▾',
    payloadHide: 'Hide the final prompt ▴',
    payloadT: 'Final prompt sent to the model',
    payloadMeta: (sent: string, tokens: string) => `${sent} messages sampled · ${tokens} tokens`,
    payloadNote:
      'Exactly what will go to your local server, in this order. The messages are numbered so the ' +
      'model can quote them.',

    runStats: (p: string, c: string, s: string, rate: string) =>
      `${p} tokens sent · ${c} generated · ${s} s · ${rate} tokens/s`,
    privacy:
      'The text goes to the server you started yourself, on this machine. No other network ' +
      'request exists in this feature.',
  },

  UI_IG_CONTROLS: {
    wheelLabel: 'Time wheel',
    wheelPrev: 'One month back',
    wheelNext: 'One month forward',
    fullscreenEnter: (what: string) => `Show ${what} fullscreen`,
    fullscreenExit: (what: string) => `Leave fullscreen for ${what}`,
    fullscreenShort: 'Fullscreen',
    fullscreenExitShort: 'Leave',
    fullscreenScene: 'the scene',
    stickLabel: 'Move',
    viewerDownload: 'Download',
    viewerClose: 'Close',
    viewerPrev: 'Previous',
    viewerNext: 'Next',
    viewerLoading: 'Loading…',
    viewerMissing: 'This file is not in the export.',
    viewerCount: (i: string, n: string) => `${i} of ${n}`,
  },

  UI_IG_MAP: {
    h1: (since: string) => `Instagram knows where you were, almost every month since ${since}.`,
    h1NoDate: 'Instagram knows where you were.',
    lede:
      'Two sources mix in your export: the places you handed over yourself, and the ones your ' +
      'internet address gave away without your knowing.',
    learnOpen: 'understand · geolocation',
    learnTitle: 'How does Instagram know where you were?',
    learnSourcesK: 'Two sources',
    learnSourcesP:
      'The places you added to your posts, precise to the building. And the internet address ' +
      'recorded at every login, which gives the city.',
    learnDrawK: 'What that draws',
    learnDrawP:
      'One point a month over twelve years is enough to reveal your home, your moves, your ' +
      'holidays and your regular journeys. No GPS is needed.',
    learnCareK: 'To be taken with care',
    learnCareP:
      'An internet address is not a position: a VPN, a shared connection or a mobile network can ' +
      'move a point by hundreds of kilometres.',

    count: (n: string) => `${n} places`,
    sub: (cities: string, precise: string) => `${cities} inferred cities, ${precise} shared places`,
    viewGroupLabel: 'View of the places',
    viewMap: 'Map',
    viewDetail: 'In detail',
    frameLabel: 'the map',

    layerDeclared: (n: string) => `Declared · ${n} precise points`,
    layerInferred: (n: string) => `Inferred · ${n} IP logins`,

    attribution: 'Outlines: Natural Earth · IP: DB-IP',

    kindPost: 'Geotagged post',
    kindStory: 'Story (EXIF GPS)',
    kindLast: 'Position',
    precise: 'precise',
    more: (n: string) => `+${n} other`,
    moreMany: (n: string) => `+${n} others`,

    cityDetail: (city: string) => `Detail of ${city}`,
    citySamePlace: (n: string) => `${n} places on the same IP address`,
    cityReadings: 'Login readings',
    cityConn: (n: string) => `${n} logins`,
    cityNote:
      'The export gives their name, never their coordinates: they therefore share the IP’s point.',
    periodUnknown: 'Unknown period',
    periodCount: (n: string, span: string) => `${n} period · ${span}`,
    periodCountMany: (n: string, span: string) => `${n} periods · ${span}`,
    periodAria: (n: string, from: string, to: string) =>
      `${n} login periods, from ${from} to ${to}`,

    zoneConn: 'IP login',
    zoneConnMany: 'IP logins',
    zonePlaces: (places: string, span: string) => `${places} place · ${span}`,
    zonePlacesMany: (places: string, span: string) => `${places} places · ${span}`,
  },

  UI_IG_SPACE: {
    h1: (n: string, years: string) => `In ${years} years, you crossed paths with ${n} accounts.`,
    lede:
      'Instagram stores the interactions you have with every account, including the ones you no ' +
      'longer recognise.',
    learnOpen: 'understand · what your relations reveal',
    learnTitle: 'What can be learnt from your relations without reading a single message?',
    learnPosK: 'What is counted',
    learnPosP:
      'Follows, followers, likes, comments, requests sent, accounts blocked or muted: every ' +
      'gesture is dated and attached to an account.',
    learnSizeK: 'What it ranks',
    learnSizeP:
      'By crossing the direction of the link with how often you exchange, Instagram sorts your ' +
      'relations without your having said so: close, acquaintances, one-way follows.',
    learnDormK: 'What it is for',
    learnDormP:
      'It feeds account suggestions and advertising by entourage: you can be targeted because ' +
      'people close to you reacted to an ad, without having posted anything yourself.',

    countAccounts: (n: string) => `${n} accounts`,
    tileMutual: 'mutual links',
    tileFollowing: 'accounts you follow',
    tileFollower: 'accounts following you',
    tileNone: 'with no link',

    viewGroupLabel: 'View of the accounts',
    viewSpace: '3D view',
    viewFile: 'In detail',
    frameLabel: 'the space',

    searchPlaceholder: 'handle starting with.',
    searchLabel: 'Filter accounts by handle',
    filterLink: 'Link',
    filterLists: 'Statuses',
    filterTime: 'Age',
    listsAll: 'All',
    listsChecked: (n: string) => `${n} ticked`,

    linkAll: 'All',
    linkMutual: 'Mutual',
    linkFollowing: 'You follow',
    linkFollower: 'Follows you',
    linkNoFollow: 'No follow link',
    listBlocked: 'Blocked',
    listPending: 'Requests sent',
    listCloseFriend: 'Close friends',
    listFavorite: 'Favourites',
    listHideStory: 'Hidden stories',

    density: 'density',
    hidden: (n: string) =>
      `The ${n} least active accounts are not shown; raise the density or filter to bring them out.`,
    reframe: 'Reframe',
    empty: 'No account matches.',

    /**
     * ⚠ THE VEIL'S LINES ARE SEGMENTED, alternating plain and emphasised: index 0 is plain, 1 is a
     * key cap, 2 plain again, and so on. The gesture and its name have to be told apart at a
     * glance — « WASD » set like the sentence around it stops looking like a key.
     */
    veilTitle: 'Explore your interactions',
    veilMouse: [
      ['', 'WASD', ' or the ', 'arrow keys', ' — to move'],
      ['', 'Hold the click', ' and move the mouse — to turn and look around'],
      ['', 'Click', ' someone — to open their card'],
    ],
    veilTouch: [
      ['The ', 'joystick', ', bottom left — slide on it to move'],
      ['', 'Swipe', ' on the scene — to look around'],
      ['', 'Tap', ' someone — their card'],
    ],
    veilGoMouse: 'A key or a click here to begin.',
    veilGoTouch: 'Touch the screen to begin.',
    legendHint: 'bigger = more actions from you · position encodes nothing',

    tableWho: 'Handle',
    tableLink: 'Link',
    tableActions: 'Actions',
    tableLast: 'When',
    tableNever: 'never',
    tableEmpty: 'No account answers this query.',
    tableLegend: 'Actions = your liked stories, polls, comments posted and liked.',
    /** « 3 months ago » — an absolute date would mean doing the arithmetic on every row. */
    agoToday: 'today',
    agoDays: (n: string) => `${n} d ago`,
    agoMonths: (n: string) => `${n} months ago`,
    agoOneYear: '1 year ago',
    agoYears: (n: string) => `${n} years ago`,

    panelClose: 'Close',
    panelLast: (when: string) => `last interaction ${when}`,
    panelTotal: 'actions from you towards this account',
    panelActions: 'The actions in detail',
    panelTimeline: 'Over time',
    actions: {
      story_like: 'Liked stories',
      poll: 'Polls',
      comment: 'Comments',
      comment_like: 'Comment likes',
    },
    badgeCloseFriend: 'Close friend',
    badgeFavorite: 'Favourite',
    badgeBlocked: 'Blocked',
    badgePending: 'Request with no answer',
    badgeHideStory: 'Story hidden',
    panelContentNote:
      'Texts of your comments / questions of polls you answered. The export stores neither the ' +
      'option you chose nor the text of the comments you liked.',
    panelDirectionNote:
      'The export does not say what this account did on your side — Instagram only provides your ' +
      'own actions (and your follower list).',

    foot:
      'Everything listed here is your interactions towards other people: the export does not ' +
      'contain the reverse direction.',
  },

  UI_IG_UNIVERSE: {
    h1: 'Everything you sent, received, posted.',
    lede: (n: string) =>
      `${n} files, laid out in time. Each point is a photo, a video or a voice note — the spiral ` +
      `orders them oldest to most recent, roughly one turn a year.`,
    learnOpen: 'understand · this spiral',
    learnTitle: 'How to read this space?',
    learnTimeK: 'Time goes up',
    learnTimeP:
      'The oldest is at the bottom, the most recent at the top, and the year is written on the ' +
      'side. How thick a pass is says how much you exchanged that year.',
    learnKindK: 'Colour says the type',
    learnKindP:
      'Photo, video, voice note. A voice note has no thumbnail — the export keeps no content for ' +
      'it, only the file.',
    learnLimitK: 'This is not all of it',
    learnLimitP:
      'A sample is shown, not the whole archive: past a thousand objects nothing can be told ' +
      'apart. The number shown is always written under the slider.',

    countFiles: (n: string) => `${n} files`,
    frameLabel: 'the space',

    searchPlaceholder: 'Search an account',
    searchLabel: 'Filter by account',
    filterKind: 'Type',
    filterSource: 'Source',
    filterTime: 'Period',
    reset: 'Clear all',
    all: 'All',

    kindPhoto: 'Photos',
    kindVideo: 'Videos',
    kindAudio: 'Voice notes',
    sourceDm: 'Messages',
    sourceStory: 'Stories',
    sourcePost: 'Posts',

    sample: 'Objects shown',
    sampleValue: (shown: string, total: string) => `${shown} of ${total}`,
    viewGroupLabel: 'Media view',
    viewScene: '3D view',
    viewFile: 'In detail',
    layoutGroupLabel: 'Display',
    layoutSpiral: 'Chronology',
    layoutSource: 'Sources',
    density: 'density',
    lot: (n: string, total: string) => `batch ${n} / ${total}`,
    lotPrev: 'Previous batch',
    lotNext: 'Next batch',

    veilTitle: 'Explore your files',
    veilMouse: [
      ['', 'WASD', ' or the ', 'arrow keys', ' — to move'],
      ['', 'Hold the click', ' and move the mouse — to turn and look around'],
      ['', 'Click', ' a media — to open it'],
    ],
    veilTouch: [
      ['The ', 'joystick', ', bottom left — slide on it to move'],
      ['', 'Swipe', ' on the scene — to look around'],
      ['', 'Tap', ' a media — to open it'],
    ],
    veilGoMouse: 'A key or a click here to begin.',
    veilGoTouch: 'Touch the screen to begin.',

    tableListed: (shown: string, total: string) => `${shown} media listed out of ${total}`,
    tableRecent: '⤒ newest',
    tableOld: 'oldest ⤓',
    tableEmpty: 'No media answers this query.',
    tableShownInYear: (n: string, plural: boolean) => `${n} shown${plural ? '' : ''}`,
    tableProgress: (shown: string, total: string) => `${shown} of ${total}`,
    tableMore: (n: string) => `load ${n} more`,
    tableEnd: (n: string) => `end — ${n} media`,
    kindUnitPhoto: 'photo',
    kindUnitVideo: 'video',
    kindUnitAudio: 'voice note',
    empty: 'No file matches.',
  },

  UI_IG_QUERY: {
    none: 'No active filter, every account crossed in your export.',
    active: (parts: string) => `Active filters — ${parts}.`,
    startingWith: (q: string) => `starting with « ${q} »`,
    lastSeen: (phrase: string) => `last seen ${phrase}`,
    reset: 'clear all',
    timePhrase: {
      any: '',
      recent: 'less than a year ago',
      fading: 'one to five years ago',
      dormant: 'more than five years ago',
    },
  },

  UI_IG_MAP_DETAIL: {
    citiesH: 'Where you have been',
    citiesLede: (conn: string, cities: string) =>
      `${conn} logins across ${cities} cities. Each bar marks a period of presence.`,
    placesH: 'The places you handed over yourself',
    addressesH: 'The recorded addresses',
    addressesLede:
      'Typed once for a form, kept ever since. These are not coordinates but postal addresses: ' +
      'the street, the number, the postcode.',
    addressUpdated: (when: string) => `updated ${when}`,
    cityConn: (n: string) => `${n} logins`,
    cityConnOne: (n: string) => `${n} login`,
    cityDateUnknown: 'unknown date',
    citiesMore: (n: string) => `See the other ${n} cities`,
    citiesLess: (n: string) => `Keep only the first ${n}`,
    placesLede: (n: string) =>
      `${n} points accurate to the metre, sent with a post or a story. Unlike the cities above, ` +
      `these are not inferred: they come out of the file as they are. The thumbnail is the real ` +
      `media from your export — click to open it.`,
    yearPoints: (n: string) => `${n} points`,
    yearPointsOne: (n: string) => `${n} point`,
    yearUnknown: 'unknown date',
    placesMore: (n: string) => `Show the other ${n} places`,
    placesLess: (n: string) => `Keep only the ${n} most recent`,
    openMedia: (kind: string, when: string) => `Open the ${kind} of ${when}`,
    rawH: 'The raw matter',
    rawLede:
      'What everything above is drawn from. Folded, because a list of several hundred lines proves ' +
      'nothing one has not just read — and unfolded when you want to check that the count is there.',
    rawEnables: (what: string) => `What it enables: ${what}.`,
    rawRest: (hidden: string, shown: string) =>
      `${hidden} others are not listed: the engine stops at ${shown} values, so as not to build in ` +
      `memory a list nobody will read in full.`,
    kindPost: 'post',
    kindStory: 'story',
    kindLast: 'last known position',
    empty: 'Nothing to detail in this export.',
  },

  UI_IG_READER: {
    loading: 'Reading the thread…',
    empty: 'This thread holds no readable message.',
    failed:
      'This thread could not be read back. The folder may have been closed — reopen the export.',
    /**
     * ⚠ THE SENTENCE IS IN THREE PIECES because two of its numbers are set in `<b>`: they are the
     * window, and the window is what the line exists to state. The order is fixed by the markup, so
     * a language that would place « of 18,584 » first cannot be served by these three keys — say so
     * rather than discover it.
     */
    rangeLead: 'messages',
    rangeTo: 'to',
    rangeOf: 'of',
    toStart: '⤒ start',
    toEnd: 'end ⤓',
    loadPrev: (n: string) => `load the previous ${n} messages`,
    loadNext: (n: string) => `load the next ${n} messages`,
    call: (min: string) => `call · ${min} min`,
    unsent: 'deleted message',
    mediaTitle: 'media',
    unavailable: 'This thread’s content cannot be read back here.',
  },
};
