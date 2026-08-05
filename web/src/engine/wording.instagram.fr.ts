// INSTAGRAM ENGINE wording, FRENCH — prose emitted by the Instagram connector.
//
// ⚠ THIS IS A RATIFIABLE PERIMETER, the third (`CLAUDE.md`: engine wording, interface copy, and now
// this). The rule that governs it is the one that governs `wording.fr.ts`: EVERYTHING THE MACHINE
// DARES TO SAY ABOUT SOMEONE MUST BE RE-READABLE IN ONE PASS, one language at a time. In the
// prototype these sentences lived inside the extractors — a dozen `enables:` strings scattered
// across 400 lines of parsing — which is precisely the arrangement that makes a wording review
// impossible.
//
// ⚠ AND THE SAME DOCTRINE APPLIES: NO SECOND PERSON. The engine never addresses the person
// (ADR-0003). « rattacher le compte à une personne nommée », never « rattacher TON compte ». The
// interface says « tu »; the engine describes a system. `wording-instagram.test.ts` sweeps both
// languages for it.
//
// ─── WHAT THIS FILE IS FOR, AND WHAT IT REFUSES ─────────────────────────────────────────────────
// The Identity module is FACTUAL by decision (yuya, prototype): it lists the identity anchors the
// platform ALREADY holds, then states what linking them to a verified legal identity would concretely
// permit. No panel of opinion — facts, then technical consequences of those facts. Every sentence
// below is written to that rule, and a sentence that judges rather than describes does not belong
// here even if it is true.
//
// SHAPE ORACLE: the bundle type derives from THIS file (`typeof FR`), so its tables must stay
// UNANNOTATED LITERALS. Annotating one `Record<string, string>` erases the keys from the type and an
// empty English table would then compile — measured, on the TikTok side, and the sole reason
// `wording-parity.test.ts` exists.
//
// ⚠ AND NO `as const` EITHER, which is the opposite mistake and just as fatal. `as const` widens
// nothing and narrows everything: each string becomes its own LITERAL type, so `wording.instagram.en.ts`
// then fails with « Type '"Name"' is not assignable to type '"Nom"' » — the English translation
// rejected for the crime of being English. Measured here while writing this file. The bundle wants
// `string`, which is what an unannotated literal without `as const` gives.

