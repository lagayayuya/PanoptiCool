// Lexique `conflictual` (PANO-71 graine → PANO-36 enrichi) — item-level (B5) : l'insulte ÉMISE
// visant un autre utilisateur EST le signal ; pas d'étage indirect, pas d'éventail (PANO-70 §1.4).
// Critique d'idée JAMAIS taguée conflictual (décision D) ; opinion politique → politics, pas ici.
// La frontière est portée par la MACHINERIE (cible 2ᵉ personne exigée + filtre citation), pas par
// les mots : c'est pourquoi un terme d'agression n'entre QUE s'il vise une personne.
//
// ── Justification de généricité (discipline PANO-70 §3, §2.5) ─────────────────────────────────
// Insultes interpersonnelles du FR courant EN LIGNE, tous registres, écrites à l'aveugle depuis
// l'usage commun, jamais depuis un export :
//   · familier : abruti, crétin, imbécile, blaireau, guignol ;
//   · vulgaire : ordure, enfoiré, raclure, salopard ;
//   · slurs genrés et validistes (salope, enculé, attardé, mongol…) : RÉELS et massifs en ligne —
//     les détecter, c'est montrer ce qu'une plateforme lit ; la sécurité vit dans le GRILLAGE
//     d'affichage — le constat démarre replié, derrière un badge « sensible » (ADR-0003) — pas dans
//     un lexique amputé ;
//   · insultes homophobes et anti-croyant INTERPERSONNELLES (PANO-72) : elles visent une PERSONNE
//     dans l'échange (frontière sexuality/religion → conflictual). Le slur de GROUPE dans l'absolu
//     n'entre nulle part (futur label dédié, signalé, jamais tranché seul) ;
//   · abréviations SMS d'agression (tg, ftg, ntm, fdp).
// Toutes visent une PERSONNE (jamais une idée, jamais un groupe) et n'entrent que couplées à une
// cible 2ᵉ personne.
// Chaque terme aurait été écrit à l'identique sans avoir vu aucun export.
// ───────────────────────────────────────────────────────────────────────────────────────────────
//
// Entrées NORMALISÉES (minuscules, sans accents). Auto-censure (« c*nne »), allongements
// (« abruuuti ») et pluriels sont couverts par la machinerie — jamais listés ici.
//
// ── `targets` porte des CONSTRUCTIONS d'adresse, jamais un pronom nu ───────────────────────────
// Règle d'écriture de ce tableau, valable pour toute langue admise ici. En français elle est sans
// objet — `toi` n'adresse que quelqu'un. En anglais le pronom de 2ᵉ personne est AUSSI
// l'impersonnel : « you should get your gland checked » ne s'adresse à personne, c'est un conseil
// au monde. Mesuré à l'ouverture de l'EN, à termes identiques : avec `you` nu, 14 items anglais
// innocents sur 14 taguent ; avec les seules constructions ancrées (copule, présentatif,
// impératif), 0 sur 14. Le même jeu de mots passe de « tague tout » à « ne tague rien d'innocent »
// sans qu'une ligne de code change — c'est pourquoi ce lot n'a introduit AUCUN mécanisme.
//
// ── SIX ENTRÉES FR RETIRÉES à l'ouverture de l'EN — et pourquoi elles ne reviennent pas seules ──
// `con`, `clown`, `loser`, `gland`, `tache`, `bigot` matchaient de l'anglais ORDINAIRE : « the pros
// and cons » (le pluriel du matcher fait le reste), « your thyroid gland », « growing a tache »
// (BrE), « being a bigot about this policy ». Quatre d'entre elles sont des collisions PURES — le
// mot anglais n'a aucun rapport avec le sens français, et aucune agression n'est en jeu.
//
// Elles étaient INERTES tant que `targets` était FR : le ET ne trouvait jamais son second membre.
// Ce sont les cibles EN ci-dessous qui les auraient ACTIVÉES — le lot a d'abord été livré ainsi, et
// six faux positifs ont vécu quelques commits sur le seul label sans éventail de lectures. C'est la
// leçon à ne pas reperdre : sous une conjonction, ouvrir la SECONDE liste active tout ce que la
// première portait en dormance (ADR-0003, *L'admission d'un terme*).
//
// L'ablation a été rendue plutôt qu'assumée (arbitrage yuya) : accepter un tort connu sur un label
// sans filet vaut moins que perdre un rappel qu'on peut re-mesurer. Ce qu'elle coûte, dit
// franchement — le rappel n'est PAS nul : « t'es vraiment con », « t'es qu'un clown » et
// « t'es qu'un bigot » ne sont plus lus. `connard`/`conne`/`connasse`/`sale con`, `guignol`,
// `bouffon`, `looser`, `bigote` et `grenouille de benitier` couvrent le registre, jamais ces
// surfaces-là. Et le label étant item-level, le constat SURVIT dès qu'un second item de la même
// voix porte un autre terme : le coût se concentre entièrement sur la voix qui insulte UNE SEULE
// FOIS, avec ce mot-là.
//
// Le retrait est RÉVERSIBLE et se re-mesure : quatre voix scellées d'agression et de vanne (deux
// FR, deux EN) sont en cours d'écriture en aveugle, parce que ce label n'a jamais eu de contrôle
// positif dans aucune des deux langues — 17 voix scellées, 476 items, zéro constat `conflictual`.
// Le jour où elles atterrissent, la question qui décide est celle d'ADR-0003 : *ces termes
// portent-ils un rappel que rien d'autre ne porte ?*
//
// ── Ce que l'export ne porte pas, et qui décide ici ────────────────────────────────────────────
// « you're such an idiot » entre amis et les mêmes mots visant un inconnu sont le MÊME texte : ce
// qui les sépare est la relation, qu'un commentaire d'export ne montre pas (il répond à une vidéo
// que personne ne peut voir). Aucun filtre ne peut donc les départager — ni négation, ni citation,
// ni 3ᵉ personne. La réponse n'est pas un mécanisme, c'est un VOLUME : le lot EN est délibérément
// petit, et n'admet pas le registre familier dont l'amitié fait un usage massif (`idiot`, `dumb`,
// `silly` ne sont PAS admis en EN — ce sont les mots de la vanne autant que ceux de l'attaque).
// Ce pari n'a PAS suffi, et le banc de ce label l'a montré : la vanne écrit le vocabulaire hostile,
// et c'est la GARDE de cible qui la sélectionne (dette au catalogue §4). Le volume réduit limite le
// nombre de torts, il n'en change pas la nature.
// Doctrine : ADR-0003, *La limite que la donnée ne lève pas*.

