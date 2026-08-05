# ADR-0006: Access to the local server from an HTTPS site depends on the browser, not on us

**Status:** Accepted
**Date:** 2026-07-19
**Decider:** yuya

## Context

The local AI analysis (ADR-0002 for the framework, `web/src/ai/`) asks the browser to reach
`http://localhost:8080`, the `llama.cpp` server that the person runs on their own machine. The page,
for its part, is served over HTTPS from `panopti.cool` (ADR-0001).

This combination — public HTTPS origin, cleartext recipient on the local loopback — is exactly the one
browsers have spent ten years restricting. **The feature worked in development and failed in
production, and nothing in the code explained the difference**: in development the page is served from
`localhost`, so both the origin AND the target are on the local loopback, a case every engine exempts.

The diagnosis was costly, for a reason that deserves to be recorded: **the block presents itself under
a banner that designates another mechanism.** The two engines lie differently, and the verbatim
messages below are the fastest way, for the next person, to know which wall they are facing.

### Chromium (measured on Brave 1.92, `panopti.cool`, 2026-07-19)

```
Access to fetch at 'http://localhost:8080/v1/models' from origin 'https://panopti.cool'
has been blocked by CORS policy: Permission was denied for this request to access the
`loopback` address space.
```

**"blocked by CORS policy" is a false trail.** The `llama.cpp` server answers CORS perfectly —
verified in `curl`, outside the browser: it reflects the received `Origin` and answers the `OPTIONS`
preflight with `Allow-Methods: GET, POST` and `Allow-Headers: *`, with no setting at all. The real
mechanism is **Local Network Access** (LNA), a **permission** delivered in Chrome 142 and adopted by
Brave in 1.88.127. Chromium files its LNA failures under the CORS banner; this sentence cost the
diagnosis a whole hypothesis.

Declaring the targeted address space changes nothing, and the browser says so itself:

```
Access to fetch at 'http://localhost:8080/v1/models' from origin 'https://panopti.cool'
has been blocked by CORS policy: Request had a target IP address space of `local` yet the
resource is in address space `loopback`.
```

The first message corrects the constant (`loopback`, not `local`); with the right one, the refusal
comes back identical, on the permission. **The two messages differ, and that is what lets one
attribute the failure to the permission rather than suppose it.**

### WebKit / Safari (mechanism verified in source, failure reported by the maintainer)

```
Not allowed to request resource
Fetch API cannot load http://localhost:8080/v1/models due to access control checks.
```

**"access control checks" is the same false trail, in another form.** The two lines are ONE event:
`CachedResourceLoader::requestResource` builds a `ResourceError` of type `AccessControl`, whose console
rendering speaks of access control — whereas the condition that failed is **mixed content**. WebKit
does NOT exempt the local loopback from mixed-content blocking: `MixedContentChecker` has only one
exception, hard-coded for a third-party domain, and the very existence of that exception proves the
rule. The WebKit bug that would lift the restriction has been open **since 2017**, with no activity
since 2023.

Consequence: **Safari has no permission to grant.** No per-site setting, no Develop-menu entry
("Disable Cross-Origin Restrictions" bears on CORS, not on mixed content). The absence of an interface
in the address bar is the expected behavior, not an anomaly.

The two walls are therefore **of different natures** — a permission one can grant on one side, a rule
with no exception on the other — and an interface that confused them would send a Safari user hunting
for a setting that does not exist.

## Decision

1. **We work around nothing.** No fix exists on the site side, and none is sought.
2. **The interface DISTINGUISHES "blocked" from "absent"**, via the permission
   (`navigator.permissions`, `web/src/ai/local-network.ts`), which is read without emitting a request.
   It is the only angle by which a script obtains this information.
3. **The interface INSTRUCTS the unblocking rather than waiting for a prompt.** On Chromium the
   permission stays indefinitely at `prompt` without any window opening — measured, including behind a
   real click (Brave bug `brave-browser#53727`, open). `prompt` and `denied` are therefore treated
   **identically**: from the point of view of the person in front of the screen, a window that never
   opens is a block.
4. **When we do not know, we say so.** A browser whose permission we cannot read falls into an
   `unknown` state where the interface **names no cause** — it cannot distinguish a server that is off
   from a wall — and offers the ways out in the order of what they cost: change browser first, serve the
   site locally next. A false instruction costs more than a vague instruction, and sending someone to
   hunt for a padlock that Safari does not have is a false instruction.
5. **The universal fallback is to serve the site from `localhost`.** A page whose initiator is already
   on the local loopback is exempted **in all three engines**: no more mixed content (both ends are in
   cleartext), no more LNA gate (`loopback → *` is not a local-network request, by definition of the
   specification). This is not a workaround, it is the removal of the problem — and it is the
   architecturally honest answer to "this tool runs on your device". `http://localhost` **stays a
   secure context**: the engine's Worker and the crypto APIs keep working.

