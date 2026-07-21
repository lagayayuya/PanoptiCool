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
| `mental_health` | …inférer une **vulnérabilité psychique / un état affectif** | **maximale** (fenêtre de vulnérabilité) | terme clinique à soi / soin pour soi *(explicite)* · affect répété *(indirect)*. **Mesuré : l'oblique pur échappe au lexique** (le mur) | **maximal** : pathologiser à tort | preuves requises ; éventail de lectures sur les DEUX étages (`ranked` sur le nommé) |
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
| **SENS-B6** | **Registre informationnel** : un item qui *interroge*, *définit* ou *quantifie* une condition (« signes de X », « prevalence of X ») plafonne à l'étage **large**, jamais nommé — **dégradé** comme la 3ᵉ personne, **jamais supprimé**. Règle d'ÉTAGE et non filtre : elle échoue en sous-affirmant, pas en retirant du signal. Vaut pour les six labels. | `classifieur` |
| **SENS-C1** | Vérité-terrain à **trois** états par (personne × label) : vécu / signal-sans-vécu / non-porteur réel. | `mesure` |
| **SENS-C2** | « signal-sans-vécu tagué » et « non-porteur réel tagué » comptés **séparément**, jamais additionnés ; **seul le second** est un FP. | `golden` |
| **SENS-C3** | Éventail de lectures porté par la **preuve**, en mode `ranked` (ordonné) ou `equal` (à égalité) ; la confiance vit sur le **constat**, **jamais** par lecture — aucun poids, score ou pourcentage. `ranked` **ordonne, il ne chiffre pas**. Le constat **nommé** porte un éventail `ranked` : l'étage nommé ne résout que l'ambiguïté LEXICALE (quel sujet), jamais le POURQUOI. La réserve « pas d'éventail » ne vise que la **haute confiance**, que D1 n'émet jamais (nommé → `medium`). | `golden` |
| **SENS-C4** | Tout constat sensible **démarre replié**, derrière un en-tête portant le badge **« sensible »** : le repli est la porte du consentement, le badge dit ce qu'il y a derrière. **Traitement plat sur les six labels**, `mental_health` compris. | `UX` |
| **SENS-C5** | Chaque constat porte ses **items-source dépliables** (verbatim + canal + index source, référence **directe**) ; la page montre la **réutilisation** d'un même item par plusieurs constats (« aussi exploité par… »), **recalculée au rendu**. Seuls les items **cités** franchissent la frontière moteur→UI. | `preuves` + `UX` |

**Conservé, hors tableau :**

- **SENS-MUR** *(instanciation concrète de SENS-A3)* — montrer **une phrase captée vs une non
  captée** mais qu'une plateforme lirait ; matière actuelle = les **obliques purs** mesurés
  (`mental_health`, `sexuality`). À **re-cibler à chaque palier** de détection, **jamais retirée** :
  la preuve du mur est pérenne, il restera toujours un cran au-dessus à montrer (demain, le contenu
  réel des vidéos, que l'export ne porte jamais).

---

## 2bis. La doctrine que RIEN ne tient — l'envers du §2

Le §2 dit quelles décisions d'ADR-0003 sont devenues des exigences vérifiables. Celui-ci dit **ce qui
ne l'est pas devenu**, et c'est la moitié qui manquait : une liste de garde-fous se lit comme une
couverture, alors qu'elle n'énumère que ses propres mailles. **Une couverture se vérifie dans les deux
sens** — et la compression d'ADR-0003 a relevé le second. Ces règles-là ne sont ni caduques ni
faibles ; elles sont simplement **tenues à la main**, et rien ne le dit au lecteur qui les cite.

> **Le décompte est daté ; la liste ne l'est pas.** Au **2026-07-19**, sur les 108 énoncés normatifs
> d'ADR-0003, une quarantaine n'avait aucun capteur. Ce chiffre **vieillit à chaque témoin posé** —
> c'est même le but — et il n'est pas tenu à jour : ne pas le citer comme s'il valait aujourd'hui.
> Les entrées ci-dessous se vérifient à tout moment en ouvrant le fichier nommé, et **une entrée dont
> le capteur a été posé se RETIRE d'ici** plutôt que de se corriger.

> **Ce que cette section NE fait pas :** elle ne propose aucun instrument, et l'absence d'un capteur
> **n'est pas** un motif de retrait d'une règle — la doctrine du faux positif s'applique à ses
> propres règles. Elle ne classe pas non plus par importance doctrinale, mais par **exposition** :
> combien coûterait la chute, × quelle est la probabilité qu'elle passe inaperçue.

Par ordre d'exposition décroissante :

1. **La ligne rouge** — l'unique interdiction dure du document (améliorer la détection en cachant la
   pauvreté des moyens). Aucun mécanisme ne pourrait la tenir seule, mais rien ne la rappelle non
   plus au moment où elle se joue : l'ajout d'une source de données.
2. **Tout le versant ÉVICTION de la règle du faux positif** — « seul s'en va le terme qui ne
   discrimine pas du tout », « le jugement porte sur la sémantique, jamais sur le décompte d'un
   banc », « la tolérance ne varie pas d'un label à l'autre ». Le versant *garder* est mesuré
   (`fr-colloquial-ablation.test.ts`) ; le versant *retirer* ne l'a jamais été. C'est l'asymétrie la
   plus coûteuse de la liste, parce que c'est le geste **irréversible** des deux.
3. **Couverture accidentelle latente vs vivante.** Règle écrite *après* qu'elle a coûté quelque
   chose, et toujours sans témoin. Le mot « latent » n'apparaît dans aucun test.
4. **La neutralité (§axe bidirectionnel).** `religion` porte bien `practice` / `opinion` dans son
   lexique, mais **aucun test n'affirme que le pôle critique est détecté**. Un silence sélectif s'y
   installerait sans rien faire rougir — et c'est précisément la défaillance qu'ADR-0003 qualifie de
   *jugement déguisé*. Recoupe la dette PANO-38.
5. **Le non-transfert d'une langue à l'autre** — « un résultat de lexique repart à zéro dans une
   autre langue ». Ce dépôt a déjà payé l'inverse : des défauts de machinerie EN masqués par des
   mesures FR. La règle existe ; rien n'empêche de citer une mesure FR comme preuve sur l'EN.
