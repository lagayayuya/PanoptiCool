// INSTAGRAM INTERFACE copy, FRENCH — the fourth ratifiable perimeter.
//
// ⚠ SEPARATE FROM `wording.instagram.*`, AND NOT TO BE MERGED WITH IT. The two are ratified under
// OPPOSITE constraints on the second person: the engine never addresses the person (ADR-0003), the
// interface always does. « ton export » belongs here; « rattacher le compte à une personne nommée »
// belongs there. Merging them would put both registers in one file and lose the one rule that makes
// each reviewable.
//
// ⚠ SEPARATE FROM `copy.fr.ts` TOO, and for the reason CLAUDE.md gives for the split by surface: a
// perimeter is worth what a human can re-read IN ONE PASS. The TikTok copy is already ~930 lines;
// the Instagram shell and its six modules would double it, and a reviewer who skims is a reviewer
// who ratifies nothing.
//
// SHAPE ORACLE for the Instagram pair: the type derives from THIS file, so the tables stay
// UNANNOTATED LITERALS and carry no `as const` — annotating erases the keys, `as const` makes every
// string its own literal type and rejects the translation for being a translation. Both measured,
// on the two pairs that came before.

export const FR_INSTAGRAM = {
  UI_IG_SHELL: {
    /** Le glyphe dit l'état du dépliant, le libellé ne bouge pas : une commande qui change
     * de nom en s'ouvrant oblige à relire pour retrouver ce qu'on venait d'ouvrir. Même
     * convention que « jamais ouvert de terminal ? », et que le produit TikTok. */
    learnGlyphClosed: '▾',
    learnGlyphOpen: '✕',
    /** The badge in the site bar — the platform, then the mode. Same form as TikTok's. */
    badgeDemo: 'Instagram · démo',
    badgeReal: 'Instagram · analyse locale',

    kicker: 'lecture seule · sur ton appareil',
    titleLead: 'Voilà ce qu’',
    /** Rendered in the stamp colour: the platform's name is the subject of the sentence. */
    titlePlatform: 'Instagram',
    titleTail: ' a gardé de toi.',
    lede: 'Des années de traces, remises par la plateforme elle-même. On les lit entièrement sur ton appareil et on te montre la forme du dossier. Pas de verdict : un miroir.',

    openZip: 'Ouvrir mon export (.zip)',
    openFolder: 'ou pointer le dossier décompressé',
    /** Shown only where the folder route can work — never as a complaint about the browser. */
    folderHint: 'Le dossier ne marche que sur Chrome, Edge, Brave ou Arc. Le .zip marche partout.',

    guarantees: [
      'Rien n’est téléversé, rien n’est stocké',
      'Le contenu de tes messages n’est lu que si tu ouvres une conversation, et n’est jamais conservé',
      'Fonctionne hors connexion',
    ],

    /** ⚠ The honest shape of the size limit — a per-entry budget, never a promised total. */
    sizeNote:
      'Un export de plusieurs gigaoctets s’ouvre : l’archive est lue par morceaux, jamais décompressée en entier.',

    analysingKicker: 'lecture du dossier',
    analysingSub: 'Les pièces se construisent l’une après l’autre pendant que tu explores.',

    errorKicker: 'lecture interrompue',
    errorRetry: 'Réessayer',
    errorNotInstagram:
      'Ce fichier ne ressemble pas à un export Instagram. Vérifie que c’est bien l’archive reçue par e-mail, au format JSON.',
    errorWorker:
      'L’analyse n’a pas pu démarrer sur cet appareil. Réessaie : ce n’est pas ton fichier qui est en cause.',
    errorUnreadable:
      'L’archive n’a pas pu être lue. Elle est peut-être incomplète, ou le téléchargement s’est interrompu.',

    /** ⚠ Said when the label table recognised almost nothing — the connector's one silent failure,
     *  given a voice. Without it, an export in an unknown language looks like an empty account. */
    lowCoverage: (matched: string, total: string) =>
      `Seuls ${matched} noms de champs sur ${total} ont été reconnus : cet export est probablement dans une langue que cette version ne connaît pas encore. Les sections vides le sont sans doute pour cette raison.`,

    /** Shown when the geo database is absent — a degraded mode, not a failure. */
    noGeoDatabase:
      'La base de géolocalisation n’est pas installée : la carte montre les points GPS réels, sans la couche déduite des connexions.',
  },

  UI_IG_RAIL: {
    title: 'Sommaire',
    /** ⚠ The labels name the MATTER (« Les messages »), not the module (« Conversations ») — the
     *  « Instagram Shell v4 » mockup's decision, and the identifiers do not follow: they address
     *  the reports. */
    items: [
      { id: 'identity', index: '01', label: 'L’identité' },
      { id: 'map', index: '02', label: 'La carte' },
      { id: 'messages', index: '03', label: 'Les messages' },
      { id: 'interactions', index: '04', label: 'Les interactions' },
      { id: 'files', index: '05', label: 'Les fichiers' },
      { id: 'ai', index: '06', label: 'L’analyse IA' },
    ],
    stateLoading: 'chargement',
    stateSoon: 'à venir',
    note: 'Lu sur ton ordinateur. Rien n’est envoyé.',
    /** Placeholder while a module has not been ported yet. Says what it will hold. */
    comingSoon: 'Cette pièce arrive.',
  },

  UI_IG_IDENTITY: {
    h1: 'Instagram',
    lede: (years: string) =>
      `${years} ans d’activité : ce que tu as écrit toi-même et ce qui a été déduit.`,
    /* ⚠ « les lieux que tu as traversés » rather than « où tu es passé·e »: the agreement then
       falls on the places, and the sentence no longer has to assume the reader's gender. A product
       that shows what a platform infers about someone cannot open by inferring one itself. */
    sub: 'Six parties : ton identité telle qu’elle est reconstituée, les lieux que tu as traversés, tes conversations, les comptes que tu croises, les fichiers reçus et envoyés. La dernière partie, optionnelle, te permet de faire tourner un modèle IA local afin d’analyser tes conversations.',

    learnOpen: 'comprendre · les données déduites',
    learnTitle: 'D’où vient ce que tu n’as jamais écrit ?',
    learnCols: [
      {
        k: 'Ce que tu déclares',
        p: 'Pseudo, e-mail, téléphone, date de naissance : les champs que tu as remplis toi-même. Tu peux les relire, les corriger, les effacer.',
      },
      {
        k: 'Ce qui est déduit',
        p: 'Ta ville vient de ton adresse internet, ta langue de ton téléphone, ton âge probable et tes centres d’intérêt de ton usage.',
      },
      {
        k: 'Pourquoi c’est sensible',
        p: 'Ce sont ces champs devinés qui servent au ciblage publicitaire. Une déduction fausse reste dans ton profil : tu ne peux ni la voir dans l’application, ni la corriger.',
      },
    ],

    openedIn: (when: string) => `Compte ouvert en ${when}`,
    openedUnknown: 'Date d’ouverture absente de l’export',
    age: 'Ancienneté',
    ageValue: (years: string) => `${years} ans`,
    logins: 'Connexions',
    fieldsFilled: 'Champs remplis',
    fieldsFilledValue: (filled: string, total: string) => `${filled} sur ${total}`,

    declaredTitle: 'Ce que tu as donné',
    declaredSub: (n: number) =>
      `${n} information${n > 1 ? 's' : ''} que tu as saisie${n > 1 ? 's' : ''} toi-même.`,
    guessedTitle: 'Ce que Meta a deviné',
    guessedSub: (n: number) =>
      `${n} information${n > 1 ? 's' : ''} que personne ne t’a demandée${n > 1 ? 's' : ''}.`,
    guessedFoot: 'Déduites de ton adresse IP, de tes contacts et de ton usage.',

    fields: {
      name: 'Nom',
      handle: 'Pseudo',
      dob: 'Naissance',
      gender: 'Genre',
      email: 'E-mail',
      phone: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      secondPhone: 'Second téléphone',
      adTargeting: 'Ciblage publicitaire',
      privateAccount: 'Compte privé',
    },
    notes: {
      cityNeverGiven: 'Tu ne l’as jamais renseignée',
      phoneNeverGiven: 'Tu ne l’as jamais donné',
      adsNeverChosen: 'Tu ne les as jamais choisies',
    },
    adCategories: (n: string) => `${n} catégories`,

    actionsTitle: 'Ce que tu as fait',
    actionsCount: (n: string) => `${n} actions enregistrées une par une.`,
    viewGroupLabel: 'Vue des actions',
    viewOverview: 'Vue d’ensemble',
    viewDetail: 'En détail',
    actionsMore: (parts: string) => `Plus ${parts}.`,
    gestures: {
      likes: 'Posts likés',
      saves: 'Posts sauvegardés',
      storyLikes: 'Stories likées',
      comments: 'Commentaires postés',
      commentLikes: 'Commentaires likés',
      polls: 'Sondages répondus',
    },
    storiesViewedPart: (n: string) => `${n} stories vues (30 derniers jours)`,

    detailGesturesTitle: 'Tous tes gestes',
    detailStoriesNote: (n: string) =>
      `Plus ${n} stories vues — Instagram n’en garde que 30 jours, et ce compteur ne dit donc rien des années précédentes.`,
    lifeTitle: 'La vie du compte',
    lifeLede:
      'Ces lignes ne sont pas des gestes : ce sont les événements que Meta journalise sur le compte lui-même, y compris tes demandes d’export.',
    life: {
      logins: 'Connexions',
      checkpoints: 'Checkpoints de sécurité',
      passwords: 'Changements de mot de passe',
      privacy: 'Changements de visibilité',
      exports: 'Demandes d’export',
    },
    pastTitle: 'Ce que tu as été',
    pastLede: (n: number) =>
      `Un pseudo abandonné, un nom changé, une adresse remplacée : la valeur précédente reste archivée. ${n} identité${n > 1 ? 's' : ''} antérieure${n > 1 ? 's' : ''} figure${n > 1 ? 'nt' : ''} dans ton export.`,
    pastFields: { username: 'pseudo', displayName: 'nom affiché' },
    pastUnknownDate: 'date inconnue',

    suiteTitle: 'La suite du dossier',
    suiteStateLoading: 'analyse en cours…',
    suiteStateSoon: 'à venir',
    suite: {
      mapLabel: '01 · La carte',
      mapBig: (n: string) => `${n} lieux`,
      mapSub: (ips: string, gps: string) =>
        `${ips} adresses internet distinctes, ${gps} publications géolocalisées.`,
      messagesLabel: '02 · Les messages',
      messagesBig: (n: string) => `${n} messages`,
      messagesSub: (threads: string, people: string) =>
        `${threads} fils de discussion avec ${people} personnes.`,
      interactionsLabel: '03 · Les interactions',
      interactionsBig: (n: string) => `${n} abonnements`,
      interactionsSub: (followers: string, pending: string) =>
        `${followers} abonnés, ${pending} demandes envoyées, et toutes les autres interactions publiques.`,
      filesLabel: '04 · Les fichiers',
      filesBig: (n: string) => `${n} médias`,
      filesSub: 'Photos, vidéos et messages vocaux échangés, tous conservés.',
    },

    foot: 'Toutes les valeurs affichées viennent de ton export et restent sur cet appareil.',
  },

  UI_IG_MESSAGES: {
    h1: (years: string) => `${years} ans de conversations conservées et analysées par Instagram`,
    lede: (span: string) =>
      `${span}, chaque messages, photos, vidéos et vocaux échangés avec tes contacts ont été gardés. Tu peux accéder au détail de chaque conversations sur cette page.`,
    spanFromTo: (from: string, to: string) => `De ${from} à ${to}`,
    spanAll: 'Sur toute l’archive',
    learnOpen: 'comprendre · les messages conservés',
    learnTitle: 'Que reste-t-il d’une conversation privée ?',
    learnKeptK: 'Ce qui est gardé',
    learnKeptP:
      'Chaque message avec son auteur et son horodatage, les réactions, la durée des appels, les ' +
      'vocaux. Un fil supprimé de l’application peut rester dans l’export.',
    learnCryptK: 'Pas chiffré par défaut',
    learnCryptP:
      'Les messages Instagram ne sont pas chiffrés de bout en bout, sauf si tu l’as activé. Meta ' +
      'peut donc les lire, et une réquisition ou une fuite les expose.',
    learnFormK: 'Le contenu, mais aussi la forme',
    learnFormP:
      'Même sans lire un mot, les horaires et le rythme des échanges suffisent à repérer qui ' +
      'compte pour toi, quand une relation démarre et quand elle s’éteint.',

    tileMessages: 'messages échangés',
    tilePeople: 'personnes différentes',
    tileThreads: (groups: string) => `fils, dont ${groups} groupes`,
    tileSelf: (n: string) => `écrits par toi (${n})`,

    count: (n: string) => `${n} conversations`,
    viewGroupLabel: 'Affichage',
    viewTrame: 'Dans le temps',
    viewFile: 'En détail',

    grain: 'Grain',
    grains: { month: 'Mois', quarter: 'Trimestre', year: 'Année' },
    orient: 'Sens',
    orientH: 'Horizontal',
    orientV: 'Vertical',
    page: 'page ',
    prevPage: 'Page précédente',
    nextPage: 'Page suivante',
    hint: 'clique une ligne pour ouvrir le fil',
    scaleLess: 'moins',
    scaleMore: 'plus',
    hoverCell: (title: string, when: string, n: string) => `${title} · ${when} · ${n} messages`,
    hoverRow: (title: string, n: string) => `${title} — ${n} messages en tout`,

    tableThread: 'Fil',
    tableBalance: 'Balance',
    tableMessages: 'Messages',
    tableEmpty: 'Aucun fil ne répond à cette requête.',
    tableLegend:
      'Balance : part de messages envoyés par toi (chaud) contre reçus (froid). Aucun contenu de ' +
      'message n’est lu.',
    tablePeopleShort: 'eux',
    groupMark: 'conversation de groupe',
    balanceTitle: (pct: string) => `${pct} % de toi`,

    beyondTitle: 'Au-delà du texte',
    beyondLede: 'Tout ce que tu as envoyé dans ces fils est conservé à l’identique.',

    contentLabels: {
      photos: 'Photos',
      videos: 'Vidéos',
      audio: 'Vocaux',
      shares: 'Partages',
      calls: 'Appels',
    },
    searchPlaceholder: 'fil commençant par...',
    searchLabel: 'Filtrer les fils par nom',
    filters: {
      contents: 'Contenus',
      contentsAll: 'Tous',
      contentsChecked: (n: string) => `${n} cochés`,
      balance: 'Balance',
      time: 'Ancienneté',
      reset: 'tout effacer',
    },
    directionLabels: { any: 'Peu importe', self: 'Envoyés par toi', others: 'Reçus' },
    balanceLabels: { any: 'Peu importe', self: 'Surtout toi', others: 'Surtout eux' },
    timeLabels: {
      any: 'Peu importe',
      recent: 'Moins d’un an',
      fading: '1 à 5 ans',
      dormant: 'Plus de 5 ans',
    },
    phraseNone: 'Aucun filtre actif, toutes les conversations de ton export.',
    phraseActive: (parts: string) => `Filtres actifs — ${parts}.`,
    phraseSearch: (q: string) => `commençant par « ${q} »`,

    panel: {
      close: 'Fermer',
      meta: (kind: string, from: string, to: string) => `${kind} · ${from} → ${to}`,
      kindGroup: (n: string) => `groupe · ${n} participants`,
      kindSolo: 'conversation 1:1',
      viewFiche: 'La fiche',
      viewThread: 'La conversation',
      messages: 'messages',
      messagesIn: (span: string) => `messages en ${span}`,
      replyMedian: 'temps de réponse médian',
      versus: 'contre',
      calls: (n: string) => `appels · ${n}`,
      callsNoDuration: 'appels',
      whoWrites: 'Qui écrit ?',
      you: 'toi',
      whatSent: 'Ce que vous vous êtes envoyé',
      reactions: 'Réactions',
      seeFiles: 'Voir les fichiers',
      fileAll: 'tous',
      filePhotos: 'photos',
      fileVideos: 'vidéos',
      fileAudio: 'vocaux',
      rhythm: (from: string, to: string) => `Le rythme · ${from} → ${to}`,
      noFiles: 'Aucun fichier dans ce fil.',
    },
  },

  /**
   * « 05 · L'analyse locale » — the piece that hands a conversation to a model on the person's own
   * machine. The strings that go TO THE MODEL are not here: they are in `ai/conv-prompt.ts`, with
   * the rest of what is sent, because a prompt is tested without a DOM.
   */
  UI_IG_ANALYSE: {
    h1: 'Fais interpréter tes conversations par une IA qui tourne chez toi.',
    lede:
      'Quatre étapes, une seule fois. Le modèle s’installe sur ton ordinateur : tes conversations ' +
      'ne quittent jamais l’appareil.',
    learnOpen: 'comprendre · le modèle',
    learnTitle: 'Comment fonctionne le modèle qui tourne chez toi ?',
    learnCols: [
      {
        k: 'Prédire le mot suivant',
        p:
          'Un modèle de langage ne « pense » pas : il prédit le fragment de mot le plus probable, ' +
          'des milliers de fois de suite. C’est ce flux que tu vois s’écrire.',
      },
      {
        k: 'Jetons',
        p:
          'Ton texte est découpé en « jetons » (environ ¾ de mot chacun). C’est l’unité comptée ' +
          'partout ici : taille du prompt, vitesse, longueur de la réponse.',
      },
      {
        k: 'Quantisation (Q4, Q3…)',
        p:
          'Les variantes proposées sont le même modèle plus ou moins compressé pour tenir dans ta ' +
          'mémoire. Plus c’est compressé, plus c’est léger — et moins c’est fin.',
      },
      {
        k: 'Local = privé',
        p:
          'Le modèle est un simple fichier sur ton disque. Une fois téléchargé, tu peux couper ' +
          'Internet : l’analyse fonctionne toujours, et rien ne sort de ton appareil.',
      },
    ],

    /** ⚠ FOUR states, not two: the browser's ENGINE decides three different speeches (ADR-0006),
     *  and an unknown engine is not a verdict — neither compatible nor blocked, simply unnamed. */
    bannerLocalT: 'Cette page vient de ton appareil',
    bannerLocalP:
      'Elle est servie depuis ta boucle locale : aucune permission réseau n’entre en jeu.',
    bannerOkT: (name: string) => `${name} peut joindre ton ordinateur`,
    bannerOkP: 'Le chemin A fonctionne : une commande, et tu restes sur cette page.',
    bannerKoT: (name: string) => `${name} ne peut pas joindre ton ordinateur`,
    bannerKoP:
      'Son moteur interdit à une page d’atteindre ta propre machine. Prends le chemin B, qui ' +
      'fonctionne partout.',
    bannerUnknownT: 'Navigateur non reconnu',
    bannerUnknownP:
      'Impossible de dire d’avance si le chemin A fonctionnera. Essaie-le : s’il échoue, le ' +
      'chemin B fonctionne partout.',

    warnK: 'à lire avant de lancer',
    warnH: "Ce que tu vas lire n'est pas un verdict.",
    warnCols: [
      {
        t: 'Le modèle peut, et va se tromper',
        p:
          'Il produit la suite la plus probable, pas la vérité. Il confondra de l’ironie avec une ' +
          'opinion, une blague avec une habitude, un contact ponctuel avec un proche.',
      },
      {
        t: 'Il est volontairement modeste',
        p:
          'Trois milliards de paramètres, compressés pour tenir sur ton appareil : c’est le bas du ' +
          'spectre. Tout ce qu’il devine ici, un modèle industriel le devine mieux, plus vite, et ' +
          'sur plus de données.',
      },
      {
        t: 'Ce que ça démontre',
        p:
          'Un modèle de 3 Go tournant sur ton ordinateur produit déjà des déductions pertinentes. ' +
          'Meta fait le même calcul en continu, sur tes données et celles de tes contacts.',
      },
    ],
    warnFootB: 'Le réflexe vaut au-delà de cette page',
    warnFootP:
      ' : ce que tu confies à une IA en ligne part sur des serveurs et peut être utilisé sans que tu le saches, et sa réponse est à prendre avec précaution. ' +
      'Ici, même précaution mais rien ne sort de ton appareil.',

    step1: 'Lancer le modèle',
    step2: 'Vérifie que la page le voit',
    step3: 'Choisis les conversations',
    step4: 'Analyse',

    osLabel: 'ton système',
    terminalMacos: 'appuie sur ⌘ + Espace, tape « Terminal », puis Entrée.',
    terminalWindows: 'ouvre le menu Démarrer, tape « PowerShell », puis Entrée.',
    terminalLinux: 'appuie sur Ctrl + Alt + T, ou cherche « Terminal » dans tes applications.',
    terminalSummary: 'Jamais ouvert de terminal ?',
    /**
     * Panneau à DEUX COLONNES, comme dans le produit TikTok : le geste d'abord, la définition
     * ensuite. Qui ouvre ceci cherche comment faire, pas ce que c'est.
     */
    terminalPanelTitle: 'Le terminal, en deux mots',
    terminalHowTitle: (osName: string) => `L’ouvrir sur ${osName}`,
    terminalWhatTitle: 'Ce que c’est',
    terminalWhat:
      'Une simple fenêtre où tu colles du texte et tu appuies sur Entrée. Les commandes de cette ' +
      'page ne peuvent rien casser sur ton ordinateur.',
    terminalBody: (osName: string, howto: string) =>
      `Pour l’ouvrir sur ${osName} : ${howto} C’est une fenêtre où l’on colle des commandes : rien ` +
      'd’irréversible ici, les lignes ci-dessous installent puis démarrent le moteur.',
    installBefore: 'Installe ',
    installAfter: ', le petit moteur libre qui fait tourner le modèle.',
    brewNote:
      'Commande non reconnue ? Installe d’abord Homebrew — une seule commande, indiquée sur ',
    modelsLegend:
      'Choisis un modèle — du plus fin au plus léger. Le plus lourd demande le plus de mémoire.',
    modelSize: (gb: string) => `${gb} Go`,
    modelRecommended: 'recommandé',
    modelBorderline: 'limite, mais fonctionnel',
    copy: 'copier',
    copied: 'copié',

    routeIntro: 'Dernier choix : deux chemins pour lancer ce modèle, même résultat.',
    routeAT: 'A · Depuis ce site',
    routeAP:
      'Tu restes sur cette page : plus qu’une commande à lancer. Nécessite Chrome, Brave ou Firefox.',
    routeAOff: (name: string) => `indisponible avec ${name}`,
    routeBT: 'B · Tout sur ton appareil',
    routeBP:
      'llama-server sert aussi l’application : tout tourne en local, avec n’importe quel navigateur.',
    routeAServe:
      'Lance le serveur : il télécharge le modèle au premier lancement, puis reste ouvert en ' +
      'arrière-plan.',
    routeAFirefox: (name: string) =>
      `Au premier clic sur « vérifier », ${name} demandera l’autorisation d’accéder au réseau ` +
      'local : une fenêtre apparaîtra sous la barre d’adresse — clique « Autoriser ».',
    routeAChromium: (name: string) =>
      `${name} n’ouvrira PAS de fenêtre d’autorisation : si la vérification échoue, clique sur ` +
      'l’icône à gauche de l’adresse, mets « Réseau local » sur « Autoriser », puis recharge la page.',
    routeAUnknown:
      'Selon ton navigateur, il faudra peut-être l’autoriser à joindre ton ordinateur. Si la ' +
      'connexion échoue, cette page te dira quoi faire.',
    /** ⚠ ROUTE B DOWNLOADS THE SITE, where the prototype pointed at a `dist/` you build yourself:
     *  the archive is a build artifact of THIS site, so the two cannot drift. */
    localDownload:
      'Télécharge la version locale du site — ici, ou depuis GitHub si tu veux vérifier le code :',
    localZipButton: (zipName: string) => `⬇ ${zipName}`,
    localGithubLink: 'Vérifier la source sur GitHub ↗',
    localCmd:
      'Puis lance tout ensemble — le serveur sert l’application ET le modèle sur le même port, donc ' +
      'plus aucune question d’autorisation :',
    localOpenBefore: 'Rouvre ensuite ',
    localOpenAfter: ' dans ton navigateur, et reviens sur cette pièce.',

    urlAria: 'Adresse du serveur local',
    check: 'vérifier la connexion',
    checking: 'vérification…',
    probeOk: (model: string, ctx: string) =>
      `Serveur détecté${model}  · fenêtre de contexte ${ctx} jetons`,
    probeModelSuffix: (id: string) => ` : ${id}`,
    probeKoNotFound: 'Serveur non détecté.',
    probeKoImpossible: 'Connexion impossible.',
    probeKoLocal:
      'Cette page vient de ton appareil : aucune permission en jeu, c’est donc le serveur qui ne ' +
      'tourne pas encore.',
    probeKoBlocked: (name: string) =>
      `${name} bloque l’accès au réseau local. Autorise-le dans le cadenas de la barre d’adresse, ` +
      'puis recharge la page. Le chemin B fonctionne partout.',
    probeKoGranted:
      'Le navigateur autorise le réseau local : c’est donc le serveur qui ne tourne pas encore.',
    probeKoUnknown: (name: string) =>
      'Deux causes possibles, et cette page ne peut pas les distinguer : le serveur n’est pas ' +
      `lancé, ou ${name} bloque l’accès au réseau local. Essaie le chemin A ; s’il échoue, le ` +
      'chemin B fonctionne partout.',
    probeDetail: (err: string) => `détail technique : ${err}`,

    searchPlaceholder: 'fil commençant par…',
    pickerAria: 'Conversation à analyser',
    pickNone: 'Aucune conversation choisie — sélectionne-en une.',
    picked: (title: string) => `Conversation choisie : ${title}`,
    loadingSuffix: ' · lecture en cours…',
    loadError: (err: string) =>
      `Impossible de relire un fil : ${err}. Le dossier a peut-être été fermé — rouvre l’export.`,

    promptLabel: 'Question posée au modèle',
    promptDefaultBtn: 'Prompt par défaut',
    promptSafetyBtn: 'Prompt « filet de sécurité »',
    promptDraft: 'brouillon — modifie-la',
    safetyLabel: 'Ajouter le filet de sécurité sur les sujets sensibles',

    sampleK: 'Échantillon envoyé :',
    sampleBudget: (sent: string, total: string, seq: string, plural: boolean, tokens: string) =>
      `${sent} messages sur ${total} · ${seq} séquence${plural ? 's' : ''} · ${tokens} jetons`,
    sampleReal: '(compte exact du serveur)',
    sampleEstimate: '(estimation)',
    samplePeriod: (from: string, to: string) => ` · du ${from} au ${to}`,
    sampleP:
      'Le fil n’est pas lu en entier : des extraits répartis du début à sa fin sont sélectionnés, ' +
      'autant que la fenêtre du modèle en accepte. Le prompt annonce chaque période, pour que le ' +
      'modèle sache qu’il compare des moments distants.',
    over: (window: string) =>
      `Cet extrait dépasse ce que la fenêtre peut recevoir (${window} jetons pour le prompt, le ` +
      'reste étant gardé pour la réponse). Le serveur tronquera le début, ou refusera.',

    run: 'Lancer l’analyse',
    runningLabel: 'analyse en cours…',
    stop: 'arrêter',
    hintServer: 'vérifie d’abord le serveur (étape 2)',
    hintThread: 'coche d’abord une conversation (étape 3)',

    payloadShow: 'Voir le prompt final ▾',
    payloadHide: 'Masquer le prompt final ▴',
    payloadT: 'Prompt final envoyé au modèle',
    payloadMeta: (sent: string, tokens: string) =>
      `${sent} messages échantillonnés · ${tokens} jetons`,
    payloadNote:
      'Exactement ce qui partira vers ton serveur local, dans cet ordre. Les messages sont ' +
      'numérotés pour que le modèle puisse les citer.',

    runStats: (p: string, c: string, s: string, rate: string) =>
      `${p} jetons envoyés · ${c} générés · ${s} s · ${rate} jetons/s`,
    privacy:
      'Le texte part vers le serveur que tu as lancé toi-même, sur cette machine. Aucune autre ' +
      'requête réseau n’existe dans cette fonctionnalité.',
  },

  /** The small shared controls — the time wheel, the fullscreen toggle, the move stick, the media
   *  viewer. They belong to no single piece, which is why their strings sit together. */
  UI_IG_CONTROLS: {
    wheelLabel: 'Molette temporelle',
    wheelPrev: 'Un mois avant',
    wheelNext: 'Un mois après',
    fullscreenEnter: (what: string) => `Afficher ${what} en plein écran`,
    fullscreenExit: (what: string) => `Quitter le plein écran de ${what}`,
    fullscreenShort: 'Plein écran',
    fullscreenExitShort: 'Quitter',
    fullscreenScene: 'la scène',
    stickLabel: 'Se déplacer',
    viewerDownload: 'Télécharger',
    viewerClose: 'Fermer',
    viewerPrev: 'Précédent',
    viewerNext: 'Suivant',
    viewerLoading: 'Chargement…',
    viewerMissing: 'Ce fichier n’est pas dans l’export.',
    viewerCount: (i: string, n: string) => `${i} sur ${n}`,
  },

  /** « 02 · La carte » — the two sources of place, and what they draw together. */
  UI_IG_MAP: {
    h1: (since: string) => `Instagram sait où tu étais, presque chaque mois depuis ${since}.`,
    h1NoDate: 'Instagram sait où tu étais.',
    lede:
      'Deux sources se mélangent : les lieux que tu as partagés toi-même, et ceux ' +
      'déduit de ton adresse internet.',
    learnOpen: 'comprendre · la géolocalisation',
    learnTitle: 'Comment Instagram sait-il où tu étais ?',
    learnSourcesK: 'Deux sources',
    learnSourcesP:
      'Les lieux que tu as ajoutés à tes publications, précis au bâtiment près. Et l’adresse ' +
      'internet enregistrée à chaque connexion, qui donne la ville.',
    learnDrawK: 'Ce que ça dessine',
    learnDrawP:
      'Un point par mois pendant douze ans suffit à faire apparaître ton domicile, tes ' +
      'déménagements, tes vacances et tes trajets réguliers. Aucun GPS n’est nécessaire.',
    learnCareK: 'À prendre avec des pincettes',
    learnCareP:
      'Une adresse internet n’est pas une position : VPN, partage de connexion ou réseau mobile ' +
      'peuvent déplacer un point de plusieurs centaines de kilomètres.',

    count: (n: string) => `${n} lieux`,
    sub: (cities: string, precise: string) =>
      `${cities} villes déduites, ${precise} lieux partagés`,
    viewGroupLabel: 'Vue des lieux',
    viewMap: 'Carte',
    viewDetail: 'En détail',
    frameLabel: 'la carte',

    layerDeclared: (n: string) => `Déclarée · ${n} pts précis`,
    layerInferred: (n: string) => `Déduite · ${n} connexions IP`,

    /** Attribution required by the two data sources — see NOTICE. */
    attribution: 'Contours : Natural Earth · IP : DB-IP',

    kindPost: 'Post géolocalisé',
    kindStory: 'Story (EXIF GPS)',
    kindLast: 'Position',
    precise: 'précis',
    more: (n: string) => `+${n} autre`,
    moreMany: (n: string) => `+${n} autres`,

    cityDetail: (city: string) => `Détail de ${city}`,
    citySamePlace: (n: string) => `${n} lieux sur la même adresse IP`,
    cityReadings: 'Relevés de connexion',
    cityConn: (n: string) => `${n} conn.`,
    cityNote:
      'L’export donne leur nom, jamais leurs coordonnées : ils partagent donc le point de l’IP.',
    periodUnknown: 'Période inconnue',
    periodCount: (n: string, span: string) => `${n} période · ${span}`,
    periodCountMany: (n: string, span: string) => `${n} périodes · ${span}`,
    periodAria: (n: string, from: string, to: string) =>
      `${n} périodes de connexion, de ${from} à ${to}`,

    zoneConn: 'connexion IP',
    zoneConnMany: 'connexions IP',
    zonePlaces: (places: string, span: string) => `${places} lieu · ${span}`,
    zonePlacesMany: (places: string, span: string) => `${places} lieux · ${span}`,
  },

  /** « 04 · Les interactions » — the public accounts, as a 3D crowd or a sortable file. */
  UI_IG_SPACE: {
    h1: (n: string, years: string) => `En ${years} ans, tu as croisé le chemin de ${n} comptes.`,
    lede:
      'Instagram stocke les interactions que tu as avec chaque compte, même ceux que tu ne ' +
      'reconnais plus.',
    learnOpen: 'comprendre · ce que révèlent tes relations',
    learnTitle: 'Qu’apprend-on de tes relations sans lire un seul message ?',
    learnPosK: 'Ce qui est compté',
    learnPosP:
      'Abonnements, abonnés, likes, commentaires, demandes envoyées, comptes bloqués ou masqués : ' +
      'chaque geste est daté et rattaché à un compte.',
    learnSizeK: 'Ce que ça hiérarchise',
    learnSizeP:
      'En croisant le sens du lien et la fréquence des échanges, Instagram classe tes relations ' +
      'sans que tu l’aies dit : proches, connaissances, comptes suivis à sens unique.',
    learnDormK: 'À quoi il sert',
    learnDormP:
      'Il alimente les suggestions de comptes et la publicité par entourage : tu peux être ciblé ' +
      'parce que tes proches ont réagi à une annonce, sans avoir rien publié.',

    countAccounts: (n: string) => `${n} comptes`,
    tileMutual: 'liens mutuels',
    tileFollowing: 'comptes que tu suis',
    tileFollower: 'comptes qui te suivent',
    tileNone: 'sans aucun lien',

    viewGroupLabel: 'Vue des comptes',
    viewSpace: 'Visualisation 3D',
    viewFile: 'En détail',
    frameLabel: 'l’espace',

    searchPlaceholder: 'pseudo commençant par.',
    searchLabel: 'Filtrer les comptes par pseudo',
    filterLink: 'Lien',
    filterLists: 'Statuts',
    filterTime: 'Ancienneté',
    listsAll: 'Tous',
    listsChecked: (n: string) => `${n} cochés`,

    linkAll: 'Tous',
    linkMutual: 'Mutuel',
    linkFollowing: 'Tu suis',
    linkFollower: 'Te suit',
    linkNoFollow: 'Sans lien de suivi',
    listBlocked: 'Bloqués',
    listPending: 'Demandes envoyées',
    listCloseFriend: 'Amis proches',
    listFavorite: 'Favoris',
    listHideStory: 'Stories masquées',

    density: 'densité',
    hidden: (n: string) =>
      `Les ${n} comptes les moins actifs ne sont pas affichés, monte la densité ou filtre pour les faire apparaitre.`,
    reframe: 'Recadrer',
    empty: 'Aucun compte ne correspond.',

    /**
     * ⚠ THE VEIL'S LINES ARE SEGMENTED, alternating plain and emphasised: index 0 is plain, 1 is a
     * key cap, 2 plain again, and so on. The gesture and its name have to be told apart at a
     * glance — « ZQSD » set like the sentence around it stops looking like a key.
     */
    veilTitle: 'Explore tes interactions',
    veilMouse: [
      ['', 'ZQSD', ' ou les ', 'flèches', ' — se déplacer'],
      ['', 'Maintenir le clic', ' et bouger la souris — orienter et regarder autour'],
      ['', 'Clic', ' sur quelqu’un — ouvrir sa fiche'],
    ],
    veilTouch: [
      ['Le ', 'joystick', ', en bas à gauche — glisse dessus pour avancer'],
      ['', 'Glisse', ' sur la scène — regarder autour'],
      ['', 'Touche', ' quelqu’un — sa fiche'],
    ],
    veilGoMouse: 'Une touche ou un clic ici pour commencer.',
    veilGoTouch: 'Touche l’écran pour commencer.',
    legendHint: 'gros = plus d’actions de ta part · la position n’encode rien',

    tableWho: 'Pseudo',
    tableLink: 'Lien',
    tableActions: 'Actions',
    tableLast: 'Quand',
    tableNever: 'jamais',
    tableEmpty: 'Aucun compte ne répond à cette requête.',
    tableLegend: 'Actions = tes stories likées, sondages, commentaires postés et likés.',
    /** « il y a 3 mois » — une date absolue obligerait à calculer de tête à chaque ligne. */
    agoToday: 'aujourd’hui',
    agoDays: (n: string) => `il y a ${n} j`,
    agoMonths: (n: string) => `il y a ${n} mois`,
    agoOneYear: 'il y a 1 an',
    agoYears: (n: string) => `il y a ${n} ans`,

    panelClose: 'Fermer',
    panelLast: (when: string) => `dernière interaction ${when}`,
    panelTotal: 'actions de toi vers ce compte',
    panelActions: 'Détail des actions',
    panelTimeline: 'Dans le temps',
    actions: {
      story_like: 'Stories likées',
      poll: 'Sondages',
      comment: 'Commentaires',
      comment_like: 'Likes de commentaires',
    },
    badgeCloseFriend: 'Ami proche',
    badgeFavorite: 'Favori',
    badgeBlocked: 'Bloqué',
    badgePending: 'Demande sans réponse',
    badgeHideStory: 'Story masquée',
    panelContentNote:
      'Textes de tes commentaires / questions de sondages auxquels tu as répondu. L’export ne ' +
      'stocke pas l’option choisie, ni le texte des commentaires que tu as likés.',
    panelDirectionNote:
      'L’export ne dit pas ce que ce compte a fait chez toi — Instagram ne fournit que tes ' +
      'propres actions (et ta liste d’abonnés).',

    foot:
      'Tout ce qui est listé sont les interactions de toi envers les autres utilisateurs : ' +
      'l’export ne contient pas le sens inverse.',
  },

  /** « 05 · Les fichiers » — every media of the export, in space. */
  UI_IG_UNIVERSE: {
    h1: 'Tout ce que tu as envoyé, reçu, publié.',
    lede: (n: string) =>
      `${n} fichiers, posés dans le temps. Chaque point est une photo, une vidéo ou un vocal — ` +
      `la spirale les range du plus ancien au plus récent, un tour par an environ.`,
    learnOpen: 'comprendre · cette spirale',
    learnTitle: 'Comment lire cet espace ?',
    learnTimeK: 'Le temps monte',
    learnTimeP:
      'Le plus ancien est en bas, le plus récent en haut, et l’année est écrite sur le côté. ' +
      'L’épaisseur d’un passage dit combien tu as échangé cette année-là.',
    learnKindK: 'La couleur dit le type',
    learnKindP:
      'Photo, vidéo, vocal. Un vocal n’a pas de vignette — l’export n’en garde pas le contenu, ' +
      'seulement le fichier.',
    learnLimitK: 'Ce n’est pas tout',
    learnLimitP:
      'Un échantillon est affiché, pas l’archive entière : au-delà de mille objets rien ne se ' +
      'distingue plus. Le nombre affiché est toujours écrit sous le curseur.',

    countFiles: (n: string) => `${n} fichiers`,
    frameLabel: 'l’espace',

    searchPlaceholder: 'Chercher un compte',
    searchLabel: 'Filtrer par compte',
    filterKind: 'Type',
    filterSource: 'Source',
    filterTime: 'Période',
    reset: 'Tout effacer',
    all: 'Tous',

    kindPhoto: 'Photos',
    kindVideo: 'Vidéos',
    kindAudio: 'Vocaux',
    sourceDm: 'Messages',
    sourceStory: 'Stories',
    sourcePost: 'Posts',

    sample: 'Objets affichés',
    sampleValue: (shown: string, total: string) => `${shown} sur ${total}`,
    viewGroupLabel: 'Vue des médias',
    viewScene: 'Visualisation 3D',
    viewFile: 'En détail',
    layoutGroupLabel: 'Affichage',
    layoutSpiral: 'Chronologie',
    layoutSource: 'Sources',
    density: 'densité',
    lot: (n: string, total: string) => `lot ${n} / ${total}`,
    lotPrev: 'Lot précédent',
    lotNext: 'Lot suivant',

    veilTitle: 'Explore tes fichiers',
    veilMouse: [
      ['', 'ZQSD', ' ou les ', 'flèches', ' — se déplacer'],
      ['', 'Maintenir le clic', ' et bouger la souris — orienter et regarder autour'],
      ['', 'Clic', ' sur un média — l’ouvrir'],
    ],
    veilTouch: [
      ['Le ', 'joystick', ', en bas à gauche — glisse dessus pour te déplacer'],
      ['', 'Glisse', ' sur la scène — regarder autour'],
      ['', 'Touche', ' un média — l’ouvrir'],
    ],
    veilGoMouse: 'Une touche ou un clic ici pour commencer.',
    veilGoTouch: 'Touche l’écran pour commencer.',

    tableListed: (shown: string, total: string) => `${shown} médias listés sur ${total}`,
    tableRecent: '⤒ récent',
    tableOld: 'ancien ⤓',
    tableEmpty: 'Aucun média ne répond à cette requête.',
    tableShownInYear: (n: string, plural: boolean) => `${n} affiché${plural ? 's' : ''}`,
    tableProgress: (shown: string, total: string) => `${shown} sur ${total}`,
    tableMore: (n: string) => `charger ${n} de plus`,
    tableEnd: (n: string) => `fin — ${n} médias`,
    kindUnitPhoto: 'photo',
    kindUnitVideo: 'vidéo',
    kindUnitAudio: 'vocal',
    empty: 'Aucun fichier ne correspond.',
  },

  /** The sentence that states the active filters. It lives in the card's HEADER, beside the count —
   *  it describes the state, and is read WITH the number rather than above the menus. */
  UI_IG_QUERY: {
    none: 'Aucun filtre actif, tous les comptes croisés dans ton export.',
    active: (parts: string) => `Filtres actifs — ${parts}.`,
    startingWith: (q: string) => `commençant par « ${q} »`,
    lastSeen: (phrase: string) => `vus pour la dernière fois ${phrase}`,
    reset: 'tout effacer',
    timePhrase: {
      any: '',
      recent: 'il y a moins d’un an',
      fading: 'il y a un à cinq ans',
      dormant: 'il y a plus de cinq ans',
    },
  },

  UI_IG_MAP_DETAIL: {
    citiesH: 'Où tu as été',
    citiesLede: (conn: string, cities: string) =>
      `${conn} connexions dans ${cities} villes. Chaque barre indique une période de présence.`,
    placesH: 'Les lieux que tu as donnés toi-même',
    addressesH: 'Les adresses enregistrées',
    addressesLede:
      'Saisies une fois pour un formulaire, gardées depuis. Ce ne sont pas des coordonnées mais ' +
      'des adresses postales : la rue, le numéro, le code postal.',
    addressUpdated: (when: string) => `mise à jour ${when}`,
    cityConn: (n: string) => `${n} connexions`,
    cityConnOne: (n: string) => `${n} connexion`,
    cityDateUnknown: 'date inconnue',
    citiesMore: (n: string) => `Voir les ${n} autres villes`,
    citiesLess: (n: string) => `Ne garder que les ${n} premières`,
    placesLede: (n: string) =>
      `${n} points au mètre près, transmis dans tes publications et stories. ` +
      `Clique pour ouvrir un média.`,
    yearPoints: (n: string) => `${n} points`,
    yearPointsOne: (n: string) => `${n} point`,
    yearUnknown: 'date inconnue',
    placesMore: (n: string) => `Afficher les ${n} autres lieux`,
    placesLess: (n: string) => `Ne garder que les ${n} plus récents`,
    openMedia: (kind: string, when: string) => `Ouvrir la ${kind} du ${when}`,
    rawH: 'La matière brute',
    rawLede:
      'Ce dont tout ce qui précède est tiré de ces données, Tu peux cliquer pour consulter le détail.',
    rawEnables: (what: string) => `Ce que ça permet : ${what}.`,
    rawRest: (hidden: string, shown: string) =>
      `${hidden} autres ne sont pas listées : le moteur s’arrête à ${shown} valeurs, pour ne pas ` +
      `construire en mémoire une liste que personne ne lira en entier.`,
    kindPost: 'publication',
    kindStory: 'story',
    kindLast: 'dernière position connue',
    empty: 'Rien à détailler dans cet export.',
  },

  UI_IG_READER: {
    loading: 'Lecture du fil…',
    empty: 'Ce fil ne contient aucun message lisible.',
    failed: 'Impossible de relire ce fil. Le dossier a peut-être été fermé — rouvre l’export.',
    /**
     * ⚠ THE SENTENCE IS IN THREE PIECES because two of its numbers are set in `<b>`: they are the
     * window, and the window is what the line exists to state. The order is fixed by the markup, so
     * a language that would place « sur 18 584 » first cannot be served by these three keys — say so
     * rather than discover it.
     */
    rangeLead: 'messages',
    rangeTo: 'à',
    rangeOf: 'sur',
    toStart: '⤒ début',
    toEnd: 'fin ⤓',
    loadPrev: (n: string) => `charger les ${n} messages précédents`,
    loadNext: (n: string) => `charger les ${n} messages suivants`,
    call: (min: string) => `appel · ${min} min`,
    unsent: 'message supprimé',
    mediaTitle: 'média',
    unavailable: 'Le contenu de ce fil ne peut pas être relu ici.',
  },
};
