// Golden tests de forme (PANO-28) : de VRAIS zips synthétiques (sortie du générateur PANO-11,
// committés sous samples/, reproductibles, zéro-PII) passés dans le pipeline réel (PANO-27).
//
// But : prouver que la PLOMBERIE (parse → validate → analyse → `Analysis`) tient sur des entrées
// réalistes, conformes ET adverses (`--empty` / `--absent`). C'est le test qui confronte le schéma
// valibot (PANO-26) à la vraie sortie générateur : un schéma trop strict (la non-garantie nommée du
// pont PANO-26) se révèle ICI.
//
// PORTÉ À LA REFONTE A. Ce fichier est le golden du MOTEUR — à ne pas confondre avec le golden de
// RENDU de bout en bout (zip → ingestion → règles → rendu, persona incluse), qui est un autre
// fichier et qui, lui, exerce D1/D2. Trois verrous sont SUPPRIMÉS, un est CORRIGÉ :
//   - `schemaVersion` et le magasin `evidence: []` partent avec `EngineOutput` : le moteur rend
//     `Analysis`, une valeur nommée, et une preuve est référencée directement (ADR-0004) ;
//   - « toute sortie passe `assertInsight` » est SANS OBJET : ce filet dev-only vérifiait à
//     l'exécution la forme d'une union `Insight` hétérogène. Chaque champ ayant désormais un type
//     propre, le compilateur tient ce qu'`assertInsight` rattrapait. `assert.ts` a disparu ;
//   - le golden de dérive `themes: undefined` (« pas encore câblé ; doit devenir un `toEqual`
//     non-vide quand S2 aura couru ») est CORRIGÉ, et sa prédiction était FAUSSE : S2 a couru, et
//     ces zips ne produisent TOUJOURS aucun thème ni signal. Pas faute de câblage — faute de texte :
//     le générateur ne fabrique pas de commentaires qui touchent les lexiques réels. Le verrou est
//     donc traduit en ce qu'il mesure VRAIMENT (cf. le `it` dédié ci-dessous) : ces samples testent
//     la PLOMBERIE, et le cœur n'est exercé que par la persona du golden de rendu.

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseTikTokExport } from './parse';
import { processExport } from './pipeline';
import { validTikTokExport } from './valid-export.fixture';
import { validateTikTokExport } from './validate';

const BASELINE = 'user_data_tiktok.sample.zip';
const EMPTY = 'user_data_tiktok.empty.zip'; // --empty 'Your Activity/Searches' (SearchList → null)
const ABSENT = 'user_data_tiktok.absent.zip'; // --absent 'Your Activity/Searches' (clé omise)

/** Lit un zip golden de `samples/` (racine du dépôt, hors web/). */
function readSample(name: string): Uint8Array {
  return new Uint8Array(readFileSync(new URL(`../../../samples/${name}`, import.meta.url)));
}

/** Cast utilitaire pour lire/muter une donnée `unknown` dans les tests, sans `any`. */
function obj(x: unknown): Record<string, unknown> {
  return x as Record<string, unknown>;
}

