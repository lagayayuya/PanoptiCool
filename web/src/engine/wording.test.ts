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
// ─── (b) « SUJET = PLATEFORME » A ÉTÉ RETIRÉ AVEC `framing` — pourquoi ce n'est pas une perte ────
// La propriété (b) exigeait que chaque gabarit `*.framing` prenne la plateforme/le système pour
// sujet. Or `framing` n'était PLUS RENDU depuis PANO-56 : (b) prouvait donc une obligation de
// doctrine SUR DU TEXTE QUE PERSONNE NE LIT. Le retirer avec son sujet n'enlève aucune garantie sur
// l'écran. (b) ne peut PAS être reportée telle quelle sur le `claim` : le claim ratifié en PANO-56
// est un syntagme SANS sujet (« Signal indirect associable à la santé mentale ») — exiger qu'il
// nomme la plateforme rouvrirait PANO-56 et réécrirait le wording, donc le golden.
// Ce qui SURVIT, et qui est le vrai filet, c'est (c) : « jamais de verdict sur la personne », sur le
// texte réellement affiché. Il a été ÉLARGI AVANT le retrait de `framing` (condition non négociable
// de yuya, commit `ac99456`) : sa v0 n'ancrait la forme assertive que sur le lexème « personne ».

import { describe, expect, it } from 'vitest';
import * as wording from './wording';

// Le sweep est EXHAUSTIF PAR CONSTRUCTION : il balaie les exports du module (`import * as`), pas une
// liste tenue à la main — mieux que l'ex-`allTemplateIds()`, qui dépendait d'une entrée au catalogue.
// Un claim ajouté est balayé sans rien déclarer.
// `actorLabel`/`readingText`/`themeLabelText`/`usageText`/`sensitiveTopicName`/`hasX` prennent une
// CLÉ, pas des params de rendu : ce sont des résolveurs, pas des textes. Les tables qu'ils résolvent
// sont balayées par `d1/d2-wording-coverage.test.ts`, sur les clés RÉELLES des lexiques.
const RESOLVERS = /^(has|actorLabel|readingText|themeLabelText|usageText|sensitiveTopicName)/;

const RENDERERS: [string, () => string][] = Object.entries(wording).flatMap(([name, value]) => {
  if (typeof value !== 'function' || RESOLVERS.test(name)) {
    return [];
  }
  // Seul `d2InterestClaim` prend un paramètre (`signalCount: number`) — le TYPE l'exige désormais,
  // là où `p(q, 'signalCount')` rendait « ? » en silence si le param manquait (le gain d'A2).
  // `fn.length` donne l'arité : on nourrit chaque param d'un nombre, sans avoir à lister les cas.
  const fn = value as (...args: number[]) => string;
  const entry: [string, () => string] = [
    name,
    () => String(fn(...new Array<number>(fn.length).fill(5))),
  ];
  return [entry];
});

const CLAIMS = RENDERERS.filter(([name]) => /Claim$/.test(name));

// (a) 2ᵉ personne : pronoms/déterminants (bornés par `\b` pour éviter les faux positifs comme
// « habi**tu**des » ou « in**te**ntion ») + élision « t' » (t'as, t'es…). Apostrophe droite ET
// typographique.
const SECOND_PERSON = /\b(tu|toi|ton|ta|tes|te|vous|votre|vos|vôtre)\b|\bt['’]/i;

// (c) Proxy de « pas de verdict sur la personne » (CLAIMS seuls, depuis PANO-56) — deux formes
// interdites, approximatives par construction (v0) :
//   - une assertion directe sur la personne (« la personne est/semble X ») ;
//   - un label sensible NU sans marqueur d'inférence à proximité — le claim doit décrire un
//     SIGNAL/une LECTURE, jamais un état constaté comme fait.
// Élargissement du premier proxy : cf. en-tête (prérequis au retrait de `framing`).
// Ces deux fragments ne portent AUCUNE séquence d'échappement : littéraux simples (le `String.raw`
// n'a de sens que sur la ligne suivante, qui écrit `\b`/`\s`).
const PERSON_NOUN = `(?:personne|utilisateur|utilisatrice|individu|auteur|titulaire|abonné|membre|il|elle)`;
const COPULA = `(?:est|semble|paraît|parait|demeure|reste|serait|apparaît|apparait|a l['’]air)`;
const PERSON_DIRECT_VERDICT = new RegExp(String.raw`\b${PERSON_NOUN}\s+${COPULA}\b`, 'i');
const BARE_SENSITIVE_LABEL =
  /(dépress|anxi(eux|été)|homosexuel|bisexuel|lesbienne|\bgay\b|trans(genre)?|extrémiste|terroriste|malade|handicap)/i;
const INFERENCE_MARKER =
  /(déduit|suppos|associable|signal|indice|indirect|lu comme|distingu|attribu|confirm|repér|concentr|expos)/i;

describe('wording — couverture', () => {
  it('le fichier porte des textes (le sweep ne rate pas la couverture réelle)', () => {
    expect(RENDERERS.length).toBeGreaterThan(0);
    expect(CLAIMS.length).toBeGreaterThan(0);
  });

  // Le sweep repose sur une CONVENTION DE NOM (`…Claim` ⇒ la propriété (c) s'applique) : un claim
  // renommé s'échapperait du filet EN SILENCE. Cette liste est la sentinelle — elle tombe si un
  // claim disparaît, est ajouté ou est mal nommé. À mettre à jour SCIEMMENT, jamais par réflexe.
  it('chaque claim attendu est balayé (une faute de nom ne peut pas échapper au filet)', () => {
    expect(CLAIMS.map(([n]) => n).sort()).toEqual([
      'd1ConflictualNamedClaim',
      'd1HealthPhysicalBroadClaim',
      'd1HealthPhysicalNamedClaim',
      'd1MentalHealthBroadClaim',
      'd1MentalHealthNamedClaim',
      'd1PoliticsBroadClaim',
      'd1PoliticsNamedClaim',
      'd1ReligionBroadClaim',
      'd1ReligionNamedClaim',
      'd1SexualityBroadClaim',
      'd1SexualityNamedClaim',
      'd2InterestClaim',
      'opacitySemanticWallClaim',
    ]);
  });

  it('rend une chaîne non vide pour chaque texte', () => {
    for (const [name, render] of RENDERERS) {
      expect(render().length, name).toBeGreaterThan(0);
    }
  });
});

describe('wording — propriétés « miroir, pas oracle »', () => {
  it('(a) aucun texte ne contient de marque de 2ᵉ personne', () => {
    for (const [name, render] of RENDERERS) {
      const text = render();
      const match = text.match(SECOND_PERSON);
      expect(match, `2ᵉ personne « ${match?.[0]} » dans ${name} : "${text}"`).toBeNull();
    }
  });
});

describe('wording — propriété « pas de verdict sur la personne » (claims uniquement)', () => {
  it('(c) aucun claim n’assertionne directement un état de la personne', () => {
    for (const [name, render] of CLAIMS) {
      const text = render();
      const match = text.match(PERSON_DIRECT_VERDICT);
      expect(
        match,
        `verdict direct sur la personne « ${match?.[0]} » dans ${name} : "${text}"`,
      ).toBeNull();
    }
  });

  it('(c) tout label sensible d’un claim est accompagné d’un marqueur d’inférence, jamais posé nu', () => {
    for (const [name, render] of CLAIMS) {
      const text = render();
      if (BARE_SENSITIVE_LABEL.test(text)) {
        expect(
          INFERENCE_MARKER.test(text),
          `label sensible sans marqueur d'inférence dans ${name} : "${text}"`,
        ).toBe(true);
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
