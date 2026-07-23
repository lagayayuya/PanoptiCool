# ADR-0004: The engine returns ONE named value

**Status:** Accepted
**Date:** 2026-07-16
**Decider:** yuya

This ADR carries a **movement**, and it is the movement that is the information: a generic
architecture was laid down, tested, then brought back to what the product actually reads (−2,344
lines). Both states are written here because the second cannot be understood without the first — and
because the rule that emerges from it is only worth anything if one knows what it cost.

## 1. Context — the generality laid down, and its reason

The engine had to return the result of its analysis to the UI. The original contract was **generic**:

- an `Insight` union discriminated by a nature (`kind`), the rule identity carried as **data**
  (`ruleId`) rather than as a type — so that adding a rule does not add a type;
- the wording moved out of the engine behind template references (`{templateId, params}`), so that
  **the engine emits sense to be dressed** and the UX rephrases without touching the rules;
- a registry of homogeneous rules `(input) => Insight[]`, composable;
- a shared **evidence store** — "stored once, referenced N times" — and a graded sensitivity axis;
- a first-class theme, carrying its own `sensitive` flag.

**Each of these layers was justified at the moment it was laid down**: they opened up a space that
the product was, we believed, going to occupy. It was not over-engineering on principle — it was a bet
on a variety of findings to come.

The bet did not materialize. The redesign of the display decided otherwise, and **no one repatriated
the consequence into the schema**.

## 2. What the measurement found

The inventory was **re-derived from the screen**, file by file, rather than assumed. For each thing
the engine emitted, we looked for who read it:

| What the engine emitted | Real readers, measured |
| --- | --- |
| a framing (`framing`) on EVERY finding, required by the schema | **none** |
| the aggregate's label and confidence | **none** |
| the label, confidence and example signals of 4 rules | **none**: the card only reads a counter |
| the "high" confidence level | **no producer** — never emitted |
| the graded sensitivity axis | a single producer, **always** the same value |
| the theme's `sensitive` flag | a single reader, **always** `false` |

**Three gradation axes to express a binary distinction.** A `ruleId` that the UI reinterpreted via a
table to re-guess what the engine already knew. And a store indexed by identifier that had produced a
measurable stringly-typed coupling: re-parsing a string key to recover a source index — with, as a
bonus, a silent `NaN` on every piece of evidence from a channel.

**The problem is not generality. It is generality WITHOUT A REQUESTER**: code that runs, tests itself
and is maintained for no one, and that makes every reader pay the price of an indirection nothing
depends on anymore.

## 3. Decision

### The engine is ONE function that returns ONE named value

`analyze(input) => Analysis`. Each field of `Analysis` has a **named reader, observed on the
screen**: `rhythm`, `volumes`, `opacity`, `themes`, `signals`. **No speculative field.** The field IS
the name: there is nothing left to route.

Gone: the `Insight` union, `ruleId`, the rule registries and their composition, the output envelope,
the schema version, and the dev-only assertion net — a runtime safeguard on a shape that the type now
holds on its own.

> **The composition rule, to hold over time:** a field enters `Analysis` only if a reader renders it.
> A datum without a scene is not added "in anticipation" — it waits to be designed AND rendered.

### Evidence is a direct reference — the store is removed

A piece of evidence carries its channel, its source index and its verbatim, **on the finding that
cites it**. The identity is a **pair of data**, no more a string to fabricate then re-parse.

**The verbatim duplication is ACCEPTED**: a few dozen short strings duplicated when two findings cite
the same source. That is the price, measured and knowingly paid, of removing the stringly-typed round
trip.

The **visible reuse** — "also exploited by", which remains the tangible argument of ADR-0003 — is not
lost: it is **recomputed at render time**, keyed on the same pair. It is derived, so it is derived;
storing it was a choice, not a necessity.

The **memory bound** of ADR-0003 (only the cited text crosses the engine→UI boundary, never the read
graph) still holds — and now **by construction** rather than by discipline: with no store to fill, a
crumb exists only as carried by the finding that cites it.

### The sensitive is a discriminant, no more three axes

```ts
type Deduction = { claim: string; evidence: Evidence[] } & (
  | { sensitive: true;  confidence: 'low' | 'medium' }   // `high` FORBIDDEN at compile time
  | { sensitive: false; confidence: 'low' | 'medium' | 'high' }
)
```

The three degenerate axes merge into a discriminant that, it, **varies**. **The sensitive's ceiling
is no longer held by a test or by a parameter type — the type says it.**

**INTENDED consequence:** the non-sensitive *may* carry "high". No rule emits it; "solid" is therefore
**removed from the UI legend** — a legend without a referent promises a gradation that the page does
not render. To allow is not to produce: the type keeps the door open, the legend will come back
**designed** the day a rule reaches it.

The factual is no longer a finding: it is `volumes` and `rhythm`.

### Themes and sensitive signals are separated

