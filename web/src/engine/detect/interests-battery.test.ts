// Batterie du CONTENU réel D2 (lexiques d'intérêt lot 1, PANO-76) — pendant de `lexicon-battery.test.ts`
// (D1). Exerce les vrais lexiques (`INTEREST_LEXICONS`), pas des factices. Quatre familles de garde :
//   1. détection intentionnelle — chaque thème du lot tire sur une phrase représentative ;
//   2. adversité (sondage FP) — les termes ÉCARTÉS (polysémie) ne tirent PAS ;
//   3. FRONTIÈRE sensible — AUCUN marqueur d'intérêt ne déclenche un des 6 lexiques D1 (garde dur) ;
//   4. hygiène/structure — marqueurs normalisés ; thèmes câblés ⊆ catalogue ratifié.
// + la CO-CITATION D1×D2 d'un commentaire multi-usage (cf. le dernier `describe`).
// Phrases 100 % SYNTHÉTIQUES, jamais tirées d'un export réel (discipline PANO-70 §3).
//
// PORTÉ À LA REFONTE A. Les gardes 1 à 4 tapent sur `detect/` + `lexicon/` (INTOUCHABLES) et ne
// bougent pas d'une ligne. Seul le dernier `describe` touchait le moteur, et il est INVERSÉ plutôt
// que traduit — même bascule que les goldens D1, pour la même raison : le magasin de preuves est
// supprimé, le verbatim est DUPLIQUÉ entre constats co-citants (arbitrage yuya, coût assumé). Ce que
// « stocké UNE fois » protégeait n'a plus d'objet ; ce qui comptait vraiment survit et se dit mieux.

import { describe, expect, it } from 'vitest';
import type { Evidence } from '../analysis';
import { analyze } from '../analyze';
import { WIRED_LEXICONS } from '../lexicon';
import { CANONICAL_THEME_IDS, INTEREST_LEXICONS } from '../lexicon/interests';
import { normalizeExport } from '../normalize';
import { d2Interests } from '../rules/d2-interests';
import type { CommentItem, TikTokExport } from '../tiktok-export';
import { validTikTokExport } from '../valid-export.fixture';
import { detectLabels } from './detect';
import { normalizeFr } from './normalize-fr';

/** Thèmes d'intérêt détectés (triés) sur une liste de commentaires synthétiques. */
function themes(...texts: string[]): string[] {
  return detectLabels(texts, INTEREST_LEXICONS)
    .map((d) => d.label)
    .sort();
}

/** Labels sensibles (D1) détectés sur un texte — pour le garde de frontière. */
function d1Labels(text: string): string[] {
  return detectLabels([text], WIRED_LEXICONS).map((d) => d.label);
}

/** Tous les termes d'un lexique d'intérêt (les 3 tiers) — pour les gardes de frontière/hygiène. */
function allTerms(lexicon: (typeof INTEREST_LEXICONS)[number]): string[] {
  return [...lexicon.markers, ...(lexicon.anchored ?? []), ...(lexicon.selfDeclared ?? [])];
}

