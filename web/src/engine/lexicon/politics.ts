// `politics` lexicon (PANO-71 seed → PANO-36 enriched) — THREE distinct registers (yuya decision):
//   1. self-declaration (1st person: « je vote », « je suis de gauche ») → explicit;
//   2. thematic (vocabulary of political life: « manif », « réforme ») → indirectCore;
//   3. opinion / borne judgment (pejorative categories: « facho », « gaucho », « corrompu ») →
//      indirectCore. It is the most common register in comments, and where « fasciste »
//      lives again — correctly classed politics (opinion / engagement), NOT conflictual.
//
// ── Genericity justification (PANO-70 §3, §2.5 discipline) ────────────────────────────────────
// Civic vocabulary and COMMON ONLINE FR POLITICAL SLANG, written blind from common
// usage, never from an export:
//   · formal: institutions and procedures (assemblée nationale, motion de censure, référendum);
//   · everyday: generic themes and actors (manif, syndicat, député, pouvoir d'achat);
//   · slang / political pejorative: CATEGORY or CAMP insults (gaucho, droitard, facho,
//     bourge, beauf, woke, boomer, macroniste…) — GENERIC because they target camps/categories,
//     NEVER named individuals (proper nouns are excluded, yuya decision).
// Boundary held: insulting a PERSON (2nd-person target) = conflictual; judging a political
// category/idea = politics. Each term would have been written identically without having seen any export.
//
// ── SYMMETRY — the constraint specific to this lexicon, and it is not a precaution ─────────────
// A political lexicon that carries one camp's vocabulary better than the other's makes the
// product a BIASED instrument, and the bias is invisible: a non-detection displays nothing.
// None of the other five labels runs this risk.
//
// This lexicon ran it, and one must write the mechanism rather than fix it silently — because
// it is the mechanism, not the terms, that will recur. NO ONE wrote this bias: each
// term entered for a locally defensible reason, and the defect lived in NONE of them.
// It lived in the COMPOSITION of two registers:
//
//   · register 1 (self-declaration) collected mostly LEFT identities — `anarchiste`,
//     `communiste`, `marxiste`, `insoumis`, `feministe`…;
//   · register 3 (borne judgments) collected the RIGHT labels — `nationaliste`,
//     `populiste`, `complotiste`, `communautariste` — because they had entered there as
//     ACCUSATIONS, which they effectively are in a comment.
//
// Measured result, one item each: « je suis anarchiste » set a NAMED finding, « je suis
// nationaliste » set NONE (a single indirect hit, below threshold 2). The lexicon heard
// the left identity when it claims itself, and the right's only when a third party
// denounces it. A term-by-term rereading could not see it: it verifies that each term
// PRESENT is legitimate, never that the ABSENT ones are symmetrically so.
//
// The rule that comes out of it, and it holds for any future entry:
//   1. an identity label enters the IDENTITY tier (`selfDeclared`) for both camps —
//      including when the same word ALSO lives in `indirectCore` as an accusation (precedent:
//      `souverainiste`, `macroniste`);
//   2. a theme salient to one camp enters only with its COUNTERPART from the other;
//   3. one judges the SEMANTICS of each term, never the balance of the count. A list made
//      symmetric by padding would be a worse defect than the one being repaired: it would look
//      right.
// The witness that prevents this lexicon from re-diverging is `detect/politics-symmetry.test.ts`.
//
// EXCLUDED, and by PAIRS when the reason holds on both sides — an exclusion is lost if nothing holds
// it:
//   · `identitaire` AND `antifa` — both name a MOVEMENT family more than a position;
//     a lexicon must survive the cycles, and citing one camp's movements is a permanent editorial
//     act (same reason as the exclusion of proper nouns);
//   · `securite` — « sécurité sociale / routière / au travail » drown the political use;
//     `insecurite`, for its part, is admitted: it does not have these homographs;
//   · `immigration clandestine`, `grand remplacement` — the qualifier IS the object of the dispute;
//     admitting it would inscribe a position in the lexicon, not a subject.
// NOT ADDED but clean, and named so it is known this is not an oversight: `progressiste`.
// It would have its place; it does not serve the repair, and adding it to a tier already well stocked on the
// left would be reverse padding. The next enrichment batch will find it here.
//
// ── `liberal`: an exclusion PROPOSED, then OVERTURNED — and by what ─────────────────────────────
// The portability note proposed excluding `liberal` / `liberale`, on a real collision with
// the LIBERAL PROFESSION (« je suis libérale » under a nurse's pen), and opposed the case
// to `communiste` / `marxiste`, which have no non-political reading in the 1st person.
//
// The argument still holds; it did not suffice. The `politics` bench, sealed blind by
// another session, isolates precisely this pair as the purest form of the asymmetry: same
// frame, same length, same grammatical person, the only variable being the register term —
// « je suis socialiste » set a named finding, « je suis libéral » set none. Maintaining
// the exclusion meant leaving standing the exact defect this batch repairs, and leaving it standing on ONE
// SIDE ONLY. The profession collision is a POLYSEMY, the class the doctrine tolerates
// explicitly (the false positive is not grounds for removal) — and not a hyperbole, the only
// class the admission rule discards at the gate.
//
// DECLARED CONTAMINATION, because it changes what the bench proves: `liberal`, `liberale` and
// `redistribution` were written AFTER reading the sealed fixture. The bench remains an
// independent instrument for all the rest of the lexicon — it was written without seeing it — but it cannot
// serve as blind validation of THOSE three entries. The next instrument that measures them
// will have to be written without them in mind.
//
// ── THE ENGLISH BATCH — what it is, and the axis it does NOT take ──────────────────────────────
// 23 `// (EN)` entries, split into two engagement acts, nine institutions and procedures, eight
// themes in MATCHED PAIRS and two transversal phrases. No identity, no epithet,
// no party or movement name, `selfDeclared` left EMPTY.
//
// **The English axis is NOT the French axis, and that is the batch's fundamental decision.** The FR witness
// partitions identities into left / right; transporting that partition into English would be
// building a net on a line that this vocabulary never crosses, for three measured or
// verified reasons:
//   · the batch contains NO identity — there is nothing to partition;
//   · the word whose camp inverts by dialect exists (`liberal`: left in the United States,
//     economic right in the United Kingdom), so an English partition would depend on the reader;
//   · there is NO sealed English opposed pair — the fixture declares it in full.
// The retained axis is therefore that of PATHS: how many independent ways lead to a finding,
// on each side. That is what the EN section of `detect/politics-symmetry.test.ts` measures, and its
// header says why that measurement cannot yet conclude.
//
// ── THE EN ADMISSION GATE, AND THE VERY RULE THAT IS BIASED ─────────────────────────────────────
// **To read before adding the slightest English term to this lexicon.** It is the costliest trap
// of this whole undertaking, because it reddens nowhere: each step is justified, and the result is
// a biased instrument.
//
// The rule that comes naturally to mind, and it is good: **the DOCTRINAL NOUN enters, the
// GENERAL-USE ADJECTIVE stays out.** `socialist`, `monarchist`, `libertarian` have only one
// lexicalized sense — using them of a dishwasher is a joke that BORROWS that sense, and that
// is what makes it funny. `radical`, `moderate`, `independent`, `green`, `progressive` are English
// adjectives PRIOR to and OUTSIDE the political sense: « im pretty liberal with the
// garlic » borrows nothing, it is the ordinary use.
//
// **APPLIED MECHANICALLY, THIS RULE IS BIASED, and here is where:**
//   · `conservative` is THE ordinary word by which the anglophone right describes itself — and it is a
//     general-use adjective (« i am conservative with my time estimates »);
//   · `socialist` is THE ordinary word of the left — and it is a doctrinal noun.
// The rule would therefore admit the ordinary word of one camp and exclude that of the other. It is the
// French defect RECONSTITUTED IN NEW CLOTHES, by reasoning irreproachable at each step — and
// no one would have written it, exactly as no one had written the first.
//
// The form of the danger is general and does not depend on these two words: **an admission rule that
// discriminates on the FORM of a term (noun/adjective, bare/phrase, learned/everyday) cuts the political
// field crosswise, because the two camps do not name their position in the same grammatical
// form.** Any formal rule proposed here must therefore be tested on BOTH ordinary
// words of both sides before being adopted. No test can do it in place of whoever writes.
//
// HENCE THE DECISION, and it is written as such rather than smuggled in under a rule:
// **`conservative` AND `liberal` both enter, as ASSUMED ACCEPTANCES.** Assumed, not
// "measured" — the instrument does not exist (see below), and writing "measured" without an instrument is
// the over-citation this repo pays seven times. The doctrine authorizes them without contortion: both
// fire on bearers AND non-bearers, so they discriminate BADLY without discriminating
// NOT-AT-ALL (ADR-0003, *the false positive is not grounds for removal*), and threshold 2 works
// on them as on any polysemy. **Excluding both would be defensible; excluding
// only one is not.**
//
// EXCLUDED from the EN tier, and on what grounds — an exclusion is lost if nothing holds it:
//   · `progressive`, `moderate`, `independent`, `green`, `radical`, `red`, `blue` — general-use
//     adjectives whose non-political sense is CONVENTIONAL and DOMINANT (admission rule,
//     ADR-0003). None is the ordinary word of a camp: excluding them costs recall to no one
//     in particular, and that is what distinguishes them from `conservative`;
//   · `activist`, `militant` — productive intensifiers (« im militant about recycling »);
//     `militant` is ALREADY in the language-gate registry as a spelling not admitted in EN, and
//     admitting it here would contradict `selfdeclared-language-gate.test.ts`;
//   · `reactionary`, `populist` — ACCUSATIONS, not self-descriptions. Admitting them to the
//     identity tier would remake the French defect: the right heard only when a third party denounces it;
//   · `patriot` — proper-noun collisions (teams) and asymmetric charge by country;
//   · **party and movement names** — the written rule (durability + symmetry) HOLDS for
//     English, and English gives it a THIRD support that French did not have: measured,
//     `republican` means ANTI-MONARCHIST in Ireland and the United Kingdom, `labour` collides with
//     « labour intensive » and childbirth, `green` with the color. It is a dialectal inversion
//     WORSE than `liberal`'s, since it bears on strings that no phrase disambiguates;
//   · the same terms in `indirectCore` — OUT OF SCOPE, a distinct decision. The 3rd person and the
//     bare phrase stay silent, as in the adjectives batch: it is the gate where `straight` was
//     measured at 1 → 4 wrongs;
//   · EN `fascist` and `nazi` — FR carries `fasciste`, English refuses them: « grammar nazi »,
//     « gym fascist » make the use conventionally HYPERBOLIC (admission rule,
//     ADR-0003), and `nazi` moreover targets a third party (`conflictual` boundary). A clear case where translating
//     the FR entry would have been the mistake;
//   · bare `welfare` (« animal welfare », « child welfare »), `free speech` (claimed by all the
//     camps, so without discriminating power), `culture war` (journalistic far more
//     than self-described), `illegal immigration` (the qualifier IS the object of the dispute — exact EN
//     counterpart of the `immigration clandestine` exclusion above).
// SOCIOLECT (ADR-0003's 3rd gate), verified term by term and not assumed of the whole: the two
// English political registers that MARK a group — the class-charged camp vocabulary
// (`gammon`, `little englander`, `sheeple`) and the regionally-marked patriotic register — have
// no candidate here, the former being EPITHETS (excluded en bloc) and the latter covered by
// the exclusion of `patriot`. The 25 admitted are DOCTRINE terms, not socially marked.
//
// ── EN `liberal`: the dialectal inversion breaks a WITNESS, not the PRODUCT ────────────────────
// The portability note held `liberal` inadmissible in English, its camp inverting by
// dialect (left in the United States, economic right in the United Kingdom). The fact is exact; the
// consequence drawn from it aimed at the wrong target.
//
// `selfDeclaredEn` NEVER NAMES, and the produced finding says `politics` — never « gauche », never
// « droite ». The product displays NO camp, in any language. A term's camp exists only
// in a witness's ledger, i.e. in test bookkeeping. The inversion therefore breaks the
// PARTITION, not the DETECTION — and the witness files it in a dedicated `ambiguous` bucket, exactly
// as the French side gave itself a `neutral` bucket so as not to force a camp on terms
// that carry none.
// Two phrases moreover disambiguate what the bare word cannot: `classical liberal`
// (economic right) and `social democrat` (left) each enter on their own side, without depending on the
// reader.
//
// ── WHAT THE EN TIER DOES NOT MAKE UP — the language gap SUBSISTS, by decision ─────────────────
// To write before anyone cites this batch as "the English political coverage is repaired":
//     « je suis socialiste »  ×1 → politics[EXPLICIT]
//     « i am a socialist »    ×1 → NOTHING
//     « i am a socialist »    ×2 → politics[indirect]
// English requires TWO items where French requires one, and it NEVER NAMES. This is not
// a leftover gap: these are two decisions already made elsewhere — the tier by `selfDeclaredEn` (which
// never asserts) and the threshold by the PANO-33 calibration. This batch repairs REPEATED self-declaration;
// the isolated utterance stays silent, the 3rd person and the bare phrase too.
//
// ── THE COPULA ANCHORS NOTHING, confirmed on a SIXTH label ─────────────────────────────────────
// Measured while writing this batch, and the result joins that of `filters-en.ts`: **« i am X about Y »
// is a PRODUCTIVE construction of English, which turns any identity noun into an
// intensifier** — « i am socialist about splitting the bill », « i am monarchist about chess
// openings ». No safety load therefore weighs on the frame, here no more than elsewhere: what
// protects is the TIER (this tier never asserts) and the THRESHOLD, and nothing else.
//
// *The method corollary, and it cost an instrument:* a false-positive bench was written for
// this batch — two ordinary-English sentences per term — and it **reddens on 32 terms out of 32**,
// including those it was supposed to clear. It DISQUALIFIED itself, and its figure is not published: it
// measures the CONSTRUCTIBILITY of a collision when ADR-0003's rule bears on DOMINANT use.
// « im pretty liberal with the garlic » is a real idiom; « i am monarchist about chess openings »
// is a sentence fabricated for the occasion. An instrument that returns 32/32 separates nothing.
//
// ── WHAT THIS BATCH DID NOT MEASURE, and the zero is a BLINDNESS ────────────────────────────────
// The two sealed English guard-voices fire NOTHING, before as after this batch. This is
// NOT a certificate of safety: measured term by term, **none of the 23 entries appears in the text
// of either guard**. The zero says the guards do not contain this vocabulary, not
// that the guards sort it well. The false positives of this batch are therefore **unmeasured**, exactly
// like those of the pilot batch — and the way the terms were chosen (PHRASES, never
// the bare nouns `election`, `vote`, `taxes`, `political`, `council`, which are in the text of the
// guards) is a reasoning, not a measurement.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// NORMALIZED entries (lowercase, no accents; hyphen = space). Mechanical variants (plurals,
// lengthenings, self-censoring) covered by the machinery. PANO-33 calibration: threshold 2, colloquial included.

