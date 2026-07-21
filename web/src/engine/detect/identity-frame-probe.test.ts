// Sonde à CADRE CALQUÉ — un même cadre promené sur 46 termes d'identité, les six labels plus
// l'identité de genre, en anglais ET en français.
//
// ── CE QU'UNE SONDE FAIT QU'UNE PERSONA NE PEUT PAS FAIRE ────────────────────────────────────────
// Une sonde balaie un AXE ; une persona échantillonne une VIE. Une voix ne porte qu'un ou deux termes
// par label, et son silence ne distingue JAMAIS « ce terme-là n'est pas câblé » de « rien de ce label
// ne l'est ». C'est la troisième fois dans ce dépôt qu'une sonde hors corpus trouve ce qu'aucune
// persona n'avait vu — et la raison est structurelle, pas chanceuse : les deux instruments ne
// regardent pas dans la même direction.
//
// ── CE QUE CETTE SONDE A ÉTABLI, ET CE QUE LE LOT DES ADJECTIFS EN A FAIT ────────────────────────
// CE QU'ELLE A TROUVÉ : la couverture anglaise n'était pas absente, elle était de FORME NOMINALE. Le
// lexique portait les NOMS de pratique et de condition (`islam`, `ramadan`, `mosque`, `depression`,
// `diabetes`) et la bande d'orientation, mais PAS les ADJECTIFS D'APPARTENANCE par lesquels les gens
// se décrivent : `muslim`, `catholic`, `depressed`, `diabetic`, `autistic` ne déclenchaient RIEN.
//
// CE QUI A ÉTÉ LIVRÉ DEPUIS : le tier `selfDeclaredEn`, et la table ci-dessous est mise à jour ligne
// à ligne. Trois choses à ne pas confondre en la lisant :
//   · les adjectifs admis déclenchent désormais, en constat LARGE — ce tier ne NOMME jamais ;
//   · la réparation est CADRÉE : seule l'auto-déclaration est atteinte. La 3ᵉ personne et le
//     syntagme nu restent muets (« my neighbour is diabetic » → RIEN), et c'est une frontière
//     déclarée, tenue par le bloc `chemin` plus bas ;
//   · certains zéros de la table sont des EXCLUSIONS mesurées, pas des trous — `orthodox`, `trans`,
//     `deaf`, `socialist`. Chacun a sa raison écrite à son lexique.
// Le français, lui, porte les deux formes ET les NOMME : l'écart d'étage entre les langues subsiste,
// par décision.
//
// ── DEUX HYPOTHÈSES PUBLIÉES FAUSSES, ET LA SECONDE EST PLUS COÛTEUSE QUE LA PREMIÈRE ────────────
// (1) L'écriture a d'abord conclu à un défaut de CADRE : « i am depressed » muet quand « i have
//     depression » déclenche ressemblait à une porte sur la copule. Le bloc `chemin` l'a RÉFUTÉ —
//     les mêmes termes étaient muets en 3ᵉ personne et en syntagme nu. C'était une ABSENCE DE TERME.
//
// (2) MAIS LA RÉFUTATION A LAISSÉ DEBOUT UNE SECONDE HYPOTHÈSE, que personne n'avait écrite parce
//     que personne ne la voyait : que le cadre, une fois les termes admis, ANCRERAIT — comme il le
//     fait en français. MESURÉ DEPUIS, ET FAUX. La copule ne désambiguïse pas en anglais : « im so
//     ocd about my desk drawers », « im autistic about train timetables » portent toutes le cadre.
//     C'est pourquoi le tier livré n'affirme jamais — ce qui protège est l'ÉTAGE, pas le cadre.
//     Détail et surface de mesure : `filters-en.ts`, sur `SELF_DECLARATION_HEADS_EN`.
//     Une hypothèse réfutée peut donc en abriter une autre, et c'est la leçon de méthode à garder.
//
// ── PAR QUEL CHEMIN LES ZÉROS ARRIVENT ───────────────────────────────────────────────────────────
// CLAUDE.md, *Ce qu'un filet prouve* : une assertion négative vérifie ce qu'elle ATTEINT. Deux pièges
// documentés ont été désamorcés PAR CONSTRUCTION, et non par confiance :
//
//   · le SEUIL DE RÉPÉTITION — le cas d'école du dépôt, où « aucune couverture anglaise » mesurait en
//     réalité un item unique sous le seuil. D'où trois VOLUMES par terme. Le piège s'est présenté :
//     `burnt out` est muet à un item et déclenche à trois. Une sonde à un item l'aurait déclaré non
//     câblé, à tort.
//   · le CADRE — d'où le bloc `chemin`, qui rejoue les termes muets en 3ᵉ personne et en syntagme nu.
//
// ── CE QUE CETTE SONDE NE COUVRE PAS ─────────────────────────────────────────────────────────────
// - **Elle ne mesure AUCUN faux positif.** Chaque énoncé est une auto-déclaration sincère hors
//   contexte. Elle ne dit rien de ce qui arrive à l'hyperbole, à l'homographie ou à la citation :
//   c'est le travail des bancs de registres, et un vert ici n'en dit rien.
// - **Elle ne mesure pas une VIE.** Un terme isolé n'est pas une personne : elle ne dit rien de ce
//   qui arrive quand le terme est noyé dans vingt items ordinaires, ni de qui n'emploie jamais le
//   terme attendu. Les personas seules voient ça.
// - **Un seul cadre par langue** (« i am X » / « je suis X »), plus les variantes du bloc `chemin`
//   sur un sous-ensemble. Les formes narratives longues ne sont pas balayées.
// - **Le pendant français est une TRADUCTION, donc une seconde variable.** Un écart EN/FR sur un
//   terme peut venir du terme et non de la langue. L'écart n'est lisible qu'en MASSE, jamais sur une
//   ligne isolée.
// - **`conflictual` est absent de ce balayage**, et c'est une propriété du label, pas un oubli : sa
//   porte est l'insulte ÉMISE VISANT quelqu'un, ce qui n'est pas une identité et n'a pas de forme
//   « je suis X ». Son rappel n'est pas mesuré ici.
// - **Le silence n'est PAS le résultat sûr.** Position du mainteneur, portée ici parce qu'elle change
//   la lecture : le produit montre ce qu'un algorithme déduirait. Un terme qui déclenche largement
//   n'est pas une mauvaise nouvelle, un silence n'est pas une bonne nouvelle — le silence est une
//   asymétrie de traitement entre deux utilisateurs, et elle n'affiche RIEN.
//
// ── CE QUI A ÉTÉ LU ──────────────────────────────────────────────────────────────────────────────
// LU : `CLAUDE.md` ; `register-bench.ts` ; `register-bench.harness.ts` ; les en-têtes des fixtures
// politique, religieuse et sexualité ; le corps de `en_lived_plain` ; le bloc de leçons de
// `sexuality-bench.test.ts`. NON LU, délibérément : `lexicon/*`, `filters-*.ts`, les documents de
// portabilité EN, `criteres-mesure-copule-en.md`.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { detectLabels } from './detect';

