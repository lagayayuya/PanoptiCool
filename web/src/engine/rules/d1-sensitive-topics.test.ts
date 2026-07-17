// Goldens de D1 (PANO-71) — les garde-fous STRUCTURELS du cadrage PANO-70 §4, verrouillés :
//   - 1 constat par label détecté ; `[]` si les deux canaux sont vides ;
//   - `sensitive: true` sur TOUT constat D1 ;
//   - tag nommé ⇒ triggerTerms non vides (B2) ; triggerTerms ⊂ texte de la preuve, au caractère près ;
//   - éventail UNIQUEMENT sur l'indirect, mode `equal`, lectures ⊆ registre du lexique (§5) ;
//     jamais d'éventail sur l'explicite ni sur conflictual (décision yuya) ;
//   - pas de confiance/poids par lecture (structurel : une lecture est une CHAÎNE) ;
//   - confiance plafonnée medium (explicite → medium, indirect → low) ;
//   - seules les miettes CITÉES existent (borne mémoire d'ADR-0003, désormais par construction).
// Phrases 100 % SYNTHÉTIQUES (inventées ici).
//
// PORTÉ À LA REFONTE A. Deux verrous changent de NATURE, et il faut le dire plutôt que de les
// réécrire en silence :
//   - « claim ⊆ allowlist » n'a plus de sens : le claim est le TEXTE d'une fonction importée, il ne
//     PEUT pas sortir d'une liste (le compilateur tient ce que l'allowlist tenait). On vérifie donc
//     l'identité RÉELLE : le claim émis EST celui de la fonction attendue pour ce label × étage ;
//   - « item multi-label stocké UNE fois » est INVERSÉ : le magasin est supprimé, le verbatim est
//     DUPLIQUÉ entre constats co-citants (arbitrage yuya, coût assumé). Ce qui reste à verrouiller —
//     et qui était le vrai enjeu — est que chaque citation porte SES surfaces, pas celles de l'autre.

import { describe, expect, it } from 'vitest';
import type { Evidence } from '../analysis';
import { WIRED_LEXICONS } from '../lexicon';
import { normalizeExport } from '../normalize';
import type { CommentItem, SearchItem, TikTokExport } from '../tiktok-export';
import { validTikTokExport } from '../valid-export.fixture';
import {
  d1ConflictualNamedClaim,
  d1MentalHealthBroadClaim,
  d1MentalHealthNamedClaim,
  d1PoliticsBroadClaim,
  readingText,
} from '../wording';
import { d1SensitiveTopics } from './d1-sensitive-topics';

/** Export valide dont `CommentsList`/`SearchList` portent les textes donnés (dates fixes, reste =
 * vide). Canal unique par défaut (`searches = []`). */
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
const withComments = (texts: readonly string[]) => withChannels(texts, []);
/** Export dont SEUL `SearchList` porte les termes donnés. */
const withSearches = (terms: readonly string[]) => withChannels([], terms);

/** Lectures autorisées (registre §5 via les lexiques câblés), en TEXTE — le lexique porte les clés. */
const ALLOWED_READINGS = new Set(
  WIRED_LEXICONS.flatMap((l) => (l.kind === 'topical' ? [...l.readingTemplateIds] : [])).map(
    readingText,
  ),
);

/** Corpus synthétique riche : explicite, indirect, multi-label, non-porteur. */
const RICH = [
  'ma dépression me suit depuis des années', // mental_health explicite
  'je cherche un bon psy dans le coin', // mental_health indirect
  "t'es vraiment un abruti d'avoir écrit ça", // conflictual (émise, ciblée)
  'super recette de gâteau au chocolat', // non-porteur : ne doit JAMAIS être cité
  'grosse manif demain contre la réforme', // politics indirect (1/2)
  'les élections approchent, allez voter', // politics indirect (2/2)
];

const run = (texts: readonly string[]) => d1SensitiveTopics(withComments(texts));

/** Les claims d'étage NOMMÉ, en texte — sert à distinguer nommé/large sans re-parser un templateId. */
const NAMED_CLAIMS = new Set([d1ConflictualNamedClaim(), d1MentalHealthNamedClaim()]);

