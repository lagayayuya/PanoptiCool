// Témoin de SYMÉTRIE du lexique `religion`, PAR TRADITION — le filet qui n'existait pas quand le
// trou est passé.
//
// ── POURQUOI CE FICHIER EXISTE ───────────────────────────────────────────────────────────────────
// Le lexique livrait, en français, une couverture TROUÉE des traditions : cinq appellations
// (catholique, musulmane, juive, bouddhiste, protestante) posaient un constat NOMMÉ dans le cadre
// le plus ordinaire, deux autres (hindoue, sikh) ne rendaient RIEN — pas un constat plus faible,
// rien du tout. Mesuré par sonde à cadre calqué, `religion-bench.test.ts`.
//
// Personne ne l'avait écrit, et c'est le même mécanisme que côté politique : chaque terme PRÉSENT
// était localement défendable, et le défaut vivait dans la COMPOSITION. Aucune relecture ne pouvait
// le voir — une relecture vérifie que les termes présents sont légitimes, jamais que les ABSENTS le
// sont symétriquement. Et aucune des quatre voix scellées ne pouvait le voir non plus : aucune
// n'appartient aux traditions manquantes. Il a fallu une sonde hors-corpus.
//
// C'est la propriété qui rend ce défaut coûteux : une non-détection n'affiche RIEN. Quelqu'un dont
// la tradition manque ne produit aucune trace, aucun compteur rouge — une absence, et une absence
// ressemble à un banc propre.
//
// ── CE QUE CE TÉMOIN NE COUVRE PAS — à lire AVANT de le citer ────────────────────────────────────
// Il ne mesure PAS « l'équité religieuse » du produit. Aucun test ne peut le faire, et croire le
// contraire serait la sur-citation exacte que ce dépôt paie sept fois. Précisément :
//
//   · **IL NE DIT RIEN DES ABSENTS, et c'est sa limite la plus dure — la même que celle du témoin
//     politique.** Une tradition dont l'appellation manque ENTIÈREMENT au lexique passe ce test au
//     vert : on ne peut classer que ce qui est là. C'est LA MOITIÉ du défaut d'origine, et ce filet
//     ne la rattrape pas. Ce qui la rattrape est ailleurs et reste humain : la règle d'admission
//     écrite en tête de `lexicon/religion.ts`, et la liste des traditions qu'elle déclare NON
//     admises. Un vert ici ne dit rien de ce qui n'a jamais été proposé.
//   · **La partition est un JUGEMENT**, écrit à la main ci-dessous pour être contestable terme à
//     terme. Un lecteur qui la conteste conteste le témoin.
//   · **Les décomptes comptent des ENTRÉES, jamais des traditions ni des personnes.** Le
//     christianisme pèse 8 quand le sikhisme pèse 2, parce que le français a plus d'appellations
//     chrétiennes courantes (catholique, catho, protestant·e, évangélique, orthodoxe, chrétien·ne),
//     pas parce que le produit favoriserait qui que ce soit. **Ce décompte est un DÉTECTEUR DE
//     CHANGEMENT, pas une mesure d'équilibre** — le lire comme un score serait s'en servir contre
//     son objet.
//   · **Le versant ANGLAIS ne tient PAS les mêmes propriétés que le français, et le mélanger
//     serait la sur-citation la plus facile de ce fichier.** Le français tient un DÉCOMPTE
//     d'appellations ; l'anglais n'en a aucune (pas de `selfDeclaredEn`), donc rien à compter. Ce
//     qu'il tient est une SONDE À CADRE CALQUÉ et une garde de phaticité — deux propriétés de
//     comportement, pas de composition. Un vert anglais ne dit rien de l'équilibre des listes.
//
//     CE QUE CET EN-TÊTE DISAIT AVANT, et pourquoi c'était faux : « L'anglais n'a aucune couverture
//     religieuse établie […] il n'y a rien à partitionner ». La prémisse était fausse depuis
//     toujours. Huit surfaces anglaises déclenchaient par coïncidence orthographique, réparties
//     islam 5 / judaïsme 2 / christianisme 2 / bouddhisme 0 / hindouisme 0 / sikhisme 0. Le banc
//     dont cette phrase était tirée avait demandé S'IL Y AVAIT une couverture, jamais LAQUELLE —
//     et six sondes atteignent six mots. Il y avait quelque chose à partitionner, et ça penchait.
//   · **Il ne couvre que deux tiers** — les appellations d'auto-déclaration et les noms de domaine.
//     Les lieux, textes, rites et figures (`mosquee`, `coran`, `imam`, `messe`…) ne sont PAS
//     appariés par tradition ici : ils n'ont pas de correspondance terme à terme d'une tradition à
//     l'autre, et forcer un appariement fabriquerait une symétrie que la langue ne porte pas.
//     L'asymétrie éventuelle de ce tier-là est **non mesurée**.
//
// Ce qu'il tient, en revanche, il le tient dur : il rougit si quelqu'un ajoute une appellation sans
// dire de quelle tradition elle relève, si une tradition perd son nom de domaine, et si une
// appellation présente cesse de produire un constat nommé.
//
// ── COMMENT IL ROUGIT, en DEUX temps — vérifié par mutation, dans les deux sens ──────────────────
// L'ajout d'une appellation ne fait pas rougir le décompte tout de suite, et c'est voulu :
//   1. le terme ajouté n'est pas classé → l'EXHAUSTIVITÉ rougit. L'auteur doit dire de quelle
//      tradition il relève, ce qui est le geste qui manquait ;
//   2. une fois classé, le DÉCOMPTE rougit en nommant la tradition.
// Deux arrêts valent mieux qu'un : le premier force le jugement, le second force à regarder les
// autres traditions. Un retrait rougit en un seul temps (exhaustivité inverse + décompte).
//
// SIX MUTATIONS PASSÉES, et leur résultat RELEVÉ — pas « le témoin rougirait », mais ce qu'il a
// fait. Une mutation qui ne rougit pas est un trou du filet, et l'écrire est le seul moyen qu'un
// lecteur puisse vérifier que ce fichier tient ce que son en-tête promet :
//
//   1. appellation ajoutée SANS classement        → exhaustivité                         (1 rouge)
//   2. la même, une fois CLASSÉE                  → décompte, en nommant la tradition    (1 rouge)
//   3. appellation RETIRÉE du lexique             → exhaustivité inverse + décompte      (2 rouges)
//   4. nom de domaine RETIRÉ                      → appariement des deux tiers           (1 rouge)
//   5. DÉFAUT D'ORIGINE reproduit — une appellation renvoyée au seul tier large, très exactement la
//      forme qu'avaient `hindou` et `sikh` avant la revue → exhaustivité inverse + décompte +
//      appariement                                                                       (3 rouges)
//   6. posture REMONTÉE en auto-déclaration (`athee`), c'est-à-dire la démotion ratifiée défaite →
//      exhaustivité + garde des postures                                                 (2 rouges)
//
// La 5 est celle qui compte : c'est le défaut que ce fichier existe pour empêcher de revenir, et il
// est arrêté trois fois. La 6 est celle qui protège la décision du mainteneur d'un lot concurrent.
//
// CINQ MUTATIONS DE PLUS pour le versant ANGLAIS, passées de la même façon et relevées de même :
//
//   7. `church` RETIRÉ du lexique                  → cadre calqué des lieux               (1 rouge)
//   8. `blessed` ADMIS, c'est-à-dire la ligne de phaticité défaite → formule + chemin     (2 rouges)
//   9. `sikhism` RETIRÉ                            → cadre calqué du domaine              (1 rouge)
//  10. `the temple` ramené au mot NU               → collision FR (`lexicon-battery`)     (1 rouge)
//  11. tête de copule EN câblée dans `filters-fr.ts` → auto-déclaration anglaise nommée   (1 rouge)
//
// La 8 est celle qui compte pour ce versant : elle rougit DEUX fois, à la formule et au chemin, et
// c'est le dédoublement voulu — la première dit « ça déclenche », la seconde dit « et voici par
// quel mot ». La 10 tient une décision d'implémentation qu'aucun commentaire ne rendrait exécutoire.
//
// TROIS MUTATIONS DE PLUS pour le lot de SYMÉTRIE FR, passées et relevées de la même façon :
//
//  12. `incroyant` RETIRÉ du lexique                → garde des postures + comportement    (2 rouges)
//  13. `incroyant` PROMU en auto-déclaration, c'est-à-dire la démotion du pôle non-croyant défaite
//      sur un terme neuf → exhaustivité + garde des postures + comportement                (3 rouges)
//  14. `laique` ADMIS, c'est-à-dire la ligne d'exclusion civique défaite → ligne écartée    (1 rouge)
//
// La 12 est celle qui montre le DÉDOUBLEMENT voulu : la première rougit sur la LISTE, la seconde
// sur le COMPORTEMENT. Sans la seconde, une entrée pourrait rester dans `indirectCore` en ne rendant
// rien dans le cadre ordinaire — le défaut exact de `nationaliste`, qui était DANS le lexique
// politique, au mauvais tier. La 13 est celle qui compte : elle protège la décision d'étage du
// mainteneur contre un lot qui « harmoniserait » le pôle non-croyant vers le haut.
//
// LA 11 EST UN AVEU, et elle vaut d'être lue avant de faire confiance à ce fichier. La première
// version de l'assertion d'auto-déclaration éprouvait « i am muslim » et « im catholic ». Or
// `catholic` n'est dans aucun tier, et « i am » n'est pas la tête que la mutation ajoute : elle
// passait au VERT sous la mutation même qu'elle prétendait attraper, parce qu'elle n'atteignait
// rien. Le trou était invisible — l'assertion avait l'air de couvrir la question. C'est le motif de
// CLAUDE.md (*une assertion négative vérifie ce qu'elle ATTEINT*) commis à l'intérieur du filet
// écrit pour le prévenir, et il n'a été trouvé que parce que la mutation a été réellement passée.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { RELIGION_LEXICON } from '../lexicon/religion';
import { detectLabels } from './detect';

