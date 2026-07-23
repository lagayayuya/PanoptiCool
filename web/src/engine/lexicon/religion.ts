// `religion` lexicon (PANO-72, pass 2) — SUBJECT label (practice / affiliation / opinion /
// curiosity, decision D). The most delicate of the six.
//
// ── Genericity justification (PANO-70 §3, §2.5 discipline) ────────────────────────────────────
// Religious vocabulary of everyday FR (all faiths), written blind from common
// usage, never from an export:
//   · formal: affiliation and practice (croyant, pratiquant, pèlerinage, catéchisme);
//   · everyday: places, texts, figures, rites (mosquée, coran, imam, ramadan, messe);
//   · colloquial: marked lexicalized formulas (hamdoulah, bismillah).
// BOUNDARIES held (decision D — religion does NOT re-conflate these cases):
//   · SUBJECT label: NO "hostile opinion" register here (≠ politics). An opinion on
//     religion that uses this topical vocabulary is captured as indirect; the fan of readings
//     carries the "personal opinion" reading. The criticism of a religion as an IDEA is tagged
//     NOWHERE;
//   · anti-BELIEVER hostility (insult targeting a person) → `conflictual`, never here;
//     · term targeting an ethno-religious GROUP in the absolute → HATEFUL, excluded from EVERY lexicon,
//     FLAGGED as the scope of a future dedicated label — never decided alone, never included here.
// Assumed exclusion (yuya decision): « wallah / inchallah / machallah » EXCLUDED
// (lexicalized interjections in general FR slang — do not tag a population on its
// sociolect); « hamdoulah / alhamdulillah » (more marked) in indirectColloquial only.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// NORMALIZED entries. Threshold 1 (PANO-33 calibration): a cultural « église » will tag as BROAD, and
// the fan of readings (« curiosité / intérêt ») carries that reading — multi-interpretability, not
// a bug. The sensitive's safety lives in the display SCREEN — the finding starts folded,
// behind a "sensitive" badge — and not in the threshold: raising the threshold would reserve the display for the
// clearest cases without making anything safer, each card being already behind a gate (ADR-0003).
//
// ── WHAT ENGLISH CARRIES, AND WHAT IT DOES NOT CARRY ────────────────────────────────────────────
// The English batch lives IN THE SOLE BROAD TIER (reasons and boundaries in `indirectCore`). Three
// consequences a reader would assume otherwise, and which are measured:
//
//   · **`selfDeclaredEn` does not exist** — the language gate is not touched, and no English
//     self-declaration yields anything. English NEVER NAMES on this label.
//   · **The adherence demotion and the negation boundary have NO English surface.** These are
//     the two repairs this module is proudest of, and they are bilingual in appearance
//     only: `adherence` caps a NAMED finding, and there is none in English.
//   · **Negation and the 3rd person are structurally INERT in English here** — measured:
//     « i am not doing ramadan » and « she is doing ramadan » both yield a broad finding.
//     This is not a defect, it is `subjectNotState`: it DEGRADES explicit → indirect, and a
//     marker already indirect has nowhere to descend. Of the three doctrine filters, only
//     QUOTATION has an English effect on this label.
//
// The English safety of this label is therefore UNMEASURED: the sole English voice of the bench is a
// monument visitor, adverse to this vocabulary by construction and red in advance. It is a
// witness, not a floor — no figure from this bench is cited as a safety measure.
// (Ex-batch note condensed in `docs/methode-portabilite-en.md`.)

import type { TopicalLexicon } from './types';

