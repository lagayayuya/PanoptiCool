// LA PORTE DE LANGUE de `selfDeclaredFr` — le témoin (PANO-35).
//
// ── Ce qu'il tient, et pourquoi il existe ────────────────────────────────────────────────────────
// `selfDeclaredFr` ne se matche QUE via les têtes de copule. Tant que les seules têtes câblées sont
// françaises, une entrée de graphie ANGLAISE présente dans ce tier est inatteignable en anglais.
// C'était vrai AVANT ce lot, et c'était vrai PAR ACCIDENT : personne ne l'avait décidé, rien ne
// l'écrivait, et rien n'aurait rougi si on l'avait défait.
//
// Mesuré (PANO-35, lot de la porte) : ajouter UNE seule tête anglaise activait d'un coup les quinze
// graphies anglaises ci-dessous, toutes en constat NOMMÉ, sans qu'aucune n'ait jamais été examinée
// pour l'anglais. Trois exemples relevés à la mesure, et ils ne sont pas des cas limites :
//
//   « im ace at darts »              → sexuality[explicit]   (« ace » = doué, en anglais courant)
//   « im bi weekly on the newsletter » → sexuality[explicit]
//   « im pretty liberal with the garlic » → politics[explicit]
//
// Sur `sexuality`, un constat nommé faux OUTE quelqu'un. C'est le coût d'erreur le plus élevé du
// produit, et il était à une ligne de distance.
//
// ── COMMENT IL ROUGIT : une assertion de COMPORTEMENT, pas une convention ────────────────────────
// Ce témoin n'inspecte pas des listes, il fait tourner le détecteur : pour chaque graphie anglaise
// du registre, et sous TROIS formes de copule, « <copule> <terme> » ne doit produire AUCUN constat
// nommé. Les trois formes sont un résultat de mutation, pas un confort. La propriété tient donc quelle
// que soit la façon dont quelqu'un casserait la porte — ajouter une tête EN à la liste FR, câbler
// des têtes EN sur `selfDeclaredFr`, ou déplacer un terme de tier. Une convention documentée aurait
// couvert le premier cas seulement.
//
// MUTATIONS PASSÉES, et leur résultat RELEVÉ — pas « il rougirait », mais ce qu'il a fait :
//   1. `'im'` ajouté à `SELF_DECLARATION_HEADS_FR`             → 15 rouges (une par graphie)
//   2. `'i am'` ajouté à `SELF_DECLARATION_HEADS_FR`           → 15 rouges
//   2b. `"i'm"` ajouté à `SELF_DECLARATION_HEADS_FR`           → 15 rouges
//   3. `'gay'` retiré de `selfDeclaredFr` (sexuality)          → 1 rouge (registre non tenu)
//   4. graphie inventée ajoutée au registre, absente du tier   → 1 rouge (registre non tenu)
//   5. tête EN câblée sur `selfDeclaredFr` DANS `detect.ts`    → 15 rouges
// La 5 est celle qui compte : elle défait la porte à l'endroit exact où elle est tenue — le site
// d'appel — sans toucher à aucune liste. Un témoin qui n'aurait inspecté que des listes l'aurait
// laissée passer. Les 3 et 4 tiennent le REGISTRE lui-même : sans elles, il pourrirait en silence
// et le vert du haut deviendrait vacueux.
//
// LA 2 EST UN AVEU, et elle vaut d'être lue. La première version de ce fichier n'éprouvait qu'une
// forme de copule (« im ») : la mutation 2 passait alors au VERT tout en activant les quinze
// graphies. Le trou était invisible, parce que la forme testée, elle, rougissait correctement.
// C'est le motif de CLAUDE.md (*Ce qu'un filet prouve*) commis à l'intérieur du filet censé le
// prévenir — et il n'a été trouvé que parce que la mutation a été réellement passée.
//
// ── CE QUE CE TÉMOIN NE COUVRE PAS ──────────────────────────────────────────────────────────────
// - **Il ne détecte pas l'anglais.** Le registre est écrit à la main. Une graphie anglaise ajoutée
//   demain à un tier `selfDeclaredFr` SANS être inscrite ici ne fera rougir personne. C'est la
//   limite de fond de ce fichier, et elle est irréductible : aucune heuristique fiable ne sépare
//   « muslim » de « musulman » sans dictionnaire. Ce qui la borne en pratique est la revue — et,
//   pour `religion`, l'exhaustivité déjà tenue par `religion-symmetry.test.ts`.
// - **`InterestLexicon.selfDeclared` est HORS PÉRIMÈTRE**, et ce n'est pas un oubli. Il porte lui
//   aussi des graphies anglaises (« cat mom », « cake designer »), il est lu par les mêmes têtes, et
//   il s'activerait pareil. Mais un thème d'intérêt faussement nommé n'oute personne et ne
//   pathologise personne : le coût d'erreur ne justifie pas d'étendre la porte à quarante fichiers,
//   ce qui aurait noyé la porte elle-même. Décision déclarée, à rouvrir si D2 devient sensible.
// - **Il ne dit rien du RAPPEL anglais.** Il vérifie qu'on ne nomme pas à tort ; il ne vérifie pas
//   qu'on détecte quoi que ce soit en anglais. Les deux tiers de la question restent ouverts.
// - **Il ne valide aucun terme pour le français.** Ce que fait le registre est l'inverse : il
//   enregistre que ces termes sont admis en FR **et non admis en EN**.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import type { TopicalLexicon } from '../lexicon/types';
import { detectLabels } from './detect';

