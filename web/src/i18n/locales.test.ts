// FILET DE COHÉRENCE DES LANGUES — il tient UN invariant, et c'est le seul qui compte ici :
//
//   **rien de ce qui s'adresse à un robot ne nomme une langue non publiée.**
//
// POURQUOI CET INVARIANT-LÀ. Il est né quand la symétrie `/fr` ⁄ `/en` existait avec l'anglais
// ÉTEINT : un hreflang, une entrée de sitemap ou un `alternate` nommant `en` aurait invité
// l'indexation d'une coquille. L'anglais est allumé depuis le 2026-07-20 et ce cas-là ne se pose
// plus tel quel ; l'invariant, lui, ne dépend d'aucune langue en particulier et garde la porte pour
// la prochaine — l'accident ne se voit pas à la relecture, il se voit trois semaines plus tard,
// dans les résultats d'un moteur.
//
// Il tient aussi la réciproque, moins spectaculaire mais plus probable : une langue déclarée
// publiée dont les pages n'existent pas. C'est un sitemap qui annonce des 404.
//
// ─── CE QUE CE FILET NE COUVRE PAS ──────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md. Ce fichier est le genre de test qu'on cite ensuite comme « l'i18n est
// testée » — il ne teste pas l'i18n, il teste une correspondance de listes.
//   - IL NE LIT PAS LE `dist/`. Il compare des listes TypeScript et l'arborescence de `src/pages/`.
//     Que le build produise réellement ces URLs, qu'il n'en produise pas d'autres, et que
//     `find dist -path '*en*'` reste vide, se vérifie sur le build — pas ici ;
//   - IL NE SUIT AUCUNE REDIRECTION. Que `/` parte vers `/fr`, que `/analyse` réponde, qu'un
//     `meta refresh` soit bien formé : rien de tout cela n'est exercé. Aucune requête n'est faite ;
//   - IL NE REGARDE PAS LES LIENS DES COMPOSANTS. Un `href="/analyse"` oublié sans préfixe de
//     langue passe ce test sans bruit ; ce sont les goldens de rendu qui le figent ;
//   - IL NE VÉRIFIE PAS LE RENDU DE `lang`. Il lit la SOURCE des pages et y interdit un code de
//     langue en dur ; que `Astro.currentLocale` rende ensuite la bonne valeur se voit au build ;
//   - IL NE DIT RIEN DU CONTENU. Qu'une page `en/` existe ne prouve pas qu'elle soit traduite, ni
//     que l'analyse anglaise vaille quelque chose. C'est un test de plomberie ; ce que l'anglais
//     rend VRAIMENT se mesure ailleurs (`ui/v2/render-golden-en.test.ts`), et l'écart mesuré à
//     l'allumage vit dans `i18n/locales.ts`, pas ici.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  HTML_LANG,
  LOCALES,
  type Locale,
  localePath,
  PAGE_PATHS,
  PUBLISHED_LOCALES,
} from './locales';

const PAGES_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'pages');

/** Les dossiers de `src/pages/` qui portent un nom de langue déclarée — les langues CONSTRUITES. */
function builtLocales(): Locale[] {
  return LOCALES.filter((locale) => existsSync(join(PAGES_DIR, locale)));
}

describe('langues publiées et langues construites', () => {
  it('ne publie que des langues dont les pages existent', () => {
    expect([...PUBLISHED_LOCALES].sort()).toEqual(builtLocales().sort());
  });

  it('donne à chaque langue publiée toutes les pages du site', () => {
    for (const locale of PUBLISHED_LOCALES) {
      const files = readdirSync(join(PAGES_DIR, locale));
      for (const path of PAGE_PATHS) {
        const expected = path === '/' ? 'index.astro' : `${path.slice(1)}.astro`;
        expect(files, `langue « ${locale} », page « ${path} »`).toContain(expected);
      }
    }
  });

  it('publie un sous-ensemble des langues déclarées', () => {
    for (const locale of PUBLISHED_LOCALES) {
      expect(LOCALES).toContain(locale);
    }
  });
});

