// TÉMOIN DU CLASSEMENT DES CARTES (`compareCards`, section 02).
//
// POURQUOI CE TEST EXISTE — et pourquoi le golden de rendu ne le remplace pas. `compareCards` porte
// trois critères de DOCTRINE (le sensible d'abord ; puis la confiance ; le volume ne départage que).
// Le golden (`render-golden.test.ts`) rend la persona de bout en bout, mais elle ne produit que
// QUATRE cartes, et sur ces quatre le critère REPRODUIT l'ordre d'émission du moteur : le golden
// passerait à l'identique avec un comparateur qui ne classe rien. Il fige un rendu, il ne prouve pas
// un tri. Le plafond réel de la section est ~11 cartes (≤ 6 signaux D1 + ≤ 5 thèmes D2), avec des
// croisements que la persona n'atteint jamais.
//
// D'où des cartes SYNTHÉTIQUES : on choisit les croisements au lieu de les subir. Chaque cas est
// construit pour ÉCHOUER si la branche qu'il vise est cassée — un cas qui passe des deux côtés
// n'est pas un témoin, c'est exactement le défaut du golden.
//
// `node` n'est jamais lu par le comparateur : un VNode nu suffit, et il sert d'ÉTIQUETTE pour
// distinguer deux cartes que les trois critères jugent égales (sans quoi « ordre stable » serait
// intestable — on ne pourrait pas lire la différence entre « préservé » et « permuté »).

import { h } from 'preact';
import { describe, expect, it } from 'vitest';
import { compareCards, type RankedCard } from './ResultsView';

/** Une carte synthétique : les trois nombres qui la classent, plus une étiquette que le tri IGNORE. */
function card(tag: string, fields: Omit<RankedCard, 'node'>): RankedCard {
  return { ...fields, node: h('div', null, tag) };
}

/** Les étiquettes, dans l'ordre où le tri les rend. */
function order(cards: RankedCard[]): string[] {
  return [...cards].sort(compareCards).map((c) => String(c.node.props.children));
}

describe('compareCards — critère 1 : le sensible passe devant', () => {
  // LE croisement qui prouve une PRÉSÉANCE et pas un départage : le sensible est le PLUS BAS des
  // deux en confiance. S'il passe quand même devant, c'est que `sensitive` est bien lu en premier —
  // à niveau égal, le cas ne prouverait rien.
  const sensitiveLow = card('sensible', { sensitive: true, level: 'low', src: 1 });
  const interestMedium = card('intérêt', { sensitive: false, level: 'medium', src: 9 });

  it('un constat sensible « incertaine » devance un thème « moyenne » mieux étayé', () => {
    expect(order([sensitiveLow, interestMedium])).toEqual(['sensible', 'intérêt']);
  });

  it("…quel que soit l'ordre d'entrée (c'est le critère qui range, pas le moteur)", () => {
    expect(order([interestMedium, sensitiveLow])).toEqual(['sensible', 'intérêt']);
  });
});

describe('compareCards — critère 2 : la confiance décroissante, avant le volume', () => {
  it('« moyenne » devance « incertaine » entre deux thèmes', () => {
    const low = card('incertaine', { sensitive: false, level: 'low', src: 3 });
    const medium = card('moyenne', { sensitive: false, level: 'medium', src: 3 });
    expect(order([low, medium])).toEqual(['moyenne', 'incertaine']);
  });

  it('la confiance prime le volume : « moyenne / 1 src » devance « incertaine / 50 src »', () => {
    // Le volume ne peut pas remonter une carte moins affirmée : il DÉPARTAGE, il ne classe pas.
    const lowMany = card('incertaine', { sensitive: false, level: 'low', src: 50 });
    const mediumFew = card('moyenne', { sensitive: false, level: 'medium', src: 1 });
    expect(order([lowMany, mediumFew])).toEqual(['moyenne', 'incertaine']);
  });
});

describe('compareCards — critère 3 : à confiance égale, le volume départage', () => {
  it('entre deux thèmes « moyenne », le mieux étayé passe devant', () => {
    const few = card('2 src', { sensitive: false, level: 'medium', src: 2 });
    const many = card('7 src', { sensitive: false, level: 'medium', src: 7 });
    expect(order([few, many])).toEqual(['7 src', '2 src']);
  });

  it('le départage vaut aussi entre deux constats sensibles', () => {
    const few = card('1 src', { sensitive: true, level: 'low', src: 1 });
    const many = card('4 src', { sensitive: true, level: 'low', src: 4 });
    expect(order([few, many])).toEqual(['4 src', '1 src']);
  });
});

describe('compareCards — égalité totale : le tri stable garde l’ordre du moteur', () => {
  it('deux cartes que les trois critères jugent égales sortent dans leur ordre d’entrée', () => {
    // Les deux ne diffèrent QUE par l'étiquette — un champ que `compareCards` ne lit pas. C'est ce
    // qui rend la stabilité observable : le tri n'a aucun moyen de les départager.
    const first = card('première', { sensitive: false, level: 'medium', src: 4 });
    const second = card('seconde', { sensitive: false, level: 'medium', src: 4 });
    expect(order([first, second])).toEqual(['première', 'seconde']);
    expect(order([second, first])).toEqual(['seconde', 'première']);
  });
});

describe('compareCards — les trois critères ensemble, sur une section pleine', () => {
  it('classe onze cartes (le plafond mesuré : 6 signaux D1 + 5 thèmes D2)', () => {
    // Le cas que le golden ne verra jamais : la persona plafonne à 4 cartes. Ici les trois critères
    // se croisent — un comparateur qui en oublierait un rendrait un ordre différent.
    const cards = [
      card('t-med-2', { sensitive: false, level: 'medium', src: 2 }),
      card('s-low-1', { sensitive: true, level: 'low', src: 1 }),
      card('t-low-9', { sensitive: false, level: 'low', src: 9 }),
      card('s-med-3', { sensitive: true, level: 'medium', src: 3 }),
      card('t-med-5', { sensitive: false, level: 'medium', src: 5 }),
      card('s-low-6', { sensitive: true, level: 'low', src: 6 }),
      card('t-high-1', { sensitive: false, level: 'high', src: 1 }),
      card('s-med-8', { sensitive: true, level: 'medium', src: 8 }),
      card('s-low-2', { sensitive: true, level: 'low', src: 2 }),
      card('s-low-4', { sensitive: true, level: 'low', src: 4 }),
      card('t-med-7', { sensitive: false, level: 'medium', src: 7 }),
    ];
    expect(order(cards)).toEqual([
      // Les six sensibles d'abord, « moyenne » avant « incertaine », volume en départage.
      's-med-8',
      's-med-3',
      's-low-6',
      's-low-4',
      's-low-2',
      's-low-1',
      // Puis les thèmes, même hiérarchie. `high` n'a aucun producteur aujourd'hui mais le TYPE
      // l'autorise (FORK 3) : si une règle en émet un jour, le tri le place déjà en tête.
      't-high-1',
      't-med-7',
      't-med-5',
      't-med-2',
      't-low-9',
    ]);
  });
});
