// THE LANGUAGE GATE of `selfDeclaredFr` — the witness (PANO-35).
//
// ── What it holds, and why it exists ──────────────────────────────────────────────────────────────
// `selfDeclaredFr` matches ONLY via the copula heads. As long as the only wired heads are French, an
// entry of ENGLISH spelling present in this tier is unreachable in English. It was true BEFORE this
// batch, and it was true BY ACCIDENT: no one had decided it, nothing wrote it, and nothing would
// have gone red if it had been undone.
//
// Measured (PANO-35, the gate batch): adding ONE single English head suddenly activated the fifteen
// English spellings below, all at a NAMED finding, without any ever having been examined for
// English. Three examples recorded at measurement, and they are not edge cases:
//
//   « im ace at darts »              → sexuality[explicit]   (« ace » = skilled, in everyday English)
//   « im bi weekly on the newsletter » → sexuality[explicit]
//   « im pretty liberal with the garlic » → politics[explicit]
//
// On `sexuality`, a false named finding OUTS someone. It is the highest error cost of the product,
// and it was one line away.
//
// ── HOW IT GOES RED: a BEHAVIOR assertion, not a convention ──────────────────────────────────────
// This witness does not inspect lists, it runs the detector: for each English spelling of the
// registry, and under THREE copula forms, « <copula> <term> » must produce NO named finding. The
// three forms are a mutation result, not a comfort. The property therefore holds whatever the way
// someone would break the gate — adding an EN head to the FR list, wiring EN heads onto
// `selfDeclaredFr`, or moving a term from tier. A documented convention would have covered the first
// case only.
//
// MUTATIONS RUN, and their result RECORDED — not « it would go red », but what it did:
//   1. `'im'` added to `SELF_DECLARATION_HEADS_FR`             → 15 reds (one per spelling)
//   2. `'i am'` added to `SELF_DECLARATION_HEADS_FR`           → 15 reds
//   2b. `"i'm"` added to `SELF_DECLARATION_HEADS_FR`           → 15 reds
//   3. `'gay'` removed from `selfDeclaredFr` (sexuality)       → 1 red (registry not held)
//   4. invented spelling added to the registry, absent from the tier → 1 red (registry not held)
//   5. EN head wired onto `selfDeclaredFr` IN `detect.ts`      → 15 reds
// N°5 is the one that matters: it undoes the gate at the exact place where it is held — the call
// site — without touching any list. A witness that had only inspected lists would have let it
// through. N°3 and 4 hold the REGISTRY itself: without them, it would rot in silence and the green
// above would become vacuous.
//
// N°2 IS A CONFESSION, and it is worth reading. The first version of this file tested only one
// copula form (« im »): mutation 2 then went GREEN while activating the fifteen spellings. The hole
// was invisible, because the tested form, itself, went red correctly. It is the CLAUDE.md motive
// (*What a net proves*) committed inside the net meant to prevent it — and it was found only because
// the mutation was actually run.
//
// ── WHAT THIS WITNESS DOES NOT COVER ─────────────────────────────────────────────────────────────
// - **It does not detect English.** The registry is written by hand. An English spelling added
//   tomorrow to a `selfDeclaredFr` tier WITHOUT being inscribed here will make no one go red. It is
//   the substantive limit of this file, and it is irreducible: no reliable heuristic separates
//   « muslim » from « musulman » without a dictionary. What bounds it in practice is the review —
//   and, for `religion`, the exhaustiveness already held by `religion-symmetry.test.ts`.
// - **`InterestLexicon.selfDeclared` is OUT OF PERIMETER**, and it is not an omission. It too
//   carries English spellings (« cat mom », « cake designer »), it is read by the same heads, and it
//   would activate the same. But a falsely named interest theme outs no one and pathologizes no one:
//   the error cost does not justify extending the gate to forty files, which would have drowned the
//   gate itself. Declared decision, to reopen if D2 becomes sensitive.
// - **It says nothing of the English RECALL.** It verifies that one does not name wrongly; it does
//   not verify that one detects anything in English. Two thirds of the question stay open.
// - **It validates no term for French.** What the registry does is the reverse: it records that
//   these terms are admitted in FR **and not admitted in EN**.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import type { TopicalLexicon } from '../lexicon/types';
import { detectLabels } from './detect';

/**
 * THE REGISTRY — the English spellings admitted for FRENCH, and **not admitted for English**.
 *
 * Explicitly not admitted, and it is the whole point: until now they were *implicitly unreachable*,
 * which has exactly the same appearance and none of the guarantees. Each entry says why it is
 * legitimate in French, and what makes it hazardous in English.
 *
 * An entry here is NOT a proposal for EN admission. The day English is delivered, these terms are
 * re-examined one by one, in `selfDeclaredEn`, against the ADR-0003 admission rule.
 */
