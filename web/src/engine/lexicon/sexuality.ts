// Lexique `sexuality` (PANO-72, passe 2) — orientation / identité de genre.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Vocabulaire d'orientation et d'identité du FR courant, écrit à l'aveugle depuis l'usage commun
// (incluant les emprunts anglais LEXICALISÉS chez les francophones : « coming out », « wlw »),
// jamais depuis un export. Le label détecte TOUTE orientation/identité, symétriquement — vécu,
// hétéro comme non-hétéro (neutralité §4.3 tenue par la SYMÉTRIE, pas par l'omission).
// FRONTIÈRES tenues :
//   · orientation/identité (le label) ≠ INSULTE à connotation sexuelle visant une personne (→
//     `conflictual`, jamais ici) ;
//   · SLUR d'identité (jamais une auto-désignation) : visant une personne → conflictual ; visant
//     un GROUPE dans l'absolu → futur label dédié, SIGNALÉ, exclu partout pour l'instant ;
//   · règle catalogue « jamais nommer depuis l'indirect » : les identités nues vivent en
//     `indirectCore` (tag large, « cette actrice est lesbienne » reste indirect) ; seul le pattern
//     d'auto-déclaration (« je suis lesbienne ») produit un tag nommé.
// Pas d'emprunt anglais généraliste (dette PANO-35, FR-only v1) : seulement le lexicalisé.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// Entrées NORMALISÉES. Seuil 1 (calibrage PANO-33 — coût outing) : le colloquial est DÉSACTIVÉ
// (à seuil 1, un seul hit colloquial taguerait ; on n'y met donc que du signal communautaire net,
// tout en `indirectCore`). Exclusions assumées (décision yuya) : « arc-en-ciel »,
// « entre filles/meufs » EXCLUS (FP météo/amitié à seuil 1) ; « yuri/yaoi » EXCLUS (fiction).

import type { TopicalLexicon } from './types';