import type { ItemLevelLexicon } from './types';

export const CONFLICTUAL_LEXICON: ItemLevelLexicon = {
  kind: 'item-level',
  label: 'conflictual',
  insults: [
    // Familier / courant.
    'abruti',
    'debile',
    'connard',
    'bouffon',
    'conne',
    'connasse',
    'cretin',
    'cretine',
    'idiot',
    'idiote',
    'imbecile',
    'blaireau',
    'tocard',
    'tocarde',
    'guignol',
    'minable',
    'pauvre type',
    'pauvre fille',
    'bon a rien',
    'moins que rien',
    'rate',
    'ratee',
    'naze',
    'nul a chier',
    'nullos',
    'rigolo',
    'mythos',
    'looser',
    'boloss',
    'stupide',
    'teube',
    // Vulgaire.
    'grosse merde',
    'sale merde',
    'pauvre merde',
    'sale con',
    'sale conne',
    'ordure',
    'raclure',
    'pourriture',
    'salopard',
    'enfoire',
    'batard',
    // Impératifs injurieux (adressent par construction — aussi listés dans `targets`).
    'ta gueule',
    'ferme la',
    'va crever',
    'mange tes morts',
    // Slurs genrés (décision yuya : gardés).
    'salope',
    'petasse',
    'pouffiasse',
    'encule',
    'fils de pute',
    'nique ta mere',
    // Slurs validistes (décision yuya : gardés).
    'attarde',
    'attardee',
    'gogol',
    'mongol',
    // Insultes homophobes INTERPERSONNELLES (PANO-72, arbitrage yuya : visant une PERSONNE dans
    // l'échange, gated par la cible 2ᵉ pers.). Le slur de GROUPE dans l'absolu n'entre nulle part
    // (futur label dédié, signalé) — ces termes ne comptent QUE couplés à une adresse.
    'pede',
    'tapette',
    'tarlouze',
    'gouine',
    'fiotte',
    // Insultes anti-croyant INTERPERSONNELLES (même règle : personne, pas groupe ni idée).
    // `bigot` (masculin) est RETIRÉ — homographe du mot anglais courant, cf. l'en-tête. La frontière
    // religion → conflictual reste portée par les deux entrées ci-dessous ; c'est la surface
    // masculine qui est perdue, et c'est le retrait le plus cher des six.
    'bigote',
    'grenouille de benitier',
    // Abréviations SMS d'agression.
    'tg',
    'ftg',
    'vtff',
    'fdp',
    'ntm',
    // ── (EN) — le registre dont l'AGRESSION est l'usage dominant, et lui seul ──────────────────
    // Onze formes — huit d'insulte et trois impératifs — contre soixante-huit en FR, à dessein
    // (cf. l'en-tête : la vanne et l'agression sont
    // le même énoncé). Écartés au même endroit, et l'exclusion porte la doctrine : `dumb` nu
    // (« dumb luck », l'auto-dépréciation), `ass`/`arse` nus (`badass` est un compliment), `sad`
    // (« that is a sad story »), `weirdo`/`creep`/`jerk` (« the creep of the deadline », « you jerk
    // the handle upwards »), `trash`/`garbage`/`mid`/`washed`/`cooked` (ils qualifient une
    // performance, pas une personne), `cope`/`seethe`/`ratio`/`touch grass` (joute ludique, et la
    // surface par laquelle l'invective POLITIQUE entrerait — dette nommée), `crazy`/`insane`/
    // `psycho` (intensificateurs, et argot validiste). `narcissist` et `schizo` n'entrent pas :
    // nom de trouble devenu insulte générique (ADR-0003, *L'admission d'un terme*). `gaslighting`
    // décrit un COMPORTEMENT, pas une personne — hors de la porte de ce label. `triggered`
    // FRANCHIRAIT la porte, et c'est exactement pourquoi il reste dehors : il ne distingue pas la
    // moquerie politique de l'agression, et la moquerie a été retirée de `politics` pour ne pas
    // atterrir ici.
    // Les slurs homophobes et validistes EN sont HORS de ce lot : coût d'erreur maximal, décision
    // explicite due (le FR les porte sur arbitrage nommé), taux de FP EN inconnu. Dette nommée.
    'stupid',
    // `moron` RETIRÉ après sa première mesure en aveugle : sur le banc de ce label, il ne se
    // déclenche sur AUCUN des 26 items de la voix hostile, et une fois sur la voix affectueuse, à
    // l'étage NOMMÉ. Rappel mesuré nul, tort mesuré à un — l'inverse de ce qu'un terme doit rendre.
    // `moronic` reste : il qualifie une idée bien plus qu'une personne, la vanne ne l'emploie pas de
    // la même façon, et la garde de cible l'empêche de tagger « this take is moronic ». Il n'est
    // pour autant PAS mesuré — aucune voix scellée ne l'écrit, et c'est dit plutôt que présumé.
    'moronic',
    'dumbass',
    'jackass',
    'asshole',
    'arsehole', // double graphie US/BrE : le matcher ne les relie pas
    'pathetic',
    'braindead',
    // Impératifs injurieux EN (adressent par construction — aussi listés dans `targets`, même
    // précédent que « ta gueule »). Écartés : `stop it`, `leave me alone` — défensifs, écrits par
    // qui SUBIT ; les taguer inverserait la victime et l'auteur.
    'shut up',
    'nobody asked',
    'get lost',
  ],
  // Cible 2ᵉ personne. Les impératifs injurieux y figurent AUSSI (l'impératif adresse par
  // construction, décision yuya) — sans quoi « ta gueule » nu ne serait jamais tagué.
  targets: [
    "t'es",
    'tu es',
    'espece de',
    'degage',
    "t'as",
    'tu as',
    'toi',
    'casse toi',
    'va te faire',
    'va crever',
    'tu connais rien',
    "personne t'a sonne",
    'ta gueule',
    'ferme la',
    'mange tes morts',
    'nique ta mere',
    'tg',
    'ftg',
    'vtff',
    'ntm',
    // ── (EN) — constructions ANCRÉES, jamais le pronom nu (cf. la règle en en-tête) ────────────
    // Écartés au même endroit : `you` / `u` / `ur` nus (l'impersonnel anglais — 14/14 items
    // innocents taguent) ; `bro`, `mate`, `bruv`, `y'all` (vocatifs d'AFFILIATION : ils marquent le
    // lien, et la vanne les emploie infiniment plus que l'agression) ; `people like you`,
    // `everyone who` (ils adressent une CLASSE, pas un interlocuteur — le slur de groupe dans
    // l'absolu n'entre nulle part, cf. plus haut).
    "you're",
    'youre',
    'you are',
    'ur a',
    'you sound',
    'you look like',
    'shut up',
    'nobody asked',
    'get lost',
  ],
};
