# AI_USAGE — Journal of collaboration with AI

> Transparency on the use of AI in the development of PanoptiCool.
> A chronology of **decisions and arbitrations**, most recent at the top. Reusable (AGPL v3).

This project is developed with AI assistance, in a supervised and declared way.
This journal embodies the **AI Fluency (4D)** framework without turning it into a form:
the **Done** section covers delegation and description (what was entrusted, decided, produced);
the **Human judgment** section covers discernment and diligence (what was arbitrated, and what I
answer for).

**This project was built by exploring.** The real structure of the exports, the ethical line of what
a tool dares to assert, the technical feasibility, accessibility to as many people as possible, the
overall vision — each of these axes sharpened as I went, not before starting. That's why some
entries in this journal contradict older ones. As the first public version approached, I made the choice to
**start again on a cleaner base** — the decisions brought back to what holds, the engine brought back
to what it really returns — so this v1 would be as accessible as possible. The journal keeps the
trace of the path; the ADRs, for their part, present only the destination.

**This journal is not the decision registry.** The *why* of a structuring decision lives in its ADR
(`docs/adr/`), and the entry refers to it without copying it. What the journal keeps for itself is
the **arbitration**: what the AI proposed, what I validated, contested or settled, what the agent
held or caught by itself. Each entry refers to the **current** ADRs; when it describes machinery
since replaced, it says so — not to flaunt a reversal, but because the path is part of what this
journal passes on.

Each entry is **ratified manually**: the factual part may be drafted by the AI, the judgment line is
reread critically and remains my responsibility. The raw transcripts are not published.

---

## Chronology

### 2026-08-03 → 08-05 — The integration: two products in one site, and the promise that had to change
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** The standalone prototype became the second connector of the real product in about
  forty hours. First the seam — `ExportSource`, a random-access zip reader, seven extractors in the
  one order their dependencies allow, the analysis moved into a worker: TikTok became one connector
  of two rather than the product ([ADR-0007](docs/adr/0007-le-joint-de-plateforme.md)). Then the six
  pieces of the dossier ported rather than rewritten, with their 3D scenes (the accounts as a crowd
  you can walk into, every file of the export as a universe), the map's two layers, the conversation
  reader and the per-thread local analysis. DB-IP City Lite replaced GeoLite2 on licence grounds.
  A synthetic Instagram persona was written so `?demo` runs the real pipeline on an archive nobody
  owns — twenty threads, arcs, and one thread that knows it is a thread. Last, the two journeys were
  unified: one drop screen, one wait, one consent modal, and Instagram's own front door closed.
  The wave's doctrinal change is [ADR-0008](docs/adr/0008-lecture-du-contenu-des-messages.md): the
  analysis still counts and never reads, but the text of a thread is opened on a gesture — so the
  guarantee that said otherwise left the interface and the legal notice was rewritten, in both
  languages, to say what is actually true.
- **Human judgment:** Lot of my calls here were about not letting the richer connector set
  the rules. On the geo database I went with DB-IP over GeoLite2 purely on the licence, MaxMind wants an account and a tracking pixel on redistribution, which this project cannot accept. 
  The rest was a lot of looking, testing and adjusting the integration of the new design and Instagram analytical tool. 
  I also spent a good amount of time on the synthetic persona, I wanted a demo that runs the actual pipeline on an archive nobody owns, and one thread written to be worth reading . I renamed `/analyse` to `/tiktok` with redirects.
  At the end I closed three things that would have shipped broken. The archive must not go out
  amputated of its geo database, so the build now refuses to write it at all and route B hides its
  button and says why, rather than handing out a 404. The English home page was showing a French
  screenshot as its only evidence of what the product does, so the preview is per-language now and
  regenerated from the demo route rather than cropped by hand.

