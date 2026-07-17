# ADR-0003 : Doctrine des constats sensibles

**Statut :** Accepté
**Date :** 2026-06-26
**Décideur :** yuya

Les autres ADR décident comment le produit est bâti. Celui-ci décide **ce que l'outil ose affirmer, et
ce qu'il refuse d'affirmer**. C'est la raison d'être.

Le catalogue des labels, des lectures reconnues et des exigences testables vit dans
[`docs/constats-sensibles.md`](../constats-sensibles.md). Ici vit le **raisonnement** : un ADR est le
seul endroit où une décision et sa raison se figent ensemble.

## Ce que le produit affirme, et ce qu'il a vérifié

Deux niveaux, à ne pas confondre.

- **« Une plateforme »** désigne la thèse. Elle vaut pour n'importe laquelle : le propos est
  systémique. TikTok est le premier connecteur, pas le sujet.
- **« Mesuré »** désigne ce qu'on a vérifié. Ça s'arrête à **TikTok, en français**, sur la part de
  texte auto-décrit d'un export.

Écrire la mesure au niveau du système promettrait une portée qu'on n'a pas. Borner la thèse à TikTok
ferait un outil anti-TikTok. Le lecteur doit pouvoir faire la différence.

> Ce document se réécrit : ses sections n'ont pas de numéro. On y renvoie par leur nom.

## Contexte

Une petite part d'un export TikTok est du texte auto-décrit lisible hors-ligne : les recherches et les
commentaires, **moins de X % du volume**. Un classifieur local peut-il y lire des **labels sensibles**
(santé physique, santé mentale, orientation, politique, religion, conflictuel) avec assez peu
d'erreurs pour l'afficher, et **où échoue-t-il systématiquement** ?

La question a été mesurée sur un banc jetable : 8 personas synthétiques, 155 items, corpus inventé —
*réaliste ≠ réel*. Deux résultats fondent tout le reste.

**Ce que le lexique capte** *(TikTok, en français)* — l'explicite et le canonique. Les faux positifs
restent cantonnés aux mots à double sens ordinaires : « église » culturelle, « marché déprimé »,
« immobilier malade ». Jamais sur le sensible grave — orientation et conflictuel affichent zéro faux
positif. Ce résultat ne présume de rien ailleurs : il repart à zéro dans une autre langue.

**Ce qu'aucun lexique ne captera — le mur.** Une fois rebouchés tous les trous de vocabulaire
comblables, il reste des phrases dont le sens tient à la tournure, sans mot à repérer : « no futur on
finira tous cramés », « plus rien me fait kiffer ». Ce n'est pas un défaut de réglage.

Ce résultat-là vaut au-delà du banc, et c'est voulu : ce qui échappe, c'est du sens sans mot pour
l'attraper. Ça ne tient ni à TikTok ni au français. Changer de plateforme ou de langue déplacerait les
exemples, pas le mur.

**Ce n'est pas un échec : c'est la démonstration.** Une plateforme franchit cette marche — elle a les
serveurs, les modèles, et surtout les **croisements** de données rachetées. Un outil local et
sous-dimensionné ne la franchit pas. La limite de détection fait partie du propos.

## La posture — décision-cadre

PanoptiCool tient une tension, et ses deux branches pointent dans le même sens.

- **La limite fait partie du propos.** Qu'un outil local aux moyens dérisoires lise déjà certaines
  choses intimes dans si peu de données, c'est la démonstration. Ce qu'il ne lit pas rappelle qu'une
  plateforme, elle, le lit.
- **Mieux détecter est un objectif, pas une tolérance.** La thèse n'est pas « regardez ce qu'on
  rate », mais « regardez ce qu'on parvient à savoir sans avoir leurs moyens ». Plus l'outil tire de
  signal du peu qu'il possède, plus l'asymétrie est démontrée.

Démontrer et mieux détecter sont donc **alignés**, pas opposés.

**La ligne rouge**, et il n'y en a qu'une : améliorer la détection en **cachant la pauvreté des
moyens** — croiser des données externes rachetées, ou revendiquer une précision qu'on n'a pas. Le
contraste qui porte le propos, c'est *le peu qu'on a / ce qu'on en tire quand même* : le dissimuler
retire au produit ce qu'il a à montrer. Tant que l'amélioration se fait **à moyens constants** et que
la limite reste visible quelque part, elle sert le propos.

