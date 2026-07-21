// Banc de faux positifs EN — le CAPTEUR (PANO-35). Personas et vérité-terrain dans
// `en-registers.fixture.ts`, scellées par un commit ANTÉRIEUR à ce fichier : c'est l'historique, et
// lui seul, qui prouve que les attendus n'ont pas été ajustés à la mesure. Le comptage est partagé
// avec le banc FR (`register-bench.harness.ts`) ; ce fichier ne porte que ce qui est propre à
// l'anglais.
// ⚠ SCEAU ET HISTORIQUE PUBLIÉ. La recomposition d'avant publication (2026-07-21) a aplati
// l'historique de travail : fixture et capteur y naissent dans le même commit. La preuve d'ORDRE
// ne vit plus que dans le tag local `pre-squash-2026-07-21`, non publié — dans l'historique
// publié, ce sceau se lit comme une déclaration de méthode, pas comme un fait vérifiable.
//
// ── Ce que ce fichier est, et ce qu'il n'est pas ─────────────────────────────────────────────────
// Ce n'est pas un rapport : le rapport d'époque (ex-`docs/banc-fp-en-mental-health.md`, condensé
// dans `docs/methode-portabilite-en.md`) datait ses chiffres, et les états courants se lisent dans
// les attendus figés ci-dessous — qui sont la source. Ce fichier est un CAPTEUR — il devient rouge
// quand quelqu'un déplace un seuil, touche une règle d'étage, ou admet un terme qui sur-déclenche.
//
// Le précédent qu'il corrige est explicite : le calibrage FR est cité « mesuré PANO-33 » dans quatre
// modules, mais ses 8 personas n'ont jamais été versionnées — la mesure est invérifiable aujourd'hui.
// Ici, la preuve EST l'artefact, et le chiffre s'en déduit.
//
// ── Pourquoi l'attendu EXACT est le capteur, et pas le taux ──────────────────────────────────────
// Le compteur agrégé est trop grossier : un terme qui se met à sur-déclencher sur une voix pendant
// qu'un autre cesse ailleurs laisse le total PLAT. L'attendu figé par persona — label, étage agrégé,
// étage d'item, surface matchée — bouge dans les deux cas.
//
// ── Hors du chemin de démo, à dessein ────────────────────────────────────────────────────────────
// Ce banc MESURE, il ne se livre pas aux utilisateurs.
//
// ── CE QUE CE BANC NE MESURE PAS : l'auto-déclaration EN (PANO-35 lot 2) ─────────────────────────
// Frontière déclarée ici parce que c'est ici qu'on la cite (CLAUDE.md, *Ce qu'un filet prouve*).
//
// Ce banc ne dit RIEN du taux de faux positifs des ÉTIQUETTES D'ÉTAT admises par copule
// (« i'm <étiquette> ») — ni en bien ni en mal. La raison n'est pas un oubli, elle est structurelle,
// et elle a été mesurée : en livrant les têtes de copule EN, les modificateurs EN et les quatre
// termes candidats du pilote (§2.1 de sa note) dans la configuration la PLUS permissive possible,
// les six voix ci-dessous rendent un delta NUL. Aucun attendu ne bouge.
//
// Ce zéro n'est pas un résultat de sûreté, c'est une CÉCITÉ, et il faut savoir laquelle :
//   - les voix ATTEIGNENT bel et bien la construction — sept items portent une copule (garde plus
//     bas, qui les nomme) ;
//   - mais aucune ne l'apparie jamais à un terme ADMISSIBLE. Les créneaux copulaires de la voix
//     hyperbolique sont occupés par des termes déjà RETIRÉS (« falling apart », « spiraling »,
//     « overwhelmed ») ou qui n'ont jamais été candidats (« unwell », « obsessed », « cooked »).
//
// La cause est la discipline même qui rend ce banc fiable ailleurs : la fixture déclare avoir évité
// délibérément les exclusions déjà figées par la batterie adverse — or « depressed » EST sur cette
// liste d'exclusions. Écarter un biais réel en a donc installé un second, et le second est invisible
// parce qu'il produit un zéro. C'est le résultat central du lot 2, et il se généralise : un banc
// écrit en évitant des exclusions devient incapable de mesurer leur admission future.
//
// Ce que ce banc PROUVE tout de même sur ce terrain, et c'est réel : la NON-RÉGRESSION. La
// machinerie copulaire ne ressuscite aucun des cinq termes hyperboliques retirés.
//
// L'instrument réclamé ici n'a finalement JAMAIS été construit, et c'est un résultat : la mesure a
// montré que la copule n'ancre rien en anglais, la sûreté est passée à l'ÉTAGE
// (`SELF_DECLARATION_HEADS_EN`, tier qui n'affirme jamais), et la question que l'instrument devait
// trancher a disparu plutôt que d'être tranchée (ex-`docs/criteres-mesure-copule-en.md`, condensé
// dans `docs/methode-portabilite-en.md`).