**ADR-0001 is intact.** All of this is client code and documentation; no deployment surface is
touched, and the "reversible static" property is not eroded.

## Options discarded, WITH their reasons

A dead end recorded without its reason is a dead end one re-explores.

**TLS on `llama-server` (`--ssl-key-file` / `--ssl-cert-file`), in general.** Discarded because the
gain **depends on the engine, and is worth zero where the problem was measured**. LNA is defined on the
address space **with no reference to the scheme**: `https://localhost` stays `loopback`, so the
Chromium permission applies identically. Granting the permission already dispenses with mixed content,
moreover — TLS is therefore redundant with the fix, and useless without it.
*Honest nuance:* on Safari, whose wall IS mixed content, TLS should work. Discarded anyway: it requires
a trusted certificate in the keychain (a self-signed one fails silently for a subresource), that is, a
trust decision that a privacy-awareness tool cannot ask lightly — and accessibility (CLAUDE.md) forbids
it as the main path. The `localhost` fallback obtains the same result with no certificate, and holds
for all engines.

**A server-side response header.** Discarded: it does not exist.
`Access-Control-Allow-Private-Network` belonged to Private Network Access, **suspended in 2024**; the
word appears nowhere in the LNA specification, which replaces the preflight with a permission.
`llama-server` does not send it and has no setting to do so — verified in source. No header can grant a
permission.

**The `targetAddressSpace` option of `fetch`.** Discarded **by measurement**: with the right constant
(`loopback`), Brave still refuses on the permission. The specification is explicit — this option only
dispenses with the mixed-content check, never with the permission.

**The `--cors-*` flags of `llama-server`.** Discarded: moot. CORS was never the problem (measured in
`curl`), and these flags do not touch the headers at issue.

**Probing the server on page load to "trigger the permission earlier".** Discarded on two grounds. The
window does not open (point 3), so the gain is nil; and a tool that shows surveillance does not contact
a machine without being asked. Deferring the first contact to an explicit click is **kept** — it just
stays on its own terms, and it is at this spot that the interface now places the instruction the
browser does not give.

**Installing the site as a web app (PWA).** Discarded, and the reason is worth retaining because the
question comes back naturally. A PWA installed from Safari **runs in WebKit**; on iOS, every browser is
WebKit whatever it is. Same engine, same mixed-content rule: the installation does not change the
policy, it changes the packaging.

More fundamentally, **the block arises from the GAP between the origin `https://panopti.cool` and the
target `http://localhost`.** As long as the page comes from a remote domain, the gap exists, and no way
of installing, pinning or full-screening it closes it. The only thing that removes it is for **the page
itself to be served from `localhost`** — which is what the fallback above does, and it is precisely why
it works everywhere.

**A proxy, a relay, or a hosted access point.** Discarded outright: the export items would leave toward
a third party. The CLAUDE.md invariant is not negotiable, and no transport convenience opens it.

## What the diagnosis wrongly led us to believe

Recorded because these errors are **reproducible by reading the same clues**, and a reader who redoes
them will lose the same time.

- **`Access-Control-Allow-Private-Network` absent from `llama-server`'s responses** was taken for the
  cause. It was an exact observation of it and a false conclusion: the header belongs to a suspended
  specification and plays no role anymore. It is the fault CLAUDE.md names — **a negative assertion
  verifies what it REACHES, not what it affirms**: the absence was real, its supposed meaning was not.
- **A first attempt in Chromium/Electron succeeded**, which led to concluding too quickly that the
  transport was sound. Electron does not apply LNA. A benchmark that does not reproduce the person's
  environment proves nothing about their case — and it is that green result that nearly led to shipping
  a discriminant (`mode: 'no-cors'`) that fails precisely on the browser concerned.
- **CORS was suspected twice**, once by hypothesis and once by the message's banner. Both engines label
  this block in access-control language; it is the central trap of this case.

## Consequences

**Closes:** the idea that a setting of the product, the server or the launch command could restore the
feature. The dependency is on the browser's policy, and it is endured.

**Opens:** an interface that tells the truth about what just failed — until now the product asserted
"server not detected" to someone whose server was running, at the precise spot where it asks to be
trusted on a fact concerning the person's machine. And a fallback path that, by serving the site from
the machine, makes the local-processing invariant **visible** rather than promised.

**Firefox is measured, and it is the only one of the three that works without explaining anything**
(maintainer, on their machine, 2026-07-19): it opens the permission window **spontaneously**, on
arrival at the page, and the feature works once granted. It is exactly what Chromium was supposed to do
and does not.

The real table, and it is the one the copy must serve:

| Engine | What happens | What the interface has to say |
| --- | --- | --- |
| Firefox | spontaneous window, then it works | nothing |
| Chromium / Brave | works, but the window never opens | the manual padlock path |
| WebKit / Safari | **cannot work** | change browser, or serve locally |

The three are therefore not three degrees of the same problem: **two work and one is a wall.**
