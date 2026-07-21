// VÉRIFICATION — la règle de registre informationnel sur `health_physical` (PANO-35).
//
// La règle d'étage a été conçue et mesurée sur `mental_health`, mais elle vit dans la MACHINERIE :
// elle s'applique donc à tout lexique topical câblé, `health_physical` compris, et donc en
// production. « symptômes du diabète » y dégrade depuis le lot précédent sans que personne ne l'ait
// vérifié. La direction est sûre — une règle d'étage ne peut qu'abaisser, jamais créer ni
// supprimer — donc le risque n'est pas la sûreté, c'est le RAPPEL : quelqu'un qui vit réellement
// une condition perdrait-il son constat nommé parce qu'il se documente dessus ?
//
// ── Ce que ce fichier est, et n'est pas ──────────────────────────────────────────────────────────
// Des SONDES de mécanisme, pas une mesure de taux. Il n'y a pas de persona ici, pas de
// vérité-terrain scellée, pas de dénominateur : on vérifie qu'un mécanisme se comporte comme sa
// doctrine l'annonce sur un label où il n'avait jamais été exercé. Un taux de faux positifs sur
// `health_physical` demanderait le même dispositif complet que pour `mental_health` — il n'existe
// pas, et ce fichier ne prétend pas le remplacer.

import { describe, expect, it } from 'vitest';
import { HEALTH_PHYSICAL_LEXICON } from '../lexicon/health-physical';
import { detectLabels } from './detect';

function constat(textes: string[]): { stage: string; etages: string[] } | null {
  const d = detectLabels(textes, [HEALTH_PHYSICAL_LEXICON])[0];
  if (d === undefined) {
    return null;
  }
  return { stage: d.stage, etages: d.items.map((i) => i.stage) };
}

describe("règle d'étage — vérification sur `health_physical`", () => {
  it('le cadrage documentaire dégrade un terme de condition, comme sur `mental_health`', () => {
    // Quelqu'un qui se renseigne : le terme précis est là, mais rien n'indique qu'il le VIT.
    const r = constat(['symptomes du diabete', "signes de l'endometriose"]);
    expect(r?.stage).toBe('indirect');
    expect(r?.etages).toEqual(['indirect', 'indirect']);
  });

  it('LE RÉSULTAT QUI COMPTE — celui qui vit la condition garde son constat NOMMÉ', () => {
    // Le risque réel de la règle est là, et il est borné par un fait de langue : une personne qui
    // vit une condition la NOMME quelque part au possessif, et « mon diabète me fatigue » n'a aucun
    // cadrage documentaire. L'item qui la décrit survit donc, et il suffit à tenir l'étage nommé —
    // même quand la même personne se documente par ailleurs.
    const r = constat(['mon diabete me fatigue en ce moment', 'symptomes du diabete']);
    expect(r?.stage).toBe('explicit');
    expect(r?.etages).toEqual(['explicit', 'indirect']);
  });

  it("le vécu sans aucun cadrage documentaire est intact — la règle ne l'a pas touché", () => {
    const r = constat(['mon diabete me fatigue', 'ma maladie chronique']);
    expect(r?.stage).toBe('explicit');
    expect(r?.etages).toEqual(['explicit', 'explicit']);
  });

  it("le proche reste en large, et la règle ne l'a pas fait disparaître", () => {
    // Deux raisons de plafonner se cumulent ici (3ᵉ personne ET cadrage documentaire) sans jamais
    // s'additionner en suppression : le constat demeure, à l'étage large. C'est la propriété qui
    // sépare une règle d'étage d'un filtre.
    const r = constat(['le diabete de ma mere', 'signes de diabete chez ma mere']);
    expect(r?.stage).toBe('indirect');
    expect(r?.etages).toEqual(['indirect', 'indirect']);
  });

  it("CORRECTION MESURÉE — `health_physical` a bien une homographie EN, et j'avais écrit l'inverse", () => {
    // CE TEST AFFIRMAIT LE CONTRAIRE, et l'affirmation était FAUSSE. Il disait « aucune couverture
    // anglaise, ni terme ni homographie utile (diabetes ≠ diabete) ». Le rapprochement se fait par
    // la tolérance de PLURIEL de la machinerie : `diabete` + s matche « diabetes ».
    //
    // Pourquoi il passait quand même : « signs of diabetes » est de registre informationnel, donc
    // dégradé en large, et un item large SEUL restait sous le seuil de 2. L'assertion mesurait donc
    // le seuil, pas la couverture — elle serait tombée à la première seconde occurrence. Le
    // franchissement SOLO l'a rendue visible en supprimant l'écran.
    //
    // La leçon est celle du dépôt sur les filets : une assertion négative vérifie ce qu'elle
    // atteint, pas ce qu'elle affirme. Celle-ci prouvait « pas de constat », et je lui avais fait
    // dire « pas de couverture ».
    const enPluriel = constat(['signs of diabetes']);
    expect(enPluriel?.stage).toBe('indirect');
  });

  it("LA COUVERTURE N'EST PLUS ACCIDENTELLE — « endometriosis » est entré, et le test qui le niait a servi", () => {
    // CE TEST DISAIT L'INVERSE, et il avait raison de le dire : « endometriosis » n'est pas le
    // pluriel de « endometriose » (-ose / -osis), donc rien ne l'attrapait, à aucun étage. C'était
    // la démonstration que la couverture EN était PARTIELLE en plus d'être accidentelle.
    //
    // Le lot de vocabulaire EN l'a comblée. La ligne est retournée plutôt que supprimée : une
    // assertion négative qui a documenté un trou réel mérite de dire ce qui l'a bouché, sinon la
    // raison du trou se perd avec elle.
    expect(constat(['my endometriosis has been bad this month'])?.stage).toBe('explicit');
    // Et la règle d'étage s'applique au terme neuf comme aux anciens — les deux ordres de mots.
    expect(constat(['symptoms of endometriosis'])?.stage).toBe('indirect');
    expect(constat(['endometriosis symptoms'])?.stage).toBe('indirect');
  });
});
