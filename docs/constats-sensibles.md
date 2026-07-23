# Sensitive findings — catalog & safeguards

> **Durable and living** document. It keeps the **product catalog** (the labels, the recognized
> readings) and the **safeguards as testable requirements**. The *why* lives in
> [ADR-0003](adr/0003-doctrine-constats-sensibles.md) — an ADR freezes the rule and its reason, this
> document keeps the journal and updates itself as cases arise.
>
> Scope of the original measurement: **first connector (TikTok), in French**. The benchmark was
> throwaway; the quantified findings note lives in a PANO-33 comment.

---

## 1. Catalog — the six sensitive labels

Columns: **says** (what the finding asserts) · **impact** · **evidence** (provenance readable
offline) · **cost of error** (= cost of a false positive) · **framing**.

The six labels are **treated flat**: same door, same grille, `mental_health` included. No gradation —
a notch reserved for one label would be arbitrary. The question will reopen with the abuse / sexual-violence
framing (deferred, R&D).

| id | says (« a platform could… ») | impact | evidence | cost of error (FP) | framing |
|----|-----------------------------------|-----------|---------|--------------------|---------|
| `health_physical` | …infer a **medical condition / physical health state** | high (health data, discriminating) | condition named about oneself *(explicit)* / repeated health searches *(indirect)* — `Searches`, `Comments` | high: wrongly imputing an illness | named finding if written, broad otherwise; never "you are ill" |
| `mental_health` | …infer a **psychic vulnerability / affective state** | **maximal** (vulnerability window) | clinical term about oneself / care for oneself *(explicit)* · repeated affect *(indirect)*. **Measured: the pure oblique escapes the lexicon** (the wall) | **maximal**: wrongly pathologizing | evidence required; fan of readings on BOTH tiers (`ranked` on the named) |
| `sexuality` | …infer an **orientation / identity** | high (**outing**) | self-designation / claimed bio *(explicit, strong signal)* · repeated community interest *(indirect)* | high: outing | **never name from the indirect** → broad finding + `vécu · allié · curiosité` fan |
| `politics` | …infer a **political orientation** | medium-high | named affiliation *(explicit)* · repeated engagement *(indirect)* | high | platform-subject |
| `religion` | …infer a **religious belonging / practice** | high (imputed belief) | self-declaration / practice *(explicit)* · repeated religious content *(indirect)* | high | platform-subject. **Debt: axis to be made bidirectional** (see §4) |
| `conflictual` | …classify you as a **"conflictual account"** from your messages | high (character judgment) | **insults EMITTED targeting another user** — *item-level* | high | see §1bis |

### 1bis. Dedicated subclass — "character judgment" (`conflictual`)

Door **"receipts + platform-subject"**, non-negotiable:

- **in** only if the insult is **emitted** by the person (not **quoted**: « il m'a traité de… » =
  received, out of scope);
- **and** targets **another user** (a frustration curse with no target — « putain ce bug » — does not
  count);
- **no indirect tier**: emitted insults *are* the explicit signal. We never fabricate a vague finding
  "you are aggressive".

### 1ter. Factual / out-of-text-measurement findings (reminder)

- **`age`**: a birth date is a **supplied datum**, not an inference — "they have your exact birth
  date", outside the text classifier. **Inferred** age bracket = low priority, marked fragile, out of
  scope.
- **anorexia / eating disorders**: label of **maximal care** (like `mental_health`), outside the text
  benchmark.
- **schedules / usage time**: come from the **timestamps**, not the text; very weak signal, never
  asserted.

---

## 2. Safeguards → testable requirements

Each substantive decision of [ADR-0003](adr/0003-doctrine-constats-sensibles.md) becomes here a
**verifiable property** — the *what to test*, not the *why* (which stays in the ADR).

Target: `golden` (engine property) · `classifieur` (lexicon rule) · `mesure` (ground truth) · `UX`
(display) · `preuves` (data model).

> **The `SENS-*` identifiers are stable anchor points** — the code cites them (see
> `detect/filters-en.ts`, `detect/detect.test.ts`). We do not renumber them; a removed requirement
> leaves its id vacant rather than shifting the others.

| id | requirement (testable assertion) | target |
|----|-------------------------------|-------|
| **SENS-A1** | No sensitive finding is displayed as "you are X", at any confidence level; it reads "a platform would attempt to infer X". | `golden` |
| **SENS-A2** | The sensitive finding is rendered as a **subject-less phrase** (« Indirect signal associable with mental health »): no 2nd person, no verdict on the person, no bare sensitive label without an inference marker. | `golden` |
| **SENS-A3** | The "with so little" discourse (fact + limit) is presented **once**, in a dedicated pedagogical moment, **not** repeated on each card; its two faces appear together. | `UX` |
| **SENS-A3-bis** | The warning "suppositions, not certainties" is present and **visible in the results area** — not only at the site's threshold. It is *load-bearing*: without it, the declared stance is no longer valid. | `UX` |
| **SENS-B1** | Two tiers: explicit term about oneself → **named** finding (higher confidence); repeated topical without a term → **broad** finding (low confidence, hesitation zone). | `classifieur` |
| **SENS-B2** | A **precise** finding appears **only if** the precise term is present; no named condition guessed by cross-referencing. The triggering term is **shown** highlighted, not guessed. | `golden` |
| **SENS-B3** | **For-whom** axis (lived / signal-without-lived-experience) distinct from the named/broad axis: care **for oneself** = strong signal of lived experience even without a clinical term; **for someone else** = signal-without-lived-experience, degraded to indirect, never named on the speaker. | `classifieur` |
| **SENS-B4** | Self-label **claimed in the bio** (flag/badge) = **strong/explicit** signal, never indirect. | `classifieur` |
| **SENS-B5** | `conflictual`: **no** indirect tier; finding only on an **emitted** (≠ quoted) insult **targeting another user** (frustration curse with no target excluded). | `classifieur` |
| **SENS-B6** | **Informational register**: an item that *inquires about*, *defines* or *quantifies* a condition (« signes de X », « prevalence of X ») caps at the **broad** tier, never named — **degraded** like the 3rd person, **never suppressed**. A TIER rule and not a filter: it fails by under-asserting, not by removing signal. Holds for the six labels. | `classifieur` |
| **SENS-C1** | Ground truth with **three** states per (person × label): lived / signal-without-lived-experience / real non-carrier. | `mesure` |
| **SENS-C2** | "tagged signal-without-lived-experience" and "tagged real non-carrier" counted **separately**, never added together; **only the second** is a FP. | `golden` |
| **SENS-C3** | Fan of readings carried by the **evidence**, in `ranked` (ordered) or `equal` (tied) mode; confidence lives on the **finding**, **never** per reading — no weight, score or percentage. `ranked` **orders, it does not quantify**. The **named** finding carries a `ranked` fan: the named tier resolves only the LEXICAL ambiguity (which subject), never the WHY. The "no fan" reservation targets only **high confidence**, which D1 never emits (named → `medium`). | `golden` |
| **SENS-C4** | Every sensitive finding **starts folded**, behind a header carrying the **"sensitive"** badge: the fold is the door of consent, the badge says what is behind it. **Flat treatment on the six labels**, `mental_health` included. | `UX` |
| **SENS-C5** | Each finding carries its **expandable source items** (verbatim + channel + source index, **direct** reference); the page shows the **reuse** of the same item by several findings ("also exploited by…"), **recomputed at render time**. Only the **cited** items cross the engine→UI boundary. | `preuves` + `UX` |

