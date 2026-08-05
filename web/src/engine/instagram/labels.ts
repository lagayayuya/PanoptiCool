// THE LABEL TABLE — the one place that knows what Instagram calls its fields, in each language.
//
// ─── THE PROBLEM, WHICH IS THE MOST CONSEQUENTIAL ONE IN THIS CONNECTOR ─────────────────────────
// An Instagram export names its fields IN THE ACCOUNT HOLDER'S LANGUAGE (`docs/instagram-export-schema.md`
// §3). A French export says `Nom de profil`; an English one does not. The extractors match those
// labels BY STRING, so a label that does not match yields **an empty section, never an error** —
// indistinguishable, on screen, from an account with nothing to show.
//
// The prototype hard-coded French strings in seven files, with an English fallback in two of them.
// An English-locale export therefore produced a near-empty Identity, Relations and Geo report,
// silently. Gathering them here is not tidying: it is the difference between a bug that is visible
// and one that is not.
//
// ─── ⚠ THE FRENCH IS OBSERVED, THE ENGLISH IS DERIVED ───────────────────────────────────────────
// Every French string below was READ from a real export. **No English export was available**, so
// every English string was reconstructed from Instagram's interface wording. They are hypotheses,
// and the table says so per entry (`enVerified`) rather than in a header nobody re-reads — because
// the day one is confirmed, the honest change is to flip one flag, not to quietly forget the
// distinction existed.
//
// `labelCoverage()` exists for the same reason: it lets a caller report HOW MANY keys matched, so
// that zero can be told apart from empty. Without it, the failure mode above has no symptom at all.
//
// ─── WHAT THIS TABLE DOES NOT DO ────────────────────────────────────────────────────────────────
//   - IT DOES NOT DETECT THE EXPORT'S LANGUAGE. A lookup tries every known spelling and takes the
//     first that matches. An export is in one language, but knowing which buys nothing and costs a
//     detection step that can be wrong;
//   - IT COVERS THE FIELDS THE CONNECTOR READS, not the export. Hundreds of labels exist in files
//     nothing reads (`docs/instagram-export-schema.md` §6);
//   - IT SAYS NOTHING ABOUT VALUES. Labels are structure; the values behind them are the person's,
//     and none of them appears in this repo.

import { fixMojibake } from './mojibake';

/** The fields the connector looks for, by MEANING rather than by spelling. */
export type LabelKey =
  // Identity
  | 'profileName'
  | 'name'
  | 'email'
  | 'phone'
  | 'phoneConfirmed'
  | 'phoneConfirmationMethod'
  | 'gender'
  | 'dateOfBirth'
  | 'privateAccount'
  // Geo — login trail and declared location
  | 'ipAddress'
  | 'time'
  | 'updateTime'
  | 'languageCode'
  | 'userAgent'
  | 'cookieName'
  | 'port'
  | 'latitude'
  | 'longitude'
  | 'preciseLatitude'
  | 'preciseLongitude'
  | 'impreciseLatitude'
  | 'impreciseLongitude'
  | 'place'
  | 'details'
  // Declared address
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'region'
  | 'postcode'
  | 'country'
  | 'countryName'
  | 'lastUpdated'
  // Public interactions
  | 'mediaOwner'
  | 'comment'
  | 'pollQuestion'
  | 'lastLogin'
  | 'deviceId'
  | 'changedField'
  | 'changeDate'
  | 'previousValue'
  | 'eventType';

interface LabelSpec {
  /** Read from a real export. */
  readonly fr: readonly string[];
  /** Reconstructed from Instagram's interface — see the header. */
  readonly en: readonly string[];
  /**
   * `true` when the English spelling RESTS ON EVIDENCE rather than on reconstruction.
   *
   * Two ways to earn it, and only two: an English export confirms the string (none exists yet), or
   * the field is NOT LOCALISED AT ALL and the French export therefore already proves both — which
   * is the case for the three comment-file keys, and the only reason any entry is `true` today.
   *
   * ⚠ EVERY OTHER ENTRY IS `false`, and that is a fact about our evidence, not about the code. The
   * witness asserts WHICH keys are verified, not how many, so flipping one is a deliberate act with
   * a visible diff — and so the claim cannot quietly widen.
   */
  readonly enVerified: boolean;
}

