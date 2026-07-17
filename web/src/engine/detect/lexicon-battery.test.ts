// Batterie adverse sur le LEXIQUE RÉEL ENRICHI (PANO-36) — exercice des filtres contextuels et des
// tolérances de variation avec les vrais lexiques câblés (`WIRED_LEXICONS`), pas des factices.
// Chaque cas vérifie qu'un enrichissement dense ne fait PAS tagger faux. Phrases 100 %
// SYNTHÉTIQUES, inventées ici, jamais tirées d'un export réel (discipline PANO-70 §3).

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon';
import { detectLabels } from './detect';

/** Labels détectés (triés) sur une liste de commentaires synthétiques. */
function labels(...texts: string[]): string[] {
  return detectLabels(texts, WIRED_LEXICONS)
    .map((d) => d.label)
    .sort();
}

describe('batterie adverse — négation', () => {
  it('« je fais pas de dépression » → mental_health NON tagué (négation avant le marqueur)', () => {
    expect(labels('je fais pas de depression en ce moment')).toEqual([]);
  });
});

describe('batterie adverse — citation / discours rapporté', () => {
  it('terme en discours rapporté → non tagué (attribué à autrui)', () => {
    expect(labels('il parait que la therapie et le psy ca aide vraiment')).toEqual([]);
  });
});

describe('batterie adverse — 3ᵉ personne (dégradation, jamais suppression)', () => {
  it('détresse d’un proche, répétée → mental_health INDIRECT (signal-sans-vécu, tagué quand même)', () => {
    const out = detectLabels(
      ['la depression de mon fils m’inquiete', 'je cherche un psy pour mon fils'],
      WIRED_LEXICONS,
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.label).toBe('mental_health');
    expect(out[0]?.stage).toBe('indirect'); // jamais nommé sur autrui (B3)
  });

  // Faille comblée (« ma mère »/« mon père » absents de THIRD_PERSON) : sans le filtre, ce terme
  // EXPLICITE appliqué à un tiers nommait l'utilisateur à la place de sa mère — B3 fuyait.
  // Deux items dégradés (comme le golden « mon fils » ci-dessus) : un seul item dégradé en indirect
  // reste sous `indirectThreshold` (2) et ne produit AUCUN insight — ce n'est pas la fuite testée ici
  // (elle serait invisible, pas nommée à tort), donc deux items, comme le reste de la batterie.
  it('« la dépression de ma mère » → mental_health INDIRECT, JAMAIS nommé (faille comblée)', () => {
    const out = detectLabels(
      ['la depression de ma mere m’inquiete beaucoup', 'je cherche un psy pour ma mere'],
      WIRED_LEXICONS,
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.label).toBe('mental_health');
    expect(out[0]?.stage).toBe('indirect');
  });

  it('contrôle : « j’ai une dépression » (vécu propre) → mental_health EXPLICIT (rappel intact)', () => {
    const out = detectLabels(['j’ai une depression en ce moment'], WIRED_LEXICONS);
    expect(out).toHaveLength(1);
    expect(out[0]?.label).toBe('mental_health');
    expect(out[0]?.stage).toBe('explicit');
  });

  it('mêmes garanties sur le reste de la famille ajoutée (père, parents, grand-parents, oncle/tante, cousin·e, mec/meuf/ex)', () => {
    const proches = [
      'mon pere',
      'mes parents',
      'ma grand mere',
      'mon grand pere',
      'ma mamie',
      'mon papy',
      'mon oncle',
      'ma tante',
      'mon cousin',
      'ma cousine',
      'mon mec',
      'ma meuf',
      'mon ex',
    ];
    for (const proche of proches) {
      const out = detectLabels(
        [`la depression de ${proche} m’inquiete`, `je cherche un psy pour ${proche}`],
        WIRED_LEXICONS,
      );
      expect(out, proche).toHaveLength(1);
      expect(out[0]?.stage, proche).toBe('indirect');
    }
  });
});

describe('batterie adverse — auto-censure et allongement (machinerie)', () => {
  it('insulte auto-censurée ciblée → conflictual, surface = forme masquée tapée', () => {
    const out = detectLabels(["t'es qu'une grosse c*nne"], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['conflictual']);
    expect(out[0]?.items[0]?.surfaces).toContain('c*nne');
  });

  it('insulte allongée ciblée → conflictual, surface = forme allongée', () => {
    const out = detectLabels(["t'es vraiment un abruuuuti"], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['conflictual']);
    expect(out[0]?.items[0]?.surfaces).toContain('abruuuuti');
  });

  it('pluriel : « fachos » / « gauchistes » comptent comme leurs singuliers (politics)', () => {
    // Deux items de registre opinion → seuil indirect 2 atteint.
    expect(labels('encore ces fachos au pouvoir', 'et tous ces gauchistes')).toEqual(['politics']);
  });
});

