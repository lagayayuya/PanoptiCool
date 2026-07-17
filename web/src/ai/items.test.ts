import { describe, expect, it } from 'vitest';
import { buildSyntheticExportZip } from '../demo/synthetic-export';
import { ingestExportStreaming } from '../engine/ingest/ingest-stream';
import {
  detectOs,
  installCommand,
  MODEL_CHOICES,
  type ModelChoice,
  serveCommand,
} from './install-help';
import { countAiItems, extractAiItems } from './items';

/** Bout en bout sur la fixture synthétique de la démo — même chemin que la page : zip → ingestion →
 * items. Aucun vrai export n'entre ici (invariant de privacy, CLAUDE.md). */
function itemsFromSyntheticExport() {
  const ingested = ingestExportStreaming(buildSyntheticExportZip());
  if (!ingested.ok) throw new Error(`ingestion du zip synthétique impossible : ${ingested.stage}`);
  return extractAiItems(ingested.normalized);
}

describe('extractAiItems', () => {
  it('extrait les deux canaux du zip de démo, triés par date, index contigus', () => {
    const items = itemsFromSyntheticExport();
    const counts = countAiItems(items);

    expect(counts.comments).toBeGreaterThan(0);
    expect(counts.searches).toBeGreaterThan(0);
    expect(items.map((i) => i.index)).toEqual(items.map((_, i) => i));

    const epochs = items.map((i) => i.epoch ?? Number.NEGATIVE_INFINITY);
    expect([...epochs].sort((a, b) => a - b)).toEqual(epochs);
  });

  it("n'émet que du texte non vide", () => {
    expect(itemsFromSyntheticExport().every((i) => i.text.trim().length > 0)).toBe(true);
  });
});

describe('install-help', () => {
  it("détecte l'OS pour proposer la bonne commande d'installation", () => {
    expect(detectOs('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')).toBe('macos');
    expect(detectOs('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('windows');
    expect(detectOs('Mozilla/5.0 (X11; Linux x86_64)')).toBe('other');
  });

  it('installe par winget sous Windows, par brew ailleurs (méthodes officielles vérifiées)', () => {
    expect(installCommand('windows')).toBe('winget install --id ggml.llamacpp --exact');
    expect(installCommand('macos')).toBe('brew install llama.cpp');
  });

  it('la commande de lancement télécharge le modèle elle-même (-hf) et sert sur le port attendu', () => {
    const command = serveCommand(MODEL_CHOICES[0] as ModelChoice);
    expect(command).toContain('-hf unsloth/Ministral-3-3B-Instruct-2512-GGUF:UD-Q4_K_XL');
    expect(command).toContain('--port 8080');
    expect(command).toContain('-c 8192');
  });
});
