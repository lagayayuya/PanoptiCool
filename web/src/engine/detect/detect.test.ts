// Tests de la machinerie de détection (PANO-71) — les quatre filtres mesurés PANO-33 + la
// normalisation indexée. Lexiques FACTICES locaux (termes génériques FR inventés pour exercer
// chaque filtre) ; le lexique-graine réel vit dans `engine/lexicon/` et a ses propres goldens.
// Toutes les phrases sont SYNTHÉTIQUES (inventées ici, aucune donnée réelle).

import { describe, expect, it } from 'vitest';
import type { ItemLevelLexicon, TopicalLexicon } from '../lexicon/types';
import { detectLabels } from './detect';
import { normalizeFr, surfaceForm } from './normalize-fr';

/** Lexique topical de test (label arbitraire parmi les 6 ; les termes servent les filtres). */
function topical(overrides: Partial<TopicalLexicon> = {}): TopicalLexicon {
  return {
    kind: 'topical',
    label: 'mental_health',
    readingTemplateIds: ['t.reading.a', 't.reading.b'],
    explicit: ['anxiete', 'idees noires'],
    indirectCore: ['psy', 'therapie', 'manif'],
    indirectColloquial: ['deprime'],
    includeColloquial: true,
    indirectThreshold: 2,
    ...overrides,
  };
}

const CONFLICTUAL: ItemLevelLexicon = {
  kind: 'item-level',
  label: 'conflictual',
  insults: ['bouffon', 'abruti'],
  targets: ["t'es", 'tu es', 'degage'],
};

describe('normalizeFr — normalisation indexée', () => {
  it('minuscules + accents retirés + apostrophe typographique unifiée', () => {
    expect(normalizeFr('J’ai de l’Anxiété').norm).toBe("j'ai de l'anxiete");
  });

  it('surfaceForm re-projette un match du normalisé sur le texte ORIGINAL, au caractère près', () => {
    const t = normalizeFr('Mon Anxiété chronique');
    const start = t.norm.indexOf('anxiete');
    const surface = surfaceForm(t, start, start + 'anxiete'.length);
    expect(surface).toBe('Anxiété');
    expect(t.original.includes(surface)).toBe(true);
  });
});