**Le socle est le lexique à deux étages** : solide sur l'explicite *(en français)*, erreurs
cartographiées et bornées, déterministe, sans poids ni hébergement, hors-ligne. Il est destiné à être
enrichi, chaque pas soumis à la ligne rouge.

## Le cadrage — une plateforme est l'auteur du constat

**L'auteur du constat est toujours une plateforme.** Tout constat sensible se lit *« une plateforme
tenterait d'inférer X »*, jamais *« tu es X »* — à aucun niveau de confiance. La confiance module la
force de la tentative, jamais l'identité. Le produit montre **ce qu'on peut faire de tes données**,
pas qui tu es : « tu es X » change de sujet, répond à une question que l'outil ne sait pas trancher,
et coûte cher quand c'est faux — pathologiser quelqu'un, l'outer.

**Le constat s'énonce en syntagme, sans sujet** — « Signal indirect associable à la santé mentale ».
Ce qui protège n'est pas la brièveté du libellé, c'est son **sujet** : le constat décrit un signal et
sa lecture, pas un état posé sur quelqu'un. « Tu sembles traverser une dépression » prononcerait le
verdict qu'on vient d'interdire. C'est testé : pas de 2ᵉ personne, pas de verdict, pas de label
sensible nu sans marqueur d'inférence.

**L'honnêteté est déclarée, pas structurelle.** L'UI *peut* classer les lectures et afficher une
confiance ; la retenue vit dans un avertissement visible — « ce sont des suppositions, pas des
certitudes » — **dans la zone de résultats elle-même**. La charge passe donc de la forme au message :
avant, l'UI ne *pouvait pas* sur-affirmer ; maintenant elle s'en abstient. **L'avertissement est
load-bearing** — sans lui, l'outil affiche des verdicts confiants sans contrepartie. Il vit dans la
zone de résultats, et pas seulement au seuil du site, parce qu'une carte sortie en capture se lit
comme un verdict.

**Le discours « avec si peu » est centralisé, pas répété sur chaque carte.** Ses deux faces — *« voilà
ce qu'on déduit du peu qu'on a »* et *« voilà le cran qu'on ne franchit pas, mais qu'une plateforme
franchirait »* — se présentent **ensemble**, dans un moment pédagogique dédié. Tamponnée sur chaque
carte, la mention devient du bruit ; dite une fois, elle est lue.

**Cette preuve du mur ne se retire jamais.** Elle ne dépend pas du lexique : il restera toujours un
cran au-dessus à montrer. Aujourd'hui l'oblique textuel ; demain, même avec un modèle, **le contenu
des vidéos regardées**, que l'export ne porte jamais — des titres, ni image ni son. Elle se
**re-cible** à chaque palier.

## Le mécanisme — deux étages, et ce qui n'est jamais deviné

**Deux étages, pour les six labels.** Un signal se classe selon sa **forme**, pas seulement sa
présence :

- **Explicite** — la personne emploie le terme qui désigne le label (« ma dépression », « je suis
  croyant ») → constat **nommé**, confiance plus haute, quasi-factuel (« tu as écrit ce terme »).
- **Indirect** — recherches ou commentaires répétés, **aucun terme explicite** → constat **large**
  (« vulnérabilité potentielle », « intérêt communautaire »), confiance basse.

**Règle dure : un constat précis n'apparaît QUE si le terme précis est présent.** Jamais de condition
nommée *devinée* par recoupement — le fin n'existe que s'il est écrit. La règle **dissout la question
de la granularité** : la précision vient des **données**, pas du classifieur. Le terme déclencheur est
**montré en surbrillance** dans la preuve — montré, pas deviné.

**« Pour qui », pas « quel mot ».** Ce qui distingue un signal *vécu* d'un signal qui *ne concerne pas
la personne* n'est pas la présence d'un mot clinique, c'est **pour qui le signal vaut** : chercher un
soin **pour soi** est un signal fort de vécu, même sans terme clinique ; chercher **pour autrui**
(« aider mon ado ») est un signal-sans-vécu. L'erreur naturelle est de juger la *force* d'un signal
sur la présence d'un mot. Ce sont deux axes qu'on ne fond pas — nommé/large décide *comment taguer*,
pour-qui décide *à qui le signal se rapporte*. Un signal peut être **fort *et* large**.

**La bio est un signal fort.** Ce qui est **revendiqué** — drapeau, badge, auto-étiquette affichée —
est une auto-désignation assumée : explicite, jamais « indirect ». On ne sous-classe pas un signal
fort faute de formulation en toutes lettres.

