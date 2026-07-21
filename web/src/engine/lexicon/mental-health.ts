// Lexique `mental_health` (PANO-71 graine → PANO-36 enrichi). Enrichissement par champs lexicaux
// structurés (variantes, registres, périphrases), incluant le champ « mal-être ado / registre
// parent » nommé par PANO-36.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Tous registres du FR courant de la santé mentale, écrits À L'AVEUGLE depuis l'usage commun,
// JAMAIS depuis un export réel :
//   · soutenu / clinique : vocabulaire diagnostique usuel (dépression, trouble anxieux, tdah) ;
//   · courant : soin et suivi (psy, thérapeute, antidépresseurs), noms de médicaments répandus
//     (générique : ce sont des produits du domaine public, pas des personnes) ;
//   · familier / argot d'internet : mal-être exprimé sans terme clinique (« au fond du trou »,
//     « je craque », « en mode survie », « psychoter »).
// Chaque terme est défendable pour un inconnu, justifiable par l'usage générique du français, et
// aurait été écrit à l'identique sans avoir jamais vu aucun export.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// ── Variantes EN (PANO-35, lot pilote) — règle d'admission propre à l'EN ──────────────────────
// Précédent de forme : les lexiques d'intérêt D2 (PANO-88) fusionnent leurs variantes EN EN LIGNE
// dans les mêmes tableaux, annotées `// (EN)`. Même choix ici — pas de module séparé.
//
// L'ADMISSION suit la règle portée par ADR-0003 (« exclure l'hyperbole à la porte ») : un terme
// n'entre que si son usage DOMINANT sur les réseaux est littéral. L'hyperbole n'est pas rétrogradée
// en colloquial, elle est EXCLUE — parce que le seuil de répétition ne la filtre pas : trois « i'm
// dying » sont trois éclats de rire, là où deux « déprime » réduisent la chance d'une bourse.
// Les exclusions qui PORTENT la doctrine sont figées dans la batterie adverse
// (`detect/lexicon-battery.test.ts`, section EN) ; les quasi-manqués locaux sont annotés sur
// l'entrée qui les a écartés. Trois familles n'ont ni entrée voisine ni test, et se tiennent donc
// ici — une exclusion se perd si rien ne la tient (ex-note de lot, condensée dans
// `docs/methode-portabilite-en.md`) :
//   · `stressed`, `tired`, `exhausted`, `drained` — états quotidiens universels : taguer ici,
//     c'est taguer tout le monde ;
//   · `i can't even`, `i'm done`, `dying inside` — hyperbole conventionnelle du désarroi ordinaire,
//     même famille que « i'm dying » (figé au test) ;
//   · `crazy`, `insane`, `psycho`, `mental` — intensificateurs génériques (« that's insane ») et,
//     en usage personnel, argot validiste visant autrui (frontière `conflictual`).
//
// TROIS FORMES RETENUES HORS DE CE LOT (dette nommée, réouvrable — voir le doc et le catalogue §4) :
// `suicidal`, `end my life`, `take my own life`. Écartées non parce qu'elles seraient mauvaises,
// mais parce qu'elles portent le coût d'erreur MAXIMAL et que le taux de faux positifs EN n'est pas
// mesuré. `mental_health` se démontre sans elles (soin, burnout, antidépresseurs).
//
// Entrées en forme NORMALISÉE (minuscules, sans accents ; le tiret vaut espace, machinerie).
// Les VARIANTES MÉCANIQUES ne se listent PAS : allongements (« déprimeee »), auto-censure et
// pluriels sont couverts par la machinerie (detect.ts, PANO-36 phase 0). Ici, vocabulaire réel only.
// Calibrage ratifié PANO-33 : seuil indirect 2, colloquial inclus (on ne masque pas le polysémique).

import type { TopicalLexicon } from './types';

