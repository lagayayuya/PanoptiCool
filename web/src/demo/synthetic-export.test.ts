// Verrou de cohérence de la démo (session « démo honnête ») — la BARRE D'HONNÊTETÉ : la démo doit
// montrer ce que le moteur produirait VRAIMENT sur ces items. Ce fichier fait tourner le pipeline
// RÉEL (`processExport`, D1 + D2 inclus) sur les deux variantes (`buildSyntheticExportZip` FR,
// `buildSyntheticExportZipEn` EN) et verrouille : les thèmes qui sortent, ceux qui n'en sortent PAS,
// et les chiffres agrégés (volumes, rythme). Si quelqu'un change le texte des items sans faire tourner
// ce test, une dérive de thème (un item qui ne matche plus, ou qui matche un thème imprévu) casse ici —
// jamais un mismatch silencieux entre la fixture et le vrai détecteur.
//
// PORTÉ À LA REFONTE A. Le gros du fichier est du DISPATCH qui disparaît, pas des verrous qui
// changent : `insightsByRuleId(output.insights, R1_RULE_ID)[0].value.signalCount` devient
// `output.volumes.searches`. Le champ EST le nom (§2.3) — il n'y a plus de liste hétérogène à
// filtrer, ni de `kind` à narrower, ni de `ruleId` à comparer.
//
// Ce que la refonte fait disparaître ici, et qui vaut d'être nommé :
//   - `d1TemplatePrefixes()` part ENTIÈREMENT. Elle re-parsait un identifiant de gabarit à la regex
//     (`/^d1\.([a-z-]+)\./`) pour retrouver le label sensible — l'inversion stringly-typed que l'UI
//     faisait aussi. D1 émet désormais le nom directement (`Signal.label`), keyé sur une union
//     FERMÉE : plus de regex, plus d'inversion, exhaustivité au compilateur ;
//   - `sensitivity === 3` (toujours 3) devient `sensitive === true` (§2.1) ;
//   - `value.signalCount` devient `evidence.length` : le compte n'est plus recopié à côté des
//     preuves, il EST leur nombre — une source unique, plus deux qui peuvent diverger ;
//   - l'assertion « rythme nocturne importante » est SUPPRIMÉE : le cadrage nocturne gradué n'a plus
//     de producteur (ADR-0004). Le graphe, les compteurs et l'estimation restent vérifiés.
//
// FRAGILITÉ TEMPORELLE CORRIGÉE : `ProcessOptions.now` existe désormais (lot « démo qui ne rouille
// pas ») et ce test injecte LA MÊME horloge `NOW` au builder ET à `processExport` — les fenêtres
// glissantes du rythme retombent sur les chiffres attendus quel que soit le jour où la suite tourne,
// pas seulement le jour où `NOW` coïncidait avec `Date.now()` réel.

import { describe, expect, it } from 'vitest';
import { processExport } from '../engine/pipeline';
import { sensitiveTopicName } from '../engine/wording';
import { buildSyntheticExportZip, buildSyntheticExportZipEn } from './synthetic-export';

/** Horloge fixe injectée AU BUILDER ET à `processExport` (ses dates sont RELATIVES à `now`, jamais de
 *  2026 en dur) : les deux tournent sur la même horloge, comme en production. */
const NOW = Date.UTC(2026, 6, 16, 12, 0, 0);

