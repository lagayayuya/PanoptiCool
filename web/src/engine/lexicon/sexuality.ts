// `sexuality` lexicon (PANO-72, pass 2) — orientation / gender identity.
//
// ── Genericity justification (PANO-70 §3, §2.5 discipline) ────────────────────────────────────
// Orientation and identity vocabulary of everyday FR, written blind from common usage
// (including the English loanwords LEXICALIZED among francophones: « coming out », « wlw »),
// never from an export. The label detects ALL orientation/identity, symmetrically — lived experience,
// hetero as well as non-hetero (neutrality §4.3 held by SYMMETRY, not by omission).
// BOUNDARIES held:
//   · orientation/identity (the label) ≠ sexually-connoted INSULT targeting a person (→
//     `conflictual`, never here);
//   · identity SLUR (never a self-designation): targeting a person → conflictual; targeting
//     a GROUP in the absolute → future dedicated label, FLAGGED, excluded everywhere for now;
//   · catalogue rule "never name from the indirect": the bare identities live in
//     `indirectCore` (broad tag, « cette actrice est lesbienne » stays indirect); only the
//     self-declaration pattern (« je suis lesbienne ») produces a named tag.
// No general-purpose English loanword (PANO-35 debt, FR-only v1): only the lexicalized one.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// NORMALIZED entries. Threshold 1 (PANO-33 calibration — outing cost): colloquial is DISABLED
// (at threshold 1, a single colloquial hit would tag; we therefore put only clear community signal there,
// all in `indirectCore`). Assumed exclusions (yuya decision): « arc-en-ciel »,
// « entre filles/meufs » EXCLUDED (weather/friendship FP at threshold 1); « yuri/yaoi » EXCLUDED (fiction).

import type { TopicalLexicon } from './types';

