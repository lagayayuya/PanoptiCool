// Banc `politics` — la mesure des quatre voix scellées en `politics-registers.fixture.ts`.
//
// ── CE QUE CE FICHIER NE COUVRE PAS, et il faut le lire AVANT les chiffres ───────────────────────
// - **Les compteurs génériques du harnais sont TOUS VERTS ici, et ce vert ne veut rien dire.** Zéro
//   tort, zéro rappel manqué, les deux vécus tagués et nommés. Un lecteur qui s'arrêterait là
//   conclurait « la détection politique est mesurée et propre ». Elle ne l'est pas : les trois
//   assertions ajoutées plus bas montrent une asymétrie que le comptage générique ne peut pas voir,
//   parce qu'il compte des CELLULES et que l'asymétrie vit dans les PREUVES.
// - **Le plancher de faux positifs anglais n'est pas mesuré par ce banc.** Les deux voix EN rendent
//   zéro, et ce zéro arrive parce que l'anglais n'a AUCUNE couverture d'auto-déclaration politique
//   — pas parce que les gardes discriminent. La troisième assertion l'établit plutôt que de le
//   supposer. Tant qu'elle rend `RIEN`, ces deux voix ne prouvent rien sur les faux positifs.
// - **Un seul axe, la bande civile, aucune organisation, aucune paire opposée anglaise.** Les
//   frontières d'écriture sont déclarées dans l'en-tête de la fixture et ne sont pas recopiées ici.
//
// ── L'ÉTAT MESURÉ ────────────────────────────────────────────────────────────────────────────────
// Mesure faite sur le lexique tel qu'il était au commit du sceau (« sceller quatre voix
// politiques — la paire opposée est l'instrument », historique de travail d'avant la recomposition
// de publication), dont le parent n'apportait aucune modification à `lexicon/`. La réparation
// française annoncée n'avait donc PAS encore atterri : ces chiffres décrivaient l'état AVANT
// réparation, et c'est ce qui leur donne leur valeur de point de comparaison.
//
// ── CE QUE LA RÉPARATION A DÉPLACÉ, ET CE QU'ELLE N'A PAS DÉPLACÉ ────────────────────────────────
// La réparation a atterri, et ce banc l'a mesurée en rougissant sur trois assertions — ce qui est
// exactement son office. Les attendus sont mis à jour ; les valeurs d'AVANT sont conservées dans
// chaque commentaire, sans quoi la mise à jour effacerait le constat au lieu de l'enregistrer.
//
//   · ablation de l'axe grossier :  droite `RIEN`  →  `politics[explicit]`   — RÉPARÉ
//   · le lexème isolé (`liberal`) :  `RIEN`        →  `politics[explicit]`   — RÉPARÉ
//   · densité de preuves :           3 / 2         →  5 / 4                  — écart INCHANGÉ
//
// La troisième ligne est celle à ne pas lire de travers : la réparation a rendu symétriques deux
// PROPRIÉTÉS (la sur-détermination, le lexème de courant), pas les DENSITÉS. L'écart de 1 subsiste,
// et ce banc ne permet pas de dire s'il est un résidu du lexique ou du hasard de l'écriture — deux
// voix ne sont pas une distribution.
//
// ── CONTAMINATION, déclarée ici parce que c'est ici qu'on citera ce banc ─────────────────────────
// Ce banc a été écrit à l'aveugle du lexique, et il l'est resté pour la quasi-totalité de la
// réparation. TROIS entrées font exception — `liberal`, `liberale`, `redistribution` — écrites
// après lecture de la fixture, dont deux sur la demande explicite de l'assertion du lexème isolé.
// Ce banc ne les valide donc pas : il les a provoquées. Détail en tête de `lexicon/politics.ts`.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { detectLabels } from './detect';
import { POLITICS_REGISTER_PERSONAS } from './politics-registers.fixture';
import { detectFor, expectBenchCounts } from './register-bench.harness';

const byId = (id: string) => {
  const persona = POLITICS_REGISTER_PERSONAS.find((p) => p.id === id);
  if (persona === undefined) throw new Error(`persona \`${id}\` absente de la fixture`);
  return persona;
};

/** Nombre de preuves `politics` citées pour une persona — le grain où vit l'asymétrie. */
const politicsEvidence = (id: string) =>
  detectFor(byId(id)).find((d) => d.label === 'politics')?.items.length ?? 0;

/** Le résumé d'une détection sur un texte isolé, ou `RIEN`. */
const runOn = (texts: readonly string[]) => {
  const out = detectLabels([...texts], WIRED_LEXICONS);
  return out.map((d) => `${d.label}[${d.stage}]`).join(', ') || 'RIEN';
};

