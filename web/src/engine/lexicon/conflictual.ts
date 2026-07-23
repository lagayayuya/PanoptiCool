// `conflictual` lexicon (PANO-71 seed → PANO-36 enriched) — item-level (B5): the EMITTED insult
// aimed at another user IS the signal; no indirect tier, no fan (PANO-70 §1.4).
// Criticism of an idea NEVER tagged conflictual (decision D); political opinion → politics, not here.
// The boundary is held by the MACHINERY (2nd-person target required + quotation filter), not by
// the words: that is why an aggression term enters ONLY if it targets a person.
//
// ── Genericity justification (PANO-70 §3, §2.5 discipline) ────────────────────────────────────
// Interpersonal insults of everyday FR ONLINE, all registers, written blind from
// common usage, never from an export:
//   · colloquial: abruti, crétin, imbécile, blaireau, guignol;
//   · vulgar: ordure, enfoiré, raclure, salopard;
//   · gendered and ableist slurs (salope, enculé, attardé, mongol…): REAL and massive online —
//     detecting them means showing what a platform reads; the safety lives in the display
//     SCREEN — the finding starts folded, behind a "sensitive" badge (ADR-0003) — not in
//     an amputated lexicon;
//   · INTERPERSONAL homophobic and anti-believer insults (PANO-72): they target a PERSON
//     in the exchange (sexuality/religion → conflictual boundary). The GROUP slur in the absolute
//     enters nowhere (future dedicated label, flagged, never decided alone);
//   · aggression SMS abbreviations (tg, ftg, ntm, fdp).
// All target a PERSON (never an idea, never a group) and enter only paired with a
// 2nd-person target.
// Each term would have been written identically without having seen any export.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// NORMALIZED entries (lowercase, no accents). Self-censoring (« c*nne »), lengthenings
// (« abruuuti ») and plurals are covered by the machinery — never listed here.
//
// ── `targets` carries address CONSTRUCTIONS, never a bare pronoun ──────────────────────────────
// Writing rule for this array, valid for any language admitted here. In French it is moot
// — `toi` addresses only someone. In English the 2nd-person pronoun is ALSO
// the impersonal: « you should get your gland checked » addresses no one, it is advice
// to the world. Measured at EN opening, at identical terms: with bare `you`, 14 innocent English
// items out of 14 tag; with the anchored constructions alone (copula, presentative,
// imperative), 0 out of 14. The same word set goes from "tags everything" to "tags nothing innocent"
// without a line of code changing — that is why this batch introduced NO mechanism.
//
// ── SIX FR ENTRIES REMOVED at EN opening — and why they do not return alone ─────────────────────
// `con`, `clown`, `loser`, `gland`, `tache`, `bigot` matched ORDINARY English: « the pros
// and cons » (the matcher's plural does the rest), « your thyroid gland », « growing a tache »
// (BrE), « being a bigot about this policy ». Four of them are PURE collisions — the
// English word has no relation to the French sense, and no aggression is at stake.
//
// They were INERT as long as `targets` was FR: the AND never found its second member.
// It is the EN targets below that would have ACTIVATED them — the batch was first delivered thus, and
// six false positives lived a few commits on the sole label with no fan of readings. This is the
// lesson not to lose again: under a conjunction, opening the SECOND list activates everything the
// first carried dormant (ADR-0003, *The admission of a term*).
//
// The ablation was rendered rather than assumed (yuya arbitration): accepting a known wrong on a label
// without a net is worth less than losing a recall one can re-measure. What it costs, said
// frankly — the recall is NOT null: « t'es vraiment con », « t'es qu'un clown » and
// « t'es qu'un bigot » are no longer read. `connard`/`conne`/`connasse`/`sale con`, `guignol`,
// `bouffon`, `looser`, `bigote` and `grenouille de benitier` cover the register, never those
// surfaces. And the label being item-level, the finding SURVIVES as soon as a second item of the same
// voice carries another term: the cost concentrates entirely on the voice that insults ONLY
// ONCE, with that word.
//
// The removal is REVERSIBLE and gets re-measured: four sealed voices of aggression and banter (two
// FR, two EN) are being written blind, because this label never had a positive
// control in either language — 17 sealed voices, 476 items, zero `conflictual` finding.
// The day they land, the question that decides is ADR-0003's: *do these terms
// carry a recall that nothing else carries?*
//
// ── What the export does not carry, and what decides here ───────────────────────────────────────
// « you're such an idiot » between friends and the same words aimed at a stranger are the SAME text:
// what separates them is the relationship, which an export comment does not show (it replies to a video
// no one can see). No filter can therefore tell them apart — neither negation, nor quotation,
// nor 3rd person. The answer is not a mechanism, it is a VOLUME: the EN batch is deliberately
// small, and does not admit the colloquial register that friendship uses massively (`idiot`, `dumb`,
// `silly` are NOT admitted in EN — they are the words of banter as much as of attack).
// This bet did NOT suffice, and this label's bench showed it: banter writes the hostile vocabulary,
// and it is the target GUARD that selects it (debt to catalogue §4). The reduced volume limits the
// number of wrongs, it does not change their nature.
// Doctrine: ADR-0003, *The limit the data does not lift*.

import type { ItemLevelLexicon } from './types';