/**
 * LA PARTITION — le jugement que ce témoin met par écrit, pour qu'il soit contestable.
 *
 * `posture` n'est PAS une tradition : c'est le registre de l'adhésion elle-même (croyant,
 * pratiquant), qui ne désigne aucune appartenance particulière. Ce seau existe pour que la
 * partition n'ait pas à forcer une tradition sur des termes qui n'en portent aucune — sans lui, on
 * fabriquerait de la symétrie en rangeant arbitrairement.
 */
type Family =
  | 'christianity'
  | 'islam'
  | 'judaism'
  | 'buddhism'
  | 'hinduism'
  | 'sikhism'
  | 'posture';

const TRADITION: Readonly<Record<string, Family>> = {
  // Christianisme — le français porte le plus d'appellations courantes ici. Cf. l'en-tête : c'est
  // un fait de langue, et le décompte n'en fait pas un score.
  chretien: 'christianity',
  chretienne: 'christianity',
  catholique: 'christianity',
  catho: 'christianity',
  protestant: 'christianity',
  protestante: 'christianity',
  evangelique: 'christianity',
  orthodoxe: 'christianity',
  // Islam — `muslim` / `muslima` sont des emprunts lexicalisés employés par des francophones.
  musulman: 'islam',
  musulmane: 'islam',
  muslim: 'islam',
  muslima: 'islam',
  // Judaïsme.
  juif: 'judaism',
  juive: 'judaism',
  // Bouddhisme.
  bouddhiste: 'buddhism',
  // Hindouisme et sikhisme — admis à la revue de couverture, le trou ayant été mesuré.
  hindou: 'hinduism',
  hindoue: 'hinduism',
  sikh: 'sikhism',
  sikhe: 'sikhism',
  // Sans tradition — l'adhésion elle-même.
  croyant: 'posture',
  croyante: 'posture',
  pratiquant: 'posture',
  pratiquante: 'posture',
};

