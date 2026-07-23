// EN false-positive bench — the personas and their GROUND TRUTH (PANO-35, instrument of the debt
// opened by the EN `mental_health` pilot batch).
//
// ── This file is sealed ────────────────────────────────────────────────────────────────────────
// It was written and committed BEFORE any reading of the lexicon and BEFORE the first pass of the detector.
// It is its only property that counts: « false positive » has no meaning without an expected state written
// in advance, and judging after seeing the output amounts to judging leniently — a plausible
// detection always rationalizes itself. The seal is the commit; rereading it in the history is the
// only way to check that the ground truth was not adjusted to the measurement.
// ⚠ SEAL AND PUBLISHED HISTORY. The pre-publication recomposition (2026-07-21) flattened
// the working history: fixture and sensor are born there in the same commit. The proof of ORDER
// lives now only in the local tag `pre-squash-2026-07-21`, unpublished — in the published
// history, this seal reads as a statement of method, not as a verifiable fact.
//
// Corollary: this module depends on NO lexicon module, not even for the label type.
// The `SensitiveLabel` union below is rewritten locally by design — a dependency toward
// `lexicon/` would make the sealed file a file that has looked.
//
// ── The variable is the REGISTER, not the subject ────────────────────────────────────────────────
// Hyperbole is a property of the WAY someone writes, not of what they talk about. A bench
// that varied the themes would therefore measure nothing of the risk this batch carries. The six voices
// below talk about different things because different people talk about different
// things — but what separates them, and what is measured, is their way of writing.
//
// ── No real value ─────────────────────────────────────────────────────────────────────────
// Each string is invented (CLAUDE.md). The external research bore on the FORM of the online
// anglophone register — length, case, the comment as half a conversation — never on
// reused content. No real message, handle, date or identifier enters here.
//
// ── Declared limit, and it is not slight ─────────────────────────────────────────────────────
// The writing was NOT blind in the strict sense: the pilot batch's method note, whose reading
// was requested, enumerates in §3 and §4 the admitted terms AND the exclusions. The discipline held is
// therefore weaker than « blind » and it must be named as such: writing TO THE VOICE —
// each persona written according to its own internal logic, without re-consulting the lists, and deliberately
// avoiding aiming at the exclusions already frozen by the adversarial battery (replaying them would produce
// a green light without information). The complete limits live in the measurement note.

// The ground-truth vocabulary (types, states, helper) was EXTRACTED to `register-bench.ts`
// at the opening of the FR bench, which shares it. No state below moved on that occasion: what
// the seal freezes are ground truths, not type declarations.
import { allNonCarrier, type RegisterPersona } from './register-bench';

