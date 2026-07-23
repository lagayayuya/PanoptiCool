// `health_physical` lexicon (PANO-72, pass 2) — medical condition / physical health state.
//
// ── Genericity justification (PANO-70 §3, §2.5 discipline) ────────────────────────────────────
// Medical and care vocabulary of everyday FR, written blind from common usage, never
// from an export:
//   · formal / clinical: named conditions (diabète, endométriose, sclérose en plaques);
//   · everyday: care pathway (ordonnance, analyses de sang, specialists, arrêt maladie);
//   · colloquial: state periphrases (« cloué au lit », « mal partout », « la crève »).
// PITFALL SPECIFIC TO THIS LABEL (handled): fatigue hyperboles (« crevé », « claqué », « mort »,
// « HS », « je crève de faim ») are NOT health findings — they are EXCLUDED from the lexicon.
// Only « la crève » (fixed phrase = real illness) enters, distinct from « crevé » (fatigue).
// Each term would have been written identically without having seen any export.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// NORMALIZED entries (lowercase, no accents; hyphen = space). Mechanical variants (plural,
// self-censoring, lengthening) covered by the machinery. Threshold 2 (PANO-33 calibration), colloquial included.
//
// ── EN variants (2nd D1 batch) — the admission line is NOT the pilot's ──────────────────────────
// The pilot batch `mental_health` defended against HYPERBOLE: « i'm dying » is not a
// distress. That gate barely works here — no one writes « i'm diabetic » for
// a laugh, and only three terms are discarded on that basis (bare `cancer`, bare `migraine`, « i'm dying »).
//
// The line that decides this label is elsewhere, and it was MEASURED on the sealed voices of the body:
//
//     THE SYMPTOM IS NOT THE CONDITION.
//
// The two voices differ exactly there. The one who LIVES rheumatoid arthritis names her condition,
// her treatment and her specialty; the one who has NOTHING wrote a dense and
// perfectly LITERAL symptom vocabulary — a lump, a tingling, a pulse at 48, a twitching eyelid.
// Everything exists in her writing except the illness. No mechanism based on the presence of a term
// separates them, and the threshold does not protect: someone who worries over nothing searches A LOT, so the
// threshold accumulates instead of discarding — ADR-0003's hyperbole reasoning, transposed.
//
// Hence this lexicon's rule: SYMPTOM NAMES do not enter. Neither `lump`, nor `bump`, nor
// `headache`, nor `tingling`, nor `dizzy`, nor `bruise`, nor `twinge`, nor `cough`, nor `rash`, nor
// `stomach ache`. What enters is what someone who KNOWS what they have writes: the name of the
// condition, the name of the treatment, the name of the specialty, the care pathway.
//
// ── OUT OF SCOPE, by decision — pregnancy and disability ───────────────────────────────────────
// The FR entries `ma grossesse`, `pma`, `fiv`, `mon handicap` stay, and have NO EN counterpart.
// The asymmetry is deliberate: filing these territories under "physical health" is a framing that
// nothing has ratified — a pregnancy is not an illness, and classing disability here frames it as
// a pathology, which the people concerned contest. They will not be doubled in a
// second language before being decided. Discarded on the same grounds, and for the same reason: `blue badge`,
// `attendance allowance`, `carers allowance` — disability-related entitlements, not care.
//
// The exclusions that CARRY the doctrine are frozen in the adversarial battery
// (`detect/lexicon-battery.test.ts`); the local near-misses are annotated on the entry that
// discarded them. Two have neither a neighboring entry nor a test, and so stand here (ex-batch note, condensed
// in `docs/methode-portabilite-en.md`):
//   · bare `seizure` — « seizure of assets », legal register; `epilepsy` carries the signal;
//   · `miscarriage` — « miscarriage of justice » MATCHES (measured), and no machinery discards it
//     (neither negation, nor quotation, nor informational register). The case is also absorbed by the
//     pregnancy out-of-scope above: it does not reopen without it.

import type { TopicalLexicon } from './types';