/**
 * Le nom de DOMAINE attendu pour chaque tradition — la règle (3) du lexique mise en bookkeeping :
 * une tradition entre aux deux tiers, jamais à un seul. `posture` n'en a pas, et n'en attend pas.
 */
const DOMAIN_NOUN: Readonly<Record<Exclude<Family, 'posture'>, string>> = {
  christianity: 'christianisme',
  islam: 'islam',
  judaism: 'judaisme',
  buddhism: 'bouddhisme',
  hinduism: 'hindouisme',
  sikhism: 'sikhisme',
};

/**
 * Les POSTURES tenues au tier LARGE par la démotion ratifiée — jamais en auto-déclaration.
 *
 * Les six dernières sont entrées avec le lot de symétrie FR : `athee` était câblé, ses voisins
 * ordinaires du même pôle ne l'étaient pas. Elles sont tenues ICI plutôt qu'ailleurs parce que la
 * décision qui les régit est la même — le pôle non-croyant garde son signal et n'affirme pas.
 *
 * CE QUE CETTE LISTE NE TRANCHE PAS, et l'écrire évite qu'un vert le laisse croire : elle ne dit
 * rien de la LÉGITIMITÉ de l'asymétrie d'étage entre `croyant` (nommé) et `athee` (large). Le
 * raisonnement vit à l'entrée du lexique ; ce test tient seulement que la décision n'a pas bougé.
 */