export const RELIGION_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'religion',
  // Readings from registry §5: practice / affiliation · personal opinion · curiosity / interest.
  readingTemplateIds: [
    'sensitive.religion.reading.practice',
    'sensitive.religion.reading.opinion',
    'sensitive.religion.reading.curiosity',
  ],
  // Practice/declaration of oneself, NON-copular (phrases) — the named tag goes mostly through
  // `selfDeclared`.
  explicit: [
    'je prie',
    'ma foi',
    'je crois en dieu',
    'je fais le ramadan',
    'je porte le voile',
    'je vais a la messe',
    'ma paroisse',
    'mon eglise',
    'ma mosquee',
  ],
  // ── THE ADMISSION RULE FOR TRADITIONS, written to be auditable ─────────────────────────────────
  // It answers "which traditions does this lexicon carry, and why those", a question
  // that a LIST alone cannot decide — it is the equivalent, for this label, of the rule that
  // discards organizations on the `politics` side.
  //
  //   (1) The lexicon carries TRADITIONS, never ORGANIZATIONS. The ordinary appellation
  //       a person uses FOR THEMSELVES enters; institutions, denominations, movements, orders,
  //       congregations, and any figure do not. Same reason as on the political side: an
  //       organization name dates, splits and gets renamed, whereas an ordinary appellation endures.
  //
  //       AMENDED at the English batch, and the amendment bears on the CRITERION, not on a list. What the
  //       clause targets is DURABILITY — « dates, splits and gets renamed » — and not the grammatical
  //       form of the name. An appellation a person uses FOR THEMSELVES as an
  //       affiliation, and that is stable at the scale of centuries, enters EVEN IF an organization
  //       bears the same name. `mormon`, `quaker`, `amish` are of that kind: « i was raised mormon »
  //       is an affiliation identity in ordinary English, not the citation of an institution.
  //       The denominations and branches that read as administrative divisions
  //       of a tradition stay out — baptist, methodist, presbyterian, episcopalian,
  //       anglican, lutheran, sunni, shia.
  //
  //       The amendment is written here rather than applied as an exception because an unwritten
  //       exception re-derives identically: the next session rereads the original rule, does not see
  //       why `mormon` escapes it, and removes it.
  //
  //       NAMED DEBT, and it is a FRENCH decision that an ENGLISH batch had no business making: the
  //       amended rule would admit `mormon` in French too. That would be a seventh family in the
  //       symmetry witness and a shift of frozen, ratified counts. Left open.
  //       (Verified in passing, against the hypothesis that motivated it: `protestant` AND `evangelique`
  //       are both admitted in FR — there is no French asymmetry to repair on this side.)
  //   (2) A tradition enters as soon as its ordinary appellation EXISTS in the language — whatever
  //       its demographic weight. The criterion is linguistic, not statistical, AND IT IS THE
  //       HEART OF THE RULE: classing by weight would guarantee that the least numerous traditions
  //       produce no trace, yet a non-detection displays NOTHING. Selective silence is
  //       a disguised judgment (ADR-0003) — here it would have targeted minorities.
  //   (3) Every admitted tradition enters IN BOTH TIERS where its counterparts exist: the appellation in
  //       self-declaration, the domain name in subject vocabulary. An orphan entry is a
  //       delayed imbalance.
  //
  // ADMITTED AT THE COVERAGE REVIEW, the gap having been measured (« je suis hindoue », « je suis
  // sikh » yielded NOTHING in the exact frame where five others set a named finding):
  // hindou·e, sikh·e, orthodoxe. `agnostique` joins `athee` in the BROAD tier — they are postures
  // and not traditions, and the ratified demotion holds for both identically.
  //
  // NOT ADMITTED, and saying so is worth more than a list without a boundary: jaïn, bahá'í, zoroastrien, shintō,
  // taoïste. Rule (2) would admit them, rule (1) does not exclude them — what holds them back is
  // that I do not know whether their appellation is written in everyday French without a gloss, and I prefer a
  // DECLARED lack to an entry no one can audit. It is a boundary of my
  // knowledge, not a doctrine decision: it is lifted by a measurement, not by an arbitration.
  //
  // SELF-DECLARED affiliation (« je suis croyant », « chui musulman ») → named tag via pattern.
  // Lexicalized loanword « muslim » (used by francophones). « feuj » EXCLUDED (ethno-religious group
  // term — flagged to yuya).
  //
  // « athée » REMOVED from this tier (ratified at the measurement of the registers bench) and moved down to
  // `indirectCore`. The subject was not in question: a militant atheist writes religious
  // vocabulary constantly, a platform would read it, and the card is legitimate. It was the TIER.
  // At the named tier, the fan is ranked and puts « pratique / appartenance » FIRST — an atheist
  // therefore received a card privileging « she practices », the right reading (« avis personnel »)
  // relegated to second rank although it was already written. At the broad tier the fan is flat,
  // the three readings display equally, and the card becomes true without inventing anything.
  selfDeclaredFr: [
    'croyant',
    'croyante',
    'musulman',
    'musulmane',
    'muslim',
    'muslima',
    'chretien',
    'chretienne',
    'juif',
    'juive',
    'catholique',
    'catho',
    'protestant',
    'protestante',
    'evangelique',
    'bouddhiste',
    'hindou',
    'hindoue',
    'sikh',
    'sikhe',
    'orthodoxe',
    'pratiquant',
    'pratiquante',
  ],
  // ── THE ENGLISH APPELLATIONS — the side that ratified domain names were missing ───────────────
  // This tier NEVER asserts (broad finding; `TopicalLexicon.selfDeclaredEn`). It therefore changes
  // nothing about what this label dares to say: English continues never to NAME on `religion`, as
  // this module's header has written since the English batch.
  //
  // WHAT IT REPAIRS, and it is not an extension but the application of rule (3) above —
  // « every admitted tradition enters IN BOTH TIERS where its counterparts exist; an orphan entry
  // is a delayed imbalance ». Measured: the DOMAIN names were wired, the
  // APPELLATIONS were not.
  //
  //     christianity ✓ / christian ✗      judaism ✓ / jewish ✗      hinduism ✓ / hindu ✗
  //     buddhism ✓ / buddhist ✗           sikhism ✓ / sikh ✗        islam ✓ / muslim ✗
  //
  // Six traditions orphaned by the module's own rule. `mormon`, `quaker`, `amish`,
  // `evangelical` were not (they live in `indirectCore`), which made the gap invisible
  // to whoever looked at the list rather than the pairs.
  //
  // THE TWO POLES ENTER TOGETHER, and it is the condition of the admission: `atheist`, `agnostic`,
  // `non religious`, `secular` are here on the same footing as the traditions. Adding only the
  // believer appellations would make this label a believer detector — the selective silence
  // ADR-0003 names (*The uncertainty*, neutrality). They are ALREADY in the broad tier in `indirectCore`;
  // repeating them here gives them the same framed path as the traditions, not one more tier.
  //
  // DO NOT ENTER, at the same gate, and the exclusion is worth more than the inclusion:
  //   · `devout`, `observant`, `practicing`, `spiritual`, `born again`, `godless` — adjectives
  //     of INTENSITY or posture, not appellations. Measured in ordinary English: « devout fan
  //     of this show », « a born again gym person since january », « im spiritual not religious ».
  //   · `orthodox` — THE MOST TEMPTING AND THE MOST DANGEROUS. Its dominant English use is
  //     "conforming, canonical": « an orthodox approach to the problem », « orthodox economics ».
  //     French carries `orthodoxe` in `selfDeclaredFr` and can afford it; English
  //     cannot. Same form of decision as `temple`, in the other direction — and it must NOT
  //     be harmonized.
  //   · `catholic` is admitted HERE but would stay excluded from a BARE tier: « she has catholic taste in
  //     music » (= eclectic) is everyday English. It is the frame that makes it admissible, and
  //     that is all the frame buys.
  //   · the denominations (`baptist`, `methodist`, `presbyterian`, `episcopalian`, `anglican`,
  //     `lutheran`, `sunni`, `shia`) — rule (1), unchanged.
  //   · THE WHOLE PHATIC LAYER: `bless you`, `blessed`, `amen`, `preach`, `hallelujah`. Already
  //     excluded from `indirectCore`, and it stays so here — ADR-0003's third gate, whose
  //     SECOND reason suffices: salient markers of African-American English and the Southern
  //     United States. Verified one by one: no appellation admitted above falls on that side.
  selfDeclaredEn: [
    'muslim',
    'christian',
    'catholic',
    'jewish',
    'hindu',
    'buddhist',
    'sikh',
    'mormon',
    'quaker',
    'amish',
    'evangelical',
    'protestant',
    'religious',
    'a believer',
    // The non-believer pole, at the same tier and in the same batch.
    'atheist',
    'agnostic',
    'non religious',
    'secular',
  ],
  // ADHERENCE — their NEGATION caps a self-declaration to broad (doctrine and reason for being:
  // `TopicalLexicon.adherence`). Verbs and nouns of adherence itself, never of traditions: what
  // contradicts « je suis catholique » is not another affiliation, it is the withdrawal of the
  // belief or the practice. Kept SHORT and generic on purpose — this list caps, so one
  // entry too many costs recall on people who genuinely assert.
  adherence: ['crois', 'croire', 'croyais', 'pratique', 'pratique ma religion', 'ma foi'],
  // Subject vocabulary, unambiguous → broad tag.
  indirectCore: [
    'religion',
    'spiritualite',
    'la priere',
    'priere',
    'ramadan',
    'careme',
    'messe',
    'mosquee',
    'synagogue',
    'coran',
    'torah',
    'evangile',
    'imam',
    'rabbin',
    'pape',
    'halal',
    'casher',
    'hijab',
    'islam',
    'christianisme',
    'judaisme',
    'bouddhisme',
    'hindouisme',
    'sikhisme',
    // ── THE AXIS OF BELIEF, AND WHY ITS TWO POLES ARE NOT AT THE SAME TIER ──────────────────────
    // Question reopened by the FR symmetry batch, and DECIDED TO LEAVE AS IS. What follows is
    // the reasoning, because the reason written until now was incomplete and invited reopening.
    //
    // (1) `athee` IS NOT the case of `valide`. On `health_physical`, admitting « je suis valide »
    //     would set a CONDITION finding on someone declaring they have none — the
    //     majority term there names the ABSENCE of the thing detected. Not here: `religion` is a
    //     SUBJECT label (ADR-0003, *The state and the subject*), the thing detected is the SUBJECT and not the belief,
    //     and an atheist holds a POSITION on this subject. The two poles therefore do belong to the
    //     same axis, and the coverage is SYMMETRIC — both fire.
    //
    // (2) But the reason for the demotion was never « atheist is less of a position ». It was
    //     the FAN, and it is written from the practicing pole: its head is « pratique /
    //     appartenance ». The fan is `ranked` at the named tier and `equal` at the broad tier
    //     (`rules/d1-sensitive-topics.ts`). Hence the asymmetry of consequences, and it does not
    //     reverse:
    //       · promoting `athee` → its card would put « pratique / appartenance » AT THE HEAD, very
    //         exactly the defect that the ratified demotion corrected. Regression;
    //       · demoting `croyant` → loss of a named finding on a true and
    //         explicit self-declaration, whereas for it the ranked head is RIGHT. Recall lost, nothing gained.
    //     The reason therefore does NOT apply symmetrically, and that is what makes the tier asymmetry
    //     legitimate: it compensates for a FAN asymmetry, not a judgment on the normal pole.
    //
    // (3) What the asymmetry does not do: it does not make the product deaf to anyone. An atheist
    //     receives her card, with three readings equal. Only the ASSERTION differs — « a
    //     more sensitive label deserves to assert less » (ADR-0003).
    //
    // NAMED DEBT, and it is the real repair: A SINGLE fan serves both poles. PER-POLE
    // fans — « avis personnel » at the head on the non-believer side — would allow a symmetric
    // tier without putting anything false at the head. It is a new mechanism, not a lexicon batch.
    'athee',
    'atheisme',
    'agnostique',
    'agnosticisme',
    // THE SYNONYMS OF THE NON-BELIEVER POLE, and their absence was a real coverage gap: `athee`
    // was wired, its ordinary neighbors were not. Coverage is verified in both
    // directions (CLAUDE.md), and « je suis incroyant » yielded NOTHING where « je suis athee » yielded a
    // broad finding — same pole, same register, two behaviors.
    'incroyant',
    'incroyante',
    'non croyant',
    'non pratiquant',
    // Anticlericalism is a position ON the subject, and the critical pole is the one ADR-0003
    // names as the costliest silence (*The uncertainty*, neutrality). Measured: the historical
    // form (« l'anticléricalisme du 19e siècle ») stays on the subject, so no register
    // wrong.
    'anticlerical',
    'anticlericalisme',
    // `laique` / `laicite` DISCARDED, and it is not a coyness. Their dominant use in French
    // is not a personal position on belief: it is the CIVIC vocabulary of
    // institutions. Measured — « une école laïque » and « un état laïque » fired, on
    // school-policy sentences that say nothing of the belief of whoever writes them. The term is
    // moreover transversal to the two political sides, which the `politics-symmetry` witness
    // already records for `laicite`. Its probable home is `politics`, never here.
    'catechisme',
    'pelerinage',
    'aid moubarak',
    'priere du vendredi',
    // ── ENGLISH VOCABULARY ──────────────────────────────────────────────────────────────────────
    // Merged inline (same discipline as `mental_health` and `politics`): the detector does not
    // separate the languages, only `selfDeclaredFr` is paired with heads.
    //
    // WHY THIS BATCH EXISTS, and it is NOT « English had nothing ». It had some, by orthographic
    // accident, and it was TILTED: islam 5 surfaces (islam, ramadan, halal, hijab, imam),
    // judaism 2, christianity 2, buddhism / hinduism / sikhism 0 — each crossing
    // ALONE at threshold 1. In other words: mentioning halal food once set a
    // finding, writing that one goes to church every Sunday set none. No one had
    // decided it. The bench was not wrong about the mechanism (FR entries meeting an EN text);
    // it never asked WHICH, only whether there were any.
    //
    // THIS BATCH'S ADMISSION LINE (doctrine, ADR-0003 *the sociolect marker*): the word that
    // NAMES enters, the word that DOES does not. Referent test — does this term point to a
    // place, a text, a figure, a rite, a tradition? If so it enters, whether the author is
    // a believer, a critic or a tourist (principle of demonstration). Otherwise it stays out, however religious
    // its etymology.
    //
    // EXCLUDED BY THIS LINE, and saying so is worth more than a list without a boundary: `bless you`, `blessed`,
    // `amen`, `preach`, `hallelujah`, `godspeed`, `holy`, `sacred`, `oh my god`, `thank god` — they
    // accomplish a social act without designating anything, and several are sociolect markers
    // (African-American English, Southern United States). Excluded too are the loanwords English has
    // SECULARIZED — `karma`, `zen`, `guru`, `mantra`, `nirvana`, `yoga`, `chakra`, `dharma` — and
    // it is the batch's cruel turn: these are the words of the traditions that were at zero. Hence a
    // coverage that stays thinner for buddhism, hinduism and sikhism, BY FACT OF
    // LANGUAGE and not by choice: the usable vocabulary there is the undigested loanword (gurdwara,
    // mandir, puja, diwali), cleaner and rarer. Declared rather than equalized by admitting
    // `karma`.
    //
    // NO ENGLISH COLLOQUIAL ENTRY, and it is not an oversight: the colloquial tier is the focus
    // of MARKED formulas (hence designating — `hamdoulah`, `bismillah`). Its English counterpart
    // would be that of UNmarked formulas, i.e. exactly what the line refuses. The
    // tier inverts its meaning when changing language (ADR-0003, tier corollary).
    //
    // BARE NOUNS AVOIDED IN FAVOR OF THE PHRASE, where the English collision is hard — the lesson of
    // `politics` applied to CASES, never as a line (most of these words are monosemous
    // in English and a phrase would cost them all their recall for nothing): `the sabbath` and not
    // `sabbath` (Black Sabbath), `easter mass` and not `mass` (physics) nor `easter` (eggs).
    // DISCARDED ENTIRELY for the same reason: `lent` (preterite of *lend*), `bishop` (chess
    // piece), `confession` (avowal), `minister` (head-on `politics` collision), `faith`, `grace`,
    // `hope`, `charity`, `trinity`, `saint` (first names and proper nouns), `mecca` (*a mecca for
    // cyclists*), `cathedral`, `abbey`, `chapel` (register of the MONUMENT and not of worship — written
    // mostly by whoever visits, plus the real-estate collision *cathedral ceiling*).
    //
    // ADMITTED AND DECLARED COLLISIONS, because the recall they carry has no substitute:
    // `quaker` (oat flakes brand), `pastor` (*al pastor*, surname), `monk` (surname),
    // `kosher` (*that's not kosher* = irregular), `baptism` (*baptism of fire*), `gospel`
    // (*gospel truth*). None is measured — see the phaticity guard for what is.
    //
    // `temple` ENTERS IN ENGLISH WHILE IT IS EXCLUDED IN FRENCH, and the divergence is DELIBERATE:
    // do not harmonize it. It is the only ordinary English word for buddhist and
    // hindu places of worship; excluding it would recreate, on the two traditions already at zero, very exactly the gap
    // that the tradition admission rule exists to prevent. French can afford
    // it (it has other words and other homonyms); English cannot.
    //
    // Traditions — the 5-2-2-0-0-0 gap closed at the domain-name level.
    'christianity',
    'judaism',
    'buddhism',
    'hinduism',
    'sikhism',
    'mormon',
    'mormonism',
    'quaker',
    'amish',
    // `evangelical` enters AFTER the amendment of rule (1) — RATIFIED admission — and against the
    // original proposal of this same batch, which
    // excluded it as a disguised `politics` word (*evangelical voters*). Two objections defeated
    // the exclusion: French already admits `evangelique`, and at the BROAD tier a text about
    // evangelical voters DOES speak of religion — the case the principle of demonstration
    // protects. Maintaining it would have fabricated an FR/EN divergence for no reason, in the batch that
    // corrects one.
    'evangelical',
    // Places.
    'church',
    'mosque',
    'gurdwara',
    'mandir',
    // `temple` AS A PHRASE, and the detour is not a refinement — it is the only
    // implementable form. The ratified fork said « `temple` enters in English despite its French
    // exclusion »; THERE IS NO « IN ENGLISH » for this tier. The detector carries ONE lexicon and
    // routes nothing by language: only `selfDeclaredFr` is paired with heads, and the indirect
    // tiers are seen by both languages. Bare `temple` therefore re-tagged « j'ai mal aux
    // temples », i.e. the anatomical collision that the ratified FR exclusion (PANO-72) has held
    // since the survey — measured, `lexicon-battery.test.ts` reddened.
    //
    // The phrase does the sorting the lexicon cannot do: the English article and epithet
    // do not appear in the French turn. The ratified decision is therefore held — the
    // buddhist and hindu places of worship stop being silent — without reopening an FR exclusion.
    // WHAT IT COSTS, and it must be read before citing this entry: « a temple in kyoto »,
    // « temple visit », « at temple » do NOT fire. The coverage is that of the most
    // frequent turn, not that of the word.
    'the temple',
    'buddhist temple',
    'hindu temple',
    // Texts.
    'quran',
    'koran',
    'gospel',
    'hadith',
    'scripture',
    // Figures.
    'rabbi',
    'priest',
    'pastor',
    'monk',
    'pope',
    // Rites and practices.
    'eid',
    'hanukkah',
    'diwali',
    'vaisakhi',
    'shabbat',
    'the sabbath',
    'easter mass',
    'baptism',
    'pilgrimage',
    'sermon',
    // `prayer` AND `pray` — the noun and the verb. The verb nearly went missing, and its absence was
    // measurable: « i am a muslim and i pray every day » yielded NOTHING when « i go to church on
    // sundays » yielded a finding, because `muslim` is kept behind the language gate and
    // only the noun was admitted. French has always covered both (`je prie`, `priere`).
    //
    // Both NAME a thing, and that is what admits them despite their phatic neighborhood: what
    // is phatic is the PHRASE (« praying for you », « thoughts and prayers »), never the term.
    // The line handles terms whose dominant use is phatic, not phrases built on a
    // designating term — boundary asserted in `religion-symmetry.test.ts`.
    'prayer',
    'pray',
    // Prescriptions.
    'kosher',
    'niqab',
    'kippah',
    'turban',
    // Postures — BROAD tier, strictly like their French counterparts: they are positions ON
    // religion, and the flat fan suits them. A future `selfDeclaredEn` must not move them
    // back up.
    'atheist',
    'atheism',
    'agnostic',
    'agnosticism',
    // Generics.
    'spirituality',
    'interfaith',
    'place of worship',
  ],
  // Cultural-polysemous (« belle église romane » = tourism) → broad tag + « curiosité » fan.
  // EXCLUDED after FP survey (PANO-72, threshold 1) — off-domain collisions too massive, not
  // multi-interpretability but noise: « voile » (boat), « temple » (« mal aux temples » /
  // tourism / game), « pasteur » (Institut/Louis Pasteur, place names), « baptême » (« baptême de
  // l'air / du feu »). Practice stays captured by the self-declarations and the subject vocabulary.
  indirectColloquial: [
    'eglise',
    'bible',
    'communion',
    'la mecque',
    'hamdoulah',
    'alhamdulillah',
    'starfoullah',
    'bismillah',
  ],
  // SUBJECT label — this module's header had always said it in these words; the flag finally
  // gives it an effect (ADR-0003, *The state and the subject*). Negation degrades instead of suppressing.
  //
  // It is what the PRACTICE ↔ CRITICISM axis was missing, ratified in the catalogue and yet mute on one
  // side: « je ne crois pas en dieu » tagged nothing where « je crois en dieu » set a named
  // finding. Selective silence is a disguised judgment (ADR-0003, *The uncertainty*) — this one was
  // delivered. It remains that the criticism of religion as an IDEA, without subject vocabulary, is
  // still tagged nowhere: this module's original boundary holds.
  subjectNotState: true,
  includeColloquial: true,
  indirectThreshold: 1,
};
