# ADR-0003: Doctrine of sensitive findings

**Status:** Accepted
**Date:** 2026-06-26
**Decider:** yuya

The other ADRs decide how the product is built. This one decides **what the tool dares to assert, and
what it refuses to assert**. This is the raison d'être.

The catalog of labels, of **recognized readings** and of **testable requirements** lives in
[`docs/constats-sensibles.md`](../constats-sensibles.md), which also keeps the journal of
measurements, precedents and debts. Here lives the **reasoning**: an ADR is the only place where a
decision and its reason freeze together.

> This document rewrites itself: its sections have no number. We refer to them **by their name** — the
> code does so, in comments, and a dead reference does not turn red there.

## What the product asserts, and what it has verified

- **"A platform"** designates the **thesis**. It holds for any platform whatsoever: the point is
  systemic. No platform is the subject.
- **"Measured"** designates what we have **verified**. It stops at **TikTok, in French**, on the
  self-described text portion of an export.

Writing the measurement at the level of the system would promise a scope we do not have; bounding the
thesis to one platform would make a tool against that platform. The reader must be able to tell the
difference.

> **Note (2026-08-05).** Instagram is now a second connector
> ([ADR-0007](0007-le-joint-de-plateforme.md)), and the distinction above is unchanged by it — but it
> is worth reading twice, because the temptation moves. The *thesis* still holds for any platform.
> The *measurement* still stops where it stopped: the sensitive-findings benchmark was run on TikTok
> data in French, and the Instagram connector does not extend it. What Instagram adds is a different
> reading of a different archive, under the same doctrine — not a second measurement.

## Context

A small part of a TikTok export is self-described text readable offline: searches and comments,
**less than X% of the volume**. Can a local classifier read **sensitive labels** there (physical
health, mental health, orientation, politics, religion, conflictual) with few enough errors to display
it, and **where does it systematically fail**? Measured on a throwaway benchmark — 8 synthetic
personas, invented corpus, *realistic ≠ real*. Two results found the rest.

**What the lexicon captures** *(TikTok, in French)* — the explicit and the canonical, false positives
confined to ordinary double-meaning words. This result starts over from scratch in another language.

**What no lexicon will capture — the wall.** Once all the fillable holes are filled, there remain
phrases whose meaning rests on the turn of phrase, with no word to spot: « no futur on finira tous
cramés ». This is **meaning with no word to catch it**: it depends neither on TikTok nor on French,
and changing platform or language would move the examples, not the wall. **This is not a failure: it
is the demonstration** — a platform crosses this step, with its servers, its models and its
**cross-referencing** of purchased data; a local, undersized tool does not cross it.

## The stance — framing decision

- **The limit is part of the point.** That a tool with derisory means already reads certain intimate
  things in so little data — that is the demonstration. What it does not read is a reminder that a
  platform, itself, reads it.
- **Detecting better is an objective, not a tolerance.** The thesis is not "look at what we miss", but
  "look at what we manage to know without having their means". To demonstrate and to detect better are
  **aligned**, not opposed.

**The red line**, and there is only one: improving detection by **hiding the poverty of the means** —
cross-referencing external purchased data, or claiming a precision we do not have. The contrast that
carries the point is *the little we have / what we nonetheless extract from it*: concealing it takes
away from the product what it has to show. As long as the improvement is made **at constant means**
and the limit stays **visible somewhere**, it serves the point.

**The base is the two-tier lexicon**: solid on the explicit *(in French)*, **errors mapped and
bounded**, deterministic, without weight or hosting, offline. Meant to be enriched, each step subject
to the red line.

## The framing — a platform is the author of the finding

**The author of the finding is always a platform.** Every sensitive finding reads *"a platform would
attempt to infer X"*, never *"you are X"* — at no confidence level. Confidence modulates the **force
of the attempt**, never the **identity**: "you are X" changes the subject and costs dearly when it is
false — pathologizing someone, outing them. The finding is therefore stated as a **phrase, without a
subject**, and what protects is not the brevity of the label but its **subject**. No 2nd person, no
verdict, no bare sensitive label without an inference marker. *Properties (a) and (c) of
`engine/wording.test.ts`.*

**Honesty is declared, not structural.** The UI *may* classify readings and display a confidence; the
restraint lives in a warning — "these are suppositions, not certainties" — **in the results area
itself**, and not only at the site's threshold, because a card taken out in a screenshot reads as a
verdict. **The warning is load-bearing**: without it, the tool displays confident verdicts with no
counterpart.

