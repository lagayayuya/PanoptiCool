// Archive du site pour la voie « Tout sur ta machine » (route B de la section IA, ADR-0006 :
// servir le site depuis `localhost` supprime l'écart origine/cible dans les trois moteurs).
//
// POURQUOI UNE INTÉGRATION ASTRO, ET PAS UN SCRIPT `postbuild`. Ce zip a d'abord été produit par
// `astro build && node scripts/build-site-zip.mjs` dans `npm run build`. Le défaut est structurel :
// **rien ne garantit que le build passe par le script npm**. Un hébergeur qui détecte Astro lance
// `astro build` directement, tout comme un `npx astro build` en local — et dans ces cas le zip
// n'était JAMAIS écrit. Le lien de téléchargement de la route B tombait alors en 404 sur le site
// hébergé, sans que rien ne le signale : le build réussissait, la page se construisait, seul le
// fichier manquait. Une intégration se branche sur le build LUI-MÊME (`astro:build:done`) : elle
// tourne quelle que soit la commande qui l'a déclenché.
//
// L'archive reste un ARTEFACT DE BUILD, régénéré depuis la sortie du build : elle ne peut pas se
// périmer face au site en ligne, puisque c'est le même build. C'est ce qui lève l'objection
// historique contre une archive téléchargeable (un canal de distribution à versionner, qui
// divergerait en silence — cf. `src/ai/install-help.ts`).
//
// ─── CE QUE CE MÉCANISME NE COUVRE PAS ──────────────────────────────────────────────────────────
// Obligation de CLAUDE.md : un mécanisme déclare sa frontière.
//   - IL NE TOURNE PAS EN `astro dev`. `astro:build:done` est un hook de BUILD : en développement,
//     `/panopticool-site.zip` n'existe pas et le lien de la route B y est mort. C'est sans
//     conséquence (en dev la page est servie depuis localhost, donc la route B n'a plus d'objet —
//     c'est le mode « Tout est prêt »), mais ça se sait ;
//   - IL NE VERSIONNE RIEN. Le zip n'entre pas dans git (`dist/` est ignoré) : c'est une sortie de
//     build, régénérée à l'identique à chaque build. « Disponible sur le dépôt » veut donc dire
//     « produit par n'importe quel build depuis un clone », pas « committé » ;
//   - IL NE VÉRIFIE PAS LE CONTENU du zip. Il empaquette ce que le build a écrit ; que cette sortie
//     soit correcte relève du build, pas d'ici. La CI vérifie seulement que le fichier EXISTE.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { zipSync } from 'fflate';
// Le nom vit dans `install-help.ts`, qui le compose aussi dans la commande copiable de la route B.
// L'importer ici plutôt que le recopier : deux noms qui divergent, c'est un lien mort.
import { SITE_ZIP_NAME } from '../src/ai/install-help';

/** Tous les fichiers sous `dir`, en chemins ABSOLUS (parcours récursif). */
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

export function siteZip(): AstroIntegration {
  return {
    name: 'panopticool:site-zip',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const files: Record<string, Uint8Array> = {};
        for (const full of walk(outDir)) {
          // Les séparateurs d'une entrée zip sont des `/` sur toutes les plateformes.
          const entry = relative(outDir, full).split(sep).join('/');
          // Un build par-dessus un build ne s'auto-embarque pas.
          if (entry === SITE_ZIP_NAME) continue;
          files[entry] = new Uint8Array(readFileSync(full));
        }
        const zipped = zipSync(files, { level: 6 });
        writeFileSync(join(outDir, SITE_ZIP_NAME), zipped);
        logger.info(
          `${SITE_ZIP_NAME} — ${Object.keys(files).length} fichiers, ${(zipped.length / 1024 / 1024).toFixed(1)} Mo`,
        );
      },
    },
  };
}