describe('golden — pipeline sur la sortie générateur (PANO-11)', () => {
  it('baseline réaliste → ok, et une Analysis réellement peuplée (≠ stub moteur-vide)', () => {
    const res = processExport(readSample(BASELINE));
    expect(res.ok).toBe(true);
    if (res.ok) {
      // Les producteurs qui lisent des COMPTES tournent sur ce zip : il porte de l'activité.
      expect(res.output.rhythm).toBeDefined();
      expect(res.output.opacity).toBeDefined();
      expect(Object.keys(res.output.volumes).length).toBeGreaterThan(0);

      // Rythme : FORME time-INDÉPENDANTE seulement (le baseline tourne sur `Date.now()` — une
      // assertion sur une fenêtre glissante pourrirait avec l'horloge). Invariant : 24 compteurs
      // horaires, et chaque vidéo datée bucketée une fois (somme = taille de VideoList — les dates
      // du sample committé parsent toutes).
      const parsedBaseline = parseTikTokExport(readSample(BASELINE));
      const videoCount =
        parsedBaseline.ok &&
        Array.isArray(
          obj(obj(obj(parsedBaseline.data)['Your Activity'])['Watch History']).VideoList,
        )
          ? (
              obj(obj(obj(parsedBaseline.data)['Your Activity'])['Watch History'])
                .VideoList as unknown[]
            ).length
          : 0;
      expect(res.output.rhythm?.hourlyActivity).toHaveLength(24);
      expect(res.output.rhythm?.hourlyActivity.reduce((a, b) => a + b, 0)).toBe(videoCount);
    }
  });

  it('golden de dérive : ces samples n’exercent NI D1 NI D2 — la plomberie, pas le cœur', () => {
    // Ce qui remplace `themes: undefined` (« pas encore câblé »). D1/D2 sont câblés depuis, et ces
    // zips restent muets : le générateur PANO-11 fabrique des STRUCTURES réalistes, pas des textes
    // qui touchent les lexiques. Le nommer plutôt que le laisser croire couvert est le point :
    //   - le CŒUR (détection, éventails, termes-déclencheurs, C5) n'est exercé que par la persona du
    //     GOLDEN DE RENDU de bout en bout — d'où sa présence à dessein dans ce golden-là ;
    //   - l'exhaustivité des ~110 clés de lexique est tenue par `d1/d2-wording-coverage.test.ts`,
    //     et par rien d'autre.
    // Si ce test vire au rouge, ce n'est pas une régression : c'est que les samples se sont mis à
    // porter du texte porteur — bonne nouvelle à constater, pas à masquer.
    const res = processExport(readSample(BASELINE));
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.output.themes).toEqual([]);
      expect(res.output.signals).toEqual([]);
    }
  });

  it('--empty (section peuplée forcée à vide) → ok, et la section porte son encodage `null`', () => {
    const res = processExport(readSample(EMPTY));
    expect(res.ok).toBe(true);
    // Assertion d'ENCODAGE (pas juste ok) : Searches/SearchList a son encodage de vide `null` (§4).
    const parsed = parseTikTokExport(readSample(EMPTY));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const searches = obj(obj(obj(parsed.data)['Your Activity']).Searches);
      expect(searches.SearchList).toBeNull();
    }
  });

  it('--absent (clé de section omise) → ok:false, stage validate (vide ≠ absent), pas un crash', () => {
    const res = processExport(readSample(ABSENT));
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.stage).toBe('validate');
  });

  it('baseline trop gros (seuil minuscule) → stage too_large distinct de parse (boucle PANO-25/27)', () => {
    const res = processExport(readSample(BASELINE), { sizeLimitBytes: 10 });
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.stage).toBe('too_large');
  });
});

describe('golden — couverture des trois encodages de vide (§1.2) sur le baseline', () => {
  it('le baseline porte les trois encodages null / [] / {} (et valide)', () => {
    const parsed = parseTikTokExport(readSample(BASELINE));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const data = obj(parsed.data);
    // NULL : Income+ Wallet → Transaction History → TransactionsList
    expect(obj(obj(data['Income+ Wallet'])['Transaction History']).TransactionsList).toBeNull();
    // [] : Likes and Favorites → Favorite Comment → FavoriteCommentList
    const lf = obj(data['Likes and Favorites']);
    expect(obj(lf['Favorite Comment']).FavoriteCommentList).toEqual([]);
    // {} : Likes and Favorites → Collection
    expect(lf.Collection).toEqual({});
    // Section CHANGÉE (NullableList<SearchItem>) : peuplée (array) sur le baseline ; la branche
    // vide (null) est couverte par le test --empty → les deux branches exercées sur de vrais zips.
    expect(Array.isArray(obj(obj(data['Your Activity']).Searches).SearchList)).toBe(true);
  });
});

describe('golden — négatifs : le schéma DISTINGUE les encodages (non-vacuité)', () => {
  // NB : pour les sections « Unverified » à encodage `null` (typées `unknown[] | null`), le schéma
  // accepte à la fois `null` ET `[]` — looseness `valibot ⊇ contrat` assumée (PANO-26). Les négatifs
  // ci-dessous testent donc les distinctions RÉELLES (array vs object vs null là où le type est précis),
  // pas la distinction null↔[] (acceptée par design).

  it('section `[]` reçoit `null` → rejet', () => {
    const data = obj(validTikTokExport());
    obj(obj(data['Likes and Favorites'])['Favorite Comment']).FavoriteCommentList = null;
    expect(validateTikTokExport(data).ok).toBe(false);
  });

  it('section liste précise reçoit `{}` → rejet', () => {
    const data = obj(validTikTokExport());
    obj(obj(data.Comment).Comments).CommentsList = {};
    expect(validateTikTokExport(data).ok).toBe(false);
  });

  it('section `null` reçoit `{}` → rejet', () => {
    const data = obj(validTikTokExport());
    obj(obj(data['Income+ Wallet'])['Transaction History']).TransactionsList = {};
    expect(validateTikTokExport(data).ok).toBe(false);
  });
});
