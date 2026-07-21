# Détecteur d'intérêts (D2) — taxonomie canonique

> Référence **ratifiée par yuya** (session PANO-74, exécutée PANO-76). Les lots 2–3 exécutent la
> suite **sans re-ratifier** : ils ajoutent des lexiques pour des thèmes déjà listés ici. Toute
> extension hors de cette liste, ou tout thème qui frôle un sujet sensible (D1), **remonte à yuya**
> avant écriture.
>
> Analogue pour D2 de ce que `docs/constats-sensibles.md` est pour D1 : le **sens** (quels thèmes,
> où sont les frontières) vit ici ; la **mécanique** (règle par classement, câblage `Theme[]`) vit
> dans le code (`engine/rules/d2-interests.ts`, socle PANO-75). Le code ne câble que le sous-ensemble
> déjà écrit (`INTEREST_LEXICONS`) ; cette liste est le catalogue complet visé.

## Cadre de sens (ratifié PANO-74, non rouvrable)

- **Granularité — scénario B** : des thèmes d'usage grand public, ni trop fins (pas « squat » comme
  thème) ni trop larges (pas « sport » comme thème unique). ~52 thèmes, groupés en familles.
- **Critère d'inclusion — « valeur démonstrative »** : un thème entre s'il illustre concrètement ce
  qu'une plateforme *pourrait* déduire et *revendre*. On ne vise pas l'exhaustivité d'une taxonomie
  publicitaire ; on vise la démonstration parlante.
- **Frontière sensible tenue** : aucun thème d'intérêt ne recouvre un sujet **sensible** (les 6
  labels D1 : santé mentale, santé physique, sexualité, politique, religion, conflictuel). Les
  intérêts sont **non sensibles** par construction (`sensitive: false`).
- **Exclusions explicites (ratifiées)** : bien-être/développement personnel · régime/nutrition
  (frôle les troubles alimentaires → D1) · actualité/politique (→ D1) · rencontres/dating · astrologie
  appliquée à soi · **jeux d'argent** · alcool. Ces zones ne deviennent JAMAIS des thèmes d'intérêt.

## Catalogue des thèmes (~52)

Groupés en familles (la famille est une commodité de lecture, pas une entité produite — D2 produit
des **thèmes**, pas des familles).

### Sport & activité
muscu · running · football · basket · cyclisme · fitness/cross-training · randonnée · skate ·
sports de combat · danse

### Jeux & tech
jeux vidéo · esport · tech · IA · crypto

### Cuisine & food
cuisine · pâtisserie · cuisine végé/vegan · café

### Beauté & mode
maquillage · skincare · mode · sneakers · coiffure

### Musique
K-pop · rap/hip-hop · musique électro/DJ · guitare/instruments

### Culture & médias
manga & anime · cinéma & séries · lecture · exposition & concert

### Animaux
chiens · chats · lapins

### Créatif & maison
dessin/illustration · photographie · jardinage · DIY/bricolage · tricot/crochet

### Auto/moto & voyage
voitures/tuning · motos · voyage

### Savoirs & disciplines
philosophie · sociologie · psychologie · histoire · économie · biologie · physique · mathématiques ·
astronomie/espace

## Notes de frontière (à porter par les lexiques, lots 2–3)

- **psychologie** → champ **académique** seulement (biais cognitifs, Freud, expériences célèbres…).
  Exclure le **clinique** (dépression, anxiété, thérapie) : c'est `mental_health` (D1). Un lexique
  psychologie qui capte « je fais une dépression » est un bug de frontière → remonter.
- **économie / histoire** → champ **savoir** (concepts, écoles, périodes). Éviter l'**actualité** et
  la **politique** (réforme, élection, tel parti) : c'est `politics` (D1) ou hors-champ.
- **cuisine végé/vegan** → intérêt **culinaire** (recettes, restos), pas **conviction militante** ni
  **régime** : rester sur le plat, pas sur l'éthique ni la perte de poids.
- **sports de combat** → **pratique sportive** (boxe, judo, MMA en tant que discipline), jamais
  l'agression réelle (→ `conflictual`, D1).

## Discipline d'écriture des lexiques (PANO-70 §3, reprise D2)

- **À l'aveugle** : chaque marqueur vient de l'usage courant de la langue (du français à l'origine ;
  les variantes anglaises, annotées `(EN)` en ligne, suivent la même règle), jamais d'un export réel.
  Aucun terme reverse-engineeré depuis une donnée ; aucune donnée ajustée à un terme.
- **Généricité** : chaque terme est défendable pour un inconnu, aurait été écrit à l'identique sans
  avoir jamais vu aucun export.
- **Ancrage contre la polysémie** : un marqueur mot-nu polysémique (football « but », K-pop « bts »,
  sneakers « jordan ») tire à chaque occurrence hors-domaine — le plancher et le classement du socle
  ne rattrapent que le bruit **résiduel**, pas un faux-positif systématique. On **exclut le mot nu à
  l'écriture** et on **ancre** (« air max », « fond de teint »). Chaque lexique documente en tête son
  **sondage faux-positifs** : termes écartés et pourquoi.
- **Frontière sensible dure** : aucun marqueur d'intérêt ne doit déclencher un des 6 lexiques D1. Un
  garde-fou de test (`interests-battery.test.ts`) passe **tous** les marqueurs d'intérêt dans D1 et
  exige zéro détection ; un échec est un signal de frontière à remonter, pas seulement un test rouge.

## Plan de lots — ACHEVÉ

Le plan (lot 1 : ~12 thèmes démonstratifs ; lots 2–3 : le reste) a été exécuté : **les ~52 thèmes
du catalogue sont écrits et câblés**, et les premiers lots ont été rétrofités au standard des
suivants. Ce document reste l'oracle de sens : toute extension passe toujours par lui, et par yuya
si elle sort du catalogue.

Le socle (`InterestLexicon`, règle par classement, câblage `Theme[]`) est en place (PANO-75) et
**n'est pas rouvert** par les lots de contenu.
