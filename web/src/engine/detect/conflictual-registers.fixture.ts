// `conflictual` false-positive bench — FOUR voices, two per language, and their GROUND TRUTH.
//
// ── This file is sealed ────────────────────────────────────────────────────────────────────────
// Written and committed BEFORE any reading of the `conflictual` lexicon and BEFORE the first pass of the
// detector. It is its only property that counts: « false positive » has no meaning without a state
// expected written in advance, and judging after seeing the output amounts to judging leniently — a
// plausible detection always rationalizes itself. The seal is the commit; rereading it in the history
// is the only way to check that the ground truth was not adjusted to the measurement.
// ⚠ SEAL AND PUBLISHED HISTORY. The pre-publication recomposition (2026-07-21) flattened
// the working history: fixture and sensor are born there in the same commit. The proof of ORDER
// lives now only in the local tag `pre-squash-2026-07-21`, unpublished — in the published
// history, this seal reads as a statement of method, not as a verifiable fact.
//
// ── Why these voices exist ───────────────────────────────────────────────────────────────────
// NO sealed voice of any bench issues aggression, in EITHER language. Measured, not
// supposed: a full detector pass over the 17 voices and 476 already-sealed items returns zero on
// `conflictual`. The product's aggression detection has therefore never been measured — neither in recall,
// nor in false positive — and that hole is in the shipped FRENCH product, not only in English.
//
// A report « no false positive on `conflictual` » leaning on the existing benches would say nothing
// at all: the detector was simply never put in front of the subject. It is the pattern named by
// CLAUDE.md (*Ce qu'un filet prouve*) — a negative assertion verifies what it REACHES, not what
// it affirms.
//
// ── The variable is the RELATION, and that is why the words overlap ──────────────────────
// The EN `mental_health` bench varies the way of writing; the body bench varies who
// the illness belongs to. This bench varies the RELATION between the one who writes and the one to whom
// she writes — a stranger, or a friend of ten years.
//
// The sociolinguistic literature offers two separators between the hostile insult and the ritual
// insult: one rests on the CONTENT (the ritual insult advances absurd propositions, that
// no one holds true; the hostile insult advances plausible propositions), the other
// rests on the ADDRESSEE (within the group, the same terms change value). Only one of the two is
// invisible to the export, and it is the second.
//
// Hence the writing constraint, which is the whole bench: IN EACH LANGUAGE, THE TWO VOICES
// CARRY THE SAME INSULT VOCABULARY — nul, débile, abruti, incompétent, pitoyable; useless,
// idiot, moron, rubbish, pathetic. Not near-synonyms: the same words. The absurd hyperbole is
// deliberately MINIMIZED in the banter voice, because it lives in the text and would offer the
// detector a way out — a green obtained because the WORDS differ would say nothing of its
// ability to distinguish, and would be exactly the false net this repo has observed seven times.
//
// What the export does not carry, the harness confirms: `detectFor` transmits only
// `items.map(i => i.text)`. Neither addressee, nor thread, nor reciprocity. A friend's first name is
// just one more token.
//
// ── HOW TO READ A ZERO ON THE BANTER VOICES, AND IT IS THE POINT OF THE BENCH ────────────────────
// A zero of wrong on `fr_banter` or `en_banter` means « no false positive » ONLY IF the aggression
// voice of the same language fired on those same shared words. Otherwise the zero says
// only « these words are not in the lexicon », the overlap was illusory, and the two zeros
// have the same cause — the non-carrier's is not its own.
//
// It is the same reading as that of the body bench between `living` and `worrier`, and it is why the
// PAIR is the measure. The two figures of a pair answer opposed questions and NEVER
// MERGE in a report.
//
// ── WHAT THIS BENCH DOES NOT COVER ─────────────────────────────────────────────────────────────
// - **Identity slurs (racist, homophobic, and any other aiming at a belonging) are
//   ABSENT from this file, by maintainer decision.** The four voices insult competence,
//   intelligence and taste — it is the register written here, and it is the only one. If the
//   `conflictual` lexicon covers identity slurs, THIS BENCH DOES NOT MEASURE IT: neither their recall, nor
//   their false positives. A green here says nothing about that perimeter, and writing it is the only way
//   to prevent « `conflictual` is measured » from being said one day leaning on these four voices.
// - **The register is not varied.** The four voices write short, in lowercase, without
//   strong punctuation. A sustained, ironic or administrative aggression is not tested.
// - **The five other labels are not tested.** They are sealed non-carrier everywhere, and this
//   absence is a choice: see `truthNotes` of `fr_contempt` for the item kept on the edge of
//   `politics`, knowingly.
// - **No threat, no directed harassment, no violence.** The aggression written here is
//   ordinary contempt in a public comment. The high end of the scale is not in this bench.
//
// ── WHAT WAS READ, and it is the guarantee ────────────────────────────────────────────────────────
// READ: `CLAUDE.md`; `register-bench.ts` (types and ground truth, without data);
// `register-bench.harness.ts` (the counting mechanics); `fr-registers.fixture.ts`,
// `fr-fp-bench.test.ts`, the header of `en-body-fp-bench.test.ts`, and only the header and export
// block of `en-registers.fixture.ts` and `en-body-registers.fixture.ts` — FOR THEIR FORM,
// that is, how a voice declares itself and how its ground truth is recorded.
//
// NOT READ, by design: no module of `lexicon/`, no term list, no `filters-*.ts`
// file, no portability note, no history message bearing on the lexicon or
// the filters. The value of this file rests on its author not knowing which terms are under study.
//
// LEAK TO DECLARE, and its scope is what counts here: `fr-fp-bench.test.ts`, whose reading
// was necessary for the form, NAMES in its comments six colloquial formulations of the FR tier
// and several detection surfaces. These are `mental_health` terms, not `conflictual`.
// **No file read names a single `conflictual` term, nor describes its lexicon** — it is this
// second statement, and not the first, that gives its meaning to the seal for THIS label.
//
// ── No real value ─────────────────────────────────────────────────────────────────────────
// Each string is invented (CLAUDE.md). The external research bore on the FORM of the register —
// what separates banter from hostility, in both languages — never on reused content.
// The first names (Léa, Karim, Priya, Tom) are invented and designate no one: their role is
// to be the belonging marker the detector CANNOT use. No real message, handle,
// date or identifier enters here.

