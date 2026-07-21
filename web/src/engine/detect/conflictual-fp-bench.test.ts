// Banc de faux positifs `conflictual` — le CAPTEUR. Voix et vérité-terrain dans
// `conflictual-registers.fixture.ts`, scellées par un commit ANTÉRIEUR à ce fichier : c'est
// l'historique, et lui seul, qui prouve que les attendus n'ont pas été ajustés à la mesure. Le
// comptage est partagé avec les bancs EN, FR et corps (`register-bench.harness.ts`).
// ⚠ SCEAU ET HISTORIQUE PUBLIÉ. La recomposition d'avant publication (2026-07-21) a aplati
// l'historique de travail : fixture et capteur y naissent dans le même commit. La preuve d'ORDRE
// ne vit plus que dans le tag local `pre-squash-2026-07-21`, non publié — dans l'historique
// publié, ce sceau se lit comme une déclaration de méthode, pas comme un fait vérifiable.
//
// ── CE QUE LA PREMIÈRE MESURE A TROUVÉ ───────────────────────────────────────────────────────────
// ⚠ CE RELEVÉ EST DATÉ ET N'EST PLUS L'ÉTAT COURANT. Il est conservé tel quel — c'est un rapport,
// et le réécrire effacerait ce qui a motivé l'arbitrage. Ce qui a changé depuis, et où le lire :
// `moron` a été RETIRÉ sur ce chiffre même, ce qui a fait tomber le tort `en_banter` et rendu
// l'anglais muet des deux côtés ; le détail est dans les deux blocs ajoutés en fin d'en-tête, et
// l'état courant est celui qu'assertent `expectBenchCounts` et la garde du zéro anglais.
//
// Relevé le 2026-07-18, 26 items par voix, quatre voix. Les deux chiffres d'une paire répondent à
// des questions opposées et ne se fusionnent pas ; ils sont donc lus voix par voix.
//
//   fr_contempt (agressivité VÉCUE) → 1 détection, sur une seule surface : `debile`.
//   fr_banter   (vanne, NON-PORTEUSE) → 1 détection, sur la MÊME surface : `debile`.
//   en_contempt (agressivité VÉCUE) → 0 détection.
//   en_banter   (vanne, NON-PORTEUSE) → 1 détection, sur `moron`.
//
// Trois lectures, et aucune n'est une régression de ce lot — ce sont les premiers chiffres que ce
// label ait jamais eus.
//
// LE FAIT QUI LES UNIT, et il vaut mieux que le détail de chaque voix : sur 104 items, DEUX surfaces
// se sont déclenchées en tout — `debile` et `moron`. Aucune de `nul`, `pitoyable`, `incompetent`,
// `abruti`, `betise` ; aucune de `idiot`, `useless`, `pathetic`, `clueless`, `rubbish`, `nonsense`,
// alors que `idiot` et `useless` reviennent plusieurs fois dans les deux voix anglaises. Le rappel
// sur l'agressivité réelle est donc proche de zéro dans LES DEUX langues, faute que le lexique porte
// le registre ordinaire — et le ou les termes qu'il porte se déclenchent sans égard pour qui est
// visé. Ce n'est pas une lecture inversée de la relation : c'est une lexicalisation clairsemée,
// posée sur un détecteur qui n'a aucun accès à la relation.
//
// 1. CÔTÉ FR, LE DÉTECTEUR NE DISTINGUE RIEN. Vingt-six items de mépris soutenu produisent une
//    détection, et c'est le même mot qui fait tagger l'amie affectueuse. La restauratrice qui écrit
//    « pitoyable », « incompetent », « c'est de la merde », « je supporte pas la betise satisfaite »
//    n'est vue sur AUCUN de ces items. Le rappel et le tort reposent sur une seule et même surface :
//    ce que la mesure montre, ce n'est pas un détecteur imprécis, c'est un détecteur qui n'a pas
//    d'opinion sur la relation — exactement ce que la paire a été écrite pour éprouver.
//
// 2. CÔTÉ EN, LE SEUL DÉCLENCHEMENT PORTE SUR LA NON-PORTEUSE, et le chemin du zéro n'est pas
//    traçable ici. La voix hostile rend ZÉRO ; la voix affectueuse est la seule taguée. Il est
//    tentant d'en conclure que l'anglais lit la relation à l'envers — ce serait faux, et c'est le
//    genre de conclusion que ce dépôt paie cher : `detectFor` ne transmet que le texte des items,
//    le détecteur n'a donc AUCUN modèle de la relation et ne peut pas l'inverser.
//
//    Ce que la mesure montre est plus étroit et plus utile. Deux items portent la même racine :
//    `en_contempt` #15, « i have no patience for morons who lecture », ne déclenche pas ;
//    `en_banter` #23, « you are the official moron of this house », déclenche. Le pluriel muet,
//    le singulier vu. DEUX CHEMINS l'expliqueraient — une tolérance de pluriel absente sur ce
//    terme, ou une règle d'étage qui dégrade la formulation générale (« morons who lecture ») là
//    où l'adresse directe passe — ET CE BANC NE PEUT PAS TRANCHER : son auteur n'a lu ni le
//    lexique ni les filtres, c'est la condition du sceau. La question est posée, pas résolue.
//
//    Si c'est le second chemin, le résultat est celui de la parabole `health_physical` : la
//    machinerie écrite pour réduire les faux positifs serait ce qui abrite l'agresseuse et expose
//    l'amie. C'est la première chose à vérifier, et elle demande un lecteur autorisé.
//
// 3. LES DEUX TORTS SONT DES CONSTATS NOMMÉS (`explicit`), pas des constats larges. Ce n'est pas un
//    détail d'étage : un constat nommé porte la confiance haute et le quasi-factuel (ADR-0003). Le
//    produit, en l'état, dirait d'une jeune femme qui traite ses amies de débiles par tendresse
//    qu'elle relève d'un constat conflictuel NOMMÉ.
//
// RIEN N'EST RETIRÉ NI CORRIGÉ ICI. Un lot concurrent travaille le lexique `conflictual` au moment
// où ce capteur est monté ; l'arbitrage appartient au mainteneur, et le banc FIGE la question pour
// qu'elle ne se reperde pas — le même geste que les six formulations colloquiales du banc FR.
//
// ── LA QUESTION DU §2 EST TRANCHÉE — par un lecteur autorisé, comme il le demandait ──────────────
// Ajouté après coup par le lot du lexique EN, qui a lu le lexique et les filtres. Le capteur nommait
// deux chemins possibles pour l'asymétrie `morons` / `moron` et disait ne pas pouvoir choisir. Il
// avait raison de ne pas choisir, et raison sur la conclusion. Mesuré :
//
//   · la tolérance de PLURIEL fonctionne (`moron` matche bien « morons ») → premier chemin ÉCARTÉ ;
//   · « i have no patience for morons who lecture »        → RIEN ;
//     « you are one of the morons who lecture » (la même, adressée) → TAGUÉ.
//
// Ce qui décide n'est donc ni le pluriel ni une règle d'étage : c'est la CIBLE de 2ᵉ personne, que
// `conflictual` exige dans le même item (ADR-0003, exception `conflictual` : « émis ≠ cité » ET
// « visant un autre utilisateur »).
//
// ET LA PARABOLE DU §2 EST PLUS JUSTE ENCORE QUE SON AUTEUR NE POUVAIT L'ÉCRIRE. La garde n'est pas
// seulement incapable de distinguer l'agression de la vanne : sur ces deux voix, elle est
// ANTI-CORRÉLÉE. Le mépris s'exprime À PROPOS d'une catégorie (« morons who lecture », « les gens
// comme ça ») — sans adresse, donc invisible. La tendresse, elle, ADRESSE (« you are the official
// moron of this house ») — c'est exactement ce que la garde réclame. Le mécanisme écrit pour éviter
// de taguer une critique d'idée sélectionne, sur ce couple, la voix qu'il fallait épargner.
//
// Ce constat dépasse le lot qui l'écrit : il porte sur la porte du label, pas sur son vocabulaire.
// Aucune correction n'est tentée ici — l'arbitrage appartient au mainteneur, et le capteur reste la
// maison de la question.
//
// ── CE QUE CE CAPTEUR NE COUVRE PAS ──────────────────────────────────────────────────────────────
// La fixture déclare les frontières des VOIX (aucune injure identitaire, aucune menace, registre non
// varié, cinq labels non éprouvés). Celles-ci sont les frontières du CAPTEUR, et elles diffèrent :
//
// - Il ne couvre AUCUNE empreinte figée. `EXPECTED` est volontairement absent, comme au banc du
//   corps et pour une raison de même nature : le lexique `conflictual` est en cours de modification
//   par un lot concurrent, et une empreinte relevée sur un arbre instable enregistrerait un état
//   transitoire en le présentant comme une référence. Un attendu qui rouille en une heure coûte plus
//   cher que pas d'attendu du tout. Les chiffres ci-dessus sont donc un RAPPORT daté, pas une garde.
// - Poser l'empreinte est une DETTE explicite, à reprendre quand le lexique sera stabilisé. Sans
//   elle, ce capteur ne voit pas une surface qui se déplacerait d'un étage à l'autre.
// - Ce qu'il couvre à la place est plus étroit et plus durable : les propriétés de DOCTRINE du
//   comptage — le tort, le rappel, la sur-classification — plus la sévérité de l'étage sur les deux
//   non-porteuses. Aucune ne dépend d'un terme ni d'un seuil, seulement du sceau.
// - Il ne dit rien du VOLUME de l'agressivité : 26 items par voix, une seule densité éprouvée.

