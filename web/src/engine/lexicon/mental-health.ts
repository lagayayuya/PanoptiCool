// Lexique `mental_health` (PANO-71 graine → PANO-36 enrichi). Enrichissement par champs lexicaux
// structurés (variantes, registres, périphrases), incluant le champ « mal-être ado / registre
// parent » nommé par PANO-36.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Tous registres du FR courant de la santé mentale, écrits À L'AVEUGLE depuis l'usage commun,
// JAMAIS depuis un export réel :
//   · soutenu / clinique : vocabulaire diagnostique usuel (dépression, trouble anxieux, tdah) ;
//   · courant : soin et suivi (psy, thérapeute, antidépresseurs), noms de médicaments répandus
//     (générique : ce sont des produits du domaine public, pas des personnes) ;
//   · familier / argot d'internet : mal-être exprimé sans terme clinique (« au fond du trou »,
//     « je craque », « en mode survie », « psychoter »).
// Chaque terme est défendable pour un inconnu, justifiable par l'usage générique du français, et
// aurait été écrit à l'identique sans avoir jamais vu aucun export.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// Entrées en forme NORMALISÉE (minuscules, sans accents ; le tiret vaut espace, machinerie).
// Les VARIANTES MÉCANIQUES ne se listent PAS : allongements (« déprimeee »), auto-censure et
// pluriels sont couverts par la machinerie (detect.ts, PANO-36 phase 0). Ici, vocabulaire réel only.
// Calibrage ratifié PANO-33 : seuil indirect 2, colloquial inclus (on ne masque pas le polysémique).

import type { TopicalLexicon } from './types';

export const MENTAL_HEALTH_LEXICON: TopicalLexicon = {
  kind: 'topical',
  label: 'mental_health',
  // Lectures du registre §5 : vécu personnel · préoccupation pour un proche · curiosité.
  readingTemplateIds: [
    'sensitive.mental-health.reading.lived',
    'sensitive.mental-health.reading.relative',
    'sensitive.mental-health.reading.curiosity',
  ],
  // Terme clinique / de détresse nommé, appliqué à soi → tag nommé (B2).
  explicit: [
    'depression',
    'anxiete',
    'burn out',
    'burnout',
    'idees noires',
    'depression nerveuse',
    'angoisse',
    "crise d'angoisse",
    'crise de panique',
    'attaque de panique',
    'trouble anxieux',
    'anxiete generalisee',
    'phobie sociale',
    'agoraphobie',
    'bipolaire',
    'borderline',
    'schizophrene',
    'schizophrenie',
    'tdah',
    'ptsd',
    'stress post traumatique',
    'anorexie',
    'anorexique',
    'boulimie',
    'boulimique',
    'tca',
    'depression post partum',
    // Détresse vitale : LOCUTIONS littérales seulement (« me tuer » omis, décision yuya — trop de FP
    // sur l'hyperbole « ça me tue » / « ce projet va me tuer »).
    'automutilation',
    'scarification',
    'idees suicidaires',
    'suicidaire',
    "envie d'en finir",
    'envie de mourir',
    'je veux mourir',
    'me suicider',
    'mettre fin a mes jours',
    'en finir avec la vie',
  ],
  // Étiquettes d'état AUTO-DÉCLARÉES (« je suis dépressif », « jsuis un pauvre anxieux ») — via le
  // pattern d'auto-déclaration (PANO-72). Adjectifs trop polysémiques nus (« temps dépressif »,
  // « film dépressif ») : la copule les rend fiables et capte le registre auto-dépréciatif.
  selfDeclared: [
    'depressif',
    'depressive',
    'anxieux',
    'anxieuse',
    'hypersensible',
    'insomniaque',
    'en depression',
    'en burn out',
  ],
  // Soin/suivi + mal-être sans condition nommée → signal fort mais tag LARGE (jamais nommé, B3).
  indirectCore: [
    'psy',
    'therapie',
    'mal etre',
    "j'en peux plus",
    'jpeux plus',
    'psychologue',
    'psychiatre',
    'psychotherapie',
    'therapeute',
    'suivi psy',
    'rendez vous psy',
    'antidepresseurs',
    'antidepresseur',
    'anxiolytiques',
    'anxiolytique',
    'somniferes',
    'en hp',
    // Médicaments nommés (décision yuya) : génériques (produits du domaine, pas des personnes),
    // registre réel du soin.
    'xanax',
    'lexomil',
    'prozac',
    'sante mentale',
    'a bout',
    'a bout de nerfs',
    'plus gout a rien',
    'envie de rien',
    'pas le moral',
    'le moral a zero',
    'epuise moralement',
    'epuisement',
    'detresse',
    'insomnies',
    'nuits blanches',
    'crise de larmes',
    // Champ « mal-être ado / registre parent » (PANO-36) — le filtre 3ᵉ personne le dégrade
    // naturellement (chemin signal-sans-vécu, B3).
    'se renferme',
    'phobie scolaire',
    'ne veut plus sortir',
  ],
  // Familier / argot — polysémique assumé (le foyer recall/FP).
  indirectColloquial: [
    // « toc » (TOC) : en colloquial et non explicit (vérifié empiriquement PANO-36 — « toc toc »,
    // « du toc » taguaient une condition NOMMÉE à tort). Le seuil 2 exige la répétition ; le vrai
    // signal TOC répété reste capté en large. Décision yuya.
    'toc',
    'deprime',
    'deprimee',
    'cafard',
    'blues',
    'je craque',
    'au fond du trou',
    'en mode survie',
    'decroche',
    'peter un cable',
    'pete un cable',
    'craquage',
    'au bout de ma vie',
    'plus la force',
    'a plat',
    'dans le mal',
    'broyer du noir',
    'en depress',
    'je flippe',
    'psychoter',
    'je sature',
  ],
  includeColloquial: true,
  indirectThreshold: 2,
};
