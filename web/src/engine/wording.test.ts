// Framing PROPERTY tests (PANO-13, ADR-0003's framing guardrail; revised at PANO-56 correction
// no. 5; carried onto `wording.ts` at Rework A, batch A2 — ex-`ui/templates.test.ts`).
//
// They do NOT judge the tone (provisional, re-read by yuya): they lock STRUCTURAL properties on
// every rendered text —
//   (a) no 2nd-person mark, on EVERY text in the wording file;
//   (c) for CLAIMS (the only line displayed since PANO-56 — a short phrase WITHOUT an explicit
//       subject): no direct verdict on the person, and no sensitive label laid down BARE without an
//       inference marker.
// Short fragments (fan readings, theme labels, usage, subject names) are subject only to (a): « un
// vécu personnel » does not have to frame itself, it is not an assertive sentence.
// This is the automatic net of « a mirror, not an oracle ». It must stay green.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
// A CLAUDE.md obligation: a proof mechanism declares its border, or it ends up over-cited.
//
//   - GUARD (a) IS LEXICAL, NOT PRAGMATIC. It catches PRONOUNS, not ADDRESS. « Consider seeking
//     help » addresses the reader without carrying a single 2nd-person token, and passes. What we
//     hold is « no 2nd-person pronoun », not « the engine addresses no one » — the second is
//     ADR-0003's obligation, and it is a human re-reading that holds it.
//   - (c) IS A PROXY, IN BOTH LANGUAGES. `PERSON_DIRECT_VERDICT` looks for a French copula (« la
//     personne EST X »); English has its own (`is`/`seems`/`looks`), and both lists are
//     approximations, not a grammatical analysis. An assertive form written otherwise — a bare
//     participle, an apposition — passes. It is a guardrail, not a proof.
//   - NEITHER OF THEM JUDGES THE TRANSLATION. The sweep covers both bundles, so a faulty English
//     text goes red; but an English text that COPIES the French passes (a) and (c) without a sound.
//     The non-copy witness below only catches the crude case — zero text translated. Between
//     « nothing is translated » and « everything is well translated », there is only human
//     re-reading.
//   - THE TABLES DO NOT GO THROUGH HERE. Readings, themes, usages and actors are resolvers
//     (`RESOLVERS`): their coverage is held by `d1/d2-wording-coverage.test.ts`, and their FR/EN
//     parity by `wording-parity.test.ts`. Three nets, three properties — never cite one for
//     another.
//
// ─── (b) « SUBJECT = PLATFORM » WAS REMOVED ALONG WITH `framing` — why that is not a loss ────────
// Property (b) required every `*.framing` template to take the platform/the system as its subject.
// But `framing` had NOT BEEN RENDERED since PANO-56: (b) was therefore proving a doctrinal
// obligation ON TEXT NOBODY READS. Removing it along with its subject takes away no guarantee on
// the screen. (b) CANNOT be carried over as-is onto the `claim`: the form ratified at PANO-56 was a
// phrase WITHOUT a subject — requiring it to name the platform would reopen PANO-56 and rewrite the
// wording, hence the golden.
// ⚠ This paragraph used to cite « Signal indirect associable à la santé mentale » IN THE PRESENT, as
// if that claim existed. It no longer does: the ten sentences of the five fan labels were removed
// with batch C (the fan carries the meaning), and only three claims remain — none of them carries a
// sensitive label. The reasoning about (b) holds without the example; the example, for its part,
// was sending a dead sentence off to be translated.
// What SURVIVES, and what is the real net, is (c): « never a verdict on the person », on the text
// actually displayed. It was WIDENED BEFORE `framing` was removed — a non-negotiable condition from
// yuya; the commit that carried it did not survive the v1 history rewrite — its v0 anchored the
// assertive form on the lexeme « personne » alone.

import { describe, expect, it } from 'vitest';
import { LOCALES, type Locale } from '../i18n/locales';
import * as wording from './wording';

