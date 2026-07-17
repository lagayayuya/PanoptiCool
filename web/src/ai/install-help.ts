// Aide « Installer le modèle » (PANO-45) — pensée pour quelqu'un qui n'a JAMAIS ouvert un terminal.
// Deux commandes, identiques sur les deux OS à la ligne d'installation près ; aucun zip à dézipper,
// aucun PATH à bricoler, aucun téléchargement manuel : `llama-server -hf <dépôt>:<quant>` va chercher
// le GGUF sur Hugging Face tout seul.
//
// Méthodes VÉRIFIÉES en source primaire (juillet 2026), pas devinées :
//   - macOS   : `brew install llama.cpp` — voie documentée par llama.cpp (`docs/install.md`).
//   - Windows : `winget install --id ggml.llamacpp --exact` — package OFFICIEL (manifests publiés
//     dans microsoft/winget-pkgs sous `manifests/g/ggml/llamacpp/`, éditeur `ggml`) ; winget est
//     préinstallé sur Windows 11 et sur les Windows 10 à jour. Repli si le build winget pose
//     problème : les binaires officiels des releases GitHub (`llama-<build>-bin-win-cpu-x64.zip`,
//     ou la variante `vulkan` si le PC a un GPU) — plus manuel, donc pas la voie proposée par défaut.
//   - `-hf` : flag documenté (tools/server/README.md), suffixe `:quant` insensible à la casse.
//
// Modèles recommandés (décision yuya, benchmark 12/07), du meilleur au plus léger. Le plus lourd tient
// dans ~2,2 Go : le facteur limitant est la RAM/VRAM de la machine, pas le disque.

export type Os = 'macos' | 'windows' | 'other';

export interface ModelChoice {
  /** Suffixe de quantification, tel qu'il s'écrit derrière `-hf <dépôt>:` */
  quant: string;
  /** Nom exact du fichier GGUF (téléchargement manuel — repli). */
  file: string;
  sizeGb: string;
  note?: string;
}

const MODEL_REPO = 'unsloth/Ministral-3-3B-Instruct-2512-GGUF';

export const MODEL_CHOICES: ModelChoice[] = [
  {
    quant: 'UD-Q4_K_XL',
    file: 'Ministral-3-3B-Instruct-2512-UD-Q4_K_XL.gguf',
    sizeGb: '2,2 Go',
    note: 'recommandé',
  },
  { quant: 'IQ4_XS', file: 'Ministral-3-3B-Instruct-2512-IQ4_XS.gguf', sizeGb: '2,0 Go' },
  { quant: 'UD-Q3_K_XL', file: 'Ministral-3-3B-Instruct-2512-UD-Q3_K_XL.gguf', sizeGb: '1,9 Go' },
  {
    quant: 'UD-Q2_K_XL',
    file: 'Ministral-3-3B-Instruct-2512-UD-Q2_K_XL.gguf',
    sizeGb: '1,5 Go',
    note: 'limite, mais fonctionnel',
  },
];

/** Fenêtre de contexte demandée au serveur — repli si `/props` ne la donne pas (voir llama-client),
 * et valeur de départ de `serveCommand`. Au runtime, `/props` fait toujours foi. */
export const DEFAULT_CONTEXT_WINDOW = 8192;
const SERVER_PORT = 8080;

/** Détection d'OS best-effort — sert UNIQUEMENT à montrer la bonne commande d'abord ; l'autre reste
 * accessible (repli `other` : les deux). Aucune conséquence fonctionnelle en cas d'erreur. */
export function detectOs(userAgent: string): Os {
  const ua = userAgent.toLowerCase();
  if (ua.includes('mac os') || ua.includes('macintosh')) return 'macos';
  if (ua.includes('windows')) return 'windows';
  return 'other';
}

export function installCommand(os: Os): string {
  return os === 'windows' ? 'winget install --id ggml.llamacpp --exact' : 'brew install llama.cpp';
}

/** La commande qui lance le serveur : télécharge le modèle au premier appel, puis le sert en local. */
export function serveCommand(
  choice: ModelChoice,
  contextWindow: number = DEFAULT_CONTEXT_WINDOW,
): string {
  return `llama-server -hf ${MODEL_REPO}:${choice.quant} -c ${contextWindow} --port ${SERVER_PORT}`;
}

export function serverUrl(): string {
  return `http://localhost:${SERVER_PORT}`;
}
