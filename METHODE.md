# Method of collaboration with AI — PanoptiCool

> How I work with AI on this project. Based on the AI Fluency (4D) framework.
> The **project framework** (invariants, conventions, what we don't touch) lives in `CLAUDE.md`, and
> what the product is in `README.md` — this file touches neither, it deals only with the method.

---

## Guiding principle

The steering prompts are kept and are meant to be public. Turn the constraint into an advantage:
**write every prompt as if an evaluator were reading it** — it forces clarity, hence better outputs.
Calibrate the effort: demanding on what matters, pragmatic on everyday dev. Don't make a "fix this
typo" into a monument, or you'll drop the discipline.

### ⛔ Red line
**Never any real data in a prompt** (export, e-mail, IP…). The reason is the one from the principle
above, and it belongs to it alone: **these prompts are public**. A public prompt containing that =
a leak committed by the anti-surveillance project itself. For any example: **synthetic persona
only.**

This is **not** "don't look." A real export can feed a session under explicit consent — `CLAUDE.md`
holds that rule. The two meet on the output, not on the input: what is published never contains a
real value.

---

## The 4D, as concrete habits

**Delegation — before writing.** Open with a one-line contract: *objective · perimeter (in/out) ·
mode (augmentation / automation)*. Decide what stays human: judgments of architecture, framing,
ethics. If you can't formulate the perimeter, you're not ready to delegate.

**Description — during.** The framework is loaded once (via `CLAUDE.md`), not by re-explaining it.
One request per prompt when possible. Separate *thinking* and *instructing*.

**Discernment — at every output.** Never acceptance without review. Define the **acceptance criteria
before** generating, so as to judge on criteria and not on feeling. A well-formatted plan is not a
correct plan.

**Diligence — at closing.** `AI_USAGE.md` entry drafted by the agent and **vetted with a critical eye
by you**: cut the self-congratulation, the skill tends to describe you as more perceptive than you
were. What AI produces in your name is yours: you answer for it.

---

## In-session capture — classify before noting

A bug encountered, a discovery, a lead: don't break your focus to open an issue, and don't let them
slip away. The disciplined move isn't "noting," it's **classifying**, otherwise everything ends up
piled into the backlog. Four natures, four homes:

- **Bug** → dedicated issue, reproducible (what breaks, how to reproduce it). Priority by impact;
  don't block the current flow unless critical.
- **Technical debt** (an assumed shortcut in existing code) → tracking issue attached to the
  originating issue, low priority.
- **Learning / constraint** (a discovered fact that should guide a future decision) → comment on the
  decision gate or the issue concerned. Not a task: material.
- **Deferred perimeter** ("I chose not to do X for now") → to be recorded as a decision, not as debt
  to mop up.

Confusing these natures inflates the backlog with things that aren't work and drowns the real
decisions under tickets. During a session: an agent that runs into one of these cases **flags it and
proposes the nature**, without acting; the sorting and the writing happen at closing, under your GO.

---

## Session & context hygiene

**Fork triggers:** domain change (planning → code → design); context saturated with stale details;
the model repeats itself, forgets a constraint, or goes in circles; a coherent unit of work is
finished.

**The rule that makes forking free:** never use the conversation as memory. Externalize the state
(decisions, open threads, classified captures) into the files / Linear at closing. A fresh session
reloads from the files, not from the history. **Short and focused** sessions > marathon.

---

## Personal pitfalls

- **Solo founder = bus factor of 1.** Don't let the agent be the only one to understand the code.
  Periodically rebuild the mental model yourself.
- **Validating too fast.** A well-presented output invites a rubber stamp. The moment the agent is
  most convincing is the one where you have to slow down — especially on decision gates.
- **The net written by the hand it watches.** An agent asked to give itself its own baseline will
  build it with the mental model that will then do the work — and it will be blind in both places.
  Asking for the **reverse pass** is the move that catches it (below).

---

## Compressing a normative document — the prose golden, and its limit

Used for ADR-0003 (571 → 442 lines, 2026-07-19). The technique: **enumerate every normative
statement BEFORE touching a line**, compress, re-enumerate, and require the inventory to be
**identical**. The prose shrinks freely; an entry that disappears is a deleted rule, whether we meant
it or not. It's the repo's zero-diff golden applied to a text.

What to remember before reusing it, because this is the counterintuitive part:

- **The BEFORE pass found nothing.** 97 statements recorded, 97 found again after compression. Full
  green.
- **The two real losses were found by the REVERSE pass** — rereading the original *without* the
  inventory and looking for what the inventory had never recorded. Eleven rules were missing from
  the baseline; two had actually been deleted, and the before pass couldn't see them: **it sees only
  what the list contains**.
- **The cause isn't inattention, it's the singularity of the mind.** The baseline and the
  compression came out of the same head, in the same pass: a rule invisible to the inventory was
  invisible to the compression too. A net can't measure its own mesh.
- **Seven of the eleven missing ones were rules ABOUT the use of other rules** — where a doctrine
  lives, how it's made verifiable, what one is allowed to transfer from one language to another.
  That's the category we know too well to notice it was never written down.

**So:** a zero-diff inventory proves that no **listed** rule was lost. It proves neither the
completeness of the list, nor that the rule stayed **understandable** — and clarity here is an
arbitration objective, not a finish. The two missing halves are caught by a reverse pass **and** a
human reread, never by the green.

**And the inventory isn't kept.** A prose golden doesn't regenerate: it's synchronized by hand, so it
rots. The one for ADR-0003 was **deleted once the ADR was signed** — a stale baseline under an ADR
name would have been worse than no baseline at all. It lived in the working history (commits
"the normative inventory — the baseline of the prose golden", then "the inventory was incomplete —
eleven rules found by the REVERSE pass"); the pre-publication history recomposition carries only the
result, and that's the normal fate of a baseline: it serves, then it fades.

---

## Red lines

- Real data in a prompt → **never**.
- Accepting an output because it's well-presented → **never**.
- Letting the agent mass-mutate/delete the existing Linear state without your GO → **never**.

---

## The session ritual (the backbone)

1. **Open** — one-line contract: objective · perimeter · mode. (The project framework is loaded from
   `CLAUDE.md`, not re-pasted.)
2. **Work** — *Description → Discernment* loop: criteria first, generation, review, correction.
   Bugs/discoveries are **flagged and classified** along the way, not handled.
3. **Close** — externalize the state · write the classified captures (bug / debt / learning /
   perimeter) · vetted `AI_USAGE.md` entry · decide: continue or fork.
