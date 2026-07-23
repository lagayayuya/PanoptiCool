// FR false-positive bench — the personas and their GROUND TRUTH (PANO-35). Francophone counterpart of the
// EN bench, opened because an English measurement found a MACHINERY defect, hence independent of
// language: the 3rd-person filter is item-local and looks for a possessive, so that a
// search phrased in general — « signes de dépression chez l'adolescent » — today places a
// NAMED finding on the parent who types it. Verified in production before writing these voices.
//
// ── This file is sealed, and its seal reaches further than the EN bench's ─────────────────────
// It is written and committed BEFORE the design of the informational-register markers. This is the
// difference that counts between the two languages:
//   - on the EN side, I already knew the items I wanted to see degrade — the measurement there will be
//     CONFIRMATORY, and it must be read as such;
//   - on the FR side, the voices exist before the markers. I do not yet know which of these items
//     will be caught, nor how many. The measurement there is PREDICTIVE.
// It is the only honest way to check a rule on the very data that inspired it: not
// to write the rule and the data in the same motion.
// ⚠ SEAL AND PUBLISHED HISTORY. The pre-publication recomposition (2026-07-21) flattened
// the working history: fixture and sensor are born there in the same commit. The proof of ORDER
// lives now only in the local tag `pre-squash-2026-07-21`, unpublished — in the published
// history, this seal reads as a statement of method, not as a verifiable fact.
//
// ── Declared limit ──────────────────────────────────────────────────────────────────────────────
// The exposure is STRONGER than in the EN bench, and it must be said: the FR colloquial tier of
// `mental-health.ts` was read during the previous batch. The hyperbolic voice below therefore
// necessarily overlaps part of it — but the reverse would be worse, because « au bout de ma vie », « à
// plat » or « je sature » ARE the ordinary French dramatic register: avoiding them to
// appear blind would produce a false persona. Writing to the voice, declared exposure, and an
// assumed counterweight — half of the amplified formulations below appear in no tier.
//
// ── No real value ─────────────────────────────────────────────────────────────────────────
// Each string is invented (CLAUDE.md): no real message, handle, date or identifier.

