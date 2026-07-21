// Listes EN GÉNÉRIQUES des filtres contextuels (PANO-35, lot 1) — pendant EXACT de `filters-fr.ts`.
// Mêmes natures, même rôle : ce sont des DONNÉES transverses de la machinerie, pas du lexique de
// label. La négation, le discours rapporté et la 3ᵉ personne sont de l'anglais courant, identiques
// quel que soit le sujet détecté.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Chaque liste vient de la grammaire / l'usage courant de l'EN (négations canoniques et leurs
// contractions, verbes de parole du discours rapporté, désignations usuelles de proches), écrites à
// l'aveugle depuis l'usage commun. Aucun terme n'est issu ni inspiré d'un export d'une personne
// réelle.
//
// ── POURQUOI CE LOT EXISTE, ET POURQUOI IL VIENT EN PREMIER ───────────────────────────────────
// Mesuré (`docs/portabilite-en-filtres.md`) : sur du texte EN, les filtres FR ne matchent rien.
// Les trois filtres PROTECTEURS échouaient donc OUVERT — « i am NOT in depression », « SHE TOLD ME
// her depression is hard » et « MY SISTER has depression » produisaient tous trois un tag NOMMÉ
// `mental_health` sur le locuteur (violant SENS-B3 et SENS-C1/C2), par simple HOMOGRAPHIE FR/EN
// (« depression », « burnout », « diabetes » via le pluriel `s?`) — sans qu'aucun marqueur EN n'ait
// jamais été ajouté aux lexiques sensibles. Ce lot referme cette porte.
//
// ── SENS DE L'ÉCHEC : c'est ce qui rend ce lot SÛR à livrer seul ──────────────────────────────
// Les trois listes ci-dessous ne peuvent que SUPPRIMER un hit (négation, citation) ou le DÉGRADER
// en indirect (3ᵉ personne). Elles échouent donc CLOSED : appliquées à tort (un mot EN présent dans
// un texte FR), elles coûtent du RAPPEL, jamais de la précision sur le sensible. C'est pourquoi
// elles sont appliquées à TOUS les items sans détection de langue — le sur-filtrage est la
// direction sûre, et il évite d'introduire un classifieur de langue (qui, lui, aurait ses propres
// faux positifs). Le comportement FR est verrouillé par ses goldens, inchangés.
//
// ── L'AUTO-DÉCLARATION EN EST LIVRÉE (lot des adjectifs d'appartenance) ───────────────────────
// `SELF_DECLARATION_HEADS_EN` existe désormais, apparié à `TopicalLexicon.selfDeclaredEn`, et ce
// tier ATTERRIT EN LARGE — il ne NOMME jamais. La justification complète vit sur les deux
// déclarations (têtes ici, tier dans `lexicon/types.ts`).
//
// ── CE QUI A DÉBLOQUÉ LE LOT 2, ET CE N'ÉTAIT PAS L'INSTRUMENT QU'IL RÉCLAMAIT ────────────────
// Ce fichier a longtemps porté que le blocage était la CÉCITÉ du banc EN : il ne pouvait pas
// mesurer la copule, la fixture ayant évité les exclusions figées qui sont précisément les termes
// candidats. Le diagnostic était juste sur le banc, et FAUX sur ce qu'il fallait en conclure —
// la note de critères d'alors (ex-`docs/criteres-mesure-copule-en.md`, supprimée depuis)
// spécifiait deux voix de plus pour mesurer un ancrage qui N'EXISTE PAS.
//
// Ce qui manquait n'était pas un banc capable de mesurer la copule : c'était de savoir que **la
// copule n'ancre rien en anglais**. La mesure est écrite sur `SELF_DECLARATION_HEADS_EN`, avec ses
// phrases. Une fois le cadre déchargé de toute sûreté, le lot se livre sans les deux voix
// réclamées — parce que ce qui protège n'est plus le cadre mais l'ÉTAGE, et un tier qui n'affirme
// jamais n'a pas de taux de sur-affirmation à mesurer.
//
// Reste vrai, et à ne pas relire de travers : le banc EN ne mesure toujours pas le rappel de ce
// chemin. Ce qui le mesure est le banc `en_identity` (`en-identity-bench.test.ts`), dont les voix
// portent l'appartenance en clair.
//
// ── CORRECTION D'UN CONSTAT DE CE FICHIER, qui était FAUX ─────────────────────────────────────
// Une version antérieure affirmait ici qu'il n'y a « pas de moitié sûre à livrer », au motif que le
// passif diagnostique n'ouvrirait que les mêmes étiquettes d'état polysémiques que la copule nue.
// **C'était vrai de `mental_health` seul, et faux du lot.** Le raisonnement portait sur un lexique
// et a été généralisé aux six sans être revérifié.
//
// Mesuré depuis : les têtes EN, à elles seules et SANS aucun terme ajouté, activent QUINZE graphies
// anglaises déjà présentes dans les tiers d'auto-déclaration de `religion`, `sexuality` et
// `politics` — « im ace at darts » posait un constat `sexuality[explicit]`. La charge utile d'une
// tête EN n'est donc pas une poignée d'étiquettes d'état : c'est un tier entier de termes d'identité
// que personne n'a jamais examinés pour l'anglais.
//
// D'où la PORTE DE LANGUE, livrée séparément : `selfDeclaredFr` est apparié à ces têtes-ci, et une
// tête anglaise devra naître avec son propre `selfDeclaredEn`. Témoin :
// `selfdeclared-language-gate.test.ts`. Tant que la porte tient, ce fichier peut recevoir des têtes
// EN sans activer quoi que ce soit par accident — mais il n'en reçoit toujours aucune, faute de la
// mesure décrite ci-dessus.
//
// ── QUAND LES MODIFICATEURS EN ARRIVERONT : ils se choisissent sur la GRAMMAIRE ────────────────
// Écrit ici parce que c'est la fausse bonne idée qui se re-proposera, et qu'elle a été examinée
// puis ÉCARTÉE (arbitrage 2026-07-18). Omettre « so » et « literally » de la liste des
// modificateurs pour écarter l'hyperbole ne filtre rien : ça bloque « im so depressed » en laissant
// passer « im depressed » nu — l'inverse de l'effet cherché, et pas défendable dans l'autre sens
// non plus. C'est l'erreur du SEUIL en costume neuf : régler la machinerie pour lui faire porter
// une sûreté qu'elle ne porte pas (ADR-0003, *La porte, pas le seuil*).
// Les modificateurs EN se choisiront donc sur la grammaire et le rappel, et ils ne portent AUCUNE
// charge de sûreté. Celle-ci vit à la porte d'admission des termes, et nulle part ailleurs.
//
// Toutes les entrées sont déjà en forme NORMALISÉE (minuscules, sans accents ; apostrophe droite —
// `normalize-fr` unifie `’` → `'`, et le tiret vaut espace).

