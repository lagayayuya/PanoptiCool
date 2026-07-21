# ADR-0006 : L'accès au serveur local depuis un site HTTPS dépend du navigateur, pas de nous

**Statut :** Accepté
**Date :** 2026-07-19
**Décideur :** yuya

## Contexte

L'analyse IA locale (ADR-0002 pour le cadre, `web/src/ai/`) demande au navigateur de joindre
`http://localhost:8080`, le serveur `llama.cpp` que la personne fait tourner chez elle. La page, elle,
est servie en HTTPS depuis `panopti.cool` (ADR-0001).

Cette combinaison — origine publique en HTTPS, destinataire en clair sur la boucle locale — est
exactement celle que les navigateurs ont passé dix ans à restreindre. **La fonctionnalité marchait en
développement et échouait en production, et rien dans le code n'expliquait la différence** : en
développement la page est servie depuis `localhost`, donc l'origine ET la cible sont sur la boucle
locale, cas que tous les moteurs exemptent.

Le diagnostic a coûté cher, pour une raison qui mérite d'être consignée : **le blocage se présente
sous une bannière qui désigne un autre mécanisme.** Les deux moteurs mentent différemment, et les
messages verbatim ci-dessous sont le moyen le plus rapide, pour la prochaine personne, de savoir
devant quel mur elle se trouve.

### Chromium (mesuré sur Brave 1.92, `panopti.cool`, 2026-07-19)

```
Access to fetch at 'http://localhost:8080/v1/models' from origin 'https://panopti.cool'
has been blocked by CORS policy: Permission was denied for this request to access the
`loopback` address space.
```

**« blocked by CORS policy » est une fausse piste.** Le serveur `llama.cpp` répond parfaitement au
CORS — vérifié en `curl`, hors navigateur : il reflète l'`Origin` reçue et répond au préflight
`OPTIONS` avec `Allow-Methods: GET, POST` et `Allow-Headers: *`, sans aucun réglage. Le mécanisme
réel est **Local Network Access** (LNA), une **permission** livrée dans Chrome 142 et adoptée par
Brave en 1.88.127. Chromium range ses échecs LNA sous la bannière CORS ; cette phrase a coûté une
hypothèse entière au diagnostic.

Déclarer l'espace d'adressage visé ne change rien, et le navigateur le dit lui-même :

```
Access to fetch at 'http://localhost:8080/v1/models' from origin 'https://panopti.cool'
has been blocked by CORS policy: Request had a target IP address space of `local` yet the
resource is in address space `loopback`.
```

Le premier message corrige la constante (`loopback`, pas `local`) ; avec la bonne, le refus revient à
l'identique, sur la permission. **Les deux messages diffèrent, et c'est ce qui permet d'attribuer
l'échec à la permission plutôt que de le supposer.**

### WebKit / Safari (mécanisme vérifié en source, échec rapporté par le mainteneur)

```
Not allowed to request resource
Fetch API cannot load http://localhost:8080/v1/models due to access control checks.
```

**« access control checks » est la même fausse piste, sous une autre forme.** Les deux lignes sont un
SEUL événement : `CachedResourceLoader::requestResource` construit une `ResourceError` de type
`AccessControl`, dont le rendu console parle de contrôle d'accès — alors que la condition qui a
échoué est le **contenu mixte**. WebKit ne dispense PAS la boucle locale du blocage de contenu mixte :
`MixedContentChecker` n'a qu'une dérogation, codée en dur pour un domaine tiers, et l'existence même
de cette dérogation prouve la règle. Le bogue WebKit qui lèverait la restriction est ouvert **depuis
2017**, sans activité depuis 2023.

Conséquence : **Safari n'a aucune permission à accorder.** Ni réglage par site, ni entrée de menu
Développement (« Disable Cross-Origin Restrictions » porte sur le CORS, pas sur le contenu mixte).
L'absence d'interface dans la barre d'adresse est le comportement attendu, pas une anomalie.

Les deux murs sont donc **de natures différentes** — une permission qu'on peut accorder d'un côté,
une règle sans dérogation de l'autre — et une interface qui les confondrait enverrait un utilisateur
Safari chercher un réglage qui n'existe pas.

## Décision

