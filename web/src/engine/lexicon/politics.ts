// Lexique `politics` (PANO-71 graine → PANO-36 enrichi) — TROIS registres distincts (décision yuya) :
//   1. auto-déclaration (1ʳᵉ personne : « je vote », « je suis de gauche ») → explicit ;
//   2. thématique (vocabulaire de la vie politique : « manif », « réforme ») → indirectCore ;
//   3. opinion / jugement porté (catégories péjoratives : « facho », « gaucho », « corrompu ») →
//      indirectCore. C'est le registre le plus courant en commentaires, et là que « fasciste »
//      revit — correctement classé politics (avis / engagement), PAS conflictual.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Vocabulaire civique et ARGOT POLITIQUE COURANT DU FR EN LIGNE, écrit à l'aveugle depuis l'usage
// commun, jamais depuis un export :
//   · soutenu : institutions et procédures (assemblée nationale, motion de censure, référendum) ;
//   · courant : thèmes et acteurs génériques (manif, syndicat, député, pouvoir d'achat) ;
//   · argot / péjoratif politique : insultes de CATÉGORIE ou de CAMP (gaucho, droitard, facho,
//     bourge, beauf, woke, boomer, macroniste…) — GÉNÉRIQUES car elles visent des camps/catégories,
//     JAMAIS des individus nommés (les noms propres sont exclus, décision yuya).
// Frontière tenue : insulter une PERSONNE (cible 2ᵉ pers.) = conflictual ; juger une catégorie/idée
// politique = politics. Chaque terme aurait été écrit à l'identique sans avoir vu aucun export.
//
// ── LA SYMÉTRIE — la contrainte propre à ce lexique, et elle n'est pas une précaution ──────────
// Un lexique politique qui porte le vocabulaire d'un camp mieux que celui de l'autre fait du
// produit un instrument ORIENTÉ, et le biais est invisible : une non-détection n'affiche rien.
// Aucun des cinq autres labels ne court ce risque.
//
// Ce lexique l'a couru, et il faut écrire le mécanisme plutôt que le corriger en silence — parce
// que c'est le mécanisme, pas les termes, qui se reproduira. PERSONNE n'a écrit ce biais : chaque
// terme est entré pour une raison localement défendable, et le défaut ne vivait dans AUCUN d'eux.
// Il vivait dans la COMPOSITION de deux registres :
//
//   · le registre 1 (auto-déclaration) recueillait surtout des identités de GAUCHE — `anarchiste`,
//     `communiste`, `marxiste`, `insoumis`, `feministe`… ;
//   · le registre 3 (jugements portés) recueillait les étiquettes de DROITE — `nationaliste`,
//     `populiste`, `complotiste`, `communautariste` — parce qu'elles y étaient entrées comme des
//     ACCUSATIONS, ce qu'elles sont effectivement en commentaire.
//
// Résultat mesuré, un item chacune : « je suis anarchiste » posait un constat NOMMÉ, « je suis
// nationaliste » n'en posait AUCUN (un seul hit indirect, sous le seuil 2). Le lexique entendait
// l'identité de gauche quand elle se revendique, et celle de droite seulement quand un tiers la
// dénonce. Une relecture terme à terme ne pouvait pas le voir : elle vérifie que chaque terme
// PRÉSENT est légitime, jamais que les ABSENTS le sont symétriquement.
//
// La règle qui en sort, et elle vaut pour toute entrée future :
//   1. une étiquette d'identité entre au tier de l'IDENTITÉ (`selfDeclared`) pour les deux camps —
//      y compris quand le même mot vit AUSSI en `indirectCore` comme accusation (précédent :
//      `souverainiste`, `macroniste`) ;
//   2. un thème saillant d'un camp n'entre qu'avec son PENDANT de l'autre ;
//   3. on juge la SÉMANTIQUE de chaque terme, jamais l'équilibre du décompte. Une liste rendue
//      symétrique par remplissage serait un défaut pire que celui qu'on répare : elle aurait l'air
//      juste.
// Le témoin qui empêche ce lexique de re-diverger est `detect/politics-symmetry.test.ts`.
//
// EXCLUS, et par PAIRES quand la raison vaut des deux côtés — une exclusion se perd si rien ne la
// tient :
//   · `identitaire` ET `antifa` — tous deux nomment une famille de MOUVEMENT plus qu'une position ;
//     un lexique doit survivre aux cycles, et citer les mouvements d'un camp est un acte éditorial
//     permanent (même raison que l'exclusion des noms propres) ;
//   · `securite` — « sécurité sociale / routière / au travail » noient l'emploi politique ;
//     `insecurite`, lui, est admis : il n'a pas ces homographes ;
//   · `immigration clandestine`, `grand remplacement` — le qualificatif EST l'objet du litige ;
//     l'admettre inscrirait une position dans le lexique, pas un sujet.
// NON AJOUTÉ mais propre, et nommé pour qu'on sache que ce n'est pas un oubli : `progressiste`.
// Il aurait sa place ; il ne sert pas la réparation, et l'ajouter à un tier déjà bien pourvu à
// gauche serait du remplissage à l'envers. Le prochain lot d'enrichissement le trouvera ici.
//
// ── `liberal` : une exclusion PROPOSÉE, puis RENVERSÉE — et par quoi ───────────────────────────
// La note de portabilité proposait d'exclure `liberal` / `liberale`, sur une collision réelle avec
// la PROFESSION libérale (« je suis libérale » sous la plume d'une infirmière), et opposait le cas
// à `communiste` / `marxiste`, qui n'ont pas de lecture non politique à la 1ʳᵉ personne.
//
// L'argument tient toujours ; il ne suffisait pas. Le banc `politics`, scellé à l'aveugle par une
// autre session, isole précisément cette paire comme la forme la plus pure de l'asymétrie : même
// cadre, même longueur, même personne grammaticale, la seule variable étant le terme de courant —
// « je suis socialiste » posait un constat nommé, « je suis libéral » n'en posait aucun. Maintenir
// l'exclusion, c'était laisser debout le défaut exact que ce lot répare, et le laisser debout d'UN
// SEUL CÔTÉ. La collision de profession est une POLYSÉMIE, la classe que la doctrine tolère
// explicitement (le faux positif n'est pas un motif de retrait) — et non une hyperbole, la seule
// classe que la règle d'admission écarte à la porte.
//
// CONTAMINATION DÉCLARÉE, parce qu'elle change ce que le banc prouve : `liberal`, `liberale` et
// `redistribution` ont été écrits APRÈS lecture de la fixture scellée. Le banc reste un instrument
// indépendant pour tout le reste du lexique — il a été écrit sans le voir — mais il ne peut pas
// servir de validation à l'aveugle de CES trois entrées-là. Le prochain instrument qui les mesurera
// devra être écrit sans elles en tête.
//
// ── LE LOT ANGLAIS — ce qu'il est, et l'axe qu'il NE prend PAS ─────────────────────────────────
// 23 entrées `// (EN)`, réparties en deux actes d'engagement, neuf institutions et procédures, huit
// thèmes en PAIRES APPARIÉES et deux locutions transversales. Aucune identité, aucune épithète,
// aucun nom de parti ou de mouvement, `selfDeclared` laissé VIDE.
//
// **L'axe anglais n'est PAS l'axe français, et c'est la décision de fond du lot.** Le témoin FR
// partitionne des identités en gauche / droite ; transporter cette partition en anglais serait
// bâtir un filet sur une ligne que ce vocabulaire ne croise jamais, pour trois raisons mesurées ou
// vérifiées :
//   · le lot ne contient AUCUNE identité — il n'y a rien à partitionner ;
//   · le mot dont le camp s'inverse selon le dialecte existe (`liberal` : gauche aux États-Unis,
//     droite économique au Royaume-Uni), donc une partition anglaise dépendrait du lecteur ;
//   · il n'existe AUCUNE paire opposée anglaise scellée — la fixture le déclare en toutes lettres.
// L'axe retenu est donc celui des CHEMINS : combien de voies indépendantes mènent à un constat,
// de chaque bord. C'est ce que mesure la section EN de `detect/politics-symmetry.test.ts`, et son
// en-tête dit pourquoi cette mesure ne peut pas encore conclure.
//
// ── LA PORTE D'ADMISSION EN, ET LA RÈGLE PROPRE QUI EST BIAISÉE ────────────────────────────────
// **À lire avant d'ajouter le moindre terme anglais à ce lexique.** C'est le piège le plus coûteux
// de tout ce chantier, parce qu'il ne rougit nulle part : chaque pas se justifie, et le résultat est
// un instrument orienté.
//
// La règle qui vient naturellement à l'esprit, et elle est bonne : **entre le NOM DOCTRINAL, reste
// dehors l'ADJECTIF D'USAGE GÉNÉRAL.** `socialist`, `monarchist`, `libertarian` n'ont qu'un sens
// lexicalisé — les employer d'un lave-vaisselle est une plaisanterie qui EMPRUNTE ce sens, et c'est
// ce qui la rend drôle. `radical`, `moderate`, `independent`, `green`, `progressive` sont des
// adjectifs anglais ANTÉRIEURS et EXTÉRIEURS au sens politique : « im pretty liberal with the
// garlic » n'emprunte rien, c'est l'emploi ordinaire.
//
// **APPLIQUÉE MÉCANIQUEMENT, CETTE RÈGLE EST BIAISÉE, et voici par où :**
//   · `conservative` est LE mot ordinaire par lequel la droite anglophone se décrit — et c'est un
//     adjectif d'usage général (« i am conservative with my time estimates ») ;
//   · `socialist` est LE mot ordinaire de la gauche — et c'est un nom doctrinal.
// La règle admettrait donc le mot ordinaire d'un camp et exclurait celui de l'autre. C'est le défaut
// français RECONSTITUÉ SOUS UN HABIT NEUF, par un raisonnement irréprochable à chaque étape — et
// personne ne l'aurait écrit, exactement comme personne n'avait écrit le premier.
//
// La forme du danger est générale et ne tient pas à ces deux mots : **une règle d'admission qui
// discrimine sur la FORME d'un terme (nom/adjectif, nu/syntagme, savant/courant) découpe le champ
// politique de travers, parce que les deux camps ne nomment pas leur position dans la même forme
// grammaticale.** Toute règle formelle proposée ici doit donc être éprouvée sur les DEUX mots
// ordinaires des deux bords avant d'être adoptée. Aucun test ne peut le faire à la place de qui écrit.
//
// D'OÙ LA DÉCISION, et elle est écrite comme telle plutôt que passée en fraude sous une règle :
// **`conservative` ET `liberal` entrent tous les deux, comme ACCEPTATIONS ASSUMÉES.** Assumées, pas
// « mesurées » — l'instrument n'existe pas (voir plus bas), et écrire « mesurée » sans instrument est
// la sur-citation que ce dépôt paie sept fois. La doctrine les autorise sans contorsion : tous deux
// se déclenchent sur des porteurs ET des non-porteurs, donc ils discriminent MAL sans ne discriminer
// PAS-DU-TOUT (ADR-0003, *le faux positif n'est pas un motif de retrait*), et le seuil 2 travaille
// dessus comme sur toute polysémie. **Les exclure tous les deux serait défendable ; n'en exclure
// qu'un ne l'est pas.**
//
// EXCLUS du tier EN, et à quel titre — une exclusion se perd si rien ne la tient :
//   · `progressive`, `moderate`, `independent`, `green`, `radical`, `red`, `blue` — adjectifs
//     d'usage général dont le sens non politique est CONVENTIONNEL et DOMINANT (règle d'admission,
//     ADR-0003). Aucun n'est le mot ordinaire d'un camp : les exclure ne coûte de rappel à personne
//     en particulier, et c'est ce qui les distingue de `conservative` ;
//   · `activist`, `militant` — intensificateurs productifs (« im militant about recycling ») ;
//     `militant` est DÉJÀ au registre de la porte de langue comme graphie non admise en EN, et
//     l'admettre ici contredirait `selfdeclared-language-gate.test.ts` ;
//   · `reactionary`, `populist` — ACCUSATIONS, pas des auto-descriptions. Les admettre au tier de
//     l'identité referait le défaut français : la droite entendue seulement quand un tiers la dénonce ;
//   · `patriot` — collisions de noms propres (équipes) et charge asymétrique selon le pays ;
//   · **noms de partis et de mouvements** — la règle écrite (durabilité + symétrie) TIENT pour
//     l'anglais, et l'anglais lui donne un TROISIÈME appui que le français n'avait pas : mesuré,
//     `republican` signifie ANTI-MONARCHISTE en Irlande et au Royaume-Uni, `labour` collisionne avec
//     « labour intensive » et l'accouchement, `green` avec la couleur. C'est une inversion dialectale
//     PIRE que celle de `liberal`, puisqu'elle porte sur des chaînes qu'aucun syntagme ne désambiguïse ;
//   · les mêmes termes en `indirectCore` — HORS PÉRIMÈTRE, décision distincte. La 3ᵉ personne et le
//     syntagme nu restent muets, comme au lot des adjectifs : c'est la porte où `straight` a été
//     mesuré à 1 → 4 torts ;
//   · `fascist` et `nazi` EN — le FR porte `fasciste`, l'anglais les refuse : « grammar nazi »,
//     « gym fascist » rendent l'usage conventionnellement HYPERBOLIQUE (règle d'admission,
//     ADR-0003), et `nazi` vise en outre un tiers (frontière `conflictual`). Cas net où traduire
//     l'entrée FR aurait été l'erreur ;
//   · `welfare` nu (« animal welfare », « child welfare »), `free speech` (revendiqué par tous les
//     camps, donc sans pouvoir discriminant), `culture war` (journalistique bien plus
//     qu'auto-décrit), `illegal immigration` (le qualificatif EST l'objet du litige — pendant EN
//     exact de l'exclusion `immigration clandestine` plus haut).
// SOCIOLECTE (3ᵉ porte d'ADR-0003), vérifié terme à terme et non supposé de l'ensemble : les deux
// registres politiques anglais qui MARQUENT un groupe — le vocabulaire de camp à charge de classe
// (`gammon`, `little englander`, `sheeple`) et le registre patriotique marqué régionalement — n'ont
// aucun candidat ici, les premiers étant des ÉPITHÈTES (exclues en bloc) et le second couvert par
// l'exclusion de `patriot`. Les 25 admis sont des termes de DOCTRINE, non marqués socialement.
//
// ── `liberal` EN : l'inversion dialectale casse un TÉMOIN, pas le PRODUIT ──────────────────────
// La note de portabilité tenait `liberal` pour inadmissible en anglais, son camp s'inversant selon le
// dialecte (gauche aux États-Unis, droite économique au Royaume-Uni). Le fait est exact ; la
// conséquence qu'on en tirait visait la mauvaise cible.
//
// `selfDeclaredEn` NE NOMME JAMAIS, et le constat produit dit `politics` — jamais « gauche », jamais
// « droite ». Le produit n'affiche AUCUN camp, dans aucune langue. Le camp d'un terme n'existe que
// dans le classeur d'un témoin, c'est-à-dire dans du bookkeeping de test. L'inversion casse donc la
// PARTITION, pas la DÉTECTION — et le témoin la range dans un seau `ambiguous` dédié, exactement
// comme le versant français s'est donné un seau `neutral` pour ne pas forcer un camp sur des termes
// qui n'en portent pas.
// Deux syntagmes désambiguïsent par ailleurs ce que le mot nu ne peut pas : `classical liberal`
// (droite économique) et `social democrat` (gauche) entrent chacun de leur côté, sans dépendre du
// lecteur.
//
// ── CE QUE LE TIER EN NE RATTRAPE PAS — l'écart de langue SUBSISTE, par décision ───────────────
// À écrire avant que quiconque cite ce lot comme « la couverture politique anglaise est réparée » :
//     « je suis socialiste »  ×1 → politics[EXPLICIT]
//     « i am a socialist »    ×1 → RIEN
//     « i am a socialist »    ×2 → politics[indirect]
// L'anglais demande DEUX items là où le français en demande un, et il ne NOMME jamais. Ce n'est pas
// un reste de trou : ce sont deux décisions déjà prises ailleurs — l'étage par `selfDeclaredEn` (qui
// n'affirme jamais) et le seuil par le calibrage PANO-33. Ce lot répare l'auto-déclaration RÉPÉTÉE ;
// l'énoncé isolé reste muet, la 3ᵉ personne et le syntagme nu aussi.
//
// ── LA COPULE N'ANCRE RIEN, confirmé sur un SIXIÈME label ──────────────────────────────────────
// Mesuré en écrivant ce lot, et le résultat rejoint celui de `filters-en.ts` : **« i am X about Y »
// est une construction PRODUCTIVE de l'anglais, qui transforme n'importe quel nom d'identité en
// intensificateur** — « i am socialist about splitting the bill », « i am monarchist about chess
// openings ». Aucune charge de sûreté ne pèse donc sur le cadre, ici pas plus qu'ailleurs : ce qui
// protège est l'ÉTAGE (ce tier n'affirme jamais) et le SEUIL, et rien d'autre.
//
// *Le corollaire de méthode, et il a coûté un instrument :* un banc de faux positifs a été écrit pour
// ce lot — deux phrases d'anglais ordinaire par terme — et il **rougit sur 32 termes sur 32**, y
// compris ceux qu'il devait innocenter. Il s'est DISQUALIFIÉ, et son chiffre n'est pas publié : il
// mesure la CONSTRUCTIBILITÉ d'une collision quand la règle d'ADR-0003 porte sur l'usage DOMINANT.
// « im pretty liberal with the garlic » est un idiome réel ; « i am monarchist about chess openings »
// est une phrase fabriquée pour l'occasion. Un instrument qui rend 32/32 ne sépare rien.
//
// ── CE QUE CE LOT N'A PAS MESURÉ, et le zéro est une CÉCITÉ ────────────────────────────────────
// Les deux voix-gardes anglaises scellées ne déclenchent RIEN, avant comme après ce lot. Ce n'est
// PAS un brevet de sûreté : mesuré terme à terme, **aucune des 23 entrées n'apparaît dans le texte
// de l'une ou l'autre garde**. Le zéro dit que les gardes ne contiennent pas ce vocabulaire, pas
// que les gardes le trient bien. Les faux positifs de ce lot sont donc **non mesurés**, exactement
// comme ceux du lot pilote — et la manière dont les termes ont été choisis (des SYNTAGMES, jamais
// les noms nus `election`, `vote`, `taxes`, `political`, `council`, qui eux sont dans le texte des
// gardes) est un raisonnement, pas une mesure.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// Entrées NORMALISÉES (minuscules, sans accents ; tiret = espace). Variantes mécaniques (pluriels,
// allongements, auto-censure) couvertes par la machinerie. Calibrage PANO-33 : seuil 2, colloquial inclus.

