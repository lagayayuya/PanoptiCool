// Lexique `health_physical` (PANO-72, passe 2) — condition médicale / état de santé physique.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Vocabulaire médical et du soin du FR courant, écrit à l'aveugle depuis l'usage commun, jamais
// depuis un export :
//   · soutenu / clinique : conditions nommées (diabète, endométriose, sclérose en plaques) ;
//   · courant : parcours de soin (ordonnance, analyses de sang, spécialistes, arrêt maladie) ;
//   · familier : périphrases d'état (« cloué au lit », « mal partout », « la crève »).
// PIÈGE PROPRE À CE LABEL (traité) : les hyperboles de fatigue (« crevé », « claqué », « mort »,
// « HS », « je crève de faim ») NE sont PAS des constats de santé — elles sont EXCLUES du lexique.
// Seule « la crève » (locution figée = vraie maladie) entre, distincte de « crevé » (fatigue).
// Chaque terme aurait été écrit à l'identique sans avoir vu aucun export.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// Entrées NORMALISÉES (minuscules, sans accents ; tiret = espace). Variantes mécaniques (pluriel,
// auto-censure, allongement) couvertes par la machinerie. Seuil 2 (calibrage PANO-33), colloquial inclus.

import type { TopicalLexicon } from './types';

export const HEALTH_PHYSICAL_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'health_physical',
  // Lectures du registre §5 (amendé PANO-72 : 3e lecture « proche », alignée sur mental_health).
  readingTemplateIds: [
    'sensitive.health-physical.reading.lived',
    'sensitive.health-physical.reading.relative',
    'sensitive.health-physical.reading.curiosity',
  ],
  // Condition NOMMÉE à soi → tag nommé. Conditions non ambiguës nues + locutions possessives (le
  // mot nu piégé : « cancer » = argot « c'est le cancer » ; « grossesse » d'autrui…).
  explicit: [
    'diabete',
    'asthme',
    'endometriose',
    'fibromyalgie',
    'sclerose en plaques',
    'hypertension',
    'epilepsie',
    'eczema',
    'psoriasis',
    'arthrose',
    'hernie',
    'tumeur',
    'avc',
    'vih',
    'covid long',
    'maladie chronique',
    'douleurs chroniques',
    'anemie',
    'thyroide',
    'migraines chroniques',
    'mon cancer',
    'ma chimio',
    'en chimio',
    'ma maladie',
    'mon handicap',
    'ma grossesse',
    'je suis enceinte',
    'enceinte de',
    'fausse couche',
    'mon operation',
    'je me suis fait operer',
    'mon traitement',
    'sous traitement',
    'en remission',
    'ma sclerose',
    'mon asthme',
    'mon diabete',
    'pma',
    'fiv',
  ],
  // Condition-adjectif revendiquée via copule (« je suis diabétique ») — trop de FP nue.
  selfDeclared: [
    'diabetique',
    'asthmatique',
    'epileptique',
    'seropositif',
    'seropositive',
    'handicape',
    'handicapee',
    'malade chronique',
    'hypocondriaque',
  ],
  // Soin, symptômes, maladies courantes — non ambigus → tag large.
  indirectCore: [
    'symptomes',
    'ordonnance',
    'medecin traitant',
    'chez le medecin',
    'rendez-vous medical',
    'aux urgences',
    'hopital',
    'hospitalise',
    'hospitalisee',
    'analyses de sang',
    'prise de sang',
    'glycemie',
    'tension arterielle',
    'irm',
    'depistage',
    'vaccin',
    'effets secondaires',
    'kine',
    'kinesitherapeute',
    'dermato',
    'gyneco',
    'cardiologue',
    'oncologue',
    'arret maladie',
    'allergie',
    'allergique',
    'intolerance au gluten',
    'carence en fer',
    'cortisone',
    'antibiotiques',
    'anti-inflammatoires',
    'chimio',
    'dialyse',
    'grippe',
    'gastro',
    'angine',
    'rhume',
    'otite',
    'bronchite',
    'mutuelle',
  ],
  // Familier — polysémique (« malade » = compliment argot ; « la crève » = vraie maladie).
  indirectColloquial: [
    'malade',
    'patraque',
    'la creve',
    'mal partout',
    'cloue au lit',
    'clouee au lit',
    'mal de crane',
    'mal au bide',
    'en vrac',
  ],
  includeColloquial: true,
  indirectThreshold: 2,
};
