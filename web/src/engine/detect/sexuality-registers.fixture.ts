// Banc `sexuality` — SIX voix, et la PAIRE VÉCU/PROCHE est l'instrument. Vérité-terrain scellée.
//
// ── Ce fichier est scellé ────────────────────────────────────────────────────────────────────────
// Écrit et commité AVANT tout tour du détecteur sur ces voix. « Faux positif » n'a pas de sens sans
// un état attendu écrit d'avance, et juger après avoir vu la sortie revient à juger avec indulgence
// — une détection plausible se rationalise toujours. Le sceau est le commit.
// ⚠ SCEAU ET HISTORIQUE PUBLIÉ. La recomposition d'avant publication (2026-07-21) a aplati
// l'historique de travail : fixture et capteur y naissent dans le même commit. La preuve d'ORDRE
// ne vit plus que dans le tag local `pre-squash-2026-07-21`, non publié — dans l'historique
// publié, ce sceau se lit comme une déclaration de méthode, pas comme un fait vérifiable.
//
// ── L'ÉTAT EXACT DE LA MESURE AVANT CE FICHIER ───────────────────────────────────────────────────
// Vérifié par balayage des six fixtures scellées, pas supposé, et la formulation compte parce que la
// version approximative est plus flatteuse que la vraie :
//
//   **AUCUNE persona du corpus scellé ne porte `sexuality` — ni `lived`, ni `signalWithoutLived`,
//   dans AUCUNE des deux langues.** Le rappel de ce label n'a JAMAIS été mesuré sur une voix, pas
//   une fois, y compris dans le français livré et ratifié de longue date.
//
// Ce qui existe à la place, et qui ne s'y substitue pas : des SONDES À UN ITEM dans
// `lexicon-battery.test.ts` et `selfdeclared-language-gate.test.ts`. Une sonde établit qu'un lexème
// est câblé ; elle ne dit rien de ce qui arrive quand ce lexème est noyé dans vingt-trois items de
// vie ordinaire, ni de ce qui arrive à quelqu'un qui n'emploie jamais le lexème attendu. C'est très
// exactement l'écart que CLAUDE.md nomme (*Ce qu'un filet prouve*) : aucun banc existant ne pouvait
// rendre autre chose que zéro sur `sexuality`, parce qu'aucun n'a jamais mis le détecteur devant une
// personne. Un rapport « aucun faux positif » appuyé sur eux n'aurait rien dit du tout.
//
// ── LE COÛT D'ERREUR EST ASYMÉTRIQUE, ET ÇA CHANGE LA LECTURE DES DEUX COMPTEURS ─────────────────
// Sur les autres labels, un tort et un manque de rappel sont deux défauts de même nature. Ici non :
// un constat NOMMÉ faux sur ce label OUTE quelqu'un. Le dommage n'est pas symétrique de celui d'une
// non-détection, et aucun total ne peut absorber cette différence. C'est la raison pour laquelle la
// paire de ce lot mesure un ÉTAGE et non une présence — voir juste en dessous.
//
// Ce que ce cadrage n'autorise PAS, et le dire ici évite de l'inventer plus tard : la prudence ne
// justifie pas d'écrire des voix fades. Une voix qui n'ose rien ne mesure rien, et un banc qui ne
// mesure rien laisse le défaut vivre. Ces six personnes sont écrites avec l'ordinarité des voix
// religieuses et politiques du corpus — le produit ne dit à personne « tu es gay », il montre un
// constat, ses lectures (dont « proximité / allié ») et la preuve exacte qui l'a produit.
//
// ── POURQUOI UNE PAIRE, ET EN QUOI CELLE-CI DIFFÈRE DES DEUX PRÉCÉDENTES ─────────────────────────
// La paire POLITIQUE mesurait un écart de RAPPEL entre deux camps : un camp silencieux n'affiche
// rien, et une absence ressemble à un banc propre. La paire RELIGIEUSE mesurait un écart d'ÉTAGE
// entre pratique et culture. Celle-ci est de la seconde famille, et le dire évite de lire ses
// chiffres avec la grille de la première :
//
//   · `fr_lived_ordinary` — `lived`. Un constat NOMMÉ est légitime et attendu.
//   · `fr_ally_close`     — `signalWithoutLived`. Le tag est légitime AUSSI ; c'est le constat
//     NOMMÉ qui est le tort (sur-classification, compteur `escalated`).
//
// Les deux voix partagent la quasi-totalité du vocabulaire — un couple, une marche, une
// association, un bar, une permanence, un frère. Si le détecteur les place au MÊME étage, alors le
// produit ne distingue pas l'appartenance de la proximité, et il le fera sur des personnes réelles.
// Les deux chiffres ne s'additionnent jamais et ne se moyennent jamais : un total est précisément
// l'opération qui détruit l'écart qu'on cherche à lire.
//
// ── LA LECTURE « PROXIMITÉ / ALLIÉ » EXISTE DANS LE PRODUIT ET N'A JAMAIS ÉTÉ EXERCÉE ────────────
// `wording.fr.ts` porte trois lectures pour ce label, dont `sensitive.sexuality.reading.ally`. Elle
// est ratifiée, elle est rendue à l'utilisateur, et aucune voix scellée ne l'avait jamais mise en
// mouvement. `fr_ally_close` est écrite POUR ELLE. C'est le motif que CLAUDE.md décrit sous « trois
// lectures ratifiées vivant sans lecteur » : un texte câblé dont rien ne vérifiait qu'il soit
// atteignable.
//
// ── CE QUE LE SCEAU DE `fr_ally_close` PEUT ET NE PEUT PAS SAVOIR ────────────────────────────────
// C'est la voix la plus difficile du lot et le sceau doit énoncer sa propre limite, sans quoi il
// prétendrait à une connaissance que personne n'a.
//
// CE QUE LE SCEAU SAIT : ce que le TEXTE énonce. Elle écrit un frère gay, un mari, une compta
// d'association, une marche, une permanence. Elle écrit UNE FOIS, obliquement, qu'elle a un mari
// (item 18) et UNE FOIS qu'on la prend pour lesbienne et qu'elle répond non (item 3). Ces deux
// items sont la SEULE contre-preuve textuelle de son orientation, et ils y sont à dessein : c'est la
// quantité que porte un vrai export, pas davantage.
//
// CE QUE LE SCEAU NE PEUT PAS SAVOIR : si la proximité est distinguable de l'appartenance à partir
// d'un texte. Elle ne l'est probablement pas, et l'asymétrie qui le cause est réelle et vaut d'être
// écrite — **personne ne déclare son hétérosexualité**. Une alliée produit donc du vocabulaire dense
// et presque aucune contre-preuve, tandis que la personne concernée produit le même vocabulaire plus
// une déclaration. Le détecteur voit deux corpus quasi identiques, dont l'un porte un item de plus.
//
// **« ALLIÉE » EST UNE ASSERTION SUR LA PERSONNE, PAS SUR LE TEXTE.** C'est le fond de ce sceau. Je
// scelle selon ce que je sais d'elle en l'écrivant — la seule définition utilisable d'une
// vérité-terrain — et non selon ce que le texte permettrait de prouver. Si le détecteur la NOMME, ce
// n'est pas évidemment une bévue : c'est le produit en train de faire exactement la chose qu'il
// existe pour montrer, et le montrer ici vaut mieux que de le découvrir sur quelqu'un. **Le tort que
// je compte sur elle est l'ÉTAGE, pas le TAG.**
//
// ── LES CADRES NE PEUVENT PAS ÊTRE CALQUÉS, ET C'EST UNE LIMITE, PAS UN OUBLI ────────────────────
// La fixture politique verrouillait les cadres syntaxiques de ses huit auto-déclarations pour que
// tout écart mesuré soit imputable au LEXÈME et non au CADRE (« là où on mesure, on isole »). Cette
// technique est INAPPLICABLE ici, et il faut le dire plutôt que de laisser croire à une symétrie
// qui n'existe pas : ce que la paire fait varier EST la personne grammaticale. « ma compagne » et
// « mon frère et son mari » ne peuvent pas partager un cadre — le cadre est la variable.
//
// Ce qui EST tenu égal : 24 items de part et d'autre, même répartition commentaire/recherche (15/9),
// mêmes bandes (8 déclarations-ou-proximité, 6 communauté, 10 vie). L'isolation, elle, se déplace
// vers des SONDES À CADRE CALQUÉ dans le fichier de test — exactement le geste de la fixture
// religieuse, pour la même raison : deux personnes vraisemblables ne peuvent pas porter le calque
// intégral sans devenir deux dosages.
//
// ── LA LANGUE : QUATRE FR, DEUX EN, ET CHAQUE PLACEMENT A UN MOTIF ───────────────────────────────
// La paire partage OBLIGATOIREMENT une langue — séparée, l'écart d'étage confondrait l'état avec la
// couverture linguistique. Le français, pour la raison qui a valu aux deux paires précédentes : le
// lexique livré et ratifié, où un défaut est un défaut produit vivant.
//
// `fr_banalised` est française pour le motif qui a fait déplacer `fr_critic` en français dans le lot
// religieux : en anglais, son zéro aurait mesuré SON CONTENU et non le tri du détecteur.
//
// `fr_nonbinary_lived` est française POUR LA MÊME RAISON, et c'est le placement le plus réfléchi du
// lot. La question qu'elle pose — l'identité de genre produit-elle un constat ? — ne reçoit de
// réponse lisible que devant un lexique dont on sait qu'il fonctionne. En anglais, un silence aurait
// eu deux causes indiscernables (pas de route pour l'identité de genre / pas de couverture anglaise
// du tout), et le banc religieux a montré que la seconde est une hypothèse sérieuse.
//
// Les deux voix ANGLAISES portent chacune une question qui n'a de sens qu'en anglais :
// `en_homograph_guard` un plancher de faux positifs par homographie, `en_lived_plain` la question de
// savoir si une auto-déclaration anglaise explicite produit quoi que ce soit.
//
// ── LA BANDE PÉJORATIVE EST EXCLUE, ET SYMÉTRIQUEMENT ────────────────────────────────────────────
// `fr_banalised` écrit le vocabulaire en registre banalisé CONTEMPORAIN — affectif, ironique,
// méta-discursif. Elle n'écrit AUCUN emploi péjoratif (« c'est tellement gay » au sens de nul), et
// c'est une décision de conception, pas une pudeur. Le motif est mesurable : cet emploi-là est une
// insulte, sa maison probable est `conflictual`, et l'écrire aurait rendu tout résultat illisible —
// on n'aurait pas su si un tort venait du label mesuré ou de son voisin. C'est la même exclusion que
// la « bande civile » des lots politique et religieux, prise pour la même raison.
//
// La conséquence se déclare : CE BANC NE MESURE PAS le registre hostile, ni son rappel ni ses faux
// positifs, ni la frontière `sexuality` / `conflictual` sur ce registre. Un vert ici n'en dit rien.
//
// ── CE QUE CE BANC NE COUVRE PAS ─────────────────────────────────────────────────────────────────
// - **Le RAPPEL n'est mesuré que pour trois situations** : une femme lesbienne en couple long
//   (`fr_lived_ordinary`), une personne non binaire en transition (`fr_nonbinary_lived`), un homme
//   gay marié (`en_lived_plain`). La bisexualité, l'asexualité et la pansexualité n'apparaissent
//   dans AUCUNE voix porteuse : leur rappel est **non mesuré**, et un vert ici n'en dit rien. C'est
//   la forme exacte du trou que le lot religieux a trouvé sur les traditions, et les sondes du
//   fichier de test sont écrites pour le chercher — pas ces six voix, qui ne peuvent pas le voir.
// - **Aucune organisation, aucun sigle, aucune personnalité, aucune œuvre nommée.** Les voix se
//   déclarent par des termes ordinaires. Le rappel sur les noms propres n'est pas mesuré.
// - **Une seule voix par registre.** Six personnes ne sont pas une distribution. Aucun chiffre de ce
//   banc ne se généralise à « les personnes qui écrivent comme ça ».
// - **Les cinq autres labels ne sont pas éprouvés.** Scellés non-porteurs partout. Les items de vie
//   ont été tenus à l'écart du corps et du soin exprès — un bloc d'escalade plutôt qu'une douleur,
//   un chien qui a peur de l'orage plutôt qu'un vétérinaire, une piqûre d'abeille RETIRÉE d'une
//   version antérieure de `en_lived_plain` — parce qu'un signal `health_physical` aurait brouillé la
//   seule chose que ce banc mesure. Ce banc ne valide pas ces labels pour autant.
// - **Deux items sont des sondes de frontière déguisées, et ils sont déclarés** plutôt que laissés à
//   découvrir : `fr_lived_ordinary` #10 emploie un terme réapproprié en usage INTRA-communautaire
//   (un tag `conflictual` y serait un tort à part entière, et dirait qu'un mot repris par celles
//   qu'il visait se lit encore comme une agression) ; `fr_banalised` #4 contient une négation
//   explicite d'appartenance noyée dans du vocabulaire — la forme qui éprouve le filtre de négation.
//
// ── CE QUI A ÉTÉ LU, ET LA FUITE QUE JE DÉCLARE ──────────────────────────────────────────────────
// LU : `CLAUDE.md` ; `register-bench.ts` (types et vérité-terrain, sans données de persona) ;
// `politics-registers.fixture.ts` et `religion-registers.fixture.ts` en entier POUR LE FORMAT et
// pour leurs avertissements sur les compteurs verts trompeurs ; `religion-bench.test.ts` pour la
// LEÇON des chemins par lesquels un zéro arrive. Recherche web sur la FORME du registre — allié,
// banalisé contemporain, parental, francophone non binaire — aucune valeur rapportée : les guides
// trouvés sont en registre institutionnel prescriptif, très exactement l'inverse de la manière dont
// les gens écrivent, et ils n'ont servi qu'à cadrer ce qu'il ne fallait PAS écrire.
//
// NON LU, délibérément : `lexicon/` en entier, `filters-*.ts`, les documents de portabilité EN.
//
// FUITE DÉCLARÉE, et la déclarer est la discipline qui fonctionne, pas son échec. En vérifiant par
// `grep` qu'aucune voix scellée ne portait `sexuality` — vérification nécessaire, puisque toute la
// prémisse du lot en dépendait — j'ai vu passer des lignes de COMMENTAIRE de
// `selfdeclared-language-gate.test.ts` et de `filters-en.ts`, dont j'ai involontairement appris
// quatre choses : qu'une PORTE DE LANGUE conditionne le tier d'auto-déclaration, qu'un terme
// d'orientation vit derrière cette porte du côté français, que deux échecs anglais par HOMOGRAPHIE
// ont été réels et corrigés, et qu'un constat nommé faux sur ce label est décrit comme le coût
// d'erreur le plus élevé du produit.
//
// CE QUE LA FUITE CHANGE, converti en PRÉDICTIONS SCELLÉES plutôt que laissé agir en silence sur
// l'écriture — c'est le geste que le lot religieux a rendu, et il vaut mieux que la vertu de ne rien
// savoir :
//
//   (a) **Je m'attends à ce que `en_lived_plain` ne produise PAS de constat nommé**, alors que je la
//       scelle `lived` avec une auto-déclaration anglaise on ne peut plus explicite. Si la porte de
//       langue exige du français, une auto-déclaration anglaise est muette. Le désaccord entre ce
//       sceau et ce câblage est PRÉVU, et je scelle selon ce qui est vrai DE LA PERSONNE.
//   (b) **Je m'attends à ce que `en_homograph_guard` rende zéro** — mais par le chemin de la PORTE,
//       et peut-être aussi par celui d'une absence totale de couverture anglaise, comme le lot
//       religieux l'a établi pour son label. Deux causes, et son zéro n'en distinguera aucune. Le
//       fichier de test doit les séparer ; le compteur, lui, ne le fera pas.
//
// CE QUE LA FUITE ME RETIRE, et l'honnêteté ici coûte quelque chose : connaissant la CLASSE de
// l'échec par homographie, `en_homograph_guard` ne peut PAS prétendre l'avoir découverte. Ses cadres
// sont écrits librement et aucun ne reprend les deux formulations vues, mais elle ne mesure que la
// couverture de la porte sur des cadres choisis DANS une classe qui m'était connue. Une voix écrite
// à l'aveugle aurait eu une valeur de découverte que celle-ci n'a pas.
//
// ── Aucune valeur réelle ─────────────────────────────────────────────────────────────────────────
// Chaque chaîne est inventée (CLAUDE.md) : aucun message, pseudo, slogan, sigle, nom d'association,
// date ou identifiant réel, et aucune formulation traçable à une personne, une œuvre ou un collectif
// existants.