/**
 * ⚠ SPELLINGS ARE LISTED, NOT NORMALISED. `Latitude imprécise` sits beside `Longitude inexacte` —
 * two different adjectives for the same pair, in the source. Instagram is not consistent with
 * itself, and a table that "tidies" that stops matching the file.
 */
const TABLE: Record<LabelKey, LabelSpec> = {
  profileName: { fr: ['Nom de profil'], en: ['Profile Name', 'Username'], enVerified: false },
  name: { fr: ['Nom'], en: ['Name'], enVerified: false },
  email: { fr: ['Adresse e-mail'], en: ['Email address', 'Email'], enVerified: false },
  phone: { fr: ['Numéro de téléphone'], en: ['Phone number'], enVerified: false },
  phoneConfirmed: {
    fr: ['Numéro de téléphone confirmé'],
    en: ['Phone number confirmed'],
    enVerified: false,
  },
  phoneConfirmationMethod: {
    fr: ['Méthode de confirmation du numéro de téléphone'],
    en: ['Phone number confirmation method'],
    enVerified: false,
  },
  gender: { fr: ['Genre'], en: ['Gender'], enVerified: false },
  dateOfBirth: { fr: ['Date de naissance'], en: ['Date of birth'], enVerified: false },
  privateAccount: { fr: ['Compte privé'], en: ['Private account'], enVerified: false },

  ipAddress: { fr: ['Adresse IP'], en: ['IP address', 'IP Address'], enVerified: false },
  time: { fr: ['Heure'], en: ['Time'], enVerified: false },
  updateTime: {
    fr: ['Heure de mise à jour'],
    en: ['Update time', 'Time of update'],
    enVerified: false,
  },
  languageCode: { fr: ['Code de langue'], en: ['Language code'], enVerified: false },
  userAgent: { fr: ['Agent utilisateur'], en: ['User agent'], enVerified: false },
  cookieName: { fr: ['Nom du cookie'], en: ['Cookie name'], enVerified: false },
  port: { fr: ['Port'], en: ['Port'], enVerified: false },

  latitude: { fr: ['Latitude'], en: ['Latitude'], enVerified: false },
  longitude: { fr: ['Longitude'], en: ['Longitude'], enVerified: false },
  preciseLatitude: { fr: ['Latitude exacte'], en: ['Precise latitude'], enVerified: false },
  preciseLongitude: { fr: ['Longitude exacte'], en: ['Precise longitude'], enVerified: false },
  impreciseLatitude: {
    fr: ['Latitude imprécise'],
    en: ['Imprecise latitude'],
    enVerified: false,
  },
  // ⚠ « inexacte », not « imprécise ». The source is inconsistent; see the note above.
  impreciseLongitude: {
    fr: ['Longitude inexacte'],
    en: ['Imprecise longitude'],
    enVerified: false,
  },
  place: { fr: ['Lieu'], en: ['Place', 'Location'], enVerified: false },
  details: { fr: ['Détails'], en: ['Details'], enVerified: false },

  addressLine1: {
    fr: ['Ligne d’adresse 1', 'Adresse'],
    en: ['Address line 1', 'Address'],
    enVerified: false,
  },
  addressLine2: { fr: ['Ligne d’adresse 2'], en: ['Address line 2'], enVerified: false },
  city: { fr: ['Ville'], en: ['City'], enVerified: false },
  // ⚠ TWO FRENCH SPELLINGS, and both are real: `profile_activity` says « Région » where the
  // autofill card says « État ». Listing one would have emptied the other's field — which is the
  // silent failure this whole table exists to prevent, arriving from inside our own list.
  region: { fr: ['Région', 'État'], en: ['Region', 'State'], enVerified: false },
  postcode: { fr: ['Code postal'], en: ['Postal code', 'Zip code'], enVerified: false },
  country: { fr: ['Pays'], en: ['Country'], enVerified: false },
  countryName: { fr: ['Nom du pays'], en: ['Country name'], enVerified: false },
  lastUpdated: {
    fr: ['Date de la dernière mise à jour'],
    en: ['Last updated', 'Date last updated'],
    enVerified: false,
  },

  // ⚠ THESE THREE ARE ALREADY ENGLISH IN A FRENCH EXPORT. Instagram does not localise the keys of
  // the comment files — `Media Owner`, `Time`, `Comment` arrive in English whatever the account's
  // language. Listing the same string under both languages is not a copy-paste: it is the table
  // recording that this field does not vary, which is a fact worth holding rather than a gap.
  mediaOwner: { fr: ['Media Owner'], en: ['Media Owner'], enVerified: true },
  comment: { fr: ['Comment'], en: ['Comment'], enVerified: true },
  pollQuestion: { fr: ['Question'], en: ['Question'], enVerified: false },
  lastLogin: { fr: ['Dernière connexion'], en: ['Last login'], enVerified: false },
  // ⚠ A TYPOGRAPHIC APOSTROPHE, not an ASCII one. `ID d’appareil` with U+2019 is what the file
  // carries; the straight-quote spelling is listed beside it because a hand-written comparison
  // gets this wrong every time and the failure is, as always here, an empty section.
  deviceId: { fr: ['ID d’appareil', "ID d'appareil"], en: ['Device ID'], enVerified: false },
  changedField: { fr: ['Modifié'], en: ['Changed'], enVerified: false },
  changeDate: { fr: ['Date de modification'], en: ['Change Date'], enVerified: false },
  previousValue: { fr: ['Valeur précédente'], en: ['Previous Value'], enVerified: false },
  eventType: { fr: ['Type'], en: ['Type'], enVerified: false },
};