6. **« Acceptation mesurée » vs « assumée ».** ADR-0003 fait du passage de l'une à l'autre un
   **événement daté**, et le mot « mesurée » est un mot qui referme une discussion. Rien ne vérifie
   qu'un instrument existe derrière chaque emploi du mot.
7. **Le seuil n'est pas un levier de sûreté** (et son corollaire : monter le seuil coûte de la
   démonstration). Rappelé en commentaire à plusieurs endroits, affirmé nulle part.
8. **Le discours « avec si peu » présenté une seule fois**, ses deux faces ensemble. Sa répétition
   sur chaque carte ne déplacerait les goldens que de façon incidente.
9. **La bio comme signal fort** — aucun détecteur ne lit aujourd'hui le profil : la règle n'a pas de
   capteur parce qu'elle n'a pas encore de monteur. À rouvrir avec le roster d'orientation.

Le reste — portées (« les six labels », « toute langue »), housing (« un artefact a une maison »),
obligations positives sur le lecteur — se tient par relecture, et c'est assumé.

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

- **NOMMÉE — un tort à UN item est invisible aux bancs de registres.** Trouvée en crevant
  délibérément un vert (lot `politics` EN, `extremely`). `en_ironic` écrit « i have decided to become
  a **centrist** », et `centrist` est admis au lexique : mesuré, ajouter une tête de copule
  d'acquisition (`i have decided to become`, `i became`, `ive become` — chacune un ajout de **rappel
  légitime**) fait taguer cet item sur une voix scellée **non-porteuse**. **Et la suite entière reste
  VERTE** : la voix ne porte qu'un item déclencheur, `politics` est à seuil 2, la voix entière rend
  `RIEN`, et un banc qui mesure la **voix** ne voit pas un tort qui vit dans l'**item**. Il en
  faudrait deux. *Portée : les six labels et tous les bancs de registres* — l'instrument qui le
  verrait est une assertion **item par item** sur les gardes, et elle n'existe nulle part. D'ici là,
  le plancher de faux positifs des voix anglaises est une **acceptation assumée**, jamais mesurée.

- **OUVERTES — ce que le lot des adjectifs d'appartenance EN laisse derrière lui** (ex-fiche
  `dette-appartenance-en.md`, condensée ici à sa suppression). Le lot a livré `selfDeclaredEn` sur
  quatre lexiques et la symétrie majoritaire/minoritaire des deux axes ; la battue qui l'a suivi a
  redescendu quatre adjectifs qui nommaient sur un objet (`anemic`, `anorexic`, `epileptic`,
  `had a stroke` — intersection `explicit ∩ selfDeclaredEn` tenue par
  `detect/storey-intersection.test.ts`). Restent ouverts, chacun un jugement distinct :
  - **trois justifications qui affirment une propriété qu'aucun code n'évalue**, reproduites et non
    réparées — leurs correctifs divergent, les trancher en bloc serait la couverture générale que la
    doctrine interdit : `i voted` (le passé n'exclut pas l'idiome — « i voted hufflepuff obviously »
    → NOMMÉ) ; `moronic` (la garde de cible ne l'empêche pas de taguer — « youre right, that take is
    moronic » → NOMMÉ) ; `catholic` (le cadre copulaire ne désambiguïse pas — « im pretty catholic
    in my reading » → LARGE, peut-être dans la tolérance déclarée du tier, à trancher) ;
  - **machinerie — les locutions couvrantes ignorent le chemin d'auto-déclaration.**
    `COVERING_PHRASES` protège `hitSurfaces` et pas `hitSelfDeclared` : mesuré, ajouter
    `straight up` à la liste ne change rien, « im straight up done with this » pose toujours un
    constat large. Le FR a le même trou, simplement inexercé. Dette des deux langues ;
  - **frontière déclarée, pas comblée — la 3ᵉ personne et le syntagme nu restent muets sur les
    adjectifs** (« my neighbour is diabetic », « diabetic recipes » → RIEN). Tenue par
    `identity-frame-probe.test.ts` ; l'admission des adjectifs nus en `indirectCore` est la porte où
    `straight` a été mesuré à 1 → 4 torts — elle se rouvre sur mesure, label par label ;
  - **l'attribution par un tiers n'est filtrée sur aucun label** (« my friend thinks i am gay »,
    « people assume i am straight » déclenchent) : c'est le chemin du tort le plus coûteux du banc
    d'identité, arbitré **non bloquant** pour la symétrie mais entier — il mérite son propre lot.

- **RÉPARÉ — le dernier trou de couverture connu : `politics` était entièrement muet en anglais.**
  Seul des quatre labels anglophones sans tier d'auto-déclaration. Mesuré et **élargi** (la sonde en
  place en tenait neuf, ce qui était la liste d'une sonde et non une frontière) : **40 termes × 9
  cadres × 3 volumes = 1080 sondages, zéro**, quand le miroir français rendait 24 × `explicit`. Une
  seule cause, vérifiée contre les deux autres candidates : `selfDeclaredEn` valait `undefined` — ni
  seuil, ni filtre. Livré : 25 identités (10 gauche · 10 droite · 4 sans camp · 1 ambiguë), le témoin
  étendu, et les trois assertions qui enregistraient le trou **tournées, jamais supprimées**.

  **Ce que le lot a établi et qui vaut plus que la liste :** la règle d'admission « propre » — le
  **nom doctrinal** entre, l'**adjectif d'usage général** reste dehors — **est biaisée**.
  `conservative` est le mot ordinaire de la droite anglophone et c'est un adjectif ; `socialist` est
  celui de la gauche et c'est un nom. Appliquée mécaniquement, elle admet le mot ordinaire d'un camp
  et exclut celui de l'autre : **le défaut français reconstitué sous un habit neuf, par un
  raisonnement irréprochable à chaque étape, et que rien n'aurait fait rougir.** La forme générale du
  danger est écrite en tête de `lexicon/politics.ts` : *une règle d'admission qui discrimine sur la
  FORME d'un terme découpe le champ politique de travers, les deux camps ne nommant pas leur position
  dans la même forme grammaticale.* D'où `conservative` **et** `liberal` admis comme **acceptations
  assumées** — les exclure tous les deux serait défendable, n'en exclure qu'un ne l'est pas.

  **Ce que le lot ne referme pas, et il ne faut pas le lire comme réparé :** l'anglais demande
  **deux** items là où le français en demande un, et il ne **nomme jamais** (« i am a socialist » ×1
  → `RIEN`). Ce sont deux décisions prises ailleurs — l'étage et le seuil —, pas un reste de trou.
  La 3ᵉ personne et le syntagme nu anglais restent muets. Les faux positifs des 25 termes sont
  **non mesurés** : le banc écrit pour ce lot s'est **disqualifié** (32/32, y compris les termes
  qu'il devait innocenter) parce qu'il mesurait la **constructibilité** d'une collision là où
  ADR-0003 porte sur l'usage **dominant**. Il a en revanche confirmé, sur un **sixième** label, que
  « i am X about Y » transforme n'importe quel nom d'identité en intensificateur — **la copule
  n'ancre rien en anglais**, et c'est devenu le résultat le plus reproduit du dépôt.

