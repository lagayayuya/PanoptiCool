// Goldens de MÉCANIQUE de D2 (socle PANO-75) — verrouillent le comportement de la règle
// INDÉPENDAMMENT du contenu réel des lexiques (lots PANO-76+). Comme D1 sépare `detect.test.ts`
// (lexiques FACTICES) de `lexicon-battery.test.ts` (lexiques réels), la mécanique D2 se teste sur des
// lexiques factices injectés via le paramètre `lexicons` de `d2Interests` : le socle reste
// littéralement intact quand les lots de contenu changent le registre réel.
//
// Garde-fous vérifiés ici : jamais de `readings`, classement (plancher + tri par volume), confiance
// dérivée du volume, bonus d'auto-déclaration, thème bien formé (nom + bloc usage). Le CONTENU réel
// (détection par thème, adversité, frontière D1, dédup D1×D2) vit dans
// `detect/interests-battery.test.ts`. Phrases 100 % synthétiques, jamais tirées d'un export réel.
//
// PORTÉ À LA REFONTE A. Trois verrous changent de NATURE — il faut le dire, pas les réécrire en
// silence :
//   - « D2 n'émet JAMAIS de `sensitivity` » devient « `sensitive === false` ». Ce n'est PAS un
//     renommage : §2.1 a fusionné trois axes de gradation DÉGÉNÉRÉS (`sensitivity` toujours `3`,
//     `Theme.sensitive` toujours `false`, `Confidence.level: 'high'` sans producteur) en UN
//     discriminant qui, lui, VARIE. L'assertion passe d'« absent » à « explicitement faux » — et le
//     `Theme.sensitive` qu'on vérifiait en plus a disparu, l'information ne vit qu'à un endroit ;
//   - « les insights sont groupés par `themeId`, dans l'ordre » n'est plus testable PARCE QUE c'est
//     devenu STRUCTUREL : un thème PORTE ses constats (`deductions`). Le regroupement que
//     `buildPageBlocks` refaisait à l'affichage est fait ICI, une fois. Ce qu'un test peut encore
//     prouver, et qui reste une décision de règle : D2 émet UN constat par thème retenu ;
//   - « claim = TemplateRef de l'allowlist » devient l'identité RÉELLE (même bascule que les goldens
//     D1) : le claim est le TEXTE de `d2InterestClaim(volume)`, il ne PEUT pas sortir d'une liste.
//     On vérifie donc qu'il porte le BON volume — ce que l'allowlist ne prouvait pas.
// Le magasin de preuves disparaît avec `evidenceId`/`source.path` : une preuve est référencée
// directement, son identité est la paire `channel`/`sourceIndex` (§5.4).

import { describe, expect, it } from 'vitest';
import type { AnalysisTheme, Deduction } from '../analysis';
import type { InterestLexicon } from '../lexicon/types';
import { normalizeExport } from '../normalize';
import type { CommentItem, SearchItem, TikTokExport } from '../tiktok-export';
import { validTikTokExport } from '../valid-export.fixture';
import { d2InterestClaim } from '../wording';
import { d2Interests } from './d2-interests';

/** Lexiques FACTICES — marqueurs inventés, sans collision possible, pour tester la seule mécanique. */
const ANIMAL: InterestLexicon = {
  kind: 'interest',
  label: 'factice_animal',
  themeLabel: 'theme.factice-animal.label',
  usage: [{ actor: 'advertiser', usage: { templateId: 'usage.factice.animal', params: {} } }],
  markers: ['wombat', 'okapi', 'tapir'],
  // Marqueurs ambigus : ne comptent que près d'un compagnon du domaine (co-occurrence PANO-76).
  anchored: ['patte', 'poil'],
  selfDeclared: ['zoologue'],
};
const PLANTE: InterestLexicon = {
  kind: 'interest',
  label: 'factice_plante',
  themeLabel: 'theme.factice-plante.label',
  usage: [{ actor: 'platform', usage: { templateId: 'usage.factice.plante', params: {} } }],
  markers: ['bonsai', 'ficus'],
};
const FACTICES: readonly InterestLexicon[] = [ANIMAL, PLANTE];

/** Export valide dont `CommentsList`/`SearchList` portent les textes donnés (dates fixes, reste =
 * vide). Canal unique par défaut — les tests historiques passent `withChannels(texts, [])`, cf.
 * alias `withComments` ci-dessous, comportement INCHANGÉ (PANO-80). */
