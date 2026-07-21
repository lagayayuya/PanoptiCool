// Banc `en_identity` — la MESURE des cinq voix scellées dans `en-identity-registers.fixture.ts`.
//
// ── CE QUE CE BANC NE COUVRE PAS ─────────────────────────────────────────────────────────────────
// Les frontières de la FIXTURE valent ici sans être recopiées (une seule voix par situation, aucun
// registre hostile, `politics` porté par personne, le corps tenu à l'écart des bandes de vie). Ce
// que le présent fichier ajoute comme limite propre :
// - **Les cinq chiffres ne se somment jamais.** Cinq voix, cinq questions distinctes. Un total ou
//   une moyenne détruit précisément ce qui se lit ici.
// - **Le harnais compte des CELLULES, pas des raisons.** C'est la limite qui décide de la lecture de
//   ce banc, et le bloc `LE COMPTEUR VERT QUI NE PROUVE RIEN` plus bas montre qu'elle mord pour de
//   vrai sur `en_misread`.
// - **Aucune mesure de l'interface.** Ce banc ne dit rien de ce que l'utilisateur LIT ; il mesure des
//   étages et des preuves.
//
// ── LES CINQ PRÉDICTIONS SCELLÉES, ET LEUR SORT ──────────────────────────────────────────────────
// Écrites d'avance dans les `truthNotes`, tirées de la sonde. Les publier gagnantes ET perdantes est
// ce qui leur donne une valeur :
//
//   (1) `en_practising` — CONFIRMÉE, et à la lettre. Elle déclenchait, mais AUCUNE de ses cinq preuves
//       n'était son appartenance : `prayer`, `halal`, `mosque`, `ramadan`, `eid`. Le produit ne la
//       voyait que par ce qu'elle FAIT. ⚑ RÉPARÉ depuis (lot des adjectifs EN) : six preuves, son
//       « i am muslim » en fait partie.
//   (2) `en_trans_lived` — CONFIRMÉE, et plus étroitement que scellée. UNE seule preuve, l'unique
//       item où elle écrit la forme longue. Son auto-déclaration « i am trans » ne pèse rien.
//   (3) `en_idiomatic` — CONFIRMÉE, et PIRE que scellée. Je prédisais des torts ; j'obtiens un tort
//       au constat NOMMÉ (`health_physical[explicit]`) sur une plaisanterie à propos d'un gâteau.
//   (4) `en_left_evangelical` — CONFIRMÉE. Elle déclenche, avec SIX preuves contre cinq à la
//       pratiquante : le versant « avoir quitté » était mieux couvert que le versant « pratiquer ».
//       ⚑ ÉGALISÉ depuis, PAR LE HAUT — 6 contre 6, aucune preuve retirée à personne.
//   (5) `en_misread` — CONFIRMÉE dans ses deux parties, et c'était le résultat le plus dur du lot :
//       la seule identité que le produit savait voir chez elle était celle qu'elle NIE.
//       ⚑ RÉPARÉ depuis. Son item #0 compte, et DEUX chemins indépendants la portent. Le bloc dédié
//       garde l'état d'avant à côté de celui d'après — c'était le livrable du lot des adjectifs.
//
// ── DEUX INFÉRENCES D'ÉCRITURE PUBLIÉES FAUSSES ──────────────────────────────────────────────────
// (1) En lisant les preuves, j'ai d'abord conclu que le filtre de négation anglais fonctionnait,
//     parce que « i am not religious anymore » ne produisait rien chez `en_left_evangelical`.
//     C'ÉTAIT FAUX : ce zéro venait de l'ABSENCE du terme `religious`, pas du filtre. (Le terme est
//     admis depuis, et le zéro de la forme niée a changé de cause — voir le bloc `NÉGATION`.)
// (2) Et la CONCLUSION tirée du bloc `NÉGATION` était fausse à son tour, elle a voyagé jusqu'à la
//     fiche de dette, et elle y a été corrigée : « le filtre de négation anglais est
//     LABEL-SPÉCIFIQUE » décrivait comme un défaut ce qui est `subjectNotState` RATIFIÉ. Sur un
//     label de SUJET la négation porte la POLARITÉ et dégrade au lieu de supprimer. Il n'y a jamais
//     eu de filtre à écrire. Une entrée de dette fausse envoie la session suivante chasser un défaut
//     qui n'existe pas — plus coûteux qu'une entrée manquante.
//
// ── PAR QUEL CHEMIN LES ZÉROS ARRIVENT ───────────────────────────────────────────────────────────
// CLAUDE.md, *Ce qu'un filet prouve*. Trois zéros de ce banc ressemblent à des filtres qui marchent :
// l'un en est un, les deux autres sont des absences de vocabulaire, et rien dans un compteur ne les
// distingue. Les assertions plus bas le démontrent au lieu de le supposer.
//
// ── LES MUTATIONS PASSÉES, ET CE QU'ELLES ONT FAIT ───────────────────────────────────────────────
// Menées en worktree séparé, jamais dans l'arbre partagé — une mutation d'une session précédente y
// avait été brièvement visible et rapportée comme un vrai défaut par une session concurrente. Ce qui
// suit est ce que les mutations ont RÉELLEMENT fait, pas ce qu'on attendait d'elles :
//
//   · M1 — retirer le mot `gay` de l'item #2 de `en_misread` (« people assume i am gay » devient
//     « people assume things about me »). QUATRE assertions rougissent, et le résultat dépasse le
//     témoin : `en_misread` sort ENTIÈREMENT du label et rejoint `missedRecall`. La mutation ne
//     prouve donc pas seulement que le banc regarde — elle établit matériellement que toute la
//     présence de cette femme dans `sexuality` tient à UN mot nommant une identité qui n'est pas la
//     sienne.
//   · M2 — remplacer `diabetes` par `sugar` dans l'item #8 de `en_idiomatic`. Le tort au constat
//     NOMMÉ disparaît, et avec lui l'item #14 (`allergic to`) : les preuves passent de `[8, 14]` à
//     `[]`. RÉSULTAT NON PRÉVU, et il vaut d'être publié — `allergic to` seul ne suffisait pas, il
//     n'était retenu que parce que `diabetes` avait fait passer le label au-dessus du seuil. Un
//     terme faible devient donc une preuve citée à la faveur d'un terme fort, et le seuil ne protège
//     pas de ça.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { detectLabels } from './detect';
import { EN_IDENTITY_REGISTER_PERSONAS } from './en-identity-registers.fixture';
import { detectFor, expectBenchCounts } from './register-bench.harness';

