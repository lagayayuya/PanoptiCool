# Constats sensibles — catalogue & garde-fous

> Document **durable et vivant**. Il tient le **catalogue produit** (les labels, les lectures
> reconnues) et les **garde-fous en exigences testables**. Le *pourquoi* vit dans
> [ADR-0003](adr/0003-doctrine-constats-sensibles.md) — un ADR fige la règle et sa raison, ce
> document tient le journal et se met à jour au fil des cas.
>
> Périmètre de la mesure d'origine : **premier connecteur (TikTok), en français**. Le banc était
> jetable ; la note de findings chiffrée vit en commentaire de PANO-33.

---

## 1. Catalogue — les six labels sensibles

Colonnes : **dit** (ce que le constat affirme) · **percussion** · **preuves** (provenance lisible
hors-ligne) · **coût d'erreur** (= coût d'un faux positif) · **cadrage**.

Les six labels sont **traités à plat** : même porte, même grillage, `mental_health` compris. Pas de
graduation — un cran réservé à un label serait arbitraire. La question se rouvrira avec le cadrage
abus / VSS (différé, R&D).

| id | dit (« une plateforme pourrait… ») | percussion | preuves | coût d'erreur (FP) | cadrage |
|----|-----------------------------------|-----------|---------|--------------------|---------|
| `health_physical` | …inférer une **condition médicale / un état de santé physique** | élevée (donnée santé, discriminante) | condition nommée à soi *(explicite)* / recherches santé répétées *(indirect)* — `Searches`, `Comments` | élevé : imputer une maladie à tort | constat nommé si écrit, large sinon ; jamais « tu es malade » |
| `mental_health` | …inférer une **vulnérabilité psychique / un état affectif** | **maximale** (fenêtre de vulnérabilité) | terme clinique à soi / soin pour soi *(explicite)* · affect répété *(indirect)*. **Mesuré : l'oblique pur échappe au lexique** (le mur) | **maximal** : pathologiser à tort | preuves requises ; éventail de lectures sur l'indirect |
| `sexuality` | …inférer une **orientation / identité** | élevée (**outing**) | auto-désignation / bio revendiquée *(explicite, signal fort)* · intérêt communautaire répété *(indirect)* | élevé : outing | **jamais nommer depuis l'indirect** → constat large + éventail `vécu · allié · curiosité` |
| `politics` | …inférer une **orientation politique** | moyenne-élevée | affiliation nommée *(explicite)* · engagement répété *(indirect)* | élevé | plateforme-sujet |
| `religion` | …inférer une **appartenance / pratique religieuse** | élevée (croyance imputée) | auto-déclaration / pratique *(explicite)* · contenu religieux répété *(indirect)* | élevé | plateforme-sujet. **Dette : axe à rendre bidirectionnel** (voir §4) |
| `conflictual` | …te classer **« compte conflictuel »** depuis tes messages | élevée (jugement de caractère) | **insultes ÉMISES visant un autre utilisateur** — *item-level* | élevé | voir §1bis |

### 1bis. Sous-classe dédiée — « jugement de caractère » (`conflictual`)

Porte **« reçus + plateforme-sujet »**, non négociable :

- **in** seulement si l'insulte est **émise** par la personne (pas **citée** : « il m'a traité de… »
  = reçu, hors-champ) ;
- **et** vise **un autre utilisateur** (un juron de frustration sans cible — « putain ce bug » — ne
  compte pas) ;
- **pas d'étage indirect** : les insultes émises *sont* le signal explicite. On ne fabrique jamais un
  constat vague « tu es agressif ».

### 1ter. Constats factuels / hors mesure-texte (rappel)

- **`age`** : une date de naissance est une **donnée fournie**, pas une inférence — « ils ont ta date
  de naissance exacte », hors classifieur texte. Tranche **inférée** = basse priorité, marquée
  fragile, hors périmètre.
- **anorexie / troubles alimentaires** : label de **soin maximal** (comme `mental_health`), hors
  benchmark texte.
- **horaires / temps d'usage** : viennent des **timestamps**, pas du texte ; signal très faible,
  jamais affirmé.

---

## 2. Garde-fous → exigences testables