describe('interests — détection intentionnelle (chaque thème câblé tire)', () => {
  const CASES: Array<[string, string]> = [
    // Lot 1 (PANO-76)
    ['muscu', 'grosse seance de musculation ce matin'],
    ['running', 'petit footing tranquille avant le taf'],
    ['football', 'quel match de foot hier soir'],
    ['gaming', 'un bon jeu video pour se détendre'],
    ['ia', "l'intelligence artificielle avance vite"],
    ['crypto', 'le bitcoin remonte en ce moment'],
    ['cuisine', 'je vais cuisiner un truc ce soir'],
    ['maquillage', 'ce mascara tient toute la journée'],
    ['skincare', 'ma routine skincare du soir'],
    ['sneakers', 'les air max sont vraiment stylées'],
    ['kpop', 'la kpop me met de bonne humeur'],
    ['manga_anime', 'je lis un manga passionnant'],
    // Lot 2 (PANO-77)
    ['mode', 'grosse envie de streetwear et de friperie'],
    ['cinema_series', 'ce realisateur signe un long metrage culte'],
    ['chiens', 'mon chiot fait deja ses dents'],
    ['chats', 'mon chaton adore son griffoir'],
    ['voyage', 'roadtrip prevu cet ete en mode routard'],
    ['voitures', 'grosse session tuning sur la bagnole'],
    ['rap', 'ce freestyle est une vraie tuerie'],
    ['photographie', "j'ai ressorti mon reflex argentique"],
    ['patisserie', "j'ai rate ma meringue mais bon"],
    ['fitness', 'seance crossfit et burpees ce matin'],
    ['coiffure', 'un joli balayage chez le coiffeur'],
    ['tech', 'mon nouveau smartphone est ultra rapide'],
    // Lot 3 (PANO-78)
    ['basket', 'quel match de nba avec wembanyama hier'],
    ['cyclisme', 'grosse échappée dans le peloton du tour de france'],
    ['randonnee', 'super bivouac sur un sentier de gr20'],
    ['skate', "j'ai enfin réussi mon kickflip au skatepark"],
    ['sports_combat', 'quel combat de mma à l’ufc cette nuit'],
    ['danse', 'grosse battle de breakdance et de krump'],
    ['esport', 'la karmine corp gagne sur league of legends'],
    ['cafe', 'un espresso extrait en v60 par le barista'],
    ['cuisine_vege', 'du tofu et du tempeh pour un buddha bowl vegan'],
    ['electro', 'un dj set techno de charlotte de witte'],
    ['guitare', 'un bon riff sur ma stratocaster avec le mediator'],
    ['lecture', 'ma pile a lire booktok de dark romance'],
    ['expo_concert', 'un concert au hellfest avec setlist de folie'],
    ['motos', 'un roadster ducati et mon permis a2'],
    // Lot 4 (PANO-89)
    ['lapins', 'mon lapin nain adore son clapier et son foin'],
    ['dessin', 'un fanart sur procreate avec ma tablette graphique'],
    ['jardinage', 'gros semis au potager et un peu de permaculture'],
    ['diy', 'grosse rénovation, perceuse et placo de chez leroy merlin'],
    ['tricot', 'un amigurumi au crochet avec ma pelote de laine'],
    ['philosophie', 'je lis nietzsche, le stoicisme me passionne'],
    ['sociologie', "l'habitus chez bourdieu et le capital culturel"],
    ['psychologie', 'le biais cognitif de milgram, pure psychologie sociale'],
    ['histoire', "la renaissance et l'empire romain me fascinent"],
    ['economie', "l'inflation et le pib grimpent, pure macroeconomie"],
    ['biologie', "l'adn, la mitose et la génétique m'intéressent"],
    ['physique', 'la physique quantique et la relativite d einstein'],
    ['mathematiques', "l'algebre, une derivee et le theoreme de pythagore"],
    ['astronomie', 'le james webb a photographié une exoplanete près d un trou noir'],
  ];
  for (const [label, phrase] of CASES) {
    it(`« ${phrase} » → ${label}`, () => {
      expect(themes(phrase)).toContain(label);
    });
  }
});

