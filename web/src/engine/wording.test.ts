// Tests de PROPRIÉTÉ de cadrage (PANO-13, garde-fou de cadrage d'ADR-0003 ; révisé PANO-56
// correction n°5 ; porté sur `wording.ts` à la Refonte A, lot A2 — ex-`ui/templates.test.ts`).
//
// Ils ne jugent PAS le ton (provisoire, relu par yuya) : ils verrouillent des propriétés
// STRUCTURELLES sur chaque texte rendu —
//   (a) aucune marque de 2ᵉ personne, sur TOUT texte du fichier de wording ;
//   (c) pour les CLAIMS (seule ligne affichée depuis PANO-56 — un syntagme court SANS sujet
//       explicite) : aucun verdict direct sur la personne, et aucun label sensible posé NU sans
//       marqueur d'inférence.
// Les fragments courts (lectures d'éventail, libellés de thème, usage, noms de sujet) ne sont soumis
// qu'à (a) : « un vécu personnel » n'a pas à se cadrer, ce n'est pas une phrase assertive.
// C'est le filet automatique de « miroir, pas oracle ». Il doit rester vert.
//
// ─── CE QUE CE FILET NE COUVRE PAS ──────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md : un mécanisme de preuve déclare sa frontière, sinon il finit sur-cité.
//
//   - LE GARDE (a) EST LEXICAL, PAS PRAGMATIQUE. Il attrape des PRONOMS, pas l'ADRESSE. « Consider
//     seeking help » s'adresse au lecteur sans porter un seul jeton de 2ᵉ personne, et passe. Ce
//     qu'on tient est « aucun pronom de 2ᵉ personne », pas « le moteur ne s'adresse à personne » —
//     la seconde est l'obligation d'ADR-0003, et c'est une relecture humaine qui la tient.
//   - (c) EST UN PROXY, DANS LES DEUX LANGUES. `PERSON_DIRECT_VERDICT` cherche une copule française
//     (« la personne EST X ») ; l'anglais a la sienne (`is`/`seems`/`looks`), et les deux listes
//     sont des approximations, pas une analyse grammaticale. Une forme assertive écrite autrement —
//     participe seul, apposition — passe. C'est un garde-fou, pas une preuve.
//   - AUCUN DES DEUX NE JUGE LA TRADUCTION. Le sweep balaie les deux bundles, donc un texte anglais
//     fautif rougit ; mais un texte anglais qui RECOPIE le français passe (a) et (c) sans un bruit.
//     Le témoin de non-recopie plus bas n'attrape que le cas grossier — zéro texte traduit. Entre
//     « rien n'est traduit » et « tout est bien traduit », il n'y a que la relecture humaine.
//   - LES TABLES NE PASSENT PAS PAR ICI. Lectures, thèmes, usages et acteurs sont des résolveurs
//     (`RESOLVERS`) : leur couverture est tenue par `d1/d2-wording-coverage.test.ts`, et leur parité
//     FR/EN par `wording-parity.test.ts`. Trois filets, trois propriétés — n'en citer aucun pour un
//     autre.
//
// ─── (b) « SUJET = PLATEFORME » A ÉTÉ RETIRÉ AVEC `framing` — pourquoi ce n'est pas une perte ────
// La propriété (b) exigeait que chaque gabarit `*.framing` prenne la plateforme/le système pour
// sujet. Or `framing` n'était PLUS RENDU depuis PANO-56 : (b) prouvait donc une obligation de
// doctrine SUR DU TEXTE QUE PERSONNE NE LIT. Le retirer avec son sujet n'enlève aucune garantie sur
// l'écran. (b) ne peut PAS être reportée telle quelle sur le `claim` : la forme ratifiée en PANO-56
// était un syntagme SANS sujet — exiger qu'il nomme la plateforme rouvrirait PANO-56 et réécrirait
// le wording, donc le golden.
// ⚠ Cette phrase citait « Signal indirect associable à la santé mentale » AU PRÉSENT, comme si ce
// claim existait. Il n'existe plus : les dix phrases des cinq labels à éventail ont été retirées
// avec le lot C (l'éventail porte le sens), et il ne reste que trois claims — aucun ne porte de
// label sensible. Le raisonnement sur (b) tient sans l'exemple ; l'exemple, lui, envoyait traduire
// une phrase morte.
// Ce qui SURVIT, et qui est le vrai filet, c'est (c) : « jamais de verdict sur la personne », sur le
// texte réellement affiché. Il a été ÉLARGI AVANT le retrait de `framing` — condition non
// négociable de yuya ; le commit qui la portait n'a pas survécu à la réécriture d'historique v1 —
// sa v0 n'ancrait la forme assertive que sur le lexème « personne ».