Chaque décision de fond d'[ADR-0003](adr/0003-doctrine-constats-sensibles.md) devient ici une
**propriété vérifiable** — le *quoi tester*, pas le *pourquoi* (qui reste dans l'ADR).

Cible : `golden` (propriété moteur) · `classifieur` (règle lexique) · `mesure` (vérité-terrain) ·
`UX` (affichage) · `preuves` (modèle de données).

> **Les identifiants `SENS-*` sont des points d'ancrage stables** — le code les cite (voir
> `detect/filters-en.ts`, `detect/detect.test.ts`). On ne les renumérote pas ; une exigence retirée
> laisse son id vacant plutôt que de décaler les autres.

| id | exigence (assertion testable) | cible |
|----|-------------------------------|-------|
| **SENS-A1** | Aucun constat sensible ne s'affiche en « tu es X », à aucun niveau de confiance ; il se lit « une plateforme tenterait d'inférer X ». | `golden` |
| **SENS-A2** | Le constat sensible se rend en **syntagme sans sujet** (« Signal indirect associable à la santé mentale ») : pas de 2ᵉ personne, pas de verdict sur la personne, pas de label sensible nu sans marqueur d'inférence. | `golden` |
| **SENS-A3** | Le discours « avec si peu » (fait + limite) est présenté **une fois**, dans un moment pédagogique dédié, **pas** répété sur chaque carte ; ses deux faces apparaissent ensemble. | `UX` |
| **SENS-A3-bis** | L'avertissement « suppositions, pas certitudes » est présent et **visible dans la zone de résultats** — pas seulement au seuil du site. Il est *load-bearing* : sans lui, la posture déclarée n'est plus valide. | `UX` |
| **SENS-B1** | Deux étages : terme explicite à soi → constat **nommé** (confiance plus haute) ; topical répété sans terme → constat **large** (confiance basse, zone d'hésitation). | `classifieur` |
| **SENS-B2** | Un constat **précis** n'apparaît **que si** le terme précis est présent ; aucune condition nommée devinée par recoupement. Le terme déclencheur est **montré** en surbrillance, pas deviné. | `golden` |
| **SENS-B3** | Axe **pour-qui** (vécu / signal-sans-vécu) distinct de l'axe nommé/large : soin **pour soi** = signal fort de vécu même sans terme clinique ; **pour autrui** = signal-sans-vécu, dégradé en indirect, jamais nommé sur le locuteur. | `classifieur` |
| **SENS-B4** | Auto-étiquette **revendiquée en bio** (drapeau/badge) = signal **fort/explicite**, jamais indirect. | `classifieur` |
| **SENS-B5** | `conflictual` : **pas** d'étage indirect ; constat seulement sur insulte **émise** (≠ citée) **visant un autre utilisateur** (juron de frustration sans cible exclu). | `classifieur` |
| **SENS-C1** | Vérité-terrain à **trois** états par (personne × label) : vécu / signal-sans-vécu / non-porteur réel. | `mesure` |
| **SENS-C2** | « signal-sans-vécu tagué » et « non-porteur réel tagué » comptés **séparément**, jamais additionnés ; **seul le second** est un FP. | `golden` |
| **SENS-C3** | Éventail de lectures porté par la **preuve**, en mode `ranked` (ordonné) ou `equal` (à égalité) ; la confiance vit sur le **constat**, **jamais** par lecture — aucun poids, score ou pourcentage. `ranked` **ordonne, il ne chiffre pas**. Un constat explicite à haute confiance n'a **pas** d'éventail. | `golden` |
| **SENS-C4** | Tout constat sensible **démarre replié**, derrière un en-tête portant le badge **« sensible »** : le repli est la porte du consentement, le badge dit ce qu'il y a derrière. **Traitement plat sur les six labels**, `mental_health` compris. | `UX` |
| **SENS-C5** | Chaque constat porte ses **items-source dépliables** (verbatim + canal + index source, référence **directe**) ; la page montre la **réutilisation** d'un même item par plusieurs constats (« aussi exploité par… »), **recalculée au rendu**. Seuls les items **cités** franchissent la frontière moteur→UI. | `preuves` + `UX` |

**Conservé, hors tableau :**

- **SENS-MUR** *(instanciation concrète de SENS-A3)* — montrer **une phrase captée vs une non
  captée** mais qu'une plateforme lirait ; matière actuelle = les **obliques purs** mesurés
  (`mental_health`, `sexuality`). À **re-cibler à chaque palier** de détection, **jamais retirée** :
  la preuve du mur est pérenne, il restera toujours un cran au-dessus à montrer (demain, le contenu
  réel des vidéos, que l'export ne porte jamais).

---

## 3. Ce que la mesure a établi

- **Lexique FR deux étages = socle.** Solide sur l'explicite et le canonique ; FP cantonnés au
  **polysémique ordinaire** (« église », « déprimé », « malade ») — pas sur le sensible grave.
- **Finding fondamental, MESURÉ** : des **constats obliques purs** (`mental_health`, `sexuality`)
  qu'aucun lexique ne rattrape — *le sens sans vocabulaire mobilisable*. **Cette cécité EST la
  démonstration de l'asymétrie** : la plateforme monte cette marche ; un outil honnête et local, non.
- **Un bras modèle reste une exploration**, rien n'est adopté ni mesuré.

---

## 4. Dettes & questions ouvertes

- **Dette — stratégie lexicale thématique** ([PANO-36](https://linear.app/yuya/issue/PANO-36)) : enrichir
  le lexique par **champs lexicaux structurés par label** (variantes, registres, périphrases), et non
  par rebouchage ponctuel. Inclut le champ « mal-être ado / registre parent » (« décroche », « se
  renferme »).
  - **LIMITE à acter** : enrichir le lexique repousse la frontière de l'**explicite** mais **ne
    résoudra jamais l'oblique pur** (« no futur… » n'a aucun marqueur à ajouter). Dette lexique ≠
    solution de l'oblique.
- **Axe `religion` bidirectionnel** ([PANO-38](https://linear.app/yuya/issue/PANO-38)) : couvrir
  **pratique ↔ critique/hostilité** (neutralité — le silence sélectif est un jugement déguisé). La
  frontière critique-d'idées vs insulte-de-personnes (qui chevauche `conflictual`) reste **en dette**,
  à border à l'implémentation, terrain en main.
- **Portabilité EN** du classifieur ([PANO-35](https://linear.app/yuya/issue/PANO-35)) — **lot 1
  LIVRÉ**. Mesuré : les filtres étant FR-only, négation / citation / 3ᵉ personne **échouaient OUVERT**
  sur du texte EN — « my sister has depression » posait un constat **NOMMÉ** sur le locuteur (violant
  SENS-B3, SENS-C1/C2) par simple **homographie FR/EN**, sans aucun marqueur EN. Le lot 1 referme les
  trois filtres protecteurs, goldens miroir à l'appui, sans régression FR. **Restent en dette** :
  l'auto-déclaration EN (lot 2 — le seul filtre qui *crée* un constat nommé, donc à mesurer), les
  marqueurs EN des six lexiques, et un **trou de sûreté FR relevé** : la liste de 3ᵉ personne ne porte
  ni « ma mere » ni « mon pere ».
- **Orientation explicite-assumée via bio** (signal fort bien classé) — futur roster de mesure.
- **Arbitrage central** ([PANO-37](https://linear.app/yuya/issue/PANO-37)) : **DÉTECTER MIEUX vs
  DÉMONTRER MIEUX** — capter l'oblique réduirait la démonstration du mur.

---

## 5. Registre des lectures par label

> Ce registre **s'enrichit au fil des cas**. La multi-interprétabilité dépend du thème — l'axe de
> religion n'est pas celui de la santé mentale. L'ADR fige le **principe** ; ici se tient le
> **journal** des lectures reconnues, label par label. Pré-rempli **uniquement** avec ce qui a été
> établi ; le reste est ouvert, **sans inventer**.
>
> Le lexique reprend ces clés et **n'en invente aucune** : ajouter une lecture, c'est amender ce
> registre d'abord.

| label | lectures reconnues (à plat) | frontière / chevauchement connu | statut |
|-------|-----------------------------|---------------------------------|--------|
| `health_physical` | vécu personnel · préoccupation pour un proche · curiosité | — | **traité** *(3ᵉ lecture « proche » ajoutée : le signal-sans-vécu vaut aussi pour la santé physique, aligné sur `mental_health`)* |
| `mental_health` | vécu personnel · préoccupation pour un proche · curiosité | — | **traité** |
| `sexuality` | vécu personnel · allié · curiosité | insulte à connotation sexuelle visant une personne → `conflictual` ; slur de groupe → hors produit (futur label) | **traité** |
| `politics` | engagement / militantisme · avis personnel · curiosité / veille | — | **traité** |
| `religion` | pratique / appartenance · avis personnel · curiosité / intérêt | label de SUJET ; hostilité anti-croyant → `conflictual` ; critique d'idée → nulle part ; slur de groupe → hors produit (futur label) | **traité** |
| `conflictual` | agression émise · hostilité subie / rapportée | critique d'idée exclue | **traité** |