/** Le résumé d'une détection, ou `RIEN`. Trois items identiques : le volume qui passe le seuil. */
const run = (texts: readonly string[]) => {
  const out = detectLabels([...texts], WIRED_LEXICONS);
  return out.map((d) => `${d.label}[${d.stage}]`).join(', ') || 'RIEN';
};

const x3 = (t: string) => run([t, t, t]);

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 1. LE BALAYAGE APPARIÉ — la table figée
// ─────────────────────────────────────────────────────────────────────────────────────────────────

/** `label | terme EN | terme FR | attendu EN | attendu FR`. Valeurs RELEVÉES puis figées, jamais
 *  déduites de la sortie courante — une table qui se recalcule ne mesure rien. */
const SWEEP: readonly (readonly [string, string, string, string, string])[] = [
  ['religion', 'muslim', 'musulman', 'religion[indirect]', 'religion[explicit]'],
  ['religion', 'christian', 'chretien', 'religion[indirect]', 'religion[explicit]'],
  ['religion', 'catholic', 'catholique', 'religion[indirect]', 'religion[explicit]'],
  ['religion', 'jewish', 'juif', 'religion[indirect]', 'religion[explicit]'],
  ['religion', 'hindu', 'hindou', 'religion[indirect]', 'religion[explicit]'],
  ['religion', 'buddhist', 'bouddhiste', 'religion[indirect]', 'religion[explicit]'],
  ['religion', 'sikh', 'sikh', 'religion[indirect]', 'religion[explicit]'],
  // `orthodox` RESTE MUET, et c'est une EXCLUSION, pas un oubli : son usage dominant anglais est
  // « conforme, canonique » (« an orthodox approach », « orthodox economics »). Le français porte
  // `orthodoxe` en auto-déclaration et peut se le permettre ; l'anglais ne le peut pas. La ligne
  // ci-dessous est donc la seule tradition volontairement laissée à `RIEN`.
  ['religion', 'orthodox', 'orthodoxe', 'RIEN', 'religion[explicit]'],
  // AVANT LE LOT DES ADJECTIFS : ces trois-là étaient les SEULS termes religieux anglais à
  // déclencher, et ils disaient tous la NON-CROYANCE ou la distance — jamais l'appartenance à une
  // tradition. C'était le résultat le plus net du balayage, et c'est lui que le lot a réparé : les
  // sept lignes au-dessus sont passées de `RIEN` au constat large. La valeur d'avant est conservée
  // dans le commentaire plutôt que remplacée en silence.
  ['religion', 'atheist', 'athee', 'religion[indirect]', 'religion[indirect]'],
  ['religion', 'agnostic', 'agnostique', 'religion[indirect]', 'religion[indirect]'],
  ['religion', 'evangelical', 'evangelique', 'religion[indirect]', 'religion[explicit]'],

  ['sexuality', 'gay', 'gay', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['sexuality', 'lesbian', 'lesbienne', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['sexuality', 'bisexual', 'bisexuel', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['sexuality', 'asexual', 'asexuel', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['sexuality', 'pansexual', 'pansexuel', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['sexuality', 'queer', 'queer', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['sexuality', 'straight', 'hetero', 'sexuality[indirect]', 'sexuality[explicit]'],

  // L'identité de genre n'a PAS de label à elle : tout ce qui déclenche ici est rangé sous
  // `sexuality`. Ce n'est pas un défaut de câblage, c'est la doctrine à six labels (ADR-0003) — la
  // sonde le rend visible, elle ne le tranche pas.
  ['gender', 'trans', 'trans', 'RIEN', 'sexuality[explicit]'],
  ['gender', 'transgender', 'transgenre', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['gender', 'nonbinary', 'non binaire', 'sexuality[indirect]', 'sexuality[explicit]'],
  ['gender', 'genderfluid', 'genre fluide', 'sexuality[indirect]', 'RIEN'],
  ['gender', 'intersex', 'intersexe', 'sexuality[indirect]', 'RIEN'],

  // `politics` était MUET en anglais sur les neuf termes, tous volumes confondus — le dernier trou
  // de couverture connu, et le seul label anglophone sans tier d'auto-déclaration. Le lot
  // `selfDeclaredEn` l'a comblé : huit des neuf déclenchent désormais, en constat LARGE.
  // La valeur d'AVANT reste écrite ici, sans quoi la mise à jour effacerait le constat au lieu de
  // l'enregistrer — même discipline que la ligne `religion` plus haut.
  //     AVANT : les neuf à `RIEN`.  APRÈS : huit à `politics[indirect]`, `ecologist` inchangé.
  ['politics', 'socialist', 'socialiste', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'communist', 'communiste', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'conservative', 'conservateur', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'liberal', 'liberal', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'anarchist', 'anarchiste', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'feminist', 'feministe', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'marxist', 'marxiste', 'politics[indirect]', 'politics[explicit]'],
  ['politics', 'libertarian', 'libertarien', 'politics[indirect]', 'RIEN'],
  // `ecologist` reste à RIEN dans les DEUX langues, et le zéro ne dit pas la même chose des deux
  // côtés : en anglais le lexique porte `environmentalist` et NON `ecologist` (choix de forme, pas
  // d'exclusion doctrinale) ; en français `ecologiste` n'est pas au tier, `ecolo` l'est.
  ['politics', 'ecologist', 'ecologiste', 'RIEN', 'RIEN'],

  ['mental_health', 'depressed', 'depressif', 'mental_health[indirect]', 'mental_health[explicit]'],
  ['mental_health', 'bipolar', 'bipolaire', 'mental_health[indirect]', 'mental_health[explicit]'],
  ['mental_health', 'anxious', 'anxieux', 'mental_health[indirect]', 'mental_health[explicit]'],
  ['mental_health', 'schizophrenic', 'schizophrene', 'RIEN', 'mental_health[explicit]'],
  ['mental_health', 'autistic', 'autiste', 'mental_health[indirect]', 'RIEN'],
  // Muet à UN item, déclenche à TROIS — le seuil de répétition prit sur le fait. Le bloc `volume`
  // plus bas est ce qui empêche cette ligne d'être lue comme « non câblé ».
  [
    'mental_health',
    'burnt out',
    'en burnout',
    'mental_health[indirect]',
    'mental_health[explicit]',
  ],

  [
    'health_physical',
    'diabetic',
    'diabetique',
    'health_physical[indirect]',
    'health_physical[explicit]',
  ],
  [
    'health_physical',
    'asthmatic',
    'asthmatique',
    'health_physical[indirect]',
    'health_physical[explicit]',
  ],
  ['health_physical', 'disabled', 'handicape', 'RIEN', 'health_physical[explicit]'],
  ['health_physical', 'deaf', 'sourd', 'RIEN', 'RIEN'],
  ['health_physical', 'blind', 'aveugle', 'RIEN', 'RIEN'],
  ['health_physical', 'immunocompromised', 'immunodeprime', 'health_physical[indirect]', 'RIEN'],
  // CETTE LIGNE DISAIT « la SEULE auto-déclaration anglaise du balayage qui atteigne le constat
  // NOMMÉ, et elle est isolée : ses voisins immédiats de label sont muets ». L'observation était
  // JUSTE et sa lecture était fausse : ce n'était pas une singularité du terme, c'était un DÉFAUT.
  // `epileptic` était en `explicit` ET en `selfDeclaredEn` ; un terme aux deux tiers court-circuite
  // le second, donc il NOMMAIT dès un item — dans n'importe quel cadre, y compris « the editing in
  // that trailer is epileptic ». La sonde avait donc vu le tort, et l'avait rangé en curiosité.
  //
  // C'est le motif de CLAUDE.md par un chemin de plus : ce qui manquait n'était pas la mesure, c'est
  // qu'un écart isolé se lit spontanément comme une propriété du terme plutôt que comme un bug. Le
  // terme est retombé en LARGE avec ses voisins, et l'intersection qui l'avait produit est désormais
  // tenue par `detect/storey-intersection.test.ts`.
  [
    'health_physical',
    'epileptic',
    'epileptique',
    'health_physical[indirect]',
    'health_physical[explicit]',
  ],
];

describe('sonde à cadre calqué — balayage EN/FR', () => {
  it('la table entière tient, ligne à ligne', () => {
    const observed = SWEEP.map(([label, en, fr]) => [
      label,
      en,
      fr,
      x3(`i am ${en}`),
      x3(`je suis ${fr}`),
    ]);
    expect(observed).toEqual(SWEEP.map((row) => [...row]));
  });

  it("ANGLAIS — l'appartenance politique déclenche désormais, et des DEUX bords", () => {
    // AVANT LE LOT `selfDeclaredEn` : les NEUF rendaient `RIEN`, tous volumes confondus, et
    // l'assertion s'écrivait « aucun terme d'appartenance politique ne déclenche ». C'était le
    // dernier trou de couverture connu, et il valait pour les deux bords à la fois.
    //
    // APRÈS : huit sur neuf déclenchent, en constat LARGE. L'assertion est TOURNÉE, jamais
    // supprimée — la valeur d'avant reste écrite ci-dessus et à la table.
    //
    // ET LE SENS DE CETTE LIGNE A CHANGÉ, ce qui est le point : elle ne mesure plus une absence,
    // elle mesure que le rappel ne s'est pas installé d'UN SEUL CÔTÉ. Les huit couvrent les deux
    // bords (`socialist`, `communist`, `marxist`, `anarchist`, `feminist` / `conservative`,
    // `liberal`, `libertarian`) : un lot qui n'en réparerait qu'un ferait rougir ici sans avoir à
    // toucher au témoin de symétrie.
    const muets = SWEEP.filter(([label]) => label === 'politics').filter(
      ([, en]) => x3(`i am ${en}`) === 'RIEN',
    );
    expect(muets.map(([, en]) => en)).toEqual(['ecologist']);
  });

  it("ANGLAIS — l'appartenance religieuse déclenche désormais, et le pôle non-croyant AUSSI", () => {
    // AVANT LE LOT DES ADJECTIFS : `['atheist', 'agnostic', 'evangelical']` — les trois seuls, et
    // tous du côté de la non-croyance ou de la distance. C'était le résultat le plus net du
    // balayage, et il décrivait un détecteur de non-croyants.
    //
    // APRÈS : les sept traditions rejoignent les trois. La valeur d'avant reste écrite ci-dessus,
    // sans quoi la mise à jour effacerait le constat au lieu de l'enregistrer.
    const fired = SWEEP.filter(([label]) => label === 'religion')
      .filter(([, en]) => x3(`i am ${en}`) !== 'RIEN')
      .map(([, en]) => en);
    expect(fired).toEqual([
      'muslim',
      'christian',
      'catholic',
      'jewish',
      'hindu',
      'buddhist',
      'sikh',
      'atheist',
      'agnostic',
      'evangelical',
    ]);
  });

  it("et le SEUL zéro religieux qui reste est une EXCLUSION, pas un trou — c'est `orthodox`", () => {
    // Sans cette ligne, le zéro d'`orthodox` dans la table ne se distinguerait pas d'un oubli. Sa
    // cause est nommée au lexique : usage dominant anglais « conforme, canonique ».
    const muets = SWEEP.filter(([label]) => label === 'religion')
      .filter(([, en]) => x3(`i am ${en}`) === 'RIEN')
      .map(([, en]) => en);
    expect(muets).toEqual(['orthodox']);
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 2. LE VOLUME — le piège du seuil, désamorcé plutôt que supposé
// ─────────────────────────────────────────────────────────────────────────────────────────────────

describe('sonde — volume', () => {
  it('`burnt out` est MUET à un item et déclenche à trois', () => {
    // La ligne qui justifie tout le dispositif à trois volumes : le zéro à un item et le zéro d'un
    // terme absent ont exactement la même apparence.
    expect(run(['i am burnt out'])).toBe('RIEN');
    expect(x3('i am burnt out')).toBe('mental_health[indirect]');
  });

  it("un terme ABSENT reste muet à tous les volumes — l'autre chemin du zéro", () => {
    // AVANT LE LOT DES ADJECTIFS, cette propriété était portée par `muslim`, qui n'était câblé nulle
    // part. Il l'est désormais (tier `selfDeclaredEn`), et il ne peut donc plus tenir ce rôle : le
    // garder aurait transformé la démonstration en son contraire.
    //
    // `orthodox` le remplace, et le remplacement est FIDÈLE — c'est le seul terme religieux du
    // balayage volontairement laissé hors lexique (exclusion mesurée, cf. la table). La propriété
    // testée est inchangée : distinguer le zéro d'un terme ABSENT du zéro d'un terme sous SEUIL.
    expect(run(['i am orthodox'])).toBe('RIEN');
    expect(x3('i am orthodox')).toBe('RIEN');
    expect(
      run(['i am orthodox', 'i have been orthodox my whole life', 'everyone knows i am orthodox']),
    ).toBe('RIEN');
  });

  it('et le terme réparé, lui, déclenche aux MÊMES volumes — le témoin du remplacement', () => {
    // Sans lui, la substitution ci-dessus ressemblerait à un choix de confort. Elle enregistre une
    // réparation : `muslim` a changé de camp, et c'est vérifié plutôt qu'affirmé.
    expect(x3('i am muslim')).toBe('religion[indirect]');
  });
});

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 3. LE CHEMIN — ce qui a réfuté l'hypothèse de la copule
// ─────────────────────────────────────────────────────────────────────────────────────────────────

describe('sonde — chemin du zéro', () => {
  it("LA RÉPARATION EST CADRÉE : l'auto-déclaration déclenche, la 3ᵉ personne reste muette", () => {
    // AVANT LE LOT : les deux colonnes rendaient `RIEN`, et c'est ce qui a RÉFUTÉ l'hypothèse d'une
    // porte grammaticale — si la copule avait été filtrée, la 3ᵉ personne aurait déclenché. Elle ne
    // déclenchait pas : les termes étaient simplement absents.
    //
    // APRÈS, et c'est la FRONTIÈRE DU LOT, à lire avant de le citer : les termes sont admis au SEUL
    // tier `selfDeclaredEn`, qui ne se matche que par la copule. La colonne de gauche est réparée,
    // celle de droite ne l'est PAS — « my neighbour is diabetic » rend toujours `RIEN`. Le lot
    // répare l'auto-déclaration, il ne répare ni la 3ᵉ personne ni le syntagme nu.
    //
    // Ce n'est pas un oubli : admettre ces adjectifs NUS en `indirectCore` est une décision
    // distincte, à mesurer séparément — c'est la porte où « straight » a été mesuré à 1 → 4 torts.
    for (const term of ['muslim', 'catholic', 'depressed', 'diabetic']) {
      expect(x3(`i am ${term}`)).not.toBe('RIEN');
      expect(x3(`my neighbour is ${term}`)).toBe('RIEN');
    }
  });

  it('et les termes NON ADMIS restent muets dans les DEUX cadres — le zéro qui mesure une porte', () => {
    // Le contrôle qui empêche de lire le bloc ci-dessus comme « tout adjectif passe désormais par la
    // copule ». Ces quatre-là sont exclus à la porte d'admission, chacun pour une raison écrite à
    // son lexique : `progressive` (politics — adjectif d'usage général, verres et surcharge de
    // musculation), `trans` (préfixe ingérable), `deaf` et `disabled` (territoire hors périmètre).
    //
    // `socialist` TENAIT CE RÔLE et ne le peut plus : le lot `selfDeclaredEn` l'a admis, et le
    // garder ici aurait transformé la démonstration en son contraire. `progressive` le remplace, et
    // le remplacement est FIDÈLE — c'est un terme politique du même balayage, exclu par DÉCISION
    // (règle d'admission, ADR-0003) et non par oubli. La propriété testée est inchangée : distinguer
    // le zéro d'un terme ABSENT du zéro d'un terme sous seuil. Même substitution, même raison et même
    // écriture que `muslim` → `orthodox` au bloc `volume`.
    for (const term of ['progressive', 'trans', 'deaf', 'disabled']) {
      expect(x3(`i am ${term}`)).toBe('RIEN');
      expect(x3(`my neighbour is ${term}`)).toBe('RIEN');
    }
  });

  it('le témoin inverse — `gay` déclenche dans les trois mêmes cadres', () => {
    // Sans ce témoin, le bloc au-dessus passerait au vert même si le détecteur était éteint : c'est
    // la mutation la moins coûteuse qui distingue un filet vide d'un filet qui tient.
    expect(x3('i am gay')).toBe('sexuality[indirect]');
    expect(x3('my brother is gay')).toBe('sexuality[indirect]');
    expect(x3('gay bar')).toBe('sexuality[indirect]');
  });

  it("l'ADJECTIF déclenche désormais — mais un ÉTAGE EN DESSOUS du nom, et c'est la doctrine", () => {
    // LA FORME EXACTE DU TROU, telle que ce bloc la mesurait AVANT le lot :
    //     « i am depressed » → RIEN        « i have depression »  → mental_health[indirect]
    //     « i am diabetic »  → RIEN        « i have diabetes »    → health_physical[explicit]
    //     « i am muslim »    → RIEN        « i go to the mosque » → religion[indirect]
    //
    // APRÈS : la colonne de gauche déclenche. Elle ne rejoint PAS la droite pour autant, et l'écart
    // qui subsiste n'est pas un reste de trou — c'est la décision du lot. `selfDeclaredEn`
    // n'affirme jamais : « i have diabetes » NOMME, « i am diabetic » pose un constat LARGE.
    //
    // Que l'adjectif reste sous le nom est le résultat qu'il faut savoir lire. Ce n'est pas que
    // l'adjectif vaudrait moins ; c'est que le cadre anglais ne l'ancre pas (`filters-en.ts`), et
    // qu'on ne fait pas porter une affirmation à un cadre qui ne discrimine rien.
    expect(x3('i am depressed')).toBe('mental_health[indirect]');
    expect(x3('i have depression')).toBe('mental_health[indirect]');
    expect(x3('i am diabetic')).toBe('health_physical[indirect]');
    expect(x3('i have diabetes')).toBe('health_physical[explicit]');
    expect(x3('i am muslim')).toBe('religion[indirect]');
    expect(x3('i go to the mosque every friday')).toBe('religion[indirect]');
  });

  it("AUCUN de ces adjectifs n'atteint le constat NOMMÉ — la propriété qui borne le lot", () => {
    // La contre-épreuve du bloc ci-dessus, et elle est indifférente au terme : peu importe lequel
    // est admis demain à `selfDeclaredEn`, aucun ne peut nommer. Si cette ligne rougit, le tier a
    // changé d'étage — dire LEQUEL avant de mettre à jour quoi que ce soit.
    for (const p of [
      'i am depressed',
      'i am diabetic',
      'i am muslim',
      'i am gay',
      'i am straight',
      'i am transgender',
      'i am autistic',
    ]) {
      expect(detectLabels([p, p, p], WIRED_LEXICONS).filter((d) => d.stage === 'explicit')).toEqual(
        [],
      );
    }
  });
});