**Kept, outside the table:**

- **SENS-MUR** *(concrete instantiation of SENS-A3)* — show **a captured phrase vs a non-captured
  one** that a platform would nonetheless read; current material = the measured **pure obliques**
  (`mental_health`, `sexuality`). To be **re-aimed at each detection level**, **never removed**: the
  proof of the wall is perennial, there will always be a notch above to show (tomorrow, the real video
  content, which the export never carries).

---

## 2bis. The doctrine that NOTHING holds — the reverse of §2

§2 says which ADR-0003 decisions became verifiable requirements. This one says **what did not become
one**, and it is the half that was missing: a list of safeguards reads as a coverage, whereas it only
enumerates its own mesh. **A coverage is verified in both directions** — and the compression of
ADR-0003 revealed the second. These rules are neither obsolete nor weak; they are simply **held by
hand**, and nothing tells the reader who cites them.

> **The count is dated; the list is not.** On **2026-07-19**, of ADR-0003's 108 normative statements,
> about forty had no sensor. This figure **ages with each witness laid** — that is even the point —
> and it is not kept up to date: do not cite it as if it held today. The entries below are verified at
> any moment by opening the named file, and **an entry whose sensor has been laid is REMOVED from
> here** rather than corrected.

> **What this section does NOT do:** it proposes no instrument, and the absence of a sensor is **not**
> a ground for removing a rule — the false-positive doctrine applies to its own rules. Nor does it
> rank by doctrinal importance, but by **exposure**: how much the fall would cost, × how probable it
> is that it goes unnoticed.

In decreasing order of exposure:

1. **The red line** — the document's only hard prohibition (improving detection by hiding the poverty
   of the means). No mechanism could hold it alone, but nothing recalls it either at the moment when
   it is at play: the addition of a data source.
2. **The whole EVICTION side of the false-positive rule** — "only the term that does not discriminate
   at all goes away", "the judgment bears on the semantics, never on a benchmark's count", "tolerance
   does not vary from one label to another". The *keep* side is measured
   (`fr-colloquial-ablation.test.ts`); the *remove* side never was. It is the list's most costly
   asymmetry, because it is the **irreversible** gesture of the two.
3. **Latent vs live accidental coverage.** Rule written *after* it cost something, and still without a
   witness. The word "latent" appears in no test.
4. **Neutrality (§bidirectional axis).** `religion` does carry `practice` / `opinion` in its lexicon,
   but **no test asserts that the critical pole is detected**. A selective silence could settle in
   without turning anything red — and it is precisely the failure ADR-0003 qualifies as *disguised
   judgment*. Overlaps debt PANO-38.
5. **Non-transfer from one language to another** — "a lexicon result starts over from scratch in
   another language". This repository has already paid the reverse: EN machinery defects masked by FR
   measurements. The rule exists; nothing prevents citing an FR measurement as proof about EN.
6. **"Measured acceptance" vs "assumed".** ADR-0003 makes the passage from one to the other a **dated
   event**, and the word "measured" is a word that closes a discussion. Nothing verifies that an
   instrument exists behind each use of the word.
7. **The threshold is not a safety lever** (and its corollary: raising the threshold costs
   demonstration). Recalled in comments in several places, asserted nowhere.
8. **The "with so little" discourse presented only once**, its two faces together. Its repetition on
   each card would only shift the goldens incidentally.
9. **The bio as a strong signal** — no detector reads the profile today: the rule has no sensor
   because it has no mount yet. To reopen with the orientation roster.

The rest — scopes ("the six labels", "any language"), housing ("an artifact has a home"), positive
obligations on the reader — holds by re-reading, and that is assumed.

---

## 3. What the measurement established

- **Two-tier FR lexicon = base.** Solid on the explicit and the canonical; FPs confined to the
  **ordinary polysemous** (« église », « déprimé », « malade ») — not on the grave sensitive.
- **Fundamental finding, MEASURED**: **pure oblique findings** (`mental_health`, `sexuality`) that no
  lexicon catches — *meaning without mobilizable vocabulary*. **This blindness IS the demonstration of
  the asymmetry**: the platform climbs this step; an honest, local tool does not.
- **A model arm remains an exploration**, nothing adopted or measured.

---

## 4. Debts & open questions

- **NAMED — a harm to ONE item is invisible to the register benchmarks.** Found by deliberately
  breaking a green (`politics` EN batch, `extremely`). `en_ironic` writes « i have decided to become a
  **centrist** », and `centrist` is admitted to the lexicon: measured, adding an acquisition-copula
  head (`i have decided to become`, `i became`, `ive become` — each an addition of **legitimate
  recall**) makes this item tag on a sealed **non-carrier** voice. **And the whole suite stays GREEN**:
  the voice carries only one triggering item, `politics` is at threshold 2, the whole voice returns
  `NOTHING`, and a benchmark that measures the **voice** does not see a harm living in the **item**. It
  would take two. *Scope: the six labels and all register benchmarks* — the instrument that would see
  it is an **item-by-item** assertion on the guards, and it exists nowhere. Until then, the false-positive
  floor of the English voices is an **assumed acceptance**, never measured.