/**
 * TÊTES DE COPULE EN — appariées à `TopicalLexicon.selfDeclaredEn`, et à lui seul.
 *
 * ══ LA COPULE NE DÉSAMBIGUÏSE PAS EN ANGLAIS ═════════════════════════════════════════════════════
 * C'est le résultat central du lot, il contredit la prémisse sur laquelle PANO-35 lot 2 a été fermé
 * DEUX FOIS, et il doit se lire avant toute proposition qui touche à ces têtes.
 *
 * La doctrine de la copule est écrite en français, dans `selfDeclaredFr` : « la copule ancre la
 * 1ʳᵉ personne », donc un terme trop ambigu nu (« dépressif », « lesbienne ») devient fiable une
 * fois cadré. **Ce jugement NE TRAVERSE PAS.** L'anglais courant écrit son hyperbole et sa figure à
 * la première personne, exactement dans le même cadre. Mesuré, et ce ne sont pas des cas limites :
 *
 *     « im so ocd about my desk drawers »          « im autistic about train timetables »
 *     « im arthritic after that hike »             « im depressed that the bakery closed early »
 *     « im dyslexic when it comes to left and right »   « im an insomniac when there is a new season »
 *
 * Le cadre est là, entier, dans chacune. Un mécanisme qui compte sur lui pour séparer l'aveu de la
 * figure ne sépare rien.
 *
 * *Ce que ça invalide, et il vaut mieux l'écrire que de le laisser se re-dériver :* les deux
 * fermetures de PANO-35 lot 2 ont cherché ce qui manquait du côté des TÊTES et de la MESURE, sur la
 * prémisse que le cadre, une fois livré, ancrerait. Il n'ancre pas. Ce qui manquait n'était pas un
 * banc capable de mesurer la copule : c'était de savoir que la copule n'est pas un filtre.
 *
 * **RÈGLE, et elle se cite pour refuser :** aucune charge de SÛRETÉ ne se pose sur le cadre. Ni sur
 * les têtes, ni sur les modificateurs (arbitrage 2026-07-18, déjà écrit plus haut dans ce fichier et
 * désormais mesuré plutôt que raisonné). Ce que le cadre achète est du RAPPEL, et rien d'autre : il
 * rend `straight` admissible là où le terme NU en `indirectCore` a été mesuré à 1 → 4 torts. La
 * sûreté vit à la porte d'admission des termes et à l'ÉTAGE — `selfDeclaredEn` n'affirme jamais.
 *
 * ── CE QUE CETTE LISTE NE COUVRE PAS ────────────────────────────────────────────────────────────
 * Les têtes non copulaires (« ive always been », « i grew up », « turns out im ») lui échappent —
 * même limite déclarée que le registre de la porte de langue. `i was raised` est admise parce que
 * c'est la tournure d'appartenance religieuse la plus ordinaire de l'anglais (« i was raised
 * catholic ») et qu'elle n'a pas d'équivalent lexical ailleurs.
 */