import { allNonCarrier, type RegisterPersona } from './register-bench';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 1. LA VIE ORDINAIRE — première moitié de la paire
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_LIVED_ORDINARY: RegisterPersona = {
  id: 'fr_lived_ordinary',
  register:
    "vie ordinaire d'une femme en couple avec une femme — l'orientation comme un fil parmi d'autres, jamais comme une personnalité",
  who: "Trente-sept ans, auxiliaire vétérinaire dans une clinique de quartier. Elle grimpe en salle deux soirs par semaine, répare des vélos le samedi pour une association, et vit depuis neuf ans avec sa compagne, qui ronfle et le nie. Elles refont la salle de bain depuis mars. Elle est lesbienne, ne l'annonce pas et ne le cache pas, et ça revient dans ce qu'elle écrit comme ça revient dans une conversation — par intermittence, à côté du reste.",
  truth: allNonCarrier({ sexuality: 'lived' }),
  truthNotes:
    "`sexuality` VÉCU, et l'état est `lived` parce que c'est LA SIENNE : elle se déclare, elle vit en couple, elle organise sa vie avec quelqu'un. Un constat NOMMÉ est ici un rappel légitime et ATTENDU — c'est la PREMIÈRE voix de tout le corpus scellé dont on puisse dire ça sur ce label, et son absence serait un défaut de rappel à publier, pas à absorber. Elle n'a été dirigée vers AUCUN terme : si elle écrit ce qu'elle écrit, c'est parce que quelqu'un dans sa situation l'écrit, pas parce que je visais un lexème. SON CHIFFRE NE SE LIT QUE CONTRE CELUI DE `fr_ally_close`, jamais seul : ce n'est pas le tag qui compte ici mais l'ÉTAGE, et un constat nommé sur elle n'est une bonne nouvelle que si l'alliée n'en obtient PAS. Seule, cette persona ne peut pas distinguer « le détecteur reconnaît une appartenance » de « le détecteur reconnaît du vocabulaire ». UN ITEM EST UNE SONDE DE FRONTIÈRE DÉCLARÉE : le #10 emploie un terme réapproprié en usage intra-communautaire, écrit par une femme qu'il désignait — `conflictual` est scellé non-porteur et un tag y serait un tort à part entière, qui dirait que le produit lit encore l'insulte là où la reprise a eu lieu. Les cinq autres labels non-porteurs ; les items de vie sont tenus hors du soin exprès — un bloc d'escalade réussi plutôt qu'une douleur, un labrador qui va bien — parce qu'un `health_physical` aurait brouillé la seule chose que ce banc mesure.",
  items: [
    // — Déclarations et couple (8) : bande de même taille que celle de l'alliée, cadres NON calqués
    //   (le cadre est la variable, cf. en-tête).
    { kind: 'comment', text: 'ma copine et moi on est ensemble depuis neuf ans, ca passe vite' },
    { kind: 'comment', text: "je suis lesbienne, je ne l'annonce pas, je le dis quand ca vient" },
    {
      kind: 'comment',
      text: "on s'est pacsees en octobre, ca a pris quinze minutes et un cafe apres",
    },
    {
      kind: 'comment',
      text: 'ma compagne ronfle et nie farouchement, c est notre seul vrai sujet',
    },
    {
      kind: 'comment',
      text: "au boulot tout le monde sait, personne n'en parle, c'est tres bien comme ca",
    },
    {
      kind: 'comment',
      text: "sa mere m'appelle sa deuxieme fille depuis trois ans, ca m'a pris du temps",
    },
    { kind: 'search', text: 'difference pacs mariage droits succession' },
    { kind: 'search', text: 'cadeau anniversaire de rencontre neuf ans idees' },
    // — Communauté (6) : écriture libre.
    { kind: 'search', text: 'bar lesbien calme ou on peut vraiment parler' },
    {
      kind: 'comment',
      text: "l'equipe de foot du dimanche est a moitie gouine et personne ne l'a decide",
    },
    { kind: 'search', text: 'librairie feministe qui organise des rencontres le samedi' },
    { kind: 'comment', text: 'on est allees a la marche, il pleuvait, on est restees quand meme' },
    { kind: 'search', text: 'association de quartier qui cherche des benevoles le week end' },
    {
      kind: 'comment',
      text: "le groupe du jeudi a change d'horaire, je vais en rater la moitie",
    },
    // — La vie (10) : rien du sujet, rien de clinique.
    { kind: 'search', text: "chaussons d'escalade qui ne font pas mal des la premiere seance" },
    { kind: 'comment', text: "j'ai enfin passe le bloc rouge, il m'aura pris six semaines" },
    { kind: 'search', text: 'changer une gaine de frein velo soi meme' },
    {
      kind: 'comment',
      text: "quatorze velos repares samedi, j'avais les mains noires jusqu'au coude",
    },
    { kind: 'search', text: 'carrelage salle de bain pose droite ou en decale' },
    {
      kind: 'comment',
      text: 'le chantier dure depuis mars, on se lave chez la voisine, elle est adorable',
    },
    { kind: 'comment', text: 'le chat de la clinique a decide que mon clavier etait son lit' },
    {
      kind: 'comment',
      text: 'un labrador a mange une chaussette entiere, il va tres bien, pas la chaussette',
    },
    { kind: 'search', text: 'recette de pain sans petrissage vraiment sans petrissage' },
    {
      kind: 'comment',
      text: "on a mange dehors hier soir, premiere fois de l'annee, il faisait dix degres",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 2. L'ALLIÉE — seconde moitié de la paire, même densité, LA VOIX QUI DÉCIDE
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_ALLY_CLOSE: RegisterPersona = {
  id: 'fr_ally_close',
  register:
    "proximité dense SANS appartenance — le même vocabulaire à la même densité, et l'orientation est celle d'un autre",
  who: "Quarante-cinq ans, comptable dans une PME de menuiserie. Elle court des semi-marathons lentement, rate son levain avec méthode, et tient depuis six ans la comptabilité d'une association qu'elle a rejointe parce que son frère y allait. Son frère est gay ; elle est hétérosexuelle et mariée à un homme depuis vingt ans. Elle est à la marche tous les ans, elle fait les banderoles chez elle, et elle connaît le vocabulaire mieux que la moitié des adhérents.",
  truth: allNonCarrier({ sexuality: 'signalWithoutLived' }),
  truthNotes:
    "`sexuality` SIGNAL SANS VÉCU, et c'est l'appel le plus difficile du corpus — il faut donc dire exactement ce qu'il prétend. LE SIGNAL EST RÉEL : elle écrit un frère gay et son mari, une association, une marche, une permanence, un vocabulaire qu'elle a appris. `signalWithoutLived` est l'état défini pour LE PROCHE, et c'est littéralement elle. Le tag est donc ATTENDU et légitime — son absence serait un défaut de rappel du signal, pas une victoire, et la lecture « proximité / allié » que porte `wording.fr.ts` est le nom que le produit donne déjà à cet état. LE TORT QUE JE COMPTE EST L'ÉTAGE : un constat NOMMÉ sur elle est une sur-classification (compteur `escalated`), parce qu'un constat nommé porte la confiance haute là où le texte ne permet qu'une lecture large — et sur CE label, un constat nommé faux oute quelqu'un. CE QUE LE SCEAU NE PEUT PAS SAVOIR : si la proximité est distinguable de l'appartenance depuis un texte. Elle ne l'est probablement pas, et la cause est structurelle — PERSONNE NE DÉCLARE SON HÉTÉROSEXUALITÉ. Elle produit donc du vocabulaire dense et presque aucune contre-preuve. J'en ai mis exactement deux, la quantité qu'un vrai export porterait : le #3 (on la prend pour lesbienne, elle répond non) et le #18 (un mari, mentionné pour une histoire de levain, jamais pour se situer). « ALLIÉE » EST UNE ASSERTION SUR LA PERSONNE, PAS SUR LE TEXTE : je scelle ce que je sais d'elle en l'écrivant, pas ce que le texte permettrait de prouver. Si le détecteur la nomme, ce n'est pas évidemment une bévue — c'est le produit en train de faire la chose qu'il existe pour montrer. ELLE SE LIT CONTRE `fr_lived_ordinary` ET JAMAIS SEULE : si les deux voix atteignent le même étage, le produit ne distingue pas la proximité de l'appartenance, et c'est le résultat que ce banc existe pour rendre visible. Cinq autres labels non-porteurs ; les items de vie sont tenus hors du soin exprès — une course lente vécue par la pluie et non par les genoux.",
  items: [
    // — Proximité et rôle (8) : même TAILLE de bande que la voix vécue, cadres non calqués.
    {
      kind: 'comment',
      text: "mon frere est gay, il me l'a dit a dix sept ans et j'ai surtout eu peur pour lui",
    },
    {
      kind: 'comment',
      text: 'je suis pas concernee, je suis juste la, ca fait six ans que je tiens la compta',
    },
    {
      kind: 'comment',
      text: 'on me demande souvent si je suis lesbienne a la marche, je reponds non et on continue',
    },
    {
      kind: 'comment',
      text: 'je connais le vocabulaire mieux que ma belle soeur et ca fait rire tout le monde',
    },
    {
      kind: 'comment',
      text: "mon frere et son mari viennent a noel depuis douze ans, c'est juste noel",
    },
    { kind: 'comment', text: "j'ai appris a dire compagnon et pas copain, ca m'a pris trois ans" },
    { kind: 'search', text: 'statuts association modification du bureau demarches' },
    { kind: 'search', text: 'dossier de subvention mairie association pieces a fournir' },
    // — Communauté (6) : écriture libre.
    { kind: 'search', text: 'cout location sono pour une marche en plein air' },
    {
      kind: 'comment',
      text: "on etait quatre cents cette annee, deux cents l'an dernier, je compte parce que c'est mon metier",
    },
    { kind: 'search', text: 'assurance responsabilite civile pour un evenement exterieur' },
    {
      kind: 'comment',
      text: "la permanence du mardi recoit des gamins de quinze ans, c'est ca le vrai boulot",
    },
    { kind: 'search', text: 'formation benevole accueil et ecoute duree' },
    {
      kind: 'comment',
      text: "on a fait les banderoles chez moi, il y avait de la peinture jusqu'au plafond",
    },
    // — La vie (10) : rien du sujet, rien de clinique.
    { kind: 'search', text: 'plan entrainement semi marathon debutant vingt semaines' },
    { kind: 'comment', text: "deux heures cinq, je suis lente et je m'en fiche completement" },
    { kind: 'comment', text: 'mon levain a arrete de monter et je le prends personnellement' },
    {
      kind: 'comment',
      text: "mon mari a jete mon levain en croyant que c'etait perime, on en parle encore",
    },
    { kind: 'search', text: 'logiciel de compta pour petite structure gratuit' },
    { kind: 'comment', text: "cloture d'exercice terminee, j'ai dormi douze heures d'affilee" },
    { kind: 'search', text: 'chaussures de course pour pronateur avis' },
    {
      kind: 'comment',
      text: "il a plu sur toute la sortie longue et j'ai adore, je ne me l'explique pas",
    },
    { kind: 'search', text: 'recette de brioche qui se conserve deux jours' },
    {
      kind: 'comment',
      text: "l'atelier sent le bois toute la journee, je ne m'en lasse pas apres onze ans",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 3. LE REGISTRE BANALISÉ — saturé du vocabulaire, et rien n'est vrai d'elle
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_BANALISED: RegisterPersona = {
  id: 'fr_banalised',
  register:
    'vocabulaire du sujet en registre BANALISÉ contemporain — mèmes, séries, méta-discours ; affectif et ironique, jamais péjoratif',
  who: "Vingt-deux ans, licence d'histoire, colocation à trois et un planning de vaisselle qui tient six jours. Elle regarde beaucoup de séries et écrit en réaction : le vocabulaire du sujet est chez elle une matière à blague, un ton, une manière de commenter une scène ou un logo. Rien de ce qu'elle écrit là-dessus ne dit quoi que ce soit d'elle, et ses amis le lisent comme ce que c'est.",
  truth: allNonCarrier(),
  truthNotes:
    "Non-porteuse sur les six, et cet état a un sens PLUS ÉTROIT qu'ailleurs — c'est le propos même de la voix. CE QUE LE SCEAU SAIT : aucun item n'énonce une appartenance, et le vocabulaire y est employé en registre banalisé — enthousiasme, ironie, commentaire d'une série, discours sur le discours. CE QUE LE SCEAU NE PEUT PAS SAVOIR : son orientation réelle, ABSENTE DU TEXTE par construction. `nonCarrier` signifie donc ici « LE TEXTE ne porte aucun signal vrai », jamais « cette personne est hétérosexuelle », et tout constat posé sur elle est un TORT quelle que soit sa vie, puisque le détecteur ne lit que le texte et que le texte n'affirme rien. C'est la voix qui empêche d'acheter du rappel avec des torts : elle est SATURÉE du vocabulaire, à densité comparable aux deux voix de la paire, sans porter la moindre appartenance. UN ITEM EST UNE SONDE DE FRONTIÈRE DÉCLARÉE : le #4 contient une négation explicite d'appartenance noyée dans du vocabulaire dense — la forme qui éprouve le filtre de négation, et la plus trompeuse, puisqu'elle parle du sujet pour dire qu'elle n'est pas concernée. LA BANDE PÉJORATIVE EST EXCLUE d'elle, à dessein et pas par pudeur : l'emploi insultant a pour maison probable `conflictual`, et l'écrire aurait rendu tout tort illisible entre les deux labels. Ce banc ne mesure donc pas ce registre, ni son rappel ni ses faux positifs.",
  items: [
    { kind: 'comment', text: "cette chanson est tellement gay je ne m'en remets pas" },
    {
      kind: 'comment',
      text: 'les gays ont encore gagne ce soir, la scene finale je suis par terre',
    },
    { kind: 'search', text: 'pourquoi tout le monde dit que ce film est un classique queer' },
    {
      kind: 'comment',
      text: "moment de panique gay total quand la serveuse a souri, je suis pas concernee, c'est juste ma personnalite",
    },
    { kind: 'comment', text: 'le discours sur cette serie est devenu plus long que la serie' },
    { kind: 'search', text: 'origine du meme pourquoi tout le monde poste ce plan' },
    {
      kind: 'comment',
      text: 'ma coloc et moi on a debattu deux heures de quel personnage est le plus lesbien, aucune source',
    },
    { kind: 'search', text: 'quiz quel personnage tu es je dois absolument savoir' },
    {
      kind: 'comment',
      text: 'chaque annee en juin mon fil devient un arc en ciel et chaque annee en juillet plus rien',
    },
    { kind: 'comment', text: "le drapeau sur le logo de la banque, j'ai ri pendant dix minutes" },
    { kind: 'search', text: 'pourquoi les marques changent de logo en juin' },
    {
      kind: 'comment',
      text: 'on a fait un tableau de qui sort avec qui dans la serie, il y a des fleches partout',
    },
    {
      kind: 'comment',
      text: 'le discours sur le discours sur cette actrice, on est trois etages plus haut, je descends',
    },
    { kind: 'search', text: "resume de la saison deux j'ai absolument tout oublie" },
    // — La vie (10).
    { kind: 'search', text: 'methode de fiches pour reviser histoire moderne' },
    { kind: 'comment', text: "partiel dans neuf jours et j'ai lu quatre pages, tout va bien" },
    { kind: 'search', text: 'coloc qui ne fait jamais la vaisselle comment aborder le sujet' },
    { kind: 'comment', text: 'on a mis un planning, il tient depuis six jours, record absolu' },
    { kind: 'search', text: 'recette de pates en une seule casserole' },
    {
      kind: 'comment',
      text: "j'ai achete un pull en friperie pour six euros et c'est ma plus grande victoire",
    },
    { kind: 'search', text: "billet de train pas cher si on s'y prend en avance" },
    { kind: 'comment', text: 'je rentre chez mes parents et ma mere a deja prevu quatre repas' },
    { kind: 'search', text: 'playlist pour reviser sans paroles' },
    {
      kind: 'comment',
      text: 'il est deux heures du matin et je regarde des videos de restauration de meubles',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 4. L'IDENTITÉ DE GENRE — porteuse, et en français à dessein
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_NONBINARY_LIVED: RegisterPersona = {
  id: 'fr_nonbinary_lived',
  register:
    "identité de genre vécue et ordinaire — de l'administratif, des proches, un métier, et aucune solennité",
  who: "Vingt-neuf ans, technicien·ne son en intermittence, non binaire, utilise iel. A changé de prénom à l'état civil après quatorze mois de démarches. Fait de la poterie avec plus d'entrain que de réussite, et vit avec un chien que les orages terrifient. Iel écrit sa transition comme un calendrier administratif et des scènes de famille, pas comme un événement.",
  truth: allNonCarrier({ sexuality: 'lived' }),
  truthNotes:
    "`sexuality` VÉCU. LE PÉRIMÈTRE DU LABEL A ÉTÉ TRANCHÉ PAR LE MAINTENEUR AVANT L'ÉCRITURE : l'identité de genre est dans le périmètre de ce label, donc un constat NOMMÉ est ici un rappel légitime et ATTENDU, et son absence est un défaut de rappel sans ambiguïté — pas un cadrage discutable. Cette voix est FRANÇAISE et c'est le placement le plus réfléchi du lot : la question qu'elle pose ne reçoit de réponse lisible que devant un lexique dont on sait par ailleurs qu'il fonctionne. En anglais, un silence aurait eu deux causes indiscernables — pas de route pour l'identité de genre, ou pas de couverture anglaise du tout — et le lot religieux a établi que la seconde est une hypothèse sérieuse. C'est la correction que le mainteneur avait rendue sur `fr_critic`, appliquée d'avance plutôt que découverte après la mesure. CE QUE CETTE VOIX NE PEUT PAS MONTRER, et il faut l'écrire pour qu'on ne la sur-cite pas : elle est UNE personne non binaire employant UN pronom et UN registre. Si elle déclenche, cela ne dit rien de la couverture des autres formulations, des autres pronoms, ni des personnes trans binaires — c'est la forme exacte du trou que le lot religieux a trouvé sur les traditions, et seules les sondes du fichier de test peuvent le chercher. Les cinq autres labels non-porteurs ; les items de vie sont tenus hors du soin exprès, et l'administratif médical est écrit du côté des PAPIERS et jamais du corps, faute de quoi `health_physical` brouillerait la mesure.",
  items: [
    // — Déclarations et démarches (8).
    { kind: 'comment', text: 'je suis non binaire, j utilise iel, ca prend trois secondes a dire' },
    {
      kind: 'comment',
      text: "j'ai change de prenom a l'etat civil en mars, ca aura pris quatorze mois",
    },
    {
      kind: 'comment',
      text: 'ma tante a mis un an a dire iel et maintenant elle corrige les autres, je fonds',
    },
    {
      kind: 'comment',
      text: 'on me genre au feminin au telephone et au masculin sur place, je trouve ca drole maintenant',
    },
    {
      kind: 'comment',
      text: "je suis en transition depuis quatre ans, ce n'est pas un evenement, c'est un calendrier",
    },
    { kind: 'search', text: 'changement de prenom acte de naissance delai en mairie' },
    { kind: 'search', text: 'papiers qui ne correspondent pas au prenom d usage en voyage' },
    {
      kind: 'comment',
      text: "j'ai donne la moitie de mes vetements et rachete la meme chose en autre coupe",
    },
    // — Communauté (6).
    { kind: 'search', text: 'groupe de parole qui se voit vraiment en presentiel' },
    {
      kind: 'comment',
      text: "le local a change d'adresse et personne n'a prevenu, on etait six devant une porte",
    },
    { kind: 'search', text: 'medecin generaliste qui ne pose pas de questions bizarres' },
    {
      kind: 'comment',
      text: 'on a fait un repas partage samedi, quarante personnes et trois tables',
    },
    { kind: 'search', text: 'ou trouver un groupe qui accueille les gens qui debarquent' },
    {
      kind: 'comment',
      text: "un collegue m'a defendu en reunion sans que je demande rien, je n'ai rien dit sur le moment",
    },
    // — La vie (10) : rien du sujet, rien de clinique.
    { kind: 'search', text: 'micro cravate qui ne prend pas le vent en exterieur' },
    {
      kind: 'comment',
      text: 'douze heures de montage hier et le client a demande de tout refaire',
    },
    { kind: 'search', text: 'emaux ceramique cuisson basse temperature pour debutant' },
    { kind: 'comment', text: "j'ai rate quatre bols et reussi un cendrier que personne ne veut" },
    { kind: 'search', text: 'chien qui panique aux orages ce qui marche vraiment' },
    { kind: 'comment', text: "il s'est cache dans la baignoire pendant tout l'orage, encore" },
    { kind: 'search', text: 'declaration intermittent heures a declarer periode' },
    { kind: 'comment', text: 'le tour de potier est arrive, mon salon a retreci de moitie' },
    { kind: 'search', text: 'casque de monitoring pas cher qui tient huit heures' },
    {
      kind: 'comment',
      text: 'on a fini le festival a quatre heures du matin et je recommencerais demain',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 5. L'HOMOGRAPHIE — première garde anglaise, et ce qu'elle ne peut pas prétendre découvrir
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const EN_HOMOGRAPH_GUARD: RegisterPersona = {
  id: 'en_homograph_guard',
  register:
    'anglais saturé de mots qui ONT un sens dans ce domaine et ne le portent jamais ici — fléchettes, mots croisés, menuiserie, jardin',
  who: 'Mid fifties, plays in a darts league on Thursdays, edits a forty-two subscriber allotment newsletter, does the crossword in pen out of pure hubris, and builds sheds that are very nearly square. Married to a woman for a long time. Nothing he writes is about this subject at all; his vocabulary simply overlaps with it, the way ordinary vocabulary does.',
  truth: allNonCarrier(),
  truthNotes:
    "Non-porteuse sur les six, et c'est le plancher de faux positifs par HOMOGRAPHIE : chaque item porte un mot qui a un sens dans ce domaine et n'y renvoie jamais ici — un lancer parfait, une parution tous les deux mois, une arête droite, une sortie de retraite, un mot croisé dont la definition est « bizarre », un puriste. Tout constat `sexuality`, nommé OU large, est un tort. CE QUE CETTE VOIX NE PEUT PAS PRÉTENDRE, et l'honnêteté coûte ici quelque chose : la CLASSE de cet échec m'était connue par la fuite déclarée en tête de fichier. Ses cadres sont écrits librement et aucun ne reprend les formulations vues, mais elle ne mesure que la couverture d'une porte sur des cadres choisis DANS une classe connue — une voix écrite à l'aveugle aurait eu une valeur de découverte que celle-ci n'a pas. PRÉDICTION SCELLÉE : je m'attends à ce qu'elle rende zéro, et le zéro aura DEUX causes possibles qu'elle ne distinguera pas — la porte de langue fait son office, ou l'anglais n'a aucune couverture sur ce label, comme le lot religieux l'a établi pour le sien. Un zéro ici mesurera donc peut-être SON CONTENU et non le tri du détecteur ; c'est au fichier de test de séparer les deux chemins, et le compteur ne le fera pas. Cinq autres labels non-porteurs.",
  items: [
    { kind: 'search', text: 'how to keep a saw cut straight over a long board' },
    { kind: 'comment', text: 'he threw an absolute ace in the final leg and then missed twice' },
    { kind: 'comment', text: 'the newsletter goes out bi monthly now, monthly was killing me' },
    { kind: 'search', text: 'crossword clue queer meaning odd four letters' },
    {
      kind: 'comment',
      text: 'she came out of retirement to win the league at sixty one, brilliant',
    },
    { kind: 'search', text: 'straight edge tool for marking timber which one to buy' },
    {
      kind: 'comment',
      text: 'i am a bit of a purist about the oche and everyone finds me tedious',
    },
    { kind: 'search', text: 'how to come out of a slump when your average drops' },
    { kind: 'comment', text: 'the allotment committee is now openly at war over hosepipes' },
    { kind: 'comment', text: 'my darts partner is dead straight under pressure and i am not' },
    { kind: 'search', text: 'best pen for filling in a grid without bleeding through' },
    {
      kind: 'comment',
      text: 'took me four days to crack that puzzle and the answer was fairy lights',
    },
    { kind: 'search', text: 'planing a board flat by hand without a jointer' },
    { kind: 'comment', text: 'the shed is finished and it is square, which i did not expect' },
    { kind: 'search', text: 'when to sow broad beans in a cold spring' },
    { kind: 'comment', text: 'eleven marrows. nobody wants marrows. i have learned nothing' },
    { kind: 'search', text: 'league fixture software that is not just a spreadsheet' },
    {
      kind: 'comment',
      text: 'we lost on a last leg decider and i have thought about nothing since',
    },
    { kind: 'search', text: 'sharpening chisels honing angle for beginners' },
    {
      kind: 'comment',
      text: 'the newsletter has forty two subscribers and i know all their names',
    },
    { kind: 'search', text: 'cheap dartboard surround that actually protects the wall' },
    { kind: 'comment', text: 'my wife has banned the crossword at breakfast and she is right' },
    { kind: 'search', text: 'compost bin that keeps rats out properly' },
    { kind: 'comment', text: 'i have started doing the puzzle in pen. hubris' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 6. L'AUTO-DÉCLARATION ANGLAISE — porteuse, et scellée CONTRE une prédiction
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const EN_LIVED_PLAIN: RegisterPersona = {
  id: 'en_lived_plain',
  register:
    "auto-déclaration anglaise on ne peut plus explicite, dans une vie ordinaire — la voix qui éprouve si l'anglais produit quoi que ce soit",
  who: 'Early forties, works in warehouse logistics and says so in meetings when the shift pattern is unhinged. Keeps two hives and gives away most of the honey. Married to a man for six years, together for eleven, out since he was nineteen. He walks with a group of men over forty and calls it the best thing he does.',
  truth: allNonCarrier({ sexuality: 'lived' }),
  truthNotes:
    "`sexuality` VÉCU, et l'état est `lived` sans la moindre hésitation : il se déclare en toutes lettres au premier item, il est marié, il vit sa vie. Un constat NOMMÉ est un rappel légitime et ATTENDU. PRÉDICTION SCELLÉE D'AVANCE, appuyée sur la fuite déclarée en tête de fichier : JE M'ATTENDS À CE QU'IL NE PRODUISE PAS DE CONSTAT NOMMÉ, une porte de langue conditionnant le tier d'auto-déclaration et un terme d'orientation vivant derrière elle du côté français. Si la porte exige du français, l'auto-déclaration la plus explicite qu'on puisse écrire en anglais est muette. Le désaccord entre ce sceau et ce câblage est donc PRÉVU et délibéré : je scelle selon ce qui est vrai DE LA PERSONNE et non selon ce que je crois savoir du lexique — c'est la seule définition utilisable d'une vérité-terrain, et c'est ce qui rend le résultat lisible. SI LA PRÉDICTION SE VÉRIFIE, le manque de rappel n'est PAS une curiosité de banc : il dit qu'une personne anglophone qui écrit son orientation en clair ne reçoit aucune carte, là où une francophone en reçoit une. C'est une asymétrie de traitement entre deux utilisateurs, et une non-détection n'affiche RIEN — c'est le défaut du lot politique transposé d'un clivage à une langue. La note de mesure devra dire si le produit assume cette asymétrie, et non l'enregistrer en silence. Cinq autres labels non-porteurs ; une piqûre d'abeille figurait dans une version antérieure de la bande de vie et a été RETIRÉE, parce qu'elle fabriquait un `health_physical` au milieu de la seule voix porteuse anglaise du lot.",
  items: [
    // — Déclarations et couple (8).
    {
      kind: 'comment',
      text: 'i am gay, i have been out since i was nineteen, it is not news to anyone',
    },
    {
      kind: 'comment',
      text: 'my husband and i have been together eleven years and he still loads the dishwasher wrong',
    },
    {
      kind: 'comment',
      text: 'we got married in a registry office on a tuesday with four people there',
    },
    { kind: 'comment', text: 'i came out to my dad in a car park and he said right, chips?' },
    {
      kind: 'comment',
      text: 'at work nobody cares which is exactly what i wanted and it took years',
    },
    { kind: 'search', text: 'same sex couple joint mortgage application what changes' },
    { kind: 'search', text: 'anniversary present for a husband who buys everything himself' },
    { kind: 'comment', text: 'his mother calls me her son now and i had to leave the room' },
    // — Communauté (6).
    { kind: 'search', text: 'quiet gay bar where you can actually hear people talk' },
    {
      kind: 'comment',
      text: 'the walking group is mostly men over forty and it is the best thing i do',
    },
    { kind: 'search', text: 'lgbt sports club joining fee and training nights' },
    { kind: 'comment', text: 'we went to pride, it rained, we stayed, we always stay' },
    { kind: 'search', text: 'volunteer helpline training weekend how much commitment' },
    {
      kind: 'comment',
      text: 'someone at the group was nineteen and terrified and i remembered exactly that',
    },
    // — La vie (10) : rien du sujet, rien de clinique.
    { kind: 'search', text: 'how to stop a hive swarming in late spring' },
    { kind: 'comment', text: 'twenty pounds of honey this year and i have given most of it away' },
    { kind: 'search', text: 'warehouse racking safety inspection how often is it required' },
    { kind: 'comment', text: 'the new shift pattern is unhinged and i said so in the meeting' },
    { kind: 'search', text: 'bee suit that does not cook you in july' },
    { kind: 'comment', text: 'the smoker went out twice and the bees noticed both times' },
    { kind: 'search', text: 'beeswax candle moulds where to buy' },
    {
      kind: 'comment',
      text: 'i have read three books about bees and know less than when i started',
    },
    { kind: 'search', text: 'cheap flights to somewhere with mountains in september' },
    { kind: 'comment', text: 'we drove four hours to see a hill and it was worth every minute' },
  ],
};

/**
 * Les six voix, et leurs trois rôles distincts — qu'un rapport ne doit jamais confondre.
 *
 * `fr_lived_ordinary` et `fr_ally_close` forment la PAIRE, et seul l'écart d'ÉTAGE entre elles a un
 * sens. Elles ne se somment ni ne se moyennent jamais. Attention au piège propre à CETTE paire, qui
 * est celui de la paire religieuse et non celui de la paire politique : les deux voix ATTENDENT un
 * tag, donc deux cellules vertes au compteur de rappel sont le résultat NORMAL et ne prouvent rien
 * du tout. Ce qui se lit est la distance entre les deux étages — et si elle est nulle, le produit ne
 * distingue pas la proximité de l'appartenance.
 *
 * `fr_banalised` et `en_homograph_guard` sont des GARDES et non une paire : elles ne s'opposent pas
 * l'une à l'autre, elles mesurent chacune un plancher de faux positifs contre un mécanisme différent
 * — le registre banalisé pour la première, l'homographie anglaise pour la seconde. Leurs chiffres ne
 * se somment pas : la première est en français, là où le vocabulaire existe, donc son chiffre mesure
 * le tri du détecteur ; la seconde est en anglais, et son zéro éventuel mesurera d'abord son propre
 * contenu tant que la couverture anglaise n'est pas établie par un autre chemin que ce banc.
 *
 * `fr_nonbinary_lived` et `en_lived_plain` sont des voix de RAPPEL isolées, chacune posant une
 * question qu'aucune autre ne pose : la première si l'identité de genre trouve une route, la seconde
 * si une auto-déclaration anglaise en trouve une. Toutes deux sont scellées `lived` et toutes deux
 * peuvent rendre un manque de rappel — un manque n'affiche RIEN, et c'est précisément pourquoi elles
 * sont écrites.
 */
export const SEXUALITY_REGISTER_PERSONAS: readonly RegisterPersona[] = [
  FR_LIVED_ORDINARY,
  FR_ALLY_CLOSE,
  FR_BANALISED,
  FR_NONBINARY_LIVED,
  EN_HOMOGRAPH_GUARD,
  EN_LIVED_PLAIN,
];
