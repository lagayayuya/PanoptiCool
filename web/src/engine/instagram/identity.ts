// IDENTITY — the anchors the platform already holds, and what tying them to a verified legal
// identity would concretely permit.
//
// FACTUAL BY DECISION (yuya, prototype): a list of anchors, then technical consequences derived
// from them. No panel of opinion. The contrast block pairs a MEASURED FACT from the export with
// what is true today and what would become true after verification — a mechanism, never a risk run
// by the reader.
//
// ⚠ THE VALUES ARE SHOWN, and that is a decision rather than an oversight (yuya, 2026-07-15). These
// are the person's own data, read on their own machine, displayed to them. Masking them would
// weaken the finding — « we found an email » says far less than the email — and it protects nobody:
// nothing is transmitted, nothing is logged, and the archive never leaves the device (ADR-0002).
//
// ⚠ THE PROSE IS IN THE THIRD PERSON, and the prototype's was not. It said « Ton pseudonymat »,
// « Tes anciens pseudos », « c'est bien toi ». The engine does not address the person (ADR-0003);
// a machine that says « tes contenus deviennent attribuables » is passing a verdict on a reader it
// cannot see. Every sentence now lives in `wording.instagram.*`, swept in both languages.
//
// ─── WHAT THIS EXTRACTOR DOES NOT DO ────────────────────────────────────────────────────────────
//   - IT DOES NOT VERIFY ANYTHING. « Confirmed phone » repeats what the export claims; nothing here
//     checks a number, an address or a date against reality;
//   - IT DOES NOT SCORE. `anchorsPresent` is a count, not a risk level. There is no « your identity
//     is 78 % exposed », because that number would mean nothing and would be believed;
//   - IT TRUNCATES ITS LISTS AT 40 VALUES for display, and says so through `valuesTotal`. The
//     count is always the true one; only the list is cut;
//   - IT READS ONLY WHAT THE OTHER TWO REPORTS FOUND, for addresses and GPS. An address the geo
//     extractor missed is missing here too — the two failures are one.

import type { Locale } from '../../i18n/locales';
import { instagramWording } from '../wording.instagram';
import type { GeoReport } from './geo';
import type { InventoryReport } from './inventory';
import { isLabel, type LabelCoverage, type LabelKey } from './labels';
import { fixMojibake } from './mojibake';
import { labelValues, stringMap, toList } from './shapes';

const SEC_PER_YEAR = 31_557_600;

/** How many values a list shows before it says « and N more ». */
const MAX_SHOWN = 40;

/** What a single anchor makes possible on its own. */
export type AnchorStrength =
  /** Identifies a physical person: a name, a date of birth, an address. */
  | 'identifying'
  /** Links accounts and services to one another: an email, a phone, a device id. */
  | 'linking'
  /** Situates: an IP, a GPS fix, an address. */
  | 'locating'
  /** Describes without naming: rhythms, volumes. */
  | 'behavioral';

export interface IdentityAnchor {
  readonly key: string;
  readonly label: string;
  readonly present: boolean;
  readonly strength: AnchorStrength;
  /** The measured evidence — a count or a short state, never an adjective. */
  readonly evidence: string;
  /** The anchor's actual value(s), as they appear in the export. */
  readonly values: readonly string[];
  /** Total, when `values` was truncated for display. */
  readonly valuesTotal?: number;
  readonly enables: string;
}

/** ⚠ An abandoned handle stays archived. The most counter-intuitive finding of the module. */
export interface IdentityHistory {
  readonly usernameChanges: number;
  readonly displayNameChanges: number;
  readonly bioChanges: number;
  readonly emailChanges: number;
  readonly phoneChanges: number;
  readonly firstChangeTs: number | null;
  readonly lastChangeTs: number | null;
  readonly previousValuesRetained: number;
  readonly previousIdentities: ReadonlyArray<{
    /** `username` or `displayName` — a KEY, so the interface names it in its own language. */
    readonly field: 'username' | 'displayName';
    readonly value: string;
    readonly ts: number | null;
  }>;
}

export interface IdentityReport {
  readonly anchors: readonly IdentityAnchor[];
  readonly anchorsPresent: number;
  readonly history: IdentityHistory;
  readonly account: {
    readonly signupTs: number | null;
    readonly ageYears: number;
    readonly loginEvents: number;
    readonly distinctIps: number;
    readonly distinctDeviceIds: number;
    readonly securityCheckpoints: number;
    readonly privacyChanges: number;
    readonly passwordChanges: number;
    /** ⚠ Meta logs the export requests themselves — asking leaves a trace too. */
    readonly exportRequests: number;
  };
  readonly legalLinkage: ReadonlyArray<{
    readonly title: string;
    readonly fact: string;
    readonly today: string;
    readonly verified: string;
  }>;
}

