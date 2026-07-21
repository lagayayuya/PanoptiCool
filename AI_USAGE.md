# AI_USAGE — Journal de collaboration avec l'IA

> Transparence sur l'usage de l'IA dans le développement de PanoptiCool.
> Une chronologie de **décisions et d'arbitrages**, la plus récente en haut. Réutilisable (AGPL v3).

Ce projet est développé avec l'assistance d'IA, de façon supervisée et déclarée.
Ce journal incarne le cadre **AI Fluency (4D)** sans le transformer en formulaire :
la section **Fait** recouvre la délégation et la description (ce qui a été confié, décidé, produit) ;
la section **Jugement humain** recouvre le discernement et la diligence (ce qui a été arbitré, et ce
dont je réponds).

**Ce projet s'est construit en explorant.** La structure réelle des exports, la ligne éthique de ce
qu'un outil ose affirmer, la faisabilité technique, l'accessibilité au plus grand nombre, la vision
d'ensemble — chacun de ces axes s'est précisé en avançant, pas avant de commencer. C'est pourquoi
certaines entrées de ce journal en contredisent d'autres plus anciennes : ce ne sont pas des erreurs
corrigées en douce, ce sont les étapes d'une exploration qui a convergé. À l'approche de la première
version publique, j'ai fait le choix de **repartir sur une base plus saine** — les décisions ramenées
à ce qui tient, le moteur ramené à ce qu'il rend vraiment — pour que cette v1 soit la plus accessible
possible. Le journal garde la trace du chemin ; les ADR, eux, ne présentent que la destination.

**Ce journal n'est pas le registre des décisions.** Le *pourquoi* d'une décision structurante vit
dans son ADR (`docs/adr/`), et l'entrée y renvoie sans le recopier. Ce que le journal garde pour lui,
c'est **l'arbitrage** : ce que l'IA a proposé, ce que j'ai validé, contesté ou tranché, ce que l'agent
a tenu ou rattrapé de lui-même. Chaque entrée renvoie aux ADR **actuels** ; quand elle décrit une
machinerie depuis remplacée, elle le dit — non pour exhiber un revirement, mais parce que le chemin
fait partie de ce que ce journal transmet.

Chaque entrée est **ratifiée manuellement** : le factuel peut être rédigé par l'IA, la ligne de
jugement est relue de façon critique et reste sous ma responsabilité. Les transcripts bruts ne sont
pas publiés.

---

## Chronologie

### 2026-07-21 — Préparer la publication : le triage, l'invariant, la recomposition
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Trois opérations pour rendre le dépôt publiable. D'abord le tri de la documentation : quatorze notes de travail (5 600 lignes de propositions déjà arbitrées et implémentées) supprimées, leurs enseignements condensés dans une seule note de méthode (docs/methode-portabilite-en.md) et leurs décisions déplacées dans les fichiers qu'elles concernent. Ensuite un balayage complet du dépôt pour vérifier qu'aucune donnée d'un vrai export (pseudo, identifiant, date, texte) ne s'y trouve. Enfin la réécriture de l'historique git : ~210 commits de travail regroupés en 11 commits thématiques lisibles, avec vérification que le contenu final est identique à l'octet près. Au passage, une branche corrective validée mais jamais fusionnée a été retrouvée et intégrée — le bug qu'elle corrigeait tournait encore en production.
- **Jugement humain :** Le critère de tri : un document qui sert encore (contrat, catalogue, ADR) reste ; un document qui ne fait que raconter un travail terminé est jugé sur ce qu'il apprend à un nouveau lecteur, et part s'il n'apprend rien. 