describe('démo FR — barre d’honnêteté (pipeline réel)', () => {
  const result = processExport(buildSyntheticExportZip(undefined, NOW), { now: NOW });
  if (!result.ok) {
    throw new Error(`export synthétique FR invalide : ${JSON.stringify(result)}`);
  }
  const { output } = result;

  it('D1 ne sort QUE mental_health et conflictual (pas politics/health-physical/sexuality/religion)', () => {
    // Ex-`d1TemplatePrefixes` : le nom du sujet est ÉMIS, plus extrait d'un templateId à la regex.
    expect(new Set(output.signals.map((s) => s.label))).toEqual(
      new Set([sensitiveTopicName('fr', 'mental_health'), sensitiveTopicName('fr', 'conflictual')]),
    );
  });

  it('mental_health est un constat LARGE — « témoignages burn out » ne nomme plus, mais franchit seul', () => {
    // FIL-PIÈGE RETOURNÉ DEUX FOIS, et la SÉQUENCE vaut plus que l'état final — c'est pour ça
    // qu'elle est écrite ici plutôt que remplacée :
    //
    //   1. AVANT — constat NOMMÉ. « témoignages burn out » écrit le terme en toutes lettres, donc
    //      l'étage nommé, donc la carte affirmait un vécu sur la foi d'une recherche de récits.
    //   2. PUIS — plus AUCUN constat. Le registre informationnel a dégradé l'item (demander des
    //      témoignages n'affirme rien), et le seuil de répétition a fait le reste : un item dégradé
    //      reste UN item, et un constat large en exige DEUX. Deux règles justes composées en une
    //      disparition qu'aucune des deux ne demandait.
    //   3. MAINTENANT — constat LARGE. L'item dégradé franchit SEUL, comme le fait déjà un nom nu
    //      de trouble (`indirectSolo`) : dans les deux cas le terme précis EST écrit, et c'est le
    //      CADRAGE qui interdit d'affirmer. La règle n'est pas neuve, elle rejoint un chemin qu'elle
    //      avait manqué.
    //
    // Ce que la carte dit maintenant est ce qu'elle aurait dû dire depuis le début : il y a bien un
    // signal de santé mentale ici, et il ne suffit pas à affirmer un vécu.
    const signal = output.signals.find(
      (s) => s.label === sensitiveTopicName('fr', 'mental_health'),
    );
    expect(signal?.sensitive).toBe(true);
    expect(signal?.evidence).toHaveLength(1);
    // L'étage EST le résultat : `low` est la confiance du large, `medium` celle du nommé.
    expect(signal?.confidence).toBe('low');
  });

  it('conflictual porte un unique signal explicite (l’insulte ciblée)', () => {
    const signal = output.signals.find((s) => s.label === sensitiveTopicName('fr', 'conflictual'));
    expect(signal?.evidence).toHaveLength(1);
  });

  it('D2 ne retient QUE chats (2 items) et cinema_series (3 items) — plancher PANO-75 respecté', () => {
    expect(new Set(output.themes.map((t) => t.id))).toEqual(new Set(['chats', 'cinema_series']));
    const evidenceOf = (id: string) =>
      output.themes.find((t) => t.id === id)?.deductions[0]?.evidence;
    expect(evidenceOf('chats')).toHaveLength(2);
    // 3 = « spin off » + « kubrick »/« cinéma » + le « netflix » du commentaire conflictual (item
    // partagé entre les deux thèmes, C5).
    expect(evidenceOf('cinema_series')).toHaveLength(3);
  });

  it('volumes = 24 recherches / 14 commentaires / 300 suivis / 2700 likes', () => {
    // Ex-R1/R2/R3/R5 + `ACTIVITY_PANEL_RULE_IDS` : le champ EST le nom (§2.3), plus de dispatch.
    expect(output.volumes.searches).toBe(24);
    expect(output.volumes.comments).toBe(14);
    expect(output.volumes.follows).toBe(300);
    expect(output.volumes.endorsements).toBe(2700);
  });

  it('vues : 50 000 au total (Activity Summary), 6 100 sur 12 mois, 420 sur 30 jours', () => {
    expect(output.volumes.allTime?.videosWatchedToEnd).toBe(50_000);
    expect(output.rhythm?.videosWatched).toEqual({
      total: 50_000,
      last12Months: 6100,
      last30Days: 420,
    });
  });

  it('graphe de rythme : 24 compteurs horaires + estimation par sessionisation plausible', () => {
    expect(output.rhythm?.hourlyActivity).toHaveLength(24);
    // Pas de valeur cible figée sur l'estimation (calcul RÉEL par sessionisation, pas recopié) :
    // on verrouille juste un ordre de grandeur plausible (« environ 29 h »).
    expect(output.rhythm?.estimatedMinutes).toBeGreaterThan(1000);
    expect(output.rhythm?.estimatedMinutes).toBeLessThan(2200);
  });

  it('mur sémantique / opacité : présent, lisible << opaque (ordre de grandeur, pas de valeur figée)', () => {
    expect(output.opacity?.readableCount).toBe(24 + 14);
    expect(output.opacity?.opaqueCount).toBeGreaterThan((output.opacity?.readableCount ?? 0) * 10);
  });
});

