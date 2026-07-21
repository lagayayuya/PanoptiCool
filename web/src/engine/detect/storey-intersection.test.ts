// TÉMOIN — un terme présent aux DEUX étages, et l'étage nommé qui gagne en silence.
//
// LE MOTIF, et il est structurel plutôt que rédactionnel. Le lot des adjectifs a construit
// `selfDeclaredEn` avec une barre d'admission raisonnée : il en EXCLUT `manic`, `paranoid`,
// `schizophrenic` parce qu'ils sont « appliqués à un tiers ou à un objet » (mental-health.ts). Mais
// les entrées `explicit` des MÊMES adjectifs n'ont jamais été retirées. Un terme aux deux tiers
// court-circuite le tier neuf : `explicit` gagne, et l'adjectif NOMME dès un item, dans n'importe
// quel cadre — y compris celui que la barre d'admission avait écarté. La doctrine avait été
// appliquée à une porte et pas à l'autre.
//
// Ce que ce témoin surveille est donc l'INTERSECTION `explicit ∩ selfDeclaredEn`, terme à terme.
// C'est une propriété MÉCANIQUE, et c'est ce qui la rend utile : elle se vérifie sans juger un
// idiome, là où la chasse aux commentaires n'avait trouvé qu'un terme sur trois.
//
// ── CE QUE CE TÉMOIN NE COUVRE PAS ─────────────────────────────────────────────────────────────
// Il faut le lire avant de le citer, parce que sa portée est étroite :
//
//   · Il ne mesure AUCUN idiome d'objet. Il ne sait pas ce que veut dire « anemic » ; il compte des
//     appartenances de liste. Un adjectif à idiome d'objet admis au SEUL tier `explicit` — donc
//     hors intersection — lui est parfaitement invisible. C'est le cas de tout terme qu'aucun lot
//     d'auto-déclaration n'a doublé.
//   · Il ne dit rien des autres formes du même défaut de fond — une justification qui affirme une
//     propriété (prédication, temps verbal, rattachement) qu'aucun code n'évalue. `i voted`,
//     `moronic` et `catholic` en relèvent, ne sont PAS des doublons de tier, et sont donc hors de
//     ce filet. Ils sont nommés comme dettes au catalogue (`docs/constats-sensibles.md` §4,
//     entrée du lot des adjectifs — ex-fiche `dette-appartenance-en.md`).
//   · Il ne vaut que pour l'anglais : `selfDeclaredFr` NOMME par construction, donc l'intersection
//     n'y veut rien dire.
//
// ── MUTATIONS PASSÉES, et ce qu'elles ont FAIT ─────────────────────────────────────────────────
//   1. Remettre `anemic` dans `HEALTH_PHYSICAL_LEXICON.explicit` → 4 ROUGES / 6. La liste attendue
//      ET la sonde de comportement (« the sound mix on this album is anemic » repasse `explicit`).
//      Les deux moitiés ont rougi, ce qui était le but : la liste seule aurait pu passer au vert
//      pour une raison de liste.
//   2. Retirer `celiac` de `selfDeclaredEn` (au lieu de `explicit`) → 1 ROUGE, sur le verrou seul.
//      Confirme que le témoin surveille bien l'INTERSECTION et pas la seule présence en `explicit`.
//   3. Retirer `anemia` de `explicit` → VERT sur l'intersection, 1 ROUGE sur la sonde de rappel.
//      Le résultat est celui qu'on avait prévu, et il vaut d'être écrit parce qu'il dit la LIMITE du
//      verrou : l'intersection ne protège pas le rappel du porteur. C'est la sonde « le NOM porte le
//      rappel » qui le fait, et c'est pourquoi elle existe séparément.
//
// Une quatrième mutation a été tentée AVANT celles-ci et n'a rien prouvé : la boucle restaurait le
// lexique par `git checkout` sur un fichier non commité, si bien que les mutations 2 et 3 ont été
// mesurées sur le lexique NON corrigé. Les trois résultats ci-dessus sont ceux de la reprise, le
// correctif commité. Consigné parce qu'une mutation qui ne s'applique pas a exactement l'apparence
// d'une mutation qui passe.