### 2026-07-23 → 08-03 — The Instagram prototype: exploring and prototyping on top of a personal export
- **Surface:** Claude Design + Claude Code
- **Default mode:** exploration → augmentation
- **Done:** A second connector could not be designed from a schema: the Instagram export is a tree of ~500 files in two coexisting dialects, weighing gigabytes, whose field labels are in the account holder's language. So it began with a reading of a real export — mine, ~1.6 GB — under one rule: read everything, keep nothing. The mapping document holds counts, shapes and volumes, and not one message, pseudonym or media. From it came a standalone React prototype rather than a branch of the product: six pieces of a dossier — identity, a map of what an IP address gives away, conversations, the accounts you cross, the media, and a per-thread analysis by a local model. Claude Design carried the mockups (the shell, the home page, the dossier), Claude Code the prototype the mockups were tried on. Working against a real 2 GB archive is what produced the decisions that survived: an archive read entry by entry rather than decompressed whole, a label table instead of hard-coded field names, and an ExportSource interface the prototype was written against from the first line.
- **Human judgment:** It was a lot of back and forth trials and experiments, my main priority was to make it interesting while being intuitive, interactive and mostly accessible, even thought the export was extremely rich. For example the map's zones were rebuilt multiple times, until I tried using a Heatmap to indicate the IP points, making the declared points and their associated media more visible. I also had some trouble deciding what to show/not show to keep it easy to read, that’s where I came up with the “In detail” view idea. I also added a warning panel on the AI Analysis page, in addition to the “understand · the model “ panel, hoping people will keep a distance with the result and use it more as a learning tool. After the prototype was done, I adapted the new theme to every pages, completely remade the home page and I took more time going over and editing all the text being shown on the website, being sure it is clear and conveys the intention of this project.

### 2026-07-23 → 07-25 — Translating the repo's French prose to English
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** Two mockups, desktop and mobile, became a real roadmap page in both languages, reachable from the site bar everywhere. Three guardrails came with it: a test pairing each status with its prose in both languages, since the compiler cannot do it; two new reference renders; and the list of arrays under parity watch updated deliberately rather than by reflex.

  Then the repo's French prose was translated to English: the documents and decision records, the comments and docstrings, the doctrine headers of the wording and copy files, the test names. What stayed French stayed French on purpose — the ratified product copy, the detection lexicon, the generated reference renders, the French pages and the legal notice, the validator's own output, and the French examples quoted inside the prose. The work was split so that no two writers could reach the same file, and the one holding the boundary verified rather than translated. Two breakages inherited from interrupted runs, one of which broke a core test file, were found and repaired. The history itself was not rewritten: forcing it would break every reference, every existing clone, the safety tag and the journal's own citations, and would machine-rewrite a ratified record. History stays French; what comes after is English.
- **Human judgment:** I wrote the page's content and designed it before handing it over to be built and translated, then reworked a number of formulations and validated the result by hand. On the translation, I set the boundary — what is prose and may move, what is ratified copy or measured data and may not — and I refused the history rewrite. I reread the documents myself and corrected what the machine had rendered too literally.

### 2026-07-21 — Preparing for publication: the triage, the invariant, the recomposition
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** Three operations to make the repo publishable. First the documentation triage: fourteen working notes (5,600 lines of proposals already arbitrated and implemented) deleted, their lessons condensed into a single method note (docs/methode-portabilite-en.md) and their decisions moved into the files they concern. Then a full sweep of the repo to check that no data from a real export (pseudonym, identifier, date, text) was present. Finally the rewriting of the git history: ~210 working commits regrouped into 11 readable thematic commits, with a check that the final content is identical to the byte. Along the way, a corrective branch validated but never merged was recovered and integrated — the bug it fixed was still running in production.
- **Human judgment:** The triage criterion: a document that still serves (contract, catalog, ADR) stays; a document that only recounts finished work is judged on what it teaches a new reader, and goes if it teaches nothing. 