### 2026-07-18 → 07-20 — Le détecteur de sujets sensibles apprend l'anglais, et se fait mesurer
- **Surface :** Claude Code (sessions concurrentes)
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Les six lexiques sensibles (santé mentale, santé physique, sexualité, politique, religion, agressivité) couvrent désormais l'anglais, un lot par thème, chaque liste de termes proposée puis arbitrée avant d'être écrite. Les filtres qui empêchent le détecteur de sur-affirmer (négation, citation, tierce personne) ont été adaptés à l'anglais, et une mesure faite au passage a révélé puis corrigé un bug français déjà en production : l'outil posait un constat de santé mentale sur un parent qui cherchait des informations pour son enfant. Pour mesurer tout ça, un dispositif nouveau : des textes de personnages fictifs écrits à l'aveugle par d'autres sessions (sans connaître les listes de termes), avec leur verdict attendu figé avant de lancer le détecteur — ce qui a permis de retirer, chiffres à l'appui, plusieurs termes qui taguaient des gens à tort.
- **Jugement humain :** Trois arbitrages structurants. Un : l'anglais ne se traduit pas terme à terme — chaque thème a exigé sa propre règle d'admission, et « je veux mourir » est dans le lexique français quand « i want to die » est exclu de l'anglais, où c'est une expression banale d'embarras. Deux : une règle d'admission apparemment neutre s'est révélée favoriser un camp politique (les mots ordinaires de la gauche et de la droite n'ont pas la même forme grammaticale) — corrigée en admettant les deux mots ordinaires, avec leurs faux positifs assumés. Trois : l'agent a proposé, mesures à l'appui, de retirer le détecteur d'agressivité qui confond moquerie amicale et vraie agression ; refusé — montrer qu'un algorithme se trompe fait partie de la démonstration du produit.

### 2026-07-18 → 07-19 — Tous les textes du produit rassemblés, traduits et vérifiés
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Les ~930 phrases que le produit affiche, jusque-là dispersées dans les composants, sont rassemblées en deux catalogues relisibles d'un bloc : ce que le moteur ose déduire, et ce que l'interface dit. Chaque catalogue existe en français et en anglais, et le build casse si une phrase manque dans une langue. Les nombres, dates et pluriels s'adaptent aussi à la langue. Les cartes sensibles affichent désormais un éventail de lectures possibles (« c'est moi · c'est un proche · simple curiosité ») au lieu d'une phrase qui affirme. Et les tests visuels de référence couvrent enfin le mobile, l'anglais et les pages hors résultats.
- **Jugement humain :** La structure des catalogues a été ratifiée avant de traduire quoi que ce soit — le seul moment où changer de forme ne coûte rien. Règle posée pour les éventails : trois lectures parce qu'il y a trois mécanismes possibles, jamais des degrés d'intensité d'une même lecture — deux textes existants ont été supprimés à ce titre. La traduction anglaise a ses garde-fous automatiques (rien ne part non traduit), mais distinguer une vraie traduction d'un copier-collé reste une relecture humaine, et c'est écrit. 

### 2026-07-18 → 07-20 — Version anglais, l'IA locale s'adapte au navigateur, nouveau design
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Le site existe en deux langues (/fr et /en), avec un garde-fou : impossible de publier une langue incomplète, le build refuse. L'arbre anglais a été posé éteint, puis allumé — traduction des pages, de la persona de démo et du prompt IA comprise. La section IA locale a été refaite pour s'adapter aux différents navigateurs, qui n'autorisent pas tous un site à parler à un serveur sur la machine de l'utilisateur : elle détecte la situation réelle (serveur absent, accès bloqué, permission à donner) et propose plusieurs parcours, dont un pour lancer facilement le serveur en local. Le pourquoi est documenté dans ADR-0006. Enfin, l'interface a été alignée sur la maquette v4 (survols, espacements, cartes cliquables en entier, cadrage des déductions déplacé en introduction de section).
- **Jugement humain :** L'intégralité du contenu traduit a été vérifié et corrigé manuellement. Le fonctionnement de la détection des différents moteurs de recherches et le fonctionnement des commandes affichées afin de lancer le serveur et le modèle d'ia depuis le zip ont été vérifiés manuellement. L'enjeu autour de la section IA n'était pas uniquement de corriger le fait qu'elle ne fonctionnait pas sur certains moteurs de recherche mais d'établir un parcours accessible ET compréhensible pour un utilisateur n'ayant jamais utilisé de terminal. Toujours dans un soucis d'accéssibilité, le design des cartes de la section "02 Déductions par thème" a été largement simplifié.

