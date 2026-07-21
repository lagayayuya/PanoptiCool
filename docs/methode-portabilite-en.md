# Ce que la portabilité anglaise a appris — note de méthode

> **Ce que ce document est.** La trace qui survit à la campagne de portabilité anglaise
> (2026-07-16 → 2026-07-20) : six lexiques portés, deux tiers d'auto-déclaration construits, quatre
> bancs de voix scellées, et quatorze documents de session — propositions ratifiées, mesures,
> arbitrages — condensés ici après livraison. Un document ratifié et implémenté est une trace, pas
> une maison : ce qui suit est ce qui **généralise**, écrit pour un lecteur qui n'a pas vécu les
> lots.
>
> **Ce que ce document n'est pas.** Aucune règle ne vit ici. Chaque leçon pointe l'endroit où sa
> règle **agit** — une section d'ADR-0003, un en-tête de lexique, un témoin. Si cette note et l'un
> de ces endroits divergent, c'est l'autre qui a raison : cette note témoigne, elle ne norme pas.
> Elle ne remplace pas non plus le journal (`AI_USAGE.md`) : elle dit ce qui a été appris, pas qui
> a arbitré quoi.

---

## 1. Un banc écrit en évitant ses exclusions devient aveugle à leur admission — et son symptôme est un zéro

La leçon la plus chère du corpus, parce qu'elle a coûté deux fermetures de lot et qu'elle a
**récidivé un mois après avoir été écrite**, dans un banc rédigé par une session qui avait lu la
leçon.

Le banc de faux positifs EN de `mental_health` avait été écrit avec une discipline réelle : ses voix
évitaient délibérément les exclusions déjà figées par la batterie adverse, pour ne pas produire un
feu vert sans information. Cette rigueur, qui écarte un biais, en installe un second : les termes
que le lot suivant voudrait admettre **sont** ces exclusions, et le banc ne peut structurellement
plus les rencontrer. Son verdict sur leur admission est un zéro — et un zéro ressemble exactement à
un succès. Le lot 2 de PANO-35 a été fermé là-dessus, deux fois.

Puis le banc `sexuality`, écrit plus tard par une autre main, a reproduit la même cécité sous une
autre forme : sa voix adverse ressemblait à une borne supérieure et n'en était pas une — aucun de
ses vingt-quatre items n'appariait une copule à un terme candidat. La ressemblance entre « voix
adverse » et « borne supérieure » est trompeuse, et aucune intention d'auteur ne la dissipe.

Ce qui en est sorti, et où ça agit :

- **un contrôle positif est obligatoire** (au moins un item dont on sait d'avance qu'il doit
  taguer) : sans lui, aucun zéro ne distingue un chemin sûr d'un chemin mort ;
- **une voix se vérifie contre la construction qu'elle prétend mesurer, pas contre son brief** —
  compter, item par item et à la frontière de mot, combien atteignent réellement la construction.
  Le premier comptage de ce genre s'est trompé dans le sens rassurant (`bi` matché dans « a bit ») ;
- devant tout zéro : **par quel chemin arrive-t-il ?** Un zéro a plusieurs causes possibles, et le
  test n'en distingue aucune (CLAUDE.md, *Ce qu'un filet prouve*).

## 2. Mesurer la sortie du système après livraison, jamais la contribution du lot

Le lot `conflictual` EN a prouvé que ses insultes anglaises ne collisionnaient avec rien, les a
livrées propres — et a expédié six faux positifs. La pièce porteuse du lot n'était pas la liste
d'insultes : c'était la liste de **cibles**, et les cibles anglaises étaient le second membre que
six entrées françaises attendaient depuis toujours (`con` matche « the pros and cons », `gland`
« thyroid gland »). Les livrer a rendu vivante une charge suspendue que personne n'avait calibrée.
CI verte tout du long : les 580 tests mesuraient la non-régression, pas l'absence de tort.

> Sous une conjonction, « ma liste est propre » ne dit rien de « le lot est propre ». Ce qui se
> mesure est la **sortie du système après livraison**, sur le lexique commité — pas la contribution
> de ce qu'on a écrit.

Deux corollaires, nés de la même campagne :

- **« assumée » n'est pas « mesurée ».** Une acceptation de faux positif sans instrument s'écrit
  *assumée* ; le mot *mesurée* exige un dénominateur. La distinction est en doctrine (ADR-0003) ;