import { describe, expect, it } from 'vitest';
import { EN_REGISTER_PERSONAS } from './en-registers.fixture';
import {
  type AnnotatorCorrection,
  detectFor,
  expectBenchCounts,
  fingerprint,
} from './register-bench.harness';

// ─────────────────────────────────────────────────────────────────────────────────────────────────
// L'ATTENDU FIGÉ — relevé le 2026-07-18, à diff nul
// ─────────────────────────────────────────────────────────────────────────────────────────────────
// Ces lignes ne sont PAS la vérité-terrain (elle est scellée dans la fixture) : c'est ce que le
// détecteur produit AUJOURD'HUI, et c'est leur ÉCART avec le sceau qui est le résultat du banc. Un
// attendu qui bouge se relit avant d'être réécrit : un terme nouvellement admis qui apparaît sur
// `plain`, `hyperbolic` ou `slang` est un tort, pas un progrès de rappel.

const EXPECTED: Readonly<Record<string, readonly string[]>> = {
  // Le témoin ne déclenche rien. « why is my lawn mower smoking » — l'homographie tabac tendue
  // sciemment dans la fixture — ne franchit pas : `health_physical` ne porte pas le terme nu.
  plain: [],

  // LE RÉSULTAT CENTRAL DU BANC, ET SA CORRECTION. Cette voix déclenchait un constat
  // `mental_health` large sur cinq termes colloquiaux livrés par le lot pilote — « falling apart »,
  // « rock bottom », « spiraling », « running on empty », « overwhelmed » — alors qu'elle parle
  // d'une file d'attente, d'un levain et d'une finale de série. Le seuil de 2 était franchi 2,5
  // fois : ce que ADR-0003 déduisait (sur l'hyperbole, le seuil n'écarte pas, il ACCUMULE) a été
  // mesuré ici, puis les cinq termes ont été retirés du lexique.
  //
  // Le vide ci-dessous est donc un RÉSULTAT, pas une absence de couverture — et c'est la garde la
  // plus importante du banc : si cette liste se repeuple, un terme hyperbolique est revenu.
  hyperbolic: [],

  // Un seul item, et il suffit : `religion` tague au seuil 1. Voir la correction d'annotation plus
  // bas — ce n'est pas la même erreur que celle de `hyperbolic`, et les confondre effacerait la
  // seule des deux qui soit vraiment un tort.
  slang: ['religion[indirect] #1 indirect halal'],

  // Le vrai positif. Sans lui, aucun des zéros ci-dessus ne prouve qu'il reste un détecteur vivant
  // derrière — un détecteur mort affiche exactement le même sans-faute.
  distress: [
    'mental_health[explicit] #1 indirect therapist',
    'mental_health[explicit] #5 indirect sertraline',
    'mental_health[explicit] #7 indirect mental health',
    'mental_health[explicit] #9 explicit burnout',
    'mental_health[explicit] #10 indirect cant get out of bed',
    'mental_health[explicit] #13 indirect counselling',
    'mental_health[explicit] #15 indirect insomnia+low mood',
    'mental_health[explicit] #17 indirect mental health',
    'mental_health[explicit] #19 indirect therapy',
    'mental_health[explicit] #20 indirect antidepressants',
    'mental_health[explicit] #22 indirect anxiety',
    'mental_health[explicit] #25 indirect mental health',
    'mental_health[explicit] #26 indirect sertraline',
    'mental_health[explicit] #29 indirect psychiatrist+psychologist',
  ],

  // RÉSIDU REFERMÉ — et pas par le lot qui l'avait ouvert. Le tag reste ATTENDU (signal sans vécu :
  // taguer l'entourage EST la démonstration) ; c'était l'ÉTAGE qui était en cause. Le constat
  // restait NOMMÉ par #29 — « teenager missing school anxiety letter », une recherche
  // ADMINISTRATIVE qui échappait aux deux règles de registre. Cette voie est morte : `anxiety` nu
  // ne nomme plus, il vit au tier des noms nus (`indirectSolo`).
  //
  // La leçon vaut plus que la ligne. Ce résidu avait résisté aux règles d'ÉTAGE, qui cherchaient à
  // reconnaître un REGISTRE — une interrogation, un possessif, une 3ᵉ personne. Il est tombé par
  // une décision de LEXIQUE, prise sur une voix qui n'a rien d'un proche aidant. Le tort ne venait
  // pas de la façon dont cet homme écrivait, il venait de ce qu'un nom nu osait affirmer.
  caregiver: [
    'mental_health[indirect] #1 indirect anxiety',
    'mental_health[indirect] #2 indirect wont leave his room',
    'mental_health[indirect] #3 indirect school refusal',
    'mental_health[indirect] #4 indirect therapist',
    'mental_health[indirect] #7 indirect depression',
    'mental_health[indirect] #9 indirect therapy',
    'mental_health[indirect] #13 indirect mental health',
    'mental_health[indirect] #15 indirect therapy',
    'mental_health[indirect] #21 indirect antidepressants',
    'mental_health[indirect] #29 indirect anxiety',
  ],

  // Même sur-classification, sur une voix qui ne parle de PERSONNE. #19 (« prevalence of ») a été
  // dégradé ; #10 et #26 tiennent — l'un est une ASSERTION définitionnelle (« burnout is an
  // occupational phenomenon »), l'autre un nom d'INSTRUMENT (« maslach burnout inventory »). Ni
  // l'un ni l'autre n'interroge : les couvrir demanderait de distinguer « X est Y » de « j'ai X »,
  // c'est-à-dire un ancrage 1ʳᵉ personne — mesuré comme dégradant aussi le vrai positif, et écarté
  // pour cette raison. RÉSIDU ASSUMÉ.
  advocate: [
    'mental_health[explicit] #0 indirect antidepressants',
    'mental_health[explicit] #2 indirect therapy',
    'mental_health[explicit] #4 indirect ssris',
    'mental_health[explicit] #5 indirect psychologist+counselling',
    'mental_health[explicit] #7 indirect mental health',
    'mental_health[explicit] #9 indirect ssri',
    'mental_health[explicit] #10 explicit burnout',
    'mental_health[explicit] #12 indirect ocd',
    'mental_health[explicit] #15 indirect psych ward',
    'mental_health[explicit] #17 indirect therapist',
    'mental_health[explicit] #19 indirect anxiety disorder+anxiety',
    'mental_health[explicit] #21 indirect mental health',
    'mental_health[explicit] #24 indirect mental health',
    'mental_health[explicit] #26 explicit burnout',
  ],
};
/**
 * Les désaccords ASSUMÉS entre la vérité-terrain scellée et ce que la mesure a montré — corrections
 * de l'ANNOTATEUR, jamais du sceau. Elles ne relâchent RIEN : le tort principal reste calculé sur la
 * vérité scellée, et cette liste ne sert qu'à publier un second chiffre à côté du premier.
 */