const byId = (id: string) => {
  const persona = EN_IDENTITY_REGISTER_PERSONAS.find((p) => p.id === id);
  if (persona === undefined) throw new Error(`persona \`${id}\` absente de la fixture`);
  return persona;
};

const runOn = (texts: readonly string[]) => {
  const out = detectLabels([...texts], WIRED_LEXICONS);
  return out.map((d) => `${d.label}[${d.stage}]`).join(', ') || 'RIEN';
};

/** La voix privée d'un seul de ses items — l'ablation qui dit ce qui PORTE réellement l'étage. */
const without = (id: string, drop: number) =>
  runOn(
    byId(id)
      .items.filter((_, i) => i !== drop)
      .map((i) => i.text),
  );

/** Les index d'items cités comme preuve pour un label — le grain où vit le défaut. */
const evidenceOf = (id: string, label: string) =>
  (detectFor(byId(id)).find((d) => d.label === label)?.items ?? []).map((i) => i.itemIndex);

const x3 = (t: string) => runOn([t, t, t]);

describe('banc en_identity — comptage commun', () => {
  expectBenchCounts(EN_IDENTITY_REGISTER_PERSONAS, {
    // TROIS torts, et ils ne se lisent pas de la même façon — d'où l'interdiction de les sommer.
    // `en_trans_lived/religion` est une SALLE de concert (« church hall ») : c'est la troisième fois
    // dans ce dépôt qu'un lieu produit un constat religieux, après une recherche de restauration et
    // un lieu de répétition à bonne acoustique.
    // Les deux torts de `en_idiomatic` sont le vrai plancher de faux positifs anglais, et le premier
    // est au constat NOMMÉ.
    torts: ['en_trans_lived/religion', 'en_idiomatic/health_physical', 'en_idiomatic/religion'],
    // Aucune sur-classification : `en_left_evangelical` reste au constat LARGE, l'étage que son
    // sceau attendait. C'est la seule bonne nouvelle du lot, et elle est réelle.
    escalated: [],
    // Aucune correction d'annotateur : je ne conteste aucun des cinq sceaux après mesure.
    corrections: [],
    tortsAfterCorrection: [
      'en_trans_lived/religion',
      'en_idiomatic/health_physical',
      'en_idiomatic/religion',
    ],
    // ATTENTION À LA LECTURE — ce `[]` est le compteur le plus trompeur du fichier. Il dit que les
    // trois vécus portent un tag. Il ne dit RIEN de la raison pour laquelle ils le portent, et sur
    // `en_misread` la raison est la pire possible. Voir le bloc dédié.
    missedRecall: [],
    missedSignal: [],
    livedStages: {
      // Les trois vécus plafonnent au constat LARGE. Aucun n'atteint le constat nommé, là où les
      // voix françaises équivalentes des lots précédents l'atteignent pour la même vie.
      en_practising: 'indirect',
      en_trans_lived: 'indirect',
      en_misread: 'indirect',
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// LE COMPTEUR VERT QUI NE PROUVE RIEN — `en_misread`
// ─────────────────────────────────────────────────────────────────────────────────────────────────

describe('en_misread — le défaut est RÉPARÉ, et voici par quel chemin', () => {
  // CE BLOC A CHANGÉ DE SENS, ET C'EST LE LIVRABLE DU LOT DES ADJECTIFS. Il enregistrait le défaut
  // que la règle de symétrie existe pour interdire : tous les compteurs du harnais étaient verts
  // pendant que la seule identité visible chez elle était celle qu'elle NIE. Les assertions ne sont
  // pas supprimées, elles sont RETOURNÉES — l'état d'avant reste écrit à côté de l'état d'après,
  // sans quoi la mise à jour effacerait le constat au lieu de l'enregistrer.

  it('sa preuve n’est plus SEULEMENT l’identité qu’elle N’A PAS — son item #0 compte', () => {
    // AVANT : `[2]` — l'item #2 seul (« people assume i am gay because of the hair and the rugby »),
    // c'est-à-dire un rapport d'assignation par autrui, et rien d'autre.
    // APRÈS : `[0, 2]` — l'item #0 (« i am straight, for the fortieth time ») entre enfin.
    expect(evidenceOf('en_misread', 'sexuality')).toEqual([0, 2]);
  });

  it('son auto-déclaration VRAIE pèse enfin — la règle de symétrie est TENUE sur elle', () => {
    // AVANT : les deux premières lignes rendaient `RIEN` quand la troisième rendait déjà
    // `sexuality[indirect]`. Une auto-déclaration majoritaire muette en face d'une minoritaire
    // audible : c'est la définition même d'un détecteur de minorités.
    // APRÈS : les trois rendent le MÊME étage. C'est ce que la règle demande — « exactement
    // autant », pas « à son tour ».
    expect(x3('i am straight, for the fortieth time, she is my flatmate')).toBe(
      'sexuality[indirect]',
    );
    expect(x3('i am straight')).toBe('sexuality[indirect]');
    expect(x3('i am gay')).toBe('sexuality[indirect]');
  });

  it('DEUX CHEMINS INDÉPENDANTS la portent désormais — la marge de redondance, par chemin', () => {
    // ADR-0003 (*La symétrie d'un axe*) : ce qui se vérifie n'est pas le décompte mais la MARGE DE
    // REDONDANCE — combien de chemins indépendants mènent à un constat depuis chaque versant. Une
    // ablation par item la mesure directement, et c'est le seul instrument qui la voit.
    //
    // AVANT, l'ablation disait le défaut en deux lignes :
    //   · retirer l'item #0 (sa déclaration) → `sexuality[indirect]`, INCHANGÉ : elle ne pesait rien ;
    //   · retirer l'item #2 (l'assignation)  → `RIEN` : toute sa détectabilité tenait à autrui.
    // APRÈS, les deux ablations laissent un constat, chacune par l'autre chemin. Aucun des deux
    // items n'est plus load-bearing à lui seul.
    expect(without('en_misread', 0)).toBe('sexuality[indirect]');
    expect(without('en_misread', 2)).toBe('sexuality[indirect]');
  });

  it('CE QUI N’EST PAS RÉPARÉ — l’attribution par un tiers la tague toujours', () => {
    // À ne pas lire dans le vert ci-dessus. Son item #2 continue de produire une preuve : le lot
    // ajoute le chemin qui manquait, il n'en retire aucun. L'attribution par un tiers n'est filtrée
    // sur aucun label, c'est une dette ORTHOGONALE et entière, et toute extension de vocabulaire en
    // augmente mécaniquement la surface — désormais des deux côtés de l'axe, ce qui est la moins
    // mauvaise forme de croissance d'un défaut, pas son absence.
    expect(x3('people assume i am gay because of the hair and the rugby')).toBe(
      'sexuality[indirect]',
    );
    expect(x3('people assume i am straight')).toBe('sexuality[indirect]');
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// NÉGATION — ce que le filtre fait, et où il ne va pas
// ─────────────────────────────────────────────────────────────────────────────────────────────────

describe("la négation anglaise diffère par label — et c'est la doctrine, pas un trou", () => {
  it('`sexuality` — la négation est filtrée, et c’est un vrai filtre', () => {
    // Le zéro arrive bien par le filtre et non par une absence : la forme affirmative déclenche.
    expect(x3('i am gay')).toBe('sexuality[indirect]');
    expect(x3('i am not gay')).toBe('RIEN');
    expect(x3('i am not gay, i just have not fancied anyone i have met lately')).toBe('RIEN');
  });

  it('`religion` — la négation ne SUPPRIME pas, et ce n’est pas un défaut de filtre', () => {
    // CORRECTION D'UNE LECTURE, portée par ce fichier et par la fiche de dette : l'écart entre les
    // deux labels a été lu comme « le filtre de négation anglais est label-spécifique », donc comme
    // un manque à combler. Ce n'en est pas un — c'est `subjectNotState` faisant exactement ce qui a
    // été RATIFIÉ (ADR-0003, *L'état et le sujet*).
    //
    // Sur un label de SUJET, nier le prédicat ne retire pas le sujet : « je ne vais pas à la messe »
    // est sur la religion, et la négation en dit la POLARITÉ. La règle DÉGRADE explicit → indirect ;
    // un marqueur déjà indirect n'a nulle part où descendre, d'où l'égalité ci-dessous. Un lot qui
    // « réparerait » ça rendrait le produit sourd à l'opposition, qui est le registre dominant du
    // discours religieux — très exactement le silence sélectif qu'ADR-0003 condamne.
    //
    // Le contraste avec `sexuality` juste au-dessus n'oppose donc pas un filtre à un filtre absent :
    // il oppose un label d'ÉTAT à un label de SUJET, et les deux se comportent comme prévu.
    expect(x3('i am evangelical')).toBe('religion[indirect]');
    expect(x3('i am not evangelical')).toBe('religion[indirect]');
    expect(x3('i am agnostic')).toBe('religion[indirect]');
    expect(x3('i am not agnostic')).toBe('religion[indirect]');
  });

  it('« i am religious » — le terme était ABSENT ; il est là, et son zéro nié a changé de cause', () => {
    // AVANT : les DEUX lignes rendaient `RIEN`, et c'était l'inférence publiée fausse en tête de
    // fichier — le zéro de la forme niée ne mesurait pas le filtre, il mesurait un terme absent.
    //
    // APRÈS, le terme est admis, et les deux zéros se séparent. Le nouveau zéro de la forme niée a
    // une cause NOMMÉE et vérifiable : la négation BRISE LE PATTERN d'auto-déclaration (« not »
    // n'est pas un modificateur, donc le terme n'est plus collé à la copule). Ce n'est ni le filtre
    // de négation ni `subjectNotState` — c'est la structure du pattern.
    expect(x3('i am religious')).toBe('religion[indirect]');
    expect(x3('i am not religious')).toBe('RIEN');
  });

  it("l'ATTRIBUTION par un tiers n'est filtrée sur aucun des deux labels", () => {
    // Ni négation ni citation : quelqu'un rapporte ce qu'on lui prête. Le filtre ne couvre pas
    // cette forme, et c'est exactement par là que `en_misread` est taguée.
    expect(x3('people assume i am gay because of the hair and the rugby')).toBe(
      'sexuality[indirect]',
    );
    expect(x3('my friend thinks i am gay')).toBe('sexuality[indirect]');
    expect(x3('they keep saying i am gay')).toBe('sexuality[indirect]');
    expect(x3('she assumes i am agnostic')).toBe('religion[indirect]');
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// L'APPARTENANCE NE PÈSE RIEN — les deux voix vécues, et ce qui les porte réellement
// ─────────────────────────────────────────────────────────────────────────────────────────────────

describe("ce qui porte le constat n'est jamais l'identité", () => {
  it('`en_practising` — SIX preuves, et son appartenance en fait enfin partie', () => {
    // AVANT : `[1, 3, 4, 5, 6]` — prayer, halal, mosque, ramadan, eid. Cinq preuves de PRATIQUE, et
    // l'item #0 (« i am muslim ») absent : le produit voyait ce qu'elle FAIT, jamais ce qu'elle DIT
    // être. APRÈS : `[0, 1, 3, 4, 5, 6]`.
    expect(evidenceOf('en_practising', 'religion')).toEqual([0, 1, 3, 4, 5, 6]);
    expect(without('en_practising', 0)).toBe('religion[indirect]');
    // AVANT ce témoin rendait `RIEN`, et il servait à prouver que le zéro venait du TERME absent et
    // non de la construction. Le terme est là ; le témoin devient la contre-épreuve de sa présence.
    expect(x3('i am muslim, i have never made a secret of it')).toBe('religion[indirect]');
  });

  it('`en_trans_lived` — toute sa visibilité tient à UN item, celui de la forme longue', () => {
    expect(evidenceOf('en_trans_lived', 'sexuality')).toEqual([4]);
    // Le mot qu'elle dit employer réellement ne produit rien.
    expect(x3('i am trans, i have been out three years')).toBe('RIEN');
    // Et sans l'item où elle écrit la forme des formulaires, elle disparaît du label.
    expect(without('en_trans_lived', 4)).toBe('religion[indirect]');
  });

  it('`en_left_evangelical` — SIX preuves, désormais À ÉGALITÉ avec la pratiquante', () => {
    // AVANT : six preuves contre CINQ à la pratiquante — la femme SORTIE de l'évangélisme était
    // mieux détectée que celle qui pratique, sur un lexique qui portait la pratique et pas
    // l'appartenance. L'assertion était un `toBeGreaterThan`, et son vert enregistrait ce défaut.
    //
    // APRÈS : 6 contre 6. L'écart se ferme par le HAUT — aucune preuve n'est retirée à celle-ci,
    // c'est l'autre qui gagne la sienne. C'est la forme de réparation que la doctrine demande
    // (« admettre n'est pas évincer ») : on ne corrige pas une asymétrie en faisant taire un côté.
    expect(evidenceOf('en_left_evangelical', 'religion')).toEqual([1, 2, 3, 6, 9, 12]);
    expect(evidenceOf('en_left_evangelical', 'religion').length).toBe(
      evidenceOf('en_practising', 'religion').length,
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// LE PLANCHER DE FAUX POSITIFS — `en_idiomatic`
// ─────────────────────────────────────────────────────────────────────────────────────────────────

// CORRECTION FACTUELLE : ce bloc s'intitulait « trois torts ». `en_idiomatic` en porte DEUX
// (`health_physical`, `religion`) ; le troisième de la liste `torts` appartient à `en_trans_lived`.
// Le titre confondait le compte de la VOIX et celui du BANC.
describe('en_idiomatic — DEUX torts, dont un au constat NOMMÉ', () => {
  it('une plaisanterie sur un gâteau produit un constat de santé NOMMÉ', () => {
    // Le tort le plus coûteux du lot : haute confiance et quasi-factuel (« tu as écrit ce terme »),
    // sur une femme qui n'a aucune condition, à propos d'une part de gâteau.
    expect(x3('this cake is basically diabetes on a plate')).toBe('health_physical[explicit]');
    expect(evidenceOf('en_idiomatic', 'health_physical')).toEqual([8, 14]);
  });

  it("l'adjectif est câblé désormais, et l'écart d'ÉTAGE est ce qui protège cette voix", () => {
    // AVANT : « i am diabetic » → `RIEN`. La sonde avait établi que l'anglais câblait les NOMS de
    // condition et pas les adjectifs d'appartenance, et qu'une métaphore emprunte un NOM — d'où les
    // deux torts de cette voix, tous deux sur des noms.
    //
    // APRÈS, et c'est le pari du lot rendu vérifiable : l'adjectif entre, mais un étage EN DESSOUS.
    // La forme du trou et la forme de l'idiome coïncident toujours — combler le trou ajoute donc
    // forcément de l'idiome — et ce qui empêche cet ajout de coûter cher n'est pas un filtre, c'est
    // que le tier n'affirme jamais. Ses deux torts scellés restent au même endroit, au même étage.
    expect(x3('i am diabetic')).toBe('health_physical[indirect]');
    expect(x3('i have diabetes')).toBe('health_physical[explicit]');
  });

  it("et l'idiome qui la vise le plus est TOUJOURS un nom — le lot n'a rien ajouté ici", () => {
    // Le contrôle qui empêche de lire le vert ci-dessus comme « le lot a rendu cette voix sûre ».
    // Son tort NOMMÉ vient d'un nom, il est antérieur au lot, et il est intact.
    expect(x3('this cake is basically diabetes on a plate')).toBe('health_physical[explicit]');
  });

  it('`gospel` employé pour de la cuisine produit un constat religieux', () => {
    expect(x3('the gospel of low and slow')).toBe('religion[indirect]');
    expect(evidenceOf('en_idiomatic', 'religion')).toEqual([12]);
  });
});
