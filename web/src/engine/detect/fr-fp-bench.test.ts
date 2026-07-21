// Banc de faux positifs FR — le CAPTEUR (PANO-35). Personas et vérité-terrain dans
// `fr-registers.fixture.ts`, scellées AVANT la conception de la règle de registre informationnel :
// côté français, la mesure est donc PRÉDICTIVE, là où l'anglaise était confirmatoire (je connaissais
// déjà les items que je voulais voir dégrader). Le comptage est partagé avec le banc EN.
//
// ── Pourquoi ce banc existe ──────────────────────────────────────────────────────────────────────
// Une mesure anglophone a trouvé un défaut de MACHINERIE, donc indépendant de la langue. Le corriger
// changeait le comportement FR en production — et faire rouler une modification française non
// mesurée sur une mesure anglaise aurait été exactement le raccourci que ces bancs existent pour
// interdire.
//
// ── Ce que ce banc a trouvé, et qui n'était pas commandé ─────────────────────────────────────────
// Le tier colloquial FR porte le MÊME défaut d'hyperbole que celui qui a fait retirer cinq termes EN
// — sur un lexique ratifié de longue date (PANO-33), lui. Voir `fr_hyperbolic` plus bas : c'est un
// résultat ouvert, pas une régression de ce lot, et il n'est pas tranché ici.

import { describe, expect, it } from 'vitest';
import { FR_REGISTER_PERSONAS } from './fr-registers.fixture';
import { detectFor, expectBenchCounts, fingerprint } from './register-bench.harness';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// L'ATTENDU FIGÉ — relevé le 2026-07-18, à diff nul
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const EXPECTED: Readonly<Record<string, readonly string[]>> = {
  // Le témoin ne déclenche rien — y compris sur « difference entre creme fraiche et creme liquide »,
  // qui porte un marqueur de registre informationnel sans aucun terme sensible. C'est la garde
  // écrite dans le sceau : une règle d'ÉTAGE ne peut pas CRÉER un constat, elle ne fait qu'abaisser
  // celui qui existait. Si cette liste se peuple un jour, la règle a changé de nature.
  fr_plain: [],

  // RÉSULTAT NON COMMANDÉ, ET LE PLUS LOURD DE CE LOT. Six formulations du tier colloquial FR se
  // déclenchent sur une jeune femme qui parle d'un comeback, de macarons et d'une file d'attente.
  // C'est le défaut exact qui a fait retirer cinq termes EN — mais ici sur un lexique ratifié
  // PANO-33, calibré contre la POLYSÉMIE et jamais contre l'hyperbole.
  //
  // Rien n'est retiré ici : le FR est la langue de production, ces termes portent du rappel réel
  // (« au bout de ma vie » est aussi une vraie détresse), et l'arbitrage appartient au mainteneur.
  // Le banc le FIGE pour que la question ne se reperde pas.
  fr_hyperbolic: [
    "mental_health[indirect] #2 indirect j'en peux plus",
    'mental_health[indirect] #4 indirect au bout de ma vie',
    'mental_health[indirect] #6 indirect je craque',
    'mental_health[indirect] #16 indirect a plat',
    'mental_health[indirect] #20 indirect je sature',
    'mental_health[indirect] #22 indirect cafard',
  ],

  // Le vrai positif, et la GARDE de la règle d'étage. Son constat reste NOMMÉ (#17, « groupe de
  // parole anxiete en ligne » — une demande d'aide pour soi, ni interrogative ni possessive). Le
  // critère d'arrêt était écrit dans le sceau avant la mesure : si cette persona perdait son étage
  // nommé, la règle serait trop large. Elle ne l'a pas perdu.
  fr_distress: [
    'mental_health[explicit] #1 indirect psychologue',
    'mental_health[explicit] #7 indirect sertraline',
    'mental_health[explicit] #11 indirect psychologue',
    'mental_health[explicit] #17 explicit anxiete',
    'mental_health[explicit] #20 indirect therapie',
    'mental_health[explicit] #22 indirect psychologue+psychiatre',
  ],

  // LE BUG DE PRODUCTION, FERMÉ. Avant ce lot, #1 (« signes de depression chez l'adolescent ») et #3
  // (« symptomes depression ado que faire ») étaient EXPLICITES : un constat NOMMÉ posé sur un père
  // qui va bien, parce qu'aucune de ces deux recherches ne porte de possessif. Les deux sont
  // désormais dégradées, et le constat agrégé est LARGE — le tag demeure (signal sans vécu : taguer
  // l'entourage EST la démonstration), l'affirmation tombe.
  fr_caregiver: [
    'mental_health[indirect] #1 indirect depression',
    'mental_health[indirect] #3 indirect depression',
    'mental_health[indirect] #4 indirect psychologue',
    'mental_health[indirect] #11 indirect therapie',
    'mental_health[indirect] #17 indirect psychologue',
    'mental_health[indirect] #21 indirect antidepresseurs',
  ],

  // LA VOIX QUI DÉCIDE DU SORT DES SIX. Détresse réelle, sans soin, sans condition nommée : cinq
  // hits, tous du registre familier. Son étage est LARGE et doit le rester — elle n'écrit aucun
  // terme clinique, donc un constat nommé sur elle serait fabriqué sans terme (ADR-0003 : le fin
  // n'existe que s'il est écrit). Quatre de ses cinq hits sont parmi les six sous examen ; le
  // cinquième, « au fond du trou », est colloquial mais hors des six — et seul, il passe sous le
  // seuil. C'est ce qui fait qu'elle DISPARAÎT au retrait, mesuré dans `fr-colloquial-ablation`.
  fr_distress_colloquial: [
    "mental_health[indirect] #0 indirect j'en peux plus",
    'mental_health[indirect] #4 indirect a plat',
    'mental_health[indirect] #10 indirect je craque',
    'mental_health[indirect] #12 indirect au fond du trou',
    'mental_health[indirect] #16 indirect je sature',
  ],

  // RÉSIDU ASSUMÉ, identique à celui de la voix professionnelle anglaise. #10 est une ASSERTION
  // définitionnelle (« le burnout est un phenomene lie au travail »), #21 un nom d'INSTRUMENT
  // (« inventaire de burnout de maslach »). Ni l'un ni l'autre n'interroge, ne définit par question,
  // ni ne quantifie : la règle ne les voit pas. Les couvrir demanderait de distinguer « X est Y » de
  // « j'ai X », c'est-à-dire l'ancrage 1ʳᵉ personne — écarté parce que mesuré comme dégradant aussi
  // le vrai positif (ADR-0003, *Le registre informationnel*).
  fr_advocate: [
    'mental_health[explicit] #0 indirect antidepresseurs',
    'mental_health[explicit] #2 indirect therapie',
    'mental_health[explicit] #3 indirect psychologue',
    'mental_health[explicit] #10 explicit burnout',
    'mental_health[explicit] #12 indirect toc',
    'mental_health[explicit] #17 indirect sante mentale',
    'mental_health[explicit] #19 indirect psychologues',
    'mental_health[explicit] #20 indirect sante mentale',
    'mental_health[explicit] #21 explicit burnout',
  ],
};