type JsonSource = { readJson: <T>(p: string) => Promise<T> };

async function read(src: JsonSource, path: string, root?: string): Promise<unknown[]> {
  try {
    const d = await src.readJson<unknown>(path);
    if (root !== undefined && d && typeof d === 'object') {
      const wrapped = (d as Record<string, unknown>)[root];
      if (Array.isArray(wrapped)) return wrapped;
    }
    return toList(d);
  } catch {
    return [];
  }
}

/** The declared profile fields, keyed by label, mojibake repaired. */
async function profileFields(
  src: JsonSource,
  coverage?: LabelCoverage,
): Promise<Partial<Record<LabelKey, string>>> {
  const out: Partial<Record<LabelKey, string>> = {};
  const KEYS = [
    'name',
    'profileName',
    'dateOfBirth',
    'email',
    'phone',
    'phoneConfirmed',
    'gender',
    'privateAccount',
  ] as const satisfies readonly LabelKey[];
  for (const item of await read(
    src,
    'personal_information/personal_information/personal_information.json',
    'profile_user',
  )) {
    for (const [rawKey, v] of Object.entries(stringMap(item))) {
      const value = v.value === undefined ? '' : fixMojibake(String(v.value)).trim();
      if (value === '') continue;
      for (const key of KEYS) {
        if (isLabel(rawKey, key)) {
          coverage?.record(key);
          out[key] = value;
        }
      }
    }
  }
  return out;
}

/**
 * ⚠ THE CHANGE TYPES ARE ENGLISH IN A FRENCH EXPORT. `profile_changes` records what was modified as
 * `Username`, `Profile Name`, `Email` — untranslated values inside a localised file. So they are
 * compared as literals rather than through the label table: the table is for FIELD NAMES, and
 * putting a value in it would blur what it is for.
 */
const CHANGE_TYPES = {
  Username: 'username',
  'Profile Name': 'displayName',
} as const;

async function history(src: JsonSource, coverage?: LabelCoverage): Promise<IdentityHistory> {
  const list = await read(
    src,
    'personal_information/personal_information/profile_changes.json',
    'profile_profile_change',
  );
  let usernameChanges = 0;
  let displayNameChanges = 0;
  let bioChanges = 0;
  let emailChanges = 0;
  let phoneChanges = 0;
  let previousValuesRetained = 0;
  let firstChangeTs: number | null = null;
  let lastChangeTs: number | null = null;
  const previousIdentities: Array<{
    field: 'username' | 'displayName';
    value: string;
    ts: number | null;
  }> = [];

  for (const item of list) {
    let changed = '';
    let ts: number | undefined;
    let previousValue = '';
    for (const [rawKey, v] of Object.entries(stringMap(item))) {
      if (isLabel(rawKey, 'changedField')) {
        coverage?.record('changedField');
        changed = fixMojibake(String(v.value ?? '')).trim();
      } else if (isLabel(rawKey, 'changeDate')) {
        coverage?.record('changeDate');
        ts = v.timestamp;
      } else if (isLabel(rawKey, 'previousValue') && v.value !== undefined) {
        coverage?.record('previousValue');
        previousValuesRetained++;
        previousValue = fixMojibake(String(v.value)).trim();
      }
    }

    if (changed === 'Username') usernameChanges++;
    else if (changed === 'Profile Name') displayNameChanges++;
    else if (changed === 'Profile Bio Text' || changed === 'Profile Bio Link') bioChanges++;
    else if (changed === 'Email') emailChanges++;
    else if (changed === 'Phone Number') phoneChanges++;

    if (typeof ts === 'number' && ts > 0) {
      firstChangeTs = firstChangeTs === null ? ts : Math.min(firstChangeTs, ts);
      lastChangeTs = lastChangeTs === null ? ts : Math.max(lastChangeTs, ts);
    }

    const field = CHANGE_TYPES[changed as keyof typeof CHANGE_TYPES];
    if (previousValue !== '' && field !== undefined) {
      previousIdentities.push({
        field,
        value: previousValue,
        ts: typeof ts === 'number' ? ts : null,
      });
    }
  }

  previousIdentities.sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));
  return {
    usernameChanges,
    displayNameChanges,
    bioChanges,
    emailChanges,
    phoneChanges,
    firstChangeTs,
    lastChangeTs,
    previousValuesRetained,
    previousIdentities,
  };
}

