// Banc de faux positifs EN — LE CORPS. Trois voix et leur VÉRITÉ-TERRAIN.
//
// ── Ce fichier est scellé ────────────────────────────────────────────────────────────────────────
// Écrit et commité AVANT toute lecture du lexique et AVANT le premier tour du détecteur. C'est sa
// seule propriété qui compte : « faux positif » n'a pas de sens sans un état attendu écrit d'avance,
// et juger après avoir vu la sortie revient à juger avec indulgence. Le sceau est le commit ; le
// relire dans l'historique est la seule façon de vérifier que la vérité-terrain n'a pas été ajustée
// à la mesure.
// ⚠ SCEAU ET HISTORIQUE PUBLIÉ. La recomposition d'avant publication (2026-07-21) a aplati
// l'historique de travail : fixture et capteur y naissent dans le même commit. La preuve d'ORDRE
// ne vit plus que dans le tag local `pre-squash-2026-07-21`, non publié — dans l'historique
// publié, ce sceau se lit comme une déclaration de méthode, pas comme un fait vérifiable.
//
// ── Pourquoi ces trois voix existent ─────────────────────────────────────────────────────────────
// Aucune voix scellée d'aucun banc n'écrit sur le corps. Mesuré, pas supposé : 0 item sur 30 dans
// chacune des trois voix témoins du banc EN. Un rapport « aucun faux positif sur `health_physical` »
// appuyé sur ces bancs-là ne dirait donc rien du tout — le détecteur n'aurait simplement jamais été
// mis devant le sujet. C'est le motif nommé par CLAUDE.md (*Ce qu'un filet prouve*) : une assertion
// négative vérifie ce qu'elle ATTEINT, pas ce qu'elle affirme.
//
// ── La variable est la POSITION face à la maladie, pas le registre ───────────────────────────────
// Le banc EN de `mental_health` fait varier la FAÇON d'écrire (plate, hyperbolique, argotique). Ce
// banc-ci fait varier autre chose : la RELATION entre celle qui écrit et la maladie dont il est
// question. Les trois voix emploient un vocabulaire corporel dense et littéral ; ce qui les sépare,
// c'est à qui la maladie appartient — à elle, à personne, à sa mère. Les trois états de
// vérité-terrain d'ADR-0003 sont exactement ces trois positions, et c'est pour ça que le trio
// mesure quelque chose plutôt que d'accumuler des voix.
//
// ── Écriture par SITUATION, jamais par vocabulaire ───────────────────────────────────────────────
// La consigne d'écriture portait sur des situations, jamais sur des mots. Aucune de ces voix n'a été
// dirigée vers un terme : ce que chaque personne écrit est ce que quelqu'un dans sa situation écrit,
// et les mots qui en sortent sont le RÉSULTAT à mesurer, pas l'entrée. Viser un terme aurait produit
// un banc qui se confirme lui-même.
//
// ── CE QUI A ÉTÉ LU, et c'est la garantie ────────────────────────────────────────────────────────
// Déclaré ici parce qu'une écriture aveugle qui ne dit pas ce qu'elle a vu ne se vérifie pas.
//
// LU : `CLAUDE.md` ; `register-bench.ts` (types et vérité-terrain, sans données) ;
// `register-bench.harness.ts` (la mécanique de comptage) ; `en-registers.fixture.ts` et
// `en-fp-bench.test.ts` — POUR LEUR FORME, c'est-à-dire comment une voix se déclare et comment sa
// vérité-terrain s'inscrit.
//
// NON LU, à dessein : aucun module de `lexicon/`, aucune liste de termes, aucun fichier
// `filters-*.ts`, aucune note de portabilité, aucun message d'historique portant sur le lexique ou
// les filtres. La valeur de ce fichier tient à ce que son auteur ignore quels termes sont à l'étude.
//
// FUITE À DÉCLARER, et elle n'est pas nulle : `en-fp-bench.test.ts`, dont la lecture était
// nécessaire à la forme, NOMME dans ses commentaires cinq termes hyperboliques retirés, un jeu de
// têtes de copule candidates, et le tier d'un nom nu. Ce sont des termes de `mental_health`, pas du
// corps — mais la discipline tenue est donc « ignorance du lexique du CORPS », pas « ignorance du
// lexique ». Nommer la fuite vaut mieux que la présumer inoffensive.
//
// ── Aucune valeur réelle ─────────────────────────────────────────────────────────────────────────
// Chaque chaîne est inventée (CLAUDE.md). La recherche externe a porté sur la FORME du registre —
// l'escalade puis l'auto-résolution des recherches de symptômes chez quelqu'un qui va bien, la
// prédominance du vocabulaire LOGISTIQUE sur le vocabulaire de la souffrance chez qui vit avec une
// condition, le partage entre charge émotionnelle et logistique chez les proches aidants. Jamais sur
// des contenus repris. Aucun message, pseudo, date ou identifiant réel n'entre ici.
//
// ── CE QUE CE BANC NE MESURE PAS ─────────────────────────────────────────────────────────────────
// - Le REGISTRE. Les trois voix écrivent en anglais courant et ponctué. Une personne qui vivrait la
//   même condition en argot dense ou en hyperbole permanente n'est pas ici, et rien de ce banc ne
//   permet de conclure sur elle. Le croisement position × registre reste entier.
// - Les cinq autres labels. Ils sont scellés `nonCarrier` partout parce que ces vies ne les portent
//   pas, pas parce qu'ils ont été éprouvés : un zéro sur eux mesure l'absence de sujet, pas la
//   sûreté du détecteur.
// - La détresse VITALE et le pronostic grave. Aucune voix n'est en fin de vie ni devant un
//   diagnostic qui menace. Le coût d'erreur y est maximal et la retenue ne coûte rien à la
//   démonstration.
// - Le français. Ces voix sont anglaises ; le banc FR a les siennes.

