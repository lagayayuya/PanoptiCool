// GENERIC EN lists of the contextual filters (PANO-35, batch 1) — EXACT counterpart of `filters-fr.ts`.
// Same natures, same role: these are cross-cutting DATA of the machinery, not label
// lexicon. Negation, reported speech and the 3rd person are everyday English, identical
// whatever the subject detected.
//
// ── Genericity justification (PANO-70 §3, §2.5 discipline) ─────────────────────────────────
// Each list comes from the grammar / everyday usage of EN (canonical negations and their
// contractions, speech verbs of reported speech, usual designations of relatives), written
// blind from common usage. No term is drawn from or inspired by a real person's
// export.
//
// ── WHY THIS BATCH EXISTS, AND WHY IT COMES FIRST ───────────────────────────────────
// Measured (`docs/portabilite-en-filtres.md`): on EN text, the FR filters match nothing.
// The three PROTECTIVE filters therefore failed OPEN — « i am NOT in depression », « SHE TOLD ME
// her depression is hard » and « MY SISTER has depression » all three produced a NAMED
// `mental_health` tag on the speaker (violating SENS-B3 and SENS-C1/C2), by mere FR/EN HOMOGRAPHY
// (« depression », « burnout », « diabetes » via the plural `s?`) — without any EN marker ever
// having been added to the sensitive lexicons. This batch closes that door.
//
// ── DIRECTION OF FAILURE: this is what makes this batch SAFE to ship alone ──────────────────────────
// The three lists below can only SUPPRESS a hit (negation, citation) or DEGRADE it
// to indirect (3rd person). They therefore fail CLOSED: applied wrongly (an EN word present in
// an FR text), they cost RECALL, never precision on the sensitive. That is why
// they are applied to ALL items without language detection — over-filtering is the
// safe direction, and it avoids introducing a language classifier (which, in turn, would have its own
// false positives). The FR behavior is locked by its goldens, unchanged.
//
// ── EN SELF-DECLARATION IS SHIPPED (the belonging-adjectives batch) ───────────────────────
// `SELF_DECLARATION_HEADS_EN` now exists, paired with `TopicalLexicon.selfDeclaredEn`, and this
// tier LANDS BROAD — it NEVER names. The full justification lives on the two
// declarations (heads here, tier in `lexicon/types.ts`).
//
// ── WHAT UNBLOCKED BATCH 2, AND IT WAS NOT THE INSTRUMENT IT DEMANDED ────────────────
// This file long held that the blocker was the BLINDNESS of the EN bench: it could not
// measure the copula, the fixture having avoided the frozen exclusions that are precisely the
// candidate terms. The diagnosis was right about the bench, and FALSE about what to conclude from it —
// the criteria note of the time (ex-`docs/criteres-mesure-copule-en.md`, since removed)
// specified two more voices to measure an anchoring that DOES NOT EXIST.
//
// What was missing was not a bench able to measure the copula: it was to know that **the
// copula anchors nothing in English**. The measurement is written on `SELF_DECLARATION_HEADS_EN`, with its
// sentences. Once the frame was relieved of all safety, the batch ships without the two demanded
// voices — because what protects is no longer the frame but the STOREY, and a tier that never
// asserts has no over-assertion rate to measure.
//
// Still true, and not to be misread: the EN bench still does not measure the recall of this
// path. What measures it is the `en_identity` bench (`en-identity-bench.test.ts`), whose voices
// carry belonging in the clear.
//
// ── CORRECTION OF A CLAIM IN THIS FILE, which was FALSE ─────────────────────────────────────
// An earlier version claimed here that there is « pas de moitié sûre à livrer », on the grounds that the
// diagnostic passive would only open the same polysemous state labels as the bare copula.
// **This was true of `mental_health` alone, and false of the batch.** The reasoning bore on one lexicon
// and was generalized to the six without being rechecked.
//
// Measured since: the EN heads, by themselves and WITHOUT any term added, activate FIFTEEN English
// spellings already present in the self-declaration tiers of `religion`, `sexuality` and
// `politics` — « im ace at darts » placed a `sexuality[explicit]` finding. The payload of an
// EN head is therefore not a handful of state labels: it is a whole tier of identity terms
// that no one has ever examined for English.
//
// Hence the LANGUAGE GATE, shipped separately: `selfDeclaredFr` is paired with these heads, and an
// English head will have to be born with its own `selfDeclaredEn`. Witness:
// `selfdeclared-language-gate.test.ts`. As long as the gate holds, this file can receive EN
// heads without activating anything by accident — but it still receives none, for want of the
// measurement described above.
//
// ── WHEN THE EN MODIFIERS ARRIVE: they are chosen on GRAMMAR ────────────────
// Written here because it is the plausible-but-wrong idea that will re-propose itself, and it has been examined
// then SET ASIDE (arbitration 2026-07-18). Omitting « so » and « literally » from the list of
// modifiers to set aside hyperbole filters nothing: it blocks « im so depressed » while letting
// bare « im depressed » through — the reverse of the intended effect, and not defensible in the other direction
// either. It is the THRESHOLD error in a new suit: tuning the machinery to make it carry
// a safety it does not carry (ADR-0003, *La porte, pas le seuil*).
// The EN modifiers will therefore be chosen on grammar and recall, and they carry NO
// safety load. That lives at the term-admission gate, and nowhere else.
//
// All entries are already in NORMALIZED form (lowercase, no accents; straight apostrophe —
// `normalize-fr` unifies `’` → `'`, and the hyphen counts as space).

