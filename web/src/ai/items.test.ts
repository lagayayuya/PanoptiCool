import { describe, expect, it } from 'vitest';
import { buildSyntheticExportZip } from '../demo/synthetic-export';
import { ingestExportStreaming } from '../engine/ingest/ingest-stream';
import {
  detectOs,
  installCommand,
  localSiteCommand,
  MODEL_CHOICES,
  type ModelChoice,
  SITE_ZIP_NAME,
  serveCommand,
} from './install-help';
import { countAiItems, extractAiItems } from './items';

/** End to end on the demo's synthetic fixture — same path as the page: zip → ingestion →
 * items. No real export enters here (privacy invariant, CLAUDE.md). */
function itemsFromSyntheticExport() {
  const ingested = ingestExportStreaming(buildSyntheticExportZip());
  if (!ingested.ok) throw new Error(`ingestion du zip synthétique impossible : ${ingested.stage}`);
  return extractAiItems(ingested.normalized);
}

describe('extractAiItems', () => {
  it('extracts the two channels of the demo zip, sorted by date, contiguous indexes', () => {
    const items = itemsFromSyntheticExport();
    const counts = countAiItems(items);

    expect(counts.comments).toBeGreaterThan(0);
    expect(counts.searches).toBeGreaterThan(0);
    expect(items.map((i) => i.index)).toEqual(items.map((_, i) => i));

    const epochs = items.map((i) => i.epoch ?? Number.NEGATIVE_INFINITY);
    expect([...epochs].sort((a, b) => a - b)).toEqual(epochs);
  });

  it('emits only non-empty text', () => {
    expect(itemsFromSyntheticExport().every((i) => i.text.trim().length > 0)).toBe(true);
  });
});

describe('install-help', () => {
  it('detects the OS to preselect the right system button', () => {
    expect(detectOs('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')).toBe('macos');
    expect(detectOs('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')).toBe('windows');
    expect(detectOs('Mozilla/5.0 (X11; Linux x86_64)')).toBe('linux');
    // Mute UA → macOS fallback (a button must be preselected; correctable with one click).
    expect(detectOs('Node.js/22')).toBe('macos');
  });

  it('installs via winget on Windows, via brew elsewhere (verified official methods)', () => {
    expect(installCommand('windows')).toBe('winget install --id ggml.llamacpp --exact');
    expect(installCommand('macos')).toBe('brew install llama.cpp');
    expect(installCommand('linux')).toBe('brew install llama.cpp');
  });

  it('the launch command downloads the model itself (-hf) and serves on the expected port', () => {
    const command = serveCommand(MODEL_CHOICES[0] as ModelChoice);
    expect(command).toContain('-hf unsloth/Ministral-3-3B-Instruct-2512-GGUF:UD-Q4_K_XL');
    expect(command).toContain('--port 8080');
    expect(command).toContain('-c 8192');
  });

  it('the route B command unzips the build zip and serves the site with the model (--path)', () => {
    const mac = localSiteCommand('macos', MODEL_CHOICES[0] as ModelChoice);
    expect(mac).toContain(`unzip -q ${SITE_ZIP_NAME}`);
    expect(mac).toContain('--path ~/Downloads/pano-local');
    expect(mac).toContain('--port 8080');
    // Windows goes through PowerShell: Expand-Archive and backslashes, not unzip.
    const win = localSiteCommand('windows', MODEL_CHOICES[0] as ModelChoice);
    expect(win).toContain(`Expand-Archive ${SITE_ZIP_NAME}`);
    expect(win).toContain('--path ~\\Downloads\\pano-local');
  });
});