describe('les pages déclarent leur langue au lieu de l’écrire', () => {
  // POURQUOI CE TÉMOIN EXISTE. Les pages écrivaient `<html lang="fr">` en dur. Tant qu'un seul
  // arbre existait, c'était juste ; à la première page anglaise — copiée de la française, comme le
  // veut la marche à suivre de `locales.ts` — l'attribut mentait. Et il ment SILENCIEUSEMENT : les
  // hreflang, le canonical et le sitemap se calculent côté serveur et restent corrects, pendant que
  // `i18n/current.ts`, qui LIT cet attribut, fabrique pour tous les îlots des liens vers la mauvaise
  // langue. Mesuré avant correction sur `/en/analyse` : le sélecteur affichait FR actif, les liens
  // renvoyaient vers `/fr`, et le lien de langue se doublait en `/en/en/analyse`.
  //
  // Dériver l'attribut de `Astro.currentLocale` rend la chose vraie par construction ; ce témoin
  // garde la porte, parce que la faute se réintroduit d'un simple copier-coller.
  it('n’écrit aucun code de langue en dur dans <html lang>', () => {
    for (const locale of PUBLISHED_LOCALES) {
      for (const file of readdirSync(join(PAGES_DIR, locale))) {
        const source = readFileSync(join(PAGES_DIR, locale, file), 'utf8');
        expect(source, `${locale}/${file}`).not.toMatch(/<html\s+lang="/);
      }
    }
  });
});

describe("l'anglais est allumé — et les deux moitiés sont là", () => {
  // CES DEUX TÉMOINS SONT L'INVERSE DE CE QU'ILS DISAIENT (allumage du 2026-07-20). Ils exigeaient
  // `PUBLISHED_LOCALES` sans `en` et `src/pages/en/` absent ; leur rôle était de rendre l'allumage
  // IMPOSSIBLE PAR INADVERTANCE, et ils l'ont tenu jusqu'au bout — la bascule a dû les retourner à
  // la main, donc en connaissance de cause. Retournés, ils gardent l'autre porte : une extinction
  // par inadvertance, qui laisserait un `/en` construit mais dépublié.
  it("déclare l'anglais dans le routage", () => {
    expect(LOCALES).toContain('en');
  });

  it('le publie, et ses pages existent', () => {
    expect(PUBLISHED_LOCALES).toContain('en');
    expect(existsSync(join(PAGES_DIR, 'en'))).toBe(true);
  });
});

describe('les URLs annoncées aux robots', () => {
  // Le cœur du filet : on RECONSTRUIT ici ce que `SiteHead` et le sitemap émettent, à partir des
  // mêmes fonctions, et on vérifie qu'aucune langue non publiée n'y apparaît.
  const announced = PAGE_PATHS.flatMap((path) =>
    PUBLISHED_LOCALES.map((locale) => localePath(locale, path)),
  );

  // ⚠ CETTE ASSERTION S'EST VIDÉE LE JOUR DE L'ALLUMAGE, ET ELLE EST RESTÉE VERTE. Elle bouclait
  // sur `LOCALES \ PUBLISHED_LOCALES` ; les deux listes coïncidant depuis le 2026-07-20, cet
  // ensemble est VIDE, la double boucle ne s'exécute plus, et le test passe sans rien atteindre.
  // C'est le motif que CLAUDE.md nomme : une assertion négative vérifie ce qu'elle ATTEINT, pas ce
  // qu'elle affirme — et elle passe alors au vert pour une raison qui n'est pas la sienne.
  //
  // Réécrite dans le sens POSITIF : chaque URL annoncée porte un préfixe qui est une langue
  // publiée. La propriété est la même, elle ne dépend plus de l'existence d'une langue éteinte, et
  // le compte d'URLs vérifiées est asserté pour qu'un `announced` vide ne puisse pas la revider.
  //
  // MUTATION PASSÉE : `localePath` forcé à préfixer `/de` au lieu de la langue reçue. L'assertion
  // ROUGIT (« /de nomme de, qui n'est pas une langue publiée »). La version d'avant, elle, serait
  // restée verte sur cette même mutation — sa boucle ne s'exécutait plus.
  it('ne nomme que des langues publiées', () => {
    expect(announced.length).toBe(PAGE_PATHS.length * PUBLISHED_LOCALES.length);
    for (const url of announced) {
      const prefix = url.split('/')[1];
      expect(
        PUBLISHED_LOCALES as readonly string[],
        `« ${url} » nomme « ${prefix} », qui n'est pas une langue publiée`,
      ).toContain(prefix);
    }
  });

  it('porte un code hreflang pour chaque langue publiée', () => {
    for (const locale of PUBLISHED_LOCALES) {
      expect(HTML_LANG[locale]).toBeTruthy();
    }
  });
});

describe('localePath', () => {
  it('rend la racine sans barre finale — une seule forme, donc un seul canonical', () => {
    expect(localePath('fr', '/')).toBe('/fr');
  });

  it('préfixe les autres chemins', () => {
    expect(localePath('fr', '/analyse')).toBe('/fr/analyse');
    expect(localePath('en', '/mentions-legales')).toBe('/en/mentions-legales');
  });

  it('laisse passer la query — le parcours de démo en dépend', () => {
    expect(localePath('fr', '/analyse?demo')).toBe('/fr/analyse?demo');
  });
});