/**
 * EN COPULA HEADS — paired with `TopicalLexicon.selfDeclaredEn`, and it alone.
 *
 * ══ THE COPULA DOES NOT DISAMBIGUATE IN ENGLISH ═════════════════════════════════════════════════════
 * This is the central result of the batch, it contradicts the premise on which PANO-35 batch 2 was closed
 * TWICE, and it must be read before any proposal that touches these heads.
 *
 * The copula doctrine is written in French, in `selfDeclaredFr`: « la copule ancre la
 * 1ʳᵉ personne », so a term too ambiguous bare (« dépressif », « lesbienne ») becomes reliable once
 * framed. **This judgment DOES NOT CARRY OVER.** Everyday English writes its hyperbole and its figure in
 * the first person, in exactly the same frame. Measured, and these are not edge cases:
 *
 *     « im so ocd about my desk drawers »          « im autistic about train timetables »
 *     « im arthritic after that hike »             « im depressed that the bakery closed early »
 *     « im dyslexic when it comes to left and right »   « im an insomniac when there is a new season »
 *
 * The frame is there, whole, in each. A mechanism that relies on it to separate the confession from the
 * figure separates nothing.
 *
 * *What this invalidates, and it is better to write it than to let it re-derive itself:* the two
 * closures of PANO-35 batch 2 looked for what was missing on the side of the HEADS and the MEASUREMENT, on the
 * premise that the frame, once shipped, would anchor. It does not anchor. What was missing was not a
 * bench able to measure the copula: it was to know that the copula is not a filter.
 *
 * **RULE, and it is cited to refuse:** no SAFETY load is placed on the frame. Neither on
 * the heads, nor on the modifiers (arbitration 2026-07-18, already written higher in this file and
 * now measured rather than reasoned). What the frame buys is RECALL, and nothing else: it
 * makes `straight` admissible where the BARE term in `indirectCore` was measured at 1 → 4 wrongs. The
 * safety lives at the term-admission gate and at the STOREY — `selfDeclaredEn` never asserts.
 *
 * ── WHAT THIS LIST DOES NOT COVER ────────────────────────────────────────────────────────────
 * Non-copular heads (« ive always been », « i grew up », « turns out im ») escape it —
 * the same declared limit as the register of the language gate. `i was raised` is admitted because
 * it is the most ordinary religious-belonging turn of phrase in English (« i was raised
 * catholic ») and it has no lexical equivalent elsewhere.
 */
export const SELF_DECLARATION_HEADS_EN: readonly string[] = [
  'i am',
  'im',
  "i'm", // both spellings: `normalize-fr` keeps the apostrophe, internet usage omits it
  'i identify as',
  'i was raised',
];

