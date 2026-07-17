# ADR-0004 : Le moteur rend UNE valeur nommée

**Statut :** Accepté
**Date :** 2026-07-16
**Décideur :** yuya

Cet ADR porte un **mouvement**, et c'est le mouvement qui est l'information : une architecture
générique a été posée, éprouvée, puis ramenée à ce que le produit lit réellement (−2 344 lignes). Les
deux états sont écrits ici parce que le second ne se comprend pas sans le premier — et parce que la
règle qui en sort ne vaut que si l'on sait ce qu'elle a coûté.

## 1. Contexte — la généricité posée, et sa raison

Le moteur devait rendre à l'UI le résultat de son analyse. Le contrat d'origine était **générique** :

- une union `Insight` discriminée par une nature (`kind`), l'identité de règle portée comme une
  **donnée** (`ruleId`) plutôt que comme un type — pour qu'ajouter une règle n'ajoute pas un type ;
- le wording déporté hors du moteur derrière des références de gabarit (`{templateId, params}`), pour
  que **le moteur émette du sens à habiller** et que l'UX reformule sans toucher aux règles ;
- un registre de règles homogènes `(entrée) => Insight[]`, composables ;
- un **magasin de preuves** partagé — « stockée une fois, référencée N fois » — et un axe de
  sensibilité gradué ;
- un thème first-class, porteur de son propre drapeau `sensitive`.

**Chacune de ces couches était justifiée au moment où elle a été posée** : elles ouvraient un espace
que le produit allait, croyait-on, occuper. Ce n'était pas de la sur-ingénierie par principe — c'était
un pari sur une variété de constats à venir.

Le pari ne s'est pas réalisé. La refonte de l'affichage a tranché autrement, et **personne n'a
rapatrié la conséquence dans le schéma**.

## 2. Ce que la mesure a trouvé

L'inventaire a été **re-dérivé depuis l'écran**, fichier par fichier, plutôt que supposé. Pour chaque
chose que le moteur émettait, on a cherché qui la lisait :

| Ce que le moteur émettait | Lecteurs réels, mesurés |
| --- | --- |
| un cadrage (`framing`) sur CHAQUE constat, requis par le schéma | **aucun** |
| le libellé et la confiance de l'agrégat | **aucun** |
| le libellé, la confiance et les signaux d'exemple de 4 règles | **aucun** : la carte ne lit qu'un compteur |
| le niveau de confiance « élevée » | **aucun producteur** — jamais émis |
| l'axe de sensibilité gradué | un seul producteur, **toujours** la même valeur |
| le drapeau `sensitive` du thème | un seul lecteur, **toujours** `false` |

**Trois axes de gradation pour exprimer une distinction binaire.** Un `ruleId` que l'UI
ré-interprétait via une table pour re-deviner ce que le moteur savait déjà. Et un magasin indexé par
identifiant qui avait produit un couplage stringly-typed mesurable : re-parser une clé de chaîne pour
retrouver un index source — avec, en prime, un `NaN` muet sur toute preuve d'un canal.

**Le problème n'est pas la généralité. C'est la généralité SANS DEMANDEUR** : du code qui tourne, se
teste et se maintient pour personne, et qui fait payer à chaque lecteur le prix d'une indirection dont
plus rien ne dépend.

## 3. Décision

### Le moteur est UNE fonction qui rend UNE valeur nommée

`analyze(entrée) => Analysis`. Chaque champ d'`Analysis` a un **lecteur nommé, relevé sur l'écran** :
`rhythm`, `volumes`, `opacity`, `themes`, `signals`. **Aucun champ spéculatif.** Le champ EST le nom :
il n'y a plus rien à router.

Disparaissent : l'union `Insight`, `ruleId`, les registres de règles et leur composition, l'enveloppe
de sortie, la version de schéma, et le filet d'assertion dev-only — un garde-fou runtime sur une forme
que le type tient désormais seul.

> **La règle de composition, à tenir dans le temps :** un champ n'entre dans `Analysis` que si un
> lecteur le rend. Une donnée sans scène ne s'ajoute pas « en prévision » — elle attend d'être conçue
> ET rendue.

### La preuve est une référence directe — le magasin est supprimé