export const MENTAL_HEALTH_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'mental_health',
  // Lectures du registre §5 : vécu personnel · préoccupation pour un proche · curiosité.
  readingTemplateIds: [
    'sensitive.mental-health.reading.lived',
    'sensitive.mental-health.reading.relative',
    'sensitive.mental-health.reading.curiosity',
  ],
  // Terme clinique / de détresse nommé, appliqué à soi → tag nommé (B2).
  explicit: [
    // Homographes FR/EN : ces entrées matchaient DÉJÀ de l'anglais, sans qu'aucune décision ne
    // l'ait voulu (mesuré — la persona EN écrit « burnout recovery stories » et le constat tombe).
    // L'annotation ne change RIEN au comportement : elle rend intentionnel ce qui était accidentel,
    // et empêche qu'un futur lot croie couvrir l'EN pour la première fois.
    'anxiete',
    'burn out',
    'burnout', // (EN) identique
    'idees noires',
    'depression nerveuse',
    'angoisse',
    "crise d'angoisse",
    'crise de panique',
    'attaque de panique',
    'trouble anxieux',
    'anxiete generalisee',
    'phobie sociale',
    'agoraphobie',
    'bipolaire',
    'borderline',
    'schizophrene',
    'schizophrenie',
    'tdah',
    'stress post traumatique',
    'anorexie',
    'anorexique',
    'boulimie',
    'boulimique',
    'tca',
    'depression post partum',
    // Détresse vitale : LOCUTIONS littérales seulement (« me tuer » omis, décision yuya — trop de FP
    // sur l'hyperbole « ça me tue » / « ce projet va me tuer »).
    'automutilation',
    'scarification',
    'idees suicidaires',
    'suicidaire',
    "envie d'en finir",
    'envie de mourir',
    'je veux mourir',
    'me suicider',
    'mettre fin a mes jours',
    'en finir avec la vie',
    // ── Variantes EN (PANO-35) : conditions NOMMÉES, sans emploi figuré conventionnel ───────────
    'anxiety disorder',
    'generalized anxiety',
    'social anxiety',
    'panic attack', // « panic » nu écarté : « don't panic », « panic buying »
    'agoraphobia',
    'bipolar disorder', // le SYNTAGME COMPLET — « bipolar » nu est une hyperbole (météo, humeur)
    'schizophrenia', // « schizo » écarté : argot péjoratif visant autrui (chevauche `conflictual`)
    'adhd', // « add » écarté : collision totale avec le verbe « to add »
    'post traumatic stress', // « trauma »/« traumatized » écartés : colloquialisés (« traumatized
    // by that movie ») — phénomène documenté, même raison que « toc » plus bas
    'anorexia',
    // `anorexic` A ÉTÉ RETIRÉ D'ICI. L'adjectif a un idiome d'objet conventionnel en anglais — « an
    // anorexic budget », « an anorexic profit margin » — et rien dans la machinerie ne vérifie à
    // QUOI l'adjectif se rapporte : les deux posaient un constat NOMMÉ (mesuré). Il vit désormais au
    // seul tier `selfDeclaredEn` plus bas, qui atterrit en LARGE. Le NOM `anorexia` reste ici, et
    // c'est lui qui porte le rappel du porteur. `bulimic` RESTE aux deux tiers : son idiome d'objet
    // n'est pas attesté — il a fallu l'inventer pour le tester, ce qui est la réponse.
    'bulimia',
    'bulimic',
    'eating disorder',
    'postpartum depression',
    'self harm', // « cutting » écarté : polysémie massive (coiffure, montage, sport)
    'selfharm',
    'self harming',
    // NOTE — la détresse vitale EN s'arrête ici, volontairement. « i want to die » est le calque
    // direct de « je veux mourir » (présent plus haut) et il est POURTANT exclu : en anglais c'est
    // une réaction conventionnelle à l'embarras, même famille que « i'm dead » (= rire). Même
    // écart pour « kill me », « kms », « i'm dying ». C'est le cas d'école du jugement qui ne
    // survit PAS à la traduction, et la raison d'être de la règle d'admission en tête de fichier.
  ],
  // Étiquettes d'état AUTO-DÉCLARÉES (« je suis dépressif », « jsuis un pauvre anxieux ») — via le
  // pattern d'auto-déclaration (PANO-72). Adjectifs trop polysémiques nus (« temps dépressif »,
  // « film dépressif ») : la copule les rend fiables et capte le registre auto-dépréciatif.
  selfDeclaredFr: [
    'depressif',
    'depressive',
    'anxieux',
    'anxieuse',
    'hypersensible',
    'insomniaque',
    'en depression',
    'en burn out',
    // AUCUNE variante EN ici, à dessein (PANO-35) : ce tier ne se matche QUE via
    // `SELF_DECLARATION_HEADS`, qui reste FR-only tant que le lot 2 de PANO-35 n'a pas mesuré la
    // copule EN. Y écrire « depressed » ou « anxious » produirait des données que rien ne lit.
    // L'écart tombe du bon côté : ces étiquettes d'état sont les plus hyperbolisées de l'anglais.
  ],
  // ── LES ÉTIQUETTES D'ÉTAT ANGLAISES — le terrain le plus figuré des quatre ────────────────────
  // Pendant EN de `selfDeclaredFr` ci-dessus, dont la note disait « y écrire "depressed" ou
  // "anxious" produirait des données que rien ne lit » : les têtes anglaises existent désormais, et
  // ce tier atterrit en LARGE — il ne NOMME jamais (`TopicalLexicon.selfDeclaredEn`).
  //
  // LA NOTE CI-DESSUS AJOUTAIT « l'écart tombe du bon côté : ces étiquettes sont les plus
  // hyperbolisées de l'anglais ». C'EST VRAI, ET LE CADRE N'Y CHANGE RIEN — mesuré, contre
  // l'intuition qui a fermé PANO-35 lot 2 deux fois : « im so ocd about my desk drawers », « im
  // autistic about train timetables », « im depressed that the bakery closed early », « im dyslexic
  // when it comes to left and right » PORTENT tous la copule. Ce qui rend l'admission tenable n'est
  // donc pas le cadre, c'est l'ÉTAGE : aucune de ces phrases ne peut produire un constat nommé.
  //
  // N'ENTRENT PAS :
  //   · `suicidal` — DETTE NOMMÉE EXISTANTE (en-tête de ce module), et elle reste fermée.
  //     L'étagement par coût d'erreur ne se lève pas parce qu'un tier voisin s'ouvre.
  //   · `traumatized` / `traumatised` — colloquialisés, exclusion déjà écrite en `explicit`.
  //   · `manic`, `paranoid`, `obsessive`, `schizophrenic` — DEUXIÈME PORTE d'ADR-0003 : noms de
  //     maladie devenus qualificatifs péjoratifs génériques, appliqués à un tiers ou à un objet
  //     (« my laptop is being schizophrenic today »). Ils se trompent sur le SUJET, pas sur
  //     l'intensité, et ils chevauchent `conflictual` où la même phrase serait mieux lue.
  //   · `mentally ill`, `medicated`, `highly sensitive`, `overstimulated` — trop peu désignants.
  selfDeclaredEn: [
    'depressed',
    'depressive',
    'anxious',
    'bipolar',
    'autistic',
    'neurodivergent',
    'adhd',
    'ocd',
    'agoraphobic',
    'anorexic',
    'bulimic',
    'dyslexic',
    'dyspraxic',
    'insomniac',
    'burnt out',
    'burned out',
    'in therapy',
    'on antidepressants',
  ],
  // ── NOMS NUS DE TROUBLE — tag large à eux seuls, jamais nommé ────────────────────────────────
  // Mesuré (banc EN de borne haute) puis livré en deux temps, et les deux temps comptent.
  //
  // Ces trois-là portaient un constat NOMMÉ, c'est-à-dire l'affirmation qu'une personne A cette
  // condition. Faux sur « this heat is giving me actual depression », « i have ptsd from the ninth
  // one », « my anxiety when the file was still rendering » : l'anglais courant les emploie comme
  // intensificateurs, au même titre que « bipolar » pour la météo. Ils ne pouvaient pas rester.
  //
  // Ils ne pouvaient pas non plus descendre en colloquial — première tentative, MESURÉE ET REFUSÉE
  // (`en-demotion-ablation.test.ts`) : sous le seuil de 2, une personne qui écrit UNE fois qu'elle
  // fait une dépression ne tombait pas en large, elle DISPARAISSAIT. Le tier solo existe pour ce
  // trou-là, entre les deux.
  //
  // Ce que ça coûte, accepté en connaissance de cause : plus AUCUN nom nu de trouble ne produit de
  // constat nommé, dans aucune des deux langues. Le nommé ne vient plus que des syntagmes
  // diagnostiques (`anxiety disorder`, `depression nerveuse`, `post traumatic stress`…) et des
  // termes sans emploi figuré. `depression` et `ptsd` sont des entrées UNIQUES servant les deux
  // langues : le français change avec l'anglais, et c'est voulu — un mot ne se traite pas
  // différemment selon la langue où il est écrit.
  indirectSolo: [
    'anxiety',
    'depression', // (EN/FR) entrée commune aux deux langues
    'ptsd', // (EN/FR) sigle commun aux deux langues
  ],
  // Soin/suivi + mal-être sans condition nommée → signal fort mais tag LARGE (jamais nommé, B3).
  indirectCore: [
    'psy',
    'therapie',
    'mal etre',
    "j'en peux plus",
    'jpeux plus',
    'psychologue',
    'psychiatre',
    'psychotherapie',
    'therapeute',
    'suivi psy',
    'rendez vous psy',
    'antidepresseurs',
    'antidepresseur',
    'anxiolytiques',
    'anxiolytique',
    'somniferes',
    'en hp',
    // Médicaments nommés (décision yuya) : génériques (produits du domaine, pas des personnes),
    // registre réel du soin. « xanax » est DESCENDU en colloquial (PANO-35) : son registre
    // récréatif est bien plus installé en EN qu'en FR.
    'lexomil',
    'prozac', // (EN) identique — marque commune aux deux langues
    'sante mentale',
    'a bout',
    'a bout de nerfs',
    'plus gout a rien',
    'envie de rien',
    'pas le moral',
    'le moral a zero',
    'epuise moralement',
    'epuisement',
    'detresse',
    'insomnies',
    'nuits blanches',
    'crise de larmes',
    // Champ « mal-être ado / registre parent » (PANO-36) — le filtre 3ᵉ personne le dégrade
    // naturellement (chemin signal-sans-vécu, B3).
    'se renferme',
    'phobie scolaire',
    'ne veut plus sortir',
    // ── Variantes EN (PANO-35) : soin et suivi ─────────────────────────────────────────────────
    // Ce tier porte moins d'exclusions que les autres, et c'est structurel : l'hyperbole s'attaque
    // aux ÉTATS, pas aux INSTITUTIONS. « therapist » ou « psych ward » n'ont pas d'emploi figuré.
    'therapy', // réserve assumée : « retail therapy », « music is my therapy » — le seuil 2 filtre
    'therapist',
    'in therapy',
    'psychiatrist',
    'psychologist',
    'psychotherapy',
    'counseling',
    'counselling',
    'antidepressant',
    'antidepressants',
    'ssri',
    'mental health',
    'mental breakdown',
    'insomnia',
    'sleepless nights',
    'crying spells',
    'psych ward',
    'inpatient',
    // Médicaments EN courants — même justification qu'en FR (produits du domaine, pas des
    // personnes). « xans » et « bars » sont écartés : argot purement récréatif, et « bars » est
    // massivement polysémique.
    'zoloft',
    'lexapro',
    'sertraline',
    // Registre parent, pendant du champ « mal-être ado » FR ci-dessus. La 3ᵉ personne EN
    // (`THIRD_PERSON_EN` : « my teen », « for my », « help my ») dégrade déjà ces items vers le
    // chemin signal-sans-vécu (B3) — livrée au lot 1, rien à ajouter ici.
    'school refusal',
    "won't leave his room",
    'wont leave his room', // double graphie : l'usage d'internet omet l'apostrophe (cf. filters-en)
  ],
  // Familier / argot — polysémique assumé (le foyer recall/FP).
  indirectColloquial: [
    // « toc » (TOC) : en colloquial et non explicit (vérifié empiriquement PANO-36 — « toc toc »,
    // « du toc » taguaient une condition NOMMÉE à tort). Le seuil 2 exige la répétition ; le vrai
    // signal TOC répété reste capté en large. Décision yuya.
    'toc',
    'deprime',
    'deprimee',
    'cafard',
    'blues',
    'je craque',
    'au fond du trou',
    'en mode survie',
    'decroche',
    'peter un cable',
    'pete un cable',
    'craquage',
    'au bout de ma vie',
    'plus la force',
    'a plat',
    'dans le mal',
    'broyer du noir',
    'en depress',
    'je flippe',
    'psychoter',
    'je sature',
    // ── Variantes EN (PANO-35) : registre bas LITTÉRAL et polysémique — jamais hyperbolique ─────
    // Ce tier reste le foyer de la POLYSÉMIE (un sens parmi d'autres, que la répétition départage),
    // pas de l'hyperbole (un sens conventionnel non littéral, que la répétition ne départage pas).
    'ocd', // même chemin que « toc » ci-dessus : hors `explicit` malgré son statut clinique, parce
    // que « i'm so OCD about my desk » est l'usage colloquialisé documenté. Le seuil 2 laisse
    // passer le vrai signal répété, en large — jamais en nommé.
    'burned out', // le PARTICIPE, largement figuré (« burned out on this show ») — d'où le tier
    'burnt out',
    'xanax', // (EN/FR) descendu de `indirectCore` (voir la note là-haut)
    // RETRAIT MESURÉ (banc FP EN) — cinq formulations ont été livrées ici puis retirées :
    // « falling apart », « rock bottom », « spiraling »/« spiralling », « running on empty »,
    // « overwhelmed ». Elles taguaient une persona NON-PORTEUSE qui écrit par hyperbole (file
    // d'attente, levain, finale de série) et n'apportaient AUCUN rappel sur la persona réellement
    // en détresse : 100 % de leur signal du mauvais côté. Leur usage dominant dans le registre visé
    // est conventionnellement hyperbolique — la règle d'admission d'ADR-0003 les exclut, et le tier
    // colloquial n'est pas une zone de relégation. Ne pas les réintroduire sans mesure contraire.
    'no motivation',
    'low mood',
    'breaking point',
    'numb', // polysémique littéral (froid, dentiste) — exactement le profil de ce tier
    'empty inside',
    "can't get out of bed",
    'cant get out of bed',
  ],
  includeColloquial: true,
  indirectThreshold: 2,
};
