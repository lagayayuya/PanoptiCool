// Tests de la machinerie de détection (PANO-71) — les quatre filtres mesurés PANO-33 + la
// normalisation indexée. Lexiques FACTICES locaux (termes génériques FR inventés pour exercer
// chaque filtre) ; le lexique-graine réel vit dans `engine/lexicon/` et a ses propres goldens.
// Toutes les phrases sont SYNTHÉTIQUES (inventées ici, aucune donnée réelle).

import { describe, expect, it } from 'vitest';
import type { ItemLevelLexicon, TopicalLexicon } from '../lexicon/types';
import { detectLabels } from './detect';
import { normalizeFr, surfaceForm } from './normalize-fr';

/** Lexique topical de test (label arbitraire parmi les 6 ; les termes servent les filtres). */
function topical(overrides: Partial<TopicalLexicon> = {}): TopicalLexicon {
  return {
    kind: 'topical',
    label: 'mental_health',
    readingTemplateIds: ['t.reading.a', 't.reading.b'],
    explicit: ['anxiete', 'idees noires'],
    indirectCore: ['psy', 'therapie', 'manif'],
    indirectColloquial: ['deprime'],
    includeColloquial: true,
    indirectThreshold: 2,
    ...overrides,
  };
}

const CONFLICTUAL: ItemLevelLexicon = {
  kind: 'item-level',
  label: 'conflictual',
  insults: ['bouffon', 'abruti'],
  targets: ["t'es", 'tu es', 'degage'],
};

describe('normalizeFr — normalisation indexée', () => {
  it('minuscules + accents retirés + apostrophe typographique unifiée', () => {
    expect(normalizeFr('J’ai de l’Anxiété').norm).toBe("j'ai de l'anxiete");
  });

  it('surfaceForm re-projette un match du normalisé sur le texte ORIGINAL, au caractère près', () => {
    const t = normalizeFr('Mon Anxiété chronique');
    const start = t.norm.indexOf('anxiete');
    const surface = surfaceForm(t, start, start + 'anxiete'.length);
    expect(surface).toBe('Anxiété');
    expect(t.original.includes(surface)).toBe(true);
  });
});

