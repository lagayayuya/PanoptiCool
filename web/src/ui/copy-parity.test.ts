// LA PARITÉ FR/EN DE LA COPY D'INTERFACE — ce que le TYPE ne peut pas tenir.
//
// POURQUOI CE FICHIER EXISTE, alors que `copy.en.ts` est annoté `UiCopy` et que le compilateur
// refuse déjà une clé manquante (`ts(2741)`) comme une clé en trop (`ts(2353)`) — les deux mesurés.
// Il reste UN trou, et il est structurel :
//
//   **`typeof` d'un tableau donne `T[]`, jamais un n-uplet.** Une traduction anglaise peut fournir
//   DEUX colonnes là où le français en a TROIS, ou quatre graduations d'axe au lieu de cinq, et
//   compiler sans un mot. Ce périmètre porte DIX tableaux — les colonnes des trois panneaux
//   pédagogiques et du panneau IA, les étapes et cartes de l'accueil, les puces du résumé, les
//   gages de confiance et les graduations horaires —, et une
//   colonne manquante ne se voit pas à la relecture : elle se voit sur la page, en anglais, un jour
//   où plus personne ne compare les deux fichiers.
//
// Le filet est donc au RUNTIME, et il ne double pas le compilateur : il couvre exactement ce que le
// compilateur laisse passer.
//
// ─── CE QUE CE FILET NE COUVRE PAS ──────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md : un mécanisme de preuve déclare sa frontière.
//   - IL NE JUGE PAS LA TRADUCTION. Une entrée anglaise qui recopie le français a la bonne forme,
//     la bonne longueur, et passe. Le témoin de non-recopie plus bas n'attrape que le cas grossier —
//     zéro texte traduit. Entre « rien n'est traduit » et « bien traduit », il n'y a qu'une
//     relecture humaine ;
//   - IL N'ATTEINT PAS L'ÉCRAN. Il compare deux objets. Qu'une chaîne soit RENDUE, au bon endroit,
//     relève des goldens — et aucun golden anglais n'existe tant que le franglais n'est pas levé ;
//   - IL NE VOIT PAS LES ENTRÉES MORTES. Une clé que plus aucun composant ne lit passe comme les
//     autres, dans les deux langues.

import { describe, expect, it } from 'vitest';
import { EN } from './copy.en';
import { FR } from './copy.fr';

/** Chemins de tous les tableaux du bundle, avec leur longueur. Récursif : les tableaux vivent à
 *  plusieurs niveaux (`UI_LEARN_PANELS.rhythm.columns`, `UI_LANDING.feats[].`…). */
function arrayLengths(value: unknown, path = ''): Record<string, number> {
  if (Array.isArray(value)) {
    const own = { [path]: value.length };
    return value.reduce<Record<string, number>>(
      (acc, item, i) => Object.assign(acc, arrayLengths(item, `${path}[${i}]`)),
      own,
    );
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).reduce<Record<string, number>>(
      (acc, [k, v]) => Object.assign(acc, arrayLengths(v, path === '' ? k : `${path}.${k}`)),
      {},
    );
  }
  return {};
}

describe('copy — parité FR/EN', () => {
  it('chaque tableau a la MÊME longueur dans les deux langues (ce que le type ne tient pas)', () => {
    const fr = arrayLengths(FR);
    const en = arrayLengths(EN);
    expect(en).toEqual(fr);
  });

  // Contrôle « par quel chemin le zéro arrive » (CLAUDE.md) : l'égalité ci-dessus serait vraie et
  // VIDE si le balayage ne trouvait aucun tableau — une faute dans `arrayLengths` la rendrait verte
  // pour la pire des raisons.
  //
  // La liste est ÉNUMÉRÉE plutôt que comptée, sur le modèle de la sentinelle des claims dans
  // `engine/wording.test.ts` : un tableau AJOUTÉ fait tomber ce test, et c'est voulu — il oblige à
  // se demander si sa traduction a la bonne longueur, au lieu de le laisser entrer sans regard.
  // À mettre à jour SCIEMMENT, jamais par réflexe.
  it('le balayage trouve exactement les tableaux connus (l’égalité ci-dessus porte sur du contenu)', () => {
    expect(Object.keys(arrayLengths(FR)).sort()).toEqual([
      'UI_ACTIVITY.hourMarks',
      'UI_AI_LEARN.columns',
      'UI_LANDING.feats',
      'UI_LANDING.steps',
      'UI_LANDING.trust',
      'UI_LEARN_PANELS.deductions.columns',
      'UI_LEARN_PANELS.market.columns',
      'UI_LEARN_PANELS.rhythm.columns',
      'UI_RESULTS.summaryActorTakeaways',
      'UI_RESULTS.summaryDataTypes',
    ]);
  });

  it('les deux bundles ne sont pas le même texte (le bundle EN n’est pas une copie)', () => {
    // Comparaison sur les chaînes CONSTANTES uniquement : les fonctions ne se comparent pas, et
    // quelques entrées sont identiques À DESSEIN (marque, URL, glyphes, `previewCommand`).
    const flat = (o: unknown, out: string[] = []): string[] => {
      if (typeof o === 'string') out.push(o);
      else if (o !== null && typeof o === 'object') for (const v of Object.values(o)) flat(v, out);
      return out;
    };
    const frStrings = flat(FR);
    const enStrings = flat(EN);
    expect(frStrings.length).toBe(enStrings.length);
    const identical = frStrings.filter((s, i) => s === enStrings[i]).length;
    // Un bundle recopié rendrait `identical === frStrings.length`. On exige une marge nette.
    expect(identical / frStrings.length).toBeLessThan(0.2);
  });
});
