# Portabilité EN — filtres contextuels (PANO-35, lot 1 LIVRÉ · lot 2 en dette)

> Sortie durable de la session « variantes EN ». Le **lot 1** (négation / citation / 3ᵉ personne EN)
> est **livré et verrouillé par goldens**. Le **lot 2** (auto-déclaration EN) est une **dette
> assumée et nommée**. Réf. dette **PANO-35** (`docs/constats-sensibles.md`).

---

## 1. Ce que la mesure a établi (avant le lot 1)

Les 4 filtres de `detect.ts` ont été sondés sur des phrases EN, **lexiques D1 inchangés** :

| filtre (doctrine) | phrase FR | phrase EN | verdict EN (avant) |
|---|---|---|---|
| négation | « je fais **pas** de depression » → aucun tag | « i am **not** in depression » | **tag `explicit`** ❌ |
| négation | — | « i **never** had depression » | **tag `explicit`** ❌ |
| citation | « il **m'a dit** que… » → aucun tag | « she **told me** her depression is hard » | **tag `explicit`** ❌ |
| 3ᵉ personne (B3) | « **ma soeur** a une depression » → aucun tag | « **my sister** has depression » | **tag `explicit`** ❌ |
| auto-déclaration | « **je suis** depressif » → tag explicite ✅ | « **i am** depressive » | **aucun tag** ❌ |

**L'asymétrie était le cœur du problème.** Les trois filtres **protecteurs** échouaient **OUVERT** ;
le seul filtre qui **légitime** un tag nommé (la copule) échouait **FERMÉ**. Le comportement EN était
l'exact inverse de la doctrine : **nommage à tort maximisé**, **nommage à bon droit interdit**.

### Ce que cela violait, nommément
- **SENS-B3 / ADR-0003** — « my sister has depression » produisait un tag **NOMMÉ** sur le
  locuteur : le chemin signal-sans-vécu (dégradation en indirect) n'existait pas en EN.
- **SENS-C1 / C2 / §4.4(a)** — « i am **not** in depression » est un **non-porteur réel** : le texte
  a la forme du signal et le **nie**. C'est le **vrai faux positif** au sens de C2 — celui qui se
  compte. Une négation n'est pas une « lecture alternative » à respecter : c'est un démenti.

### Le vecteur : l'HOMOGRAPHIE, sans aucun marqueur EN
Le trou était **déjà ouvert** — et il ne demandait aucun ajout EN pour tirer :
- `mental_health` : **« depression »**, **« burnout »** (graphies identiques FR/EN) ; même cas pour
  `ptsd`, `toc`, `borderline`, `blues`, `xanax`, `prozac` ;
- `health_physical` : **« diabetes »** matchait « diabete » **via la tolérance de pluriel `s?`** —
  un chemin d'homographie auquel on ne pense pas ;
- `religion` / `politics` : **aucune fuite** (« religious » ≠ « religieux ») — porte fermée par
  accident de graphie, pas par conception.

---

## 2. L'erreur d'analyse à ne pas refaire (arbitrage yuya)

La première lecture de cette session concluait à un **blocage architectural** : « D1-EN est de la
machinerie, pas du lexique ». **C'est faux, et l'arbitrage l'a corrigé.**

`filters-fr.ts` porte en tête sa propre nature : *« **données transverses** de la machinerie, PAS du
lexique de label »*. Les listes sont du **vocabulaire** ; seule la logique de matching est de la
machinerie. **Il manquait donc un lot de LEXIQUE** — celui des filtres transverses — et non un
chantier d'architecture. La conséquence est directe : c'était livrable **immédiatement**, et
**prioritaire**, puisque ce sont ces listes-là qui portaient tout le risque.

**Le critère qui structure le découpage est le SENS DE L'ÉCHEC**, et il tranche la priorité seul :

| liste | direction de l'échec | effet si appliquée à tort | verdict |
|---|---|---|---|
| négation, citation | supprime un hit | perte de **rappel** | **CLOSED → lot 1** |
| 3ᵉ personne | dégrade explicite → indirect | **moins** de nommage | **CLOSED → lot 1** |
| verbes d'omission | **annule** une négation | ré-affirme un hit | OPEN, mais surface inerte → lot 1, liste courte |
| **auto-déclaration** | **crée** un tag nommé | **nomme à tort** | **OPEN → lot 2, mesure requise** |

---

## 3. Ce que le lot 1 livre

- `engine/detect/filters-en.ts` — pendant exact de `filters-fr.ts` : `NEGATIONS_EN` (contractions
  incluses, **deux graphies** : « don't » et « dont »), `OMISSION_VERBS_EN`, `CITATION_MARKERS_EN`,
  `THIRD_PERSON_EN`. Chaque liste porte sa justification de généricité.
- `engine/detect/filters.ts` — composition FR + EN. `detect.ts` consomme ce module (changement d'UNE
  ligne d'import) et ne sait pas combien de langues existent : une langue de plus = un module de
  données + une ligne.
- **Goldens miroir** (`detect.test.ts`) : chaque golden FR a son pendant EN, sur les **mêmes lexiques
  factices**, plus un **test de régression** nommé qui verrouille « my sister has X » en non-nommé.

**Vérifié après livraison** (mêmes sondes qu'au §1) : les 5 lignes du tableau sont refermées, et le
contrôle de rappel tient — « i have depression » reste un tag `explicit`. La porte est fermée **sans
casser la détection**.

### Pas de détection de langue — un choix, pas un raccourci
Les deux langues sont appliquées à **tous** les items. Parce que les filtres protecteurs échouent
CLOSED, le sur-filtrage coûte au pire du **rappel**, jamais de la précision sur le sensible. Un
détecteur de langue introduirait **ses propres faux positifs** (les items sont courts — une recherche
de trois mots n'a pas de langue fiable) pour un gain nul dans la direction sûre. **Non-régression FR
stricte** : les goldens FR sont inchangés et verts.

---

## 4. Dettes ouvertes

1. **Lot 2 — auto-déclaration EN** (`SELF_DECLARATION_HEADS`/`MODIFIERS`). Aujourd'hui « i'm
   depressive » ne tague **rien** : défaut de **rappel**, échouant CLOSED. À traiter avec la mesure
   que PANO-33 a faite pour le FR — c'est le seul filtre qui **crée** un tag nommé. Un golden le
   verrouille en l'état (`detect.test.ts`) : **il devra être inversé** le jour du lot 2.
2. **Marqueurs EN des 6 lexiques D1** — toujours **non écrits**. Le lot 1 rend le terrain sûr
   (les garde-fous existent enfin en EN) mais ne présume pas de la décision d'enrichir : c'est un
   travail de vocabulaire sensible, à sa propre session, avec son sondage FP.
3. **Écart relevé, NON corrigé** : `THIRD_PERSON` (FR) ne porte ni « ma mere » ni « mon pere ». La
   liste EN les porte (« my mother », « my dad »…). Non touché ici — non-régression FR stricte.
   À arbitrer séparément : c'est un trou de **sûreté FR**, pas un détail de symétrie.
4. **`NEGATION_WINDOW` (3 tokens)** est mesurée sur le FR et **réutilisée** en EN sur l'argument que
   la négation EN précède le marqueur comme en FR. Transport raisonné, **non mesuré** : à re-mesurer
   si un corpus EN le contredit.
