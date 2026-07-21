# PanoptiCool

**Tes exports de données, décodés chez toi.**

*100 % local · sans compte · open source (AGPL-3.0) · interface en français et en anglais*

Chaque plateforme doit te remettre tes données si tu les demandes. Elle t'envoie une archive
illisible, lourde, sans intérêt apparent. PanoptiCool la lit et te permet facilement de consulter
tes données, tout en t'expliquant ce qu'un algorithme pourrait en déduire : tes rythmes, tes
centres d'intérêt, et toutes autres informations que tu ne penses pas laisser.

L'expérience que permet PanoptiCool n'est pas spécialement confortable, elle peut agir comme une
sorte de miroir numérique. Il est important de prendre de la distance en l'utilisant : l'objectif
n'est pas de dresser un verdict froid sur ta personne, mais de faire directement face aux
informations que l'on donne et à ce qui peut en être fait.

> **Tout se passe dans ton navigateur.** Ton export n'est ni envoyé, ni téléversé, ni stocké. Il n'y
> a pas de serveur à qui l'envoyer : le site est un build statique, l'analyse tourne dans un Web
> Worker sur ta machine. Ça ne se promet pas, ça se vérifie — c'est le code que tu lis.

**Aujourd'hui, un seul connecteur : TikTok.** Instagram est d'ores et déjà en cours de
développement. Le moteur est écrit pour que le format d'une plateforme soit une entrée parmi
d'autres, pas le sujet.

---

## Essayer en deux minutes

Le mode démo joue une **persona synthétique** — un faux utilisateur, inventé de toutes pièces — à
travers le moteur réel. C'est le chemin le plus court pour voir ce que fait le produit, et il ne
demande aucun export.

Une fois le site lancé en local (ci-dessous) :

**<http://localhost:4321/fr/analyse?demo>**

Sinon, dépose un `.zip` sur `/fr/analyse` — par exemple `samples/user_data_tiktok.sample.zip`, un
faux export livré avec le dépôt.

## Faire tourner PanoptiCool en local

Il faut **Node 22** (la version sur laquelle tourne la CI ; Vitest 4 exclut Node 23).