/**
 * LE REGISTRE — les graphies anglaises admises pour le FRANÇAIS, et **non admises pour l'anglais**.
 *
 * Explicitement non admises, et c'est tout l'objet : elles étaient jusqu'ici *implicitement
 * inatteignables*, ce qui a exactement la même apparence et aucune des garanties. Chaque entrée dit
 * pourquoi elle est légitime en français, et ce qui la rend hasardeuse en anglais.
 *
 * Une entrée ici n'est PAS une proposition d'admission EN. Le jour où l'anglais sera livré, ces
 * termes se réexaminent un par un, dans `selfDeclaredEn`, contre la règle d'admission d'ADR-0003.
 */
const GRAPHIES_ANGLAISES_NON_ADMISES_EN: Readonly<Record<string, string>> = {
  // ── religion ──────────────────────────────────────────────────────────────────────────────────
  muslim:
    "emprunt lexicalisé employé par des francophones (cf. `religion-symmetry.test.ts`). En anglais c'est le mot ordinaire, et « im muslim » y est la forme normale de l'auto-déclaration — donc à examiner comme telle, pas à hériter.",
  muslima: 'même emprunt, forme féminine. Même raisonnement.',
  protestant:
    "graphie IDENTIQUE en anglais et en français. Le terme est aussi un adjectif ordinaire en anglais (« protestant crowd »), là où le français ne l'emploie guère hors du sens religieux.",
  sikh: 'graphie identique dans les deux langues ; admise en FR à la revue de couverture des traditions.',
  // ── sexuality ─────────────────────────────────────────────────────────────────────────────────
  gay: "identique dans les deux langues. En anglais, l'emploi intensificateur (« im so gay for this album ») est courant et n'est PAS une auto-déclaration — mesuré : il produisait un constat nommé.",
  bi: "identique. En anglais, « bi » est aussi le préfixe usuel de la périodicité (« im bi weekly on the newsletter ») — mesuré, constat nommé sur une phrase d'agenda.",
  homo: "identique. En anglais, surtout préfixe savant et registre injurieux — l'auto-déclaration y passe rarement par ce mot.",
  trans:
    'identique. En anglais, préfixe extrêmement productif (« trans european », « trans fat »).',
  queer:
    "identique. En anglais, adjectif ordinaire au sens d'« étrange » dans les registres soutenu et daté.",
  ace: "identique. En anglais courant, « ace » = excellent, doué (« im ace at darts ») — MESURÉ comme le pire faux positif du lot : il désignait quelqu'un comme asexuel sur une phrase de fléchettes.",
  aro: "identique. Chaîne très courte, et l'anglais la porte comme abréviation d'autre chose sans difficulté.",
  enby: "identique (lecture de « NB »). Anglophone d'origine, et c'est justement pourquoi son admission EN doit être décidée, pas héritée.",
  hetero: 'identique. En anglais, employé aussi comme préfixe savant (« hetero atom »).',
  cis: "identique, et admis en FR par la réparation de symétrie (« je suis cis » était muet quand « je suis trans » posait un constat nommé). En anglais c'est la même chaîne, et c'est aussi le préfixe savant de la chimie (« cis isomer », « cis fatty acid ») — la graphie est donc à réexaminer pour l'anglais, jamais à hériter. Son pendant `cisgender`, lui, n'est PAS admis en FR : le mettre au tier reviendrait à pré-charger une couverture latente.",
  // ── politics ──────────────────────────────────────────────────────────────────────────────────
  militant:
    "identique. En anglais, adjectif d'intensité disponible pour n'importe quel sujet (« im a militant about recycling ») — mesuré, constat politique nommé sur une phrase de tri sélectif.",
  liberal:
    "DANGER PARTICULIER, et il ne se règle pas dans ce lot — il se consigne. Le terme est entré au tier de l'identité comme identité de DROITE au sens français (libéralisme économique). En anglais, « liberal » désigne la GAUCHE. La même chaîne désigne donc des camps OPPOSÉS selon la langue. La réparation de symétrie livrée par le lot `politics` — qui tient que les identités de droite et de gauche entrent au même tier — se retournerait silencieusement en anglais : le terme y compterait du mauvais côté. À trancher au moment d'écrire `selfDeclaredEn`, jamais par héritage. (« im pretty liberal with the garlic » est par ailleurs un usage anglais banal, mesuré comme constat nommé.)",
};