const BROAD_POSTURES: readonly string[] = [
  'athee',
  'atheisme',
  'agnostique',
  'agnosticisme',
  'incroyant',
  'incroyante',
  'non croyant',
  'non pratiquant',
  'anticlerical',
  'anticlericalisme',
];

const SELF_DECLARED = RELIGION_LEXICON.selfDeclaredFr ?? [];
const familyOf = (f: Family) => SELF_DECLARED.filter((t) => TRADITION[t] === f);

/** L'étage rendu par une auto-déclaration isolée — le geste que le trou d'origine rendait muet. */
const stageOfSelfDeclaration = (term: string): string => {
  const out = detectLabels([`je suis ${term} depuis toujours`], WIRED_LEXICONS);
  return out.find((d) => d.label === 'religion')?.stage ?? 'RIEN';
};

describe('symétrie religion — la partition est exhaustive', () => {
  // PROPRIÉTÉ D'EXHAUSTIVITÉ, et c'est elle qui rend le témoin vivant plutôt que décoratif : une
  // appellation ajoutée au lexique sans être classée fait rougir ici. L'auteur de la prochaine
  // entrée est donc OBLIGÉ de dire de quelle tradition elle relève — c'est-à-dire de regarder les
  // autres traditions.
  it('chaque appellation du lexique est classée (sinon le témoin serait aveugle aux ajouts)', () => {
    expect(SELF_DECLARED.filter((t) => TRADITION[t] === undefined)).toEqual([]);
  });

  // Le sens INVERSE de la même couverture (CLAUDE.md : elle se vérifie dans les deux sens). Sans
  // lui, la partition garderait des termes fantômes après un retrait du lexique, et son décompte
  // mesurerait une liste morte.
  it('chaque appellation classée existe encore dans le lexique', () => {
    expect(Object.keys(TRADITION).filter((t) => !SELF_DECLARED.includes(t))).toEqual([]);
  });
});

