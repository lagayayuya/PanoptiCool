// Pipeline de parsing — approche A (PANO-25, ADR-0002, findings PANO-5).
//
// Décompresse l'export `.zip` en mémoire (`fflate`), localise l'unique `user_data_tiktok.json`,
// puis `JSON.parse`. Conçu pour tourner dans le Web Worker (TS pur, sans DOM, ADR-0002).
//
// SEAM (a) — décidé en session PANO-25 : le parser rend `data: unknown`. La validation
// `unknown → TikTokExport` est le job de PANO-26 (valibot) à la frontière d'ingest. Caster ici
// mentirait au type (l'entrée est non fiable), contre strict++/`noUncheckedIndexedAccess`.
//
// ÉCHECS BRUYANTS (critère 1) : aucune exception ne traverse la frontière — chaque échec est une
// variante de `ParseResult` (union discriminée, sérialisable structured-clone). Pas de wording
// dans le moteur (ADR-0004) : la variante porte un `error` + ses données structurées ; la
// couche de présentation mappe le code vers un message.
//
// LIMITE CONNUE (critère 1, option 1a) : `JSON.parse` natif (approche A) collapse silencieusement
// d'éventuelles clés dupliquées *dans un même objet* (`{"a":1,"a":2}` → `{a:2}`) — le `reviver` ne
// les voit pas. Les détecter exigerait un parseur tokenisant (approche B, hors v1). Le contrat
// `docs/tiktok-export-schema.md` n'a aucun cas du genre ; §1.6 (section dupliquée sous deux parents)
// et §1.7 (clé malformée mais valide) ne sont PAS des doublons d'objet et sont gérés correctement.

import { strFromU8, type UnzipFileInfo, unzipSync } from 'fflate';

/** Nom de l'unique fichier JSON attendu dans l'archive (contrat §0). */
const JSON_ENTRY_NAME = 'user_data_tiktok.json';

/**
 * Seuil de taille **décompressée** (octets) au-delà duquel on refuse gracieusement (critère 2).
 * ~25 Mo = seuil de bascule A→B mesuré par PANO-5 ; au-delà, l'approche A risque l'OOM que
 * l'ADR-0002 veut éviter, et B (SAX) n'est pas implémentée en v1. À confirmer sur devices réels
 * (PANO-18). Réglable ; surchargeable par appel via `ParseOptions.sizeLimitBytes`.
 */
export const EXPORT_SIZE_LIMIT_BYTES = 25 * 1024 * 1024;

/** Codes d'échec du pipeline. */
export type ParseErrorKind =
  | 'invalid_zip'
  | 'json_entry_not_found'
  | 'ambiguous_json_entry'
  | 'export_too_large'
  | 'invalid_json';

/**
 * Résultat du pipeline — union discriminée, plain-data (transférable hors du Worker). Le succès
 * porte `data: unknown` (seam a) ; chaque échec porte son code + les données utiles à l'UI.
 */
export type ParseResult =
  | { ok: true; data: unknown; originalSize: number }
  | { ok: false; error: 'invalid_zip' }
  | { ok: false; error: 'json_entry_not_found' }
  | { ok: false; error: 'ambiguous_json_entry'; candidates: string[] }
  | { ok: false; error: 'export_too_large'; originalSize: number; limit: number }
  | { ok: false; error: 'invalid_json' };

export interface ParseOptions {
  /** Seuil de refus (octets décompressés). Défaut `EXPORT_SIZE_LIMIT_BYTES`. */
  sizeLimitBytes?: number;
}

/** Basename d'un chemin d'entrée zip (séparateur `/`, standard zip). Tolère un préfixe de dossier. */
function basename(path: string): string {
  const slash = path.lastIndexOf('/');
  return slash === -1 ? path : path.slice(slash + 1);
}