export const SEXUALITY_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'sexuality',
  // Readings from registry §5: personal lived experience · ally · curiosity.
  readingTemplateIds: [
    'sensitive.sexuality.reading.lived',
    'sensitive.sexuality.reading.ally',
    'sensitive.sexuality.reading.curiosity',
  ],
  // NON-copular self-reference (phrases) — the named tag goes mostly through `selfDeclared`.
  //
  // BARE « ma transition » WAS REMOVED FROM HERE, and one must say what it did: it set a
  // NAMED finding — the one that outs — on « ma transition vers le management a pris deux ans ». Measured, in
  // delivered French. The possessive had been taken for the BORNE form that disambiguates (ADR-0003,
  // second gate); it is not, because « ma transition professionnelle » is borne
  // exactly the same. What distinguishes a gender transition from a career change is not the
  // possessive, it is the DOMAIN — hence the four qualified forms below.
  //
  // The bare term is not ousted for all that: it now lives in `indirectCore`. DEMOTION, NOT
  // FILTERING — same gesture as the reported question, and for the same reason. Someone who writes
  // « ma transition » with no other word is very probably speaking of their own; removing their finding
  // would be false, and leaving it NAMED outs them on a career sentence. It stays, it no longer
  // asserts.
  explicit: [
    'mon coming out',
    "j'ai fait mon coming out",
    'ma transition de genre',
    'ma transition hormonale',
    'transition de genre',
    'mon parcours de transition',
  ],
  // SELF-DECLARED identities (« je suis lesbienne », « chui non binaire ») → named tag via pattern.
  // Symmetry: « hétéro » included (all orientation exposed, yuya decision).
  selfDeclaredFr: [
    'gay',
    'lesbienne',
    'bi',
    'bisexuel',
    'bisexuelle',
    'homo',
    'homosexuel',
    'homosexuelle',
    'trans',
    // Exact synonym of `trans` for a self-declaration, and it was not there: « je suis
    // transgenre » yielded a BROAD finding where « je suis trans » yielded a NAMED one. The same
    // sentence received two confidences depending on the word chosen, which no doctrine requires.
    'transgenre',
    'queer',
    // bare « pan » discarded (FP survey PANO-72: « je suis un pan de mur ») — pansexuel(le) suffices.
    'pansexuel',
    'pansexuelle',
    'non binaire',
    'enby',
    'asexuel',
    'asexuelle',
    'ace',
    'aro',
    'hetero',
    // ── THE FOUR TERMS OF THE FR SYMMETRY REPAIR (ratified rule) ─────────────────────────────────
    // A self-declaration « je suis hétéro » or « je suis cis » must fire EXACTLY AS MUCH
    // as « je suis gay » or « je suis trans ». The rationale decides the form: a lexicon that
    // catches only MINORITY identities is a minority detector, not an
    // orientation detector — and its demonstration inverts, since it claims to show what a platform
    // infers from everyone while inferring only on some.
    //
    // STATE MEASURED BEFORE THIS BATCH, by a sweep of ~130 terms (the FR counterpart of the copied-frame
    // probe): the minority orientation yielded 16 terms of which 15 at the NAMED finding, the majority
    // yielded `hetero` ALONE — the formal register `heterosexuel` was mute. The gender side was
    // worse: `cis`, `cisgenre` and `cisgender` mute all three, against `trans` / `transgenre` /
    // `non binaire` / `enby` at the named finding. The symmetry was therefore not "one pair in two",
    // it was ONE SPELLING against sixteen.
    //
    // THIS BATCH BUYS NO MEASURED RECALL, and it is the honest result rather than a reservation:
    // added to the five sealed fixtures, the diff is EMPTY — zero new finding, zero lost, zero
    // wrong. Two independent causes, and the corpus already knew the first, written in its
    // own seal: **no one declares their heterosexuality**. The second is that the only item in the
    // corpus that writes a majority self-declaration (« i am straight, for the fortieth time »)
    // is ENGLISH, hence out of reach of the language gate. It enters anyway, for the
    // maintainer's reason: a francophone who writes « je suis cis » receives NOTHING today where
    // « je suis trans » receives a named finding, and this asymmetry is LIVE whether the bench
    // exercises it or not. A non-detection displays nothing.
    //
    // FRENCH SPELLINGS ONLY. `straight`, `heterosexual` and `cisgender` are DISCARDED: putting
    // them here would pre-load the tier for the day an English copula head is wired,
    // i.e. would register a LATENT coverage as if it were live (ADR-0003,
    // *annotate*). `cis` is a homograph of English and is therefore inscribed in the registry of
    // `selfdeclared-language-gate.test.ts`, which holds that it does not NAME in English.
    //
    // WORD BOUNDARY MEASURED, the learned prefix being the obvious risk: `cisaille`,
    // `cistercien`, `cisjordanien`, `cisalpine` and `ciseleur` all stay mute.
    'heterosexuel',
    'heterosexuelle',
    'cis',
    'cisgenre',
    // « en transition » REMOVED FROM HERE, for the reason of `ma transition` above and with one more
    // measurement: « je suis en transition professionnelle » is a perfectly ordinary career-change
    // sentence, and it NAMED. It is even the most exposed member of the family — the copula
    // adds the first person, so the assertion bore on the speaker without detour.
    // Demoted to `indirectCore`, where it continues to count as evidence.
  ],
  // ── THE ENGLISH SYMMETRY REPAIR — both sides, at the tier that does not assert ────────────────
  // EN counterpart of the FR repair above, and the rule is the same: a self-declaration
  // « i am straight » or « i am cisgender » must fire EXACTLY AS MUCH as « i am gay » or
  // « i am a trans woman ».
  //
  // WHAT CHANGES RELATIVE TO FRENCH, AND WHICH IS THE HEART OF THE BATCH: this tier lands as BROAD
  // (`TopicalLexicon.selfDeclaredEn`). English therefore still does not NAME on this label — and it is
  // what makes the admission tenable here, where a copy of the French tier would have named
  // « i am gay », i.e. OUTED on the label whose error cost is the highest in the product.
  // Both sides fire equally, neither gets named.
  //
  // STATE MEASURED BEFORE THIS BATCH (sweep of 127 terms, four frames): the minority side
  // yielded a BROAD finding by homography (`gay`, `lesbian`, `transgender`, `nonbinary`…), the
  // majority side yielded ZERO — `straight`, `heterosexual`, `cis`, `cisgender` mute all
  // four, in all frames. The affiliation debt named this defect; it is here.
  //
  // THE COSTLIEST WRONG OF THE CORPUS IS THE ONE THIS BLOCK TARGETS. `en_misread` writes « i am
  // straight, for the fortieth time » at item #0 and got tagged on its ONLY item #2
  // (« people assume i am gay »): the only identity the product could see in her was
  // the one that is not hers. Her item #0 now counts.
  //
  // DO NOT ENTER, and this is where the probe contradicts intuition:
  //   · BARE `bi`, `ace`, `aro`, `trans`, `pan`, `cis`. THE FRAME DOES NOT SAVE THEM — « im ace at
  //     darts » and « im bi weekly on the newsletter » CARRY the copula. They are exactly the
  //     false positives the language gate measured on these spellings; readmitting them by the
  //     frame would remake by the gate what was closed by the window. Their long forms
  //     (`bisexual`, `asexual`, `aromantic`, `transgender`, `pansexual`, `cisgender`) suffice, and
  //     `a trans woman` / `cis woman` cover the ordinary turn.
  //   · `questioning`, `closeted`, `out`, `pronouns`, `ally` — measured at 8 wrongs on the indirect side, and
  //     the frame changes nothing about their polysemy.
  //   · THE SOCIOLECT REGISTER EN BLOC — unchanged, and its reason does not move an inch.
  //
  // DECLARED RESIDUE, unrepaired, and it does NOT close by covering phrase: « im straight up
  // done with this » → broad finding. I tried (`straight up`, `straight ahead`, `straight
  // home`…) and it does not work, because `isSwallowed` is NOT called on the
  // self-declaration path — the covering phrases protect `hitSurfaces` and not `hitSelfDeclared`.
  // It is a MACHINERY lack, it holds for French too, and it does not get repaired in
  // passing. ASSUMED acceptance, not measured: the instrument that would measure it does not exist.
  selfDeclaredEn: [
    'gay',
    'lesbian',
    'bisexual',
    'pansexual',
    'asexual',
    'aromantic',
    'queer',
    'transgender',
    'transmasc',
    'transfem',
    'nonbinary',
    'non binary',
    'enby',
    'genderfluid',
    'agender',
    'intersex',
    'sapphic',
    'a trans woman',
    'a trans man',
    'a gay man',
    // The majority side, in the SAME batch — never "afterwards".
    'straight',
    'heterosexual',
    'cisgender',
    'cis woman',
    'cis man',
  ],
  // Community interest + bare identities → BROAD tag (never named, B1). Lexicalized loanwords
  // only (wlw). « mlm » discarded (massive « multi-level marketing » polysemy).
  indirectCore: [
    // ── ACCIDENTAL EN COVERAGE, ANNOTATED (ADR-0003, *annotate* — fourth movement) ───────────────
    // These five are IDENTICAL strings in both languages, and they have tagged English
    // FOREVER without any decision having wanted it. The annotation changes NOTHING in the
    // behavior: it makes intentional what was accidental, and prevents a future batch from
    // believing it covers English for the first time. LIVE coverage (it produces findings
    // today), not latent — the distinction decides how it is annotated.
    'lgbt',
    'lgbtq',
    'lgbtqia',
    'queer',
    // `pride` CARRIES A MEASURED WRONG, and the annotation records it rather than silencing it:
    //
    //     « pride and prejudice book review »  →  sexuality[indirect]
    //
    // It is likely the biggest source of English false positives in this lexicon — the ordinary
    // English word for self-esteem, a novel title, a group of lions — and it
    // had NEVER been decided. It is not ousted for all that: it also fires on
    // bearers (the bench's English lived voice writes « we went to pride »), so it is on the
    // "discriminates badly" side of ADR-0003's line and not on the "does not discriminate at all" side.
    // Neither added nor removed: annotated, so it ceases to be invisible.
    'pride',
    'marche des fiertes',
    'fiertes',
    'coming out',
    'gay',
    'lesbienne',
    // MASCULINE ADJECTIVE — « bar lesbien », « couple lesbien », « film lesbien ». It was missing, and the
    // gap was invisible because the feminine, for its part, was admitted: coverage was verified in
    // one direction only. These phrases are the ORDINARY way to name a place or a couple, and without
    // them a whole life described in twenty-four items produced no evidence (measured, registers
    // bench).
    'lesbien',
    'bisexuel',
    'bisexuelle',
    'pansexuel',
    // MISSING FEMININES AND FORMS of the same axis. `homosexuel`/`homosexuelle` were NOWHERE in
    // indirect — only in self-declaration — such that « il est homosexuel » yielded nothing
    // where « il est gay » yielded a broad finding. Two words for one same thing, two
    // behaviors: it is a morphology asymmetry, not a decision.
    'pansexuelle',
    'asexuel',
    'asexuelle',
    'homosexuel',
    'homosexuelle',
    'non binaire',
    'transgenre',
    'transidentite',
    'bisexualite',
    'homosexualite',
    'orientation sexuelle',
    'identite de genre',
    'sapphique',
    'saphique',
    'drag queen',
    'homophobie',
    'homophobe',
    'transphobie',
    'transphobe',
    'sortir du placard',
    'wlw',
    // ── EN VARIANTS (PANO-35) — SUBJECT vocabulary, BROAD finding ────────────────────────────────
    //
    // What this block repairs: the English coverage of this label was NEARLY NULL, and no one
    // had measured it. Nine strings crossed by homography (`pride`, `lgbt`, `queer`, `gay`,
    // `coming out`, `drag queen`, `wlw`…); the ordinary English words of orientation and
    // identity — `lesbian`, `bisexual`, `asexual`, `homosexual`, `transgender`, `nonbinary`,
    // `homophobia`, `transphobia` — yielded NOTHING. Eighteen of the entries below are the
    // STRICT EN counterpart of an already-ratified FR entry: they are not new decisions, they are
    // the same, in the other language, and coverage is verified in both directions.
    //
    // WHAT THIS BLOCK DOES NOT REPAIR, and it is the most important: the defect named by the bench — an
    // anglophone who writes « i am gay » receives a BROAD finding where a francophone receives a
    // NAMED finding — lives at the COPULA, and no term of an indirect tier reaches it. Measured:
    // `en_lived_plain` gains ONE evidence and STAYS `indirect`. The treatment asymmetry between two
    // users of the same product survives this block entirely.
    //
    // THE ZERO WRONGS IS THE PRODUCT OF THE EXCLUSIONS, NOT THE ADMISSIONS. Measured on the six voices:
    // this block costs 0 new wrong, FR does not move. The proof in the negative is what was discarded —
    // `straight` in indirect would take `en_homograph_guard` from 1 wrong to 4 (carpentry, saw,
    // darts), and `pronouns` / `transition` / `ally` / `out` would take it to 8.
    //
    // EXCLUDED IN THE SAME PLACE, each with its reason:
    //   · `straight`, `out`, `came out`, `pronouns`, `ally` — measured above. `straight` has its
    //     home at the copula, where the frame disambiguates it; excluding it here is what makes the
    //     hetero symmetry POSSIBLE later, not what refuses it.
    //   · bare `cis` (learned prefix), bare `gender` (« gender pay gap »), bare `inter`, bare `sex`.
    //   · `rainbow` — counterpart of `arc-en-ciel`, already discarded on the FR side. Readmitting it in English would remake
    //     by the gate what was discarded by the window.
    //   · `mlm` — already discarded on the FR side for « multi-level marketing », and the reason is ENGLISH.
    //   · `top surgery` / `bottom surgery` — `health_physical` boundary not instructed. Named debt.
    //   · THE SOCIOLECT REGISTER EN BLOC (third gate, ADR-0003): the lexical layer that
    //     general English took back from the LGBTQ+ communities is salient and easy to list, and
    //     it is very exactly the addition this label will call for. It does not discriminate — everyone
    //     writes it — and it is a GROUP marker: admitting it would tag people on their
    //     way of speaking, here at threshold 1 and with an outing cost. The second reason suffices.
    'lesbian',
    'bisexual',
    'bisexuality',
    'pansexual',
    'asexual',
    'aromantic',
    'homosexual',
    'homosexuality',
    'transgender',
    'nonbinary',
    'non binary',
    'genderqueer',
    'intersex',
    'sapphic',
    'homophobia',
    'homophobic',
    'transphobia',
    'transphobic',
    'sexual orientation',
    'gender identity',
    'out of the closet',
    // THE ONLY TERM OF THE BATCH THAT BUYS RECALL OUTSIDE SELF-DECLARATION AND OUTSIDE COMMUNITY
    // VOCABULARY, and the reason is an inversion between the two languages worth writing down:
    // French carries the fact in a MORPHOLOGY that no lexicon reads (the reciprocal agreement of
    // « on s'est pacsées » says that both persons are women); English, which has no
    // agreement, can carry it only LEXICALLY — hence the existence of this phrase, which is there the
    // ordinary form and not an administrative term.
    // It discriminates badly and not at all: measured, « my dog and my cat are the same sex »
    // fires. It stays on that basis (ADR-0003, *Admitting is not ousting*).
    'same sex',
    'gender affirming',
    'gender dysphoria',
    'deadname',
    'deadnaming',
    // THE TWO FORMS DEMOTED from `explicit` and `selfDeclaredFr` — see the justification at
    // each of those two tiers. They keep their recall (the bench's non-binary voice loses neither
    // its tier nor its evidence, measured) and lose the right to assert, which is very exactly what
    // ADR-0003 varies when a label is costly: « a more sensitive label does not deserve a
    // narrower lexicon — it deserves to assert less ».
    'ma transition',
    'en transition',
  ],
  // Colloquial DISABLED (threshold 1 + outing cost): no polysemous term admitted on a single hit.
  indirectColloquial: [],
  includeColloquial: false,
  indirectThreshold: 1,
};