const ANNOTATOR_CORRECTIONS: readonly AnnotatorCorrection[] = [
  {
    personaId: 'slang',
    label: 'religion',
    sealed: 'nonCarrier',
    corrected: 'signalWithoutLived',
    why: "« best halal spot near campus » a été scellé non-porteur, et c'est une erreur d'annotation, pas un tort du détecteur. Le non-porteur suppose du texte qui n'a QUE la forme d'un signal ; « halal » est employé au sens propre. Le signal est réel — beaucoup de gens qui mangent halal ne pratiquent pas, mais c'est un éventail de lectures, exactement le cas de « le calme d'une vieille église » d'ADR-0003, et pas une absence de signal. Un annonceur taguerait, et il n'aurait pas tort.",
  },
];

describe('banc FP EN — capteur de régression', () => {
  for (const persona of EN_REGISTER_PERSONAS) {
    it(`${persona.id} — détections inchangées (registre : ${persona.register})`, () => {
      // Égalité STRICTE dans les deux sens : un terme qui apparaît est un sur-déclenchement
      // potentiel, un terme qui disparaît est une perte de rappel. Les deux se relisent.
      expect(fingerprint(detectFor(persona))).toEqual(EXPECTED[persona.id]);
    });
  }

  it('les six voix sont couvertes — un attendu orphelin signalerait une persona retirée en douce', () => {
    expect(Object.keys(EXPECTED).sort()).toEqual(EN_REGISTER_PERSONAS.map((p) => p.id).sort());
  });
});