/** Les lexiques topicaux câblés — les seuls porteurs de `selfDeclaredFr`. */
const TOPICAUX = WIRED_LEXICONS.filter((l): l is TopicalLexicon => l.kind === 'topical');

/**
 * Les formes de copule anglaise éprouvées — TROIS, et le nombre est un résultat de mutation, pas un
 * choix de confort. Une première version n'essayait que « im » : la mutation qui ajoute `'i am'` aux
 * têtes françaises passait alors au VERT, tout en activant les quinze graphies. Un témoin qui
 * n'éprouve qu'une forme d'une construction n'en couvre qu'une, et l'écart est invisible parce que
 * la forme testée, elle, rougit bien.
 *
 * Ce n'est PAS une liste de têtes candidates pour le lot 2 : c'est la surface d'attaque que ce
 * témoin balaie. Une tête EN d'une autre forme (« ive been », « i feel ») lui échapperait encore —
 * limite déclarée en tête de fichier.
 */
const COPULES_EN = ['im', 'i am', "i'm"] as const;

describe('porte de langue — aucune graphie anglaise ne NOMME via la copule', () => {
  for (const [terme, pourquoi] of Object.entries(GRAPHIES_ANGLAISES_NON_ADMISES_EN)) {
    it(`« <copule> ${terme} » ne pose AUCUN constat nommé, sous les trois formes`, () => {
      // L'assertion porte sur l'ÉTAGE et non sur l'absence de tag : plusieurs de ces termes vivent
      // AUSSI dans un tier indirect, où ils posent légitimement un constat large. Ce que la porte
      // interdit, c'est de NOMMER.
      const nommes = COPULES_EN.flatMap((copule) =>
        detectLabels([`${copule} ${terme}`], WIRED_LEXICONS)
          .filter((d) => d.stage === 'explicit')
          .map((d) => `${copule} ${terme} → ${d.label}`),
      );
      expect(nommes, `${terme} — ${pourquoi}`).toEqual([]);
    });
  }
});

/**
 * LES CADRES D'AUTO-DÉCLARATION ANGLAISE — la surface d'attaque du bloc ci-dessous.
 *
 * Ce ne sont pas des termes, ce sont des PHRASES entières, telles qu'un anglophone les écrit. C'est
 * ce qui rend le bloc indifférent au TIER : peu importe par où le constat nommé arriverait, il
 * arriverait sur l'une de ces phrases.
 *
 * LES TROIS FORMES DE COPULE Y SONT, et le nombre est un résultat de mutation, pas un confort — la
 * MÊME leçon que celle avouée plus haut pour `COPULES_EN`, et je l'ai d'abord recommise. La première
 * version de cette liste n'écrivait que « i am … ». La mutation qui ajoute `'im'` aux têtes
 * françaises la laissait alors intégralement VERTE, tout en activant les quinze graphies — seul le
 * bloc du haut rougissait. Le trou était invisible pour la raison habituelle : la forme que j'avais
 * écrite, elle, rougissait bien sous `'i am'`.
 *
 * Qu'elle ait été recommise DANS le fichier qui la documente vaut d'être écrit. Une leçon lue n'est
 * pas une leçon appliquée ; seule la mutation réellement passée fait la différence.
 */
const CADRES_EN = [
  // — forme pleine
  'i am gay',
  'i am a lesbian',
  'i am bisexual',
  'i am trans',
  'i am a trans woman',
  'i am transgender',
  'i am non binary',
  'i am queer',
  'i am asexual',
  'i am straight',
  // — formes CONTRACTÉES, les deux graphies (`normalize-fr` conserve l'apostrophe, et l'usage
  //   d'internet écrit tout autant sans). Leur absence est le trou avoué ci-dessus.
  'im gay',
  "i'm a lesbian",
  'im bi',
  "i'm trans",
  'im enby',
  "i'm asexual",
  // — routes NON copulaires : celles que le tier `explicit` emprunterait, et que le bloc du haut
  //   ne regarde pas du tout.
  'i came out as gay',
  'i came out to my dad last year',
  'my coming out was a non event',
  'my transition started two years ago',
  'i have been out since i was nineteen',
  'i identify as queer',
] as const;