1. **On ne contourne rien.** Aucun correctif n'existe côté site, et aucun n'est cherché.
2. **L'interface DISTINGUE « bloqué » de « absent »**, par la permission (`navigator.permissions`,
   `web/src/ai/local-network.ts`), qui se lit sans émettre de requête. C'est le seul angle par lequel
   un script obtient cette information.
3. **L'interface INSTRUIT le déblocage plutôt que d'attendre une fenêtre.** Sur Chromium la
   permission reste indéfiniment à `prompt` sans qu'aucune fenêtre ne s'ouvre — mesuré, y compris
   derrière un vrai clic (bogue Brave `brave-browser#53727`, ouvert). `prompt` et `denied` sont donc
   traités **identiquement** : du point de vue de la personne devant l'écran, une fenêtre qui ne
   s'ouvre jamais est un blocage.
4. **Quand on ne sait pas, on le dit.** Un navigateur dont on ne peut pas lire la permission tombe
   dans un état `unknown` où l'interface **ne nomme aucune cause** — elle ne peut pas distinguer un
   serveur éteint d'un mur — et propose les issues dans l'ordre de ce qu'elles coûtent : changer de
   navigateur d'abord, servir le site en local ensuite. Une instruction fausse coûte plus cher
   qu'une instruction vague, et envoyer quelqu'un chercher un cadenas que Safari n'a pas est une
   instruction fausse.
5. **Le repli universel est de servir le site depuis `localhost`.** Une page dont l'initiateur est
   déjà sur la boucle locale est exemptée **dans les trois moteurs** : plus de contenu mixte (les
   deux bouts sont en clair), plus de porte LNA (`loopback → *` n'est pas une requête de réseau
   local, par définition de la spécification). Ce n'est pas un contournement, c'est la suppression du
   problème — et c'est la réponse architecturalement honnête à « cet outil tourne sur ta machine ».
   `http://localhost` **reste un contexte sécurisé** : le Worker du moteur et les API de crypto
   continuent de fonctionner.

**ADR-0001 est intact.** Tout ceci est du code client et de la documentation ; aucune surface de
déploiement n'est touchée, et la propriété « statique réversible » n'est pas entamée.

## Options écartées, AVEC leurs raisons

Une impasse consignée sans sa raison est une impasse qu'on réexplore.

**TLS sur `llama-server` (`--ssl-key-file` / `--ssl-cert-file`), en général.** Écarté parce que le
gain **dépend du moteur, et vaut zéro là où le problème a été mesuré**. LNA est défini sur l'espace
d'adressage **sans référence au schéma** : `https://localhost` reste `loopback`, donc la permission
Chromium s'applique identiquement. Accorder la permission dispense d'ailleurs déjà du contenu mixte —
le TLS est donc redondant avec le correctif, et inutile sans lui.
*Nuance honnête :* sur Safari, dont le mur EST le contenu mixte, le TLS devrait fonctionner. Écarté
quand même : il exige un certificat approuvé dans le trousseau (un auto-signé échoue silencieusement
pour une sous-ressource), soit une décision de confiance qu'un outil de sensibilisation à la vie
privée ne peut pas demander à la légère — et l'accessibilité (CLAUDE.md) l'interdit comme voie
principale. Le repli `localhost` obtient le même résultat sans certificat, et vaut pour tous les
moteurs.

**Un en-tête de réponse côté serveur.** Écarté : il n'existe pas. `Access-Control-Allow-Private-Network`
appartenait à Private Network Access, **suspendu en 2024** ; le mot n'apparaît nulle part dans la
spécification LNA, qui remplace le préflight par une permission. `llama-server` ne l'envoie pas et
n'a aucun réglage pour le faire — vérifié en source. Aucun en-tête ne peut accorder une permission.

**L'option `targetAddressSpace` de `fetch`.** Écarté **par mesure** : avec la bonne constante
(`loopback`), Brave refuse toujours sur la permission. La spécification est explicite — cette option
ne dispense que du contrôle de contenu mixte, jamais de la permission.

**Les drapeaux `--cors-*` de `llama-server`.** Écarté : sans objet. Le CORS n'a jamais été le
problème (mesuré en `curl`), et ces drapeaux ne touchent pas aux en-têtes en cause.