/**
 * EN modifiers between the copula and the term — GRAMMAR, no safety load (rule
 * above). They make « i am a lesbian » and « i am a trans woman » reachable.
 *
 * They are COMPOSED with the FR modifiers in `filters.ts`, and not paired by language as the
 * heads are. This is not a loosening of the gate: a modifier can reach no
 * term without a HEAD of its own language, and the (heads, terms) pair stays paired at the call
 * site. Measured: the composition moves no counter of the French benches.
 */
export const SELF_DECLARATION_MODIFIERS_EN: readonly string[] = [
  'a',
  'an',
  'the',
  'so',
  'very',
  'pretty',
  'quite',
  'proudly',
  'openly',
  'also',
  'still',
  // Added DELIBERATELY by the EN `politics` batch, to burst a green we knew was false. The
  // reasoning and its measurement are below — do not remove it without reading them.
  'extremely',
];

// ── `extremely`, AND THE GREEN IT BURST — the measurement, not the intention ─────────────────────────
// The EN `politics` batch found that the two sealed English guard voices owed their zero
// of false positives only to the INCOMPLETENESS of two lists — this one and `SELF_DECLARATION_HEADS_EN` —
// which this file declares in so many words to carry NO safety load and will be
// extended on grammar and recall. `en_ironic` writes « i am EXTREMELY radical about bin
// collection day »: measured, « i am radical », « i am very radical », « i am pretty radical »
// would all tag, and only the voice author's choice of the word `extremely` protected it.
//
// **A FICTITIOUS false-positive floor is worse than a measured wrong**: it is cited as a safety,
// and it falls the day an unrelated batch adds a modifier for recall — that is, at the
// precise moment when no one rereads this anymore. The word is therefore added HERE, in the open.
//
// WHAT THE MEASUREMENT RETURNED, and it is NOT what the batch expected: **zero wrongs**, on the two
// guards, item by item. The announced wrong does not exist, and one must say by what PATH this zero
// arrives, without which it would be worth the green we just burst:
//   · `radical` — the term that would have tagged — is EXCLUDED from the lexicon by decision (adjective of
//     general use, ADR-0003 admission rule). **It is the admission gate that protects, not the
//     modifier** — and that is the result we wanted to establish;
//   · anti-vacuity: `extremely` is not inert for all that — « i am extremely socialist » ×2
//     does place a broad finding, where it placed none before.
//
// ── THE DEBT THAT REMAINS, and it is WORSE than the one we just settled ───────────────────────
// The second list was NOT touched, and the hole is alive there. `en_ironic` writes « I HAVE DECIDED
// TO BECOME a centrist » — and `centrist` IS admitted in the lexicon. PAST MUTATION, result recorded:
// adding `'i have decided to become'` to the heads above makes this item tag, on a sealed
// NON-BEARING voice. Any acquisition head (« i became », « ive become », « i turned »)
// would produce the same effect, and each is a perfectly legitimate recall addition.
//
// **AND THE BENCH WOULD NOT SEE IT.** Also measured, and this is the hardest point: with the head
// added and the wrong present, the WHOLE SUITE stays green. `en_ironic` carries only ONE triggering
// item, `politics` is at threshold 2, so the whole voice returns `NOTHING` and the bench — which measures the
// voice, not the item — does not go red. A wrong on one item is INVISIBLE to this instrument; it would
// take two.
//
// What would see this wrong is an ITEM-BY-ITEM assertion on the guards, which does not exist. As long
// as it is missing, the false-positive floor of the English voices is an ASSUMED ACCEPTANCE — the
// word is *assumed*, never *measured*, and the shift to *measured* would be a dated event.

/** EN negation words (window BEFORE the marker — cf. `NEGATION_WINDOW`, shared with FR). */
export const NEGATIONS_EN: readonly string[] = [
  'not',
  'never',
  'no',
  'none',
  'nothing',
  'nobody',
  'nowhere',
  'without',
  'nor',
  'neither',
  'cannot',
  // Contractions — BOTH spellings: `normalize-fr` keeps the apostrophe (« don't »), but
  // internet usage writes just as much without (« dont »). The comparison is a token equality.
  "don't",
  'dont',
  "doesn't",
  'doesnt',
  "didn't",
  'didnt',
  "isn't",
  'isnt',
  "wasn't",
  'wasnt',
  "aren't",
  'arent',
  "weren't",
  'werent',
  "won't",
  'wont',
  "can't",
  'cant',
  "couldn't",
  'couldnt',
  "shouldn't",
  'shouldnt',
  "wouldn't",
  'wouldnt',
  "haven't",
  'havent',
  "hasn't",
  'hasnt',
  "hadn't",
  'hadnt',
  "ain't",
  'aint',
];

