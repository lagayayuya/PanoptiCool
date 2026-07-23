// Interest lexicon `kpop` (D2, PANO-76 batch 1, DEEP rewrite) — Korean pop + fandom.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR K-pop: genre, emblematic groups (public entities enriched by
// research), fandom culture. Blind from common usage.
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — univocal: « kpop », « korean pop », « blackpink », « stray kids », « enhypen »,
//     « aespa », « newjeans », « nmixx », « ateez », « itzy », « le sserafim », « hallyu »,
//     « lightstick », « fanchant ».
//   · ANCHORED — group names that are common words → RECOVERED by co-occurrence: « twice »
//     (English), « seventeen » (number), « ive » (« I've »), « treasure » (English), « comeback »,
//     « bias », « idole », « fandom »: count near a kpop companion.
//   · EXCLUDED — « bts » (= the French BTS diploma), even anchored (does it co-occur too
//     easily with « comeback »/« idole » in a student context? no — but the diploma
//     risk remains; caution decision, EXCLUDED).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from the other music themes (rap, electro — separate themes).

import type { InterestLexicon } from '../types';

export const KPOP_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'kpop',
  themeLabel: 'theme.kpop.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.fandom-merch', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'kpop',
    'k pop',
    'korean pop',
    'blackpink',
    'stray kids',
    'enhypen',
    'aespa',
    'newjeans',
    'nmixx',
    'ateez',
    'itzy',
    'le sserafim',
    'tomorrow x together',
    'hallyu',
    'lightstick',
    'fanchant',
    'comeback kpop',
    'idole k pop',
    'girl group',
    'boys band coreen',
    // Agencies, groups & jargon (retrofit PANO-90) — « bts » stays EXCLUDED (homonym of the diploma).
    'hybe',
    'jyp',
    'riize',
    'zerobaseone',
    'red velvet',
    'bias wrecker',
    'aegyo',
    'kpop stan',
  ],
  anchored: [
    'twice', // English « twice »
    'seventeen', // number
    'ive', // « I've »
    'treasure', // English « treasure »
    'comeback', // generic comeback
    'bias', // bias / English
    'idole', // generic idol
    'fandom', // generic fandom
    'maknae', // niche but univocal → anchored out of volume caution
    'sm', // SM agency vs acronym / initials
    'yg', // YG agency vs initials
    'nct', // group vs acronym
    'stan', // diehard fan (EN) vs first name / Eminem (anchored, PANO-88)
  ],
};
