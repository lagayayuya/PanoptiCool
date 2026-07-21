// Banc EN de borne haute — le CAPTEUR de la paire. Personas et vérité-terrain dans
// `en-upper-bound.fixture.ts`, scellées par un commit ANTÉRIEUR à ce fichier : c'est l'historique,
// et lui seul, qui prouve que les attendus n'ont pas été ajustés à la mesure. Le comptage est celui
// des autres bancs de registres (`register-bench.harness.ts`) ; ce fichier ne porte que ce qui est
// propre à la paire.
// ⚠ SCEAU ET HISTORIQUE PUBLIÉ. La recomposition d'avant publication (2026-07-21) a aplati
// l'historique de travail : fixture et capteur y naissent dans le même commit. La preuve d'ORDRE
// ne vit plus que dans le tag local `pre-squash-2026-07-21`, non publié — dans l'historique
// publié, ce sceau se lit comme une déclaration de méthode, pas comme un fait vérifiable.
//
// ── Ce que ce banc NE couvre PAS, et la liste est longue ─────────────────────────────────────────
// DEUX voix, DOUZE cellules. Ce n'est pas un taux, ce n'est pas une couverture, et aucun chiffre
// d'ici ne se cite comme une propriété du détecteur.
//
//   • Un seul registre — l'amplification. Rien ici ne dit quoi que ce soit du littéral, de l'argot,
//     de la 3ᵉ personne ou du vocabulaire professionnel : ces voix-là vivent dans l'autre banc EN,
//     et les deux ne se cumulent pas en un score.
//   • Un seul label réellement exercé. `mental_health` est le seul à porter du lexique anglais ici ;
//     les cinq autres cellules par voix passent au vert sans que rien ne les ait éprouvées. Un vert
//     sur `sexuality` ne veut RIEN dire dans ce fichier.
//   • L'anglais seul, et un anglais d'une seule main. Deux voix écrites par le même auteur partagent
//     ses angles morts — ce que ni l'une ni l'autre n'a pensé à écrire n'est pas mesuré.
//   • `clinical_slang` est une BORNE, pas une fréquence. Il fait exprès. Son chiffre majore le
//     risque, il ne l'estime pas, et le lire comme « voilà ce qui arrive aux gens » serait un
//     contresens que ce paragraphe existe pour empêcher.
//   • Les deux chiffres ne se moyennent JAMAIS — la raison est dans l'en-tête de la fixture.
//
// ── Hors du chemin de démo, à dessein ────────────────────────────────────────────────────────────
// Ce banc MESURE, il ne se livre pas aux utilisateurs.

import { describe, expect, it } from 'vitest';
import { EN_UPPER_BOUND_PERSONAS } from './en-upper-bound.fixture';
import { detectFor, expectBenchCounts, fingerprint } from './register-bench.harness';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// L'ATTENDU FIGÉ — relevé le 2026-07-18, à diff nul
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Ces lignes ne sont PAS la vérité-terrain (elle est scellée dans la fixture) : c'est ce que le
// détecteur produit AUJOURD'HUI, et c'est leur ÉCART avec le sceau qui est le résultat.

const EXPECTED: Readonly<Record<string, readonly string[]>> = {
  // LE PREMIER RÉSULTAT, ET IL RÉPOND À LA QUESTION QU'ON LUI A POSÉE. Cette voix a été briefée sur
  // le REGISTRE seul — hyperbole permanente, aucun ciblage, on ne lui a désigné aucun vocabulaire.
  // Elle ne déclenche rien. C'est la mesure qui compte, parce qu'elle porte sur une voix que
  // personne n'a orientée : le vide n'a pas été obtenu en la tenant à l'écart de quelque chose.
  //
  // Ce que ce zéro ne dit PAS : il ne dit pas que l'hyperbole est sûre. Il dit qu'UNE voix
  // hyperbolique, sur SES sujets — un four, un train, des livres, un chat — n'a rien rencontré. Une
  // autre vie amplifiée à l'identique traverserait d'autres mots.
  loud: [],

  // LE SECOND RÉSULTAT, ET C'EST LE TORT QUI A FAIT BOUGER LE LEXIQUE. Voix briefée comme pire cas :
  // le vocabulaire clinique y sert d'intensificateur ordinaire, comme des millions de gens
  // l'emploient. Quatre items franchissent toujours ; ce qui a changé est l'étage AGRÉGÉ, passé
  // d'`explicit` à `indirect` depuis que les noms nus de trouble ne nomment plus.
  //
  // LE TORT N'EST PAS REFERMÉ, et cette ligne ne se lit pas comme une victoire : il reste un
  // non-porteur tagué, et il est toujours compté comme tel plus bas. Ce qui est tombé, c'est
  // l'AFFIRMATION — « cette personne a cette condition », posée sur du kerning et une canicule. Le
  // tag large dit « du vocabulaire de santé mentale est présent », ce qui est vrai de lui.
  //
  // MAIS LE RÉSULTAT DE BORNE EST LE CONTRASTE, PAS LE QUATRE. Cette voix empile QUATORZE termes
  // cliniques détournés — bipolar, ptsd, ocd, gaslighting, narcissist, manic, unhinged, depression,
  // addicted, psychopath, anxiety, obsessive, trauma, delusional. Quatre franchissent ; dix restent
  // muets. Un pire cas délibéré, écrit pour saturer, obtient donc moins d'un tiers.
  //
  // Et il faut s'arrêter à ce constat SANS l'expliquer. La tentation est d'annoncer un motif — « ce
  // sont les noms de trouble que l'anglais courant a colonisés » — mais cette description couvre
  // aussi bien les dix qui se taisent : « the weather is bipolar », « he's a psychopath », « that
  // brief was gaslighting me » sont exactement la même misapplication. Rien dans CE fichier ne
  // discrimine les quatre des dix ; ce qui les sépare est l'appartenance au lexique, qui ne se lit
  // pas d'ici. Nommer un motif serait sur-citer le filet — la faute que ce dépôt décrit sous
  // *Ce qu'un filet prouve*, et qui est d'autant plus facile ici que l'explication sonnerait juste.
  //
  // Trois des quatre sont en étage d'item `explicit` : les règles d'étage livrées (3ᵉ personne,
  // registre informationnel) n'ont pas de prise ici, et c'est cohérent — il parle bien de LUI, au
  // présent, à la 1ʳᵉ personne. Ce qui est faux n'est pas la personne visée, c'est le SENS du mot.
  clinical_slang: [
    'mental_health[indirect] #2 indirect ptsd',
    'mental_health[indirect] #4 indirect im so ocd+ocd',
    'mental_health[indirect] #12 indirect depression',
    'mental_health[indirect] #18 indirect anxiety',
  ],
};