export const SEXUALITY_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'sexuality',
  // Lectures du registre §5 : vécu personnel · allié · curiosité.
  readingTemplateIds: [
    'sensitive.sexuality.reading.lived',
    'sensitive.sexuality.reading.ally',
    'sensitive.sexuality.reading.curiosity',
  ],
  // Auto-référence NON copulaire (locutions) — le tag nommé passe surtout par `selfDeclared`.
  //
  // « ma transition » NU A ÉTÉ RETIRÉ D'ICI, et il faut dire ce qu'il faisait : il posait un constat
  // NOMMÉ — celui qui oute — sur « ma transition vers le management a pris deux ans ». Mesuré, en
  // français livré. Le possessif avait été pris pour la forme PORTÉE qui désambiguïse (ADR-0003,
  // deuxième porte) ; il ne l'est pas, parce que « ma transition professionnelle » est portée
  // exactement pareil. Ce qui distingue une transition de genre d'une reconversion n'est pas le
  // possessif, c'est le DOMAINE — d'où les quatre formes qualifiées ci-dessous.
  //
  // Le terme nu n'est pas évincé pour autant : il vit désormais en `indirectCore`. DÉMOTION, PAS
  // FILTRAGE — même geste que la question rapportée, et pour la même raison. Quelqu'un qui écrit
  // « ma transition » sans autre mot parle très probablement de la sienne ; lui retirer son constat
  // serait faux, et le lui laisser NOMMÉ l'oute sur une phrase de carrière. Il reste, il n'affirme
  // plus.
  explicit: [
    'mon coming out',
    "j'ai fait mon coming out",
    'ma transition de genre',
    'ma transition hormonale',
    'transition de genre',
    'mon parcours de transition',
  ],
  // Identités AUTO-DÉCLARÉES (« je suis lesbienne », « chui non binaire ») → tag nommé via pattern.
  // Symétrie : « hétéro » inclus (toute orientation exposée, décision yuya).
  selfDeclaredFr: [
    'gay',
    'lesbienne',
    'bi',
    'bisexuel',
    'bisexuelle',
    'homo',
    'homosexuel',
    'homosexuelle',
    'trans',
    // Synonyme exact de `trans` pour une auto-déclaration, et il n'y était pas : « je suis
    // transgenre » rendait un constat LARGE là où « je suis trans » en rendait un NOMMÉ. La même
    // phrase recevait deux confiances selon le mot choisi, ce qu'aucune doctrine ne demande.
    'transgenre',
    'queer',
    // « pan » nu écarté (sondage FP PANO-72 : « je suis un pan de mur ») — pansexuel(le) suffit.
    'pansexuel',
    'pansexuelle',
    'non binaire',
    'enby',
    'asexuel',
    'asexuelle',
    'ace',
    'aro',
    'hetero',
    // ── LES QUATRE TERMES DE LA RÉPARATION DE SYMÉTRIE FR (règle ratifiée) ───────────────────────
    // Une auto-déclaration « je suis hétéro » ou « je suis cis » doit déclencher EXACTEMENT AUTANT
    // que « je suis gay » ou « je suis trans ». Le fondement décide de la forme : un lexique qui
    // n'attrape que les identités MINORITAIRES est un détecteur de minorités, pas un détecteur
    // d'orientation — et sa démonstration s'inverse, puisqu'il prétend montrer ce qu'une plateforme
    // déduit de tout le monde en ne déduisant que sur certains.
    //
    // ÉTAT MESURÉ AVANT CE LOT, par balayage de ~130 termes (le pendant FR de la sonde à cadre
    // calqué) : l'orientation minoritaire rendait 16 termes dont 15 au constat NOMMÉ, la majoritaire
    // rendait `hetero` SEUL — le registre soutenu `heterosexuel` était muet. Le versant genre était
    // pire : `cis`, `cisgenre` et `cisgender` muets tous les trois, contre `trans` / `transgenre` /
    // `non binaire` / `enby` au constat nommé. La symétrie n'était donc pas « une paire sur deux »,
    // c'était UNE GRAPHIE contre seize.
    //
    // CE LOT N'ACHÈTE AUCUN RAPPEL MESURÉ, et c'est le résultat honnête plutôt qu'une réserve :
    // ajouté aux cinq fixtures scellées, le diff est VIDE — zéro constat neuf, zéro perdu, zéro
    // tort. Deux causes indépendantes, et le corpus connaissait déjà la première, écrite dans son
    // propre sceau : **personne ne déclare son hétérosexualité**. La seconde est que le seul item du
    // corpus qui écrive une auto-déclaration majoritaire (« i am straight, for the fortieth time »)
    // est ANGLAIS, donc hors d'atteinte de la porte de langue. Il entre quand même, pour la raison
    // du mainteneur : une francophone qui écrit « je suis cis » ne reçoit RIEN aujourd'hui là où
    // « je suis trans » reçoit un constat nommé, et cette asymétrie est VIVANTE que le banc
    // l'exerce ou non. Une non-détection n'affiche rien.
    //
    // GRAPHIES FRANÇAISES SEULEMENT. `straight`, `heterosexual` et `cisgender` sont ÉCARTÉS : les
    // mettre ici pré-chargerait le tier pour le jour où une tête de copule anglaise est câblée,
    // c'est-à-dire enregistrerait une couverture LATENTE comme si elle était vivante (ADR-0003,
    // *annoter*). `cis` est homographe de l'anglais et se trouve donc inscrit au registre de
    // `selfdeclared-language-gate.test.ts`, qui tient qu'il ne NOMME pas en anglais.
    //
    // FRONTIÈRE DE MOT MESURÉE, le préfixe savant étant le risque évident : `cisaille`,
    // `cistercien`, `cisjordanien`, `cisalpine` et `ciseleur` restent tous muets.
    'heterosexuel',
    'heterosexuelle',
    'cis',
    'cisgenre',
    // « en transition » RETIRÉ D'ICI, pour le motif de `ma transition` ci-dessus et avec une mesure
    // de plus : « je suis en transition professionnelle » est une phrase de reconversion parfaitement
    // ordinaire, et elle NOMMAIT. C'est même le membre le plus exposé de la famille — la copule y
    // ajoute la première personne, donc l'affirmation portait sur le locuteur sans détour.
    // Démoté en `indirectCore`, où il continue de compter comme preuve.
  ],
  // ── LA RÉPARATION DE SYMÉTRIE ANGLAISE — les deux versants, au tier qui n'affirme pas ─────────
  // Pendant EN de la réparation FR ci-dessus, et la règle est la même : une auto-déclaration
  // « i am straight » ou « i am cisgender » doit déclencher EXACTEMENT AUTANT que « i am gay » ou
  // « i am a trans woman ».
  //
  // CE QUI CHANGE PAR RAPPORT AU FRANÇAIS, ET QUI EST LE CŒUR DU LOT : ce tier atterrit en LARGE
  // (`TopicalLexicon.selfDeclaredEn`). L'anglais ne NOMME donc toujours pas sur ce label — et c'est
  // ce qui rend l'admission tenable ici, là où un calque du tier français aurait fait nommer
  // « i am gay », c'est-à-dire OUTÉ sur le label dont le coût d'erreur est le plus élevé du produit.
  // Les deux versants se déclenchent à égalité, aucun ne se fait nommer.
  //
  // ÉTAT MESURÉ AVANT CE LOT (balayage de 127 termes, quatre cadres) : le versant minoritaire
  // rendait un constat LARGE par homographie (`gay`, `lesbian`, `transgender`, `nonbinary`…), le
  // versant majoritaire rendait ZÉRO — `straight`, `heterosexual`, `cis`, `cisgender` muets tous
  // les quatre, dans tous les cadres. La dette d'appartenance nommait ce défaut ; il est ici.
  //
  // LE TORT LE PLUS COÛTEUX DU CORPUS EST CELUI QUE CE BLOC VISE. `en_misread` écrit « i am
  // straight, for the fortieth time » à l'item #0 et se faisait taguer sur son SEUL item #2
  // (« people assume i am gay ») : la seule identité que le produit savait voir chez elle était
  // celle qui n'est pas la sienne. Son item #0 compte désormais.
  //
  // N'ENTRENT PAS, et c'est là que la sonde contredit l'intuition :
  //   · `bi`, `ace`, `aro`, `trans`, `pan`, `cis` NUS. LE CADRE NE LES SAUVE PAS — « im ace at
  //     darts » et « im bi weekly on the newsletter » PORTENT la copule. Ce sont exactement les
  //     faux positifs que la porte de langue a mesurés sur ces graphies ; les réadmettre par le
  //     cadre referait par la porte ce qui a été fermé par la fenêtre. Leurs formes longues
  //     (`bisexual`, `asexual`, `aromantic`, `transgender`, `pansexual`, `cisgender`) suffisent, et
  //     `a trans woman` / `cis woman` couvrent la tournure ordinaire.
  //   · `questioning`, `closeted`, `out`, `pronouns`, `ally` — mesurés à 8 torts côté indirect, et
  //     le cadre ne change rien à leur polysémie.
  //   · LE REGISTRE DE SOCIOLECTE EN BLOC — inchangé, et sa raison ne bouge pas d'un pouce.
  //
  // RÉSIDU DÉCLARÉ, non réparé, et il ne se referme PAS par locution couvrante : « im straight up
  // done with this » → constat large. J'ai essayé (`straight up`, `straight ahead`, `straight
  // home`…) et ça ne marche pas, parce que `isSwallowed` n'est PAS appelé sur le chemin
  // d'auto-déclaration — les locutions couvrantes protègent `hitSurfaces` et pas `hitSelfDeclared`.
  // C'est un manque de MACHINERIE, il vaut aussi pour le français, et il ne se répare pas en
  // passant. Acceptation ASSUMÉE, pas mesurée : l'instrument qui la mesurerait n'existe pas.
  selfDeclaredEn: [
    'gay',
    'lesbian',
    'bisexual',
    'pansexual',
    'asexual',
    'aromantic',
    'queer',
    'transgender',
    'transmasc',
    'transfem',
    'nonbinary',
    'non binary',
    'enby',
    'genderfluid',
    'agender',
    'intersex',
    'sapphic',
    'a trans woman',
    'a trans man',
    'a gay man',
    // Le versant majoritaire, dans le MÊME lot — jamais « ensuite ».
    'straight',
    'heterosexual',
    'cisgender',
    'cis woman',
    'cis man',
  ],
  // Intérêt communautaire + identités nues → tag LARGE (jamais nommé, B1). Emprunts lexicalisés
  // seulement (wlw). « mlm » écarté (polysémie « multi-level marketing » massive).
  indirectCore: [
    // ── COUVERTURE EN ACCIDENTELLE, ANNOTÉE (ADR-0003, *annoter* — quatrième mouvement) ──────────
    // Ces cinq-là sont des chaînes IDENTIQUES dans les deux langues, et elles taguent de l'anglais
    // DEPUIS TOUJOURS sans qu'aucune décision l'ait voulu. L'annotation ne change RIEN au
    // comportement : elle rend intentionnel ce qui était accidentel, et empêche qu'un futur lot
    // croie couvrir l'anglais pour la première fois. Couverture VIVANTE (elle produit des constats
    // aujourd'hui), pas latente — la distinction décide de la façon dont on l'annote.
    'lgbt',
    'lgbtq',
    'lgbtqia',
    'queer',
    // `pride` PORTE UN TORT MESURÉ, et l'annotation l'enregistre plutôt que de le taire :
    //
    //     « pride and prejudice book review »  →  sexuality[indirect]
    //
    // C'est vraisemblablement la plus grosse source de faux positifs anglais de ce lexique — le mot
    // anglais ordinaire de l'estime de soi, d'un titre de roman, d'un groupe de lions — et elle
    // n'avait JAMAIS été décidée. Il ne s'évince pas pour autant : il se déclenche aussi sur des
    // porteurs (la voix vécue anglaise du banc écrit « we went to pride »), donc il est du côté
    // « discrimine mal » de la ligne d'ADR-0003 et non du côté « ne discrimine pas du tout ».
    // Ni ajouté ni retiré : annoté, pour qu'il cesse d'être invisible.
    'pride',
    'marche des fiertes',
    'fiertes',
    'coming out',
    'gay',
    'lesbienne',
    // ADJECTIF MASCULIN — « bar lesbien », « couple lesbien », « film lesbien ». Il manquait, et le
    // trou était invisible parce que le féminin, lui, était admis : la couverture se vérifiait dans
    // un seul sens. Ces syntagmes sont la manière ORDINAIRE de nommer un lieu ou un couple, et sans
    // eux une vie entière décrite en vingt-quatre items ne produisait aucune preuve (mesuré, banc
    // de registres).
    'lesbien',
    'bisexuel',
    'bisexuelle',
    'pansexuel',
    // FÉMININS ET FORMES MANQUANTES du même axe. `homosexuel`/`homosexuelle` n'étaient NULLE PART en
    // indirect — seulement en auto-déclaration — si bien que « il est homosexuel » ne rendait rien
    // là où « il est gay » rendait un constat large. Deux mots pour une même chose, deux
    // comportements : c'est une asymétrie de morphologie, pas une décision.
    'pansexuelle',
    'asexuel',
    'asexuelle',
    'homosexuel',
    'homosexuelle',
    'non binaire',
    'transgenre',
    'transidentite',
    'bisexualite',
    'homosexualite',
    'orientation sexuelle',
    'identite de genre',
    'sapphique',
    'saphique',
    'drag queen',
    'homophobie',
    'homophobe',
    'transphobie',
    'transphobe',
    'sortir du placard',
    'wlw',
    // ── VARIANTES EN (PANO-35) — vocabulaire du SUJET, constat LARGE ────────────────────────────
    //
    // Ce que ce bloc répare : la couverture anglaise de ce label était QUASI NULLE, et personne ne
    // l'avait mesurée. Neuf chaînes traversaient par homographie (`pride`, `lgbt`, `queer`, `gay`,
    // `coming out`, `drag queen`, `wlw`…) ; les mots anglais ordinaires de l'orientation et de
    // l'identité — `lesbian`, `bisexual`, `asexual`, `homosexual`, `transgender`, `nonbinary`,
    // `homophobia`, `transphobia` — ne rendaient RIEN. Dix-huit des entrées ci-dessous sont le
    // pendant EN STRICT d'une entrée FR déjà ratifiée : ce ne sont pas des décisions neuves, ce sont
    // les mêmes, dans l'autre langue, et la couverture se vérifie dans les deux sens.
    //
    // CE QUE CE BLOC NE RÉPARE PAS, et c'est le plus important : le défaut nommé par le banc — un
    // anglophone qui écrit « i am gay » reçoit un constat LARGE là où une francophone reçoit un
    // constat NOMMÉ — vit à la COPULE, et aucun terme d'un tier indirect ne l'atteint. Mesuré :
    // `en_lived_plain` gagne UNE preuve et RESTE `indirect`. L'asymétrie de traitement entre deux
    // utilisateurs du même produit survit intégralement à ce bloc.
    //
    // LE ZÉRO DE TORTS EST LE PRODUIT DES EXCLUSIONS, PAS DES ADMISSIONS. Mesuré sur les six voix :
    // ce bloc coûte 0 tort neuf, le FR ne bouge pas. La preuve en négatif est ce qui a été écarté —
    // `straight` en indirect porterait `en_homograph_guard` de 1 tort à 4 (menuiserie, scie,
    // fléchettes), et `pronouns` / `transition` / `ally` / `out` l'y porteraient à 8.
    //
    // EXCLUS AU MÊME ENDROIT, chacun avec sa raison :
    //   · `straight`, `out`, `came out`, `pronouns`, `ally` — mesurés ci-dessus. `straight` a sa
    //     maison à la copule, où le cadre le désambiguïse ; l'exclure ici est ce qui rend la
    //     symétrie hétéro POSSIBLE plus tard, pas ce qui la refuse.
    //   · `cis` nu (préfixe savant), `gender` nu (« gender pay gap »), `inter` nu, `sex` nu.
    //   · `rainbow` — pendant d'`arc-en-ciel`, déjà écarté côté FR. Le réadmettre en anglais referait
    //     par la porte ce qui a été écarté par la fenêtre.
    //   · `mlm` — déjà écarté côté FR pour « multi-level marketing », et le motif est ANGLAIS.
    //   · `top surgery` / `bottom surgery` — frontière `health_physical` non instruite. Dette nommée.
    //   · LE REGISTRE DE SOCIOLECTE EN BLOC (troisième porte, ADR-0003) : la couche lexicale que
    //     l'anglais général a reprise aux communautés LGBTQ+ est saillante et facile à lister, et
    //     c'est très exactement l'ajout que ce label appellera. Elle ne discrimine pas — tout le
    //     monde l'écrit — et c'est un marqueur de GROUPE : l'admettre taguerait des gens sur leur
    //     manière de parler, ici au seuil 1 et avec un coût d'outing. La seconde raison suffit.
    'lesbian',
    'bisexual',
    'bisexuality',
    'pansexual',
    'asexual',
    'aromantic',
    'homosexual',
    'homosexuality',
    'transgender',
    'nonbinary',
    'non binary',
    'genderqueer',
    'intersex',
    'sapphic',
    'homophobia',
    'homophobic',
    'transphobia',
    'transphobic',
    'sexual orientation',
    'gender identity',
    'out of the closet',
    // LE SEUL TERME DU LOT QUI ACHÈTE DU RAPPEL HORS AUTO-DÉCLARATION ET HORS VOCABULAIRE
    // COMMUNAUTAIRE, et la raison est une inversion entre les deux langues qui vaut d'être écrite :
    // le français porte le fait dans une MORPHOLOGIE qu'aucun lexique ne lit (l'accord réciproque de
    // « on s'est pacsées » dit que les deux personnes sont des femmes) ; l'anglais, qui n'a pas
    // d'accord, ne peut le porter que LEXICALEMENT — d'où l'existence de ce syntagme, qui y est la
    // forme ordinaire et non un terme administratif.
    // Il discrimine mal et non pas rien : mesuré, « my dog and my cat are the same sex » se
    // déclenche. Il reste à ce titre (ADR-0003, *Admettre n'est pas évincer*).
    'same sex',
    'gender affirming',
    'gender dysphoria',
    'deadname',
    'deadnaming',
    // LES DEUX FORMES DÉMOTÉES depuis `explicit` et `selfDeclaredFr` — voir la justification à
    // chacun de ces deux tiers. Elles gardent leur rappel (la voix non binaire du banc ne perd ni
    // son étage ni sa preuve, mesuré) et perdent le droit d'affirmer, qui est très exactement ce
    // qu'ADR-0003 fait varier quand un label coûte cher : « un label plus sensible ne mérite pas un
    // lexique plus étroit — il mérite de moins affirmer ».
    'ma transition',
    'en transition',
  ],
  // Colloquial DÉSACTIVÉ (seuil 1 + coût outing) : aucun terme polysémique admis en un seul hit.
  indirectColloquial: [],
  includeColloquial: false,
  indirectThreshold: 1,
};
