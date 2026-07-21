// L'ÉVENTAIL REND TOUTES SES LECTURES — dans les DEUX modes.
//
// ── Pourquoi ce fichier existe, et pourquoi personne n'avait vu le défaut ────────────────────────
// Le mode `equal` rendait exactement DEUX lectures (`readings[0]`, un séparateur, `readings[1]`) et
// perdait la suite en silence. Les cinq lexiques topicaux en portent trois : la troisième
// n'apparaissait jamais sur un constat large.
//
// Le défaut a survécu parce qu'AUCUN golden ne rend d'éventail `equal`. La persona de démo produit
// un constat `mental_health` NOMMÉ ; `render-golden` et `ui-golden` montent donc des cartes qui
// n'exercent que le mode `ranked` (et, avant le lot A, aucun éventail du tout).
//
// C'est une frontière que NI `render-golden` NI `ui-golden` ne déclarait, et elle est STRUCTURELLE :
// la persona a été écrite à l'aveugle, comme une personne et non comme un jeu de déclencheurs. Ce
// qu'elle n'exerce pas n'est donc le choix de personne — et ce que personne n'a décidé d'omettre,
// personne ne pense à l'écrire. Les deux goldens déclarent bien ce qu'ils ne MONTENT pas (AiSection,
// mobile, LandingPage…) ; ils ne pouvaient pas déclarer ce qu'ils montent sans l'atteindre.
//
// ── Ce que ce fichier NE couvre PAS ──────────────────────────────────────────────────────────────
// Il monte une carte porteuse d'un éventail, et regarde une seule chose : aucune lecture perdue. Il
// ne dit rien de la mise en page, ni de l'ORDRE des lectures (non ratifié — catalogue §4), ni du
// NOMBRE qu'un label doit porter (décision de catalogue). Rendre moins de lectures qu'on n'en reçoit
// n'est pas une décision de produit : c'est une perte de données, et c'est tout ce qui est testé ici.

import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { describe, expect, it, vi } from 'vitest';
import type { Evidence, ReadingFan, Signal } from '../../engine/analysis';
import { SignalCardNavy } from './ThemeCardNavy';

// Déplis forcés ouverts — même idiome que `render-golden` : l'éventail vit derrière un
// `useState(false)` interne, et fermé il ne serait tout simplement pas rendu.
vi.mock('preact/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('preact/hooks')>();
  return {
    ...actual,
    useState: <T>(init: T) =>
      actual.useState(init === (false as unknown as T) ? (true as unknown as T) : init),
  };
});

/** Trois lectures inventées — le test porte sur le COMPTE rendu, jamais sur des textes ratifiés. */
const TROIS_LECTURES = ['lecture alpha', 'lecture beta', 'lecture gamma'] as const;

function carte(mode: ReadingFan['mode']): string {
  const preuve: Evidence = {
    channel: 'search',
    sourceIndex: 0,
    text: 'texte de preuve synthetique',
    date: '2026-07-16 12:00:00',
    triggerTerms: [],
    readings: { mode, readings: [...TROIS_LECTURES] },
  };
  const signal: Signal = {
    sensitive: true,
    label: 'Santé mentale',
    claim: 'Constat synthétique de test.',
    confidence: 'low',
    evidence: [preuve],
  };
  return render(h(SignalCardNavy, { signal, reuseMap: new Map() }));
}

describe('éventail de lectures — aucune lecture perdue au rendu', () => {
  for (const mode of ['equal', 'ranked'] as const) {
    it(`mode \`${mode}\` : les TROIS lectures sont rendues`, () => {
      const html = carte(mode);
      for (const lecture of TROIS_LECTURES) {
        expect(html).toContain(lecture);
      }
    });
  }

  it('mode `equal` : le séparateur est INTERCALÉ, donc il y en a un de moins que de lectures', () => {
    // La garde qui distingue « rend trois lectures » de « les rend correctement » : un séparateur
    // écrit une fois en dur produirait un compte faux dès qu'on quitte la paire.
    const separateurs = (carte('equal').match(/≡/g) ?? []).length;
    expect(separateurs).toBe(TROIS_LECTURES.length - 1);
  });
});
