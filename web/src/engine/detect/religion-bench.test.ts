// Banc `religion` — la mesure des quatre voix scellées en `religion-registers.fixture.ts`.
//
// ── CE QUE CE FICHIER NE COUVRE PAS, et il faut le lire AVANT les chiffres ───────────────────────
// - **Un tort subsiste et il est figé comme attendu.** Un attendu n'est pas un pardon : c'est
//   l'enregistrement d'un état, écrit pour rougir le jour où il change.
// - **La couverture des traditions n'est PAS tenue ici.** Ce banc a TROUVÉ le trou ; c'est
//   `religion-symmetry.test.ts` qui le tient. Citer ce banc-ci sur la couverture serait la
//   sur-citation exacte que CLAUDE.md décrit.
// - **Le rappel n'est mesuré que pour l'islam et un héritage catholique.** Les frontières
//   d'écriture sont déclarées dans l'en-tête de la fixture et ne sont pas recopiées ici.
// - **Rien de ce banc ne mesure l'anglais.** La quatrième assertion établit pourquoi plutôt que de
//   le supposer, et la conclusion est que `en_curious` ne prouve rien sur les faux positifs EN.
// - **Deux sondes hors-corpus font le gros du travail.** Les quatre voix seules n'auraient montré
//   NI le trou de couverture des traditions, NI la frontière du filtre de négation : les deux
//   vivent dans des sondes à cadre calqué, pas dans les personas. Un banc de quatre voix ne suffit
//   pas à ce label, et le dire est plus utile que de le prouver deux fois.
//
// ── CE QUE CE BANC A TROUVÉ, puis CE QUE LA RÉPARATION A DÉPLACÉ ────────────────────────────────
// Les cinq résultats d'origine sont conservés avec leurs valeurs d'AVANT : sans elles, la mise à
// jour effacerait le constat au lieu de l'enregistrer.
//
// 1. LA PAIRE S'EFFONDRAIT. `fr_practising` (pratique) et `fr_cultural_lapsed` (culture sans
//    croyance) atteignaient le MÊME étage, `explicit`.
//      · pratique `explicit` / culture `explicit`  →  `explicit` / `indirect`   — RÉPARÉ
// 2. ELLES NE TENAIENT PAS PAR LES MÊMES MOYENS, et c'est ce qui a rendu la réparation possible :
//    l'ablation montrait que la sur-classification de la voix de culture tenait à UNE phrase, pas à
//    tout ce qu'elle écrit. Densité de preuves 6 / 4 — INCHANGÉE par la réparation, et il faut le
//    dire dans ce sens : les étages ont divergé, les densités non.
// 3. LA NÉGATION AVAIT UNE FRONTIÈRE tombant sur la phrase la plus ordinaire du sujet.
//      · « catholique mais je ne crois pas » : `explicit`  →  `indirect`        — RÉPARÉ
// 4. LA COUVERTURE FR DES TRADITIONS EST TROUÉE — non traité ici. Le témoin de symétrie par
//    tradition (`religion-symmetry.test.ts`) est le filet qui le tient, et c'est LUI qu'il faut
//    citer sur cette question, pas ce banc.
// 5. L'ANGLAIS N'A AUCUNE COUVERTURE RELIGIEUSE ÉTABLIE — inchangé.
//
// ── LA RÉPARATION RATIFIÉE : DÉMOTION, PAS FILTRAGE ─────────────────────────────────────────────
// Deux cas devaient cesser d'AFFIRMER sans cesser d'être VUS : l'auto-déclaration contredite et le
// vocabulaire dense d'une critique. Les deux produisent désormais un constat LARGE.
//
// Le raisonnement ratifié porte sur l'ÉTAGE et non sur le sujet : `religion` porte trois lectures
// (pratique/appartenance · avis personnel · curiosité), et « avis personnel » couvre exactement
// l'athée qui argumente. Au tier nommé l'éventail est CLASSÉ et met pratique/appartenance en
// premier — une athée recevait donc une carte privilégiant « elle pratique » quand la lecture juste
// existait déjà, au second rang. Au tier large l'éventail est à PLAT : la carte devient vraie sans
// rien inventer. Une carte `religion` sur une athée militante est LÉGITIME — elle écrit sur la
// religion en permanence, une plateforme le lirait — elle ne doit simplement pas affirmer.
//
// L'élargissement du filtre de négation a été REJETÉ, et la raison se garde : effacer serait faux.
// Quelqu'un qui écrit « catholique mais je ne crois pas » A une relation à cette tradition, c'est
// le sujet de sa phrase.
//
// ── LA FRONTIÈRE DE LA RÉPARATION, mesurée et non supposée ──────────────────────────────────────
// La démotion s'appuie sur une négation ATTACHÉE au verbe d'adhésion (« ne crois PAS »). Les
// tournures d'éloignement qui n'en portent pas continuent de NOMMER — mesuré, pas déduit :
// « je suis musulmane et je ne crois plus vraiment » rend toujours un constat nommé, `plus` n'étant
// pas un marqueur de négation. C'est exactement le « ça n'aurait pas de fin » qui a fait rejeter le
// filtrage, et la démotion en hérite : elle traite la forme la plus fréquente, pas la classe.
// L'assertion qui le fige est plus bas ; un vert sur ce banc ne dit RIEN des autres tournures.

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon/index';
import { detectLabels } from './detect';
import { detectFor, expectBenchCounts } from './register-bench.harness';
import { RELIGION_REGISTER_PERSONAS } from './religion-registers.fixture';

