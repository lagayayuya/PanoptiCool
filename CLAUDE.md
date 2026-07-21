# CLAUDE.md — PanoptiCool

Conventions et invariants du dépôt. Écrit pour les agents IA ; les règles valent pour tout le monde.
Pour ce qu'est le produit et comment le lancer, voir [`README.md`](README.md) — ce fichier ne le
recopie pas.

## Le produit, en une phrase

PanoptiCool lit l'export de données qu'une plateforme remet à son utilisateur et lui montre ce qu'un
algorithme pourrait en déduire : le propos est une démonstration du système, jamais un verdict sur la
personne. TikTok est le **premier connecteur**, pas le sujet.

**Deux objectifs arbitrent, et ce ne sont pas des finitions** (le README les développe — ici, ce qu'ils
imposent) :

- **Pédagogie.** Le but est que la personne *comprenne* ce qui est déduit et comment. Une déduction
  juste que personne ne comprend a raté sa cible : la clarté fait partie de la fonction, pas de
  l'habillage.
- **Accessibilité.** L'outil vise le plus grand nombre, pas les initiés. Quand une solution technique
  élégante coûte de la clarté au lecteur, elle perd — et le jargon n'est jamais le prix à payer pour
  la justesse.

Ces deux-là se retiennent surtout au moment d'arbitrer : ils tranchent les cas où « c'est correct »
et « c'est compréhensible » ne pointent pas dans la même direction.

## Stack