const GRAPHIES_ANGLAISES_NON_ADMISES_EN: Readonly<Record<string, string>> = {
  // ── religion ──────────────────────────────────────────────────────────────────────────────────
  muslim:
    "emprunt lexicalisé employé par des francophones (cf. `religion-symmetry.test.ts`). En anglais c'est le mot ordinaire, et « im muslim » y est la forme normale de l'auto-déclaration — donc à examiner comme telle, pas à hériter.",
  muslima: 'même emprunt, forme féminine. Même raisonnement.',
  protestant:
    "graphie IDENTIQUE en anglais et en français. Le terme est aussi un adjectif ordinaire en anglais (« protestant crowd »), là où le français ne l'emploie guère hors du sens religieux.",
  sikh: 'graphie identique dans les deux langues ; admise en FR à la revue de couverture des traditions.',
  // ── sexuality ─────────────────────────────────────────────────────────────────────────────────
  gay: "identique dans les deux langues. En anglais, l'emploi intensificateur (« im so gay for this album ») est courant et n'est PAS une auto-déclaration — mesuré : il produisait un constat nommé.",
  bi: "identique. En anglais, « bi » est aussi le préfixe usuel de la périodicité (« im bi weekly on the newsletter ») — mesuré, constat nommé sur une phrase d'agenda.",
  homo: "identique. En anglais, surtout préfixe savant et registre injurieux — l'auto-déclaration y passe rarement par ce mot.",
  trans:
    'identique. En anglais, préfixe extrêmement productif (« trans european », « trans fat »).',
  queer:
    "identique. En anglais, adjectif ordinaire au sens d'« étrange » dans les registres soutenu et daté.",
  ace: "identique. En anglais courant, « ace » = excellent, doué (« im ace at darts ») — MESURÉ comme le pire faux positif du lot : il désignait quelqu'un comme asexuel sur une phrase de fléchettes.",
  aro: "identique. Chaîne très courte, et l'anglais la porte comme abréviation d'autre chose sans difficulté.",
  enby: "identique (lecture de « NB »). Anglophone d'origine, et c'est justement pourquoi son admission EN doit être décidée, pas héritée.",
  hetero: 'identique. En anglais, employé aussi comme préfixe savant (« hetero atom »).',
  cis: "identique, et admis en FR par la réparation de symétrie (« je suis cis » était muet quand « je suis trans » posait un constat nommé). En anglais c'est la même chaîne, et c'est aussi le préfixe savant de la chimie (« cis isomer », « cis fatty acid ») — la graphie est donc à réexaminer pour l'anglais, jamais à hériter. Son pendant `cisgender`, lui, n'est PAS admis en FR : le mettre au tier reviendrait à pré-charger une couverture latente.",
  // ── politics ──────────────────────────────────────────────────────────────────────────────────
  militant:
    "identique. En anglais, adjectif d'intensité disponible pour n'importe quel sujet (« im a militant about recycling ») — mesuré, constat politique nommé sur une phrase de tri sélectif.",
  liberal:
    "DANGER PARTICULIER, et il ne se règle pas dans ce lot — il se consigne. Le terme est entré au tier de l'identité comme identité de DROITE au sens français (libéralisme économique). En anglais, « liberal » désigne la GAUCHE. La même chaîne désigne donc des camps OPPOSÉS selon la langue. La réparation de symétrie livrée par le lot `politics` — qui tient que les identités de droite et de gauche entrent au même tier — se retournerait silencieusement en anglais : le terme y compterait du mauvais côté. À trancher au moment d'écrire `selfDeclaredEn`, jamais par héritage. (« im pretty liberal with the garlic » est par ailleurs un usage anglais banal, mesuré comme constat nommé.)",
};

/** The wired topical lexicons — the only carriers of `selfDeclaredFr`. */
const TOPICAUX = WIRED_LEXICONS.filter((l): l is TopicalLexicon => l.kind === 'topical');

/**
 * The English copula forms tested — THREE, and the number is a mutation result, not a comfort
 * choice. A first version tried only « im »: the mutation that adds `'i am'` to the French heads
 * then went GREEN, while activating the fifteen spellings. A witness that tests only one form of a
 * construction covers only one, and the gap is invisible because the tested form, itself, goes red.
 *
 * It is NOT a list of candidate heads for batch 2: it is the attack surface this witness sweeps. An
 * EN head of another form (« ive been », « i feel ») would still escape it — limit declared at the
 * head of the file.
 */
const COPULES_EN = ['im', 'i am', "i'm"] as const;

