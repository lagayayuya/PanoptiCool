// Témoin de SYMÉTRIE du lexique `politics` — le filet qui n'existait pas quand le biais est passé.
//
// ── POURQUOI CE FICHIER EXISTE ───────────────────────────────────────────────────────────────────
// Le lexique a livré, en français, un encodage asymétrique des deux camps : les identités de gauche
// au tier de l'IDENTITÉ (`selfDeclared`, constat NOMMÉ), celles de droite au tier des ACCUSATIONS
// (`indirectCore`, sous le seuil quand elles sont isolées). Mesuré : « je suis anarchiste » posait
// un constat nommé, « je suis nationaliste » n'en posait aucun.
//
// Personne ne l'avait écrit : chaque terme était entré pour une raison localement défendable, et le
// défaut vivait dans la COMPOSITION, pas dans un terme. Aucune relecture ne pouvait le voir — une
// relecture vérifie que chaque terme PRÉSENT est légitime, jamais que les ABSENTS le sont
// symétriquement. Et aucun test ne le tenait : avant ce fichier, le mot « symétrie » n'apparaissait
// dans aucun test du moteur.
//
// ── CE QUE CE TÉMOIN NE COUVRE PAS — à lire AVANT de le citer ────────────────────────────────────
// Il ne mesure PAS « l'équilibre politique » du produit. Aucun test ne peut le faire, et croire le
// contraire serait la sur-citation exacte que ce dépôt paie sept fois. Précisément :
//
//   · **Il mesure l'axe que J'AI CHOISI** — une partition gauche / droite / sans-camp des étiquettes
//     d'identité, plus deux répertoires thématiques. Cette partition est un JUGEMENT, écrit à la
//     main ci-dessous, et discutable terme à terme. Un lecteur qui la conteste conteste le témoin.
//   · **Il ne dit rien des ABSENTS.** Un camp dont le vocabulaire manque ENTIÈREMENT au lexique
//     passerait ce test au vert : on ne peut classer que ce qui est là. C'est la moitié du défaut
//     d'origine que ce filet ne rattrape pas, et c'est sa limite la plus dure.
//   · **Ce versant-ci ne couvre que le FRANÇAIS**, et le fichier en porte DEUX AUTRES qui ne
//     mesurent pas la même chose. Citer « le témoin de symétrie » sans dire lequel des trois ne veut
//     rien dire :
//       — IDENTITÉS FR (ici) : les deux camps produisent-ils un constat NOMMÉ ?
//       — IDENTITÉS EN : les deux camps atteignent-ils le MÊME ÉTAGE, sans qu'aucun ne nomme ?
//         La propriété diffère parce qu'en anglais rien ne nomme, par construction du tier.
//       — CHEMINS EN : combien de voies indépendantes mènent à un constat depuis chaque bord ? Cette
//         dernière ne conclut pas, et son en-tête dit pourquoi.
//   · **Il ne couvre que deux tiers** — `selfDeclared` et le répertoire thématique. Le registre des
//     ÉPITHÈTES (`gaucho`, `droitard`, `facho`…) n'est pas tenu : une épithète appartient à qui la
//     lance, l'axer reviendrait à classer des locuteurs, et ce n'est pas la même question.
//   · **Les décomptes comptent des ENTRÉES, pas des positions politiques distinctes.** Les paires
//     genrées (`conservateur`/`conservatrice`) pèsent deux ; l'égalité 14/14 ci-dessous est donc une
//     égalité d'entrées, et elle ne doit pas se lire comme un équilibre du champ.
//
// Ce qu'il tient, en revanche, il le tient dur : il rougit si quelqu'un ajoute une identité à UN
// SEUL camp, et il rougit si une identité présente cesse de produire un constat nommé.
//
// ── COMMENT IL ROUGIT, en DEUX temps — vérifié par mutation, dans les deux sens ──────────────────
// L'ajout d'une identité ne fait pas rougir le décompte tout de suite, et c'est voulu :
//   1. le terme ajouté n'est pas classé → l'EXHAUSTIVITÉ rougit. L'auteur doit dire de quel côté il
//      le range, ce qui est le geste qui manquait ;
//   2. une fois classé, le DÉCOMPTE rougit en nommant le camp (`{ right: 15 }` contre `{ right: 14 }`).
// Deux arrêts valent mieux qu'un : le premier force le jugement, le second force à regarder l'autre
// camp. Un retrait, lui, rougit en un seul temps (exhaustivité inverse + décompte).
//
// Mutations vérifiées : ajout à droite · ajout à gauche · retrait à droite · retour d'une identité
// de droite au seul tier des accusations, c'est-à-dire le défaut d'origine reproduit à l'identique.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { POLITICS_LEXICON } from '../lexicon/politics';
import { detectLabels } from './detect';

