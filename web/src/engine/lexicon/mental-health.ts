// `mental_health` lexicon (PANO-71 seed → PANO-36 enriched). Enrichment by structured lexical
// fields (variants, registers, periphrases), including the « mal-être ado / registre
// parent » field named by PANO-36.
//
// ── Genericity justification (PANO-70 §3, §2.5 discipline) ────────────────────────────────────
// All registers of everyday FR mental health, written BLIND from common usage,
// NEVER from a real export:
//   · formal / clinical: usual diagnostic vocabulary (dépression, trouble anxieux, tdah);
//   · everyday: care and follow-up (psy, thérapeute, antidépresseurs), widespread medication names
//     (generic: they are public-domain products, not people);
//   · colloquial / internet slang: distress expressed without a clinical term (« au fond du trou »,
//     « je craque », « en mode survie », « psychoter »).
// Each term is defensible for a stranger, justifiable by the generic usage of French, and
// would have been written identically without ever having seen any export.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// ── EN variants (PANO-35, pilot batch) — admission rule specific to EN ────────────────────────
// Form precedent: the D2 interest lexicons (PANO-88) merge their EN variants INLINE
// in the same arrays, annotated `// (EN)`. Same choice here — no separate module.
//
// ADMISSION follows the rule carried by ADR-0003 (« exclude hyperbole at the gate »): a term
// enters only if its DOMINANT use on social media is literal. Hyperbole is not demoted
// to colloquial, it is EXCLUDED — because the repetition threshold does not filter it: three « i'm
// dying » are three bursts of laughter, where two « déprime » reduce the chance of a scholarship.
// The exclusions that CARRY the doctrine are frozen in the adversarial battery
// (`detect/lexicon-battery.test.ts`, EN section); the local near-misses are annotated on
// the entry that discarded them. Three families have neither a neighboring entry nor a test, and so stand
// here — an exclusion is lost if nothing holds it (ex-batch note, condensed in
// `docs/methode-portabilite-en.md`):
//   · `stressed`, `tired`, `exhausted`, `drained` — universal daily states: tagging here
//     means tagging everyone;
//   · `i can't even`, `i'm done`, `dying inside` — conventional hyperbole of ordinary dismay,
//     same family as « i'm dying » (frozen at the test);
//   · `crazy`, `insane`, `psycho`, `mental` — generic intensifiers (« that's insane ») and,
//     in personal use, ableist slang targeting another (`conflictual` boundary).
//
// THREE FORMS HELD OUT OF THIS BATCH (named debt, reopenable — see the doc and catalogue §4):
// `suicidal`, `end my life`, `take my own life`. Discarded not because they would be bad,
// but because they carry the MAXIMAL error cost and the EN false-positive rate is not
// measured. `mental_health` demonstrates itself without them (care, burnout, antidepressants).
//
// Entries in NORMALIZED form (lowercase, no accents; the hyphen is worth a space, machinery).
// MECHANICAL VARIANTS are NOT listed: lengthenings (« déprimeee »), self-censoring and
// plurals are covered by the machinery (detect.ts, PANO-36 phase 0). Here, real vocabulary only.
// Calibration ratified PANO-33: indirect threshold 2, colloquial included (we do not mask the polysemous).

import type { TopicalLexicon } from './types';