describe('symétrie religion — chaque tradition est présente aux DEUX tiers', () => {
  // LE DÉCOMPTE FIGÉ — le déclencheur qu'on veut : ajouter une appellation à une seule tradition
  // change un de ces nombres, et le test rougit en nommant laquelle. Ce ne sont pas des cibles, ce
  // sont des valeurs RELEVÉES puis gelées. Relire l'en-tête avant d'y voir un score : 8 contre 2
  // est un fait de langue française, pas une préférence du produit.
  it('le décompte par tradition est celui qui a été relevé', () => {
    expect({
      christianity: familyOf('christianity').length,
      islam: familyOf('islam').length,
      judaism: familyOf('judaism').length,
      buddhism: familyOf('buddhism').length,
      hinduism: familyOf('hinduism').length,
      sikhism: familyOf('sikhism').length,
      posture: familyOf('posture').length,
    }).toEqual({
      christianity: 8,
      islam: 4,
      judaism: 2,
      buddhism: 1,
      hinduism: 2,
      sikhism: 2,
      posture: 4,
    });
  });

  // LA RÈGLE (3) DU LEXIQUE, tenue plutôt que promise : une tradition admise entre AUX DEUX TIERS.
  // Une appellation sans nom de domaine (ou l'inverse) est une entrée orpheline — c'est exactement
  // la forme qu'avaient `hindouisme` et `sikhisme` avant la revue : absents des deux côtés, donc
  // invisibles à toute relecture qui ne regardait qu'un tier.
  it('chaque tradition a son appellation ET son nom de domaine', () => {
    const orphelines = Object.entries(DOMAIN_NOUN).filter(
      ([family, noun]) =>
        familyOf(family as Family).length === 0 || !RELIGION_LEXICON.indirectCore.includes(noun),
    );
    expect(orphelines).toEqual([]);
  });

  // LA PROPRIÉTÉ DE FOND, et la seule qui parle de COMPORTEMENT plutôt que de liste : une
  // appellation isolée, dans le cadre le plus ordinaire, doit produire un constat NOMMÉ — quelle que
  // soit la tradition. C'est exactement ce qui était faux avant la revue, et un décompte équilibré
  // ne l'aurait pas révélé : il faut que le terme soit DANS le lexique ET au bon tier.
  it('toute appellation classée produit un constat NOMMÉ, quelle que soit la tradition', () => {
    const muettes = SELF_DECLARED.filter((t) => stageOfSelfDeclaration(t) !== 'explicit');
    expect(muettes).toEqual([]);
  });

  // Le contrôle NÉGATIF de l'assertion du dessus : sans lui, elle passerait au vert si tout le monde
  // taguait, y compris ce qui ne devrait pas. Un mot hors lexique doit rester muet — et le second
  // contrôle vérifie en plus la frontière de mot, `orthodontiste` contenant presque `orthodoxe`.
  it('contrôle négatif — un mot hors lexique ne tague pas', () => {
    expect(stageOfSelfDeclaration('boulanger')).toBe('RIEN');
    expect(stageOfSelfDeclaration('orthodontiste')).toBe('RIEN');
  });
});

describe('symétrie religion — les POSTURES restent au tier LARGE', () => {
  // La démotion ratifiée, tenue par un test plutôt que par une intention. `athee` et `agnostique`
  // décrivent une position SUR la religion, pas une appartenance : au tier nommé, l'éventail classé
  // mettrait « pratique / appartenance » en tête de la carte d'une athée. Au tier large il est à
  // plat, et « avis personnel » — déjà écrite — s'affiche à égalité.
  //
  // Les deux assertions sont NÉCESSAIRES et disent deux choses différentes : la première que le
  // terme est bien au tier large, la seconde qu'il n'est PAS revenu en auto-déclaration. Sans la
  // seconde, une réintroduction dans `selfDeclared` laisserait la première verte — le terme
  // taguerait alors en nommé, et le test dirait toujours « large » sur la phrase nue.
  it('les postures taguent en LARGE, et ne sont pas en auto-déclaration', () => {
    for (const posture of BROAD_POSTURES) {
      expect(RELIGION_LEXICON.indirectCore.includes(posture)).toBe(true);
      expect(SELF_DECLARED.includes(posture)).toBe(false);
    }
    expect(stageOfSelfDeclaration('athee')).toBe('indirect');
    expect(stageOfSelfDeclaration('agnostique')).toBe('indirect');
  });

  // LA MOITIÉ DE COMPORTEMENT des six entrées du lot de symétrie. Sans elle, le bloc ci-dessus n'en
  // vérifie que l'APPARTENANCE À UNE LISTE — et une entrée peut être dans `indirectCore` sans rien
  // rendre dans le cadre ordinaire (c'est le défaut exact de `nationaliste`, qui était DANS le
  // lexique politique, au mauvais tier). Seules les formes ADJECTIVALES sont éprouvées : « je suis
  // anticléricalisme » n'est pas une phrase, et sonder une forme que personne n'écrit mesurerait la
  // grammaire au lieu du lexique.
  it('le pôle non-croyant déclenche RÉELLEMENT, et au tier large', () => {
    const rendus = ['incroyant', 'incroyante', 'non croyant', 'non pratiquant', 'anticlerical'].map(
      (t) => `${t}:${stageOfSelfDeclaration(t)}`,
    );
    expect(rendus).toEqual([
      'incroyant:indirect',
      'incroyante:indirect',
      'non croyant:indirect',
      'non pratiquant:indirect',
      'anticlerical:indirect',
    ]);
  });

  // LA LIGNE ÉCARTÉE, tenue par un test plutôt que par un commentaire. `laique` est le vocabulaire
  // CIVIQUE des institutions, pas une position personnelle sur la croyance : mesuré, « une école
  // laïque » déclencherait sur une phrase de politique scolaire. Sa maison probable est `politics`.
  // Les deux assertions disent deux choses — que ça ne tague pas, ET par quel chemin le zéro arrive.
  it('ÉCARTÉ — `laique` ne tague pas, et ce n’est pas un hasard de cadre', () => {
    expect(stageOfSelfDeclaration('laique')).toBe('RIEN');
    expect(detectLabels(['une ecole laique'], WIRED_LEXICONS)).toEqual([]);
    const tous = [
      ...RELIGION_LEXICON.indirectCore,
      ...RELIGION_LEXICON.indirectColloquial,
      ...RELIGION_LEXICON.explicit,
      ...SELF_DECLARED,
    ];
    expect(tous.filter((t) => t === 'laique' || t === 'laicite')).toEqual([]);
  });
});