### 2026-07-18 → 07-20 — The sensitive-topic detector learns English, and gets measured
- **Surface:** Claude Code (concurrent sessions)
- **Default mode:** augmentation → automation
- **Done:** The six sensitive lexicons (mental health, physical health, sexuality, politics, religion, aggressiveness) now cover English, one batch per theme, each list of terms proposed then arbitrated before being written. The filters that keep the detector from over-asserting (negation, quotation, third person) were adapted to English, and a measurement done along the way revealed then corrected a French bug already in production: the tool was laying down a mental-health finding on a parent searching for information for their child. To measure all this, a new device: texts of fictional characters written blind by other sessions (without knowing the term lists), with their expected verdict frozen before running the detector — which made it possible to remove, figures in hand, several terms that were tagging people wrongly.
- **Human judgment:** Three structuring arbitrations. One: English doesn't translate term for term — each theme required its own admission rule, and « je veux mourir » is in the French lexicon while "i want to die" is excluded from English, where it's a mundane expression of embarrassment. Two: an apparently neutral admission rule turned out to favor one political camp (the ordinary words of the left and of the right don't have the same grammatical form) — corrected by admitting both ordinary words, with their assumed false positives. Three: the agent proposed, measurements in hand, to remove the aggressiveness detector that confuses friendly teasing with real aggression; refused — showing that an algorithm gets it wrong is part of the product's demonstration.

### 2026-07-18 → 07-19 — All the product's text gathered, translated and verified
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** The ~930 sentences the product displays, until then scattered across the components, are gathered into two catalogs each readable in one block: what the engine dares to deduce, and what the interface says. Each catalog exists in French and English, and the build breaks if a sentence is missing in one language. Numbers, dates and plurals also adapt to the language. The sensitive cards now display a spread of possible readings (« c'est moi · c'est un proche · simple curiosité ») instead of a sentence that asserts. And the reference visual tests finally cover mobile, English, and the non-results pages.
- **Human judgment:** The structure of the catalogs was ratified before translating anything — the only moment when changing the form costs nothing. Rule set for the spreads: three readings because there are three possible mechanisms, never degrees of intensity of a single reading — two existing texts were deleted on this basis. The English translation has its automatic guardrails (nothing ships untranslated), but distinguishing a real translation from a copy-paste remains a human reread, and it's written down. 

### 2026-07-18 → 07-20 — English version, the local AI adapts to the browser, new design
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** The site exists in two languages (/fr and /en), with a guardrail: it's impossible to publish an incomplete language, the build refuses. The English tree was laid down unlit, then lit up — including translation of the pages, of the demo persona and of the AI prompt. The local-AI section was redone to adapt to the different browsers, which don't all allow a site to talk to a server on the user's machine: it detects the real situation (server absent, access blocked, permission to grant) and offers several paths, including one to easily launch the server locally. The why is documented in ADR-0006. Finally, the interface was aligned with the v4 mockup (hovers, spacings, cards clickable in full, the framing of the deductions moved to the section's introduction).
- **Human judgment:** The entirety of the translated content was verified and corrected manually. The workings of the detection of the different search engines and of the displayed commands to launch the server and the AI model from the zip were verified manually. The stake around the AI section wasn't only to fix the fact that it didn't work on certain search engines but to establish a path that is accessible AND understandable for a user who has never used a terminal. Still with accessibility in mind, the design of the cards in the "02 Déductions par thème" section was largely simplified.

### 2026-07-17 — Starting again on a clean base for the public v1
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** Cleaning up everything a reader will discover first: the architecture decisions brought back to what holds and stands on its own ([`docs/adr/`](docs/adr/)), CLAUDE.md rewritten to describe the repo as it is — with local AI analysis finally entering it —, R&D notes taken off the main path, dead code removed, dead references closed.
- **Human judgment:** Yuya's choice, motivated by accessibility: the first public version must read without its history behind it. This means embracing the rewrite rather than stacking up patches — abandoning the rule "don't rewrite a frozen decision," which had ended up making one text revise another point by point. Two assertions that had become false were corrected at the root rather than copied over; a reason for a choice observed but not exercised was written as a re-openable note rather than kept silent. The gesture doesn't erase the path's contradictions: it files them where they illuminate, this journal, not where they muddle, the doctrine.