describe('language gate — no English spelling NAMES via the copula', () => {
  for (const [terme, pourquoi] of Object.entries(GRAPHIES_ANGLAISES_NON_ADMISES_EN)) {
    it(`« <copule> ${terme} » poses NO named finding, under the three forms`, () => {
      // The assertion bears on the STOREY and not on the absence of a tag: several of these terms
      // ALSO live in an indirect tier, where they legitimately pose a broad finding. What the gate
      // forbids is NAMING.
      const nommes = COPULES_EN.flatMap((copule) =>
        detectLabels([`${copule} ${terme}`], WIRED_LEXICONS)
          .filter((d) => d.stage === 'explicit')
          .map((d) => `${copule} ${terme} → ${d.label}`),
      );
      expect(nommes, `${terme} — ${pourquoi}`).toEqual([]);
    });
  }
});

/**
 * THE ENGLISH SELF-DECLARATION FRAMES — the attack surface of the block below.
 *
 * These are not terms, they are whole SENTENCES, as an anglophone writes them. It is what makes the
 * block indifferent to the TIER: no matter where the named finding would come from, it would come on
 * one of these sentences.
 *
 * THE THREE COPULA FORMS ARE IN IT, and the number is a mutation result, not a comfort — the SAME
 * lesson as the one confessed above for `COPULES_EN`, and I first re-committed it. The first version
 * of this list wrote only « i am … ». The mutation that adds `'im'` to the French heads then left it
 * entirely GREEN, while activating the fifteen spellings — only the block above went red. The hole
 * was invisible for the usual reason: the form I had written, itself, went red under `'i am'`.
 *
 * That it was re-committed IN the file that documents it is worth writing. A lesson read is not a
 * lesson applied; only the mutation actually run makes the difference.
 */
const CADRES_EN = [
  // — full form
  'i am gay',
  'i am a lesbian',
  'i am bisexual',
  'i am trans',
  'i am a trans woman',
  'i am transgender',
  'i am non binary',
  'i am queer',
  'i am asexual',
  'i am straight',
  // — CONTRACTED forms, both spellings (`normalize-fr` keeps the apostrophe, and internet usage
  //   writes it just as much without). Their absence is the hole confessed above.
  'im gay',
  "i'm a lesbian",
  'im bi',
  "i'm trans",
  'im enby',
  "i'm asexual",
  // — NON-copular routes: the ones the `explicit` tier would take, and that the block above does not
  //   look at at all.
  'i came out as gay',
  'i came out to my dad last year',
  'my coming out was a non event',
  'my transition started two years ago',
  'i have been out since i was nineteen',
  'i identify as queer',
] as const;

