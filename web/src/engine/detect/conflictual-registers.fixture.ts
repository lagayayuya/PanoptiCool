// Banc de faux positifs `conflictual` — QUATRE voix, deux par langue, et leur VÉRITÉ-TERRAIN.
//
// ── Ce fichier est scellé ────────────────────────────────────────────────────────────────────────
// Écrit et commité AVANT toute lecture du lexique `conflictual` et AVANT le premier tour du
// détecteur. C'est sa seule propriété qui compte : « faux positif » n'a pas de sens sans un état
// attendu écrit d'avance, et juger après avoir vu la sortie revient à juger avec indulgence — une
// détection plausible se rationalise toujours. Le sceau est le commit ; le relire dans l'historique
// est la seule façon de vérifier que la vérité-terrain n'a pas été ajustée à la mesure.
// ⚠ SCEAU ET HISTORIQUE PUBLIÉ. La recomposition d'avant publication (2026-07-21) a aplati
// l'historique de travail : fixture et capteur y naissent dans le même commit. La preuve d'ORDRE
// ne vit plus que dans le tag local `pre-squash-2026-07-21`, non publié — dans l'historique
// publié, ce sceau se lit comme une déclaration de méthode, pas comme un fait vérifiable.
//
// ── Pourquoi ces voix existent ───────────────────────────────────────────────────────────────────
// AUCUNE voix scellée d'aucun banc n'émet d'agressivité, dans AUCUNE des deux langues. Mesuré, pas
// supposé : un tour complet du détecteur sur les 17 voix et 476 items déjà scellés rend zéro sur
// `conflictual`. La détection d'agressivité du produit n'a donc jamais été mesurée — ni en rappel,
// ni en faux positif — et ce trou-là est dans le produit FRANÇAIS livré, pas seulement en anglais.
//
// Un rapport « aucun faux positif sur `conflictual` » appuyé sur les bancs existants ne dirait rien
// du tout : le détecteur n'a simplement jamais été mis devant le sujet. C'est le motif nommé par
// CLAUDE.md (*Ce qu'un filet prouve*) — une assertion négative vérifie ce qu'elle ATTEINT, pas ce
// qu'elle affirme.
//
// ── La variable est la RELATION, et c'est pour ça que les mots se recouvrent ──────────────────────
// Le banc EN de `mental_health` fait varier la façon d'écrire ; le banc du corps fait varier à qui
// la maladie appartient. Ce banc-ci fait varier la RELATION entre celle qui écrit et celle à qui
// elle écrit — une inconnue, ou une amie de dix ans.
//
// La littérature sociolinguistique offre deux séparateurs entre l'insulte hostile et l'insulte
// rituelle : l'un tient au CONTENU (l'insulte rituelle avance des propositions absurdes, que
// personne ne tient pour vraies ; l'insulte hostile avance des propositions plausibles), l'autre
// tient au DESTINATAIRE (dans le groupe, les mêmes termes changent de valeur). Un seul des deux est
// invisible à l'export, et c'est le second.
//
// D'où la contrainte d'écriture, qui est le banc tout entier : DANS CHAQUE LANGUE, LES DEUX VOIX
// PORTENT LE MÊME VOCABULAIRE D'INSULTE — nul, débile, abruti, incompétent, pitoyable ; useless,
// idiot, moron, rubbish, pathetic. Pas des quasi-synonymes : les mêmes mots. L'hyperbole absurde est
// délibérément MINIMISÉE chez la voix de vanne, parce qu'elle vit dans le texte et offrirait au
// détecteur une porte de sortie — un vert obtenu parce que les MOTS diffèrent ne dirait rien de sa
// capacité à distinguer, et serait exactement le faux filet que ce dépôt a observé sept fois.
//
// Ce que l'export ne porte pas, le harnais le confirme : `detectFor` ne transmet que
// `items.map(i => i.text)`. Ni destinataire, ni fil, ni réciprocité. Le prénom d'une amie n'est
// qu'un token de plus.
//
// ── COMMENT LIRE UN ZÉRO SUR LES VOIX DE VANNE, ET C'EST LE POINT DU BANC ────────────────────────
// Un zéro de tort sur `fr_banter` ou `en_banter` ne signifie « aucun faux positif » QUE SI la voix
// d'agressivité de la même langue s'est déclenchée sur ces mêmes mots partagés. Sinon le zéro dit
// seulement « ces mots ne sont pas au lexique », le recouvrement était illusoire, et les deux zéros
// ont la même cause — celle du non-porteur n'est pas la sienne.
//
// C'est la même lecture que celle du banc du corps entre `living` et `worrier`, et c'est pourquoi la
// PAIRE est la mesure. Les deux chiffres d'une paire répondent à des questions opposées et NE SE
// FUSIONNENT JAMAIS dans un rapport.
//
// ── CE QUE CE BANC NE COUVRE PAS ─────────────────────────────────────────────────────────────────
// - **Les injures identitaires (racistes, homophobes, et toute autre visant une appartenance) sont
//   ABSENTES de ce fichier, par décision du mainteneur.** Les quatre voix insultent la compétence,
//   l'intelligence et le goût — c'est le registre écrit ici, et c'est le seul. Si le lexique
//   `conflictual` couvre des injures identitaires, CE BANC NE LE MESURE PAS : ni leur rappel, ni
//   leurs faux positifs. Un vert ici ne dit rien de ce périmètre-là, et l'écrire est le seul moyen
//   d'empêcher que « `conflictual` est mesuré » se dise un jour en s'appuyant sur ces quatre voix.
// - **Le registre n'est pas varié.** Les quatre voix écrivent court, en minuscules, sans
//   ponctuation forte. Une agressivité soutenue, ironique ou administrative n'est pas éprouvée.
// - **Les cinq autres labels ne sont pas éprouvés.** Ils sont scellés non-porteurs partout, et cette
//   absence est un choix : voir `truthNotes` de `fr_contempt` pour l'item tenu au bord de
//   `politics`, sciemment.
// - **Aucune menace, aucun harcèlement dirigé, aucune violence.** L'agressivité écrite ici est du
//   mépris ordinaire en commentaire public. Le haut de l'échelle n'est pas dans ce banc.
//
// ── CE QUI A ÉTÉ LU, et c'est la garantie ────────────────────────────────────────────────────────
// LU : `CLAUDE.md` ; `register-bench.ts` (types et vérité-terrain, sans données) ;
// `register-bench.harness.ts` (la mécanique de comptage) ; `fr-registers.fixture.ts`,
// `fr-fp-bench.test.ts`, l'en-tête de `en-body-fp-bench.test.ts`, et les seuls en-tête et bloc
// d'export de `en-registers.fixture.ts` et `en-body-registers.fixture.ts` — POUR LEUR FORME,
// c'est-à-dire comment une voix se déclare et comment sa vérité-terrain s'inscrit.
//
// NON LU, à dessein : aucun module de `lexicon/`, aucune liste de termes, aucun fichier
// `filters-*.ts`, aucune note de portabilité, aucun message d'historique portant sur le lexique ou
// les filtres. La valeur de ce fichier tient à ce que son auteur ignore quels termes sont à l'étude.
//
// FUITE À DÉCLARER, et sa portée est ce qui compte ici : `fr-fp-bench.test.ts`, dont la lecture
// était nécessaire à la forme, NOMME dans ses commentaires six formulations colloquiales du tier FR
// et plusieurs surfaces de détection. Ce sont des termes de `mental_health`, pas de `conflictual`.
// **Aucun fichier lu ne nomme un seul terme `conflictual`, ni ne décrit son lexique** — c'est cette
// seconde affirmation, et non la première, qui donne son sens au sceau pour CE label.
//
// ── Aucune valeur réelle ─────────────────────────────────────────────────────────────────────────
// Chaque chaîne est inventée (CLAUDE.md). La recherche externe a porté sur la FORME du registre —
// ce qui sépare la vanne de l'hostilité, dans les deux langues — jamais sur des contenus repris.
// Les prénoms (Léa, Karim, Priya, Tom) sont inventés et ne désignent personne : leur rôle est
// d'être le marqueur d'appartenance que le détecteur ne peut PAS utiliser. Aucun message, pseudo,
// date ou identifiant réel n'entre ici.