describe('batterie adverse — polysémie (seuil protège)', () => {
  it('« déprime » économique isolé → mental_health NON tagué (1 hit colloquial < seuil 2)', () => {
    expect(labels('le marche est en pleine deprime ces temps-ci')).toEqual([]);
  });

  it('« toc » polysémique isolé → mental_health NON tagué (colloquial, 1 hit < seuil 2)', () => {
    // Anti-régression : « toc » a été descendu d'explicit en colloquial (PANO-36) — un « toc toc »
    // ou « du toc » isolé ne doit plus jamais tagger une condition nommée.
    expect(labels('toc toc qui est la derriere la porte')).toEqual([]);
    expect(labels("c'est du toc ce sac soi-disant en cuir")).toEqual([]);
  });
});

describe('batterie adverse — conflictual = agression de PERSONNES', () => {
  it('juron sans cible → conflictual NON tagué', () => {
    expect(labels('quel bouffon ce scenario de film')).toEqual([]);
  });

  it('critique d’idée non politique (insulte sur une chose) → tagué NULLE PART', () => {
    expect(labels('cette blague est vraiment debile')).toEqual([]);
  });
});

describe('batterie adverse — opinion politique va bien en POLITICS (pas conflictual)', () => {
  it('jugement de catégorie répété → politics indirect, jamais conflictual', () => {
    const out = detectLabels(
      ['ce parti est un ramassis de fascistes', 'quelle bande de corrompus au sommet'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['politics']);
    expect(out[0]?.stage).toBe('indirect');
  });

  it('auto-déclaration 1ʳᵉ personne → politics EXPLICIT (via le pattern PANO-72)', () => {
    const out = detectLabels(['perso je suis de gauche et je milite'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['politics']);
    expect(out[0]?.stage).toBe('explicit');
  });
});

// ─── Passe 2 : health_physical / sexuality / religion (PANO-72) ─────────────────────────────────

describe('batterie adverse — health_physical (piège des hyperboles de fatigue)', () => {
  it('hyperboles « crevé / claqué / mort » → NON taguées (exclues du lexique)', () => {
    expect(
      labels('je suis mort de fatigue', 'chui claque apres le taf', 'trop creve ce soir'),
    ).toEqual([]);
  });

  it('condition nommée à soi → health_physical explicit', () => {
    const out = detectLabels(['je vis avec mon diabete au quotidien'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['health_physical']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('parcours de soin répété → health_physical indirect (seuil 2)', () => {
    expect(labels('rdv chez le cardiologue demain', 'encore une prise de sang ce matin')).toEqual([
      'health_physical',
    ]);
  });

  it('condition d’un proche → indirect (signal-sans-vécu, jamais nommé) ', () => {
    const out = detectLabels(
      ['le diabete de mon fils me stresse', "j'accompagne mon fils a l'hopital"],
      WIRED_LEXICONS,
    );
    expect(out.find((d) => d.label === 'health_physical')?.stage).toBe('indirect');
  });
});

describe('batterie adverse — sexuality (seuil 1, coût outing)', () => {
  it('auto-déclaration → sexuality explicit (nommé)', () => {
    const out = detectLabels(['je suis lesbienne et fière de l’être'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['sexuality']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('identité NUE (3ᵉ personne) → indirect, jamais nommé (règle catalogue)', () => {
    const out = detectLabels(['cette actrice est ouvertement lesbienne'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['sexuality']);
    expect(out[0]?.stage).toBe('indirect');
  });

  it('« arc-en-ciel » météo → non tagué (exclusion assumée, coût outing)', () => {
    expect(labels('quel bel arc-en-ciel après l’orage')).toEqual([]);
  });

  it('collision hors-domaine « un pan de mur » → non tagué (sondage FP PANO-72)', () => {
    expect(labels('je suis un pan de ce grand mur en ruine')).toEqual([]);
  });
});

describe('batterie adverse — religion (label de SUJET, décision D)', () => {
  it('appartenance déclarée → religion explicit', () => {
    const out = detectLabels(['je suis musulman et pratiquant'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['religion']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('« église » culturelle → religion indirect (multi-interprétabilité, pas un bug)', () => {
    const out = detectLabels(['magnifique église romane dans ce village'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['religion']);
    expect(out[0]?.stage).toBe('indirect'); // l'éventail §5 porte la lecture « curiosité »
  });

  it('interjection lexicalisée « wallah » → NON taguée (exclue : sociolecte, pas religion)', () => {
    expect(labels('wallah je te jure c’est vrai')).toEqual([]);
  });

  it('collisions hors-domaine → NON taguées (sondage FP PANO-72, anti-régression)', () => {
    expect(labels('je fais de la voile ce week-end')).toEqual([]); // voile = bateau
    expect(labels('jai mal aux temples ce matin')).toEqual([]); // temples = anatomie
    expect(labels("visite de l'institut pasteur demain")).toEqual([]); // pasteur = toponyme
    expect(labels("mon bapteme de l'air était génial")).toEqual([]); // baptême = première fois
  });

  it('insulte anti-croyant ciblée → conflictual, jamais religion', () => {
    const out = detectLabels(["t'es qu'un bigot arriéré"], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['conflictual']);
  });
});