describe('banc FP EN — comptage', () => {
  expectBenchCounts(EN_REGISTER_PERSONAS, {
    // `hyperbolic/mental_health` — le tort que ce banc existait pour trouver — a été ÉTEINT par le
    // retrait des cinq termes hyperboliques. Reste `slang/religion`, qui n'est pas un tort du
    // détecteur mais une erreur d'annotateur, publiée plutôt que corrigée en silence.
    torts: ['slang/religion'],
    // Le résidu du lot : la règle de registre informationnel a dégradé les items INTERROGATIFS,
    // pas les registres assertif (« burnout is an occupational phenomenon »), technique (« maslach
    // burnout inventory ») ni administratif (« teenager missing school anxiety letter »).
    escalated: ['advocate/mental_health'],
    corrections: ANNOTATOR_CORRECTIONS,
    // Ce zéro se lit avec la note : il porte sur 32 cellules, dont 24 sans lexique EN. Ce n'est pas
    // un brevet de sûreté.
    tortsAfterCorrection: [],
    // `distress` écrit « depression » et « burnout » : le terme précis est présent, le constat nommé
    // est donc légitime.
    livedStages: { distress: 'explicit' },
  });

  // ───────────────────────────────────────────────────────────────────────────────────────────────
  // GARDE DE FRONTIÈRE — rend VÉRIFIABLE la prémisse de la cécité déclarée en tête
  // ───────────────────────────────────────────────────────────────────────────────────────────────
  // La frontière du haut repose sur un fait : les voix atteignent la copule, mais ne l'apparient
  // jamais à un terme admissible. Une prose peut se périmer en silence ; ce décompte, non. Il fige
  // les sept items porteurs de copule, et il rougit si la fixture bouge — auquel cas la frontière
  // doit être RELUE avant d'être réécrite.
  //
  // Les têtes ci-dessous sont les CANDIDATES mesurées par le lot 2, pas des données livrées : la
  // copule EN n'est pas en production, et ce fichier est le seul endroit du dépôt où elles vivent.
  // Elles couvrent le jeu de candidates de CE lot, pas l'anglais : une tête qu'un lot ultérieur
  // proposerait doit être ajoutée ici, sinon la garde cesse de couvrir ce qu'elle prétend couvrir.
  // Le verrou qui décide de la livraison reste `detect.test.ts` ; celle-ci est de la profondeur.
  it('la copule EN est ATTEINTE par les voix scellées — sans quoi la cécité déclarée serait fausse', () => {
    const heads = [
      'i am',
      'im',
      "i'm",
      'i feel',
      'ive been',
      'i have been',
      'i was diagnosed with',
      'i got diagnosed with',
    ];
    const porteurs = EN_REGISTER_PERSONAS.flatMap((p) =>
      p.items
        .filter((item) =>
          heads.some((h) => new RegExp(`(^|[^a-z0-9])${h}[^a-z0-9]`).test(item.text)),
        )
        .map((item) => `${p.id}: ${item.text}`),
    );
    // Les sept. Aucun n'apparie sa copule à un terme admissible : quatre portent des termes RETIRÉS
    // ou jamais candidats, deux sont du rire (« cooked », « weak »), et le septième n'est pas une
    // étiquette d'état du tout. C'est la cécité, item par item.
    expect(porteurs).toEqual([
      'hyperbolic: i am literally falling apart over this ticket queue',
      'hyperbolic: im spiraling and its not even 9am',
      'hyperbolic: im so overwhelmed there are 40 flavours and i have one life',
      'hyperbolic: im obsessed im unwell im completely normal about it i promise',
      'slang: im cooked for this exam ngl',
      'slang: im weak, not the caption',
      'distress: i dont really have anyone to tell so im telling strangers',
    ]);
  });

  it('le tort hyperbolique est ÉTEINT, et la garde porte les termes retirés', () => {
    const hyperbolic = EN_REGISTER_PERSONAS.find((p) => p.id === 'hyperbolic');
    if (hyperbolic === undefined) {
      throw new Error('persona `hyperbolic` absente');
    }
    const surfaces = detectFor(hyperbolic)
      .filter((d) => d.label === 'mental_health')
      .flatMap((d) => d.items.flatMap((i) => i.surfaces));
    expect(surfaces).toEqual([]);
    // Nommer les cinq termes retirés plutôt que se contenter du vide : le jour où l'un revient, le
    // message d'échec dit LEQUEL. Un `toEqual([])` nu dirait seulement « quelque chose a bougé », et
    // la raison du retrait — mesurée, pas supposée — se serait perdue.
    for (const terme of [
      'falling apart',
      'overwhelmed',
      'rock bottom',
      'running on empty',
      'spiraling',
    ]) {
      expect(surfaces).not.toContain(terme);
    }
  });
});