- **un tort à un item est invisible aux bancs de voix.** Un banc qui mesure la voix ne voit pas un
  tort qui vit dans l'item : un seul déclencheur sous le seuil, et la voix rend « rien » des deux
  côtés. Dette nommée au catalogue (`constats-sensibles.md` §4).

## 3. La copule n'ancre rien en anglais — toute la doctrine de la copule est française

En français, « je suis X » désambiguïse : la copule ancre la première personne, et c'est elle qui
autorise le constat nommé du tier d'auto-déclaration. La prémisse a traversé tous les premiers lots
sans jamais être écrite — jusqu'à ce que la mesure la casse : « im so ocd about my desk drawers »,
« im autistic about train timetables », « im depressed that the bakery closed early ». Le cadre est
là, entier, et l'idiome anglais l'**habite** : l'anglais écrit sa figure à la première personne.
Reproduit sur six labels (`i am X about Y` transforme n'importe quel nom d'identité en
intensificateur), et c'est ce qui a invalidé — deux fois — la prémisse sur laquelle le lot 2 de
PANO-35 avait été fermé.

La réponse n'a pas été de mieux filtrer le cadre : c'est de **retirer au cadre toute charge de
sûreté** et de la mettre à l'étage. Le tier `selfDeclaredEn` atterrit en constat large et ne nomme
jamais — il ne peut donc pas sur-affirmer. Toute proposition qui refait porter de la sûreté au
cadre (têtes, modificateurs, fenêtres autour de la copule) se rejette d'office : c'est l'erreur du
seuil en costume neuf (ADR-0003, *La porte, pas le seuil*). La règle est écrite sur
`SELF_DECLARATION_HEADS_EN` (`engine/detect/filters-en.ts`), là où on la relira.

## 4. Chaque lexique a SA ligne de séparation — importer la précédente a échoué six fois sur six

C'est la colonne vertébrale de la campagne. Chaque lot a commencé par essayer la ligne du lot
d'avant, et chaque fois elle ne mordait pas :

| label | la ligne qui décide | pourquoi celle d'avant ne transportait pas |
|---|---|---|
| `mental_health` | **l'hyperbole** ne franchit pas la porte (« i'm dying » = rire) | — (pilote) |
| `health_physical` | **le symptôme n'est pas la condition** (aucun nom de symptôme n'entre) | l'hyperbole n'y travaille presque pas : les conditions physiques ne se figurativisent pas |
| `conflictual` | **le discriminant — la relation — n'est pas dans l'export** ; on réduit la surface | ni hyperbole ni symptôme : la vanne et l'agression sont le même énoncé |
| `politics` | **syntagmes, jamais de noms nus** ; et l'épithète n'entre pas | les noms nus politiques collisionnent par polysémie, pas par hyperbole |
| `religion` | **le mot qui nomme entre, le mot qui fait n'entre pas** (couche phatique exclue) | `mosque`, `gurdwara` sont monosémiques : exiger le syntagme coûterait tout le rappel pour rien |
| auto-déclaration EN | **l'étage protège, pas le cadre** (§3) | aucune ligne lexicale ne tient une construction que l'idiome habite |

