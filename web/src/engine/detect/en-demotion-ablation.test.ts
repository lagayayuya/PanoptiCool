// ABLATION — le sort de trois NOMS NUS de trouble : ce qui a été refusé, et ce qui a été livré.
//
// Ce fichier n'est pas un capteur : c'est une EXPÉRIENCE, figée pour que sa conclusion ne se reperde
// pas. Trois états y sont comparés, et il faut les trois — le refus n'est lisible que si l'on voit
// ce qui a été refusé À CÔTÉ de ce qui a été livré.
//
//   AVANT      — `anxiety`, `depression`, `ptsd` en `explicit`. Ils NOMMAIENT une condition.
//   COLLOQUIAL — la première correction proposée : les descendre au tier polysémique. REFUSÉE.
//   LIVRÉ      — le tier des noms nus (`indirectSolo`) : ils posent le tag large À EUX SEULS, et
//                aucun nombre ne les fait nommer.
//
// ── Pourquoi le colloquial a été refusé, et pourquoi les personas ne le voyaient pas ─────────────
// Mesurée sur les VOIX — six EN, deux de borne haute, six FR — la descente en colloquial ne coûtait
// RIEN : pas un étage du mauvais côté, les trois détresses gardaient leur constat. Un feu vert franc
// sur trois bancs.
//
// Il était faux. Une persona porte TRENTE items : quand `depression` descend, `therapist` ou
// `burnout` tiennent le constat à sa place, et le coût reste invisible. Le cas qui paie n'est pas
// une voix, c'est une PHRASE — quelqu'un qui écrit une fois qu'il fait une dépression, et rien
// d'autre. Sous le seuil de 2, il ne tombait pas en large : il disparaissait. Cinq gardes
// pré-existantes le disaient ; aucune n'était une persona.
//
// C'est le motif que CLAUDE.md décrit sous *Ce qu'un filet prouve* — un banc écrit sur des voix,
// cité comme s'il couvrait le domaine — et il a été commis par qui écrivait le banc.
//
// ── Ce que cette ablation NE couvre PAS ─────────────────────────────────────────────────────────
//   • Elle mesure des ÉTAGES, jamais le tort : le tort sur la voix de pire cas n'est pas refermé
//     par la livraison, seulement abaissé. Il reste compté comme tort dans son banc.
//   • Elle ne dit rien de la voie `selfDeclared` (ancrer par la copule), écartée en amont pour une
//     raison de dépendances, pas de mesure : la copule EN n'est pas livrée.
//   • Trois voix vécues sur quatorze. Un rappel vérifié sur trois personnes n'est pas un rappel
//     vérifié.

import { describe, expect, it } from 'vitest';
import { MENTAL_HEALTH_LEXICON } from '../lexicon/mental-health';
import type { TopicalLexicon } from '../lexicon/types';
import { detectLabels } from './detect';
import { EN_REGISTER_PERSONAS } from './en-registers.fixture';
import { EN_UPPER_BOUND_PERSONAS } from './en-upper-bound.fixture';
import { FR_REGISTER_PERSONAS } from './fr-registers.fixture';
import type { RegisterPersona } from './register-bench';

/** Les trois noms NUS. Leurs SYNTAGMES (`anxiety disorder`, `depression nerveuse`, `post traumatic
 *  stress`…) n'ont jamais bougé : c'est là que se lit la ligne — ce qui nomme un trouble nomme
 *  encore. */
const LES_TROIS = ['anxiety', 'depression', 'ptsd'] as const;

/** Sans les trois, où qu'ils soient — la base commune aux deux reconstructions. */
function sansLesTrois(termes: readonly string[]): TopicalLexicon {
  return {
    ...MENTAL_HEALTH_LEXICON,
    explicit: MENTAL_HEALTH_LEXICON.explicit.filter((t) => !termes.includes(t)),
    indirectSolo: (MENTAL_HEALTH_LEXICON.indirectSolo ?? []).filter((t) => !termes.includes(t)),
    indirectColloquial: MENTAL_HEALTH_LEXICON.indirectColloquial.filter((t) => !termes.includes(t)),
  };
}

