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
      new Set([sensitiveTopicName('mental_health'), sensitiveTopicName('conflictual')]),
    );
  });

  it('mental_health est un constat sensible avec un unique signal explicite (la recherche burn out)', () => {
    const signal = output.signals.find((s) => s.label === sensitiveTopicName('mental_health'));
    expect(signal?.sensitive).toBe(true); // ex-`sensitivity === 3`, toujours 3 (§2.1)
    expect(signal?.evidence).toHaveLength(1); // ex-`value.signalCount`
  });

  it('conflictual porte un unique signal explicite (l’insulte ciblée)', () => {
    const signal = output.signals.find((s) => s.label === sensitiveTopicName('conflictual'));
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

  it('D1 ne sort RIEN en anglais (mental_health/conflictual : lexiques FR-only, PANO-88 ne les couvre pas)', () => {
    expect(output.signals).toHaveLength(0);
  });

  it('D2 ne retient QUE cinema_series (3 items) — chats n’a aucune variante EN', () => {
    expect(new Set(output.themes.map((t) => t.id))).toEqual(new Set(['cinema_series']));
    expect(
      output.themes.find((t) => t.id === 'cinema_series')?.deductions[0]?.evidence,
    ).toHaveLength(3);
  });

  it('mêmes volumes agrégés que la version FR (24/15/300/2700, 50000/6100/420)', () => {
    expect(output.volumes.searches).toBe(24);
    expect(output.volumes.comments).toBe(15);
    expect(output.volumes.follows).toBe(300);
    expect(output.volumes.endorsements).toBe(2700);
    expect(output.volumes.allTime?.videosWatchedToEnd).toBe(50_000);
    expect(output.rhythm?.videosWatched.last12Months).toBe(6100);
    expect(output.rhythm?.videosWatched.last30Days).toBe(420);
  });
});