- **RÉPARÉ — l'asymétrie politique du lexique FR, et le mécanisme qui l'a produite.** Le lexique
  livrait, en français, un encodage **asymétrique des deux camps** : les identités de gauche au tier
  de l'IDENTITÉ (`selfDeclared` → constat **nommé**), celles de droite au tier des **accusations**
  (`indirectCore` → sous le seuil quand elles sont isolées). Mesuré, un item chacune : « je suis
  anarchiste » posait un constat nommé, « je suis nationaliste » n'en posait **aucun** — alors que
  `nationaliste` était bien **dans** le lexique.

  **Personne ne l'avait écrit.** Chaque terme était entré pour une raison localement défendable, et
  le défaut ne vivait dans **aucun** d'eux : il vivait dans la **composition** de deux registres.
  C'est ce qui le rendait introuvable — une relecture terme à terme vérifie que chaque terme
  **présent** est légitime, jamais que les **absents** le sont symétriquement. Et aucun filet ne le
  tenait : avant ce lot, le mot « symétrie » n'apparaissait dans **aucun** test du moteur.

  Livré : les identités de droite au tier de l'identité, le répertoire thématique apparié (il ne
  portait que celui de la mobilisation), et un **témoin** (`detect/politics-symmetry.test.ts`)
  vérifié par mutation dans les deux sens. **Sa frontière est déclarée et elle compte** : il mesure
  l'axe choisi, pas l'équilibre politique du produit — et il est **aveugle à un camp entièrement
  absent** du lexique, ce qui est la moitié du défaut d'origine qu'il ne rattraperait pas.

- **MESURÉ, et l'écart SUBSISTE — la densité de preuves de la paire opposée.** Après réparation, le
  banc `politics` rend 5 preuves à gauche et 4 à droite (avant : 3 et 2). Les deux propriétés que la
  paire isolait sont **réparées** — la sur-détermination du constat (l'ablation de l'axe grossier ne
  laissait **rien** à droite, elle laisse maintenant un constat nommé) et le lexème de courant
  (`socialiste` / `libéral`). **La densité, elle, garde son écart de 1.** Deux voix ne sont pas une
  distribution : ce chiffre ne dit pas s'il s'agit d'un résidu du lexique ou du hasard de l'écriture,
  et il ne doit pas être cité comme un résultat.

- **CONTAMINATION DÉCLARÉE — trois entrées que le banc `politics` ne valide pas.** `liberal`,
  `liberale` et `redistribution` ont été écrites **après** lecture de la fixture scellée, les deux
  premières sur la demande explicite d'une de ses assertions (`libéral` avait été **proposé à
  l'exclusion**, sur une collision réelle avec la profession libérale ; le banc a retourné la
  décision). Le banc reste indépendant pour tout le reste du lexique. **Le prochain instrument qui
  mesurera ces trois-là devra être écrit sans elles en tête.**

- **LIVRÉ — le vocabulaire politique ANGLAIS, 23 entrées, et ses faux positifs sont NON MESURÉS.**
  Deux actes de vote, neuf institutions et procédures, quatre **paires thématiques appariées**, deux
  locutions transversales. Aucune identité, aucune épithète, aucun nom de parti ni de mouvement —
  ces deux derniers exclus par **règle écrite** (durabilité *et* symétrie). `selfDeclared` reste
  **vide**, faute de copule EN.

  **Le zéro des deux voix-gardes anglaises est une CÉCITÉ, et il faut le citer comme telle.** Elles
  ne déclenchent rien, avant comme après — mais vérifié terme à terme, **aucune des 23 entrées
  n'apparaît dans leur texte**. Le zéro mesure leur contenu, pas le tri du lexique. Le seul garde-fou
  réel est un choix d'écriture : n'admettre que des **syntagmes**, jamais les noms nus `election`,
  `vote`, `taxes`, `political`, `council`, qui eux sont dans le texte des gardes. C'est un
  raisonnement, pas une mesure.

- **NOMMÉ — l'instrument qui manque : une PAIRE OPPOSÉE ANGLAISE scellée.** La fixture le déclare
  déjà (ses deux voix EN sont des **gardes**, pas une paire). Sans elle, la symétrie du versant
  anglais est une **acceptation assumée**, jamais mesurée. Preuve directe qu'une paire de voix
  écrites par l'auteur du lexique ne peut pas y suppléer : en cours de lot, l'ajout de deux termes
  choisis **sans regarder ces voix** a fait basculer le compte de chemins de 1–0 en faveur d'un bord
  à 2–0 en faveur de l'autre. **Une sonde qui oscille sur un terme ne tranche pas une symétrie.**

- **MESURÉ — la marge de redondance anglaise est NULLE des deux côtés.** Sur deux voix engagées
  écrites en miroir, le lot ouvre 2 chemins d'un bord et 0 de l'autre, et retirer un seul item
  porteur suffit à faire disparaître le constat restant. Ce n'est pas « le lexique anglais penche » :
  les deux voix parlent des mêmes registres, mais l'une a écrit ses locutions sous forme
  **canonique** et l'autre sous forme libre (« taxed to death » plutôt que `tax burden`). C'est une
  **symétrie de pauvreté**. Le reste est le mur d'ADR-0003 : le discours politique ordinaire est fait
  de **positions**, pas de vocabulaire d'institution, et aucun enrichissement de lexique ne le
  franchit.

- **DETTE — `selfDeclared` EN, et elle est plus lourde qu'au pilote.** C'est **le tier où vivait
  l'asymétrie française**. Le lot de la copule EN héritera donc de la question de symétrie **en même
  temps** que de la copule, et devra la trancher à ce moment-là, pas après.