describe('interests — adversité : ANCRÉ isolé (sans compagnon) ne tire PAS', () => {
  // Méthode PANO-76 : ces 50/50 sont INCLUS (tier ancré), mais un ancré isolé est écarté par la
  // co-occurrence — le sens non-domaine ne franchit pas la barre sans compagnon du domaine.
  const TRAPS: Array<[string, string]> = [
    ['football « but » (finalité)', 'je fais ça dans le but de progresser'],
    ['football « match » (allumette)', "j'allume le feu avec une seule match"],
    ['football « foot » (anatomie)', "j'ai mal au foot depuis ce matin"],
    ['kpop « twice » (anglais)', "je te l'ai dit twice déjà"],
    ['kpop « seventeen » (nombre)', 'chapter seventeen of the book'],
    ['sneakers « jordan » (prénom)', 'salut jordan ça roule'],
    ['crypto « defi » = « défi »', 'défi relevé haut la main aujourd’hui'],
    ['manga « animé » via « dessin animé »', "j'ai regardé un dessin animé de mon enfance"],
    ['gaming « console » (verbe)', 'je te console, ça va aller'],
    ['muscu « sèche » (météo)', 'le linge est déjà sec et la terre sèche'],
    ['skincare « masque » (sanitaire)', 'je remets mon masque dans le métro'],
    // Lot 2 (PANO-77)
    ['chats « chat » (messagerie)', "je t'écris sur le chat du serveur discord"],
    ['mode « mode » (mode d’emploi)', "regarde le mode d'emploi du grille-pain"],
    ['voyage « vol » (larcin)', "il y a eu un vol dans l'immeuble cette nuit"],
    ['photo « objectif » (but)', 'mon seul objectif est de réussir cette année'],
    ['tech « apple » (fruit)', 'une belle part de apple pie maison'],
  ];
  for (const [why, phrase] of TRAPS) {
    it(`${why} → aucun thème`, () => {
      expect(themes(phrase)).toEqual([]);
    });
  }
});

describe('interests — adversité : EXCLU (jamais listé, même ancré)', () => {
  const TRAPS: Array<[string, string]> = [
    ['kpop « bts » (diplôme)', 'je prépare mon bts en informatique'],
    ['ia « claude » (prénom)', "j'adore le prénom claude"],
    ['ia « opus » (mot courant)', 'quel opus magnifique vraiment'],
    ['ia « ia » nu (2 lettres)', 'la via appia est une route antique'],
  ];
  for (const [why, phrase] of TRAPS) {
    it(`${why} → aucun thème`, () => {
      expect(themes(phrase)).toEqual([]);
    });
  }
});

describe('interests — co-occurrence sur lexiques RÉELS (ancré RÉCUPÉRÉ par un compagnon)', () => {
  it('« but » + terme foot → football (l’ancré compte avec compagnon)', () => {
    expect(themes('quel but magnifique en ligue 1')).toContain('football');
  });
  it('« console » + terme gaming → gaming', () => {
    expect(themes('je joue sur ma console avec une manette')).toContain('gaming');
  });
  it('« defi » + terme crypto → crypto (récupération du 50/50)', () => {
    expect(themes('je relève le défi bitcoin cette année')).toContain('crypto');
  });
  it('« jordan » + terme sneakers → sneakers', () => {
    expect(themes('mes air max et mes jordan préférées')).toContain('sneakers');
  });
  // Lot 2 (PANO-77)
  it('« chat » + terme chats → chats (récupération du 50/50 messagerie)', () => {
    expect(themes('mon chat et sa litière sont impeccables')).toContain('chats');
  });
  it('« mode » + terme mode → mode', () => {
    expect(themes('la mode et le streetwear de cette saison')).toContain('mode');
  });
  it('DEUX ancrés tech (« tablette » + « apple ») s’ancrent mutuellement → tech', () => {
    expect(themes('la nouvelle tablette apple vient de sortir')).toContain('tech');
  });
});

describe('interests — ENTITÉS & jargon (lot 2 enrichi, PANO-77) : les marques/sigles tirent', () => {
  const CASES: Array<[string, string]> = [
    ['mode', 'total look balenciaga et un peu de jacquemus'],
    ['mode', 'mon ootd du jour est très streetwear'],
    ['cinema_series', 'le nouveau film marvel sort sur disney plus'],
    ['tech', "j'ai monté une rtx avec un cpu intel"],
    ['voitures', 'grosse prépa jdm sur une belle bmw'],
    ['voyage', 'roadtrip réservé entièrement sur airbnb'],
    ['rap', 'ce feat de damso et ninho est parfait'],
    ['photographie', 'un bokeh de fou avec mon nikon'],
    ['patisserie', "j'ai tenté un entremets façon cedric grolet"],
    ['fitness', 'un wod crossfit avec amrap et emom'],
    ['coiffure', 'un balayage et de l’olaplex chez le coiffeur'],
    ['chiens', 'mon berger australien adore les balades'],
    ['chats', 'mon maine coon est vraiment énorme'],
  ];
  for (const [label, phrase] of CASES) {
    it(`« ${phrase} » → ${label}`, () => {
      expect(themes(phrase)).toContain(label);
    });
  }

  it('« golf » (sport) isolé ne tire pas voitures ; « golf » + « jantes » → voitures', () => {
    expect(themes('une bonne partie de golf ce dimanche')).not.toContain('voitures');
    expect(themes('ma golf avec des jantes neuves')).toContain('voitures');
  });

  it('« ram » (bélier) isolé ne tire pas tech ; « ram » + « cpu » → tech', () => {
    expect(themes('un bélier de la race ram dans le champ')).not.toContain('tech');
    expect(themes("j'ai boosté ma ram et changé le cpu")).toContain('tech');
  });
});

