# ADR-0001 : Hébergement souverain, sans backend

**Statut :** Accepté
**Date :** 2026-06-19
**Décideur :** yuya

## Contexte

PanoptiCool sert une app statique dont **tout le traitement vit dans le navigateur** (ADR-0002) :
aucune donnée d'export ne touche un serveur, par construction, **quel que soit l'hébergeur**.

C'est le fait structurant de cette décision, et il est contre-intuitif : **l'invariant privacy ne
départage pas les options.** Il est satisfait des trois côtés. Choisir un VPS souverain « pour la
privacy de l'export » ferait payer l'ops d'une machine pour une raison qui ne s'y applique pas.

Ce qui départage réellement :

1. **Éthos.** Outil se sensibilisation sensibilisation aux enjeux de protection des données et de vie privée : le médium fait partie du message. Héberger sur une PaaS US contredit la thèse.
2. **Résidence de la seule PII éventuelle.** Pas l'export : l'e-mail d'un éventuel rappel « ton
   export est prêt » — une plateforme met des jours à le produire (TikTok, jusqu'à ~4). UE et US ne
   sont pas équivalents.
3. **Coût et ops pour un dev solo.** Faible maintenance, magie minimale.

## Décision

1. **Hébergement souverain** sur un petit VPS UE. Pas de PaaS US.
2. **Stack lean : Caddy** (statique + TLS automatique + reverse-proxy), sans orchestrateur.
3. **Tout conteneurisé** (images Docker standard) : la bascule vers une PaaS reste sans douleur —
   assurance-réversibilité.
4. **Aucun backend.** L'écran d'attente propose un rappel **sans serveur** (export `.ics`, rappel
   local). On ne collecte rien — **pas même un e-mail**. C'est une revendication du produit, pas une
   étape vers un backend.

## Options écartées

**Vercel, ou toute PaaS US équivalente.** La plus rapide à shipper, zéro-ops, gratuite à cette
échelle. Écartée pour la contradiction narrative et la résidence US de la PII — et parce que la
sortie serait douloureuse (serverless → stateful, Cron et KV propriétaires) là où le chemin inverse
est cheap. **Cette asymétrie de réversibilité est ce qui justifie de démarrer souverain *et* lean :**
lean → PaaS se fait sur les mêmes primitives ; PaaS US → souverain, non.

**Une PaaS auto-hébergée (Coolify) dès maintenant.** Git-push, rollbacks, dashboard — précieux **à
plusieurs services**. Écartée comme sur-outillée pour la charge réelle : un statique et pas de
backend. Elle ajoute une base à patcher et un control-plane à faire tourner **avant** de rendre
service. Le pas reste cheap le jour où il se justifie (plusieurs services longue-durée, ou un
app-server stateful) : tout est déjà conteneurisé.

## Conséquences

**Ferme :** les conforts managés (preview-deploys, scaling et rollback zéro-ops) ; on prend uptime,
patchs OS et sauvegardes ; un peu de friction contributeur — pas de one-click deploy.

**Ouvre :** résidence UE de la seule PII éventuelle ; cohérence narrative totale ; zéro lock-in ; et,
faute de backend, la revendication *« on ne collecte rien, pas même ton e-mail »*.
