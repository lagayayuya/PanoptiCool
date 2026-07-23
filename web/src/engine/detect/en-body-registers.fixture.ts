// EN false-positive bench — THE BODY. Three voices and their GROUND TRUTH.
//
// ── This file is sealed ────────────────────────────────────────────────────────────────────────
// Written and committed BEFORE any reading of the lexicon and BEFORE the first pass of the detector. It is its
// only property that counts: « false positive » has no meaning without an expected state written in advance,
// and judging after seeing the output amounts to judging leniently. The seal is the commit; rereading
// it in the history is the only way to check that the ground truth was not adjusted
// to the measurement.
// ⚠ SEAL AND PUBLISHED HISTORY. The pre-publication recomposition (2026-07-21) flattened
// the working history: fixture and sensor are born there in the same commit. The proof of ORDER
// lives now only in the local tag `pre-squash-2026-07-21`, unpublished — in the published
// history, this seal reads as a statement of method, not as a verifiable fact.
//
// ── Why these three voices exist ─────────────────────────────────────────────────────────────
// No sealed voice of any bench writes about the body. Measured, not supposed: 0 items out of 30 in
// each of the three witness voices of the EN bench. A report « no false positive on `health_physical` »
// leaning on those benches would therefore say nothing at all — the detector would simply never have been
// put in front of the subject. It is the pattern named by CLAUDE.md (*Ce qu'un filet prouve*): a negative
// assertion verifies what it REACHES, not what it affirms.
//
// ── The variable is the POSITION toward the illness, not the register ───────────────────────────────
// The EN `mental_health` bench varies the WAY of writing (flat, hyperbolic, slang). This
// bench varies something else: the RELATION between the one who writes and the illness in
// question. The three voices use a dense, literal bodily vocabulary; what separates them
// is who the illness belongs to — to her, to no one, to her mother. The three
// ground-truth states of ADR-0003 are exactly these three positions, and that is why the trio
// measures something rather than accumulating voices.
//
// ── Writing by SITUATION, never by vocabulary ───────────────────────────────────────────────
// The writing instruction bore on situations, never on words. None of these voices was
// steered toward a term: what each person writes is what someone in their situation writes,
// and the words that come out are the RESULT to measure, not the input. Aiming at a term would have produced
// a bench that confirms itself.
//
// ── WHAT WAS READ, and it is the guarantee ────────────────────────────────────────────────────────
// Declared here because a blind writing that does not say what it saw cannot be verified.
//
// READ: `CLAUDE.md`; `register-bench.ts` (types and ground truth, without data);
// `register-bench.harness.ts` (the counting mechanics); `en-registers.fixture.ts` and
// `en-fp-bench.test.ts` — FOR THEIR FORM, that is, how a voice declares itself and how its
// ground truth is recorded.
//
// NOT READ, by design: no module of `lexicon/`, no term list, no `filters-*.ts`
// file, no portability note, no history message bearing on the lexicon or
// the filters. The value of this file rests on its author not knowing which terms are under study.
//
// LEAK TO DECLARE, and it is not nil: `en-fp-bench.test.ts`, whose reading was
// necessary for the form, NAMES in its comments five removed hyperbolic terms, a set of
// candidate copula heads, and the tier of a bare name. These are `mental_health` terms, not body
// ones — but the discipline held is therefore « ignorance of the BODY lexicon », not « ignorance of the
// lexicon ». Naming the leak is better than presuming it harmless.
//
// ── No real value ─────────────────────────────────────────────────────────────────────────
// Each string is invented (CLAUDE.md). The external research bore on the FORM of the register —
// the escalation then self-resolution of symptom searches by someone who is fine, the
// predominance of LOGISTICAL vocabulary over the vocabulary of suffering in someone living with a
// condition, the split between emotional and logistical load in caring relatives. Never on
// reused content. No real message, handle, date or identifier enters here.
//
// ── WHAT THIS BENCH DOES NOT MEASURE ─────────────────────────────────────────────────────────────
// - The REGISTER. The three voices write in everyday, punctuated English. A person who lived the
//   same condition in dense slang or permanent hyperbole is not here, and nothing in this bench
//   allows a conclusion about her. The position × register crossing remains whole.
// - The five other labels. They are sealed `nonCarrier` everywhere because these lives do not carry
//   them, not because they were tested: a zero on them measures the absence of a subject, not the
//   detector's safety.
// - VITAL distress and grave prognosis. No voice is at end of life nor facing a
//   threatening diagnosis. The error cost there is maximal and restraint costs nothing to the
//   demonstration.
// - French. These voices are English; the FR bench has its own.

import { allNonCarrier, type RegisterPersona } from './register-bench';

export type { BenchItem, GroundTruth, RegisterPersona, SensitiveLabel } from './register-bench';
export { SENSITIVE_LABELS } from './register-bench';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 1. LIVING WITH — the true positive
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
// 2. THE ONE WHO SEARCHES — the voice that carries this bench's risk
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
// 3. THE CARING RELATIVE — real signal, someone else's body
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
 * The three body voices. The order is that of the three ground-truth states: the lived, the
 * non-carrier, the signal without lived experience.
 */
export const EN_BODY_REGISTER_PERSONAS: readonly RegisterPersona[] = [LIVING, WORRIER, RELATIVE];
