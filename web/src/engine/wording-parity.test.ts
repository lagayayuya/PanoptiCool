// LA PARITÉ FR/EN DU WORDING — épinglée au COMPILATEUR, pas seulement à l'exécution.
//
// POURQUOI CE FICHIER EXISTE. `wording.ts` annonce que le compilateur tient la parité dans les deux
// sens. Cette garantie repose sur une condition qui NE SE VOIT PAS À LA LECTURE : les tables de
// `wording.fr.ts` doivent rester des LITTÉRAUX NON ANNOTÉS. Le jour où quelqu'un écrit
// `readings: { … } as Readonly<Record<string, string>>` — le réflexe naturel, et ce que faisait
// l'ex-fichier monolingue — `typeof FR` cesse de porter les clés, et une table anglaise VIDE compile
// sans une erreur. Mesuré, pas supposé.
//
// La garantie tomberait donc EN SILENCE, et tout ce qui s'appuie dessus deviendrait faux du même
// coup : `readingKeys()`/`hasReading()` ne lisent QUE le français, en s'autorisant du fait que les
// deux jeux de clés sont identiques par construction. Ce raisonnement est correct tant que la
// condition tient, et faux à la seconde où elle cesse — sans qu'aucun test rouge ne le dise.
//
// COMMENT IL S'Y PREND. Les `@ts-expect-error` ci-dessous sont des assertions à part entière : si la
// parité cesse d'être tenue, l'erreur attendue n'est plus émise, la directive devient « unused » et
// **`astro check` échoue**. Le filet est donc au TYPECHECK, pas au runtime — c'est le seul endroit
// où la propriété existe.
//
// ─── CE QUE CE FILET NE COUVRE PAS ──────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md : un mécanisme de preuve déclare sa frontière.
//   - IL NE PROUVE RIEN SUR LE CONTENU. Une entrée anglaise qui recopie mot pour mot le français
//     passe ici, et passera partout ailleurs. La parité prouve qu'une entrée EXISTE, jamais qu'elle
//     est TRADUITE — cette moitié-là est une relecture humaine, et elle n'a pas de filet ;
//   - IL NE COUVRE PAS LA COUVERTURE DU LEXIQUE. Que les tables portent les clés RÉELLES des
//     lexiques est une autre propriété, tenue par `d1/d2-wording-coverage.test.ts` ;
//   - IL NE TESTE QU'UN ÉCHANTILLON DE FORMES. Une table témoin par catégorie (fermée, ouverte),
//     pas les quatre tables. Ce qu'il épingle est le MÉCANISME — si l'annotation revenait, elle
//     reviendrait par réflexe global, pas sur une table isolée.

import { describe, expect, it } from 'vitest';
import { hasReading, hasThemeLabel, hasUsage, readingKeys } from './wording';
import { EN } from './wording.en';
import { FR } from './wording.fr';

// ─── (1) LE FILET AU TYPECHECK ──────────────────────────────────────────────────────────────────
// Ces déclarations ne s'exécutent jamais. Leur rôle est d'échouer À LA COMPILATION si la parité
// n'est plus tenue. Chaque `@ts-expect-error` porte sur la LIGNE SUIVANTE — attention en éditant :
// un littéral coupé sur plusieurs lignes déplace l'erreur et rend la directive « unused » pour une
// raison qui n'est pas la bonne (piège rencontré en mettant ce filet au point).

type Bundle = typeof FR;

// Une table OUVERTE à qui il manque une clé doit être REFUSÉE.
// @ts-expect-error — `readings` amputé d'une lecture : le compilateur doit le voir.
const _MISSING_READING: Bundle['readings'] = { 'sensitive.mental-health.reading.lived': 'x' };

// Une clé INCONNUE doit être REFUSÉE (l'autre sens de la parité).
// @ts-expect-error — `usages` avec une clé fantôme : le compilateur doit le voir.
const _GHOST_USAGE: Bundle['usages'] = { ...FR.usages, 'usage.advertiser.ghost': 'x' };

// Une table FERMÉE (union `SensitiveLabel`) à qui il manque un label doit être REFUSÉE.
// @ts-expect-error — un label béni sans nom court ne compile pas.
const _MISSING_LABEL: Bundle['sensitiveTopicName'] = { mental_health: 'x' };

// ─── (2) LE FILET AU RUNTIME ────────────────────────────────────────────────────────────────────
// Le typecheck ci-dessus est le vrai filet, mais il ne tourne pas sous Vitest : ces assertions-ci
// rendent la propriété VISIBLE dans la sortie de test, et attrapent le cas où quelqu'un
// désactiverait les directives ci-dessus sans les retirer.

describe('wording — parité FR/EN', () => {
  const TABLES = [
    'readings',
    'themeLabels',
    'usages',
    'actorLabels',
    'sensitiveTopicName',
  ] as const;

  for (const table of TABLES) {
    it(`\`${table}\` porte exactement les mêmes clés en FR et en EN`, () => {
      expect(Object.keys(EN[table]).sort()).toEqual(Object.keys(FR[table]).sort());
    });
  }

  // Les tables ne doivent pas être VIDES : une parité entre deux tables vides est vraie et inutile.
  // C'est le contrôle « par quel chemin le zéro arrive » exigé par CLAUDE.md — ici, la vérification
  // que l'égalité ci-dessus porte sur quelque chose.
  it('les tables comparées ne sont pas vides (l’égalité ci-dessus porte sur du contenu)', () => {
    for (const table of TABLES) {
      expect(Object.keys(FR[table]).length, table).toBeGreaterThan(0);
    }
  });

  // Les résolveurs `hasX`/`readingKeys` ne lisent QUE le français, en s'autorisant de la parité.
  // Si la parité tombait, ils mentiraient sur l'anglais sans qu'aucun autre test ne le dise.
  it('les résolveurs de clés valent pour l’anglais aussi (ce qu’ils supposent sans le dire)', () => {
    for (const key of Object.keys(EN.readings)) {
      expect(hasReading(key), `lecture EN absente du routage : ${key}`).toBe(true);
    }
    for (const key of Object.keys(EN.themeLabels)) {
      expect(hasThemeLabel(key), `thème EN absent du routage : ${key}`).toBe(true);
    }
    for (const key of Object.keys(EN.usages)) {
      expect(hasUsage(key), `usage EN absent du routage : ${key}`).toBe(true);
    }
    expect(readingKeys().length).toBe(Object.keys(EN.readings).length);
  });

  // Les trois témoins de la section (1) n'ont AUCUN travail à l'exécution : le leur est fait quand
  // `tsc` les lit. Ce test ne les vérifie pas — il les RÉFÉRENCE, pour qu'aucun outil ne les prenne
  // pour du code mort et ne les retire, ce qui décrocherait le filet de typecheck sans un bruit.
  it('les témoins de typecheck sont référencés (ils travaillent à la compilation, pas ici)', () => {
    expect([_MISSING_READING, _GHOST_USAGE, _MISSING_LABEL]).toHaveLength(3);
  });
});