### 2026-07-17 — Repartir sur une base saine pour la v1 publique
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Mise au propre de tout ce qu'un lecteur découvrira en premier : les décisions d'architecture ramenées à ce qui tient et se comprend seul ([`docs/adr/`](docs/adr/)), CLAUDE.md réécrit pour décrire le dépôt tel qu'il est — l'analyse par IA locale y entrant enfin —, notes de R&D sorties du chemin principal, code mort retiré, renvois morts fermés.
- **Jugement humain :** Choix de Yuya, motivé par l'accessibilité : la première version publique doit se lire sans son histoire derrière elle. Cela suppose d'assumer la réécriture plutôt que d'empiler les correctifs — abandon de la règle « ne pas réécrire une décision figée », qui avait fini par faire réviser un texte par un autre point par point. Deux affirmations devenues fausses corrigées au fond plutôt que recopiées ; une raison de choix constatée non exercée écrite comme note rouvrable plutôt que tue. Le geste n'efface pas les contradictions du parcours : il les range là où elles éclairent, ce journal, pas là où elles embrouillent, la doctrine.

### 2026-07-16 — Refonte A : le moteur rend UNE valeur nommée
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Une architecture générique — union de constats discriminée par nature, identité de règle portée comme donnée, magasin de preuves partagé, catalogue de gabarits, axe de sensibilité gradué — posée en juin, éprouvée, puis ramenée à `analyze() => Analysis` : chaque champ a un lecteur nommé, relevé sur l'écran. −2 344 lignes. Le raisonnement complet, avec les deux états, vit dans [ADR-0004](docs/adr/0004-moteur-une-valeur-nommee.md).
- **Jugement humain :** Le mouvement est l'information, pas l'état final (Yuya) : la généricité n'était pas une faute, c'était un pari sur une variété de constats qui n'est pas venue. Inventaire re-dérivé de l'écran fichier par fichier, pas supposé : pour chaque chose émise, qui la lit — plusieurs champs, personne. Garde-fou tenu avant le retrait : le cadrage supprimé portait une propriété testée (« le sujet est la plateforme ») ; cette preuve a d'abord été **élargie** sur le texte affiché, car la retirer sans contrepartie aurait retiré une preuve, pas du texte mort. Aucun libellé réécrit pour verdir le test. Golden de bout en bout à diff nul, seule exception la légende « solide » retirée, isolée dans son propre commit.

### 2026-07-16 — Licence : renversement MIT → AGPL v3
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Le dépôt passe de MIT à AGPL-3.0-only. Raisonnement dans [ADR-0005](docs/adr/0005-licence-agpl-v3.md) : « réutilisable » ne visait pas la libre récupération mais la **vérifiabilité** ; le copyleft la préserve et ferme l'appropriation silencieuse du moteur en service serveur non distribué — le cas que la GPL simple n'atteint pas.
- **Jugement humain :** Renversement délibéré de Yuya, présenté comme le signal politique qu'il est : le choix de licence *est* un énoncé. L'ADR se refuse à survendre — la portée réelle de l'AGPL ici est étroite et spécifique (l'app statique est déjà couverte par simple distribution), et il le dit plutôt que de le masquer. Relicenciement de son propre code (l'historique ne porte qu'une personne sous deux pseudonymes), sans consentement tiers requis.

