// Témoin de la lecture de permission « réseau local ».
//
// POURQUOI CE FICHIER EXISTE, et pourquoi la détection est un MODULE et pas une fermeture dans
// `AiSection` : les goldens rendent des chaînes SANS exécuter le moindre `useEffect` (leur en-tête
// le dit). Une détection vivant dans le composant ne serait donc atteinte par aucun filet — ni
// golden, ni test unitaire. Ici, les quatre chemins se prouvent à l'appel.
//
// ─── CE QUE CE FILET NE COUVRE PAS ──────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md.
//   - IL NE TOUCHE À AUCUN NAVIGATEUR RÉEL. `navigator.permissions` est simulé : ce fichier prouve
//     la TRADUCTION des états en `LocalNetworkGate`, jamais que tel navigateur rend tel état. Ce
//     qu'un navigateur rend RÉELLEMENT est consigné dans ADR-0006, sur mesure manuelle ;
//   - IL NE PROUVE PAS QUE `prompt` NE SE RÉSOUT JAMAIS. C'est une observation de terrain
//     (ADR-0006), pas une propriété que ce fichier peut établir — il fige seulement la DÉCISION
//     qu'on en a tirée : `prompt` compte comme un blocage ;
//   - IL N'ATTEINT PAS L'ÉCRAN. Quelle phrase découle de quel `gate` relève de la copy et des
//     goldens.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { localNetworkGate } from './local-network';

/** Remplace `navigator.permissions` le temps d'un cas. `undefined` simule un contexte qui n'a pas
 * l'API du tout. */
function withPermissions(query: ((d: { name: string }) => Promise<{ state: string }>) | undefined) {
  vi.stubGlobal('navigator', query === undefined ? {} : { permissions: { query } });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('localNetworkGate', () => {
  it('rend `granted` quand le navigateur a accordé la permission', async () => {
    withPermissions(async () => ({ state: 'granted' }));
    await expect(localNetworkGate()).resolves.toBe('granted');
  });

  // Les deux cas qui fondent la décision de produit : `prompt` et `denied` se valent côté écran.
  it('rend `blocked` pour `prompt` — la fenêtre qui ne s’ouvre jamais est un blocage', async () => {
    withPermissions(async () => ({ state: 'prompt' }));
    await expect(localNetworkGate()).resolves.toBe('blocked');
  });

  it('rend `blocked` pour `denied`', async () => {
    withPermissions(async () => ({ state: 'denied' }));
    await expect(localNetworkGate()).resolves.toBe('blocked');
  });

  // ⚠ Ce cas est le chemin des navigateurs SANS Local Network Access. Le zéro-connaissance qu'il
  // encode est le contraire d'une autorisation : c'est ce qui force l'interface à proposer les deux
  // issues au lieu d'en affirmer une. Un jour où ce chemin renverrait `granted` par erreur, le
  // produit se remettrait à dire « serveur non détecté » à quelqu'un dont le serveur tourne.
  it('rend `unknown` quand le navigateur ne connaît pas cette permission', async () => {
    withPermissions(() => Promise.reject(new TypeError('unsupported permission name')));
    await expect(localNetworkGate()).resolves.toBe('unknown');
  });

  it('rend `unknown` quand l’API des permissions est absente', async () => {
    withPermissions(undefined);
    await expect(localNetworkGate()).resolves.toBe('unknown');
  });

  it('ne lève jamais, même si `query` explose de façon inattendue', async () => {
    withPermissions(() => {
      throw new Error('boom');
    });
    await expect(localNetworkGate()).resolves.toBe('unknown');
  });
});