describe('detectLabels — frontières de mots', () => {
  it('un marqueur ne matche pas À L’INTÉRIEUR d’un mot (« psy » ⊄ « psychologie »)', () => {
    const out = detectLabels(
      ['la psychologie est un domaine', 'un cours de psychologie'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('l’apostrophe est une frontière (« l’anxiete » matche « anxiete »)', () => {
    const out = detectLabels(["mon anxiété m'épuise en ce moment"], [topical()]);
    expect(out[0]?.stage).toBe('explicit');
  });
});

describe('detectLabels — fenêtre de négation', () => {
  it('négation avant le marqueur → hit supprimé', () => {
    const out = detectLabels(
      ['pas de psy pour moi', 'aucune therapie prévue'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('double négation (verbe d’omission + négation) = AFFIRMATION → hit conservé', () => {
    const out = detectLabels(
      ['je rate jamais la manif du samedi'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
  });
});

describe('detectLabels — citation / discours rapporté', () => {
  it('marqueur de citation → attribué à autrui → hit supprimé', () => {
    const out = detectLabels(
      ['parait que la therapie marche bien'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('marqueur entre guillemets → hit supprimé', () => {
    const out = detectLabels(['il a crié « anxiete » sur le plateau'], [topical()]);
    expect(out).toEqual([]);
  });
});

describe('detectLabels — 3ᵉ personne (B3 : dégradé, jamais supprimé)', () => {
  it('terme explicite appliqué à un proche → DÉGRADÉ en indirect (signal-sans-vécu, tagué quand même)', () => {
    const out = detectLabels(
      ["l'anxiété de mon fils m'inquiète beaucoup", 'chercher un psy pour mon fils'],
      [topical()],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
    expect(out[0]?.items.every((i) => i.stage === 'indirect')).toBe(true);
    // La forme de surface reste celle du texte original (accents inclus).
    expect(out[0]?.items[0]?.surfaces).toContain('anxiété');
  });
});

// --- Filtres EN (PANO-35 lot 1) : MIROIR des goldens FR ci-dessus -------------------------------
// Chaque test ci-dessous est le pendant EXACT d'un golden FR, sur les mêmes lexiques factices. Les
// marqueurs restent FR (« anxiete », « psy », « therapie ») : c'est VOULU — le risque réel mesuré
// vient des HOMOGRAPHES FR/EN (« depression », « burnout », « diabetes »), donc d'un marqueur FR
// atteint par une PHRASE EN. On exerce exactement ce chemin, sans rien ajouter aux lexiques D1.

describe('detectLabels — fenêtre de négation EN (miroir du FR)', () => {
  it('négation EN avant le marqueur → hit supprimé', () => {
    const out = detectLabels(
      ['i am not in therapie right now', 'there is no psy involved here'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('contraction EN (« don’t » / « dont ») → hit supprimé', () => {
    const out = detectLabels(
      ["i don't need therapie", 'i dont need a psy'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('« never » → hit supprimé', () => {
    expect(
      detectLabels(['i never had anxiete in my life'], [topical({ indirectThreshold: 1 })]),
    ).toEqual([]);
  });

  it('double négation EN (verbe d’omission + négation) = AFFIRMATION → hit conservé', () => {
    const out = detectLabels(
      ['i never miss my manif on saturday'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
  });
});

describe('detectLabels — citation / discours rapporté EN (miroir du FR)', () => {
  it('marqueur de citation EN → attribué à autrui → hit supprimé', () => {
    const out = detectLabels(
      ['she told me therapie works well', 'apparently the therapie helps a lot'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('PASSIF MÉDICAL EN n’est PAS une citation (même piège qu’en FR) → hit conservé', () => {
    // « i was told i have… » rapporte un diagnostic REÇU, pas les propos d’un tiers sur un tiers.
    const out = detectLabels(['i was told i have anxiete'], [topical()]);
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('explicit');
  });
});

describe('detectLabels — 3ᵉ personne EN (B3 : dégradé, jamais supprimé)', () => {
  it('terme explicite appliqué à un proche EN → DÉGRADÉ en indirect (signal-sans-vécu, tagué quand même)', () => {
    const out = detectLabels(
      ['my sister has anxiete and it worries me', 'looking for a psy for my son'],
      [topical()],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
    expect(out[0]?.items.every((i) => i.stage === 'indirect')).toBe(true);
  });

  it('RÉGRESSION MESURÉE (docs/portabilite-en-filtres.md) : « my sister has X » ne NOMME plus', () => {
    // Avant ce lot, les 3 filtres protecteurs échouaient OUVERT en EN : ce texte produisait un tag
    // `explicit` (= NOMMÉ) sur le locuteur, violant SENS-B3. Il doit rester non-nommé, à jamais.
    const out = detectLabels(['my sister has anxiete'], [topical({ indirectThreshold: 1 })]);
    expect(out[0]?.stage).not.toBe('explicit');
  });
});

describe('detectLabels — conflictual EN (B5) : insulte REÇUE exclue', () => {
  it('« he called me… » (insulte reçue/rapportée) → exclue, comme « il m’a traité de… »', () => {
    expect(detectLabels(['he called me a bouffon in front of everyone'], [CONFLICTUAL])).toEqual(
      [],
    );
  });
});

describe('detectLabels — DETTE assumée : auto-déclaration EN non couverte (PANO-35 lot 2)', () => {
  it('« i am X » ne tague PAS (la copule EN n’est pas livrée) — défaut de RAPPEL, échoue CLOSED', () => {
    // Verrou de la dette : ce test DOIT être inversé le jour où le lot 2 livre les copules EN.
    // Il échoue dans la direction sûre (rien n’est nommé), contrairement aux 3 filtres protecteurs.
    const out = detectLabels(['i am depressif'], [topical({ selfDeclared: ['depressif'] })]);
    expect(out).toEqual([]);
  });
});

describe('detectLabels — conflictual (B5, item-level)', () => {
  it('insulte émise + cible 2ᵉ personne → tag explicite, surfaces = insultes', () => {
    const out = detectLabels(["t'es vraiment qu'un bouffon"], [CONFLICTUAL]);
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('explicit');
    expect(out[0]?.items[0]?.surfaces).toEqual(['bouffon']);
  });

  it('juron sans cible (frustration) → exclu', () => {
    expect(detectLabels(['quel bouffon ce scénario de film'], [CONFLICTUAL])).toEqual([]);
  });

  it('insulte CITÉE (reçue/rapportée) → exclue', () => {
    expect(detectLabels(["il m'a traite de bouffon devant tout le monde"], [CONFLICTUAL])).toEqual(
      [],
    );
  });
});

describe('detectLabels — tolérances de variation (PANO-36 phase 0)', () => {
  it('tiret ↔ espace : une seule entrée couvre les deux graphies', () => {
    const lex = topical({ explicit: ['burn out'], indirectThreshold: 1 });
    expect(detectLabels(['en plein burn-out cette semaine'], [lex])[0]?.stage).toBe('explicit');
    expect(detectLabels(['en plein burn out cette semaine'], [lex])[0]?.stage).toBe('explicit');
  });

  it('auto-censure symbolique : « c*nne » matche « conne », surface = forme masquée tapée', () => {
    const lex: ItemLevelLexicon = {
      kind: 'item-level',
      label: 'conflictual',
      insults: ['conne'],
      targets: ["t'es"],
    };
    const out = detectLabels(["t'es vraiment une c*nne"], [lex]);
    expect(out).toHaveLength(1);
    expect(out[0]?.items[0]?.surfaces).toEqual(['c*nne']);
  });

  it('auto-censure : un mot innocent ne matche pas (pas de symbole ≠ lettre différente)', () => {
    const lex: ItemLevelLexicon = {
      kind: 'item-level',
      label: 'conflictual',
      insults: ['conne'],
      targets: ["t'es"],
    };
    expect(detectLabels(["t'es venue avec ta canne"], [lex])).toEqual([]);
  });

  it('allongement expressif : « abruuuuuti » matche « abruti », surface = forme allongée entière', () => {
    const out = detectLabels(["t'es un abruuuuuti fini"], [CONFLICTUAL]);
    expect(out).toHaveLength(1);
    expect(out[0]?.items[0]?.surfaces).toEqual(['abruuuuuti']);
  });

  it('allongement : le squelette est GARDÉ — sans allongement visible, pas de match squelette', () => {
    // « cône » → squelette « cone » = squelette de « conne », mais aucune répétition ≥ 3 dans la
    // surface → rejeté. Le fallback ne s'ouvre qu'aux allongements réels.
    const lex: ItemLevelLexicon = {
      kind: 'item-level',
      label: 'conflictual',
      insults: ['conne'],
      targets: ["t'es"],
    };
    expect(detectLabels(["t'es sous ce cône de chantier"], [lex])).toEqual([]);
  });

  it('allongement sur marqueur topical : « manifffff » compte comme « manif »', () => {
    const out = detectLabels(['grosse manifffff demain'], [topical({ indirectThreshold: 1 })]);
    expect(out).toHaveLength(1);
    expect(out[0]?.items[0]?.surfaces).toEqual(['manifffff']);
  });

  it('pluriel : un marqueur singulier couvre sa forme au pluriel, sans déborder', () => {
    const lex = topical({
      explicit: ['idee noire'],
      indirectCore: ['manif'],
      indirectThreshold: 1,
    });
    // Pluriel capté…
    expect(detectLabels(['plein de manifs ce mois-ci'], [lex])[0]?.items[0]?.surfaces).toEqual([
      'manifs',
    ]);
    // …mais la frontière de mot tient (« console » ne matche pas « con »).
    const conLex: ItemLevelLexicon = {
      kind: 'item-level',
      label: 'conflictual',
      insults: ['con'],
      targets: ["t'es"],
    };
    expect(detectLabels(["t'es devant ta console de jeu"], [conLex])).toEqual([]);
  });
});

describe('detectLabels — pattern d’auto-déclaration (PANO-72)', () => {
  const lex = topical({
    explicit: [],
    selfDeclared: ['depressif', 'depressive'],
    indirectCore: ['psy'],
    indirectThreshold: 1,
  });

  it('« je suis dépressif » → explicit ; modificateurs intercalés tolérés', () => {
    expect(detectLabels(['je suis depressif'], [lex])[0]?.stage).toBe('explicit');
    expect(detectLabels(['jsuis une grosse depressive'], [lex])[0]?.stage).toBe('explicit');
    expect(detectLabels(['chui un vrai depressif'], [lex])[0]?.stage).toBe('explicit');
  });

  it('surface = le span entier (copule + modificateurs + terme)', () => {
    const out = detectLabels(['je suis un pauvre depressif'], [lex]);
    expect(out[0]?.items[0]?.surfaces).toEqual(['je suis un pauvre depressif']);
  });

  it('négation brise le pattern (« je suis pas dépressif ») → non tagué', () => {
    expect(detectLabels(['je suis pas depressif du tout'], [lex])).toEqual([]);
  });

  it('terme d’auto-déclaration NU (sans copule) ne matche pas via ce champ', () => {
    // « depressif » n'est pas dans explicit/indirect ici → un « film dépressif » ne tague rien.
    expect(detectLabels(['ce film est vraiment depressif'], [lex])).toEqual([]);
  });

  it('auto-déclaration JAMAIS dégradée par une 3ᵉ personne dans le même commentaire', () => {
    // La copule ancre la 1ʳᵉ personne : reste explicit malgré « ma fille ».
    const out = detectLabels(['je suis depressif comme ma fille'], [lex]);
    expect(out[0]?.stage).toBe('explicit');
  });
});

describe('detectLabels — agrégation par label', () => {
  it('sous le seuil indirect → AUCUNE détection (et l’item ne sera jamais une preuve)', () => {
    expect(detectLabels(['je vois un psy demain'], [topical({ indirectThreshold: 2 })])).toEqual(
      [],
    );
  });

  it('seuil indirect atteint → tag indirect portant TOUS les items contributeurs', () => {
    const out = detectLabels(
      ['je vois un psy demain', 'la therapie me fait du bien', 'sujet sans rapport'],
      [topical({ indirectThreshold: 2 })],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
    expect(out[0]?.items.map((i) => i.itemIndex)).toEqual([0, 1]);
  });

  it('≥ 1 item explicite → tag explicite, items = explicites ET indirects (toutes les preuves)', () => {
    const out = detectLabels(['mon anxiété au quotidien', 'je vois un psy demain'], [topical()]);
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('explicit');
    expect(out[0]?.items).toHaveLength(2);
  });

  it('un même item peut alimenter PLUSIEURS labels ; un autre aucun', () => {
    const out = detectLabels(
      ["t'es un abruti et ta manif est ridicule", 'je rentre en manif à vélo'],
      [topical({ label: 'politics', indirectThreshold: 2 }), CONFLICTUAL],
    );
    const labels = out.map((d) => d.label).sort();
    expect(labels).toEqual(['conflictual', 'politics']);
    // L'item 0 contribue aux deux labels ; les surfaces different par label.
    expect(out.find((d) => d.label === 'politics')?.items.map((i) => i.itemIndex)).toEqual([0, 1]);
    expect(out.find((d) => d.label === 'conflictual')?.items.map((i) => i.itemIndex)).toEqual([0]);
  });
});
