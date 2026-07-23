// Interest lexicon `crypto` (D2, PANO-76 batch 1, DEEP rewrite) — cryptocurrencies.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR crypto: named assets (public, dated), infrastructure, practices.
// Blind from common usage; entities enriched by PUBLIC research (top market cap).
//
// ── Recall method — tiers ──────────────────────────────────────────────────────────────────────
//   · SOLO — unequivocal: « bitcoin », « ethereum », « blockchain », « cryptomonnaie »,
//     « altcoin », « staking », « binance », univocal coins (« solana », « cardano », « dogecoin »).
//   · ANCHORED — homograph coins/terms RECOVERED by co-occurrence: « defi » (= « défi »!),
//     « pepe » / « shiba » / « tron » / « polygon » / « avalanche » (memes/common words), « wallet »,
//     « ledger », « token », « minage »: count only with a crypto companion.
//   · EXCLUDED — bare « crypto » (prefix « cryptique/crypté »).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. Speculative TRADING / gambling stay out of scope (PANO-74): we capture
// the tech/asset interest, not the incitement to bet (no « x100 », « gain garanti », « cote »).

import type { InterestLexicon } from '../types';

export const CRYPTO_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'crypto',
  themeLabel: 'theme.crypto.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.crypto-platforms', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'bitcoin',
    'btc',
    'ethereum',
    'blockchain',
    'cryptomonnaie',
    'crypto monnaie',
    'altcoin',
    'stablecoin',
    'staking',
    'binance',
    'coinbase',
    'metamask',
    'satoshis',
    'halving',
    'web3',
    'minage de bitcoin',
    'portefeuille crypto',
    'solana',
    'cardano',
    'dogecoin',
    'litecoin',
    'monero',
    'smart contract',
    // Jargon & platforms (retrofit PANO-90)
    'hodl',
    'nft',
    'memecoin',
    'seed phrase',
    'trezor',
    'cold wallet',
    'bull run',
    'airdrop crypto',
    'layer 2',
    // EN variants (PANO-88): SOLO univocal.
    'rug pull',
  ],
  anchored: [
    'defi', // = « défi » (challenge) once normalized — RECOVERED by co-occurrence
    'wallet', // generic English
    'ledger', // accounting ledger / brand
    'token', // generic token
    'minage', // mining (ore extraction)
    'mining', // same in English
    'pepe', // meme / first name
    'shiba', // dog breed
    'tron', // film
    'polygon', // geometry
    'avalanche', // snow
    'tether', // « tether » (to tie) English
    'eth', // short abbreviation
    'xrp', // short, but univocal in context → anchored out of caution
    'shill', // interested promotion vs English (EN, anchored)
    'moon', // « to the moon » vs moon (EN)
  ],
};
