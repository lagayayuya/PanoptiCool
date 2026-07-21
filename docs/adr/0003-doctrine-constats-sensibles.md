# ADR-0003 : Doctrine des constats sensibles

**Statut :** Accepté
**Date :** 2026-06-26
**Décideur :** yuya

Les autres ADR décident comment le produit est bâti. Celui-ci décide **ce que l'outil ose affirmer, et
ce qu'il refuse d'affirmer**. C'est la raison d'être.

Le catalogue des labels, des **lectures reconnues** et des **exigences testables** vit dans
[`docs/constats-sensibles.md`](../constats-sensibles.md), qui tient aussi le journal des mesures, des
précédents et des dettes. Ici vit le **raisonnement** : un ADR est le seul endroit où une décision et
sa raison se figent ensemble.

> Ce document se réécrit : ses sections n'ont pas de numéro. On y renvoie **par leur nom** — le code
> le fait, en commentaire, et un renvoi mort n'y rougit pas.

## Ce que le produit affirme, et ce qu'il a vérifié

- **« Une plateforme »** désigne la **thèse**. Elle vaut pour n'importe laquelle : le propos est
  systémique. TikTok est le premier connecteur, pas le sujet.
- **« Mesuré »** désigne ce qu'on a **vérifié**. Ça s'arrête à **TikTok, en français**, sur la part de
  texte auto-décrit d'un export.

Écrire la mesure au niveau du système promettrait une portée qu'on n'a pas ; borner la thèse à TikTok
ferait un outil anti-TikTok. Le lecteur doit pouvoir faire la différence.

## Contexte

Une petite part d'un export TikTok est du texte auto-décrit lisible hors-ligne : recherches et
commentaires, **moins de X % du volume**. Un classifieur local peut-il y lire des **labels sensibles**
(santé physique, santé mentale, orientation, politique, religion, conflictuel) avec assez peu
d'erreurs pour l'afficher, et **où échoue-t-il systématiquement** ? Mesuré sur un banc jetable — 8
personas synthétiques, corpus inventé, *réaliste ≠ réel*. Deux résultats fondent le reste.

**Ce que le lexique capte** *(TikTok, en français)* — l'explicite et le canonique, faux positifs
cantonnés aux mots à double sens ordinaires. Ce résultat repart à zéro dans une autre langue.

**Ce qu'aucun lexique ne captera — le mur.** Une fois rebouchés tous les trous comblables, il reste des
phrases dont le sens tient à la tournure, sans mot à repérer : « no futur on finira tous cramés ».
C'est du **sens sans mot pour l'attraper** : ça ne tient ni à TikTok ni au français, et changer de
plateforme ou de langue déplacerait les exemples, pas le mur. **Ce n'est pas un échec : c'est la
démonstration** — une plateforme franchit cette marche, avec ses serveurs, ses modèles et ses
**croisements** de données rachetées ; un outil local et sous-dimensionné ne la franchit pas.

## La posture — décision-cadre

- **La limite fait partie du propos.** Qu'un outil aux moyens dérisoires lise déjà certaines choses
  intimes dans si peu de données, c'est la démonstration. Ce qu'il ne lit pas rappelle qu'une
  plateforme, elle, le lit.
- **Mieux détecter est un objectif, pas une tolérance.** La thèse n'est pas « regardez ce qu'on
  rate », mais « regardez ce qu'on parvient à savoir sans avoir leurs moyens ». Démontrer et mieux
  détecter sont **alignés**, pas opposés.

**La ligne rouge**, et il n'y en a qu'une : améliorer la détection en **cachant la pauvreté des
moyens** — croiser des données externes rachetées, ou revendiquer une précision qu'on n'a pas. Le
contraste qui porte le propos, c'est *le peu qu'on a / ce qu'on en tire quand même* : le dissimuler
retire au produit ce qu'il a à montrer. Tant que l'amélioration se fait **à moyens constants** et que
la limite reste **visible quelque part**, elle sert le propos.

**Le socle est le lexique à deux étages** : solide sur l'explicite *(en français)*, **erreurs
cartographiées et bornées**, déterministe, sans poids ni hébergement, hors-ligne. Destiné à être
enrichi, chaque pas soumis à la ligne rouge.

## Le cadrage — une plateforme est l'auteur du constat

**L'auteur du constat est toujours une plateforme.** Tout constat sensible se lit *« une plateforme
tenterait d'inférer X »*, jamais *« tu es X »* — à aucun niveau de confiance. La confiance module la
**force de la tentative**, jamais l'**identité** : « tu es X » change de sujet et coûte cher quand
c'est faux — pathologiser quelqu'un, l'outer. Le constat s'énonce donc en **syntagme, sans sujet**, et
ce qui protège n'est pas la brièveté du libellé mais son **sujet**. Pas de 2ᵉ personne, pas de
verdict, pas de label sensible nu sans marqueur d'inférence. *Propriétés (a) et (c) de
`engine/wording.test.ts`.*

**L'honnêteté est déclarée, pas structurelle.** L'UI *peut* classer les lectures et afficher une
confiance ; la retenue vit dans un avertissement — « ce sont des suppositions, pas des certitudes » —
**dans la zone de résultats elle-même**, et pas seulement au seuil du site, parce qu'une carte sortie
en capture se lit comme un verdict. **L'avertissement est load-bearing** : sans lui, l'outil affiche
des verdicts confiants sans contrepartie.

**Le discours « avec si peu » est centralisé, pas répété sur chaque carte.** Ses deux faces — *« voilà
ce qu'on déduit du peu qu'on a »* et *« voilà le cran qu'on ne franchit pas, mais qu'une plateforme
franchirait »* — se présentent **ensemble**, dans un moment pédagogique dédié. Tamponnée sur chaque
carte, la mention devient du bruit ; dite une fois, elle est lue.

