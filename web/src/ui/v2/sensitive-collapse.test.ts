// TÉMOIN DU REPLI PAR DÉFAUT D'UN CONSTAT SENSIBLE — SENS-C4, moitié « porte ».
//
// POURQUOI CE FICHIER EXISTE. ADR-0003 (*Ce qui porte la sécurité : la porte, pas le seuil*) fait du
// repli la **porte du consentement**, et ses *Conséquences* écrivent noir sur blanc qu'il peut
// **tomber sans bruit**. C'était le seul point de la doctrine qui prédisait son propre mode de
// défaillance sans que personne ne le regarde : le repli tenait à un `useState(false)` dans
// `ThemeCardNavy.tsx`, figé par accident et non par mesure.
//
// PAR ACCIDENT, ET IL FAUT DIRE LEQUEL — sinon la suite paraît redondante avec les goldens. Les deux
// goldens de rendu **mockent `useState`** pour forcer tout booléen initialisé à `false` vers `true`
// (leur « précaution 2 », sans laquelle ils ne verraient ni verbatim ni surbrillance). Ils sont donc
// **structurellement aveugles** à la valeur initiale : basculer la source en `useState(true)` n'y
// déplace pas un octet. Le badge « sensible », lui, est bien tenu par eux — il ne dépend d'aucun
// état.
//
// L'ASSERTION QUI PORTE est `aria-expanded="false"`, pas l'absence du corps. Une absence est un
// **zéro**, et CLAUDE.md impose de se demander par quel chemin il arrive : un constat sans preuve
// rendrait un corps vide quel que soit l'état. `aria-expanded` change de **valeur** sous mutation,
// il ne peut pas passer au vert pour une autre raison. L'absence du verbatim n'est ici qu'une
// assertion **secondaire**, et elle n'est légitime que parce que la preuve ci-dessous existe : le
// seul chemin qui l'efface du rendu est le repli.
//
// VÉRIFIÉ PAR MUTATION (le test ne prouve rien tant que ce n'est pas fait) :
//   - `SignalCardNavy` : `useState(false)` → `useState(true)` ⇒ CE fichier rougit, et lui seul sur
//     l'ensemble de la suite ;
//   - `ThemeCardNavy` : même bascule sur l'autre repli (les cartes de thème, non sensibles) ⇒ ce
//     fichier reste VERT. Le témoin est donc spécifique au mécanisme sensible, pas couplé par
//     hasard au repli voisin.
//
// ─── CE QUE CE FILET NE COUVRE PAS ──────────────────────────────────────────────────────────────
// Obligation de CLAUDE.md : un mécanisme de preuve déclare sa frontière, sinon il finit sur-cité.
//   - LA MOITIÉ « BADGE » DE SENS-C4. Ce fichier vérifie que le badge est PRÉSENT, mais seulement
//     pour s'ancrer sur le bon sujet (une carte sensible, pas une carte quelconque). Sa prose et sa
//     place dans l'en-tête sont figées par les goldens de rendu, pas ici ;
//   - LA CARTE DE SIGNAL SENSIBLE (`SignalCardNavy`) SEULEMENT. Le repli des cartes de THÈME est un
//     `useState` distinct dans le même fichier ; il ne porte aucune doctrine du sensible et reste
//     hors de ce témoin — la mutation croisée ci-dessus le mesure ;
//   - LE COMPORTEMENT APRÈS CLIC. Ce qui est figé est l'état de **premier rendu**, c'est-à-dire ce
//     que SENS-C4 protège (le coup d'œil non consenti). Rien ici ne dit que la carte s'ouvre ni
//     qu'elle se referme ;
//   - PAS DE SECOND TÉMOIN MOBILE, et c'est un choix mesuré plutôt qu'un oubli : `SignalCardNavy`
//     ne lit pas `useIsMobile`. L'état `open` n'a donc **aucune branche de device** à exercer deux
//     fois, et un témoin mobile rejouerait le même code sur la même valeur. Le jour où une variante
//     `M_*` conditionnerait le repli, cette ligne devient fausse et ce témoin doit doubler ;
//   - LE CHEMIN MOTEUR. Le constat ci-dessous est construit à la main, pas produit par le détecteur.
//     Ce témoin dit « une carte sensible se rend repliée », jamais « le moteur émet un sensible » —
//     cette seconde propriété vit dans les bancs de `detect/`. C'est délibéré : accrocher le témoin
//     à la persona le rendrait vacant le jour où une règle cesse d'émettre.

import { h } from 'preact';
import { render } from 'preact-render-to-string';
import { expect, it } from 'vitest';
import type { Signal } from '../../engine/analysis';
import { UI_CARD } from '../copy';
import { SignalCardNavy } from './ThemeCardNavy';

// Verbatim synthétique (invariant du dépôt : aucune valeur d'un vrai export). Il n'a qu'un rôle —
// être une chaîne que SEUL le corps déplié peut faire apparaître dans le rendu.
const VERBATIM = 'zzz-preuve-temoin-repli';

const SENSITIVE_SIGNAL: Signal = {
  label: 'Santé mentale',
  sensitive: true,
  confidence: 'medium',
  evidence: [
    {
      channel: 'search',
      sourceIndex: 0,
      text: VERBATIM,
      date: '2026-01-01 00:00:00',
    },
  ],
};

it('SENS-C4 — un constat sensible démarre REPLIÉ (ADR-0003 : le repli est la porte du consentement)', () => {
  const html = render(h(SignalCardNavy, { signal: SENSITIVE_SIGNAL, reuseMap: new Map() }));

  // Ancrage : on regarde bien une carte SENSIBLE. Sans ça, le test tiendrait sur n'importe quelle
  // carte et ne dirait plus rien de la doctrine qu'il cite.
  expect(html).toContain(UI_CARD.sensitiveTag);

  // L'assertion qui porte : la porte est fermée au premier rendu.
  expect(html).toContain('aria-expanded="false"');

  // Secondaire : la preuve existe (ci-dessus), donc son absence du rendu ne peut venir que du repli.
  expect(html).not.toContain(VERBATIM);
});