Separation **enacted, not endured**: no theme is sensitive, no sensitive finding has a theme — the
two populations are disjoint **by construction**. Assumed: a sensitive subject is not an interest
among others; mixing them would flatten them.

**Written here rather than discovered later:** grouping a sensitive subject under a theme would
require re-touching the type. It is a choice, not a fatality.

### The engine emits TEXT

`Analysis` carries texts. The template layer — references, catalog, rendering, per-rule allowlists —
is removed. **The wording lives in ONE file**, and each label there is a **named and typed export**
that the producer imports.

**What the switch buys, concretely:** a missing or misnamed label is a **compile** error, where an
erroneous template reference used to render "[template missing]" at runtime; and a counter is a
`number` required by the signature, where a key resolution used to render "?" silently. In return,
**the UI stops importing the engine**: it renders texts, it no longer resolves them.

**Exception, forced and bounded:** the labels of themes, uses, actors and readings are chosen on
**open** keys carried by the lexicons. The lexicons being untouchable and the wording having to fit in
one file, the lexicon keeps its key and the wording resolves it — a resolution **internal to the
engine**. Exhaustiveness there is **test-only**, and that is its real ceiling: holding it at the
compiler would require retyping the lexicon. Those tests are the **only** net over ~110 keys — the
golden covers only the themes the persona exercises.

## 4. What does not move, and dates from before the movement

**Validation lives at the untrusted boundary — the input — not on our own output.** A platform's JSON
is the data we do not control: that is where a runtime validator earns its place. Validating the
output we build ourselves would put a validation runtime on the wrong trust boundary, and would make
the client pay the weight of a check the compiler already holds. This decision is **prior to the
movement, and it survives it intact.**

**The ethical safeguard does not live in the type.** A type guarantees that a framing *exists*, never
that it is *right* — it lets through an empty, botched framing, or one sliding toward a verdict. The
safeguard lives in the rule definitions, in property tests, and in human review (ADR-0003).

**The lexicons and the detection are untouched** by this movement: neither the doctrine nor the data
moved.

## 5. The framing removed, and the obligation that remains

The `framing` required on every finding is removed: the schema demanded it of every rule, **the
screen never displayed it**.

**But it carried a proof.** A tested property — "the subject is the platform" — applied to those
framings. In other words, **a doctrine obligation was proven on text no one read**. Removing it
without a counterpart would not have removed dead text: it would have removed a proof.

That property could not be transferred as-is onto the displayed label: the ratified claim is a phrase
**with no subject** ("Indirect signal associable with mental health") — requiring it to name the
platform would have reopened the wording. The net that survives is the property "**never a verdict on
the person**", on the text actually displayed.

**Non-negotiable condition, held BEFORE the removal:** that property was first **broadened**. Its
original version anchored the assertive form on a single lexeme only — a verdict carried by another
subject ("user is a crypto enthusiast") slipped through. The hole was covered as long as the framing
property held; the latter becoming the only net, it had to be filled first. Two **negative controls**
now pin down the net itself — it bites on the hole, it does not bite on the ratified form — and **no
label was rewritten to make the test pass**: rewriting the prose to green a safeguard would trade a
proof for a regression.

## 6. Options discarded

**Keeping the generality "just in case".** It is the default option, and the most tempting: the code
worked. Discarded because it confuses *option* and *asset* — an indirection without a requester is not
a free option, it is a cost paid at every read, every test, every modification.

**A runtime validator on the engine's output** (`zod`, `valibot`). Runtime guarantee, schema → types.
Discarded: wrong boundary (§4), and shipped weight to validate what we build ourselves.

**A versioning and migrations apparatus.** Discarded: producer and consumer are co-built. A drift
golden catches the problem better than a version field, and without apparatus.

**A type per rule**, rather than the rule identity as data. Discarded at the time — then rendered
moot: there are no more rules to identify, there are named fields.

## 7. Consequences

**Good ones.** The UI→engine dispatch disappears — the UI no longer imports the engine. The re-parsing
of keys disappears, **and** its silent `NaN` with it. Three apparatuses disappear from a card without
a pixel moving: a table of short words (→ the wording), the inverse of an allowlist (→ the engine
names), and a defensive fallback (→ the type guarantees the name). A chart component goes from 257 to
58 lines: it no longer had any mount, and it was the **last reader** of a graded nocturnal framing,
which therefore leaves with it — if it returns: designed AND rendered.

**Costs, assumed.** The verbatim is duplicated between co-citing findings. **The generality is lost:
adding a finding nature requires adding a field AND its reader — that is the goal, not a side
effect.** The confidence ceiling of the non-sensitive is no longer held by the type but by an explicit
rule decision.

**The net.** An end-to-end render golden — zip → ingestion → rules → rendering, **persona included on
purpose**: the sample zips exercise neither the sensitive findings nor the themes — at **strictly null
diff**, with the exception of the removed legend's lines, isolated in their own commit.