describe('banc FP FR — capteur de régression', () => {
  for (const persona of FR_REGISTER_PERSONAS) {
    it(`${persona.id} — détections inchangées (registre : ${persona.register})`, () => {
      expect(fingerprint(detectFor(persona))).toEqual(EXPECTED[persona.id]);
    });
  }

  it('les six voix sont couvertes', () => {
    expect(Object.keys(EXPECTED).sort()).toEqual(FR_REGISTER_PERSONAS.map((p) => p.id).sort());
  });
});

describe('banc FP FR — comptage', () => {
  expectBenchCounts(FR_REGISTER_PERSONAS, {
    // Un seul tort, et il n'est PAS de même nature que celui du banc EN : ici le lexique fautif est
    // le lexique FR de production, ratifié PANO-33. Question ouverte, pas régression.
    torts: ['fr_hyperbolic/mental_health'],
    // Le proche aidant a QUITTÉ cette liste avec ce lot — c'était le bug. Reste la voix
    // professionnelle, sur son registre assertif et technique.
    escalated: ['fr_advocate/mental_health'],
    // Aucune : la vérité-terrain FR n'a produit aucun désaccord à la mesure, contrairement au banc
    // EN (« halal »). Ce n'est pas une réussite d'annotation, c'est un banc plus étroit — cinq voix
    // au lieu de six, et aucune qui explore les cinq autres labels.
    corrections: [],
    tortsAfterCorrection: ['fr_hyperbolic/mental_health'],
    // Deux vécus, DEUX ÉTAGES DIFFÉRENTS, et c'est le point de doctrine que cette paire démontre :
    // `fr_distress` écrit « anxiete », le terme précis est là, le constat nommé est légitime ;
    // `fr_distress_colloquial` ne nomme rien, donc son plafond correct est LARGE. Vécu et nommé sont
    // deux axes, pas un seul — les fusionner produirait un constat nommé sans terme écrit.
    livedStages: { fr_distress: 'explicit', fr_distress_colloquial: 'indirect' },
  });

  it("le proche aidant n'est plus NOMMÉ — la garde du bug de production", () => {
    const caregiver = FR_REGISTER_PERSONAS.find((p) => p.id === 'fr_caregiver');
    if (caregiver === undefined) {
      throw new Error('persona `fr_caregiver` absente');
    }
    const mentalHealth = detectFor(caregiver).find((d) => d.label === 'mental_health');
    // Le tag DOIT rester — le retirer serait cacher ce que la plateforme voit. C'est l'étage qui ne
    // doit pas remonter : un `explicit` ici, c'est un constat nommé sur un parent inquiet, et c'est
    // exactement l'état dans lequel la production se trouvait avant ce lot.
    expect(mentalHealth).toBeDefined();
    expect(mentalHealth?.stage).toBe('indirect');
    // Les deux items qui portaient le bug, nommés pour que l'échec dise lequel a régressé.
    const explicites = (mentalHealth?.items ?? []).filter((i) => i.stage === 'explicit');
    expect(explicites).toEqual([]);
  });
});