describe('banc politics — comptage commun', () => {
  expectBenchCounts(POLITICS_REGISTER_PERSONAS, {
    // Aucun non-porteur tagué : les deux voix EN ne déclenchent rien, et les cinq autres labels
    // restent muets sur les deux voix FR. Voir l'en-tête : ce zéro-ci est faible côté EN.
    torts: [],
    escalated: [],
    corrections: [],
    tortsAfterCorrection: [],
    missedRecall: [],
    missedSignal: [],
    // Les deux vécus atteignent un constat NOMMÉ. C'est le résultat qui rend l'asymétrie invisible
    // au comptage générique : les deux cellules sont vertes, et pourtant elles ne tiennent pas par
    // les mêmes moyens — c'est ce que mesure `describe` suivant.
    livedStages: {
      fr_state_collective: 'explicit',
      fr_state_individual: 'explicit',
    },
  });
});

describe("banc politics — l'ÉCART de la paire, que le comptage générique ne voit pas", () => {
  // Les deux nombres de la paire ne se somment ni ne se moyennent JAMAIS (en-tête de la fixture) :
  // un total est précisément l'opération qui masque une asymétrie, le camp silencieux se laissant
  // absorber par le camp détecté. Ils sont donc assertés séparément, et l'écart est nommé.

  it('DENSITÉ DE PREUVES — 5 à gauche, 4 à droite (avant réparation : 3 et 2)', () => {
    // Les deux voix portent 24 items, 15/9, et huit auto-déclarations aux cadres syntaxiques
    // calqués. L'écart de preuves n'est donc pas imputable à l'écriture : il est imputable au
    // lexique. Une seule paire d'auto-déclarations se comporte différemment, et c'est la suivante.
    //
    // APRÈS RÉPARATION FR : les deux compteurs gagnent EXACTEMENT UN, et l'écart de 1 SUBSISTE. Il
    // faut le dire dans ce sens plutôt que « les deux ont progressé » : la réparation a rendu
    // symétriques les DEUX propriétés que les deux assertions suivantes isolent, elle n'a pas
    // égalisé la densité, et rien ne dit qu'elle le devrait — deux voix ne sont pas une
    // distribution, et un écart de 1 sur 24 items n'est pas un résultat, c'est un chiffre.
    expect(politicsEvidence('fr_state_collective')).toBe(5);
    expect(politicsEvidence('fr_state_individual')).toBe(4);
  });

  it('LE LEXÈME ISOLÉ — « socialiste » ET « libéral » posent désormais un constat nommé', () => {
    // Même cadre, même longueur, même personne grammaticale, même position dans la voix. La seule
    // variable est le terme de courant. C'est la forme la plus propre que l'asymétrie puisse
    // prendre, et elle n'était atteignable qu'avec deux voix écrites l'une pour l'autre.
    //
    // AVANT RÉPARATION, ce test asserait `RIEN` sur la seconde ligne, et c'était LE constat du banc.
    // La réparation a fait entrer `liberal` au tier de l'identité — une décision que ce banc a
    // provoquée, la note de portabilité ayant proposé de l'exclure. À lire avec la contamination
    // déclarée en tête de `lexicon/politics.ts` : ce banc ne valide PAS `liberal` à l'aveugle, il
    // l'a demandé.
    expect(runOn(['je suis socialiste, et je ne trouve pas ca honteux a dire'])).toBe(
      'politics[explicit]',
    );
    expect(runOn(['je suis liberal, et je ne trouve pas ca honteux a dire'])).toBe(
      'politics[explicit]',
    );
  });

  it("ABLATION DE L'AXE GROSSIER — les deux voix survivent désormais au retrait de « de gauche » / « de droite »", () => {
    // LE RÉSULTAT CENTRAL DE CE BANC, et la raison pour laquelle deux cellules vertes ne suffisent
    // pas à conclure. Le constat nommé de la voix de gauche est SUR-DÉTERMINÉ : deux chemins
    // explicites indépendants le portent, il survit au retrait de l'axe grossier. Celui de la voix
    // de droite reposait ENTIÈREMENT sur ce seul terme — retiré, il ne restait pas un constat
    // large, il ne restait rien du tout.
    //
    // C'est exactement ce qui rendait l'asymétrie invisible : l'axe grossier est symétrique, il
    // rattrape la voix de droite, et les deux camps atteignent le même étage. La marge de
    // redondance, elle, ne l'était pas — et c'est elle qui décide de ce qui arrive à quelqu'un qui
    // écrit son engagement autrement qu'avec les deux mots les plus attendus.
    //
    // APRÈS RÉPARATION : la voix de droite est sur-déterminée elle aussi, au MÊME étage. C'est la
    // propriété que ce banc existait pour mesurer, et la seule dont le retournement se lise comme
    // une réparation plutôt que comme un déplacement de chiffre.
    const withoutCoarse = (id: string) =>
      runOn(
        byId(id)
          .items.filter((_, i) => i !== 0)
          .map((i) => i.text),
      );

    expect(withoutCoarse('fr_state_collective')).toBe('politics[explicit]');
    expect(withoutCoarse('fr_state_individual')).toBe('politics[explicit]');
  });

  it('LES SIX AUTRES PAIRES sont muettes des DEUX côtés — un silence, lui, symétrique', () => {
    // Appartenance, vote nommé autrement que par l'axe, cadrage d'enjeu, position, cotisation :
    // aucune ne déclenche, dans aucun des deux camps. Ce silence-là ne pèse pas sur l'écart, et
    // l'asserter empêche de croire que l'asymétrie est plus large qu'elle ne l'est réellement.
    const a = byId('fr_state_collective').items;
    const b = byId('fr_state_individual').items;
    for (const i of [1, 2, 3, 5, 6, 7]) {
      expect(runOn([a[i]?.text ?? ''])).toBe('RIEN');
      expect(runOn([b[i]?.text ?? ''])).toBe('RIEN');
    }
  });
});