/**
 * La PARTITION — le jugement que ce témoin met par écrit, pour qu'il soit contestable.
 *
 * Une étiquette est `neutral` quand elle ne désigne pas un camp : le registre de l'ENGAGEMENT
 * (`militant`), le centre, l'absence revendiquée de camp. Ce troisième seau existe pour que la
 * partition n'ait pas à forcer un camp sur des termes qui n'en portent pas — sans lui, on
 * fabriquerait de la symétrie en rangeant arbitrairement.
 */
const AXIS: Readonly<Record<string, 'left' | 'right' | 'neutral'>> = {
  // Gauche.
  'de gauche': 'left',
  "d'extreme gauche": 'left',
  ecolo: 'left',
  anarchiste: 'left',
  anar: 'left',
  communiste: 'left',
  socialiste: 'left',
  insoumis: 'left',
  insoumise: 'left',
  libertaire: 'left',
  marxiste: 'left',
  feministe: 'left',
  syndique: 'left',
  syndiquee: 'left',
  // Droite.
  'de droite': 'right',
  "d'extreme droite": 'right',
  royaliste: 'right',
  monarchiste: 'right',
  gaulliste: 'right',
  souverainiste: 'right',
  nationaliste: 'right',
  patriote: 'right',
  reac: 'right',
  traditionaliste: 'right',
  conservateur: 'right',
  conservatrice: 'right',
  liberal: 'right',
  liberale: 'right',
  // Sans camp — engagement, centre, refus de camp.
  militant: 'neutral',
  militante: 'neutral',
  centriste: 'neutral',
  apolitique: 'neutral',
  macroniste: 'neutral',
};

const SELF_DECLARED = POLITICS_LEXICON.selfDeclaredFr ?? [];
const sideOf = (side: 'left' | 'right' | 'neutral') =>
  SELF_DECLARED.filter((t) => AXIS[t] === side);

/** L'étage rendu par une auto-déclaration isolée — le geste que le défaut d'origine rendait muet. */
const stageOfSelfDeclaration = (term: string): string => {
  const out = detectLabels([`je suis ${term} depuis toujours`], WIRED_LEXICONS);
  const politics = out.find((d) => d.label === 'politics');
  return politics === undefined ? 'RIEN' : politics.stage;
};

describe('symétrie politics — la partition est exhaustive', () => {
  // PROPRIÉTÉ D'EXHAUSTIVITÉ, et c'est elle qui rend le témoin vivant plutôt que décoratif : une
  // entrée ajoutée au lexique sans être classée fait rougir ici. L'auteur du prochain terme est
  // donc OBLIGÉ de dire de quel côté il le range — c'est-à-dire de regarder l'autre côté.
  it('chaque étiquette du lexique est classée (sinon le témoin serait aveugle aux ajouts)', () => {
    const nonClassees = SELF_DECLARED.filter((t) => AXIS[t] === undefined);
    expect(nonClassees).toEqual([]);
  });

  // Le sens INVERSE de la même couverture (CLAUDE.md : elle se vérifie dans les deux sens). Sans
  // lui, la partition garderait des termes fantômes après un retrait du lexique, et son décompte
  // mesurerait une liste morte.
  it('chaque étiquette classée existe encore dans le lexique', () => {
    const fantomes = Object.keys(AXIS).filter((t) => !SELF_DECLARED.includes(t));
    expect(fantomes).toEqual([]);
  });
});