function withChannels(
  comments: readonly string[],
  searches: readonly string[],
): ReturnType<typeof normalizeExport> {
  const base = validTikTokExport() as TikTokExport & {
    Comment: { Comments: { CommentsList: readonly CommentItem[] } };
    'Your Activity': { Searches: { SearchList: readonly SearchItem[] } };
  };
  base.Comment.Comments.CommentsList = comments.map((comment, i) => ({
    date: `2026-06-15 10:00:0${i % 10} UTC`,
    comment,
    photo: '',
    video: '',
    sticker: '',
    originalPostUrl: `https://example.invalid/post/${i}`,
    'original post link': '',
  }));
  base['Your Activity'].Searches.SearchList = searches.map((SearchTerm, i) => ({
    Date: `2026-06-16 11:00:0${i % 10}`,
    SearchTerm,
  }));
  return normalizeExport(base);
}

/** Alias historique (Comments seul, Searches vide) — comportement des goldens EXISTANTS INCHANGÉ. */
function withComments(texts: readonly string[]): ReturnType<typeof normalizeExport> {
  return withChannels(texts, []);
}

/** Export dont SEUL `SearchList` porte les termes donnés (`CommentsList` vide). */
function withSearches(terms: readonly string[]): ReturnType<typeof normalizeExport> {
  return withChannels([], terms);
}

function run(texts: readonly string[]): AnalysisTheme[] {
  return d2Interests(withComments(texts), FACTICES);
}

function runChannels(comments: readonly string[], searches: readonly string[]): AnalysisTheme[] {
  return d2Interests(withChannels(comments, searches), FACTICES);
}

/** Le thème d'`id` donné, ou `undefined` — remplace le `find` sur `insight.themeId`. */
const themeById = (themes: readonly AnalysisTheme[], id: string): AnalysisTheme | undefined =>
  themes.find((t) => t.id === id);

/** Les constats de tous les thèmes (ex-`out.insights`, qui était plat). */
const allDeductions = (themes: readonly AnalysisTheme[]): Deduction[] =>
  themes.flatMap((t) => t.deductions);

describe('d2Interests — forme', () => {
  it('Comments vide → []', () => {
    expect(d2Interests(normalizeExport(validTikTokExport()), FACTICES)).toEqual([]);
  });

  it('un intérêt sous le plancher (1 seul hit) → aucun thème (borne §5.1 : aucune miette citée)', () => {
    expect(run(['un wombat traverse la clairière', 'belle lumière ce soir'])).toEqual([]);
  });

  it('un intérêt au plancher (≥ 2 hits) → 1 thème portant 1 constat', () => {
    const out = run(['un wombat au zoo', 'encore un okapi superbe']);
    expect(out).toHaveLength(1);
    expect(out[0]?.id).toBe('factice_animal');
    expect(out[0]?.deductions).toHaveLength(1);
    // Le claim porte le VOLUME réel (2 hits) — ex-« claim.templateId ⊆ allowlist ».
    expect(out[0]?.deductions[0]?.claim).toBe(d2InterestClaim('fr', 2));
  });
});

describe('d2Interests — goldens structurels (cadrage PANO-74)', () => {
  // animal ×3, plante ×2 → deux thèmes, animal en tête (volume décroissant).
  const CORPUS = [
    'un wombat au réveil', // animal 1
    'encore un okapi', // animal 2
    'et un tapir aussi', // animal 3
    'mon bonsai a grandi', // plante 1
    'un ficus au salon', // plante 2
    'belle balade en forêt', // non-porteur : jamais cité
  ];
  const out = run(CORPUS);

  it('D2 n’émet JAMAIS de constat sensible (ex-« jamais de sensitivity » — §2.1)', () => {
    for (const deduction of allDeductions(out)) {
      expect(deduction.sensitive).toBe(false);
    }
  });

  it('D2 n’émet JAMAIS de readings (pas d’éventail de lectures)', () => {
    for (const deduction of allDeductions(out)) {
      for (const e of deduction.evidence) {
        expect(e.readings).toBeUndefined();
      }
    }
  });

  it('classement : plancher respecté et thèmes triés par volume décroissant', () => {
    expect(out.map((t) => t.id)).toEqual(['factice_animal', 'factice_plante']);
    for (const deduction of allDeductions(out)) {
      for (const e of deduction.evidence) {
        expect(e.text).not.toContain('forêt'); // le non-porteur n’entre jamais (borne §5.1)
      }
    }
  });

  it('UN constat par thème retenu (ex-« insights groupés par themeId » — désormais structurel)', () => {
    for (const theme of out) {
      expect(theme.deductions).toHaveLength(1);
    }
  });

  it('confiance dérivée du volume, jamais high (animal 3 < seuil → low)', () => {
    for (const deduction of allDeductions(out)) {
      expect(deduction.confidence === 'low' || deduction.confidence === 'medium').toBe(true);
    }
    expect(themeById(out, 'factice_animal')?.deductions[0]?.confidence).toBe('low');
  });

  it('thème bien formé : nom en TEXTE, usage = actor + usage en TEXTE (A2, plus de TemplateRef)', () => {
    for (const theme of out) {
      expect(typeof theme.label).toBe('string');
      for (const u of theme.usage) {
        expect(typeof u.actor).toBe('string');
        expect(typeof u.usage).toBe('string');
      }
    }
  });

  it('triggerTerms ⊂ texte de SA preuve, au caractère près', () => {
    for (const deduction of allDeductions(out)) {
      for (const e of deduction.evidence) {
        for (const term of e.triggerTerms ?? []) {
          expect(e.text.includes(term), `« ${term} » absent de « ${e.text} »`).toBe(true);
        }
      }
    }
  });
});

