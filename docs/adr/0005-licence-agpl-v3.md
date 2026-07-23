# ADR-0005: License — AGPL v3 (reversal of MIT)

**Status:** Accepted
**Date:** 2026-07-16
**Decider:** yuya

## Context

The repository had been under the MIT license since it opened. PanoptiCool is a tool that exists to
**demonstrate, through its own operation, the power asymmetry** between a platform that profiles its
users and an honest tool that shows what "so little data" already lets one deduce (ADR-0003). This
decision moves the repository to **AGPL v3**.

Ownership of rights: the history contains only two identities, which are the **same person** under
two successive pseudonyms. This is therefore not a transfer of third-party rights — the author
relicenses their own code, with no external consent required.

## Why the original reason for MIT no longer holds

MIT was justified by "public, reusable", "repository conceived as a reference". The AGPL's copyleft
**deliberately reduces** that reusability in the permissive sense of the term — on the face of it, a
reversal of the original reason for the choice.

But "reusable" was not aiming at free appropriation: it was aiming at **verifiability**. PanoptiCool
is only worth anything if anyone can audit that nothing leaves the user's device — that is the
project's non-negotiable invariant: *trust is demonstrated, not promised*. That verifiability, MIT
already allowed. But it *also* allowed something the original reason did not anticipate: that a
company could silently take the engine — lexicons, rules, detection — to profile people without their
knowledge, precisely the gesture the tool denounces. **MIT did not distinguish these two uses.**

The AGPL distinguishes them. It **preserves** verifiability (the source code stays available to
whoever wants to audit it) and **closes** silent appropriation (any reuse, including as a network
service, must stay source-available under the same license). The reversal is therefore not an
abandonment of the original reason — it is a **clarification** of what it meant all along, once the
concrete risk was identified.

## Why AGPL and not GPL, honestly

We must be precise about what the AGPL actually brings here, so as not to oversell the tool.

**For the application itself, the AGPL's network obligation is largely inert.** PanoptiCool is 100%
client-side: all processing runs in the browser (ADR-0001/0002), nothing passes through an
application server. Serving this app's JS, HTML and CSS **already constitutes a distribution** in the
ordinary copyright sense — plain GPL would already oblige whoever does it to publish their
modifications. The AGPL adds nothing specific to *that* surface.

**What the AGPL reaches, and that the GPL does not:** the case where someone takes the engine —
lexicons, detection rules, inference logic — and runs it **server-side**, as a profiling service
exposed to users, without ever *distributing* a binary or code, hence without ever triggering plain
GPL's obligation. It is a profiling SaaS built on PanoptiCool's engine, kept private indefinitely.
This is exactly the reappropriation this project exists against: a third party using the tool that
demonstrates the asymmetry in order to *become* an actor of that asymmetry. The AGPL's network
obligation closes this precise case, by requiring the corresponding source code to be offered to
anyone who interacts with the service.

An ADR that claimed the AGPL protects much more than that — or that it protects the static app itself
in a way the GPL would not — would oversell the tool. **The AGPL's real scope here is narrow and
specific**, but it corresponds exactly to the identified risk.

## Decision

1. **Repository license: AGPL-3.0-only**, replacing MIT.
2. **`LICENSE`** contains the official AGPL v3 text, copied as-is — no name substitution in the body
   of the text.
3. **Separate copyright notice** (`NOTICE`).
4. **License mention** placed where it is read: the public face of the repository and the web
   package's manifest.

## Options discarded

**Staying on MIT.** Discarded: it does not distinguish auditing from appropriation (§ above).

**GPL v3.** Discarded: it covers distribution, but leaves open exactly the case that matters here —
the engine diverted into a server service, never distributed.

## Consequences

**Closes:** MIT-style permissive reuse — silent fork, proprietary integration with no obligation to
give back; the ambiguity over what happens to an engine diverted into a service.

**Opens:** any reuse, including as a network service, stays verifiable and source-available under the
same license — coherent with the project's privacy-by-transparency invariant; and an explicit
political signal, because **the choice of license *is* a statement**, not merely a legal formality.

**Costs:** a potential contributor or integrator who wanted permissive use — private SaaS,
proprietary integration — is deterred. That is the point, not a regretted side effect.