import { allNonCarrier, type RegisterPersona } from './register-bench';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 1. FR — LE MÉPRIS VÉCU : le contrôle positif que le produit n'a jamais eu
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_CONTEMPT: RegisterPersona = {
  id: 'fr_contempt',
  register:
    'mépris calme et littéral, adressé à des inconnus — la proposition est plausible et tenue pour vraie',
  who: "Trente-cinq ans, elle restaure des meubles et le fait très bien : c'est son métier, elle y a vingt ans de main. Elle regarde des vidéos de bricolage et de cuisine, et elle répond aux gens qu'elle ne connaît pas avec un mépris qui ne monte jamais d'un ton — elle ne hurle pas, elle constate. Elle a un atelier, une chienne, une exaspération durable envers les livreurs. Elle n'est pas un personnage : elle est désagréable avec des inconnus, et elle a par ailleurs une vie.",
  truth: allNonCarrier({ conflictual: 'lived' }),
  truthNotes:
    "`conflictual` VÉCU, et c'est le premier de tout le corpus scellé. L'état est `lived` et non `signalWithoutLived` parce que l'hostilité est SON comportement, pas un signal qui appartiendrait à un tiers : elle ne rapporte pas un conflit, elle en produit un, item après item. Son tag est donc un rappel ATTENDU, et son absence serait un défaut de rappel — la seule mesure qui puisse donner un sens au zéro de `fr_banter`. Cinq autres labels non-porteurs. Un item est tenu au bord sciemment : #23, « aiguiser ciseaux a bois angle », est une recherche de métier au voisinage lexical d'un objet tranchant, et vérifie qu'aucun constat ne se fabrique sur un outil. Rien de politique n'entre : ses colères portent sur la compétence et le goût, jamais sur une politique publique, pour que `politics` reste un non-porteur propre et que la paire ne mesure qu'une chose.",
  items: [
    { kind: 'comment', text: "franchement a ce niveau la c'est nul, arrete les videos" },
    { kind: 'search', text: 'colle a bois pour placage epaisseur' },
    { kind: 'comment', text: "tu comprends rien a ce que tu fais et tu l'expliques aux autres" },
    { kind: 'comment', text: "n'importe quoi. c'est n'importe quoi du debut a la fin" },
    { kind: 'search', text: 'difference vernis polyurethane et gomme laque' },
    { kind: 'comment', text: "aucun gout. zero. c'est laid et en plus c'est mal fait" },
    {
      kind: 'comment',
      text: 'les gens comme toi devraient se taire au lieu de donner des conseils',
    },
    { kind: 'search', text: 'restaurer un plateau de chene brule reparation' },
    { kind: 'comment', text: 'pitoyable. tu as ruine un meuble qui valait quelque chose' },
    { kind: 'comment', text: "incompetent et content de l'etre, c'est le pire melange" },
    { kind: 'search', text: 'ponceuse excentrique ou vibrante pour finition' },
    { kind: 'comment', text: 'tu es debile ou tu fais semblant' },
    { kind: 'comment', text: 'arrete de repondre, chaque commentaire est pire que le precedent' },
    { kind: 'search', text: 'prix chene massif au metre cube' },
    { kind: 'comment', text: "c'est de la merde et tout le monde le voit sauf toi" },
    { kind: 'comment', text: "j'ai pas de temps pour les abrutis qui donnent des lecons" },
    { kind: 'search', text: 'traitement bois contre vrillettes efficace' },
    { kind: 'comment', text: "serieusement, qui t'a appris ca. personne. ca se voit" },
    { kind: 'comment', text: "tu racontes n'importe quoi avec un aplomb impressionnant" },
    { kind: 'search', text: 'teinte cerisier sur hetre resultat' },
    { kind: 'comment', text: "non. tu as tort. relis avant d'ecrire" },
    { kind: 'comment', text: "le probleme c'est pas ton meuble, c'est que tu es nul et bruyant" },
    { kind: 'search', text: 'aiguiser ciseaux a bois angle' },
    { kind: 'comment', text: 'ma chienne comprend mieux le sens du bois que ce type' },
    { kind: 'search', text: 'reparer un tiroir a queue d aronde desassemble' },
    { kind: 'comment', text: 'bloque. je supporte pas la betise satisfaite' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 2. FR — LA VANNE AFFECTUEUSE : le risque de faux positif, et le mot à mot du recouvrement
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_BANTER: RegisterPersona = {
  id: 'fr_banter',
  register:
    'insulte affectueuse adressée à des proches — les mêmes mots que ci-dessus, aucune proposition tenue pour vraie',
  who: "Vingt-quatre ans, ailière dans un club de hand amateur. Elle traite Léa et Karim de débiles vingt fois par jour et ils la traitent pareil : c'est leur façon de se dire bonjour depuis la sixième. Rien d'hostile n'est vrai d'elle — elle organise les anniversaires, elle passe prendre les gens en voiture, et l'insulte est chez elle une marque de tendresse, pas un jugement.",
  truth: allNonCarrier(),
  truthNotes:
    "NON-PORTEUSE sur les six, `conflictual` compris. Un tag ici est un TORT, et c'est le seul tort que ce banc compte. Écriture sous contrainte de recouvrement : ses insultes sont les MÊMES mots que ceux de `fr_contempt` — nul, débile, abrutie, incompétente, pitoyable, aucun goût, n'importe quoi, c'est de la merde. Pas des voisines : les mêmes. Ce qui l'en sépare est ce que l'export ne porte pas — le destinataire, la réciprocité (#3, #14, #20), et dix ans d'amitié. L'hyperbole absurde a été délibérément minimisée : la laisser monter aurait rendu un vert facile, obtenu parce que les MOTS diffèrent, et ce vert-là n'aurait rien mesuré. Contrepartie assumée : si le détecteur mord sur le vocabulaire partagé, cette voix rougira — et ce sera un constat sur le produit, pas un défaut du banc.",
  items: [
    { kind: 'comment', text: "lea t'es completement debile mdrr je t'adore" },
    { kind: 'search', text: 'classement hand nationale 2' },
    {
      kind: 'comment',
      text: "karim c'est nul ce que tu as fait et je te le dirai jusqu'a ma mort",
    },
    { kind: 'comment', text: "elle m'a traite d'abrutie hier donc on est quittes" },
    { kind: 'search', text: 'genouillere handball avis' },
    { kind: 'comment', text: "aucun gout, zero, mais je l'aime quand meme cette conne" },
    { kind: 'comment', text: "tu comprends rien et c'est pour ca qu'on te garde" },
    { kind: 'search', text: 'recette gateau anniversaire simple rapide' },
    { kind: 'comment', text: 'pitoyable karim. vraiment pitoyable. a demain 19h' },
    { kind: 'comment', text: 'on est trois incompetentes et une qui sait jouer, devinez qui' },
    { kind: 'search', text: 'horaires gymnase municipal reservation' },
    { kind: 'comment', text: "je suis nulle j'ai rate trois tirs, lea a hurle de rire" },
    { kind: 'comment', text: "c'est de la merde ta coupe et je dis ca avec amour" },
    { kind: 'search', text: 'comment scotcher les doigts au hand' },
    { kind: 'comment', text: 'elle me repond que je suis une abrutie, voila notre amitie' },
    { kind: 'comment', text: "arrete d'etre nul, c'est tout ce que je demande, bisous" },
    { kind: 'search', text: 'restaurant pas cher pour dix personnes' },
    { kind: 'comment', text: "n'importe quoi, mais alors n'importe quoi. tu me fais rire" },
    { kind: 'comment', text: 'debile. profondement debile. je le mets en fond d ecran' },
    { kind: 'search', text: 'photo de groupe qui bouge comment eviter' },
    { kind: 'comment', text: "karim a dit que j'etais la pire, il a raison, je l'aime" },
    { kind: 'comment', text: "on s'insulte depuis la sixieme, ca veut dire quelque chose" },
    { kind: 'search', text: 'cadeau anniversaire pote 25 ans idees' },
    { kind: 'comment', text: "tu es le boulet officiel de l'equipe et personne ne conteste" },
    { kind: 'search', text: 'tarif licence handball adulte' },
    { kind: 'comment', text: "lea si tu lis ca t'es toujours nulle et je passe te chercher a 8h" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 3. EN — LE MÉPRIS VÉCU
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const EN_CONTEMPT: RegisterPersona = {
  id: 'en_contempt',
  register: 'calm literal contempt aimed at strangers — the claim is plausible and she means it',
  who: 'Mid-forties, a birder and wildlife photographer with twenty years in the field and a genuine eye. She watches gear reviews and identification clips, and answers people she has never met with a contempt that never rises in volume — she does not shout, she states. She has a dog, a cold reedbed she walks every Sunday, and a real body of knowledge. She is not a caricature: she is unpleasant to strangers, and she also has a life.',
  truth: allNonCarrier({ conflictual: 'lived' }),
  truthNotes:
    "`conflictual` LIVED, and deliberately NOT a translation of `fr_contempt`: a translated pair would measure the translation rather than the language, and the two voices had to differ in everything except the register under test. `lived` rather than `signalWithoutLived` for the same reason as her French counterpart — the hostility is her own conduct, not a third party's conflict she reports. Her tag is expected recall, and its absence is a recall defect. She is the only thing that can give the zero of `en_banter` a meaning. Five other labels non-carrier; nothing political, nothing about identity, no threat and no directed harassment — public-comment contempt only.",
  items: [
    { kind: 'comment', text: 'this is useless advice and you are giving it with total confidence' },
    { kind: 'search', text: 'juvenile herring gull plumage stages' },
    { kind: 'comment', text: 'you have no idea what you are doing and it shows in every frame' },
    { kind: 'comment', text: 'absolute rubbish. every single point is wrong' },
    { kind: 'search', text: '600mm handheld shutter speed minimum' },
    { kind: 'comment', text: 'no taste, no skill, and somehow a following' },
    { kind: 'comment', text: 'people like you should stop posting until you learn something' },
    { kind: 'search', text: 'marsh harrier vs hen harrier flight silhouette' },
    { kind: 'comment', text: 'pathetic. you flushed a nesting bird for a photo' },
    { kind: 'comment', text: 'clueless and proud of it, which is the worst combination' },
    { kind: 'search', text: 'teleconverter image quality loss 1.4x' },
    { kind: 'comment', text: 'are you an idiot or is this a bit' },
    { kind: 'comment', text: 'stop replying. each one is worse than the last' },
    { kind: 'search', text: 'best hide for winter waders coast' },
    { kind: 'comment', text: 'that is not what that bird is and anyone competent would know' },
    { kind: 'comment', text: 'i have no patience for morons who lecture' },
    { kind: 'search', text: 'tripod gimbal head weight limit' },
    { kind: 'comment', text: 'genuinely, who taught you this. nobody. it shows' },
    { kind: 'comment', text: 'you talk nonsense with impressive confidence' },
    { kind: 'search', text: 'raw processing noise reduction workflow' },
    { kind: 'comment', text: 'no. you are wrong. read before you type' },
    { kind: 'comment', text: 'the problem is not your photo, it is that you are useless and loud' },
    { kind: 'search', text: 'when do swifts arrive inland' },
    { kind: 'comment', text: 'my dog has a better grasp of light than this man' },
    { kind: 'search', text: 'waterproof boots for reedbed walking' },
    { kind: 'comment', text: 'blocked. i cannot stand smug stupidity' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 4. EN — LA VANNE AFFECTUEUSE
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const EN_BANTER: RegisterPersona = {
  id: 'en_banter',
  register:
    'affectionate insult aimed at close friends — the same words as above, none of it meant as a claim',
  who: 'Early twenties, three flatmates and a co-op game they are all bad at. She calls Priya and Tom idiots roughly every second sentence and they give it back; it has been their way of saying hello since school. Nothing hostile is true of her — she is the one who cooks for everyone and collects people from the station. The insult is affection in her mouth, not judgement.',
  truth: allNonCarrier(),
  truthNotes:
    'NON-CARRIER on all six, `conflictual` included. A tag here is a TORT, and it is the only tort this bench counts. Written under the same overlap constraint as `fr_banter`: her insults are the SAME words as `en_contempt` — useless, idiot, moron, rubbish, pathetic, clueless, no taste, nonsense, no idea what you are doing. Not near-synonyms: the same. What separates them is what the export does not carry — the addressee, the reciprocity (#3, #14, #20), and ten years of friendship. Absurd hyperbole was deliberately held down; letting it run would have bought a cheap green earned by the WORDS differing, which would have measured nothing.',
  items: [
    { kind: 'comment', text: 'priya you are completely useless and i love you' },
    { kind: 'search', text: 'co op games four players couch' },
    { kind: 'comment', text: 'tom that was rubbish and i will bring it up forever' },
    { kind: 'comment', text: 'she called me an idiot yesterday so we are even' },
    { kind: 'search', text: 'cheap mechanical keyboard quiet switches' },
    { kind: 'comment', text: 'no taste, none at all, and she is still my favourite person' },
    { kind: 'comment', text: 'you have no idea what you are doing and that is why we keep you' },
    { kind: 'search', text: 'easy dinner for four one pan' },
    { kind: 'comment', text: 'pathetic tom. genuinely pathetic. see you at eight' },
    { kind: 'comment', text: 'three of us are clueless and one can actually play, guess which' },
    { kind: 'search', text: 'flat viewing questions to ask landlord' },
    { kind: 'comment', text: 'i am so useless i died twice in the tutorial, priya screamed' },
    { kind: 'comment', text: 'that haircut is nonsense and i say that with love' },
    { kind: 'search', text: 'how to fix a wobbly chair flat pack' },
    { kind: 'comment', text: 'she says i am the worst, that is the level of our friendship' },
    { kind: 'comment', text: 'stop being useless, that is all i ask, love you' },
    { kind: 'search', text: 'birthday present ideas best friend 22' },
    { kind: 'comment', text: 'absolute nonsense. total nonsense. you make me laugh' },
    { kind: 'comment', text: 'idiot. profoundly an idiot. it is my lock screen now' },
    { kind: 'search', text: 'group photo everyone blinking how to avoid' },
    { kind: 'comment', text: 'tom said i was the worst and he is right and i adore him' },
    { kind: 'comment', text: 'we have insulted each other since school, that means something' },
    { kind: 'search', text: 'cheap train tickets group booking' },
    { kind: 'comment', text: 'you are the official moron of this house and nobody disputes it' },
    { kind: 'search', text: 'how to split bills flatmates app' },
    {
      kind: 'comment',
      text: 'priya if you read this you are still useless and i collect you at eight',
    },
  ],
};

/**
 * Les quatre voix, ordonnées en DEUX PAIRES et non par langue : c'est la paire qui mesure, et
 * l'ordre le dit.
 *
 * Dans chaque paire, les deux voix partagent leur vocabulaire d'insulte et diffèrent par la seule
 * chose que l'export ne consigne pas — à qui elles parlent. La première répond au rappel (une
 * agressivité réelle est-elle vue ?), la seconde au faux positif (une amitié est-elle vue comme une
 * agressivité ?). Les deux chiffres NE SE FUSIONNENT JAMAIS : ils répondent à des questions
 * opposées, et une moyenne des deux n'aurait aucun référent.
 *
 * Quatre voix est le PLANCHER, pas le plafond. Trois ne suffiraient pas : sans la voix
 * d'agressivité de sa langue, un zéro de vanne ne se distingue pas d'un lexique qui ignore ces mots.
 * Et deux (une seule langue) laisserait non mesuré le côté où le trou est livré.
 */
export const CONFLICTUAL_REGISTER_PERSONAS: readonly RegisterPersona[] = [
  FR_CONTEMPT,
  FR_BANTER,
  EN_CONTEMPT,
  EN_BANTER,
];
