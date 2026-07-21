// Témoins du formatage FR. Deux règles s'y attrapent, et aucune n'est intuitive — c'est
// précisément pourquoi elles sont testées plutôt que laissées à la relecture.

import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatDecimal, formatFixedDecimal, formatInt, formatPercent, plural } from './format';

describe('formatInt — groupement des milliers', () => {
  it('groupe avec une FINE insécable (U+202F), pas une espace ASCII', () => {
    // Le point du fichier : deux `formatInt` écrits à la main divergeaient sur CE caractère, et le
    // golden ne le montrait pas. On le fixe donc explicitement, par point de code.
    expect(formatInt(50_000)).toBe('50 000');
    expect(formatInt(1_234_567)).toBe('1 234 567');
  });

  it('ne groupe pas en dessous de mille, et arrondit', () => {
    expect(formatInt(420)).toBe('420');
    expect(formatInt(419.6)).toBe('420');
  });
});

describe('formatPercent — pourcentage', () => {
  it('sépare avec une insécable ORDINAIRE (U+00A0), pas la fine des milliers', () => {
    // La distinction CLDR que le code à la main ratait : U+202F pour les milliers, U+00A0 ici.
    expect(formatPercent(0.26)).toBe('26 %');
    expect(formatPercent(0.01)).toBe('1 %');
  });

  it('prend un RATIO, pas une valeur 0–100', () => {
    expect(formatPercent(1)).toBe('100 %');
  });
});

describe('formatDecimal — décimale à la virgule', () => {
  it('rend une virgule, jamais un point', () => {
    expect(formatDecimal(4.2)).toBe('4,2');
  });

  it('rend un ENTIER quand le compte tombe rond (le singulier en dépend)', () => {
    // `timeEstimateSentence` teste `daysStr === '1'` pour choisir « jour » plutôt que « jours ».
    // Si ceci rendait « 1,0 », le singulier ne se déclencherait jamais.
    expect(formatDecimal(1)).toBe('1');
    expect(formatDecimal(2)).toBe('2');
  });
});

describe('formatFixedDecimal — décimale TOUJOURS affichée', () => {
  it('garde la décimale nulle, là où `formatDecimal` la retire', () => {
    // Les deux formateurs existent parce que la bonne réponse dépend du VOISINAGE : dans une
    // colonne de tailles (2,2 / 1,9 / 1,5), « 2 Go » casse l'alignement ; dans une phrase,
    // « 1,0 jour » ne se lit pas. Ce test fixe le contraste, pas seulement la valeur.
    expect(formatFixedDecimal(2)).toBe('2,0');
    expect(formatDecimal(2)).toBe('2');
    expect(formatFixedDecimal(2.2)).toBe('2,2');
  });
});

describe('plural — accord en nombre', () => {
  it('⚠ met ZÉRO au singulier — règle française, contre-intuitive depuis l’anglais', () => {
    expect(plural(0, 'commentaire', 'commentaires')).toBe('commentaire');
  });

  it('met 1 au singulier et 2+ au pluriel', () => {
    expect(plural(1, 'item', 'items')).toBe('item');
    expect(plural(2, 'item', 'items')).toBe('items');
    expect(plural(38, 'item', 'items')).toBe('items');
  });
});

// ─── LE FORMATAGE ANGLAIS — et la manœuvre qu'il exige ──────────────────────────────────────────
// Ce bloc existe parce que le reste du fichier ne prouve QUE le français. Tant qu'il manquait,
// « `format.ts` est délocalisé » n'était qu'une affirmation : les six formateurs auraient pu rester
// épinglés sur `fr-FR` sans qu'une seule assertion rougisse — l'anglais n'était sur le chemin
// d'aucun test.
//
// LA MANŒUVRE, et elle vaut telle quelle pour `ui/copy.ts`. `format.ts` résout la langue UNE FOIS,
// au chargement du module. Il faut donc poser `<html lang>` AVANT l'import, d'où `resetModules()` +
// import dynamique. Un `import` statique en tête de fichier aurait déjà figé le français.
//
// ⚠ CE QUE CE BLOC NE COUVRE PAS : il teste les FORMATEURS, pas le rendu. Qu'un composant appelle
// le bon formateur au bon endroit relève des goldens ; et aucun golden anglais n'existe à ce jour.
describe('formatage EN — le fichier n’est plus épinglé sur fr-FR', () => {
  async function loadAs(lang: string): Promise<typeof import('./format')> {
    vi.resetModules();
    vi.stubGlobal('document', { documentElement: { lang } });
    return import('./format');
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('groupe à la VIRGULE et sans U+202F', async () => {
    const { formatInt } = await loadAs('en');
    expect(formatInt(50_000)).toBe('50,000');
    expect([...formatInt(50_000)].some((c) => c.charCodeAt(0) === 0x202f)).toBe(false);
  });

  it('n’insère PAS d’insécable avant « % » (U+00A0 est une règle française)', async () => {
    const { formatPercent } = await loadAs('en');
    expect(formatPercent(0.42)).toBe('42%');
  });

  it('⚠ met ZÉRO au PLURIEL — l’inverse exact du français, et le cas que personne ne rend', async () => {
    const { plural } = await loadAs('en');
    expect(plural(0, 'comment', 'comments')).toBe('comments');
    expect(plural(1, 'comment', 'comments')).toBe('comment');
  });

  it('le français reste intact quand la page est française (aucune fuite d’un test à l’autre)', async () => {
    const { formatInt, plural } = await loadAs('fr');
    // Assertion par POINT DE CODE, et non par littéral : le séparateur français est U+202F, un
    // caractère invisible qu'une copie hasardeuse remplace par une espace ordinaire sans que rien
    // ne le montre. C'est le défaut même que ce fichier existe pour attraper — l'écrire en toutes
    // lettres évite de le reproduire dans son propre témoin.
    expect([...formatInt(50_000)].map((c) => c.charCodeAt(0))).toEqual([
      0x35, 0x30, 0x202f, 0x30, 0x30, 0x30,
    ]);
    expect(plural(0, 'commentaire', 'commentaires')).toBe('commentaire');
  });
});
