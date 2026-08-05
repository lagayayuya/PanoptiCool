// "Install" help (PANO-45) — designed for someone who has NEVER opened a terminal.
// Two commands, identical across the three OSes except for the install line; no PATH to
// fiddle with, no manual download: `llama-server -hf <repo>:<quant>` fetches the GGUF
// from Hugging Face on its own.
//
// Methods VERIFIED against the primary source (July 2026), not guessed:
//   - macOS / Linux: `brew install llama.cpp` — path documented by llama.cpp (`docs/install.md`).
//   - Windows: `winget install --id ggml.llamacpp --exact` — OFFICIAL package (manifests published
//     in microsoft/winget-pkgs under `manifests/g/ggml/llamacpp/`, publisher `ggml`); winget is
//     preinstalled on Windows 11 and on up-to-date Windows 10. Fallback if the winget build causes
//     trouble: the official binaries from the GitHub releases (`llama-<build>-bin-win-cpu-x64.zip`,
//     or the `vulkan` variant if the PC has a GPU) — more manual, so not the default proposed path.
//   - `-hf`: documented flag (tools/server/README.md), `:quant` suffix case-insensitive.
//
// Recommended models (yuya's decision, benchmark 12/07), from best to lightest. The heaviest fits
// in ~2.2 GB: the limiting factor is the machine's RAM/VRAM, not the disk.

export type Os = 'macos' | 'windows' | 'linux';

export interface ModelChoice {
  /** Quantization suffix, as it is written after `-hf <repo>:` */
  quant: string;
  /** Exact name of the GGUF file (manual download — fallback). */
  file: string;
  /** Size in GB, a NUMBER — never « 2,2 Go ». A decimal comma frozen into a data table
   * is a number disguised as French: it escapes the centralized formatting, and thus starts
   * to diverge from every other number on the screen. The rendering goes through `ui/format.ts`. */
  sizeGb: number;
  /** A KEY, not the sentence: the displayed text lives in the interface catalog (`ui/copy.ts`), which
   * is the ratifiable file. This module describes models, it does not speak to the user.
   * As a bonus, the badge color is now chosen on an identifier and not on a
   * comparison against French prose. */
  /** ⚠ ONE VARIANT. `'borderline'` went with UD-Q2_K_XL on 2026-08-03 — a note nothing carries is
   *  a note nobody reads, and it had a ratified string per language behind it. It comes back with
   *  the model that needs it, ratified again. */
  note?: 'recommended';
}

const MODEL_REPO = 'unsloth/Ministral-3-3B-Instruct-2512-GGUF';

export const MODEL_CHOICES: ModelChoice[] = [
  {
    quant: 'UD-Q4_K_XL',
    file: 'Ministral-3-3B-Instruct-2512-UD-Q4_K_XL.gguf',
    sizeGb: 2.2,
    note: 'recommended',
  },
  { quant: 'IQ4_XS', file: 'Ministral-3-3B-Instruct-2512-IQ4_XS.gguf', sizeGb: 2.0 },
  { quant: 'UD-Q3_K_XL', file: 'Ministral-3-3B-Instruct-2512-UD-Q3_K_XL.gguf', sizeGb: 1.9 },
];

/* ⚠ UD-Q2_K_XL (1.5 GB) WAS REMOVED on 2026-08-02, yuya's decision: two-bit compression cost more
   in quality than it gained in memory, on a page whose whole object is to show what a model
   DEDUCES. The floor is UD-Q3_K_XL. Applied to both connectors on 2026-08-03 — the reason is the
   page's purpose, which the Instagram piece shares. */

/** Context window requested from the server — fallback if `/props` does not give it (see llama-client),
 * and the starting value of `serveCommand`. At runtime, `/props` always prevails. */
export const DEFAULT_CONTEXT_WINDOW = 8192;

/**
 * Context window PROPOSED in the launch command (yuya's decision, 2026-08-02).
 *
 * It was 32 768. Too high: the window is allocated at RESERVATION, not as it fills — so an ordinary
 * machine held four times the memory permanently for a prompt that used a quarter of it. A
 * just-sufficient machine could not start the server at all, and the failure landed at launch, far
 * from the page that had suggested the value.
 *
 * 8 704 = 8.5 × 1024. The granularity is not a flourish: it is the unit llama.cpp cuts its cache
 * into, and a round decimal would be rounded there without saying so. Sampling targets ~65 % of this
 * window, the rest being kept for the answer.
 *
 * At runtime `/props` — the server's real window — always prevails: this value decides nothing, it
 * proposes a command.
 */
export const SUGGESTED_CONTEXT = 8704;

/** Is the page served from the local loopback? Then no browser permission is in play at all. */
export function isLocalOrigin(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]';
}
const SERVER_PORT = 8080;

/** Best-effort OS detection — used ONLY to preselect one of the three system buttons
 * (v4 mockup); the person can always correct it by hand. Fallback `macos` when the UA says
 * nothing: something must be preselected, and the `brew` command also works for Linux. */
export function detectOs(userAgent: string): Os {
  const ua = userAgent.toLowerCase();
  if (ua.includes('windows')) return 'windows';
  if (ua.includes('linux') || ua.includes('x11')) return 'linux';
  return 'macos';
}

/** Homebrew also exists on Linux (path documented by llama.cpp): same command as macOS. */
export function installCommand(os: Os): string {
  return os === 'windows' ? 'winget install --id ggml.llamacpp --exact' : 'brew install llama.cpp';
}

/** The command that launches the server: downloads the model on the first call, then serves it locally. */
export function serveCommand(
  choice: ModelChoice,
  contextWindow: number = DEFAULT_CONTEXT_WINDOW,
): string {
  return `llama-server -hf ${MODEL_REPO}:${choice.quant} -c ${contextWindow} --port ${SERVER_PORT}`;
}

export function serverUrl(): string {
  return `http://localhost:${SERVER_PORT}`;
}

/** Name of the site archive, generated at EACH build from `dist/` by the `siteZip` Astro
 * integration. Route B's link points at it — a name written twice would drift. */
export const SITE_ZIP_NAME = 'panopticool-site.zip';

/**
 * Route B "Everything on your device" (ADR-0006, decision 5): serving the site from `localhost`
 * removes the origin/target gap in all three engines — it is not a workaround, it is the
 * removal of the problem. `llama-server --path` serves the site's static files AND the model's API
 * on the same port: a single command, neither `git` nor Node.
 *
 * (The historical objection against a downloadable archive — a channel that would go stale against
 * the online site — is lifted since the zip is a build artifact: same build, same content.)
 */
export function localSiteCommand(
  os: Os,
  choice: ModelChoice,
  contextWindow: number = DEFAULT_CONTEXT_WINDOW,
): string {
  const serve = `llama-server -hf ${MODEL_REPO}:${choice.quant} -c ${contextWindow} --port ${SERVER_PORT}`;
  return os === 'windows'
    ? `cd ~\\Downloads; Expand-Archive ${SITE_ZIP_NAME} pano-local; ${serve} --path ~\\Downloads\\pano-local`
    : `cd ~/Downloads && unzip -q ${SITE_ZIP_NAME} -d pano-local && ${serve} --path ~/Downloads/pano-local`;
}
