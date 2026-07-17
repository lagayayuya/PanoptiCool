// Lexique d'intérêt `kpop` (D2, PANO-76 lot 1, réécriture PROFONDE) — pop coréenne + fandom.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de la K-pop FR : genre, groupes emblématiques (entités publiques enrichies par
// recherche), culture de fandom. À l'aveugle depuis l'usage commun.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — univoques : « kpop », « korean pop », « blackpink », « stray kids », « enhypen »,
//     « aespa », « newjeans », « nmixx », « ateez », « itzy », « le sserafim », « hallyu »,
//     « lightstick », « fanchant ».
//   · ANCRÉ — noms de groupes qui sont des mots courants → RÉCUPÉRÉS par co-occurrence : « twice »
//     (anglais), « seventeen » (nombre), « ive » (« I've »), « treasure » (anglais), « comeback »,
//     « bias », « idole », « fandom » : comptent près d'un compagnon kpop.
//   · EXCLU — « bts » (= diplôme brevet de technicien supérieur), même ancré (co-occurre trop
//     facilement avec « comeback »/« idole » dans un contexte étudiant ? non — mais le risque
//     diplôme reste ; décision de prudence, EXCLU).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT des autres thèmes musique (rap, électro — thèmes séparés).

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
    // Agences, groupes & jargon (rétrofit PANO-90) — « bts » reste EXCLU (homonyme du diplôme).
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
    'twice', // anglais « twice »
    'seventeen', // nombre
    'ive', // « I've »
    'treasure', // anglais « treasure »
    'comeback', // retour générique
    'bias', // biais / anglais
    'idole', // idole générique
    'fandom', // fandom générique
    'maknae', // niche mais univoque → ancré par prudence de volume
    'sm', // agence SM vs sigle / initiales
    'yg', // agence YG vs initiales
    'nct', // groupe vs sigle
    'stan', // fan inconditionnel (EN) vs prénom / Eminem (ancré, PANO-88)
  ],
};