export const LABEL_KEYS = Object.keys(TABLE) as LabelKey[];

/**
 * Every spelling of a key, or only one language's.
 *
 * ⚠ THE FLAT FORM IS DEDUPLICATED, because several fields are spelled identically in the two
 * languages — `Port`, `Latitude`, `Longitude`, `Détails`/`Details` differ by an accent or not at
 * all. That is not a gap in the table; it is what the words do.
 */
export function spellingsOf(key: LabelKey, lang?: 'fr' | 'en'): readonly string[] {
  if (lang !== undefined) return TABLE[key][lang];
  return [...new Set([...TABLE[key].fr, ...TABLE[key].en])];
}

/** Keys whose English spelling has never been checked against a real export. */
export function unverifiedEnglishKeys(): LabelKey[] {
  return LABEL_KEYS.filter((k) => !TABLE[k].enVerified);
}

/**
 * Does `raw` — a label straight out of the JSON, mojibake and all — name this field?
 *
 * The comparison repairs the mojibake FIRST, because in the legacy dialect the label IS the object
 * key and arrives double-encoded (`Compte privÃ©`). Comparing raw would fail on every accented
 * French field, which is most of them.
 */
export function isLabel(raw: string | undefined, key: LabelKey): boolean {
  if (raw === undefined) return false;
  const repaired = fixMojibake(raw);
  return spellingsOf(key).includes(repaired);
}

/**
 * Counts which keys a run actually matched.
 *
 * ⚠ THIS IS THE ONLY SYMPTOM THE SILENT FAILURE HAS. A wrong label table produces empty sections
 * that look exactly like an empty account; a coverage of 0/31 does not. The connector reports it
 * so the interface can say « we recognised none of the field names in this export » instead of
 * confidently rendering nothing.
 */
export class LabelCoverage {
  private readonly hit = new Set<LabelKey>();

  record(key: LabelKey): void {
    this.hit.add(key);
  }

  /** Matched / total. A caller decides what to do with it; this class asserts nothing. */
  summary(): { matched: number; total: number; missed: LabelKey[] } {
    return {
      matched: this.hit.size,
      total: LABEL_KEYS.length,
      missed: LABEL_KEYS.filter((k) => !this.hit.has(k)),
    };
  }
}

/** Finds a key's value in a legacy-dialect `string_map_data`, recording the hit. */
export function fromStringMap(
  map: Record<string, { value?: string; timestamp?: number }>,
  key: LabelKey,
  coverage?: LabelCoverage,
): { value?: string; timestamp?: number } | undefined {
  for (const [rawKey, entry] of Object.entries(map)) {
    if (isLabel(rawKey, key)) {
      coverage?.record(key);
      return entry;
    }
  }
  return undefined;
}