export const FR = {
  /**
   * The identity anchors. `label` names the field, `enables` states — factually, in the
   * infinitive — what that single anchor makes possible for whoever holds it.
   */
  anchors: {
    name: {
      label: 'Nom',
      enables: 'rattacher le compte à une personne nommée',
      present: 'renseigné dans le profil',
      absent: 'absent',
    },
    profileName: {
      label: 'Nom de profil',
      enables: 'désigner le compte publiquement',
      present: 'identifiant public actuel',
      absent: 'absent',
    },
    dateOfBirth: {
      label: 'Date de naissance',
      enables: 'distinguer deux homonymes, déduire l’âge exact',
      present: 'renseignée',
      absent: 'absente',
    },
    gender: {
      label: 'Genre',
      enables: 'affiner un profil publicitaire et un recoupement',
      present: 'renseigné',
      absent: 'absent',
    },
    address: {
      label: 'Adresse postale',
      enables: 'localiser un domicile, recouper avec des fichiers publics',
      present: 'enregistrée',
      absent: 'absente',
    },
    email: {
      label: 'Adresse e-mail',
      enables: 'relier ce compte à tous ceux ouverts avec la même adresse',
      present: 'confirmée',
      absent: 'absente',
    },
    phone: {
      label: 'Numéro de téléphone',
      enables: 'identifiant quasi unique, rattaché à un contrat nominatif',
      present: 'renseigné',
      absent: 'absent',
    },
    /** ⚠ Numbers Meta ATTRIBUTES without them ever having been given — harvested from other
     *  people's address books. The most counter-intuitive anchor of the module. */
    deducedPhone: {
      label: 'Numéros déduits',
      enables: 'relier le compte à des personnes via leurs carnets d’adresses',
      present: 'attribués sans avoir été donnés',
      absent: 'aucun',
    },
    device: {
      label: 'Identifiants d’appareils',
      enables: 'suivre le même appareil entre comptes, sessions et applications',
      present: 'relevés',
      absent: 'aucun',
    },
    privacy: {
      label: 'Compte privé',
      enables: 'connaître l’exposition du compte au public',
      present: 'réglage actuel',
      absent: 'non renseigné',
    },
    ip: {
      label: 'Adresses IP',
      enables: 'reconstituer des lieux de connexion et des déplacements',
      present: 'relevées à chaque connexion',
      absent: 'aucune relevée',
    },
    gps: {
      label: 'Coordonnées GPS',
      enables: 'situer des moments précis à quelques mètres',
      present: 'enregistrées',
      absent: 'aucune enregistrée',
    },
  },

  /**
   * Names of the eleven interaction categories. The KIND of each (a bond kept, or a distance kept)
   * is structure and lives in `relations.ts`; only the words are here.
   */
  categories: {
    following: 'Suivi',
    follower: 'Follower',
    story_like: 'Stories likées',
    poll: 'Sondages répondus',
    comment: 'Commentaires postés',
    comment_like: 'Commentaires likés',
    blocked: 'Bloqués',
    pending_sent: 'Demandes sans réponse',
    close_friend: 'Amis proches',
    favorite: 'Favoris',
    hide_story: 'Story masquée à',
  },

  /**
   * ⚠ THE CONTRAST BLOCK — the most sensitive prose of the module, and the reason it is FACTUAL.
   * Each entry pairs a measured fact from the export with what is true today and what would become
   * true if the account were tied to a verified legal identity. It describes a MECHANISM, never a
   * risk run by this person: the difference is the whole of ADR-0003.
   *
   * ⚠ AND IT IS WRITTEN IN THE THIRD PERSON, unlike the prototype's — which said « Ton pseudonymat »,
   * « Tes anciens pseudos », « c'est bien toi ». That register belongs to the interface, never to
   * the engine: a machine that says « tes contenus deviennent attribuables » is passing a verdict
   * on a reader it cannot see.
   */
  legalLinkage: {
    pseudonymity: {
      title: 'La pseudonymie',
      today:
        'les pseudonymes précédents sont archivés, sans que rien ne prouve formellement qui se tenait derrière chacun',
      verified:
        'le fil devient unique et certain : toutes les identités passées désignent officiellement la même personne',
    },
    accountLinks: {
      title: 'Le lien entre les comptes',
      today:
        'ces éléments permettent déjà un rapprochement avec d’autres comptes — avec une marge d’erreur',
      verified: 'la marge disparaît : le rapprochement devient une preuve, plus une probabilité',
    },
    pastContent: {
      title: 'Les contenus passés',
      today: 'tout est conservé et daté, mais rattaché à un compte, pas à un état civil',
      verified:
        'chaque contenu devient attribuable à une personne nommée devant un tiers : employeur, administration, justice',
    },
    freshStart: {
      title: 'Repartir de zéro',
      today: 'un nouveau compte peut être rapproché de celui-ci — c’est probable, jamais certain',
      verified: 'la porte se ferme : le passé suit la personne, plus le compte',
    },
    leak: {
      title: 'En cas de fuite',
      today: 'une fuite expose un pseudonyme et des données rattachées à un compte',
      verified: 'une fuite expose un état civil vérifié : plus rien n’est « juste un pseudo »',
    },
  },

  /** The measured fact each contrast rests on — a count from the export, never an adjective. */
  linkageFacts: {
    pseudonymity: (changes: string, retained: string) =>
      `${changes} changements de pseudonyme, ${retained} valeurs précédentes conservées`,
    accountLinks: (devices: string) => `e-mail, téléphone confirmé et ${devices} appareils connus`,
    pastContent: (events: string, since: string) =>
      `${events} événements de compte datés depuis ${since}`,
    freshStart: (ips: string, devices: string) =>
      `${ips} adresses IP et ${devices} appareils connus`,
    leak: (requests: string) =>
      `${requests} demandes d’export enregistrées — vouloir savoir laisse aussi une trace`,
  },

  /** Units and short measured phrases the anchors quote. Kept here so a count never gets
   *  assembled from a string built inside a parser. */
  evidence: {
    distinctIps: (n: string) => `${n} adresses distinctes`,
    distinctDevices: (n: string) => `${n} identifiants d’appareil distincts`,
    addressCount: (n: string) => `${n} adresses enregistrées`,
    addressCountOne: '1 adresse enregistrée',
    gpsPoints: (n: string) => `${n} points enregistrés`,
    truncated: (shown: string, total: string) => `${shown} affichées sur ${total}`,
  },

  /**
   * ⚠ SAID WHEN THE LABEL TABLE RECOGNISED (ALMOST) NOTHING — the connector's one silent failure,
   * given a voice. It names the mechanism, not a fault of the person: an export in a language whose
   * field names we do not have looks exactly like an empty account, and this sentence is the only
   * thing that tells them apart.
   */
  coverage: {
    none: 'aucun nom de champ de cet export n’a été reconnu : il est probablement dans une langue que cette version ne connaît pas encore',
    partial: (matched: string, total: string) =>
      `${matched} noms de champs sur ${total} ont été reconnus dans cet export — les sections vides peuvent l’être pour cette raison`,
  },

  /**
   * The monetisable categories. Each carries its name and two sentences: the measured evidence
   * when the export holds it, and the reason for the absence when it does not.
   *
   * ⚠ AN ABSENCE IS A FINDING, not a blank. The four categories the market prices highest —
   * payment, health, finance, off-Meta — are absent from an Instagram export BY NATURE, and saying
   * so is part of what the module shows.
   */
  valueCategories: {
    identity: {
      label: 'Identité civile',
      present: 'nom, date de naissance et genre dans le profil',
      absent: 'aucun champ d’identité renseigné',
    },
    address: {
      label: 'Adresse postale',
      present: (n: number) => `${n} adresse${n > 1 ? 's' : ''} enregistrée${n > 1 ? 's' : ''}`,
      absent: 'aucune adresse dans l’export',
    },
    phone: {
      label: 'Téléphone',
      present: 'numéro confirmé, et numéros déduits',
      absent: 'aucun numéro dans l’export',
    },
    email: { label: 'E-mail', present: 'adresse confirmée', absent: 'aucune adresse confirmée' },
    social: {
      label: 'Graphe social',
      present: (accounts: number, contacts: number) =>
        `${accounts} comptes, ${contacts} interlocuteurs`,
      absent: 'aucune relation lisible',
    },
    geo: {
      label: 'Géolocalisation',
      present: (points: number, ips: number, cities: number) =>
        `${points} points précis, ${ips} connexions situées, ${cities} villes`,
      absent: 'aucune position dans l’export',
    },
    consumption: {
      label: 'Historique de consommation',
      present: (saved: number, likes: number) => `${saved} posts enregistrés, ${likes} likes`,
      absent: 'aucune trace de consommation',
    },
    device: {
      label: 'Empreinte matérielle',
      present: (devices: number, events: number) =>
        `${devices} identifiants d’appareils, ${events} événements de compte`,
      absent: 'aucun identifiant d’appareil',
    },
    payment: { label: 'Moyen de paiement', present: '', absent: 'absent d’un export Instagram' },
    health: { label: 'Données de santé', present: '', absent: 'absent d’un export Instagram' },
    finance: { label: 'Données financières', present: '', absent: 'absent d’un export Instagram' },
    adtargeting: {
      label: 'Ciblage publicitaire',
      present: (n: number) => `${n} catégories utilisées pour cibler ce compte`,
      absent: 'aucune catégorie publicitaire dans l’export',
    },
    offmeta: {
      label: 'Activité hors-Meta',
      present: '',
      absent: 'quasi absent d’un export Instagram',
    },
  },

  /** Dated markers on the value curve. */
  milestones: {
    accountCreated: 'création du compte',
    addressRecorded: 'adresse enregistrée',
  },

  /** Listing labels of the third register. Prices come from the table, never from here. */
  darkwebItems: {
    instagramAccount: 'Compte Instagram volé',
    fullz: 'Dossier d’identité (« fullz »)',
    address: 'Adresse postale vérifiée',
    facebookAccount: 'Compte Facebook lié',
    includedInFile: 'inclus au dossier',
  },
};