// The sweep is EXHAUSTIVE BY CONSTRUCTION: it walks the module's exports (`import * as`), not a
// hand-maintained list — better than the ex-`allTemplateIds()`, which depended on an entry in the
// catalog. An added claim is swept without declaring anything.
// `actorLabel`/`readingText`/`themeLabelText`/`usageText`/`sensitiveTopicName`/`hasX` take a KEY,
// not render params: they are resolvers, not texts. The tables they resolve are swept by
// `d1/d2-wording-coverage.test.ts`, on the REAL keys of the lexicons.
const RESOLVERS = /^(has|actorLabel|readingText|themeLabelText|usageText|sensitiveTopicName)/;

// ⚠ EVERY RENDER IS PARAMETERIZED BY LANGUAGE, and the sweep walks them ALL (`LOCALES`). Without
// that, property (a) — an ADR-0003 obligation — would hold only in the swept language, and the
// English bundle could write « you seem depressed » without anything going red. This is the pattern
// CLAUDE.md counts seven times: a net written on the typical cases, cited as if it covered the
// domain.
const RENDERERS: [string, (locale: Locale) => string][] = Object.entries(wording).flatMap(
  ([name, value]) => {
    if (typeof value !== 'function' || RESOLVERS.test(name)) {
      return [];
    }
    // `fn.length` gives the arity. The FIRST parameter is the `Locale`; the following ones (only
    // `d2InterestClaim` has one, `signalCount: number`) are fed a number, with no need to list the
    // cases. ⚠ The `- 1` is not cosmetic: without it, the locale would receive `5`.
    const fn = value as (locale: Locale, ...args: number[]) => string;
    const extras = new Array<number>(Math.max(0, fn.length - 1)).fill(5);
    const entry: [string, (locale: Locale) => string] = [
      name,
      (locale: Locale) => String(fn(locale, ...extras)),
    ];
    return [entry];
  },
);

const CLAIMS = RENDERERS.filter(([name]) => /Claim$/.test(name));