**The "with so little" discourse is centralized, not repeated on each card.** Its two faces — *"here
is what we deduce from the little we have"* and *"here is the notch we do not cross, but that a
platform would cross"* — are presented **together**, in a dedicated pedagogical moment. Stamped on
each card, the mention becomes noise; said once, it is read.

**This proof of the wall is never removed**, and it is **re-aimed** at each level: today the textual
oblique; tomorrow, even with a model, **the content of the videos watched**, which the export never
carries.

## The mechanism — two tiers, and what is never guessed

**Two tiers, for the six labels.** A signal is classified according to its **form**, not only its
presence: **explicit** — the person uses the term that designates the label — → **named** finding,
higher confidence; **indirect** — repeated searches or comments, **no explicit term** → **broad**
finding, low confidence.

**Hard rule: a precise finding appears ONLY if the precise term is present.** Never a named condition
*guessed* by cross-referencing — the fine-grained exists only if it is written. The rule **dissolves
the question of granularity**: precision comes from the **data**, not from the classifier. The
triggering term is **shown highlighted** in the evidence — shown, not guessed.
*`rules/d1-sensitive-topics.test.ts` (B2) and `ui/v2/highlight.test.ts`.*

**"For whom", not "which word".** What distinguishes a *lived* signal from a signal that *does not
concern the person* is not the presence of a clinical word, it is **for whom the signal holds**:
seeking care **for oneself** is a strong signal of lived experience, even without a clinical term;
seeking **for someone else** is a signal-without-lived-experience. The natural mistake is to judge the
*force* of a signal on the presence of a word. **Two axes we do not merge** — named/broad decides *how
to tag*, for-whom decides *to whom the signal relates* — and **a signal can be strong *and* broad**.

**The bio is a strong signal.** What is **claimed** — flag, badge, displayed self-label — is an
assumed self-designation: explicit, never "indirect". We do not under-classify a strong signal for
lack of a spelled-out phrasing.

**`conflictual` exception: no indirect tier.** Insults **emitted** *are* the explicit signal. The
door stays "emitted ≠ quoted" **and** "targeting another user" (a curse with no target does not
count). `conflictual` is **item-level**: a trait carried by precise messages, not a diffuse state —
forcing an indirect tier on it would amount to judging a character by accumulation of clues.
*`detect/detect.test.ts`, `rules/d1-sensitive-topics.test.ts`.*

## The admission of a term — hyperbole steps aside at the door

A lexicon encodes a dangerous sentence: *"this phrasing justifies naming someone"*. That judgment
**does not survive translation**. Four distinct movements play out here, and half the re-decisions of
this repository come from having confused them: **admitting** (a term we do not have), **evicting** (a
reminder that exists), **demoting** (keeping the signal, removing the assertion), **annotating**
(recording a coverage we did not decide).

### Admitting — dominant usage decides

**Rule, for the six labels and any language:** a term enters only if its **dominant usage in the
target register** — that of social networks, not that of the dictionary — is **literal**. A term whose
dominant usage is conventionally **hyperbolic** is **excluded**, never demoted to the colloquial tier.

*Reason, and this is what makes the rule non-negotiable:* demotion rests on the repetition threshold,
and **the threshold does not filter hyperbole**. A **polysemous** term has several meanings, one of
which is the right one, and its repetition **is** a signal — the threshold works. A **hyperbolic** term
has a conventional meaning that is **not** the literal meaning: someone who writes "i'm dying" three
times has laughed three times. **The threshold does not exclude — it accumulates**, and it turns the
most expressive speakers into presumed carriers. *`detect/en-fp-bench.test.ts`, whose `hyperbolic`
allowlist is empty: if it repopulates, a hyperbolic term has come back.*

**The colloquial tier stays the home of polysemy and of literal low register. It is not a relegation
zone for dubious terms.**

**Corollary — tiering by cost of error.** When a batch opens a terrain whose false-positive rate is
**not measured**, the forms with **maximal cost of error** — vital distress first and foremost — are
delivered **separately and later**, never in the same batch as the label's ordinary vocabulary. A
label demonstrates itself very well without them: restraint costs little pedagogy and removes the only
irrecoverable failure mode. This deferral is a **named debt**, recorded where debts are read — not a
silent omission, which would reopen by accident.

