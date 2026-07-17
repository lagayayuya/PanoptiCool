# ADR-0005 : Licence — AGPL v3 (renversement de MIT)

**Statut :** Accepté
**Date :** 2026-07-16
**Décideur :** yuya

## Contexte

Le dépôt était sous licence MIT depuis son ouverture. PanoptiCool est un outil qui existe pour
**démontrer, par son propre fonctionnement, l'asymétrie de pouvoir** entre une plateforme qui profile
ses utilisateurs et un outil honnête qui montre ce que « si peu de données » permet déjà de déduire
(ADR-0003). Cette décision fait passer le dépôt en **AGPL v3**.

Droits propres : l'historique ne contient que deux identités, qui sont la **même personne** sous deux
pseudonymes successifs. Il ne s'agit donc pas d'une cession de droits tiers — l'auteur relicencie son
propre code, sans consentement externe requis.

## Pourquoi la raison d'origine du MIT ne tient plus

Le MIT était justifié par « public, réutilisable », « dépôt pensé comme référence ». Le copyleft de
l'AGPL **réduit délibérément** cette réutilisabilité au sens permissif du terme — en apparence, un
renversement de la raison d'être du choix initial.

Mais « réutilisable » ne visait pas la libre récupération : il visait la **vérifiabilité**.
PanoptiCool ne vaut que si n'importe qui peut auditer que rien ne quitte l'appareil de l'utilisateur —
c'est l'invariant non négociable du projet : *la confiance se démontre, elle ne se promet pas*. Cette
vérifiabilité-là, le MIT la permettait déjà. Mais il permettait *aussi* autre chose que la raison
d'origine n'anticipait pas : qu'une entreprise récupère silencieusement le moteur — lexiques, règles,
détection — pour profiler des gens à leur insu, précisément le geste que l'outil dénonce. **Le MIT ne
distinguait pas ces deux usages.**

L'AGPL les distingue. Elle **préserve** la vérifiabilité (le code source reste disponible à quiconque
veut l'auditer) et **ferme** l'appropriation silencieuse (toute réutilisation, y compris en service
réseau, doit rester source-disponible sous la même licence). Le renversement n'est donc pas un abandon
de la raison d'origine — c'est une **clarification** de ce qu'elle voulait dire depuis le début, une
fois le risque concret identifié.

## Pourquoi AGPL et pas GPL, honnêtement

Il faut être précis sur ce que l'AGPL apporte réellement ici, pour ne pas survendre l'outil.

**Pour l'application elle-même, l'obligation réseau de l'AGPL est largement inerte.** PanoptiCool est
100 % client : tout le traitement tourne dans le navigateur (ADR-0001/0002), rien ne transite par un
serveur applicatif. Servir le JS, le HTML et le CSS de cette app **constitue déjà une distribution** au
sens ordinaire du droit d'auteur — la GPL simple obligerait déjà quiconque le fait à publier ses
modifications. L'AGPL n'ajoute rien de spécifique à *cette* surface.

**Ce que l'AGPL atteint, et que la GPL n'atteint pas :** le cas où quelqu'un prend le moteur — lexiques,
règles de détection, logique d'inférence — et le fait tourner **côté serveur**, comme service de
profilage exposé à des utilisateurs, sans jamais *distribuer* de binaire ni de code, donc sans jamais
déclencher l'obligation de la GPL simple. C'est un SaaS de profilage bâti sur le moteur de
PanoptiCool, gardé privé indéfiniment. C'est précisément la réappropriation contre laquelle ce projet
existe : un tiers qui utilise l'outil démontrant l'asymétrie pour *devenir* un acteur de cette
asymétrie. L'obligation réseau de l'AGPL ferme ce cas précis, en imposant d'offrir le code source
correspondant à quiconque interagit avec le service.

Un ADR qui prétendrait que l'AGPL protège beaucoup plus que ça — ou qu'elle protège l'app statique
elle-même d'une manière que la GPL ne ferait pas — survendrait l'outil. **La portée réelle de l'AGPL
ici est étroite et spécifique**, mais elle correspond exactement au risque identifié.

## Décision

1. **Licence du dépôt : AGPL-3.0-only**, remplaçant le MIT.
2. **`LICENSE`** contient le texte officiel de l'AGPL v3, copié tel quel — aucune substitution de nom
   dans le corps du texte.
3. **Notice de copyright séparée** (`NOTICE`).
4. **Mention de licence** portée là où elle est lue : la face publique du dépôt et le manifeste du
   package web.

## Options écartées

**Rester en MIT.** Écarté : il ne distingue pas l'audit de l'appropriation (§ ci-dessus).

**GPL v3.** Écarté : elle couvre la distribution, mais laisse ouvert exactement le cas qui compte ici —
le moteur détourné en service serveur, jamais distribué.

## Conséquences

**Ferme :** la réutilisation permissive façon MIT — fork silencieux, intégration propriétaire sans
obligation de retour ; l'ambiguïté sur ce qui arrive à un moteur détourné en service.

**Ouvre :** toute réutilisation, y compris en service réseau, reste vérifiable et source-disponible
sous la même licence — cohérent avec l'invariant privacy-par-transparence du projet ; et un signal
politique explicite, car **le choix de licence *est* un énoncé**, pas seulement une formalité
juridique.

**Coûte :** un contributeur ou intégrateur potentiel qui voulait un usage permissif — SaaS privé,
intégration propriétaire — en est dissuadé. C'est le point, pas un effet de bord regretté.
