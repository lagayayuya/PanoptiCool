// INSTAGRAM ENGINE wording, ENGLISH.
//
// ┌──────────────────────────────────────────────────────────────────────────────────────────┐
// │ PROVISIONAL TRANSLATION — TO BE REVIEWED BY yuya, line by line, like the French half.     │
// └──────────────────────────────────────────────────────────────────────────────────────────┘
//
// THE FORM IS HELD BY `wording.instagram.fr.ts`: this file annotates itself `InstagramWording`
// (= `typeof FR`), so a forgotten entry, an extra key or a diverging signature are COMPILATION
// errors. What no compiler sees: whether an entry is actually TRANSLATED.
//
// ⚠ NO SECOND PERSON, in this language too. English makes the slip easier than French does —
// « what this lets someone do to you » reads naturally and is exactly what ADR-0003 forbids the
// engine to say. The infinitive: « tie the account to a named person », never « tie YOUR account ».
// `wording-instagram.test.ts` sweeps for it in both languages, for that reason.

import type { InstagramWording } from './wording.instagram';

export const EN: InstagramWording = {
  anchors: {
    name: {
      label: 'Name',
      enables: 'tie the account to a named person',
      present: 'filled in on the profile',
      absent: 'absent',
    },
    profileName: {
      label: 'Profile name',
      enables: 'designate the account publicly',
      present: 'current public handle',
      absent: 'absent',
    },
    dateOfBirth: {
      label: 'Date of birth',
      enables: 'tell two namesakes apart, derive an exact age',
      present: 'filled in',
      absent: 'absent',
    },
    gender: {
      label: 'Gender',
      enables: 'sharpen an advertising profile and a cross-match',
      present: 'filled in',
      absent: 'absent',
    },
    address: {
      label: 'Postal address',
      enables: 'locate a home, cross-match against public records',
      present: 'on file',
      absent: 'absent',
    },
    email: {
      label: 'Email address',
      enables: 'link this account to every other opened with the same address',
      present: 'confirmed',
      absent: 'absent',
    },
    phone: {
      label: 'Phone number',
      enables: 'a near-unique identifier, tied to a contract in someone’s name',
      present: 'filled in',
      absent: 'absent',
    },
    deducedPhone: {
      label: 'Inferred numbers',
      enables: 'link the account to people through their address books',
      present: 'attributed without ever being given',
      absent: 'none',
    },
    device: {
      label: 'Device identifiers',
      enables: 'follow one device across accounts, sessions and applications',
      present: 'recorded',
      absent: 'none',
    },
    privacy: {
      label: 'Private account',
      enables: 'know how exposed the account is to the public',
      present: 'current setting',
      absent: 'not filled in',
    },
    ip: {
      label: 'IP addresses',
      enables: 'reconstruct login places and movements',
      present: 'recorded at every login',
      absent: 'none recorded',
    },
    gps: {
      label: 'GPS coordinates',
      enables: 'situate precise moments to within a few metres',
      present: 'recorded',
      absent: 'none recorded',
    },
  },

  categories: {
    following: 'Following',
    follower: 'Follower',
    story_like: 'Stories liked',
    poll: 'Polls answered',
    comment: 'Comments posted',
    comment_like: 'Comments liked',
    blocked: 'Blocked',
    pending_sent: 'Requests left unanswered',
    close_friend: 'Close friends',
    favorite: 'Favourites',
    hide_story: 'Story hidden from',
  },

  legalLinkage: {
    pseudonymity: {
      title: 'Pseudonymity',
      today:
        'previous handles are archived, with nothing formally proving who stood behind each of them',
      verified:
        'the thread becomes single and certain: every past identity officially designates the same person',
    },
    accountLinks: {
      title: 'The link between accounts',
      today: 'these details already allow a match with other accounts — with a margin of error',
      verified: 'the margin disappears: the match becomes proof rather than probability',
    },
    pastContent: {
      title: 'Past content',
      today: 'everything is kept and dated, but attached to an account, not to a legal identity',
      verified:
        'each piece becomes attributable to a named person before a third party: an employer, an administration, a court',
    },
    freshStart: {
      title: 'Starting over',
      today: 'a new account can be matched to this one — likely, never certain',
      verified: 'the door closes: the past follows the person, not the account',
    },
    leak: {
      title: 'In a breach',
      today: 'a breach exposes a handle and the data attached to an account',
      verified: 'a breach exposes a verified legal identity: nothing is « just a handle » any more',
    },
  },

  linkageFacts: {
    pseudonymity: (changes: string, retained: string) =>
      `${changes} handle changes, ${retained} previous values kept`,
    accountLinks: (devices: string) => `email, confirmed phone and ${devices} known devices`,
    pastContent: (events: string, since: string) => `${events} dated account events since ${since}`,
    freshStart: (ips: string, devices: string) =>
      `${ips} IP addresses and ${devices} known devices`,
    leak: (requests: string) =>
      `${requests} export requests recorded — wanting to know leaves a trace too`,
  },

  evidence: {
    distinctIps: (n: string) => `${n} distinct addresses`,
    distinctDevices: (n: string) => `${n} distinct device identifiers`,
    addressCount: (n: string) => `${n} addresses on file`,
    addressCountOne: '1 address on file',
    gpsPoints: (n: string) => `${n} points recorded`,
    truncated: (shown: string, total: string) => `${shown} shown of ${total}`,
  },

  coverage: {
    none: 'none of this export’s field names were recognised: it is probably in a language this version does not know yet',
    partial: (matched: string, total: string) =>
      `${matched} of ${total} field names were recognised in this export — empty sections may be empty for that reason`,
  },

  valueCategories: {
    identity: {
      label: 'Legal identity',
      present: 'name, date of birth and gender on the profile',
      absent: 'no identity field filled in',
    },
    address: {
      label: 'Postal address',
      present: (n: number) => `${n} address${n > 1 ? 'es' : ''} on file`,
      absent: 'no address in the export',
    },
    phone: {
      label: 'Phone',
      present: 'confirmed number, and inferred numbers',
      absent: 'no number in the export',
    },
    email: { label: 'Email', present: 'confirmed address', absent: 'no confirmed address' },
    social: {
      label: 'Social graph',
      present: (accounts: number, contacts: number) =>
        `${accounts} accounts, ${contacts} correspondents`,
      absent: 'no readable relationships',
    },
    geo: {
      label: 'Location',
      present: (points: number, ips: number, cities: number) =>
        `${points} precise points, ${ips} situated logins, ${cities} cities`,
      absent: 'no position in the export',
    },
    consumption: {
      label: 'Consumption history',
      present: (saved: number, likes: number) => `${saved} saved posts, ${likes} likes`,
      absent: 'no trace of consumption',
    },
    device: {
      label: 'Hardware fingerprint',
      present: (devices: number, events: number) =>
        `${devices} device identifiers, ${events} account events`,
      absent: 'no device identifier',
    },
    payment: { label: 'Payment method', present: '', absent: 'absent from an Instagram export' },
    health: { label: 'Health data', present: '', absent: 'absent from an Instagram export' },
    finance: { label: 'Financial data', present: '', absent: 'absent from an Instagram export' },
    adtargeting: {
      label: 'Ad targeting',
      present: (n: number) => `${n} categories used to reach this account`,
      absent: 'no advertising category in the export',
    },
    offmeta: {
      label: 'Off-Meta activity',
      present: '',
      absent: 'all but absent from an Instagram export',
    },
  },

  milestones: {
    accountCreated: 'account created',
    addressRecorded: 'address recorded',
  },

  darkwebItems: {
    instagramAccount: 'Stolen Instagram account',
    fullz: 'Identity file (« fullz »)',
    address: 'Verified postal address',
    facebookAccount: 'Linked Facebook account',
    includedInFile: 'included in the file',
  },
};