### 2026-07-16 — Refactor A: the engine returns ONE named value
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** A generic architecture — a union of findings discriminated by nature, rule identity carried as data, a shared evidence store, a template catalog, a graded sensitivity axis — laid down in June, tried out, then brought back to `analyze() => Analysis`: each field has a named reader, spotted on screen. −2,344 lines. The full reasoning, with both states, lives in [ADR-0004](docs/adr/0004-moteur-une-valeur-nommee.md).
- **Human judgment:** The movement is the information, not the final state (Yuya): the genericity wasn't a fault, it was a bet on a variety of findings that didn't come. Inventory re-derived from the screen file by file, not assumed: for each thing emitted, who reads it — several fields, no one. Guardrail held before the removal: the deleted framing carried a tested property (« le sujet est la plateforme »); that evidence was first **broadened** onto the displayed text, because removing it without a counterpart would have removed evidence, not dead text. No label rewritten to green the test. Zero-diff end-to-end golden, the only exception being the « solide » legend removed, isolated in its own commit.

### 2026-07-16 — License: reversal MIT → AGPL v3
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** The repo moves from MIT to AGPL-3.0-only. Reasoning in [ADR-0005](docs/adr/0005-licence-agpl-v3.md): "reusable" didn't aim at free retrieval but at **verifiability**; copyleft preserves it and closes the silent appropriation of the engine as a non-distributed server service — the case plain GPL doesn't reach.
- **Human judgment:** Deliberate reversal by Yuya, presented as the political signal that it is: the license choice *is* a statement. The ADR refuses to oversell — the real scope of AGPL here is narrow and specific (the static app is already covered by mere distribution), and it says so rather than masking it. Relicensing of his own code (the history carries only one person under two pseudonyms), with no third-party consent required.

### 2026-07-16 — English portability & engine hardening
- **Surface:** Claude Code
- **Default mode:** automation
- **Done:** English variants of the lexicons (sensitive and interests) and of the contextual filters — negation, quotation, third person. Matcher rewritten in a single pass. Streaming ingestion: the export is tokenized by folding the watch-history array on the fly, without erecting the giant graph — now the production path, not a reserve ([ADR-0002](docs/adr/0002-traitement-dans-le-navigateur.md)).
- **Human judgment:** Mostly execution: English portability was a debt acknowledged much earlier as post-v1 work, not an arbitration reopened here. The streaming confirms by measurement what the ADR posited: the limiting factor is memory, not reading speed.

### 2026-07-11 → 07-15 — Local AI analysis (llama.cpp)
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** Beneath the deterministic findings, an optional path where a **local** language model reads the raw comments and searches and infers what isn't written there. A path **deliberately separate from the engine**: the engine's result carries only the cited evidence, never the raw texts — wiring it onto the engine would break the memory bound of [ADR-0003](docs/adr/0003-doctrine-constats-sensibles.md). So it starts again from the zip in its own worker. Token budget computed against the server's real context, opt-in by click, all local.
- **Human judgment:** The llama.cpp backend settled by Yuya on a benchmark (the WebLLM playground remains the development tool). Prompt wording left in draft, human gate reserved. The privacy invariant isn't weakened but **reformulated**: the only possible network recipient is the user's server on their own machine — localhost doesn't leave the device. Verification done locally against a real export, never logged nor written into the repo.