describe('interests — co-occurrence & adversité lot 3 (PANO-78)', () => {
  it('« panier » (courses) isolé ne tire pas basket ; « panier » + terme basket → basket', () => {
    expect(themes('je remplis mon panier au supermarché')).not.toContain('basket');
    expect(themes('un panier à trois points en nba')).toContain('basket');
  });

  it('« café » (bar) isolé ne tire pas cafe ; « café » + « espresso » → cafe', () => {
    expect(themes('on se retrouve au café du coin à midi')).not.toContain('cafe');
    expect(themes('un café en grains pour un bon espresso')).toContain('cafe');
  });

  it('« combat » (figuré) isolé ne tire pas sports_combat ; « combat » + « mma » → sports_combat', () => {
    expect(themes('le combat contre le réchauffement climatique')).not.toContain('sports_combat');
    expect(themes('un combat de mma dans la cage')).toContain('sports_combat');
  });

  it('« house » (maison) isolé ne tire pas electro ; « house » + « techno » → electro', () => {
    expect(themes('la house dans laquelle je vis est grande')).not.toContain('electro');
    expect(themes('un mix de house et de techno toute la nuit')).toContain('electro');
  });

  it('« battle » isolé ne tire pas danse ; « battle » + « breakdance » → danse', () => {
    expect(themes('une battle de rap improvisée')).not.toContain('danse');
    expect(themes('une battle de breakdance ce soir')).toContain('danse');
  });
});

describe('interests — co-occurrence & adversité lot 4 (PANO-89)', () => {
  it('« histoire » (récit) isolé ne tire pas histoire ; « histoire » + « napoleon » → histoire', () => {
    expect(themes('raconte-moi une histoire pour dormir')).not.toContain('histoire');
    expect(themes("une histoire sur napoleon et l'empire romain")).toContain('histoire');
  });

  it('« espace » (client) isolé ne tire pas astronomie ; « espace » + « nasa » → astronomie', () => {
    expect(themes('connecte-toi à ton espace client')).not.toContain('astronomie');
    expect(themes("la nasa explore l'espace avec le james webb")).toContain('astronomie');
  });

  it('« jardin » (secret) isolé ne tire pas jardinage ; « jardin » + « potager » → jardinage', () => {
    expect(themes('son jardin secret reste bien gardé')).not.toContain('jardinage');
    expect(themes('un potager au fond du jardin en permaculture')).toContain('jardinage');
  });
});

describe('interests — FRONTIÈRE psychologie ACADÉMIQUE vs CLINIQUE (PANO-89, renforcée)', () => {
  it('terme ACADÉMIQUE → thème psychologie (D2), et aucun label sensible D1', () => {
    const phrase = 'le conditionnement pavlovien et la psychanalyse de freud';
    expect(themes(phrase)).toContain('psychologie');
    expect(d1Labels(phrase)).toEqual([]);
  });

  it('terme CLINIQUE → mental_health (D1), JAMAIS le thème psychologie (D2) — pas de fuite', () => {
    // Le vécu/clinique appartient à D1 et ne fuit pas dans le thème d'intérêt académique.
    const phrase = 'je fais une grosse depression et je vois un psy chaque semaine';
    expect(themes(phrase)).not.toContain('psychologie');
    expect(d1Labels(phrase)).toContain('mental_health');
  });
});

