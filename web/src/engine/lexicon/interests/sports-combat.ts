// Interest lexicon `sports_combat` (D2, PANO-78 batch 3) — combat sports / martial arts.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR combat sports: disciplines, organizations, moves, fighters.
// Entities = generic public signal enriched by research.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — « mma », « ufc », « muay thai », « jiu jitsu », « kickboxing », « grappling », « octogone »,
//     « taekwondo », fighters (« ngannou », « mcgregor »).
//   · ANCHORED — « combat », « boxe » (verb to box), « cage » (generic), « garde » (generic), « lutte »
//     (struggle, figurative), « jab », « crochet » (crochet), « sambo » (first name): co-occurrence.
//   · EXCLUDED — nothing desperate (vocabulary = disciplines/technical moves).
//
// ── EN variants (PANO-88) — FP survey ──────────────────────────────────────────────────────────
// Anglophone grappling names its SUBMISSIONS; these names exist only there, and carry the domain.
//   · SOLO — « rear naked choke », « armbar », « triangle choke », « kimura », « heel hook »,
//     « kneebar », « darce », « guillotine choke », « omoplata », « berimbolo », « nogi », « bjj »,
//     « takedown », « sprawl », « double leg », « single leg », « ground and pound », « tko », « teep »,
//     « southpaw », « shadowboxing », « heavy bag », « open mat », « osoto gari », « uchi mata », « seoi nage ».
//   · ANCHORED — « guard » (the SECURITY GUARD, and the `basket` point-guard position: the worst term of the domain),
//     « mount » (to mount a shelf, to MOUNT A FILESYSTEM, the mount/hill), « tap » (the faucet;
//     contactless payment), « clinch » (« clinch the title », generic use across all sport),
//     « jab » (= the VACCINE in British English), « submission » (the sending of a form or an
//     article), « choke » (to choke on food; « choked » = cracked under pressure), « belt » (the seat
//     belt, the drive belt), « americana » (the music genre), « roll », « pass »: companion required.
//
// The boundary below holds word for word for these additions: they are named TECHNICAL MOVES.
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive: sporting PRACTICE (discipline, technique), NEVER real aggression (→ `conflictual`,
// D1). No insult or threat marker; the named moves (KO, choke) are discipline
// technical terms, verified by the boundary guard.

import type { InterestLexicon } from '../types';

export const SPORTS_COMBAT_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'sports_combat',
  themeLabel: 'theme.sports-combat.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.combat-sports', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'mma',
    'ufc',
    'muay thai',
    'jiu jitsu bresilien',
    'kickboxing',
    'grappling',
    'octogone',
    'taekwondo',
    'boxe anglaise',
    'boxe thai',
    'karate',
    'judo',
    'krav maga',
    'savate',
    'ngannou',
    'mcgregor',
    'low kick',
    'ceinture noire',
    'sparring',
    'protege dent',
    // EN variants (PANO-88): SOLO univocal — the submission and technique names.
    'rear naked choke',
    'armbar',
    'triangle choke',
    'kimura',
    'heel hook',
    'kneebar',
    'darce',
    'guillotine choke',
    'omoplata',
    'berimbolo',
    'nogi',
    'bjj',
    'takedown',
    'sprawl',
    'double leg',
    'single leg',
    'ground and pound',
    'tko',
    'teep',
    'southpaw',
    'shadowboxing',
    'heavy bag',
    'open mat',
    'osoto gari',
    'uchi mata',
    'seoi nage',
  ],
  anchored: [
    'combat', // combat (figurative / military)
    'boxe', // verb to box
    'cage', // generic cage
    'garde', // generic guard
    'lutte', // struggle, figurative
    'jab', // generic
    'crochet', // crochet / wall hook
    'sambo', // first name vs discipline
    'ko', // figurative KO (« je suis ko »)
    'esquive',
    // EN variants (PANO-88): ANCHORED.
    'guard', // the security guard / the basket point-guard — the worst term of the domain (EN)
    'mount', // to mount a shelf / to mount a filesystem / the mount (EN)
    'tap', // the faucet / contactless payment (EN)
    'clinch', // « clinch the title » — generic use across all sport (EN)
    'jab', // = the vaccine in British English (EN)
    'submission', // sending of a form or an article (EN)
    'choke', // to choke / « choked » = cracked under pressure (EN)
    'belt', // seat belt / drive belt (EN)
    'americana', // the music genre (EN)
    'roll', // the bread roll / « rock and roll » (EN)
    'pass', // to pass an exam / a pass (EN)
  ],
  selfDeclared: ['combattant', 'boxeur', 'pratiquant de mma'],
};
