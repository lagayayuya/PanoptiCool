// THE LABEL TABLE, AND THE HONESTY OF ITS ENGLISH HALF.
//
// WHY THIS FILE EXISTS. `labels.ts` carries the connector's single most consequential failure mode:
// a label that does not match yields an EMPTY SECTION, never an error. Nothing downstream can tell
// « this account has no declared city » from « we do not know what Instagram calls that field in
// this language ». Every assertion below exists to give that failure a symptom.
//
// ⚠ IT MEASURES THE TABLE, NOT THE FORMAT. The French spellings were read from ONE real export and
// are reproduced here from `docs/instagram-export-schema.md` §3.1. If Instagram renames a field
// tomorrow, this file stays green and the connector stops finding it — no test can close that, and
// pretending otherwise is how a net comes to be over-cited.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - IT DOES NOT VERIFY ONE ENGLISH SPELLING. It verifies that they are all still MARKED
//     unverified, which is the opposite claim and the only one the evidence supports;
//   - IT READS NO EXPORT. The fixtures below are hand-written label strings, not files;
//   - IT SAYS NOTHING ABOUT THE EXTRACTORS. That each of them actually consults this table, rather
//     than keeping a hard-coded string beside it, is asserted where they live — and it is exactly
//     the regression this table exists to prevent, so it must be asserted somewhere.

import { describe, expect, it } from 'vitest';
import {
  fromStringMap,
  isLabel,
  LABEL_KEYS,
  LabelCoverage,
  type LabelKey,
  spellingsOf,
  unverifiedEnglishKeys,
} from './labels';

describe('the label table', () => {
  it('every key carries a spelling in BOTH languages (the whole point of the table)', () => {
    // Checked in both directions rather than by counting: « each key has spellings » and « no key
    // has only one language's » are two properties, and holding one is how three ratified readings
    // once lived without a reader.
    for (const key of LABEL_KEYS) {
      expect(spellingsOf(key, 'fr').length, `${key} has no French spelling`).toBeGreaterThan(0);
      expect(spellingsOf(key, 'en').length, `${key} has no English spelling`).toBeGreaterThan(0);
    }
    // ⚠ NOT « the two lists differ ». Several fields are spelled identically in both languages
    // (`Port`, `Latitude`, `Longitude`), so requiring a difference would fail on correct entries —
    // and requiring the flat list to hold no duplicate would fail on the same ones. The flat form
    // deduplicates; that is the table being right, not being lazy.
    expect(spellingsOf('port')).toEqual(['Port']);
    expect(spellingsOf('city')).toEqual(['Ville', 'City']);
  });

  it('a French label matches THROUGH its mojibake, which is how it arrives', () => {
    // The legacy dialect makes the label the object KEY, double-encoded. This is the case that
    // breaks first and silently, so it is asserted on the raw bytes rather than on a clean string.
    expect(isLabel('Compte privÃ©', 'privateAccount')).toBe(true);
    expect(isLabel('NumÃ©ro de tÃ©lÃ©phone', 'phone')).toBe(true);
    expect(isLabel('Latitude imprÃ©cise', 'impreciseLatitude')).toBe(true);

    // And the already-clean form matches too — an export whose text was not double-encoded must not
    // become the case that fails.
    expect(isLabel('Compte privé', 'privateAccount')).toBe(true);
  });

  it('a near-miss does NOT match (the table matches names, it does not guess)', () => {
    expect(isLabel('Nom du profil', 'profileName')).toBe(false); // « du », not « de »
    expect(isLabel('', 'name')).toBe(false);
    expect(isLabel(undefined, 'name')).toBe(false);
    // ⚠ The two adjectives Instagram uses for the same pair are NOT interchangeable in the table:
    // matching them loosely would hide the day one of them changes.
    expect(isLabel('Longitude imprécise', 'impreciseLongitude')).toBe(false);
    expect(isLabel('Longitude inexacte', 'impreciseLongitude')).toBe(true);
  });

  it('⚠ only the NON-LOCALISED keys count as verified — no English export exists', () => {
    // The bearing assertion of this file, and it names the exceptions rather than counting them.
    // A count would let one key swap for another without a word; this list makes confirming a
    // spelling a deliberate act with a visible diff, in both directions.
    //
    // The three below are verified for a reason that is NOT « someone checked an English export »:
    // Instagram does not localise the comment files' keys, so the French export already proves the
    // English spelling. That is evidence, and it is the only kind we have.
    const verified = LABEL_KEYS.filter((k) => !unverifiedEnglishKeys().includes(k));
    expect(verified.sort()).toEqual(['comment', 'mediaOwner']);
  });
});

describe('coverage — the only symptom the silent failure has', () => {
  const IDENTITY_MAP = {
    'Nom de profil': { value: 'synthetic-handle' },
    'NumÃ©ro de tÃ©lÃ©phone': { value: '+00 000' },
  };

  it('counts what matched, and NAMES what did not', () => {
    const coverage = new LabelCoverage();
    expect(fromStringMap(IDENTITY_MAP, 'profileName', coverage)?.value).toBe('synthetic-handle');
    expect(fromStringMap(IDENTITY_MAP, 'phone', coverage)?.value).toBe('+00 000');
    // A key the map does not carry: no hit, and no crash.
    expect(fromStringMap(IDENTITY_MAP, 'gender', coverage)).toBeUndefined();

    const summary = coverage.summary();
    expect(summary.matched).toBe(2);
    expect(summary.total).toBe(LABEL_KEYS.length);
    expect(summary.missed).toContain<LabelKey>('gender');
    expect(summary.missed).not.toContain<LabelKey>('profileName');
  });

  it('an export whose labels are all unknown reports ZERO, not silence', () => {
    // The case the whole design is for: a language whose spellings we do not have. The extractors
    // would return empty sections; this is what tells them apart from an empty account.
    const foreign = { Профиль: { value: 'x' }, Телефон: { value: 'y' } };
    const coverage = new LabelCoverage();
    for (const key of LABEL_KEYS) {
      fromStringMap(foreign, key, coverage);
    }
    expect(coverage.summary().matched).toBe(0);
    expect(coverage.summary().missed.length).toBe(LABEL_KEYS.length);
  });
});