**Sonder le serveur au chargement de la page pour « déclencher la permission plus tôt ».** Écarté sur
deux motifs. La fenêtre ne s'ouvre pas (point 3), donc le gain est nul ; et un outil qui montre la
surveillance ne contacte pas une machine sans qu'on le lui demande. Le report du premier contact à un
clic explicite est **conservé** — il reste juste sur ses propres termes, et c'est à cet endroit que
l'interface place désormais l'instruction que le navigateur ne donne pas.

**Installer le site en application web (PWA).** Écarté, et la raison vaut d'être retenue parce que la
question se repose naturellement. Une PWA installée depuis Safari **tourne dans WebKit** ; sur iOS,
tout navigateur est WebKit quel qu'il soit. Même moteur, même règle de contenu mixte : l'installation
ne change pas la politique, elle change l'habillage.

Plus fondamentalement, **le blocage naît de l'ÉCART entre l'origine `https://panopti.cool` et la
cible `http://localhost`.** Tant que la page vient d'un domaine distant, l'écart existe, et aucune
manière de l'installer, de l'épingler ou de la mettre en plein écran ne le referme. La seule chose
qui le supprime est que **la page elle-même soit servie depuis `localhost`** — ce que fait le repli
ci-dessus, et c'est précisément pourquoi il marche partout.

**Un proxy, un relais, ou un point d'accès hébergé.** Écarté d'office : les items de l'export
partiraient vers un tiers. L'invariant de CLAUDE.md n'est pas négociable, et aucune commodité de
transport ne l'ouvre.

## Ce que le diagnostic a fait croire à tort

Consigné parce que ces erreurs sont **reproductibles par la lecture des mêmes indices**, et qu'un
lecteur qui les refait perdra le même temps.

- **`Access-Control-Allow-Private-Network` absent des réponses de `llama-server`** a été pris pour la
  cause. C'en était une observation exacte et une conclusion fausse : l'en-tête appartient à une
  spécification suspendue et ne joue plus aucun rôle. C'est la faute que CLAUDE.md nomme — **une
  assertion négative vérifie ce qu'elle ATTEINT, pas ce qu'elle affirme** : l'absence était réelle,
  sa signification supposée.
- **Un premier essai en Chromium/Electron a réussi**, ce qui a fait conclure trop vite que le
  transport était sain. Electron n'applique pas LNA. Un banc qui ne reproduit pas l'environnement de
  la personne ne prouve rien sur son cas — et c'est ce résultat vert qui a failli faire livrer un
  discriminant (`mode: 'no-cors'`) qui échoue précisément sur le navigateur concerné.
- **Le CORS a été suspecté deux fois**, une fois par hypothèse et une fois par la bannière du
  message. Les deux moteurs libellent ce blocage en langage de contrôle d'accès ; c'est le piège
  central de ce dossier.

## Conséquences

**Ferme :** l'idée qu'un réglage du produit, du serveur ou de la commande de lancement puisse rétablir
la fonctionnalité. La dépendance est à la politique du navigateur, et elle est subie.

**Ouvre :** une interface qui dit la vérité sur ce qui vient d'échouer — jusqu'ici le produit
affirmait « serveur non détecté » à quelqu'un dont le serveur tournait, à l'endroit précis où il
demande qu'on lui fasse confiance sur un fait concernant la machine de la personne. Et un chemin de
repli qui, en servant le site depuis la machine, rend l'invariant de traitement local **visible**
plutôt que promis.

**Firefox est mesuré, et c'est le seul des trois qui marche sans rien expliquer** (mainteneur, sur sa
machine, 2026-07-19) : il ouvre la fenêtre de permission **spontanément**, à l'arrivée sur la page, et
la fonctionnalité marche une fois accordée. C'est exactement ce que Chromium était censé faire et ne
fait pas.

Le tableau réel, et c'est lui que la copy doit servir :

| Moteur | Ce qui se passe | Ce que l'interface a à dire |
| --- | --- | --- |
| Firefox | fenêtre spontanée, puis ça marche | rien |
| Chromium / Brave | marche, mais la fenêtre ne s'ouvre jamais | le chemin manuel du cadenas |
| WebKit / Safari | **ne peut pas marcher** | changer de navigateur, ou servir en local |

Les trois ne sont donc pas trois degrés d'un même problème : **deux marchent et un est un mur.**