describe('interests — ENTITÉS rétrofit lot 1 (PANO-90) : marques/jargon ajoutés tirent', () => {
  const CASES: Array<[string, string]> = [
    ['muscu', 'gros drop set à la salle avec de la myprotein'],
    ['running', 'petit footing tracké sur strava avec ma garmin'],
    ['football', 'quel match du psg avec mbappe hier soir'],
    ['gaming', 'une bonne partie de fortnite sur ps5'],
    ['ia', "j'utilise dall e et hugging face pour mes projets"],
    ['crypto', 'je hodl mes bitcoin, je ne vends jamais'],
    ['cuisine', "un ramen maison préparé à l'air fryer"],
    ['maquillage', 'un fond de teint fenty beauty et un cut crease'],
    ['skincare', 'ma routine cerave et the ordinary du soir'],
    ['sneakers', 'des dunk low dénichées sur stockx'],
    ['kpop', 'trop hâte du comeback kpop de riize chez hybe'],
    ['manga_anime', 'je regarde jujutsu kaisen sur crunchyroll'],
  ];
  for (const [label, phrase] of CASES) {
    it(`« ${phrase} » → ${label}`, () => {
      expect(themes(phrase)).toContain(label);
    });
  }

  it('« real » (adjectif) isolé ne tire pas football ; « real » + « psg » → football', () => {
    expect(themes('sois un peu plus real avec toi-même')).not.toContain('football');
    expect(themes('le real et le psg, quel choc ce soir')).toContain('football');
  });

  it('« mac » (ordinateur) isolé ne tire pas maquillage ; « mac » + « rouge a levres » → maquillage', () => {
    expect(themes('mon nouveau mac est vraiment rapide')).not.toContain('maquillage');
    expect(themes('un rouge a levres mac magnifique')).toContain('maquillage');
  });
});

describe('interests — VARIANTES ANGLAISES (PANO-88) : formes EN en usage FR', () => {
  const CASES: Array<[string, string]> = [
    ['muscu', 'gros push day à la salle avec de la whey'],
    ['fitness', 'un bon workout hiit ce matin'],
    ['gaming', 'nouveau loadout et le battle pass de la saison'],
    ['tech', 'une vidéo unboxing de mon nouveau smartphone'],
    ['skincare', 'toute ma routine pour réparer la skin barrier'],
    ['maquillage', 'un grwm en full glam pour ce soir'],
    ['mode', 'un try on haul de mes achats vinted'],
    ['sneakers', 'un petit on feet de mes air max'],
    ['crypto', 'méfiez-vous du rug pull sur ce token'],
    ['lecture', 'un buddy read de dark romance ce mois-ci'],
  ];
  for (const [label, phrase] of CASES) {
    it(`« ${phrase} » → ${label}`, () => {
      expect(themes(phrase)).toContain(label);
    });
  }

  it('« gym » (gymnastique) isolé ne tire pas muscu ; « gym » + « musculation » → muscu', () => {
    expect(themes('un cours de gym au collège ce matin')).not.toContain('muscu');
    expect(themes('gym et musculation, ma routine du lundi')).toContain('muscu');
  });

  it('« outfit » isolé ne tire pas mode ; « outfit » + « streetwear » → mode', () => {
    expect(themes('joli outfit dis donc')).not.toContain('mode');
    expect(themes('un outfit streetwear parfait')).toContain('mode');
  });

  it('« moon » (lune) isolé ne tire pas crypto ; « moon » + « bitcoin » → crypto', () => {
    expect(themes('la moon est magnifique ce soir')).not.toContain('crypto');
    expect(themes('le bitcoin va to the moon')).toContain('crypto');
  });

  it('« cop » (flic) isolé ne tire pas sneakers ; « cop » + « jordan » → sneakers', () => {
    expect(themes('un cop de la police municipale')).not.toContain('sneakers');
    expect(themes('je vais cop ces air jordan direct')).toContain('sneakers');
  });
});