Si tu ne l'as pas — ou si tu as une autre version — le plus simple est
[**nvm**](https://github.com/nvm-sh/nvm), qui fait cohabiter plusieurs Node sur une machine :

```sh
nvm install 22 && nvm use 22
```

Sinon, l'installeur officiel de [nodejs.org](https://nodejs.org/) fait l'affaire — prends la
version **22 LTS**, pas la plus récente.

```sh
git clone https://github.com/lagayayuya/PanoptiCool.git
cd PanoptiCool/web
npm install
npm run dev
```

Ouvre **<http://localhost:4321>**. Rien d'autre à installer, aucune clé, aucun compte.

### Les commandes du paquet web

Toutes depuis `web/` :

| Commande | Ce qu'elle fait |
|---|---|
| `npm run dev` | serveur de développement (port 4321) |
| `npm run build` | build statique dans `web/dist/` — les deux langues, plus l'archive du site |
| `npm run test` | la suite Vitest |
| `npm run typecheck` | `astro check` + la passe TS du moteur |
| `npm run lint` | Biome |

### L'analyse par IA locale — optionnelle, et pas incluse

La page de résultats propose une dernière section : faire lire tes commentaires et tes recherches
**bruts** par un modèle de langage. Elle ne marche pas avec le seul `npm install` — il faut faire
tourner un serveur [`llama.cpp`](https://github.com/ggml-org/llama.cpp) **sur ta propre machine**.
La page t'affiche la commande d'installation adaptée à ton OS, et le bouton reste inactif tant que
le serveur ne répond pas.

L'invariant tient là aussi : l'unique destinataire réseau est un serveur qui tourne chez toi, et
rien ne part sans un clic explicite. (Selon ton navigateur, l'accès du site à ce serveur local peut
être bloqué ou soumis à permission — la page te le dit, et le pourquoi est dans
[ADR-0006](docs/adr/0006-acces-au-serveur-local-depuis-un-site-https.md).)

---

## Comment c'est fait

Une coquille **Astro** en build statique, l'interactivité dans des îlots **Preact**, et un moteur
**TypeScript pur** qui tourne dans un **Web Worker**. L'interface et la détection existent en
**français et en anglais**.

Le moteur (`web/src/engine/`) est la pièce sérieuse, et il est tenu à distance de l'interface par
deux garde-fous vérifiés à chaque CI :

- son propre `tsconfig.json`, **sans `lib: DOM`** — `document` et `window` n'y typechequent pas ;
- une règle Biome `noRestrictedImports` qui lui interdit d'importer Preact ou Astro.

Trois idées font le produit, et elles expliquent le code mieux que son arborescence :

- **Le mur sémantique.** Une faible part du volume d'un export est auto-descriptive hors ligne :
  les liens de vidéos sont opaques. Le profil se reconstruit depuis les **recherches, commentaires
  et comptes suivis**, pas depuis les liens. Mais c'est dans le même temps un argument fort : en
  n'interprétant qu'un faible pourcentage de l'export (généralement entre 0 et 5 %), PanoptiCool
  révèle déjà un ensemble d'informations très riche — et cette première version n'exploite pas
  tout le potentiel des exports TikTok.
- **La pédagogie.** La sensibilisation aux enjeux de protection des données passe aussi par leur
  compréhension. PanoptiCool se veut, en parallèle, un outil pour explorer ses données et
  comprendre clairement leur utilisation et le fonctionnement des outils des plateformes. C'est
  aussi l'un des enjeux de l'analyse par IA locale : visualiser la facilité avec laquelle certaines
  inférences peuvent être faites, et comprendre au passage le fonctionnement d'un modèle de type
  LLM.
- **L'accessibilité.** L'un des enjeux principaux de ce projet, et probablement le plus complexe :
  se rendre accessible au plus grand nombre — par l'open source, mais surtout par des réflexions
  centrées sur l'expérience utilisateur. L'expérience est pensée pour être captivante, facile
  d'accès et non bloquante, sans sacrifier la pertinence de l'outil.

### Où regarder

| Chemin | Ce que c'est |
|---|---|
| `web/src/engine/` | le moteur — TS pur, sans DOM, tourne en Worker |
| `web/src/engine/detect/` + `lexicon/` | le cœur : détection des thèmes et des signaux sensibles, et les filtres qui l'empêchent de sur-affirmer |
| `web/src/engine/detect/*-bench.test.ts` | les bancs de voix scellées — la vérité-terrain écrite avant la mesure, et les capteurs qui rougissent |
| `web/src/engine/wording.fr.ts` / `.en.ts` | ce que la machine ose déduire — un fichier de prose par langue, relisible d'une traite |
| `web/src/ui/copy.fr.ts` / `.en.ts` | ce que l'interface dit — le second périmètre ratifiable, même règle |
| `web/src/ui/` | l'interface (îlots Preact) |
| `web/src/demo/` | la persona synthétique du mode démo |
| `docs/adr/` | les décisions structurantes et leurs raisons |
| `docs/tiktok-export-schema.md` | le contrat de structure d'un export TikTok — rétro-conçu, seule source de vérité sur le format |
| `docs/methode-portabilite-en.md` | ce que le passage à l'anglais a appris — la note de méthode |
| `panopticool/` | le générateur de faux exports (Python) — voir plus bas |
| `samples/` | des faux exports prêts à l'emploi |

### Les décisions, et pourquoi

Elles sont datées et figées dans [`docs/adr/`](docs/adr/) — un ADR par décision, avec ce qu'elle a
coûté et ce qui a été écarté :

- [ADR-0001](docs/adr/0001-hebergement-souverain-sans-backend.md) — hébergement souverain, sans backend.
- [ADR-0002](docs/adr/0002-traitement-dans-le-navigateur.md) — le traitement vit dans le navigateur.
- [ADR-0003](docs/adr/0003-doctrine-constats-sensibles.md) — **ce que l'outil ose affirmer, et ce qu'il refuse d'affirmer.** C'est celui qui porte la raison d'être.
- [ADR-0004](docs/adr/0004-moteur-une-valeur-nommee.md) — le moteur rend une valeur nommée.
- [ADR-0005](docs/adr/0005-licence-agpl-v3.md) — le passage en AGPL v3.
- [ADR-0006](docs/adr/0006-acces-au-serveur-local-depuis-un-site-https.md) — l'accès au serveur local depuis un site HTTPS.

Un choix trop petit pour un ADR s'inscrit **inline**, dans le commentaire qui porte la contrainte.

---

## Le générateur de fixture (Python)

Tu peux utiliser cet outil pour fabriquer les faux exports dont le produit a besoin pour être
testé. Il produit un `.zip` contenant un `user_data_tiktok.json` **100 % synthétique** mais
**structurellement identique** à un vrai export, et le valide contre le contrat.

Python ≥ 3.10, **stdlib uniquement**, aucune dépendance. Depuis la racine :

```sh
python -m panopticool                       # out/user_data_tiktok.zip (volume 500)
python -m panopticool -v 50000              # gros volume
python -m panopticool --persona foodie      # identité de démo cohérente
python -m panopticool.validate out/user_data_tiktok.zip
```

Il sait aussi fabriquer des entrées **adverses**, pour que « l'absence comme signal » soit testée et
pas seulement affirmée :

```sh
python -m panopticool --empty  "Your Activity/Searches"   # section vidée (cas conforme)
python -m panopticool --absent "Likes and Favorites/Favorite Sounds"  # clé omise (déviation)
```

Voir [`samples/README.md`](samples/README.md) pour reproduire les archives livrées à l'identique
(elles sont déterministes, bit à bit).

---

## Privacy — l'invariant du dépôt

**Aucun vrai export ne se trouve ici, et aucun n'y entrera.** Toute valeur produite par le générateur
est inventée. C'est la raison d'être de la fixture, et la règle est non négociable — y compris dans les tests.

Le développement, lui, regarde parfois un vrai export — celui du mainteneur, ou d'une personne qui
lui donne son accord explicite — pour diagnostiquer ou calibrer. Il reste sur sa machine, hors du
dépôt. Ce qui a le droit d'en franchir la frontière est une **structure** ou une **statistique** :
le [contrat de structure](docs/tiktok-export-schema.md) en est l'exemple, rétro-conçu d'un export
réel dont toutes les valeurs ont été retirées. Jamais une valeur. Un export contient aussi les
messages de gens qui n'ont rien demandé : c'est cette frontière-là qui les protège, pas notre
ignorance.

## Licence

[AGPL-3.0-only](LICENSE) — voir aussi [`NOTICE`](NOTICE). Le raisonnement (et pourquoi ce dépôt a
quitté MIT) est dans [ADR-0005](docs/adr/0005-licence-agpl-v3.md).

## Contribuer

[`CLAUDE.md`](CLAUDE.md) tient les conventions et les invariants du dépôt — il s'adresse aux agents
IA, mais il décrit les mêmes règles pour tout le monde. [`METHODE.md`](METHODE.md) décrit la méthode
de travail, et [`AI_USAGE.md`](AI_USAGE.md) journalise la collaboration avec l'IA, ratifiée à la main.