/**
 * EN OMISSION verbs: omission + negation = double negation that AFFIRMS the object (« i never miss
 * mass » = diligent practice). Counterpart of `OMISSION_VERBS` (« je rate jamais la priere », measured
 * PANO-33).
 *
 * The ONLY list of this module that fails OPEN (it CANCELS a negation). Kept deliberately SHORT
 * and without FR ambiguity: the only FR homograph is « miss » (pageant title), whose
 * co-occurrence with a negation AND a sensitive marker in the same window is inert.
 */
export const OMISSION_VERBS_EN: readonly string[] = [
  'miss',
  'misses',
  'missed',
  'skip',
  'skips',
  'skipped',
];

/**
 * EN reported speech — forms WITH a speech verb only. Same trap as FR (measured
 * PANO-33): the MEDICAL PASSIVE is NOT a citation — « i was told i have… » / « i was diagnosed »
 * report a received diagnosis, not a third party's words about a third party. Hence the deliberate absence
 * of bare « was told » and « told me i ».
 */
export const CITATION_MARKERS_EN: readonly string[] = [
  'told me',
  'called me',
  'said that',
  'according to',
  'apparently',
  'they say',
  'people say',
  'he said',
  'she said',
  'they said',
];

/**
 * EN 3rd-person markers — the « for whom » axis (ADR-0003): the signal exists but concerns
 * a relative → DEGRADED to indirect (signal-without-lived-experience path), NEVER suppressed.
 *
 * ── WHAT THIS LIST COVERS, AND WHAT IT LONG MISSED ──────────────────────────────────
 * Shipped in batch 1 on the AMERICAN nuclear family, and the blind spot was not
 * grandparents alone: « my mum » — the most common British form for mother — was not
 * covered either, nor any extended kinship. Measured: « my nan has diabetes » placed a
 * NAMED finding on the speaker.
 *
 * The gap was not visible on `mental_health`, and one must say why, otherwise it will
 * recur: its most frequent disorder names live in the `indirectSolo` tier and can
 * STRUCTURALLY no longer name. « my nan has depression » already degraded — but thanks to the tier, not
 * thanks to this list. The defect appeared on the first label whose condition names
 * stayed in `explicit`.
 *
 * Extended kinship is not an ornament on a physical-health label: diabetes, stroke,
 * cancer are what one talks about regarding a grandparent.
 *
 * NOTE (ex-FR gap): this list long held that FR was missing « ma mere » / « mon pere ».
 * That is RESOLVED — `filters-fr.ts` now carries parents, grandparents, uncles and cousins, and
 * FR no longer presents this gap (verified rather than supposed: « le diabete de ma mamie » degrades).
 *
 * EXCLUDED BY DESIGN: animals (« my dog has diabetes » is a massive, real search). The
 * degradation would go in the safe direction, but an animal is not a 3rd person — the « for
 * whom » axis assumes a « who ». Bringing them in here would change the meaning of the list without saying so; if they
 * must be covered, it is by a decision of its own.
 */
export const THIRD_PERSON_EN: readonly string[] = [
  'my sister',
  'my brother',
  'my son',
  'my daughter',
  'my kid',
  'my child',
  'my teen',
  'my teenager',
  'my mom',
  'my mum', // (BrE) — absent from batch 1, and it is the most common form outside North America
  'my mother',
  'my dad',
  'my father',
  'my parents',
  'my friend',
  'my best friend',
  'my partner',
  'my boyfriend',
  'my girlfriend',
  'my wife',
  'my husband',
  'my roommate',
  'my coworker',
  'a friend of mine',
  // EXTENDED kinship — counterpart of the FR list (« ma mamie », « mon papy », « mon oncle »,
  // « ma tante », « mon cousin »), which has carried it since its own fill.
  'my grandma',
  'my grandmother',
  'my grandpa',
  'my grandfather',
  'my grandparents',
  'my nan', // (BrE) — « my grandmother » does not catch it, the word boundary separates them
  'my nana',
  'my gran',
  'my granny',
  'my grandad',
  'my granddad',
  'my uncle',
  'my aunt',
  'my auntie',
  'my cousin',
  'my nephew',
  'my niece',
  'my in laws', // the hyphen counts as space (normalize-fr): covers « my in-laws »
  'for my',
  'helping my',
  'help my',
  'support my',
  'supporting a',
];