### 2026-07-06 → 07-08 — Interests detector D2
- **Surface:** Claude Code
- **Default mode:** automation
- **Done:** A second detector alongside the sensitive one, a deliberately simpler lexicon (no sensitivity tier, no spread, no third-person attenuation). A ranking rule keeping the most-represented themes; co-occurrence mechanics. Fifty-two themes delivered in four batches, then the first ones retrofitted to the standard of the later ones.
- **Human judgment:** Two method revisions settled through use. First delivery too cautious → rule inverted by Yuya: an ambiguous word is no longer excluded but kept and verified by a second word of the same theme in the sentence, the sorting by volume being made to absorb the noise. Second batch too generic → web search made **mandatory** rather than allowed, on a precise example of the shortfall. Psychology held to the strictly academic field, outside care and lived experience. The agent flagged of its own accord six themes that had stayed under the lens, and checked that no new word triggers the sensitive detector.

### 2026-07-03 → 07-05 — Wiring in the real without instrumenting the engine
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** First worksite where a real user export enters the engine: a second button, direct reading in the existing mechanism without modifying it. Debug panel in development only, factual "Activité" panel, rhythm graph computed from the real timestamps. Several rules from this period (raw counters, ad confirmation, exposed identifiers) will be removed at refactor A, for lack of a reader.
- **Human judgment:** Limit set by Yuya: wire in without modifying the engine, correct only if a real file reveals a problem. The debug panel re-estimates on its own what the engine exploited rather than instrumenting the engine — premature for a temporary tool — provided it displays that it's an approximation, so it doesn't pass for a fact. Network traffic inspected during the trials: nothing leaves the device. The agent makes explicit what it can't verify itself — the pass with a real file remains the maintainer's, with no content entering the conversation.

### 2026-07-03 → 07-04 — Sensitive-topic detector D1
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** Lexical detector on the comments, implementing the doctrine of [ADR-0003](docs/adr/0003-doctrine-constats-sensibles.md): French matching machinery (negation with a double-negation exception, quotation filtering, third-person degradation), lexicon of the six labels enriched across all registers, cross-cutting recognition of self-designations. The decisive test is a real export, never shared in the session.
- **Human judgment:** Work order set by Yuya: build the mechanism first, lexicon deliberately reduced, rather than waiting for a complete lexicon. The terms added by hand by the maintainer were verified empirically by the agent before being committed: two turned out to classify a critique of an idea as aggression against a person — shown as concrete examples, question asked, removed on agreement. The harshest insults assumed rather than omitted. Final test on a real export carried out by the maintainer, sole judge of success.

### 2026-07-01 → 07-03 — Reworking the per-theme display
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** The display reorganizes around the **theme** as a first-class concept — a referenced object carrying its uses, rather than a label duplicated on each finding. Results page rebuilt (collapsible cards, confidence summary at the top), synthetic-persona fixture at the new model, property golden tests, persistent warning header.
- **Human judgment:** Semantic wall, absences and exposed identifiers keep a separate zone, not diluted into the themes (Yuya): they carry a weight of their own. A non-additive schema change limited to the engine alone, the display left broken until the sessions planned to replace it, with an explicit rule to stop and report back rather than overflow. The warning is a non-negotiable prerequisite, not a comfort. After a check done against the *description* of the problem and not against the mockup, a requirement that every visual check now be done against the reference image.

### 2026-06-27 → 06-30 — Demo mode & sensitive cards
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** First end-to-end render on a frozen 100% synthetic fixture. The sensitive machinery of the time — shared evidence store, graded sensitivity axis, blur-on-click — **since replaced** by refactor A and by the collapse + badge pair of [ADR-0003](docs/adr/0003-doctrine-constats-sensibles.md). What survives are the arbitrations that became doctrine.
- **Human judgment:** Three arbitrations laid down here still hold in the ADR: one and the same piece of evidence must feed two findings and **show it on screen** (« aussi exploité par »), the visible reuse being the product's most concrete argument; the spread of readings stays **flat, never numbered**, because weighting would amount to ranking intent; mental health is never displayed without protection. The lapse of the time — the blur named the theme anyway, in the name of informed consent — was flagged as provisional, to be re-examined: it was, replaced by collapse + badge.