describe('interests — VARIANTES ANGLAISES, extension D2 restants (PANO-88) : détection EN', () => {
  const CASES: Array<[string, string]> = [
    // Animaux / loisirs
    ['chats', 'my kitten wont stop meowing near the litter box'],
    ['chiens', 'my puppy loves the dog park, such a good doggo'],
    ['lapins', 'my house rabbit gets timothy hay every morning'],
    ['patisserie', 'my sourdough starter is ready, time for some baking'],
    ['cuisine_vege', 'a plant based bowl with hummus and nutritional yeast'],
    ['jardinage', 'my monstera loves the potting soil, planttok was right'],
    ['tricot', 'frogging the whole thing, back to my knitting needles'],
    ['dessin', 'a full page of sketching in my sketchbook today'],
    // Disciplines
    ['philosophie', 'stoicism and existentialism, straight from socrates'],
    ['sociologie', 'cultural capital and social mobility explain a lot'],
    ['psychologie', 'cognitive dissonance is peak social psychology'],
    ['histoire', 'the roman empire and the crusades fascinate me'],
    ['economie', 'macroeconomics and monetary policy, the gdp explained'],
    ['biologie', 'photosynthesis, mitosis and dna, pure biology'],
    ['physique', 'quantum physics and general relativity are wild'],
    ['mathematiques', 'algebra, topology and a nice theorem to prove'],
    ['astronomie', 'a black hole and an exoplanet seen by stargazing'],
  ];
  for (const [label, phrase] of CASES) {
    it(`« ${phrase} » → ${label}`, () => {
      expect(themes(phrase)).toContain(label);
    });
  }
});

describe('interests — ADVERSITÉ EN : le sens NON-domaine ne franchit pas la barre (PANO-88)', () => {
  // Le foyer du couple recall/FP en EN : les mots courts EN sont massivement polysémiques. Chaque
  // piège ci-dessous est un usage EN ORDINAIRE qui ne parle PAS du domaine.
  const TRAPS: Array<[string, string]> = [
    ['histoire « history » (historique de recherche)', 'let me clear my search history real quick'],
    ['histoire « history » (relationnel)', 'i have a long history with that guy'],
    ['philosophie « philosophy » (devise perso)', 'my philosophy in life is to stay kind'],
    ['economie « economy » (classe éco)', 'i booked economy class for the flight'],
    ['mathematiques « math » (idiome)', 'just do the math and you will see'],
    ['mathematiques « integral » (adjectif)', 'she is an integral part of this team'],
    ['jardinage « propagation » (tech)', 'error propagation in the network is a mess'],
    ['jardinage « succulent » (savoureux)', 'what a succulent meal that was'],
    ['tricot « stash » (planque)', 'i keep my snacks in a secret stash'],
    ['lapins « rabbit » (rabbit hole)', 'i went down the rabbit hole again last night'],
    ['chiens « fetch » (données)', 'the app has to fetch the data from the server'],
    ['patisserie « dough » (argent)', 'he is making serious dough this year'],
    ['patisserie « icing » (figuré)', 'and that was just the icing on the cake'],
    ['dessin « rendering » (3D)', 'the rendering of the 3d scene takes forever'],
    ['astronomie « star » (célébrité)', 'she is a huge pop star now'],
    ['biologie « cell » (prison)', 'they locked him in a cell overnight'],
    ['sociologie « class » (cours)', 'i have class tomorrow morning at eight'],
    ['physique « mass » (messe)', 'we go to mass every sunday morning'],
  ];
  for (const [why, phrase] of TRAPS) {
    it(`${why} → aucun thème`, () => {
      expect(themes(phrase)).toEqual([]);
    });
  }
});

