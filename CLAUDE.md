# CLAUDE.md — PanoptiCool

Conventions and invariants of the repo. Written for AI agents; the rules apply to everyone.
For what the product is and how to launch it, see [`README.md`](README.md) — this file does not
recopy it.

## The product, in one sentence

PanoptiCool reads the data export a platform hands over to its user and shows them what an algorithm
could deduce from it: the point is a demonstration of the system, never a verdict on the person.
TikTok is the **first connector**, not the subject.

**Two objectives arbitrate, and they are not finishing touches** (the README develops them — here,
what they impose):

- **Education.** The goal is for the person to *understand* what is deduced and how. A correct
  deduction that no one understands has missed its target: clarity is part of the function, not of
  the packaging.
- **Accessibility.** The tool aims at the greatest number, not the initiated. When an elegant
  technical solution costs the reader clarity, it loses — and jargon is never the price to pay for
  correctness.

These two are held to mind above all at the moment of arbitrating: they settle the cases where « c'est correct »
and « c'est compréhensible » don't point in the same direction.

## Stack

- **`web/`** — the product. Astro (static build) + Preact islands, a **pure TS** engine in a Web
  Worker. Biome, Vitest, TS strict++ (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- **`web/src/ai/`** — analysis by a **local** model (`llama.cpp` on the user's machine): optional,
  outside `npm install`, inactive as long as the server doesn't respond. It's a path **separate from
  the engine, by design** — `EngineOutput` carries only the evidence cited by a finding (memory
  bound, ADR-0003) whereas the model needs the raw items. So it starts again from the zip in its own
  worker. Wiring it onto the engine « pour simplifier » would break the bound: don't do it.
- **`panopticool/`** — the fake-export generator (fixture). Python ≥ 3.10, **stdlib only**, zero
  dependencies. It is not the product: it's its test bench, and the reproducible provenance of the
  archives in `samples/`. Modules: `registry` (shape oracle) → `populators` (+ `personas`,
  `ads_unverified`) → `generator` (rendering + streamed zip); `volume` (scale); `validate`
  (conformance to the contract, standalone).

## Non-negotiable invariants

Any proposal that violates one of these points is rejected outright.

- **Privacy by architecture.** Processing 100% client-side (browser / Web Worker): **no export data
  leaves the device**, and there is no server to send it to — the site is a static build. The only
  possible network recipient is the `llama.cpp` server **running on the user's machine** (optional AI
  analysis, on an explicit click): localhost doesn't leave the device, and the invariant holds.
  Toward a third party, nothing, ever. Trust is **demonstrated** (open code, visible processing), it
  is not promised.
- **No value drawn from a real export enters this repo** — neither in the code, nor in the tests,
  nor in the versioned fixtures, nor in a lexicon, nor in a prompt. **Every value emitted by the
  generator is synthetic** (invented, without PII, with no link to a real person). What is allowed to
  cross is **the structure and the statistics, never a value**: a schema, a distribution, an order of
  magnitude — never a fragment of text, a pseudonym, a date, an identifier. The structure contract is
  the textbook example: drawn from the real, *all its values already removed*. The generated outputs
  (`out/`) are synthetic but remain out of versioning as a matter of hygiene.
- **Looking is allowed; copying is not.** A real export can feed the work — diagnosing, framing,
  calibrating — under **explicit consent**: that of the maintainer on his own data, or that of a
  person he knows who gives it. It lives out of versioning (`Instagram/`, `out/`) and comes out only
  in the form of a structure or a statistic. Closing your eyes has never protected anyone: what
  protects the third parties present in an export without having asked for it — a private
  conversation contains the other person's messages — is that **the values never come out**. Consent
  opens the looking; it loosens nothing of the rule above.
- **Sensitive inferences framed** as « ce qu'une plateforme *pourrait* déduire » — systemic, never a
  personal verdict. The doctrine is in
  [ADR-0003](docs/adr/0003-doctrine-constats-sensibles.md), its living catalog in
  [`docs/constats-sensibles.md`](docs/constats-sensibles.md).
- **Open source AGPL v3** ([ADR-0005](docs/adr/0005-licence-agpl-v3.md)). No blocking proprietary
  dependency without explicit justification.

## The core, and what we don't touch in it

`web/src/engine/detect/` and `web/src/engine/lexicon/` are the **measured core** of the product.
Three doctrinal obligations live there:

1. the **sensitive filters** (negation, quotation, 3rd person) — what prevents qualifying someone on
   a sentence that says the opposite;
2. the **anchoring of evidence** — each deduction tied to the exact crumb that produced it;
3. the **wording in TWO ratifiable perimeters**, each a selector without prose plus **one prose file
   per language** — `web/src/engine/wording.fr.ts` / `.en.ts` (what the machine dares to deduce;
   without the 2nd person, by doctrine, in both languages) and `web/src/ui/copy.fr.ts` / `.en.ts`
   (what the interface says; the informal "tu" is the norm in FR). Human control over what the
   product dares to say rests on being able to reread it all in one go, **one language at a time**.
   Don't scatter them, don't merge them: property (a) of `wording.test.ts` sweeps both languages, and
   FR↔EN parity is held by the compiler (`wording-parity`, `copy-parity` — annotating it as
   `Record<string, string>` would silently detach it).

Getting the target wrong here means risking naming someone « dépressif » wrongly. **Any change of
behavior there is proven by a zero-diff golden, never by « les tests passent ».**

Four end-to-end goldens take care of it, and you have to know which one sees what:

- `web/src/ui/v2/render-golden.test.ts` — the `ResultsView` subtree, **in desktop and in French
  only**. It includes the demo persona **by design**: the archives in `samples/` exercise neither
  theme detection nor sensitive-signal detection (0 evidence, 0 theme: measured). Its variants
  `render-golden-mobile` and `render-golden-en` cover what this border excludes — each its own, never
  more.
- `web/src/ui/v2/ui-golden.test.ts` — home page, analysis flow, AI section, bar and footer, mobile
  variants included. Added because the first one didn't render them.

Each **declares its border in its header**; the rule that requires it is below.

## What a net proves

A proof mechanism — golden, witness, bench, measurement — **declares in its own file what it does NOT
cover**. Not in an appendix: in its header, where anyone about to cite it reads it.

The reason is a pattern observed **seven times** in this repo, never out of malice: a net is written
on TYPICAL cases, then cited as if it covered the domain. The gap is invisible, because what the net
lacks also lacks in the reasoning of whoever invokes it. « Mesuré » then becomes a word that closes
the discussion without having opened it.

A guarantee that states its border can no longer be over-cited: the next reader sees at a glance
whether their case falls inside or outside.

**A negative assertion verifies what it REACHES, not what it affirms.** It's the most costly form of
the pattern, because it goes green for a reason that isn't its own. The repo's textbook case: a test
affirmed that `health_physical` had no English coverage, and it passed — but the EN term did match
(by plural tolerance), and the single item had simply stayed below the repetition THRESHOLD. The test
measured the threshold and said « couverture »; the two coincided until the day another rule removed
the screen.

Two gestures follow from this, and they cost nothing to write:

- in front of an `expect(...).toBeNull()` or a `toHaveLength(0)`, ask **by which path** the zero
  arrives, and check that it's the one you think — a zero often has several possible causes, and the
  test distinguishes none;
- a coverage is verified **in both directions**. « Chaque câblage a son texte » and « chaque texte
  est câblé » are two distinct properties: holding only one is what let three ratified readings live
  without a reader, invisible to the two nets in place.

**A witness is verified by MUTATION, never by rereading.** An empty net and a net that holds look
exactly the same when green. The only verification that distinguishes them is to **deliberately break
what it watches and observe it going red**, then restore. What gets recorded in the file is the
mutation **that was done** and what it **did** — never what you think it would do.

Three instances in two files, all found by running the mutation, **none by rereading**:

- an exclusion witness that added the excluded term to the **text** instead of mutating the
  **lexicon** — an excluded term not being in any list, it could change nothing by construction;
- self-declaration frames writing only « i am », so that an « im » head left the block green — ten
  lines below an identical admission from the previous batch;
- a probe « aucune auto-déclaration anglaise ne nomme » querying a term that was in no tier
  (`religion` batch).

Corollary: **a mutation whose result isn't the one that was predicted is the most useful case.** Its
real result is published, including when it establishes that the mutation doesn't prove what was
asked of it — that's what mutation 4 of the language gate did.

## The structure contract

The **only** source of truth on the format of a TikTok export is
[`docs/tiktok-export-schema.md`](docs/tiktok-export-schema.md): the 10 top-level categories, the
containers, the list keys, the casing of item keys, the 3 encodings of the empty (`null` / `[]` /
`{}`) and the fidelity pitfalls.

**We invent no field or category outside this contract.** Any structure produced by the code must be
justifiable by a line of this document. It's a spec reverse-engineered from an external format: it is
not rewritten, and its numbering (`§x.y`) is its addressing — the `contract §x.y` cross-references in
the code are correct and useful.

## Conventions

- **Docs and comments in English**, like code and identifiers. The repo's prose was French until the
  translation of 2026-07-23; the git history predating it stays French, and rewriting it was refused
  (forcing it would break every cross-reference and machine-rewrite a ratified record). What stays
  French is what is **data or product**, never commentary on it: the ratified product copy
  (`wording.fr.ts`, `copy.fr.ts`), the detection lexicon, the generated reference renders, the FR
  pages and the legal notice, the validator's output, and the French examples quoted inside the
  prose — a quoted example is the measured thing, so translating it would destroy what it proves.
- **The registry (`panopticool/registry.py`) is the structural oracle.** It describes the shape; it
  does not fabricate data. Population (synthetic values) is kept apart, in pluggable *populators*.
- **An artifact has ONE home.** The other surfaces refer to it without copying it. A decision lives
  in an ADR (`docs/adr/`); a choice too small for an ADR is recorded **inline**, in the comment that
  carries the constraint (cf. the rule below); the format in the contract. Copying is manufacturing a
  delayed divergence.
- **A cross-reference must survive.** Cite an ADR number (stable) rather than a `§` of a document that
  gets rewritten. Exception: the structure contract above, whose `§` are the addressing.
- **A comment never speaks in the present of a neighboring file.** « X reste sur /temp », « cf. Y
  qui porte la distinction »: these sentences become false the day X or Y moves, without anything
  signaling it — and a reader can't tell a dead cross-reference from one they didn't understand. A
  comment states a **constraint the code can't show**. If the past explains a still-living
  constraint, saying it in the past (« remplace Y », « ex-Y ») stays honest: it survives the
  disappearance of Y. Provenance for provenance's sake (« promu du spike X ») teaches nothing and
  dies with X — if it deserves to be kept, its home is an ADR.
- **No code that runs for no one.** A function without an assembler is dead, however beautiful. If an
  idea comes back, it will come back designed and rendered.
- **Commit after each logical unit**, messages in `type: summary` style, **in English** — subject
  and body alike, like the rest of the prose. Same exception as above: a French value quoted as
  evidence (a lexicon term, a copy string, a mockup typo) stays French inside an English message,
  because it is the thing being cited. The history predating the 2026-07-23 translation is in
  French and stays so — it was not rewritten, and that refusal is recorded in `AI_USAGE.md`.
  **Never a `git push`** without an explicit request.
- **The decisions are the maintainer's.** The agent challenges, proposes options and tradeoffs,
  doesn't validate by default, and writes nothing structuring without explicit agreement.
- **Verify the real git state** before any assertion about the commits or the tracking of files.
- The AI collaboration journal is kept in `AI_USAGE.md` (ratified by hand); the working method in
  [`METHODE.md`](METHODE.md).

## Verify

What the CI requires, from `web/` — all four must pass:

```sh
npm run lint && npm run typecheck && npm run test && npm run build
```

And from the root, the generator smoke:

```sh
python -m panopticool -o /tmp/ci.zip && python -m panopticool.validate /tmp/ci.zip
```

**Never narrow the scope of the lint or the typecheck to make the CI pass.** A green CI that has
shrunk its scope proves nothing — it's a lie that costs more than the red.
