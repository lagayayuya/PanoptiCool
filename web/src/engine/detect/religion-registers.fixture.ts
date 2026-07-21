// Banc `religion` — QUATRE voix, et la PAIRE PRATIQUE/CULTURE est l'instrument. Vérité-terrain scellée.
//
// ── Ce fichier est scellé ────────────────────────────────────────────────────────────────────────
// Écrit et commité AVANT tout tour du détecteur sur ces voix. « Faux positif » n'a pas de sens sans
// un état attendu écrit d'avance, et juger après avoir vu la sortie revient à juger avec indulgence
// — une détection plausible se rationalise toujours. Le sceau est le commit.
// ⚠ SCEAU ET HISTORIQUE PUBLIÉ. La recomposition d'avant publication (2026-07-21) a aplati
// l'historique de travail : fixture et capteur y naissent dans le même commit. La preuve d'ORDRE
// ne vit plus que dans le tag local `pre-squash-2026-07-21`, non publié — dans l'historique
// publié, ce sceau se lit comme une déclaration de méthode, pas comme un fait vérifiable.
//
// ── L'ÉTAT EXACT DE LA MESURE RELIGIEUSE AVANT CE FICHIER ────────────────────────────────────────
// Vérifié par balayage des six fixtures scellées, pas supposé, et la formulation compte parce que la
// version approximative est plus flatteuse que la vraie :
//
//   **AUCUNE persona du corpus scellé ne porte `religion` — ni `lived`, ni `signalWithoutLived`,
//   dans AUCUNE des deux langues.** Le rappel religieux du produit n'a JAMAIS été mesuré, pas une
//   fois, y compris dans le français livré et ratifié de longue date.
//
// Il subsiste exactement DEUX effleurements, et ni l'un ni l'autre n'est une voix :
//
//   · `slang` #1 — une recherche de RESTAURATION. Elle déclenche (`religion[indirect]`), et elle est
//     portée comme tort déclaré `slang/religion` avec une correction d'annotateur. Autrement dit :
//     tout le dossier des faux positifs de `religion` tient dans UN MOT de nourriture, dans UN item.
//   · `en_body` #19 — un LIEU de répétition à bonne acoustique, scellé HORS `religion` par
//     l'annotateur, précisément parce que ce n'est pas une pratique.
//
// Et le corpus FRANÇAIS ne contient aucun vocabulaire religieux, d'aucune sorte. Le pendant
// francophone de la voix argotique avait d'ailleurs été ÉCARTÉ parce que son unique résultat portait
// sur `religion`, hors sujet du lot d'alors. Le lexique le plus ratifié du produit n'a donc jamais
// eu de voix religieuse devant lui.
//
// C'est le motif nommé par CLAUDE.md (*Ce qu'un filet prouve*) : aucun banc existant ne pouvait
// rendre autre chose que zéro sur `religion`, parce qu'aucun n'a jamais mis le détecteur devant le
// sujet. Un rapport « aucun faux positif religieux » appuyé sur eux n'aurait rien dit du tout.
//
// ── POURQUOI UNE PAIRE, ET CE QU'ELLE MESURE QUI N'EST PAS L'ÉCART POLITIQUE ─────────────────────
// La paire politique mesurait un écart de RAPPEL entre deux camps : un camp silencieux n'affiche
// rien, et une absence ressemble à un banc propre. La paire d'ici mesure autre chose, et la
// différence est portante — les deux voix ATTENDENT toutes deux un tag. Ce qui les sépare est
// l'ÉTAGE :
//
//   · `fr_practising` — `lived`. Un constat NOMMÉ est légitime et attendu.
//   · `fr_cultural_lapsed` — `signalWithoutLived`. Le tag est légitime AUSSI ; c'est le constat
//     NOMMÉ qui est le tort (sur-classification, compteur `escalated`).
//
// Les deux voix partagent la quasi-totalité du vocabulaire — un enterrement, un repas de famille,
// un lieu de culte, un calendrier. Si le détecteur les place au MÊME étage, alors le produit ne
// distingue pas la pratique de la culture, et il le fera sur des personnes réelles. C'est la
// question que ce banc existe pour poser, et elle n'est lisible que parce que les deux chiffres se
// lisent l'un contre l'autre. Ils ne s'additionnent jamais et ne se moyennent jamais.
//
// ── LA LANGUE : TROIS FR, UNE EN, ET C'EST UN ARBITRAGE DU MAINTENEUR ────────────────────────────
// La paire partage OBLIGATOIREMENT une langue — séparée, l'écart d'étage confondrait l'état avec la
// couverture linguistique, et plus aucune lecture ne serait possible. Le français, pour la raison
// qui a valu à la paire politique : c'est le lexique livré et ratifié, un défaut y est un défaut
// produit vivant, et un lot de vocabulaire anglais en cours ferait de toute mesure EN un tir sur
// cible mobile.
//
// La voix CRITIQUE (`fr_critic`) est française par DÉCISION EXPLICITE du mainteneur, contre la
// proposition initiale qui la plaçait en anglais. Le motif est celui du banc politique : en anglais,
// son zéro aurait mesuré SON CONTENU et non le tri du détecteur. Le français est la langue où le
// versant critique existe, donc la seule où ses chiffres veulent dire quelque chose. Le prix est
// assumé et déclaré : il ne reste qu'UNE garde anglaise, et le plancher de faux positifs EN est
// d'autant plus mince.
//
// ── LES TRADITIONS, ET LE CONFONDANT QUE J'ACCEPTE ───────────────────────────────────────────────
// `fr_practising` est musulmane, `fr_cultural_lapsed` est de famille catholique. Les deux voix
// diffèrent donc sur DEUX axes à la fois : l'état (pratique / culture) et la tradition. La paire
// SEULE ne peut pas dire si un écart d'étage vient de l'un ou de l'autre. C'est un choix, pas un
// oubli, et voici le raisonnement complet :
//
//   · Même tradition des deux côtés aurait donné un écart pur — mais aucune tradition non
//     chrétienne n'aurait jamais été éprouvée en RAPPEL, dans aucune langue, et « le lexique
//     porte-t-il une foi mieux qu'une autre » serait resté entier du côté du rappel.
//   · Musulmane des deux côtés aurait donné les deux — au risque d'un échec SILENCIEUX de
//     l'instrument : si le lexique FR ne porte aucun vocabulaire islamique, les deux voix rendent
//     zéro, l'écart vaut zéro, et la paire a l'air propre en ne mesurant rien.
//
// Le confondant est donc neutralisé AILLEURS : le fichier de test porte des sondes à CADRE CALQUÉ —
// même frame syntaxique, les deux traditions, les deux états — qui séparent l'état de la tradition.
// C'est la technique de la fixture politique (« là où on mesure, on isole »), déplacée du corps des
// voix vers des sondes, parce qu'ici deux personnes vraisemblables ne pouvaient pas porter le
// calque intégral sans devenir deux dosages.
//
// ── CE QUE LE SCEAU DE `fr_cultural_lapsed` PEUT ET NE PEUT PAS SAVOIR ───────────────────────────
// C'est la voix la plus difficile du lot, et son sceau doit énoncer sa propre limite, sans quoi il
// prétendrait à une connaissance que personne n'a.
//
// CE QUE LE SCEAU SAIT : ce que le TEXTE énonce. Elle écrit qu'elle ne croit pas — explicitement,
// plusieurs fois — et elle écrit les pratiques auxquelles elle continue d'assister. Les deux sont
// dans les items, vérifiables par un tiers.
//
// CE QUE LE SCEAU NE PEUT PAS SAVOIR — et c'est le fond, pas une réserve de forme : si l'assistance
// SANS la croyance est distinguable de la pratique, à partir d'un texte. Elle ne l'est probablement
// pas, et la doctrine du produit le dit déjà : culture et pratique ne se séparent pas depuis
// l'écrit. Un enterrement, un repas de fête, un vocabulaire su par cœur sont EXACTEMENT ce qu'écrit
// aussi quelqu'un qui pratique.
//
// D'où la conséquence, qui est le vrai contenu de ce sceau : `signalWithoutLived` est une assertion
// sur LE TEXTE, jamais sur sa vie intérieure. Si le détecteur la NOMME, ce n'est pas évidemment une
// erreur — c'est le produit en train de faire exactement la chose qu'il existe pour montrer, et le
// montrer sur cette voix vaut mieux que de le découvrir sur quelqu'un. **Le tort que je compte sur
// elle est l'ÉTAGE, pas le TAG.** Un constat large est attendu ; un constat nommé est le résultat.
//
// ── CE QUE CE BANC NE COUVRE PAS ─────────────────────────────────────────────────────────────────
// - **Le RAPPEL n'est mesuré que pour l'islam** (`fr_practising`, seule voix `lived` du lot) et,
//   d'un cran plus bas, pour un héritage catholique en `signalWithoutLived`. Judaïsme, bouddhisme,
//   hindouisme n'apparaissent QUE du côté non-porteur, dans `en_curious` : leur rappel est **non
//   mesuré**, et un vert ici n'en dit rien.
// - **Aucune organisation, aucun courant nommé, aucune personnalité, aucun texte cité.** Les voix
//   se déclarent par des termes ordinaires, jamais par un nom propre ni un fragment de texte
//   religieux. Le rappel sur les noms de courants ou d'obédiences n'est pas mesuré.
// - **La bande civile, et elle seule.** Aucune hostilité envers un groupe religieux ou envers les
//   croyants comme classe n'est écrite ici, dans AUCUNE des quatre voix. `fr_critic` argumente
//   contre des IDÉES — l'origine des textes, le financement, l'école — jamais contre des personnes.
//   Le discours réel comporte des registres plus durs des deux côtés : CE BANC NE LES MESURE PAS,
//   ni leur rappel ni leurs faux positifs, et la frontière `religion` / `conflictual` sur ces
//   registres-là reste entière.
// - **Une seule garde anglaise.** Le plancher de faux positifs EN repose sur `en_curious` seule.
//   Il n'existe PAS de paire opposée anglaise, ni de voix pratiquante anglaise : ni le rappel
//   anglais, ni un éventuel biais EN entre traditions ne sont mesurés ici.
// - **Les cinq autres labels ne sont pas éprouvés.** Scellés non-porteurs partout. Les items de vie
//   ont été tenus à l'écart du corps et du soin exprès — une marche vue sous l'angle des chevreuils
//   plutôt que des ampoules, un col enneigé plutôt qu'un genou — parce qu'un signal
//   `health_physical` aurait brouillé la seule chose que ce banc mesure. Ce banc ne valide pas ces
//   labels pour autant.
//
// ── CE QUI A ÉTÉ LU, ET LA FUITE QUE JE DÉCLARE ──────────────────────────────────────────────────
// LU : `CLAUDE.md` ; `register-bench.ts` et `register-bench.harness.ts` (types, comptage, sans
// données de persona) ; `politics-registers.fixture.ts` en entier et `politics-bench.test.ts` pour
// la LEÇON des compteurs verts ; `fr-registers.fixture.ts`, `en-registers.fixture.ts`,
// `conflictual-registers.fixture.ts`, `en-body-registers.fixture.ts` et `en-upper-bound.fixture.ts`
// POUR LE FORMAT et pour établir l'état de la mesure ci-dessus. Recherche web sur la FORME du
// registre religieux et séculier ordinaire dans les deux langues (pratique insérée dans une vie de
// travail, formule française « croyant non pratiquant » et son histoire, vocabulaire de
// l'identification culturelle sans croyance, registre de la libre pensée) — aucune valeur rapportée.
//
// NON LU, délibérément : `lexicon/` en entier, `filters-*.ts`, les documents de portabilité EN.
//
// FUITE DÉCLARÉE, et la déclarer est la discipline qui fonctionne, pas son échec. En vérifiant par
// `grep` si `religion` était asserté quelque part — vérification nécessaire, puisque toute la
// prémisse de ce lot en dépendait — j'ai vu passer huit lignes de `lexicon-battery.test.ts`, dont
// j'ai involontairement appris quatre choses : deux chaînes de sonde FR portant sur l'assistance à
// un office, qu'un versant CRITIQUE de l'axe ratifié a cessé d'être muet récemment, qu'une
// interjection lexicalisée est exclue comme sociolecte, et qu'une insulte visant des croyants est
// routée vers `conflictual` et jamais vers `religion`.
//
// Ce que la fuite change, et ce qu'elle ne change pas. Les deux chaînes vues sont volontairement
// ABSENTES de ce fichier : les réutiliser aurait fabriqué un rappel garanti et vidé la paire de son
// pouvoir de mesure. La quatrième information ne modifie rien — la bande civile était décidée
// avant. La DEUXIÈME, en revanche, a une conséquence qu'il faut écrire ici plutôt que de la
// découvrir après la mesure : **je m'attends à ce que `fr_critic` déclenche**, alors que je la
// scelle non-porteuse. Ce désaccord est délibéré et il est le résultat le plus intéressant du lot —
// il est détaillé dans son `truthNotes`, et je le scelle selon ce que je crois vrai DE LA PERSONNE,
// pas selon ce que je crois savoir du lexique. C'est la seule définition utilisable d'une
// vérité-terrain.
//
// ── Aucune valeur réelle ─────────────────────────────────────────────────────────────────────────
// Chaque chaîne est inventée (CLAUDE.md) : aucun message, pseudo, prière, sermon, verset, date ou
// identifiant réel, et aucune formulation traçable à une communauté, une personne ou un texte
// existants.