describe('detectLabels — frontières de mots', () => {
  it('un marqueur ne matche pas À L’INTÉRIEUR d’un mot (« psy » ⊄ « psychologie »)', () => {
    const out = detectLabels(
      ['la psychologie est un domaine', 'un cours de psychologie'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('l’apostrophe est une frontière (« l’anxiete » matche « anxiete »)', () => {
    const out = detectLabels(["mon anxiété m'épuise en ce moment"], [topical()]);
    expect(out[0]?.stage).toBe('explicit');
  });
});

describe('detectLabels — fenêtre de négation', () => {
  it('négation avant le marqueur → hit supprimé', () => {
    const out = detectLabels(
      ['pas de psy pour moi', 'aucune therapie prévue'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('double négation (verbe d’omission + négation) = AFFIRMATION → hit conservé', () => {
    const out = detectLabels(
      ['je rate jamais la manif du samedi'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
  });
});

describe('detectLabels — citation / discours rapporté', () => {
  it('marqueur de citation → attribué à autrui → hit supprimé', () => {
    const out = detectLabels(
      ['parait que la therapie marche bien'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('marqueur entre guillemets → hit supprimé', () => {
    const out = detectLabels(['il a crié « anxiete » sur le plateau'], [topical()]);
    expect(out).toEqual([]);
  });
});

describe('detectLabels — 3ᵉ personne (B3 : dégradé, jamais supprimé)', () => {
  it('terme explicite appliqué à un proche → DÉGRADÉ en indirect (signal-sans-vécu, tagué quand même)', () => {
    const out = detectLabels(
      ["l'anxiété de mon fils m'inquiète beaucoup", 'chercher un psy pour mon fils'],
      [topical()],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
    expect(out[0]?.items.every((i) => i.stage === 'indirect')).toBe(true);
    // La forme de surface reste celle du texte original (accents inclus).
    expect(out[0]?.items[0]?.surfaces).toContain('anxiété');
  });
});

// --- Filtres EN (PANO-35 lot 1) : MIROIR des goldens FR ci-dessus -------------------------------
// Chaque test ci-dessous est le pendant EXACT d'un golden FR, sur les mêmes lexiques factices. Les
// marqueurs restent FR (« anxiete », « psy », « therapie ») : c'est VOULU — le risque réel mesuré
// vient des HOMOGRAPHES FR/EN (« depression », « burnout », « diabetes »), donc d'un marqueur FR
// atteint par une PHRASE EN. On exerce exactement ce chemin, sans rien ajouter aux lexiques D1.

describe('detectLabels — fenêtre de négation EN (miroir du FR)', () => {
  it('négation EN avant le marqueur → hit supprimé', () => {
    const out = detectLabels(
      ['i am not in therapie right now', 'there is no psy involved here'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('contraction EN (« don’t » / « dont ») → hit supprimé', () => {
    const out = detectLabels(
      ["i don't need therapie", 'i dont need a psy'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('« never » → hit supprimé', () => {
    expect(
      detectLabels(['i never had anxiete in my life'], [topical({ indirectThreshold: 1 })]),
    ).toEqual([]);
  });

  it('double négation EN (verbe d’omission + négation) = AFFIRMATION → hit conservé', () => {
    const out = detectLabels(
      ['i never miss my manif on saturday'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
  });
});

describe('detectLabels — citation / discours rapporté EN (miroir du FR)', () => {
  it('marqueur de citation EN → attribué à autrui → hit supprimé', () => {
    const out = detectLabels(
      ['she told me therapie works well', 'apparently the therapie helps a lot'],
      [topical({ indirectThreshold: 1 })],
    );
    expect(out).toEqual([]);
  });

  it('PASSIF MÉDICAL EN n’est PAS une citation (même piège qu’en FR) → hit conservé', () => {
    // « i was told i have… » rapporte un diagnostic REÇU, pas les propos d’un tiers sur un tiers.
    const out = detectLabels(['i was told i have anxiete'], [topical()]);
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('explicit');
  });
});

describe('detectLabels — 3ᵉ personne EN (B3 : dégradé, jamais supprimé)', () => {
  it('terme explicite appliqué à un proche EN → DÉGRADÉ en indirect (signal-sans-vécu, tagué quand même)', () => {
    const out = detectLabels(
      ['my sister has anxiete and it worries me', 'looking for a psy for my son'],
      [topical()],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
    expect(out[0]?.items.every((i) => i.stage === 'indirect')).toBe(true);
  });

  it('RÉGRESSION MESURÉE (docs/portabilite-en-filtres.md) : « my sister has X » ne NOMME plus', () => {
    // Avant ce lot, les 3 filtres protecteurs échouaient OUVERT en EN : ce texte produisait un tag
    // `explicit` (= NOMMÉ) sur le locuteur, violant SENS-B3. Il doit rester non-nommé, à jamais.
    const out = detectLabels(['my sister has anxiete'], [topical({ indirectThreshold: 1 })]);
    expect(out[0]?.stage).not.toBe('explicit');
  });

  // ── PARENTÉ ÉLARGIE — comblement mesuré, et la raison de sa cécité vaut plus que la liste ──────
  // Le lot 1 avait couvert la famille nucléaire américaine. Manquaient « my mum » (la forme
  // britannique, donc la plus courante hors Amérique du Nord) et TOUTE la parenté élargie.
  //
  // POURQUOI PERSONNE NE L'A VU, et c'est le point à retenir : sur `mental_health`, seul label
  // mesuré jusqu'ici, les noms de trouble fréquents (« depression », « anxiety », « ptsd ») vivent
  // au tier `indirectSolo` et ne peuvent STRUCTURELLEMENT plus nommer. « my nan has depression »
  // dégradait donc déjà — mais grâce au tier, pas grâce à la liste de 3ᵉ personne. Un tier créé
  // contre l'HYPERBOLE masquait un défaut de PARENTÉ, et le masque n'a sauté qu'en ouvrant un label
  // dont les noms de condition sont restés en `explicit`.
  //
  // Ce test emploie donc un lexique dont le terme est `explicit` — SANS quoi il passerait au vert
  // pour la raison d'à côté, et vérifierait le tier au lieu de la liste (CLAUDE.md : une assertion
  // vérifie ce qu'elle ATTEINT).
  it('la parenté élargie dégrade — grands-parents, « my mum », oncles, cousins', () => {
    for (const proche of [
      'my mum',
      'my nan',
      'my gran',
      'my granny',
      'my grandma',
      'my grandmother',
      'my grandad',
      'my grandpa',
      'my grandfather',
      'my grandparents',
      'my parents',
      'my uncle',
      'my aunt',
      'my cousin',
      'my niece',
      'my in-laws',
    ]) {
      const out = detectLabels([`${proche} has anxiete`], [topical({ indirectThreshold: 1 })]);
      expect(out[0]?.stage, `« ${proche} » devrait dégrader`).toBe('indirect');
    }
  });

  it("CONTRÔLE — sans marqueur de parenté, le même énoncé NOMME : c'est bien la liste qui agit", () => {
    // Sans ce contrôle, le test du dessus passerait au vert même si la dégradation venait
    // d'ailleurs (le seuil, un tier, un filtre voisin). Il fixe le point de comparaison.
    const out = detectLabels(['my neighbour has anxiete'], [topical({ indirectThreshold: 1 })]);
    expect(out[0]?.stage).toBe('explicit');
  });
});

// ── REGISTRE INFORMATIONNEL EN COMPOSÉ (« diabetes symptoms ») ───────────────────────────────────
// CE QUE CES TESTS NE COUVRENT PAS, et il faut le lire avant de les citer :
//   · ce sont des sondes de MÉCANISME, pas une mesure de taux. Aucune vérité-terrain, aucun
//     dénominateur — les bancs de registres restent les seuls instruments de taux, et aucun d'eux
//     n'exerce la santé physique à ce jour ;
//   · ils portent sur l'ANGLAIS seul. Le français n'a pas ce défaut (il porte « symptomes » nu), et
//     le dernier cas ci-dessous le fige plutôt que de le supposer ;
//   · ils ne disent rien des têtes NON admises (« treatment », « diet ») au-delà du fait qu'elles ne
//     dégradent pas — ce qui est le comportement voulu, pas une lacune.
describe('detectLabels — registre informationnel EN en COMPOSÉ', () => {
  // Lexique factice au tier `explicit` — c'est ce tier que la règle plafonne. « diabete » sert
  // aussi de témoin de la tolérance de pluriel : il matche « diabetes », et le composé doit se
  // reconnaître APRÈS le « s » que le span du marqueur n'inclut pas.
  const HP = (terms: string[]) =>
    detectLabels(terms, [topical({ explicit: ['diabete', 'psoriasis'] })]);

  it('LE DÉFAUT REFERMÉ — « X symptoms » ne NOMME plus, alors que « symptoms of X » dégradait déjà', () => {
    // L'anglais compose sa requête de santé la plus fréquente en antéposé, et la liste par
    // préposition la manquait entièrement. Les deux ordres de mots doivent produire le même étage.
    expect(HP(['diabetes symptoms'])[0]?.stage).toBe('indirect');
    expect(HP(['symptoms of diabetes'])[0]?.stage).toBe('indirect');
  });

  it('le composé franchit SEUL, comme la forme par préposition — sinon les deux règles se composent en DISPARITION', () => {
    // Le seuil est à 2 et il n'y a qu'un item : sans le franchissement solo, le cadrage retirerait
    // l'étage nommé puis le seuil retirerait le constat, alors qu'aucune des deux règles ne demande
    // qu'il ne reste rien à montrer. Même raisonnement que la voie par préposition.
    const out = HP(['diabetes symptoms']);
    expect(out).toHaveLength(1);
    expect(out[0]?.items[0]?.solo).toBe(true);
  });

  it('LE COÛT, mesuré et assumé — « my diabetes symptoms » dégrade AUSSI', () => {
    // Il faut l'écrire, parce que c'est le seul endroit où cette règle se trompe : un possessif
    // devant le composé ne la retient pas. Quelqu'un qui décrit SES symptômes par cette tournure
    // perd son étage nommé.
    //
    // Pourquoi c'est accepté plutôt que rattrapé : (1) une règle d'étage se trompe en
    // SOUS-affirmant, ce qui se rattrape, là où un filtre fabriquerait un faux négatif aveugle
    // (ADR-0003) ; (2) le rattrapage évident — exiger l'absence de possessif — est l'ancrage
    // 1ʳᵉ personne, mesuré et écarté ; (3) la borne est un fait de langue déjà invoqué par la voie
    // par préposition : qui vit une condition la nomme AUSSI au possessif nu ailleurs, et cet
    // item-là suffit à tenir l'étage. La ligne suivante le fige.
    expect(HP(['my diabetes symptoms have been worse'])[0]?.stage).toBe('indirect');
    expect(
      HP(['my diabetes symptoms have been worse', 'my diabetes is hard to manage'])[0]?.stage,
    ).toBe('explicit');
  });

  it('la tête doit être ACCOLÉE au terme — sinon ce serait « symptoms » nu par la bande', () => {
    expect(HP(['my diabetes and her symptoms are unrelated'])[0]?.stage).toBe('explicit');
    // Et la frontière de mot tient : « symptomatic » n'est pas « symptoms ».
    expect(HP(['psoriasis symptomatic relief'])[0]?.stage).toBe('explicit');
  });

  it('« treatment » et « diet » NE dégradent pas — chercher un soin est un signal de vécu', () => {
    // Exclusion assumée, pas oubli : le critère d'admission demande d'interroger, définir ou
    // quantifier. « diabetes treatment » cherche un SOIN, et chercher un soin pour soi est un
    // signal de vécu (ADR-0003, « Pour qui », pas « quel mot »). Le FR traite « traitement du
    // diabete » de la même façon, dans les deux ordres de mots.
    expect(HP(['diabetes treatment options'])[0]?.stage).toBe('explicit');
    expect(HP(['diabetes diet plan'])[0]?.stage).toBe('explicit');
  });

  it('LE FRANÇAIS NE BOUGE PAS — il porte « symptomes » nu et n’a jamais eu ce défaut', () => {
    // Figé plutôt que supposé : c'est la vérification qui a montré que ce défaut était EN-only, et
    // sans elle un lecteur pourrait croire que la liste de composés lui manque aussi.
    expect(HP(['symptomes du diabete'])[0]?.stage).toBe('indirect');
    expect(HP(['mon diabete me fatigue'])[0]?.stage).toBe('explicit');
  });
});

describe('detectLabels — conflictual EN (B5) : insulte REÇUE exclue', () => {
  it('« he called me… » (insulte reçue/rapportée) → exclue, comme « il m’a traité de… »', () => {
    expect(detectLabels(['he called me a bouffon in front of everyone'], [CONFLICTUAL])).toEqual(
      [],
    );
  });
});

describe('detectLabels — PORTE DE LANGUE : une copule EN ne lit jamais `selfDeclaredFr`', () => {
  it('« i am X » sur un terme `selfDeclaredFr` ne tague PAS — le zéro vient de la porte, plus de l’absence de têtes', () => {
    // Ce test a été le verrou de la dette « copule EN non livrée » (PANO-35 lot 2), à inverser le
    // jour de la livraison. La copule EN EST livrée depuis (`SELF_DECLARATION_HEADS_EN`, tier
    // `selfDeclaredEn` qui atterrit en LARGE) — et le test n’a PAS été inversé, parce que son zéro a
    // CHANGÉ DE CAUSE sans changer de valeur : les têtes anglaises ne lisent que `selfDeclaredEn`,
    // et `selfDeclaredFr` reste inatteignable depuis une copule anglaise (la porte de langue,
    // vérifiée par mutations dans `selfdeclared-language-gate.test.ts`). Un zéro a plusieurs causes
    // possibles ; celui-ci tient désormais la porte, pas la dette.
    const out = detectLabels(['i am depressif'], [topical({ selfDeclaredFr: ['depressif'] })]);
    expect(out).toEqual([]);
  });
});

describe('detectLabels — conflictual (B5, item-level)', () => {
  it('insulte émise + cible 2ᵉ personne → tag explicite, surfaces = insultes', () => {
    const out = detectLabels(["t'es vraiment qu'un bouffon"], [CONFLICTUAL]);
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('explicit');
    expect(out[0]?.items[0]?.surfaces).toEqual(['bouffon']);
  });

  it('juron sans cible (frustration) → exclu', () => {
    expect(detectLabels(['quel bouffon ce scénario de film'], [CONFLICTUAL])).toEqual([]);
  });

  it('insulte CITÉE (reçue/rapportée) → exclue', () => {
    expect(detectLabels(["il m'a traite de bouffon devant tout le monde"], [CONFLICTUAL])).toEqual(
      [],
    );
  });
});

describe('detectLabels — tolérances de variation (PANO-36 phase 0)', () => {
  it('tiret ↔ espace : une seule entrée couvre les deux graphies', () => {
    const lex = topical({ explicit: ['burn out'], indirectThreshold: 1 });
    expect(detectLabels(['en plein burn-out cette semaine'], [lex])[0]?.stage).toBe('explicit');
    expect(detectLabels(['en plein burn out cette semaine'], [lex])[0]?.stage).toBe('explicit');
  });

  it('auto-censure symbolique : « c*nne » matche « conne », surface = forme masquée tapée', () => {
    const lex: ItemLevelLexicon = {
      kind: 'item-level',
      label: 'conflictual',
      insults: ['conne'],
      targets: ["t'es"],
    };
    const out = detectLabels(["t'es vraiment une c*nne"], [lex]);
    expect(out).toHaveLength(1);
    expect(out[0]?.items[0]?.surfaces).toEqual(['c*nne']);
  });

  it('auto-censure : un mot innocent ne matche pas (pas de symbole ≠ lettre différente)', () => {
    const lex: ItemLevelLexicon = {
      kind: 'item-level',
      label: 'conflictual',
      insults: ['conne'],
      targets: ["t'es"],
    };
    expect(detectLabels(["t'es venue avec ta canne"], [lex])).toEqual([]);
  });

  it('allongement expressif : « abruuuuuti » matche « abruti », surface = forme allongée entière', () => {
    const out = detectLabels(["t'es un abruuuuuti fini"], [CONFLICTUAL]);
    expect(out).toHaveLength(1);
    expect(out[0]?.items[0]?.surfaces).toEqual(['abruuuuuti']);
  });

  it('allongement : le squelette est GARDÉ — sans allongement visible, pas de match squelette', () => {
    // « cône » → squelette « cone » = squelette de « conne », mais aucune répétition ≥ 3 dans la
    // surface → rejeté. Le fallback ne s'ouvre qu'aux allongements réels.
    const lex: ItemLevelLexicon = {
      kind: 'item-level',
      label: 'conflictual',
      insults: ['conne'],
      targets: ["t'es"],
    };
    expect(detectLabels(["t'es sous ce cône de chantier"], [lex])).toEqual([]);
  });

  it('allongement sur marqueur topical : « manifffff » compte comme « manif »', () => {
    const out = detectLabels(['grosse manifffff demain'], [topical({ indirectThreshold: 1 })]);
    expect(out).toHaveLength(1);
    expect(out[0]?.items[0]?.surfaces).toEqual(['manifffff']);
  });

  it('pluriel : un marqueur singulier couvre sa forme au pluriel, sans déborder', () => {
    const lex = topical({
      explicit: ['idee noire'],
      indirectCore: ['manif'],
      indirectThreshold: 1,
    });
    // Pluriel capté…
    expect(detectLabels(['plein de manifs ce mois-ci'], [lex])[0]?.items[0]?.surfaces).toEqual([
      'manifs',
    ]);
    // …mais la frontière de mot tient (« console » ne matche pas « con »).
    const conLex: ItemLevelLexicon = {
      kind: 'item-level',
      label: 'conflictual',
      insults: ['con'],
      targets: ["t'es"],
    };
    expect(detectLabels(["t'es devant ta console de jeu"], [conLex])).toEqual([]);
  });
});

describe('detectLabels — pattern d’auto-déclaration (PANO-72)', () => {
  const lex = topical({
    explicit: [],
    selfDeclaredFr: ['depressif', 'depressive'],
    indirectCore: ['psy'],
    indirectThreshold: 1,
  });

  it('« je suis dépressif » → explicit ; modificateurs intercalés tolérés', () => {
    expect(detectLabels(['je suis depressif'], [lex])[0]?.stage).toBe('explicit');
    expect(detectLabels(['jsuis une grosse depressive'], [lex])[0]?.stage).toBe('explicit');
    expect(detectLabels(['chui un vrai depressif'], [lex])[0]?.stage).toBe('explicit');
  });

  it('surface = le span entier (copule + modificateurs + terme)', () => {
    const out = detectLabels(['je suis un pauvre depressif'], [lex]);
    expect(out[0]?.items[0]?.surfaces).toEqual(['je suis un pauvre depressif']);
  });

  it('négation brise le pattern (« je suis pas dépressif ») → non tagué', () => {
    expect(detectLabels(['je suis pas depressif du tout'], [lex])).toEqual([]);
  });

  it('terme d’auto-déclaration NU (sans copule) ne matche pas via ce champ', () => {
    // « depressif » n'est pas dans explicit/indirect ici → un « film dépressif » ne tague rien.
    expect(detectLabels(['ce film est vraiment depressif'], [lex])).toEqual([]);
  });

  it('auto-déclaration JAMAIS dégradée par une 3ᵉ personne dans le même commentaire', () => {
    // La copule ancre la 1ʳᵉ personne : reste explicit malgré « ma fille ».
    const out = detectLabels(['je suis depressif comme ma fille'], [lex]);
    expect(out[0]?.stage).toBe('explicit');
  });
});

describe('detectLabels — agrégation par label', () => {
  it('sous le seuil indirect → AUCUNE détection (et l’item ne sera jamais une preuve)', () => {
    expect(detectLabels(['je vois un psy demain'], [topical({ indirectThreshold: 2 })])).toEqual(
      [],
    );
  });

  it('seuil indirect atteint → tag indirect portant TOUS les items contributeurs', () => {
    const out = detectLabels(
      ['je vois un psy demain', 'la therapie me fait du bien', 'sujet sans rapport'],
      [topical({ indirectThreshold: 2 })],
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('indirect');
    expect(out[0]?.items.map((i) => i.itemIndex)).toEqual([0, 1]);
  });

  it('≥ 1 item explicite → tag explicite, items = explicites ET indirects (toutes les preuves)', () => {
    const out = detectLabels(['mon anxiété au quotidien', 'je vois un psy demain'], [topical()]);
    expect(out).toHaveLength(1);
    expect(out[0]?.stage).toBe('explicit');
    expect(out[0]?.items).toHaveLength(2);
  });

  it('un même item peut alimenter PLUSIEURS labels ; un autre aucun', () => {
    const out = detectLabels(
      ["t'es un abruti et ta manif est ridicule", 'je rentre en manif à vélo'],
      [topical({ label: 'politics', indirectThreshold: 2 }), CONFLICTUAL],
    );
    const labels = out.map((d) => d.label).sort();
    expect(labels).toEqual(['conflictual', 'politics']);
    // L'item 0 contribue aux deux labels ; les surfaces different par label.
    expect(out.find((d) => d.label === 'politics')?.items.map((i) => i.itemIndex)).toEqual([0, 1]);
    expect(out.find((d) => d.label === 'conflictual')?.items.map((i) => i.itemIndex)).toEqual([0]);
  });
});