/** L'état AVANT : les termes nomment. */
function lexiconAvant(termes: readonly string[]): TopicalLexicon {
  const base = sansLesTrois(termes);
  return { ...base, explicit: [...base.explicit, ...termes] };
}

/** La variante REFUSÉE : les termes descendent au tier polysémique, donc sous le seuil. */
function lexiconColloquial(termes: readonly string[]): TopicalLexicon {
  const base = sansLesTrois(termes);
  return { ...base, indirectColloquial: [...base.indirectColloquial, ...termes] };
}

function persona(id: string): RegisterPersona {
  const p = [...EN_REGISTER_PERSONAS, ...EN_UPPER_BOUND_PERSONAS, ...FR_REGISTER_PERSONAS].find(
    (x) => x.id === id,
  );
  if (p === undefined) {
    throw new Error(`persona \`${id}\` absente`);
  }
  return p;
}

function etageDe(
  texts: readonly string[],
  lexicon: TopicalLexicon,
): 'explicit' | 'indirect' | null {
  return detectLabels(texts, [lexicon])[0]?.stage ?? null;
}

const etage = (p: RegisterPersona, lexicon: TopicalLexicon) =>
  etageDe(
    p.items.map((i) => i.text),
    lexicon,
  );

describe('ablation des trois noms nus — le colloquial refusé, le tier solo livré', () => {
  const avant = lexiconAvant(LES_TROIS);
  const colloquial = lexiconColloquial(LES_TROIS);

  it('CE QUE LA LIVRAISON ACHÈTE (1) — la voix de pire cas perd son constat NOMMÉ', () => {
    const p = persona('clinical_slang');
    expect(etage(p, avant)).toBe('explicit');
    expect(etage(p, MENTAL_HEALTH_LEXICON)).toBe('indirect');
  });

  it('CE QUE LA LIVRAISON ACHÈTE (2) — le résidu du proche aidant se referme', () => {
    // Le gain NON PRÉVU, et le plus intéressant : ce résidu avait résisté aux règles d'ÉTAGE, qui
    // cherchaient à reconnaître un registre. Il tombe par une décision de LEXIQUE, obtenue sur une
    // voix qui n'a rien d'un proche aidant.
    const p = persona('caregiver');
    expect(etage(p, avant)).toBe('explicit');
    expect(etage(p, MENTAL_HEALTH_LEXICON)).toBe('indirect');
  });

  it('CE QUE LA LIVRAISON NE COÛTE PAS — les trois voix vécues gardent leur constat', () => {
    expect(etage(persona('distress'), MENTAL_HEALTH_LEXICON)).toBe('explicit');
    expect(etage(persona('fr_distress'), MENTAL_HEALTH_LEXICON)).toBe('explicit');
    expect(etage(persona('fr_distress_colloquial'), MENTAL_HEALTH_LEXICON)).toBe('indirect');
  });

  it('CE QUE LE COLLOQUIAL AURAIT COÛTÉ — la phrase seule DISPARAÎT, dans les deux langues', () => {
    // Le résultat qui a fait refuser la première correction, et le critère d'arrêt du lot. Une
    // personne qui écrit une fois, littéralement, ce qu'elle vit — sans vocabulaire de soin autour
    // pour la rattraper. Sous le tier polysémique elle n'existe plus ; sous le tier solo elle est
    // taguée en large.
    const fr = ['je fais une depression depuis le mois de novembre'];
    const en = ['i was diagnosed with depression last year'];
    for (const phrase of [fr, en]) {
      expect(etageDe(phrase, avant)).toBe('explicit');
      expect(etageDe(phrase, colloquial)).toBeNull();
      expect(etageDe(phrase, MENTAL_HEALTH_LEXICON)).toBe('indirect');
    }
  });

  it('LE FAUX VERT — sur les quatorze voix, le colloquial semblait gratuit', () => {
    // Ce test ne garde pas un acquis : il garde une ILLUSION, pour que personne ne la retrouve seul
    // et n'en tire la même conclusion. Aucune voix ne révèle le coût, parce qu'une voix a trente
    // items et que le voisinage rattrape toujours le terme qui tombe.
    expect(etage(persona('distress'), colloquial)).toBe('explicit');
    expect(etage(persona('fr_distress'), colloquial)).toBe('explicit');
    for (const p of FR_REGISTER_PERSONAS) {
      expect(etage(p, colloquial)).toBe(etage(p, MENTAL_HEALTH_LEXICON));
    }
  });

  it('LES TROIS SONT CONJOINTEMENT NÉCESSAIRES — aucun sous-ensemble propre ne suffit', () => {
    // La voix de pire cas portait EXACTEMENT trois hits nommés : en laisser un suffit à nommer. Une
    // correction partielle n'aurait pas été une demi-mesure, mais une non-mesure.
    for (const terme of LES_TROIS) {
      const unSeulRemonte = lexiconAvant([terme]);
      expect(etage(persona('clinical_slang'), unSeulRemonte)).toBe('explicit');
    }
    // `anxiety` fait exception dans l'autre sens : lui seul portait le résidu du proche aidant.
    expect(etage(persona('caregiver'), lexiconAvant(['anxiety']))).toBe('explicit');
    expect(etage(persona('caregiver'), lexiconAvant(['depression']))).toBe('indirect');
    expect(etage(persona('caregiver'), lexiconAvant(['ptsd']))).toBe('indirect');
  });

  it('LA MARGE — le seul vrai positif EN ne tient plus son constat NOMMÉ que par `burnout`', () => {
    // Gardé parce que c'est le genre de dépendance qui se paie tard. Avant la livraison, `distress`
    // portait trois termes nommants (`depression`, `anxiety`, `burnout`) : la marge était de trois.
    // Elle est désormais de UN.
    //
    // Or `burnout` est un nom nu, et la règle qui vient de descendre les trois autres l'y invite
    // exactement de la même façon. Qui voudra le descendre doit voir d'abord que le seul vrai
    // positif anglais du dépôt perdrait son constat nommé — pas qu'il disparaîtrait (le tier solo
    // le rattraperait), mais la démonstration n'aurait plus aucun constat NOMMÉ de tout le banc EN.
    const p = persona('distress');
    const sansBurnout: TopicalLexicon = {
      ...MENTAL_HEALTH_LEXICON,
      explicit: MENTAL_HEALTH_LEXICON.explicit.filter((t) => t !== 'burnout'),
    };
    expect(etage(p, MENTAL_HEALTH_LEXICON)).toBe('explicit');
    expect(etage(p, sansBurnout)).toBe('indirect');
    // La marge d'AVANT, pour que la comparaison soit lisible et pas seulement affirmée.
    expect(etage(p, { ...avant, explicit: avant.explicit.filter((t) => t !== 'burnout') })).toBe(
      'explicit',
    );
  });

  it('LA DÉCISION — les trois vivent au tier des noms nus, ni ailleurs ni nulle part', () => {
    // Le verrou. Les remonter en `explicit` rend l'affirmation ; les descendre en colloquial
    // rouvre le trou de la phrase seule. Les deux erreurs sont rouges ici.
    for (const terme of LES_TROIS) {
      expect(MENTAL_HEALTH_LEXICON.indirectSolo ?? []).toContain(terme);
      expect(MENTAL_HEALTH_LEXICON.explicit).not.toContain(terme);
      expect(MENTAL_HEALTH_LEXICON.indirectColloquial).not.toContain(terme);
    }
    // Les syntagmes nomment toujours — sans eux, la livraison serait une éviction déguisée.
    for (const syntagme of ['anxiety disorder', 'post traumatic stress', 'depression nerveuse']) {
      expect(MENTAL_HEALTH_LEXICON.explicit).toContain(syntagme);
    }
  });
});