import { allNonCarrier, type RegisterPersona } from './register-bench';

export type { BenchItem, GroundTruth, RegisterPersona, SensitiveLabel } from './register-bench';
export { SENSITIVE_LABELS } from './register-bench';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 1. VIVRE AVEC — le vrai positif
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const LIVING: RegisterPersona = {
  id: 'living',
  register: 'littéral et LOGISTIQUE — la maladie est une administration, pas un drame',
  who: "Trente-huit ans, vend des plantes dans une jardinerie, chante en second alto dans une chorale de quartier et rate systématiquement toutes les questions du quiz radio sauf celles sur les fleuves. Elle vit depuis dix ans avec une polyarthrite rhumatoïde : le méthotrexate le samedi, les prises de sang, les rendez-vous de rhumatologie qu'on déplace. Ce n'est pas le sujet de sa vie, c'est une charge de fond — et ce qu'elle en dit ressemble beaucoup plus à de la paperasse qu'à de la souffrance.",
  truth: allNonCarrier({ health_physical: 'lived' }),
  truthNotes:
    "`health_physical` VÉCU. C'est le vrai positif du banc, et un banc sans positif ne distingue pas un détecteur sûr d'un détecteur mort : si cette voix ne déclenche rien, les zéros des deux autres ne valent rien non plus. Deux choses à dire honnêtement. (1) Elle n'a été dirigée vers AUCUN terme — si elle écrit le nom de sa condition et celui de son traitement, c'est parce que quelqu'un dans sa situation les écrit, pas parce que je les visais ; et si malgré ça le détecteur ne la tague pas, c'est un défaut de rappel à publier, pas un échec de la voix. (2) `mental_health` est scellé NON-PORTEUR et c'est un appel que je défends : « honestly the admin is worse than the injections » et « ten years in and i still forget to order the repeat » sont de l'agacement d'adulte organisé, pas un état. Elle va bien. Un tag `mental_health` ici serait un tort. Un appel plus faible : l'item 19 mentionne une salle paroissiale pour les répétitions — c'est un LIEU avec une bonne acoustique, pas une pratique, et je le scelle hors `religion`. Si le détecteur tague, la note de mesure devra dire lequel de nous deux avait raison plutôt qu'enregistrer un tort en silence.",
  items: [
    {
      kind: 'comment',
      text: 'methotrexate day is always a saturday for me, i just plan around it now',
    },
    { kind: 'search', text: 'rheumatology appointment rescheduled again who to call' },
    {
      kind: 'comment',
      text: 'the choir concert clashes with my blood test week but im going anyway',
    },
    { kind: 'search', text: 'best jar opener for weak grip' },
    { kind: 'comment', text: 'honestly the admin is worse than the injections' },
    { kind: 'search', text: 'methotrexate and alcohol how much is fine' },
    { kind: 'comment', text: 'we sold out of dahlias in about an hour today. good day' },
    { kind: 'search', text: 'repeat prescription pharmacy app not updating' },
    {
      kind: 'comment',
      text: 'my hands are bad in the morning and fine by eleven, thats just the pattern',
    },
    { kind: 'search', text: 'folic acid same day as methotrexate or different day' },
    { kind: 'comment', text: 'i got the quiz question about rivers and nothing else. tragic' },
    { kind: 'search', text: 'rheumatoid arthritis flare how long do they last' },
    { kind: 'comment', text: 'the trick is a stool behind the counter, nobody minds' },
    { kind: 'search', text: 'blood test form lost can i just turn up' },
    { kind: 'comment', text: 'ten years in and i still forget to order the repeat until friday' },
    { kind: 'search', text: 'gardening gloves for sore hands' },
    { kind: 'comment', text: 'she asked if i was too young for it. people always do' },
    { kind: 'search', text: 'biologics waiting time first appointment' },
    {
      kind: 'comment',
      text: 'we are doing the spring programme in the church hall this year, good acoustics',
    },
    { kind: 'search', text: 'do i need a fit note for a hospital appointment' },
    { kind: 'search', text: 'methotrexate nausea what helps' },
    { kind: 'search', text: 'choir sheet music second alto free' },
    { kind: 'search', text: 'parking charges at the hospital how to pay' },
    { kind: 'search', text: 'compost delivery bulk price' },
    { kind: 'search', text: 'can you get a blue badge with arthritis' },
    { kind: 'search', text: 'radio quiz repeat what time' },
    { kind: 'search', text: 'how to open a ring pull with sore fingers' },
    { kind: 'search', text: 'rheumatology helpline number' },
    { kind: 'search', text: 'seed potatoes chitting when to start' },
    { kind: 'search', text: 'travelling with injectable medication rules' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 2. CELLE QUI CHERCHE — la voix qui porte le risque de ce banc
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const WORRIER: RegisterPersona = {
  id: 'worrier',
  register: 'vocabulaire de symptômes dense et LITTÉRAL — sans aucune condition derrière',
  who: "Trente ans, bureau de logistique, nage en eau libre toute l'année et le raconte à qui veut l'entendre, équipe de quiz du mardi, trop de plantes vertes. Elle a le réflexe de chercher : une bosse, une migraine d'un seul côté, un pouls bas, un fourmillement au réveil. Elle escalade en une ou deux recherches, se fait peur, trouve l'explication banale, et passe à autre chose en s'en moquant elle-même. Elle n'a rien, et elle n'a jamais rien eu.",
  truth: allNonCarrier(),
  truthNotes:
    "Non-porteuse sur les six, et c'est l'affirmation la plus lourde du banc. Cette voix est le pendant corporel de la voix hyperbolique du banc `mental_health`, et elle est PIRE pour le détecteur : l'hyperbolique emploie des mots forts au sens figuré, celle-ci emploie des mots de symptômes au sens PROPRE — la bosse existe, le fourmillement existe, le pouls à 48 existe. Ce qui n'existe pas, c'est la maladie. Aucun mécanisme fondé sur la présence d'un terme ne peut les distinguer, et le seuil de répétition ne protège pas : elle cherche BEAUCOUP, par construction, parce que c'est ce que fait quelqu'un qui s'inquiète pour rien. Le seuil n'écarte pas, il accumule (ADR-0003, *L'admission d'un terme*). Tout tag `health_physical` sur cette persona est un tort, sans exception et quel que soit l'étage. Deux appels contestables, écrits parce qu'un annotateur qui cache ses arbitrages ne mesure rien : (1) `mental_health` est scellé NON-PORTEUR. L'inquiétude de santé ordinaire n'est pas une condition — « someone tell me to stop reading symptom pages » et « genuinely why do i do this to myself at 1am » sont de l'auto-dérision, la forme même par laquelle quelqu'un signale qu'il ne se prend pas au sérieux. Je tiens qu'une plateforme qui la classerait en santé mentale se tromperait ; c'est l'appel le plus discutable du banc et je le laisse discutable plutôt que de l'arrondir. (2) « i had this exact thing last summer and it was nothing » parle d'une chose qui n'était rien — c'est une NÉGATION, et la voix la plus naturelle qui soit pour éprouver le filtre de négation en conditions réelles.",
  items: [
    {
      kind: 'comment',
      text: 'i had this exact thing last summer and it was nothing, for what its worth',
    },
    { kind: 'search', text: 'small red bump on arm not itchy' },
    { kind: 'comment', text: 'right well ive decided its a spot and im moving on with my day' },
    { kind: 'search', text: 'is a headache behind one eye serious' },
    {
      kind: 'comment',
      text: 'the lake was 11 degrees this morning and i have never felt more alive',
    },
    { kind: 'search', text: 'heart rate 48 resting is that too low' },
    {
      kind: 'comment',
      text: 'i looked it up, got scared, looked it up again, and now im fine. classic',
    },
    { kind: 'search', text: 'athlete low resting heart rate normal' },
    { kind: 'comment', text: 'my monstera has one sad leaf and i am taking it personally' },
    { kind: 'search', text: 'twinge in side after swimming' },
    { kind: 'comment', text: 'we lost the quiz on the music round again. every single week' },
    { kind: 'search', text: 'how long should a bruise take to fade' },
    { kind: 'comment', text: 'genuinely why do i do this to myself at 1am' },
    { kind: 'search', text: 'tingling in hand when i wake up causes' },
    { kind: 'comment', text: 'update: it was the way i was sleeping on it. mystery solved' },
    { kind: 'search', text: 'best wetsuit gloves for winter swimming' },
    { kind: 'comment', text: 'i am not going to the doctor about a freckle. i am not. probably' },
    { kind: 'search', text: 'mole colour change what to look for' },
    { kind: 'comment', text: 'someone tell me to stop reading symptom pages' },
    { kind: 'search', text: 'dry cough three days no fever' },
    { kind: 'search', text: 'why do i get pins and needles in my foot' },
    { kind: 'search', text: 'quiz team name ideas funny' },
    { kind: 'search', text: 'is it normal to feel dizzy standing up fast' },
    { kind: 'search', text: 'water temperature safe swimming guidelines' },
    { kind: 'search', text: 'stomach ache after coffee on empty stomach' },
    { kind: 'search', text: 'houseplant yellow leaves overwatering' },
    { kind: 'search', text: 'ear popping when swallowing normal' },
    { kind: 'search', text: 'when should you actually see a gp about a lump' },
    { kind: 'search', text: 'best waterproof tow float' },
    { kind: 'search', text: 'random muscle twitch eyelid cause' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 3. LE PROCHE AIDANT — signal réel, corps de quelqu'un d'autre
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const RELATIVE: RegisterPersona = {
  id: 'relative',
  register: "troisième personne systématique — le corps concerné n'est jamais celui du locuteur",
  who: "Quarante-cinq ans, sa mère a fait un AVC il y a huit mois. Elle organise : le kiné, le transport, les rampes de la salle de bain, les formulaires. Son frère habite à quatre heures de route, donc c'est elle. À côté de ça elle court, mal et régulièrement, et suit un cours d'espagnol du soir qu'elle décrit comme la seule heure de la semaine qui lui appartienne. Elle va bien, physiquement ; c'est sa mère qui ne va pas bien, et elle ne dit jamais « j'ai ».",
  truth: allNonCarrier({ health_physical: 'signalWithoutLived' }),
  truthNotes:
    "`health_physical` = signal SANS vécu, et le tag est ATTENDU — pas toléré, attendu. Qu'une plateforme tague l'entourage d'une personne malade aussi sûrement que la personne elle-même est exactement ce que le produit existe pour montrer : la plateforme ne sait pas « pour qui » vaut le signal, et elle tague quand même. Le tort à surveiller ici n'est donc PAS le tag, c'est la SUR-CLASSIFICATION — un constat nommé, de haute confiance, posé sur elle comme s'il décrivait son propre corps. C'est aussi la première voix ENTIÈRE, plutôt que des phrases de test, à exposer les filtres de troisième personne sur le terrain du corps. Trois appels déclarés. (1) `mental_health` scellé NON-PORTEUR : elle est fatiguée et parfois seule (« my spanish class is the only hour a week that is mine »), ce qui est la description exacte d'une charge d'aidant, pas d'un état. Appel défendable dans les deux sens et je le laisse tel quel. (2) `politics` scellé NON-PORTEUR malgré « anyone else spend their lunch break on hold to a surgery » et « the physio was brilliant, genuinely. the paperwork was not » : râler sur une file d'attente n'est pas une position politique, c'est de la logistique vécue. Si le détecteur y voit du `politics`, c'est un tort. (3) « he still calls it a funny turn. it was a stroke » est une CITATION suivie d'une correction — la voix la plus naturelle pour éprouver le filtre de citation, et elle n'a pas été écrite pour ça.",
  items: [
    {
      kind: 'comment',
      text: 'mums physio comes on tuesdays and thursdays now, it has made a difference',
    },
    { kind: 'search', text: 'stroke recovery timeline six months' },
    { kind: 'comment', text: 'he still calls it a funny turn. it was a stroke' },
    { kind: 'search', text: 'occupational therapy home assessment what happens' },
    { kind: 'comment', text: 'she gets frustrated with the words more than the walking' },
    { kind: 'search', text: 'aphasia speech therapy waiting list' },
    { kind: 'comment', text: 'i did the 10k in a worse time than last year but i did it' },
    { kind: 'search', text: 'grab rails bathroom who installs them' },
    {
      kind: 'comment',
      text: 'her blood pressure tablets got changed twice in a month and nobody told me',
    },
    { kind: 'search', text: 'carers allowance eligibility hours' },
    { kind: 'comment', text: 'anyone else spend their lunch break on hold to a surgery' },
    { kind: 'search', text: 'stroke ward discharge checklist' },
    { kind: 'comment', text: 'my spanish class is the only hour a week that is mine' },
    { kind: 'search', text: 'how to arrange hospital transport for an elderly parent' },
    {
      kind: 'comment',
      text: 'she was doing the crossword every day before. she does about half now',
    },
    { kind: 'search', text: 'power of attorney health and welfare cost' },
    {
      kind: 'comment',
      text: 'my brother lives four hours away so it is mostly me, thats just how it is',
    },
    { kind: 'search', text: 'signs of a second stroke what to watch for' },
    { kind: 'comment', text: 'the physio was brilliant, genuinely. the paperwork was not' },
    { kind: 'search', text: 'respite care one week how to book' },
    { kind: 'search', text: 'stroke association support group local' },
    { kind: 'search', text: 'best running shoes for road half marathon' },
    { kind: 'search', text: 'blood thinners and bruising in elderly' },
    { kind: 'search', text: 'adapting a kitchen after stroke' },
    { kind: 'search', text: 'spanish past tense practice exercises' },
    { kind: 'search', text: 'how to talk to a gp on behalf of a parent' },
    { kind: 'search', text: 'swallowing difficulty after stroke diet' },
    { kind: 'search', text: 'attendance allowance form help' },
    { kind: 'search', text: 'community nurse how often do they visit' },
    { kind: 'search', text: 'stroke rehab does it stop improving after a year' },
  ],
};

/**
 * Les trois voix du corps. L'ordre est celui des trois états de vérité-terrain : le vécu, le
 * non-porteur, le signal sans vécu.
 */
export const EN_BODY_REGISTER_PERSONAS: readonly RegisterPersona[] = [LIVING, WORRIER, RELATIVE];