### 2026-07-16 — Portabilité anglaise & durcissement du moteur
- **Surface :** Claude Code
- **Mode par défaut :** automatisation
- **Fait :** Variantes anglaises des lexiques (sensibles et intérêts) et des filtres contextuels — négation, citation, troisième personne. Matcher réécrit en une seule passe. Ingestion en flux : l'export est tokenisé en repliant le tableau de visionnage à la volée, sans ériger le graphe géant — désormais le chemin de production, pas une réserve ([ADR-0002](docs/adr/0002-traitement-dans-le-navigateur.md)).
- **Jugement humain :** Surtout de l'exécution : la portabilité anglaise était une dette actée bien plus tôt comme travail post-v1, pas un arbitrage rouvert ici. Le flux confirme par la mesure ce que l'ADR posait : le facteur limitant est la mémoire, pas la vitesse de lecture.

### 2026-07-11 → 07-15 — Analyse par IA locale (llama.cpp)
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Sous les constats déterministes, une voie optionnelle où un modèle de langage **local** lit les commentaires et recherches bruts et infère ce qui n'y est pas écrit. Voie **séparée du moteur à dessein** : le résultat du moteur ne porte que les preuves citées, jamais les textes bruts — la brancher dessus casserait la borne mémoire d'[ADR-0003](docs/adr/0003-doctrine-constats-sensibles.md). Elle repart donc du zip dans son propre worker. Budget de tokens calculé contre le contexte réel du serveur, opt-in par clic, tout en local.
- **Jugement humain :** Backend llama.cpp tranché par Yuya sur benchmark (le playground WebLLM reste l'outil de développement). Wording des prompts laissé en brouillon, porte humaine réservée. L'invariant privacy n'est pas affaibli mais **reformulé** : le seul destinataire réseau possible est le serveur de l'utilisateur sur sa propre machine — localhost ne quitte pas l'appareil. Vérification faite en local contre un vrai export, jamais logué ni écrit dans le dépôt.

### 2026-07-06 → 07-08 — Détecteur de centres d'intérêt D2
- **Surface :** Claude Code
- **Mode par défaut :** automatisation
- **Fait :** Second détecteur à côté du sensible, lexique volontairement plus simple (ni étage de sensibilité, ni éventail, ni atténuation à la troisième personne). Règle par classement retenant les thèmes les plus représentés ; mécanique de co-occurrence. Cinquante-deux thèmes livrés en quatre lots, puis les premiers rétrofités au standard des suivants.
- **Jugement humain :** Deux reprises de méthode tranchées à l'usage. Première livraison trop prudente → règle inversée par Yuya : un mot ambigu n'est plus exclu mais gardé et vérifié par un second mot du même thème dans la phrase, le tri par volume étant fait pour absorber le bruit. Deuxième lot trop générique → recherche web rendue **obligatoire** plutôt que permise, sur un exemple précis du manque. Psychologie tenue au champ strictement académique, hors soin et vécu. L'agent a signalé de lui-même six thèmes restés sous l'objectif, et vérifié qu'aucun mot nouveau ne déclenche le détecteur sensible.

### 2026-07-03 → 07-05 — Brancher le réel sans instrumenter le moteur
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Premier chantier où un vrai export utilisateur entre dans le moteur : second bouton, lecture directe dans le mécanisme existant sans le modifier. Panneau de debug en développement seulement, panneau « Activité » factuel, graphe de rythme calculé depuis les horodatages réels. Plusieurs règles de cette période (compteurs bruts, confirmation publicitaire, identifiants exposés) seront retirées à la refonte A, faute de lecteur.
- **Jugement humain :** Limite posée par Yuya : brancher sans modifier le moteur, corriger seulement si un vrai fichier révèle un problème. Le panneau de debug ré-estime de son côté ce que le moteur a exploité plutôt que d'instrumenter le moteur — prématuré pour un outil temporaire — à condition d'afficher que c'est une approximation, pour qu'elle ne passe pas pour un fait. Trafic réseau inspecté pendant les essais : rien ne sort de l'appareil. L'agent explicite ce qu'il ne peut pas vérifier lui-même — le passage avec un vrai fichier reste au mainteneur, sans qu'aucun contenu n'entre dans la conversation.

### 2026-07-03 → 07-04 — Détecteur de sujets sensibles D1
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Détecteur lexical sur les commentaires, mettant en œuvre la doctrine d'[ADR-0003](docs/adr/0003-doctrine-constats-sensibles.md) : machinerie de correspondance française (négation avec exception de double négation, filtrage des citations, dégradation de la troisième personne), lexique des six labels enrichi tous registres, reconnaissance transverse des auto-désignations. Le test décisif est un vrai export, jamais partagé dans la session.
- **Jugement humain :** Ordre de travail fixé par Yuya : construire le mécanisme d'abord, lexique volontairement réduit, plutôt qu'attendre un lexique complet. Les termes ajoutés à la main par le mainteneur ont été vérifiés empiriquement par l'agent avant d'être committés : deux se sont révélés classer une critique d'idée en agression de personne — montrés en exemples concrets, question posée, retirés sur accord. Insultes les plus dures assumées plutôt qu'omises. Test final sur un vrai export mené par le mainteneur, seul juge de la réussite.

### 2026-07-01 → 07-03 — Refonte de l'affichage par thème
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** L'affichage se réorganise autour du **thème** comme concept de premier ordre — un objet référencé porteur de ses usages, plutôt qu'une étiquette dupliquée sur chaque constat. Page de résultats reconstruite (cartes repliables, résumé de confiance en tête), fixture persona synthétique au nouveau modèle, golden tests de propriété, header d'avertissement persistant.
- **Jugement humain :** Mur sémantique, absences et identifiants exposés gardent une zone séparée, pas dilués dans les thèmes (Yuya) : ils portent un poids propre. Un changement de schéma non-additif limité au seul moteur, l'affichage laissé cassé jusqu'aux sessions prévues pour le remplacer, avec règle explicite de s'arrêter et remonter plutôt que déborder. L'avertissement est un prérequis non négociable, pas un confort. Après une vérification faite contre la *description* du problème et non contre la maquette, exigence que tout contrôle visuel se fasse désormais contre l'image de référence.

### 2026-06-27 → 06-30 — Mode démo & cartes sensibles
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Premier rendu de bout en bout sur une fixture figée 100 % synthétique. Machinerie sensible d'alors — magasin de preuves partagé, axe de sensibilité gradué, flou-au-clic — **depuis remplacée** par la refonte A et par le couple repli + badge d'[ADR-0003](docs/adr/0003-doctrine-constats-sensibles.md). Ce qui survit, ce sont les arbitrages devenus doctrine.
- **Jugement humain :** Trois arbitrages posés ici tiennent encore dans l'ADR : une même preuve doit nourrir deux constats et le **montrer à l'écran** (« aussi exploité par »), la réutilisation visible étant l'argument le plus concret du produit ; l'éventail des lectures reste **à plat, jamais chiffré**, car pondérer reviendrait à classer l'intention ; la santé mentale ne s'affiche jamais sans protection. L'entorse d'alors — le flou nommait quand même le thème, au nom du consentement éclairé — était signalée comme provisoire à réexaminer : elle l'a été, remplacée par repli + badge.

### 2026-06-26 — Doctrine des constats sensibles
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Spike de faisabilité mesurant si un classifieur lexical local lit des labels sensibles sur le texte d'un export, et **où il échoue** : huit personas synthétiques, corpus inventé. Résultat fondateur — le **mur d'opacité** : des phrases dont le sens tient à la tournure, sans mot à repérer, qu'aucun lexique ne rattrapera. Fonde [ADR-0003](docs/adr/0003-doctrine-constats-sensibles.md).
- **Jugement humain :** Session très cadrée, fond tranché à chaque étape par Yuya : contrat de mesure refondé deux fois (vers un affichage à deux niveaux, puis vers trois états de vérité dont « le signal concerne un proche »), corpus jugé trop net (le vrai signal se dit à mots couverts), constat central resserré de huit cas à six. Règle de méthode posée après un écart de l'agent, qui avait committé des personas sensibles avant relecture : présenter, valider, puis committer. Décision de fond : le mur n'est pas un échec à réparer, c'est la démonstration — un outil local ne franchit pas ce qu'une plateforme franchit.

### 2026-06-19 → 06-24 — Construction du moteur générique
- **Surface :** Claude Code
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Le moteur bâti pièce par pièce : fondations `web/`, frontière moteur/UI *enforced*, contrat d'insights typé (l'architecture générique que la refonte A ramènera plus tard à une valeur nommée), parser en flux et validation à l'entrée, harness Web Worker, golden tests, onze règles d'inférence. Les décisions de forme vivent dans [ADR-0002](docs/adr/0002-traitement-dans-le-navigateur.md) et [ADR-0004](docs/adr/0004-moteur-une-valeur-nommee.md).
- **Jugement humain :** Plusieurs arbitrages de cette période survivent au-delà de la machinerie qu'ils gardaient. La frontière moteur/UI, exigée *prouvée par sondes* et non affirmée, a révélé un trou réel avant commit. La validation runtime placée sur la **frontière non fiable** — l'entrée d'une plateforme — jamais sur notre propre sortie : décision antérieure au grand mouvement, qui lui survit intacte. Le garde-fou éthique explicitement **hors du type** : un champ requis garantit la présence d'un cadrage, pas sa justesse. Et un incident d'attribution tenu par l'agent lui-même : du travail d'une session parallèle retrouvé dans le dossier, session stoppée avant tout commit plutôt que de le faire passer pour son livrable.

