# The conversation-analysis prompts, for ratification

Everything the local model is sent when analysing an Instagram conversation, in both languages, on
one page. It exists because these strings are the **ratifiable perimeter of what the tool asks a
model to deduce about a person** — the same human gate the engine's wording gets, applied to the one
place where a machine writes about someone with no lexicon in between.

**Status.** The **French is ratified** (Yul, on the prototype). The **English is a translation
awaiting ratification** — the precedent set by `web/src/ai/prompt.ts` is that the English wording is
*dictated by yuya, word for word*, and that has not happened for these. Nothing here is on a public
page yet.

Source of truth: [`web/src/ai/conv-prompt.ts`](../web/src/ai/conv-prompt.ts). The strings below were
rendered from it, not retyped.

---

## 1. The system prompt

Sent as the `system` message. It is **editable in the interface**, and what the person reads in that
field is exactly what is sent — no instruction is appended behind the scenes.

The date is **injected from the clock**, not written into the string. A local model has no notion of
the present and, without it, dates the exchanges against its own knowledge cutoff. The examples below
render it as of **August 2026**.

**FR — ratified**

> Voici des extraits d'une conversation privée Instagram, préfixés du prénom de leur auteur. Les
> extraits sont regroupés par période, du plus ancien au plus récent. Quelle est la dynamique de
> cette relation et son évolution dans le temps ? Donnes une synthèse générale à la fin, notamment
> sur ce qui semble être la nature de la relation (amitié, famille, partenaire, professionnel ou
> autre). Sois concis et ne sur-interprète pas. La date actuelle est août 2026.

**EN — proposed**

> Here are extracts from a private Instagram conversation, each prefixed with its author's first
> name. The extracts are grouped by period, from oldest to most recent. What is the dynamic of this
> relationship and how has it changed over time? Give a general summary at the end, in particular on
> what the nature of the relationship appears to be (friendship, family, partner, professional or
> other). Be concise and do not over-interpret. The current date is August 2026.

---

## 2. The safety clause — added when the box is ticked

Appended **inside the editable field**, visible and modifiable like the rest.

It **names its grounds** rather than forbidding « sensitive topics » wholesale: an abstract
instruction does not tell a model what to refrain from, and it goes on doing it believing it has
obeyed. The grounds named are the ones ADR-0003 holds costliest to have wrongly attributed, and the
final clause aims at the **gesture** rather than its object — what wounds is going from a clue to a
category.

**FR — ratified**

> Ne déduis rien sur la santé mentale, les convictions religieuses, l'orientation sexuelle,
> l'origine ou les opinions politiques des personnes, et ne généralise pas : ne conclus rien d'un
> individu à partir d'un groupe supposé, ni d'un groupe à partir d'un individu.

**EN — proposed**

> Do not infer anything about the mental health, religious beliefs, sexual orientation, origin or
> political opinions of the people involved, and do not generalise: conclude nothing about an
> individual from a supposed group, nor about a group from an individual.

---

## 3. The multi-thread clause — added when several conversations go together

**FR — ratified**

> Les messages viennent de plusieurs conversations distinctes, chacune annoncée par son en-tête. Ne
> les confonds pas, et compare-les si c'est éclairant.

**EN — proposed**

> The messages come from several distinct conversations, each announced by its own header. Do not
> confuse them, and compare them where that is illuminating.

---

## 4. The markers inside the body

These are not prose but they are **read by the model**, so they are part of what is being ratified.

| Marker | FR | EN |
|---|---|---|
| Period header | `--- Période 2/5 · mars 2024 ---` | `--- Period 2/5 · March 2024 ---` |
| Silence before earlier context | `--- (après un silence) ---` | `--- (after a silence) ---` |
| Undated period | `date inconnue` | `unknown date` |
| A photo / video / voice note | `(photo)` `(vidéo)` `(vocal)` | `(photo)` `(video)` `(voice note)` |
| A shared link | `(lien partagé)` | `(shared link)` |
| A call | `(appel, 12 min)` | `(call, 12 min)` |
| A deleted message | `(message supprimé)` | `(deleted message)` |
| Repeated identical lines | `[6-8] Alex : (vocal) ×3` | `[6-8] Alex : (voice note) ×3` |

The silence marker **explains itself on its own line**, deliberately: a system-prompt supplement used
to give the key, and was removed so that the editable field is the whole prompt. A marker whose
meaning lives elsewhere is a marker that can be lost.

---

## 5. What the model actually receives

A rendered example, from synthetic messages — invented names, invented sentences, nothing from any
export. Two exchanges ten months apart; the second ends with three voice notes in a row.

**FR**

```
--- Période 1/2 · mai 2023 ---
[0] Sam : tu fais quoi ce week-end ?
[1] Alex : rien de prévu, pourquoi
[2] Sam : on avait dit qu on irait voir l expo
[3] Alex : ah oui vrai

--- Période 2/2 · mars 2024 ---
[4] Sam : ça fait longtemps
[5] Alex : oui trop
[6-8] Alex : (vocal) ×3
[9] Sam : haha ok je réponds ce soir
```

**EN** — note that the **message text stays in its original language**; only the scaffolding is
translated. A French thread read with an English prompt looks like this:

```
--- Period 1/2 · May 2023 ---
[0] Sam : tu fais quoi ce week-end ?
[1] Alex : rien de prévu, pourquoi
[2] Sam : on avait dit qu on irait voir l expo
[3] Alex : ah oui vrai

--- Period 2/2 · March 2024 ---
[4] Sam : ça fait longtemps
[5] Alex : oui trop
[6-8] Alex : (voice note) ×3
[9] Sam : haha ok je réponds ce soir
```

The optional statistics block, when ticked, is prepended above the first period header. It is **off
by default**: the parent product's 12/07 bench measured that behavioural aggregates *degrade* output
quality — the model leans on the summary instead of reading. The box exists because it was asked
for, and the interface shows that measurement beside it.

---

## 6. ⚠ Five things to decide, and one to know

1. **The French says « Donnes une synthèse ».** The imperative is `Donne`, without the `s`. It is in
   the ratified string, so it is reported rather than corrected — the same typo is in the TikTok
   prompt (`prompt.ts`), so fixing one means fixing both, and that is a ratification.

2. **`[0] Sam : text` keeps the French spacing in English.** A space before the colon is French
   typography; English would write `[0] Sam: text`. The format is what the 12/07 bench measured, and
   changing it changes every line's token count and what the model reads as the separator. The same
   reasoning already kept `(rech)` untranslated in the TikTok prompt. **Proposed: leave it**, and
   decide it on a manual test against a local model rather than in passing.

3. **The English safety clause may be more likely to trigger a blanket refusal.** Models are far
   more heavily aligned in English, and a clause that explicitly names « sexual orientation, mental
   health » can push a small local model into refusing the whole task — safer and useless.
   `prompt.ts` already carries this warning for its own clause. **Unverified on both sides**; it
   needs one manual run per language before the English ships.

4. **The date renders as `August 2026` in English and `août 2026` in French.** Locale `en-GB`. If you
   want `2026-08` or `August 2026` in both, say so — it is one line.

5. **The comments channel was not ported.** The export does contain the text of comments you posted,
   and the prototype had a second prompt for it (`DRAFT_COMMENTS_PROMPT`), removed from the interface
   by your decision. Following « no code that runs for no one », neither the prompt nor its selector
   came across. Say the word and it comes back **designed**, not revived.

And one to know rather than decide: **every threshold in the sampler was measured on French
threads**. The token estimate is calibrated on French, so an English thread is over-estimated and
fewer messages are sent than the window would hold — corrected on the first run by the server's real
counter, never before it.
