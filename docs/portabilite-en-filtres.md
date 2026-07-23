# EN portability — contextual filters (PANO-35, batch 1 DELIVERED · batch 2 in debt)

> Durable output of the "EN variants" session. **Batch 1** (negation / citation / 3rd person EN) is
> **delivered and locked by goldens**. **Batch 2** (EN self-declaration) is an **assumed and named
> debt**. Debt ref. **PANO-35** (`docs/constats-sensibles.md`).

---

## 1. What the measurement established (before batch 1)

The 4 filters of `detect.ts` were probed on EN phrases, **D1 lexicons unchanged**:

| filter (doctrine) | FR phrase | EN phrase | EN verdict (before) |
|---|---|---|---|
| negation | « je fais **pas** de depression » → no tag | « i am **not** in depression » | **`explicit` tag** ❌ |
| negation | — | « i **never** had depression » | **`explicit` tag** ❌ |
| citation | « il **m'a dit** que… » → no tag | « she **told me** her depression is hard » | **`explicit` tag** ❌ |
| 3rd person (B3) | « **ma soeur** a une depression » → no tag | « **my sister** has depression » | **`explicit` tag** ❌ |
| self-declaration | « **je suis** depressif » → explicit tag ✅ | « **i am** depressive » | **no tag** ❌ |

**The asymmetry was the heart of the problem.** The three **protective** filters failed **OPEN**; the
only filter that **legitimizes** a named tag (the copula) failed **CLOSED**. The EN behavior was the
exact inverse of the doctrine: **wrongful naming maximized**, **rightful naming forbidden**.

### What this violated, by name
- **SENS-B3 / ADR-0003** — « my sister has depression » produced a **NAMED** tag on the speaker: the
  signal-without-lived-experience path (degradation to indirect) did not exist in EN.
- **SENS-C1 / C2 / §4.4(a)** — « i am **not** in depression » is a **real non-carrier**: the text has
  the form of the signal and **negates** it. It is the **true false positive** in the C2 sense — the
  one that counts. A negation is not an "alternative reading" to respect: it is a denial.

### The vector: HOMOGRAPHY, with no EN marker at all
The hole was **already open** — and it required no EN addition to fire:
- `mental_health`: **« depression »**, **« burnout »** (identical FR/EN spellings); same case for
  `ptsd`, `toc`, `borderline`, `blues`, `xanax`, `prozac`;
- `health_physical`: **« diabetes »** matched « diabete » **via the plural tolerance `s?`** — a
  homography path one does not think of;
- `religion` / `politics`: **no leak** (« religious » ≠ « religieux ») — a door closed by accident of
  spelling, not by design.

---

## 2. The analysis error not to repeat (yuya arbitration)

The first reading of this session concluded there was an **architectural blocker**: "D1-EN is
machinery, not lexicon". **That is false, and the arbitration corrected it.**

`filters-fr.ts` carries its own nature at its head: *« **données transverses** de la machinerie, PAS
du lexique de label »*. The lists are **vocabulary**; only the matching logic is machinery. **A
LEXICON batch was therefore missing** — that of the transverse filters — and not an architecture
project. The consequence is direct: it was deliverable **immediately**, and **a priority**, since it
is those lists that carried all the risk.

**The criterion that structures the split is the DIRECTION OF FAILURE**, and it decides the priority
on its own:

| list | direction of failure | effect if wrongly applied | verdict |
|---|---|---|---|
| negation, citation | suppresses a hit | loss of **recall** | **CLOSED → batch 1** |
| 3rd person | degrades explicit → indirect | **less** naming | **CLOSED → batch 1** |
| omission verbs | **cancels** a negation | re-asserts a hit | OPEN, but inert surface → batch 1, short list |
| **self-declaration** | **creates** a named tag | **names wrongly** | **OPEN → batch 2, measurement required** |

---

## 3. What batch 1 delivers

- `engine/detect/filters-en.ts` — exact counterpart of `filters-fr.ts`: `NEGATIONS_EN` (contractions
  included, **two spellings**: « don't » and « dont »), `OMISSION_VERBS_EN`, `CITATION_MARKERS_EN`,
  `THIRD_PERSON_EN`. Each list carries its genericity justification.
- `engine/detect/filters.ts` — FR + EN composition. `detect.ts` consumes this module (a ONE-line
  import change) and does not know how many languages exist: one more language = one data module +
  one line.
- **Mirror goldens** (`detect.test.ts`): each FR golden has its EN counterpart, on the **same dummy
  lexicons**, plus a named **regression test** that locks « my sister has X » as non-named.

**Verified after delivery** (same probes as in §1): the 5 rows of the table are closed, and the recall
control holds — « i have depression » stays an `explicit` tag. The door is closed **without breaking
detection**.

### No language detection — a choice, not a shortcut
Both languages are applied to **all** items. Because the protective filters fail CLOSED, over-filtering
costs at worst some **recall**, never precision on the sensitive. A language detector would introduce
**its own false positives** (items are short — a three-word search has no reliable language) for zero
gain in the safe direction. **Strict FR non-regression**: the FR goldens are unchanged and green.

---

## 4. Open debts — state revised after the EN campaign (2026-07-21)

1. ~~**Batch 2 — EN self-declaration**~~ — **UNTIED, and not by the measurement demanded.** The
   premise ("the copula anchors, we must measure as in PANO-33") turned out false: the copula anchors
   nothing in English, and safety moved to the TIER — the delivered `selfDeclaredEn` tier lands broad
   and never names (`SELF_DECLARATION_HEADS_EN`). The `detect.test.ts` lock was not inverted: its zero
   changed cause (the language door), not value.
2. ~~**EN markers of the 6 D1 lexicons**~~ — **WRITTEN**, one batch per label, each with its own
   admission line (`docs/methode-portabilite-en.md`).
3. **Gap noted, NOT corrected**: `THIRD_PERSON` (FR) carries neither « ma mere » nor « mon pere ». The
   EN list carries them (« my mother », « my dad »…). Not touched here — strict FR non-regression. To
   be arbitrated separately: it is an **FR safety** hole, not a symmetry detail.
4. **`NEGATION_WINDOW` (3 tokens)** is measured on FR and **reused** in EN on the argument that EN
   negation precedes the marker as in FR. Reasoned transport, **not measured**: to be re-measured if an
   EN corpus contradicts it.