- **NOMMÉE — la divergence restante du filtre de citation.** Le pluriel cité est refermé pour les six
  labels ; l'**auto-censure** entre guillemets, elle, échappe encore (`findMarker` la tolère,
  `occursInsideQuotes` non). Le comblement propre n'est pas un troisième motif à écrire mais un
  passage au test **positionnel**, qui change la sémantique sur les occurrences multiples. Figé par
  un test qui se retournera le jour où quelqu'un le fera.

- **ROUVERT par la règle du faux positif (ADR-0003, *L'admission d'un terme*) — le milieu partagé
  des deux labels de santé.** `side effects`, `sick note`, `fit note`, `medical certificate`,
  `prescription`, `appointment` ont été retirés pour un problème d'**appartenance entre labels**,
  avec un coût de rappel reconnu **des deux côtés** — jamais par ablation. Ce motif ne tient plus.
  Mesuré sur les voix scellées, et le lot se scinde en deux :
  - **`fit note`, `prescription`, `appointment` — le retrait NE TIENT PAS.** Ils se déclenchent sur
    `living`, la voix qui vit réellement une condition physique chronique (« rheumatology
    appointment rescheduled again », « repeat prescription pharmacy app not updating », « do i need
    a fit note for a hospital appointment »). Porteurs **et** non-porteurs : ils restent, et leur
    ré-admission est à instruire ;
  - **`side effects` et `sick note` — À MESURER, PAS À TRANCHER.** Sur ce banc ils ne tirent que sur
    `distress`, non-porteuse de `health_physical`. Mais le corollaire de la règle s'applique ici de
    plein fouet : le jugement porte sur la **sémantique**, et « side effects » est du vocabulaire
    **sans domaine** qu'une voix physique écrit tout aussi bien (« methotrexate side effects »).
    Le banc n'a qu'**une** voix physique, et elle ne l'a pas écrit. **Ce qu'il faut : une seconde
    voix physique scellée**, sous traitement lourd. Sans elle, retirer ces deux termes serait lire
    le tableau au lieu du terme.

- **DETTE — la garde de `conflictual` est ANTI-CORRÉLÉE à l'agression.** Le mépris s'exprime *à
  propos* d'une catégorie (« i have no patience for morons who lecture ») — sans adresse, donc
  invisible ; la tendresse *adresse* (« you are the official moron of this house ») — donc vue. Le
  diagnostic est établi : ce n'est ni le pluriel ni une règle d'étage, c'est la **cible de 2ᵉ
  personne** exigée par B5. Ce n'est **pas** un motif de retrait du label (règle ci-dessus) : c'est
  un défaut de machinerie, à instruire avec les quatre voix comme instrument.

- **LE VRAI DÉFAUT DE `conflictual`, et il change la priorité : un trou de rappel de 92 %.** Mesuré
  sur les voix scellées : **le lexique atteint 2 items sur 26 de mépris soutenu**, dans les deux
  langues. Le reste est soit du vocabulaire absent (`nul`, `pitoyable`, `incompetent`, `betise` ;
  `useless`, `rubbish`, `clueless`, `nonsense`), soit le mur (« tu comprends rien a ce que tu fais »,
  « each one is worse than the last »). À côté de ça, le faux positif du label est **anecdotique**.
  **Le prochain lot `conflictual` ÉLARGIT, il ne resserre pas** — et les quatre voix mesurent les
  deux sens.

  *Prédiction à ne pas perdre, parce qu'elle sera contre-intuitive au moment d'élargir :* à la borne
  haute mesurée (vocabulaire comblé, garde retirée), le rappel monte à 7 items par voix hostile —
  mais le tort monte à **9 et 11** chez les non-porteuses. **Élargir montera les deux ensemble, et
  la précision ne s'améliorera pas.** Ce n'est pas une raison de ne pas élargir (le faux positif
  n'est pas un motif de retrait, et l'erreur du détecteur est le sujet) ; c'est une raison de ne pas
  vendre l'élargissement comme un gain de justesse, et de s'assurer que la pédagogie du produit
  porte l'erreur (proposition de carte ci-dessous).

- **CAS D'ÉCOLE de la règle du faux positif — lire le TERME, pas le tableau.** Sur le banc
  `conflictual`, `nulle` et `incompetente` ne se déclenchent que chez les non-porteuses. Ce ne sont
  pas des termes cassés : cette voix-là est un groupe de femmes. Les retirer sur ce décompte serait
  la faute que la règle nomme. **Le relevé des précédents d'éviction**, tous passés par ablation :
  les cinq termes hyperboliques EN (0 % sur la voix en détresse), les six homographes FR/EN (rappel
  EN nul, banc FR identique), `moron` (rappel nul sur 26 items hostiles).

- **CANDIDAT AU RETRAIT sous la règle — `rate` / `ratee`.** Il matche « j'ai **raté** trois tirs » :
  un verbe, aucune insulte, aucune inférence à montrer. C'est le profil « ne discrimine pas du
  tout », même famille que « the pros and **cons** ». À instruire avec le reste du lot d'élargissement
  plutôt qu'isolément.

- **PORTÉE — la doctrine du faux positif couvre les CONSTATS du produit, pas le texte libre du
  modèle local.** Vérifié : `web/src/ai/` n'a aucune taxonomie de labels — c'est un prompt libre.
  Ce qu'un modèle local écrit en prose n'est gouverné ni par cette règle ni par les étages.

- **NON MESURÉ — les injures identitaires, dans les deux langues.** Les quatre voix scellées de
  `conflictual` insultent la compétence, l'intelligence et le goût, par décision. Le lexique FR porte
  des slurs genrés, validistes et homophobes ratifiés : **ni leur rappel ni leurs faux positifs
  n'ont jamais été mesurés**. Trou distinct de celui du rappel ci-dessus.