export interface IdentityInputs {
  readonly inventory: InventoryReport;
  readonly geo: GeoReport;
  readonly nowTs: number;
  readonly locale: Locale;
}

export async function runIdentity(
  src: JsonSource,
  inp: IdentityInputs,
  coverage?: LabelCoverage,
): Promise<IdentityReport> {
  const w = instagramWording(inp.locale);
  const fields = await profileFields(src, coverage);
  const hist = await history(src, coverage);

  // ⚠ NUMBERS META ATTRIBUTES WITHOUT THEM EVER HAVING BEEN GIVEN — harvested from other people's
  // address books. The file is a single OBJECT with `label_values` at its root, not a list.
  const deducedPhones: string[] = [];
  const possible = await src
    .readJson<unknown>('personal_information/information_about_you/possible_phone_numbers.json')
    .catch(() => undefined);
  for (const e of Array.isArray(possible) ? possible : [possible]) {
    for (const lv of labelValues(e)) {
      if (isLabel(lv.label, 'phone') && lv.value !== undefined) {
        coverage?.record('phone');
        deducedPhones.push(fixMojibake(String(lv.value)).trim());
      }
    }
  }

  const exportRequests = (
    await read(
      src,
      'your_instagram_activity/other_activity/your_information_download_requests.json',
    )
  ).length;
  const privacyChanges = (
    await read(
      src,
      'security_and_login_information/login_and_profile_creation/profile_privacy_changes.json',
      'account_history_account_privacy_history',
    )
  ).length;
  const passwordChanges = (
    await read(
      src,
      'security_and_login_information/login_and_profile_creation/password_change_activity.json',
      'account_history_password_change_history',
    )
  ).length;

  // `profile_activity`: distinct IPs, device ids, and the security checkpoints — the moments Meta
  // itself doubted the account was its owner.
  const activity = await read(
    src,
    'security_and_login_information/login_and_profile_creation/profile_activity.json',
  );
  const ips = new Set<string>();
  const deviceIds = new Set<string>();
  let checkpoints = 0;
  let logins = 0;
  for (const item of activity) {
    for (const lv of labelValues(item)) {
      if (isLabel(lv.label, 'ipAddress') && lv.value) {
        coverage?.record('ipAddress');
        ips.add(lv.value);
      } else if (isLabel(lv.label, 'deviceId') && lv.value) {
        coverage?.record('deviceId');
        deviceIds.add(String(lv.value));
      } else if (isLabel(lv.label, 'eventType')) {
        coverage?.record('eventType');
        // ⚠ THESE TWO VALUES ARE NOT LOCALISED CONSISTENTLY: a French export writes « Connexion »
        // where an English one writes « Login ». Both spellings are accepted, because the count
        // silently halving is exactly the failure mode this connector is built to avoid.
        const t = fixMojibake(String(lv.value ?? ''))
          .trim()
          .toLowerCase();
        if (t === 'checkpoint') checkpoints++;
        else if (t === 'connexion' || t === 'login') logins++;
      }
    }
  }

  const signupTs = inp.inventory.identity.signupTs;
  const ageYears = signupTs !== null ? (inp.nowTs - signupTs) / SEC_PER_YEAR : 0;
  const devices = deviceIds.size > 0 ? deviceIds.size : inp.inventory.identity.distinctDeviceIds;

  const addressValues = inp.geo.addresses.map((a) =>
    [a.line1, a.line2, [a.postcode, a.city].filter(Boolean).join(' '), a.region, a.country]
      .filter((x) => x !== undefined && String(x).trim() !== '')
      .join(', '),
  );
  // ⚠ ISO, NOT A LOCALE-FORMATTED DATE. The prototype hard-coded `toLocaleDateString('fr-FR')`
  // inside the engine, which renders a French date on an English page — and the engine has no
  // business formatting for a page it cannot see. The interface formats; this emits a fact.
  const gpsValues = inp.geo.declared.map((p) => {
    const day = p.ts === null ? '' : ` — ${new Date(p.ts * 1000).toISOString().slice(0, 10)}`;
    return `${p.lat.toFixed(5)}, ${p.lon.toFixed(5)}${day}`;
  });
  const ipValues = [...ips];

  const one = (v: string | undefined): string[] => (v !== undefined && v !== '' ? [v] : []);
  const truncate = (values: string[]): Pick<IdentityAnchor, 'values' | 'valuesTotal'> =>
    values.length > MAX_SHOWN
      ? { values: values.slice(0, MAX_SHOWN), valuesTotal: values.length }
      : { values };

  const anchor = (
    key: string,
    a: (typeof w.anchors)[keyof typeof w.anchors],
    present: boolean,
    strength: AnchorStrength,
    values: string[],
    evidence?: string,
  ): IdentityAnchor => ({
    key,
    label: a.label,
    present,
    strength,
    evidence: evidence ?? (present ? a.present : a.absent),
    enables: a.enables,
    ...truncate(values),
  });

  const anchors: IdentityAnchor[] = [
    anchor('name', w.anchors.name, fields.name !== undefined, 'identifying', one(fields.name)),
    anchor(
      'profileName',
      w.anchors.profileName,
      fields.profileName !== undefined,
      'identifying',
      one(fields.profileName),
    ),
    anchor(
      'dateOfBirth',
      w.anchors.dateOfBirth,
      fields.dateOfBirth !== undefined,
      'identifying',
      one(fields.dateOfBirth),
    ),
    anchor(
      'gender',
      w.anchors.gender,
      fields.gender !== undefined,
      'identifying',
      one(fields.gender),
    ),
    anchor(
      'address',
      w.anchors.address,
      addressValues.length > 0,
      'identifying',
      addressValues,
      addressValues.length === 1
        ? w.evidence.addressCountOne
        : addressValues.length > 1
          ? w.evidence.addressCount(String(addressValues.length))
          : w.anchors.address.absent,
    ),
    anchor('email', w.anchors.email, fields.email !== undefined, 'linking', one(fields.email)),
    anchor('phone', w.anchors.phone, fields.phone !== undefined, 'linking', one(fields.phone)),
    anchor(
      'deducedPhone',
      w.anchors.deducedPhone,
      deducedPhones.length > 0,
      'linking',
      deducedPhones,
    ),
    anchor(
      'device',
      w.anchors.device,
      devices > 0,
      'linking',
      [...deviceIds],
      devices > 0 ? w.evidence.distinctDevices(String(devices)) : w.anchors.device.absent,
    ),
    anchor(
      'privacy',
      w.anchors.privacy,
      fields.privateAccount !== undefined,
      'behavioral',
      one(fields.privateAccount),
    ),
    anchor(
      'ip',
      w.anchors.ip,
      ips.size > 0,
      'locating',
      ipValues,
      ips.size > 0 ? w.evidence.distinctIps(String(ips.size)) : w.anchors.ip.absent,
    ),
    anchor(
      'gps',
      w.anchors.gps,
      gpsValues.length > 0,
      'locating',
      gpsValues,
      gpsValues.length > 0 ? w.evidence.gpsPoints(String(gpsValues.length)) : w.anchors.gps.absent,
    ),
  ];

  const since =
    signupTs !== null
      ? String(new Date(signupTs * 1000).getUTCFullYear())
      : String(inp.inventory.identity.profileChanges);
  const legalLinkage = [
    {
      ...w.legalLinkage.pseudonymity,
      fact: w.linkageFacts.pseudonymity(
        String(hist.usernameChanges),
        String(hist.previousValuesRetained),
      ),
    },
    { ...w.legalLinkage.accountLinks, fact: w.linkageFacts.accountLinks(String(devices)) },
    {
      ...w.legalLinkage.pastContent,
      fact: w.linkageFacts.pastContent(String(activity.length), since),
    },
    {
      ...w.legalLinkage.freshStart,
      fact: w.linkageFacts.freshStart(String(ips.size), String(devices)),
    },
    { ...w.legalLinkage.leak, fact: w.linkageFacts.leak(String(exportRequests)) },
  ];

  return {
    anchors,
    anchorsPresent: anchors.filter((a) => a.present).length,
    history: hist,
    account: {
      signupTs,
      ageYears: Math.round(ageYears * 10) / 10,
      loginEvents: logins,
      distinctIps: ips.size,
      distinctDeviceIds: devices,
      securityCheckpoints: checkpoints,
      privacyChanges,
      passwordChanges,
      exportRequests,
    },
    legalLinkage,
  };
}
