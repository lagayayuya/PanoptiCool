// Lexique `health_physical` (PANO-72, passe 2) — condition médicale / état de santé physique.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Vocabulaire médical et du soin du FR courant, écrit à l'aveugle depuis l'usage commun, jamais
// depuis un export :
//   · soutenu / clinique : conditions nommées (diabète, endométriose, sclérose en plaques) ;
//   · courant : parcours de soin (ordonnance, analyses de sang, spécialistes, arrêt maladie) ;
//   · familier : périphrases d'état (« cloué au lit », « mal partout », « la crève »).
// PIÈGE PROPRE À CE LABEL (traité) : les hyperboles de fatigue (« crevé », « claqué », « mort »,
// « HS », « je crève de faim ») NE sont PAS des constats de santé — elles sont EXCLUES du lexique.
// Seule « la crève » (locution figée = vraie maladie) entre, distincte de « crevé » (fatigue).
// Chaque terme aurait été écrit à l'identique sans avoir vu aucun export.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// Entrées NORMALISÉES (minuscules, sans accents ; tiret = espace). Variantes mécaniques (pluriel,
// auto-censure, allongement) couvertes par la machinerie. Seuil 2 (calibrage PANO-33), colloquial inclus.
//
// ── Variantes EN (2ᵉ lot D1) — la ligne d'admission n'est PAS celle du pilote ───────────────────
// Le lot pilote `mental_health` s'est défendu contre l'HYPERBOLE : « i'm dying » n'est pas une
// détresse. Cette porte-là ne travaille presque pas ici — personne n'écrit « i'm diabetic » pour
// rire, et trois termes seulement s'y écartent (`cancer` nu, `migraine` nu, « i'm dying »).
//
// La ligne qui décide ce label est ailleurs, et elle a été MESURÉE sur les voix scellées du corps :
//
//     LE SYMPTÔME N'EST PAS LA CONDITION.
//
// Les deux voix se distinguent exactement là. Celle qui VIT une polyarthrite nomme sa condition,
// son traitement et sa spécialité ; celle qui n'a RIEN écrit un vocabulaire de symptômes dense et
// parfaitement LITTÉRAL — une bosse, un fourmillement, un pouls à 48, une paupière qui tressaute.
// Tout existe chez elle sauf la maladie. Aucun mécanisme fondé sur la présence d'un terme ne les
// sépare, et le seuil ne protège pas : quelqu'un qui s'inquiète pour rien cherche BEAUCOUP, donc le
// seuil accumule au lieu d'écarter — le raisonnement d'ADR-0003 sur l'hyperbole, transposé.
//
// D'où la règle de ce lexique : les NOMS DE SYMPTÔME n'entrent pas. Ni `lump`, ni `bump`, ni
// `headache`, ni `tingling`, ni `dizzy`, ni `bruise`, ni `twinge`, ni `cough`, ni `rash`, ni
// `stomach ache`. Ce qui entre, c'est ce qu'écrit quelqu'un qui SAIT ce qu'il a : le nom de la
// condition, le nom du traitement, le nom de la spécialité, le parcours de soin.
//
// ── HORS PÉRIMÈTRE, par décision — grossesse et handicap ───────────────────────────────────────
// Les entrées FR `ma grossesse`, `pma`, `fiv`, `mon handicap` restent, et n'ont AUCUN pendant EN.
// L'asymétrie est délibérée : ranger ces territoires sous « santé physique » est un cadrage que
// rien n'a ratifié — une grossesse n'est pas une maladie, et classer le handicap ici le cadre comme
// une pathologie, ce que les personnes concernées contestent. Ils ne seront pas doublés dans une
// seconde langue avant d'être décidés. Écartés au même titre, et pour la même raison : `blue badge`,
// `attendance allowance`, `carers allowance` — des droits liés au handicap, pas des soins.
//
// Les exclusions qui PORTENT la doctrine sont figées dans la batterie adverse
// (`detect/lexicon-battery.test.ts`) ; les quasi-manqués locaux sont annotés sur l'entrée qui les a
// écartés. Deux n'ont ni entrée voisine ni test, et se tiennent donc ici (ex-note de lot, condensée
// dans `docs/methode-portabilite-en.md`) :
//   · `seizure` nu — « seizure of assets », registre juridique ; `epilepsy` porte le signal ;
//   · `miscarriage` — « miscarriage of justice » MATCHE (mesuré), et aucune machinerie ne l'écarte
//     (ni négation, ni citation, ni registre informationnel). Le cas est en outre absorbé par le
//     hors-périmètre grossesse ci-dessus : il ne se rouvre pas sans lui.