export const SELF_DECLARATION_HEADS_EN: readonly string[] = [
  'i am',
  'im',
  "i'm", // les deux graphies : `normalize-fr` conserve l'apostrophe, l'usage d'internet l'omet
  'i identify as',
  'i was raised',
];

/**
 * Modificateurs EN entre la copule et le terme — de la GRAMMAIRE, aucune charge de sûreté (règle
 * ci-dessus). Ils rendent « i am a lesbian » et « i am a trans woman » atteignables.
 *
 * Ils sont COMPOSÉS avec les modificateurs FR dans `filters.ts`, et non appariés par langue comme le
 * sont les têtes. Ce n'est pas un relâchement de la porte : un modificateur ne peut atteindre aucun
 * terme sans une TÊTE de sa propre langue, et le couple (têtes, termes) reste apparié au site
 * d'appel. Mesuré : la composition ne déplace aucun compteur des bancs français.
 */
export const SELF_DECLARATION_MODIFIERS_EN: readonly string[] = [
  'a',
  'an',
  'the',
  'so',
  'very',
  'pretty',
  'quite',
  'proudly',
  'openly',
  'also',
  'still',
  // Ajouté DÉLIBÉRÉMENT par le lot `politics` EN, pour crever un vert qu'on savait faux. Le
  // raisonnement et sa mesure sont ci-dessous — ne pas le retirer sans les lire.
  'extremely',
];

// ── `extremely`, ET LE VERT QU'IL A CREVÉ — la mesure, pas l'intention ─────────────────────────
// Le lot `politics` EN a trouvé que les deux voix-gardes anglaises scellées ne devaient leur zéro
// de faux positif qu'à l'INCOMPLÉTUDE de deux listes — celle-ci et `SELF_DECLARATION_HEADS_EN` —
// dont ce fichier déclare en toutes lettres qu'elles ne portent AUCUNE charge de sûreté et seront
// étendues sur la grammaire et le rappel. `en_ironic` écrit « i am EXTREMELY radical about bin
// collection day » : mesuré, « i am radical », « i am very radical », « i am pretty radical »
// tagueraient tous, et seul le choix du mot `extremely` par l'autrice de la voix la protégeait.
//
// **Un plancher de faux positifs FICTIF est pire qu'un tort mesuré** : il se cite comme une sûreté,
// et il tombe le jour où un lot sans rapport ajoute un modificateur pour du rappel — c'est-à-dire au
// moment précis où plus personne ne relit ceci. Le mot est donc ajouté ICI, à découvert.
//
// CE QUE LA MESURE A RENDU, et ce n'est PAS ce que le lot attendait : **zéro tort**, sur les deux
// gardes, item par item. Le tort annoncé n'existe pas, et il faut dire par quel CHEMIN ce zéro
// arrive, sans quoi il vaudrait le vert qu'on vient de crever :
//   · `radical` — le terme qui aurait tagué — est EXCLU du lexique par décision (adjectif d'usage
//     général, règle d'admission ADR-0003). **C'est la porte d'admission qui protège, pas le
//     modificateur** — et c'est le résultat qu'on voulait établir ;
//   · anti-vacuité : `extremely` n'est pas inerte pour autant — « i am extremely socialist » ×2
//     pose bien un constat large, là où il n'en posait aucun avant.
//
// ── LA DETTE QUI RESTE, et elle est PIRE que celle qu'on vient de solder ───────────────────────
// La seconde liste n'a PAS été touchée, et le trou y est vivant. `en_ironic` écrit « I HAVE DECIDED
// TO BECOME a centrist » — et `centrist` EST admis au lexique. MUTATION PASSÉE, résultat relevé :
// ajouter `'i have decided to become'` aux têtes ci-dessus fait taguer cet item, sur une voix
// scellée NON-PORTEUSE. Toute tête d'acquisition (« i became », « ive become », « i turned »)
// produirait le même effet, et chacune est un ajout de rappel parfaitement légitime.
//
// **ET LE BANC NE LE VERRAIT PAS.** Mesuré aussi, et c'est le point le plus dur : avec la tête
// ajoutée et le tort présent, la SUITE ENTIÈRE reste verte. `en_ironic` ne porte qu'UN item
// déclencheur, `politics` est à seuil 2, donc la voix entière rend `RIEN` et le banc — qui mesure la
// voix, pas l'item — ne rougit pas. Un tort à un item est INVISIBLE à cet instrument ; il en
// faudrait deux.
//
// Ce qui verrait ce tort est une assertion ITEM PAR ITEM sur les gardes, qui n'existe pas. Tant
// qu'elle manque, le plancher de faux positifs des voix anglaises est une ACCEPTATION ASSUMÉE — le
// mot est *assumée*, jamais *mesurée*, et le passage à *mesurée* serait un événement daté.

