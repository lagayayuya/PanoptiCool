# Échantillon — export TikTok synthétique

`user_data_tiktok.sample.zip` est un **faux export TikTok 100 % synthétique** (petit
volume), structurellement conforme au contrat `docs/tiktok-export-schema.md`. Aucune
valeur n'est réelle ; aucune ne désigne une personne réelle (voir l'invariant de
privacy dans `CLAUDE.md`).

## Contenu
- `user_data_tiktok.json` — les 10 catégories top-level ; `Watch History` ≈ 300 entrées,
  les autres sections à l'échelle des poids réels (§2). ~64 Ko décompressé.

## Reproduire à l'identique
L'archive est déterministe (graine fixe, date ZIP figée) :

```sh
python -m panopticool -v 300 -s 1337 -o samples/user_data_tiktok.sample.zip
```

## Variantes — golden tests (PANO-28)
Deux entrées **adverses** consommées par les golden tests du moteur (`web/src/engine/golden.test.ts`),
toutes deux synthétiques et déterministes. **Volume 60** (≠ baseline 300) — à respecter pour reproduire
à l'identique :

- `user_data_tiktok.empty.zip` — `Your Activity/Searches` forcée à son **encodage de vide** :
  `SearchList → null` (registre PANO-11, §1.2). Cas conforme (« l'absence comme signal »), doit valider.
- `user_data_tiktok.absent.zip` — la clé `Your Activity/Searches` **entièrement omise** (déviation) :
  le validateur d'ingest doit la rejeter (`stage: validate`), pas planter.

```sh
python -m panopticool -v 60 -s 1337 --empty  'Your Activity/Searches' -o samples/user_data_tiktok.empty.zip
python -m panopticool -v 60 -s 1337 --absent 'Your Activity/Searches' -o samples/user_data_tiktok.absent.zip
```

## Inspecter / valider
```sh
unzip -p samples/user_data_tiktok.sample.zip user_data_tiktok.json | less   # lire le JSON
python -m panopticool.validate samples/user_data_tiktok.sample.zip          # vérifier la conformité
```

Le validateur doit rapporter **CONFORME** (aucun écart).