describe('porte de langue — AUCUNE route ne NOMME en anglais, quel que soit le TIER', () => {
  // ── POURQUOI CE BLOC EXISTE : la porte déclarait quatre frontières et en manquait une ────────────
  // Le bloc du haut garde `selfDeclaredFr`, et il le garde bien. Mais `selfDeclaredFr` n'est PAS la
  // seule route vers le constat nommé : le tier `explicit` NOMME lui aussi, et il n'a besoin
  // d'AUCUNE tête de copule pour le faire — c'est ainsi que « mon coming out » produit un constat
  // nommé aujourd'hui. Une locution anglaise déposée dans `explicit` nommerait donc immédiatement,
  // et le bloc du haut serait resté VERT.
  //
  // Au moment où ce bloc est écrit, la route est LATENTE et non vivante (ADR-0003, *annoter*) :
  // aucune chaîne anglaise ne vit dans un tier `explicit` de `sexuality`. C'est une DETTE, pas un
  // état — et elle échoirait au premier lot tenté de contourner le blocage de la copule par ce
  // côté-là, c'est-à-dire au moment précis où plus personne ne relit la porte.
  //
  // ── CE QUI LE REND DIFFÉRENT DU BLOC DU HAUT, et c'est le point ──────────────────────────────────
  // Le bloc du haut itère sur un REGISTRE de termes : il ne voit que ce que le registre contient,
  // sa limite de fond déclarée en tête de fichier. Celui-ci itère sur des PHRASES et n'interroge que
  // l'ÉTAGE produit — indifférent au tier, au terme et au mécanisme. Une locution neuve déposée
  // demain dans `explicit`, un terme déplacé, une tête câblée au site d'appel : les trois le font
  // rougir sans qu'il ait à connaître aucun des trois.
  //
  // ── MUTATIONS RÉELLEMENT PASSÉES, et leur résultat RELEVÉ ────────────────────────────────────────
  // Pas « il rougirait » — ce que chacune a FAIT, décompte du fichier entier (15 tests au bloc du
  // haut, 3 ici), sur ce bloc dans son état final. Baseline : 0 rouge.
  //   1. `'my coming out'` ajouté à `SEXUALITY_LEXICON.explicit`    → 1 rouge, ICI (1ᵉʳ test)
  //   2. `'i came out as'` ajouté à `SEXUALITY_LEXICON.explicit`    → 1 rouge, ICI (1ᵉʳ test)
  //   3. `'im'` ajouté à `SELF_DECLARATION_HEADS_FR`                → 16 (15 + le 1ᵉʳ d'ici)
  //   3b. `'i am'` ajouté à `SELF_DECLARATION_HEADS_FR`             → 16 (idem)
  //   4. `'lesbian'` déplacé d'`indirectCore` vers `selfDeclaredFr` → **0 rouge. NON ATTRAPÉE.**
  //   5. l'anti-vacuité vidée de ses cadres                         → 0 rouge : le bloc passerait au
  //      vert en ne mesurant plus rien, et c'est pourquoi elle boucle sur une liste littérale
  //
  // LES 1 ET 2 SONT LA RAISON D'ÊTRE DU BLOC : elles ouvrent la route `explicit` sans toucher à
  // aucune tête, et le bloc du haut reste VERT sous les deux. C'est exactement le trou qu'il fallait
  // fermer, et il est fermé.
  //
  // LA 3 EST UN AVEU, ET C'EST LE DEUXIÈME DE CE FICHIER. Tant que mes cadres n'écrivaient que
  // « i am … », la mutation 3 laissait ce bloc intégralement vert tout en activant les quinze
  // graphies — seul le bloc du haut rougissait. J'avais lu, dix lignes plus haut, l'aveu identique du
  // lot précédent, et je l'ai recommis. Les formes contractées ont été ajoutées ensuite, et la
  // mutation repassée : 16.
  //
  // LA 4 EST NON ATTRAPÉE, ET C'EST UNE VRAIE LIMITE — ne pas la lire comme un succès. Déplacer
  // `lesbian` vers `selfDeclaredFr` ne fait rougir PERSONNE : ni ici (sans tête anglaise le terme
  // devient inatteignable, donc rien ne nomme — le vert est correct sur le fond) ni au bloc du haut
  // (son contrôle d'anti-pourrissement ne couvre que les graphies du REGISTRE, et `lesbian` n'y est
  // pas). Le déplacement est pourtant une régression réelle : il retire un constat LARGE anglais sans
  // rien poser à la place. Aucun témoin de ce fichier ne la voit. Ce qui la verrait est le banc de
  // registres, qui compte les preuves de `en_lived_plain` — et c'est là qu'elle est tenue, pas ici.
  //
  // ── CE QUE CE BLOC NE COUVRE PAS ────────────────────────────────────────────────────────────────
  // - **Il n'interroge que le label `sexuality`.** Délibéré : d'autres labels ont de bonnes raisons
  //   de nommer en anglais depuis `explicit` — une condition médicale nommée n'est pas une
  //   auto-déclaration d'identité. L'étendre aux six exigerait de trancher label par label qui a le
  //   droit de nommer : décision, pas témoin.
  // - **Les cadres sont écrits à la main**, avec la limite irréductible du registre du haut : une
  //   construction que je n'ai pas pensé à écrire n'est pas couverte. « ive always been », « turns
  //   out im » lui échappent.
  // - **Il ne dit rien du RAPPEL nommé.** Il vérifie qu'on ne nomme pas ; que l'anglais DOIVE un jour
  //   nommer est la question du lot de la copule, et ce bloc devra alors être rouvert, pas contourné.

  it('aucun cadre anglais ne produit un constat `sexuality` NOMMÉ', () => {
    const nommés = CADRES_EN.filter((cadre) =>
      detectLabels([cadre], WIRED_LEXICONS).some(
        (d) => d.label === 'sexuality' && d.stage === 'explicit',
      ),
    );
    expect(nommés).toEqual([]);
  });

  it('ANTI-VACUITÉ — les mêmes cadres en FRANÇAIS nomment, eux', () => {
    // Sans elle, le vert ci-dessus serait indistinguable d'un détecteur cassé, d'un lexique vidé ou
    // d'un label débranché. C'est la leçon C0 des critères de mesure de la copule : un instrument qui
    // ne peut pas atteindre ce qu'il mesure rend un zéro, et ce zéro ressemble exactement à un succès.
    for (const cadre of ['je suis lesbienne', 'je suis une femme trans', 'mon coming out']) {
      const nommé = detectLabels([cadre], WIRED_LEXICONS).some(
        (d) => d.label === 'sexuality' && d.stage === 'explicit',
      );
      expect(nommé, `« ${cadre} » devrait NOMMER en français`).toBe(true);
    }
  });

  it('et le constat LARGE anglais, lui, EXISTE — la porte ne referme pas le rappel', () => {
    // La porte interdit de NOMMER ; elle n'interdit pas de détecter. Si ce compte tombait à zéro, la
    // porte aurait cessé d'être une porte pour devenir un mur, et le vert du premier test mesurerait
    // ce mur au lieu de mesurer la porte.
    const larges = CADRES_EN.filter((cadre) =>
      detectLabels([cadre], WIRED_LEXICONS).some(
        (d) => d.label === 'sexuality' && d.stage === 'indirect',
      ),
    );
    expect(larges.length).toBeGreaterThanOrEqual(10);
  });
});