describe('d2Interests — bonus d’auto-déclaration', () => {
  it('« je suis un vrai zoologue » pousse la confiance low → medium', () => {
    const out = run(['je suis un vrai zoologue', 'un wombat superbe']);
    expect(themeById(out, 'factice_animal')?.deductions[0]?.confidence).toBe('medium');
  });
});

describe('d2Interests — désambiguïsation par CO-OCCURRENCE (marqueurs ancrés)', () => {
  it('un ancré ISOLÉ (sans compagnon) ne compte pas — même répété, aucun thème', () => {
    // « patte » est ancré ; deux items « patte » seuls, aucun compagnon du domaine → aucun thème.
    expect(run(['une patte dans la boue', 'encore une patte cassée'])).toEqual([]);
  });

  it('un ancré près d’un SOLO compagnon compte (« wombat » ancre « patte »)', () => {
    // 2 items pour atteindre le plancher : chacun a un solo (wombat/okapi) qui ancre l’ancré.
    const animal = themeById(
      run(['un wombat avec une patte cassée', 'un okapi et son poil ras']),
      'factice_animal',
    );
    expect(animal).toBeDefined();
    // La surface de l’ancré est bien retenue comme preuve (triggerTerm).
    const surfaces = (animal?.deductions[0]?.evidence ?? []).flatMap((e) => e.triggerTerms ?? []);
    expect(surfaces).toContain('patte');
  });

  it('DEUX ancrés distincts s’ancrent mutuellement (« patte » + « poil »)', () => {
    const out = run(['patte et poil partout ce matin', 'encore patte et poil sur le tapis']);
    expect(themeById(out, 'factice_animal')).toBeDefined();
  });

  it('un ancré près d’une AUTO-DÉCLARATION compagnon compte', () => {
    const out = run(['je suis un vrai zoologue, quelle patte', 'un wombat de plus']);
    expect(themeById(out, 'factice_animal')).toBeDefined();
  });
});

describe('d2Interests — adaptateur Searches (PANO-80, PANO-70 §1.6)', () => {
  it('Comments vide MAIS Searches porteuse (≥ plancher) → thème détecté quand même', () => {
    const out = d2Interests(
      withSearches(['un wombat au zoo', 'encore un okapi superbe']),
      FACTICES,
    );
    expect(out).toHaveLength(1);
    expect(out[0]?.id).toBe('factice_animal');
  });

  it('détection sur RECHERCHES seules : chaque preuve porte le canal `search` et son index source', () => {
    // Ex-`evidenceId: 'search:<index>'` + `source: { path }` : l'identité est une PAIRE de données,
    // plus une chaîne préfixée à fabriquer puis re-parser (§5.4).
    const out = d2Interests(
      withSearches(['un wombat au zoo', 'encore un okapi superbe']),
      FACTICES,
    );
    const animal = themeById(out, 'factice_animal');
    expect(
      (animal?.deductions[0]?.evidence ?? []).map((e) => ({
        channel: e.channel,
        sourceIndex: e.sourceIndex,
      })),
    ).toEqual([
      { channel: 'search', sourceIndex: 0 },
      { channel: 'search', sourceIndex: 1 },
    ]);
  });

  it('plancher atteint À TRAVERS les deux canaux (1 comment + 1 recherche) → thème détecté', () => {
    // Le point dur que les préfixes `comment:`/`search:` protégeaient : deux items d'index source 0
    // sur deux canaux ne doivent pas collisionner. La paire le tient nativement.
    const animal = themeById(
      runChannels(['un wombat au réveil'], ['encore un okapi superbe']),
      'factice_animal',
    );
    expect(animal).toBeDefined();
    expect(
      (animal?.deductions[0]?.evidence ?? []).map((e) => ({
        channel: e.channel,
        sourceIndex: e.sourceIndex,
      })),
    ).toEqual([
      { channel: 'comment', sourceIndex: 0 },
      { channel: 'search', sourceIndex: 0 },
    ]);
  });

  it('Comments vide ET Searches vide → [] (guard préservé)', () => {
    expect(d2Interests(withChannels([], []), FACTICES)).toEqual([]);
  });
});