import { allNonCarrier, type RegisterPersona } from './register-bench';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 1. LA PRATIQUE ORDINAIRE — première moitié de la paire
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_PRACTISING: RegisterPersona = {
  id: 'fr_practising',
  register:
    "pratique religieuse ordinaire, insérée dans une vie — la foi comme un fil parmi d'autres, jamais comme une personnalité",
  who: "Trente-quatre ans, préparatrice en pharmacie hospitalière, deux gardes par mois. Elle joue en défense dans une équipe de foot amateur le dimanche, a un fils de deux ans qui ne dort pas, et une machine à laver qui vibre. Elle est musulmane et pratiquante, l'a toujours été, le dit sans prosélytisme et sans se justifier, et ça revient dans ce qu'elle écrit comme ça revient dans une conversation — par intermittence, à côté du reste.",
  truth: allNonCarrier({ religion: 'lived' }),
  truthNotes:
    "`religion` VÉCU, et l'état est `lived` parce que la pratique est LA SIENNE : elle se déclare, elle observe, elle organise sa semaine autour. Un constat NOMMÉ est ici un rappel légitime et ATTENDU — c'est la PREMIÈRE voix de tout le corpus scellé dont on puisse dire ça sur ce label, et son absence serait un défaut de rappel à publier, pas à absorber. Elle n'a été dirigée vers AUCUN terme : si elle écrit ce qu'elle écrit, c'est parce que quelqu'un dans sa situation l'écrit, pas parce que je visais un lexème. Les cinq autres labels sont non-porteurs, et les items de vie ont été tenus hors du soin exprès — un fils qui dort enfin, un placard rangé, des crampons — parce qu'un signal `health_physical` aurait brouillé la seule chose que ce banc mesure. SON CHIFFRE NE SE LIT QUE CONTRE CELUI DE `fr_cultural_lapsed`, jamais seul : ce n'est pas le tag qui compte ici mais l'ÉTAGE, et un constat nommé sur elle n'est une bonne nouvelle que si l'autre voix n'en obtient PAS. Seule, cette persona ne peut pas distinguer « le détecteur reconnaît une pratique » de « le détecteur reconnaît du vocabulaire ».",
  items: [
    // — Déclarations et pratique (8) : cadres pensés en regard de la voix de culture.
    { kind: 'comment', text: "je suis musulmane et je pratique, je ne m'en cache pas" },
    { kind: 'comment', text: "on est une famille pratiquante, ma mere l'etait avant moi" },
    { kind: 'comment', text: 'je vais a la mosquee le vendredi quand le planning me le permet' },
    { kind: 'comment', text: "je fais le ramadan chaque annee, meme les annees ou c'est en ete" },
    { kind: 'comment', text: 'je prie cinq fois par jour, ca decoupe la journee et ca me va' },
    { kind: 'comment', text: 'je porte le foulard depuis mes vingt trois ans, et je le redis' },
    {
      kind: 'comment',
      text: 'je ne bois pas, ca surprend encore des collegues au bout de six ans',
    },
    { kind: 'search', text: 'horaires de priere de la semaine pour ma ville' },
    // — Communauté et calendrier (6) : écriture libre, non calquée.
    { kind: 'search', text: 'salle de priere en entreprise ce que dit la loi' },
    { kind: 'comment', text: "la nouvelle salle est plus grande mais l'acoustique est terrible" },
    { kind: 'search', text: 'soupe rapide a preparer la veille pour rompre le jeune' },
    {
      kind: 'comment',
      text: 'on a prepare les paquets pour les familles samedi, on etait vingt, trois heures',
    },
    { kind: 'search', text: 'cadeau de mariage pour une cousine budget cinquante euros' },
    { kind: 'comment', text: "ma mere veut qu'on soit tous la pour la fete, discussion close" },
    // — La vie (10) : rien de religieux, rien de clinique.
    { kind: 'search', text: 'crampons terrain synthetique femme pointure 39' },
    { kind: 'comment', text: "on a perdu quatre a un et j'ai quand meme adore la soiree" },
    { kind: 'search', text: 'machine a laver qui vibre en essorage' },
    { kind: 'comment', text: "le petit a dormi jusqu'a six heures, je note la date quelque part" },
    { kind: 'search', text: "preparer ses repas a l'avance pour la semaine" },
    { kind: 'comment', text: 'trois heures de match dans le froid et je le referai dimanche' },
    { kind: 'search', text: 'annales concours interne preparateur en pharmacie' },
    { kind: 'comment', text: "j'ai enfin range le placard de l'entree, ca m'aura pris deux ans" },
    { kind: 'search', text: 'poussette qui rentre dans un coffre de citadine' },
    { kind: 'comment', text: "la capitaine m'a mise en defense et honnetement elle avait raison" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 2. LA CULTURE SANS LA CROYANCE — seconde moitié de la paire, même densité
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_CULTURAL_LAPSED: RegisterPersona = {
  id: 'fr_cultural_lapsed',
  register:
    'héritage religieux SANS la croyance — les repas, les enterrements, le vocabulaire su par coeur, et la foi partie',
  who: "Quarante-six ans, elle travaille dans une régie de l'eau et vide le garage de la maison de famille depuis l'automne. Elle marche beaucoup, rate son potager avec constance, et son fils vient d'avoir le permis. Élevée dans une famille catholique pratiquante, quinze ans de catéchisme, elle ne croit plus depuis ses vingt ans et le dit sans amertume. Elle continue d'aller aux enterrements, de faire le repas de Noël et de connaître les mots par coeur — c'est sa famille, ce n'est plus sa foi, et elle ne trouve pas ça contradictoire.",
  truth: allNonCarrier({ religion: 'signalWithoutLived' }),
  truthNotes:
    "`religion` SIGNAL SANS VÉCU, et c'est l'appel le plus difficile du corpus — il faut donc dire exactement ce qu'il prétend. LE SIGNAL EST RÉEL : elle écrit un lieu de culte, un rite funéraire, une fête, un sacrement, un catéchisme. Il ne porte simplement pas la croyance, qu'elle nie explicitement et plusieurs fois. Le tag est donc ATTENDU et légitime — l'absence de tag serait un défaut de rappel du signal, pas une victoire. LE TORT QUE JE COMPTE EST L'ÉTAGE : un constat NOMMÉ sur elle est une sur-classification (compteur `escalated`), parce qu'un constat nommé porte la confiance haute et le quasi-factuel là où le texte ne permet qu'une lecture large. CE QUE CE SCEAU NE PEUT PAS SAVOIR, et le savoir change la lecture : si l'assistance sans la croyance est distinguable de la pratique, depuis un texte. Elle ne l'est probablement pas — un enterrement, un repas de fête et un vocabulaire su par coeur sont exactement ce qu'écrit aussi quelqu'un qui pratique. `signalWithoutLived` est donc une assertion sur LE TEXTE, jamais sur sa vie intérieure. Si le détecteur la nomme, ce n'est pas évidemment une erreur : c'est le produit en train de faire la chose qu'il existe pour montrer, et le voir ici vaut mieux que de le découvrir sur quelqu'un. ELLE SE LIT CONTRE `fr_practising` ET JAMAIS SEULE : si les deux voix atteignent le même étage, le produit ne distingue pas la culture de la pratique, et c'est le résultat que ce banc existe pour rendre visible. Cinq autres labels non-porteurs ; les items de vie sont tenus hors du soin exprès — la marche est vue par les chevreuils et non par les ampoules, faute de quoi `health_physical` brouillerait la mesure.",
  items: [
    // — Déclarations et héritage (8) : cadres pensés en regard de la voix pratiquante.
    {
      kind: 'comment',
      text: 'je suis catholique de famille mais je ne crois pas, je le dis comme ca',
    },
    { kind: 'comment', text: "on est une famille croyante, ma mere l'est encore, moi non" },
    {
      kind: 'comment',
      text: "je vais a l'eglise pour les enterrements et les mariages, pas autrement",
    },
    { kind: 'comment', text: "j'ai fait ma communion a onze ans, je n'ai rien fait depuis" },
    { kind: 'comment', text: 'je ne prie plus depuis mes vingt ans et ca ne me manque pas' },
    {
      kind: 'comment',
      text: "je n'ai pas fait baptiser mon fils, ma mere ne s'en est jamais remise",
    },
    {
      kind: 'comment',
      text: "je fais le repas de noel tous les ans, c'est la famille, pas la foi",
    },
    { kind: 'search', text: 'que repondre a quelqu un qui insiste pour un bapteme' },
    // — Rites et transmission (6) : écriture libre, non calquée.
    { kind: 'search', text: 'ordre des lectures a un enterrement qui lit quoi' },
    {
      kind: 'comment',
      text: "j'ai lu le texte a l'enterrement de ma grand mere, je connaissais encore les mots",
    },
    { kind: 'search', text: 'recette de beignets sucres comme les faisait ma grand mere' },
    { kind: 'comment', text: 'on met encore la creche chez ma mere, moi je regarde faire' },
    { kind: 'search', text: 'renouvellement d une concession au cimetiere demarches' },
    { kind: 'comment', text: 'quinze ans de catechisme et il me reste surtout les gouters' },
    // — La vie (10) : rien de religieux, rien de clinique.
    { kind: 'search', text: 'reparer une fuite sous un evier sans plombier' },
    { kind: 'comment', text: 'la benne est arrivee, le garage sera vide avant dimanche' },
    { kind: 'search', text: "livre d'occasion sur l'histoire de la vallee" },
    { kind: 'comment', text: 'on a marche vingt kilometres et on a vu trois chevreuils' },
    { kind: 'search', text: 'chaussures de randonnee impermeables avis' },
    { kind: 'comment', text: "mon fils a eu son permis du premier coup, je n'en reviens pas" },
    { kind: 'search', text: 'assurance jeune conducteur comparatif' },
    { kind: 'comment', text: 'le potager a donne trois courgettes et quatorze limaces' },
    { kind: 'search', text: 'comment eloigner les limaces sans produit' },
    {
      kind: 'comment',
      text: "j'ai retrouve les photos du mariage de mes parents dans une boite a chaussures",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 3. LA CRITIQUE — saturée du vocabulaire, et rien n'est vrai d'elle
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_CRITIC: RegisterPersona = {
  id: 'fr_critic',
  register:
    'critique argumentée de la religion — athée par conviction, saturée du vocabulaire, en désaccord avec des IDÉES et jamais avec des personnes',
  who: "Trente-huit ans, professeure de physique en lycée. Elle restaure une vieille moto dans un garage trop petit, joue aux échecs en ligne et perd souvent. Elle est athée par conviction, pas par indifférence : elle lit sur le sujet, elle argumente, elle revient. Ses désaccords portent sur l'origine des textes, sur ce que l'État finance et sur ce qu'on enseigne — jamais sur les gens, qu'elle côtoie tous les jours sans problème.",
  truth: allNonCarrier(),
  truthNotes:
    "Non-porteuse sur les six, et c'est l'appel LE PLUS CONTESTABLE du lot — le taire aurait été le vrai défaut. CE QUE JE DÉFENDS : un constat `religion` énonce quelque chose de la religion DE LA PERSONNE, et l'énoncé vrai la concernant est qu'elle n'en a aucune. La tager, c'est confondre le SUJET traité avec l'APPARTENANCE, exactement le mécanisme que `en_exposed_apolitical` isole sur `politics` — et c'est très précisément ce que le produit existe pour montrer. LA LECTURE INVERSE EXISTE ET SE DÉFEND : la conviction séculière est un axe du même domaine, et on pourrait sceller `signalWithoutLived` en disant que le signal est réel mais mal nommé. Je tranche pour `nonCarrier` parce que l'étiquette rendue à l'utilisatrice dirait « religion » d'une femme qui n'en a pas, et qu'aucun étage n'atténue ce contresens. PRÉDICTION SCELLÉE D'AVANCE, appuyée sur la fuite déclarée en tête de fichier : je m'attends à ce qu'elle DÉCLENCHE, un versant critique de l'axe ayant récemment cessé d'être muet. Le désaccord entre ce sceau et ce câblage est donc PRÉVU, et il est le résultat le plus intéressant du lot : deux lectures défendables de ce que `religion` nomme, rendues visibles par une voix qu'aucun banc n'avait jamais écrite. La note de mesure devra dire laquelle des deux le produit assume, et non enregistrer un tort en silence. Cinq autres labels non-porteurs, et `conflictual` mérite sa ligne : elle est ferme, parfois sèche, mais elle ne vise personne — la porte de `conflictual` est l'insulte émise visant un interlocuteur, et il n'y en a aucune. Un tag `conflictual` ici serait un tort à part entière, et sa présence dirait qu'un désaccord d'idées se lit comme une agression.",
  items: [
    // — La critique (15) : des idées, du financement, de l'école. Aucune personne visée.
    {
      kind: 'comment',
      text: 'on peut respecter quelqu un et trouver que sa croyance ne tient pas',
    },
    {
      kind: 'comment',
      text: "je suis athee, et ce n'est pas une croyance de plus, c'est l'absence de celle la",
    },
    { kind: 'search', text: 'difference entre laicite et atheisme expliquee simplement' },
    {
      kind: 'comment',
      text: 'un texte ecrit par des hommes il y a deux mille ans reste un texte ecrit par des hommes',
    },
    { kind: 'search', text: 'datation des plus anciens manuscrits methode et marges' },
    {
      kind: 'comment',
      text: "le miracle, c'est le nom qu'on donne a une explication qu'on n'a pas encore",
    },
    {
      kind: 'comment',
      text: "je ne demande d'interdire quoi que ce soit, je demande qu'on ne finance rien",
    },
    { kind: 'search', text: 'financement public entretien des edifices cultuels chiffres' },
    {
      kind: 'comment',
      text: "la morale n'a pas attendu les textes sacres, elle est plus vieille qu'eux",
    },
    { kind: 'search', text: 'origine des rites funeraires avant les religions monotheistes' },
    {
      kind: 'comment',
      text: "on me dit que sans la foi ma vie n'a pas de sens. elle en a un, il est ailleurs",
    },
    {
      kind: 'comment',
      text: "le probleme n'est pas de croire, c'est de demander a l'ecole de croire avec vous",
    },
    { kind: 'search', text: 'contestation du programme de sciences en classe que faire' },
    {
      kind: 'comment',
      text: "j'ai lu les textes en entier, c'est justement pour ca que je ne suis pas convaincue",
    },
    { kind: 'search', text: 'histoire de la libre pensee en france ouvrage de reference' },
    // — La vie (9) : rien de religieux, rien de clinique.
    { kind: 'search', text: 'carburateur qui deborde a froid diagnostic' },
    { kind: 'comment', text: 'la moto a demarre au troisieme coup de kick, je suis insupportable' },
    { kind: 'search', text: 'ouverture italienne piege classique cote noir' },
    { kind: 'comment', text: "j'ai perdu en quatorze coups et j'avais bien merite de perdre" },
    { kind: 'search', text: 'peindre un reservoir de moto sans compresseur' },
    {
      kind: 'comment',
      text: "mes secondes ont compris les forces plus vite que moi a leur age, c'est vexant",
    },
    { kind: 'search', text: 'sortie scolaire observatoire tarif groupe' },
    { kind: 'comment', text: "il a neige sur le col et j'ai fait demi tour comme une adulte" },
    { kind: 'search', text: 'gants moto hiver vraiment chauds avis' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 4. LA CURIEUSE — plusieurs traditions, aucune appartenance : la garde anglaise
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const EN_CURIOUS: RegisterPersona = {
  id: 'en_curious',
  register:
    'intérêt historique et architectural pour plusieurs traditions — aucune croyance, aucune appartenance, la seule garde anglaise du lot',
  who: 'Mid fifties, works in a records office, cycles further than is sensible and photographs buildings badly. She plans holidays around what she wants to see: a cathedral roof, a tiled courtyard, a wooden temple joint, a surviving synagogue. She watches long documentaries and retains about half. She holds no belief and belongs to nothing, and would say so plainly if anyone asked, which nobody does.',
  truth: allNonCarrier(),
  truthNotes:
    "Non-porteuse sur les six, et c'est la voix qui empêche d'acheter du rappel avec des torts. Elle est SATURÉE de vocabulaire de plusieurs traditions — édifices, motifs, horaires de visite, règles vestimentaires pour visiteurs, documentaires — sans porter la moindre appartenance ni la moindre croyance. Tout constat `religion`, nommé OU large, est un tort : un algorithme qui la classe a confondu l'intérêt avec l'appartenance. C'est aussi le SEUL endroit du lot où plusieurs traditions passent devant le détecteur avec un attendu identique — si l'une d'elles déclenche et pas les autres, ce banc rend une réponse côté faux positifs à la question « le lexique porte-t-il une foi mieux qu'une autre », sans rien dire du côté rappel. Deux items sont tenus au bord sciemment : « i am not religious at all and i still stood there for twenty minutes not moving » est une NÉGATION explicite entourée de vocabulaire — la forme qui éprouve le filtre de négation ; et « brought a scarf like the sign asked » décrit un GESTE d'usage d'un lieu de culte fait par quelqu'un qui n'y appartient pas. Si l'un des deux déclenche, le détecteur mesure la présence du sujet, pas la position de la personne. Cinq autres labels non-porteurs ; la liste de bâtiments à voir a été écrite SANS référence au corps — une première version la datait par l'usure des genoux, ce qui aurait fabriqué un `health_physical` au milieu de la seule garde du lot.",
  items: [
    { kind: 'search', text: 'best time of day to photograph stained glass from inside' },
    { kind: 'comment', text: 'four hours in one building and i photographed a single window' },
    { kind: 'search', text: 'why do gothic cathedrals need flying buttresses structurally' },
    {
      kind: 'comment',
      text: 'the tile geometry in that courtyard is doing something i cannot follow',
    },
    { kind: 'search', text: 'great mosque tile patterns which century are they' },
    {
      kind: 'comment',
      text: 'i am not religious at all and i still stood there for twenty minutes not moving',
    },
    { kind: 'search', text: 'documentary about how medieval cathedrals were actually built' },
    {
      kind: 'comment',
      text: 'the guide said the roof took ninety years and three architects who never met',
    },
    { kind: 'search', text: 'surviving synagogue architecture eastern europe where to see' },
    { kind: 'comment', text: 'watched two hours on temple construction and understood maybe half' },
    { kind: 'search', text: 'visitor opening hours and dress code for a working mosque' },
    { kind: 'comment', text: 'brought a scarf like the sign asked. seemed the least i could do' },
    { kind: 'search', text: 'why do church roofs go green copper oxidation' },
    {
      kind: 'comment',
      text: 'my list of buildings to see is getting longer and not shorter, which is a problem',
    },
    { kind: 'search', text: 'wooden temple joinery built without nails how does it hold' },
    { kind: 'comment', text: 'the acoustics in there turned one cough into a whole event' },
    { kind: 'search', text: 'bike panniers that fit a camera safely' },
    { kind: 'comment', text: 'forty miles yesterday and the last five were entirely spite' },
    { kind: 'search', text: 'cheap rail passes for slow travel across europe' },
    {
      kind: 'comment',
      text: 'my neighbour has agreed to water the tomatoes. i have left instructions. many',
    },
    { kind: 'search', text: 'second hand wide angle lens for interiors on a budget' },
    { kind: 'comment', text: 'the hostel had one power socket and eleven people. we managed' },
    { kind: 'search', text: 'how to pack light for three weeks in one bag' },
    { kind: 'comment', text: 'came home with two hundred photos of ceilings and none of people' },
  ],
};

/**
 * Les quatre voix, et leurs deux rôles distincts — qu'un rapport ne doit jamais confondre.
 *
 * `fr_practising` et `fr_cultural_lapsed` forment la PAIRE, et seul l'écart d'ÉTAGE entre elles a un
 * sens. Elles ne se somment ni ne se moyennent jamais. Attention au piège propre à CETTE paire, qui
 * n'est pas celui de la paire politique : les deux voix ATTENDENT un tag, donc deux cellules vertes
 * au compteur de rappel sont le résultat NORMAL et ne prouvent rien du tout. Ce qui se lit est la
 * distance entre `explicit` et `indirect` — et si elle est nulle, le produit ne distingue pas la
 * culture de la pratique.
 *
 * `fr_critic` et `en_curious` sont des GARDES et non une paire : elles ne s'opposent pas l'une à
 * l'autre, elles mesurent chacune un plancher de faux positifs contre un mécanisme différent — la
 * critique argumentée du sujet pour la première, l'intérêt savant sans appartenance pour la seconde.
 * Elles ne sont PAS interchangeables et leurs chiffres ne se somment pas : `fr_critic` est en
 * français, là où le vocabulaire existe, donc son chiffre mesure le tri du détecteur ; `en_curious`
 * est en anglais, et son zéro éventuel mesurera d'abord son propre contenu tant que la couverture
 * anglaise n'est pas établie par un autre chemin que ce banc.
 */
export const RELIGION_REGISTER_PERSONAS: readonly RegisterPersona[] = [
  FR_PRACTISING,
  FR_CULTURAL_LAPSED,
  FR_CRITIC,
  EN_CURIOUS,
];