describe('banc EN borne haute — capteur de régression', () => {
  for (const persona of EN_UPPER_BOUND_PERSONAS) {
    it(`${persona.id} — détections inchangées (registre : ${persona.register})`, () => {
      // Égalité STRICTE dans les deux sens : un terme qui apparaît est un sur-déclenchement
      // potentiel, un terme qui disparaît est une perte de rappel. Les deux se relisent.
      expect(fingerprint(detectFor(persona))).toEqual(EXPECTED[persona.id]);
    });
  }

  it('les deux voix sont couvertes — un attendu orphelin signalerait une persona retirée en douce', () => {
    expect(Object.keys(EXPECTED).sort()).toEqual(EN_UPPER_BOUND_PERSONAS.map((p) => p.id).sort());
  });
});

describe('banc EN borne haute — comptage', () => {
  expectBenchCounts(EN_UPPER_BOUND_PERSONAS, {
    // Le tort est ENTIER et il est du côté qu'on attendait : `loud` ne porte rien, `clinical_slang`
    // porte le seul tort de la paire. C'est exactement l'écart que les deux briefs devaient rendre
    // visible — la même amplitude de langue, deux vocabulaires, un seul tort.
    torts: ['clinical_slang/mental_health'],
    // Aucune cellule `signalWithoutLived` dans cette paire : ni proche aidant, ni professionnel.
    // La sur-classification n'a donc rien à mesurer ici, et ce vide est structurel, pas un résultat.
    escalated: [],
    // Aucun désaccord avec le sceau. Les deux appels contestables déclarés à l'écriture
    // (`conflictual` sur les figures de style de `loud`, sur l'insulte visant une classe absente
    // chez `clinical_slang`) sont restés muets : le détecteur et l'annotateur sont d'accord, et il
    // n'y a rien à publier.
    corrections: [],
    tortsAfterCorrection: ['clinical_slang/mental_health'],
    // `politics` est scellé VÉCU sur `clinical_slang` — il a bien une orientation, elle est à lui —
    // et rien ne le tague. L'étage est donc `AUCUN`, déclaré ici et dans `missedRecall`.
    //
    // Ce n'est PAS un contre-exemple à la doctrine, et il faut le lire dans le bon sens : il ne
    // nomme jamais son camp, aucun item ne porte d'étiquette ni de parti. La règle dure d'ADR-0003
    // veut qu'un constat NOMMÉ exige le terme précis — un `explicit` ici aurait été fabriqué sans
    // terme. Ce qui reste ouvert est le constat LARGE, que rien n'a produit.
    livedStages: { clinical_slang: 'AUCUN' },
    missedRecall: ['clinical_slang/politics'],
  });

  it('la borne : CINQ surfaces franchissent, sur quatorze termes cliniques empilés', () => {
    const clinical = EN_UPPER_BOUND_PERSONAS.find((p) => p.id === 'clinical_slang');
    if (clinical === undefined) {
      throw new Error('persona `clinical_slang` absente');
    }
    const surfaces = detectFor(clinical)
      .filter((d) => d.label === 'mental_health')
      .flatMap((d) => d.items.flatMap((i) => i.surfaces));
    // Nommer les quatre plutôt que compter : le jour où l'un tombe ou où un cinquième arrive, le
    // message d'échec dit LEQUEL. Un `toHaveLength(4)` dirait seulement « quelque chose a bougé »,
    // et c'est l'identité de la surface — pas le nombre — qui dit s'il faut relire un terme ou s'en
    // réjouir. Les dix termes muets ne sont PAS gardés ici, à dessein : les figer ferait de leur
    // silence une promesse, alors qu'il n'est qu'une mesure du jour.
    //
    // LOT DES ADJECTIFS EN — la cinquième surface n'est PAS une détection de plus. `im so ocd` et
    // `ocd` sont le MÊME terme sur le MÊME item (#4), atteint par deux chemins : le tier colloquial
    // (le mot nu) et le tier `selfDeclaredEn` (le cadre entier, qui est la forme de surface
    // surlignable). L'étage de l'item ne bouge pas, le nombre d'items détectés ne bouge pas, la
    // borne mesurée ne bouge pas — c'est l'empreinte qui gagne une entrée. Précisément le genre de
    // churn que ce test doit rendre LISIBLE plutôt que silencieux, d'où le choix de nommer les
    // surfaces au lieu de les compter.
    expect(surfaces.slice().sort()).toEqual(['anxiety', 'depression', 'im so ocd', 'ocd', 'ptsd']);
  });
});