const byId = (id: string) => {
  const persona = RELIGION_REGISTER_PERSONAS.find((p) => p.id === id);
  if (persona === undefined) throw new Error(`persona \`${id}\` absente de la fixture`);
  return persona;
};

/** Nombre de preuves `religion` citées pour une persona — le grain où vit l'asymétrie. */
const religionEvidence = (id: string) =>
  detectFor(byId(id)).find((d) => d.label === 'religion')?.items.length ?? 0;

/** Le résumé d'une détection sur un texte isolé, ou `RIEN`. */
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

describe('banc religion — comptage commun', () => {
  expectBenchCounts(RELIGION_REGISTER_PERSONAS, {
    // DEUX torts BRUTS, et ils ne se lisent pas pareil — c'est pour ça qu'ils ne se somment pas.
    // `fr_critic` est le désaccord scellé d'avance, désormais tranché et donc CORRIGÉ plus bas.
    // `en_curious` est un tort à UN item, et la dernière assertion établit qu'il ne mesure pas le
    // tri du détecteur.
    torts: ['fr_critic/religion', 'en_curious/religion'],
    // AVANT RÉPARATION : `['fr_cultural_lapsed/religion']` — la voix de culture était promue en
    // constat NOMMÉ, le tort propre à son état. La démotion l'a ramenée au constat large, l'étage
    // que son sceau attendait. C'est la ligne dont le retournement se lit comme une réparation.
    escalated: [],
    // La correction d'annotateur, et elle ne relâche RIEN : le harnais vérifie que le sceau
    // d'origine est intact, puis publie un second chiffre à côté du premier. Le tort de `fr_critic`
    // reste visible au compteur brut ci-dessus ; ce qu'il cesse d'être, c'est un tort NON EXPLIQUÉ.
    corrections: [
      {
        personaId: 'fr_critic',
        label: 'religion',
        sealed: 'nonCarrier',
        corrected: 'signalWithoutLived',
        why: "Le sceau lisait un constat `religion` comme un énoncé sur la religion DE la personne, et concluait au tort puisqu'elle n'en a aucune. Le mainteneur a tranché autrement, et la raison tient : `religion` porte la lecture « avis personnel », qui la décrit exactement. Le signal est donc RÉEL sans porter d'appartenance — c'est la définition de `signalWithoutLived`. Ce qui restait juste dans le sceau est conservé par le compteur de sur-classification : un constat NOMMÉ sur elle demeure un tort, et c'est lui que la démotion a retiré.",
      },
    ],
    tortsAfterCorrection: ['en_curious/religion'],
    missedRecall: [],
    missedSignal: [],
    // Le vécu atteint bien un constat nommé — c'est le PREMIER rappel `religion` jamais mesuré dans
    // ce dépôt, et la réparation ne l'a PAS coûté : c'était la condition posée à la démotion, et
    // elle est vérifiée par ablation plus bas plutôt que raisonnée.
    livedStages: {
      fr_practising: 'explicit',
    },
  });
});