- **`web/`** — le produit. Astro (build statique) + îlots Preact, moteur **TS pur** dans un Web
  Worker. Biome, Vitest, TS strict++ (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`).
- **`web/src/ai/`** — l'analyse par un modèle **local** (`llama.cpp` chez l'utilisateur) : optionnelle,
  hors `npm install`, inactive tant que le serveur ne répond pas. C'est une voie **séparée du moteur,
  à dessein** — `EngineOutput` ne porte que les preuves citées par un constat (borne mémoire,
  ADR-0003) là où le modèle a besoin des items bruts. Elle repart donc du zip dans son propre worker.
  La brancher sur le moteur « pour simplifier » casserait la borne : ne pas le faire.
- **`panopticool/`** — le générateur de faux exports (fixture). Python ≥ 3.10, **stdlib uniquement**,
  zéro dépendance. Ce n'est pas le produit : c'est son banc d'essai, et la provenance reproductible
  des archives de `samples/`. Modules : `registry` (oracle de forme) → `populators` (+ `personas`,
  `ads_unverified`) → `generator` (rendu + zip streamé) ; `volume` (échelle) ; `validate`
  (conformité au contrat, autonome).

## Invariants non négociables

Toute proposition qui viole l'un de ces points est rejetée d'office.

- **Privacy par architecture.** Traitement 100 % client (navigateur / Web Worker) : **aucune donnée
  d'export ne quitte l'appareil**, et il n'y a pas de serveur à qui l'envoyer — le site est un build
  statique. Le seul destinataire réseau possible est le serveur `llama.cpp` **qui tourne sur la
  machine de l'utilisateur** (analyse IA optionnelle, sur clic explicite) : localhost ne quitte pas
  l'appareil, et l'invariant tient. Vers un tiers, rien, jamais. La confiance se **démontre** (code
  ouvert, traitement visible), elle ne se promet pas.
- **Aucune valeur tirée d'un vrai export n'entre dans ce dépôt** — ni dans le code, ni dans les
  tests, ni dans les fixtures versionnées, ni dans un lexique, ni dans un prompt. **Toute valeur
  émise par le générateur est synthétique** (inventée, sans PII, sans lien avec une personne
  réelle). Ce qui a le droit de franchir, c'est **la structure et les statistiques, jamais une
  valeur** : un schéma, une distribution, un ordre de grandeur — jamais un fragment de texte, un
  pseudo, une date, un identifiant. Le contrat de structure est l'exemple type : tiré du réel,
  *toutes ses valeurs déjà retirées*. Les sorties générées (`out/`) sont synthétiques mais restent
  hors versionnement par hygiène.
- **Regarder est permis ; copier ne l'est pas.** Un vrai export peut nourrir le travail —
  diagnostiquer, cadrer, calibrer — sous **consentement explicite** : celui du mainteneur sur ses
  propres données, ou celui d'une personne qu'il connaît et qui le donne. Il vit hors versionnement
  (`Instagram/`, `out/`) et n'en sort que sous forme de structure ou de statistique. Fermer les yeux
  n'a jamais protégé personne : ce qui protège les tiers présents dans un export sans l'avoir
  demandé — une conversation privée contient les messages de l'autre — c'est que **les valeurs ne
  sortent jamais**. Le consentement ouvre le regard ; il ne desserre rien de la règle du dessus.
- **Inférences sensibles cadrées** comme « ce qu'une plateforme *pourrait* déduire » — systémique,
  jamais un verdict personnel. La doctrine est dans
  [ADR-0003](docs/adr/0003-doctrine-constats-sensibles.md), son catalogue vivant dans
  [`docs/constats-sensibles.md`](docs/constats-sensibles.md).
- **Open source AGPL v3** ([ADR-0005](docs/adr/0005-licence-agpl-v3.md)). Pas de dépendance
  propriétaire bloquante sans justification explicite.

## Le cœur, et ce qu'on n'y touche pas

`web/src/engine/detect/` et `web/src/engine/lexicon/` sont le **noyau mesuré** du produit. Trois
obligations de doctrine y vivent :

1. les **filtres du sensible** (négation, citation, 3ᵉ personne) — ce qui empêche de qualifier
   quelqu'un sur une phrase qui dit le contraire ;
2. l'**ancrage des preuves** — chaque déduction reliée à la miette exacte qui l'a produite ;
3. le **wording en DEUX périmètres ratifiables**, chacun un sélecteur sans prose plus **un fichier
   de prose par langue** — `web/src/engine/wording.fr.ts` / `.en.ts` (ce que la machine ose
   déduire ; sans 2ᵉ personne, par doctrine, dans les deux langues) et `web/src/ui/copy.fr.ts` /
   `.en.ts` (ce que l'interface dit ; le tutoiement est la norme du FR). Le contrôle humain sur ce
   que le produit ose dire tient à ce qu'on puisse tout relire d'une traite, **une langue à la
   fois**. Ne pas les éparpiller, ne pas les fusionner : la propriété (a) de `wording.test.ts`
   balaie les deux langues, et la parité FR↔EN est tenue par le compilateur (`wording-parity`,
   `copy-parity` — l'annoter en `Record<string, string>` la décrocherait en silence).

Se tromper de cible ici, c'est risquer de nommer quelqu'un « dépressif » à tort. **Tout changement de
comportement s'y prouve par un golden à diff nul, jamais par « les tests passent ».**

Quatre goldens de bout en bout s'en chargent, et il faut savoir lequel voit quoi :

- `web/src/ui/v2/render-golden.test.ts` — le sous-arbre `ResultsView`, **en desktop et en français
  uniquement**. Il inclut la persona de démo **à dessein** : les archives de `samples/` n'exercent
  ni la détection de thèmes ni celle des signaux sensibles (0 preuve, 0 thème : mesuré). Ses
  variantes `render-golden-mobile` et `render-golden-en` couvrent ce que cette frontière exclut —
  chacune la sienne, jamais plus.
- `web/src/ui/v2/ui-golden.test.ts` — accueil, parcours d'analyse, section IA, barre et pied de
  page, variantes mobiles comprises. Ajouté parce que le premier ne les rendait pas.

Chacun **déclare sa frontière dans son en-tête** ; la règle qui l'impose est ci-dessous.

## Ce qu'un filet prouve

Un mécanisme de preuve — golden, témoin, banc, mesure — **déclare dans son propre fichier ce qu'il NE
couvre pas**. Pas en annexe : dans son en-tête, là où le lit quiconque s'apprête à le citer.

La raison est un motif observé **sept fois** dans ce dépôt, jamais par malveillance : un filet est écrit
sur des cas TYPIQUES, puis cité comme s'il couvrait le domaine. L'écart est invisible, parce que ce
qui manque au filet manque aussi au raisonnement de qui l'invoque. « Mesuré » devient alors un mot
qui clôt la discussion sans l'avoir ouverte.

Une garantie qui énonce sa frontière ne peut plus être sur-citée : le lecteur suivant voit d'un coup
d'œil si son cas tombe dedans ou dehors.

**Une assertion négative vérifie ce qu'elle ATTEINT, pas ce qu'elle affirme.** C'est la forme la plus
coûteuse du motif, parce qu'elle passe au vert pour une raison qui n'est pas la sienne. Le cas
d'école du dépôt : un test affirmait que `health_physical` n'avait aucune couverture anglaise, et il
passait — mais le terme EN matchait bel et bien (par tolérance de pluriel), et l'unique item était
simplement resté sous le SEUIL de répétition. Le test mesurait le seuil et disait « couverture » ;
les deux ont coïncidé jusqu'au jour où une autre règle a retiré l'écran.

Deux gestes en découlent, et ils ne coûtent rien à l'écriture :

- devant un `expect(...).toBeNull()` ou un `toHaveLength(0)`, se demander **par quel chemin** le zéro
  arrive, et vérifier que c'est celui qu'on croit — un zéro a souvent plusieurs causes possibles, et
  le test n'en distingue aucune ;
- une couverture se vérifie **dans les deux sens**. « Chaque câblage a son texte » et « chaque texte
  est câblé » sont deux propriétés distinctes : n'en tenir qu'une est ce qui a laissé trois lectures
  ratifiées vivre sans lecteur, invisibles aux deux filets en place.

**Un témoin se vérifie par MUTATION, jamais par relecture.** Un filet vide et un filet qui tient ont
exactement la même apparence au vert. La seule vérification qui les distingue est de **casser
délibérément ce qu'il surveille et de constater qu'il rougit**, puis de rétablir. Ce qui se consigne
dans le fichier est la mutation **passée** et ce qu'elle a **fait** — jamais ce qu'on croit qu'elle
ferait.

Trois instances en deux fichiers, toutes trouvées en passant la mutation, **aucune en relisant** :

- un témoin d'exclusion qui ajoutait le terme exclu au **texte** au lieu de muter le **lexique** — un
  terme exclu n'étant dans aucune liste, il ne pouvait rien changer par construction ;
- des cadres d'auto-déclaration n'écrivant que « i am », si bien qu'une tête « im » laissait le bloc
  vert — dix lignes sous un aveu identique du lot précédent ;
- une sonde « aucune auto-déclaration anglaise ne nomme » interrogeant un terme qui n'était dans
  aucun tier (lot `religion`).

Corollaire : **une mutation dont le résultat n'est pas celui qu'on avait prévu est le cas le plus
utile.** Son résultat réel se publie, y compris quand il établit que la mutation ne prouve pas ce
qu'on lui demandait — c'est ce qu'a fait la mutation 4 de la porte de langue.

## Le contrat de structure

La **seule** source de vérité sur le format d'un export TikTok est
[`docs/tiktok-export-schema.md`](docs/tiktok-export-schema.md) : les 10 catégories top-level, les
conteneurs, les clés de liste, la casse des clés d'item, les 3 encodages du vide (`null` / `[]` /
`{}`) et les pièges de fidélité.

**On n'invente aucun champ ni catégorie hors de ce contrat.** Toute structure produite par le code
doit pouvoir se justifier par une ligne de ce document. C'est une spec rétro-conçue d'un format
externe : elle ne se réécrit pas, et son numérotage (`§x.y`) est son adressage — les renvois
`contrat §x.y` du code sont corrects et utiles.

## Conventions

- **Docs et commentaires en français**, code et identifiants en anglais.
- **Le registre (`panopticool/registry.py`) est l'oracle structurel.** Il décrit la forme ; il ne
  fabrique pas de données. La population (valeurs synthétiques) est tenue à part, dans des
  *populators* enfichables.
- **Un artefact a UNE maison.** Les autres surfaces y renvoient sans le recopier. Une décision vit
  dans un ADR (`docs/adr/`) ; un choix trop petit pour un ADR s'inscrit **inline**, dans le
  commentaire qui porte la contrainte (cf. la règle plus bas) ; le format dans le contrat. Recopier,
  c'est fabriquer une divergence à retardement.
- **Un renvoi doit survivre.** Citer un numéro d'ADR (stable) plutôt qu'un `§` d'un document qui se
  réécrit. Exception : le contrat de structure ci-dessus, dont les `§` sont l'adressage.
- **Un commentaire ne parle jamais au présent d'un fichier voisin.** « X reste sur /temp », « cf. Y
  qui porte la distinction » : ces phrases deviennent fausses le jour où X ou Y bouge, sans que rien
  ne le signale — et un lecteur ne peut pas distinguer un renvoi mort d'un renvoi qu'il n'a pas
  compris. Un commentaire dit une **contrainte que le code ne peut pas montrer**. Si le passé
  explique une contrainte encore vivante, le dire au passé (« remplace Y », « ex-Y ») reste honnête :
  ça survit à la disparition de Y. La provenance pour la provenance (« promu du spike X ») n'apprend
  rien et meurt avec X — si elle mérite d'être gardée, sa maison est un ADR.
- **Pas de code qui tourne pour personne.** Une fonction sans monteur est morte, même belle. Si une
  idée revient, elle reviendra conçue et rendue.
- **Commit après chaque unité logique**, messages en style `type: résumé`. **Jamais de `git push`**
  sans demande explicite.
- **Les décisions sont celles du mainteneur.** L'agent challenge, propose options et tradeoffs, ne
  valide pas par défaut, et n'écrit rien de structurant sans accord explicite.
- **Vérifier l'état git réel** avant toute affirmation sur les commits ou le suivi des fichiers.
- Le journal de collaboration IA est tenu dans `AI_USAGE.md` (ratifié à la main) ; la méthode de
  travail dans [`METHODE.md`](METHODE.md).

## Vérifier

Ce que la CI exige, depuis `web/` — les quatre doivent passer :

```sh
npm run lint && npm run typecheck && npm run test && npm run build
```

Et depuis la racine, le smoke du générateur :

```sh
python -m panopticool -o /tmp/ci.zip && python -m panopticool.validate /tmp/ci.zip
```

**Ne jamais restreindre le périmètre du lint ou du typecheck pour faire passer la CI.** Une CI verte
qui a rétréci son périmètre ne prouve rien — c'est un mensonge qui coûte plus cher que le rouge.