describe('d1SensitiveTopics — forme', () => {
  it('Comments ET Searches vides → [] (guard préservé)', () => {
    expect(d1SensitiveTopics(normalizeExport(validTikTokExport()))).toEqual([]);
    expect(d1SensitiveTopics(withChannels([], []))).toEqual([]);
  });

  it('aucun texte porteur → aucune détection, aucune miette citée (borne §5.1)', () => {
    expect(run(['belle lumière ce soir', 'recette de pain maison'])).toEqual([]);
  });

  it('1 constat PAR LABEL détecté', () => {
    const out = run(RICH);
    expect(out).toHaveLength(3); // mental_health + conflictual + politics
    expect(new Set(out.map((s) => s.claim)).size).toBe(3);
  });
});

describe('d1SensitiveTopics — goldens structurels (cadrage PANO-70 §4)', () => {
  const out = run(RICH);

  it('sensitive === true sur tout constat D1 (ex-`sensitivity === 3`, toujours 3 — §2.1)', () => {
    for (const signal of out) {
      expect(signal.sensitive).toBe(true);
    }
  });

  it('chaque constat porte le claim RÉEL de son label × étage (ex-« ⊆ allowlist »)', () => {
    // L'appartenance à une liste close est désormais tenue par le compilateur (`CLAIM_BY_LABEL` est
    // un `Record<SensitiveLabel, …>` de fonctions importées). Ce qu'un test peut encore prouver, et
    // que l'allowlist ne prouvait pas : que l'étage détecté choisit le BON claim.
    expect(out.map((s) => s.claim).sort()).toEqual(
      [d1MentalHealthNamedClaim(), d1ConflictualNamedClaim(), d1PoliticsBroadClaim()].sort(),
    );
  });

  it('triggerTerms ⊂ texte de SA preuve, au caractère près', () => {
    for (const signal of out) {
      for (const e of signal.evidence) {
        for (const term of e.triggerTerms ?? []) {
          expect(e.text.includes(term), `« ${term} » absent de « ${e.text} »`).toBe(true);
        }
      }
    }
  });

  it('tag NOMMÉ ⇒ triggerTerms non vides sur chaque preuve (B2)', () => {
    const named = out.filter((s) => NAMED_CLAIMS.has(s.claim));
    expect(named.length).toBeGreaterThan(0);
    for (const signal of named) {
      for (const e of signal.evidence) {
        expect(e.triggerTerms?.length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it('éventail UNIQUEMENT sur l’indirect, mode equal, lectures ⊆ registre §5 ; jamais sur nommé/conflictual', () => {
    for (const signal of out) {
      const isNamed = NAMED_CLAIMS.has(signal.claim);
      for (const e of signal.evidence) {
        if (isNamed) {
          expect(e.readings).toBeUndefined();
          continue;
        }
        expect(e.readings?.mode).toBe('equal');
        for (const reading of e.readings?.readings ?? []) {
          expect(ALLOWED_READINGS.has(reading)).toBe(true);
          // Pas de confiance/poids par lecture : une lecture est une CHAÎNE (C3, resserré).
          expect(typeof reading).toBe('string');
        }
      }
    }
  });

  it('confiance plafonnée medium (explicite → medium, indirect → low)', () => {
    for (const signal of out) {
      expect(signal.confidence).toBe(NAMED_CLAIMS.has(signal.claim) ? 'medium' : 'low');
    }
  });

  it('seules les miettes CITÉES existent (borne §5.1) — le non-porteur n’apparaît jamais', () => {
    for (const signal of out) {
      for (const e of signal.evidence) {
        expect(e.text).not.toContain('gâteau'); // le non-porteur du corpus
      }
    }
  });
});

describe('d1SensitiveTopics — décision D (conflictual = agression de PERSONNES uniquement)', () => {
  it('critique d’une chose/idée sans adresse 2ᵉ personne → JAMAIS conflictual (golden anti-régression)', () => {
    // Insulte lexicale présente mais AUCUNE cible 2ᵉ personne (« cette » a été retiré du lexique
    // pour exactement cette raison : un démonstratif n'est pas une adresse à l'interlocuteur).
    const out = run([
      'cette blague est vraiment debile',
      'ce film est un vrai bouffon de scénario',
    ]);
    expect(out.some((s) => s.claim === d1ConflictualNamedClaim())).toBe(false);
  });
});

describe('d1SensitiveTopics — multi-label et signal-sans-vécu', () => {
  it('un commentaire multi-label : cité par CHAQUE constat, chacun avec SES triggerTerms', () => {
    // Ex-« stocké UNE fois » : le magasin est supprimé, le verbatim est DUPLIQUÉ (arbitrage yuya).
    // Le verrou qui compte survit intact — et c'est le seul qui comptait : deux constats citant la
    // même source ne se prêtent JAMAIS leurs surfaces (« manif » côté politics, « abruti » côté
    // conflictual). C'est aussi ce que la duplication rend structurellement possible.
    const out = run([
      "t'es un abruti et ta manif est ridicule", // conflictual ET politics (1/2)
      'les élections arrivent vite', // politics (2/2)
    ]);
    expect(out).toHaveLength(2);
    const citationOf = (i: number): Evidence | undefined =>
      out[i]?.evidence.find((e) => e.channel === 'comment' && e.sourceIndex === 0);
    const a = citationOf(0);
    const b = citationOf(1);
    expect(a).toBeDefined();
    expect(b).toBeDefined();
    expect(a?.text).toBe(b?.text); // même source, verbatim dupliqué — le coût assumé
    expect(a?.triggerTerms).not.toEqual(b?.triggerTerms); // ... et surfaces distinctes : le gain
  });

  it('signal-sans-vécu (3ᵉ personne) : TAGUÉ, en indirect — la démonstration (C2), pas un bug', () => {
    const out = run([
      'chercher un psy pour mon fils', // dégradé 3ᵉ personne
      "la dépression de ma fille m'inquiète", // explicite dégradé 3ᵉ personne
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]?.claim).toBe(d1MentalHealthBroadClaim());
  });
});

describe('d1SensitiveTopics — adaptateur Searches (PANO-80, PANO-70 §1.6)', () => {
  it('Comments vide MAIS Searches porteuse → détecté quand même (le guard ne bloque plus à tort)', () => {
    const out = d1SensitiveTopics(withSearches(['ma dépression me suit depuis des années']));
    expect(out).toHaveLength(1);
    expect(out[0]?.claim).toBe(d1MentalHealthNamedClaim());
  });

  it('détection sur RECHERCHES seules : chaque preuve porte le canal `search` et son index source', () => {
    // Ex-`evidenceId: 'search:<index>'` + `source: { path }` : l'identité est une PAIRE de données,
    // plus une chaîne préfixée à fabriquer puis re-parser (§5.4).
    const out = d1SensitiveTopics(
      withSearches([
        'ma dépression me suit depuis des années',
        'je cherche un bon psy dans le coin',
      ]),
    );
    expect(out).toHaveLength(1); // même label (mental_health), agrégé
    expect(
      out[0]?.evidence.map((e) => ({ channel: e.channel, sourceIndex: e.sourceIndex })),
    ).toEqual([
      { channel: 'search', sourceIndex: 0 },
      { channel: 'search', sourceIndex: 1 },
    ]);
  });

  it('détection MIXTE (comment + recherche, même label) : canaux distincts, index PROPRE à chaque liste', () => {
    // Le point dur que l'ancien `comment:0` / `search:0` protégeait par un PRÉFIXE : deux items
    // d'index source 0 sur deux canaux ne doivent pas collisionner. La paire le tient nativement.
    const out = d1SensitiveTopics(
      withChannels(
        ['ma dépression me suit depuis des années'], // comment, sourceIndex 0
        ['je cherche un bon psy dans le coin'], // search, sourceIndex 0
      ),
    );
    expect(out).toHaveLength(1); // un seul label (mental_health), les deux canaux agrégés
    expect(
      out[0]?.evidence.map((e) => ({ channel: e.channel, sourceIndex: e.sourceIndex })),
    ).toEqual([
      { channel: 'comment', sourceIndex: 0 },
      { channel: 'search', sourceIndex: 0 },
    ]);
  });
});
