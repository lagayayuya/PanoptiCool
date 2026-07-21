// Lexique `religion` (PANO-72, passe 2) — label de SUJET (pratique / appartenance / avis /
// curiosité, décision D). Le plus délicat des six.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Vocabulaire religieux du FR courant (toutes confessions), écrit à l'aveugle depuis l'usage
// commun, jamais depuis un export :
//   · soutenu : appartenance et pratique (croyant, pratiquant, pèlerinage, catéchisme) ;
//   · courant : lieux, textes, figures, rites (mosquée, coran, imam, ramadan, messe) ;
//   · familier : formules lexicalisées marquées (hamdoulah, bismillah).
// FRONTIÈRES tenues (décision D — religion NE re-confond PAS ces cas) :
//   · label de SUJET : PAS de registre « opinion hostile » ici (≠ politics). Un avis sur la
//     religion qui emploie ce vocabulaire topical est capté en indirect ; l'éventail de lectures
//     porte la lecture « avis personnel ». La critique d'une religion comme IDÉE n'est taguée
//     NULLE PART ;
//   · hostilité anti-CROYANT (insulte visant une personne) → `conflictual`, jamais ici ;
//   · terme visant un GROUPE ethnico-religieux dans l'absolu → HAINEUX, exclu de TOUT lexique,
//     SIGNALÉ comme périmètre d'un futur label dédié — jamais tranché seul, jamais inclus ici.
// Exclusion assumée (décision yuya) : « wallah / inchallah / machallah » EXCLUS
// (interjections lexicalisées dans l'argot FR général — ne pas taguer une population sur son
// sociolecte) ; « hamdoulah / alhamdulillah » (plus marqués) en indirectColloquial seulement.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// Entrées NORMALISÉES. Seuil 1 (calibrage PANO-33) : « église » culturelle taguera en LARGE, et
// l'éventail de lectures (« curiosité / intérêt ») porte cette lecture — multi-interprétabilité, pas
// un bug. La sécurité du sensible vit dans le GRILLAGE d'affichage — le constat démarre replié,
// derrière un badge « sensible » — et non dans le seuil : monter le seuil réserverait l'affichage aux
// cas les plus nets sans rien rendre plus sûr, chaque carte étant déjà derrière une porte (ADR-0003).
//
// ── CE QUE L'ANGLAIS PORTE, ET CE QU'IL NE PORTE PAS ────────────────────────────────────────────
// Le lot anglais vit AU SEUL TIER LARGE (raisons et frontières dans `indirectCore`). Trois
// conséquences qu'un lecteur suppose autrement, et qui sont mesurées :
//
//   · **`selfDeclaredEn` n'existe pas** — la porte de langue n'est pas touchée, et aucune
//     auto-déclaration anglaise ne rend quoi que ce soit. L'anglais ne NOMME jamais sur ce label.
//   · **La démotion d'adhésion et la frontière de négation n'ont AUCUNE surface anglaise.** Ce sont
//     les deux réparations dont ce module est le plus fier, et elles sont bilingues en apparence
//     seulement : `adherence` plafonne un constat NOMMÉ, et il n'y en a pas en anglais.
//   · **La négation et la 3ᵉ personne sont structurellement INERTES en anglais ici** — mesuré :
//     « i am not doing ramadan » et « she is doing ramadan » rendent tous deux un constat large.
//     Ce n'est pas un défaut, c'est `subjectNotState` : il DÉGRADE explicit → indirect, et un
//     marqueur déjà indirect n'a nulle part où descendre. Des trois filtres de doctrine, seule la
//     CITATION a un effet anglais sur ce label.
//
// La sûreté anglaise de ce label est donc NON MESURÉE : la seule voix anglaise du banc est une
// visiteuse de monuments, adverse à ce vocabulaire par construction et rouge d'avance. C'est un
// témoin, pas un plancher — aucun chiffre issu de ce banc ne se cite comme mesure de sûreté.
// (Ex-note de lot condensée dans `docs/methode-portabilite-en.md`.)

