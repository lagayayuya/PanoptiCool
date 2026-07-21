// Lexique d'intérêt `sports_combat` (D2, PANO-78 lot 3) — sports de combat / arts martiaux.
//
// ── Généricité (PANO-70 §3) ────────────────────────────────────────────────────────────────────
// Vocabulaire courant des sports de combat FR : disciplines, organisations, gestes, combattants.
// Entités = signal public générique enrichi par recherche.
//
// ── Méthode recall — tiers ─────────────────────────────────────────────────────────────────────
//   · SOLO — « mma », « ufc », « muay thai », « jiu jitsu », « kickboxing », « grappling », « octogone »,
//     « taekwondo », combattants (« ngannou », « mcgregor »).
//   · ANCRÉ — « combat », « boxe » (verbe boxer), « cage » (générique), « garde » (générique), « lutte »
//     (combat au figuré), « jab », « crochet » (tricot), « sambo » (prénom) : co-occurrence.
//   · EXCLU — rien de désespéré (vocabulaire = disciplines/gestes techniques).
//
// ── Variantes EN (PANO-88) — sondage FP ────────────────────────────────────────────────────────
// Le grappling anglophone nomme ses SOUMISSIONS ; ces noms n'existent que là, et portent le domaine.
//   · SOLO — « rear naked choke », « armbar », « triangle choke », « kimura », « heel hook »,
//     « kneebar », « darce », « guillotine choke », « omoplata », « berimbolo », « nogi », « bjj »,
//     « takedown », « sprawl », « double leg », « single leg », « ground and pound », « tko », « teep »,
//     « southpaw », « shadowboxing », « heavy bag », « open mat », « osoto gari », « uchi mata », « seoi nage ».
//   · ANCRÉ — « guard » (le VIGILE, et le poste de meneur au `basket` : le pire terme du domaine),
//     « mount » (monter une étagère, MONTER UN SYSTÈME DE FICHIERS, le mont), « tap » (le robinet ;
//     payer sans contact), « clinch » (« clinch the title », emploi générique dans tout le sport),
//     « jab » (= le VACCIN en anglais britannique), « submission » (l'envoi d'un formulaire ou d'un
//     article), « choke » (s'étouffer avec un aliment ; « choked » = a craqué), « belt » (la ceinture
//     de sécurité, la courroie), « americana » (le genre musical), « roll », « pass » : compagnon requis.
//
// La frontière ci-dessous vaut mot pour mot pour ces ajouts : ce sont des GESTES TECHNIQUES nommés.
//
// ── Frontière ──────────────────────────────────────────────────────────────────────────────────
// Non sensible : PRATIQUE sportive (discipline, technique), JAMAIS l'agression réelle (→ `conflictual`,
// D1). Aucun marqueur d'insulte ou de menace ; les gestes nommés (KO, étranglement) sont des termes
// techniques de discipline, vérifiés par le guard de frontière.

import type { InterestLexicon } from '../types';

export const SPORTS_COMBAT_LEXICON: InterestLexicon = {
  kind: 'interest',
  label: 'sports_combat',
  themeLabel: 'theme.sports-combat.label',
  usage: [
    { actor: 'advertiser', usage: { templateId: 'usage.advertiser.combat-sports', params: {} } },
    { actor: 'platform', usage: { templateId: 'usage.platform.feed-tuning', params: {} } },
  ],
  markers: [
    'mma',
    'ufc',
    'muay thai',
    'jiu jitsu bresilien',
    'kickboxing',
    'grappling',
    'octogone',
    'taekwondo',
    'boxe anglaise',
    'boxe thai',
    'karate',
    'judo',
    'krav maga',
    'savate',
    'ngannou',
    'mcgregor',
    'low kick',
    'ceinture noire',
    'sparring',
    'protege dent',
    // Variantes EN (PANO-88) : SOLO univoques — les noms de soumissions et de techniques.
    'rear naked choke',
    'armbar',
    'triangle choke',
    'kimura',
    'heel hook',
    'kneebar',
    'darce',
    'guillotine choke',
    'omoplata',
    'berimbolo',
    'nogi',
    'bjj',
    'takedown',
    'sprawl',
    'double leg',
    'single leg',
    'ground and pound',
    'tko',
    'teep',
    'southpaw',
    'shadowboxing',
    'heavy bag',
    'open mat',
    'osoto gari',
    'uchi mata',
    'seoi nage',
  ],
  anchored: [
    'combat', // combat (figuré / militaire)
    'boxe', // verbe boxer
    'cage', // cage générique
    'garde', // garde générique
    'lutte', // combat au figuré
    'jab', // générique
    'crochet', // tricot / crochet mural
    'sambo', // prénom vs discipline
    'ko', // KO figuré (« je suis ko »)
    'esquive',
    // Variantes EN (PANO-88) : ANCRÉS.
    'guard', // le vigile / le poste de meneur au basket — le pire terme du domaine (EN)
    'mount', // monter une étagère / monter un système de fichiers / le mont (EN)
    'tap', // le robinet / payer sans contact (EN)
    'clinch', // « clinch the title » — emploi générique dans tout le sport (EN)
    'jab', // = le vaccin en anglais britannique (EN)
    'submission', // envoi d'un formulaire ou d'un article (EN)
    'choke', // s'étouffer / « choked » = a craqué (EN)
    'belt', // ceinture de sécurité / courroie (EN)
    'americana', // le genre musical (EN)
    'roll', // le petit pain / « rock and roll » (EN)
    'pass', // réussir un examen / une passe (EN)
  ],
  selfDeclared: ['combattant', 'boxeur', 'pratiquant de mma'],
};
