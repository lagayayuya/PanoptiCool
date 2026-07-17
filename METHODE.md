# Méthode de collaboration avec l'IA — PanoptiCool

> Comment je travaille avec l'IA sur ce projet. Fondé sur le cadre AI Fluency (4D).
> Le **cadre projet** (invariants, conventions, ce qu'on ne touche pas) vit dans `CLAUDE.md`, et ce
> qu'est le produit dans `README.md` — ce fichier n'y touche pas, il ne traite que la méthode.

---

## Principe directeur

Les prompts de pilotage sont conservés et destinés à être publics. Retourne la contrainte en
avantage : **écris chaque prompt comme si un évaluateur le lisait** — ça force la clarté, donc de
meilleures sorties. Calibre l'effort : exigeant sur ce qui compte, pragmatique sur le dev courant.
Ne fais pas de « corrige cette typo » un monument, ou tu lâcheras la discipline.

### ⛔ Ligne rouge
**Jamais de données réelles dans un prompt** (export, e-mail, IP…). La raison est celle du principe
ci-dessus, et elle n'appartient qu'à lui : **ces prompts sont publics**. Un prompt public contenant
ça = une fuite commise par le projet anti-surveillance lui-même. Pour tout exemple : **persona
synthétique uniquement.**

Ce n'est **pas** « ne regarde pas ». Un vrai export peut nourrir une session sous consentement
explicite — `CLAUDE.md` tient cette règle-là. Les deux se rejoignent sur la sortie, pas sur
l'entrée : ce qui est publié ne contient jamais une valeur réelle.

---

## Les 4D, en habitudes concrètes

**Delegation — avant d'écrire.** Ouvre par un contrat d'une ligne : *objectif · périmètre (in/out)
· mode (augmentation / automatisation)*. Décide ce qui reste humain : jugements d'architecture, de
cadrage, d'éthique. Si tu ne sais pas formuler le périmètre, tu n'es pas prêt à déléguer.

**Description — pendant.** Le cadre se charge une fois (via `CLAUDE.md`), pas en le
réexpliquant. Une demande par prompt quand c'est possible. Sépare *penser* et *instruire*.

**Discernment — à chaque sortie.** Jamais d'acceptation sans revue. Définis les **critères
d'acceptation avant** de générer, pour juger sur des critères et non au feeling. Un plan bien
formaté n'est pas un plan correct.

**Diligence — en clôture.** Entrée `AI_USAGE.md` rédigée par l'agent et **visée d'un œil critique
par toi** : coupe l'auto-complaisance, le skill a tendance à te décrire plus perspicace que tu ne
l'as été. Ce que l'IA produit en ton nom est à toi : tu en réponds.

---

## Capture en cours de session — classer avant de noter

Un bug rencontré, une découverte, une piste : ne casse pas ton focus pour ouvrir une issue, et ne
les laisse pas filer. Le geste de discipline n'est pas « noter », c'est **classer**, sinon tout
finit en vrac dans le backlog. Quatre natures, quatre foyers :

- **Bug** → issue dédiée, reproductible (ce qui casse, comment le reproduire). Priorité selon
  l'impact ; ne bloque pas le flow en cours sauf si critique.
- **Dette technique** (raccourci assumé dans du code existant) → issue de suivi rattachée à l'issue
  d'origine, priorité basse.
- **Apprentissage / contrainte** (un fait découvert qui doit guider une décision future) →
  commentaire sur la porte de décision ou l'issue concernée. Pas une tâche : une matière.
- **Périmètre différé** (« j'ai choisi de ne pas faire X pour l'instant ») → à inscrire comme
  décision, pas comme dette à éponger.

Confondre ces natures gonfle le backlog de choses qui ne sont pas du travail et noie les vraies
décisions sous des tickets. En cours de session : un agent qui croise l'un de ces cas le **signale
et propose la nature**, sans agir ; le tri et l'écriture se font à la clôture, sous ton GO.

---

## Hygiène de session & de contexte

**Déclencheurs de fork :** changement de domaine (planif → code → design) ; contexte saturé de
détails périmés ; le modèle répète, oublie une contrainte, ou tourne en rond ; une unité de
travail cohérente est terminée.

**La règle qui rend le fork gratuit :** n'utilise jamais la conversation comme mémoire. Externalise
l'état (décisions, fils ouverts, captures classées) dans les fichiers / Linear en clôture. Une
session fraîche recharge depuis les fichiers, pas depuis l'historique. Sessions **courtes et
ciblées** > marathon.

---

## Pièges personnels

- **Fondateur solo = bus factor de 1.** Ne laisse pas l'agent être le seul à comprendre le code.
  Reconstruis périodiquement le modèle mental toi-même.
- **Validation trop rapide.** Une sortie bien présentée invite à tamponner. Le moment où l'agent
  est le plus convaincant est celui où il faut ralentir — surtout sur les portes de décision.

---

## Lignes rouges

- Données réelles dans un prompt → **jamais**.
- Accepter une sortie parce qu'elle est bien présentée → **jamais**.
- Laisser l'agent muter/supprimer en masse l'existant Linear sans ton GO → **jamais**.

---

## Le rituel de session (l'ossature)

1. **Ouvrir** — contrat d'une ligne : objectif · périmètre · mode. (Le cadre projet est chargé
   depuis `CLAUDE.md`, pas recollé.)
2. **Travailler** — boucle *Description → Discernment* : critères d'abord, génération, revue,
   correction. Les bugs/découvertes sont **signalés et classés** au fil de l'eau, pas traités.
3. **Clôturer** — externaliser l'état · écrire les captures classées (bug / dette / apprentissage /
   périmètre) · entrée `AI_USAGE.md` visée · décider : continuer ou forker.
