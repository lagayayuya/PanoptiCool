// Quel navigateur regarde la page — pour choisir QUELLES instructions montrer d'abord.
//
// ADR-0006 : l'accès d'un site HTTPS au serveur local dépend du MOTEUR du navigateur, et les trois
// moteurs ne sont pas trois degrés d'un même problème — Firefox demande la permission tout seul,
// Chromium l'exige sans jamais la proposer, WebKit ne peut pas marcher. L'interface a donc trois
// discours possibles, et ce module dit lequel tenir.
//
// ─── CE QUE CE MODULE NE COUVRE PAS ─────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md : un mécanisme déclare sa frontière.
//   - L'USER-AGENT EST DÉCLARATIF. Un navigateur peut se travestir (réglages anti-empreinte,
//     forks exotiques) : ce module choisit des INSTRUCTIONS à afficher, jamais un comportement de
//     sécurité. La vérité sur la permission reste `local-network.ts`, lue au moment de l'échec ;
//   - `unknown` N'EST PAS UN VERDICT. Un moteur non reconnu n'est ni compatible ni bloqué — c'est
//     le cas où l'interface ne nomme aucune cause (ADR-0006, décision 4) ;
//   - IL NE DÉTECTE PAS LES VERSIONS. La permission « réseau local » de Chromium date de
//     Chrome 142 : un Chromium plus ancien joint localhost sans rien demander, et tombe ici dans
//     le même discours que les récents — l'instruction du cadenas y est simplement sans objet.

/** Le MOTEUR, seule dimension qui décide du discours (ADR-0006). */
export type BrowserEngine = 'chromium' | 'firefox' | 'webkit' | 'unknown';

export interface BrowserInfo {
  /** Nom à afficher (« Brave », « Safari »…) — `null` quand l'UA ne dit rien d'exploitable ;
   * l'interface retombe alors sur « ton navigateur » (catalogue). */
  name: string | null;
  engine: BrowserEngine;
}

/**
 * Détection best-effort depuis l'user-agent. `hasBraveApi` vient de `'brave' in navigator` :
 * Brave se déclare Chrome dans son UA, seule son API le nomme.
 *
 * L'ordre des tests suit la spécificité des marqueurs : les navigateurs Chromium embarquent tous
 * `Chrome/`, et Safari est le seul à porter `Safari/` SANS `Chrome/`.
 */
export function detectBrowser(userAgent: string, hasBraveApi: boolean): BrowserInfo {
  if (hasBraveApi) return { name: 'Brave', engine: 'chromium' };
  if (userAgent.includes('Firefox/')) return { name: 'Firefox', engine: 'firefox' };
  if (userAgent.includes('Edg/')) return { name: 'Edge', engine: 'chromium' };
  if (userAgent.includes('OPR/')) return { name: 'Opera', engine: 'chromium' };
  if (userAgent.includes('Chrome/')) return { name: 'Chrome', engine: 'chromium' };
  if (userAgent.includes('Safari/')) return { name: 'Safari', engine: 'webkit' };
  return { name: null, engine: 'unknown' };
}
