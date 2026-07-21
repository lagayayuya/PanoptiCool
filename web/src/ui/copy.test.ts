// Témoins des phrases COMPTÉES du catalogue, au SINGULIER.
//
// POURQUOI CE FICHIER EXISTE, alors que deux goldens rendent déjà ces surfaces : les goldens rendent
// des volumes RÉALISTES, donc toujours pluriels. Ils sont restés verts pendant que « 1 items laissés
// de côté » s'affichait — la forme fautive n'était sur le chemin d'aucun rendu. Un filet ne prouve
// que ce qu'il atteint ; ces cas-là se fixent donc à l'appel, pas au rendu.
//
// Le français met ZÉRO au singulier — c'est la moitié des cas testés ici, et celle qu'un `n > 1`
// écrit à la main rate silencieusement.
//
// ─── CE QUE CE FILET NE COUVRE PAS ──────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md. Ce fichier existe précisément parce qu'un autre filet avait un angle
// mort ; le sien est l'exact symétrique.
//   - IL N'ATTEINT PAS L'ÉCRAN. Il appelle des fonctions du catalogue. Que la phrase soit RENDUE,
//     au bon endroit, avec les bons espaces autour, relève des goldens — l'aplatissement des
//     espaces JSX, notamment, n'est visible qu'au rendu ;
//   - IL NE VOIT PAS LES ENTRÉES MORTES. Une entrée de `copy.ts` que plus aucun composant ne lit
//     passe ce test comme les autres. Rien ici ne prouve qu'un texte est encore affiché ;
//   - IL NE COUVRE QUE LES PHRASES COMPTÉES, celles où un accord se joue. L'écrasante majorité du
//     catalogue est constante et n'est pas relue ici ;
//   - IL NE JUGE PAS LE TON. Comme les goldens : ce qui est écrit, jamais si c'est bien écrit.

import { describe, expect, it } from 'vitest';
import { UI_AI, UI_NO_DEDUCTION, UI_UNITS } from './copy';

describe('unités comptées', () => {
  it('accorde le nom à 0, 1 et 2', () => {
    expect(UI_UNITS.item(0)).toBe('item');
    expect(UI_UNITS.item(1)).toBe('item');
    expect(UI_UNITS.item(2)).toBe('items');
    expect(UI_UNITS.comment(1)).toBe('commentaire');
    expect(UI_UNITS.search(1)).toBe('recherche');
  });
});

describe('phrases comptées — le singulier, que les goldens ne rendent jamais', () => {
  it('accorde le NOM et le PARTICIPE des items écartés', () => {
    // Ex-bug : « 1 items laissés de côté » — deux fautes dans quatre mots.
    expect(UI_AI.tokensDropped(1, '8192')).toBe(
      ' · 1 item laissé de côté (fenêtre de 8192 tokens)',
    );
    expect(UI_AI.tokensDropped(3, '8192')).toBe(
      ' · 3 items laissés de côté (fenêtre de 8192 tokens)',
    );
  });

  it('accorde nom, adjectif et participe des recherches écartées', () => {
    expect(UI_AI.searchesTruncated(1)).toContain('1 recherche plus ancienne laissée de côté');
    expect(UI_AI.searchesTruncated(2)).toContain('2 recherches plus anciennes laissées de côté');
  });

  it('accorde les compteurs de la bannière « peu de données »', () => {
    expect(UI_AI.lowDataCounts(1, 1)).toBe(
      'Ton export contient très peu de texte : 1 commentaire et 1 recherche.',
    );
    // Zéro au singulier — le cas que l'anglais mettrait au pluriel.
    expect(UI_AI.lowDataCounts(0, 0)).toBe(
      'Ton export contient très peu de texte : 0 commentaire et 0 recherche.',
    );
  });

  it('accorde les compteurs de la carte « aucune déduction » (ex-« recherche(s) »)', () => {
    expect(UI_NO_DEDUCTION.dataCounts(1, 1)).toBe('1 recherche · 1 commentaire');
    expect(UI_NO_DEDUCTION.dataCounts(0, 2)).toBe('0 recherche · 2 commentaires');
  });
});

describe('typographie des pourcentages écrits en toutes lettres', () => {
  it('sépare avec une insécable, jamais une espace ASCII qui autoriserait un retour à la ligne', () => {
    // Les pourcentages CALCULÉS passent par `Intl` (U+00A0) ; ceux écrits dans la prose doivent
    // poser le MÊME caractère, sinon « 100 » et « % » peuvent se retrouver sur deux lignes.
    for (const s of [UI_AI.localBadge]) {
      expect(s).not.toMatch(/\d %/);
      expect(s).toMatch(/\d %/);
    }
  });
});
