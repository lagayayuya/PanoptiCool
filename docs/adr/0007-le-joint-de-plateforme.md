# ADR-0007: The platform seam — what two connectors share, and what they must not

**Status:** Accepted
**Date:** 2026-08-03
**Decider:** yuya

## Context

PanoptiCool shipped with one connector. TikTok was not *abstracted* anywhere — it was **named in
thirteen layers**, from the zip entry name (`user_data_tiktok.json`) up to the noun inside the prompt
sent to the local model. That is the correct shape for a product with one connector, and the wrong
one for a product with two.

The second connector is not a variant of the first. The two exports have nothing structural in
common (`docs/tiktok-export-schema.md` versus `docs/instagram-export-schema.md`): one JSON file
against a tree of 507 files in two coexisting dialects; a few MB against 2 GB; ten fixed categories
against nine directories whose field labels are **in the account holder's language**.

And the two *products* differ as much as the two formats. A TikTok analysis is four sections of
deductions by theme. An Instagram analysis is six pieces of a dossier — identity, map,
conversations, media, accounts, per-thread AI. Both come from the same doctrine (ADR-0003: show what
a platform *could* deduce, never pass a verdict); neither is a rendering of the other.

## Decision

**Three things are shared, and the report is not one of them.**

### 1. `ExportSource` — how bytes are reached

One interface (`engine/source.ts`), ported from the Instagram prototype, which was written against
it from the start. The engine references no `window`, no `File`, no `FileSystemHandle` (ADR-0002);
a host provides an implementation. It is deliberately oversized for TikTok, which needs one entry:
the alternative is two ingestion paths that drift.

Two implementations follow, and **each states its own memory bound rather than sharing a constant
that would mean two different things**: the in-memory one inflates the archive whole (right for a
few MB, impossible for 2 GB), the random-access one reads the central directory and inflates one
entry at a time.

### 2. The detection core — unchanged, and that is the finding

`engine/detect/` and `engine/lexicon/` were already platform-agnostic; their own headers said so
before this ADR existed. They take a corpus of `{channel, text, date}` and return findings. Nothing
in them moves for the second connector — **which is the strongest available evidence that the seam
is being drawn where the split already was**, rather than being invented for the occasion.

### 3. The failure taxonomy, and the promise that comes with it

`ConnectorFailure` is deliberately coarse — `wrong_platform`, `too_large`, `parse`, `validate`. A
person who dropped the wrong file needs a different sentence from one whose archive is corrupt, and
no finer distinction than that. `analyze` **never throws**: every expected failure is a result
variant. That was already the TikTok pipeline's contract; promoting it to the interface means the
second connector inherits it instead of rediscovering it.

### ⚠ 4. What is NOT shared: the report

`Connector<TReport>` is **generic in its report type**. The page switches on `platform` once, at the
top, where the switch is visible.

This went the other way first, and the argument that settled it is worth keeping. A common
`Analysis` could only take two forms:

- **a union of optional fields** — `themes?`, `identity?`, `conversations?` — which every reader
  must re-narrow, and which no type stops from being read wrongly. The compiler would permit
  `report.themes` on an Instagram report forever;
- **a lowest common denominator**, which throws away precisely what each connector found.

Both trade a real loss for an apparent symmetry.

## Consequences

**What it costs, stated plainly.** Nothing in the type system makes two connectors' reports
comparable. A property that ought to hold for both — *no finding without evidence*, say — must be
asserted twice, in two test files, and nothing detects the day only one of them still does. That is
the price of not pretending the two objects are one, and it is a price paid in tests rather than in
wrong renderings.

**No registry, deliberately.** A `Record<PlatformId, Connector>` would be a table listing every
connector — and, worse, **importing** every connector, which defeats the code-splitting the
Instagram bundle requires (`three` and `maplibre-gl` must never reach the TikTok page). Each page
imports the connector it needs.

**No automatic platform detection.** `recognize` answers about *one* connector. The page already
knows which to try: the person clicked a card. Sniffing every connector against every archive would
make a *corrupt TikTok export* report as "not an Instagram export" instead of as broken.

**TikTok is wrapped, not rewritten.** `tiktok-connector.ts` adapts the existing pipeline, which
keeps its measured streaming ingestion (PANO-91: 10⁴–10⁵ watch items folded to dates-only, never
materialised). Re-plumbing it to read through `ExportSource` would swap a measured ingestion for an
unmeasured one for no visible gain.