import { describe, expect, it } from 'vitest';
import { LOCALES, type Locale } from '../i18n/locales';
import * as wording from './wording';

// Le sweep est EXHAUSTIF PAR CONSTRUCTION : il balaie les exports du module (`import * as`), pas une
// liste tenue à la main — mieux que l'ex-`allTemplateIds()`, qui dépendait d'une entrée au catalogue.
// Un claim ajouté est balayé sans rien déclarer.
// `actorLabel`/`readingText`/`themeLabelText`/`usageText`/`sensitiveTopicName`/`hasX` prennent une
// CLÉ, pas des params de rendu : ce sont des résolveurs, pas des textes. Les tables qu'ils résolvent
// sont balayées par `d1/d2-wording-coverage.test.ts`, sur les clés RÉELLES des lexiques.
const RESOLVERS = /^(has|actorLabel|readingText|themeLabelText|usageText|sensitiveTopicName)/;

// ⚠ CHAQUE RENDU EST PARAMÉTRÉ PAR LA LANGUE, et le sweep les balaie TOUTES (`LOCALES`). Sans ça,
// la propriété (a) — une obligation d'ADR-0003 — ne tiendrait que dans la langue balayée, et le
// bundle anglais pourrait écrire « you seem depressed » sans que rien ne rougisse. C'est le motif
// que CLAUDE.md compte sept fois : un filet écrit sur les cas typiques, cité comme s'il couvrait
// le domaine.
const RENDERERS: [string, (locale: Locale) => string][] = Object.entries(wording).flatMap(
  ([name, value]) => {
    if (typeof value !== 'function' || RESOLVERS.test(name)) {
      return [];
    }
    // `fn.length` donne l'arité. Le PREMIER paramètre est la `Locale` ; les suivants (seul
    // `d2InterestClaim` en a un, `signalCount: number`) sont nourris d'un nombre, sans avoir à
    // lister les cas. ⚠ Le `- 1` n'est pas cosmétique : sans lui, la locale recevrait `5`.
    const fn = value as (locale: Locale, ...args: number[]) => string;
    const extras = new Array<number>(Math.max(0, fn.length - 1)).fill(5);
    const entry: [string, (locale: Locale) => string] = [
      name,
      (locale: Locale) => String(fn(locale, ...extras)),
    ];
    return [entry];
  },
);

const CLAIMS = RENDERERS.filter(([name]) => /Claim$/.test(name));