describe("banc religion — la PAIRE, et l'écart que le comptage générique ne voit pas", () => {
  // Piège propre à CETTE paire, et il diffère de celui de la paire politique : les deux voix
  // ATTENDENT un tag. Deux cellules vertes au compteur de rappel sont donc le résultat NORMAL et ne
  // prouvent rien. Ce qui se lit est la distance entre les deux étages — et elle est nulle.

  it('LES ÉTAGES DIVERGENT — la pratique nomme, la culture ne nomme plus', () => {
    // LE RÉSULTAT CENTRAL DU BANC, et la ligne dont le retournement EST la réparation.
    //
    // AVANT : les deux voix rendaient `explicit`. Une femme qui pratique et une femme qui a quitté
    // la croyance en gardant les repas et les enterrements recevaient le même constat NOMMÉ, de
    // même confiance. La doctrine annonçait cette indécidabilité depuis l'écrit ; ce banc l'avait
    // déplacée d'une prévision vers une mesure.
    //
    // APRÈS : la voix de culture est en constat LARGE. Ce qu'il faut se garder de conclure — et
    // c'est la conclusion tentante — c'est que le produit sait DÉSORMAIS distinguer culture et
    // pratique. Il ne sait toujours pas : il sait reconnaître UNE FORME, celle qui écrit sa
    // non-croyance avec une négation attachée au verbe. Celle qui garde les rites sans jamais rien
    // nier de sa croyance reste indistinguable de celle qui pratique, et ce banc ne la porte pas.
    const stage = (id: string) => detectFor(byId(id)).find((d) => d.label === 'religion')?.stage;
    expect(stage('fr_practising')).toBe('explicit');
    expect(stage('fr_cultural_lapsed')).toBe('indirect');
  });

  it('DENSITÉ DE PREUVES — 6 pour la pratique, 4 pour la culture', () => {
    // Les deux étages sont identiques, les preuves ne le sont pas. C'est le grain où l'écart
    // subsiste, et c'est très exactement l'endroit que le banc politique avait désigné : le
    // comptage générique compte des CELLULES, l'asymétrie vit dans les PREUVES.
    //
    // Ce chiffre seul ne conclut pas — deux voix ne sont pas une distribution, et les deux voix ne
    // sont pas calquées item par item. C'est l'ablation suivante qui donne au 6 contre 4 son sens.
    expect(religionEvidence('fr_practising')).toBe(6);
    expect(religionEvidence('fr_cultural_lapsed')).toBe(4);
  });

  it('ABLATION DE LA COPULE — seule la pratique survit au retrait de sa déclaration', () => {
    // CE QUI DONNE SON SENS À TOUT LE RESTE. On retire à chaque voix son unique item d'identité
    // (« je suis musulmane… », « je suis catholique de famille mais je ne crois pas… ») :
    //
    //   · la pratiquante reste en constat NOMMÉ — elle est SUR-DÉTERMINÉE, d'autres items
    //     explicites la portent (le jeûne, la prière) ;
    //   · la voix de culture RETOMBE en constat large — l'étage juste, celui que son sceau
    //     attendait.
    //
    // Autrement dit : sa sur-classification ne vient pas de tout ce qu'elle écrit sur sa famille,
    // ses enterrements et son catéchisme — tout cela produit correctement un constat LARGE. Elle
    // vient d'UNE phrase, et cette phrase dit qu'elle ne croit pas. C'est un point de réparation
    // précis, pas un défaut diffus, et c'est la différence entre un banc et une impression.
    expect(without('fr_practising', 0)).toBe('religion[explicit]');
    expect(without('fr_cultural_lapsed', 0)).toBe('religion[indirect]');

    // LA CONDITION POSÉE À LA DÉMOTION, vérifiée par ablation plutôt que raisonnée : une voix qui
    // pratique RÉELLEMENT ne devait rien perdre. Elle ne perd rien, et sa marge est large — le
    // retrait de sa déclaration d'appartenance, celui du jeûne ou celui de la prière la laissent
    // chaque fois en constat nommé. C'est la sur-détermination mesurée un cran plus loin
    // qu'avant : trois items porteurs indépendants, pas deux.
    expect(without('fr_practising', 3)).toBe('religion[explicit]'); // sans le jeûne
    expect(without('fr_practising', 4)).toBe('religion[explicit]'); // sans la prière

    // Même forme chez la critique, et elle mérite d'être assertée à côté : son constat nommé
    // repose lui aussi ENTIÈREMENT sur son mot d'identité. Retiré, il ne reste qu'un constat large.
    expect(without('fr_critic', 1)).toBe('religion[indirect]');
  });
});