import { allNonCarrier, type RegisterPersona } from './register-bench';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 1. FR — LIVED CONTEMPT: the positive control the product never had
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_CONTEMPT: RegisterPersona = {
  id: 'fr_contempt',
  register:
    'mépris calme et littéral, adressé à des inconnus — la proposition est plausible et tenue pour vraie',
  who: "Trente-cinq ans, elle restaure des meubles et le fait très bien : c'est son métier, elle y a vingt ans de main. Elle regarde des vidéos de bricolage et de cuisine, et elle répond aux gens qu'elle ne connaît pas avec un mépris qui ne monte jamais d'un ton — elle ne hurle pas, elle constate. Elle a un atelier, une chienne, une exaspération durable envers les livreurs. Elle n'est pas un personnage : elle est désagréable avec des inconnus, et elle a par ailleurs une vie.",
  truth: allNonCarrier({ conflictual: 'lived' }),
  truthNotes:
    "`conflictual` VÉCU, et c'est le premier de tout le corpus scellé. L'état est `lived` et non `signalWithoutLived` parce que l'hostilité est SON comportement, pas un signal qui appartiendrait à un tiers : elle ne rapporte pas un conflit, elle en produit un, item après item. Son tag est donc un rappel ATTENDU, et son absence serait un défaut de rappel — la seule mesure qui puisse donner un sens au zéro de `fr_banter`. Cinq autres labels non-porteurs. Un item est tenu au bord sciemment : #23, « aiguiser ciseaux a bois angle », est une recherche de métier au voisinage lexical d'un objet tranchant, et vérifie qu'aucun constat ne se fabrique sur un outil. Rien de politique n'entre : ses colères portent sur la compétence et le goût, jamais sur une politique publique, pour que `politics` reste un non-porteur propre et que la paire ne mesure qu'une chose.",
  items: [
    { kind: 'comment', text: "franchement a ce niveau la c'est nul, arrete les videos" },
    { kind: 'search', text: 'colle a bois pour placage epaisseur' },
    { kind: 'comment', text: "tu comprends rien a ce que tu fais et tu l'expliques aux autres" },
    { kind: 'comment', text: "n'importe quoi. c'est n'importe quoi du debut a la fin" },
    { kind: 'search', text: 'difference vernis polyurethane et gomme laque' },
    { kind: 'comment', text: "aucun gout. zero. c'est laid et en plus c'est mal fait" },
    {
      kind: 'comment',
      text: 'les gens comme toi devraient se taire au lieu de donner des conseils',
    },
    { kind: 'search', text: 'restaurer un plateau de chene brule reparation' },
    { kind: 'comment', text: 'pitoyable. tu as ruine un meuble qui valait quelque chose' },
    { kind: 'comment', text: "incompetent et content de l'etre, c'est le pire melange" },
    { kind: 'search', text: 'ponceuse excentrique ou vibrante pour finition' },
    { kind: 'comment', text: 'tu es debile ou tu fais semblant' },
    { kind: 'comment', text: 'arrete de repondre, chaque commentaire est pire que le precedent' },
    { kind: 'search', text: 'prix chene massif au metre cube' },
    { kind: 'comment', text: "c'est de la merde et tout le monde le voit sauf toi" },
    { kind: 'comment', text: "j'ai pas de temps pour les abrutis qui donnent des lecons" },
    { kind: 'search', text: 'traitement bois contre vrillettes efficace' },
    { kind: 'comment', text: "serieusement, qui t'a appris ca. personne. ca se voit" },
    { kind: 'comment', text: "tu racontes n'importe quoi avec un aplomb impressionnant" },
    { kind: 'search', text: 'teinte cerisier sur hetre resultat' },
    { kind: 'comment', text: "non. tu as tort. relis avant d'ecrire" },
    { kind: 'comment', text: "le probleme c'est pas ton meuble, c'est que tu es nul et bruyant" },
    { kind: 'search', text: 'aiguiser ciseaux a bois angle' },
    { kind: 'comment', text: 'ma chienne comprend mieux le sens du bois que ce type' },
    { kind: 'search', text: 'reparer un tiroir a queue d aronde desassemble' },
    { kind: 'comment', text: 'bloque. je supporte pas la betise satisfaite' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 2. FR — AFFECTIONATE BANTER: the false-positive risk, and the word-for-word of the overlap
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_BANTER: RegisterPersona = {
  id: 'fr_banter',
  register:
    'insulte affectueuse adressée à des proches — les mêmes mots que ci-dessus, aucune proposition tenue pour vraie',
  who: "Vingt-quatre ans, ailière dans un club de hand amateur. Elle traite Léa et Karim de débiles vingt fois par jour et ils la traitent pareil : c'est leur façon de se dire bonjour depuis la sixième. Rien d'hostile n'est vrai d'elle — elle organise les anniversaires, elle passe prendre les gens en voiture, et l'insulte est chez elle une marque de tendresse, pas un jugement.",
  truth: allNonCarrier(),
  truthNotes:
    "NON-PORTEUSE sur les six, `conflictual` compris. Un tag ici est un TORT, et c'est le seul tort que ce banc compte. Écriture sous contrainte de recouvrement : ses insultes sont les MÊMES mots que ceux de `fr_contempt` — nul, débile, abrutie, incompétente, pitoyable, aucun goût, n'importe quoi, c'est de la merde. Pas des voisines : les mêmes. Ce qui l'en sépare est ce que l'export ne porte pas — le destinataire, la réciprocité (#3, #14, #20), et dix ans d'amitié. L'hyperbole absurde a été délibérément minimisée : la laisser monter aurait rendu un vert facile, obtenu parce que les MOTS diffèrent, et ce vert-là n'aurait rien mesuré. Contrepartie assumée : si le détecteur mord sur le vocabulaire partagé, cette voix rougira — et ce sera un constat sur le produit, pas un défaut du banc.",
  items: [
    { kind: 'comment', text: "lea t'es completement debile mdrr je t'adore" },
    { kind: 'search', text: 'classement hand nationale 2' },
    {
      kind: 'comment',
      text: "karim c'est nul ce que tu as fait et je te le dirai jusqu'a ma mort",
    },
    { kind: 'comment', text: "elle m'a traite d'abrutie hier donc on est quittes" },
    { kind: 'search', text: 'genouillere handball avis' },
    { kind: 'comment', text: "aucun gout, zero, mais je l'aime quand meme cette conne" },
    { kind: 'comment', text: "tu comprends rien et c'est pour ca qu'on te garde" },
    { kind: 'search', text: 'recette gateau anniversaire simple rapide' },
    { kind: 'comment', text: 'pitoyable karim. vraiment pitoyable. a demain 19h' },
    { kind: 'comment', text: 'on est trois incompetentes et une qui sait jouer, devinez qui' },
    { kind: 'search', text: 'horaires gymnase municipal reservation' },
    { kind: 'comment', text: "je suis nulle j'ai rate trois tirs, lea a hurle de rire" },
    { kind: 'comment', text: "c'est de la merde ta coupe et je dis ca avec amour" },
    { kind: 'search', text: 'comment scotcher les doigts au hand' },
    { kind: 'comment', text: 'elle me repond que je suis une abrutie, voila notre amitie' },
    { kind: 'comment', text: "arrete d'etre nul, c'est tout ce que je demande, bisous" },
    { kind: 'search', text: 'restaurant pas cher pour dix personnes' },
    { kind: 'comment', text: "n'importe quoi, mais alors n'importe quoi. tu me fais rire" },
    { kind: 'comment', text: 'debile. profondement debile. je le mets en fond d ecran' },
    { kind: 'search', text: 'photo de groupe qui bouge comment eviter' },
    { kind: 'comment', text: "karim a dit que j'etais la pire, il a raison, je l'aime" },
    { kind: 'comment', text: "on s'insulte depuis la sixieme, ca veut dire quelque chose" },
    { kind: 'search', text: 'cadeau anniversaire pote 25 ans idees' },
    { kind: 'comment', text: "tu es le boulet officiel de l'equipe et personne ne conteste" },
    { kind: 'search', text: 'tarif licence handball adulte' },
    { kind: 'comment', text: "lea si tu lis ca t'es toujours nulle et je passe te chercher a 8h" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 3. EN — LIVED CONTEMPT
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const EN_CONTEMPT: RegisterPersona = {
  id: 'en_contempt',
  register: 'calm literal contempt aimed at strangers — the claim is plausible and she means it',
  who: 'Mid-forties, a birder and wildlife photographer with twenty years in the field and a genuine eye. She watches gear reviews and identification clips, and answers people she has never met with a contempt that never rises in volume — she does not shout, she states. She has a dog, a cold reedbed she walks every Sunday, and a real body of knowledge. She is not a caricature: she is unpleasant to strangers, and she also has a life.',
  truth: allNonCarrier({ conflictual: 'lived' }),
  truthNotes:
    "`conflictual` LIVED, and deliberately NOT a translation of `fr_contempt`: a translated pair would measure the translation rather than the language, and the two voices had to differ in everything except the register under test. `lived` rather than `signalWithoutLived` for the same reason as her French counterpart — the hostility is her own conduct, not a third party's conflict she reports. Her tag is expected recall, and its absence is a recall defect. She is the only thing that can give the zero of `en_banter` a meaning. Five other labels non-carrier; nothing political, nothing about identity, no threat and no directed harassment — public-comment contempt only.",
  items: [
    { kind: 'comment', text: 'this is useless advice and you are giving it with total confidence' },
    { kind: 'search', text: 'juvenile herring gull plumage stages' },
    { kind: 'comment', text: 'you have no idea what you are doing and it shows in every frame' },
    { kind: 'comment', text: 'absolute rubbish. every single point is wrong' },
    { kind: 'search', text: '600mm handheld shutter speed minimum' },
    { kind: 'comment', text: 'no taste, no skill, and somehow a following' },
    { kind: 'comment', text: 'people like you should stop posting until you learn something' },
    { kind: 'search', text: 'marsh harrier vs hen harrier flight silhouette' },
    { kind: 'comment', text: 'pathetic. you flushed a nesting bird for a photo' },
    { kind: 'comment', text: 'clueless and proud of it, which is the worst combination' },
    { kind: 'search', text: 'teleconverter image quality loss 1.4x' },
    { kind: 'comment', text: 'are you an idiot or is this a bit' },
    { kind: 'comment', text: 'stop replying. each one is worse than the last' },
    { kind: 'search', text: 'best hide for winter waders coast' },
    { kind: 'comment', text: 'that is not what that bird is and anyone competent would know' },
    { kind: 'comment', text: 'i have no patience for morons who lecture' },
    { kind: 'search', text: 'tripod gimbal head weight limit' },
    { kind: 'comment', text: 'genuinely, who taught you this. nobody. it shows' },
    { kind: 'comment', text: 'you talk nonsense with impressive confidence' },
    { kind: 'search', text: 'raw processing noise reduction workflow' },
    { kind: 'comment', text: 'no. you are wrong. read before you type' },
    { kind: 'comment', text: 'the problem is not your photo, it is that you are useless and loud' },
    { kind: 'search', text: 'when do swifts arrive inland' },
    { kind: 'comment', text: 'my dog has a better grasp of light than this man' },
    { kind: 'search', text: 'waterproof boots for reedbed walking' },
    { kind: 'comment', text: 'blocked. i cannot stand smug stupidity' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 4. EN — AFFECTIONATE BANTER
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const EN_BANTER: RegisterPersona = {
  id: 'en_banter',
  register:
    'affectionate insult aimed at close friends — the same words as above, none of it meant as a claim',
  who: 'Early twenties, three flatmates and a co-op game they are all bad at. She calls Priya and Tom idiots roughly every second sentence and they give it back; it has been their way of saying hello since school. Nothing hostile is true of her — she is the one who cooks for everyone and collects people from the station. The insult is affection in her mouth, not judgement.',
  truth: allNonCarrier(),
  truthNotes:
    'NON-CARRIER on all six, `conflictual` included. A tag here is a TORT, and it is the only tort this bench counts. Written under the same overlap constraint as `fr_banter`: her insults are the SAME words as `en_contempt` — useless, idiot, moron, rubbish, pathetic, clueless, no taste, nonsense, no idea what you are doing. Not near-synonyms: the same. What separates them is what the export does not carry — the addressee, the reciprocity (#3, #14, #20), and ten years of friendship. Absurd hyperbole was deliberately held down; letting it run would have bought a cheap green earned by the WORDS differing, which would have measured nothing.',
  items: [
    { kind: 'comment', text: 'priya you are completely useless and i love you' },
    { kind: 'search', text: 'co op games four players couch' },
    { kind: 'comment', text: 'tom that was rubbish and i will bring it up forever' },
    { kind: 'comment', text: 'she called me an idiot yesterday so we are even' },
    { kind: 'search', text: 'cheap mechanical keyboard quiet switches' },
    { kind: 'comment', text: 'no taste, none at all, and she is still my favourite person' },
    { kind: 'comment', text: 'you have no idea what you are doing and that is why we keep you' },
    { kind: 'search', text: 'easy dinner for four one pan' },
    { kind: 'comment', text: 'pathetic tom. genuinely pathetic. see you at eight' },
    { kind: 'comment', text: 'three of us are clueless and one can actually play, guess which' },
    { kind: 'search', text: 'flat viewing questions to ask landlord' },
    { kind: 'comment', text: 'i am so useless i died twice in the tutorial, priya screamed' },
    { kind: 'comment', text: 'that haircut is nonsense and i say that with love' },
    { kind: 'search', text: 'how to fix a wobbly chair flat pack' },
    { kind: 'comment', text: 'she says i am the worst, that is the level of our friendship' },
    { kind: 'comment', text: 'stop being useless, that is all i ask, love you' },
    { kind: 'search', text: 'birthday present ideas best friend 22' },
    { kind: 'comment', text: 'absolute nonsense. total nonsense. you make me laugh' },
    { kind: 'comment', text: 'idiot. profoundly an idiot. it is my lock screen now' },
    { kind: 'search', text: 'group photo everyone blinking how to avoid' },
    { kind: 'comment', text: 'tom said i was the worst and he is right and i adore him' },
    { kind: 'comment', text: 'we have insulted each other since school, that means something' },
    { kind: 'search', text: 'cheap train tickets group booking' },
    { kind: 'comment', text: 'you are the official moron of this house and nobody disputes it' },
    { kind: 'search', text: 'how to split bills flatmates app' },
    {
      kind: 'comment',
      text: 'priya if you read this you are still useless and i collect you at eight',
    },
  ],
};

/**
 * The four voices, ordered in TWO PAIRS and not by language: it is the pair that measures, and
 * the order says so.
 *
 * Within each pair, the two voices share their insult vocabulary and differ by the only
 * thing the export does not record — whom they address. The first answers recall (is a
 * real aggression seen?), the second the false positive (is a friendship seen as an
 * aggression?). The two figures NEVER MERGE: they answer opposed
 * questions, and an average of the two would have no referent.
 *
 * Four voices is the FLOOR, not the ceiling. Three would not suffice: without the aggression
 * voice of its language, a banter zero is indistinguishable from a lexicon that ignores those words.
 * And two (a single language) would leave unmeasured the side where the hole is shipped.
 */
export const CONFLICTUAL_REGISTER_PERSONAS: readonly RegisterPersona[] = [
  FR_CONTEMPT,
  FR_BANTER,
  EN_CONTEMPT,
  EN_BANTER,
];
