// Batterie adverse sur le LEXIQUE RÉEL ENRICHI (PANO-36) — exercice des filtres contextuels et des
// tolérances de variation avec les vrais lexiques câblés (`WIRED_LEXICONS`), pas des factices.
// Chaque cas vérifie qu'un enrichissement dense ne fait PAS tagger faux. Phrases 100 %
// SYNTHÉTIQUES, inventées ici, jamais tirées d'un export réel (discipline PANO-70 §3).

import { describe, expect, it } from 'vitest';
import { WIRED_LEXICONS } from '../lexicon';
import { detectLabels } from './detect';

/** Labels détectés (triés) sur une liste de commentaires synthétiques. */
function labels(...texts: string[]): string[] {
  return detectLabels(texts, WIRED_LEXICONS)
    .map((d) => d.label)
    .sort();
}

describe('batterie adverse — négation', () => {
  it('« je fais pas de dépression » → mental_health NON tagué (négation avant le marqueur)', () => {
    expect(labels('je fais pas de depression en ce moment')).toEqual([]);
  });
});

// ── L'ÉTAT ET LE SUJET — ce que nier veut dire (ADR-0003) ───────────────────────────────────────
// CE QUE CETTE SECTION NE COUVRE PAS, et il faut le lire avant de la citer :
//   · elle tient le MÉCANISME sur des phrases que j'ai écrites en sachant ce que je cherchais. Ce
//     n'est pas un banc : elle ne dit rien de la FRÉQUENCE de l'opposition, ni du tort que la règle
//     pourrait créer sur une voix réelle. Le premier instrument qui pourra le dire est le banc de
//     voix politiques, et il n'est pas scellé à ce jour ;
//   · elle ne couvre QUE le français. La machinerie est bilingue (les négations EN sont dans la
//     liste partagée) et un cas EN est tenu plus bas, mais aucun corpus anglais ne l'exerce ;
//   · elle ne dit rien de la critique SANS vocabulaire du sujet — « tout ça c'est du vent » n'a
//     aucun marqueur, et aucune règle d'étage ne rattrape le mur.
describe('batterie adverse — labels de SUJET : la négation dégrade, elle ne supprime pas', () => {
  it('OPPOSITION politique → taguée en LARGE (ex-défaut : elle ne taguait rien)', () => {
    expect(labels('je supporte pas les fachos', 'je peux pas blairer les fachos')).toEqual([
      'politics',
    ]);
    expect(labels('je supporte pas les gauchistes', 'je peux pas blairer les gauchistes')).toEqual([
      'politics',
    ]);
    expect(labels('jamais de manif pour moi', 'aucune manif ne sert a rien')).toEqual(['politics']);
  });

  // Les DEUX camps, à dessein et côte à côte : c'est la propriété que ce lot existe pour tenir, et
  // la tester d'un seul côté serait reproduire en test le défaut qu'on répare dans le lexique.
  it('OPPOSITION en anglais aussi (les négations EN sont dans la liste partagée)', () => {
    expect(labels('i cannot stand the woke crowd', 'i cannot stand this fake news')).toEqual([
      'politics',
    ]);
  });

  it('l’étage reste LARGE — nier ne fabrique jamais un constat NOMMÉ', () => {
    const out = detectLabels(['jamais de messe pour moi'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['religion']);
    expect(out[0]?.stage).toBe('indirect'); // et surtout pas `explicit`
  });

  it('religion — le côté CRITIQUE de l’axe ratifié cesse d’être muet', () => {
    expect(labels('jamais de messe pour moi')).toEqual(['religion']);
    expect(labels('je ne vais pas a la messe')).toEqual(['religion']);
  });

  // CONTRE-ÉPREUVE, et c'est elle qui donne son sens aux quatre du dessus : les labels d'ÉTAT ne
  // bougent pas d'un pouce. Si la règle avait fuité hors des labels de sujet, elle se verrait ici —
  // et elle s'y verrait comme un constat de maladie posé sur quelqu'un qui dit ne pas l'avoir.
  it('les labels d’ÉTAT sont INCHANGÉS — nier y retire toujours le signal', () => {
    expect(labels('je fais pas de depression en ce moment')).toEqual([]);
    expect(labels('je ne suis pas depressif', 'aucune depression chez moi')).toEqual([]);
    expect(labels('je n ai pas de diabete', 'aucun diabete dans la famille')).toEqual([]);
    expect(labels('je ne suis pas lesbienne')).toEqual([]);
  });

  // FRONTIÈRE MÉCANIQUE, mesurée et figée — sans elle, un lecteur conclurait de ce qui précède que
  // « je ne vote pas » tague désormais. Il ne tague pas, et la raison n'est PAS la négation : le
  // français INFIXE sa négation (« je NE vote PAS »), ce qui casse le marqueur multi-mots dans le
  // matcher, avant qu'aucun filtre ne soit consulté. La règle d'étage ne rattrape que ce que le
  // repérage a trouvé. Elle atteint donc les marqueurs d'UN mot et les locutions non infixées.
  it('FRONTIÈRE — la négation INFIXÉE casse le marqueur, et aucune règle d’étage ne le rattrape', () => {
    expect(labels('je ne vote pas', 'je ne vote jamais')).toEqual([]);
    expect(labels('je ne crois pas en dieu')).toEqual([]);
  });
});

describe('batterie adverse — citation / discours rapporté', () => {
  it('terme en discours rapporté → non tagué (attribué à autrui)', () => {
    expect(labels('il parait que la therapie et le psy ca aide vraiment')).toEqual([]);
  });

  // ── Le PLURIEL entre guillemets — défaut TRANSVERSE, trouvé sur `politics` ─────────────────────
  // `findMarker` tolère le pluriel, `occursInsideQuotes` ne le tolérait pas : un marqueur cité au
  // pluriel matchait sans être reconnu comme cité, et le filtre échouait OUVERT. Le couple
  // singulier/pluriel est ici PARCE QUE le singulier passait déjà — sans lui, ce test ne dirait pas
  // par quel chemin son zéro arrive, et un jour où la citation cesserait de filtrer tout court, il
  // resterait vert pour la mauvaise raison.
  it('citation au SINGULIER → filtrée (le chemin qui marchait déjà)', () => {
    expect(labels('il a dit "le gauchiste au pouvoir"', 'elle a dit "encore ce facho"')).toEqual(
      [],
    );
  });

  it('citation au PLURIEL → filtrée AUSSI (ex-défaut : la regex de guillemets ignorait le `s?`)', () => {
    expect(
      labels('il a dit "les gauchistes au pouvoir"', 'elle a dit "encore ces fachos"'),
    ).toEqual([]);
  });

  // Contrôle POSITIF : sans lui, les deux zéros ci-dessus seraient tenus par un lexique muet plutôt
  // que par le filtre. Mêmes mots, mêmes pluriels, sans guillemets → le constat sort.
  it('contrôle positif — les mêmes pluriels HORS guillemets taguent bien', () => {
    expect(labels('les gauchistes au pouvoir', 'encore ces fachos')).toEqual(['politics']);
  });

  // FRONTIÈRE DÉCLARÉE de ces trois cas : ils tiennent la tolérance de PLURIEL, et elle seule.
  // L'auto-censure symbolique reste divergente entre `findMarker` et `occursInsideQuotes` — une
  // insulte masquée entre guillemets échappe encore au filtre. Ce test le FIGE plutôt que de le
  // taire : le jour où le chemin devient positionnel, il rougit et se retourne en assertion inverse.
  it('DIVERGENCE RESTANTE — l’auto-censure entre guillemets échappe encore au filtre', () => {
    expect(
      labels('il a dit "les g@uchistes au pouvoir"', 'elle a dit "encore ces f@chos"'),
    ).toEqual(['politics']);
  });
});

describe('batterie adverse — 3ᵉ personne (dégradation, jamais suppression)', () => {
  it('détresse d’un proche, répétée → mental_health INDIRECT (signal-sans-vécu, tagué quand même)', () => {
    const out = detectLabels(
      ['la depression de mon fils m’inquiete', 'je cherche un psy pour mon fils'],
      WIRED_LEXICONS,
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.label).toBe('mental_health');
    expect(out[0]?.stage).toBe('indirect'); // jamais nommé sur autrui (B3)
  });

  // Faille comblée (« ma mère »/« mon père » absents de THIRD_PERSON) : sans le filtre, ce terme
  // EXPLICITE appliqué à un tiers nommait l'utilisateur à la place de sa mère — B3 fuyait.
  // Deux items dégradés (comme le golden « mon fils » ci-dessus) : un seul item dégradé en indirect
  // reste sous `indirectThreshold` (2) et ne produit AUCUN insight — ce n'est pas la fuite testée ici
  // (elle serait invisible, pas nommée à tort), donc deux items, comme le reste de la batterie.
  it('« la dépression de ma mère » → mental_health INDIRECT, JAMAIS nommé (faille comblée)', () => {
    const out = detectLabels(
      ['la depression de ma mere m’inquiete beaucoup', 'je cherche un psy pour ma mere'],
      WIRED_LEXICONS,
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.label).toBe('mental_health');
    expect(out[0]?.stage).toBe('indirect');
  });

  // SONDE CHANGÉE, et la raison est le cœur de ce contrôle. Ce `describe` prouve une DÉGRADATION :
  // un terme qui nommerait à la 1ʳᵉ personne ne nomme pas à la 3ᵉ. Il lui faut donc une sonde qui
  // NOMME encore. « dépression » nu a cessé de nommer (tier des noms nus) : gardée comme sonde, elle
  // aurait laissé les trois cas ci-dessus au vert en `indirect` — non plus parce que la dégradation
  // marche, mais parce qu'il n'y avait plus rien à dégrader. Un test qui passe pour une autre raison
  // que la sienne est pire qu'un test rouge : il éteint la garde en silence.
  it('contrôle : « j’ai fait une dépression nerveuse » (vécu propre) → EXPLICIT (rappel intact)', () => {
    const out = detectLabels(['j’ai fait une depression nerveuse cet hiver'], WIRED_LEXICONS);
    expect(out).toHaveLength(1);
    expect(out[0]?.label).toBe('mental_health');
    expect(out[0]?.stage).toBe('explicit');
  });

  it('la même, à la 3ᵉ personne → INDIRECT : la dégradation est bien ce qui est mesuré', () => {
    // Le pendant du contrôle ci-dessus, sur la MÊME sonde. Sans lui, « explicit à la 1ʳᵉ » et
    // « indirect à la 3ᵉ » restent deux faits séparés ; ensemble, ils sont une dégradation.
    const out = detectLabels(['la depression nerveuse de mon fils m’inquiete'], WIRED_LEXICONS);
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
  });

  it('le NOM NU, lui, ne nomme plus — et ne disparaît pas non plus (tier solo)', () => {
    // Le plancher installé par le tier des noms nus, gardé ici parce que c'est la batterie qui
    // porte la doctrine. Un énoncé UNIQUE, à la 1ʳᵉ personne, littéral : il ne produit plus de
    // constat nommé (l'affirmation ne se justifie pas sur un mot que l'usage courant a colonisé),
    // mais il produit bien un constat large — sans le tier solo, le seuil de 2 l'aurait effacé.
    const out = detectLabels(['j’ai une depression en ce moment'], WIRED_LEXICONS);
    expect(out).toHaveLength(1);
    expect(out[0]?.label).toBe('mental_health');
    expect(out[0]?.stage).toBe('indirect');
  });

  it('mêmes garanties sur le reste de la famille ajoutée (père, parents, grand-parents, oncle/tante, cousin·e, mec/meuf/ex)', () => {
    const proches = [
      'mon pere',
      'mes parents',
      'ma grand mere',
      'mon grand pere',
      'ma mamie',
      'mon papy',
      'mon oncle',
      'ma tante',
      'mon cousin',
      'ma cousine',
      'mon mec',
      'ma meuf',
      'mon ex',
    ];
    for (const proche of proches) {
      const out = detectLabels(
        [`la depression de ${proche} m’inquiete`, `je cherche un psy pour ${proche}`],
        WIRED_LEXICONS,
      );
      expect(out, proche).toHaveLength(1);
      expect(out[0]?.stage, proche).toBe('indirect');
    }
  });
});

describe('batterie adverse — auto-censure et allongement (machinerie)', () => {
  it('insulte auto-censurée ciblée → conflictual, surface = forme masquée tapée', () => {
    const out = detectLabels(["t'es qu'une grosse c*nne"], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['conflictual']);
    expect(out[0]?.items[0]?.surfaces).toContain('c*nne');
  });

  it('insulte allongée ciblée → conflictual, surface = forme allongée', () => {
    const out = detectLabels(["t'es vraiment un abruuuuti"], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['conflictual']);
    expect(out[0]?.items[0]?.surfaces).toContain('abruuuuti');
  });

  it('pluriel : « fachos » / « gauchistes » comptent comme leurs singuliers (politics)', () => {
    // Deux items de registre opinion → seuil indirect 2 atteint.
    expect(labels('encore ces fachos au pouvoir', 'et tous ces gauchistes')).toEqual(['politics']);
  });
});

describe('batterie adverse — polysémie (seuil protège)', () => {
  it('« déprime » économique isolé → mental_health NON tagué (1 hit colloquial < seuil 2)', () => {
    expect(labels('le marche est en pleine deprime ces temps-ci')).toEqual([]);
  });

  it('« toc » polysémique isolé → mental_health NON tagué (colloquial, 1 hit < seuil 2)', () => {
    // Anti-régression : « toc » a été descendu d'explicit en colloquial (PANO-36) — un « toc toc »
    // ou « du toc » isolé ne doit plus jamais tagger une condition nommée.
    expect(labels('toc toc qui est la derriere la porte')).toEqual([]);
    expect(labels("c'est du toc ce sac soi-disant en cuir")).toEqual([]);
  });
});

describe('batterie adverse — conflictual = agression de PERSONNES', () => {
  it('juron sans cible → conflictual NON tagué', () => {
    expect(labels('quel bouffon ce scenario de film')).toEqual([]);
  });

  it('critique d’idée non politique (insulte sur une chose) → tagué NULLE PART', () => {
    expect(labels('cette blague est vraiment debile')).toEqual([]);
  });
});

describe('batterie adverse — opinion politique va bien en POLITICS (pas conflictual)', () => {
  it('jugement de catégorie répété → politics indirect, jamais conflictual', () => {
    const out = detectLabels(
      ['ce parti est un ramassis de fascistes', 'quelle bande de corrompus au sommet'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['politics']);
    expect(out[0]?.stage).toBe('indirect');
  });

  it('auto-déclaration 1ʳᵉ personne → politics EXPLICIT (via le pattern PANO-72)', () => {
    const out = detectLabels(['perso je suis de gauche et je milite'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['politics']);
    expect(out[0]?.stage).toBe('explicit');
  });
});

// ─── Passe 2 : health_physical / sexuality / religion (PANO-72) ─────────────────────────────────

describe('batterie adverse — health_physical (piège des hyperboles de fatigue)', () => {
  it('hyperboles « crevé / claqué / mort » → NON taguées (exclues du lexique)', () => {
    expect(
      labels('je suis mort de fatigue', 'chui claque apres le taf', 'trop creve ce soir'),
    ).toEqual([]);
  });

  it('condition nommée à soi → health_physical explicit', () => {
    const out = detectLabels(['je vis avec mon diabete au quotidien'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['health_physical']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('parcours de soin répété → health_physical indirect (seuil 2)', () => {
    expect(labels('rdv chez le cardiologue demain', 'encore une prise de sang ce matin')).toEqual([
      'health_physical',
    ]);
  });

  it('condition d’un proche → indirect (signal-sans-vécu, jamais nommé) ', () => {
    const out = detectLabels(
      ['le diabete de mon fils me stresse', "j'accompagne mon fils a l'hopital"],
      WIRED_LEXICONS,
    );
    expect(out.find((d) => d.label === 'health_physical')?.stage).toBe('indirect');
  });

  // ── LE NOM DE MALADIE DEVENU INSULTE (ADR-0003, *L'admission d'un terme*) ──────────────────────
  // Le lexique porte `mon cancer`, `ma chimio`, `ma maladie` — et JAMAIS `cancer` nu. La règle a
  // longtemps vécu sans être écrite ni relue ; elle est en doctrine depuis qu'une seconde langue
  // l'a retrouvée seule, l'anglais faisant de « cancer »/« cancerous » une épithète générique.
  //
  // Ce que ce test tient, et pourquoi il est BEHAVIOURAL plutôt qu'une assertion sur la liste :
  // « `cancer` n'est pas dans le tableau » passerait au vert même si un autre tier le rattrapait.
  // On vérifie donc ce qui compte — qu'aucun constat ne se pose — et le contrôle positif juste
  // en dessous prouve que la forme PORTÉE, elle, tague bien (sans quoi ce zéro ne dirait rien).
  it('nom de maladie employé comme insulte → AUCUN constat, dans les deux langues', () => {
    expect(labels('cette meta est le cancer du jeu')).toEqual([]);
    expect(labels('this meme is cancer', 'that take is cancerous')).toEqual([]);
  });

  it('CONTRÔLE — la forme PORTÉE tague, elle : le zéro du dessus est une exclusion, pas une panne', () => {
    const out = detectLabels(['mon cancer et ma chimio rythment mes semaines'], WIRED_LEXICONS);
    expect(out.find((d) => d.label === 'health_physical')?.stage).toBe('explicit');
  });
});

describe('batterie adverse — sexuality (seuil 1, coût outing)', () => {
  it('auto-déclaration → sexuality explicit (nommé)', () => {
    const out = detectLabels(['je suis lesbienne et fière de l’être'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['sexuality']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('identité NUE (3ᵉ personne) → indirect, jamais nommé (règle catalogue)', () => {
    const out = detectLabels(['cette actrice est ouvertement lesbienne'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['sexuality']);
    expect(out[0]?.stage).toBe('indirect');
  });

  it('« arc-en-ciel » météo → non tagué (exclusion assumée, coût outing)', () => {
    expect(labels('quel bel arc-en-ciel après l’orage')).toEqual([]);
  });

  it('collision hors-domaine « un pan de mur » → non tagué (sondage FP PANO-72)', () => {
    expect(labels('je suis un pan de ce grand mur en ruine')).toEqual([]);
  });
});

describe('batterie adverse — religion (label de SUJET, décision D)', () => {
  it('appartenance déclarée → religion explicit', () => {
    const out = detectLabels(['je suis musulman et pratiquant'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['religion']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('« église » culturelle → religion indirect (multi-interprétabilité, pas un bug)', () => {
    const out = detectLabels(['magnifique église romane dans ce village'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['religion']);
    expect(out[0]?.stage).toBe('indirect'); // l'éventail §5 porte la lecture « curiosité »
  });

  it('interjection lexicalisée « wallah » → NON taguée (exclue : sociolecte, pas religion)', () => {
    expect(labels('wallah je te jure c’est vrai')).toEqual([]);
  });

  it('collisions hors-domaine → NON taguées (sondage FP PANO-72, anti-régression)', () => {
    expect(labels('je fais de la voile ce week-end')).toEqual([]); // voile = bateau
    expect(labels('jai mal aux temples ce matin')).toEqual([]); // temples = anatomie
    expect(labels("visite de l'institut pasteur demain")).toEqual([]); // pasteur = toponyme
    expect(labels("mon bapteme de l'air était génial")).toEqual([]); // baptême = première fois
  });

  // La sonde disait « t'es qu'un bigot arriéré ». `bigot` (masculin) a été RETIRÉ du lexique à
  // l'ouverture de l'EN — c'est un homographe du mot anglais courant, et il taguait « you are being
  // a bigot about this policy ». La FRONTIÈRE que ce test garde n'a pas bougé d'un pouce ; seule sa
  // sonde change, pour une surface que le retrait épargne. Ce test est d'ailleurs ce qui a rendu le
  // coût du retrait visible : `bigot` portait une décision ratifiée, pas seulement du vocabulaire.
  it('insulte anti-croyant ciblée → conflictual, jamais religion', () => {
    const out = detectLabels(["t'es qu'une bigote arriérée"], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['conflictual']);
  });
});

// ── Lot pilote EN (PANO-35) — la SEULE chose qui exerce les variantes EN ────────────────────────
// La persona EN de démo n'en rencontre AUCUNE (mesuré : le golden ne bouge pas d'un octet après le
// lot). Sans cette section, ~50 termes seraient livrés sans qu'aucun test ne les traverse. Les cas
// d'HYPERBOLE sont les plus importants : ils figent des EXCLUSIONS, c'est-à-dire la doctrine.
describe('batterie adverse — EN, condition nommée et soin', () => {
  // Même changement de sonde qu'en français, même raison : « anxiety » nu ne nomme plus. Le syntagme
  // diagnostique, lui, nomme toujours — et c'est exactement la ligne que le lexique trace désormais.
  it('SYNTAGME diagnostique EN à soi → mental_health explicit (nommé)', () => {
    const out = detectLabels(['i was diagnosed with an anxiety disorder'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['mental_health']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('NOM NU EN à soi → large, jamais nommé, et jamais absent', () => {
    // Le pendant anglais du plancher : un seul énoncé suffit à taguer, aucun nombre ne suffit à
    // nommer. Les deux moitiés comptent — c'est le trou dans lequel la première rétrogradation
    // était tombée (mesurée dans `en-demotion-ablation.test.ts`).
    const out = detectLabels(['i have been dealing with anxiety for years'], WIRED_LEXICONS);
    expect(out.map((d) => d.label)).toEqual(['mental_health']);
    expect(out[0]?.stage).toBe('indirect');
  });

  it('parcours de soin EN répété → indirect (le seuil 2 vaut aussi en anglais)', () => {
    const out = detectLabels(
      ['i started therapy in march', 'my therapist suggested a break'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['mental_health']);
    expect(out[0]?.stage).toBe('indirect');
  });

  it('un seul marqueur indirect EN ne pose RIEN (seuil non contourné)', () => {
    expect(labels('i started therapy in march')).toEqual([]);
  });

  it('détresse EN d’un proche → indirect, jamais nommé (B3, filtres du lot 1 + termes du lot 2)', () => {
    const out = detectLabels(
      ['my sister has been in therapy', 'helping my teen with school refusal'],
      WIRED_LEXICONS,
    );
    expect(out.find((d) => d.label === 'mental_health')?.stage).toBe('indirect');
  });

  it('négation EN sur un terme du lot → non tagué', () => {
    expect(labels("i don't have anxiety, i was just tired")).toEqual([]);
  });
});

// ── health_physical EN — et la ligne d'admission n'est PAS celle du pilote ───────────────────────
// Le lot `mental_health` s'est défendu contre l'HYPERBOLE. Ici elle ne travaille presque pas :
// personne n'écrit « i'm diabetic » pour rire. La ligne qui décide ce label est
//
//     LE SYMPTÔME N'EST PAS LA CONDITION,
//
// et elle a été mesurée sur deux voix scellées : celle qui VIT une polyarthrite nomme sa maladie,
// son traitement et sa spécialité ; celle qui n'a RIEN écrit un vocabulaire de symptômes dense et
// parfaitement littéral. Les exclusions ci-dessous sont ce qui les sépare — et elles portent la
// doctrine, parce qu'une inclusion se relit alors qu'une exclusion se perd si rien ne la tient.
describe('batterie adverse — EN, health_physical (le symptôme n’est pas la condition)', () => {
  it('condition nommée + traitement → health_physical, et le vécu est NOMMÉ', () => {
    const out = detectLabels(
      ['rheumatoid arthritis flare how long do they last', 'methotrexate day is a saturday'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['health_physical']);
    expect(out[0]?.stage).toBe('explicit');
  });

  it('LE CŒUR DU LOT — un vocabulaire de SYMPTÔMES, dense et littéral, ne tague RIEN', () => {
    // Chacune de ces recherches est ce qu'écrit quelqu'un qui n'a rien et s'inquiète. Toutes
    // décrivent une sensation RÉELLE : aucune n'est de l'hyperbole, et c'est ce qui rend le cas
    // plus dur que celui du pilote. Le seuil ne protège pas non plus — qui s'inquiète cherche
    // beaucoup, donc la répétition accumule (ADR-0003).
    expect(
      labels(
        'small red bump on arm not itchy',
        'is a headache behind one eye serious',
        'tingling in hand when i wake up',
        'how long should a bruise take to fade',
        'random muscle twitch eyelid',
        'why do i get pins and needles in my foot',
        'dry cough three days',
        'stomach ache after coffee',
      ),
    ).toEqual([]);
  });

  it('les noms de maladie devenus insultes ou banalités → non tagués', () => {
    expect(labels('this meme is cancer', 'that take is cancerous')).toEqual([]);
    expect(labels('you are giving me a migraine', 'this queue is a migraine')).toEqual([]);
    expect(labels('that beat is sick', 'im so sick of this weather')).toEqual([]);
    expect(labels('a stroke of luck honestly', 'my backstroke is terrible')).toEqual([]);
  });

  it('CONTRÔLE — les formes PORTÉES des mêmes mots taguent, elles', () => {
    // Sans ce contrôle, les zéros ci-dessus ne distingueraient pas une exclusion d'une absence de
    // couverture. C'est le syntagme qui nomme, pas le mot nu.
    const out = detectLabels(
      ['my cancer treatment starts on monday', 'my chemo schedule for next month'],
      WIRED_LEXICONS,
    );
    expect(out.find((d) => d.label === 'health_physical')?.stage).toBe('explicit');
  });

  it('la rééducation PHYSIQUE va en health_physical, et plus en santé mentale', () => {
    // Le tort trouvé par le banc du corps : « occupational therapy » lu comme de la santé mentale
    // chez l'aidante d'une personne ayant fait un AVC. Mauvaise personne ET mauvais sujet.
    const out = detectLabels(
      ['occupational therapy home assessment', 'aphasia speech therapy waiting list'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['health_physical']);
  });

  it("ABLATION — `therapy` n'a rien perdu : les vrais positifs de santé mentale tiennent", () => {
    // La contrepartie obligatoire de la ligne du dessus. `therapy` est un terme LIVRÉ qui porte un
    // rappel réel ; le lot le laisse intact et ne lui retire que ce qui ne lui appartenait pas.
    const out = detectLabels(
      ['therapy cost per session average', 'how to find a therapist without a referral'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['mental_health']);
  });

  it('« retail therapy » tombe aussi — la réserve écrite du lot pilote, enfin tenue', () => {
    expect(labels('retail therapy is my weakness', 'a bit of retail therapy today')).toEqual([]);
  });
});

describe('batterie adverse — EN, hyperbole (les exclusions QUI PORTENT la doctrine)', () => {
  // « je veux mourir » est DANS le lexique FR ; « i want to die » en est exclu, à dessein — en
  // anglais c'est une réaction conventionnelle à l'embarras (même famille que « i'm dying » = rire),
  // pas une détresse. Le cas d'école du jugement qui ne survit pas à la traduction
  // (cf. `docs/methode-portabilite-en.md`, les lignes de séparation).
  it('hyperbole vitale EN → NON taguée, même accumulée', () => {
    expect(
      labels(
        'that photo i am dying',
        'i want to die this is so embarrassing',
        'kill me now, three hours of meetings',
        'i am dead, this is too funny',
      ),
    ).toEqual([]);
  });

  it('adjectif d’objet et faux-ami → NON tagués', () => {
    expect(labels('this weather is so depressing')).toEqual([]); // état d'une CHOSE, pas du locuteur
    expect(labels('so anxious to see you tomorrow')).toEqual([]); // « anxious » EN = impatient
  });

  it('vocabulaire clinique colloquialisé → jamais NOMMÉ (même chemin que « toc »)', () => {
    expect(labels('i am so ocd about my desk')).toEqual([]); // isolé : sous le seuil
    expect(labels('that movie traumatized me')).toEqual([]); // « trauma » exclu du lexique
    expect(labels('he keeps gaslighting everyone')).toEqual([]); // reproche à AUTRUI, pas un état
  });
});

// ── `woke`, passé de *wake* — l'homographe qui traverse depuis le FR ────────────────────────────
// CE QUE CETTE SECTION NE COUVRE PAS : elle tient les huit frames verbales écartées par
// `COVERING_PHRASES_EN`, et rien d'autre. Elle ne mesure NI la fréquence relative des deux emplois,
// NI le reste de la queue verbale — dont le dernier cas ci-dessous fige précisément un morceau.
describe('batterie adverse — EN, `woke` verbal vs `woke` politique', () => {
  it('les frames verbales → NON taguées (particule et objets pronominaux)', () => {
    expect(labels('i woke up at five again', 'woke up with a migraine')).toEqual([]);
    expect(labels('the dog woke me at three', 'she woke us all up shouting')).toEqual([]);
    expect(labels('that noise woke him instantly', 'i woke at five and could not sleep')).toEqual(
      [],
    );
  });

  // CONTRÔLE POSITIF, et il porte tout le reste : sans lui, les zéros ci-dessus seraient tenus par
  // un `woke` devenu muet — c'est-à-dire par une éviction déguisée, que la doctrine interdit
  // (le terme se déclenche sur des porteurs, il RESTE).
  it('contrôle positif — l’emploi POLITIQUE tague toujours', () => {
    expect(labels('the woke crowd again', 'everything is woke now')).toEqual(['politics']);
  });

  // RÉSIDU FIGÉ plutôt que tu. Ce test dit « voici ce qui passe encore », et il se retournera en
  // assertion inverse le jour où quelqu'un décidera de couvrir la queue verbale.
  it('RÉSIDU DÉCLARÉ — `woke` + conjonction / adverbe tague encore', () => {
    expect(labels('i woke and it was already dark', 'she woke suddenly in the night')).toEqual([
      'politics',
    ]);
  });
});

// ── Lot EN de `conflictual` (PANO-35) — la SEULE chose qui exerce ses variantes EN ──────────────
// La persona EN de démo en rencontre EXACTEMENT UNE (« you’re just stupid »), figée séparément dans
// `demo/synthetic-export.test.ts` ; les neuf autres formes ne sont traversées que par ici. Et sur
// ce label, la colonne d'exclusions ne fait pas que porter la doctrine — elle porte TOUTE la
// sûreté : `conflictual` est le seul label sans éventail de lectures (ADR-0003), donc un faux
// positif n'y a aucun filet.
//
// ── CE QUE CETTE SECTION NE COUVRE PAS, et il faut le lire avant de la citer ────────────────────
// Elle est écrite PAR l'auteur du lexique, sur des cas TYPIQUES qu'il a choisis. Elle prouve que
// les formes admises se comportent comme prévu sur ces cas-là, et rien de plus. Elle ne mesure
// AUCUN taux de faux positifs : aucune voix scellée d'aucun banc n'écrit d'agression, dans aucune
// des deux langues (mesuré : 17 voix, 476 items, zéro constat `conflictual`). Le tort central du
// lot — la vanne entre amis, taguée comme une agression parce que rien dans un export ne les
// sépare — est ASSUMÉ, PAS MESURÉ, et son instrument (des voix scellées d'agression et de vanne)
// n'existait pas à la livraison.
describe('batterie adverse — EN, conflictual : la porte est insulte ET cible', () => {
  it('insulte EN ciblée → conflictual, terme épinglé', () => {
    const out = detectLabels(
      ['you are a dumbass and everyone in the replies knows it'],
      WIRED_LEXICONS,
    );
    expect(out.map((d) => d.label)).toEqual(['conflictual']);
    expect(out[0]?.items[0]?.surfaces).toContain('dumbass');
  });

  it('impératif injurieux EN → tagué (il adresse par construction, comme « ta gueule »)', () => {
    expect(labels('shut up nobody asked')).toEqual(['conflictual']);
  });

  it('insulte EN visant une IDÉE → tagué NULLE PART (décision D, portée par la cible)', () => {
    expect(labels('this take is moronic')).toEqual([]);
    expect(labels('that stupid rule about parking near the school')).toEqual([]);
  });

  it('insulte EN RAPPORTÉE → hors-champ (le filtre de citation est déjà bilingue)', () => {
    expect(labels('he called me stupid and i just logged off')).toEqual([]);
  });

  it('insulte EN NIÉE → non taguée', () => {
    expect(labels('you are not stupid, dont let them tell you that')).toEqual([]);
  });
});

describe('batterie adverse — EN, conflictual : les EXCLUSIONS, et elles portent toute la sûreté', () => {
  // L'exclusion la plus importante du lot. `you` nu n'est pas une adresse en anglais : c'est aussi
  // l'impersonnel. Mesuré à l'écriture du lot, à termes identiques : avec `you` nu dans `targets`,
  // 14 items anglais innocents sur 14 taguaient ; avec les seules constructions ancrées, 0 sur 14.
  it('le pronom `you` nu N’EST PAS une cible — la phrase de conseil ne tague pas', () => {
    expect(labels('you should get your thyroid gland checked out')).toEqual([]);
    expect(labels('you can take the trash out on tuesdays')).toEqual([]);
    expect(labels('i cope with the heat by staying inside, you should too')).toEqual([]);
  });

  it('vocatifs d’AFFILIATION → jamais des cibles (ils marquent le lien, pas l’attaque)', () => {
    expect(labels('bro is washed and he knows it')).toEqual([]);
    expect(labels('yall are not beating the allegations')).toEqual([]);
  });

  it('argot d’ÉVALUATION (performance, objet) → hors lexique', () => {
    expect(labels('that album is straight trash honestly')).toEqual([]);
    expect(labels('you are such a sad excuse for a chef')).toEqual([]); // « sad » exclu
  });

  it('joute LUDIQUE en ligne → hors lexique (et c’est la porte que l’invective politique prendrait)', () => {
    expect(labels('cope harder')).toEqual([]);
    expect(labels('you are so triggered by this')).toEqual([]);
  });

  it('nom de trouble employé en insulte → n’entre nulle part (ADR-0003, F7)', () => {
    expect(labels('every politician in that debate was a narcissist')).toEqual([]);
    expect(labels('you are being such a schizo about this')).toEqual([]);
  });

  it('reproche de COMPORTEMENT → pas une insulte, donc hors de ce label', () => {
    expect(labels('you are gaslighting me right now')).toEqual([]);
  });

  it('insulte de GROUPE dans l’absolu → nulle part (futur label dédié, jamais tranché seul)', () => {
    expect(labels('people like you are the problem with this country')).toEqual([]);
  });
});

// ── Les six entrées FR RETIRÉES à l'ouverture de l'EN (PANO-35) ─────────────────────────────────
// Une exclusion se perd si rien ne la tient, et celles-ci se perdraient particulièrement vite : ce
// sont des insultes françaises parfaitement légitimes, qu'un lecteur pressé rajouterait en croyant
// combler un trou. Ce qui les a fait sortir n'est PAS leur sens français — c'est qu'elles sont
// homographes de mots anglais ordinaires, et que l'ouverture des cibles EN les a rendues vivantes.
//
// CE QUE CE BLOC NE PROUVE PAS : que le retrait était sans coût. Il en a un, mesuré et inscrit dans
// l'en-tête du lexique (« t'es vraiment con », « t'es qu'un clown », « t'es qu'un bigot » ne sont
// plus lus). Il est TENU pour re-mesure dès que des voix scellées d'agression existeront — aucune
// n'existe aujourd'hui, dans aucune des deux langues.
describe('batterie adverse — les homographes FR/EN retirés ne taguent plus', () => {
  it('collisions PURES : aucune agression en jeu, et elles taguaient', () => {
    expect(labels('you are right that the pros and cons are worth weighing')).toEqual([]);
    expect(labels('youre going to want your thyroid gland checked')).toEqual([]);
    expect(labels('you are growing a tache i see')).toEqual([]);
    expect(labels('you are being a bigot about this policy')).toEqual([]);
  });

  it('vraies insultes EN, mais dont l’usage dominant est la VANNE', () => {
    expect(labels('you are such a loser at mario kart lmao')).toEqual([]);
    expect(labels('you are the clown in that photo right')).toEqual([]);
  });

  it('le registre FR reste couvert par le voisinage — ce qui est perdu est la SURFACE', () => {
    // Le retrait ne laisse pas le français sans mots : le registre a ses synonymes au lexique.
    expect(labels("t'es qu'un connard")).toEqual(['conflictual']);
    expect(labels("t'es qu'un guignol")).toEqual(['conflictual']);
    expect(labels("t'es qu'un looser")).toEqual(['conflictual']);
    // Mais ces surfaces-là ne sont plus lues, et c'est le prix inscrit — pas un oubli.
    expect(labels("t'es vraiment con")).toEqual([]);
    expect(labels("t'es qu'un clown")).toEqual([]);
  });
});

describe('batterie adverse — `moron`, retiré sur mesure (banc `conflictual`)', () => {
  // Une exclusion issue d'une MESURE, et non d'une doctrine : `moron` a été livré puis retiré dans
  // la même semaine, parce que le premier banc de ce label l'a trouvé à zéro de rappel sur 26 items
  // hostiles et à un tort NOMMÉ sur la voix affectueuse. C'est gelé ici pour que le prochain lot ne
  // le rajoute pas en le prenant pour un oubli : c'en est l'inverse.
  it('« moron » adressé ne tague plus', () => {
    expect(labels('you are the official moron of this house')).toEqual([]);
  });

  it('contrôle : `moronic` reste, et la garde de cible le tient sur une idée', () => {
    expect(labels('you are being moronic about this')).toEqual(['conflictual']);
    expect(labels('this take is moronic')).toEqual([]);
  });
});