describe("banc religion — LA DÉMOTION, et la frontière qu'elle ne franchit pas", () => {
  it("l'auto-déclaration CONTREDITE ne nomme plus, et le tag survit", () => {
    // Obligation de doctrine n°1 (CLAUDE.md) : ne pas qualifier quelqu'un sur une phrase qui dit le
    // contraire. Les trois premières sondes disent où la négation tenait DÉJÀ — sur la copule — et
    // la quatrième est celle qui a été réparée.
    expect(runOn(['je ne suis pas catholique'])).toBe('RIEN'); // nié sur la copule → tenu
    expect(runOn(['je ne suis pas croyante'])).toBe('RIEN'); // idem
    expect(runOn(['je ne crois pas en dieu'])).toBe('RIEN'); // ← par quel chemin, voir plus bas

    // AVANT RÉPARATION : `religion[explicit]`. Le produit ne savait pas représenter « j'appartiens
    // à cette tradition et je n'y crois pas » et en faisait un constat nommé, de haute confiance.
    // Désormais : constat LARGE. Le tag reste — elle A une relation à cette tradition, c'est le
    // sujet de sa phrase — et l'affirmation tombe. Démotion, pas filtrage.
    expect(runOn(['je suis catholique mais je ne crois pas'])).toBe('religion[indirect]');
    expect(runOn(['je suis catholique et je ne pratique pas'])).toBe('religion[indirect]');
  });

  it("PAR QUEL CHEMIN le zéro de « je ne crois pas en dieu » arrive — et ce n'est PAS la négation", () => {
    // CLAUDE.md, *Ce qu'un filet prouve* : une assertion négative vérifie ce qu'elle ATTEINT, pas ce
    // qu'elle affirme. Ce `RIEN` ressemble à un filtre de négation qui fonctionne. Il n'en est pas
    // un : le lexique porte la LOCUTION ENTIÈRE « je crois en dieu », et « je ne crois pas en dieu »
    // ne la contient tout simplement pas. Rien n'a matché, donc rien n'a été filtré.
    //
    // Le contrôle qui le démontre : la même phrase amputée de la locution ne rend rien non plus,
    // alors que la forme affirmative, elle, nomme. Deux causes possibles, une seule vérifiée.
    expect(runOn(['je crois en dieu'])).toBe('religion[explicit]');
    expect(runOn(['je ne crois pas'])).toBe('RIEN');
  });

  it('LA FRONTIÈRE — une non-croyance sans négation attachée NOMME toujours', () => {
    // LE RÉSULTAT À NE PAS OUBLIER en citant la réparation, et il est mesuré, pas déduit. La
    // démotion s'accroche à une négation ATTACHÉE au verbe d'adhésion. Les autres tournures
    // d'éloignement — « plus vraiment », « sans vraiment y croire », « plus depuis longtemps » —
    // n'en portent pas, et continuent de produire un constat NOMMÉ sur quelqu'un qui vient d'écrire
    // qu'il ne croit pas.
    //
    // C'est très exactement le « ça n'aurait pas de fin » qui a fait rejeter l'élargissement du
    // filtre, et la démotion en hérite : elle traite la forme la plus fréquente, pas la classe.
    // L'écrire ici plutôt que de la laisser deviner est ce qui empêche ce banc d'être sur-cité.
    expect(runOn(['je suis musulmane et je ne crois plus vraiment'])).toBe('religion[explicit]');
  });
});

