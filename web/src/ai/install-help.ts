// Aide « Installer » (PANO-45) — pensée pour quelqu'un qui n'a JAMAIS ouvert un terminal.
// Deux commandes, identiques sur les trois OS à la ligne d'installation près ; aucun PATH à
// bricoler, aucun téléchargement manuel : `llama-server -hf <dépôt>:<quant>` va chercher le GGUF
// sur Hugging Face tout seul.
//
// Méthodes VÉRIFIÉES en source primaire (juillet 2026), pas devinées :
//   - macOS / Linux : `brew install llama.cpp` — voie documentée par llama.cpp (`docs/install.md`).
//   - Windows : `winget install --id ggml.llamacpp --exact` — package OFFICIEL (manifests publiés
//     dans microsoft/winget-pkgs sous `manifests/g/ggml/llamacpp/`, éditeur `ggml`) ; winget est
//     préinstallé sur Windows 11 et sur les Windows 10 à jour. Repli si le build winget pose
//     problème : les binaires officiels des releases GitHub (`llama-<build>-bin-win-cpu-x64.zip`,
//     ou la variante `vulkan` si le PC a un GPU) — plus manuel, donc pas la voie proposée par défaut.
//   - `-hf` : flag documenté (tools/server/README.md), suffixe `:quant` insensible à la casse.
//
// Modèles recommandés (décision yuya, benchmark 12/07), du meilleur au plus léger. Le plus lourd tient
// dans ~2,2 Go : le facteur limitant est la RAM/VRAM de la machine, pas le disque.

export type Os = 'macos' | 'windows' | 'linux';

export interface ModelChoice {
  /** Suffixe de quantification, tel qu'il s'écrit derrière `-hf <dépôt>:` */
  quant: string;
  /** Nom exact du fichier GGUF (téléchargement manuel — repli). */
  file: string;
  /** Taille en Go, NOMBRE — jamais « 2,2 Go ». Une virgule décimale figée dans une table de
   * données est un nombre déguisé en français : elle échappe au formatage centralisé, et se met
   * donc à diverger de tous les autres nombres de l'écran. Le rendu passe par `ui/format.ts`. */
  sizeGb: number;
  /** CLÉ, pas la phrase : le texte affiché vit dans le catalogue d'interface (`ui/copy.ts`), qui
   * est le fichier ratifiable. Ce module décrit des modèles, il ne parle pas à l'utilisateur.
   * En prime, la couleur du badge se choisit désormais sur un identifiant et non sur une
   * comparaison à de la prose française. */
  note?: 'recommended' | 'borderline';
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
  {
    quant: 'UD-Q2_K_XL',
    file: 'Ministral-3-3B-Instruct-2512-UD-Q2_K_XL.gguf',
    sizeGb: 1.5,
    note: 'borderline',
  },
];

/** Fenêtre de contexte demandée au serveur — repli si `/props` ne la donne pas (voir llama-client),
 * et valeur de départ de `serveCommand`. Au runtime, `/props` fait toujours foi. */
export const DEFAULT_CONTEXT_WINDOW = 8192;
const SERVER_PORT = 8080;

/** Détection d'OS best-effort — sert UNIQUEMENT à présélectionner un des trois boutons de système
 * (maquette v4) ; la personne peut toujours corriger à la main. Repli `macos` quand l'UA ne dit
 * rien : il faut bien présélectionner quelque chose, et la commande `brew` vaut aussi pour Linux. */
export function detectOs(userAgent: string): Os {
  const ua = userAgent.toLowerCase();
  if (ua.includes('windows')) return 'windows';
  if (ua.includes('linux') || ua.includes('x11')) return 'linux';
  return 'macos';
}

/** Homebrew existe aussi sur Linux (voie documentée par llama.cpp) : même commande que macOS. */
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

/** Nom de l'archive du site, générée à CHAQUE build depuis `dist/` (`scripts/build-site-zip.mjs`).
 * Le lien de la route B pointe dessus — un nom écrit deux fois divergerait. */
export const SITE_ZIP_NAME = 'panopticool-site.zip';

/**
 * Route B « Tout sur ta machine » (ADR-0006, décision 5) : servir le site depuis `localhost`
 * supprime l'écart origine/cible dans les trois moteurs — ce n'est pas un contournement, c'est la
 * suppression du problème. `llama-server --path` sert les fichiers statiques du site ET l'API du
 * modèle sur le même port : une seule commande, ni `git` ni Node.
 *
 * (L'objection historique contre une archive téléchargeable — un canal qui se périmerait face au
 * site en ligne — est levée depuis que le zip est un artefact de build : même build, même contenu.)
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