describe('symétrie politics — les deux camps sont peuplés au MÊME tier', () => {
  // LE DÉCOMPTE FIGÉ — le déclencheur qu'on veut : ajouter une identité à un seul camp change un
  // de ces trois nombres, et le test rougit en nommant lequel. Ce ne sont pas des cibles, ce sont
  // des valeurs RELEVÉES puis gelées ; les faire bouger est légitime, les faire bouger d'un seul
  // côté sans le dire ne l'est pas.
  it('le décompte par camp est celui qui a été relevé', () => {
    expect({
      left: sideOf('left').length,
      right: sideOf('right').length,
      neutral: sideOf('neutral').length,
    }).toEqual({ left: 14, right: 14, neutral: 5 });
  });

  // LA PROPRIÉTÉ DE FOND, et la seule qui parle de comportement plutôt que de liste : une identité
  // isolée, dans le cadre le plus ordinaire, doit produire un constat NOMMÉ — des deux côtés.
  // C'est exactement ce qui était faux avant réparation, et un décompte équilibré ne l'aurait pas
  // révélé : `nationaliste` était DANS le lexique, au mauvais tier.
  it('toute identité classée produit un constat NOMMÉ, quel que soit le camp', () => {
    const muettes = SELF_DECLARED.filter((t) => stageOfSelfDeclaration(t) !== 'explicit');
    expect(muettes).toEqual([]);
  });

  // Le contrôle NÉGATIF de l'assertion du dessus : sans lui, elle passerait au vert si tout le
  // monde taguait, y compris ce qui ne devrait pas. Un mot hors lexique doit rester muet.
  it('contrôle négatif — une étiquette hors lexique ne tague pas', () => {
    expect(stageOfSelfDeclaration('boulanger')).toBe('RIEN');
    expect(stageOfSelfDeclaration('identitaire')).toBe('RIEN'); // exclusion assumée, cf. le lexique
  });
});