describe('porte de langue — le registre ne pourrit pas', () => {
  it('chaque graphie du registre est bien PRÉSENTE dans un tier `selfDeclaredFr`', () => {
    // Sans cette assertion, un terme retiré d'un lexique laisserait une entrée orpheline au
    // registre, et le vert du bloc précédent deviendrait vacueux — il testerait l'absence de ce qui
    // n'existe plus. C'est le motif « une assertion négative vérifie ce qu'elle ATTEINT »
    // (CLAUDE.md) : ici, ce qu'elle atteint est vérifié séparément.
    const admisFr = new Set(TOPICAUX.flatMap((l) => l.selfDeclaredFr ?? []));
    const orphelines = Object.keys(GRAPHIES_ANGLAISES_NON_ADMISES_EN).filter(
      (t) => !admisFr.has(t),
    );
    expect(orphelines).toEqual([]);
  });

  it('chaque graphie du registre porte une RAISON non vide', () => {
    // Une porte dont les motifs se vident est une liste d'interdits sans mémoire : le prochain
    // lecteur ne saurait plus si le terme est dangereux ou seulement ancien.
    const sansRaison = Object.entries(GRAPHIES_ANGLAISES_NON_ADMISES_EN)
      .filter(([, why]) => why.trim().length < 40)
      .map(([t]) => t);
    expect(sansRaison).toEqual([]);
  });
});