import { describe, expect, it } from 'vitest';
import { HEALTH_PHYSICAL_LEXICON } from '../lexicon/health-physical';
import { MENTAL_HEALTH_LEXICON } from '../lexicon/mental-health';
import { POLITICS_LEXICON } from '../lexicon/politics';
import { RELIGION_LEXICON } from '../lexicon/religion';
import { SEXUALITY_LEXICON } from '../lexicon/sexuality';
import type { TopicalLexicon } from '../lexicon/types';
import { detectLabels } from './detect';

// Les CINQ lexiques topicaux. `conflictual` est absent, et pas par oubli : il est `ItemLevelLexicon`,
// un type qui ne porte NI `explicit` NI `selfDeclaredEn` — l'intersection y est impossible à écrire,
// pas seulement vide. Sa porte est l'insulte émise, pas une identité (ADR-0003, *La symétrie d'un
// axe* : « sans objet »). C'est le compilateur qui tient cette exclusion, pas ce fichier.
const LEXIQUES: readonly TopicalLexicon[] = [
  HEALTH_PHYSICAL_LEXICON,
  MENTAL_HEALTH_LEXICON,
  SEXUALITY_LEXICON,
  RELIGION_LEXICON,
  POLITICS_LEXICON,
];

/**
 * Les SEULS doublons de tier tolérés, et chacun a sa raison écrite. Une entrée de plus est un
 * adjectif qui NOMME dans un cadre que `selfDeclaredEn` avait pourtant refusé.
 *
 *   · `celiac` / `coeliac` — aucun idiome anglais ne les applique à un objet. « celiac friendly »
 *     est du vocabulaire du DOMAINE : il tague quelqu'un qui se documente, ce qui est un
 *     signal-sans-vécu — la démonstration, pas un tort (ADR-0003, *L'incertitude*).
 *   · `adhd` — c'est un NOM, pas un adjectif. « i have adhd » est la formulation canonique du
 *     porteur ; le descendre rejouerait exactement l'erreur que `en-demotion-ablation.test.ts` a
 *     figée sur `depression` / `anxiety`.
 *   · `bulimic` — idiome d'objet NON attesté. Il a fallu inventer « a bulimic release cycle » pour
 *     le tester, et c'est la réponse : le terme ne se déclenche pas sur du texte que quelqu'un
 *     écrit vraiment.
 */
const DOUBLONS_ADMIS: Readonly<Record<string, readonly string[]>> = {
  health_physical: ['celiac', 'coeliac'],
  mental_health: ['adhd', 'bulimic'],
};

function intersection(l: TopicalLexicon): string[] {
  const sd = l.selfDeclaredEn ?? [];
  return l.explicit.filter((t) => sd.includes(t));
}