export const HEALTH_PHYSICAL_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'health_physical',
  // Readings from registry §5 (amended PANO-72: 3rd reading « proche », aligned with mental_health).
  readingTemplateIds: [
    'sensitive.health-physical.reading.lived',
    'sensitive.health-physical.reading.relative',
    'sensitive.health-physical.reading.curiosity',
  ],
  // Condition NAMED of oneself → named tag. Unambiguous bare conditions + possessive phrases (the
  // trapped bare word: « cancer » = slang « c'est le cancer »; someone else's « grossesse »…).
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
    // ── EN variants: NAMED conditions, without figurative use ─────────────────────────────────
    'asthma',
    'epilepsy',
    'endometriosis', // the FR `endometriose` did not catch it (-ose / -osis)
    'fibromyalgia',
    'multiple sclerosis', // « ms » discarded: matches « 200 ms latency » (measured)
    'crohns',
    "crohn's", // dual spelling: measured, one does not match the other
    'ulcerative colitis',
    'ibd',
    'ibs',
    'celiac',
    'coeliac', // « gluten free » discarded: elective diet far more often than condition
    'long covid', // bare « covid » discarded: collective event, not a borne condition
    'chronic illness', // bare « chronic » discarded: intensifier (« chronically online »)
    'chronic pain',
    'chronic fatigue',
    'anemia',
    'anaemia',
    'hypothyroidism',
    'hyperthyroidism', // bare « thyroid » discarded: it is an organ, not a condition
    // Arthritides — CATEGORY REVEALED BY MEASUREMENT, absent from the original proposal. FR
    // carried `arthrose` alone; everyday English names the inflammatory disease, its
    // treatment and its specialty. It is one of the most widespread chronic conditions.
    'rheumatoid arthritis',
    'osteoarthritis',
    'arthritis',
    'lupus',
    // BORNE forms — the bare name of these three names no one (cf. the exclusions at the head).
    // What holds them is IN the matched string: the possessive or the 1st person is written there, so
    // "the condition is borne" is literally what the matcher verifies. An entry with neither
    // does not belong to this block, however close its sense — `in remission` had been
    // filed here and left it (« her lymphoma is in remission » NAMED the writer). It lives in the
    // sole tier `selfDeclaredEn`, where « i am in remission » finds it again.
    'my cancer',
    'my chemo',
    'on chemo',
    'my diagnosis',
    'my condition',
    'my illness', // bare « illness » discarded: « it is an illness » is a common figurative use
    'my surgery',
    'my operation', // bare « operation » discarded: military, commercial, mathematical
    'i had surgery',
    'my transplant',
    // Stroke — the possessive alone NAMES. The general forms are in `indirectCore`, and this choice is
    // MEASURED, not theoretical: the bench's caregiver voice writes eight items about her mother's stroke,
    // most of them WITHOUT a possessive (« stroke recovery timeline », « adapting a kitchen after
    // stroke »). In `explicit`, they set a NAMED finding on her — the exact over-classification
    // that her ground truth designates as the wrong to watch.
    //
    // `had a stroke` WAS ADMITTED HERE AGAINST THIS RULE, and paid for it: it carries neither possessive nor
    // 1st person, so « he had a stroke last winter » NAMED the writer. What hid the
    // defect is the 3rd-person filter — a CLOSED list of kinship terms: « my nan had a
    // stroke » is silent, « the driver had a stroke » is not. The sealed voice `relative` writes
    // « my nan », so NO persona could exhibit the defect. Moved down to `indirectCore`,
    // alongside the other general forms, where the rule above placed it.
    'my stroke',
  ],
  // Condition-adjective claimed via copula (« je suis diabétique ») — too many FP bare.
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
  // ── THE ENGLISH CONDITION-ADJECTIVES — EN counterpart of `selfDeclaredFr` above ───────────────
  // Same reason as in French (« too many FP bare »), DIFFERENT tier: this tier lands as BROAD and
  // NEVER NAMES (`TopicalLexicon.selfDeclaredEn`).
  //
  // WHAT IT REPAIRS: the condition noun was wired, the adjective was not — `diabetes` ✓ /
  // `diabetic` ✗, `asthma` ✓ / `asthmatic` ✗, `arthritis` ✓ / `arthritic` ✗. The delivered tier was
  // moreover INCOHERENT and no one had seen it: `epileptic`, `celiac`, `anemic` NAME from one item
  // (they are in `explicit`), while `diabetic` and `asthmatic` were silent. Two conditions of the same
  // register, two behaviors.
  //
  // THIS NOTE DIAGNOSED THE ASYMMETRY AND REPAIRED ONLY HALF OF IT: it added the
  // missing adjectives HERE, without ever moving back down those that had stayed in `explicit`. A
  // term present in BOTH tiers short-circuits this one — the named tier wins, and the adjective NAMES
  // from one item, in any frame, including those that this tier's admission bar
  // discards. Measured: « the sound mix on this album is anemic » and « the editing in that trailer is
  // epileptic » set a NAMED finding. `epileptic` and `anemic` therefore left `explicit`;
  // their NOUNS (`epilepsy`, `anemia`, `anaemia`) stay there, and it is they that carry the recall of the
  // bearer. `celiac` / `coeliac` stay in both tiers BY DESIGN: no English idiom applies them
  // to an object, and « celiac friendly » is domain vocabulary — a signal-without-lived-experience,
  // which is the demonstration and not a wrong (ADR-0003, *The uncertainty*).
  // The intersection is held by `detect/storey-intersection.test.ts`.
  //
  // THRESHOLD 2, AND THE PRICE IS EXPLICIT: without solo crossing, « i am diabetic » written ONCE
  // yields NOTHING. That is what the threshold already does everywhere else on this label, and the variant that
  // would have avoided it doubled the idiomatic noise (measured: `selfDeclaredEn`).
  //
  // DO NOT ENTER:
  //   · `disabled`, `deaf`, `blind`, `hard of hearing`, `a wheelchair user` — TERRITORY OUT OF
  //     SCOPE by decision (this module's header: classing disability here frames it as a
  //     pathology, which the people concerned contest). English does not reopen a
  //     French decision.
  //   · `terminal`, `obese`, `overweight` — maximal error cost or body judgment:
  //     TIERING BY ERROR COST (ADR-0003), separate batch, named debt rather than omission.
  //   · `a spoonie` — community sociolect, ADR-0003's third gate.
  //   · NO SYMPTOM NAME. This module's rule (« the symptom is not the condition ») holds
  //     without amendment, and the frame does not loosen it — « im dizzy », « im nauseous » would stay
  //     the vocabulary of the voice that has nothing.
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
  // Care, symptoms, common illnesses — unambiguous → broad tag.
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
    // ── EN variants: care pathway, examinations, treatments ───────────────────────────────────
    // This tier carries almost no hyperbole exclusions (hyperbole attacks states, not
    // institutions). It carries exclusions of another kind: SYMPTOM names, discarded at the head of the
    // file — this is where they would have landed.
    'prescription',
    'repeat prescription',
    'my gp', // « a gp » does not match: « when should you see a gp » is a general question
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
    // Named medications and classes — same justification as in FR (domain products, not
    // people). `methotrexate` and `biologics` come from MEASUREMENT: the voice that lives her
    // condition writes them four times, and the original proposal carried no maintenance
    // treatment — it had built care around consultations, not treatments.
    'methotrexate',
    'biologics',
    'folic acid',
    // Specialties.
    'rheumatology',
    'rheumatologist',
    'dermatologist',
    'gynecologist',
    'gynaecologist',
    'cardiologist',
    'oncologist',
    'endocrinologist',
    // PHYSICAL REHABILITATION — these phrases belong to the body, and their absence from here is what
    // made them read as MENTAL health (the neighboring lexicon's `therapy` term matches
    // inside). Measured on the caregiver voice; see the machinery note that makes them win.
    'physiotherapy',
    'physio',
    'occupational therapy',
    'speech therapy',
    'rehabilitation', // bare « rehab » discarded: addiction, and song title
    // ── REMOVED AT MEASUREMENT — NEUTRAL CARE belongs to neither of the two health labels ───────
    // `side effects`, `sick note`, `fit note`, `medical certificate` were proposed here, then
    // discarded: they tagged the EN voice in MENTAL distress, on « sertraline side effects » and
    // « sick note for mental health from work ». Both items state their domain in
    // full, and it is not this one.
    //
    // The diagnosis is the MIRROR of `therapy`'s (cf. the covering phrases), and it
    // holds beyond these four terms: the two health labels share a MILIEU — the sick
    // leave, the side effect, the prescription, the appointment — which belongs properly to
    // neither. This vocabulary carries no domain information: it is the surrounding
    // text that carries it. Admitting it amounts to making one label claim all care text.
    // The disability-related ENTITLEMENTS (« blue badge », « attendance allowance ») stay discarded
    // too, for another reason — out-of-scope territory, cf. the header.
    // Named infections. Bare « flu » and « cold » are discarded: universal banal episodes, tagging
    // here would amount to tagging everyone in winter.
    'bronchitis',
    'pneumonia',
    'tonsillitis',
    'ear infection',
    'sinus infection',
    'food poisoning',
    // Stroke, general forms (the possessive is in `explicit` — see the note above).
    'had a stroke',
    'stroke recovery',
    'stroke rehab',
    'stroke ward',
    'after stroke',
    'second stroke', // bare « stroke » discarded: swimming, golf, brush, « a stroke of luck »
    'flare up', // bare « flare » discarded: solar, trousers, « flare up an argument »
  ],
  // Colloquial — polysemous (« malade » = slang compliment; « la crève » = real illness).
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
    // ── EN variants: LITERAL low register and polysemous ───────────────────────────────────────
    'under the weather',
    'off sick',
    'bedridden',
    'laid up',
    'run down', // polysemous (« run down a list ») — exactly this tier's profile
    'bad back',
    'dodgy knee',
    'aching all over',
    // `allergic to` and `allergy`: HERE and not in core. The figurative use (« allergic to mornings »)
    // is dictionary-attested, but the literal use stays massive — so it is a
    // POLYSEMOUS profile, which the threshold genuinely arbitrates, not a hyperbole to exclude at the gate.
    // Bare « allergic » is discarded: without a complement, the figurative reading dominates.
    'allergic to',
    'allergy',
    // « poorly » (BrE, « he's poorly ») is DISCARDED despite its real usage: the adverb
    // (« poorly written », « poorly designed ») is far more frequent than the adjective.
    // Bare « sick » and « ill » are too — « that's sick » (excellent), « sick of it »,
    // « ill-advised », « that beat is ill ».
  ],
  includeColloquial: true,
  indirectThreshold: 2,
};