**The disease name turned insult — second door, and it is not hyperbole.** A serious disease name that
the target register makes into a **generic pejorative qualifier** does not enter **bare**: only its
**carried** forms enter — the possessive, the phrase that attaches the condition to someone. Hyperbole
**inflates the speaker's state** ("i'm dying" speaks of the one who writes it, and is wrong about their
intensity); the insult **applies the disease to a third party or an object** ("this meme is cancer"
does not speak of the speaker, and is wrong about the **subject**). The first produces a false, overly
expressive carrier; the second tags someone who said nothing about themselves, and it **overlaps
`conflictual`**, where the same sentence would be correctly read. **Scope: the six labels.**
*`detect/lexicon-battery.test.ts`, with its anti-vacuity control — the carried form, itself, tags.*

**The sociolect marker — third door, and it is the one that will return with each language.** A phrase
whose dominant usage is **phatic** — it performs a social act (condolence, emphasis, gratitude,
agreement, greeting) instead of **designating** anything of the domain — does not enter, however marked
its etymology. The test is that of the **referent**: *does this term point to a thing of the domain?*
"thoughts and prayers" names no prayer; it performs a sympathy.

*First reason, and it derives from the demonstration principle rather than contradicting it.* The
principle protects the term that triggers on carriers AND non-carriers. Its limit-clause holds the
other end: the line passes between **a term that discriminates poorly and a term that does not
discriminate at all**. A phatic phrase is the exact limit case — everyone writes it, carriers and
non-carriers in equal parts. It does not discriminate poorly: it does not discriminate. And the bar
that holds it back is that of **admission**, never that of eviction: refusing to add is not removing.

*Second reason, independent, and the stronger of the two.* These phrases are massively **sociolect
markers**, and admitting them would amount to tagging a population on its way of speaking rather than
on what it says. The decision is already made in French — `wallah / inchallah / machallah` excluded
from `religion`, *"do not tag a population on its sociolect"* — and English provides a far broader
layer of it: `bless you`, `blessed`, `praying for you`, `preach`, `amen` are salient in African
American and Southern US English. The two reasons converge on the same exclusion; **the second holds
on its own**, and it is the one that must be cited when a phatic term is also a group marker.

*The cost, and it declares itself.* Some of these phrases are written by real carriers. Excluding them
costs recall **on carriers**, and that is assumed: the price of a phrase that does not discriminate is
not a recall, it is a finding laid on everyone.

**Scope: the six labels, and any language.** A tier corollary follows from it and does not inherit from
one language to another — the colloquial tier is the home of **marked** phrases, hence designating.
Where a language carries the essential of its religious or identity layer in **unmarked** phrases, the
tier changes meaning there and **does not transport**: this is the case of English on `religion`,
which therefore has no colloquial entry.
*`detect/religion-symmetry.test.ts`, phaticity guard — which further verifies by which PATH the zero
arrives.*

> These rules bear on **what enters**. They touch neither the threshold (which is not a safety lever —
> see *The door, not the threshold*), nor the wall: they catch no oblique.

### Admitting is not evicting

The bar is not the same at the two doors. Refusing a term at the entrance costs **no recall**: we
never had its own. Evicting a term **already ratified** costs a recall that **exists**, on people the
product detects today. Requiring the same thing on both sides is a category error.

**A term in place is not removed by doctrine; it is removed by measurement.** And the measurement is
not "does this term appear among concerned people?" — phrased that way, it always finds yes. The
question that decides is: **does this term carry a recall that nothing else carries?** It is answered
by **ablation** — remove the term, look at who disappears. **The voice that decides is the one that has
only it**, never the one that has other nets. When the ablation shows a unique recall, the term
**stays**, and its false positive becomes a **measured acceptance**: recorded as such, **with its
instrument**, never left in silence. *`detect/fr-colloquial-ablation.test.ts`; precedents in the
catalog.*

**The false positive is NOT a ground for removal.** A term that triggers on carriers **and** on
non-carriers **stays**. Its error is not a defect of the product: it **is** the product — the tool does
not claim to say the truth about someone, it shows what an algorithm would deduce, and an algorithm
that is wrong is precisely the subject. Masking these errors would make the demonstration less
faithful, and chasing false positives would cost so much recall that nothing would be left to
demonstrate. **Holds for the six labels.**