describe('intersection `explicit` ∩ `selfDeclaredEn` — le doublon de tier', () => {
  it("LE VERROU — aucun doublon hors de la liste admise, et chacun d'eux a sa raison au fichier", () => {
    for (const l of LEXIQUES) {
      expect(intersection(l).sort()).toEqual([...(DOUBLONS_ADMIS[l.label] ?? [])].sort());
    }
  });

  it('LES TROIS RETIRÉS ne sont plus en `explicit`, et vivent toujours au tier large', () => {
    // Retirés de `explicit` mais PAS du lexique : c'est une rétrogradation, pas une éviction. La
    // démonstration survit entière — le terme se déclenche encore, il n'affirme plus.
    for (const t of ['anemic', 'epileptic']) {
      expect(HEALTH_PHYSICAL_LEXICON.explicit).not.toContain(t);
      expect(HEALTH_PHYSICAL_LEXICON.selfDeclaredEn ?? []).toContain(t);
    }
    expect(MENTAL_HEALTH_LEXICON.explicit).not.toContain('anorexic');
    expect(MENTAL_HEALTH_LEXICON.selfDeclaredEn ?? []).toContain('anorexic');
  });

  it("L'IDIOME D'OBJET NE NOMME PLUS — la sonde qui a ouvert le lot", () => {
    // Ces quatre phrases posaient un constat NOMMÉ de haute confiance sur quelqu'un qui décrivait
    // un disque, un montage, un budget et une marge.
    const objets = [
      'the sound mix on this album is anemic',
      'an anemic performance from the whole squad',
      'the editing in that trailer is epileptic',
      'this budget is anorexic',
    ];
    for (const phrase of objets) {
      const d = detectLabels([phrase], LEXIQUES)[0];
      expect(d?.stage).not.toBe('explicit');
    }
  });

  it('LE NOM PORTE LE RAPPEL — ce que la rétrogradation ne coûte pas', () => {
    // La contrepartie, et c'est elle qui rend la rétrogradation tenable plutôt qu'une éviction
    // déguisée : l'adjectif descend, le NOM de la condition reste nommant. Quelqu'un qui vit la
    // condition l'écrit quelque part sous cette forme.
    for (const phrase of [
      'my anemia has been bad this month',
      'i was diagnosed with epilepsy last year',
      'my anorexia relapsed in the spring',
    ]) {
      expect(detectLabels([phrase], LEXIQUES)[0]?.stage).toBe('explicit');
    }
  });

  it("LE PRIX, DÉCLARÉ — l'énoncé isolé de l'adjectif disparaît sous le seuil", () => {
    // Mesuré AVANT les voix, comme l'impose ADR-0003 (*La rétrogradation*) : une ablation menée sur
    // des personas rend des feux verts faux, le voisinage rattrapant la chute d'un terme.
    //
    // Ce coût n'est pas neuf, il est ÉTENDU : `selfDeclaredEn` n'a pas de franchissement solo, et le
    // module déclare déjà que « i am diabetic » écrit UNE fois ne rend RIEN. Trois adjectifs de plus
    // rejoignent ce régime. `anaemic` — la graphie britannique du même mot — y était DÉJÀ, seul, et
    // c'est cette incohérence de graphie qui a rendu la décision facile.
    expect(detectLabels(['i am anemic'], LEXIQUES)[0]).toBeUndefined();
    expect(detectLabels(['the growth figures were anaemic'], LEXIQUES)[0]).toBeUndefined();
    // Et le porteur qui écrit une SECONDE chose du domaine garde son constat, à l'étage large.
    expect(detectLabels(['i am anemic', 'iron deficiency'], LEXIQUES)[0]?.stage).toBe('indirect');
  });

  it("`had a stroke` — le doublon n'est PAS le seul chemin, et celui-ci passait par la parenté", () => {
    // Hors intersection (aucun tier d'auto-déclaration ne le portait), donc invisible au verrou
    // ci-dessus : il est ici parce que le même lot l'a corrigé, pas parce que le témoin l'attrape.
    //
    // Il était en `explicit` CONTRE la règle écrite juste au-dessus de lui (« le possessif seul
    // NOMME »). Ce qui a caché le défaut est le filtre de 3ᵉ personne, une liste FERMÉE de termes
    // de parenté : la voix scellée `relative` écrit « my nan », donc elle était muette, et le
    // défaut ne pouvait apparaître sur aucune persona.
    expect(HEALTH_PHYSICAL_LEXICON.explicit).not.toContain('had a stroke');
    expect(HEALTH_PHYSICAL_LEXICON.indirectCore).toContain('had a stroke');
    for (const phrase of ['he had a stroke last winter', 'the driver had a stroke at the wheel']) {
      expect(detectLabels([phrase], LEXIQUES)[0]?.stage).not.toBe('explicit');
    }
    // Le possessif, lui, NOMME toujours — la règle du bloc est intacte.
    expect(detectLabels(['my stroke was in march'], LEXIQUES)[0]?.stage).toBe('explicit');
  });
});