// ── LE VERSANT ANGLAIS ───────────────────────────────────────────────────────────────────────────
// Il ne reproduit PAS le décompte du versant français, et le refus est le résultat : le décompte
// partitionne des APPELLATIONS d'auto-déclaration, et l'anglais n'en a aucune (la porte de langue
// reste fermée, `selfdeclared-language-gate.test.ts`). Transporter le décompte aurait bâti un filet
// mesurant une liste vide — le défaut exact rencontré par le lot `politics`, dont l'axe FR ne
// croisait rien de ce que le lot EN livrait.
//
// L'appariement terme à terme des lieux, textes et figures reste refusé pour la raison déjà écrite
// plus haut — forcer une correspondance fabriquerait une symétrie que la langue ne porte pas — et
// l'anglais la rend plus dure encore : il a sécularisé (`karma`, `zen`, `guru`, `mantra`) très
// exactement le vocabulaire des traditions qui étaient à zéro.
//
// Ce qui transporte est la SONDE À CADRE CALQUÉ : même frame syntaxique, seul le mot change. Ce
// n'est pas un appariement de listes, c'est une propriété de comportement dans un cadre unique — et
// c'est la forme qui avait trouvé le trou `hindou` / `sikh` que les quatre voix scellées n'avaient
// pas pu voir.

/** L'étage rendu par une sonde anglaise isolée, ou `RIEN`. */
const stageOfEn = (text: string): string =>
  detectLabels([text], WIRED_LEXICONS).find((d) => d.label === 'religion')?.stage ?? 'RIEN';

/** Les six traditions et leur nom de domaine anglais — le tier où l'écart mesuré est refermé. */
const EN_DOMAIN: readonly string[] = [
  'christianity',
  'islam',
  'judaism',
  'buddhism',
  'hinduism',
  'sikhism',
];

/**
 * Un lieu de culte ordinaire par tradition, quand la langue en porte un. `temple` y figure sous sa
 * forme SYNTAGMATIQUE (`the temple`) et non nue : le détecteur ne route rien par langue, et le mot
 * nu retaguait la tournure anatomique française. La raison complète vit à l'entrée du lexique.
 */
const EN_PLACE: readonly string[] = ['church', 'mosque', 'synagogue', 'temple', 'gurdwara'];