describe('language gate — NO route NAMES in English, whatever the TIER', () => {
  // ── WHY THIS BLOCK EXISTS: the gate declared four boundaries and was missing one ──────────────────
  // The block above guards `selfDeclaredFr`, and it guards it well. But `selfDeclaredFr` is NOT the
  // only route to the named finding: the `explicit` tier NAMES too, and it needs NO copula head to
  // do it — that is how « mon coming out » produces a named finding today. An English locution
  // dropped into `explicit` would therefore name immediately, and the block above would have stayed
  // GREEN.
  //
  // At the time this block is written, the route is LATENT and not alive (ADR-0003, *annotate*): no
  // English string lives in an `explicit` tier of `sexuality`. It is a DEBT, not a state — and it
  // would fall due at the first batch tempted to bypass the copula block by that side, that is at
  // the precise moment when no one re-reads the gate anymore.
  //
  // ── WHAT MAKES IT DIFFERENT FROM THE BLOCK ABOVE, and it is the point ─────────────────────────────
  // The block above iterates on a REGISTRY of terms: it sees only what the registry contains, its
  // substantive limit declared at the head of the file. This one iterates on SENTENCES and
  // interrogates only the STOREY produced — indifferent to the tier, the term and the mechanism. A
  // new locution dropped tomorrow into `explicit`, a moved term, a head wired at the call site: the
  // three make it go red without it having to know any of the three.
  //
  // ── MUTATIONS ACTUALLY RUN, and their result RECORDED ─────────────────────────────────────────────
  // Not « it would go red » — what each one DID, count of the whole file (15 tests at the block
  // above, 3 here), on this block in its final state. Baseline: 0 red.
  //   1. `'my coming out'` added to `SEXUALITY_LEXICON.explicit`    → 1 red, HERE (1st test)
  //   2. `'i came out as'` added to `SEXUALITY_LEXICON.explicit`    → 1 red, HERE (1st test)
  //   3. `'im'` added to `SELF_DECLARATION_HEADS_FR`                → 16 (15 + the 1st here)
  //   3b. `'i am'` added to `SELF_DECLARATION_HEADS_FR`             → 16 (idem)
  //   4. `'lesbian'` moved from `indirectCore` to `selfDeclaredFr`  → **0 red. NOT CAUGHT.**
  //   5. the anti-vacuity emptied of its frames                     → 0 red: the block would go
  //      green while measuring nothing anymore, and it is why it loops on a literal list
  //
  // N°1 AND 2 ARE THE RAISON D'ÊTRE OF THE BLOCK: they open the `explicit` route without touching any
  // head, and the block above stays GREEN under both. It is exactly the hole that had to be closed,
  // and it is closed.
  //
  // N°3 IS A CONFESSION, AND IT IS THE SECOND OF THIS FILE. As long as my frames wrote only
  // « i am … », mutation 3 left this block entirely green while activating the fifteen spellings —
  // only the block above went red. I had read, ten lines higher, the identical confession of the
  // previous batch, and I re-committed it. The contracted forms were added afterward, and the
  // mutation re-run: 16.
  //
  // N°4 IS NOT CAUGHT, AND IT IS A REAL LIMIT — do not read it as a success. Moving `lesbian` to
  // `selfDeclaredFr` makes NO ONE go red: neither here (without an English head the term becomes
  // unreachable, so nothing names — the green is correct on the substance) nor at the block above
  // (its anti-rot control covers only the spellings of the REGISTRY, and `lesbian` is not in it). The
  // move is nonetheless a real regression: it removes an English BROAD finding without posing
  // anything in its place. No witness of this file sees it. What would see it is the register bench,
  // which counts the evidence of `en_lived_plain` — and it is there that it is held, not here.
  //
  // ── WHAT THIS BLOCK DOES NOT COVER ────────────────────────────────────────────────────────────────
  // - **It interrogates only the `sexuality` label.** Deliberate: other labels have good reasons to
  //   name in English from `explicit` — a named medical condition is not an identity
  //   self-declaration. Extending it to the six would require settling label by label who has the
  //   right to name: a decision, not a witness.
  // - **The frames are written by hand**, with the irreducible limit of the registry above: a
  //   construction I did not think to write is not covered. « ive always been », « turns out im »
  //   escape it.
  // - **It says nothing of the named RECALL.** It verifies that one does not name; that English MUST
  //   one day name is the question of the copula batch, and this block will then have to be reopened,
  //   not bypassed.

  it('no English frame produces a NAMED `sexuality` finding', () => {
    const nommés = CADRES_EN.filter((cadre) =>
      detectLabels([cadre], WIRED_LEXICONS).some(
        (d) => d.label === 'sexuality' && d.stage === 'explicit',
      ),
    );
    expect(nommés).toEqual([]);
  });

  it('ANTI-VACUITY — the same frames in FRENCH do name', () => {
    // Without it, the green above would be indistinguishable from a broken detector, an emptied
    // lexicon or an unplugged label. It is the C0 lesson of the copula measurement criteria: an
    // instrument that cannot reach what it measures returns a zero, and that zero looks exactly like
    // a success.
    for (const cadre of ['je suis lesbienne', 'je suis une femme trans', 'mon coming out']) {
      const nommé = detectLabels([cadre], WIRED_LEXICONS).some(
        (d) => d.label === 'sexuality' && d.stage === 'explicit',
      );
      expect(nommé, `« ${cadre} » devrait NOMMER en français`).toBe(true);
    }
  });

  it('and the English BROAD finding, itself, EXISTS — the gate does not close the recall', () => {
    // The gate forbids NAMING; it does not forbid detecting. If this count fell to zero, the gate
    // would have stopped being a gate to become a wall, and the green of the first test would measure
    // that wall instead of measuring the gate.
    const larges = CADRES_EN.filter((cadre) =>
      detectLabels([cadre], WIRED_LEXICONS).some(
        (d) => d.label === 'sexuality' && d.stage === 'indirect',
      ),
    );
    expect(larges.length).toBeGreaterThanOrEqual(10);
  });
});

describe('language gate — the registry does not rot', () => {
  it('each registry spelling is indeed PRESENT in a `selfDeclaredFr` tier', () => {
    // Without this assertion, a term removed from a lexicon would leave an orphan entry in the
    // registry, and the green of the previous block would become vacuous — it would test the absence
    // of what no longer exists. It is the motive « a negative assertion verifies what it REACHES »
    // (CLAUDE.md): here, what it reaches is verified separately.
    const admisFr = new Set(TOPICAUX.flatMap((l) => l.selfDeclaredFr ?? []));
    const orphelines = Object.keys(GRAPHIES_ANGLAISES_NON_ADMISES_EN).filter(
      (t) => !admisFr.has(t),
    );
    expect(orphelines).toEqual([]);
  });

  it('each registry spelling carries a non-empty REASON', () => {
    // A gate whose motives empty is a list of prohibitions without memory: the next reader would no
    // longer know whether the term is dangerous or only old.
    const sansRaison = Object.entries(GRAPHIES_ANGLAISES_NON_ADMISES_EN)
      .filter(([, why]) => why.trim().length < 40)
      .map(([t]) => t);
    expect(sansRaison).toEqual([]);
  });
});
