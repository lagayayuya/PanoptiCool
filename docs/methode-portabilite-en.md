# What English portability taught — method note

> **What this document is.** The trace that survives the English portability campaign
> (2026-07-16 → 2026-07-20): six lexicons ported, two self-declaration tiers built, four sealed-voice
> benchmarks, and fourteen session documents — ratified proposals, measurements, arbitrations —
> condensed here after delivery. A ratified and implemented document is a trace, not a home: what
> follows is what **generalizes**, written for a reader who did not live the batches.
>
> **What this document is not.** No rule lives here. Each lesson points to the place where its rule
> **acts** — an ADR-0003 section, a lexicon header, a witness. If this note and one of those places
> diverge, the other is right: this note testifies, it does not norm. Nor does it replace the journal
> (`AI_USAGE.md`): it says what was learned, not who arbitrated what.

---

## 1. A benchmark written while avoiding its exclusions becomes blind to their admission — and its symptom is a zero

The corpus's costliest lesson, because it cost two batch closures and because it **recurred a month
after being written**, in a benchmark drafted by a session that had read the lesson.

The `mental_health` EN false-positive benchmark had been written with real discipline: its voices
deliberately avoided the exclusions already frozen by the adversarial battery, so as not to produce an
information-free green light. That rigor, which discards one bias, installs a second: the terms the
next batch would want to admit **are** those exclusions, and the benchmark can structurally no longer
encounter them. Its verdict on their admission is a zero — and a zero looks exactly like a success.
Batch 2 of PANO-35 was closed on this, twice.

Then the `sexuality` benchmark, written later by another hand, reproduced the same blindness in another
form: its adversarial voice looked like an upper bound and was not one — none of its twenty-four items
paired a copula with a candidate term. The resemblance between "adversarial voice" and "upper bound" is
deceptive, and no author's intent dispels it.

What came out of it, and where it acts:

- **a positive control is mandatory** (at least one item known in advance to have to tag): without it,
  no zero distinguishes a safe path from a dead one;
- **a voice is verified against the construction it claims to measure, not against its brief** — count,
  item by item and at word boundaries, how many actually reach the construction. The first count of
  this kind was wrong in the reassuring direction (`bi` matched in « a bit »);
- before any zero: **by which path does it arrive?** A zero has several possible causes, and the test
  distinguishes none of them (CLAUDE.md, *What a net proves*).

## 2. Measure the system's output after delivery, never the batch's contribution

The `conflictual` EN batch proved that its English insults collided with nothing, delivered them clean
— and shipped six false positives. The batch's load-bearing piece was not the insult list: it was the
list of **targets**, and the English targets were the second member that six French entries had been
waiting for all along (`con` matches « the pros and cons », `gland` « thyroid gland »). Delivering them
made live a suspended charge that no one had calibrated. Green CI throughout: the 580 tests measured
non-regression, not the absence of harm.

> Under a conjunction, "my list is clean" says nothing about "the batch is clean". What is measured is
> the **system's output after delivery**, on the committed lexicon — not the contribution of what one
> wrote.

Two corollaries, born of the same campaign:

- **"assumed" is not "measured".** A false-positive acceptance without an instrument is written
  *assumed*; the word *measured* requires a denominator. The distinction is in doctrine (ADR-0003);
- **a harm to an item is invisible to the voice benchmarks.** A benchmark that measures the voice does
  not see a harm living in the item: a single trigger below the threshold, and the voice returns
  "nothing" on both sides. Named debt in the catalog (`constats-sensibles.md` §4).

## 3. The copula anchors nothing in English — the whole copula doctrine is French

In French, « je suis X » disambiguates: the copula anchors the first person, and it is what authorizes
the named finding of the self-declaration tier. The premise crossed all the early batches without ever
being written — until measurement broke it: « im so ocd about my desk drawers », « im autistic about
train timetables », « im depressed that the bakery closed early ». The frame is there, entire, and the
English idiom **inhabits** it: English writes its figure in the first person. Reproduced across six
labels (`i am X about Y` turns any identity name into an intensifier), and it is what invalidated —
twice — the premise on which batch 2 of PANO-35 had been closed.

The response was not to filter the frame better: it is to **remove all safety load from the frame** and
put it at the tier. The `selfDeclaredEn` tier lands as a broad finding and never names — it therefore
cannot over-assert. Any proposal that makes the frame carry safety again (heads, modifiers, windows
around the copula) is rejected outright: it is the threshold error in new clothes (ADR-0003, *The door,
not the threshold*). The rule is written on `SELF_DECLARATION_HEADS_EN`
(`engine/detect/filters-en.ts`), where it will be re-read.

## 4. Each lexicon has ITS OWN dividing line — importing the previous one failed six times out of six

This is the campaign's backbone. Each batch began by trying the previous batch's line, and each time it
did not bite:

| label | the line that decides | why the previous one did not transport |
|---|---|---|
| `mental_health` | **hyperbole** does not cross the door (« i'm dying » = laughter) | — (pilot) |
| `health_physical` | **the symptom is not the condition** (no symptom name enters) | hyperbole barely works there: physical conditions are not figurativized |
| `conflictual` | **the discriminant — the relationship — is not in the export**; we reduce the surface | neither hyperbole nor symptom: the joke and the aggression are the same utterance |
| `politics` | **phrases, never bare names**; and the epithet does not enter | bare political names collide by polysemy, not by hyperbole |
| `religion` | **the word that names enters, the word that performs does not** (phatic layer excluded) | `mosque`, `gurdwara` are monosemic: requiring the phrase would cost all the recall for nothing |
| EN self-declaration | **the tier protects, not the frame** (§3) | no lexical line holds a construction the idiom inhabits |

The lesson is not one of the six lines: it is that **an admission line is a per-label measurement
result, never a transportable given**. Each line lives at the head of the lexicon it governs; those
promoted to doctrine (admission of hyperbole, disease-name-turned-insult, phaticity) are in ADR-0003,
*The admission of a term*.

## 5. The clean door is biased — discriminating on grammatical form cuts the political field crookedly

The most defensible admission rule of the `politics` EN batch — "the doctrinal noun enters, the
general-use adjective stays out" — applied mechanically, admitted `socialist` (the ordinary word for
the left: a doctrinal noun) and excluded `conservative` (the ordinary word for the right: a
general-use adjective, « i am conservative with my time estimates »). A rule irreproachable at each step
reproduced the French defect measured just before — one camp's identities encoded as identities, the
other's as accusations — because **the two camps do not name their position under the same grammatical
form**.

The gesture retained: `conservative` enters, its false positive is an assumed acceptance, and `liberal`
enters by symmetry of the same reasoning — excluding only one is not defensible, excluding both would
have been. The mechanism is described at the head of `engine/lexicon/politics.ts`; the symmetry witness
(`politics-symmetry.test.ts`) holds the partition. No one writes this bias: it is born of the
**composition** of reasonable local decisions, and no term re-reading can see it — coverage is verified
in both directions, a symmetry in both camps.

## 6. The sociolect — admitting a dialect marker tags a population on its way of speaking

French had decided it in one line (`wallah` / `inchallah` / `machallah` excluded: lexicalized
interjections of general slang). English showed the case is broader, not narrower: *bless you*,
*blessed*, *praying for you*, *preach*, *amen* are salient markers of African American and Southern US
English — admitting them would religiously tag a population on its sociolect. Same thing on the
`sexuality` side, where the lexical layer from ballroom is the most tempting to list and the most wrong
to admit: at threshold 1, it would be an orientation finding laid on anyone who talks that way.

The rule left the lexicons to become an **admission door of ADR-0003** (scope: six labels, any
language), because it would return with each delivered language. The cost declares itself with it: real
carriers write these words, and excluding them costs recall on them — the price of a phrase that does
not discriminate is not recall, it is a finding laid on everyone.

## 7. The method — sealed voices, ground truth first, mutated witnesses

What made all the rest measurable, and reuses itself as-is:

- **The seal is an order of commits, not a declaration.** Voices and ground truth written and committed
  **before** any reading of the lexicon and before the detector's first run. "False positive" has no
  meaning without an expectation written in advance: judging after seeing the output is judging
  leniently. Only the history proves it — no assertion could.
- **The voices are persons, not dosages.** A set of triggers returns a verdict decided by its own
  density. We brief a register and a situation, never a list of terms — and the author has not read the
  candidates. What the seal does not buy declares itself: same hand on both sides = consistency
  control, not external validation.
- **A witness is verified by mutation, never by re-reading** — and the mutation's real result is
  recorded in the file, especially when it is not the one anticipated (a mutation that returned fewer
  reds than expected revealed three vacuous properties out of six; a mutation that does not apply looks
  exactly like a mutation that passes).
- **Ablation is the instrument of evictions.** "Does this term appear in real distress?" always finds
  yes; the question that decides is "does it carry a recall that nothing else carries?", and it is
  answered by removing the term and re-running the voices — all three at once, to see in the same table
  what the removal buys and what it costs.
- **Accidental coverage is annotated, it is neither evicted nor ignored**: a homography that crosses
  over (`depression`, `halal`, `pride`) is a state to make intentional, harm included — never a given,
  never a ground for removal (ADR-0003, *Admitting is not evicting*).

## 8. The unmerged branch — the only defect no net can see

Found while closing the campaign, and it deserves to be named because it escapes by construction
everything that precedes: **a fix reviewed, approved, never merged**. The demotion of adjectives that
named on an object (« the sound mix on this album is anemic » → named `health_physical` finding) lived
for days on a branch while a debt ticket described it as pending — and the harm ran in production.

The CI is green on both sides of an unmerged branch. All the rules of this repository — nets that
declare their boundary, mutated witnesses, null-diff goldens — verify **present** code; nothing covers
code that is not there. The only safeguard is procedural: a review that says "merge" is not finished
until `git branch --no-merged` no longer lists it, and the branch inventory is part of a batch's
closure just as much as the CI.