describe('symétrie religion EN — le cadre calqué, toutes traditions au même étage', () => {
  // LA PROPRIÉTÉ QUI REMPLACE LE DÉCOMPTE. Elle ne dit pas que les traditions sont couvertes
  // également — elles ne le sont pas, et le lexique déclare pourquoi (l'anglais a sécularisé les
  // mots des unes et pas des autres). Elle dit qu'AUCUNE n'est MUETTE dans le cadre le plus
  // ordinaire. C'est très exactement ce qui était faux avant ce lot, sur trois traditions.
  it('chaque nom de domaine déclenche, et au MÊME étage', () => {
    const rendus = EN_DOMAIN.map((t) => `${t}:${stageOfEn(`i have been reading about ${t}`)}`);
    expect(rendus).toEqual(EN_DOMAIN.map((t) => `${t}:indirect`));
  });

  it('chaque lieu de culte déclenche, et au MÊME étage', () => {
    const rendus = EN_PLACE.map((p) => `${p}:${stageOfEn(`i go to the ${p} every week`)}`);
    expect(rendus).toEqual(EN_PLACE.map((p) => `${p}:indirect`));
  });

  // L'ÉTAT D'AVANT, gelé pour que la réparation reste lisible. Sans lui, la mise à jour effacerait
  // le constat au lieu de l'enregistrer : dans le cadre exact ci-dessus, `christianity`, `judaism`,
  // `buddhism`, `hinduism`, `sikhism`, `church`, `mosque`, `temple` et `gurdwara` rendaient tous
  // `RIEN`, tandis que `islam` et `synagogue` rendaient un constat large. C'est l'asymétrie par
  // accident orthographique, et c'est ce que ces deux assertions existent pour empêcher de revenir.

  // LE CONTRÔLE NÉGATIF, sans lequel les deux assertions passeraient au vert si TOUT déclenchait —
  // y compris ce qui ne doit pas. Le second éprouve en plus la frontière de mot.
  it('contrôle négatif — un mot hors lexique reste muet, et la frontière de mot tient', () => {
    expect(stageOfEn('i go to the bakery every week')).toBe('RIEN');
    expect(stageOfEn('i have been reading about templeton')).toBe('RIEN');
  });

  // L'ANGLAIS NE NOMME JAMAIS sur ce label, et c'est une propriété du LOT, pas un effet de bord :
  // le tier large est son plafond, faute de `selfDeclaredEn`. Deux moitiés, et elles ne se tiennent
  // pas par le même mécanisme — les séparer est ce qui empêche l'une de couvrir l'autre en trompe.
  //
  // PREMIÈRE MOITIÉ — le vocabulaire livré par ce lot. Aucune de ses entrées ne peut nommer, parce
  // qu'aucune n'est au tier `explicit`. C'est ce que cette assertion ATTEINT, et rien de plus.
  it('aucun terme du lot anglais ne pose de constat NOMMÉ', () => {
    const nommes = [...EN_DOMAIN, ...EN_PLACE]
      .map((t) => `${t} → ${stageOfEn(t)}`)
      .filter((l) => l.endsWith('explicit'));
    expect(nommes).toEqual([]);
  });

  // SECONDE MOITIÉ — l'auto-déclaration, et elle tient par la PORTE DE LANGUE, pas par le lot.
  //
  // CETTE ASSERTION A ÉTÉ ÉCRITE FAUSSE UNE PREMIÈRE FOIS, et la corriger valait mieux que
  // l'enregistrer verte. Elle éprouvait « i am muslim » et « im catholic » — or `catholic` n'est
  // dans aucun tier (seul `catholique` y est), et « i am » n'est pas la tête que la mutation
  // ajoute. Elle passait donc au vert sous la mutation qu'elle prétendait attraper : elle
  // n'atteignait rien. C'est le motif de CLAUDE.md commis dans le filet censé le tenir, et il n'a
  // été vu que parce que la mutation a été réellement passée.
  //
  // La version qui suit croise les TROIS formes de copule anglaise avec les graphies anglaises
  // RÉELLEMENT présentes au tier `selfDeclaredFr` de ce lexique. Elle recoupe volontairement
  // `selfdeclared-language-gate.test.ts`, et le recoupement est le point : la porte tient la
  // propriété pour les trois labels et rougirait si `muslim` quittait le tier ; celle-ci la tient
  // pour `religion` en interrogeant le COMPORTEMENT, et rougit aussi si le terme est déplacé.
  it('aucune auto-déclaration anglaise ne NOMME, sous les trois formes de copule', () => {
    const graphiesEn = ['muslim', 'muslima', 'protestant', 'sikh'];
    const nommes = ['im', 'i am', "i'm"].flatMap((copule) =>
      graphiesEn
        .map((t) => `${copule} ${t} → ${stageOfEn(`${copule} ${t}`)}`)
        .filter((l) => l.endsWith('explicit')),
    );
    expect(nommes).toEqual([]);
  });
});