### 2026-06-19 — Décisions de contrat : stack, schéma, catalogue de règles
- **Surface :** Claude Code (connecté à Linear)
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Journée de décisions fondatrices : hébergement souverain sans backend ([ADR-0001](docs/adr/0001-hebergement-souverain-sans-backend.md)), traitement dans le navigateur et conventions de dev ([ADR-0002](docs/adr/0002-traitement-dans-le-navigateur.md)), puis le catalogue de règles d'inférence et le schéma d'insights qui en découle. Le finding structurant du catalogue : moins de 2 % du volume d'un export est du texte auto-décrit hors-ligne — le reste est opaque, et le résoudre violerait l'invariant privacy.
- **Jugement humain :** Cadre méthodologique imposé en amont par Yuya : challenge obligatoire de la piste retenue, décision réservée à l'humain, ratification explicite avant écriture de l'ADR. Sur l'hébergement, recadrage clé : l'invariant privacy est tenu **par construction quel que soit l'hébergeur**, donc il ne départage pas — l'arbitrage se joue sur l'éthos et la résidence de la seule PII. Sur les règles, cadrage systémique imposé contre le cadrage personnel : « une plateforme peut repérer tes rythmes », jamais « tu es vulnérable à 3 h ». Deux erreurs de modèle introduites par l'IA sur le schéma, corrigées par le mainteneur.

### 2026-06-18 → 06-19 — Amorçage : roadmap, contrat de structure, fixture
- **Surface :** claude.ai + Claude Code (connectés à Linear)
- **Mode par défaut :** augmentation → automatisation
- **Fait :** Cartographie de la roadmap en initiative, projets et issues. Contrat de structure de l'export **rétro-conçu d'un vrai export fourni par le mainteneur, toutes valeurs retirées**, avec ses pièges consignés (deux formats de date, trois encodages du vide, casse par section). Générateur de fixtures synthétiques en Python stdlib, et banc d'essai mesurant le parsing de gros exports.
- **Jugement humain :** Recadrage pour que l'agent ne résolve pas les décisions d'architecture à l'intérieur de la session de cartographie. Règle fondatrice tenue dès ici : **la structure et les statistiques peuvent franchir, jamais une valeur** — le contrat est tiré du réel, ses valeurs déjà retirées. Le banc d'essai a tranché par la mesure une question qui aurait pu rester supposée : le facteur limitant du parsing est la mémoire, pas le CPU, ce qui a fondé le choix du traitement en flux.

<!-- Nouvelles entrées au-dessus de cette ligne, ordre antéchronologique. -->