describe('démo EN — la barre d’honnêteté révèle la limite réelle des lexiques', () => {
  const result = processExport(buildSyntheticExportZipEn(undefined, NOW), { now: NOW });
  if (!result.ok) {
    throw new Error(`export synthétique EN invalide : ${JSON.stringify(result)}`);
  }
  const { output } = result;

  // MESURE, pas cible. La persona EN a été écrite à l'aveugle (une personne, pas une liste de
  // déclencheurs) ; ce bloc enregistre ce que le détecteur en tire AUJOURD'HUI.
  //
  // LE LOT EN DE `mental_health` A ATTERRI (PANO-35) — et ces chiffres n'ont PAS bougé d'un octet.
  // Ce n'est pas un raté : la persona, écrite sans viser les lexiques, ne rencontre AUCUN des ~50
  // termes livrés. C'est la mesure la plus utile de ce bloc, et elle dit une limite de l'instrument
  // plutôt qu'une limite du lexique : une persona mesure du RAPPEL sur une voix d'écriture, jamais
  // un taux de faux positifs. Ce que le lot ajoute est exercé par la batterie adverse
  // (`engine/detect/lexicon-battery.test.ts`), seul endroit qui le traverse ; ce qu'il faudrait pour
  // mesurer les FP est nommé en dette au catalogue (banc de personas en registres contrastés).
  it('D1 sort mental_health ET conflictual — deux couvertures EN ASSUMÉES, rien de plus', () => {
    // `mental_health` franchit par « burnout », le même mot des deux côtés : il franchissait DÉJÀ
    // avant son lot, sans qu'aucune décision ne l'ait voulu, et il est depuis annoté « (EN) ».
    // `conflictual` a rejoint la liste au lot EN de son lexique — et lui, il a fallu le VOULOIR :
    // sa porte exige une insulte ET une cible, et les deux listes étaient FR.
    expect(new Set(output.signals.map((s) => s.label))).toEqual(
      new Set([sensitiveTopicName('fr', 'mental_health'), sensitiveTopicName('fr', 'conflictual')]),
    );
    const mental = output.signals.find(
      (s) => s.label === sensitiveTopicName('fr', 'mental_health'),
    );
    expect(mental?.sensitive).toBe(true);
    expect(mental?.evidence).toHaveLength(1);
    // Le terme qui franchit est ÉPINGLÉ, pas seulement le label : c'est ce qui distingue une
    // couverture assumée d'un décompte. Si un autre terme d'un lot commençait à franchir, cette
    // ligne le dirait au lieu de le laisser se fondre dans un total inchangé.
    expect(mental?.evidence[0]?.triggerTerms).toEqual(['burnout']);
  });

  // Ce test AFFIRMAIT le contraire — « l'insulte ciblée EN ne déclenche PAS conflictual (aucune
  // variante EN au lexique) ». C'était un fil-piège sur la dette EN de ce label, et il a été
  // RETOURNÉ, jamais supprimé : un fil-piège effacé ne laisse aucune trace de ce qu'il gardait.
  // L'assertion négative devient positive, avec son terme épinglé.
  //
  // C'est le SEUL mouvement de rappel du lot EN de `conflictual`, et c'est voulu : le lexique EN
  // est délibérément petit — un ordre de grandeur sous le FR — parce que rien dans un export ne
  // sépare la vanne entre amis de l'agression — cf. l'en-tête de `lexicon/conflictual.ts`. Tout
  // mouvement HORS de cet item unique serait un terme qui sur-matche, et doit se lire comme tel.
  it('l’insulte ciblée EN déclenche conflictual — via « stupid » + la cible « you’re »', () => {
    const signal = output.signals.find((s) => s.label === sensitiveTopicName('fr', 'conflictual'));
    expect(signal, 'la persona EN porte une insulte ciblée : elle doit être lue').toBeDefined();
    expect(signal?.sensitive).toBe(true);
    // Item-level (B5) : un seul item émis suffit, et un seul est attendu.
    expect(signal?.evidence).toHaveLength(1);
    // Le terme épinglé, pas seulement le label — même discipline que « burnout » ci-dessus : si un
    // autre terme du lot se mettait à franchir, cette ligne le dirait.
    expect(signal?.evidence[0]?.triggerTerms).toEqual(['stupid']);
  });

  it('D2 ne retient QUE cinema_series (3 items) — chats n’a aucune variante EN', () => {
    expect(new Set(output.themes.map((t) => t.id))).toEqual(new Set(['cinema_series']));
    expect(
      output.themes.find((t) => t.id === 'cinema_series')?.deductions[0]?.evidence,
    ).toHaveLength(3);
  });

  it('mêmes volumes agrégés que la version FR (24/14/300/2700, 50000/6100/420)', () => {
    expect(output.volumes.searches).toBe(24);
    expect(output.volumes.comments).toBe(14);
    expect(output.volumes.follows).toBe(300);
    expect(output.volumes.endorsements).toBe(2700);
    expect(output.volumes.allTime?.videosWatchedToEnd).toBe(50_000);
    expect(output.rhythm?.videosWatched.last12Months).toBe(6100);
    expect(output.rhythm?.videosWatched.last30Days).toBe(420);
  });
});
