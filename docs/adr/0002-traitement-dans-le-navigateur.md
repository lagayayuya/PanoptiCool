# ADR-0002: Processing lives in the browser — TS engine in a Worker, Astro shell + island

**Status:** Accepted
**Date:** 2026-06-19
**Decider:** yuya

## Context

The product's invariant is that **nothing leaves the device**: decompression, reading the export and
analysis all run in the browser. This ADR decides **how** — the engine's execution model, the shell
that hosts it, and the repository's conventions.

Two facts constrain the engine, and they were **measured, not assumed** (benchmark on synthetic
fixtures, 1k → 100k entries):

- **The limiting factor is memory, not speed.** Reading the JSON is not the bottleneck (27 MB →
  ~50 ms desktop). Materializing the graph is: a real account's export is dominated by a viewing
  array of 10⁴–10⁵ items, and the allocation peak it causes is what kills the tab.
- **Synchronous processing freezes the UI.** Beyond 16 ms, the main thread stutters. The Worker is
  not a comfort, it is a consequence.

## Decision

### The engine

1. **Pure TypeScript, framework-agnostic**, importable by any shell.
2. **Execution in a Web Worker.** The `decompression → reading → analysis` chain never touches the
   main thread.
3. **Streaming ingestion.** We tokenize the export by folding the viewing array on the fly toward
   what the rules actually read (dates), **without ever erecting the giant graph**. The trust
   boundary is preserved: the stream validates against the same contract as the rest. An
   anti-pathological-archive ceiling remains and **refuses gracefully** (`too_large`), distinct from a
   corrupted export — refusing calmly is a behavior, not a crash.
4. **The Worker returns only a reduced value** — never the read graph. The transfer between Worker
   and page is a copy: passing the graph through it would double the memory we just saved. What the
   engine returns is decided by ADR-0004.

### The shell and the conventions

5. **Astro, static build**, served by Caddy (ADR-0001).
6. **The entire interactive app lives in a single `client:only` island**: one clean client boundary,
   where the Worker is instantiated. No partial hydration.
7. **Island framework: Preact** (`.tsx`) — tiny runtime (~4 KB, *on message* for a tool that
   criticizes bloat), ubiquitous mental model, official integration.
8. **Lint and format: Biome.** Single binary, fast, minimal config. The choice is **coupled to the
   island's**: Biome's coverage is native and complete in `.tsx`, but it does not parse other
   frameworks' template control-flow. Preact unties that coupling — a single tool over the whole TS
   surface.
9. **TypeScript strict++**: `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`.
   Justified by the **defensive parsing of an untrusted input**: an unguaranteed indexed access is a
   real bug, the type system must force it.
10. **A single TS package** in `web/`, no workspace. The Python fixture generator lives at the root
    with its own conventions.
11. **The engine/UI boundary is a module boundary, *enforced*, not a package.** The engine lives in
    `web/src/engine/` and depends on no DOM or UI API. Double safeguard: **engine tsconfig without
    `lib: DOM`** (DOM globals do not typecheck), and a restricted-imports rule forbidding the UI in
    `engine/`. Non-negotiable: a boundary that is not *enforced* rots silently.
12. **Tests: Vitest**, the weight on the engine — goldens consuming the synthetic fixtures, and the
    generator's degraded modes as **adversarial inputs**.
13. **Commits: Conventional Commits**, summary in French, **+ `Co-Authored-By` trailer on every
    AI-assisted commit** — a governance convention, which extends the transparency of `AI_USAGE.md`.
    No enforcement hook: solo, the written convention suffices and a hook would be magic.
14. **CI: GitHub Actions** — lint → typecheck → tests → build, **+ Python smoke** (generate a
    fixture, validate it). Sovereign (ADR-0001) is about hosting the app and the PII, **not about
    hosting the code**: the repository is on GitHub for its visibility.

> **Note — the reason that tipped toward Astro is not exercised.** Astro was chosen for its
> educational content as zero-JS SSG (Markdown/MDX, content collections), against a SPA judged less
> aligned because it would have rendered text in JS. That content does not exist: zero content
> collections, zero `.md`, and the three pages are `client:only` islands. The decision is **therefore
> reopenable, in both directions** — if the educational content arrives, the reason becomes true
> again; if it does not, the choice deserves to be reweighed. What holds today, and holds on its own:
> static build + a single client boundary.

## Options discarded

**WASM (simdjson) for reading.** Very fast O(n) — but the measurement says reading speed is not the
limiting factor, memory is. Gratuitous complexity.

**Loading everything into memory (`JSON.parse` of the whole graph).** Simple, and sufficient as long
as the export is small. Discarded by measurement: the graph's allocation peak is precisely what kills
the tab on a real account. Streaming bounds the footprint whatever the useful volume.

**A monorepo / workspaces** to signal the engine/UI decoupling. Discarded: a monorepo is only
justified by independent lifecycles (separate publishing, versioning, builds), absent here. The
"decoupling" signal is obtained at far lower cost by an *enforced* boundary (§11), and the engine
stays extractable later — it has no dependency on the shell.

**ESLint + Prettier + Svelte.** Mature lint coverage over more formats, and the smallest shipped JS.
Discarded: more dependencies, slower, and a contradiction with "a single tool" — for a marginal weight
gain over Preact, against a bet on a less ubiquitous skill.

**Vanilla TS, no island framework.** Absolute minimal dependencies, but the dashboard's reactivity
goes back to being done by hand: a false economy for a rich interactive surface.

## Consequences

**Closes:** SSR and the dynamic server; WASM; transferring the graph out of the Worker; workspaces;
commit hooks. We accept two paradigms (`.astro` + `.tsx`) and a thin Astro lock-in.

**Opens:** a portable engine, hence a replaceable shell — the real asset is the engine, and Astro
commits only the presentation; a memory footprint bounded by construction; a single lint tool over
the whole TS surface; a simple polyglot CI.
