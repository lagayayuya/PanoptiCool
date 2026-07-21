// Banc de faux positifs EN du CORPS — le CAPTEUR. Voix et vérité-terrain dans
// `en-body-registers.fixture.ts`, scellées par un commit ANTÉRIEUR à ce fichier : c'est
// l'historique, et lui seul, qui prouve que les attendus n'ont pas été ajustés à la mesure. Le
// comptage est partagé avec les bancs EN et FR de `mental_health` (`register-bench.harness.ts`) ;
// ce fichier ne porte que ce qui est propre au corps.
// ⚠ SCEAU ET HISTORIQUE PUBLIÉ. La recomposition d'avant publication (2026-07-21) a aplati
// l'historique de travail : fixture et capteur y naissent dans le même commit. La preuve d'ORDRE
// ne vit plus que dans le tag local `pre-squash-2026-07-21`, non publié — dans l'historique
// publié, ce sceau se lit comme une déclaration de méthode, pas comme un fait vérifiable.
//
// ── NOTE D'ATTRIBUTION, parce que l'historique ne la donne pas ───────────────────────────────────
// Ce fichier n'a PAS été commité par la session qui l'a écrit. Il a été emporté par un `git add -A`
// d'une session concurrente, qui corrigeait la machinerie au même moment, et il a donc atterri dans
// un commit dont le message ne parle que du registre informationnel en composé. La FIXTURE, elle,
// a bien son propre commit, antérieur : le sceau qui donne son sens à ce banc est intact, et c'est
// la seule propriété qui devait l'être.
//
// La réparation d'historique a été ÉCARTÉE par le mainteneur, et la raison mérite d'être écrite
// puisqu'elle se reposera : une réécriture de SHA précédente avait cassé quatre renvois entre
// documents. Le bénéfice ici était purement archivistique. Le geste retenu est donc de déclarer
// l'écart là où on le lit, plutôt que de maquiller l'historique pour qu'il ait l'air propre.
//
// ── CE QUE CE CAPTEUR NE COUVRE PAS ──────────────────────────────────────────────────────────────
// La fixture déclare les frontières des VOIX (registre non varié, cinq labels non éprouvés, aucune
// détresse vitale). Celles-ci sont les frontières du CAPTEUR, et elles sont différentes :
//
// - Il ne couvre AUCUN étage ni aucune surface. `EXPECTED` est volontairement absent de ce fichier,
//   contrairement au banc `mental_health` : la machinerie du détecteur était en cours de
//   modification au moment où ce capteur a été monté, et une empreinte figée sur un arbre de
//   travail instable aurait enregistré un état transitoire en le présentant comme une référence.
//   Un attendu qui rouille en une heure coûte plus cher que pas d'attendu du tout.
// - Ce qu'il couvre à la place est plus étroit et plus durable : les TROIS PROPRIÉTÉS DE DOCTRINE
//   du comptage — le tort (non-porteur tagué), le rappel (le vécu est tagué), la sur-classification
//   (un signal sans vécu promu en constat nommé). Ces trois-là ne dépendent pas d'un terme ni d'un
//   seuil, seulement du sceau. Elles restent vraies pendant que la machinerie bouge.
// - Poser l'empreinte figée est donc une DETTE explicite, à reprendre quand la machinerie sera
//   stabilisée. Sans elle, ce capteur ne voit pas un terme qui se déplacerait d'un étage à l'autre.
//
// ── COMMENT LIRE LE ZÉRO DE `worrier`, ET C'EST LE POINT DU BANC ─────────────────────────────────
// `worrier` ne déclenche aucun tort sur `health_physical`. Ce zéro NE PROUVE RIEN, et le confondre
// avec de la sûreté serait refaire exactement l'erreur que ce banc a été monté pour éventer.
//
// La raison est mesurée, elle n'est pas supposée : `living`, qui VIT sa condition et l'écrit sans
// détour, rend le même zéro. Le détecteur ne tague pas le corps en anglais — ni à tort, ni à
// raison. Les deux zéros ont donc la même cause, et celle du non-porteur n'est pas la sienne.
//
// C'est pour ça que le vrai positif est dans le banc : sans lui, ce fichier publierait « aucun faux
// positif sur le corps » en toute bonne foi, et la phrase serait vide. Le jour où le rappel arrive,
// le zéro de `worrier` deviendra une information — pas avant.

import { describe } from 'vitest';
import { EN_BODY_REGISTER_PERSONAS } from './en-body-registers.fixture';
import { expectBenchCounts } from './register-bench.harness';