describe('interests — EXCLUS EN : jamais listés, même en ancré (PANO-88)', () => {
  const TRAPS: Array<[string, string]> = [
    ['jardinage « prop » (props to you)', 'big props to you for that one'],
    ['tricot « ufo » (soucoupe)', 'i swear i saw a ufo last night'],
    ['biologie « bio » (bio de profil)', 'the link is in my bio go check it'],
    // NB : « dj set » est un marqueur `electro` LÉGITIME — le piège porte donc sur « set » nu.
    ['mathematiques « set » (verbe / objet)', 'we set the table before dinner'],
    ['dessin « oc » (2 lettres)', 'oc is my favorite abbreviation apparently'],
  ];
  for (const [why, phrase] of TRAPS) {
    it(`${why} → aucun thème`, () => {
      expect(themes(phrase)).toEqual([]);
    });
  }
});

describe('interests — co-occurrence EN : l’ancré est RÉCUPÉRÉ par un compagnon (PANO-88)', () => {
  it('« history » + « roman empire » → histoire', () => {
    expect(themes('the history of the roman empire is fascinating')).toContain('histoire');
  });
  it('« philosophy » + « stoicism » → philosophie', () => {
    expect(themes('the philosophy behind stoicism is underrated')).toContain('philosophie');
  });
  it('« economy » + « inflation » → economie', () => {
    expect(themes('the economy is hit hard by inflation')).toContain('economie');
  });
  it('« succulent » + « houseplant » → jardinage', () => {
    expect(themes('my succulent and my houseplant are thriving')).toContain('jardinage');
  });
  it('DEUX ancrés maths (« math » + « matrix ») s’ancrent mutuellement → mathematiques', () => {
    expect(themes('the math behind a matrix is elegant')).toContain('mathematiques');
  });
});

describe('interests — FRONTIÈRE psychologie EN : académique vs clinique (PANO-88)', () => {
  it('terme ACADÉMIQUE EN → psychologie (D2), et aucun label sensible D1', () => {
    const phrase = 'cognitive bias and operant conditioning, classic psychoanalysis debate';
    expect(themes(phrase)).toContain('psychologie');
    expect(d1Labels(phrase)).toEqual([]);
  });

  it('« reverse psychology » (idiome) n’est PAS un signal académique → aucun thème', () => {
    // « psychology » nu est ANCRÉ (pas solo) : sans compagnon académique, l’idiome ne tire pas.
    expect(themes('she is just using reverse psychology on you')).toEqual([]);
  });
});

describe('interests — recall SOLO absorbé par le plancher (méthode inversée)', () => {
  it('« recette » (SOLO) tire au niveau detect, mais 1 hit isolé ne passe pas le plancher règle', () => {
    // Au niveau détecteur, « recette » (haute valeur, solo) tire — recall assumé.
    expect(themes('la recette du succès reste le travail')).toContain('cuisine');
    // Au niveau RÈGLE, un seul hit isolé est sous le plancher (2) → aucun thème émis : le bruit
    // résiduel du recall est noyé par le classement/plancher du socle, pas par l’exclusion.
    const out = d2Interests(
      withComments(['la recette du succès reste le travail', 'belle lumière ce soir']),
    );
    expect(out.map((t) => t.id)).not.toContain('cuisine');
  });
});

describe('interests — FRONTIÈRE sensible (garde dur : aucun marqueur ne déclenche D1)', () => {
  // Chaque marqueur (et terme auto-déclaré) est passé COMME UN TEXTE dans D1. Un hit ici n'est pas
  // qu'un test rouge : c'est un marqueur d'intérêt qui frôle un sujet sensible → à remonter à yuya.
  it('aucun marqueur (solo, ancré, selfDeclared) d’intérêt ne tague un label sensible', () => {
    const offenders: Array<{ term: string; theme: string; d1: string[] }> = [];
    for (const lexicon of INTEREST_LEXICONS) {
      for (const term of allTerms(lexicon)) {
        const hit = d1Labels(term);
        if (hit.length > 0) {
          offenders.push({ term, theme: lexicon.label, d1: hit });
        }
      }
    }
    expect(offenders, `frontière sensible franchie : ${JSON.stringify(offenders)}`).toEqual([]);
  });
});