/** Mots de négation EN (fenêtre AVANT le marqueur — cf. `NEGATION_WINDOW`, partagée avec le FR). */
export const NEGATIONS_EN: readonly string[] = [
  'not',
  'never',
  'no',
  'none',
  'nothing',
  'nobody',
  'nowhere',
  'without',
  'nor',
  'neither',
  'cannot',
  // Contractions — les DEUX graphies : `normalize-fr` conserve l'apostrophe (« don't »), mais
  // l'usage d'internet écrit tout autant sans (« dont »). La comparaison est une égalité de token.
  "don't",
  'dont',
  "doesn't",
  'doesnt',
  "didn't",
  'didnt',
  "isn't",
  'isnt',
  "wasn't",
  'wasnt',
  "aren't",
  'arent',
  "weren't",
  'werent',
  "won't",
  'wont',
  "can't",
  'cant',
  "couldn't",
  'couldnt',
  "shouldn't",
  'shouldnt',
  "wouldn't",
  'wouldnt',
  "haven't",
  'havent',
  "hasn't",
  'hasnt',
  "hadn't",
  'hadnt',
  "ain't",
  'aint',
];

/**
 * Verbes d'OMISSION EN : omission + négation = double négation qui AFFIRME l'objet (« i never miss
 * mass » = pratique assidue). Pendant de `OMISSION_VERBS` (« je rate jamais la priere », mesuré
 * PANO-33).
 *
 * SEULE liste de ce module qui échoue OPEN (elle ANNULE une négation). Tenue volontairement COURTE
 * et sans ambiguïté FR : le seul homographe FR est « miss » (titre de concours), dont la
 * co-occurrence avec une négation ET un marqueur sensible dans la même fenêtre est inerte.
 */
export const OMISSION_VERBS_EN: readonly string[] = [
  'miss',
  'misses',
  'missed',
  'skip',
  'skips',
  'skipped',
];

/**
 * Discours rapporté EN — formes AVEC verbe de parole seulement. Même piège que le FR (mesuré
 * PANO-33) : le PASSIF MÉDICAL n'est PAS une citation — « i was told i have… » / « i was diagnosed »
 * rapportent un diagnostic reçu, pas les propos d'un tiers sur un tiers. D'où l'absence volontaire
 * de « was told » et de « told me i » nus.
 */
export const CITATION_MARKERS_EN: readonly string[] = [
  'told me',
  'called me',
  'said that',
  'according to',
  'apparently',
  'they say',
  'people say',
  'he said',
  'she said',
  'they said',
];