import type { TopicalLexicon } from './types';

export const HEALTH_PHYSICAL_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'health_physical',
  // Lectures du registre §5 (amendé PANO-72 : 3e lecture « proche », alignée sur mental_health).
  readingTemplateIds: [
    'sensitive.health-physical.reading.lived',
    'sensitive.health-physical.reading.relative',
    'sensitive.health-physical.reading.curiosity',
  ],
  // Condition NOMMÉE à soi → tag nommé. Conditions non ambiguës nues + locutions possessives (le
  // mot nu piégé : « cancer » = argot « c'est le cancer » ; « grossesse » d'autrui…).
  explicit: [
    'diabete',
    'asthme',
    'endometriose',
    'fibromyalgie',
    'sclerose en plaques',
    'hypertension',
    'epilepsie',
    'eczema',
    'psoriasis',
    'arthrose',
    'hernie',
    'tumeur',
    'avc',
    'vih',
    'covid long',
    'maladie chronique',
    'douleurs chroniques',
    'anemie',
    'thyroide',
    'migraines chroniques',
    'mon cancer',
    'ma chimio',
    'en chimio',
    'ma maladie',
    'mon handicap',
    'ma grossesse',
    'je suis enceinte',
    'enceinte de',
    'fausse couche',
    'mon operation',
    'je me suis fait operer',
    'mon traitement',
    'sous traitement',
    'en remission',
    'ma sclerose',
    'mon asthme',
    'mon diabete',
    'pma',
    'fiv',
    // ── Variantes EN : conditions NOMMÉES, sans emploi figuré ─────────────────────────────────
    'asthma',
    'epilepsy',
    'endometriosis', // le FR `endometriose` ne l'attrapait pas (-ose / -osis)
    'fibromyalgia',
    'multiple sclerosis', // « ms » écarté : matche « 200 ms latency » (mesuré)
    'crohns',
    "crohn's", // double graphie : mesuré, l'une ne matche pas l'autre
    'ulcerative colitis',
    'ibd',
    'ibs',
    'celiac',
    'coeliac', // « gluten free » écarté : régime d'élection bien plus souvent que condition
    'long covid', // « covid » nu écarté : événement collectif, pas une condition portée
    'chronic illness', // « chronic » nu écarté : intensificateur (« chronically online »)
    'chronic pain',
    'chronic fatigue',
    'anemia',
    'anaemia',
    'hypothyroidism',
    'hyperthyroidism', // « thyroid » nu écarté : c'est un organe, pas une condition
    // Arthrites — CATÉGORIE RÉVÉLÉE PAR LA MESURE, absente de la proposition d'origine. Le FR
    // portait `arthrose` seul ; l'anglais du quotidien nomme la maladie inflammatoire, son
    // traitement et sa spécialité. C'est l'une des conditions chroniques les plus répandues.
    'rheumatoid arthritis',
    'osteoarthritis',
    'arthritis',
    'lupus',
    // Formes PORTÉES — le nom nu de ces trois-là ne nomme personne (cf. les exclusions en tête).
    // Ce qui les tient est DANS la chaîne matchée : le possessif ou la 1ʳᵉ personne y est écrit, donc
    // « la condition est portée » est littéralement ce que le matcher vérifie. Une entrée sans l'un
    // ni l'autre n'appartient pas à ce bloc, si voisin que soit son sens — `in remission` y avait été
    // rangée et en est sortie (« her lymphoma is in remission » NOMMAIT le rédacteur). Elle vit au
    // seul tier `selfDeclaredEn`, où « i am in remission » la retrouve.
    'my cancer',
    'my chemo',
    'on chemo',
    'my diagnosis',
    'my condition',
    'my illness', // « illness » nu écarté : « it is an illness » est un emploi figuré courant
    'my surgery',
    'my operation', // « operation » nu écarté : militaire, commercial, mathématique
    'i had surgery',
    'my transplant',
    // AVC — le possessif seul NOMME. Les formes générales sont en `indirectCore`, et ce choix est
    // MESURÉ, pas théorique : la voix aidante du banc écrit huit items sur l'AVC de sa mère dont
    // la plupart SANS possessif (« stroke recovery timeline », « adapting a kitchen after
    // stroke »). En `explicit`, ils lui posaient un constat NOMMÉ — la sur-classification exacte
    // que sa vérité-terrain désigne comme le tort à surveiller.
    //
    // `had a stroke` A ÉTÉ ADMIS ICI CONTRE CETTE RÈGLE, et l'a payé : il ne porte ni possessif ni
    // 1ʳᵉ personne, donc « he had a stroke last winter » NOMMAIT le rédacteur. Ce qui a caché le
    // défaut est le filtre de 3ᵉ personne — une liste FERMÉE de termes de parenté : « my nan had a
    // stroke » est muet, « the driver had a stroke » ne l'est pas. La voix scellée `relative` écrit
    // « my nan », donc AUCUNE persona ne pouvait exhiber le défaut. Descendu en `indirectCore`,
    // auprès des autres formes générales, où la règle ci-dessus le mettait.
    'my stroke',
  ],
  // Condition-adjectif revendiquée via copule (« je suis diabétique ») — trop de FP nue.
  selfDeclaredFr: [
    'diabetique',
    'asthmatique',
    'epileptique',
    'seropositif',
    'seropositive',
    'handicape',
    'handicapee',
    'malade chronique',
    'hypocondriaque',
  ],
  // ── LES CONDITIONS-ADJECTIFS ANGLAISES — pendant EN de `selfDeclaredFr` ci-dessus ─────────────
  // Même raison qu'en français (« trop de FP nue »), étage DIFFÉRENT : ce tier atterrit en LARGE et
  // ne NOMME jamais (`TopicalLexicon.selfDeclaredEn`).
  //
  // CE QU'IL RÉPARE : le nom de condition était câblé, l'adjectif ne l'était pas — `diabetes` ✓ /
  // `diabetic` ✗, `asthma` ✓ / `asthmatic` ✗, `arthritis` ✓ / `arthritic` ✗. L'étage livré était en
  // outre INCOHÉRENT et personne ne l'avait vu : `epileptic`, `celiac`, `anemic` NOMMENT dès un item
  // (ils sont en `explicit`), quand `diabetic` et `asthmatic` étaient muets. Deux conditions du même
  // registre, deux comportements.
  //
  // CETTE NOTE DIAGNOSTIQUAIT L'ASYMÉTRIE ET N'EN RÉPARAIT QU'UNE MOITIÉ : elle a ajouté les
  // adjectifs manquants ICI, sans jamais redescendre ceux qui étaient restés en `explicit`. Un
  // terme présent aux DEUX tiers court-circuite celui-ci — l'étage nommé gagne, et l'adjectif NOMME
  // dès un item, dans n'importe quel cadre, y compris ceux que la barre d'admission de ce tier
  // écarte. Mesuré : « the sound mix on this album is anemic » et « the editing in that trailer is
  // epileptic » posaient un constat NOMMÉ. `epileptic` et `anemic` sont donc sortis de `explicit` ;
  // leurs NOMS (`epilepsy`, `anemia`, `anaemia`) y restent, et c'est eux qui portent le rappel du
  // porteur. `celiac` / `coeliac` restent aux deux tiers À DESSEIN : aucun idiome anglais ne les
  // applique à un objet, et « celiac friendly » est du vocabulaire du domaine — un signal-sans-vécu,
  // qui est la démonstration et pas un tort (ADR-0003, *L'incertitude*).
  // L'intersection est tenue par `detect/storey-intersection.test.ts`.
  //
  // SEUIL 2, ET LE PRIX EST EXPLICITE : sans franchissement solo, « i am diabetic » écrit UNE fois
  // ne rend RIEN. C'est ce que le seuil fait déjà partout ailleurs sur ce label, et la variante qui
  // l'aurait évité doublait le bruit idiomatique (mesuré : `selfDeclaredEn`).
  //
  // N'ENTRENT PAS :
  //   · `disabled`, `deaf`, `blind`, `hard of hearing`, `a wheelchair user` — TERRITOIRE HORS
  //     PÉRIMÈTRE par décision (en-tête de ce module : classer le handicap ici le cadre comme une
  //     pathologie, ce que les personnes concernées contestent). L'anglais ne rouvre pas une
  //     décision française.
  //   · `terminal`, `obese`, `overweight` — coût d'erreur maximal ou jugement de corps :
  //     ÉTAGEMENT PAR COÛT D'ERREUR (ADR-0003), lot séparé, dette nommée plutôt qu'omission.
  //   · `a spoonie` — sociolecte communautaire, troisième porte d'ADR-0003.
  //   · AUCUN NOM DE SYMPTÔME. La règle de ce module (« le symptôme n'est pas la condition ») tient
  //     sans amendement, et le cadre ne la desserre pas — « im dizzy », « im nauseous » resteraient
  //     le vocabulaire de la voix qui n'a rien.
  selfDeclaredEn: [
    'diabetic',
    'asthmatic',
    'epileptic',
    'arthritic',
    'hypertensive',
    'immunocompromised',
    'celiac',
    'coeliac',
    'anemic',
    'anaemic',
    'chronically ill',
    'hiv positive',
    'in remission',
    'lactose intolerant',
    'gluten intolerant',
  ],
  // Soin, symptômes, maladies courantes — non ambigus → tag large.
  indirectCore: [
    'symptomes',
    'ordonnance',
    'medecin traitant',
    'chez le medecin',
    'rendez-vous medical',
    'aux urgences',
    'hopital',
    'hospitalise',
    'hospitalisee',
    'analyses de sang',
    'prise de sang',
    'glycemie',
    'tension arterielle',
    'irm',
    'depistage',
    'vaccin',
    'effets secondaires',
    'kine',
    'kinesitherapeute',
    'dermato',
    'gyneco',
    'cardiologue',
    'oncologue',
    'arret maladie',
    'allergie',
    'allergique',
    'intolerance au gluten',
    'carence en fer',
    'cortisone',
    'antibiotiques',
    'anti-inflammatoires',
    'chimio',
    'dialyse',
    'grippe',
    'gastro',
    'angine',
    'rhume',
    'otite',
    'bronchite',
    'mutuelle',
    // ── Variantes EN : parcours de soin, examens, traitements ─────────────────────────────────
    // Ce tier ne porte presque pas d'exclusions d'hyperbole (elle s'attaque aux états, pas aux
    // institutions). Il en porte d'un autre genre : les noms de SYMPTÔME, écartés en tête de
    // fichier — c'est ici qu'ils auraient atterri.
    'prescription',
    'repeat prescription',
    'my gp', // « a gp » ne matche pas : « when should you see a gp » est une question générale
    'family doctor',
    'a&e',
    'emergency room',
    'hospital',
    'hospitalised',
    'hospitalized',
    'blood test',
    'blood work',
    'bloods',
    'blood sugar',
    'blood pressure',
    'mri',
    'ct scan',
    'ultrasound',
    'biopsy',
    'colonoscopy',
    'smear test',
    'mammogram',
    'vaccine',
    'vaccination',
    'iron deficiency',
    'lactose intolerance',
    'gluten intolerance',
    'steroids',
    'antibiotics',
    'anti inflammatories',
    'painkillers',
    'chemotherapy',
    'radiotherapy',
    'dialysis',
    'inhaler',
    'epipen',
    'insulin',
    // Médicaments et classes nommés — même justification qu'en FR (produits du domaine, pas des
    // personnes). `methotrexate` et `biologics` viennent de la MESURE : la voix qui vit sa
    // condition les écrit quatre fois, et la proposition d'origine ne portait aucun traitement de
    // fond — elle avait construit le soin autour des consultations, pas des traitements.
    'methotrexate',
    'biologics',
    'folic acid',
    // Spécialités.
    'rheumatology',
    'rheumatologist',
    'dermatologist',
    'gynecologist',
    'gynaecologist',
    'cardiologist',
    'oncologist',
    'endocrinologist',
    // RÉÉDUCATION PHYSIQUE — ces syntagmes appartiennent au corps, et leur absence d'ici est ce qui
    // les faisait lire comme de la santé MENTALE (le terme `therapy` du lexique voisin matche à
    // l'intérieur). Mesuré sur la voix aidante ; voir la note de machinerie qui les fait gagner.
    'physiotherapy',
    'physio',
    'occupational therapy',
    'speech therapy',
    'rehabilitation', // « rehab » nu écarté : addiction, et titre de chanson
    // ── RETIRÉS À LA MESURE — le SOIN NEUTRE n'appartient à aucun des deux labels de santé ──────
    // `side effects`, `sick note`, `fit note`, `medical certificate` ont été proposés ici, puis
    // écartés : ils ont tagué la voix EN en détresse MENTALE, sur « sertraline side effects » et
    // « sick note for mental health from work ». Les deux items disent leur domaine en toutes
    // lettres, et ce n'est pas celui-ci.
    //
    // Le diagnostic est le SYMÉTRIQUE de celui de `therapy` (cf. les locutions couvrantes), et il
    // vaut au-delà de ces quatre termes : les deux labels de santé partagent un MILIEU — l'arrêt
    // de travail, l'effet secondaire, l'ordonnance, le rendez-vous — qui n'appartient en propre à
    // aucun des deux. Ce vocabulaire ne porte aucune information de domaine : c'est le texte
    // autour qui la porte. L'admettre revient à faire réclamer par un label tout texte de soin.
    // Les DROITS liés au handicap (« blue badge », « attendance allowance ») restent écartés eux
    // aussi, pour une autre raison — territoire hors périmètre, cf. l'en-tête.
    // Infections nommées. « flu » et « cold » nus sont écartés : épisodes banals universels, taguer
    // ici reviendrait à taguer tout le monde en hiver.
    'bronchitis',
    'pneumonia',
    'tonsillitis',
    'ear infection',
    'sinus infection',
    'food poisoning',
    // AVC, formes générales (le possessif est en `explicit` — voir la note là-haut).
    'had a stroke',
    'stroke recovery',
    'stroke rehab',
    'stroke ward',
    'after stroke',
    'second stroke', // « stroke » nu écarté : nage, golf, pinceau, « a stroke of luck »
    'flare up', // « flare » nu écarté : solaire, pantalon, « flare up an argument »
  ],
  // Familier — polysémique (« malade » = compliment argot ; « la crève » = vraie maladie).
  indirectColloquial: [
    'malade',
    'patraque',
    'la creve',
    'mal partout',
    'cloue au lit',
    'clouee au lit',
    'mal de crane',
    'mal au bide',
    'en vrac',
    // ── Variantes EN : registre bas LITTÉRAL et polysémique ────────────────────────────────────
    'under the weather',
    'off sick',
    'bedridden',
    'laid up',
    'run down', // polysémique (« run down a list ») — exactement le profil de ce tier
    'bad back',
    'dodgy knee',
    'aching all over',
    // `allergic to` et `allergy` : ICI et pas en core. L'emploi figuré (« allergic to mornings »)
    // est attesté en dictionnaire, mais l'emploi littéral reste massif — c'est donc un profil
    // POLYSÉMIQUE, que le seuil départage vraiment, et non une hyperbole à exclure à la porte.
    // « allergic » nu est écarté : sans complément, la lecture figurée domine.
    'allergic to',
    'allergy',
    // « poorly » (BrE, « he's poorly ») est ÉCARTÉ malgré son usage réel : l'adverbe
    // (« poorly written », « poorly designed ») est bien plus fréquent que l'adjectif.
    // « sick » et « ill » nus le sont aussi — « that's sick » (excellent), « sick of it »,
    // « ill-advised », « that beat is ill ».
  ],
  includeColloquial: true,
  indirectThreshold: 2,
};