/**
 * INFORMATIONAL REGISTER (EN) — documentary-framing markers.
 *
 * Same role and same admission criterion as the FR list (`filters-fr.ts` carries the full
 * justification): lower the storey of a finding, never suppress it. A marker enters if it signals that
 * the item **questions, defines or quantifies** a condition.
 *
 * `symptoms of` rather than bare `symptoms`, unlike FR: English builds « my symptoms »
 * far more readily than French builds « mes symptômes », and degrading the one who describes
 * THEIR symptoms is exactly what this rule must not do. French pays the reverse —
 * « symptomes depression ado » has no preposition to hang onto.
 */
export const INFORMATIONAL_EN: readonly string[] = [
  // Question.
  'signs of',
  'sign of',
  'symptoms of',
  'symptom of',
  'causes of',
  'what is',
  'what are',
  'what causes',
  'is it normal',
  'how to spot',
  'how to recognize',
  'how to recognise',
  'how to tell if',
  'how to help',
  'how to support',
  // Solicit ANOTHER'S experience (see `filters-fr.ts` for the category justification).
  'testimonial',
  'experiences with',
  'anyone else',
  'has anyone',
  'what is it like',
  'reviews of',
  // Define.
  'difference between',
  'definition of',
  'meaning of',
  'types of',
  'explained',
  // Quantify.
  'prevalence of',
  'rates of',
  'statistics',
  'meta analysis',
  'systematic review',
  'evidence base',
];

/**
 * COVERING PHRASES (EN) — a marker STRICTLY contained in one of them does not count.
 *
 * ── The measured defect, and why it is not the one we had written ───────────────────────────
 * The `therapy` term of `mental_health` carries a caveat documented since the pilot batch. It
 * targets the FIGURATIVE use (« retail therapy », « music is my therapy ») and relies on the threshold of 2,
 * justified as a POLYSEMY filter.
 *
 * The first pass of the body bench found something else. The carer of a person who had a stroke
 * writes « occupational therapy home assessment » and « aphasia speech therapy waiting list »: the
 * mother's body, read as the daughter's MENTAL health — wrong person AND wrong subject. This
 * is not figurative use, it is perfectly literal clinical vocabulary belonging to
 * ANOTHER medical domain. And on this register the threshold decides nothing: a stroke carer writes
 * « therapy » several times out of necessity, so the repetition ACCUMULATES instead of filtering — the
 * reasoning of ADR-0003 on hyperbole, in a case no one had filed there.
 * The caveat therefore did not give way: it HID a second flaw.
 *
 * ── Why this form, and not a removal ──────────────────────────────────────────────────────
 * `therapy` is a SHIPPED term: it is not removed by doctrine (ADR-0003, *Admettre n'est pas
 * évincer*), and it carries real recall — the distress voice of the EN bench triggers it. The
 * right move is not to remove signal from it, it is to let the neighboring domain CLAIM its own:
 * `health_physical` now carries the rehabilitation phrases, and the covering phrase prevents
 * the short marker from reading them in passing.
 *
 * The rule is therefore « the longest wins », and the containment is STRICT: a phrase does not block
 * itself. `occupational therapy` matches for `health_physical`; it is `therapy` alone, on the
 * inside, that falls.
 *
 * ── What this list is NOT ─────────────────────────────────────────────────────────────────
 * Not a lexicon-exclusion list — those are written by not admitting the term. It
 * exists only for the cases where a SHORT, legitimate marker is swallowed by a phrase that means
 * something else. Each entry must name the marker it protects, otherwise it runs
 * for no one.
 */
