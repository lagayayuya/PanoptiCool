// ABLATION — le sort des six formulations colloquiales françaises (PANO-35).
//
// Ce fichier n'est pas un capteur de plus : c'est une EXPÉRIENCE, figée pour que sa conclusion ne se
// reperde pas. Il enregistre une **acceptation mesurée d'un faux positif connu**, ce qui est le genre
// de décision qui disparaît en silence si rien ne la tient.
//
// ── La question, et pourquoi la formulation évidente est biaisée ─────────────────────────────────
// « Ces tournures apparaissent-elles dans une vraie détresse ? » trouve évidemment oui : la question
// est construite pour ça. Celle qui décide, et qui avait fait tomber cinq termes anglais, est :
// **portent-elles un rappel que rien d'autre ne porte ?** Les cinq anglais sont tombés parce que
// `therapist`, `sertraline` et `antidepressants` détectaient déjà la personne — leur retrait coûtait
// zéro. L'instrument est donc une ablation : retirer les termes et regarder qui disparaît.
//
// ── Admission ≠ éviction ─────────────────────────────────────────────────────────────────────────
// La règle d'ADR-0003 (*L'admission d'un terme*) est une règle de PORTE, pas d'expulsion. Ne pas
// admettre un terme ne coûte aucun rappel — on n'a jamais eu le sien. Évicter un terme ratifié coûte
// un rappel qui EXISTE. Une barre haute à l'entrée et une barre haute à la sortie ne sont pas la
// même exigence, et c'est pourquoi ces six-là ne se tranchent pas par doctrine.

import { describe, expect, it } from 'vitest';
import { MENTAL_HEALTH_LEXICON } from '../lexicon/mental-health';
import type { TopicalLexicon } from '../lexicon/types';
import { detectLabels } from './detect';
import { FR_REGISTER_PERSONAS } from './fr-registers.fixture';
import type { RegisterPersona } from './register-bench';

/**
 * Les six formulations sous examen. Cinq vivent dans `indirectColloquial` ; **`j'en peux plus` vit
 * dans `indirectCore`** — le tier « peu ambigu », ce qui rend son éviction plus lourde encore que
 * celle des cinq autres.
 */
const LES_SIX = [
  "j'en peux plus",
  'au bout de ma vie',
  'je craque',
  'a plat',
  'je sature',
  'cafard',
] as const;

/** Le lexique `mental_health` privé de certains termes — variante de test, jamais livrée. */
function lexiconSans(termes: readonly string[]): TopicalLexicon {
  return {
    ...MENTAL_HEALTH_LEXICON,
    indirectCore: MENTAL_HEALTH_LEXICON.indirectCore.filter((t) => !termes.includes(t)),
    indirectColloquial: MENTAL_HEALTH_LEXICON.indirectColloquial.filter((t) => !termes.includes(t)),
  };
}

function persona(id: string): RegisterPersona {
  const p = FR_REGISTER_PERSONAS.find((x) => x.id === id);
  if (p === undefined) {
    throw new Error(`persona \`${id}\` absente`);
  }
  return p;
}

/** L'étage produit pour une persona sous un lexique donné, ou `null` si aucun constat. */
function etage(p: RegisterPersona, lexicon: TopicalLexicon): 'explicit' | 'indirect' | null {
  const texts = p.items.map((i) => i.text);
  return detectLabels(texts, [lexicon])[0]?.stage ?? null;
}

describe("ablation des six formulations FR — ce que le retrait achète et ce qu'il coûte", () => {
  const sansLesSix = lexiconSans(LES_SIX);

  it('CE QUE LE RETRAIT ACHÈTE — le faux positif hyperbolique disparaît entièrement', () => {
    const p = persona('fr_hyperbolic');
    // Une jeune femme qui parle d'un comeback et de macarons, taguée « santé mentale » aujourd'hui.
    expect(etage(p, MENTAL_HEALTH_LEXICON)).toBe('indirect');
    expect(etage(p, sansLesSix)).toBeNull();
  });

  it('CE QUE LE RETRAIT NE COÛTE PAS — la détresse SOIGNÉE est indifférente', () => {
    const p = persona('fr_distress');
    // Exactement le motif qui avait condamné les cinq termes anglais : le vocabulaire du soin
    // (psychologue, sertraline, thérapie) détecte déjà, donc les colloquiaux ne portent rien ici.
    expect(etage(p, MENTAL_HEALTH_LEXICON)).toBe('explicit');
    expect(etage(p, sansLesSix)).toBe('explicit');
  });

  it('CE QUE LE RETRAIT COÛTE — la détresse SANS SOIN disparaît complètement', () => {
    const p = persona('fr_distress_colloquial');
    // C'est le résultat qui décide. Une femme réellement en détresse, sans diagnostic ni suivi,
    // détectée aujourd'hui — et plus détectée du tout après retrait. Pas dégradée : DISPARUE.
    expect(etage(p, MENTAL_HEALTH_LEXICON)).toBe('indirect');
    expect(etage(p, sansLesSix)).toBeNull();
  });

  it("AUCUN terme n'est individuellement porteur — c'est le franchissement du seuil qui l'est", () => {
    // Retirer UN SEUL des six ne change l'étage d'aucune des trois voix. Le mécanisme n'est donc pas
    // « ce terme détecte cette femme », c'est « l'accumulation franchit le seuil de 2 ». La voix sans
    // soin porte 5 hits dont 4 parmi les six ; le cinquième (« au fond du trou », colloquial mais
    // hors des six) reste SEUL après retrait, donc sous le seuil. Elle tombe par le seuil, pas par
    // le vocabulaire.
    for (const terme of LES_SIX) {
      const lex = lexiconSans([terme]);
      expect(etage(persona('fr_hyperbolic'), lex)).toBe('indirect');
      expect(etage(persona('fr_distress_colloquial'), lex)).toBe('indirect');
      expect(etage(persona('fr_distress'), lex)).toBe('explicit');
    }
  });

  it('LA DÉCISION — les six restent, et le faux positif est accepté en connaissance de cause', () => {
    // Critère posé AVANT la mesure : si la voix sans soin survit au retrait, les six partent ; si
    // elle disparaît, ils restent et le faux positif est le prix. Elle disparaît.
    //
    // Ce test est la trace de cette décision. Il n'assère pas un comportement de plus — les trois
    // premiers le font — il énonce que le constat sur `fr_hyperbolic` est un faux positif CONNU,
    // MESURÉ et ACCEPTÉ, et non un défaut qu'on n'aurait pas vu. Le jour où quelqu'un retire les six
    // pour « nettoyer les FP », les tests ci-dessus rougissent et le renvoient ici.
    const fpAccepte = etage(persona('fr_hyperbolic'), MENTAL_HEALTH_LEXICON);
    const rappelPreserve = etage(persona('fr_distress_colloquial'), MENTAL_HEALTH_LEXICON);
    expect(fpAccepte).toBe('indirect');
    expect(rappelPreserve).toBe('indirect');
    // Les six sont TOUJOURS dans le lexique livré. Cette assertion est le verrou de la décision.
    const tousPresents = [
      ...MENTAL_HEALTH_LEXICON.indirectCore,
      ...MENTAL_HEALTH_LEXICON.indirectColloquial,
    ];
    for (const terme of LES_SIX) {
      expect(tousPresents).toContain(terme);
    }
  });
});