import { allNonCarrier, type RegisterPersona } from './register-bench';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 1. THE FLAT VOICE — the witness
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_PLAIN: RegisterPersona = {
  id: 'fr_plain',
  register: 'sobre, littéral — aucune amplification, et des phrases finies',
  who: "Une femme d'une soixantaine d'années qui cuisine, jardine, et règle ses démarches en ligne parce qu'il n'y a plus de guichet. Elle écrit posément et ne force aucun mot. C'est le témoin : si une voix qui n'exagère rien déclenche un constat sensible, ce n'est ni le registre ni la langue qu'il faut regarder, c'est le terme.",
  truth: allNonCarrier(),
  truthNotes:
    "Non-porteuse sur les six. Un item est tendu sciemment : « difference entre creme fraiche et creme liquide » a la FORME interrogative d'une recherche documentaire, sans aucun terme sensible. Il vérifie qu'un marqueur de registre informationnel ne CRÉE jamais rien par lui-même — il ne peut que déplacer l'étage d'un constat qui existait déjà.",
  items: [
    { kind: 'comment', text: 'la meme recette avec des pommes ca marche tres bien' },
    { kind: 'search', text: 'horaires dechetterie samedi' },
    { kind: 'comment', text: 'chez nous ca a donne pareil cette annee' },
    { kind: 'search', text: 'quand tailler les rosiers' },
    { kind: 'comment', text: "merci pour l'astuce, je vais essayer" },
    { kind: 'search', text: 'comment conserver des courgettes' },
    { kind: 'comment', text: 'il faut compter deux heures de cuisson, pas une' },
    { kind: 'search', text: 'prix timbre lettre verte' },
    { kind: 'comment', text: 'le mien tient encore apres douze ans' },
    { kind: 'search', text: 'recette confiture sans sucre ajoute' },
    { kind: 'comment', text: "c'est plus simple qu'il n'y parait" },
    { kind: 'search', text: 'demande carte grise en ligne' },
    { kind: 'comment', text: 'nous on met un peu moins de sucre' },
    { kind: 'search', text: 'comment enlever une tache de vin' },
    { kind: 'comment', text: 'joli resultat, bravo' },
    { kind: 'search', text: 'temps de cuisson gigot au four' },
    { kind: 'comment', text: "il a plu toute la semaine, rien n'a pu secher" },
    { kind: 'search', text: 'pourquoi mes tomates ne murissent pas' },
    { kind: 'comment', text: 'la variete rouge est meilleure pour ca' },
    { kind: 'search', text: 'horaires bus ligne 4' },
    { kind: 'search', text: 'comment declarer ses revenus fonciers' },
    { kind: 'search', text: 'difference entre creme fraiche et creme liquide' },
    { kind: 'search', text: 'ou trouver un serrurier' },
    { kind: 'search', text: 'comment nettoyer un four tres sale' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 2. THE HYPERBOLIC VOICE
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_HYPERBOLIC: RegisterPersona = {
  id: 'fr_hyperbolic',
  register: 'amplification conventionnelle permanente — le superlatif tient lieu de ponctuation',
  who: "Vingt-deux ans, fan de tout ce qu'elle aime à un degré qu'elle surjoue exprès. Elle attend un comeback, elle rate ses macarons, elle passe un concours. Rien de grave ne lui arrive, et tout ce qui lui arrive est présenté comme une catastrophe ou un miracle — son entourage le lit comme de l'humour, parce que c'en est.",
  truth: allNonCarrier(),
  truthNotes:
    "Non-porteuse sur les six. Le pendant français de la voix hyperbolique EN, et la question qu'elle pose est ouverte : le tier colloquial FR a été calibré (PANO-33) contre la POLYSÉMIE, jamais contre l'hyperbole. Si des formulations comme « au bout de ma vie », « à plat » ou « je sature » se déclenchent ici, le français a le même défaut que l'anglais — mesuré cette fois sur un lexique ratifié de longue date, ce qui en ferait un résultat bien plus lourd que le retrait de cinq termes EN livrés il y a deux jours.",
  items: [
    { kind: 'comment', text: 'je suis morte, litteralement morte' },
    { kind: 'search', text: 'date comeback officielle' },
    { kind: 'comment', text: "j'en peux plus de cette attente" },
    { kind: 'search', text: 'pourquoi ma ganache tranche' },
    { kind: 'comment', text: 'je suis au bout de ma vie pour un gateau' },
    { kind: 'search', text: 'places concert revente prix' },
    { kind: 'comment', text: 'je craque completement sur cette collab' },
    { kind: 'search', text: 'resultats concours date de publication' },
    { kind: 'comment', text: 'ca me tue ce teaser, vraiment' },
    { kind: 'search', text: 'meilleure farine pour macarons' },
    { kind: 'comment', text: 'au secours il reste trois places' },
    { kind: 'search', text: 'traduction paroles nouvelle chanson' },
    { kind: 'comment', text: "je pleure devant un fond d'ecran" },
    { kind: 'search', text: 'combien de temps repos pate a choux' },
    { kind: 'comment', text: "c'est la pire chose qui soit arrivee a quelqu'un" },
    { kind: 'search', text: 'file attente billetterie astuce' },
    { kind: 'comment', text: 'je suis a plat apres quatre heures de queue mais ca valait le coup' },
    { kind: 'search', text: 'photocard rare ou acheter' },
    { kind: 'comment', text: "jamais je ne m'en remettrai de ce final" },
    { kind: 'search', text: 'pourquoi mon four cuit inegalement' },
    { kind: 'comment', text: 'je sature de ces previews au compte gouttes' },
    { kind: 'search', text: 'annonce tournee europe dates' },
    { kind: 'comment', text: "j'ai le cafard depuis que la saison est finie" },
    { kind: 'search', text: 'comment photographier un gateau' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 3. LIVED DISTRESS — the true positive, and the guard against too broad a degradation
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_DISTRESS: RegisterPersona = {
  id: 'fr_distress',
  register: "littéral, sobre — la langue reste en dessous de ce qu'elle décrit",
  who: "Une trentenaire dont la vie s'est resserrée depuis l'automne : le sommeil parti, le travail qui glisse, les amis annulés jusqu'à ce qu'ils cessent de proposer. Elle cherche de l'aide, surtout la nuit, et sans employer de mot fort — c'est ce qui la sépare de la voix hyperbolique, qui n'a rien et le dit très fort.",
  truth: allNonCarrier({ mental_health: 'lived' }),
  truthNotes:
    "`mental_health` vécu. Double rôle : vrai positif du banc FR, et GARDE contre la règle qu'on s'apprête à écrire. Une personne qui vit la chose tape souvent les mêmes formulations documentaires qu'un proche — « pourquoi je pleure sans raison », « insomnie et moral » — et une dégradation trop large la priverait de son constat nommé sans que personne ne le remarque. Si cette persona perd son étage nommé, la règle est trop large : c'est le critère d'arrêt, écrit avant la mesure.",
  items: [
    { kind: 'comment', text: 'je ne dors plus correctement depuis novembre' },
    { kind: 'search', text: 'trouver un psychologue sans passer par le medecin' },
    { kind: 'comment', text: "j'ai lu ca a 4h du matin et ca m'a un peu aide, merci" },
    { kind: 'search', text: 'pourquoi je me reveille a 3h chaque nuit' },
    { kind: 'comment', text: "j'annule tout le temps et apres je me sens pire" },
    { kind: 'search', text: 'delai rendez vous cmp' },
    { kind: 'comment', text: "comment on fait pour appeler quand c'est justement ca le plus dur" },
    { kind: 'search', text: 'effets secondaires sertraline premieres semaines' },
    { kind: 'comment', text: "avant j'aimais ca. maintenant je ne ressens plus grand chose" },
    { kind: 'search', text: 'arret de travail pour raison psychologique' },
    { kind: 'comment', text: 'tout le monde dit le sport. certains jours je ne me leve pas' },
    { kind: 'search', text: 'consultation psychologue remboursee' },
    { kind: 'comment', text: 'desole pour le pave, ces derniers mois ont ete longs' },
    { kind: 'search', text: 'combien de temps avant que le traitement fasse effet' },
    { kind: 'comment', text: "est ce que le traitement empire les choses avant d'ameliorer" },
    { kind: 'search', text: "comment dire a son medecin qu'on ne va pas bien" },
    { kind: 'comment', text: "je n'ai personne a qui le dire alors je le dis a des inconnus" },
    { kind: 'search', text: 'groupe de parole anxiete en ligne' },
    {
      kind: 'comment',
      text: "la fatigue n'est pas la fatigue normale, c'est ca que les gens ne voient pas",
    },
    { kind: 'search', text: 'pourquoi je pleure sans raison' },
    { kind: 'search', text: 'therapie cognitivo comportementale tarif' },
    { kind: 'search', text: 'insomnie et moral' },
    { kind: 'search', text: 'psychiatre ou psychologue lequel consulter' },
    { kind: 'search', text: "je n'arrive pas a me lever le matin" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 4. THE CARING RELATIVE — the persona that carries the production bug
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_CAREGIVER: RegisterPersona = {
  id: 'fr_caregiver',
  register: '3ᵉ personne, et surtout formulations GÉNÉRALES — le registre qui échappe au filtre',
  who: "Un père dont le fils de quinze ans ne quitte plus sa chambre depuis un changement de collège. Il pose des questions dans des fils de parents et cherche, comme cherche quelqu'un d'inquiet : il tape le symptôme, pas sa relation au symptôme. Il va bien, lui.",
  truth: allNonCarrier({ mental_health: 'signalWithoutLived' }),
  truthNotes:
    "`mental_health` = signal SANS vécu : le tag est ATTENDU (taguer l'entourage d'une personne vulnérable est exactement ce qu'une plateforme fait, et le montrer est le propos). Le tort à mesurer est l'ÉTAGE. Cette persona porte le bug vérifié en production avant son écriture : deux de ses recherches — « signes de depression chez l'adolescent », « symptomes depression ado que faire » — posent aujourd'hui un constat NOMMÉ sur lui. Les items possessifs (« mon fils », « son pere ») sont là pour vérifier que le filtre existant continue de faire son travail là où il le faisait déjà.",
  items: [
    { kind: 'comment', text: "mon fils est comme ca depuis qu'il a change de college" },
    { kind: 'search', text: "signes de depression chez l'adolescent" },
    { kind: 'comment', text: 'il ne sort plus de sa chambre et je ne sais pas quoi faire' },
    { kind: 'search', text: 'symptomes depression ado que faire' },
    { kind: 'comment', text: 'sa psychologue a dit la meme chose' },
    { kind: 'search', text: 'refus scolaire adolescent que faire' },
    { kind: 'comment', text: "on est sur liste d'attente depuis quatorze mois" },
    { kind: 'search', text: 'delai rendez vous cmp adolescent' },
    { kind: 'comment', text: 'des parents ici ont vecu la meme chose avec un ado' },
    { kind: 'search', text: 'comment aider un ado qui ne va pas bien' },
    { kind: 'comment', text: 'je ne veux pas le forcer mais je ne veux pas rien faire non plus' },
    { kind: 'search', text: 'therapie familiale tarif' },
    { kind: 'comment', text: "son pere pense qu'il est juste paresseux. il ne l'est pas" },
    { kind: 'search', text: 'faut il retirer le telephone a un ado' },
    { kind: 'comment', text: 'elle a commence un traitement en mars et ca va mieux depuis' },
    { kind: 'search', text: 'groupe de parole parents adolescent' },
    { kind: 'comment', text: "merci d'avoir ecrit ca, j'en avais besoin en tant que parent" },
    { kind: 'search', text: 'parler de psychologue a son enfant' },
    { kind: 'comment', text: "il jouait au foot tous les week ends. c'est ca qui me serre" },
    { kind: 'search', text: 'mon fils ne voit plus ses amis' },
    { kind: 'search', text: 'adolescent qui dort toute la journee est ce normal' },
    { kind: 'search', text: 'antidepresseurs chez les mineurs' },
    { kind: 'search', text: "comment savoir si c'est juste l'adolescence" },
    { kind: 'search', text: 'que dire quand son enfant se referme' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 5. THE PROFESSIONAL VOICE
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_ADVOCATE: RegisterPersona = {
  id: 'fr_advocate',
  register: 'vocabulaire clinique dense et LITTÉRAL, sur le domaine — sans personne concernée',
  who: "Étudiante en psychologie, bénévole en écoute, franchement agacée par la moitié de ce qu'elle voit passer sur le sujet. Elle emploie le vocabulaire clinique au sens exact, en volume, et à propos de personne : ni d'elle, ni d'un proche, mais du champ — les délais, les preuves, la formation, la stigmatisation.",
  truth: allNonCarrier({ mental_health: 'signalWithoutLived' }),
  truthNotes:
    "`mental_health` = signal SANS vécu, même lecture que son homologue anglaise : les termes sont employés au sens LITTÉRAL, l'usage est réel, il n'y a simplement personne derrière. Un ciblage publicitaire la classerait « intéressée par la santé mentale » sans se tromper. Tag attendu, sur-classification à surveiller.",
  items: [
    {
      kind: 'comment',
      text: 'la stigmatisation autour des antidepresseurs est le vrai obstacle, pas le traitement',
    },
    { kind: 'search', text: 'tcc et act base de preuves' },
    {
      kind: 'comment',
      text: "la therapie n'est pas un trait de personnalite et ce n'est pas un luxe",
    },
    { kind: 'search', text: 'devenir psychologue clinicien parcours' },
    {
      kind: 'comment',
      text: "les isrs mettent quatre a six semaines. les gens arretent a la deuxieme et s'en veulent",
    },
    { kind: 'search', text: "mecanisme d'action des isrs" },
    { kind: 'comment', text: 'on a fait un module entier la dessus, les donnees ne disent pas ca' },
    { kind: 'search', text: 'prevalence des troubles anxieux chez les jeunes adultes' },
    { kind: 'comment', text: 'le soutien par les pairs ne remplace pas un suivi clinique' },
    { kind: 'search', text: 'echelle phq 9 validite' },
    {
      kind: 'comment',
      text: 'le burnout est un phenomene lie au travail, pas un defaut de caractere',
    },
    { kind: 'search', text: 'loi soins sans consentement explication' },
    {
      kind: 'comment',
      text: "arretez d'appeler toc le fait d'aimer ranger, le vrai toc c'est autre chose",
    },
    { kind: 'search', text: 'principes des soins centres sur le trauma' },
    {
      kind: 'comment',
      text: "les delais sont la vraie crise. les traitements marchent, les gens n'y accedent pas",
    },
    { kind: 'search', text: 'rapport inspection hopital psychiatrique' },
    {
      kind: 'comment',
      text: "en formation la supervision n'est pas optionnelle, c'est tout l'interet",
    },
    { kind: 'search', text: 'delais de prise en charge en sante mentale statistiques' },
    { kind: 'comment', text: 'les campagnes de sensibilisation ne font rien sans budget' },
    { kind: 'search', text: 'code de deontologie des psychologues' },
    { kind: 'search', text: 'formation premiers secours en sante mentale' },
    { kind: 'search', text: 'inventaire de burnout de maslach cotation' },
    { kind: 'search', text: 'sujets de memoire en psychologie' },
    { kind: 'search', text: 'reduction de la stigmatisation meta analyse' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// 6. DISTRESS WITHOUT CARE — the voice that decides the fate of the six formulations
// ─────────────────────────────────────────────────────────────────────────────────────────────────

const FR_DISTRESS_COLLOQUIAL: RegisterPersona = {
  id: 'fr_distress_colloquial',
  register: 'détresse vécue, registre familier SEUL — aucun terme de soin, aucune condition nommée',
  who: "Trente-cinq ans, un travail qui commence tôt, une vie qui s'est rétrécie sans qu'elle sache dire quand. Elle n'a pas de diagnostic, ne voit personne, et n'a jamais employé le mot « dépression » à son sujet — pas par déni, parce que ça ne s'est pas présenté comme ça : il y a eu de la fatigue, puis plus de fatigue. Elle en parle avec les mots que tout le monde utilise pour dire la fatigue, ce qui est exactement le problème.",
  truth: allNonCarrier({ mental_health: 'lived' }),
  truthNotes:
    "`mental_health` vécu. Cette persona n'existe pas pour élargir la couverture : elle existe pour répondre à UNE question, celle qui décide du sort de six formulations françaises. La question n'est pas « ces tournures apparaissent-elles dans une vraie détresse » — évidemment oui, et la poser ainsi trouve ce qu'elle cherche. La question est : PORTENT-ELLES UN RAPPEL QUE RIEN D'AUTRE NE PORTE. Les cinq termes anglais sont tombés parce que `therapist`, `sertraline` et `antidepressants` détectaient déjà la personne : leur retrait coûtait zéro. La voix qui décide est donc celle qui n'a AUCUN de ces filets — pas de soin, pas de condition nommée, rien que le registre familier. C'est précisément la population pour qui le tier colloquial existe.\n\nCONTAMINATION IRRÉDUCTIBLE, déclarée : je connaissais les six formulations en écrivant cette voix, et la DENSITÉ que je leur donne détermine mécaniquement le verdict — toutes les mettre les rend indispensables, n'en mettre aucune les rend inutiles. Le sceau empêche d'ajuster après la mesure ; il n'empêche pas ce biais-là. Ce que j'ai fait : écrire une personne plutôt qu'un dosage, en acceptant le mélange qui en sort. Le choix le plus lourd du fichier est l'item #12 — « au fond du trou », qui appartient au tier colloquial SANS faire partie des six. Je l'ai écrit parce que c'est l'idiome français canonique de cet état, employé au sens propre, et qu'une femme dans sa situation l'écrit ; l'omettre pour faire paraître les six indispensables aurait été le biais exact que ce banc existe pour empêcher. Il est possible que ce seul item décide de la mesure. Il est écrit avant elle, et signalé ici.",
  items: [
    { kind: 'comment', text: "j'en peux plus mais il faut bien y aller le matin" },
    { kind: 'search', text: 'pourquoi je suis fatiguee tout le temps' },
    { kind: 'comment', text: "ca fait des mois que c'est comme ca et je le dis a personne" },
    { kind: 'search', text: 'comment dormir quand on rumine' },
    { kind: 'comment', text: 'je suis a plat des le reveil, avant meme de commencer' },
    { kind: 'search', text: "manque d'energie permanent" },
    {
      kind: 'comment',
      text: "les gens disent de faire du sport, moi j'arrive deja pas a faire les courses",
    },
    { kind: 'search', text: 'se sentir vide tout le temps' },
    { kind: 'comment', text: "j'ai plus de jus, et c'est pas la fatigue normale" },
    { kind: 'search', text: 'comment reprendre gout aux choses' },
    { kind: 'comment', text: 'je craque le soir et le matin je fais comme si' },
    { kind: 'search', text: 'pourquoi je pleure le soir sans raison' },
    { kind: 'comment', text: 'au fond du trou depuis novembre et je fais avec' },
    { kind: 'search', text: 'est ce que ca passe tout seul' },
    { kind: 'comment', text: 'je suis videe, il reste rien a la fin de la journee' },
    { kind: 'search', text: "comment faire semblant d'aller bien au travail" },
    { kind: 'comment', text: 'je sature de devoir expliquer que ca va' },
    { kind: 'search', text: 'pourquoi tout demande autant d effort' },
    { kind: 'comment', text: "j'ai arrete de repondre aux messages, c'est trop d'effort" },
    { kind: 'search', text: 'arreter de repousser toutes les taches' },
    { kind: 'comment', text: 'personne remarque et cest peut etre mieux comme ca' },
    { kind: 'search', text: 'se reveiller fatigue tous les matins' },
    { kind: 'comment', text: 'je tiens le coup mais je sais pas jusqua quand' },
    { kind: 'search', text: 'comment avoir envie de voir du monde' },
    { kind: 'comment', text: 'merci pour cette video, ca fait du bien de pas se sentir seule' },
    { kind: 'search', text: 'redonner un sens a ses journees' },
  ],
};

/**
 * The six francophone voices. No counterpart to the EN slang voice: the only result it had
 * produced bore on `religion`, outside this batch's subject, and one more voice with no question to
 * put to it would have been volume without measurement.
 *
 * `fr_distress` and `fr_distress_colloquial` form a PAIR, and it is their contrast that measures:
 * the first has the vocabulary of care (psychologist, sertraline, therapy), the second has nothing
 * else but the colloquial register. If removing a colloquial term costs nothing to the first
 * but makes the second disappear, then that term carries a recall nothing else carries — and
 * it is exactly the question that removing the five English terms had settled in the other
 * direction.
 */
export const FR_REGISTER_PERSONAS: readonly RegisterPersona[] = [
  FR_PLAIN,
  FR_HYPERBOLIC,
  FR_DISTRESS,
  FR_DISTRESS_COLLOQUIAL,
  FR_CAREGIVER,
  FR_ADVOCATE,
];