export const COVERING_PHRASES_EN: readonly string[] = [
  // Protect `therapy` (`mental_health`) — PHYSICAL rehabilitations, claimed by `health_physical`.
  'occupational therapy',
  'speech therapy',
  'speech and language therapy',
  'physical therapy',
  // Protect `therapy` too — but here nothing claims, and it is intended: the use is FIGURATIVE. These
  // are the two turns of phrase the written caveat of the pilot batch named without being able to set them aside.
  'retail therapy',
  'music is my therapy',
  // ── Set aside `woke` (`politics`) used as the PAST OF *WAKE* ─────────────────────────────────
  // `woke` is an FR entry that carries over (the political term is written identically in both
  // languages) and matches the most ordinary English: measured, four items « i woke up… » place
  // a `politics[indirect]` finding.
  //
  // It is NOT EVICTED: it also fires on bearers (« the woke crowd »), and ADR-0003
  // (*Le faux positif n'est PAS un motif de retrait*) only removes the term that does NOT discriminate
  // AT ALL. The line runs between « discriminates badly » and « does not discriminate », and `woke` is on the
  // first side.
  //
  // The eight frames below are all on the COMPLEMENT side (verb + particle / object /
  // preposition), never the subject side. That is what makes them tenable: covering the subject frames
  // would require enumerating the English pronouns, which is grammar disguised as a list — and
  // the political use is attributive or predicative (« the woke X », « is woke »), so it never follows
  // one of these eight words.
  //
  // DECLARED RESIDUE, and it is measured rather than supposed: what still tags is `woke` followed
  // by a word OUTSIDE this list — a conjunction, an adverb, an unlisted preposition. Measured:
  // « i woke and it was already dark », « she woke suddenly », « he woke before the alarm »,
  // « i woke because of the storm » all still place a finding. The eight frames take the
  // volume (the particle `up` and the pronominal objects), not the distribution tail — and
  // lengthening it word by word would be rewriting English grammar into a list of phrases.
  'woke up',
  'woke me',
  'woke him',
  'woke her',
  'woke us',
  'woke them',
  'woke at',
  'woke to',
];

/**
 * INFORMATIONAL REGISTER (EN) — COMPOUND heads, which count only AFTER a lexicon term.
 *
 * ── The defect this list closes ────────────────────────────────────────────────────────────
 * The list above is anchored on PREPOSITIONS (« symptoms of », « signs of »). Yet English
 * builds its most frequent health query as a PREPOSED noun-noun compound. Measured:
 *
 *     « symptoms of diabetes » → broad finding        « diabetes symptoms » → NAMED finding
 *
 * The storey rule was therefore absent exactly where English puts its traffic. This is not specific
 * to one label: « burnout symptoms » named too. French does NOT present this defect (verified) —
 * it carries BARE « symptomes », and its two word orders already degrade. Hence an EN-only list.
 *
 * ── Why a SEPARATE list, and not bare « symptoms » in the list above ────────────────────
 * Because the list above set aside bare « symptoms » DELIBERATELY, and the reason still
 * holds: English builds « my symptoms » very readily, and degrading the one who describes THEIR
 * symptoms is precisely what this rule must never do. The anchoring on the term is what
 * separates the two cases — « diabetes symptoms » questions a condition, « my symptoms have been
 * worse » describes one's own. Reopening the decision above would have swapped one defect for the other.
 *
 * ── Admission criterion — the same as the list above, and it excludes more than one thinks ────────
 * A head enters if the compound QUESTIONS, DEFINES or QUANTIFIES. Thus EXCLUDED, and it is measured
 * rather than supposed: `treatment`, `cure`, `diet`, `medication`. « diabetes treatment » does not
 * document, it seeks CARE — and seeking care for oneself is a signal of lived experience, not its
 * opposite (ADR-0003, *« Pour qui », pas « quel mot »*). French treats « traitement du
 * diabete » as NAMED for the same reason, in both word orders: this is not a gap
 * between languages to catch up, it is the rule refusing to extend where it has no business.
 *
 * The heads already covered BARE by the list above (« explained », « statistics ») are not
 * repeated here: « diabetes explained » already degrades.
 */
export const INFORMATIONAL_SUFFIXES_EN: readonly string[] = [
  // Question.
  'symptoms',
  'symptom',
  'signs',
  'sign',
  'causes',
  'cause',
  'risk factors',
  // Quantify — the preposed forms of « prevalence of » / « rates of ».
  'prevalence',
  'rates',
];