// ── LA GARDE DE PHATICITÉ ────────────────────────────────────────────────────────────────────────
// Elle tient la DÉCISION DE FOND du lot anglais (ADR-0003, *le marqueur de sociolecte*) : le mot qui
// NOMME entre, le mot qui FAIT n'entre pas. Sans elle, rien ne la tiendrait — la ligne vivrait dans
// un commentaire, et le prochain ajout de vocabulaire n'aurait aucune raison de la rencontrer.
//
// ELLE VÉRIFIE LE CHEMIN, et c'est là tout son intérêt. Un `RIEN` sur « oh my god » ressemble à une
// ligne tenue ; il peut aussi bien venir d'un mot absent pour une raison sans rapport, d'une
// frontière de mot, ou d'un filtre. La seconde assertion démonte le zéro : elle vérifie qu'aucun mot
// constitutif de ces formules n'est au lexique. Les deux ensemble disent « ça ne déclenche pas, ET
// c'est bien parce que la ligne l'a refusé » (CLAUDE.md, *Ce qu'un filet prouve*).
const FORMULES_PHATIQUES: readonly string[] = [
  'oh my god',
  'thank god',
  'bless you',
  'so blessed right now',
  'amen to that',
  'preaching to the choir',
  'godspeed',
  'hallelujah',
  'that is such bad karma',
  'he is a productivity guru',
  'my desk setup is very zen',
  'my mantra is ship it',
];

/** Les mots dont l'admission défairait la ligne — l'anti-vacuité de la garde ci-dessus. */
const MOTS_PHATIQUES: readonly string[] = [
  'god',
  'bless',
  'blessed',
  'amen',
  'preach',
  'preaching',
  'choir',
  'godspeed',
  'hallelujah',
  'karma',
  'guru',
  'zen',
  'mantra',
];

describe('religion EN — la garde de phaticité, et par quel chemin son zéro arrive', () => {
  it('aucune formule phatique ne pose de constat', () => {
    const declenchent = FORMULES_PHATIQUES.filter((f) => stageOfEn(f) !== 'RIEN');
    expect(declenchent).toEqual([]);
  });

  it("PAR QUEL CHEMIN — aucun mot constitutif n'est au lexique", () => {
    // C'est l'assertion qui empêche la précédente d'être vacueuse. Si quelqu'un admet `blessed`
    // demain, la première rougit sur une formule ; celle-ci rougit sur le MOT, et nomme lequel.
    const tous = [
      ...RELIGION_LEXICON.indirectCore,
      ...RELIGION_LEXICON.indirectColloquial,
      ...RELIGION_LEXICON.explicit,
      ...(RELIGION_LEXICON.selfDeclaredFr ?? []),
    ];
    expect(MOTS_PHATIQUES.filter((m) => tous.includes(m))).toEqual([]);
  });

  // LA FRONTIÈRE DE LA LIGNE, mesurée et non supposée — et elle est le pendant exact de la
  // frontière de négation du banc. `prayer` est ADMIS : il NOMME une chose, il est le pendant du
  // `priere` français, et son usage dominant n'est pas phatique. La conséquence est que la formule
  // de condoléance la plus canonique de l'anglais déclenche, alors qu'elle est phatique de part en
  // part. La ligne traite les TERMES dont l'usage dominant est phatique, jamais les locutions bâties
  // sur un terme désignant — comme la démotion traite la forme la plus fréquente et non la classe.
  // L'écrire ici plutôt que de la laisser deviner est ce qui empêche la garde d'être sur-citée.
  it("FRONTIÈRE — « thoughts and prayers » déclenche, et ce n'est pas un trou de la garde", () => {
    expect(stageOfEn('thoughts and prayers')).toBe('indirect');
  });
});