// ── CE QUE LE LOT DE VOCABULAIRE ANGLAIS A CHANGÉ ICI, ET CE QU'IL N'A PAS CHANGÉ ────────────────
// Le lot EN a atterri (23 entrées : institutions, procédures, thèmes appariés, deux actes de vote).
// Ce `describe` a été écrit en prévoyant de rougir à ce moment-là. **Il n'a pas rougi**, et il ne
// devait pas : le lot ne livre AUCUNE auto-déclaration anglaise — `selfDeclared` reste vide, faute
// de copule EN. L'assertion ci-dessous reste donc vraie, et elle reste utile : elle garde le tier.
//
// Ce qui, en revanche, N'EST PLUS VRAI est la phrase qui l'entourait — « tant que cette assertion
// tient, les deux voix EN ne prouvent rien sur les faux positifs, elles ne sont qu'un plancher posé
// d'avance ». Du vocabulaire anglais existe désormais, à d'autres tiers. Mais le plancher n'est
// toujours pas devenu une mesure, et pour une raison qu'il faut écrire à sa place :
//
//   **aucune des 23 entrées du lot n'apparaît dans le texte de l'une ou l'autre garde** (vérifié
//   terme à terme, pas supposé).
//
// Le zéro tort des deux voix EN mesure donc toujours leur CONTENU, jamais le tri du lexique. Les
// faux positifs du vocabulaire anglais sont **non mesurés**. Ce qu'il faudrait est nommé dans
// `politics-symmetry.test.ts` : une paire opposée anglaise, scellée à l'aveugle.
describe('banc politics — les gardes EN, et par quel chemin leur zéro arrive', () => {
  it("PAR QUEL CHEMIN — l'anglais n'a aucune couverture d'auto-déclaration politique", () => {
    // CLAUDE.md, *Ce qu'un filet prouve* : une assertion négative vérifie ce qu'elle ATTEINT, pas ce
    // qu'elle affirme. Le zéro tort des deux voix EN pourrait signifier « les gardes discriminent
    // bien » ; il signifie en réalité « il n'y a rien à déclencher ». Les cinq sondes ci-dessous
    // sont les auto-déclarations les plus explicites qu'on puisse écrire en anglais, et aucune ne
    // rend quoi que ce soit.
    //
    // Tant que cette assertion tient, `en_exposed_apolitical` et `en_ironic` ne prouvent RIEN sur
    // les faux positifs — elles ne sont qu'un plancher posé d'avance, prêt à mesurer le jour où du
    // vocabulaire politique anglais atterrira. Ce jour-là, ce test rougira : c'est son office.
    //
    // MISE À JOUR — le vocabulaire anglais a atterri, et ce test N'A PAS rougi. La prédiction
    // ci-dessus visait juste mais trop large : le lot livre des institutions et des thèmes, aucune
    // AUTO-DÉCLARATION, `selfDeclared` restant vide faute de copule EN. L'assertion garde donc
    // exactement le tier qu'elle gardait. Ce qui a changé est dit dans l'en-tête de ce `describe`,
    // et ce n'est pas ce test qui l'a vu — c'est une vérification terme à terme.
    for (const probe of [
      'i am a socialist and i have always been one',
      'i am a conservative and i have always been one',
      'i am left wing and i vote that way every time',
      'i am right wing and i vote that way every time',
      'i am a liberal, i am a communist, i am a capitalist',
    ]) {
      expect(runOn([probe])).toBe('RIEN');
    }
  });

  it('les deux voix EN ne rendent rien — un plancher, pas une garantie', () => {
    expect(detectFor(byId('en_exposed_apolitical'))).toEqual([]);
    expect(detectFor(byId('en_ironic'))).toEqual([]);
  });
});