*The limit, and it is sharp:* a term that triggers only on **non-carriers** goes away. That one
demonstrates nothing — "the pros and **cons**" tagged conflictual teaches nothing about algorithmic
inference, it exhibits a substring artifact. **The line does not pass between "few" and "many" false
positives: it passes between a term that discriminates poorly and a term that does not discriminate at
all.**

*And this judgment bears on the SEMANTICS of the term, never on the count of a benchmark* — a few
voices return circumstantial zeros, and reading the table instead of the term removes healthy forms.
A textbook case and candidates for the catalog.

*Corollary, and it avoids a misreading:* **tolerance to the false positive does not vary from one label
to another.** What varies is the right to **assert**, which the named tier carries and the broad tier
does not have. A "more sensitive" label does not deserve a narrower lexicon — it deserves, where
appropriate, to **assert less**.

### Demotion — neither admission nor eviction

A delivered term can change **tier** without leaving the lexicon: demotion **keeps the signal and
removes the assertion**. Its bar is therefore **lower than that of eviction** — nothing is lost, only
the force of what is said changes. A demoted term **still displays its triggering**: the demonstration
survives whole, and a demotion **does not reopen** under the false-positive rule, having removed
nothing. **It is therefore the right tool when the discomfort bears on the ASSERTION, and removal is
not.**

*What it targets:* the terms whose literal usage is **real and common**, but whose common usage has
colonized the form to the point that the **assertion** is no longer justified — a bare disorder name is
the textbook case. **Distinct from the admission rule**: here the literal usage has not disappeared, it
is the right to **name someone** that has disappeared. One decides whether a term enters, the other
what it is allowed to assert once it has entered.

*What opens it:* a **measurement** — one non-carrier voice receiving a named finding suffices.
*What delivers it:* an **ablation**.

*The stopping case, and it must be written rather than assumed:* to demote does not mean "the finding
becomes broad". It becomes broad **if the rest of the text still crosses the indirect-items threshold**
— a threshold that equals **2** for ratified lexicons. Below that threshold, an **isolated** utterance
does not become broad, it **disappears**: a person who writes, once, literally, what they live. If they
lose their finding, the demotion reopens — or is delivered in a **tier that dispenses with the
threshold without allowing naming**. *Operational suspicion on the instrument:* an ablation conducted
on **personas** returns **false** green lights, the neighborhood catching the fall of a term — hence
the imposed order, **measure the isolated utterance BEFORE the voices**. *Both held by
`detect/en-demotion-ablation.test.ts`, which also freezes the false green.*

### Annotating accidental coverage — free only under condition

A lexicon written for one language covers another by homography, without any decision having willed it.
The gesture that follows has become a reflex: **annotate** the entries that cross over, "without
changing a line of behavior".

*"Zero change of behavior" is true of the CURRENT state of the detector, not of the state afterward.*
When a label requires **two** conditions to tag — `conflictual` demands an insult AND a 2nd-person
target — the accidental coverage can be **complete on one side and null on the other**. It is then
**latent, not live**: FR entries matched ordinary English there ("the pros and **cons**") without any
tagging, the second list having stayed French. Annotating cost nothing there **as long as the door
stayed closed**, and cost false positives **the day the next batch opens it** — that is, at the precise
moment when no one re-reads the annotation anymore.

**Before annotating, look by which conjunction the label tags**, and distinguish a *live* coverage (it
produces findings today: annotating it records a **state**) from a *latent* coverage (it would produce
them: annotating it records a **debt**). The second is not annotated like the first — it is **named,
with what will activate it**. **Scope:** the six labels, and any form of aggregation that requires more
than one condition.

## The limit the data does not lift — and why it is not handled with a filter

The rules above decide **what enters** and **at which tier**. This one names a case where none can
decide, because **what would decide is not in the export**: "you're such an idiot" between friends and
the same words aimed at a stranger are **the same text**. What separates them is the **relationship** —
and an export comment is half of a conversation.

**This is not the wall, and confusing them would make one search in the wrong place.** The wall is
*meaning with no word to catch it*. Here the word is there, spelled out, correctly spotted: what is
missing is the **context that gives it its value**. A richer lexicon does not catch the wall; here it
**worsens** it, each added term adding its share of ambiguity without bringing anything to lift it.