**Cette preuve du mur ne se retire jamais**, et elle se **re-cible** à chaque palier : aujourd'hui
l'oblique textuel ; demain, même avec un modèle, **le contenu des vidéos regardées**, que l'export ne
porte jamais.

## Le mécanisme — deux étages, et ce qui n'est jamais deviné

**Deux étages, pour les six labels.** Un signal se classe selon sa **forme**, pas seulement sa
présence : **explicite** — la personne emploie le terme qui désigne le label — → constat **nommé**,
confiance plus haute ; **indirect** — recherches ou commentaires répétés, **aucun terme explicite** →
constat **large**, confiance basse.

**Règle dure : un constat précis n'apparaît QUE si le terme précis est présent.** Jamais de condition
nommée *devinée* par recoupement — le fin n'existe que s'il est écrit. La règle **dissout la question
de la granularité** : la précision vient des **données**, pas du classifieur. Le terme déclencheur est
**montré en surbrillance** dans la preuve — montré, pas deviné. *`rules/d1-sensitive-topics.test.ts`
(B2) et `ui/v2/highlight.test.ts`.*

**« Pour qui », pas « quel mot ».** Ce qui distingue un signal *vécu* d'un signal qui *ne concerne pas
la personne* n'est pas la présence d'un mot clinique, c'est **pour qui le signal vaut** : chercher un
soin **pour soi** est un signal fort de vécu, même sans terme clinique ; chercher **pour autrui** est
un signal-sans-vécu. L'erreur naturelle est de juger la *force* d'un signal sur la présence d'un mot.
**Deux axes qu'on ne fond pas** — nommé/large décide *comment taguer*, pour-qui décide *à qui le
signal se rapporte* — et **un signal peut être fort *et* large**.

**La bio est un signal fort.** Ce qui est **revendiqué** — drapeau, badge, auto-étiquette affichée —
est une auto-désignation assumée : explicite, jamais « indirect ». On ne sous-classe pas un signal
fort faute de formulation en toutes lettres.

**Exception `conflictual` : pas d'étage indirect.** Les insultes **émises** *sont* le signal explicite.
La porte reste « émis ≠ cité » **et** « visant un autre utilisateur » (un juron sans cible ne compte
pas). `conflictual` est **item-level** : un trait porté par des messages précis, pas un état diffus —
lui forcer un étage indirect reviendrait à juger un caractère par accumulation d'indices.
*`detect/detect.test.ts`, `rules/d1-sensitive-topics.test.ts`.*

## L'admission d'un terme — l'hyperbole s'écarte à la porte

Un lexique encode une phrase dangereuse : *« cette formulation justifie de nommer quelqu'un »*. Ce
jugement **ne survit pas à la traduction**. Quatre mouvements distincts s'y jouent, et la moitié des
re-tranchages de ce dépôt vient de les avoir confondus : **admettre** (un terme qu'on n'a pas),
**évincer** (un rappel qui existe), **rétrograder** (garder le signal, retirer l'affirmation),
**annoter** (enregistrer une couverture qu'on n'a pas décidée).

### Admettre — l'usage dominant décide

**Règle, pour les six labels et toute langue :** un terme n'entre que si son **usage dominant dans le
registre visé** — celui des réseaux sociaux, pas celui du dictionnaire — est **littéral**. Un terme
dont l'usage dominant est conventionnellement **hyperbolique** est **exclu**, jamais rétrogradé vers
le tier colloquial.

*Raison, et c'est ce qui rend la règle non négociable :* la rétrogradation repose sur le seuil de
répétition, et **le seuil ne filtre pas l'hyperbole**. Un terme **polysémique** a plusieurs sens dont
l'un est le bon, et sa répétition **est** un signal — le seuil travaille. Un terme **hyperbolique** a
un sens conventionnel qui n'est **pas** le sens littéral : quelqu'un qui écrit « i'm dying » trois
fois a ri trois fois. **Le seuil n'écarte pas — il accumule**, et il transforme les locuteurs les plus
expressifs en porteurs présumés. *`detect/en-fp-bench.test.ts`, dont l'allowlist `hyperbolic` est
vide : si elle se repeuple, un terme hyperbolique est revenu.*

**Le tier colloquial reste le foyer de la polysémie et du registre bas littéral. Ce n'est pas une zone
de relégation pour les termes douteux.**

**Corollaire — l'étagement par coût d'erreur.** Quand un lot ouvre un terrain dont le taux de faux
positifs n'est **pas mesuré**, les formes au **coût d'erreur maximal** — la détresse vitale au premier
chef — se livrent **séparément et plus tard**, jamais dans le même lot que le vocabulaire ordinaire du
label. Un label se démontre très bien sans elles : la retenue coûte peu de pédagogie et retire le seul
mode de défaillance irrattrapable. Ce report est une **dette nommée**, inscrite là où les dettes se
lisent — pas une omission silencieuse, qui se rouvrirait par accident.

**Le nom de maladie devenu insulte — deuxième porte, et ce n'est pas l'hyperbole.** Un nom de maladie
grave dont le registre visé fait un **qualificatif péjoratif générique** n'entre pas **nu** : seules
ses formes **portées** entrent — le possessif, la locution qui rattache la condition à quelqu'un.
L'hyperbole **gonfle l'état du locuteur** (« i'm dying » parle de celui qui l'écrit, et se trompe sur
son intensité) ; l'insulte **applique la maladie à un tiers ou à un objet** (« this meme is cancer »
ne parle pas du locuteur, et se trompe sur le **sujet**). La première produit un faux porteur trop
expressif ; la seconde tague quelqu'un qui n'a rien dit de lui-même, et elle **chevauche
`conflictual`**, où la même phrase serait correctement lue. **Portée : les six labels.**
*`detect/lexicon-battery.test.ts`, avec son contrôle d'anti-vacuité — la forme portée, elle, tague.*