describe('symétrie politics — le répertoire THÉMATIQUE, apparié', () => {
  // Le second lieu du défaut : le tier thématique ne portait que le répertoire de MOBILISATION
  // (manif, grève, syndicat, pétition), qui est celui d'un camp. Ces paires sont écrites CÔTE À
  // CÔTE, à seuil égal (2 items), pour qu'un déséquilibre se lise sur une ligne.
  const PAIRES: readonly (readonly [string, [string, string], [string, string]])[] = [
    [
      'mobilisation / ordre',
      ['on va a la manif samedi', 'la greve continue lundi'],
      ["le retour de l'ordre public", "l'insecurite au quotidien"],
    ],
    [
      'dépense / prélèvement',
      ['le budget des services publics fond', 'la redistribution recule'],
      ['la fiscalite etouffe les petits', 'un impot de plus chaque annee'],
    ],
    [
      'collectif / souveraineté',
      ['le syndicat appelle a debrayer', 'signez la petition'],
      ["l'identite nationale se dissout", 'la souverainete nationale d abord'],
    ],
  ];

  for (const [nom, gauche, droite] of PAIRES) {
    it(`« ${nom} » — les deux versants taguent`, () => {
      expect(detectLabels([...gauche], WIRED_LEXICONS).map((d) => d.label)).toEqual(['politics']);
      expect(detectLabels([...droite], WIRED_LEXICONS).map((d) => d.label)).toEqual(['politics']);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// LE VERSANT ANGLAIS — et il ne se mesure PAS sur le même axe
// ═══════════════════════════════════════════════════════════════════════════════════════════════
//
// ── POURQUOI PAS LE MÊME AXE, et c'était la question la plus dure du lot ─────────────────────────
// Le versant FR ci-dessus partitionne des IDENTITÉS en gauche / droite. Transporter cette partition
// en anglais produirait un filet qui mesure l'équilibre sur une ligne que le vocabulaire anglais
// livré ne croise jamais. Trois raisons, et chacune suffit :
//   · le lot anglais ne contient AUCUNE identité — `selfDeclared` reste vide, il n'y a rien à
//     partitionner ;
//   · `liberal` inverse de camp selon le dialecte (gauche aux États-Unis, droite économique au
//     Royaume-Uni) : une partition anglaise dépendrait du lecteur, pas du texte ;
//   · il n'existe AUCUNE paire opposée anglaise scellée — `politics-registers.fixture.ts` le déclare
//     en toutes lettres, ses deux voix EN étant des GARDES et non une paire.
//
// L'axe retenu est donc celui des CHEMINS : combien de voies indépendantes mènent à un constat, de
// chaque bord. Un tableau équilibré en colonnes peut rester asymétrique en chemins, et c'est
// exactement ce que le versant français a appris.
//
// ── CE QUE CETTE SECTION NE PEUT PAS CONCLURE — à lire avant de la citer ─────────────────────────
// Les deux voix ci-dessous sont de MON écriture, et le vocabulaire aussi. Les compter l'une contre
// l'autre est donc CIRCULAIRE : ça mesure la cohérence interne du lot, jamais sa symétrie réelle.
// La démonstration en est directe, et elle est le vrai résultat de cette section : en cours de lot,
// l'ajout de DEUX termes choisis sans regarder ces voix a fait passer le compte de 1–0 en faveur
// d'un bord à 2–1 en faveur de l'autre. **Une paire de voix ne peut pas trancher une symétrie ; elle
// oscille sur un terme.**
//
// L'instrument qui trancherait est nommé, et il n'existe pas : une PAIRE OPPOSÉE ANGLAISE scellée à
// l'aveugle, deux voix engagées de densité égale, écrites par quelqu'un qui n'a pas vu ce lexique.
// Tant qu'elle manque, la symétrie du versant anglais est une ACCEPTATION ASSUMÉE, jamais mesurée.

// ═══════════════════════════════════════════════════════════════════════════════════════════════
// LES IDENTITÉS ANGLAISES — l'axe TRANSPORTE, mais sa propriété CHANGE DE FORME
// ═══════════════════════════════════════════════════════════════════════════════════════════════
//
// ── POURQUOI CETTE SECTION EXISTE, ET CE QU'ELLE CORRIGE ────────────────────────────────────────
// Le versant CHEMINS ci-dessous écartait la partition gauche / droite pour trois raisons. Deux ont
// EXPIRÉ avec le lot `selfDeclaredEn`, et la troisième visait la mauvaise cible :
//   · « le lot anglais ne contient AUCUNE identité » — expirée : il y en a 25 ;
//   · « aucune paire opposée anglaise scellée n'existe » — TOUJOURS VRAIE, et elle borne ce qu'on
//     peut CONCLURE (cf. la section CHEMINS), pas ce qu'on peut CLASSER ;
//   · « `liberal` inverse de camp selon le dialecte, donc la partition dépendrait du lecteur » —
//     vraie, et SANS EFFET SUR LE PRODUIT. Voir la frontière ci-dessous.
//
// ── LA PROPRIÉTÉ N'EST PAS CELLE DU VERSANT FRANÇAIS, et la copier serait faux ──────────────────
// Le défaut français était un défaut de TIER : la gauche à `selfDeclared` (constat NOMMÉ), la droite
// à `indirectCore` (accusation, sous le seuil). Sa propriété de réparation — *toute identité classée
// produit un constat NOMMÉ* — ne peut pas se transporter : en anglais, RIEN ne nomme, par
// construction du tier.
//
// Mais la question ne meurt pas, elle change de forme. Ce qui se vérifie ici est :
//
//     toute identité classée atteint EXACTEMENT `indirect`, au MÊME volume, des deux côtés
//     — et AUCUNE n'atteint `explicit`.
//
// Deux moitiés qui tiennent SÉPARÉMENT : l'égalité de PORTÉE (personne n'est muet) et l'égalité de
// PLAFOND (personne ne nomme). C'est la même question que le français posait — *les deux camps
// sont-ils encodés dans le même registre ?* — posée à la machinerie anglaise.
//
// ── CE QUE CETTE SECTION NE COUVRE PAS — à lire AVANT de la citer ───────────────────────────────
//   · **Elle ne voit pas les ABSENTS**, et c'est sa limite la plus dure, héritée telle quelle du
//     versant français : un camp dont le vocabulaire manquerait ENTIÈREMENT au lexique passerait au
//     vert. On ne peut classer que ce qui est là. La moitié du défaut d'origine reste hors filet.
//   · **`liberal` casse le BOOKKEEPING de ce fichier, pas le produit.** Son camp s'inverse selon le
//     dialecte (gauche aux États-Unis, droite économique au Royaume-Uni). Comme le tier ne nomme
//     jamais et que le constat produit dit `politics` — jamais « gauche », jamais « droite » —
//     l'inversion n'atteint AUCUNE sortie vue par un utilisateur : elle n'existe que dans le
//     classeur ci-dessous. D'où le quatrième seau `ambiguous`, qui est le même geste que le seau
//     `neutral` du versant français : ne pas forcer un camp sur un terme qui n'en porte pas un seul.
//     Un lot qui rangerait `liberal` à gauche ou à droite inscrirait un DIALECTE dans le dépôt.
//   · **Elle ne mesure AUCUN faux positif.** Le banc écrit pour ce lot s'est disqualifié (32/32, cf.
//     l'en-tête du lexique) : il mesurait la constructibilité d'une collision, pas l'usage dominant.
//     `conservative` et `liberal` sont des ACCEPTATIONS ASSUMÉES — sans instrument, et le mot est
//     *assumée*, jamais *mesurée*.
//   · **La partition est un JUGEMENT**, comme celle du versant français, et discutable terme à
//     terme : `feminist` et `environmentalist` à gauche reprennent ce que le français a déjà tranché
//     (`feministe`, `ecolo`). Un lecteur qui la conteste conteste le témoin, et c'est voulu.
//   · **Elle ne dit rien de la symétrie RÉELLE du champ anglais.** L'instrument qui trancherait est
//     nommé et n'existe toujours pas : une paire opposée anglaise scellée à l'aveugle.
//
// ── MUTATIONS RÉELLEMENT PASSÉES, et leur résultat RELEVÉ — pas « il rougirait » ────────────────
// Décompte du fichier entier, baseline 20 verts / 0 rouge.
//   1. `'ecosocialist'` ajouté au lexique, non classé      → 1 rouge : *chaque identité anglaise du
//      lexique est classée*. L'auteur du terme suivant est donc OBLIGÉ de dire de quel côté il le
//      range — c'est-à-dire de regarder l'autre côté, le geste qui manquait au français
//   2. le même, une fois CLASSÉ à gauche                   → 1 rouge : *le décompte par camp*
//      (`{left: 11}` contre `{left: 10}`). Deux arrêts valent mieux qu'un : le premier force le
//      jugement, le second force à regarder l'autre camp
//   3. `'conservative'` retiré du lexique                  → 2 rouges : exhaustivité inverse + décompte
//   4. `'conservative'` déplacé vers `indirectCore` SEUL   → **3 rouges, un de PLUS que prévu**
//   5. la partition vidée de ses entrées                   → **2 rouges, un de MOINS que prévu**
//
// LA 4 JUSTIFIE LA SECTION ENTIÈRE : c'est LE DÉFAUT FRANÇAIS REPRODUIT À L'IDENTIQUE — le terme
// reste DANS le lexique, au tier des accusations, exactement comme `nationaliste` l'était. J'en
// attendais 2 (exhaustivité inverse + décompte) ; la troisième est *aucune identité anglaise ne vit
// en `indirectCore` sans être au tier de l'identité*, c'est-à-dire la propriété écrite POUR ce cas,
// qui fait donc son office en plus des deux effets de bord. Le relever plutôt que de le prédire est
// ce qui distingue une garantie d'une intention.
//
// LA 5 A RENDU MOINS QUE PRÉVU, et c'est le résultat le plus instructif des cinq. J'annonçais 3
// rouges ; il y en a **2** — *chaque identité du lexique est classée* et *le décompte*. Les trois
// autres restent VERTES sur une partition VIDE, et il faut savoir pourquoi : l'exhaustivité inverse
// itère sur la partition (vide → aucun fantôme → vert), l'anti-récidive aussi (vide → rien à
// vérifier → vert), et les deux propriétés de comportement itèrent sur le LEXIQUE, pas sur la
// partition — elles continuent donc de mesurer quelque chose de vrai.
// **Trois des six propriétés de cette section sont donc vacueuses si la partition se vide**, et
// seules les deux premières l'empêchent. Elles portent l'anti-vacuité de tout le bloc : les retirer
// rendrait le vert des trois autres indistinguable d'un classeur mort.

/**
 * LA PARTITION ANGLAISE — quatre seaux, et le quatrième n'est pas une commodité.
 *
 * `ambiguous` existe pour `liberal` seul, dont le camp dépend du dialecte du lecteur. Le ranger de
 * force d'un côté inscrirait un dialecte dans le dépôt ; l'exclure du lexique n'en exclurait qu'un
 * des deux mots ordinaires des deux bords (cf. l'en-tête du lexique, la règle propre qui est biaisée).
 */
const AXIS_EN: Readonly<Record<string, 'left' | 'right' | 'neutral' | 'ambiguous'>> = {
  // Gauche.
  socialist: 'left',
  communist: 'left',
  marxist: 'left',
  anarchist: 'left',
  leftist: 'left',
  'left wing': 'left',
  'social democrat': 'left',
  'trade unionist': 'left',
  feminist: 'left',
  environmentalist: 'left',
  // Droite.
  conservative: 'right',
  'right wing': 'right',
  traditionalist: 'right',
  nationalist: 'right',
  monarchist: 'right',
  royalist: 'right',
  libertarian: 'right',
  'fiscal conservative': 'right',
  'social conservative': 'right',
  'classical liberal': 'right',
  // Sans camp.
  centrist: 'neutral',
  apolitical: 'neutral',
  'politically homeless': 'neutral',
  'swing voter': 'neutral',
  // Ambigu par dialecte — un seau à lui seul, cf. l'en-tête de section.
  liberal: 'ambiguous',
};

const SELF_DECLARED_EN = POLITICS_LEXICON.selfDeclaredEn ?? [];
const sideOfEn = (side: 'left' | 'right' | 'neutral' | 'ambiguous') =>
  SELF_DECLARED_EN.filter((t) => AXIS_EN[t] === side);

/** L'étage rendu par une auto-déclaration anglaise RÉPÉTÉE — le seuil vaut 2 sur ce label. */
const stageOfEnSelfDeclaration = (term: string): string => {
  const out = detectLabels([`i am ${term}`, `i am ${term} and always have been`], WIRED_LEXICONS);
  const politics = out.find((d) => d.label === 'politics');
  return politics === undefined ? 'RIEN' : politics.stage;
};

describe('symétrie politics EN — la partition des identités est exhaustive', () => {
  it('chaque identité anglaise du lexique est classée', () => {
    expect(SELF_DECLARED_EN.filter((t) => AXIS_EN[t] === undefined)).toEqual([]);
  });

  // Le sens INVERSE (CLAUDE.md : une couverture se vérifie dans les deux sens). Sans lui, la
  // partition garderait des fantômes après un retrait et son décompte mesurerait une liste morte.
  it('chaque identité classée existe encore dans le lexique', () => {
    expect(Object.keys(AXIS_EN).filter((t) => !SELF_DECLARED_EN.includes(t))).toEqual([]);
  });
});

describe('symétrie politics EN — les deux bords atteignent le MÊME étage', () => {
  // DÉCOMPTE FIGÉ — valeurs RELEVÉES puis gelées, jamais des cibles. L'égalité 10/10 est un
  // CONSTAT : une liste rendue symétrique par REMPLISSAGE serait un défaut pire que celui qu'on
  // répare, elle aurait l'air juste. Ce que le chiffre attrape est l'ajout d'un SEUL côté.
  it('le décompte par camp est celui qui a été relevé', () => {
    expect({
      left: sideOfEn('left').length,
      right: sideOfEn('right').length,
      neutral: sideOfEn('neutral').length,
      ambiguous: sideOfEn('ambiguous').length,
    }).toEqual({ left: 10, right: 10, neutral: 4, ambiguous: 1 });
  });

  // PREMIÈRE MOITIÉ — l'égalité de PORTÉE. C'est le transport de la propriété française : là-bas
  // « je suis nationaliste » était muet quand « je suis anarchiste » nommait. Ici, aucune identité
  // ne peut être muette pendant que celle d'en face déclenche.
  it('toute identité classée atteint `indirect`, quel que soit le camp', () => {
    const muettes = SELF_DECLARED_EN.filter((t) => stageOfEnSelfDeclaration(t) !== 'indirect');
    expect(muettes).toEqual([]);
  });

  // SECONDE MOITIÉ — l'égalité de PLAFOND, et elle tient SÉPARÉMENT. Si cette ligne rougit, le tier
  // a changé d'étage : dire LEQUEL avant de mettre à jour quoi que ce soit. Un `explicit` anglais
  // signifierait que le produit s'est mis à NOMMER un camp sur une copule qui n'ancre rien.
  it("AUCUNE identité anglaise n'atteint le constat NOMMÉ, à aucun volume", () => {
    const nommées = SELF_DECLARED_EN.filter((t) => {
      const p = `i am ${t}`;
      return detectLabels([p, p, p], WIRED_LEXICONS).some(
        (d) => d.label === 'politics' && d.stage === 'explicit',
      );
    });
    expect(nommées).toEqual([]);
  });

  // ANTI-RÉCIDIVE DU DÉFAUT FRANÇAIS — la propriété que rien d'autre ne tient. Le défaut d'origine
  // n'était pas une absence de terme : `nationaliste` ÉTAIT dans le lexique, au tier des
  // ACCUSATIONS. Une identité anglaise qui vivrait en `indirectCore` sans être au tier de
  // l'identité reproduirait exactement ça, et le décompte ci-dessus resterait vert.
  it("aucune identité anglaise ne vit en `indirectCore` sans être au tier de l'identité", () => {
    const auxAccusations = Object.keys(AXIS_EN).filter(
      (t) => POLITICS_LEXICON.indirectCore.includes(t) && !SELF_DECLARED_EN.includes(t),
    );
    expect(auxAccusations).toEqual([]);
  });

  // Le contrôle NÉGATIF : sans lui, les assertions ci-dessus passeraient au vert si TOUT taguait.
  it('contrôle négatif — un terme hors lexique reste muet', () => {
    expect(stageOfEnSelfDeclaration('baker')).toBe('RIEN');
    expect(stageOfEnSelfDeclaration('progressive')).toBe('RIEN'); // exclusion assumée, cf. le lexique
  });
});

/** Les paires THÉMATIQUES anglaises — la règle 2 de l'en-tête du lexique, mise en bookkeeping. */
const EN_PAIRS: readonly (readonly [string, string])[] = [
  ['minimum wage', 'tax burden'],
  ['trade union', 'red tape'],
  ['food bank', 'border control'],
  ['public services', 'law and order'],
];

/** Les entrées anglaises SANS camp : actes, institutions, et procédures transversales. */
const EN_UNSIDED: readonly string[] = [
  'i voted',
  'i registered to vote',
  'general election',
  'by election',
  'polling station',
  'postal vote',
  'ballot box',
  'parliament',
  'civil service',
  'public spending',
  'voter turnout',
  // Transversales : employées des deux bords, comme `laicite` côté FR. `means test` est une
  // procédure que l'un dénonce et que l'autre réclame ; « waste of public money » est une ligne de
  // droite autant que « public money built that » est une ligne de gauche.
  'means test',
  'means tested',
  'public money',
  'cost of living',
];

const ALL_MARKERS: readonly string[] = [
  ...POLITICS_LEXICON.explicit,
  ...POLITICS_LEXICON.indirectCore,
  ...POLITICS_LEXICON.indirectColloquial,
];

describe('symétrie politics EN — les paires sont des paires', () => {
  // LA PROPRIÉTÉ NON CIRCULAIRE de cette section, et la seule : un thème saillant n'entre qu'avec
  // son pendant. Retirer un seul membre d'une paire rougit ici — c'est le geste qui, côté français,
  // n'avait aucun lecteur.
  it('les deux membres de chaque paire sont dans le lexique', () => {
    const orphelins = EN_PAIRS.flatMap(([g, d]) => [g, d].filter((t) => !ALL_MARKERS.includes(t)));
    expect(orphelins).toEqual([]);
  });

  it('les entrées sans camp sont toutes présentes', () => {
    expect(EN_UNSIDED.filter((t) => !ALL_MARKERS.includes(t))).toEqual([]);
  });

  // Chaque membre déclenche RÉELLEMENT, dans le cadre le plus dépouillé. Sans ça, une paire pourrait
  // être « complète » dans la liste et morte dans la machinerie — le défaut exact de `nationaliste`,
  // qui était DANS le lexique, au mauvais tier.
  it('chaque membre de paire déclenche à seuil égal', () => {
    for (const [gauche, droite] of EN_PAIRS) {
      for (const terme of [gauche, droite]) {
        const out = detectLabels(
          [`the ${terme} question again`, `still thinking about the ${terme}`],
          WIRED_LEXICONS,
        );
        expect(out.map((d) => d.label)).toEqual(['politics']);
      }
    }
  });
});

describe('symétrie politics EN — les CHEMINS, et ce que deux voix ne prouvent pas', () => {
  // Deux voix engagées écrites en miroir, densité égale (10 items d'enjeu chacune), rédigées comme
  // des personnes et non comme des listes de déclencheurs. Elles sont de MON écriture : le compte
  // ci-dessous est un indicateur, jamais une mesure (voir l'en-tête de section).
  const EN_LEFT = [
    'landlords are hoarding empty flats while people sleep outside',
    'the union got us more in one week than five years of asking nicely',
    'billionaires should not exist, that is the whole post',
    'they will means test a food voucher but not a bank bailout',
    'every strike gets called selfish by people who inherited a house',
    'housing is a right not an asset class',
    'the hospital waiting list is a policy choice, not an accident',
    'they cut the budget then act surprised when the service fails',
    'wages have not moved in a decade and rent has doubled',
    'public money built that and a private firm now charges us for it',
  ];
  const EN_RIGHT = [
    'nobody voted for any of this',
    'the borders are a joke and everyone knows it',
    'taxed to death so someone else can sit at home',
    'they call you a bigot for saying what your gran said',
    'law and order used to mean something',
    'my council spends more on flags than on potholes',
    'every form takes an hour and three people to approve',
    'i employ four people and the paperwork costs me a week a month',
    'they raise the rate every year and the roads get worse',
    'the people who make the rules never have to live under them',
  ];

  const paths = (voix: readonly string[]) =>
    detectLabels([...voix], WIRED_LEXICONS).find((d) => d.label === 'politics')?.items.length ?? 0;

  // CHIFFRE RELEVÉ PUIS GELÉ, et il faut le lire tel qu'il est plutôt que tel qu'on l'espérait :
  // **sur cette paire, seule la voix de GAUCHE atteint un constat.** La droite reste sous le seuil.
  //
  // Ce n'est PAS le constat « le lexique anglais penche à gauche », et confondre les deux serait
  // refaire l'erreur que ce fichier existe pour empêcher. La cause est visible à l'œil : les deux
  // voix parlent des mêmes registres, mais celle de gauche a écrit deux locutions sous leur forme
  // CANONIQUE (« means test », « public money ») quand celle de droite a écrit les siennes sous une
  // forme libre — « taxed to death » et non `tax burden`, « every form takes an hour » et non
  // `red tape`, « the borders are a joke » et non `border control`. Le lexique porte les quatre
  // termes ; c'est ma PROSE qui n'en a déclenché qu'un côté.
  //
  // D'où le seul énoncé que ces deux voix autorisent : le lot ouvre des chemins TRÈS PEU nombreux,
  // et lesquels s'ouvrent dépend de la forme exacte employée, pas du camp. Une paire ne tranche pas
  // ça — il y faut une distribution.
  it('les chemins ouverts par le lot sur deux voix engagées, en miroir', () => {
    expect({ gauche: paths(EN_LEFT), droite: paths(EN_RIGHT) }).toEqual({ gauche: 2, droite: 0 });
  });

  // L'ÉQUIVALENT ANGLAIS DE L'ABLATION — en français, elle avait révélé que la voix de droite ne
  // tenait qu'à UN terme, sa marge de redondance étant nulle. Ici il n'y a pas d'axe grossier à
  // retirer (aucune identité anglaise n'est livrée), alors on retire un seul item porteur.
  //
  // Résultat : la MARGE DE REDONDANCE EST NULLE DES DEUX CÔTÉS. Le constat de gauche repose sur
  // exactement deux items, le minimum ; en retirer un le fait disparaître. Celui de droite n'existe
  // pas. C'est une symétrie de PAUVRETÉ, pas d'équilibre — et le dire dans ce sens est la seule
  // lecture honnête d'un vert.
  it('la marge de redondance est NULLE des deux côtés', () => {
    expect(paths(EN_LEFT.filter((t) => !t.includes('means test')))).toBe(0);
    expect(paths(EN_RIGHT.filter((t) => !t.includes('law and order')))).toBe(0);
  });
});