**Exception `conflictual` : pas d'étage indirect.** Les insultes **émises** *sont* le signal explicite.
La porte reste « émis ≠ cité » (« il m'a traité de… » est hors-champ) **et** « visant un autre
utilisateur » (un juron sans cible — « putain ce bug » — ne compte pas). `conflictual` est
**item-level** : un trait porté par des messages précis, pas un état diffus à inférer. Lui forcer un
étage indirect reviendrait à juger un caractère par accumulation d'indices.

## L'incertitude, et la pluralité des lectures

**Trois états de vérité-terrain, pas deux.** Pour chaque (personne × label) : **vécu** (tag attendu) ·
**signal-sans-vécu**, signal réel mais ne concernant pas la personne (**tag attendu aussi**) ·
**non-porteur réel**, aucun vrai signal, juste du texte qui en a la forme (« marché déprimé »,
sarcasme, citation) → **aucun tag**.

**Le signal-sans-vécu tagué n'est pas un faux positif — c'est la démonstration.** Quand l'outil tague
« intérêt santé mentale » sur quelqu'un qui cherche pour son adolescent, il ne se trompe pas : c'est
exactement ce qu'une plateforme ferait. Le seul tort à compter est le **non-porteur réel tagué**. D'où
**deux compteurs séparés, jamais additionnés** : le volume signal-sans-vécu (attendu **haut** — voulu)
et le tort (voulu **bas**).

*Raison — c'est le point le plus contre-intuitif de la doctrine :* traiter le faux-porteur comme un
déchet à éliminer ferait rater ce que l'outil doit montrer, qu'un profileur tague l'entourage d'une
personne vulnérable aussi sûrement que la personne elle-même. La plateforme **ne sait pas** « pour
qui » vaut le signal, et elle tague quand même : cette indistinction est précisément ce qu'on montre.

**Un constat sensible n'a pas une seule lecture valide, et c'est l'axe, pas l'exception.** Quand le
classifieur tague « religion » sur « le calme d'une vieille église m'apaise », il n'a pas commis une
erreur technique : il a **tranché une ambiguïté réelle** — appréciation culturelle ou pratique
religieuse — qu'aucune donnée ne permettait de trancher. Le tort n'est pas toujours d'avoir *vu* un
signal absent ; c'est parfois d'avoir **choisi une lecture** là où plusieurs coexistaient. Religion
n'est pas « pratiquant » seulement : c'est l'axe **pratiquant ↔ critique**. *Le rôle de l'outil est de
montrer cette pluralité, pas de la résoudre à la place de la personne.*

**Éventail de lectures, ordonné ou à égalité — jamais chiffré.** Une preuve peut porter les lectures
possibles du même signal, avec un **mode explicite** : `ranked` (une lecture domine) ou `equal`
(aucune privilégiée). L'éventail s'attache à **une preuve au sein d'un constat**, pas au constat
global : deux preuves d'un même constat peuvent porter des éventails différents. Un constat explicite
à haute confiance n'a **pas** d'éventail.

**Le verrou, non négociable :** la confiance vit sur le **constat** — le signal global est-il
solide ? — **jamais par lecture**. Aucune pondération, aucun pourcentage, aucune couleur par lecture :
`ranked` **ordonne, il ne chiffre pas**. Pondérer un motif (« proche 20 % / vécu 70 % ») reviendrait à
**classer l'intention**, ce que la machine ne sait pas faire.

**Neutralité : ne pas inscrire de biais moral dans le silence.** Un outil qui détecterait « croyant »
mais refuserait pudiquement de détecter « critique virulent de la religion » prendrait **position** —
il traiterait la foi comme une donnée et l'anti-cléricalisme comme un tabou. Une plateforme infère
aussi bien l'un que l'autre, et les deux sont des signaux qu'un annonceur exploite. **Le silence
sélectif est un jugement déguisé.**

**« Plusieurs lectures » n'est pas « tout se vaut ».** Une lecture purement métaphorique — « marché
déprimé » — n'est pas une interprétation à respecter : c'est le non-porteur réel, et il reste un tort
à compter. La pluralité ne dilue pas le tort, et elle s'affiche sans se pondérer.

**Le registre des lectures vit dans le catalogue**, label par label. L'ADR fige le **principe** ; le
catalogue tient le **journal** — parce que la pluralité dépend du thème, et que l'axe de religion
n'est pas celui de la santé mentale.

## La preuve est citée, et sa réutilisation est montrée

Chaque constat porte ses **items-source dépliables** — le texte de la recherche ou du commentaire qui
a déclenché le constat — et la page montre quand un même item nourrit **plusieurs** constats (« aussi
exploité par… »).

*Raison :* c'est l'argument le plus concret du produit. Voir une phrase anodine alimenter à la fois un
constat de santé et un constat de rythme de vie montre, sans rien avoir à expliquer, comment une
plateforme presse chaque miette dans plusieurs directions. La réutilisation visible n'est pas une
optimisation d'affichage : c'est ce qui rend l'extraction tangible.

**Borne mémoire :** afficher le texte-source implique qu'un fragment de la donnée lue franchisse la
frontière moteur→UI. C'est **borné, délibéré, délimité** : ne transitent que les items effectivement
cités par un constat. Le volume est borné par le nombre de constats, pas par la taille de l'export —
l'invariant d'ADR-0002 tient.

## Ce qui porte la sécurité : la porte, pas le seuil

Un constat sensible **démarre replié**, derrière un en-tête qui porte un badge **« sensible »**.
Ouvrir est un geste. **Le repli est la porte du consentement ; le badge dit ce qu'il y a derrière.**

La protection vient de là — du repli, du badge, de l'éventail de lectures et de la confiance visible —
et pas du seuil de détection. L'énoncé a deux moitiés, qui tiennent séparément :

- **La porte protège du coup d'œil non consenti** — carte vue par-dessus l'épaule, capture, démo. Le
  repli remplit cette fonction, le badge la rend informée : on sait qu'on ouvre du sensible avant de
  l'ouvrir.
- **Monter un seuil rendrait l'affichage du sensible *plus lourd* — réservé aux cas les plus nets —
  sans le rendre plus sûr.** Sous le repli, le seuil ne décide que **combien de cartes apparaissent** ;
  chacune est déjà derrière une porte. Moins-mais-plus-net n'ajoute aucune sécurité, et retire de la
  démonstration.

**Traitement plat sur les six labels, `mental_health` compris.** Pas de graduation : les six sont
derrière la même porte. Un traitement gradué se rouvrira avec le **cadrage abus / VSS**, différé en
R&D et non tranché à ce jour. D'ici là, un cran de protection réservé à un label serait une décision
arbitraire, et cette doctrine existe pour ne pas en porter.

## Options écartées

Chacune a été considérée ; le raisonnement complet vit dans la section citée.

- **Afficher le sensible en phrase, ou en verdict d'identité**, à n'importe quel niveau de confiance —
  le produit montre ce qu'on peut faire de tes données, pas qui tu es. *(Le cadrage)*
- **Traiter tout faux positif comme un déchet à éliminer** — le signal-sans-vécu tagué *est* la
  démonstration, et certains faux positifs sont des lectures alternatives, pas des bugs.
  *(L'incertitude)*
- **Le seuil de détection comme levier de sécurité** — monter le seuil coûte de la démonstration sans
  acheter de sûreté. *(La porte, pas le seuil)*
- **Le silence sélectif comme posture neutre** — ne détecter qu'une face d'un axe est un biais moral.
  *(L'incertitude)*
- **Une amélioration de détection qui cacherait la pauvreté des moyens** — la ligne rouge. *(La
  posture)*

**Croire qu'un meilleur lexique résoudra l'oblique.** Celle-ci mérite ses lignes, parce qu'elle se
représentera : enrichir le lexique **repousse la frontière de l'explicite** mais **ne résoudra jamais
l'oblique pur** — « no futur… » n'a aucun mot à ajouter. Le jour où quelqu'un proposera un lexique de
plus pour combler le mur, c'est ici qu'il faut revenir.

## Conséquences

**Ouvre :** un socle shippable — le lexique deux étages, borné, déterministe, sans poids ni
hébergement ; une doctrine d'affichage **testable**, traduite en propriétés vérifiables dans
[`docs/constats-sensibles.md`](../constats-sensibles.md) ; une pluralité des lectures extensible label
par label **sans rouvrir cet ADR** ; une preuve du mur re-ciblable à chaque palier.

**Coûte :** la posture repose sur deux pièces d'UI, et chacune peut tomber sans bruit.
L'**avertissement** est load-bearing — sans lui, l'outil est un afficheur de verdicts confiants. Le
**repli** l'est autant : le jour où une carte sensible s'afficherait dépliée par défaut, ce n'est pas
un détail d'affichage qui saute, c'est la porte du consentement.
