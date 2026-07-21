// Ce que le navigateur laisse passer vers `localhost` — la question que `fetch` refuse de répondre.
//
// POURQUOI CE MODULE EXISTE. Un `fetch` vers le serveur local échoue avec `TypeError: Failed to
// fetch`, et cette chaîne est RIGOUREUSEMENT LA MÊME que le serveur soit absent ou que le
// navigateur ait bloqué la requête (mesuré : port mort, IP inaccessible et blocage réel rendent
// des octets identiques). La console du navigateur, elle, sait exactement ce qui s'est passé — mais
// rien de tout ça n'est lisible depuis le script. Le produit affirmait donc « serveur non détecté »
// à quelqu'un dont le serveur tournait.
//
// La permission, elle, se lit SANS toucher au réseau. C'est le seul angle par lequel un script
// peut distinguer « pas de serveur » de « le navigateur a refusé » (ADR-0006).
//
// ─── CE QUE CE MODULE NE COUVRE PAS ─────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md : un mécanisme de preuve déclare sa frontière.
//   - IL NE SONDE PAS LE SERVEUR. Il dit ce que le navigateur autorise, jamais si quelque chose
//     écoute au bout. Les deux se combinent chez l'appelant ;
//   - `unknown` NE VEUT PAS DIRE « autorisé ». Il veut dire que ce navigateur ne connaît pas cette
//     permission, donc qu'on ne peut RIEN conclure — ni dans un sens ni dans l'autre. Un navigateur
//     qui bloque par une autre voie (contrôle de contenu mixte, sans permission à accorder) tombe
//     ici, et l'interface doit alors proposer les deux issues plutôt que d'en deviner une ;
//   - IL NE DIT PAS COMMENT DÉBLOQUER. Le chemin exact (réglage, menu, commande) dépend du
//     navigateur et vit dans la copy, pas ici.

/**
 * Ce que le navigateur autorise vers l'espace d'adressage local.
 *
 * `blocked` réunit VOLONTAIREMENT les états `prompt` et `denied` de l'API. Ce n'est pas un
 * raccourci : sur les navigateurs Chromium mesurés, `prompt` ne se résout jamais de lui-même —
 * aucune fenêtre ne s'ouvre, même derrière un vrai clic, et la permission reste indéfiniment dans
 * cet état (ADR-0006). Un `prompt` qui n'aboutit pas est un blocage du point de vue de la personne
 * devant l'écran, et c'est ce point de vue que l'interface doit servir.
 */
export type LocalNetworkGate = 'granted' | 'blocked' | 'unknown';

/** Nom de la permission (spécification Local Network Access). Absent des navigateurs qui
 * n'implémentent pas LNA — leur `query` rejette alors, ce qui est le chemin `unknown`. */
const PERMISSION_NAME = 'local-network-access';

/**
 * Lit la permission « réseau local » SANS émettre la moindre requête.
 *
 * Ne lève jamais : tout ce qui n'est pas une réponse exploitable devient `unknown`, parce qu'un
 * appelant qui doit choisir une phrase à afficher n'a rien à faire d'une exception.
 */
export async function localNetworkGate(): Promise<LocalNetworkGate> {
  // `navigator.permissions` manque à des contextes entiers (navigateurs anciens, certains Workers) —
  // l'accès optionnel évite d'en faire une exception à rattraper.
  const permissions = globalThis.navigator?.permissions;
  if (permissions === undefined) return 'unknown';
  try {
    // Le nom n'est pas dans le `PermissionName` de la lib TS : la spec LNA est plus récente que les
    // types embarqués. Le cast porte sur le NOM SEUL, et le `catch` couvre précisément le cas où le
    // navigateur ne le reconnaît pas.
    const status = await permissions.query({ name: PERMISSION_NAME as PermissionName });
    return status.state === 'granted' ? 'granted' : 'blocked';
  } catch {
    return 'unknown';
  }
}
