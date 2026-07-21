// L'INVARIANT DU `claim` — une phrase si et seulement si aucun éventail de lectures.
//
// ── Pourquoi ce fichier existe ───────────────────────────────────────────────────────────────────
// `Deduction.claim` est OPTIONNEL, et un champ optionnel dont personne ne connaît la règle est
// exactement ce qu'il ne faut pas laisser derrière soi. Le type ne peut pas exprimer le « si et
// seulement si » : l'éventail vit sur `Evidence.readings`, donc sur les PREUVES, pas sur le constat
// — un type de constat ne peut pas s'y référer. L'exprimer voudrait dire remonter l'éventail au
// constat, ce qui est un autre chantier que celui-ci.
//
// La règle est donc tenue ICI plutôt que par le compilateur, et elle est écrite pour être lue :
//
//   un constat porte une PHRASE ⟺ il ne porte AUCUN éventail
//
// Ce n'est PAS « sensible ou non ». Deux populations sans éventail gardent leur phrase :
//   · `conflictual` — pas d'éventail par doctrine (B5 : l'insulte émise EST le signal explicite, il
//     n'y a pas de lecture plurielle à proposer). Sa phrase porte en plus le CRITÈRE B5 — propos
//     ÉMIS, VISANT un autre utilisateur — que le titre « Conflictuel » ne dit pas ;
//   · les INTÉRÊTS (D2) — pas d'éventail non plus, et leur phrase porte un décompte.
//
// ── Ce que ce fichier NE couvre PAS ──────────────────────────────────────────────────────────────
// Il vérifie la COHÉRENCE de la sortie du moteur sur un corpus synthétique, pas que le rendu honore
// la règle : c'est `render-golden` qui montre la carte, et `fan-readings.test.ts` qui garantit
// qu'aucune lecture n'est perdue à l'affichage. Il ne dit rien non plus des labels qu'aucun corpus
// de test ne déclenche — il vérifie ce qu'il atteint, et pas davantage.

import { describe, expect, it } from 'vitest';
import type { Deduction } from './analysis';
import { analyze } from './analyze';
import { normalizeExport } from './normalize';
import type { CommentItem, SearchItem, TikTokExport } from './tiktok-export';
import { validTikTokExport } from './valid-export.fixture';

/** Corpus déclenchant les deux populations : des labels à éventail, `conflictual`, et un intérêt. */
const CORPUS = [
  'ma dépression me suit depuis des années',
  'je cherche un bon psy dans le coin',
  "t'es vraiment un abruti d'avoir écrit ça",
  'grosse manif demain contre la réforme',
  'les élections approchent, allez voter',
  'encore une soirée sur mon jeu vidéo préféré avec la manette',
  'un bon jeu video et une partie tranquille ce soir',
];

function analyse() {
  const base = validTikTokExport() as TikTokExport & {
    Comment: { Comments: { CommentsList: readonly CommentItem[] } };
    'Your Activity': { Searches: { SearchList: readonly SearchItem[] } };
  };
  base.Comment.Comments.CommentsList = CORPUS.map((comment, i) => ({
    date: `2026-06-15 10:00:0${i % 10} UTC`,
    comment,
    photo: '',
    video: '',
    sticker: '',
    originalPostUrl: '',
    'original post link': '',
  }));
  return analyze(normalizeExport(base), Date.UTC(2026, 6, 16, 12, 0, 0));
}

/** Tous les constats de l'analyse — signaux D1 et déductions de thème D2 confondus. */
function tousLesConstats(): { nom: string; deduction: Deduction }[] {
  const out = analyse();
  return [
    ...out.signals.map((s) => ({ nom: s.label, deduction: s as Deduction })),
    ...out.themes.flatMap((t) => t.deductions.map((d) => ({ nom: t.label, deduction: d }))),
  ];
}

const porteUnEventail = (d: Deduction) => d.evidence.some((e) => e.readings !== undefined);

describe('`claim` ⟺ pas d’éventail', () => {
  it('le corpus déclenche bien les DEUX populations (le test ne passe pas à vide)', () => {
    const constats = tousLesConstats();
    expect(constats.some((c) => porteUnEventail(c.deduction))).toBe(true);
    expect(constats.some((c) => !porteUnEventail(c.deduction))).toBe(true);
  });

  it('un constat à ÉVENTAIL ne porte JAMAIS de phrase', () => {
    const fautifs = tousLesConstats()
      .filter((c) => porteUnEventail(c.deduction) && c.deduction.claim !== undefined)
      .map((c) => `${c.nom} : « ${c.deduction.claim} »`);
    expect(fautifs).toEqual([]);
  });

  it('un constat SANS éventail porte TOUJOURS une phrase — sans quoi sa carte serait muette', () => {
    // C'est la moitié qui protège : un constat sans éventail ET sans phrase n'aurait plus aucun
    // texte du tout. C'est précisément le risque qu'aurait couru `conflictual` si la règle avait été
    // « pas de phrase sur le sensible » au lieu de « pas de phrase quand il y a un éventail ».
    const muets = tousLesConstats()
      .filter((c) => !porteUnEventail(c.deduction) && c.deduction.claim === undefined)
      .map((c) => c.nom);
    expect(muets).toEqual([]);
  });
});