// (a) 2ᵉ personne — UNE OBLIGATION DE DOCTRINE, PAS UNE RÈGLE DE STYLE. ADR-0003 (*Le cadrage*) :
// le moteur ne s'adresse JAMAIS à la personne, à aucun niveau de confiance. « Tu sembles traverser
// une dépression » prononcerait le verdict que la doctrine interdit.
//
// FR : pronoms/déterminants (bornés par `\b` pour éviter les faux positifs comme « habi**tu**des »
// ou « in**te**ntion ») + élision « t' » (t'as, t'es…). Apostrophe droite ET typographique.
const SECOND_PERSON_FR = /\b(tu|toi|ton|ta|tes|te|vous|votre|vos|vôtre)\b|\bt['’]/i;

// EN : le garde est écrit AVANT le fichier qu'il protège, et c'est délibéré — une obligation de
// doctrine qui n'existe que dans une langue tient dans une langue. Sans lui, `wording.en.ts`
// écrirait « you seem depressed » et ce filet resterait VERT.
//
// Les bornes de mot ne sont pas de la décoration : `\byou\b` laisse passer « young » (pas de
// frontière entre « you » et « n »), et « youth » reste utilisable. `your` a ses propres flexions
// (`yours`, `yourself`, `yourselves`), d'où une seconde alternative plutôt qu'un `\byour` nu qui
// mordrait sans les nommer. Les élisions couvrent les deux apostrophes, comme côté FR.
const SECOND_PERSON_EN = /\byou(?:['’](?:re|ve|ll|d))?\b|\byour(?:s|self|selves)?\b/i;

const SECOND_PERSON_GUARDS: readonly [string, RegExp][] = [
  ['FR', SECOND_PERSON_FR],
  ['EN', SECOND_PERSON_EN],
];

// (c) Proxy de « pas de verdict sur la personne » (CLAIMS seuls, depuis PANO-56) — deux formes
// interdites, approximatives par construction (v0) :
//   - une assertion directe sur la personne (« la personne est/semble X ») ;
//   - un label sensible NU sans marqueur d'inférence à proximité — le claim doit décrire un
//     SIGNAL/une LECTURE, jamais un état constaté comme fait.
// Élargissement du premier proxy : cf. en-tête (prérequis au retrait de `framing`).
// Ces deux fragments ne portent AUCUNE séquence d'échappement : littéraux simples (le `String.raw`
// n'a de sens que sur la ligne suivante, qui écrit `\b`/`\s`).
// Les deux listes portent le FRANÇAIS ET L'ANGLAIS : un claim anglais « the user seems anxious »
// doit être attrapé par le même filet. Sans les lexèmes EN, (c) tiendrait dans une langue — le même
// défaut que (a) portait avant ce lot, et pour la même raison.
const PERSON_NOUN = `(?:personne|utilisateur|utilisatrice|individu|auteur|titulaire|abonné|membre|il|elle|user|person|individual|author|member|account|they|he|she)`;
const COPULA = `(?:est|semble|paraît|parait|demeure|reste|serait|apparaît|apparait|a l['’]air|is|are|seems?|appears?|looks?|remains?|sounds?)`;
const PERSON_DIRECT_VERDICT = new RegExp(String.raw`\b${PERSON_NOUN}\s+${COPULA}\b`, 'i');
// Lexèmes sensibles NUS — FR et EN. `depress` couvre depressed/depression ; `anxi` couvre
// anxious/anxiety. Les bornes de mot sur `gay`/`trans` évitent « gaya », « transfert », « transit ».
const BARE_SENSITIVE_LABEL =
  /(dépress|depress|anxi(eux|été|ous|ety)|homosexuel|bisexuel|lesbienne|lesbian|\bgay\b|\btrans(gender|genre)?\b|extrémiste|extremist|terroriste|terrorist|malade|handicap|disabled|suicidal|addict)/i;
const INFERENCE_MARKER =
  /(déduit|suppos|associable|signal|indice|indirect|lu comme|distingu|attribu|confirm|repér|concentr|expos|inferred|infer|linked|associated|could|possible|potential|reading|marker)/i;

describe('wording — couverture', () => {
  it('le fichier porte des textes (le sweep ne rate pas la couverture réelle)', () => {
    expect(RENDERERS.length).toBeGreaterThan(0);
    expect(CLAIMS.length).toBeGreaterThan(0);
  });

  // Le sweep repose sur une CONVENTION DE NOM (`…Claim` ⇒ la propriété (c) s'applique) : un claim
  // renommé s'échapperait du filet EN SILENCE. Cette liste est la sentinelle — elle tombe si un
  // claim disparaît, est ajouté ou est mal nommé. À mettre à jour SCIEMMENT, jamais par réflexe.
  it('chaque claim attendu est balayé (une faute de nom ne peut pas échapper au filet)', () => {
    // DIX CLAIMS ONT DISPARU, et leur absence est le sujet du lot C : les cinq labels sensibles à
    // ÉVENTAIL n'ont plus de phrase — l'éventail porte le sens, la phrase répétait le titre de la
    // carte. Ne restent que les constats SANS éventail : `conflictual` (pas de lectures par
    // doctrine B5, et sa phrase porte le critère « émis, visant autrui ») et les intérêts D2.
    expect(CLAIMS.map(([n]) => n).sort()).toEqual([
      'd1ConflictualNamedClaim',
      'd2InterestClaim',
      'opacitySemanticWallClaim',
    ]);
  });

  it('rend une chaîne non vide pour chaque texte, dans CHAQUE langue', () => {
    for (const locale of LOCALES) {
      for (const [name, render] of RENDERERS) {
        expect(render(locale).length, `${name} (${locale})`).toBeGreaterThan(0);
      }
    }
  });

  // Contrôle de NON-RECOPIE : au moins un claim doit DIFFÉRER entre les deux langues. Un bundle
  // anglais qui recopierait le français passerait tout le reste de ce fichier — la parité prouve
  // qu'une entrée existe, jamais qu'elle est traduite. Ce témoin ne prouve pas la traduction non
  // plus ; il attrape seulement le cas grossier où personne n'aurait rien traduit du tout.
  it('les deux langues ne rendent pas le MÊME texte (le bundle EN n’est pas une copie)', () => {
    const differs = RENDERERS.filter(([, render]) => render('fr') !== render('en'));
    expect(differs.length, 'aucun texte ne diffère entre FR et EN').toBeGreaterThan(0);
  });
});

describe('wording — propriétés « miroir, pas oracle »', () => {
  it('(a) aucun texte ne contient de marque de 2ᵉ personne', () => {
    for (const locale of LOCALES) {
      for (const [name, render] of RENDERERS) {
        const text = render(locale);
        for (const [lang, guard] of SECOND_PERSON_GUARDS) {
          const match = text.match(guard);
          expect(
            match,
            `2ᵉ personne ${lang} « ${match?.[0]} » dans ${name} (${locale}) : "${text}"`,
          ).toBeNull();
        }
      }
    }
  });

  // CONTRÔLES NÉGATIFS du garde (a), sur le modèle de ceux de (c) plus bas. Ils fixent le GARDE, pas
  // le wording : ils survivent donc à toute réécriture de la prose, et sont — aujourd'hui — la SEULE
  // preuve que la moitié anglaise mord (cf. la frontière déclarée en tête de fichier).
  it('(a) le garde EN attrape la 2ᵉ personne anglaise, verdict compris', () => {
    for (const forbidden of [
      'you seem depressed', // le verdict exact qu'ADR-0003 interdit
      'your anxiety is showing',
      "you're likely struggling",
      'a signal about yourself',
      'this data is yours',
    ]) {
      expect(SECOND_PERSON_EN.test(forbidden), forbidden).toBe(true);
    }
  });

  it("(a) le garde EN n'attrape PAS les mots qui contiennent « you » sans s'adresser à personne", () => {
    for (const allowed of [
      'signal associated with a young audience',
      'youth culture interest',
      'a guided tour of the data',
      'signal that could be linked to mental health',
    ]) {
      expect(SECOND_PERSON_EN.test(allowed), allowed).toBe(false);
    }
  });
});

describe('wording — propriété « pas de verdict sur la personne » (claims uniquement)', () => {
  it('(c) aucun claim n’assertionne directement un état de la personne', () => {
    for (const locale of LOCALES) {
      for (const [name, render] of CLAIMS) {
        const text = render(locale);
        const match = text.match(PERSON_DIRECT_VERDICT);
        expect(
          match,
          `verdict direct sur la personne « ${match?.[0]} » dans ${name} (${locale}) : "${text}"`,
        ).toBeNull();
      }
    }
  });

  it('(c) tout label sensible d’un claim est accompagné d’un marqueur d’inférence, jamais posé nu', () => {
    for (const locale of LOCALES) {
      for (const [name, render] of CLAIMS) {
        const text = render(locale);
        if (BARE_SENSITIVE_LABEL.test(text)) {
          expect(
            INFERENCE_MARKER.test(text),
            `label sensible sans marqueur d'inférence dans ${name} (${locale}) : "${text}"`,
          ).toBe(true);
        }
      }
    }
  });

  // CONTRÔLES NÉGATIFS du filet (c). Un test de propriété qui ne rejette rien est vert ET vide : ces
  // cas prouvent que l'élargissement mord VRAIMENT, sur les formes qui passaient la v0. Ils fixent le
  // filet lui-même — pas le wording —, donc survivent à toute réécriture de la prose.
  it('(c) le filet attrape un verdict porté par un sujet AUTRE que « personne » (trou de la v0)', () => {
    for (const forbidden of [
      'utilisateur est passionné de crypto',
      'utilisatrice semble anxieuse',
      'individu est un supporter engagé',
      'il paraît insomniaque',
      'elle a l’air militante',
    ]) {
      expect(PERSON_DIRECT_VERDICT.test(forbidden), forbidden).toBe(true);
    }
  });

  // ⚠ CES CHAÎNES SONT DES FORMES, PAS DES CITATIONS DU WORDING VIVANT — et deux d'entre elles ne
  // sont plus produites par personne : « Signal indirect associable… » est parti avec les claims à
  // éventail, et « repéré dans des commentaires » avec le canal (une preuve tirée d'une RECHERCHE
  // était annoncée comme un commentaire). Les garder est VOULU : ces contrôles fixent le FILET, pas
  // la prose, et une forme retirée du produit reste une forme que le filet doit savoir ne pas
  // rejeter. Ne pas les lire comme l'état courant du wording — `wording.ts` est sa seule maison.
  it('(c) le filet n’attrape PAS un syntagme sans verdict (aucun faux positif sur la forme ratifiée)', () => {
    for (const allowed of [
      'Propos agressif adressé à un autre utilisateur, repéré dans des commentaires.',
      'Signal indirect associable à la santé mentale.',
      'Centre d’intérêt déduit de 5 commentaires sur le même thème.',
    ]) {
      expect(PERSON_DIRECT_VERDICT.test(allowed), allowed).toBe(false);
    }
  });
});