import type { TopicalLexicon } from './types';

export const POLITICS_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'politics',
  // Lectures du registre §5 : engagement / militantisme · avis personnel · curiosité / veille.
  readingTemplateIds: [
    'sensitive.politics.reading.engaged',
    'sensitive.politics.reading.irony',
    'sensitive.politics.reading.watch',
  ],
  // Locutions/verbes d'engagement à soi, NON copulaires (le pattern d'auto-déclaration, PANO-72,
  // ne couvre que « je suis X » ; ces formes-ci restent des marqueurs nus).
  explicit: [
    'je vote',
    'je milite',
    "j'adhere",
    "j'ai vote",
    'je voterai',
    "j'irai voter",
    'mon parti',
    'ma famille politique',
    'je manifeste',
    // (EN) Actes d'engagement, au PASSÉ et administratifs — les seules formes anglaises sans emploi
    // figuré. `i vote` NU est exclu : « i vote we order pizza » est l'idiome de PROPOSITION, et
    // c'est l'usage dominant du présent. `registered` nu exclu aussi (registered nurse, post).
    'i voted',
    'i registered to vote',
  ],
  // Étiquettes politiques AUTO-DÉCLARÉES (« je suis de gauche », « chui plutôt anar ») — matchées
  // via le pattern d'auto-déclaration (PANO-72), qui absorbe les variantes contractées et les
  // modificateurs (« je suis un vrai militant ») sans les lister.
  selfDeclaredFr: [
    'de gauche',
    'de droite',
    "d'extreme gauche",
    "d'extreme droite",
    'militant',
    'militante',
    'ecolo',
    'centriste',
    'anarchiste',
    'anar',
    'communiste',
    'socialiste',
    'apolitique',
    'syndique',
    'syndiquee',
    'macroniste',
    'insoumis',
    'insoumise',
    'royaliste',
    'libertaire',
    'marxiste',
    'gaulliste',
    'souverainiste',
    'feministe',
    // Identités de DROITE au tier de l'IDENTITÉ — la réparation de symétrie décrite en tête. Les
    // quatre premières vivent AUSSI en `indirectCore` comme accusations : c'est le point, pas une
    // redondance. Un mot peut être une revendication et une insulte, et le lexique doit lire les
    // deux (précédent posé par `souverainiste` et `macroniste`).
    'nationaliste',
    'patriote',
    'reac',
    'traditionaliste',
    'conservateur',
    'conservatrice',
    'monarchiste',
    'liberal',
    'liberale',
  ],
  // Identités politiques ANGLAISES — matchées via `SELF_DECLARATION_HEADS_EN`, et ce tier
  // n'AFFIRME JAMAIS (constat large ; `TopicalLexicon.selfDeclaredEn`). Justification de la porte
  // d'admission, de `conservative`/`liberal` et de l'écart de langue : en tête de fichier.
  //
  // Les décomptes par camp sont FIGÉS dans `detect/politics-symmetry.test.ts`. L'égalité 10/10 est
  // un CONSTAT, jamais une cible : une liste rendue symétrique par REMPLISSAGE serait un défaut pire
  // que celui qu'on répare — elle aurait l'air juste. Deux arbitrages ont bougé les colonnes sur le
  // fond, et ils se déclarent : `protectionist` ÉCARTÉ de la droite (c'est une accusation bien plus
  // qu'une auto-description — l'y mettre aurait refait le registre 3 français), `classical liberal`
  // ADMIS (auto-description réelle, et elle désambiguïse `liberal`).
  selfDeclaredEn: [
    // — Gauche (10)
    'socialist',
    'communist',
    'marxist',
    'anarchist',
    'leftist',
    'left wing',
    'social democrat',
    'trade unionist',
    'feminist',
    'environmentalist',
    // — Droite (10)
    'conservative',
    'right wing',
    'traditionalist',
    'nationalist',
    'monarchist',
    'royalist',
    'libertarian',
    'fiscal conservative',
    'social conservative',
    'classical liberal',
    // — Sans camp (4)
    'centrist',
    'apolitical',
    'politically homeless',
    'swing voter',
    // — Ambigu par DIALECTE (1) : gauche aux États-Unis, droite économique au Royaume-Uni. Admis
    //   parce que l'inversion casse la partition d'un témoin, pas la détection — le produit
    //   n'affiche aucun camp. Cf. l'en-tête.
    'liberal',
  ],
  indirectCore: [
    // Registre 2 — thématique (vocabulaire de la vie politique).
    'manif',
    'elections',
    'greve',
    'manifestation',
    'petition',
    'reforme',
    'le gouvernement',
    'syndicat',
    'les elus',
    'campagne electorale',
    'scrutin',
    'referendum',
    'abstention',
    'extreme droite',
    'extreme gauche',
    'assemblee nationale',
    'senat',
    'motion de censure',
    'depute',
    'senateur',
    'ministre',
    'premier ministre',
    'president de la republique',
    "pouvoir d'achat",
    'immigration',
    'aller voter',
    'allez voter',
    // Répertoire THÉMATIQUE — la seconde moitié de la réparation. Le tier ne portait que le
    // répertoire de MOBILISATION (manif, grève, syndicat, pétition), qui est celui d'un camp :
    // mesuré, `securite`+`frontieres`, `impots`+`assistanat`, `ordre`+`laicite` ne taguaient rien
    // quand `manif`+`greve` taguait. Chaque entrée est le mot par lequel un camp parle de SON
    // sujet — jamais celui par lequel l'autre le disqualifie.
    'insecurite',
    'assistanat',
    'matraquage fiscal',
    'ordre public',
    'identite nationale',
    'souverainete nationale',
    'fiscalite',
    'redistribution',
    'depenses publiques',
    // Les deux pendants restants : `laicite` est transversale aux camps (c'est un thème, pas un
    // côté), `service public`/`services publics` répond à `depenses publiques`.
    'laicite',
    'service public',
    'services publics',
    // ── (EN) Institutions et procédures — sans camp par construction ─────────────────────────────
    // Le vocabulaire du FONCTIONNEMENT politique n'appartient à personne et ne date pas : c'est ce
    // qui le rend admissible dans un lot dont la contrainte est la symétrie. Chaque entrée est un
    // SYNTAGME, jamais le nom nu — et ce n'est pas une préférence de style, c'est ce qui l'écarte du
    // texte des deux voix-gardes scellées, qui portent `election`, `vote`, `taxes`, `political` et
    // `council` NUS en parlant d'autre chose que d'un engagement.
    'general election',
    'by election',
    'polling station',
    'postal vote',
    'ballot box',
    'parliament',
    'civil service',
    'public spending',
    'voter turnout',
    // ── (EN) Thèmes, en PAIRES APPARIÉES ─────────────────────────────────────────────────────────
    // Règle 2 de l'en-tête, appliquée à l'anglais. Les paires sont appariées sur l'IDIOMATICITÉ, pas
    // sur le nombre : un tableau équilibré en colonnes peut rester asymétrique en CHEMINS si le
    // terme d'un camp est celui qu'on écrit vraiment et celui de l'autre une traduction de bureau.
    // `law and order` est la locution idiomatique de son bord ; `public services` l'est du sien.
    'minimum wage', //      ↔ tax burden
    'tax burden',
    'trade union', //       ↔ red tape
    'red tape',
    'food bank', //         ↔ border control
    'border control',
    'public services', //   ↔ law and order
    'law and order',
    'means test', //        ↔ red tape (second locution de procédure, l'autre bord)
    'means tested',
    'public money',
    // Transversal aux camps — un thème, pas un côté (même statut que `laicite` côté FR).
    'cost of living',
    // Registre 3 — opinion / jugement, catégories péjoratives (JAMAIS de personnes nommées).
    'fasciste',
    'facho',
    'fascisme',
    'dictature',
    'dictateur',
    'totalitaire',
    'autoritaire',
    'propagande',
    'propagandiste',
    'liberticide',
    'corrompu',
    'corruption',
    'a la solde de',
    'gaucho',
    'gocho',
    'gauchiste',
    'droitard',
    'bourge',
    'beauf',
    'woke',
    'wokisme',
    'boomer',
    'bobo',
    'reac',
    'islamo gauchiste',
    'collabo',
    'complotiste',
    'fachosphere',
    'communautariste',
    'mondialiste',
    'souverainiste',
    'nationaliste',
    'populiste',
    'extremiste',
    'macroniste',
    'antivax',
    'anti vax',
  ],
  // Familier — polysémiques hors contexte politique (« vendu ma voiture », « film pourri ») : le
  // seuil 2 + le voisinage font le tri.
  indirectColloquial: [
    'ecologie',
    'on lache rien',
    'la mairie',
    'politise',
    'ecolo',
    'tous pourris',
    'traitre',
    'vendu',
    'pourri',
    'les elites',
    'moutons',
    'coco',
    'assistes',
    'fake news',
    'retraites',
    // Écrits au SINGULIER : la tolérance de pluriel AJOUTE un `s` au marqueur, elle n'en retire
    // pas — « impots » n'aurait pas matché « impot ». Colloquiaux parce que tous deux ont un
    // emploi administratif ordinaire (déclaration d'impôt, frontière d'un pays sur une carte) ;
    // le seuil 2 et le voisinage font le tri.
    'impot',
    'frontiere',
  ],
  // Label de SUJET : la négation dégrade au lieu de supprimer (ADR-0003, *L'état et le sujet*).
  // Sans ce drapeau, le produit n'entendait que celui qui ADHÈRE — mesuré : « ces fachos partout »
  // taguait, « je supporte pas les fachos » ne taguait rien. L'opposition est le registre dominant
  // du discours politique ; en être sourd n'est pas une prudence, c'est un silence orienté.
  subjectNotState: true,
  includeColloquial: true,
  indirectThreshold: 2,
};