- **LOT À OUVRIR — la garde de `conflictual` est ANTI-CORRÉLÉE à l'agression.** C'est la découverte
  du premier banc de ce label (`engine/detect/conflictual-fp-bench.test.ts`), et elle porte sur sa
  **porte**, pas sur son vocabulaire. La doctrine exige une **cible de 2ᵉ personne** pour taguer
  (ADR-0003, exception `conflictual`), au motif qu'elle empêche de taguer une critique d'idée. Mesuré
  sur deux voix scellées écrites en aveugle, elle fait l'inverse de ce qu'on attend d'elle :
  - le **mépris** s'exprime *à propos* d'une catégorie — « i have no patience for morons who
    lecture », « les gens comme ça » — donc **sans adresse, donc invisible** ;
  - la **tendresse** *adresse* — « you are the official moron of this house » — donc **visible**.

  Le diagnostic est établi et vérifié (le pluriel n'y est pour rien : la même phrase, adressée,
  tague). Ce n'est pas une imprécision qu'un meilleur lexique corrige — un lexique plus petit réduit
  seulement le volume d'un tri qui trie à l'envers.

  **Ce que le lot devra trancher**, et il n'est pas tranché ici : la garde reste-t-elle (elle protège
  réellement la critique d'idée, décision D), se double-t-elle d'un second chemin pour le mépris
  non adressé, ou l'exception `conflictual` elle-même doit-elle être rouverte ? Instrument
  disponible : les quatre voix scellées. **Rien ne bouge d'ici là.**

  **La pédagogie qui doit voyager AVEC ce lot, pas après lui** — c'est la « proposition de carte »
  annoncée plus haut. Le retrait du label ayant été refusé (l'erreur du détecteur EST le sujet), la
  carte s'est retournée : non pas « ce que nous refusons d'inférer », mais **« comment une déduction
  se trompe »**, une déduction maintenue dont l'erreur est exhibée, avec son chiffre. Elle vit dans
  le moment pédagogique dédié (SENS-A3), jamais sur les cartes. Brouillon **à ratifier comme tout
  wording** :

  > **Un algorithme se trompe, et c'est visible ici.**
  > Nous avons testé notre détecteur d'agressivité sur des textes écrits à l'aveugle par quelqu'un
  > qui ignorait ce que nous cherchions. Il repère l'insulte — mais il ne sait pas **à qui** elle
  > s'adresse : un commentaire répond à une vidéo que nous ne voyons pas, adressé à quelqu'un dont
  > nous ignorons tout. Il signale donc aussi souvent des amies qui se chambrent que des gens qui
  > méprisent des inconnus.
  > **Nous le gardons quand même, et c'est délibéré :** une plateforme se trompe exactement comme
  > ça, sur les mêmes phrases, et elle ne vous le montre pas.

  Aucun mécanisme nouveau : du contenu dans une zone qui existe. Si le lot d'élargissement part sans
  elle, la prédiction ci-dessus (rappel et tort montent ensemble) se réalisera sans explication à
  l'écran.

- **MESURÉ — l'anglais de `conflictual` ne lit pas l'agressivité.** Zéro détection sur les 26 items
  de la voix hostile anglaise, avant comme après le lot EN. Le seul déclenchement anglais qu'ait
  connu ce label était un **tort** (`moron`, sur la voix affectueuse, à l'étage nommé), et le terme a
  été retiré sur ce chiffre. L'anglais est donc **muet des deux côtés**, et ce silence est **déclaré
  par une garde** plutôt que laissé passer pour de la sûreté. Combler le rappel suppose d'abord de
  savoir si la garde ci-dessus doit rester : livrer plus de vocabulaire dans un tri anti-corrélé
  augmenterait surtout les torts.

- **NOMMÉE — le milieu partagé `conflictual` / `politics`.** L'invective politique adressée
  (« you're so triggered », « you sound like a bot ») franchit la porte de `conflictual` alors que la
  moquerie a été délibérément retirée des lectures de `politics` pour ne pas y atterrir. Même forme
  que le milieu partagé des deux labels de santé : l'admettre fait réclamer toute joute d'opinion,
  l'écarter coûte du rappel sur de l'agression réelle qui se trouve être politique. Le lot EN a
  écarté la surface d'entrée (`cope`, `seethe`, `ratio`, `touch grass`, `triggered`) ; la dette n'est
  pas échue.

- **NOMMÉE — slurs homophobes et validistes EN, hors du lot EN de `conflictual`.** Le FR les porte
  sur arbitrage explicite du mainteneur. L'EN mérite la même décision explicite, pas un transport par
  symétrie — coût d'erreur maximal, et taux de FP EN de ce label inconnu (ADR-0003, étagement par
  coût d'erreur).

- **RATIFIÉ — l'ordre des lectures, et la règle qui le gouverne.** Trois lectures couvrent trois
  **mécanismes**, pas trois degrés ; pour les labels de l'axe *pour qui*, ce sont exactement les
  trois états de vérité-terrain d'ADR-0003 (`vécu` · `signal sans vécu` · `non-porteur`) — l'éventail
  montre au lecteur l'indétermination que le banc mesure. **Mêmes textes aux deux étages, seul le
  mode diffère** : `equal` ne pouvant pas classer par définition, il n'y a qu'un ordre par label à
  ratifier, pas deux. L'ordre retenu est celui d'origine, désormais **choisi** et plus seulement
  hérité — quand le terme précis est écrit, le mécanisme « c'est moi » domine, et la dégradation par
  registre informationnel le renforce (ce qui reste nommé est ce qui n'interroge pas). *(Ratifié le
  2026-07-18 ; la proposition d'origine, `lectures-sensibles-proposition.md`, est supprimée — tout ce
  qui en survivait est ici et dans le câblage.)*
  - **`politics` recâblé** `engaged · irony · watch`. `irony` récupéré (seul mécanisme non couvert
    ailleurs : le signal ne représente pas la personne) ; `partisan` (degré d'`engaged`), `mockery`
    (propos visant quelqu'un — c'est `conflictual`) et `avis personnel` supprimés. Plus aucune
    lecture orpheline, et un filet tient désormais **les deux sens** de la couverture.
  - **Réserve non tranchée :** l'harmonisation `curiosité` → `simple curiosité` sur
    `health_physical` et `sexuality` a été proposée et **n'est pas ratifiée** — trois labels de l'axe
    *pour qui* portent donc encore des mots différents pour le même mécanisme.
- **RÉGLÉ — le mode `equal` tronquait à deux lectures.** `FanView` rendait `readings[0]`, un
  séparateur, `readings[1]` : la troisième était perdue en silence sur tout constat large. Corrigé
  (séparateur intercalé, rendu sur la longueur réelle) et couvert par `fan-readings.test.ts`. Le
  défaut avait survécu parce qu'**aucun golden ne rendait d'éventail `equal`** — frontière
  structurelle, désormais déclarée dans les deux goldens.
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
  l'auto-déclaration EN (lot 2 — le seul filtre qui *crée* un constat nommé, donc à mesurer ;
  **instruit puis clos sans livraison**, voir l'entrée dédiée plus bas — la dette n'est pas
  déchargée, elle est désormais **spécifiée**), les
  marqueurs EN des six lexiques. *(Le « trou de sûreté FR » longtemps listé ici — 3ᵉ personne sans
  « ma mere » ni « mon pere » — est **comblé** depuis, et la batterie adverse le tient.)*
  - **Lot pilote LIVRÉ — `mental_health` EN.** Les listes vivent en ligne dans
    `lexicon/mental-health.ts` (annotées `// (EN)`), les exclusions porteuses dans la batterie
    adverse, la méthode dans [`methode-portabilite-en.md`](methode-portabilite-en.md). Il a produit
    la **règle d'admission** désormais portée par ADR-0003 (*L'admission d'un terme*) : l'hyperbole
    s'exclut à la porte, elle ne se rétrograde pas — le seuil de répétition l'accumule au lieu de la
    filtrer.
  - **Dette — détresse vitale EN, à rouvrir délibérément.** Trois formes sont **écartées du lot
    pilote**, non rejetées : `suicidal`, `end my life`, `take my own life`. Motif : coût d'erreur
    maximal + taux de faux positifs EN non mesuré (étagement par coût d'erreur, ADR-0003). Les
    rouvrir suppose la mesure ci-dessous, pas un simple ajout au tableau.
  - **Dette — l'EN n'est pas mesuré, et la persona ne suffira pas.** Le lot pilote est livré **sur
    doctrine**, faux positifs non mesurés, décision assumée. La persona EN de démo mesure du
    **rappel**, jamais un taux de FP : une seule voix d'écriture ne peut pas révéler un terme qui
    sur-déclenche sur un registre expressif — mesuré, elle ne rencontre **aucun** des termes du lot.
    L'instrument qui fermerait ce trou est un **banc de personas EN en registres délibérément
    contrastés** : c'est la **variation de registre**, pas de contenu, qui fait sortir les faux
    positifs d'hyperbole. **Construit et mesuré** (2026-07-18) — six voix, 180 items, personas et
    vérité-terrain scellées par un commit antérieur à toute lecture du lexique. L'artefact prime sur
    les chiffres : les états courants se lisent dans les attendus figés de
    `detect/en-fp-bench.test.ts` (et `fr-fp-bench.test.ts`), qui déclarent leurs limites en tête et
    **rougissent** si un seuil, un filtre ou un terme bouge. *(Le rapport d'époque,
    `banc-fp-en-mental-health.md`, est condensé dans
    [`methode-portabilite-en.md`](methode-portabilite-en.md).)*
  - **Dette OUVERTE — lot 2 (copule EN) : INSTRUIT, puis CLOS SANS LIVRAISON** (2026-07-18). Le lot
    devait ouvrir le tier `selfDeclared` EN — têtes d'auto-déclaration **et** étiquettes d'état.
    Rien n'a été livré, et le résultat négatif est le livrable. **Mesuré** : en livrant têtes,
    modificateurs et les quatre termes candidats (`depressed`, `anxious`, `bipolar`, `burnt out`)
    dans la configuration la **plus permissive**, le banc EN rend un **delta nul** sur les six voix.
    Ce zéro est une **cécité, pas une sûreté** : les voix atteignent bien la copule (sept items,
    figés par une garde) mais aucune ne l'apparie à un terme admissible — la fixture avait
    délibérément évité les exclusions déjà figées, or les étiquettes d'état candidates **sont** ces
    exclusions. **La rigueur qui écarte un biais en installe un second, invisible parce qu'il produit
    un zéro** — et ce résultat se généralise à tout banc écrit selon cette discipline. Corollaire
    mesuré *(voir la correction dans l'entrée suivante — cet énoncé ne vaut que pour
    `mental_health`)* : **aucune moitié sûre à livrer**, le passif diagnostique (seule construction EN sans
    hyperbole attestée) n'ouvrant en exclusivité que les mêmes étiquettes polysémiques, son contenu
    sûr taguant déjà par homographie. Deux termes écartés **par doctrine** (`anxious` — faux ami
    « anxious to see you » ; `burnt out` — participe figuré, déjà large) ; `bipolar` et `depressed`
    restent dehors **faute de mesure**, pas par jugement. Ce qui aurait débloqué, disait alors la
    note de critères : deux voix scellées (taux naturel / borne supérieure) **plus un contrôle
    positif** du chemin copulaire.
    - **DÉNOUÉ depuis, et PAS par l'instrument réclamé.** Les deux voix n'ont jamais été écrites :
      la mesure du lot des adjectifs a montré que la prémisse des critères était fausse — **la
      copule n'ancre rien en anglais** (« im so ocd about my desk drawers » porte le cadre entier),
      donc il n'y avait pas de « taux naturel » à estimer. La sûreté est passée du cadre à
      l'**ÉTAGE** : le tier `selfDeclaredEn` livré atterrit en LARGE et n'affirme jamais, et toute
      proposition future qui refait porter de la sûreté au cadre (têtes, modificateurs, fenêtres)
      se rejette d'office — c'est l'erreur du seuil en costume neuf (ADR-0003, *La porte, pas le
      seuil*). Ce qui SURVIT des critères, parce que c'est du général : un instrument doit contenir
      un contrôle positif garanti, et une voix adverse se vérifie contre la construction qu'elle
      prétend mesurer, comptée item par item à la frontière de mot (ex-note
      `criteres-mesure-copule-en.md`, condensée dans
      [`methode-portabilite-en.md`](methode-portabilite-en.md)).
  - **LIVRÉ — la PORTE DE LANGUE de `selfDeclared`** (2026-07-19), et elle corrige un constat de
    l'entrée précédente. `selfDeclared` était une liste **unique, aveugle à la langue**, et les têtes
    de copule sont la **seule** chose qui la lit : les têtes étant FR, elles formaient une **porte de
    langue que personne n'avait déclarée**. Mesuré : ajouter une seule tête EN active d'un coup
    **quinze graphies anglaises** déjà présentes dans les tiers d'auto-déclaration de `religion`
    (`muslim`, `muslima`, `protestant`, `sikh`), `sexuality` (`gay`, `bi`, `homo`, `trans`, `queer`,
    `ace`, `aro`, `enby`, `hetero`) et `politics` (`militant`, `liberal`) — toutes en constat
    **NOMMÉ**, aucune jamais examinée pour l'anglais. « im ace at darts » posait un
    `sexuality[explicit]`. **Ajouter des têtes EN ne serait donc pas ajouter une fonctionnalité :
    ce serait retirer une protection non écrite.** Corrige le constat « les têtes n'ouvrent que les
    étiquettes d'état polysémiques », vrai de `mental_health` seul et généralisé à tort au lot.
    Livré : `selfDeclaredFr` apparié à ses têtes au site d'appel, les quinze inscrites explicitement
    **non admises pour l'EN**, témoin de comportement vérifié par **cinq mutations**
    (`selfdeclared-language-gate.test.ts`). FR byte-identique.
    - **TRANCHÉ depuis, par le lot `politics` EN — `liberal`.** Entré comme identité de **droite** au
      sens français (libéralisme économique), il désigne la **gauche** en anglais : la même chaîne
      désigne des camps opposés selon la langue. La consigne d'alors — « la réparation de symétrie de
      `politics` se retournerait silencieusement en EN » — **visait la mauvaise cible**, et c'est
      utile de le dire plutôt que de la rayer. `selfDeclaredEn` **ne nomme jamais**, et le constat
      produit dit `politics`, jamais un camp : l'inversion casse la **partition d'un témoin**, pas la
      détection, et elle n'atteint **aucune sortie vue par un utilisateur**. Admis, rangé dans un
      quatrième seau `ambiguous` — même geste que le seau `neutral` du versant FR.
    - **Séquencement délibéré — `sexuality` n'aura aucune tête EN avant son propre banc.** C'est le
      label où un constat nommé faux **oute** quelqu'un, et il n'a de voix scellée dans aucune
      langue. La porte est ce qui achète le temps de l'écrire.
    - **Hors périmètre, déclaré — `InterestLexicon.selfDeclared`** porte lui aussi des graphies
      anglaises et s'activerait pareil ; un thème d'intérêt faussement nommé n'oute personne, et
      étendre le renommage à quarante fichiers aurait noyé la porte.
  - **RÉGLÉ — cinq termes du lot pilote sur-déclenchaient.** `falling apart`, `rock bottom`,
    `spiraling`, `running on empty`, `overwhelmed` taguaient une persona non-porteuse qui écrit par
    hyperbole, sans apporter **aucun rappel** sur la persona concernée. Retirés ; le banc garde
    leurs noms pour que leur retour dise lequel.
  - **RÉGLÉ — un constat NOMMÉ était posé sur le proche aidant, EN ET FR, en production.** Cause :
    `hasThirdPerson` est item-local et cherche un possessif, donc « signes de dépression chez
    l'adolescent » n'en portait aucun. Une mesure anglaise a trouvé un trou de sûreté **français** —
    c'est du gain non commandé, et c'est la meilleure justification du banc. Corrigé par une règle
    d'ÉTAGE (le registre informationnel dégrade nommé → large, sans jamais supprimer), en doctrine
    dans ADR-0003.
  - **Dette OUVERTE — le résidu assertif, technique et administratif.** « le burnout est un
    phénomène lié au travail », « inventaire de burnout de maslach », « teenager missing school
    anxiety letter » : ni interrogatifs ni possessifs, ils produisent encore des constats nommés sur
    les voix professionnelles. Les couvrir suppose l'ancrage 1ʳᵉ personne, **mesuré comme dégradant
    aussi le vrai positif**. Rejoignait le lot 2 de PANO-35 (copule EN) — **clos sans livraison**
    depuis : ce résidu n'attend donc plus un lot, il attend la même mesure que lui.
  - **TRANCHÉ PAR MESURE — le tier colloquial FR est GARDÉ, faux positif accepté.** « j'en peux
    plus » (tier `indirectCore`), « au bout de ma vie », « je craque », « à plat », « je sature »,
    « cafard » taguent une voix française non-porteuse. **Ablation** (`fr-colloquial-ablation.test.ts`)
    : leur retrait supprime ce faux positif, ne coûte rien à une détresse **soignée** — déjà détectée
    par le vocabulaire du soin — mais fait **entièrement disparaître** une détresse **sans soin**,
    qui n'a que ce registre. Ils portent donc un rappel que rien d'autre ne porte. Ils restent, et le
    faux positif est une **acceptation mesurée**, verrouillée par test. Nuance mesurée : aucun des six
    n'est individuellement porteur — c'est le franchissement du seuil 2 qui l'est. Ce qui rouvrirait
    le dossier : plusieurs voix par registre écrites par d'autres mains, jamais un sous-ensemble
    ajusté à deux idiolectes de n = 1.
  - **VÉRIFIÉ — la règle d'étage sur `health_physical`.** Elle y tournait en production sans mesure.
    Le cadrage documentaire dégrade comme attendu, et **le vécu garde son constat nommé** : une
    personne qui vit une condition la nomme au possessif quelque part, et cet item n'a pas de cadrage
    documentaire. Sondes de mécanisme, pas mesure de taux. Les **quatre autres** labels restent non
    vérifiés.
  - **CORRIGÉ — « `health_physical` n'a aucune couverture anglaise » était FAUX.** Cette dette a
    longtemps été listée ici au motif que « diabetes » ≠ « diabete ». La tolérance de pluriel les
    rapproche, et la couverture réelle est de **cinq entrées** : `diabete`, `hypertension`,
    `eczema`, `psoriasis` (tier `explicit` — donc un droit de **nommer**) et `cortisone`. Elle est
    **accidentelle et partielle** (« endometriosis » n'est pas le pluriel d'« endometriose ») mais
    elle n'est pas nulle, et elle n'a jamais été calibrée. Les cinq crossers sont depuis annotés
    dans `lexicon/health-physical.ts`, passés d'accidentels à intentionnels sans changer une ligne
    de comportement (relevé d'origine dans l'ex-note de lot, condensée dans
    [`methode-portabilite-en.md`](methode-portabilite-en.md)).
  - **LIVRÉ — 2ᵉ lot D1 (`health_physical` EN), en DEUX temps et dans cet ordre.** L'instruction du
    lot a trouvé deux défauts d'étage qui tiraient **déjà en production** sur ces cinq termes ;
    porter `explicit` de 4 à ~35 termes EN les aurait multipliés. La séquence a donc été inversée —
    machinerie d'abord, vocabulaire ensuite, chacun mesuré avant le suivant.
    - **RÉGLÉ — aucun instrument n'exerçait ce label.** Les huit voix scellées d'alors rendaient
      zéro constat `health_physical`, et ce zéro était une **cécité chiffrée** : les trois voix
      témoins portaient **0/30** item à vocabulaire corporel. **Trois voix du corps ont été
      scellées** (vivre avec une condition · inquiète bien portante · proche aidante), écrites en
      aveugle du lexique, avec leur capteur. Elles ont mesuré les deux temps du lot.
    - **RÉGLÉ — le registre informationnel manquait l'ordre de mots dominant de l'anglais.**
      « symptoms of diabetes » dégradait, « diabetes symptoms » **nommait** — or le composé
      nom-nom antéposé est la forme la plus fréquente de la requête santé anglophone. Corrigé par
      des **têtes de composé**, reconnues seulement accolées à un terme explicite : « symptoms » nu
      reste écarté, et son exclusion délibérée (ne pas dégrader qui décrit SES symptômes) tient.
      `treatment`/`diet` sont **exclus à dessein** — chercher un soin est un signal de vécu.
      **Coût figé par test** : « my diabetes symptoms » dégrade aussi.
    - **RÉGLÉ — la 3ᵉ personne EN s'arrêtait à la famille nucléaire américaine.** « my nan has
      diabetes » **nommait**. Manquaient aussi « my mum » (forme britannique) et toute la parenté
      élargie. Vingt formes ajoutées.
    - **CE QUI VAUT AU-DELÀ DU LOT** : les deux défauts tiraient **aussi** sur `mental_health`
      (« burnout symptoms » nommait). Le label pilote n'était pas épargné, il était **masqué** — ses
      noms de trouble fréquents vivent au tier `indirectSolo` et ne peuvent structurellement plus
      nommer. **Un tier créé contre l'hyperbole couvrait un défaut de registre**, et le masque n'a
      sauté qu'en ouvrant le premier label dont les noms de condition sont restés en `explicit`.
      Les quatre lexiques D1 restants rencontreront ces mêmes défauts.
    - **LIVRÉ — le vocabulaire EN de `health_physical`**, et sa ligne d'admission n'est PAS celle
      du pilote. L'hyperbole ne travaille presque pas ici (personne n'écrit « i'm diabetic » pour
      rire) ; la ligne mesurée est **le symptôme n'est pas la condition**. Les deux voix du banc se
      séparent exactement là : celle qui VIT une polyarthrite nomme sa maladie, son traitement et
      sa spécialité ; celle qui n'a RIEN écrit un vocabulaire de symptômes dense et parfaitement
      **littéral**. Aucun nom de symptôme n'entre — c'est ce qui tient le zéro de la non-porteuse.
    - **MESURE, les quatre critères** : la voix qui vit sa condition gagne un constat **nommé**
      (14 items) ; l'aidante gagne un constat **large** et **perd** ses deux tags `mental_health` ;
      la non-porteuse reste à **zéro**, et ce zéro est enfin une mesure plutôt qu'une tautologie.
      Aucun tort sur les **dix-sept** voix scellées des quatre bancs.
    - **Ce que la mesure a appris au lot** — deux catégories manquaient à la proposition, qui avait
      bâti le soin autour des **consultations** : les **traitements de fond** (`methotrexate`,
      `biologics`) et **l'arthrite** comme condition nommée, le FR ne portant qu'`arthrose`.
    - **RÉGLÉ — `therapy` ne lit plus la rééducation physique**, et sans qu'un terme livré soit
      retiré. `health_physical` réclame les syntagmes de rééducation, et une **locution couvrante**
      empêche le marqueur court de les lire au passage (contenance stricte : un syntagme ne se
      bloque pas lui-même). **Ablation faite** : les vrais positifs `therapy` tiennent. En prime, la
      mécanique tient la réserve écrite du lot pilote — « retail therapy » tombe, ce que le seuil ne
      faisait pas. *Le mécanisme est général et rouvre F8* (« miscarriage of justice ») ; ce cas
      reste néanmoins fermé, mais désormais pour une **autre raison** — il relève du territoire
      grossesse, hors périmètre.
    - **Dette OUVERTE — le soin NEUTRE n'a pas de maison.** `side effects`, `sick note`, `fit note`
      ont été proposés en `health_physical`, puis **retirés à la mesure** : ils taguaient la voix en
      détresse mentale (« sertraline side effects », « sick note for mental health »). Les deux
      labels de santé partagent un **milieu** — arrêt de travail, effet secondaire, ordonnance,
      rendez-vous — qui ne porte **aucune information de domaine** : c'est le texte autour qui la
      porte. Les écarter coûte du rappel réel des deux côtés ; les admettre fait réclamer par un
      label tout texte de soin. Aucun mécanisme actuel ne résout ça, et le nommer vaut mieux que de
      le re-trancher à chaque lot.
    - **HORS PÉRIMÈTRE, tranché — grossesse et handicap.** Le lexique FR range déjà `ma grossesse`,
      `pma`, `fiv`, `mon handicap` sous `health_physical`, sur un cadrage que **rien n'a ratifié** :
      une grossesse n'est pas une maladie, et ranger le handicap sous la santé physique le cadre
      comme une pathologie, ce que les personnes concernées contestent. L'EN reste **délibérément
      asymétrique** sur ces deux territoires : ils ne seront pas doublés dans une seconde langue
      avant d'être décidés. **La question est à ADR-0003, pas au prochain lot de lexique.**
    - **Dette — `miscarriage` bute sur une locution figée.** Mesuré : « miscarriage of justice »
      matche, et **aucune machinerie existante ne l'écarte** (ni négation, ni citation, ni registre).
      Ce qui manque est un mécanisme de **locution négative**, qui vaudrait pour les six labels.
      Ouvrir ce mécanisme en passant serait exactement ce que ce lot reproche : le terme reste dehors.
    - **Question OUVERTE, filée — l'asymétrie du nom nu.** `psoriasis` seul **nomme**, `depression`
      seul ne le fait plus. Il y a une bonne raison (le tier `indirectSolo` existe contre
      l'hyperbole, et les conditions physiques ne s'hyperbolisent pas) et elle n'est écrite nulle
      part. Ce n'est pas un défaut ; c'est une cohérence à ratifier ou à assumer explicitement.
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
