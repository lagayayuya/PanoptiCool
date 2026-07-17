// Lexique d'intérêt `ia` (D2, PANO-76 lot 1, réécriture PROFONDE) — intelligence artificielle.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant de l'IA FR : concepts, sous-domaines, outils grand public nommés. FR-first
// (dette PANO-35) ; anglicismes gardés seulement s'ils sont LEXICALISÉS. À l'aveugle.
//
// ── Méthode recall — tiers (le cœur du risque, PANO-74) ────────────────────────────────────────
//   · SOLO — non équivoques : « intelligence artificielle », « chatgpt », « midjourney »,
//     « machine learning », « reseau de neurones », « modele de langage ».
//   · ANCRÉ — « prompt » (rapide), « modele » (mannequin), « gpt » (nu), « llm », « agent » :
//     comptent près d'un compagnon IA. La co-occurrence RÉCUPÈRE ces 50/50 au lieu de les jeter.
//   · EXCLU sans exception — noms de modèles qui sont des mots/​prénoms courants : « claude »,
//     « opus », « fable », « gemini », « mistral », et « ia » nu (2 lettres). Même ancrés, trop de
//     bruit (un prénom + un mot courant co-occurrent trop facilement).
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible. DISTINCT de « tech » (thème séparé, plus large).

import type { InterestLexicon } from '../types';

export const IA_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'ia',
  themeLabel: 'theme.ia.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.ai-tools', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'intelligence artificielle',
    'ia generative',
    'apprentissage automatique',
    'apprentissage profond',
    'reseau de neurones',
    'reseaux de neurones',
    'modele de langage',
    'chatgpt',
    'midjourney',
    'stable diffusion',
    'machine learning',
    'deep learning',
    'prompt engineering',
    'traitement du langage naturel',
    'vision par ordinateur',
    'image generee par ia',
    'assistant ia',
    'modele generatif',
    'reseau antagoniste',
    // Outils & jargon (rétrofit PANO-90) — « claude »/« opus »/« fable » restent EXCLUS (prénoms/mots
    // courants, cf. lot 1) ; « hallucination » reste RETIRÉ (frôlait le psychiatrique).
    'dall e',
    'perplexity ai',
    'hugging face',
    'fine tuning',
    'reseau de neurones convolutif',
    'apprentissage par renforcement',
    'ia open source',
  ],
  anchored: [
    'prompt', // « prompt » (rapide) vs invite IA
    'modele', // mannequin / modèle réduit vs modèle IA
    'gpt', // nu vs chatgpt
    'llm', // abréviation
    'agent', // agent IA vs agent (personne)
    'entrainement', // entraînement de modèle vs sport
    'inference', // inférence IA vs logique générale
    'gemini', // outil IA vs signe astrologique
    'copilot', // outil IA vs copilote
    'rag', // technique IA vs chiffon
    'token', // jeton IA vs jeton générique
    'dataset', // jeu de données (EN) vs générique — ancré (PANO-88)
  ],
};