/**
 * Marqueurs de 3ᵉ personne EN — l'axe « pour qui » (ADR-0003) : le signal existe mais concerne
 * un proche → DÉGRADÉ en indirect (chemin signal-sans-vécu), JAMAIS supprimé.
 *
 * ── CE QUE CETTE LISTE COUVRE, ET CE QU'ELLE A LONGTEMPS MANQUÉ ──────────────────────────────────
 * Livrée au lot 1 sur la famille nucléaire AMÉRICAINE, et l'angle mort n'était pas les
 * grands-parents seuls : « my mum » — la forme britannique la plus courante pour la mère — n'était
 * pas couverte non plus, ni aucune parenté élargie. Mesuré : « my nan has diabetes » posait un
 * constat NOMMÉ sur le locuteur.
 *
 * L'écart n'était pas visible sur `mental_health`, et il faut dire pourquoi, sinon il se
 * reproduira : ses noms de trouble les plus fréquents vivent au tier `indirectSolo` et ne peuvent
 * STRUCTURELLEMENT plus nommer. « my nan has depression » dégradait déjà — mais grâce au tier, pas
 * grâce à cette liste. Le défaut est apparu sur le premier label dont les noms de condition sont
 * restés en `explicit`.
 *
 * La parenté élargie n'est pas un ornement sur un label de santé physique : le diabète, l'AVC, le
 * cancer sont ce dont on parle à propos d'un grand-parent.
 *
 * NOTE (ex-écart FR) : cette liste a longtemps porté que le FR manquait « ma mere » / « mon pere ».
 * C'est RÉSOLU — `filters-fr.ts` porte désormais parents, grands-parents, oncles et cousins, et le
 * FR ne présente plus cet écart (vérifié plutôt que supposé : « le diabete de ma mamie » dégrade).
 *
 * EXCLUS À DESSEIN : les animaux (« my dog has diabetes » est une recherche massive et réelle). La
 * dégradation irait dans la direction sûre, mais un animal n'est pas une 3ᵉ personne — l'axe « pour
 * qui » suppose un « qui ». Les faire entrer ici changerait le sens de la liste sans le dire ; s'ils
 * doivent être couverts, c'est par une décision propre.
 */
export const THIRD_PERSON_EN: readonly string[] = [
  'my sister',
  'my brother',
  'my son',
  'my daughter',
  'my kid',
  'my child',
  'my teen',
  'my teenager',
  'my mom',
  'my mum', // (BrE) — absent du lot 1, et c'est la forme la plus courante hors Amérique du Nord
  'my mother',
  'my dad',
  'my father',
  'my parents',
  'my friend',
  'my best friend',
  'my partner',
  'my boyfriend',
  'my girlfriend',
  'my wife',
  'my husband',
  'my roommate',
  'my coworker',
  'a friend of mine',
  // Parenté ÉLARGIE — pendant de la liste FR (« ma mamie », « mon papy », « mon oncle »,
  // « ma tante », « mon cousin »), qui la porte depuis son propre comblement.
  'my grandma',
  'my grandmother',
  'my grandpa',
  'my grandfather',
  'my grandparents',
  'my nan', // (BrE) — « my grandmother » ne l'attrape pas, la frontière de mot les sépare
  'my nana',
  'my gran',
  'my granny',
  'my grandad',
  'my granddad',
  'my uncle',
  'my aunt',
  'my auntie',
  'my cousin',
  'my nephew',
  'my niece',
  'my in laws', // le tiret vaut espace (normalize-fr) : couvre « my in-laws »
  'for my',
  'helping my',
  'help my',
  'support my',
  'supporting a',
];

/**
 * REGISTRE INFORMATIONNEL (EN) — marqueurs de cadrage documentaire.
 *
 * Même rôle et même critère d'admission que la liste FR (`filters-fr.ts` en porte la justification
 * complète) : abaisser l'étage d'un constat, jamais le supprimer. Un marqueur entre s'il signale que
 * l'item **interroge, définit ou quantifie** une condition.
 *
 * `symptoms of` plutôt que `symptoms` nu, contrairement au FR : l'anglais construit « my symptoms »
 * bien plus volontiers que le français ne construit « mes symptômes », et dégrader celui qui décrit
 * SES symptômes est exactement ce que cette règle ne doit pas faire. Le français paie l'inverse —
 * « symptomes depression ado » n'a pas de préposition à quoi s'accrocher.
 */