describe('banc religion — LA COUVERTURE DES TRADITIONS, que les quatre voix ne pouvaient pas montrer', () => {
  it('CADRE CALQUÉ — les sept traditions déclenchent désormais (avant : cinq sur sept)', () => {
    // Même frame syntaxique, seul le mot de tradition change : là où on mesure, on isole (technique
    // de la fixture politique). Ces sondes existent d'abord pour NEUTRALISER le confondant assumé
    // par la paire — `fr_practising` est musulmane, `fr_cultural_lapsed` de famille catholique, et
    // sans ces sondes on ne saurait pas si l'écart d'étage venait de l'état ou de la tradition.
    //
    // Elles le neutralisent : les traditions portées le sont TOUTES au même étage, dans le même
    // cadre. L'effondrement de la paire est donc bien un fait sur l'axe pratique/culture, et pas un
    // artefact de mes deux choix de tradition.
    for (const t of ['catholique', 'musulmane', 'juive', 'bouddhiste', 'protestante']) {
      expect(runOn([`je suis ${t}`])).toBe('religion[explicit]');
    }

    // ET ELLES TROUVENT AUTRE CHOSE, que ce banc n'était pas conçu pour chercher. Deux traditions
    // ne déclenchent pas du tout, dans le cadre exact où cinq autres produisent un constat nommé.
    //
    // C'est la forme EXACTE du défaut que la paire politique avait rendue lisible, transposée d'un
    // clivage à des traditions : une non-détection n'affiche RIEN. Quelqu'un qui écrit cette phrase
    // ne produit aucune trace, aucun compteur rouge — une absence, et une absence ressemble à un
    // banc propre. Aucune de mes quatre voix ne pouvait le voir, parce qu'aucune n'appartient à ces
    // traditions ; il a fallu une sonde hors-corpus.
    //
    // CE QUE CETTE ASSERTION NE DIT PAS, et la retenue est nécessaire : elle ne mesure PAS
    // l'étendue du trou. Deux termes manquants trouvés par deux sondes ne disent rien du nombre de
    // traditions non couvertes, ni des variantes orthographiques et masculines de celles qui le
    // sont. Une revue de couverture est un autre travail que ce banc ne fait pas.
    // APRÈS LA REVUE DE COUVERTURE : les deux rendent désormais un constat nommé, comme les cinq
    // autres. AVANT, elles rendaient `RIEN` — et c'était LE constat de cette assertion.
    //
    // CE QUE CE RETOURNEMENT NE PROUVE PAS, et c'est l'essentiel : il ne prouve pas que la
    // couverture est complète. Il prouve que DEUX trous mesurés sont bouchés. La question « quelles
    // traditions manquent encore » ne se règle pas par des sondes, qui ne trouvent que ce qu'on a
    // pensé à leur donner — elle se règle par la règle d'admission écrite en tête de
    // `lexicon/religion.ts` et par le témoin qui la tient, `religion-symmetry.test.ts`. C'est LUI
    // qu'il faut citer sur la couverture, jamais ce banc.
    expect(runOn(['je suis hindoue'])).toBe('religion[explicit]');
    expect(runOn(['je suis sikh'])).toBe('religion[explicit]');
  });
});