**Le marqueur de sociolecte — troisième porte, et c'est celle qui reviendra à chaque langue.** Une
formule dont l'usage dominant est **phatique** — elle accomplit un acte social (condoléance, emphase,
gratitude, accord, salutation) au lieu de **désigner** quoi que ce soit du domaine — n'entre pas, si
marqué que soit son étymologie. Le test est celui du **référent** : *ce terme pointe-t-il vers une
chose du domaine ?* « thoughts and prayers » ne nomme aucune prière ; elle accomplit une sympathie.

*Première raison, et elle dérive du principe de démonstration plutôt que de le contredire.* Le
principe protège le terme qui se déclenche sur des porteurs ET des non-porteurs. Sa clause-limite
tient l'autre bout : la ligne passe entre **un terme qui discrimine mal et un terme qui ne discrimine
pas du tout**. Une formule phatique est le cas-limite exact — tout le monde l'écrit, porteurs et
non-porteurs à parts égales. Elle ne discrimine pas mal : elle ne discrimine pas. Et la barre qui la
retient est celle de l'**admission**, jamais celle de l'éviction : refuser d'ajouter n'est pas
retirer.

*Seconde raison, indépendante, et c'est la plus forte des deux.* Ces formules sont massivement des
**marqueurs de sociolecte**, et les admettre reviendrait à taguer une population sur sa manière de
parler plutôt que sur ce qu'elle dit. La décision est déjà prise en français — `wallah / inchallah /
machallah` exclus de `religion`, *« ne pas taguer une population sur son sociolecte »* — et l'anglais
en fournit une couche bien plus large : `bless you`, `blessed`, `praying for you`, `preach`, `amen`
sont saillants dans l'anglais afro-américain et celui du Sud des États-Unis. Les deux raisons
convergent sur la même exclusion ; **la seconde vaut seule**, et c'est elle qui doit être citée quand
un terme phatique est aussi un marqueur de groupe.

*Le coût, et il se déclare.* Certaines de ces formules sont écrites par des porteurs réels. Les
exclure coûte du rappel **sur des porteurs**, et c'est assumé : le prix d'une formule qui ne
discrimine pas n'est pas un rappel, c'est un constat posé sur tout le monde.

**Portée : les six labels, et toute langue.** Un corollaire de tier en découle et il ne s'hérite pas
d'une langue à l'autre — le tier colloquial est le foyer des formules **marquées**, donc désignantes.
Là où une langue porte l'essentiel de sa couche religieuse ou identitaire en formules **non
marquées**, le tier y change de sens et **ne se transporte pas** : c'est le cas de l'anglais sur
`religion`, qui n'a donc aucune entrée colloquiale.
*`detect/religion-symmetry.test.ts`, garde de phaticité — qui vérifie en outre par quel CHEMIN le
zéro arrive.*

> Ces règles portent sur **ce qui entre**. Elles ne touchent ni au seuil (qui n'est pas un levier de
> sûreté — voir *La porte, pas le seuil*), ni au mur : elles ne rattrapent aucun oblique.

### Admettre n'est pas évincer

La barre n'est pas la même aux deux portes. Refuser un terme à l'entrée ne coûte **aucun rappel** : on
n'a jamais eu le sien. Évincer un terme **déjà ratifié** coûte un rappel qui **existe**, sur des gens
que le produit détecte aujourd'hui. Exiger la même chose des deux côtés est une erreur de catégorie.

**Un terme en place ne se retire pas par doctrine ; il se retire sur mesure.** Et la mesure n'est pas
« ce terme apparaît-il chez des gens concernés ? » — formulée ainsi, elle trouve toujours oui. La
question qui décide est : **ce terme porte-t-il un rappel que rien d'autre ne porte ?** Elle se répond
par **ablation** — retirer le terme, regarder qui disparaît. **La voix qui tranche est celle qui n'a
que lui**, jamais celle qui a d'autres filets. Quand l'ablation montre un rappel unique, le terme
**reste**, et son faux positif devient une **acceptation mesurée** : inscrite comme telle, **avec son
instrument**, jamais laissée en silence. *`detect/fr-colloquial-ablation.test.ts` ; précédents au
catalogue.*

**Le faux positif n'est PAS un motif de retrait.** Un terme qui se déclenche sur des porteurs **et**
sur des non-porteurs **reste**. Son erreur n'est pas un défaut du produit : elle **est** le produit —
l'outil ne prétend pas dire le vrai sur quelqu'un, il montre ce qu'un algorithme déduirait, et un
algorithme qui se trompe est précisément le sujet. Masquer ces erreurs rendrait la démonstration moins
fidèle, et poursuivre les faux positifs coûterait tellement de rappel qu'il ne resterait rien à
démontrer. **Vaut pour les six labels.**

*La limite, et elle est nette :* un terme qui ne se déclenche que sur des **non-porteurs** s'en va.
Celui-là ne démontre rien — « the pros and **cons** » tagué conflictuel n'apprend rien sur l'inférence
algorithmique, il exhibe un artefact de sous-chaîne. **La ligne ne passe pas entre « peu » et
« beaucoup » de faux positifs : elle passe entre un terme qui discrimine mal et un terme qui ne
discrimine pas du tout.**

*Et ce jugement porte sur la SÉMANTIQUE du terme, jamais sur le décompte d'un banc* — quelques voix
rendent des zéros de circonstance, et lire le tableau au lieu du terme retire des formes saines. Cas
d'école et candidats au catalogue.

*Corollaire, et il évite un contresens :* **la tolérance au faux positif ne varie pas d'un label à
l'autre.** Ce qui varie est le droit d'**affirmer**, que porte l'étage nommé et que l'étage large n'a
pas. Un label « plus sensible » ne mérite pas un lexique plus étroit — il mérite, le cas échéant, de
**moins affirmer**.

### La rétrogradation — ni admission, ni éviction

Un terme livré peut changer d'**étage** sans quitter le lexique : la rétrogradation **garde le signal
et retire l'affirmation**. Sa barre est donc **plus basse que celle de l'éviction** — rien n'est
perdu, seule la force de ce qui est dit change. Un terme rétrogradé **affiche toujours son
déclenchement** : la démonstration survit entière, et une rétrogradation **ne se rouvre pas** au titre
de la règle du faux positif, n'ayant rien retiré. **C'est donc le bon outil quand la gêne porte sur
l'AFFIRMATION, et le retrait ne l'est pas.**

*Ce qu'elle vise :* les termes dont l'usage littéral est **réel et courant**, mais dont l'usage
courant a colonisé la forme au point que l'**affirmation** ne se justifie plus — un nom nu de trouble
en est le cas type. **Distinct de la règle d'admission** : ici l'usage littéral n'a pas disparu, c'est
le droit de **nommer quelqu'un** qui a disparu. L'une décide si un terme entre, l'autre ce qu'il a le
droit d'affirmer une fois entré.

*Ce qui l'ouvre :* une **mesure** — une voix non porteuse recevant un constat nommé suffit.
*Ce qui la livre :* une **ablation**.

*Le cas d'arrêt, et il faut l'écrire plutôt que le supposer :* rétrograder ne veut pas dire « le
constat devient large ». Il devient large **si le reste du texte franchit encore le seuil d'items
indirects** — seuil qui vaut **2** pour les lexiques ratifiés. Sous ce seuil, un énoncé **isolé** ne
devient pas large, il **disparaît** : une personne qui écrit une seule fois, littéralement, ce qu'elle
vit. Si elle perd son constat, la rétrogradation se rouvre — ou se livre dans un **tier qui dispense
du seuil sans permettre de nommer**. *Soupçon opératoire sur l'instrument :* une ablation menée sur
des **personas** rend des feux verts **faux**, le voisinage rattrapant la chute d'un terme — d'où
l'ordre imposé, **mesurer l'énoncé isolé AVANT les voix**. *Les deux tenus par
`detect/en-demotion-ablation.test.ts`, qui fige aussi le faux vert.*

### Annoter une couverture accidentelle — gratuit sous condition seulement

Un lexique écrit pour une langue en couvre une autre par homographie, sans qu'aucune décision l'ait
voulu. Le geste qui suit est devenu un réflexe : **annoter** les entrées qui traversent, « sans
changer une ligne de comportement ».

*« Zéro changement de comportement » est vrai de l'état COURANT du détecteur, pas de l'état d'après.*
Quand un label exige **deux** conditions pour taguer — `conflictual` demande une insulte ET une cible
de 2ᵉ personne — la couverture accidentelle peut être **complète d'un côté et nulle de l'autre**. Elle
est alors **latente, pas vivante** : des entrées FR y matchaient de l'anglais ordinaire (« the pros
and **cons** ») sans qu'aucune tague, la seconde liste étant restée française. Annoter n'y coûtait
rien **tant que la porte restait fermée**, et coûtait des faux positifs **le jour où le lot suivant
l'ouvre** — c'est-à-dire au moment précis où plus personne ne relit l'annotation.

**Avant d'annoter, regarder par quelle conjonction le label tague**, et distinguer une couverture
*vivante* (elle produit des constats aujourd'hui : l'annoter enregistre un **état**) d'une couverture
*latente* (elle en produirait : l'annoter enregistre une **dette**). La seconde ne s'annote pas comme
la première — elle se **nomme, avec ce qui l'activera**. **Portée :** les six labels, et toute forme
d'agrégation qui exige plus d'une condition.

## La limite que la donnée ne lève pas — et pourquoi elle ne se traite pas au filtre

Les règles ci-dessus décident **ce qui entre** et **à quel étage**. Celle-ci nomme un cas où aucune ne
peut trancher, parce que **ce qui déciderait n'est pas dans l'export** : « you're such an idiot »
entre amis et les mêmes mots visant un inconnu sont **le même texte**. Ce qui les sépare est la
**relation** — et un commentaire d'export est la moitié d'une conversation.

**Ce n'est pas le mur, et les confondre ferait chercher au mauvais endroit.** Le mur est du *sens sans
mot pour l'attraper*. Ici le mot est là, écrit en toutes lettres, correctement repéré : ce qui manque
est le **contexte qui lui donne sa valeur**. Un lexique plus riche ne rattrape pas le mur ; ici il
**aggrave**, chaque terme ajouté ajoutant sa part d'ambiguïté sans rien apporter pour la lever.

**La règle, valable pour les six labels :** quand le discriminant d'un signal n'est **pas** dans
l'export, il ne se traite **ni par un filtre ni par un seuil** — les deux travaillent sur le texte, et
le texte ne le porte pas. Il se traite par le **volume admis** : le lexique se restreint au registre
dont la lecture visée est l'usage dominant, et le tort résiduel s'inscrit comme **acceptation
assumée**.

*Et il faut tenir la distinction entre deux mots que tout pousse à confondre :* une acceptation
**mesurée** vient avec son instrument ; une acceptation **assumée** n'en a pas encore. Écrire
« mesurée » quand l'instrument n'existe pas est exactement la sur-citation que ce dépôt paie sept fois
— le mot referme la discussion en promettant un chiffre que personne n'a. **Tant que l'instrument
manque, le mot est *assumée*, et le passage à *mesurée* est un événement daté.**

## Le registre informationnel — interroger n'est pas vivre

La règle précédente décide ce qui entre. Celle-ci décide **à quel étage** un terme admis a le droit de
se poser.

**La règle, valable pour les six labels et toute langue :** un item écrit en **registre
informationnel** — il *interroge*, *définit* ou *quantifie* une condition, au lieu de la décrire chez
quelqu'un — peut produire un constat **large**, jamais un constat **nommé**. Chercher un symptôme
**est** un signal, qu'une plateforme lit et que le produit doit donc montrer ; ce n'est **pas la
preuve d'une condition vécue**, et le produit n'a pas le droit d'en affirmer une. D'où un abaissement,
et non un retrait.

**Ce n'est pas un filtre, et l'implémenter comme un troisième filtre est interdit.** Un filtre répond
« ce constat existe-t-il ? » et, quand il se trompe, **retire du signal réel** : il fabrique un faux
négatif aveugle, que rien ne signale ensuite. Une règle d'étage répond « à quel étage ? » et, quand
elle se trompe, **sous-affirme**. Les deux échouent dans des directions opposées, et **une seule est
rattrapable**. *`detect/detect.test.ts` et `detect/health-physical-storey.test.ts` vérifient que
l'item **survit** — la moitié « pas un filtre » est mesurée, pas commentée.*

**Pourquoi pas l'ancrage 1ʳᵉ personne, qui semble plus propre.** Exiger une copule (« je suis X ») a
été **mesuré, et écarté** : quelqu'un qui vit la condition tape les mêmes tournures documentaires
qu'un proche. L'ancrage dégraderait donc **aussi** la personne concernée, et échangerait une
sur-affirmation contre une sous-affirmation silencieuse sur celle qui a le plus à perdre.

**Cette règle est distincte de l'axe *pour qui*, et les deux ne se remplacent pas.** La 3ᵉ personne dit
**pour qui** vaut le signal ; le registre informationnel dit **sous quelle forme** il est écrit. Un
item peut porter les deux, ou l'un sans l'autre — et c'est le second cas qui a rendu la règle
nécessaire. Son origine dit sa portée : une mesure faite en anglais a trouvé un défaut vérifié ensuite
en français, en production. **La règle est écrite pour la machinerie, pas pour une langue.**

> **Ce que la règle ne referme pas**, et qui doit rester visible : le registre **assertif** (« le
> burnout est un phénomène lié au travail ») et le registre **technique** (un nom d'échelle clinique)
> ne sont ni interrogatifs ni possessifs. Ils continuent de produire des constats nommés sur des voix
> professionnelles. Les couvrir suppose l'ancrage 1ʳᵉ personne écarté ci-dessus. Le résidu est nommé
> plutôt que refermé de travers.

## L'état et le sujet — ce que nier veut dire

Les deux règles précédentes décident ce qui entre et à quel étage. Celle-ci nomme une distinction
entre **labels** que rien n'obligeait à voir tant qu'on ne regardait que des conditions — et qui,
non vue, a produit un silence orienté dans le produit livré.

**Quatre des six labels décrivent un ÉTAT** — une condition, un corps, une orientation, un
comportement. **Deux décrivent un SUJET qu'on fréquente** : `politics` et `religion`. La différence
n'est pas philosophique, elle décide de ce que la négation veut dire.

- Sur un label d'**état**, nier le prédicat **retire le signal**. « je ne suis pas déprimé » ne
  décrit aucune dépression : le filtre de négation a raison, et il protège exactement ce que cette
  doctrine existe pour protéger.
- Sur un label de **sujet**, nier le prédicat **ne retire pas le sujet**. « je supporte pas les
  fachos », « jamais de manif pour moi », « je ne vais pas à la messe » sont **sur le sujet**, et la
  négation en dit la **polarité**. Une plateforme les lit comme tels — c'est même le matériau le plus
  abondant qu'elle ait.

**La règle :** sur un label de sujet, une négation devant un marqueur **dégrade** le hit en constat
large au lieu de le supprimer. **C'est une règle d'étage, pas un filtre de moins** — et la
distinction est celle, déjà posée, du registre informationnel : laisser la négation intacte poserait
un constat **nommé** sur « je ne suis pas socialiste », c'est-à-dire affirmerait précisément ce que
la phrase nie. Dégrader garde le sujet et retire l'affirmation ; au pire, la règle **sous-affirme**,
ce qui se rattrape.

**Pourquoi c'est une question de neutralité, et pas de rappel.** L'**opposition est le registre
dominant** du discours politique et religieux : on écrit rarement pour dire son camp, constamment
pour dire contre quoi on est. Un détecteur sourd à l'opposition n'entend donc que **celui qui
adhère** — et c'est le silence sélectif que cette doctrine condamne ailleurs en toutes lettres
(*L'incertitude*, neutralité). Il était livré : mesuré, « ces fachos partout » taguait quand « je
supporte pas les fachos » ne taguait rien, et l'axe **pratique ↔ critique** de `religion`, pourtant
ratifié bidirectionnel, était muet du côté critique.

**Ce que la règle ne rattrape pas**, et qui doit rester visible : le français **infixe** sa négation
(« je NE vote PAS »), ce qui casse les marqueurs multi-mots dans le **repérage**, avant qu'aucune
règle d'étage ne soit consultée. La règle atteint les marqueurs d'un mot et les locutions non
infixées ; elle ne fabrique aucun rappel là où le matcher n'a rien trouvé. Et elle ne touche pas au
mur : une critique sans vocabulaire du sujet n'a aucun marqueur à dégrader.

> **Portée : les deux labels de sujet, jamais les quatre autres.** Un lot qui étendrait la règle à un
> label d'état poserait des constats de condition sur des gens qui écrivent ne pas l'avoir — le mode
> de défaillance exact que le filtre de négation existe pour empêcher. *`detect/lexicon-battery.test.ts`
> tient les deux moitiés, la règle **et** sa contre-épreuve sur les labels d'état.*

## La symétrie d'un axe — et les labels qui n'en ont pas

La règle précédente distingue les labels par ce que la négation y veut dire. Celle-ci nomme une
distinction **entre axes**, rendue nécessaire par un lot de symétrie qui a failli l'appliquer
mécaniquement aux six labels.

**La règle, ratifiée :** un lexique d'appartenance se vérifie **sur les DEUX versants de son axe**,
jamais en comptant les termes d'un seul. Une auto-déclaration majoritaire — « je suis hétéro », « je
suis cis » — doit **déclencher exactement autant** que son pendant minoritaire. *Le fondement :* un
lexique qui n'attrape que les identités minoritaires est un **détecteur de minorités**, pas un
détecteur d'orientation, et sa démonstration **s'inverse** — il prétend montrer ce qu'une plateforme
déduit de tout le monde en ne déduisant que sur certains. C'est le défaut `politics` (la gauche
encodée en identité, la droite en accusation) dans sa forme la plus pure.

**Mais la règle ne s'applique pas là où l'axe n'existe pas, et l'appliquer quand même FABRIQUE le
défaut qu'elle existe pour empêcher.** Le test tient en une question : **le terme majoritaire nomme-t-il
une appartenance, ou l'ABSENCE de la chose détectée ?**

- `sexuality` — `hétéro` nomme une **orientation réelle**, `cis` une **identité réelle**. Axe. La
  règle s'applique.
- `politics`, `religion` — labels de **sujet** : les deux bords, les deux pôles de la croyance
  tiennent une **position** sur le sujet détecté. Axe. La règle s'applique.
- `mental_health`, `health_physical` — **aucun axe, et il ne faut pas en forcer un.** `valide`,
  `neurotypique`, `entendant`, `en bonne santé` ne nomment pas une appartenance : ils nomment
  l'**absence de la condition détectée**. Les admettre poserait un constat de condition sur quelqu'un
  qui écrit n'en avoir aucune — très exactement le mode de défaillance que le filtre de négation
  existe pour empêcher, et que la règle de portée ci-dessus interdit déjà.
- `conflictual` — sans objet : sa porte est l'insulte émise, qui n'est pas une identité.

*Pourquoi l'écrire ici plutôt que dans un lexique :* la règle de symétrie est **séduisante à
appliquer mécaniquement**, et le geste mécanique produit un défaut plus grave que celui qu'il
corrige — poser une condition sur un non-porteur coûte plus cher que de ne pas détecter une
non-appartenance que personne n'écrit. Le lot qui a ratifié la règle a failli le commettre ; le
prochain le fera si rien ne l'arrête ici.

*Et le corollaire qui décide de la FORME d'une réparation :* ce qui se vérifie n'est pas le
**décompte** mais la **marge de redondance** — combien de chemins indépendants mènent à un constat
depuis chaque versant. Une table équilibrée en colonnes peut rester asymétrique en chemins ; c'est ce
que le lot `politics` a mesuré, et son axe grossier symétrique a sauvé une voix tout en cachant le
défaut à tous les compteurs verts. Une symétrie ne se déclare donc **jamais globalement** : elle se
déclare **par chemin**, et les chemins qui restent inégaux se publient à côté du vert.
*`detect/sexuality-symmetry.test.ts`, `detect/religion-symmetry.test.ts`,
`detect/politics-symmetry.test.ts` — chacun déclarant le chemin qu'il tient et ceux qu'il ne tient
pas.*

> **Ce que la règle ne promet pas :** un versant peut être **admis et ne jamais se déclencher**.
> Mesuré sur `sexuality` en français — les quatre termes majoritaires n'ajoutent aucun constat sur
> aucune voix scellée, parce que **personne ne déclare son hétérosexualité**. La règle porte sur ce
> que le lexique **peut** lire, jamais sur ce que le corpus **écrit** : la rareté d'usage est une
> raison de n'attendre aucun gain, jamais une raison de ne pas réparer. Un témoin qui laisserait
> croire à une parité d'**effet** mentirait.

## L'incertitude, et la pluralité des lectures

**Trois états de vérité-terrain, pas deux.** Pour chaque (personne × label) : **vécu** (tag attendu) ·
**signal-sans-vécu**, signal réel mais ne concernant pas la personne (**tag attendu aussi**) ·
**non-porteur réel**, aucun vrai signal, juste du texte qui en a la forme → **aucun tag**.

**Le signal-sans-vécu tagué n'est pas un faux positif — c'est la démonstration.** Quand l'outil tague
« intérêt santé mentale » sur quelqu'un qui cherche pour son adolescent, il ne se trompe pas : **la
plateforme ne sait pas « pour qui » vaut le signal, et elle tague quand même**, et cette indistinction
est précisément ce qu'on montre. Le seul tort à compter est le **non-porteur réel tagué**, d'où **deux
compteurs séparés, jamais additionnés** : le volume signal-sans-vécu (attendu **haut** — voulu) et le
tort (voulu **bas**). *`detect/register-bench.harness.ts`, en trois assertions distinctes.*

**Un constat sensible n'a pas une seule lecture valide, et c'est l'axe, pas l'exception.** Quand le
classifieur tague « religion » sur « le calme d'une vieille église m'apaise », il n'a pas commis une
erreur technique : il a **tranché une ambiguïté réelle** qu'aucune donnée ne permettait de trancher.
**Le tort n'est donc pas toujours d'avoir *vu* un signal absent ; c'est parfois d'avoir choisi une
lecture là où plusieurs coexistaient.** Religion n'est pas « pratiquant » seulement : c'est l'axe
**pratiquant ↔ critique**. *Le rôle de l'outil est de montrer cette pluralité, pas de la résoudre à
la place de la personne.*

**Éventail de lectures, ordonné ou à égalité — jamais chiffré.** Une preuve peut porter les lectures
possibles du même signal, avec un **mode explicite** : `ranked` (une lecture domine) ou `equal`
(aucune privilégiée). L'éventail s'attache à **une preuve au sein d'un constat**, pas au constat
global : deux preuves d'un même constat peuvent porter des éventails différents. Un constat explicite
**à haute confiance** n'a **pas** d'éventail.

**Le constat nommé porte un éventail `ranked`.** Ne pas lui en donner supposerait que l'étage nommé
**résout** l'ambiguïté ; il n'en résout qu'une, la **lexicale** — *quel* sujet est en jeu — et ne dit
rien du **pourquoi** : « témoignages burn out » écrit le terme en toutes lettres et reste une
recherche de témoignages, où vécu, proche et curiosité restent tous ouverts. **Chercher n'est pas
déclarer.** `ranked` exprime exactement cela — écrire le terme à son propre sujet **déplace** la
vraisemblance sans **fermer** le reste ; `equal` y serait faux.

**Le verrou, non négociable :** la confiance vit sur le **constat**, **jamais par lecture**. Aucune
pondération, aucun pourcentage, aucune couleur par lecture : `ranked` **ordonne, il ne chiffre pas**.
Pondérer un motif reviendrait à **classer l'intention**, ce que la machine ne sait pas faire.
*`engine/readings-invariant.test.ts`, au runtime et au type ; attachement à la preuve par
`engine/claim-fan-invariant.test.ts`.*

**Neutralité : ne pas inscrire de biais moral dans le silence.** Un outil qui détecterait « croyant »
mais refuserait pudiquement de détecter « critique virulent de la religion » prendrait **position** —
il traiterait la foi comme une donnée et l'anti-cléricalisme comme un tabou. Une plateforme infère
aussi bien l'un que l'autre. **Le silence sélectif est un jugement déguisé.**

**L'éventail est pour ce que la donnée porte en double, jamais pour ce qu'elle ne porte pas.** Il est
légitime quand **plusieurs lectures coexistent réellement dans la personne** : « le calme d'une
vieille église m'apaise » *est* une appréciation culturelle et *peut* être une pratique — la donnée
porte les deux. Il est illégitime quand le discriminant est **absent de l'export** : celui qui écrit
« t'es qu'un abruti » *sait* s'il s'adresse à une amie ; ce n'est pas ambigu pour lui, c'est absent
pour nous. **Habiller « nous ne pouvons pas savoir » en « voici les lectures légitimes » fabrique une
fausse pluralité** et donne à une **incapacité** l'apparence de la nuance. *Le test, en une
question :* la seconde lecture est-elle **dans la donnée**, ou dans ce qui lui manque ? Éventail dans
le premier cas ; dans le second, la réponse est le **volume admis** et le tort inscrit, jamais un
éventail.

**« Plusieurs lectures » n'est pas « tout se vaut ».** Une lecture purement métaphorique — « marché
déprimé » — n'est pas une interprétation à respecter : c'est le non-porteur réel, et il reste un tort
à compter. La pluralité ne dilue pas le tort, et elle s'affiche sans se pondérer.

**Le registre des lectures vit dans le catalogue**, label par label : l'ADR fige le **principe**, le
catalogue tient le **journal** — parce que la pluralité dépend du thème, et que l'axe de religion
n'est pas celui de la santé mentale.

## La preuve est citée, et sa réutilisation est montrée

Chaque constat porte ses **items-source dépliables**, et la page montre quand un même item nourrit
**plusieurs** constats (« aussi exploité par… »). *Raison :* c'est l'argument le plus concret du
produit — voir une phrase anodine alimenter à la fois un constat de santé et un constat de rythme de
vie montre, sans rien avoir à expliquer, comment une plateforme presse chaque miette dans plusieurs
directions. La réutilisation visible n'est pas une optimisation d'affichage : c'est ce qui rend
l'extraction tangible.

**Borne mémoire :** ne transitent moteur→UI que les items **effectivement cités par un constat**. Le
volume est borné par le **nombre de constats**, pas par la taille de l'export — l'invariant d'ADR-0002
tient. *`rules/d1-sensitive-topics.test.ts` : le non-porteur n'apparaît jamais.*

## Ce qui porte la sécurité : la porte, pas le seuil

Un constat sensible **démarre replié**, derrière un en-tête qui porte un badge **« sensible »**.
Ouvrir est un geste. **Le repli est la porte du consentement ; le badge dit ce qu'il y a derrière.**

La protection vient de là — du repli, du badge, de l'éventail de lectures et de la confiance visible —
et **pas du seuil de détection**. L'énoncé a deux moitiés, qui tiennent séparément :

- **La porte protège du coup d'œil non consenti** — carte vue par-dessus l'épaule, capture, démo. Le
  repli remplit cette fonction, le badge la rend informée.
- **Monter un seuil rendrait l'affichage du sensible *plus lourd* — réservé aux cas les plus nets —
  sans le rendre plus sûr.** Sous le repli, le seuil ne décide que **combien de cartes apparaissent** ;
  chacune est déjà derrière une porte. Moins-mais-plus-net n'ajoute aucune sécurité, et retire de la
  démonstration.

**Traitement plat sur les six labels, `mental_health` compris.** Pas de graduation : les six sont
derrière la même porte. Un traitement gradué se rouvrira avec le **cadrage abus / VSS**, différé en
R&D et non tranché à ce jour. **D'ici là**, un cran de protection réservé à un label serait une
décision arbitraire, et cette doctrine existe pour ne pas en porter.

## Options écartées

Chacune a été considérée ; le raisonnement vit dans la section citée.

- **Le sensible en phrase, ou en verdict d'identité**, à n'importe quel niveau de confiance. *(Le cadrage)*
- **Tout faux positif traité comme un déchet** — le signal-sans-vécu tagué *est* la démonstration, et certains faux positifs sont des **lectures alternatives, pas des bugs**. *(L'incertitude)*
- **Retirer un terme parce qu'il produit des faux positifs** — seul s'en va celui qui ne se déclenche QUE sur des non-porteurs, et sur la sémantique, pas sur un décompte. Quand la gêne porte sur l'affirmation, l'outil est la rétrogradation. *(L'admission d'un terme)*
- **Donner un éventail à une incapacité** — discriminant absent de l'export : le dire est la seule réponse honnête. *(L'incertitude)*
- **Le seuil de détection comme levier de sécurité** — coûte de la démonstration sans acheter de sûreté. *(La porte, pas le seuil)*
- **Le silence sélectif comme posture neutre** — ne détecter qu'une face d'un axe est un biais moral. *(L'incertitude)*
- **Une amélioration qui cacherait la pauvreté des moyens** — la ligne rouge. *(La posture)*
- **Rétrograder un terme hyperbolique en colloquial** — le seuil accumule l'hyperbole au lieu de la filtrer. *(L'admission d'un terme)*
- **Appliquer la règle d'admission à l'éviction** — un terme en place se retire sur ablation, pas sur doctrine. *(L'admission d'un terme)*
- **Livrer la détresse vitale dans un lot non mesuré** — le coût d'erreur maximal se livre séparément, son report s'inscrit comme dette. *(L'admission d'un terme)*
- **Le nom de maladie devenu insulte traité comme une hyperbole** — l'insulte applique la maladie à un tiers et relève d'un autre label. *(L'admission d'un terme)*
- **Annoter une couverture LATENTE comme une vivante** — sous une conjonction, l'annotation enregistre une dette, pas un état. *(L'admission d'un terme)*
- **Traiter par un filtre un discriminant absent de l'export** — le texte ne porte pas la relation ; la réponse est le volume admis. *(La limite que la donnée ne lève pas)*
- **Le registre informationnel comme un filtre de plus** — un filtre fabrique un faux négatif aveugle ; une règle d'étage sous-affirme, ce qui se rattrape. *(Le registre informationnel)*
- **Traiter la négation de la même façon sur les six labels** — sur un label de SUJET elle porte la polarité, pas l'absence de sujet, et la supprimer rend le produit sourd à l'opposition, donc au seul camp qui n'adhère pas. *(L'état et le sujet)*
- **Exempter la négation au lieu de dégrader, sur un label de sujet** — poserait un constat NOMMÉ sur une phrase qui nie. *(L'état et le sujet)*
- **Appliquer la règle de symétrie à un label sans axe** — `valide` / `neurotypique` nomment l'ABSENCE de la condition détectée, et les admettre poserait un constat sur qui écrit ne rien avoir. *(La symétrie d'un axe)*
- **Vérifier une symétrie au DÉCOMPTE** — une table équilibrée en colonnes reste asymétrique en chemins ; ce qui se mesure est la marge de redondance, par chemin. *(La symétrie d'un axe)*
- **Exiger un ancrage 1ʳᵉ personne** — mesuré : il dégraderait aussi la personne concernée. *(Le registre informationnel)*
- **Croire qu'un meilleur lexique résoudra l'oblique.** Celle-ci mérite ses lignes, parce qu'elle se
  représentera : enrichir le lexique **repousse la frontière de l'explicite** mais **ne résoudra
  jamais l'oblique pur** — « no futur… » n'a aucun mot à ajouter. Le jour où quelqu'un proposera un
  lexique de plus pour combler le mur, c'est ici qu'il faut revenir.

## Conséquences

**Ouvre :** un socle shippable — le lexique deux étages, borné, déterministe, sans poids ni
hébergement ; une doctrine d'affichage **testable**, traduite en propriétés vérifiables dans
[`docs/constats-sensibles.md`](../constats-sensibles.md) ; une pluralité des lectures extensible label
par label **sans rouvrir cet ADR** ; une preuve du mur re-ciblable à chaque palier.

**Coûte :** la posture repose sur deux pièces d'UI, et chacune peut tomber sans bruit.
L'**avertissement** est load-bearing — sans lui, l'outil est un afficheur de verdicts confiants. Le
**repli** l'est autant : le jour où une carte sensible s'afficherait dépliée par défaut, ce n'est pas
un détail d'affichage qui saute, c'est la porte du consentement.
