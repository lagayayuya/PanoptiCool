// Lexique d'intérêt `crypto` (D2, PANO-76 lot 1, réécriture PROFONDE) — cryptomonnaies.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la crypto FR : actifs nommés (publics, datés), infrastructure, pratiques.
// À l'aveugle depuis l'usage commun ; entités enrichies par recherche PUBLIQUE (top market cap).
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — non équivoques : « bitcoin », « ethereum », « blockchain », « cryptomonnaie »,
//     « altcoin », « staking », « binance », coins univoques (« solana », « cardano », « dogecoin »).
//   · ANCRÉ — coins/termes homographes RÉCUPÉRÉS par co-occurrence : « defi » (= « défi » !),
//     « pepe » / « shiba » / « tron » / « polygon » / « avalanche » (mèmes/mots courants), « wallet »,
//     « ledger », « token », « minage » : ne comptent qu'avec un compagnon crypto.
//   · EXCLU — « crypto » nu (préfixe « cryptique/crypté »).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. Le TRADING spéculatif / jeux d'argent restent hors-champ (PANO-74) : on capte
// l'intérêt techno/actifs, pas l'incitation au pari (aucun « x100 », « gain garanti », « cote »).

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
    // Jargon & plateformes (rétrofit PANO-90)
    'hodl',
    'nft',
    'memecoin',
    'seed phrase',
    'trezor',
    'cold wallet',
    'bull run',
    'airdrop crypto',
    'layer 2',
    // Variantes EN (PANO-88) : SOLO univoque.
    'rug pull',
  ],
  anchored: [
    'defi', // = « défi » (challenge) une fois normalisé — RÉCUPÉRÉ par co-occurrence
    'wallet', // anglais générique
    'ledger', // grand livre comptable / marque
    'token', // jeton générique
    'minage', // extraction minière
    'mining', // idem anglais
    'pepe', // mème / prénom
    'shiba', // race de chien
    'tron', // film
    'polygon', // géométrie
    'avalanche', // neige
    'tether', // « tether » (attacher) anglais
    'eth', // abréviation courte
    'xrp', // court, mais univoque en contexte → ancré par prudence
    'shill', // promotion intéressée vs anglais (EN, ancré)
    'moon', // « to the moon » vs lune (EN)
  ],
};
