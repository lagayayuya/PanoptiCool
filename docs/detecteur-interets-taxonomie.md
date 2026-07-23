# Interest detector (D2) — canonical taxonomy

> Reference **ratified by yuya** (session PANO-74, executed PANO-76). Batches 2–3 execute the
> follow-up **without re-ratifying**: they add lexicons for themes already listed here. Any extension
> outside this list, or any theme that grazes a sensitive subject (D1), **goes back up to yuya**
> before being written.
>
> The D2 analogue of what `docs/constats-sensibles.md` is for D1: the **sense** (which themes, where
> the boundaries are) lives here; the **mechanics** (rule by ranking, `Theme[]` wiring) lives in the
> code (`engine/rules/d2-interests.ts`, foundation PANO-75). The code wires only the subset already
> written (`INTEREST_LEXICONS`); this list is the full intended catalog.

## Sense framework (ratified PANO-74, not reopenable)

- **Granularity — scenario B**: mainstream-usage themes, neither too fine (not « squat » as a theme)
  nor too broad (not « sport » as a single theme). ~52 themes, grouped into families.
- **Inclusion criterion — "demonstrative value"**: a theme enters if it concretely illustrates what a
  platform *could* deduce and *resell*. We do not aim for the exhaustiveness of an advertising
  taxonomy; we aim for the telling demonstration.
- **Sensitive boundary held**: no interest theme overlaps a **sensitive** subject (the 6 D1 labels:
  mental health, physical health, sexuality, politics, religion, conflictual). Interests are **non
  sensitive** by construction (`sensitive: false`).
- **Explicit exclusions (ratified)**: wellness/personal development · diet/nutrition (grazes eating
  disorders → D1) · news/politics (→ D1) · dating · astrology applied to oneself · **gambling** ·
  alcohol. These zones NEVER become interest themes.

## Theme catalog (~52)

Grouped into families (the family is a reading convenience, not a produced entity — D2 produces
**themes**, not families).

### Sport & activité
muscu · running · football · basket · cyclisme · fitness/cross-training · randonnée · skate ·
sports de combat · danse

### Jeux & tech
jeux vidéo · esport · tech · IA · crypto

### Cuisine & food
cuisine · pâtisserie · cuisine végé/vegan · café

### Beauté & mode
maquillage · skincare · mode · sneakers · coiffure

### Musique
K-pop · rap/hip-hop · musique électro/DJ · guitare/instruments

### Culture & médias
manga & anime · cinéma & séries · lecture · exposition & concert

### Animaux
chiens · chats · lapins

### Créatif & maison
dessin/illustration · photographie · jardinage · DIY/bricolage · tricot/crochet

### Auto/moto & voyage
voitures/tuning · motos · voyage

### Savoirs & disciplines
philosophie · sociologie · psychologie · histoire · économie · biologie · physique · mathématiques ·
astronomie/espace

## Boundary notes (to be carried by the lexicons, batches 2–3)

- **psychologie** → **academic** field only (cognitive biases, Freud, famous experiments…). Exclude
  the **clinical** (depression, anxiety, therapy): that is `mental_health` (D1). A psychology lexicon
  that catches « je fais une dépression » is a boundary bug → escalate.
- **économie / histoire** → **knowledge** field (concepts, schools, periods). Avoid **current
  affairs** and **politics** (reform, election, such-and-such party): that is `politics` (D1) or
  out-of-scope.
- **cuisine végé/vegan** → **culinary** interest (recipes, restaurants), not **militant conviction**
  nor **diet**: stay on the dish, not on ethics or weight loss.
- **sports de combat** → **sporting practice** (boxing, judo, MMA as a discipline), never real
  aggression (→ `conflictual`, D1).

## Discipline for writing the lexicons (PANO-70 §3, carried over to D2)

- **Blind**: each marker comes from ordinary language usage (French originally; the English variants,
  annotated `(EN)` inline, follow the same rule), never from a real export. No term
  reverse-engineered from data; no data adjusted to a term.
- **Genericity**: each term is defensible to a stranger, would have been written identically without
  ever having seen any export.
- **Anchoring against polysemy**: a bare-word polysemous marker (football « but », K-pop « bts »,
  sneakers « jordan ») fires on every out-of-domain occurrence — the foundation's floor and ranking
  only catch the **residual** noise, not a systematic false positive. We **exclude the bare word at
  writing time** and we **anchor** (« air max », « fond de teint »). Each lexicon documents at its
  head its **false-positive probe**: terms discarded and why.
- **Hard sensitive boundary**: no interest marker must trigger one of the 6 D1 lexicons. A test
  safeguard (`interests-battery.test.ts`) passes **all** interest markers through D1 and requires zero
  detection; a failure is a boundary signal to escalate, not merely a red test.

## Batch plan — COMPLETED

The plan (batch 1: ~12 demonstrative themes; batches 2–3: the rest) has been executed: **the ~52
themes of the catalog are written and wired**, and the first batches were retrofitted to the standard
of the later ones. This document stays the sense oracle: any extension still goes through it, and
through yuya if it leaves the catalog.

The foundation (`InterestLexicon`, rule by ranking, `Theme[]` wiring) is in place (PANO-75) and **is
not reopened** by the content batches.