export const MENTAL_HEALTH_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'mental_health',
  // Readings from registry §5: personal lived experience · concern for a relative · curiosity.
  readingTemplateIds: [
    'sensitive.mental-health.reading.lived',
    'sensitive.mental-health.reading.relative',
    'sensitive.mental-health.reading.curiosity',
  ],
  // Named clinical / distress term, applied to oneself → named tag (B2).
  explicit: [
    // FR/EN homographs: these entries ALREADY matched English, without any decision
    // having wanted it (measured — the EN persona writes « burnout recovery stories » and the finding drops).
    // The annotation changes NOTHING in the behavior: it makes intentional what was accidental,
    // and prevents a future batch from believing it covers EN for the first time.
    'anxiete',
    'burn out',
    'burnout', // (EN) identical
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
    // Vital distress: literal PHRASES only (« me tuer » omitted, yuya decision — too many FP
    // on the hyperbole « ça me tue » / « ce projet va me tuer »).
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
    // ── EN variants (PANO-35): NAMED conditions, without conventional figurative use ────────────
    'anxiety disorder',
    'generalized anxiety',
    'social anxiety',
    'panic attack', // bare « panic » discarded: « don't panic », « panic buying »
    'agoraphobia',
    'bipolar disorder', // the FULL PHRASE — bare « bipolar » is a hyperbole (weather, mood)
    'schizophrenia', // « schizo » discarded: pejorative slang targeting another (overlaps `conflictual`)
    'adhd', // « add » discarded: total collision with the verb « to add »
    'post traumatic stress', // « trauma »/« traumatized » discarded: colloquialized (« traumatized
    // by that movie ») — documented phenomenon, same reason as « toc » below
    'anorexia',
    // `anorexic` WAS REMOVED FROM HERE. The adjective has a conventional object idiom in English — « an
    // anorexic budget », « an anorexic profit margin » — and nothing in the machinery verifies WHAT
    // the adjective refers to: both set a NAMED finding (measured). It now lives in the
    // sole tier `selfDeclaredEn` below, which lands as BROAD. The NOUN `anorexia` stays here, and
    // it is it that carries the recall of the bearer. `bulimic` STAYS in both tiers: its object idiom
    // is not attested — it had to be invented to test it, which is the answer.
    'bulimia',
    'bulimic',
    'eating disorder',
    'postpartum depression',
    'self harm', // « cutting » discarded: massive polysemy (hairdressing, editing, sport)
    'selfharm',
    'self harming',
    // NOTE — EN vital distress stops here, deliberately. « i want to die » is the direct
    // calque of « je veux mourir » (present above) and it is NEVERTHELESS excluded: in English it is
    // a conventional reaction to embarrassment, same family as « i'm dead » (= laughter). Same
    // discarding for « kill me », « kms », « i'm dying ». It is the textbook case of a judgment that does NOT
    // survive translation, and the reason for the admission rule at the head of the file.
  ],
  // SELF-DECLARED state labels (« je suis dépressif », « jsuis un pauvre anxieux ») — via the
  // self-declaration pattern (PANO-72). Adjectives too polysemous bare (« temps dépressif »,
  // « film dépressif »): the copula makes them reliable and captures the self-deprecating register.
  selfDeclaredFr: [
    'depressif',
    'depressive',
    'anxieux',
    'anxieuse',
    'hypersensible',
    'insomniaque',
    'en depression',
    'en burn out',
    // NO EN variant here, by design (PANO-35): this tier is matched ONLY via
    // `SELF_DECLARATION_HEADS`, which stays FR-only as long as PANO-35 batch 2 has not measured the
    // EN copula. Writing « depressed » or « anxious » here would produce data that nothing reads.
    // The discarding falls on the right side: these state labels are the most hyperbolized in English.
  ],
  // ── THE ENGLISH STATE LABELS — the most figurative ground of the four ─────────────────────────
  // EN counterpart of `selfDeclaredFr` above, whose note said « writing "depressed" or
  // "anxious" here would produce data that nothing reads »: the English heads now exist, and
  // this tier lands as BROAD — it NEVER NAMES (`TopicalLexicon.selfDeclaredEn`).
  //
  // THE NOTE ABOVE ADDED « the discarding falls on the right side: these labels are the most
  // hyperbolized in English ». THAT IS TRUE, AND THE FRAME CHANGES NOTHING — measured, against
  // the intuition that closed PANO-35 batch 2 twice: « im so ocd about my desk drawers », « im
  // autistic about train timetables », « im depressed that the bakery closed early », « im dyslexic
  // when it comes to left and right » all CARRY the copula. What makes the admission tenable is
  // therefore not the frame, it is the TIER: none of these sentences can produce a named finding.
  //
  // DO NOT ENTER:
  //   · `suicidal` — EXISTING NAMED DEBT (this module's header), and it stays closed.
  //     Tiering by error cost is not lifted because a neighboring tier opens.
  //   · `traumatized` / `traumatised` — colloquialized, exclusion already written in `explicit`.
  //   · `manic`, `paranoid`, `obsessive`, `schizophrenic` — ADR-0003's SECOND GATE: disease
  //     names turned generic pejorative qualifiers, applied to a third party or an object
  //     (« my laptop is being schizophrenic today »). They err on the SUBJECT, not on
  //     the intensity, and they overlap `conflictual` where the same sentence would be better read.
  //   · `mentally ill`, `medicated`, `highly sensitive`, `overstimulated` — too little designating.
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
  // ── BARE DISORDER NOUNS — broad tag on their own, never named ─────────────────────────────────
  // Measured (upper-bound EN bench) then delivered in two steps, and both steps count.
  //
  // These three carried a NAMED finding, i.e. the assertion that a person HAS this
  // condition. False on « this heat is giving me actual depression », « i have ptsd from the ninth
  // one », « my anxiety when the file was still rendering »: everyday English uses them as
  // intensifiers, just like « bipolar » for the weather. They could not stay.
  //
  // Nor could they descend to colloquial — first attempt, MEASURED AND REFUSED
  // (`en-demotion-ablation.test.ts`): below the threshold of 2, a person who writes ONCE that they
  // have depression did not fall to broad, they DISAPPEARED. The solo tier exists for that
  // gap, between the two.
  //
  // What it costs, accepted knowingly: NO bare disorder noun any longer produces a
  // named finding, in either language. The named now comes only from the diagnostic
  // phrases (`anxiety disorder`, `depression nerveuse`, `post traumatic stress`…) and from
  // terms without figurative use. `depression` and `ptsd` are SINGLE entries serving both
  // languages: French changes with English, and that is intended — a word is not treated
  // differently according to the language in which it is written.
  indirectSolo: [
    'anxiety',
    'depression', // (EN/FR) entry common to both languages
    'ptsd', // (EN/FR) acronym common to both languages
  ],
  // Care/follow-up + distress without a named condition → strong signal but BROAD tag (never named, B3).
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
    // Named medications (yuya decision): generic (domain products, not people),
    // real register of care. « xanax » is MOVED DOWN to colloquial (PANO-35): its
    // recreational register is far more established in EN than in FR.
    'lexomil',
    'prozac', // (EN) identical — brand common to both languages
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
    // « mal-être ado / registre parent » field (PANO-36) — the 3rd-person filter degrades it
    // naturally (signal-without-lived-experience path, B3).
    'se renferme',
    'phobie scolaire',
    'ne veut plus sortir',
    // ── EN variants (PANO-35): care and follow-up ──────────────────────────────────────────────
    // This tier carries fewer exclusions than the others, and it is structural: hyperbole attacks
    // STATES, not INSTITUTIONS. « therapist » or « psych ward » have no figurative use.
    'therapy', // assumed reservation: « retail therapy », « music is my therapy » — threshold 2 filters
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
    // Common EN medications — same justification as in FR (domain products, not
    // people). « xans » and « bars » are discarded: purely recreational slang, and « bars » is
    // massively polysemous.
    'zoloft',
    'lexapro',
    'sertraline',
    // Parent register, counterpart of the FR « mal-être ado » field above. The EN 3rd person
    // (`THIRD_PERSON_EN`: « my teen », « for my », « help my ») already degrades these items toward the
    // signal-without-lived-experience path (B3) — delivered in batch 1, nothing to add here.
    'school refusal',
    "won't leave his room",
    'wont leave his room', // dual spelling: internet usage omits the apostrophe (cf. filters-en)
  ],
  // Colloquial / slang — assumed polysemous (the recall/FP focus).
  indirectColloquial: [
    // « toc » (OCD): in colloquial and not explicit (empirically verified PANO-36 — « toc toc »,
    // « du toc » wrongly tagged a NAMED condition). Threshold 2 requires repetition; the real
    // repeated OCD signal stays captured as broad. yuya decision.
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
    // ── EN variants (PANO-35): LITERAL low register and polysemous — never hyperbolic ──────────
    // This tier stays the focus of POLYSEMY (one sense among others, which repetition arbitrates),
    // not of hyperbole (a conventional non-literal sense, which repetition does not arbitrate).
    'ocd', // same path as « toc » above: outside `explicit` despite its clinical status, because
    // « i'm so OCD about my desk » is the documented colloquialized usage. Threshold 2 lets
    // the real repeated signal through, as broad — never as named.
    'burned out', // the PARTICIPLE, widely figurative (« burned out on this show ») — hence the tier
    'burnt out',
    'xanax', // (EN/FR) moved down from `indirectCore` (see the note above)
    // MEASURED REMOVAL (EN FP bench) — five formulations were delivered here then removed:
    // « falling apart », « rock bottom », « spiraling »/« spiralling », « running on empty »,
    // « overwhelmed ». They tagged a NON-BEARER persona who writes by hyperbole (queue,
    // sourdough starter, series finale) and brought NO recall on the persona actually
    // in distress: 100% of their signal on the wrong side. Their dominant use in the targeted register
    // is conventionally hyperbolic — ADR-0003's admission rule excludes them, and the
    // colloquial tier is not a relegation zone. Do not reintroduce them without a countervailing measurement.
    'no motivation',
    'low mood',
    'breaking point',
    'numb', // literal polysemous (cold, dentist) — exactly this tier's profile
    'empty inside',
    "can't get out of bed",
    'cant get out of bed',
  ],
  includeColloquial: true,
  indirectThreshold: 2,
};
