// Lexique `politics` (PANO-71 graine → PANO-36 enrichi) — TROIS registres distincts (décision yuya) :
//   1. auto-déclaration (1ʳᵉ personne : « je vote », « je suis de gauche ») → explicit ;
//   2. thématique (vocabulaire de la vie politique : « manif », « réforme ») → indirectCore ;
//   3. opinion / jugement porté (catégories péjoratives : « facho », « gaucho », « corrompu ») →
//      indirectCore. C'est le registre le plus courant en commentaires, et là que « fasciste »
//      revit — correctement classé politics (avis / engagement), PAS conflictual.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Vocabulaire civique et ARGOT POLITIQUE COURANT DU FR EN LIGNE, écrit à l'aveugle depuis l'usage
// commun, jamais depuis un export :
//   · soutenu : institutions et procédures (assemblée nationale, motion de censure, référendum) ;
//   · courant : thèmes et acteurs génériques (manif, syndicat, député, pouvoir d'achat) ;
//   · argot / péjoratif politique : insultes de CATÉGORIE ou de CAMP (gaucho, droitard, facho,
//     bourge, beauf, woke, boomer, macroniste…) — GÉNÉRIQUES car elles visent des camps/catégories,
//     JAMAIS des individus nommés (les noms propres sont exclus, décision yuya).
// Frontière tenue : insulter une PERSONNE (cible 2ᵉ pers.) = conflictual ; juger une catégorie/idée
// politique = politics. Chaque terme aurait été écrit à l'identique sans avoir vu aucun export.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// Entrées NORMALISÉES (minuscules, sans accents ; tiret = espace). Variantes mécaniques (pluriels,
// allongements, auto-censure) couvertes par la machinerie. Calibrage PANO-33 : seuil 2, colloquial inclus.

import type { TopicalLexicon } from './types';

export const POLITICS_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'politics',
  // Lectures du registre §5 : engagement / militantisme · avis personnel · curiosité / veille.
  readingTemplateIds: [
    'sensitive.politics.reading.engaged',
    'sensitive.politics.reading.opinion',
    'sensitive.politics.reading.watch',
  ],
  // Locutions/verbes d'engagement à soi, NON copulaires (le pattern d'auto-déclaration, PANO-72,
  // ne couvre que « je suis X » ; ces formes-ci restent des marqueurs nus).
  explicit: [
    'je vote',
    'je milite',
    "j'adhere",
    "j'ai vote",
    'je voterai',
    "j'irai voter",
    'mon parti',
    'ma famille politique',
    'je manifeste',
  ],
  // Étiquettes politiques AUTO-DÉCLARÉES (« je suis de gauche », « chui plutôt anar ») — matchées
  // via le pattern d'auto-déclaration (PANO-72), qui absorbe les variantes contractées et les
  // modificateurs (« je suis un vrai militant ») sans les lister.
  selfDeclared: [
    'de gauche',
    'de droite',
    "d'extreme gauche",
    "d'extreme droite",
    'militant',
    'militante',
    'ecolo',
    'centriste',
    'anarchiste',
    'anar',
    'communiste',
    'socialiste',
    'apolitique',
    'syndique',
    'syndiquee',
    'macroniste',
    'insoumis',
    'insoumise',
    'royaliste',
    'libertaire',
    'marxiste',
    'gaulliste',
    'souverainiste',
    'feministe',
  ],
  indirectCore: [
    // Registre 2 — thématique (vocabulaire de la vie politique).
    'manif',
    'elections',
    'greve',
    'manifestation',
    'petition',
    'reforme',
    'le gouvernement',
    'syndicat',
    'les elus',
    'campagne electorale',
    'scrutin',
    'referendum',
    'abstention',
    'extreme droite',
    'extreme gauche',
    'assemblee nationale',
    'senat',
    'motion de censure',
    'depute',
    'senateur',
    'ministre',
    'premier ministre',
    'president de la republique',
    "pouvoir d'achat",
    'immigration',
    'aller voter',
    'allez voter',
    // Registre 3 — opinion / jugement, catégories péjoratives (JAMAIS de personnes nommées).
    'fasciste',
    'facho',
    'fascisme',
    'dictature',
    'dictateur',
    'totalitaire',
    'autoritaire',
    'propagande',
    'propagandiste',
    'liberticide',
    'corrompu',
    'corruption',
    'a la solde de',
    'gaucho',
    'gocho',
    'gauchiste',
    'droitard',
    'bourge',
    'beauf',
    'woke',
    'wokisme',
    'boomer',
    'bobo',
    'reac',
    'islamo gauchiste',
    'collabo',
    'complotiste',
    'fachosphere',
    'communautariste',
    'mondialiste',
    'souverainiste',
    'nationaliste',
    'populiste',
    'extremiste',
    'macroniste',
    'antivax',
    'anti vax',
  ],
  // Familier — polysémiques hors contexte politique (« vendu ma voiture », « film pourri ») : le
  // seuil 2 + le voisinage font le tri.
  indirectColloquial: [
    'ecologie',
    'on lache rien',
    'la mairie',
    'politise',
    'ecolo',
    'tous pourris',
    'traitre',
    'vendu',
    'pourri',
    'les elites',
    'moutons',
    'coco',
    'assistes',
    'fake news',
    'retraites',
  ],
  includeColloquial: true,
  indirectThreshold: 2,
};
