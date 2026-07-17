// Lexique d'intérêt `sports_combat` (D2, PANO-78 lot 3) — sports de combat / arts martiaux.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant des sports de combat FR : disciplines, organisations, gestes, combattants.
// Entités = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « mma », « ufc », « muay thai », « jiu jitsu », « kickboxing », « grappling », « octogone »,
//     « taekwondo », combattants (« ngannou », « mcgregor »).
//   · ANCRÉ — « combat », « boxe » (verbe boxer), « cage » (générique), « garde » (générique), « lutte »
//     (combat au figuré), « jab », « crochet » (tricot), « sambo » (prénom) : co-occurrence.
//   · EXCLU — rien de désespéré (vocabulaire = disciplines/gestes techniques).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible : PRATIQUE sportive (discipline, technique), JAMAIS l'agression réelle (→ `conflictual`,
// D1). Aucun marqueur d'insulte ou de menace ; les gestes nommés (KO, étranglement) sont des termes
// techniques de discipline, vérifiés par le guard de frontière.

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
  ],
  anchored: [
    'combat', // combat (figuré / militaire)
    'boxe', // verbe boxer
    'cage', // cage générique
    'garde', // garde générique
    'lutte', // combat au figuré
    'jab', // générique
    'crochet', // tricot / crochet mural
    'sambo', // prénom vs discipline
    'ko', // KO figuré (« je suis ko »)
    'esquive',
  ],
  selfDeclared: ['combattant', 'boxeur', 'pratiquant de mma'],
};