### 2026-06-26 — Doctrine of sensitive findings
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** Feasibility spike measuring whether a local lexical classifier reads sensitive labels on the text of an export, and **where it fails**: eight synthetic personas, an invented corpus. Founding result — the **opacity wall**: sentences whose meaning rests on the phrasing, with no word to spot, that no lexicon will catch. Founds [ADR-0003](docs/adr/0003-doctrine-constats-sensibles.md).
- **Human judgment:** A very tightly framed session, the substance settled at each step by Yuya: measurement contract refounded twice (toward a two-level display, then toward three truth states including « le signal concerne un proche »), corpus judged too clean (the real signal is said in veiled words), central finding tightened from eight cases to six. Method rule set after a lapse by the agent, which had committed sensitive personas before review: present, validate, then commit. Substantive decision: the wall is not a failure to fix, it's the demonstration — a local tool doesn't cross what a platform crosses.

### 2026-06-19 → 06-24 — Building the generic engine
- **Surface:** Claude Code
- **Default mode:** augmentation → automation
- **Done:** The engine built piece by piece: `web/` foundations, engine/UI border *enforced*, typed insights contract (the generic architecture that refactor A will later bring back to a named value), streaming parser and validation at the entry, Web Worker harness, golden tests, eleven inference rules. The form decisions live in [ADR-0002](docs/adr/0002-traitement-dans-le-navigateur.md) and [ADR-0004](docs/adr/0004-moteur-une-valeur-nommee.md).
- **Human judgment:** Several arbitrations from this period survive beyond the machinery they guarded. The engine/UI border, required *proven by probes* and not asserted, revealed a real hole before commit. Runtime validation placed on the **untrusted border** — a platform's input — never on our own output: a decision prior to the big move, which survives it intact. The ethical guardrail explicitly **outside the type**: a required field guarantees the presence of a framing, not its correctness. And an attribution incident held by the agent itself: work from a parallel session found in the folder, session stopped before any commit rather than passing it off as its own deliverable.

### 2026-06-19 — Contract decisions: stack, schema, rule catalog
- **Surface:** Claude Code (connected to Linear)
- **Default mode:** augmentation → automation
- **Done:** A day of founding decisions: sovereign hosting with no backend ([ADR-0001](docs/adr/0001-hebergement-souverain-sans-backend.md)), processing in the browser and dev conventions ([ADR-0002](docs/adr/0002-traitement-dans-le-navigateur.md)), then the inference-rule catalog and the insights schema that follows from it. The catalog's structuring finding: less than 2% of an export's volume is self-described text offline — the rest is opaque, and resolving it would violate the privacy invariant.
- **Human judgment:** Methodological framework imposed up front by Yuya: mandatory challenge of the chosen path, decision reserved for the human, explicit ratification before writing the ADR. On hosting, a key reframing: the privacy invariant is held **by construction whatever the host**, so it doesn't decide — the arbitration plays out on the ethos and the residence of the only PII. On the rules, systemic framing imposed against personal framing: « une plateforme peut repérer tes rythmes », never « tu es vulnérable à 3 h ». Two model errors introduced by the AI on the schema, corrected by the maintainer.

### 2026-06-18 → 06-19 — Bootstrapping: roadmap, structure contract, fixture
- **Surface:** claude.ai + Claude Code (connected to Linear)
- **Default mode:** augmentation → automation
- **Done:** Mapping of the roadmap into an initiative, projects and issues. Export structure contract **reverse-engineered from a real export provided by the maintainer, all values removed**, with its pitfalls recorded (two date formats, three encodings of the empty, casing by section). Synthetic-fixture generator in Python stdlib, and a bench measuring the parsing of large exports.
- **Human judgment:** Reframing so the agent wouldn't resolve the architecture decisions inside the mapping session. A founding rule held from here on: **structure and statistics may cross, never a value** — the contract is drawn from the real, its values already removed. The bench settled through measurement a question that could have stayed assumed: the limiting factor in parsing is memory, not CPU, which grounded the choice of streaming processing.

<!-- New entries above this line, reverse-chronological order. -->
