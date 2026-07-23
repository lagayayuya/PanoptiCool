# ADR-0001: Sovereign hosting, no backend

**Status:** Accepted
**Date:** 2026-06-19
**Decider:** yuya

## Context

PanoptiCool serves a static app whose **entire processing lives in the browser** (ADR-0002): no
export data touches a server, by construction, **whatever the host**.

This is the structuring fact of this decision, and it is counterintuitive: **the privacy invariant
does not decide between the options.** It is satisfied on all three sides. Choosing a sovereign VPS
"for the export's privacy" would make us pay the ops of a machine for a reason that does not apply to
it.

What actually decides:

1. **Ethos.** A tool for raising awareness of data-protection and privacy issues: the medium is part
   of the message. Hosting on a US PaaS contradicts the thesis.
2. **Residence of the only possible PII.** Not the export: the email of a possible "your export is
   ready" reminder — a platform takes days to produce it (TikTok, up to ~4). The EU and the US are
   not equivalent.
3. **Cost and ops for a solo dev.** Low maintenance, minimal magic.

## Decision

1. **Sovereign hosting** on a small EU VPS. No US PaaS.
2. **Lean stack: Caddy** (static + automatic TLS + reverse-proxy), no orchestrator.
3. **Everything containerized** (standard Docker images): the switch to a PaaS stays painless —
   reversibility insurance.
4. **No backend.** The waiting screen offers a reminder **without a server** (`.ics` export, local
   reminder). We collect nothing — **not even an email**. This is a product claim, not a step toward
   a backend.

## Options discarded

**Vercel, or any equivalent US PaaS.** The fastest to ship, zero-ops, free at this scale. Discarded
for the narrative contradiction and the US residence of the PII — and because the exit would be
painful (serverless → stateful, proprietary Cron and KV) where the reverse path is cheap. **This
reversibility asymmetry is what justifies starting sovereign *and* lean:** lean → PaaS is done on the
same primitives; US PaaS → sovereign, not.

**A self-hosted PaaS (Coolify) right now.** Git-push, rollbacks, dashboard — valuable **with several
services**. Discarded as over-tooled for the real load: one static site and no backend. It adds a
database to patch and a control-plane to run **before** it renders any service. The step stays cheap
the day it is justified (several long-lived services, or a stateful app-server): everything is
already containerized.

## Consequences

**Closes:** the managed comforts (preview-deploys, zero-ops scaling and rollback); we take on uptime,
OS patches and backups; a bit of contributor friction — no one-click deploy.

**Opens:** EU residence of the only possible PII; total narrative coherence; zero lock-in; and,
lacking a backend, the claim *"we collect nothing, not even your email"*.
