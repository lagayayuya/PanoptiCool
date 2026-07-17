// Tests du parseur JSON en flux (PANO-91). Deux garanties : (1) FIDÉLITÉ — même résultat que
// `JSON.parse` sur les formes que porte un export TikTok (le canari anti-divergence) ; (2) REPLI —
// un tableau désigné n'est jamais matérialisé (ses items passent par `onItem`, la valeur finale est
// celle du replieur), preuve du mécanisme mémoire.

import { describe, expect, it } from 'vitest';
import { type ArrayFold, type FoldResolver, JsonStreamError, parseJsonStream } from './json-stream';

/** Aucun repli — le parseur doit se comporter comme `JSON.parse`. */
const noFold: FoldResolver = () => null;

/** Parse et compare à `JSON.parse` (référence). */
function expectSameAsJsonParse(text: string): void {
  expect(parseJsonStream(text, noFold)).toEqual(JSON.parse(text));
}

describe('parseJsonStream — fidélité à JSON.parse', () => {
  it('scalaires', () => {
    for (const text of ['true', 'false', 'null', '0', '-1', '3.14', '1e3', '-2.5e-2', '"hello"']) {
      expectSameAsJsonParse(text);
    }
  });

  it('chaînes avec échappements', () => {
    expectSameAsJsonParse('"a\\"b"');
    expectSameAsJsonParse('"ligne\\nretour\\ttab"');
    expectSameAsJsonParse('"slash\\/back\\\\"');
    expectSameAsJsonParse('"unicode \\u00e9\\u00e8"'); // é è
    expectSameAsJsonParse('"\\b\\f\\r"');
  });

  it('objets et tableaux imbriqués, avec blancs', () => {
    expectSameAsJsonParse('{ "a" : 1 , "b" : [ 1 , 2 , 3 ] }');
    expectSameAsJsonParse('{"nested":{"deep":{"x":[true,false,null]}},"arr":[]}');
    expectSameAsJsonParse('\n\t{ "empty": {}, "list": [] }\n');
    expectSameAsJsonParse('[{"k":"v"},{"k":"w"}]');
  });

  it('formes typiques d’un export (clés à espaces/casse, dates, liens)', () => {
    const text = JSON.stringify({
      'Your Activity': {
        'Watch History': {
          VideoList: [
            { Date: '2024-01-15 00:30:00', Link: 'https://x/1/', Title: '' },
            { Date: '2024-02-15 12:30:00', Link: 'https://x/2/', Title: 'un titre' },
          ],
        },
      },
      Comment: { Comments: { App: 0, CommentsList: null } },
    });
    expectSameAsJsonParse(text);
  });

  it('clé dupliquée : « dernière gagne » comme JSON.parse (limite assumée)', () => {
    expectSameAsJsonParse('{"a":1,"a":2}');
  });

  it('rejette la malformation (JsonStreamError), ne devine pas', () => {
    for (const bad of ['', '{', '[1,', '{"a":}', 'tru', '{"a" 1}', '[1 2]', '"nonferme', '01x']) {
      expect(() => parseJsonStream(bad, noFold)).toThrow(JsonStreamError);
    }
  });

  it('rejette le contenu superflu après la racine', () => {
    expect(() => parseJsonStream('{} {}', noFold)).toThrow(JsonStreamError);
    expect(() => parseJsonStream('1 2', noFold)).toThrow(JsonStreamError);
  });
});

describe('parseJsonStream — repli de tableau (mécanisme mémoire)', () => {
  it('replie le tableau au chemin visé : items via onItem, valeur finale = celle du replieur', () => {
    const seen: unknown[] = [];
    const fold: FoldResolver = (path) =>
      path.length === 2 && path[0] === 'big' && path[1] === 'items'
        ? {
            onItem(value) {
              seen.push(value);
            },
            finalize: () => ({ count: seen.length }),
          }
        : null;

    const text = JSON.stringify({
      big: { items: [{ n: 1 }, { n: 2 }, { n: 3 }] },
      other: [10, 20],
    });
    const result = parseJsonStream(text, fold) as {
      big: { items: unknown };
      other: unknown;
    };

    // Le tableau replié (à la clé `items`) est remplacé par la valeur du replieur — jamais matérialisé.
    expect(result.big.items).toEqual({ count: 3 });
    // Les items ont bien transité par onItem.
    expect(seen).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }]);
    // Un tableau NON ciblé (`other`) est matérialisé normalement.
    expect(result.other).toEqual([10, 20]);
  });

  it('replie un tableau VIDE (finalize appelé, onItem jamais)', () => {
    let items = 0;
    const fold: FoldResolver = (path) =>
      path[0] === 'items' && path.length === 1
        ? {
            onItem() {
              items += 1;
            },
            finalize: () => 'REPLIÉ',
          }
        : null;
    const result = parseJsonStream('{"items":[]}', fold) as { items: unknown };
    expect(result.items).toBe('REPLIÉ');
    expect(items).toBe(0);
  });

  it('ne retient qu’UN item à la fois (le replieur ne garde pas la liste)', () => {
    // Preuve indirecte : sur un gros tableau, un replieur qui ne compte que le max simultané resterait
    // à 1 s'il oubliait chaque item — mais on ne peut pas observer le GC ; on vérifie plutôt que le
    // replieur voit CHAQUE item exactement une fois et dans l'ordre, sans qu'aucune liste ne survive.
    const n = 5000;
    let sum = 0;
    let last = -1;
    let ordered = true;
    const fold: ArrayFold = {
      onItem(value) {
        const i = (value as { i: number }).i;
        if (i !== last + 1) ordered = false;
        last = i;
        sum += i;
      },
      finalize: () => null,
    };
    const items = Array.from({ length: n }, (_, i) => ({ i })); // 0..n-1
    const result = parseJsonStream(`{"items":${JSON.stringify(items)}}`, (p) =>
      p[0] === 'items' ? fold : null,
    ) as { items: unknown };

    expect(result.items).toBeNull(); // finalize a remplacé le tableau
    expect(ordered).toBe(true);
    expect(last).toBe(n - 1);
    expect(sum).toBe((n * (n - 1)) / 2);
  });
});