describe('banc FP EN du corps — comptage', () => {
  expectBenchCounts(EN_BODY_REGISTER_PERSONAS, {
    // ── CE QUE LE PREMIER TOUR AVAIT TROUVÉ, ET QUI EST REFERMÉ ─────────────────────────────────
    // Ces quatre lignes valaient toutes autre chose au montage du capteur, et elles ont bougé
    // ENSEMBLE, sous le lot de vocabulaire EN. Elles sont relues ici plutôt que remises au vert :
    // ce que le banc a mesuré la première fois est ce qui a motivé le lot.
    //
    // LE TORT, ÉTEINT — et ce n'était pas celui que le banc cherchait. `relative` est scellée
    // non-porteuse sur `mental_health` ; deux items la taguaient quand même, sur la même surface :
    // « occupational therapy home assessment » et « aphasia speech therapy waiting list ». Des
    // rééducations PHYSIQUES après un AVC, lues comme la santé mentale de la fille — mauvaise
    // personne ET mauvais sujet.
    //
    // Il est éteint sans que `therapy` ait été retiré à `mental_health` (un terme livré ne se
    // retire pas par doctrine, et celui-là porte un rappel réel) : `health_physical` réclame
    // désormais les syntagmes de rééducation, et une LOCUTION COUVRANTE empêche le marqueur court
    // de les lire au passage. L'ablation est faite — les vrais positifs `therapy` du banc EN
    // tiennent, et « retail therapy » tombe en prime.
    //
    // Si cette liste se repeuple, c'est que la couvrante a cédé ou qu'un terme neutre est entré.
    // ── UN TORT ARRIVÉ D'AILLEURS, ET C'EST LE LOT ANGLAIS DE `religion` QUI L'A POSÉ ───────────
    // AVANT : `[]`. `living` est scellée non-porteuse sur les cinq labels autres que le corps, et
    // elle l'était. Un seul de ses items la tague désormais : une répétition de chorale « in the
    // church hall », c'est-à-dire le mot `church` employé pour un LIEU et non pour une pratique.
    //
    // Ce banc mesure le CORPS ; ce tort-ci ne dit donc rien de ce qu'il a été monté pour mesurer,
    // et il est inscrit ici parce qu'un compteur qui bouge doit être lu, jamais parce qu'il
    // relèverait de son objet. Ce qu'il apprend appartient au lot `religion` : la fixture
    // religieuse avait déjà repéré cet item et l'avait scellé HORS `religion` « précisément parce
    // que ce n'est pas une pratique ». Elle avait raison sur la personne, et le détecteur fait
    // néanmoins ce que le produit existe pour montrer.
    //
    // POURQUOI `church` N'EST PAS RETIRÉ pour autant, et la barre n'est pas celle de l'admission :
    // le retirer rendrait le christianisme de nouveau INVISIBLE en anglais, c'est-à-dire
    // recréerait très exactement le défaut que le lot a réparé — un musulman détectable par sa
    // nourriture, un chrétien pas du tout. Un terme qui se déclenche sur des porteurs ET des
    // non-porteurs reste (ADR-0003) ; celui qui ne se déclenche que sur des non-porteurs s'en va,
    // et `church` n'est pas celui-là.
    torts: ['living/religion'],
    escalated: [],
    corrections: [],
    tortsAfterCorrection: ['living/religion'],
    // ── LES DEUX ZÉROS ONT ÉTÉ COMBLÉS, ET C'EST LE RÉSULTAT DU LOT ──────────────────────────────
    // `living` vit avec sa condition depuis dix ans et l'écrit sans détour : le nom de la maladie,
    // le nom du traitement, les prises de sang, les poussées, la rhumatologie, les biologiques.
    // Rien ne la taguait — le rappel `health_physical` EN n'était pas faible, il était NUL. Il ne
    // l'est plus : 14 items la portent, et son vocabulaire a révélé au lot une catégorie entière
    // qu'il avait manquée (les traitements de fond, et l'arthrite comme condition nommée).
    missedRecall: [],
    // Et le même vide sur l'aidante, comblé par la même livraison.
    missedSignal: [],
    // ── LE ZÉRO QUI RESTE, ET QUI VIENT SEULEMENT DE DEVENIR UNE INFORMATION ─────────────────────
    // `worrier` ne déclenche toujours rien, et ce zéro ne se lit plus du tout comme le premier.
    // Il ne pouvait alors rien prouver : `living` rendait le même, pour la même cause. Maintenant
    // que `living` tague, celui de `worrier` mesure enfin ce que le banc était venu chercher — une
    // voix qui écrit un vocabulaire de symptômes DENSE et parfaitement littéral, sans rien avoir,
    // et que le détecteur ne tague pas. C'est la ligne d'admission du lexique livré : le symptôme
    // n'est pas la condition.
    //
    // Frontière à ne pas franchir en le citant : il vaut pour UNE voix, dans UN registre. Il ne dit
    // rien d'une inquiète qui écrirait en argot ou en hyperbole.
    //
    // Le troisième étage, déclaré deux fois à dessein (cf. le harnais) : un rappel manqué doit
    // coûter deux lignes et se voir dans deux relectures.
    livedStages: { living: 'explicit' },
  });
});