// (a) 2nd person — A DOCTRINAL OBLIGATION, NOT A STYLE RULE. ADR-0003 (*The framing*): the engine
// NEVER addresses the person, at any confidence level. « Tu sembles traverser une dépression »
// would pronounce the verdict the doctrine forbids.
//
// FR: pronouns/determiners (bounded by `\b` to avoid false positives such as « habi**tu**des » or
// « in**te**ntion ») + the elision « t' » (t'as, t'es…). Straight AND typographic apostrophe.
const SECOND_PERSON_FR = /\b(tu|toi|ton|ta|tes|te|vous|votre|vos|vôtre)\b|\bt['’]/i;

// EN: the guard is written BEFORE the file it protects, and that is deliberate — a doctrinal
// obligation that exists in only one language holds in one language. Without it, `wording.en.ts`
// would write « you seem depressed » and this net would stay GREEN.
//
// The word boundaries are not decoration: `\byou\b` lets « young » through (no boundary between
// « you » and « n »), and « youth » stays usable. `your` has its own inflections (`yours`,
// `yourself`, `yourselves`), hence a second alternative rather than a bare `\byour` that would bite
// without naming them. The elisions cover both apostrophes, as on the FR side.
const SECOND_PERSON_EN = /\byou(?:['’](?:re|ve|ll|d))?\b|\byour(?:s|self|selves)?\b/i;

const SECOND_PERSON_GUARDS: readonly [string, RegExp][] = [
  ['FR', SECOND_PERSON_FR],
  ['EN', SECOND_PERSON_EN],
];

// (c) Proxy for « no verdict on the person » (CLAIMS only, since PANO-56) — two forbidden forms,
// approximate by construction (v0):
//   - a direct assertion about the person (« la personne est/semble X »);
//   - a BARE sensitive label with no inference marker nearby — the claim must describe a
//     SIGNAL/a READING, never a state established as fact.
// Widening of the first proxy: cf. the header (a prerequisite to removing `framing`).
// These two fragments carry NO escape sequence: plain literals (the `String.raw` only makes sense
// on the following line, which writes `\b`/`\s`).
// Both lists carry FRENCH AND ENGLISH: an English claim « the user seems anxious » must be caught
// by the same net. Without the EN lexemes, (c) would hold in one language — the same defect (a)
// carried before this batch, and for the same reason.
const PERSON_NOUN = `(?:personne|utilisateur|utilisatrice|individu|auteur|titulaire|abonné|membre|il|elle|user|person|individual|author|member|account|they|he|she)`;
const COPULA = `(?:est|semble|paraît|parait|demeure|reste|serait|apparaît|apparait|a l['’]air|is|are|seems?|appears?|looks?|remains?|sounds?)`;
const PERSON_DIRECT_VERDICT = new RegExp(String.raw`\b${PERSON_NOUN}\s+${COPULA}\b`, 'i');
// BARE sensitive lexemes — FR and EN. `depress` covers depressed/depression; `anxi` covers
// anxious/anxiety. The word boundaries on `gay`/`trans` avoid « gaya », « transfert », « transit ».
const BARE_SENSITIVE_LABEL =
  /(dépress|depress|anxi(eux|été|ous|ety)|homosexuel|bisexuel|lesbienne|lesbian|\bgay\b|\btrans(gender|genre)?\b|extrémiste|extremist|terroriste|terrorist|malade|handicap|disabled|suicidal|addict)/i;
const INFERENCE_MARKER =
  /(déduit|suppos|associable|signal|indice|indirect|lu comme|distingu|attribu|confirm|repér|concentr|expos|inferred|infer|linked|associated|could|possible|potential|reading|marker)/i;

describe('wording — coverage', () => {
  it('the file carries texts (the sweep does not miss the real coverage)', () => {
    expect(RENDERERS.length).toBeGreaterThan(0);
    expect(CLAIMS.length).toBeGreaterThan(0);
  });

  // The sweep rests on a NAMING CONVENTION (`…Claim` ⇒ property (c) applies): a renamed claim would
  // escape the net IN SILENCE. This list is the sentinel — it falls if a claim disappears, is added
  // or is misnamed. To be updated KNOWINGLY, never by reflex.
  it('every expected claim is swept (a naming mistake cannot escape the net)', () => {
    // TEN CLAIMS HAVE DISAPPEARED, and their absence is the subject of batch C: the five sensitive
    // FAN labels no longer have a sentence — the fan carries the meaning, the sentence repeated the
    // card's title. Only the findings WITHOUT a fan remain: `conflictual` (no readings, by doctrine
    // B5, and its sentence carries the criterion « emitted, aimed at someone else ») and the D2
    // interests.
    expect(CLAIMS.map(([n]) => n).sort()).toEqual([
      'd1ConflictualNamedClaim',
      'd2InterestClaim',
      'opacitySemanticWallClaim',
    ]);
  });

  it('renders a non-empty string for every text, in EVERY language', () => {
    for (const locale of LOCALES) {
      for (const [name, render] of RENDERERS) {
        expect(render(locale).length, `${name} (${locale})`).toBeGreaterThan(0);
      }
    }
  });

  // NON-COPY check: at least one claim must DIFFER between the two languages. An English bundle
  // that copied the French would pass everything else in this file — parity proves that an entry
  // exists, never that it is translated. This witness does not prove the translation either; it
  // only catches the crude case where nobody translated anything at all.
  it('the two languages do not render the SAME text (the EN bundle is not a copy)', () => {
    const differs = RENDERERS.filter(([, render]) => render('fr') !== render('en'));
    expect(differs.length, 'no text differs between FR and EN').toBeGreaterThan(0);
  });
});

describe('wording — « a mirror, not an oracle » properties', () => {
  it('(a) no text contains a 2nd-person mark', () => {
    for (const locale of LOCALES) {
      for (const [name, render] of RENDERERS) {
        const text = render(locale);
        for (const [lang, guard] of SECOND_PERSON_GUARDS) {
          const match = text.match(guard);
          expect(
            match,
            `${lang} 2nd person « ${match?.[0]} » in ${name} (${locale}): "${text}"`,
          ).toBeNull();
        }
      }
    }
  });

  // NEGATIVE CONTROLS on guard (a), on the model of (c)'s below. They pin the GUARD, not the
  // wording: they therefore survive any rewriting of the prose, and are — today — the ONLY proof
  // that the English half bites (cf. the border declared at the top of the file).
  it('(a) the EN guard catches English 2nd person, verdict included', () => {
    for (const forbidden of [
      'you seem depressed', // the exact verdict ADR-0003 forbids
      'your anxiety is showing',
      "you're likely struggling",
      'a signal about yourself',
      'this data is yours',
    ]) {
      expect(SECOND_PERSON_EN.test(forbidden), forbidden).toBe(true);
    }
  });

  it('(a) the EN guard does NOT catch words containing « you » that address no one', () => {
    for (const allowed of [
      'signal associated with a young audience',
      'youth culture interest',
      'a guided tour of the data',
      'signal that could be linked to mental health',
    ]) {
      expect(SECOND_PERSON_EN.test(allowed), allowed).toBe(false);
    }
  });
});

describe('wording — « no verdict on the person » property (claims only)', () => {
  it('(c) no claim directly asserts a state of the person', () => {
    for (const locale of LOCALES) {
      for (const [name, render] of CLAIMS) {
        const text = render(locale);
        const match = text.match(PERSON_DIRECT_VERDICT);
        expect(
          match,
          `direct verdict on the person « ${match?.[0]} » in ${name} (${locale}): "${text}"`,
        ).toBeNull();
      }
    }
  });

  it('(c) every sensitive label in a claim comes with an inference marker, never laid down bare', () => {
    for (const locale of LOCALES) {
      for (const [name, render] of CLAIMS) {
        const text = render(locale);
        if (BARE_SENSITIVE_LABEL.test(text)) {
          expect(
            INFERENCE_MARKER.test(text),
            `sensitive label with no inference marker in ${name} (${locale}): "${text}"`,
          ).toBe(true);
        }
      }
    }
  });

  // NEGATIVE CONTROLS on net (c). A property test that rejects nothing is green AND empty: these
  // cases prove that the widening REALLY bites, on the forms that passed v0. They pin the net
  // itself — not the wording — and therefore survive any rewriting of the prose.
  it('(c) the net catches a verdict carried by a subject OTHER than « personne » (v0 hole)', () => {
    for (const forbidden of [
      'utilisateur est passionné de crypto',
      'utilisatrice semble anxieuse',
      'individu est un supporter engagé',
      'il paraît insomniaque',
      'elle a l’air militante',
    ]) {
      expect(PERSON_DIRECT_VERDICT.test(forbidden), forbidden).toBe(true);
    }
  });

  // ⚠ THESE STRINGS ARE FORMS, NOT QUOTATIONS OF THE LIVING WORDING — and two of them are no longer
  // produced by anyone: « Signal indirect associable… » left with the fan claims, and « repéré dans
  // des commentaires » left with the channel (evidence drawn from a SEARCH was announced as a
  // comment). Keeping them is DELIBERATE: these controls pin the NET, not the prose, and a form
  // withdrawn from the product remains a form the net must know not to reject. Do not read them as
  // the current state of the wording — `wording.ts` is its only home.
  it('(c) the net does NOT catch a phrase without a verdict (no false positive on the ratified form)', () => {
    for (const allowed of [
      'Propos agressif adressé à un autre utilisateur, repéré dans des commentaires.',
      'Signal indirect associable à la santé mentale.',
      'Centre d’intérêt déduit de 5 commentaires sur le même thème.',
    ]) {
      expect(PERSON_DIRECT_VERDICT.test(allowed), allowed).toBe(false);
    }
  });
});
