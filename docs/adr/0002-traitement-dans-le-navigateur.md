# ADR-0002 : Le traitement vit dans le navigateur — moteur TS en Worker, coquille Astro + îlot

**Statut :** Accepté
**Date :** 2026-06-19
**Décideur :** yuya

## Contexte

L'invariant du produit est que **rien ne quitte l'appareil** : décompression, lecture de l'export et
analyse tournent dans le navigateur. Cet ADR décide **comment** — le modèle d'exécution du moteur, la
coquille qui l'héberge, et les conventions du dépôt.

Deux faits contraignent le moteur, et ils ont été **mesurés, pas supposés** (banc sur fixtures
synthétiques, 1 k → 100 k entrées) :

- **Le facteur limitant est la mémoire, pas la vitesse.** Lire le JSON n'est pas le goulot (27 Mo →
  ~50 ms desktop). Matérialiser le graphe, si : l'export d'un compte réel est écrasé par un tableau
  de visionnage de 10⁴–10⁵ items, et le pic d'allocation qu'il provoque est ce qui tue l'onglet.
- **Un traitement synchrone fige l'UI.** Au-delà de 16 ms, le thread principal saccade. Le Worker
  n'est pas un confort, c'est une conséquence.

## Décision

### Le moteur

1. **TypeScript pur, agnostique du framework**, importable par n'importe quelle coquille.
2. **Exécution en Web Worker.** La chaîne `décompression → lecture → analyse` ne touche jamais le
   thread principal.
3. **Ingestion en flux.** On tokenise l'export en repliant le tableau de visionnage à la volée vers
   ce que les règles lisent réellement (des dates), **sans jamais ériger le graphe géant**. La
   frontière de confiance est préservée : le flux valide par le même contrat que le reste.
   Un plafond anti-archive-pathologique subsiste et se **refuse gracieusement** (`too_large`), distinct
   d'un export corrompu — refuser calmement est un comportement, pas un plantage.
4. **Le Worker ne rend qu'une valeur réduite** — jamais le graphe lu. Le transfert entre Worker et
   page est une copie : y faire passer le graphe doublerait la mémoire qu'on vient d'économiser. Ce
   que le moteur rend est décidé par ADR-0004.

### La coquille et les conventions

5. **Astro, build statique**, servi par Caddy (ADR-0001).
6. **Toute l'app interactive vit dans un unique îlot `client:only`** : une seule frontière client
   nette, où le Worker s'instancie. Pas d'hydratation partielle.
7. **Framework d'îlot : Preact** (`.tsx`) — runtime minuscule (~4 Ko, *on-message* pour un outil qui
   critique le bloat), mental model ubiquitaire, intégration officielle.
8. **Lint et format : Biome.** Binaire unique, rapide, config minimale. Le choix est **couplé à
   celui de l'îlot** : la couverture Biome est native et complète en `.tsx`, mais ne parse pas le
   control-flow de template d'autres frameworks. Preact dénoue ce couplage — un seul outil sur toute
   la surface TS.
9. **TypeScript strict++** : `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`.
   Justifié par le **parsing défensif d'une entrée non fiable** : un accès indexé non garanti est un
   bug réel, le type system doit le forcer.
10. **Un seul package TS** dans `web/`, pas de workspace. Le générateur de fixtures Python vit à la
    racine avec ses propres conventions.
11. **La frontière moteur/UI est une frontière de module, *enforced*, pas un package.** Le moteur vit
    dans `web/src/engine/` et ne dépend d'aucune API DOM ni UI. Double garde-fou : **tsconfig du
    moteur sans `lib: DOM`** (les globals DOM ne typechequent pas), et une règle d'imports restreints
    interdisant l'UI dans `engine/`. Non négociable : une frontière non *enforced* pourrit en silence.
12. **Tests : Vitest**, le poids sur le moteur — goldens consommant les fixtures synthétiques, et les
    modes dégradés du générateur comme **entrées adverses**.
13. **Commits : Conventional Commits**, résumé en français, **+ trailer `Co-Authored-By` sur tout
    commit assisté par IA** — convention de gouvernance, qui prolonge la transparence d'`AI_USAGE.md`.
    Pas de hook d'enforcement : en solo, la convention écrite suffit et un hook serait de la magie.
14. **CI : GitHub Actions** — lint → typecheck → tests → build, **+ smoke Python** (générer une
    fixture, la valider). Souverain (ADR-0001) porte sur l'hébergement de l'app et de la PII, **pas
    sur l'hébergement du code** : le dépôt est sur GitHub pour sa visibilité.

> **Note — la raison qui a fait pencher vers Astro n'est pas exercée.** Astro a été retenu pour son
> contenu pédagogique en SSG zéro-JS (Markdown/MDX, content collections), face à une SPA jugée moins
> alignée parce qu'elle aurait rendu du texte en JS. Ce contenu n'existe pas : zéro content
> collection, zéro `.md`, et les trois pages sont des îlots `client:only`. La décision **est donc
> rouvrable, dans les deux sens** — si le contenu pédagogique arrive, la raison redevient vraie ;
> s'il n'arrive pas, le choix mérite d'être repesé. Ce qui tient aujourd'hui, et qui tient seul :
> build statique + une frontière client unique.

## Options écartées

**WASM (simdjson) pour la lecture.** O(n) très rapide — mais la mesure dit que la vitesse de lecture
n'est pas le facteur limitant, la mémoire l'est. Complexité gratuite.

**Tout charger en mémoire (`JSON.parse` du graphe entier).** Simple, et suffisant tant que l'export
est petit. Écarté par la mesure : le pic d'allocation du graphe est précisément ce qui tue l'onglet
sur un compte réel. Le flux borne l'empreinte quel que soit le volume utile.

**Un monorepo / des workspaces** pour signaler le découplage moteur/UI. Écarté : le monorepo ne se
justifie que par des cycles de vie indépendants (publication, versioning, build séparés), absents
ici. Le signal « découplage » s'obtient à bien moindre coût par une frontière *enforced* (§11), et le
moteur reste extractible plus tard — il n'a aucune dépendance vers la coquille.

**ESLint + Prettier + Svelte.** Couverture lint mature sur plus de formats, et le JS shippé le plus
petit. Écarté : plus de dépendances, plus lent, et contradiction avec « un seul outil » — pour un
gain de poids marginal face à Preact, contre un pari sur une compétence moins ubiquitaire.

**Vanilla TS, sans framework d'îlot.** Dépendances minimales absolues, mais la réactivité du
dashboard repasse à la main : fausse économie pour une surface interactive riche.

## Conséquences

**Ferme :** le SSR et le serveur dynamique ; WASM ; le transfert du graphe hors du Worker ; les
workspaces ; les hooks de commit. On accepte deux paradigmes (`.astro` + `.tsx`) et un lock-in Astro
mince.

**Ouvre :** un moteur portable, donc une coquille remplaçable — le vrai actif est le moteur, et
Astro n'engage que la présentation ; une empreinte mémoire bornée par construction ; un outil de lint
unique sur toute la surface TS ; une CI polyglotte simple.