/**
 * Résultat de la décompression seule (sans `JSON.parse`) : le texte JSON de l'entrée + sa taille.
 * Union discriminée, réutilisée par le parseur classique (`parseTikTokExport`) ET par l'ingestion en
 * flux (`ingest/ingest-stream.ts`, PANO-91), qui préfère le TEXTE (elle le tokenise sans matérialiser
 * le graphe) à un `JSON.parse` matérialisant.
 */
export type DecompressResult =
  | { ok: true; text: string; originalSize: number }
  | { ok: false; error: 'invalid_zip' }
  | { ok: false; error: 'json_entry_not_found' }
  | { ok: false; error: 'ambiguous_json_entry'; candidates: string[] }
  | { ok: false; error: 'export_too_large'; originalSize: number; limit: number };

/**
 * Décompresse l'export et rend le TEXTE de l'unique `user_data_tiktok.json` (ne parse pas). Étape
 * partagée : le pic mémoire ici est la seule chaîne décompressée (bornée, ~le poids du JSON) — la
 * matérialisation du graphe (approche A) ou son évitement (flux, approche B) se décide APRÈS. Refus
 * gracieux au-delà de `sizeLimitBytes` (garde anti-zip-bomb ; réglable par appel — le flux le relève).
 */
export function decompressJsonEntry(
  zipBytes: Uint8Array,
  options: ParseOptions = {},
): DecompressResult {
  const sizeLimit = options.sizeLimitBytes ?? EXPORT_SIZE_LIMIT_BYTES;

  // Passe 1 — métadonnées seules : le filtre renvoie `false` (aucune décompression), ce qui permet
  // de localiser l'entrée et de lire `originalSize` AVANT de décompresser (critère 2).
  const candidates: { name: string; originalSize: number }[] = [];
  try {
    unzipSync(zipBytes, {
      filter: (file: UnzipFileInfo): boolean => {
        if (basename(file.name) === JSON_ENTRY_NAME) {
          candidates.push({ name: file.name, originalSize: file.originalSize });
        }
        return false;
      },
    });
  } catch {
    return { ok: false, error: 'invalid_zip' };
  }

  if (candidates.length === 0) return { ok: false, error: 'json_entry_not_found' };
  if (candidates.length > 1) {
    return { ok: false, error: 'ambiguous_json_entry', candidates: candidates.map((c) => c.name) };
  }

  const entry = candidates[0];
  if (entry === undefined) return { ok: false, error: 'json_entry_not_found' };

  // Critère 2 — refus gracieux AVANT de décompresser si la taille décompressée dépasse le seuil.
  if (entry.originalSize > sizeLimit) {
    return {
      ok: false,
      error: 'export_too_large',
      originalSize: entry.originalSize,
      limit: sizeLimit,
    };
  }

  // Passe 2 — décompresse la seule entrée retenue.
  let bytes: Uint8Array | undefined;
  try {
    const decoded = unzipSync(zipBytes, {
      filter: (file: UnzipFileInfo) => file.name === entry.name,
    });
    bytes = decoded[entry.name];
  } catch {
    return { ok: false, error: 'invalid_zip' };
  }
  if (bytes === undefined) return { ok: false, error: 'json_entry_not_found' };

  return { ok: true, text: strFromU8(bytes), originalSize: entry.originalSize };
}

/**
 * Décompresse l'export, localise `user_data_tiktok.json`, le parse (approche A, `JSON.parse`). Ne
 * valide PAS la forme (PANO-26). Ne lève jamais : tout échec attendu est une variante de `ParseResult`.
 * L'ingestion du moteur passe désormais par le FLUX (`ingest/`) ; cette fonction reste la voie A de
 * référence (tests de parsing, comparaison mémoire).
 */
export function parseTikTokExport(zipBytes: Uint8Array, options: ParseOptions = {}): ParseResult {
  const decompressed = decompressJsonEntry(zipBytes, options);
  if (!decompressed.ok) {
    return decompressed;
  }

  let data: unknown;
  try {
    data = JSON.parse(decompressed.text);
  } catch {
    return { ok: false, error: 'invalid_json' };
  }

  return { ok: true, data, originalSize: decompressed.originalSize };
}