export type { BenchItem, GroundTruth, RegisterPersona, SensitiveLabel } from './register-bench';
export { SENSITIVE_LABELS } from './register-bench';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 1. THE FLAT VOICE — the witness
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const PLAIN: RegisterPersona = {
  id: 'plain',
  register: 'sobre, littéral, ponctué — aucune amplification, jamais',
  who: "Un bricoleur d'une cinquantaine d'années qui répare ce qui casse et cultive un bout de jardin. Il écrit en phrases entières, avec des points, et ne force jamais un mot : ce qui est décevant est « décevant ». C'est le témoin du banc — si une voix qui n'exagère rien déclenche un constat sensible, le problème n'est ni le registre ni la langue, il est dans le terme.",
  truth: allNonCarrier(),
  truthNotes:
    "Non-porteur sur les six. Rien dans cette vie ne porte de signal sensible : ni condition, ni soin, ni proche concerné, ni engagement. Un seul item mérite d'être signalé comme piège tendu sciemment — « why is my lawn mower smoking » : « smoking » est une homographie parfaite avec le registre du tabac, et c'est exactement ce qu'un vrai humain tape quand sa tondeuse fume. S'il déclenche `health_physical`, c'est un tort d'homographie accidentelle (note de méthode du pilote §2.4), et il est trouvé par une phrase que personne n'a écrite pour piéger le détecteur.",
  items: [
    { kind: 'comment', text: 'took mine apart last spring, same thing was wrong with it' },
    { kind: 'search', text: 'how to replace the washer in a tap' },
    { kind: 'comment', text: 'that is a good price for what it is' },
    { kind: 'search', text: 'when to prune apple trees' },
    { kind: 'comment', text: 'we get these in the yard every summer' },
    { kind: 'search', text: 'best way to sharpen a chisel' },
    { kind: 'comment', text: 'the second one looked better to me' },
    { kind: 'search', text: 'recycling centre opening times' },
    { kind: 'comment', text: 'i have had that same kettle for eleven years' },
    { kind: 'search', text: 'why is my lawn mower smoking' },
    { kind: 'comment', text: 'worth doing properly the first time' },
    { kind: 'search', text: 'cost to service a boiler' },
    { kind: 'comment', text: 'mine came out flatter than that but it was fine' },
    { kind: 'search', text: 'how much compost per square metre' },
    { kind: 'comment', text: 'the older ones were built better, i think' },
    { kind: 'search', text: 'train times to the coast' },
    { kind: 'comment', text: 'not much to it once you find the right screw' },
    { kind: 'search', text: 'squirrel proof bird feeder' },
    { kind: 'comment', text: 'good result. nice work' },
    { kind: 'search', text: 'how to get moss off a patio' },
    { kind: 'comment', text: 'we had rain most of the week so nothing got done' },
    { kind: 'search', text: 'difference between tarmac and asphalt' },
    { kind: 'comment', text: 'i would use the wider blade for that' },
    { kind: 'search', text: 'shed roof felt replacement' },
    { kind: 'comment', text: 'it has held up fine so far, no complaints' },
    { kind: 'search', text: 'why do tomatoes split on the vine' },
    { kind: 'search', text: 'library opening hours saturday' },
    { kind: 'search', text: 'how to test a fuse with a multimeter' },
    { kind: 'search', text: 'slug pellets safe for pets' },
    { kind: 'search', text: 'how long does emulsion take to dry' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 2. THE HYPERBOLIC VOICE — the persona that carries this batch's risk
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const HYPERBOLIC: RegisterPersona = {
  id: 'hyperbolic',
  register: 'amplification conventionnelle permanente — le superlatif est la ponctuation',
  who: "Vingt-cinq ans, très en ligne, fan de tout ce qu'elle aime à un degré qu'elle met un point d'honneur à surjouer. Sa vie est calme : elle fait du pain, suit une ligue de fantasy, et attend des places de concert. Rien ne lui arrive. Mais tout ce qui lui arrive est le pire ou le meilleur événement de l'histoire de l'humanité, et elle l'écrit comme ça — c'est de l'humour, et son entourage le lit comme tel.",
  truth: allNonCarrier(),
  truthNotes:
    "Non-porteur sur les six, et c'est l'affirmation la plus lourde du banc. Cette personne va bien : le désarroi qu'elle décrit porte sur une file d'attente, un levain et une finale de série. La détresse est la FORME de sa langue, jamais son fond. C'est la voix pour laquelle le seuil de répétition ne protège pas — répéter une hyperbole trois fois, c'est avoir ri trois fois (ADR-0003, *L'admission d'un terme*) : le seuil n'écarte pas, il accumule, et il transforme les locuteurs les plus expressifs en porteurs présumés. Tout tag `mental_health` sur cette persona est un tort, sans exception et quel que soit l'étage.",
  items: [
    { kind: 'comment', text: 'i am literally falling apart over this ticket queue' },
    { kind: 'search', text: 'presale code how to get one' },
    { kind: 'comment', text: 'no because this is genuinely rock bottom for me' },
    { kind: 'search', text: 'why is my sourdough starter flat' },
    { kind: 'comment', text: 'im spiraling and its not even 9am' },
    { kind: 'search', text: 'fantasy football waiver wire week 6' },
    { kind: 'comment', text: 'this finale has ruined my entire life and i mean that' },
    { kind: 'search', text: 'season 3 release date rumours' },
    { kind: 'comment', text: 'i cannot be normal about this trailer' },
    { kind: 'search', text: 'resale ticket price limit legal' },
    { kind: 'comment', text: 'im so overwhelmed there are 40 flavours and i have one life' },
    { kind: 'search', text: 'best bread flour for beginners' },
    { kind: 'comment', text: 'screaming crying throwing up over these shoes' },
    { kind: 'search', text: 'tour dates second leg announced' },
    { kind: 'comment', text: 'my starter has personally destroyed me this week' },
    { kind: 'search', text: 'why does my cake sink in the middle' },
    { kind: 'comment', text: 'running on empty after that queue but it was worth it' },
    { kind: 'search', text: 'merch restock time' },
    { kind: 'comment', text: 'this is the single worst thing to ever happen to any person' },
    { kind: 'search', text: 'stand mixer worth the money' },
    { kind: 'comment', text: 'im obsessed im unwell im completely normal about it i promise' },
    { kind: 'search', text: 'fantasy league tiebreaker rules' },
    { kind: 'comment', text: 'devastated. genuinely devastated. it is a cake' },
    { kind: 'search', text: 'trailer frame by frame breakdown' },
    { kind: 'comment', text: 'i have never recovered from that plot twist and i never will' },
    { kind: 'search', text: 'how long to proof dough overnight' },
    { kind: 'comment', text: 'not me refreshing this page for two hours straight' },
    { kind: 'search', text: 'cast interview full transcript' },
    { kind: 'comment', text: 'the state of me over a bread emergency' },
    { kind: 'search', text: 'queue position what does it mean' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 3. THE SLANG VOICE
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const SLANG: RegisterPersona = {
  id: 'slang',
  register:
    "argot d'internet dense — lexique court, syntaxe orale, formes d'origine AAVE devenues mainstream",
  who: "Vingt-et-un ans, en études, drôle, écrit comme il parle. Bouffe, musique, basket, et le bus de nuit qu'il rate systématiquement. Le registre est dense en formes courtes dont le sens conventionnel s'est éloigné du sens littéral — c'est une langue à part entière, pas une déformation de l'anglais, et c'est la voix que le vocabulaire clinique colloquialisé traverse le plus.",
  truth: allNonCarrier(),
  truthNotes:
    "Non-porteur sur les six. Deux appels contestables, écrits ici parce qu'un annotateur qui cache ses arbitrages ne mesure rien : (1) « bro is washed and he knows it » et « yall are not beating the allegations » sont de la vanne entre amis — je les juge HORS `conflictual`, dont la porte est l'insulte ÉMISE VISANT un autre utilisateur, et « washed » qualifie une performance sportive, pas un interlocuteur. Un lecteur peut ne pas être d'accord ; si le détecteur tague, la note de mesure devra dire lequel de nous deux avait raison plutôt que d'enregistrer un tort. (2) « im cooked » et « im weak » sont des rires, pas des états — même famille pragmatique que le reste de la voix.",
  items: [
    { kind: 'comment', text: 'lowkey the best thing on that menu no cap' },
    { kind: 'search', text: 'best halal spot near campus' },
    { kind: 'comment', text: 'deadass thought that was a filter' },
    { kind: 'search', text: 'when do playoff tickets drop' },
    { kind: 'comment', text: 'nah he ate that down' },
    { kind: 'search', text: 'cheap flights student discount' },
    { kind: 'comment', text: 'bro is washed and he knows it' },
    { kind: 'search', text: 'airpods only one side working fix' },
    { kind: 'comment', text: 'the way i gasped' },
    { kind: 'search', text: 'album release time midnight' },
    { kind: 'comment', text: 'its giving budget' },
    { kind: 'search', text: 'night bus route after 1am' },
    { kind: 'comment', text: 'im cooked for this exam ngl' },
    { kind: 'search', text: 'how much protein per day' },
    { kind: 'comment', text: 'aint no way she said that with her whole chest' },
    { kind: 'search', text: 'thrift store near me' },
    { kind: 'comment', text: 'mid at best, sorry' },
    { kind: 'search', text: 'why is my phone always hot' },
    { kind: 'comment', text: 'bet, see you there' },
    { kind: 'search', text: 'free things to do this weekend' },
    { kind: 'comment', text: 'she gagged the whole building' },
    { kind: 'search', text: 'how to cancel a gym membership' },
    { kind: 'comment', text: 'fr the bus driver is the villain of my life' },
    { kind: 'search', text: 'library late hours during exams' },
    { kind: 'comment', text: 'yall are not beating the allegations' },
    { kind: 'search', text: 'best cheap headphones under 50' },
    { kind: 'comment', text: 'im weak, not the caption' },
    { kind: 'search', text: 'concert age restriction 18 plus' },
    { kind: 'comment', text: 'this ate and left absolutely no crumbs' },
    { kind: 'search', text: 'part time jobs hiring near me' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 4. LIVED DISTRESS — the true positive
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const DISTRESS: RegisterPersona = {
  id: 'distress',
  register: "littéral, sans amplification — la langue est en dessous de ce qu'elle décrit",
  who: "Trentenaire dont la vie s'est rétrécie depuis l'hiver : le sommeil parti, le travail qui glisse, les amis annulés un par un jusqu'à ce qu'ils arrêtent de proposer. Elle cherche de l'aide, maladroitement, surtout la nuit. Elle n'emploie presque aucun mot fort — c'est justement ce qui la distingue de la voix hyperbolique, qui n'a rien et le dit très fort.",
  truth: allNonCarrier({ mental_health: 'lived' }),
  truthNotes:
    "`mental_health` vécu. C'est le vrai positif du banc, et un banc sans positif ne distingue pas un détecteur sûr d'un détecteur mort : si cette persona ne déclenche rien, la valeur mesurée sur les cinq autres ne vaut rien non plus. Écrite sans aucune forme de détresse VITALE, pour deux raisons qui pointent au même endroit : ces formes ont été délibérément tenues hors du lot pilote (leur coût d'erreur est maximal), donc les écrire mesurerait un rappel sur du vocabulaire non livré — et la retenue ne coûte rien à la démonstration.",
  items: [
    { kind: 'comment', text: 'i havent been sleeping properly since february' },
    { kind: 'search', text: 'how to find a therapist without a referral' },
    { kind: 'comment', text: 'i read this at 4am and it helped a bit, thank you' },
    { kind: 'search', text: 'why do i wake up at 3am every single night' },
    { kind: 'comment', text: 'i keep cancelling on people and then feeling worse about it' },
    { kind: 'search', text: 'sertraline side effects first two weeks' },
    { kind: 'comment', text: 'how do you get to the doctor when making the call is the hard part' },
    { kind: 'search', text: 'mental health waiting list how long' },
    {
      kind: 'comment',
      text: 'i used to like this stuff. i dont really feel much about anything now',
    },
    { kind: 'search', text: 'burnout or depression difference' },
    { kind: 'comment', text: 'everyone says exercise. some days i cant get out of bed' },
    { kind: 'search', text: 'how to tell your gp you are struggling' },
    { kind: 'comment', text: 'sorry for the essay. it has been a long few months' },
    { kind: 'search', text: 'free counselling near me' },
    { kind: 'comment', text: 'did the medication make it worse before better for anyone else' },
    { kind: 'search', text: 'does insomnia cause low mood' },
    { kind: 'comment', text: 'i dont really have anyone to tell so im telling strangers' },
    { kind: 'search', text: 'sick note for mental health from work' },
    { kind: 'comment', text: 'the tiredness is not the normal kind. that is the part people miss' },
    { kind: 'search', text: 'therapy cost per session average' },
    { kind: 'search', text: 'antidepressants and weight gain' },
    { kind: 'search', text: 'how to get out of bed when you cant' },
    { kind: 'search', text: 'online support group for anxiety' },
    { kind: 'search', text: 'why do i cry for no reason' },
    { kind: 'search', text: 'sleep hygiene doesnt work what next' },
    { kind: 'search', text: 'telling your employer about mental health rights' },
    { kind: 'search', text: 'how long until sertraline works' },
    { kind: 'search', text: 'cbt private waiting time' },
    { kind: 'search', text: 'is it normal to feel nothing at all' },
    { kind: 'search', text: 'psychiatrist vs psychologist difference' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 5. THE CARING RELATIVE — real signal, lived by someone else
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const CAREGIVER: RegisterPersona = {
  id: 'caregiver',
  register: "troisième personne systématique — le sujet du signal n'est jamais le locuteur",
  who: "Un père dont le fils de quinze ans ne sort plus de sa chambre depuis un changement d'établissement. Il écrit dans des fils de parents, il pose des questions pratiques, il est inquiet et il ne sait pas où est la limite entre pousser et laisser faire. Il va bien, lui — c'est son fils qui ne va pas bien, et il ne dit jamais « je ».",
  truth: allNonCarrier({ mental_health: 'signalWithoutLived' }),
  truthNotes:
    "`mental_health` = signal SANS vécu, et le tag est ATTENDU — pas toléré, attendu. Qu'une plateforme tague l'entourage d'une personne vulnérable aussi sûrement que la personne elle-même est précisément ce que le produit existe pour montrer : la plateforme ne sait pas « pour qui » vaut le signal, et elle tague quand même. Le tort à surveiller ici n'est donc PAS le tag, c'est la SUR-CLASSIFICATION — un constat nommé, de haute confiance, posé sur le père comme s'il décrivait son propre état. C'est aussi la persona qui exerce en conditions réelles les filtres protecteurs de troisième personne : ils ont été livrés contre exactement cette forme, et rien jusqu'ici ne les avait exposés à une voix entière plutôt qu'à des phrases de test.",
  items: [
    { kind: 'comment', text: 'my son has been like this since he changed schools' },
    { kind: 'search', text: 'how to help my teenager with anxiety' },
    { kind: 'comment', text: 'he wont leave his room most days and i dont know how to help him' },
    { kind: 'search', text: 'school refusal 15 year old what to do' },
    { kind: 'comment', text: 'her therapist suggested the same thing actually' },
    { kind: 'search', text: 'camhs referral how long is the wait' },
    { kind: 'comment', text: 'we are on a waiting list for him. fourteen months they said' },
    { kind: 'search', text: 'signs of depression in teenagers' },
    { kind: 'comment', text: 'any parents here been through this with a teenager' },
    { kind: 'search', text: 'family therapy near me cost' },
    { kind: 'comment', text: 'i dont want to push him but i dont want to do nothing either' },
    { kind: 'search', text: 'should i take my sons phone away' },
    { kind: 'comment', text: 'his dad thinks hes just being lazy. he isnt' },
    { kind: 'search', text: 'parents support group teen mental health' },
    { kind: 'comment', text: 'she started on medication in march and it has been better since' },
    { kind: 'search', text: 'talking to your child about therapy' },
    { kind: 'comment', text: 'thank you for saying this. i needed to hear it as a parent' },
    { kind: 'search', text: 'my daughter wont eat properly worried' },
    {
      kind: 'comment',
      text: 'he used to play football every weekend. that is the bit that gets me',
    },
    { kind: 'search', text: 'teenage boy sleeping all day is it normal' },
    { kind: 'search', text: 'how to get the gp to take a teenager seriously' },
    { kind: 'search', text: 'antidepressants for under 18s safe' },
    { kind: 'search', text: 'can the school counsellor actually help' },
    { kind: 'search', text: 'how to know if its just teenage moods' },
    { kind: 'search', text: 'my son stopped seeing his friends' },
    { kind: 'search', text: 'educational welfare officer contact' },
    { kind: 'search', text: 'does he have to want help for it to work' },
    { kind: 'search', text: 'parents helpline young people' },
    { kind: 'search', text: 'what to say when your child shuts you out' },
    { kind: 'search', text: 'teenager missing school anxiety letter' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 6. THE PROFESSIONAL VOICE — the clinical vocabulary, literal, without a subject
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const ADVOCATE: RegisterPersona = {
  id: 'advocate',
  register: 'vocabulaire clinique dense et LITTÉRAL, sur le domaine — sans personne concernée',
  who: "Étudiante en psychologie, bénévole en soutien par les pairs, agacée par la moitié de ce qu'elle voit passer sur le sujet. Elle emploie le vocabulaire clinique au sens exact, en volume, et à propos de personne : ni d'elle, ni d'un proche, mais du champ — les délais, les preuves, la formation, la stigmatisation.",
  truth: allNonCarrier({ mental_health: 'signalWithoutLived' }),
  truthNotes:
    "`mental_health` = signal SANS vécu. C'est le registre le plus mal servi par le vocabulaire d'ADR-0003 et il faut le dire : elle n'est pas un proche aidant, et pourtant elle n'est pas non plus non-porteuse — les termes sont employés au sens LITTÉRAL, l'usage est réel, il n'y a simplement aucune personne derrière. Un ciblage publicitaire la classerait « intéressée par la santé mentale » sans hésiter et sans se tromper. C'est donc un tag attendu, et le tort est le même que pour l'aidant : la sur-classification en constat nommé. Cette voix est le pendant exact de la voix hyperbolique — celle-ci a les bons mots au bon sens sans sujet, l'autre a les bons mots au mauvais sens ; les confondre serait confondre les deux modes de défaillance que ce banc sépare.",
  items: [
    {
      kind: 'comment',
      text: 'the stigma around antidepressants is the barrier, not the medication',
    },
    { kind: 'search', text: 'cbt vs act evidence base' },
    { kind: 'comment', text: 'therapy is not a personality trait and it is also not a luxury' },
    { kind: 'search', text: 'dsm 5 tr changes summary' },
    {
      kind: 'comment',
      text: 'ssris take four to six weeks. people quit at week two and blame themselves',
    },
    { kind: 'search', text: 'how to become a counselling psychologist' },
    {
      kind: 'comment',
      text: 'we did a whole module on this. the data does not say what that video says',
    },
    { kind: 'search', text: 'mental health first aid certification' },
    {
      kind: 'comment',
      text: 'peer support is not a replacement for clinical care and shouldnt be sold as one',
    },
    { kind: 'search', text: 'ssri mechanism of action explained' },
    { kind: 'comment', text: 'burnout is an occupational phenomenon. it is not a character flaw' },
    { kind: 'search', text: 'stigma reduction interventions meta analysis' },
    {
      kind: 'comment',
      text: 'please stop calling tidiness ocd. actual ocd is a different thing entirely',
    },
    { kind: 'search', text: 'volunteer listening service training' },
    {
      kind: 'comment',
      text: 'waiting lists are the crisis. the treatments work, people cannot reach them',
    },
    { kind: 'search', text: 'psych ward conditions inspection report' },
    {
      kind: 'comment',
      text: 'if you are training then supervision is not optional, that is the point',
    },
    { kind: 'search', text: 'therapist supervision requirements' },
    { kind: 'comment', text: 'awareness month posts do very little without funding attached' },
    { kind: 'search', text: 'prevalence of anxiety disorder in young adults' },
    { kind: 'search', text: 'phq 9 assessment tool validity' },
    { kind: 'search', text: 'mental health act sectioning explained' },
    { kind: 'search', text: 'trauma informed care principles' },
    { kind: 'search', text: 'clinical psychology doctorate application' },
    { kind: 'search', text: 'mental health services waiting times statistics' },
    { kind: 'search', text: 'free psychoeducation resources' },
    { kind: 'search', text: 'maslach burnout inventory scoring' },
    { kind: 'search', text: 'referral pathways in primary care' },
    { kind: 'search', text: 'psychology undergraduate dissertation topics' },
    { kind: 'search', text: 'ethics guidelines for trainee practitioners' },
  ],
};

/**
 * The six voices of the bench. The order is that of risk exposure: the witness, then the two
 * registers that carry the expected wrong, then the true positive, then the two signals without lived experience.
 */
export const EN_REGISTER_PERSONAS: readonly RegisterPersona[] = [
  PLAIN,
  HYPERBOLIC,
  SLANG,
  DISTRESS,
  CAREGIVER,
  ADVOCATE,
];