export const INFORMATIONAL_EN: readonly string[] = [
  // Interroger.
  'signs of',
  'sign of',
  'symptoms of',
  'symptom of',
  'causes of',
  'what is',
  'what are',
  'what causes',
  'is it normal',
  'how to spot',
  'how to recognize',
  'how to recognise',
  'how to tell if',
  'how to help',
  'how to support',
  // Solliciter l'expérience d'AUTRUI (voir `filters-fr.ts` pour la justification de catégorie).
  'testimonial',
  'experiences with',
  'anyone else',
  'has anyone',
  'what is it like',
  'reviews of',
  // Définir.
  'difference between',
  'definition of',
  'meaning of',
  'types of',
  'explained',
  // Quantifier.
  'prevalence of',
  'rates of',
  'statistics',
  'meta analysis',
  'systematic review',
  'evidence base',
];

/**
 * LOCUTIONS COUVRANTES (EN) — un marqueur STRICTEMENT contenu dans l'une d'elles ne compte pas.
 *
 * ── Le défaut mesuré, et pourquoi il n'est pas celui qu'on avait écrit ───────────────────────────
 * Le terme `therapy` de `mental_health` porte une réserve documentée depuis le lot pilote. Elle
 * vise l'emploi FIGURÉ (« retail therapy », « music is my therapy ») et s'en remet au seuil de 2,
 * justifié comme filtre de POLYSÉMIE.
 *
 * Le premier tour du banc du corps a trouvé autre chose. L'aidante d'une personne ayant fait un AVC
 * écrit « occupational therapy home assessment » et « aphasia speech therapy waiting list » : le
 * corps de sa mère, lu comme la santé MENTALE de la fille — mauvaise personne ET mauvais sujet. Ce
 * n'est pas de l'emploi figuré, c'est du vocabulaire clinique parfaitement littéral appartenant à un
 * AUTRE domaine médical. Et sur ce registre le seuil ne départage rien : une aidante d'AVC écrit
 * « therapy » plusieurs fois par nécessité, donc la répétition ACCUMULE au lieu de filtrer — le
 * raisonnement d'ADR-0003 sur l'hyperbole, dans un cas que personne n'avait classé là.
 * La réserve n'a donc pas cédé : elle CACHAIT une seconde faille.
 *
 * ── Pourquoi cette forme, et pas un retrait ──────────────────────────────────────────────────────
 * `therapy` est un terme LIVRÉ : il ne se retire pas par doctrine (ADR-0003, *Admettre n'est pas
 * évincer*), et il porte un rappel réel — la voix en détresse du banc EN le déclenche. Le geste
 * juste n'est pas de lui retirer du signal, c'est de laisser le domaine voisin RÉCLAMER le sien :
 * `health_physical` porte désormais les syntagmes de rééducation, et la locution couvrante empêche
 * le marqueur court de les lire au passage.
 *
 * La règle est donc « le plus long gagne », et la contenance est STRICTE : un syntagme ne se bloque
 * pas lui-même. `occupational therapy` matche pour `health_physical` ; c'est `therapy` seul, à
 * l'intérieur, qui tombe.
 *
 * ── Ce que cette liste n'est PAS ─────────────────────────────────────────────────────────────────
 * Pas une liste d'exclusions de lexique — celles-là s'écrivent en n'admettant pas le terme. Elle
 * n'existe que pour les cas où un marqueur COURT et légitime est avalé par un syntagme qui veut
 * dire autre chose. Chaque entrée doit nommer le marqueur qu'elle protège, sinon elle ne tourne
 * pour personne.
 */