Une preuve porte son canal, son index source et son verbatim, **sur le constat qui la cite**.
L'identité est une **paire de données**, plus une chaîne à fabriquer puis re-parser.

**Le doublon de verbatim est ACCEPTÉ** : quelques dizaines de chaînes courtes dupliquées quand deux
constats citent la même source. C'est le prix, mesuré et payé sciemment, de la suppression de
l'aller-retour stringly-typed.

La **réutilisation visible** — « aussi exploité par », qui reste l'argument tangible d'ADR-0003 — n'est
pas perdue : elle est **recalculée au rendu**, clé sur la même paire. Elle est dérivée, donc elle se
dérive ; la stocker était un choix, pas une nécessité.

La **borne mémoire** d'ADR-0003 (seul le texte cité franchit la frontière moteur→UI, jamais le graphe
lu) tient toujours — et désormais **par construction** plutôt que par discipline : sans magasin à
remplir, une miette n'existe que portée par le constat qui la cite.

### Le sensible est un discriminant, plus trois axes

```ts
type Deduction = { claim: string; evidence: Evidence[] } & (
  | { sensitive: true;  confidence: 'low' | 'medium' }   // `high` INTERDIT à la compilation
  | { sensitive: false; confidence: 'low' | 'medium' | 'high' }
)
```

Les trois axes dégénérés fusionnent en un discriminant qui, lui, **varie**. **Le plafond du sensible
n'est plus tenu par un test ni par un type de paramètre — le type le dit.**

**Conséquence VOULUE :** le non-sensible *peut* porter « élevée ». Aucune règle ne l'émet ; « solide »
est donc **retiré de la légende de l'UI** — une légende sans référent promet une gradation que la page
ne rend pas. Permettre n'est pas produire : le type garde la porte ouverte, la légende reviendra
**conçue** le jour où une règle l'atteint.

Le factuel n'est plus un constat : c'est `volumes` et `rhythm`.

### Thèmes et signaux sensibles sont séparés

Séparation **actée, pas subie** : aucun thème n'est sensible, aucun constat sensible n'a de thème —
les deux populations sont disjointes **par construction**. Assumé : un sujet sensible n'est pas un
centre d'intérêt parmi d'autres ; les mélanger les aplatirait.

**Écrit ici plutôt que découvert plus tard :** regrouper un sujet sensible sous un thème demanderait de
re-toucher le type. C'est un choix, pas une fatalité.

### Le moteur émet du TEXTE

`Analysis` porte des textes. La couche de gabarits — références, catalogue, rendu, allowlists par
règle — est retirée. **Le wording vit dans UN fichier**, et chaque libellé y est un **export nommé et
typé** que le producteur importe.

**Ce que la bascule achète, concrètement :** un libellé disparu ou mal nommé est une erreur de
**compilation**, là où une référence de gabarit erronée rendait « [gabarit manquant] » au runtime ; et
un compteur est un `number` exigé par la signature, là où une résolution par clé rendait « ? » en
silence. En retour, **l'UI cesse d'importer le moteur** : elle rend des textes, elle n'en résout plus.

**Exception, forcée et bornée :** les libellés de thème, usages, acteurs et lectures sont choisis sur
des clés **ouvertes** portées par les lexiques. Les lexiques étant intouchables et le wording devant
tenir en un fichier, le lexique garde sa clé et le wording la résout — une résolution **interne au
moteur**. L'exhaustivité y est **test-only**, et c'est son plafond réel : la tenir au compilateur
exigerait de retyper le lexique. Ces tests sont le **seul** filet sur ~110 clés — le golden ne couvre
que les thèmes qu'exerce la persona.

## 4. Ce qui ne bouge pas, et qui date d'avant le mouvement

**La validation vit à la frontière non fiable — l'entrée — pas sur notre propre sortie.** Le JSON
d'une plateforme est la donnée qu'on ne contrôle pas : c'est là qu'un validateur runtime gagne sa
place. Valider la sortie qu'on construit soi-même mettrait un runtime de validation sur la mauvaise
frontière de confiance, et ferait payer au client le poids d'un contrôle que le compilateur tient
déjà. Cette décision est **antérieure au mouvement, et elle lui survit intacte.**

