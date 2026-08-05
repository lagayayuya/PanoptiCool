# ADR-0008: Reading the content of messages — on demand, in memory, on a gesture

**Status:** Accepted
**Date:** 2026-08-05
**Decider:** yuya

## Context

Until the Instagram connector, PanoptiCool never read what anyone had written to anyone. The TikTok
export carries comments and searches — short, public, addressed to nobody — and the analysis reads
them because that is what the platform infers from. Nothing else in the product touched a message.

The Instagram export is a different object. `your_instagram_activity/messages/inbox/` holds every
thread the account ever had: the text, the photos, the videos, the voice notes. On the account this
connector was built against, that is more than 80 000 messages over ten years. It is, by a wide
margin, the most intimate thing the archive contains — more than the locations, more than the
inferred interests.

The first version of the connector said so and stopped there: it counted threads, messages and media
per year and displayed volumes and rhythms. The interface carried the guarantee in as many words —
« aucun contenu de message affiché ni retenu ».

Two features made that guarantee false, and they were built deliberately:

1. **the conversation reader** — opening a thread from the beginning, which is the one thing the
   volumes cannot give you and the one thing people asked for first;
2. **the local AI analysis of a thread** — the Instagram counterpart of the TikTok section, which
   sends the text of a conversation to a language model.

Both are the point of the product rather than a compromise of it: a mirror that refuses to show the
thing that matters most is not being careful, it is being useless. But shipping them while a sentence
elsewhere claimed the opposite would have been the one failure this repo cannot afford — the
product's whole thesis is that platforms say one thing about your data and do another.

## Decision

**The content of a message is read only on an explicit gesture, only in memory, and is never kept.**

Four rules, and each is enforced by where the code lives rather than by intention.

### 1. The analysis does not read content. It never did, and it still does not.

The connector's report (`engine/instagram/conversations.ts`) carries counts, dates, participants and
media types. No message text crosses into a report, and no report is the source of anything the
reader sees as a quotation. A pass over the whole archive that also read the text would put the text
in a structure the rest of the product handles freely — and from there it would leak into a golden, a
log or a snapshot without anyone deciding it should.

### 2. Reading a thread is a second, separate path

`makeThreadReader` (`engine/instagram/connector.ts`) opens ONE thread's files, on demand, from a
source that is still open on the main thread. It is called from exactly two places: the conversation
reader when someone opens a thread, and the AI page when someone picks one. It returns to the caller
and is not stored.

⚠ **It runs on the main thread, and that is deliberate.** The worker that ran the analysis is
thrown away when the analysis ends. Keeping a worker alive to hold message text — the one kind of
data we do not want held — is the wrong shape for the wrong reason.

### 3. Nothing is persisted, because there is nowhere to persist it

No `localStorage`, no `IndexedDB`, no cache, no file written, no network recipient other than a
`llama.cpp` server the reader started themselves on their own machine (ADR-0006). Closing the tab
ends it. This is not a policy applied to a store; it is the absence of a store, which is the same
property ADR-0001 and ADR-0002 buy everywhere else.

### 4. The claim moves with the behaviour

The guarantee that said no content is read is gone from the interface. The legal notice states, in
both languages, what is actually true: the analysis counts, the text of a thread is read if you open
that thread or send it to the local model, on your gesture, in memory, without being kept.

## Consequences

- **The AI page is the only place in the product that sends message content anywhere**, and it sends
  it to `localhost`. The sampling that decides WHICH messages go (`ai/conv-prompt.ts`) is therefore a
  privacy surface as much as a quality one — it is why the page shows the exact payload before
  anything is sent, and why sending is a click and never a default.
- **A screenshot of the reader is a screenshot of someone's private messages.** No render of it —
  golden, documentation, README, journal — may come from a real export. The synthetic persona exists
  for this, and it is why `?demo` builds a real archive rather than injecting a report.
- **The repository invariant is unchanged and now has teeth it did not need before**: no verbatim
  content from a real export enters this repo, in any form, including in a test fixture.
- ⚠ **What this ADR does not cover.** It says nothing about what the reader does with the answer a
  model gives them. The model runs on their machine, the text never left it, and what happens next is
  outside anything this project can or should govern.

## Alternatives considered

**Keep the volumes-only promise and ship neither feature.** Refused: the thread reader was the most
asked-for thing in the prototype, and an Instagram dossier that can count your messages but not show
you one reads as a tease rather than as a mirror.

**Read the text during the analysis and hold it in the report, gated by a flag.** Refused: a flag is
a promise made in one place and kept in every other. The text would be in memory for the life of the
page, inside the structure every other surface reads freely, and the guarantee would rest on nobody
ever writing `report.conversations[0].messages` into a render.

**Ask for consent once, at the start, for everything.** Refused: consent given before seeing anything
is consent to an abstraction. The gesture that opens a thread is the consent, and it is renewed each
time because it is the same gesture.
