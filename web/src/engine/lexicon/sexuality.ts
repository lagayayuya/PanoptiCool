// Lexique `sexuality` (PANO-72, passe 2) — orientation / identité de genre.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Vocabulaire d'orientation et d'identité du FR courant, écrit à l'aveugle depuis l'usage commun
// (incluant les emprunts anglais LEXICALISÉS chez les francophones : « coming out », « wlw »),
// jamais depuis un export. Le label détecte TOUTE orientation/identité, symétriquement — vécu,
// hétéro comme non-hétéro (neutralité §4.3 tenue par la SYMÉTRIE, pas par l'omission).
// FRONTIÈRES tenues :
//   · orientation/identité (le label) ≠ INSULTE à connotation sexuelle visant une personne (→
//     `conflictual`, jamais ici) ;
//   · SLUR d'identité (jamais une auto-désignation) : visant une personne → conflictual ; visant
//     un GROUPE dans l'absolu → futur label dédié, SIGNALÉ, exclu partout pour l'instant ;
//   · règle catalogue « jamais nommer depuis l'indirect » : les identités nues vivent en
//     `indirectCore` (tag large, « cette actrice est lesbienne » reste indirect) ; seul le pattern
//     d'auto-déclaration (« je suis lesbienne ») produit un tag nommé.
// Pas d'emprunt anglais généraliste (dette PANO-35, FR-only v1) : seulement le lexicalisé.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// Entrées NORMALISÉES. Seuil 1 (calibrage PANO-33 — coût outing) : le colloquial est DÉSACTIVÉ
// (à seuil 1, un seul hit colloquial taguerait ; on n'y met donc que du signal communautaire net,
// tout en `indirectCore`). Exclusions assumées (décision yuya) : « arc-en-ciel »,
// « entre filles/meufs » EXCLUS (FP météo/amitié à seuil 1) ; « yuri/yaoi » EXCLUS (fiction).

import type { TopicalLexicon } from './types';

export const SEXUALITY_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'sexuality',
  // Lectures du registre §5 : vécu personnel · allié · curiosité.
  readingTemplateIds: [
    'sensitive.sexuality.reading.lived',
    'sensitive.sexuality.reading.ally',
    'sensitive.sexuality.reading.curiosity',
  ],
  // Auto-référence NON copulaire (locutions) — le tag nommé passe surtout par `selfDeclared`.
  explicit: ['mon coming out', "j'ai fait mon coming out", 'ma transition'],
  // Identités AUTO-DÉCLARÉES (« je suis lesbienne », « chui non binaire ») → tag nommé via pattern.
  // Symétrie : « hétéro » inclus (toute orientation exposée, décision yuya).
  selfDeclared: [
    'gay',
    'lesbienne',
    'bi',
    'bisexuel',
    'bisexuelle',
    'homo',
    'homosexuel',
    'homosexuelle',
    'trans',
    'queer',
    // « pan » nu écarté (sondage FP PANO-72 : « je suis un pan de mur ») — pansexuel(le) suffit.
    'pansexuel',
    'pansexuelle',
    'non binaire',
    'enby',
    'asexuel',
    'asexuelle',
    'ace',
    'aro',
    'hetero',
    'en transition',
  ],
  // Intérêt communautaire + identités nues → tag LARGE (jamais nommé, B1). Emprunts lexicalisés
  // seulement (wlw). « mlm » écarté (polysémie « multi-level marketing » massive).
  indirectCore: [
    'lgbt',
    'lgbtq',
    'lgbtqia',
    'queer',
    'pride',
    'marche des fiertes',
    'fiertes',
    'coming out',
    'gay',
    'lesbienne',
    'bisexuel',
    'bisexuelle',
    'pansexuel',
    'asexuel',
    'non binaire',
    'transgenre',
    'transidentite',
    'bisexualite',
    'homosexualite',
    'orientation sexuelle',
    'identite de genre',
    'sapphique',
    'saphique',
    'drag queen',
    'homophobie',
    'homophobe',
    'transphobie',
    'transphobe',
    'sortir du placard',
    'wlw',
  ],
  // Colloquial DÉSACTIVÉ (seuil 1 + coût outing) : aucun terme polysémique admis en un seul hit.
  indirectColloquial: [],
  includeColloquial: false,
  indirectThreshold: 1,
};