**The rule, valid for the six labels:** when the discriminant of a signal is **not** in the export, it
is handled **neither by a filter nor by a threshold** — both work on the text, and the text does not
carry it. It is handled by the **admitted volume**: the lexicon restricts itself to the register whose
intended reading is the dominant usage, and the residual harm is recorded as **assumed acceptance**.

*And the distinction between two words that everything pushes to confuse must be held:* a **measured**
acceptance comes with its instrument; an **assumed** acceptance does not have one yet. Writing
"measured" when the instrument does not exist is exactly the over-citation this repository pays for
seven times — the word closes the discussion by promising a figure no one has. **As long as the
instrument is missing, the word is *assumed*, and the passage to *measured* is a dated event.**

## The informational register — to inquire is not to live

The previous rule decides what enters. This one decides **at which tier** an admitted term is allowed
to settle.

**The rule, valid for the six labels and any language:** an item written in **informational register**
— it *inquires about*, *defines* or *quantifies* a condition, instead of describing it in someone — can
produce a **broad** finding, never a **named** finding. Searching for a symptom **is** a signal, which
a platform reads and which the product must therefore show; it is **not proof of a lived condition**,
and the product has no right to assert one. Hence a lowering, not a removal.

**This is not a filter, and implementing it as a third filter is forbidden.** A filter answers "does
this finding exist?" and, when it is wrong, **removes real signal**: it fabricates a blind false
negative, which nothing signals afterward. A tier rule answers "at which tier?" and, when it is wrong,
**under-asserts**. The two fail in opposite directions, and **only one is recoverable**.
*`detect/detect.test.ts` and `detect/health-physical-storey.test.ts` verify that the item **survives**
— the "not a filter" half is measured, not commented.*

**Why not first-person anchoring, which seems cleaner.** Requiring a copula ("I am X") was **measured,
and discarded**: someone living the condition types the same documentary turns of phrase as a relative.
The anchoring would therefore degrade **the concerned person too**, and would trade an over-assertion
for a silent under-assertion on the one who has the most to lose.

**This rule is distinct from the *for-whom* axis, and the two do not replace each other.** The 3rd
person says **for whom** the signal holds; the informational register says **in what form** it is
written. An item can carry both, or one without the other — and it is the second case that made the
rule necessary. Its origin says its scope: a measurement made in English found a defect verified
afterward in French, in production. **The rule is written for the machinery, not for a language.**