⚠ **One narrowing the type cannot express, and it is refused loudly rather than cast.** The TikTok
connector needs the raw archive bytes for that streaming; `ExportSource` does not carry them. The
check is at runtime and returns a failure. Hiding it behind a cast would let a folder source silently
lose the streaming path — a correctness loss with no symptom.

⚠ **The goldens cannot see any of this.** They call `processExport` directly, so a connector that
returned something else entirely — or nothing — leaves them green. Verified by mutation: dropping
the themes on the way out of the connector reddens `connector.test.ts` alone, with all four goldens
passing. The seam's only witness is that file, and it asserts an **equality between the two paths**
rather than a snapshot of either, because a snapshot goes green the day both halves drift together.

**Nothing reads the seam yet.** The analysis page still calls the engine client directly; the wiring
lands with the second connector. This is the one place where `CLAUDE.md`'s *no code that runs for no
one* is knowingly deferred by one commit — the alternative being to land the seam and its consumer
as a single unreviewable change.

---

## Addendum (2026-08-04): the interface port

The engine port established the seam; the interface raises four questions the seam does not answer.
They are recorded here rather than in a commit message, because each of them is a rule the next
person has to follow and none of them is visible from the code that results.

### 1. ⚠ The Instagram modules keep CSS FILES, where the rest of the product uses inline styles

The whole of `ui/v2/` styles itself with inline style objects, plus one global sheet for what an
inline style cannot express (`hover.css`: `:hover`, `@keyframes`, `prefers-reduced-motion`). That
convention holds because those surfaces are cards, rows and panels.

The Instagram modules are **7 335 lines of CSS** across 26 files, and what they contain is what the
convention cannot hold: media queries, keyframes, `::before`/`::after`, 3D transforms, a map's
canvas layers, and cascading rules over deep trees. Converting them to inline objects would lose
most of it and inline the rest into unreadable literals.

**Decision: they stay CSS files, imported by the module that owns them.** The divergence is real and
bounded — it applies to `ui/instagram/`, and nowhere else. What does NOT diverge: the ratified theme
tokens stay the single source (`palette.ts` already derives from them), and no colour is invented in
a module sheet.

**What it costs, stated so it is not discovered:** two styling idioms in one repository, and a
reader who learns one does not know the other. The alternative was to lose the modules or to lie
about what inline styles can do.

### 2. React → Preact is mechanical, and the surface was measured before the claim

Counted across `ui/`: `useState` (51), `useEffect` (52), `useMemo` (42), `useRef` (13),
`useCallback` (1), `React.ReactNode` (3), `React.PointerEvent` (2), and `react-dom` for
`createPortal`. That is the entire React surface — no class components, no context, no
`forwardRef`, no concurrent features.

The mapping is therefore one-to-one: hooks come from `preact/hooks`, `ReactNode` becomes
`ComponentChildren`, `PointerEvent` becomes `JSX.TargetedPointerEvent`, `createPortal` comes from
`preact/compat`. The port is a rename pass, and saying so is only honest **because it was counted**
— the same sentence without the count would be a guess that reads like a measurement.

### 3. ⚠ `gsap` is DROPPED, and the reason is the licence

Its licence reads *"Standard 'no charge' license"* — not an OSI licence. `CLAUDE.md` forbids a
blocking proprietary dependency under AGPL (ADR-0005) without explicit justification, and there is
none: it is used in exactly one file (`Universe.tsx`), for tweening, which the Web Animations API
and `requestAnimationFrame` both cover. `three` (MIT), `maplibre-gl` (BSD-3), `mmdb-lib` (MIT),
`topojson-client` and `world-atlas` (ISC) all stay.

### 4. `React.lazy` becomes an Astro island, and the code-splitting is the point

The prototype lazily loads each module because each pulls a dependency only it needs — MapLibre for
the map, `three` for the 3D space. Statically imported, opening the file browser downloaded the map
engine too.

⚠ **The split must survive the port, and for a harder reason than page weight: `three` and
`maplibre-gl` must never reach the TikTok page at all.** That is what `connector.ts` refuses a
registry for, and an island that imports the whole Instagram module tree would defeat it from the
other end.

### 5. The copy: a fourth ratifiable file pair

~250 French strings live inside the modules. They move to `ui/copy.instagram.{fr,en}.ts`, composed
through `ui/copy.ts` and walked by the same parity test — the interface perimeter's rule, applied to
the second connector. The engine's prose is already separate (`wording.instagram.*`), and the two
must not be merged: one says what the machine dares to deduce, the other what the interface says,
and they are ratified under different constraints (ADR-0003 forbids the second person in one and
the informal "tu" is the norm in the other).