import type { TopicalLexicon } from './types';

export const RELIGION_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'religion',
  // Lectures du registre §5 : pratique / appartenance · avis personnel · curiosité / intérêt.
  readingTemplateIds: [
    'sensitive.religion.reading.practice',
    'sensitive.religion.reading.opinion',
    'sensitive.religion.reading.curiosity',
  ],
  // Pratique/déclaration à soi, NON copulaire (locutions) — le tag nommé passe surtout par
  // `selfDeclared`.
  explicit: [
    'je prie',
    'ma foi',
    'je crois en dieu',
    'je fais le ramadan',
    'je porte le voile',
    'je vais a la messe',
    'ma paroisse',
    'mon eglise',
    'ma mosquee',
  ],
  // ── LA RÈGLE D'ADMISSION DES TRADITIONS, écrite pour être auditable ────────────────────────────
  // Elle répond à « quelles traditions ce lexique porte-t-il, et pourquoi celles-là », question
  // qu'une LISTE seule ne peut pas trancher — c'est l'équivalent, pour ce label, de la règle qui
  // écarte les organisations côté `politics`.
  //
  //   (1) Le lexique porte des TRADITIONS, jamais des ORGANISATIONS. Entre l'appellation ordinaire
  //       qu'une personne emploie POUR ELLE-MÊME ; n'entrent pas les institutions, obédiences,
  //       mouvements, ordres, congrégations, ni aucune figure. Même raison que côté politique : un
  //       nom d'organisation date, se scinde et se renomme, quand une appellation ordinaire dure.
  //
  //       AMENDÉE au lot anglais, et l'amendement porte sur le CRITÈRE, pas sur une liste. Ce que la
  //       clause vise est la DURABILITÉ — « date, se scinde et se renomme » — et non la forme
  //       grammaticale du nom. Une appellation qu'une personne emploie POUR ELLE-MÊME comme
  //       appartenance, et qui est stable à l'échelle des siècles, entre MÊME SI une organisation
  //       porte le même nom. `mormon`, `quaker`, `amish` sont de celles-là : « i was raised mormon »
  //       est une identité d'appartenance en anglais ordinaire, pas la citation d'une institution.
  //       Restent dehors les obédiences et branches qui se lisent comme des divisions
  //       administratives d'une tradition — baptist, methodist, presbyterian, episcopalian,
  //       anglican, lutheran, sunni, shia.
  //
  //       L'amendement est écrit ici plutôt qu'appliqué en exception parce qu'une exception non
  //       écrite se re-dérive à l'identique : la session suivante relit la règle d'origine, ne voit
  //       pas pourquoi `mormon` y échappe, et le retire.
  //
  //       DETTE NOMMÉE, et c'est une décision FRANÇAISE qu'un lot ANGLAIS n'avait pas à prendre : la
  //       règle amendée admettrait `mormon` en français aussi. Ce serait une septième famille au
  //       témoin de symétrie et un déplacement de décomptes gelés et ratifiés. Laissé ouvert.
  //       (Vérifié au passage, contre l'hypothèse qui l'avait motivé : `protestant` ET `evangelique`
  //       sont admis tous les deux en FR — il n'y a pas d'asymétrie française à réparer de ce côté.)
  //   (2) Une tradition entre dès que son appellation ordinaire EXISTE dans la langue — quel que
  //       soit son poids démographique. Le critère est linguistique, pas statistique, ET C'EST LE
  //       CŒUR DE LA RÈGLE : classer par poids garantirait que les traditions les moins nombreuses
  //       ne produisent aucune trace, or une non-détection n'affiche RIEN. Le silence sélectif est
  //       un jugement déguisé (ADR-0003) — ici il aurait visé les minorités.
  //   (3) Toute tradition admise entre AUX DEUX TIERS où ses pendants existent : l'appellation en
  //       auto-déclaration, le nom de domaine en vocabulaire de sujet. Une entrée orpheline est un
  //       déséquilibre à retardement.
  //
  // ADMISES À LA REVUE DE COUVERTURE, le trou ayant été mesuré (« je suis hindoue », « je suis
  // sikh » ne rendaient RIEN dans le cadre exact où cinq autres posaient un constat nommé) :
  // hindou·e, sikh·e, orthodoxe. `agnostique` rejoint `athee` au tier LARGE — ce sont des postures
  // et non des traditions, et la démotion ratifiée vaut pour les deux identiquement.
  //
  // NON ADMISES, et le dire vaut mieux qu'une liste sans bord : jaïn, bahá'í, zoroastrien, shintō,
  // taoïste. La règle (2) les admettrait, la règle (1) ne les exclut pas — ce qui les retient est
  // que je ne sais pas si leur appellation s'écrit en français courant sans glose, et je préfère un
  // manque DÉCLARÉ à une entrée que personne ne peut auditer. C'est une frontière de ma
  // connaissance, pas une décision de doctrine : elle se lève par une mesure, pas par un arbitrage.
  //
  // Appartenance AUTO-DÉCLARÉE (« je suis croyant », « chui musulman ») → tag nommé via pattern.
  // Emprunt lexicalisé « muslim » (employé par des francophones). « feuj » EXCLU (terme de groupe
  // ethnico-religieux — signalé à yuya).
  //
  // « athée » RETIRÉ de ce tier (ratifié à la mesure du banc de registres) et descendu en
  // `indirectCore`. Le sujet n'était pas en cause : une athée militante écrit du vocabulaire
  // religieux en permanence, une plateforme le lirait, et la carte est légitime. C'était l'ÉTAGE.
  // Au tier nommé, l'éventail est classé et met « pratique / appartenance » EN PREMIER — une athée
  // recevait donc une carte privilégiant « elle pratique », la lecture juste (« avis personnel »)
  // reléguée au second rang alors qu'elle était déjà écrite. Au tier large l'éventail est à plat,
  // les trois lectures s'affichent à égalité, et la carte devient vraie sans rien inventer.
  selfDeclaredFr: [
    'croyant',
    'croyante',
    'musulman',
    'musulmane',
    'muslim',
    'muslima',
    'chretien',
    'chretienne',
    'juif',
    'juive',
    'catholique',
    'catho',
    'protestant',
    'protestante',
    'evangelique',
    'bouddhiste',
    'hindou',
    'hindoue',
    'sikh',
    'sikhe',
    'orthodoxe',
    'pratiquant',
    'pratiquante',
  ],
  // ── LES APPELLATIONS ANGLAISES — le versant qui manquait à des noms de domaine ratifiés ───────
  // Ce tier n'affirme JAMAIS (constat large ; `TopicalLexicon.selfDeclaredEn`). Il ne change donc
  // rien à ce que ce label ose dire : l'anglais continue de ne jamais NOMMER sur `religion`, comme
  // l'en-tête de ce module l'écrit depuis le lot anglais.
  //
  // CE QU'IL RÉPARE, et ce n'est pas une extension mais l'application de la règle (3) ci-dessus —
  // « toute tradition admise entre AUX DEUX TIERS où ses pendants existent ; une entrée orpheline
  // est un déséquilibre à retardement ». Mesuré : les noms de DOMAINE étaient câblés, les
  // APPELLATIONS ne l'étaient pas.
  //
  //     christianity ✓ / christian ✗      judaism ✓ / jewish ✗      hinduism ✓ / hindu ✗
  //     buddhism ✓ / buddhist ✗           sikhism ✓ / sikh ✗        islam ✓ / muslim ✗
  //
  // Six traditions orphelines par la règle du module lui-même. `mormon`, `quaker`, `amish`,
  // `evangelical` ne l'étaient pas (ils vivent en `indirectCore`), ce qui rendait le trou invisible
  // à qui regardait la liste plutôt que les paires.
  //
  // LES DEUX PÔLES ENTRENT ENSEMBLE, et c'est la condition de l'admission : `atheist`, `agnostic`,
  // `non religious`, `secular` sont ici au même titre que les traditions. N'ajouter que les
  // appellations croyantes ferait de ce label un détecteur de croyants — le silence sélectif
  // qu'ADR-0003 nomme (*L'incertitude*, neutralité). Ils sont DÉJÀ au tier large en `indirectCore` ;
  // les répéter ici leur donne le même chemin cadré qu'aux traditions, pas un étage de plus.
  //
  // N'ENTRENT PAS, à la même porte, et l'exclusion vaut plus que l'inclusion :
  //   · `devout`, `observant`, `practicing`, `spiritual`, `born again`, `godless` — adjectifs
  //     d'INTENSITÉ ou de posture, pas des appellations. Mesuré en anglais ordinaire : « devout fan
  //     of this show », « a born again gym person since january », « im spiritual not religious ».
  //   · `orthodox` — LE PLUS TENTANT ET LE PLUS DANGEREUX. Son usage dominant anglais est
  //     « conforme, canonique » : « an orthodox approach to the problem », « orthodox economics ».
  //     Le français porte `orthodoxe` en `selfDeclaredFr` et peut se le permettre ; l'anglais ne le
  //     peut pas. Même forme de décision que `temple`, dans l'autre sens — et il ne faut PAS
  //     l'harmoniser.
  //   · `catholic` est admis ICI mais resterait exclu d'un tier NU : « she has catholic taste in
  //     music » (= éclectique) est de l'anglais courant. C'est le cadre qui le rend admissible, et
  //     c'est tout ce que le cadre achète.
  //   · les obédiences (`baptist`, `methodist`, `presbyterian`, `episcopalian`, `anglican`,
  //     `lutheran`, `sunni`, `shia`) — règle (1), inchangée.
  //   · TOUTE LA COUCHE PHATIQUE : `bless you`, `blessed`, `amen`, `preach`, `hallelujah`. Déjà
  //     exclue de `indirectCore`, et elle le reste ici — troisième porte d'ADR-0003, dont la
  //     SECONDE raison suffit : marqueurs saillants de l'anglais afro-américain et du Sud des
  //     États-Unis. Vérifié un par un : aucune appellation admise ci-dessus ne tombe de ce côté.
  selfDeclaredEn: [
    'muslim',
    'christian',
    'catholic',
    'jewish',
    'hindu',
    'buddhist',
    'sikh',
    'mormon',
    'quaker',
    'amish',
    'evangelical',
    'protestant',
    'religious',
    'a believer',
    // Le pôle non-croyant, au même tier et dans le même lot.
    'atheist',
    'agnostic',
    'non religious',
    'secular',
  ],
  // ADHÉSION — leur NÉGATION plafonne une auto-déclaration en large (doctrine et raison d'être :
  // `TopicalLexicon.adherence`). Verbes et noms de l'adhésion elle-même, jamais des traditions : ce
  // qui contredit « je suis catholique » n'est pas une autre appartenance, c'est le retrait de la
  // croyance ou de la pratique. Tenus COURTS et génériques exprès — cette liste plafonne, donc une
  // entrée de trop coûte du rappel sur des gens qui affirment réellement.
  adherence: ['crois', 'croire', 'croyais', 'pratique', 'pratique ma religion', 'ma foi'],
  // Vocabulaire de sujet, non ambigu → tag large.
  indirectCore: [
    'religion',
    'spiritualite',
    'la priere',
    'priere',
    'ramadan',
    'careme',
    'messe',
    'mosquee',
    'synagogue',
    'coran',
    'torah',
    'evangile',
    'imam',
    'rabbin',
    'pape',
    'halal',
    'casher',
    'hijab',
    'islam',
    'christianisme',
    'judaisme',
    'bouddhisme',
    'hindouisme',
    'sikhisme',
    // ── L'AXE DE LA CROYANCE, ET POURQUOI SES DEUX PÔLES NE SONT PAS AU MÊME ÉTAGE ──────────────
    // Question rouverte par le lot de symétrie FR, et TRANCHÉE À LAISSER EN L'ÉTAT. Ce qui suit est
    // le raisonnement, parce que la raison écrite jusqu'ici était incomplète et invitait à rouvrir.
    //
    // (1) `athee` N'EST PAS le cas de `valide`. Sur `health_physical`, admettre « je suis valide »
    //     poserait un constat de CONDITION sur quelqu'un déclarant n'en avoir aucune — le terme
    //     majoritaire y nomme l'ABSENCE de la chose détectée. Ici non : `religion` est un label de
    //     SUJET (ADR-0003, *L'état et le sujet*), la chose détectée est le SUJET et non la croyance,
    //     et une athée tient une POSITION sur ce sujet. Les deux pôles appartiennent donc bien au
    //     même axe, et la couverture est SYMÉTRIQUE — les deux déclenchent.
    //
    // (2) Mais la raison de la démotion n'a jamais été « athée est moins une position ». C'était
    //     l'ÉVENTAIL, et il est écrit depuis le pôle pratiquant : sa tête est « pratique /
    //     appartenance ». L'éventail est `ranked` au tier nommé et `equal` au tier large
    //     (`rules/d1-sensitive-topics.ts`). D'où l'asymétrie des conséquences, et elle ne se
    //     retourne pas :
    //       · promouvoir `athee` → sa carte remettrait « pratique / appartenance » EN TÊTE, très
    //         exactement le défaut que la démotion ratifiée a corrigé. Régression ;
    //       · rétrograder `croyant` → perte d'un constat nommé sur une auto-déclaration vraie et
    //         explicite, alors que pour elle la tête classée est JUSTE. Rappel perdu, rien gagné.
    //     La raison ne s'applique donc PAS symétriquement, et c'est ce qui rend l'asymétrie d'étage
    //     légitime : elle compense une asymétrie de l'ÉVENTAIL, pas un jugement sur le pôle normal.
    //
    // (3) Ce que l'asymétrie ne fait pas : elle ne rend le produit sourd à personne. Une athée
    //     reçoit sa carte, avec trois lectures à égalité. Seule l'AFFIRMATION diffère — « un label
    //     plus sensible mérite de moins affirmer » (ADR-0003).
    //
    // DETTE NOMMÉE, et c'est la vraie réparation : UN SEUL éventail sert les deux pôles. Des
    // éventails PAR PÔLE — « avis personnel » en tête du côté non-croyant — permettraient un étage
    // symétrique sans rien remettre de faux en tête. C'est un mécanisme neuf, pas un lot de lexique.
    'athee',
    'atheisme',
    'agnostique',
    'agnosticisme',
    // LES SYNONYMES DU PÔLE NON-CROYANT, et leur absence était un vrai trou de couverture : `athee`
    // était câblé, ses voisins ordinaires ne l'étaient pas. La couverture se vérifie dans les deux
    // sens (CLAUDE.md), et « je suis incroyant » rendait RIEN là où « je suis athee » rendait un
    // constat large — même pôle, même registre, deux comportements.
    'incroyant',
    'incroyante',
    'non croyant',
    'non pratiquant',
    // L'anticléricalisme est une position SUR le sujet, et le pôle critique est celui qu'ADR-0003
    // nomme comme le silence le plus coûteux (*L'incertitude*, neutralité). Mesuré : la forme
    // historique (« l'anticléricalisme du 19e siècle ») reste sur le sujet, donc pas de tort de
    // registre.
    'anticlerical',
    'anticlericalisme',
    // `laique` / `laicite` ÉCARTÉS, et ce n'est pas une pudeur. Leur usage dominant en français
    // n'est pas une position personnelle sur la croyance : c'est le vocabulaire CIVIQUE des
    // institutions. Mesuré — « une école laïque » et « un état laïque » déclenchaient, sur des
    // phrases de politique scolaire qui ne disent rien de la croyance de qui les écrit. Le terme est
    // par ailleurs transversal aux deux bords politiques, ce que le témoin `politics-symmetry`
    // enregistre déjà pour `laicite`. Sa maison probable est `politics`, jamais ici.
    'catechisme',
    'pelerinage',
    'aid moubarak',
    'priere du vendredi',
    // ── VOCABULAIRE ANGLAIS ────────────────────────────────────────────────────────────────────
    // Fusionné en ligne (même discipline que `mental_health` et `politics`) : le détecteur ne
    // sépare pas les langues, seul `selfDeclaredFr` est appairé à des têtes.
    //
    // POURQUOI CE LOT EXISTE, et ce n'est PAS « l'anglais n'avait rien ». Il en avait, par accident
    // orthographique, et c'était PENCHÉ : islam 5 surfaces (islam, ramadan, halal, hijab, imam),
    // judaïsme 2, christianisme 2, bouddhisme / hindouisme / sikhisme 0 — chacune franchissant
    // SEULE au seuil 1. Autrement dit : mentionner une fois de la nourriture halal posait un
    // constat, écrire qu'on va à l'église tous les dimanches n'en posait aucun. Personne ne l'avait
    // décidé. Le banc n'avait pas tort sur le mécanisme (des entrées FR rencontrant un texte EN) ;
    // il n'a jamais demandé LESQUELLES, seulement s'il y en avait.
    //
    // LA LIGNE D'ADMISSION DE CE LOT (doctrine, ADR-0003 *le marqueur de sociolecte*) : le mot qui
    // NOMME entre, le mot qui FAIT n'entre pas. Test du référent — ce terme pointe-t-il vers un
    // lieu, un texte, une figure, un rite, une tradition ? Si oui il entre, que l'auteur soit
    // croyant, critique ou touriste (principe de démonstration). Sinon il reste dehors, si religieux
    // que soit son étymologie.
    //
    // EXCLUS PAR CETTE LIGNE, et le dire vaut mieux qu'une liste sans bord : `bless you`, `blessed`,
    // `amen`, `preach`, `hallelujah`, `godspeed`, `holy`, `sacred`, `oh my god`, `thank god` — ils
    // accomplissent un acte social sans rien désigner, et plusieurs sont des marqueurs de sociolecte
    // (anglais afro-américain, Sud des États-Unis). Exclus aussi les emprunts que l'anglais a
    // SÉCULARISÉS — `karma`, `zen`, `guru`, `mantra`, `nirvana`, `yoga`, `chakra`, `dharma` — et
    // c'est le tour cruel du lot : ce sont les mots des traditions qui étaient à zéro. D'où une
    // couverture qui reste plus mince pour le bouddhisme, l'hindouisme et le sikhisme, PAR FAIT DE
    // LANGUE et non par choix : le vocabulaire utilisable y est l'emprunt non digéré (gurdwara,
    // mandir, puja, diwali), plus propre et plus rare. Déclaré plutôt qu'égalisé en admettant
    // `karma`.
    //
    // AUCUNE ENTRÉE COLLOQUIALE ANGLAISE, et ce n'est pas un oubli : le tier colloquial est le foyer
    // des formules MARQUÉES (donc désignantes — `hamdoulah`, `bismillah`). Son pendant anglais
    // serait celui des formules NON marquées, c'est-à-dire exactement ce que la ligne refuse. Le
    // tier inverse son sens en changeant de langue (ADR-0003, corollaire de tier).
    //
    // NOMS NUS ÉVITÉS AU PROFIT DU SYNTAGME, là où la collision anglaise est dure — la leçon de
    // `politics` appliquée à des CAS, jamais comme ligne (la plupart de ces mots sont monosémiques
    // en anglais et un syntagme leur coûterait tout leur rappel pour rien) : `the sabbath` et non
    // `sabbath` (Black Sabbath), `easter mass` et non `mass` (physique) ni `easter` (œufs).
    // ÉCARTÉS ENTIÈREMENT pour la même raison : `lent` (prétérit de *lend*), `bishop` (pièce
    // d'échecs), `confession` (aveu), `minister` (collision `politics` frontale), `faith`, `grace`,
    // `hope`, `charity`, `trinity`, `saint` (prénoms et noms propres), `mecca` (*a mecca for
    // cyclists*), `cathedral`, `abbey`, `chapel` (registre du MONUMENT et non du culte — écrits
    // surtout par qui visite, plus la collision immobilière *cathedral ceiling*).
    //
    // COLLISIONS ADMISES ET DÉCLARÉES, parce que le rappel qu'elles portent n'a pas de substitut :
    // `quaker` (marque de flocons d'avoine), `pastor` (*al pastor*, patronyme), `monk` (patronyme),
    // `kosher` (*that's not kosher* = irrégulier), `baptism` (*baptism of fire*), `gospel`
    // (*gospel truth*). Aucune n'est mesurée — voir la garde de phaticité pour ce qui l'est.
    //
    // `temple` ENTRE EN ANGLAIS ALORS QU'IL EST EXCLU EN FRANÇAIS, et la divergence est DÉLIBÉRÉE :
    // ne pas l'harmoniser. C'est le seul mot anglais ordinaire des lieux de culte bouddhiste et
    // hindou ; l'exclure recreerait, sur les deux traditions déjà à zéro, très exactement le trou
    // que la règle d'admission des traditions existe pour empêcher. Le français peut se le
    // permettre (il a d'autres mots et d'autres homonymes) ; l'anglais ne le peut pas.
    //
    // Traditions — l'écart 5-2-2-0-0-0 fermé au niveau du nom de domaine.
    'christianity',
    'judaism',
    'buddhism',
    'hinduism',
    'sikhism',
    'mormon',
    'mormonism',
    'quaker',
    'amish',
    // `evangelical` entre APRÈS l'amendement de la règle (1) — admission RATIFIÉE — et contre la
    // proposition d'origine de ce même lot, qui
    // l'excluait comme mot de `politics` déguisé (*evangelical voters*). Deux objections ont eu
    // raison de l'exclusion : le français admet déjà `evangelique`, et au tier LARGE un texte sur
    // des électeurs évangéliques PARLE bien de religion — le cas que le principe de démonstration
    // protège. La maintenir aurait fabriqué une divergence FR/EN sans raison, dans le lot qui en
    // corrige une.
    'evangelical',
    // Lieux.
    'church',
    'mosque',
    'gurdwara',
    'mandir',
    // `temple` EN SYNTAGME, et le détour n'est pas un raffinement — c'est la seule forme
    // implémentable. Le fork ratifié disait « `temple` entre en anglais malgré son exclusion
    // française » ; IL N'EXISTE PAS D'« EN ANGLAIS » pour ce tier. Le détecteur porte UN lexique et
    // ne route rien par langue : seul `selfDeclaredFr` est appairé à des têtes, et les tiers
    // indirects sont vus par les deux langues. Le `temple` nu retaguait donc « j'ai mal aux
    // temples », c'est-à-dire la collision anatomique que l'exclusion FR ratifiée (PANO-72) tient
    // depuis le sondage — mesuré, `lexicon-battery.test.ts` a rougi.
    //
    // Le syntagme fait le tri que le lexique ne sait pas faire : l'article et l'épithète anglais
    // n'apparaissent pas dans la tournure française. La décision ratifiée est donc tenue — les
    // lieux de culte bouddhiste et hindou cessent d'être muets — sans rouvrir une exclusion FR.
    // CE QUE ÇA COÛTE, et il faut le lire avant de citer cette entrée : « a temple in kyoto »,
    // « temple visit », « at temple » ne déclenchent PAS. La couverture est celle de la tournure la
    // plus fréquente, pas celle du mot.
    'the temple',
    'buddhist temple',
    'hindu temple',
    // Textes.
    'quran',
    'koran',
    'gospel',
    'hadith',
    'scripture',
    // Figures.
    'rabbi',
    'priest',
    'pastor',
    'monk',
    'pope',
    // Rites et pratiques.
    'eid',
    'hanukkah',
    'diwali',
    'vaisakhi',
    'shabbat',
    'the sabbath',
    'easter mass',
    'baptism',
    'pilgrimage',
    'sermon',
    // `prayer` ET `pray` — le nom et le verbe. Le verbe a failli manquer, et son absence était
    // mesurable : « i am a muslim and i pray every day » ne rendait RIEN quand « i go to church on
    // sundays » rendait un constat, parce que `muslim` est gardé derrière la porte de langue et que
    // seul le nom était admis. Le français couvre les deux depuis toujours (`je prie`, `priere`).
    //
    // Les deux NOMMENT une chose, et c'est ce qui les admet malgré leur voisinage phatique : ce qui
    // est phatique est la LOCUTION (« praying for you », « thoughts and prayers »), jamais le terme.
    // La ligne traite les termes dont l'usage dominant est phatique, pas les locutions bâties sur un
    // terme désignant — frontière assertée dans `religion-symmetry.test.ts`.
    'prayer',
    'pray',
    // Prescriptions.
    'kosher',
    'niqab',
    'kippah',
    'turban',
    // Postures — tier LARGE, strictement comme leurs pendants français : ce sont des positions SUR
    // la religion, et l'éventail à plat leur convient. Un `selfDeclaredEn` futur ne doit pas les
    // remonter.
    'atheist',
    'atheism',
    'agnostic',
    'agnosticism',
    // Génériques.
    'spirituality',
    'interfaith',
    'place of worship',
  ],
  // Culturel-polysémique (« belle église romane » = tourisme) → tag large + éventail « curiosité ».
  // EXCLUS après sondage FP (PANO-72, seuil 1) — collisions hors-domaine trop massives, pas de la
  // multi-interprétabilité mais du bruit : « voile » (bateau), « temple » (« mal aux temples » /
  // tourisme / jeu), « pasteur » (Institut/Louis Pasteur, toponymes), « baptême » (« baptême de
  // l'air / du feu »). La pratique reste captée par les auto-déclarations et le vocabulaire de sujet.
  indirectColloquial: [
    'eglise',
    'bible',
    'communion',
    'la mecque',
    'hamdoulah',
    'alhamdulillah',
    'starfoullah',
    'bismillah',
  ],
  // Label de SUJET — l'en-tête de ce module le disait depuis toujours en ces mots ; le drapeau lui
  // donne enfin un effet (ADR-0003, *L'état et le sujet*). La négation dégrade au lieu de supprimer.
  //
  // C'est ce qui manquait à l'axe PRATIQUE ↔ CRITIQUE, ratifié au catalogue et pourtant muet d'un
  // côté : « je ne crois pas en dieu » ne taguait rien là où « je crois en dieu » posait un constat
  // nommé. Le silence sélectif est un jugement déguisé (ADR-0003, *L'incertitude*) — celui-ci était
  // livré. Il reste que la critique de la religion comme IDÉE, sans vocabulaire du sujet, n'est
  // toujours taguée nulle part : la frontière d'origine de ce module tient.
  subjectNotState: true,
  includeColloquial: true,
  indirectThreshold: 1,
};