describe('interests — hygiène / structure', () => {
  it('tous les marqueurs sont en forme normalisée (minuscules, sans accent, sans apostrophe brute)', () => {
    const malformed: string[] = [];
    for (const lexicon of INTEREST_LEXICONS) {
      for (const term of allTerms(lexicon)) {
        if (normalizeFr(term).norm !== term) {
          malformed.push(`${lexicon.label}: « ${term} »`);
        }
      }
    }
    expect(malformed, `marqueurs non normalisés : ${malformed.join(', ')}`).toEqual([]);
  });

  it('tout thème CÂBLÉ est déclaré au catalogue ratifié (câblé ⊆ canonique)', () => {
    const orphans = INTEREST_LEXICONS.map((l) => l.label).filter(
      (id) => !CANONICAL_THEME_IDS.has(id),
    );
    expect(
      orphans,
      `thèmes hors catalogue (extension non ratifiée) : ${orphans.join(', ')}`,
    ).toEqual([]);
  });

  it('identités de thème uniques (aucun doublon de slug)', () => {
    const ids = INTEREST_LEXICONS.map((l) => l.label);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// --- Dédup PARTAGÉE D1×D2 sur lexiques RÉELS -----------------------------------------------------

function withComments(texts: readonly string[]): ReturnType<typeof normalizeExport> {
  const base = validTikTokExport() as TikTokExport & {
    Comment: { Comments: { CommentsList: readonly CommentItem[] } };
  };
  base.Comment.Comments.CommentsList = texts.map((comment, i) => ({
    date: `2026-06-15 10:00:0${i % 10} UTC`,
    comment,
    photo: '',
    video: '',
    sticker: '',
    originalPostUrl: `https://example.invalid/post/${i}`,
    'original post link': '',
  }));
  return normalizeExport(base);
}

describe('interests — CO-CITATION D1×D2 d’un même commentaire, sur lexiques réels', () => {
  it('un commentaire prouvant un intérêt ET un constat sensible est cité par les deux, chacun avec SES surfaces', () => {
    // Ex-« stocké UNE fois, référencé par les deux » : le magasin est supprimé, la dédup par
    // `EvidenceId` avec lui, et le verbatim est DUPLIQUÉ (arbitrage yuya). Le verrou qui comptait
    // survit intact — et c'est le seul qui comptait : deux constats citant la même source ne se
    // prêtent JAMAIS leurs surfaces (« jeu video » côté intérêt, « dépression » côté sensible).
    // C'est aussi ce que la duplication rend structurellement possible.
    const input = withComments([
      'un bon jeu video ce soir', // gaming 1
      'encore ce jeu video, ma dépression me plombe', // gaming 2 + mental_health explicite
    ]);
    const out = analyze(input);

    /** La citation du commentaire d'index 1 par ce constat, s'il le cite. */
    const cite = (evidence: readonly Evidence[]): Evidence | undefined =>
      evidence.find((e) => e.channel === 'comment' && e.sourceIndex === 1);

    const gaming = out.themes.find((t) => t.id === 'gaming')?.deductions[0];
    const sensible = out.signals[0];
    expect(gaming, 'thème gaming attendu').toBeDefined();
    expect(sensible, 'constat sensible attendu').toBeDefined();

    const parIntéret = cite(gaming?.evidence ?? []);
    const parSensible = cite(sensible?.evidence ?? []);
    expect(parIntéret, 'comment:1 cité par le thème').toBeDefined();
    expect(parSensible, 'comment:1 cité par le signal').toBeDefined();

    // Même source, verbatim dupliqué — le coût assumé...
    expect(parIntéret?.text).toBe(parSensible?.text);
    // ... et surfaces DISTINCTES : le gain, et ce que le magasin partagé ne pouvait pas garantir.
    expect(parIntéret?.triggerTerms).not.toEqual(parSensible?.triggerTerms);

    // D2 n'émet jamais de constat sensible, même en partageant la preuve d'un constat qui l'est.
    for (const theme of out.themes) {
      for (const deduction of theme.deductions) {
        expect(deduction.sensitive).toBe(false);
      }
    }
  });
});