describe('banc religion — la garde EN, et par quel chemin son chiffre arrive', () => {
  it("PAR QUEL CHEMIN — aucune couverture anglaise n'est établie par ce banc", () => {
    // CLAUDE.md, *Ce qu'un filet prouve* : une assertion négative vérifie ce qu'elle ATTEINT, pas
    // ce qu'elle affirme. `en_curious` porte quatre traditions et ne rend qu'UN tort — on pourrait
    // en conclure que la garde discrimine bien. Elle ne discrimine rien : il n'y a presque rien à
    // déclencher. Aucune auto-déclaration anglaise ne rend quoi que ce soit, et les lieux de culte
    // anglais non plus.
    // APRÈS LE LOT DE VOCABULAIRE ANGLAIS, et ces six lignes valaient toutes `RIEN` avant lui.
    // Elles sont relues plutôt que remises au vert : leur zéro d'alors ÉTAIT le constat, et
    // l'effacer retirerait la seule trace de ce que le lot a réparé.
    //
    // Ce qui a changé n'est PAS l'étage : aucune ne NOMME, et aucune ne le fera tant que la porte
    // de langue reste fermée (assertion dédiée dans `religion-symmetry.test.ts`). Ce qui a changé
    // est qu'elles cessent d'être MUETTES — et c'est le motif du lot, parce que l'asymétrie
    // d'avant ne se lisait pas dans ces six lignes mais entre elles : « i go to the mosque on
    // fridays » et « i go to church on sundays » rendaient toutes deux `RIEN`, alors qu'un simple
    // « halal » rendait un constat. Le musulman était détectable par sa nourriture et le chrétien
    // ne l'était pas du tout.
    for (const probe of [
      'i am a muslim and i pray every day',
      'i am a catholic and i go to church every sunday',
      'i am jewish and i keep the sabbath',
      'i am an atheist',
      'i go to the mosque on fridays',
      'i go to church on sundays',
    ]) {
      expect(runOn([probe])).toBe('religion[indirect]');
    }

    // LES DEUX SEULS DÉCLENCHEMENTS ANGLAIS, et l'explication qu'il faut préférer. `synagogue` et
    // `ramadan` rendent un constat large — et ce sont deux mots dont l'orthographe est IDENTIQUE en
    // français. Aucun mot anglais spécifique ne déclenche : ni `mosque`, ni `church`, ni
    // `cathedral`. L'hypothèse économe est donc que ces deux-là sont des entrées FRANÇAISES
    // rencontrant un texte anglais, et non l'amorce d'une couverture EN.
    //
    // Formulée honnêtement : ces résultats sont COMPATIBLES avec l'absence totale de couverture
    // anglaise, et ce banc ne peut pas trancher davantage — il a été écrit à l'aveugle du lexique,
    // et le rester valait mieux que de lever ce doute-ci. Il serait faux d'en tirer que « l'anglais
    // porte le judaïsme mieux que l'islam » : ce serait lire une coïncidence orthographique comme
    // un biais.
    expect(runOn(['synagogue'])).toBe('religion[indirect]');
    expect(runOn(['ramadan'])).toBe('religion[indirect]');
    // AVANT LE LOT : `mosque` et `church` rendaient `RIEN`. C'était LA démonstration de cette
    // assertion — aucun mot anglais SPÉCIFIQUE ne déclenchait, seuls déclenchaient les mots dont
    // l'orthographe est commune aux deux langues. La phrase reste vraie de l'état d'AVANT ; elle
    // ne l'est plus de l'état courant, et c'est ce que le lot a fait.
    expect(runOn(['mosque'])).toBe('religion[indirect]');
    expect(runOn(['church'])).toBe('religion[indirect]');
    // `cathedral` reste dehors, et c'est une DÉCISION et non un reste : registre du MONUMENT et non
    // du culte, écrit surtout par qui visite. Il tient donc le contrôle négatif de ce bloc — sans
    // lui, les deux lignes du dessus passeraient au vert si le lot avait tout admis sans trier.
    expect(runOn(['cathedral'])).toBe('RIEN');

    // CONCLUSION À CITER À LA PLACE DU CHIFFRE : le tort unique de `en_curious` mesure SON CONTENU
    // — le fait qu'elle ait écrit un mot à orthographe commune — jamais le tri du détecteur. Les
    // faux positifs religieux anglais sont **non mesurés**, et cette voix ne les mesurera pas tant
    // que cette assertion tiendra. Le jour où du vocabulaire religieux anglais atterrira, ce test
    // rougira : c'est son office.
  });

  it('le tort unique de `en_curious` est bien celui-là, et pas un autre', () => {
    // Nommer l'item évite qu'un tort DIFFÉRENT se glisse un jour sous le même compteur à 1.
    const detections = detectFor(byId('en_curious'));
    expect(detections.map((d) => `${d.label}[${d.stage}]`)).toEqual(['religion[indirect]']);
    // AVANT LE LOT : `[8]`, un item unique, et c'était `synagogue` — un mot à orthographe commune.
    // APRÈS : quatre items, et le tort de cette voix cesse d'être une coïncidence pour devenir ce que
    // le produit fait vraiment. Elle visite des monuments de plusieurs traditions sans croire à
    // rien, et le détecteur lit la présence du SUJET.
    //
    // CE QU'IL FAUT EN FAIRE, et ce n'est pas un motif de retrait. Par le principe de démonstration
    // (ADR-0003), `church`, `mosque` et `the temple` se déclenchent AUSSI sur des pratiquants : ils
    // discriminent mal, ils ne discriminent pas zéro, et leur erreur est le sujet du produit. Le
    // lexique français a déjà ratifié exactement ce cas en admettant `eglise` avec la lecture
    // « curiosité / intérêt », qui décrit cette voix mot pour mot. Le constat est LARGE et
    // l'éventail est à plat : la carte ne l'affirme pas croyante.
    //
    // CE QU'IL NE FAUT PAS EN FAIRE, et c'est le vrai résultat de ce compteur : le lire comme un
    // plancher de faux positifs anglais. `en_curious` est la SEULE voix anglaise du lot, elle a été
    // écrite saturée du vocabulaire que ce lot admet, et son rouge était prévisible avant d'être
    // mesuré. Une voix adverse connue rouge d'avance est un TÉMOIN, pas un plancher. La sûreté
    // anglaise de ce label reste non mesurée, et aucun chiffre d'ici ne la mesure.
    expect(detections[0]?.items.map((i) => i.itemIndex)).toEqual([4, 8, 10, 12]);
  });
});