export const COVERING_PHRASES_EN: readonly string[] = [
  // Protègent `therapy` (`mental_health`) — rééducations PHYSIQUES, réclamées par `health_physical`.
  'occupational therapy',
  'speech therapy',
  'speech and language therapy',
  'physical therapy',
  // Protège `therapy` aussi — mais ici rien ne réclame, et c'est voulu : l'emploi est FIGURÉ. Ce
  // sont les deux tournures que la réserve écrite du lot pilote nommait sans pouvoir les écarter.
  'retail therapy',
  'music is my therapy',
  // ── Écartent `woke` (`politics`) employé comme PASSÉ DE *WAKE* ─────────────────────────────────
  // `woke` est une entrée FR qui traverse (le terme politique s'écrit à l'identique dans les deux
  // langues) et qui matche l'anglais le plus ordinaire : mesuré, quatre items « i woke up… » posent
  // un constat `politics[indirect]`.
  //
  // Il ne s'ÉVINCE PAS : il se déclenche aussi sur des porteurs (« the woke crowd »), et ADR-0003
  // (*Le faux positif n'est PAS un motif de retrait*) ne fait partir que le terme qui ne discrimine
  // PAS DU TOUT. La ligne passe entre « discrimine mal » et « ne discrimine pas », et `woke` est du
  // premier côté.
  //
  // Les huit frames ci-dessous sont toutes du côté COMPLÉMENT (verbe + particule / objet /
  // préposition), jamais du côté sujet. C'est ce qui les rend tenables : couvrir les frames sujet
  // demanderait d'énumérer les pronoms anglais, ce qui est une grammaire déguisée en liste — et
  // l'emploi politique est attributif ou prédicatif (« the woke X », « is woke »), donc il ne suit
  // jamais l'un de ces huit mots.
  //
  // RÉSIDU DÉCLARÉ, et il est mesuré plutôt que supposé : ce qui reste tague, c'est `woke` suivi
  // d'un mot HORS de cette liste — une conjonction, un adverbe, une préposition non listée. Mesuré :
  // « i woke and it was already dark », « she woke suddenly », « he woke before the alarm »,
  // « i woke because of the storm » posent tous encore un constat. Les huit frames prennent le
  // volume (la particule `up` et les objets pronominaux), pas la queue de distribution — et
  // l'allonger mot à mot serait réécrire la grammaire anglaise dans une liste de locutions.
  'woke up',
  'woke me',
  'woke him',
  'woke her',
  'woke us',
  'woke them',
  'woke at',
  'woke to',
];

/**
 * REGISTRE INFORMATIONNEL (EN) — têtes de COMPOSÉ, qui ne comptent qu'APRÈS un terme du lexique.
 *
 * ── Le défaut que cette liste referme ────────────────────────────────────────────────────────────
 * La liste ci-dessus est ancrée sur des PRÉPOSITIONS (« symptoms of », « signs of »). Or l'anglais
 * construit sa requête de santé la plus fréquente en composé nom-nom ANTÉPOSÉ. Mesuré :
 *
 *     « symptoms of diabetes » → constat large        « diabetes symptoms » → constat NOMMÉ
 *
 * La règle d'étage était donc absente exactement là où l'anglais met son trafic. Ce n'est pas propre
 * à un label : « burnout symptoms » nommait aussi. Le français ne présente PAS ce défaut (vérifié) —
 * il porte « symptomes » NU, et ses deux ordres de mots dégradent déjà. D'où une liste EN seule.
 *
 * ── Pourquoi une liste SÉPARÉE, et pas « symptoms » nu dans la liste du dessus ────────────────────
 * Parce que la liste du dessus a écarté « symptoms » nu DÉLIBÉRÉMENT, et que la raison tient
 * toujours : l'anglais construit « my symptoms » très volontiers, et dégrader celui qui décrit SES
 * symptômes est précisément ce que cette règle ne doit jamais faire. L'ancrage sur le terme est ce
 * qui sépare les deux cas — « diabetes symptoms » interroge une condition, « my symptoms have been
 * worse » décrit la sienne. Rouvrir la décision du dessus aurait échangé un défaut contre l'autre.
 *
 * ── Critère d'admission — le même que la liste du dessus, et il exclut plus qu'on ne croit ────────
 * Une tête entre si le composé INTERROGE, DÉFINIT ou QUANTIFIE. Sont donc EXCLUS, et c'est mesuré
 * plutôt que supposé : `treatment`, `cure`, `diet`, `medication`. « diabetes treatment » ne
 * documente pas, il cherche un SOIN — et chercher un soin pour soi est un signal de vécu, pas son
 * contraire (ADR-0003, *« Pour qui », pas « quel mot »*). Le français traite « traitement du
 * diabete » en NOMMÉ pour la même raison, dans les deux ordres de mots : ce n'est pas un écart
 * entre langues à rattraper, c'est la règle qui refuse de s'étendre là où elle n'a rien à faire.
 *
 * Les têtes déjà couvertes NUES par la liste du dessus (« explained », « statistics ») ne sont pas
 * répétées ici : « diabetes explained » dégrade déjà.
 */
export const INFORMATIONAL_SUFFIXES_EN: readonly string[] = [
  // Interroger.
  'symptoms',
  'symptom',
  'signs',
  'sign',
  'causes',
  'cause',
  'risk factors',
  // Quantifier — les formes antéposées de « prevalence of » / « rates of ».
  'prevalence',
  'rates',
];