**Le garde-fou éthique ne vit pas dans le type.** Un type garantit qu'un cadrage *existe*, jamais
qu'il est *juste* — il laisse passer un cadrage vide, bâclé, ou glissant vers le verdict. Le garde-fou
vit dans les définitions de règles, dans des tests de propriétés, et dans la revue humaine (ADR-0003).

**Les lexiques et la détection sont intouchés** par ce mouvement : ni la doctrine ni les données n'ont
bougé.

## 5. Le cadrage retiré, et l'obligation qui reste

Le `framing` requis sur chaque constat est retiré : le schéma l'exigeait de chaque règle, **l'écran ne
l'affichait jamais**.

**Mais il portait une preuve.** Une propriété testée — « le sujet est la plateforme » — s'appliquait à
ces cadrages. Autrement dit, **une obligation de doctrine était prouvée sur du texte que personne ne
lisait**. La retirer sans contrepartie n'aurait pas retiré du texte mort : elle aurait retiré une
preuve.

Cette propriété ne pouvait pas être reportée telle quelle sur le libellé affiché : le claim ratifié est
un syntagme **sans sujet** (« Signal indirect associable à la santé mentale ») — exiger qu'il nomme la
plateforme aurait rouvert le wording. Le filet qui survit est la propriété « **jamais de verdict sur
la personne** », sur le texte réellement affiché.

**Condition non négociable, tenue AVANT le retrait :** cette propriété a d'abord été **élargie**. Sa
version d'origine n'ancrait la forme assertive que sur un seul lexème — un verdict porté par un autre
sujet (« utilisateur est passionné de crypto ») passait au travers. Le trou était couvert tant que la
propriété de cadrage tenait ; celle-ci devenant le seul filet, il fallait le combler d'abord. Deux
**contrôles négatifs** fixent désormais le filet lui-même — il mord sur le trou, il ne mord pas sur la
forme ratifiée — et **aucun libellé n'a été réécrit pour faire passer le test** : réécrire la prose
pour verdir un garde-fou échangerait une preuve contre une régression.

## 6. Options écartées

**Garder la généricité « au cas où ».** C'est l'option par défaut, et la plus tentante : le code
marchait. Écartée parce qu'elle confond *option* et *actif* — une indirection sans demandeur n'est pas
une option gratuite, elle est un coût payé à chaque lecture, à chaque test, à chaque modification.

**Un validateur runtime sur la sortie du moteur** (`zod`, `valibot`). Garantie runtime, schéma → types.
Écarté : mauvaise frontière (§4), et poids shippé pour valider ce qu'on construit soi-même.

**Un appareil de versioning et de migrations.** Écarté : producteur et consommateur sont co-buildés.
Un golden de dérive attrape le problème mieux qu'un champ de version, et sans appareil.

**Un type par règle**, plutôt que l'identité de règle comme donnée. Écarté à l'époque — puis rendu sans
objet : il n'y a plus de règles à identifier, il y a des champs nommés.

## 7. Conséquences

**Bonnes.** Le dispatch UI→moteur disparaît — l'UI n'importe plus le moteur. Le re-parsing de clés
disparaît, **et** son `NaN` muet avec lui. Trois appareils disparaissent d'une carte sans qu'un pixel
bouge : une table de mots courts (→ le wording), l'inverse d'une allowlist (→ le moteur nomme), et un
repli défensif (→ le type garantit le nom). Un composant de graphe passe de 257 à 58 lignes : il
n'avait plus aucun monteur, et il était le **dernier lecteur** d'un cadrage nocturne gradué, qui part
donc avec lui — s'il revient : conçu ET rendu.

**Coûts, assumés.** Le verbatim est dupliqué entre constats co-citants. **La généricité est perdue :
ajouter une nature de constat demande d'ajouter un champ ET son lecteur — c'est le but, pas un effet de
bord.** Le plafond de confiance du non-sensible n'est plus tenu par le type mais par une décision de
règle explicite.

**Le filet.** Un golden de rendu de bout en bout — zip → ingestion → règles → rendu, **persona
incluse à dessein** : les zips d'échantillon n'exercent ni les constats sensibles ni les thèmes — à
**diff strictement nul**, à l'exception des lignes de la légende retirée, isolées dans leur propre
commit.
