// Interest lexicon `ia` (D2, PANO-76 batch 1, DEEP rewrite) — artificial intelligence.
//
// ── Genericity (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Common vocabulary of FR AI: concepts, sub-domains, named consumer tools. FR-first
// (PANO-35 debt); anglicisms kept only if LEXICALIZED. Blind.
//
// ── Recall method — tiers (the heart of the risk, PANO-74) ─────────────────────────────────────
//   · SOLO — unequivocal: « intelligence artificielle », « chatgpt », « midjourney »,
//     « machine learning », « reseau de neurones », « modele de langage ».
//   · ANCHORED — « prompt » (prompt/quick), « modele » (fashion model), « gpt » (bare), « llm », « agent »:
//     count near an AI companion. Co-occurrence RECOVERS these 50/50 instead of discarding them.
//   · EXCLUDED without exception — model names that are common words/first names: « claude »,
//     « opus », « fable », « gemini », « mistral », and bare « ia » (2 letters). Even anchored, too much
//     noise (a first name + a common word co-occur too easily).
//
// ── Boundary ───────────────────────────────────────────────────────────────────────────────────
// Not sensitive. DISTINCT from « tech » (separate, broader theme).

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
    // Tools & jargon (retrofit PANO-90) — « claude »/« opus »/« fable » stay EXCLUDED (first names/common
    // words, cf. batch 1); « hallucination » stays REMOVED (brushed the psychiatric).
    'dall e',
    'perplexity ai',
    'hugging face',
    'fine tuning',
    'reseau de neurones convolutif',
    'apprentissage par renforcement',
    'ia open source',
  ],
  anchored: [
    'prompt', // « prompt » (quick) vs AI prompt
    'modele', // fashion model / scale model vs AI model
    'gpt', // bare vs chatgpt
    'llm', // abbreviation
    'agent', // AI agent vs agent (person)
    'entrainement', // model training vs sport
    'inference', // AI inference vs general logic
    'gemini', // AI tool vs astrological sign
    'copilot', // AI tool vs copilot
    'rag', // AI technique vs rag
    'token', // AI token vs generic token
    'dataset', // dataset (EN) vs generic — anchored (PANO-88)
  ],
};