La leçon n'est pas une des six lignes : c'est qu'**une ligne d'admission est un résultat de mesure
par label, jamais un acquis transportable**. Chaque ligne vit en tête du lexique qu'elle gouverne ;
les promues en doctrine (admission de l'hyperbole, nom-de-maladie-devenu-insulte, phaticité) sont
dans ADR-0003, *L'admission d'un terme*.

## 5. La porte propre est biaisée — discriminer sur la forme grammaticale coupe le champ politique de travers

La règle d'admission la plus défendable du lot `politics` EN — « entre le nom doctrinal, reste
dehors l'adjectif d'usage général » — appliquée mécaniquement, admettait `socialist` (le mot
ordinaire de la gauche : un nom doctrinal) et excluait `conservative` (le mot ordinaire de la
droite : un adjectif d'usage général, « i am conservative with my time estimates »). Une règle
irréprochable à chaque étape reproduisait le défaut français mesuré juste avant — les identités
d'un camp encodées comme identités, celles de l'autre comme accusations — parce que **les deux
camps ne nomment pas leur position sous la même forme grammaticale**.

Le geste retenu : `conservative` entre, son faux positif est une acceptation assumée, et `liberal`
entre par symétrie du même raisonnement — en exclure un seul n'est pas défendable, exclure les deux
l'aurait été. Le mécanisme est décrit en tête de `engine/lexicon/politics.ts` ; le témoin de
symétrie (`politics-symmetry.test.ts`) tient la partition. Personne n'écrit ce biais : il naît de
la **composition** de décisions locales raisonnables, et aucune relecture de terme ne peut le voir —
une couverture se vérifie dans les deux sens, une symétrie dans les deux camps.

## 6. Le sociolecte — admettre un marqueur de dialecte tague une population sur sa manière de parler

Le français l'avait tranché en une ligne (`wallah` / `inchallah` / `machallah` exclus : interjections
lexicalisées de l'argot général). L'anglais a montré que le cas est plus large, pas plus étroit :
*bless you*, *blessed*, *praying for you*, *preach*, *amen* sont des marqueurs saillants de
l'anglais afro-américain et du Sud des États-Unis — les admettre taguerait religieusement une
population sur son sociolecte. Même chose côté `sexuality`, où la couche lexicale issue du ballroom
est la plus tentante à lister et la plus fausse à admettre : au seuil 1, ce serait un constat
d'orientation posé sur quiconque parle comme ça.

La règle a quitté les lexiques pour devenir une **porte d'admission d'ADR-0003** (portée : six
labels, toute langue), parce qu'elle reviendrait à chaque langue livrée. Le coût se déclare avec
elle : des porteurs réels écrivent ces mots, et les exclure coûte du rappel sur eux — le prix d'une
formule qui ne discrimine pas n'est pas du rappel, c'est un constat posé sur tout le monde.

## 7. La méthode — voix scellées, vérité-terrain d'abord, témoins mutés

Ce qui a rendu tout le reste mesurable, et qui se réemploie tel quel :

- **Le sceau est un ordre de commits, pas une déclaration.** Voix et vérité-terrain écrites et
  commitées **avant** toute lecture du lexique et avant le premier tour du détecteur. « Faux
  positif » n'a pas de sens sans un attendu écrit d'avance : juger après avoir vu la sortie, c'est
  juger avec indulgence. Seul l'historique le prouve — aucune assertion ne le pourrait.
- **Les voix sont des personnes, pas des dosages.** Un jeu de déclencheurs rend un verdict décidé
  par sa propre densité. On brieffe un registre et une situation, jamais une liste de termes — et
  l'auteur n'a pas lu les candidats. Ce que le sceau n'achète pas se déclare : même main des deux
  côtés = contrôle de cohérence, pas validation externe.
- **Un témoin se vérifie par mutation, jamais par relecture** — et le résultat réel de la mutation
  se consigne dans le fichier, surtout quand il n'est pas celui qu'on avait prévu (une mutation qui
  rend moins de rouges que prévu a révélé trois propriétés vacueuses sur six ; une mutation qui ne
  s'applique pas a exactement l'apparence d'une mutation qui passe).
- **L'ablation est l'instrument des évictions.** « Ce terme apparaît-il dans une vraie détresse ? »
  trouve toujours oui ; la question qui décide est « porte-t-il un rappel que rien d'autre ne
  porte ? », et elle se répond en retirant le terme et en repassant les voix — les trois à la fois,
  pour voir dans le même tableau ce que le retrait achète et ce qu'il coûte.
- **La couverture accidentelle s'annote, elle ne s'évince ni ne s'ignore** : une homographie qui
  traverse (`depression`, `halal`, `pride`) est un état à rendre intentionnel, tort compris —
  jamais un acquis, jamais un motif de retrait (ADR-0003, *Admettre n'est pas évincer*).

## 8. La branche non fusionnée — le seul défaut qu'aucun filet ne peut voir

Trouvé en clôturant la campagne, et il mérite d'être nommé parce qu'il échappe par construction à
tout ce qui précède : **un correctif revu, approuvé, jamais fusionné**. La redescente des adjectifs
qui nommaient sur un objet (« the sound mix on this album is anemic » → constat nommé
`health_physical`) a vécu des jours sur une branche pendant qu'une fiche de dette la décrivait
comme en attente — et le tort tournait en production.

La CI est verte des deux côtés d'une branche non fusionnée. Toutes les règles de ce dépôt — filets
qui déclarent leur frontière, témoins mutés, goldens à diff nul — vérifient du code **présent** ;
rien ne couvre du code qui n'est pas là. Le seul garde-fou est procédural : une revue qui dit
« merge » n'est finie que quand `git branch --no-merged` ne la liste plus, et l'inventaire des
branches fait partie de la clôture d'un lot au même titre que la CI.