import type { TopicalLexicon } from './types';

export const POLITICS_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'politics',
  // Readings from registry §5: engagement / activism · personal opinion · curiosity / monitoring.
  readingTemplateIds: [
    'sensitive.politics.reading.engaged',
    'sensitive.politics.reading.irony',
    'sensitive.politics.reading.watch',
  ],
  // Phrases/verbs of engagement to oneself, NON-copular (the self-declaration pattern, PANO-72,
  // covers only « je suis X »; these forms stay bare markers).
  explicit: [
    'je vote',
    'je milite',
    "j'adhere",
    "j'ai vote",
    'je voterai',
    "j'irai voter",
    'mon parti',
    'ma famille politique',
    'je manifeste',
    // (EN) Engagement acts, in the PAST and administrative — the only English forms without figurative
    // use. BARE `i vote` is excluded: « i vote we order pizza » is the PROPOSAL idiom, and
    // it is the dominant use of the present. Bare `registered` excluded too (registered nurse, post).
    'i voted',
    'i registered to vote',
  ],
  // SELF-DECLARED political labels (« je suis de gauche », « chui plutôt anar ») — matched
  // via the self-declaration pattern (PANO-72), which absorbs the contracted variants and the
  // modifiers (« je suis un vrai militant ») without listing them.
  selfDeclaredFr: [
    'de gauche',
    'de droite',
    "d'extreme gauche",
    "d'extreme droite",
    'militant',
    'militante',
    'ecolo',
    'centriste',
    'anarchiste',
    'anar',
    'communiste',
    'socialiste',
    'apolitique',
    'syndique',
    'syndiquee',
    'macroniste',
    'insoumis',
    'insoumise',
    'royaliste',
    'libertaire',
    'marxiste',
    'gaulliste',
    'souverainiste',
    'feministe',
    // RIGHT identities in the IDENTITY tier — the symmetry repair described in the header. The
    // first four ALSO live in `indirectCore` as accusations: that is the point, not a
    // redundancy. A word can be a claim and an insult, and the lexicon must read
    // both (precedent set by `souverainiste` and `macroniste`).
    'nationaliste',
    'patriote',
    'reac',
    'traditionaliste',
    'conservateur',
    'conservatrice',
    'monarchiste',
    'liberal',
    'liberale',
  ],
  // ENGLISH political identities — matched via `SELF_DECLARATION_HEADS_EN`, and this tier
  // NEVER ASSERTS (broad finding; `TopicalLexicon.selfDeclaredEn`). Justification of the admission
  // gate, of `conservative`/`liberal` and of the language gap: at the head of the file.
  //
  // The per-camp counts are FROZEN in `detect/politics-symmetry.test.ts`. The 10/10 equality is
  // a CONSTAT, never a target: a list made symmetric by PADDING would be a worse defect
  // than the one being repaired — it would look right. Two arbitrations moved the columns on the
  // substance, and they declare themselves: `protectionist` DISCARDED from the right (it is an accusation far more
  // than a self-description — putting it there would have remade the French register 3), `classical liberal`
  // ADMITTED (real self-description, and it disambiguates `liberal`).
  selfDeclaredEn: [
    // — Left (10)
    'socialist',
    'communist',
    'marxist',
    'anarchist',
    'leftist',
    'left wing',
    'social democrat',
    'trade unionist',
    'feminist',
    'environmentalist',
    // — Right (10)
    'conservative',
    'right wing',
    'traditionalist',
    'nationalist',
    'monarchist',
    'royalist',
    'libertarian',
    'fiscal conservative',
    'social conservative',
    'classical liberal',
    // — No camp (4)
    'centrist',
    'apolitical',
    'politically homeless',
    'swing voter',
    // — Ambiguous by DIALECT (1): left in the United States, economic right in the United Kingdom. Admitted
    //   because the inversion breaks a witness's partition, not the detection — the product
    //   displays no camp. Cf. the header.
    'liberal',
  ],
  indirectCore: [
    // Register 2 — thematic (vocabulary of political life).
    'manif',
    'elections',
    'greve',
    'manifestation',
    'petition',
    'reforme',
    'le gouvernement',
    'syndicat',
    'les elus',
    'campagne electorale',
    'scrutin',
    'referendum',
    'abstention',
    'extreme droite',
    'extreme gauche',
    'assemblee nationale',
    'senat',
    'motion de censure',
    'depute',
    'senateur',
    'ministre',
    'premier ministre',
    'president de la republique',
    "pouvoir d'achat",
    'immigration',
    'aller voter',
    'allez voter',
    // THEMATIC repertoire — the second half of the repair. The tier carried only the
    // MOBILIZATION repertoire (manif, grève, syndicat, pétition), which is one camp's:
    // measured, `securite`+`frontieres`, `impots`+`assistanat`, `ordre`+`laicite` tagged nothing
    // when `manif`+`greve` tagged. Each entry is the word by which one camp speaks of ITS
    // subject — never the one by which the other disqualifies it.
    'insecurite',
    'assistanat',
    'matraquage fiscal',
    'ordre public',
    'identite nationale',
    'souverainete nationale',
    'fiscalite',
    'redistribution',
    'depenses publiques',
    // The two remaining counterparts: `laicite` is transversal to the camps (it is a theme, not a
    // side), `service public`/`services publics` answers `depenses publiques`.
    'laicite',
    'service public',
    'services publics',
    // ── (EN) Institutions and procedures — no camp by construction ───────────────────────────────
    // The vocabulary of political FUNCTIONING belongs to no one and does not date: that is what
    // makes it admissible in a batch whose constraint is symmetry. Each entry is a
    // PHRASE, never the bare noun — and this is not a style preference, it is what keeps it out of the
    // text of the two sealed guard-voices, which carry BARE `election`, `vote`, `taxes`, `political` and
    // `council` while speaking of something other than an engagement.
    'general election',
    'by election',
    'polling station',
    'postal vote',
    'ballot box',
    'parliament',
    'civil service',
    'public spending',
    'voter turnout',
    // ── (EN) Themes, in MATCHED PAIRS ────────────────────────────────────────────────────────────
    // Rule 2 of the header, applied to English. The pairs are matched on IDIOMATICITY, not
    // on number: a table balanced in columns can stay asymmetric in PATHS if one
    // camp's term is the one actually written and the other's a desk translation.
    // `law and order` is its side's idiomatic phrase; `public services` is its side's.
    'minimum wage', //      ↔ tax burden
    'tax burden',
    'trade union', //       ↔ red tape
    'red tape',
    'food bank', //         ↔ border control
    'border control',
    'public services', //   ↔ law and order
    'law and order',
    'means test', //        ↔ red tape (second procedural phrase, the other side)
    'means tested',
    'public money',
    // Transversal to the camps — a theme, not a side (same status as `laicite` on the FR side).
    'cost of living',
    // Register 3 — opinion / judgment, pejorative categories (NEVER named persons).
    'fasciste',
    'facho',
    'fascisme',
    'dictature',
    'dictateur',
    'totalitaire',
    'autoritaire',
    'propagande',
    'propagandiste',
    'liberticide',
    'corrompu',
    'corruption',
    'a la solde de',
    'gaucho',
    'gocho',
    'gauchiste',
    'droitard',
    'bourge',
    'beauf',
    'woke',
    'wokisme',
    'boomer',
    'bobo',
    'reac',
    'islamo gauchiste',
    'collabo',
    'complotiste',
    'fachosphere',
    'communautariste',
    'mondialiste',
    'souverainiste',
    'nationaliste',
    'populiste',
    'extremiste',
    'macroniste',
    'antivax',
    'anti vax',
  ],
  // Colloquial — polysemous outside a political context (« vendu ma voiture », « film pourri »): the
  // threshold 2 + the neighborhood do the sorting.
  indirectColloquial: [
    'ecologie',
    'on lache rien',
    'la mairie',
    'politise',
    'ecolo',
    'tous pourris',
    'traitre',
    'vendu',
    'pourri',
    'les elites',
    'moutons',
    'coco',
    'assistes',
    'fake news',
    'retraites',
    // Written in the SINGULAR: the plural tolerance ADDS an `s` to the marker, it does not remove
    // one — « impots » would not have matched « impot ». Colloquial because both have an
    // ordinary administrative use (tax return, a country's border on a map);
    // threshold 2 and the neighborhood do the sorting.
    'impot',
    'frontiere',
  ],
  // SUBJECT label: negation degrades instead of suppressing (ADR-0003, *The state and the subject*).
  // Without this flag, the product heard only whoever ADHERES — measured: « ces fachos partout »
  // tagged, « je supporte pas les fachos » tagged nothing. Opposition is the dominant register
  // of political discourse; being deaf to it is not a precaution, it is a biased silence.
  subjectNotState: true,
  includeColloquial: true,
  indirectThreshold: 2,
};