import { describe, expect, it } from 'vitest';
import { CONFLICTUAL_REGISTER_PERSONAS } from './conflictual-registers.fixture';
import { detectFor, expectBenchCounts } from './register-bench.harness';

describe('banc FP conflictual — comptage', () => {
  expectBenchCounts(CONFLICTUAL_REGISTER_PERSONAS, {
    // LES DEUX VOIX DE VANNE SONT TAGUÉES, et c'est le résultat que ce banc a été monté pour
    // produire. Aucune des deux n'a rien d'hostile de vrai ; les deux portent le vocabulaire de leur
    // jumelle hostile, et c'est le seul écart entre elles que l'export ne consigne pas.
    // MISE À JOUR APRÈS ARBITRAGE (2026-07-18) — `en_banter` n'est plus tagué. La seule surface qui
    // le taguait était `moron`, et le mainteneur l'a RETIRÉ sur ce chiffre même : rappel nul sur les
    // 26 items hostiles, un tort nommé sur l'amicale. Le tort anglais a donc disparu par le retrait
    // du terme qui le produisait — pas par une amélioration du détecteur, et la distinction est tout
    // l'objet de la garde plus bas.
    torts: ['fr_banter/conflictual'],
    // Aucun `signalWithoutLived` dans ce banc : la paire oppose un vécu à un non-porteur, sans
    // tiers. Une voix qui RAPPORTE un conflit sans en produire (la modératrice, le témoin d'une
    // dispute) reste à écrire — c'est le troisième état d'ADR-0003, et ce banc ne l'éprouve pas.
    escalated: [],
    // Aucune. La vérité-terrain a tenu à la mesure : rien de ce que le détecteur a rendu ne donne à
    // penser qu'une des quatre voix aurait été mal annotée. Ce n'est pas une réussite d'annotation,
    // c'est un banc à deux états sur un seul label.
    corrections: [],
    tortsAfterCorrection: ['fr_banter/conflictual'],
    // LE DÉFAUT DE RAPPEL, PUBLIÉ PLUTÔT QUE CACHÉ. Vingt-six items de mépris anglais explicite ne
    // produisent aucun constat. Il se déclare ICI et dans `livedStages` — deux fois, à dessein.
    missedRecall: ['en_contempt/conflictual'],
    // `fr_contempt` est tagué et NOMMÉ : elle écrit le terme, le constat nommé est légitime, et
    // c'est le seul rappel que ce label ait dans tout le corpus scellé. `en_contempt` est à `AUCUN`,
    // ce qui n'est pas une commodité mais un vécu que rien n'a vu.
    livedStages: { fr_contempt: 'explicit', en_contempt: 'AUCUN' },
  });

  it('les deux torts sont des constats NOMMÉS, et pas des constats larges', () => {
    // Écrit comme une assertion à part, et pas comme un corollaire du tort : l'étage est la moitié
    // de la gravité. Un constat LARGE sur une non-porteuse est déjà un tort ; un constat NOMMÉ y
    // ajoute la confiance haute et le quasi-factuel. Si un lot futur fait tomber ces deux voix en
    // `indirect` sans les faire disparaître, le tort demeure — mais il aura changé d'ordre de
    // grandeur, et cette ligne est le seul endroit où ça se verrait.
    // `en_banter` a quitté cette liste avec le retrait de `moron` (cf. `torts`). La propriété
    // qu'elle garde est inchangée et vaut toujours pour le français : un tort NOMMÉ n'est pas un
    // tort large, et si un lot futur fait tomber `fr_banter` en `indirect`, c'est ici que ça se voit.
    for (const id of ['fr_banter']) {
      const persona = CONFLICTUAL_REGISTER_PERSONAS.find((p) => p.id === id);
      if (persona === undefined) {
        throw new Error(`persona \`${id}\` absente`);
      }
      const detection = detectFor(persona).find((d) => d.label === 'conflictual');
      expect(detection?.stage).toBe('explicit');
    }
  });

  it("le zéro d'`en_contempt` se lit par son chemin, et il n'a rien de rassurant", () => {
    // La garde qui empêche la sur-citation de ce banc. `en_banter` produit un tort ; si un lot
    // futur l'éteint SANS donner de rappel à `en_contempt`, le banc redeviendrait tout vert en
    // anglais — et ce vert dirait « aucun faux positif » alors qu'il ne dirait que « le détecteur ne
    // voit rien du tout ». Les deux zéros auraient la même cause, et celle de la non-porteuse ne
    // serait pas la sienne.
    //
    // Cette ligne échoue donc le jour où l'anglais devient muet sur les deux voix, pour forcer la
    // relecture plutôt que de laisser le silence passer pour de la sûreté.
    const contempt = CONFLICTUAL_REGISTER_PERSONAS.find((p) => p.id === 'en_contempt');
    const banter = CONFLICTUAL_REGISTER_PERSONAS.find((p) => p.id === 'en_banter');
    if (contempt === undefined || banter === undefined) {
      throw new Error('paire anglaise incomplète');
    }
    const vuChezLHostile = detectFor(contempt).some((d) => d.label === 'conflictual');
    const vuChezLAmicale = detectFor(banter).some((d) => d.label === 'conflictual');

    // ── CETTE GARDE A SONNÉ, ET ELLE EST RETOURNÉE PLUTÔT QU'ÉTEINTE (2026-07-18) ────────────────
    // Elle a fait exactement son travail. Le retrait de `moron` — arbitré sur le chiffre que ce banc
    // a produit — a rendu l'anglais MUET SUR LES DEUX VOIX, c'est-à-dire l'état précis que son
    // auteur refusait de laisser passer pour de la sûreté. La bonne réponse à une garde qui sonne
    // n'est pas de l'inverser en `false` : c'est de relire, puis d'écrire ce que la relecture a
    // trouvé, pour que le silence reste NOMMÉ.
    //
    // Ce que la relecture a trouvé : l'anglais de ce label ne lit PAS l'agressivité. `en_contempt`
    // n'a jamais été vue (26 items, avant comme après), et `en_banter` ne l'était que par un terme
    // dont le rappel mesuré était nul. Les deux zéros ont bien la même cause, et cette cause est un
    // lexique EN qui n'atteint pas le registre ordinaire du mépris — pas un détecteur prudent.
    //
    // La garde est donc RE-POINTÉE sur ce qui reste à protéger : ce silence doit être DÉCLARÉ. Elle
    // sonnera de nouveau le jour où l'anglais se remettra à taguer, pour forcer la question qui
    // comptera alors — laquelle des deux voix a été vue.
    expect(
      { hostile: vuChezLHostile, amicale: vuChezLAmicale },
      "l'anglais de `conflictual` est MUET des deux côtés, et c'est un défaut de rappel déclaré — " +
        'pas une absence de faux positif. Si cette ligne rougit, une des deux voix est redevenue ' +
        'visible : dire LAQUELLE avant de mettre à jour quoi que ce soit.',
    ).toEqual({ hostile: false, amicale: false });

    // Le français, lui, garde la propriété d'origine : au moins une des deux voix est vue, donc le
    // vert du banc n'y est pas un vert de cécité.
    const frContempt = CONFLICTUAL_REGISTER_PERSONAS.find((p) => p.id === 'fr_contempt');
    const frBanter = CONFLICTUAL_REGISTER_PERSONAS.find((p) => p.id === 'fr_banter');
    if (frContempt === undefined || frBanter === undefined) {
      throw new Error('paire française incomplète');
    }
    expect(
      detectFor(frContempt).some((d) => d.label === 'conflictual') ||
        detectFor(frBanter).some((d) => d.label === 'conflictual'),
    ).toBe(true);
  });
});