export const CONFLICTUAL_LEXICON: ItemLevelLexicon = {
  kind: 'item-level',
  label: 'conflictual',
  insults: [
    // Colloquial / everyday.
    'abruti',
    'debile',
    'connard',
    'bouffon',
    'conne',
    'connasse',
    'cretin',
    'cretine',
    'idiot',
    'idiote',
    'imbecile',
    'blaireau',
    'tocard',
    'tocarde',
    'guignol',
    'minable',
    'pauvre type',
    'pauvre fille',
    'bon a rien',
    'moins que rien',
    'rate',
    'ratee',
    'naze',
    'nul a chier',
    'nullos',
    'rigolo',
    'mythos',
    'looser',
    'boloss',
    'stupide',
    'teube',
    // Vulgar.
    'grosse merde',
    'sale merde',
    'pauvre merde',
    'sale con',
    'sale conne',
    'ordure',
    'raclure',
    'pourriture',
    'salopard',
    'enfoire',
    'batard',
    // Insulting imperatives (they address by construction — also listed in `targets`).
    'ta gueule',
    'ferme la',
    'va crever',
    'mange tes morts',
    // Gendered slurs (yuya decision: kept).
    'salope',
    'petasse',
    'pouffiasse',
    'encule',
    'fils de pute',
    'nique ta mere',
    // Ableist slurs (yuya decision: kept).
    'attarde',
    'attardee',
    'gogol',
    'mongol',
    // INTERPERSONAL homophobic insults (PANO-72, yuya arbitration: targeting a PERSON in
    // the exchange, gated by the 2nd-person target). The GROUP slur in the absolute enters nowhere
    // (future dedicated label, flagged) — these terms count ONLY paired with an address.
    'pede',
    'tapette',
    'tarlouze',
    'gouine',
    'fiotte',
    // INTERPERSONAL anti-believer insults (same rule: person, not group nor idea).
    // `bigot` (masculine) is REMOVED — homograph of the common English word, cf. the header. The
    // religion → conflictual boundary remains held by the two entries below; it is the masculine
    // surface that is lost, and it is the costliest removal of the six.
    'bigote',
    'grenouille de benitier',
    // Aggression SMS abbreviations.
    'tg',
    'ftg',
    'vtff',
    'fdp',
    'ntm',
    // ── (EN) — the register whose DOMINANT use is AGGRESSION, and it alone ─────────────────────
    // Eleven forms — eight insults and three imperatives — against sixty-eight in FR, by design
    // (cf. the header: banter and aggression are
    // the same utterance). Discarded in the same place, and the exclusion carries the doctrine: bare `dumb`
    // (« dumb luck », self-deprecation), bare `ass`/`arse` (`badass` is a compliment), `sad`
    // (« that is a sad story »), `weirdo`/`creep`/`jerk` (« the creep of the deadline », « you jerk
    // the handle upwards »), `trash`/`garbage`/`mid`/`washed`/`cooked` (they qualify a
    // performance, not a person), `cope`/`seethe`/`ratio`/`touch grass` (playful jousting, and the
    // surface through which POLITICAL invective would enter — named debt), `crazy`/`insane`/
    // `psycho` (intensifiers, and ableist slang). `narcissist` and `schizo` do not enter:
    // disorder name turned generic insult (ADR-0003, *The admission of a term*). `gaslighting`
    // describes a BEHAVIOR, not a person — outside this label's gate. `triggered`
    // WOULD CROSS the gate, and that is exactly why it stays out: it does not distinguish
    // political mockery from aggression, and the mockery was removed from `politics` so as not to
    // land here.
    // The EN homophobic and ableist slurs are OUT of this batch: maximal error cost, an explicit
    // decision due (FR carries them on a named arbitration), unknown EN FP rate. Named debt.
    'stupid',
    // `moron` REMOVED after its first blind measurement: on this label's bench, it fires
    // on NONE of the 26 items of the hostile voice, and once on the affectionate voice, at
    // the NAMED tier. Measured recall null, measured wrong at one — the opposite of what a term should return.
    // `moronic` stays: it qualifies an idea far more than a person, banter does not use it in
    // the same way, and the target guard prevents it from tagging « this take is moronic ». It is
    // however NOT measured — no sealed voice writes it, and this is said rather than presumed.
    'moronic',
    'dumbass',
    'jackass',
    'asshole',
    'arsehole', // dual US/BrE spelling: the matcher does not link them
    'pathetic',
    'braindead',
    // EN insulting imperatives (they address by construction — also listed in `targets`, same
    // precedent as « ta gueule »). Discarded: `stop it`, `leave me alone` — defensive, written by
    // whoever SUFFERS; tagging them would invert the victim and the author.
    'shut up',
    'nobody asked',
    'get lost',
  ],
  // 2nd-person target. The insulting imperatives appear here TOO (the imperative addresses by
  // construction, yuya decision) — without which bare « ta gueule » would never be tagged.
  targets: [
    "t'es",
    'tu es',
    'espece de',
    'degage',
    "t'as",
    'tu as',
    'toi',
    'casse toi',
    'va te faire',
    'va crever',
    'tu connais rien',
    "personne t'a sonne",
    'ta gueule',
    'ferme la',
    'mange tes morts',
    'nique ta mere',
    'tg',
    'ftg',
    'vtff',
    'ntm',
    // ── (EN) — ANCHORED constructions, never the bare pronoun (cf. the rule in the header) ─────
    // Discarded in the same place: bare `you` / `u` / `ur` (the English impersonal — 14/14 innocent
    // items tag); `bro`, `mate`, `bruv`, `y'all` (AFFILIATION vocatives: they mark the
    // bond, and banter uses them infinitely more than aggression); `people like you`,
    // `everyone who` (they address a CLASS, not an interlocutor — the group slur in
    // the absolute enters nowhere, cf. above).
    "you're",
    'youre',
    'you are',
    'ur a',
    'you sound',
    'you look like',
    'shut up',
    'nobody asked',
    'get lost',
  ],
};