> **What the rule does not close**, and which must stay visible: the **assertive** register ("le
> burnout est un phénomène lié au travail") and the **technical** register (a clinical scale name) are
> neither interrogative nor possessive. They continue to produce named findings on professional voices.
> Covering them supposes the first-person anchoring discarded above. The residue is named rather than
> closed off crookedly.

## State and subject — what negating means

The two previous rules decide what enters and at which tier. This one names a distinction between
**labels** that nothing forced us to see as long as we were only looking at conditions — and which,
unseen, produced a directed silence in the delivered product.

**Four of the six labels describe a STATE** — a condition, a body, an orientation, a behavior. **Two
describe a SUBJECT one frequents**: `politics` and `religion`. The difference is not philosophical, it
decides what negation means.

- On a **state** label, negating the predicate **removes the signal**. « je ne suis pas déprimé »
  describes no depression: the negation filter is right, and it protects exactly what this doctrine
  exists to protect.
- On a **subject** label, negating the predicate **does not remove the subject**. « je supporte pas
  les fachos », « jamais de manif pour moi », « je ne vais pas à la messe » are **about the subject**,
  and negation gives its **polarity**. A platform reads them as such — it is even the most abundant
  material it has.

**The rule:** on a subject label, a negation before a marker **degrades** the hit to a broad finding
instead of suppressing it. **It is a tier rule, not one filter fewer** — and the distinction is the one
already laid down, that of the informational register: leaving the negation intact would lay a
**named** finding on « je ne suis pas socialiste », that is, would assert precisely what the sentence
negates. Degrading keeps the subject and removes the assertion; at worst, the rule **under-asserts**,
which is recoverable.

**Why it is a question of neutrality, and not of recall.** **Opposition is the dominant register** of
political and religious discourse: one rarely writes to say one's camp, constantly to say what one is
against. A detector deaf to opposition therefore hears only **the one who adheres** — and that is the
selective silence this doctrine condemns elsewhere in so many words (*Uncertainty*, neutrality). It was
delivered: measured, « ces fachos partout » tagged while « je supporte pas les fachos » tagged nothing,
and the **practicing ↔ critical** axis of `religion`, though ratified bidirectional, was mute on the
critical side.

**What the rule does not catch**, and which must stay visible: French **infixes** its negation (« je NE
vote PAS »), which breaks multi-word markers in the **spotting**, before any tier rule is consulted.
The rule reaches one-word markers and non-infixed phrases; it fabricates no recall where the matcher
found nothing. And it does not touch the wall: a critique without vocabulary of the subject has no
marker to degrade.

> **Scope: the two subject labels, never the four others.** A batch that extended the rule to a state
> label would lay condition findings on people who write that they do not have it — the exact failure
> mode the negation filter exists to prevent. *`detect/lexicon-battery.test.ts` holds both halves, the
> rule **and** its counter-proof on the state labels.*

## The symmetry of an axis — and the labels that have none

The previous rule distinguishes the labels by what negation means in them. This one names a distinction
**between axes**, made necessary by a symmetry batch that nearly applied it mechanically to the six
labels.

**The rule, ratified:** a belonging lexicon is verified **on BOTH sides of its axis**, never by
counting the terms of only one. A majority self-declaration — « je suis hétéro », « je suis cis » —
must **trigger exactly as much** as its minority counterpart. *The foundation:* a lexicon that catches
only minority identities is a **minority detector**, not an orientation detector, and its demonstration
**inverts** — it claims to show what a platform deduces about everyone while deducing only about some.
It is the `politics` defect (the left encoded as identity, the right as accusation) in its purest form.

**But the rule does not apply where the axis does not exist, and applying it anyway FABRICATES the
defect it exists to prevent.** The test holds in one question: **does the majority term name a
belonging, or the ABSENCE of the thing detected?**

- `sexuality` — `hétéro` names a **real orientation**, `cis` a **real identity**. Axis. The rule
  applies.
- `politics`, `religion` — **subject** labels: both sides, both poles of belief hold a **position** on
  the detected subject. Axis. The rule applies.
- `mental_health`, `health_physical` — **no axis, and one must not force one.** `valide`,
  `neurotypique`, `entendant`, `en bonne santé` do not name a belonging: they name the **absence of
  the detected condition**. Admitting them would lay a condition finding on someone who writes they
  have none — very exactly the failure mode the negation filter exists to prevent, and which the scope
  rule above already forbids.
- `conflictual` — moot: its door is the emitted insult, which is not an identity.

*Why write it here rather than in a lexicon:* the symmetry rule is **seductive to apply mechanically**,
and the mechanical gesture produces a defect more serious than the one it corrects — laying a condition
on a non-carrier costs more than not detecting a non-belonging that no one writes. The batch that
ratified the rule nearly committed it; the next one will if nothing stops it here.

*And the corollary that decides the FORM of a repair:* what is verified is not the **count** but the
**redundancy margin** — how many independent paths lead to a finding from each side. A table balanced
in columns can stay asymmetric in paths; that is what the `politics` batch measured, and its coarse
symmetric axis saved one voice while hiding the defect from all the green counters. A symmetry is
therefore **never declared globally**: it is declared **per path**, and the paths that stay unequal are
published next to the green.
*`detect/sexuality-symmetry.test.ts`, `detect/religion-symmetry.test.ts`,
`detect/politics-symmetry.test.ts` — each declaring the path it holds and those it does not hold.*

> **What the rule does not promise:** a side can be **admitted and never trigger**. Measured on
> `sexuality` in French — the four majority terms add no finding on any sealed voice, because **no one
> declares their heterosexuality**. The rule bears on what the lexicon **can** read, never on what the
> corpus **writes**: rarity of usage is a reason to expect no gain, never a reason not to repair. A
> witness that let one believe in a parity of **effect** would lie.

## Uncertainty, and the plurality of readings

**Three states of ground truth, not two.** For each (person × label): **lived** (tag expected) ·
**signal-without-lived-experience**, a real signal but not concerning the person (**tag also
expected**) · **real non-carrier**, no real signal, just text that has the form of one → **no tag**.

**A tagged signal-without-lived-experience is not a false positive — it is the demonstration.** When
the tool tags "mental-health interest" on someone searching for their teenager, it is not wrong: **the
platform does not know "for whom" the signal holds, and it tags anyway**, and that indistinction is
precisely what we show. The only harm to count is the **tagged real non-carrier**, hence **two separate
counters, never added together**: the signal-without-lived-experience volume (expected **high** —
wanted) and the harm (wanted **low**). *`detect/register-bench.harness.ts`, in three distinct
assertions.*

**A sensitive finding does not have a single valid reading, and it is the axis, not the exception.**
When the classifier tags "religion" on « le calme d'une vieille église m'apaise », it did not commit a
technical error: it **decided a real ambiguity** that no data allowed to decide. **The harm is
therefore not always to have *seen* an absent signal; it is sometimes to have chosen one reading where
several coexisted.** Religion is not "practicing" only: it is the **practicing ↔ critical** axis. *The
tool's role is to show this plurality, not to resolve it in the person's stead.*

**A fan of readings, ordered or tied — never quantified.** A piece of evidence can carry the possible
readings of the same signal, with an **explicit mode**: `ranked` (one reading dominates) or `equal`
(none privileged). The fan attaches to **one piece of evidence within a finding**, not to the global
finding: two pieces of evidence of the same finding can carry different fans. An explicit finding **at
high confidence** does **not** have a fan.

**The named finding carries a `ranked` fan.** Not giving it one would suppose that the named tier
**resolves** the ambiguity; it resolves only one, the **lexical** one — *which* subject is at stake —
and says nothing of the **why**: « témoignages burn out » spells out the term and remains a search for
testimonies, where lived experience, relative and curiosity all stay open. **To search is not to
declare.** `ranked` expresses exactly that — writing the term about oneself **shifts** the likelihood
without **closing** the rest; `equal` would be false there.

**The lock, non-negotiable:** confidence lives on the **finding**, **never per reading**. No weighting,
no percentage, no color per reading: `ranked` **orders, it does not quantify**. Weighting a motive
would amount to **classifying the intention**, which the machine cannot do. *`engine/readings-invariant.test.ts`,
at runtime and at type; attachment to evidence by `engine/claim-fan-invariant.test.ts`.*

**Neutrality: do not inscribe a moral bias in the silence.** A tool that detected "believer" but
prudishly refused to detect "virulent critic of religion" would take a **position** — it would treat
faith as data and anti-clericalism as a taboo. A platform infers one as well as the other. **Selective
silence is a disguised judgment.**

**The fan is for what the data carries in double, never for what it does not carry.** It is legitimate
when **several readings really coexist in the person**: « le calme d'une vieille église m'apaise » *is*
a cultural appreciation and *may* be a practice — the data carries both. It is illegitimate when the
discriminant is **absent from the export**: the one who writes « t'es qu'un abruti » *knows* whether
they are addressing a friend; it is not ambiguous for them, it is absent for us. **Dressing "we cannot
know" up as "here are the legitimate readings" fabricates a false plurality** and gives an
**inability** the appearance of nuance. *The test, in one question:* is the second reading **in the
data**, or in what it lacks? A fan in the first case; in the second, the answer is the **admitted
volume** and the harm recorded, never a fan.

**"Several readings" is not "everything is equal".** A purely metaphorical reading — « marché déprimé »
— is not an interpretation to respect: it is the real non-carrier, and it stays a harm to count.
Plurality does not dilute the harm, and it displays itself without weighting.

**The register of readings lives in the catalog**, label by label: the ADR freezes the **principle**,
the catalog keeps the **journal** — because plurality depends on the theme, and the axis of religion is
not that of mental health.

## Evidence is cited, and its reuse is shown

Each finding carries its **expandable source items**, and the page shows when the same item feeds
**several** findings ("also exploited by…"). *Reason:* it is the product's most concrete argument —
seeing an innocuous phrase feed both a health finding and a life-rhythm finding shows, without anything
to explain, how a platform presses each crumb in several directions. Visible reuse is not a display
optimization: it is what makes the extraction tangible.

**Memory bound:** only the items **actually cited by a finding** transit engine→UI. The volume is
bounded by the **number of findings**, not by the size of the export — ADR-0002's invariant holds.
*`rules/d1-sensitive-topics.test.ts`: the non-carrier never appears.*

## What carries safety: the door, not the threshold

A sensitive finding **starts folded**, behind a header carrying a **"sensitive"** badge. Opening is a
gesture. **The fold is the door of consent; the badge says what is behind it.**

Protection comes from there — from the fold, the badge, the fan of readings and the visible confidence
— and **not from the detection threshold**. The statement has two halves, which hold separately:

- **The door protects against the unconsented glance** — a card seen over the shoulder, a screenshot, a
  demo. The fold fills this function, the badge makes it informed.
- **Raising a threshold would make the display of the sensitive *heavier* — reserved for the sharpest
  cases — without making it safer.** Under the fold, the threshold only decides **how many cards
  appear**; each is already behind a door. Fewer-but-sharper adds no safety, and removes from the
  demonstration.

**Flat treatment on the six labels, `mental_health` included.** No gradation: the six are behind the
same door. A graded treatment will reopen with the **abuse / sexual-violence framing**, deferred to R&D
and not decided to this day. **Until then**, a notch of protection reserved for one label would be an
arbitrary decision, and this doctrine exists so as not to carry one.

## Options discarded

Each has been considered; the reasoning lives in the cited section.

- **The sensitive as a sentence, or as an identity verdict**, at any confidence level. *(The framing)*
- **Every false positive treated as waste** — the tagged signal-without-lived-experience *is* the demonstration, and some false positives are **alternative readings, not bugs**. *(Uncertainty)*
- **Removing a term because it produces false positives** — only the one that triggers ONLY on non-carriers goes away, and on semantics, not on a count. When the discomfort bears on the assertion, the tool is demotion. *(The admission of a term)*
- **Giving a fan to an inability** — discriminant absent from the export: saying so is the only honest answer. *(Uncertainty)*
- **The detection threshold as a safety lever** — costs demonstration without buying safety. *(The door, not the threshold)*
- **Selective silence as a neutral stance** — detecting only one face of an axis is a moral bias. *(Uncertainty)*
- **An improvement that would hide the poverty of the means** — the red line. *(The stance)*
- **Demoting a hyperbolic term to colloquial** — the threshold accumulates hyperbole instead of filtering it. *(The admission of a term)*
- **Applying the admission rule to eviction** — a term in place is removed on ablation, not on doctrine. *(The admission of a term)*
- **Delivering vital distress in an unmeasured batch** — maximal cost of error is delivered separately, its deferral recorded as debt. *(The admission of a term)*
- **The disease name turned insult treated as a hyperbole** — the insult applies the disease to a third party and belongs to another label. *(The admission of a term)*
- **Annotating a LATENT coverage as a live one** — under a conjunction, the annotation records a debt, not a state. *(The admission of a term)*
- **Handling with a filter a discriminant absent from the export** — the text does not carry the relationship; the answer is the admitted volume. *(The limit the data does not lift)*
- **The informational register as one more filter** — a filter fabricates a blind false negative; a tier rule under-asserts, which is recoverable. *(The informational register)*
- **Treating negation the same way on the six labels** — on a SUBJECT label it carries polarity, not the absence of subject, and suppressing it makes the product deaf to opposition, hence to the only camp that does not adhere. *(State and subject)*
- **Exempting the negation instead of degrading, on a subject label** — would lay a NAMED finding on a sentence that negates. *(State and subject)*
- **Applying the symmetry rule to a label without an axis** — `valide` / `neurotypique` name the ABSENCE of the detected condition, and admitting them would lay a finding on whoever writes they have none. *(The symmetry of an axis)*
- **Verifying a symmetry by the COUNT** — a table balanced in columns stays asymmetric in paths; what is measured is the redundancy margin, per path. *(The symmetry of an axis)*
- **Requiring first-person anchoring** — measured: it would degrade the concerned person too. *(The informational register)*
- **Believing that a better lexicon will resolve the oblique.** This one deserves its lines, because it
  will present itself again: enriching the lexicon **pushes back the frontier of the explicit** but
  **will never resolve the pure oblique** — « no futur… » has no word to add. The day someone proposes
  one more lexicon to fill the wall, this is where to come back.

## Consequences

**Opens:** a shippable base — the two-tier lexicon, bounded, deterministic, without weight or hosting;
a **testable** display doctrine, translated into verifiable properties in
[`docs/constats-sensibles.md`](../constats-sensibles.md); a plurality of readings extensible label by
label **without reopening this ADR**; a proof of the wall re-aimable at each level.

**Costs:** the stance rests on two pieces of UI, and each can fall silently. The **warning** is
load-bearing — without it, the tool is a displayer of confident verdicts. The **fold** is just as much:
the day a sensitive card were to display unfolded by default, it is not a display detail that gives
way, it is the door of consent.
