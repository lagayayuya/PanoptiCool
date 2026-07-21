// Harnais commun des bancs de registres (PANO-35) — la mécanique de mesure, sans aucune donnée.
//
// Les DEUX bancs (EN, FR) partagent leur comptage parce que la doctrine qu'il applique est une :
// trois états de vérité-terrain, deux compteurs qui ne s'additionnent jamais, et le tort défini
// comme « non-porteur tagué » (ADR-0003, *L'incertitude*). Recopier ce comptage par langue, c'est
// fabriquer une divergence à retardement — le jour où l'un des deux compterait la
// sur-classification dans le tort, plus rien ne serait comparable.
//
// Ce qui reste PROPRE à chaque langue vit dans son fichier de test : les attendus figés, les
// commentaires qui disent ce que la mesure a trouvé, et les gardes spécifiques (les cinq termes
// retirés côté EN, le tier colloquial côté FR). Le harnais n'a pas d'opinion, il compte.

import { expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { detectLabels, type LabelDetection } from './detect';
import {
  type GroundTruth,
  type RegisterPersona,
  SENSITIVE_LABELS,
  type SensitiveLabel,
} from './register-bench';

/**
 * Une détection réduite à des lignes stables, lisibles en diff :
 * `label[étage AGRÉGÉ] #item étage-DE-L-ITEM surfaces`.
 *
 * Les DEUX étages sont portés, et ce n'est pas de la redondance : l'agrégé décide du constat (nommé
 * ou large), celui de l'item est là où se lit la dégradation — 3ᵉ personne ou registre
 * informationnel. N'en garder qu'un rendait le capteur aveugle aux règles d'étage, qui sont
 * pourtant la moitié de ce que ces bancs surveillent. Mesuré : sans l'étage d'item, retirer un
 * marqueur de `THIRD_PERSON_EN` ne faisait pas rougir le banc.
 */
export function fingerprint(detections: readonly LabelDetection<SensitiveLabel>[]): string[] {
  return detections.flatMap((d) =>
    d.items.map(
      (it) => `${d.label}[${d.stage}] #${it.itemIndex} ${it.stage} ${it.surfaces.join('+')}`,
    ),
  );
}

export function detectFor(persona: RegisterPersona): LabelDetection<SensitiveLabel>[] {
  return detectLabels(
    persona.items.map((i) => i.text),
    WIRED_LEXICONS,
  ) as LabelDetection<SensitiveLabel>[];
}

export interface Cell {
  persona: RegisterPersona;
  label: SensitiveLabel;
  truth: GroundTruth;
  detection: LabelDetection<SensitiveLabel> | undefined;
}

export function allCells(personas: readonly RegisterPersona[]): Cell[] {
  const cells: Cell[] = [];
  for (const persona of personas) {
    const detections = detectFor(persona);
    for (const label of SENSITIVE_LABELS) {
      cells.push({
        persona,
        label,
        truth: persona.truth[label],
        detection: detections.find((d) => d.label === label),
      });
    }
  }
  return cells;
}

const key = (c: Cell) => `${c.persona.id}/${c.label}`;

/** Un désaccord ASSUMÉ entre la vérité-terrain scellée et ce que la mesure a montré. */
export interface AnnotatorCorrection {
  personaId: string;
  label: SensitiveLabel;
  sealed: GroundTruth;
  corrected: GroundTruth;
  why: string;
}

export interface BenchExpectations {
  /** Non-porteurs tagués — le SEUL tort compté. */
  torts: readonly string[];
  /** Signaux sans vécu promus en constat NOMMÉ : le tag est légitime, l'étage ne l'est pas. */
  escalated: readonly string[];
  /** Corrections d'annotateur déclarées — elles ne relâchent aucun attendu, elles publient un
   *  second chiffre à côté du premier. */
  corrections: readonly AnnotatorCorrection[];
  /** Torts restants une fois les corrections déclarées appliquées. */
  tortsAfterCorrection: readonly string[];
  /**
   * Les vécus NON tagués, déclarés un par un — un défaut de rappel qu'on publie plutôt que de le
   * cacher derrière une vérité-terrain réécrite.
   *
   * Optionnel, et le défaut est le plus strict (`[]`, soit « aucun rappel manqué ») : un banc qui
   * omet le champ garde donc exactement l'assertion qu'il avait avant que ce champ existe. Ajouté
   * parce qu'un `[]` en dur interdisait de sceller un vécu sur un label dont l'anglais n'a rien à
   * détecter — la seule issue aurait été de dégrader le sceau pour arranger le vert, c'est-à-dire
   * l'inverse exact de ce que ces bancs protègent.
   */
  missedRecall?: readonly string[];
  /**
   * Les signaux SANS VÉCU non tagués, déclarés un par un — le pendant exact de `missedRecall` sur
   * l'autre compteur, et le même défaut le plus strict (`[]`).
   *
   * Ajouté pour la même raison, et elle s'est présentée deux fois : un `[]` en dur interdisait de
   * sceller un proche aidant sur un label dont l'anglais n'a rien à détecter. La seule issue aurait
   * été de dégrader le sceau pour arranger le vert — l'inverse exact de ce que ces bancs protègent.
   */
  missedSignal?: readonly string[];
  /**
   * L'étage ATTENDU pour chaque persona `lived`, par identifiant.
   *
   * Paramétré, et non fixé à `explicit`, parce que **vécu et nommé sont deux axes distincts**.
   * ADR-0003 (*Le mécanisme*) pose la règle dure : un constat précis n'apparaît QUE si le terme
   * précis est présent. Une personne réellement en détresse qui n'écrit aucun terme clinique doit
   * donc produire un constat **large** — la nommer serait la violation, pas le service. Écrire
   * `lived ⇒ explicit` dans le harnais fusionnait les deux axes et aurait interdit d'ajouter la
   * voix qui ne se nomme pas.
   *
   * `AUCUN` est le troisième étage possible, et il n'est pas une commodité : c'est un vécu que rien
   * n'a tagué. Il se déclare ICI **et** dans `missedRecall` — deux fois, à dessein, parce qu'un
   * rappel manqué doit coûter deux lignes à écrire et se voir dans les deux relectures.
   */
  livedStages: Readonly<Record<string, 'explicit' | 'indirect' | 'AUCUN'>>;
}

/**
 * Émet le comptage commun. Appelé DANS un `describe` propre à la langue.
 *
 * Les attendus sont passés en paramètre plutôt que calculés : un banc qui déduirait son propre
 * attendu de la sortie courante ne mesurerait rien. Ce sont des valeurs relevées, puis figées.
 */
export function expectBenchCounts(
  personas: readonly RegisterPersona[],
  expectations: BenchExpectations,
): void {
  const cells = allCells(personas);

  it("TORT — un non-porteur tagué, et rien d'autre n'est compté ici", () => {
    const torts = cells.filter((c) => c.truth === 'nonCarrier' && c.detection !== undefined);
    expect(torts.map(key)).toEqual(expectations.torts);
  });

  it('RAPPEL — le vécu est bien tagué (sans quoi les zéros ne prouveraient rien)', () => {
    const missed = cells.filter((c) => c.truth === 'lived' && c.detection === undefined);
    expect(missed.map(key)).toEqual(expectations.missedRecall ?? []);
  });

  it("SIGNAL SANS VÉCU — tagué comme attendu : c'est la démonstration, pas un tort", () => {
    const untagged = cells.filter(
      (c) => c.truth === 'signalWithoutLived' && c.detection === undefined,
    );
    expect(untagged.map(key)).toEqual(expectations.missedSignal ?? []);
  });

  it('SUR-CLASSIFICATION — un signal sans vécu promu en constat NOMMÉ', () => {
    // Le tort propre à cet état : le tag est légitime, l'ÉTAGE ne l'est pas. Un constat nommé porte
    // la confiance haute et le quasi-factuel (« tu as écrit ce terme »).
    const escalated = cells.filter(
      (c) => c.truth === 'signalWithoutLived' && c.detection?.stage === 'explicit',
    );
    expect(escalated.map(key)).toEqual(expectations.escalated);
  });

  it("VÉCU — l'étage du vrai positif tient, et c'est le critère d'arrêt des règles d'étage", () => {
    // Écrit comme une assertion à part, et pas comme un corollaire du rappel : une règle d'étage
    // trop large ne fait pas disparaître le constat, elle l'abaisse — donc le compteur de rappel
    // resterait vert pendant que le vrai positif perdrait son étage. C'est précisément le mode de
    // défaillance qui a fait écarter l'ancrage 1ʳᵉ personne (ADR-0003, *Le registre informationnel*).
    //
    // L'étage attendu vient de la table, jamais d'un `explicit` présumé : celle qui vit la chose sans
    // jamais la nommer doit rester en LARGE, et un `explicit` sur elle serait un constat nommé
    // fabriqué sans terme — l'inverse exact de ce qu'on surveille.
    const observed: Record<string, string> = {};
    for (const c of cells.filter((x) => x.truth === 'lived')) {
      observed[key(c)] = c.detection?.stage ?? 'AUCUN';
    }
    // La clé attendue se construit depuis le LABEL réellement `lived` de la persona, jamais depuis
    // `mental_health` en dur : les deux bancs n'ont pour l'instant que des vécus de santé mentale,
    // et une constante suffirait — jusqu'à la première persona vécue sur un autre label, où la
    // comparaison porterait sur une clé qui n'existe pas et où la garde passerait au vert sans
    // rien vérifier. Une garde qui peut se taire n'en est pas une.
    const attendu: Record<string, string> = {};
    for (const [id, stage] of Object.entries(expectations.livedStages)) {
      const cell = cells.find((c) => c.persona.id === id && c.truth === 'lived');
      if (cell === undefined) {
        throw new Error(`\`livedStages\` cite \`${id}\`, qui n'a aucun label \`lived\``);
      }
      attendu[key(cell)] = stage;
    }
    expect(observed).toEqual(attendu);
  });

  it("la correction d'annotation est déclarée, et elle ne relâche aucun attendu", () => {
    for (const correction of expectations.corrections) {
      const persona = personas.find((p) => p.id === correction.personaId);
      // Le sceau doit être INTACT : si la vérité-terrain avait été réécrite pour arranger le
      // chiffre, c'est ici que ça se verrait.
      expect(persona?.truth[correction.label]).toBe(correction.sealed);
      expect(correction.corrected).not.toBe(correction.sealed);
    }
    const remaining = cells.filter(
      (c) =>
        c.truth === 'nonCarrier' &&
        c.detection !== undefined &&
        !expectations.corrections.some((k) => k.personaId === c.persona.id && k.label === c.label),
    );
    expect(remaining.map(key)).toEqual(expectations.tortsAfterCorrection);
  });
}