- **OPEN — what the EN belonging-adjectives batch leaves behind** (ex-ticket
  `dette-appartenance-en.md`, condensed here to its deletion). The batch delivered `selfDeclaredEn` on
  four lexicons and the majority/minority symmetry of both axes; the sweep that followed it demoted
  four adjectives that named on an object (`anemic`, `anorexic`, `epileptic`, `had a stroke` —
  intersection `explicit ∩ selfDeclaredEn` held by `detect/storey-intersection.test.ts`). Still open,
  each a distinct judgment:
  - **three justifications that assert a property no code evaluates**, reproduced and not repaired —
    their fixes diverge, deciding them as a block would be the general coverage the doctrine forbids:
    `i voted` (the past does not exclude the idiom — « i voted hufflepuff obviously » → NAMED);
    `moronic` (the target guard does not prevent it from tagging — « youre right, that take is
    moronic » → NAMED); `catholic` (the copula frame does not disambiguate — « im pretty catholic in
    my reading » → BROAD, perhaps within the tier's declared tolerance, to be decided);
  - **machinery — the covering phrases ignore the self-declaration path.** `COVERING_PHRASES` protects
    `hitSurfaces` and not `hitSelfDeclared`: measured, adding `straight up` to the list changes
    nothing, « im straight up done with this » still lays a broad finding. FR has the same hole, simply
    unexercised. Debt of both languages;
  - **boundary declared, not filled — the 3rd person and the bare phrase stay mute on the adjectives**
    (« my neighbour is diabetic », « diabetic recipes » → NOTHING). Held by
    `identity-frame-probe.test.ts`; the admission of bare adjectives into `indirectCore` is the door
    where `straight` was measured at 1 → 4 harms — it reopens by measurement, label by label;
  - **third-party attribution is filtered on no label** (« my friend thinks i am gay », « people
    assume i am straight » trigger): it is the path of the identity benchmark's most costly harm,
    arbitrated **non-blocking** for the symmetry but entire — it deserves its own batch.

- **REPAIRED — the last known coverage hole: `politics` was entirely mute in English.** The only one
  of the four English-speaking labels without a self-declaration tier. Measured and **broadened** (the
  probe in place held nine, which was a probe's list and not a boundary): **40 terms × 9 frames × 3
  volumes = 1080 probes, zero**, when the French mirror returned 24 × `explicit`. A single cause,
  verified against the two other candidates: `selfDeclaredEn` was `undefined` — neither threshold nor
  filter. Delivered: 25 identities (10 left · 10 right · 4 without a camp · 1 ambiguous), the extended
  witness, and the three assertions that recorded the hole **turned, never removed**.

  **What the batch established and that is worth more than the list:** the "clean" admission rule — the
  **doctrinal noun** enters, the **general-use adjective** stays out — **is biased**. `conservative` is
  the ordinary word of the English-speaking right and it is an adjective; `socialist` is that of the
  left and it is a noun. Applied mechanically, it admits one camp's ordinary word and excludes the
  other's: **the French defect reconstituted under new clothes, by reasoning irreproachable at each
  step, and that nothing would have turned red.** The general form of the danger is written at the head
  of `lexicon/politics.ts`: *an admission rule that discriminates on the FORM of a term cuts the
  political field crookedly, the two camps not naming their position in the same grammatical form.*
  Hence `conservative` **and** `liberal` admitted as **assumed acceptances** — excluding both would be
  defensible, excluding only one is not.

  **What the batch does not close, and it must not be read as repaired:** English requires **two** items
  where French requires one, and it **never names** (« i am a socialist » ×1 → `NOTHING`). These are
  two decisions taken elsewhere — the tier and the threshold — not a remaining hole. The 3rd person and
  the bare English phrase stay mute. The false positives of the 25 terms are **not measured**: the
  benchmark written for this batch **disqualified** itself (32/32, including the terms it was to clear)
  because it measured the **constructibility** of a collision where ADR-0003 bears on **dominant**
  usage. It did, however, confirm, on a **sixth** label, that « i am X about Y » turns any identity
  name into an intensifier — **the copula anchors nothing in English**, and it has become the
  repository's most reproduced result.

- **REPAIRED — the political asymmetry of the FR lexicon, and the mechanism that produced it.** The
  lexicon delivered, in French, an **asymmetric encoding of the two camps**: left identities at the
  IDENTITY tier (`selfDeclared` → **named** finding), right ones at the **accusations** tier
  (`indirectCore` → below threshold when isolated). Measured, one item each: « je suis anarchiste »
  laid a named finding, « je suis nationaliste » laid **none** — whereas `nationaliste` was indeed **in**
  the lexicon.

  **No one had written it.** Each term had entered for a locally defensible reason, and the defect
  lived in **none** of them: it lived in the **composition** of two registers. That is what made it
  undiscoverable — a term-by-term re-reading verifies that each **present** term is legitimate, never
  that the **absent** ones are symmetrically so. And no net held it: before this batch, the word
  "symmetry" appeared in **no** engine test.

  Delivered: the right identities at the identity tier, the matched thematic repertoire (it carried
  only that of mobilization), and a **witness** (`detect/politics-symmetry.test.ts`) verified by
  mutation in both directions. **Its boundary is declared and it counts**: it measures the chosen axis,
  not the product's political balance — and it is **blind to a camp entirely absent** from the lexicon,
  which is the half of the original defect it would not catch.

- **MEASURED, and the gap PERSISTS — the evidence density of the opposite pair.** After repair, the
  `politics` benchmark returns 5 pieces of evidence on the left and 4 on the right (before: 3 and 2).
  The two properties the pair isolated are **repaired** — the over-determination of the finding (the
  ablation of the coarse axis left **nothing** on the right, it now leaves a named finding) and the
  current lexeme (`socialiste` / `libéral`). **The density, itself, keeps its gap of 1.** Two voices
  are not a distribution: this figure does not say whether it is a residue of the lexicon or the
  chance of the writing, and it must not be cited as a result.

- **DECLARED CONTAMINATION — three entries the `politics` benchmark does not validate.** `liberal`,
  `liberale` and `redistribution` were written **after** reading the sealed fixture, the first two on
  the explicit request of one of its assertions (`libéral` had been **proposed for exclusion**, on a
  real collision with the liberal profession; the benchmark reversed the decision). The benchmark stays
  independent for all the rest of the lexicon. **The next instrument that measures those three will
  have to be written without them at its head.**

- **DELIVERED — the ENGLISH political vocabulary, 23 entries, and its false positives are NOT
  MEASURED.** Two voting acts, nine institutions and procedures, four **matched thematic pairs**, two
  transverse phrases. No identity, no epithet, no party or movement name — the last two excluded by
  **written rule** (durability *and* symmetry). `selfDeclared` stays **empty**, for lack of an EN
  copula.

  **The zero of the two English guard voices is a BLINDNESS, and it must be cited as such.** They
  trigger nothing, before as after — but verified term by term, **none of the 23 entries appears in
  their text**. The zero measures their content, not the lexicon's sorting. The only real safeguard is
  a writing choice: admit only **phrases**, never the bare nouns `election`, `vote`, `taxes`,
  `political`, `council`, which are in the guards' text. It is reasoning, not a measurement.

- **NAMED — the missing instrument: a sealed ENGLISH OPPOSITE PAIR.** The fixture already declares it
  (its two EN voices are **guards**, not a pair). Without it, the symmetry of the English side is an
  **assumed acceptance**, never measured. Direct proof that a pair of voices written by the lexicon's
  author cannot substitute for it: mid-batch, adding two terms chosen **without looking at those
  voices** tipped the path count from 1–0 in favor of one side to 2–0 in favor of the other. **A probe
  that oscillates on one term does not decide a symmetry.**

- **MEASURED — the English redundancy margin is NULL on both sides.** On two engaged voices written as
  mirrors, the batch opens 2 paths on one side and 0 on the other, and removing a single carrying item
  suffices to make the remaining finding disappear. This is not "the English lexicon leans": the two
  voices speak of the same registers, but one wrote its phrases in **canonical** form and the other in
  free form (« taxed to death » rather than `tax burden`). It is a **symmetry of poverty**. The rest is
  ADR-0003's wall: ordinary political discourse is made of **positions**, not institution vocabulary,
  and no lexicon enrichment crosses it.

- **DEBT — `selfDeclared` EN, and it is heavier than at the pilot.** It is **the tier where the French
  asymmetry lived**. The EN copula batch will therefore inherit the symmetry question **at the same
  time** as the copula, and will have to decide it then, not after.

- **NAMED — the remaining divergence of the citation filter.** The quoted plural is closed for the six
  labels; self-censorship in quotation marks, itself, still escapes (`findMarker` tolerates it,
  `occursInsideQuotes` does not). The clean filling is not a third motive to write but a passage to the
  **positional** test, which changes the semantics on multiple occurrences. Frozen by a test that will
  turn around the day someone does it.

- **REOPENED by the false-positive rule (ADR-0003, *The admission of a term*) — the shared
  middle-ground of the two health labels.** `side effects`, `sick note`, `fit note`,
  `medical certificate`, `prescription`, `appointment` were removed for a **belonging-between-labels**
  problem, with a recognized recall cost **on both sides** — never by ablation. This motive no longer
  holds. Measured on the sealed voices, and the batch splits in two:
  - **`fit note`, `prescription`, `appointment` — the removal DOES NOT HOLD.** They trigger on
    `living`, the voice that really lives with a chronic physical condition (« rheumatology appointment
    rescheduled again », « repeat prescription pharmacy app not updating », « do i need a fit note for
    a hospital appointment »). Carriers **and** non-carriers: they stay, and their re-admission is to be
    instructed;
  - **`side effects` and `sick note` — TO MEASURE, NOT TO DECIDE.** On this benchmark they only fire on
    `distress`, non-carrier of `health_physical`. But the rule's corollary applies here full force: the
    judgment bears on the **semantics**, and « side effects » is **domainless** vocabulary that a
    physical voice writes just as well (« methotrexate side effects »). The benchmark has only **one**
    physical voice, and it did not write it. **What is needed: a second sealed physical voice**, under
    heavy treatment. Without it, removing these two terms would be reading the table instead of the
    term.

- **DEBT — the `conflictual` guard is ANTI-CORRELATED with aggression.** Contempt is expressed *about*
  a category (« i have no patience for morons who lecture ») — without address, hence invisible;
  tenderness *addresses* (« you are the official moron of this house ») — hence seen. The diagnosis is
  established: it is neither the plural nor a tier rule, it is the **2nd-person target** required by B5.
  It is **not** a ground for removing the label (rule above): it is a machinery defect, to be
  instructed with the four voices as the instrument.

- **THE REAL DEFECT OF `conflictual`, and it changes the priority: a recall hole of 92%.** Measured on
  the sealed voices: **the lexicon reaches 2 items out of 26 of sustained contempt**, in both
  languages. The rest is either absent vocabulary (`nul`, `pitoyable`, `incompetent`, `betise`;
  `useless`, `rubbish`, `clueless`, `nonsense`), or the wall (« tu comprends rien a ce que tu fais »,
  « each one is worse than the last »). Next to that, the label's false positive is **anecdotal**. **The
  next `conflictual` batch BROADENS, it does not tighten** — and the four voices measure both
  directions.

  *Prediction not to lose, because it will be counterintuitive at the moment of broadening:* at the
  measured upper bound (vocabulary filled, guard removed), recall rises to 7 items per hostile voice —
  but the harm rises to **9 and 11** on the non-carriers. **Broadening will raise both together, and
  precision will not improve.** This is not a reason not to broaden (the false positive is not a ground
  for removal, and the detector's error is the subject); it is a reason not to sell the broadening as a
  gain in accuracy, and to make sure the product's pedagogy carries the error (card proposal below).

- **TEXTBOOK CASE of the false-positive rule — read the TERM, not the table.** On the `conflictual`
  benchmark, `nulle` and `incompetente` only fire on the non-carriers. These are not broken terms: that
  voice is a group of women. Removing them on this count would be the fault the rule names. **The record
  of eviction precedents**, all passed through ablation: the five EN hyperbolic terms (0% on the distress
  voice), the six FR/EN homographs (null EN recall, identical FR benchmark), `moron` (null recall over
  26 hostile items).

- **REMOVAL CANDIDATE under the rule — `rate` / `ratee`.** It matches « j'ai **raté** trois tirs »: a
  verb, no insult, no inference to show. It is the "does not discriminate at all" profile, same family
  as « the pros and **cons** ». To be instructed with the rest of the broadening batch rather than in
  isolation.

- **SCOPE — the false-positive doctrine covers the product's FINDINGS, not the local model's free
  text.** Verified: `web/src/ai/` has no label taxonomy — it is a free prompt. What a local model
  writes in prose is governed neither by this rule nor by the tiers.

- **NOT MEASURED — identity slurs, in both languages.** The four sealed voices of `conflictual` insult
  competence, intelligence and taste, by decision. The FR lexicon carries ratified gendered, ableist and
  homophobic slurs: **neither their recall nor their false positives have ever been measured**. Hole
  distinct from the recall one above.

- **BATCH TO OPEN — the `conflictual` guard is ANTI-CORRELATED with aggression.** It is the discovery of
  this label's first benchmark (`engine/detect/conflictual-fp-bench.test.ts`), and it bears on its
  **door**, not on its vocabulary. The doctrine requires a **2nd-person target** to tag (ADR-0003,
  `conflictual` exception), on the grounds that it prevents tagging a critique of an idea. Measured on
  two sealed voices written blind, it does the opposite of what is expected of it:
  - **contempt** is expressed *about* a category — « i have no patience for morons who lecture », « les
    gens comme ça » — hence **without address, hence invisible**;
  - **tenderness** *addresses* — « you are the official moron of this house » — hence **visible**.

  The diagnosis is established and verified (the plural has nothing to do with it: the same sentence,
  addressed, tags). This is not an imprecision a better lexicon corrects — a smaller lexicon only reduces
  the volume of a sorting that sorts backwards.

  **What the batch will have to decide**, and it is not decided here: does the guard stay (it really
  protects the critique of an idea, decision D), is it doubled by a second path for unaddressed
  contempt, or must the `conflictual` exception itself be reopened? Instrument available: the four
  sealed voices. **Nothing moves until then.**

  **The pedagogy that must travel WITH this batch, not after it** — it is the "card proposal" announced
  above. The removal of the label having been refused (the detector's error IS the subject), the card
  turned around: not "what we refuse to infer", but **"how a deduction goes wrong"**, a maintained
  deduction whose error is exhibited, with its figure. It lives in the dedicated pedagogical moment
  (SENS-A3), never on the cards. Draft **to be ratified like all wording**:

  > **An algorithm gets it wrong, and it is visible here.**
  > Nous avons testé notre détecteur d'agressivité sur des textes écrits à l'aveugle par quelqu'un
  > qui ignorait ce que nous cherchions. Il repère l'insulte — mais il ne sait pas **à qui** elle
  > s'adresse : un commentaire répond à une vidéo que nous ne voyons pas, adressé à quelqu'un dont
  > nous ignorons tout. Il signale donc aussi souvent des amies qui se chambrent que des gens qui
  > méprisent des inconnus.
  > **Nous le gardons quand même, et c'est délibéré :** une plateforme se trompe exactement comme
  > ça, sur les mêmes phrases, et elle ne vous le montre pas.

  No new mechanism: content in a zone that exists. If the broadening batch leaves without it, the
  prediction above (recall and harm rise together) will come to pass with no explanation on the screen.

- **MEASURED — the English of `conflictual` does not read aggression.** Zero detection on the 26 items
  of the English hostile voice, before as after the EN batch. The only English trigger this label ever
  knew was a **harm** (`moron`, on the affectionate voice, at the named tier), and the term was removed
  on that figure. English is therefore **mute on both sides**, and this silence is **declared by a
  guard** rather than passed off as safety. Filling the recall first supposes knowing whether the guard
  above must stay: delivering more vocabulary into an anti-correlated sorting would mostly increase the
  harms.

- **NAMED — the shared middle-ground `conflictual` / `politics`.** Addressed political invective
  (« you're so triggered », « you sound like a bot ») crosses the `conflictual` door whereas mockery
  was deliberately removed from the `politics` readings so as not to land there. Same form as the shared
  middle-ground of the two health labels: admitting it makes one label claim every clash of opinion,
  discarding it costs recall on real aggression that happens to be political. The EN batch discarded the
  entry surface (`cope`, `seethe`, `ratio`, `touch grass`, `triggered`); the debt is not yet due.

- **NAMED — EN homophobic and ableist slurs, outside the `conflictual` EN batch.** FR carries them on
  the maintainer's explicit arbitration. EN deserves the same explicit decision, not a transport by
  symmetry — maximal cost of error, and unknown EN FP rate for this label (ADR-0003, tiering by cost of
  error).

- **RATIFIED — the order of readings, and the rule that governs it.** Three readings cover three
  **mechanisms**, not three degrees; for the labels of the *for-whom* axis, they are exactly the three
  ground-truth states of ADR-0003 (`vécu` · `signal sans vécu` · `non-porteur`) — the fan shows the
  reader the indetermination the benchmark measures. **Same texts at both tiers, only the mode
  differs**: `equal` being unable to rank by definition, there is only one order per label to ratify,
  not two. The order retained is the original one, now **chosen** and no longer merely inherited — when
  the precise term is written, the "it's me" mechanism dominates, and the degradation by informational
  register reinforces it (what stays named is what does not inquire). *(Ratified 2026-07-18; the
  original proposal, `lectures-sensibles-proposition.md`, is deleted — all that survived of it is here
  and in the wiring.)*
  - **`politics` rewired** `engaged · irony · watch`. `irony` recovered (the only mechanism not covered
    elsewhere: the signal does not represent the person); `partisan` (a degree of `engaged`), `mockery`
    (remarks targeting someone — that is `conflictual`) and `avis personnel` removed. No more orphan
    reading, and a net now holds **both directions** of the coverage.
  - **Reservation not decided:** the harmonization `curiosité` → `simple curiosité` on
    `health_physical` and `sexuality` was proposed and **is not ratified** — three labels of the
    *for-whom* axis therefore still carry different words for the same mechanism.
- **RESOLVED — the `equal` mode truncated to two readings.** `FanView` rendered `readings[0]`, a
  separator, `readings[1]`: the third was silently lost on every broad finding. Corrected (separator
  interposed, rendered on the real length) and covered by `fan-readings.test.ts`. The defect had
  survived because **no golden rendered an `equal` fan** — a structural boundary, now declared in both
  goldens.
- **Debt — thematic lexical strategy** ([PANO-36](https://linear.app/yuya/issue/PANO-36)): enrich the
  lexicon by **lexical fields structured per label** (variants, registers, periphrases), and not by
  ad-hoc patching. Includes the field "teen malaise / parent register" (« décroche », « se renferme »).
  - **LIMIT to enact**: enriching the lexicon pushes back the frontier of the **explicit** but **will
    never resolve the pure oblique** (« no futur… » has no marker to add). Lexicon debt ≠ solution to
    the oblique.
- **Bidirectional `religion` axis** ([PANO-38](https://linear.app/yuya/issue/PANO-38)): cover
  **practice ↔ critique/hostility** (neutrality — selective silence is a disguised judgment). The
  boundary critique-of-ideas vs insult-of-persons (which overlaps `conflictual`) stays **in debt**, to
  be bounded at implementation, terrain in hand.
- **EN portability** of the classifier ([PANO-35](https://linear.app/yuya/issue/PANO-35)) — **batch 1
  DELIVERED**. Measured: the filters being FR-only, negation / citation / 3rd person **failed OPEN** on
  EN text — « my sister has depression » laid a **NAMED** finding on the speaker (violating SENS-B3,
  SENS-C1/C2) by simple **FR/EN homography**, with no EN marker at all. Batch 1 closes the three
  protective filters, mirror goldens in support, with no FR regression. **Still in debt**: EN
  self-declaration (batch 2 — the only filter that *creates* a named finding, hence to be measured;
  **instructed then closed without delivery**, see the dedicated entry below — the debt is not
  discharged, it is now **specified**), the EN markers of the six lexicons. *(The "FR safety hole" long
  listed here — 3rd person without « ma mere » or « mon pere » — is **filled** since, and the
  adversarial battery holds it.)*
  - **Pilot batch DELIVERED — `mental_health` EN.** The lists live inline in `lexicon/mental-health.ts`
    (annotated `// (EN)`), the carrying exclusions in the adversarial battery, the method in
    [`methode-portabilite-en.md`](methode-portabilite-en.md). It produced the **admission rule** now
    carried by ADR-0003 (*The admission of a term*): hyperbole excludes itself at the door, it is not
    demoted — the repetition threshold accumulates it instead of filtering it.
  - **Debt — EN vital distress, to reopen deliberately.** Three forms are **discarded from the pilot
    batch**, not rejected: `suicidal`, `end my life`, `take my own life`. Motive: maximal cost of error
    + unmeasured EN false-positive rate (tiering by cost of error, ADR-0003). Reopening them supposes the
    measurement below, not a mere addition to the table.
  - **Debt — EN is not measured, and the persona will not suffice.** The pilot batch is delivered **on
    doctrine**, false positives unmeasured, decision assumed. The EN demo persona measures **recall**,
    never an FP rate: a single writing voice cannot reveal a term that over-fires on an expressive
    register — measured, it encounters **none** of the batch's terms. The instrument that would close
    this hole is a **benchmark of EN personas in deliberately contrasted registers**: it is the
    **register variation**, not content, that brings out the hyperbole false positives. **Built and
    measured** (2026-07-18) — six voices, 180 items, personas and ground truth sealed by a commit prior
    to any reading of the lexicon. The artifact takes precedence over the figures: the current states
    are read in the frozen expectations of `detect/en-fp-bench.test.ts` (and `fr-fp-bench.test.ts`),
    which declare their limits at their head and **turn red** if a threshold, a filter or a term moves.
    *(The period report, `banc-fp-en-mental-health.md`, is condensed in
    [`methode-portabilite-en.md`](methode-portabilite-en.md).)*
  - **OPEN debt — batch 2 (EN copula): INSTRUCTED, then CLOSED WITHOUT DELIVERY** (2026-07-18). The
    batch was to open the `selfDeclared` EN tier — self-declaration heads **and** state labels. Nothing
    was delivered, and the negative result is the deliverable. **Measured**: by delivering heads,
    modifiers and the four candidate terms (`depressed`, `anxious`, `bipolar`, `burnt out`) in the
    **most permissive** configuration, the EN benchmark returns a **null delta** on the six voices. This
    zero is a **blindness, not a safety**: the voices do reach the copula (seven items, frozen by a
    guard) but none pairs it with an admissible term — the fixture had deliberately avoided the
    exclusions already frozen, and the candidate state labels **are** those exclusions. **The rigor that
    discards one bias installs a second, invisible because it produces a zero** — and this result
    generalizes to any benchmark written according to this discipline. Measured corollary *(see the
    correction in the following entry — this statement only holds for `mental_health`)*: **no safe half
    to deliver**, the diagnostic passive (the only EN construction without attested hyperbole) opening
    exclusively only the same polysemous labels, its safe content already tagging by homography. Two
    terms discarded **by doctrine** (`anxious` — false friend « anxious to see you »; `burnt out` —
    figurative participle, already broad); `bipolar` and `depressed` stay out **for lack of
    measurement**, not by judgment. What would have unblocked, said the criteria note at the time: two
    sealed voices (natural rate / upper bound) **plus a positive control** of the copula path.
    - **UNTIED since, and NOT by the demanded instrument.** The two voices were never written: the
      measurement of the adjectives batch showed that the criteria's premise was false — **the copula
      anchors nothing in English** (« im so ocd about my desk drawers » carries the whole frame), so
      there was no "natural rate" to estimate. Safety moved from the frame to the **TIER**: the
      delivered `selfDeclaredEn` tier lands BROAD and never asserts, and any future proposal that makes
      the frame carry safety again (heads, modifiers, windows) is rejected outright — it is the threshold
      error in new clothes (ADR-0003, *The door, not the threshold*). What SURVIVES of the criteria,
      because it is general: an instrument must contain a guaranteed positive control, and an
      adversarial voice is verified against the construction it claims to measure, counted item by item
      at the word boundary (ex-note `criteres-mesure-copule-en.md`, condensed in
      [`methode-portabilite-en.md`](methode-portabilite-en.md)).
  - **DELIVERED — the LANGUAGE DOOR of `selfDeclared`** (2026-07-19), and it corrects a finding from
    the previous entry. `selfDeclared` was a **single, language-blind** list, and the copula heads are
    the **only** thing that reads it: the heads being FR, they formed a **language door no one had
    declared**. Measured: adding a single EN head activates at once **fifteen English spellings**
    already present in the self-declaration tiers of `religion` (`muslim`, `muslima`, `protestant`,
    `sikh`), `sexuality` (`gay`, `bi`, `homo`, `trans`, `queer`, `ace`, `aro`, `enby`, `hetero`) and
    `politics` (`militant`, `liberal`) — all in **NAMED** findings, none ever examined for English. « im
    ace at darts » laid a `sexuality[explicit]`. **Adding EN heads would therefore not be adding a
    feature: it would be removing an unwritten protection.** Corrects the finding "the heads only open
    the polysemous state labels", true of `mental_health` alone and wrongly generalized to the batch.
    Delivered: `selfDeclaredFr` matched to its heads at the call site, the fifteen recorded explicitly
    **not admitted for EN**, behavior witness verified by **five mutations**
    (`selfdeclared-language-gate.test.ts`). FR byte-identical.
    - **DECIDED since, by the `politics` EN batch — `liberal`.** Entered as a **right** identity in the
      French sense (economic liberalism), it designates the **left** in English: the same string
      designates opposite camps depending on the language. The instruction at the time — "`politics`'s
      symmetry repair would silently turn around in EN" — **aimed at the wrong target**, and it is useful
      to say so rather than to strike it. `selfDeclaredEn` **never names**, and the finding produced says
      `politics`, never a camp: the inversion breaks a **witness's partition**, not the detection, and it
      reaches **no output seen by a user**. Admitted, filed in a fourth `ambiguous` bucket — same gesture
      as the `neutral` bucket of the FR side.
    - **Deliberate sequencing — `sexuality` will have no EN head before its own benchmark.** It is the
      label where a false named finding **outs** someone, and it has no sealed voice in any language. The
      door is what buys the time to write it.
    - **Out of scope, declared — `InterestLexicon.selfDeclared`** also carries English spellings and
      would activate the same; a falsely named interest theme outs no one, and extending the rename to
      forty files would have drowned the door.
  - **RESOLVED — five terms of the pilot batch over-fired.** `falling apart`, `rock bottom`,
    `spiraling`, `running on empty`, `overwhelmed` tagged a non-carrier persona who writes by hyperbole,
    without bringing **any recall** on the concerned persona. Removed; the benchmark keeps their names so
    that their return says which one.
  - **RESOLVED — a NAMED finding was laid on the caregiver, EN AND FR, in production.** Cause:
    `hasThirdPerson` is item-local and looks for a possessive, so « signes de dépression chez
    l'adolescent » carried none. An English measurement found a **French** safety hole — it is
    uncommanded gain, and it is the best justification of the benchmark. Corrected by a TIER rule (the
    informational register degrades named → broad, without ever suppressing), in doctrine in ADR-0003.
  - **OPEN debt — the assertive, technical and administrative residue.** « le burnout est un phénomène
    lié au travail », « inventaire de burnout de maslach », « teenager missing school anxiety letter »:
    neither interrogative nor possessive, they still produce named findings on the professional voices.
    Covering them supposes first-person anchoring, **measured as also degrading the true positive**. It
    joined batch 2 of PANO-35 (EN copula) — **closed without delivery** since: this residue therefore no
    longer awaits a batch, it awaits the same measurement as it.
  - **DECIDED BY MEASUREMENT — the FR colloquial tier is KEPT, false positive accepted.** « j'en peux
    plus » (`indirectCore` tier), « au bout de ma vie », « je craque », « à plat », « je sature »,
    « cafard » tag a non-carrier French voice. **Ablation** (`fr-colloquial-ablation.test.ts`): their
    removal suppresses this false positive, costs nothing to a **cared-for** distress — already detected
    by the care vocabulary — but makes a distress **without care** **entirely disappear**, one that has
    only this register. They therefore carry a recall that nothing else carries. They stay, and the
    false positive is a **measured acceptance**, locked by test. Measured nuance: none of the six is
    individually carrying — it is the crossing of threshold 2 that is. What would reopen the file:
    several voices per register written by other hands, never a subset adjusted to two idiolects of
    n = 1.
  - **VERIFIED — the tier rule on `health_physical`.** It was running in production there with no
    measurement. The documentary framing degrades as expected, and **lived experience keeps its named
    finding**: a person who lives a condition names it possessively somewhere, and that item has no
    documentary framing. Mechanism probes, not a rate measurement. The **four other** labels stay
    unverified.
  - **CORRECTED — "`health_physical` has no English coverage" was FALSE.** This debt was long listed
    here on the grounds that « diabetes » ≠ « diabete ». The plural tolerance brings them together, and
    the real coverage is **five entries**: `diabete`, `hypertension`, `eczema`, `psoriasis` (`explicit`
    tier — hence a right to **name**) and `cortisone`. It is **accidental and partial** (« endometriosis »
    is not the plural of « endometriose ») but it is not null, and it was never calibrated. The five
    crossers are since annotated in `lexicon/health-physical.ts`, moved from accidental to intentional
    without changing a line of behavior (original record in the ex-batch note, condensed in
    [`methode-portabilite-en.md`](methode-portabilite-en.md)).
  - **DELIVERED — 2nd D1 batch (`health_physical` EN), in TWO steps and in this order.** The batch's
    instruction found two tier defects that were **already firing in production** on those five terms;
    bringing `explicit` from 4 to ~35 EN terms would have multiplied them. The sequence was therefore
    inverted — machinery first, vocabulary next, each measured before the following one.
    - **RESOLVED — no instrument exercised this label.** The eight sealed voices at the time returned
      zero `health_physical` finding, and this zero was a **quantified blindness**: the three witness
      voices carried **0/30** items with body vocabulary. **Three body voices were sealed** (living with
      a condition · anxious healthy person · caregiver relative), written blind to the lexicon, with
      their sensor. They measured the two steps of the batch.
    - **RESOLVED — the informational register missed English's dominant word order.** « symptoms of
      diabetes » degraded, « diabetes symptoms » **named** — yet the pre-posed noun-noun compound is the
      most frequent form of the English-speaking health query. Corrected by **compound heads**,
      recognized only when adjoined to an explicit term: bare « symptoms » stays discarded, and its
      deliberate exclusion (not degrading whoever describes THEIR symptoms) holds. `treatment`/`diet` are
      **excluded on purpose** — seeking care is a signal of lived experience. **Cost frozen by test**:
      « my diabetes symptoms » degrades too.
    - **RESOLVED — the EN 3rd person stopped at the American nuclear family.** « my nan has diabetes »
      **named**. Also missing were « my mum » (British form) and all the extended kin. Twenty forms
      added.
    - **WHAT HOLDS BEYOND THE BATCH**: the two defects were **also** firing on `mental_health`
      (« burnout symptoms » named). The pilot label was not spared, it was **masked** — its frequent
      disorder names live at the `indirectSolo` tier and structurally can no longer name. **A tier
      created against hyperbole covered a register defect**, and the mask only fell by opening the first
      label whose condition names stayed in `explicit`. The four remaining D1 lexicons will meet these
      same defects.
    - **DELIVERED — the EN vocabulary of `health_physical`**, and its admission line is NOT the pilot's.
      Hyperbole barely works here (no one writes « i'm diabetic » for a laugh); the measured line is
      **the symptom is not the condition**. The benchmark's two voices split exactly there: the one who
      LIVES with polyarthritis names her illness, her treatment and her specialty; the one who has NOTHING
      wrote a dense and perfectly **literal** symptom vocabulary. No symptom name enters — that is what
      holds the non-carrier's zero.
    - **MEASUREMENT, the four criteria**: the voice that lives its condition gains a **named** finding
      (14 items); the caregiver gains a **broad** finding and **loses** her two `mental_health` tags; the
      non-carrier stays at **zero**, and this zero is at last a measurement rather than a tautology. No
      harm on the **seventeen** sealed voices of the four benchmarks.
    - **What the measurement taught the batch** — two categories were missing from the proposal, which
      had built care around **consultations**: the **maintenance treatments** (`methotrexate`,
      `biologics`) and **arthritis** as a named condition, FR carrying only `arthrose`.
    - **RESOLVED — `therapy` no longer reads physical rehabilitation**, and without a delivered term
      being removed. `health_physical` claims the rehabilitation phrases, and a **covering phrase**
      prevents the short marker from reading them in passing (strict containment: a phrase does not block
      itself). **Ablation done**: the `therapy` true positives hold. As a bonus, the mechanism holds the
      written reservation of the pilot batch — « retail therapy » falls, which the threshold did not do.
      *The mechanism is general and reopens F8* (« miscarriage of justice »); this case nonetheless stays
      closed, but now for **another reason** — it belongs to the pregnancy territory, out of scope.
    - **OPEN debt — neutral care has no home.** `side effects`, `sick note`, `fit note` were proposed in
      `health_physical`, then **removed at measurement**: they tagged the mental-distress voice
      (« sertraline side effects », « sick note for mental health »). The two health labels share a
      **middle-ground** — sick leave, side effect, prescription, appointment — that carries **no domain
      information**: it is the surrounding text that carries it. Discarding them costs real recall on
      both sides; admitting them makes one label claim all care text. No current mechanism resolves that,
      and naming it is better than re-deciding it at each batch.
    - **OUT OF SCOPE, decided — pregnancy and disability.** The FR lexicon already files `ma grossesse`,
      `pma`, `fiv`, `mon handicap` under `health_physical`, on a framing that **nothing ratified**: a
      pregnancy is not an illness, and filing disability under physical health frames it as a pathology,
      which the concerned people contest. EN stays **deliberately asymmetric** on these two territories:
      they will not be doubled in a second language before being decided. **The question is for ADR-0003,
      not the next lexicon batch.**
    - **Debt — `miscarriage` stumbles on a fixed phrase.** Measured: « miscarriage of justice » matches,
      and **no existing machinery discards it** (neither negation, nor citation, nor register). What is
      missing is a **negative-phrase** mechanism, which would hold for the six labels. Opening this
      mechanism in passing would be exactly what this batch reproaches: the term stays out.
    - **OPEN question, spun off — the asymmetry of the bare name.** `psoriasis` alone **names**,
      `depression` alone no longer does. There is a good reason (the `indirectSolo` tier exists against
      hyperbole, and physical conditions are not hyperbolized) and it is written nowhere. This is not a
      defect; it is a coherence to ratify or to assume explicitly.
- **Explicit-assumed orientation via bio** (strong signal well classified) — future measurement roster.
- **Central arbitration** ([PANO-37](https://linear.app/yuya/issue/PANO-37)): **DETECT BETTER vs
  DEMONSTRATE BETTER** — capturing the oblique would reduce the demonstration of the wall.

---

## 5. Register of readings per label

> This register **enriches itself as cases arise**. Multi-interpretability depends on the theme — the
> axis of religion is not that of mental health. The ADR freezes the **principle**; here is kept the
> **journal** of recognized readings, label by label. Pre-filled **only** with what has been
> established; the rest is open, **without inventing**.
>
> The lexicon takes up these keys and **invents none**: adding a reading means amending this register
> first.

| label | recognized readings (flat) | known boundary / overlap | status |
|-------|-----------------------------|---------------------------------|--------|
| `health_physical` | personal lived experience · concern for a relative · curiosity | — | **handled** *(3rd reading "relative" added: the signal-without-lived-experience holds for physical health too, aligned with `mental_health`)* |
| `mental_health` | personal lived experience · concern for a relative · curiosity | — | **handled** |
| `sexuality` | personal lived experience · ally · curiosity | sexually-connoted insult targeting a person → `conflictual`; group slur → out of product (future label) | **handled** |
| `politics` | engagement / activism · personal opinion · curiosity / watching | — | **handled** |
| `religion` | practice / belonging · personal opinion · curiosity / interest | SUBJECT label; anti-believer hostility → `conflictual`; critique of an idea → nowhere; group slur → out of product (future label) | **handled** |
| `conflictual` | emitted aggression · endured / reported hostility | critique of an idea excluded | **handled** |
