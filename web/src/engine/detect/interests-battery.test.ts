// Battery of the real D2 CONTENT (interest lexicons batch 1, PANO-76) — counterpart of
// `lexicon-battery.test.ts` (D1). Exercises the real lexicons (`INTEREST_LEXICONS`), not fake ones.
// Four families of guard:
//   1. intentional detection — each theme of the batch fires on a representative sentence;
//   2. adversity (FP probe) — the SET-ASIDE terms (polysemy) do NOT fire;
//   3. sensitive BOUNDARY — NO interest marker triggers one of the 6 D1 lexicons (hard guard);
//   4. hygiene/structure — normalized markers; wired themes ⊆ ratified catalog.
// + the D1×D2 CO-CITATION of a multi-use comment (cf. the last `describe`).
// 100% SYNTHETIC sentences, never drawn from a real export (PANO-70 §3 discipline).
//
// CARRIED TO REFONTE A. Guards 1 to 4 hit `detect/` + `lexicon/` (UNTOUCHABLE) and do not move a
// line. Only the last `describe` touched the engine, and it is INVERTED rather than translated —
// same swap as the D1 goldens, for the same reason: the evidence store is removed, the verbatim is
// DUPLICATED between co-citing findings (yuya arbitration, assumed cost). What « stored ONCE »
// protected has no object anymore; what really mattered survives and states itself better.

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

/** Detected interest themes (sorted) on a list of synthetic comments. */
function themes(...texts: string[]): string[] {
  return detectLabels(texts, INTEREST_LEXICONS)
    .map((d) => d.label)
    .sort();
}

/** Sensitive labels (D1) detected on a text — for the boundary guard. */
function d1Labels(text: string): string[] {
  return detectLabels([text], WIRED_LEXICONS).map((d) => d.label);
}

/** All the terms of an interest lexicon (the 3 tiers) — for the boundary/hygiene guards. */
function allTerms(lexicon: (typeof INTEREST_LEXICONS)[number]): string[] {
  return [...lexicon.markers, ...(lexicon.anchored ?? []), ...(lexicon.selfDeclared ?? [])];
}

describe('interests — intentional detection (each wired theme fires)', () => {
  const CASES: Array<[string, string]> = [
    // Batch 1 (PANO-76)
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
    // Batch 2 (PANO-77)
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
    // Batch 3 (PANO-78)
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
    // Batch 4 (PANO-89)
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

describe('interests — adversity: ANCHORED isolated (without a companion) does NOT fire', () => {
  // PANO-76 method: these 50/50 are INCLUDED (anchored tier), but an isolated anchored is set aside
  // by co-occurrence — the non-domain sense does not cross the bar without a domain companion.
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
    // Batch 2 (PANO-77)
    ['chats « chat » (messagerie)', "je t'écris sur le chat du serveur discord"],
    ['mode « mode » (mode d’emploi)', "regarde le mode d'emploi du grille-pain"],
    ['voyage « vol » (larcin)', "il y a eu un vol dans l'immeuble cette nuit"],
    ['photo « objectif » (but)', 'mon seul objectif est de réussir cette année'],
    ['tech « apple » (fruit)', 'une belle part de apple pie maison'],
  ];
  for (const [why, phrase] of TRAPS) {
    it(`${why} → no theme`, () => {
      expect(themes(phrase)).toEqual([]);
    });
  }
});

describe('interests — adversity: EXCLUDED (never listed, even anchored)', () => {
  const TRAPS: Array<[string, string]> = [
    ['kpop « bts » (diplôme)', 'je prépare mon bts en informatique'],
    ['ia « claude » (prénom)', "j'adore le prénom claude"],
    ['ia « opus » (mot courant)', 'quel opus magnifique vraiment'],
    ['ia « ia » nu (2 lettres)', 'la via appia est une route antique'],
  ];
  for (const [why, phrase] of TRAPS) {
    it(`${why} → no theme`, () => {
      expect(themes(phrase)).toEqual([]);
    });
  }
});

describe('interests — co-occurrence on REAL lexicons (anchored RECOVERED by a companion)', () => {
  it('« but » + foot term → football (the anchored counts with a companion)', () => {
    expect(themes('quel but magnifique en ligue 1')).toContain('football');
  });
  it('« console » + gaming term → gaming', () => {
    expect(themes('je joue sur ma console avec une manette')).toContain('gaming');
  });
  it('« defi » + crypto term → crypto (recovery of the 50/50)', () => {
    expect(themes('je relève le défi bitcoin cette année')).toContain('crypto');
  });
  it('« jordan » + sneakers term → sneakers', () => {
    expect(themes('mes air max et mes jordan préférées')).toContain('sneakers');
  });
  // Batch 2 (PANO-77)
  it('« chat » + chats term → chats (recovery of the 50/50 messaging)', () => {
    expect(themes('mon chat et sa litière sont impeccables')).toContain('chats');
  });
  it('« mode » + mode term → mode', () => {
    expect(themes('la mode et le streetwear de cette saison')).toContain('mode');
  });
  it('TWO tech anchored (« tablette » + « apple ») anchor each other → tech', () => {
    expect(themes('la nouvelle tablette apple vient de sortir')).toContain('tech');
  });
});

describe('interests — ENTITIES & jargon (batch 2 enriched, PANO-77): the brands/acronyms fire', () => {
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

  it('« golf » (sport) isolated does not fire voitures; « golf » + « jantes » → voitures', () => {
    expect(themes('une bonne partie de golf ce dimanche')).not.toContain('voitures');
    expect(themes('ma golf avec des jantes neuves')).toContain('voitures');
  });

  it('« ram » (bélier) isolated does not fire tech; « ram » + « cpu » → tech', () => {
    expect(themes('un bélier de la race ram dans le champ')).not.toContain('tech');
    expect(themes("j'ai boosté ma ram et changé le cpu")).toContain('tech');
  });
});

describe('interests — co-occurrence & adversity batch 3 (PANO-78)', () => {
  it('« panier » (courses) isolated does not fire basket; « panier » + basket term → basket', () => {
    expect(themes('je remplis mon panier au supermarché')).not.toContain('basket');
    expect(themes('un panier à trois points en nba')).toContain('basket');
  });

  it('« café » (bar) isolated does not fire cafe; « café » + « espresso » → cafe', () => {
    expect(themes('on se retrouve au café du coin à midi')).not.toContain('cafe');
    expect(themes('un café en grains pour un bon espresso')).toContain('cafe');
  });

  it('« combat » (figuré) isolated does not fire sports_combat; « combat » + « mma » → sports_combat', () => {
    expect(themes('le combat contre le réchauffement climatique')).not.toContain('sports_combat');
    expect(themes('un combat de mma dans la cage')).toContain('sports_combat');
  });

  it('« house » (maison) isolated does not fire electro; « house » + « techno » → electro', () => {
    expect(themes('la house dans laquelle je vis est grande')).not.toContain('electro');
    expect(themes('un mix de house et de techno toute la nuit')).toContain('electro');
  });

  it('« battle » isolated does not fire danse; « battle » + « breakdance » → danse', () => {
    expect(themes('une battle de rap improvisée')).not.toContain('danse');
    expect(themes('une battle de breakdance ce soir')).toContain('danse');
  });
});

describe('interests — co-occurrence & adversity batch 4 (PANO-89)', () => {
  it('« histoire » (récit) isolated does not fire histoire; « histoire » + « napoleon » → histoire', () => {
    expect(themes('raconte-moi une histoire pour dormir')).not.toContain('histoire');
    expect(themes("une histoire sur napoleon et l'empire romain")).toContain('histoire');
  });

  it('« espace » (client) isolated does not fire astronomie; « espace » + « nasa » → astronomie', () => {
    expect(themes('connecte-toi à ton espace client')).not.toContain('astronomie');
    expect(themes("la nasa explore l'espace avec le james webb")).toContain('astronomie');
  });

  it('« jardin » (secret) isolated does not fire jardinage; « jardin » + « potager » → jardinage', () => {
    expect(themes('son jardin secret reste bien gardé')).not.toContain('jardinage');
    expect(themes('un potager au fond du jardin en permaculture')).toContain('jardinage');
  });
});

describe('interests — ACADEMIC vs CLINICAL psychology BOUNDARY (PANO-89, reinforced)', () => {
  it('ACADEMIC term → psychologie theme (D2), and no D1 sensitive label', () => {
    const phrase = 'le conditionnement pavlovien et la psychanalyse de freud';
    expect(themes(phrase)).toContain('psychologie');
    expect(d1Labels(phrase)).toEqual([]);
  });

  it('CLINICAL term → mental_health (D1), NEVER the psychologie theme (D2) — no leak', () => {
    // The lived/clinical belongs to D1 and does not leak into the academic interest theme.
    const phrase = 'je fais une grosse depression et je vois un psy chaque semaine';
    expect(themes(phrase)).not.toContain('psychologie');
    expect(d1Labels(phrase)).toContain('mental_health');
  });
});

describe('interests — ENTITIES retrofit batch 1 (PANO-90): added brands/jargon fire', () => {
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

  it('« real » (adjectif) isolated does not fire football; « real » + « psg » → football', () => {
    expect(themes('sois un peu plus real avec toi-même')).not.toContain('football');
    expect(themes('le real et le psg, quel choc ce soir')).toContain('football');
  });

  it('« mac » (ordinateur) isolated does not fire maquillage; « mac » + « rouge a levres » → maquillage', () => {
    expect(themes('mon nouveau mac est vraiment rapide')).not.toContain('maquillage');
    expect(themes('un rouge a levres mac magnifique')).toContain('maquillage');
  });
});

describe('interests — ENGLISH VARIANTS (PANO-88): EN forms in FR use', () => {
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

  it('« gym » (gymnastique) isolated does not fire muscu; « gym » + « musculation » → muscu', () => {
    expect(themes('un cours de gym au collège ce matin')).not.toContain('muscu');
    expect(themes('gym et musculation, ma routine du lundi')).toContain('muscu');
  });

  it('« outfit » isolated does not fire mode; « outfit » + « streetwear » → mode', () => {
    expect(themes('joli outfit dis donc')).not.toContain('mode');
    expect(themes('un outfit streetwear parfait')).toContain('mode');
  });

  it('« moon » (lune) isolated does not fire crypto; « moon » + « bitcoin » → crypto', () => {
    expect(themes('la moon est magnifique ce soir')).not.toContain('crypto');
    expect(themes('le bitcoin va to the moon')).toContain('crypto');
  });

  it('« cop » (flic) isolated does not fire sneakers; « cop » + « jordan » → sneakers', () => {
    expect(themes('un cop de la police municipale')).not.toContain('sneakers');
    expect(themes('je vais cop ces air jordan direct')).toContain('sneakers');
  });
});

describe('interests — ENGLISH VARIANTS, remaining D2 extension (PANO-88): EN detection', () => {
  const CASES: Array<[string, string]> = [
    // Animals / hobbies
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

describe('interests — EN ADVERSITY: the NON-domain sense does not cross the bar (PANO-88)', () => {
  // The hotbed of the recall/FP couple in EN: short EN words are massively polysemous. Each trap
  // below is an ORDINARY EN use that does NOT speak of the domain.
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
    it(`${why} → no theme`, () => {
      expect(themes(phrase)).toEqual([]);
    });
  }
});

describe('interests — EN EXCLUDED: never listed, even anchored (PANO-88)', () => {
  const TRAPS: Array<[string, string]> = [
    ['jardinage « prop » (props to you)', 'big props to you for that one'],
    ['tricot « ufo » (soucoupe)', 'i swear i saw a ufo last night'],
    ['biologie « bio » (bio de profil)', 'the link is in my bio go check it'],
    // NB: « dj set » is a LEGITIMATE `electro` marker — the trap therefore bears on bare « set ».
    ['mathematiques « set » (verbe / objet)', 'we set the table before dinner'],
    ['dessin « oc » (2 lettres)', 'oc is my favorite abbreviation apparently'],
  ];
  for (const [why, phrase] of TRAPS) {
    it(`${why} → no theme`, () => {
      expect(themes(phrase)).toEqual([]);
    });
  }
});

describe('interests — EN co-occurrence: the anchored is RECOVERED by a companion (PANO-88)', () => {
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
  it('TWO maths anchored (« math » + « matrix ») anchor each other → mathematiques', () => {
    expect(themes('the math behind a matrix is elegant')).toContain('mathematiques');
  });
});

describe('interests — EN psychology BOUNDARY: academic vs clinical (PANO-88)', () => {
  it('ACADEMIC EN term → psychologie (D2), and no D1 sensitive label', () => {
    const phrase = 'cognitive bias and operant conditioning, classic psychoanalysis debate';
    expect(themes(phrase)).toContain('psychologie');
    expect(d1Labels(phrase)).toEqual([]);
  });

  it('« reverse psychology » (idiom) is NOT an academic signal → no theme', () => {
    // Bare « psychology » is ANCHORED (not solo): without an academic companion, the idiom does not fire.
    expect(themes('she is just using reverse psychology on you')).toEqual([]);
  });
});

describe('interests — SOLO recall absorbed by the floor (inverted method)', () => {
  it('« recette » (SOLO) fires at the detect level, but 1 isolated hit does not pass the rule floor', () => {
    // At the detector level, « recette » (high value, solo) fires — assumed recall.
    expect(themes('la recette du succès reste le travail')).toContain('cuisine');
    // At the RULE level, a single isolated hit is below the floor (2) → no theme emitted: the
    // residual noise of the recall is drowned by the base ranking/floor, not by exclusion.
    const out = d2Interests(
      withComments(['la recette du succès reste le travail', 'belle lumière ce soir']),
    );
    expect(out.map((t) => t.id)).not.toContain('cuisine');
  });
});

describe('interests — sensitive BOUNDARY (hard guard: no marker triggers D1)', () => {
  // Each marker (and self-declared term) is passed AS A TEXT through D1. A hit here is not just a
  // red test: it is an interest marker that brushes a sensitive subject → to be raised to yuya.
  it('no interest marker (solo, anchored, selfDeclared) tags a sensitive label', () => {
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

describe('interests — hygiene / structure', () => {
  it('all markers are in normalized form (lowercase, no accent, no raw apostrophe)', () => {
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

  it('every WIRED theme is declared in the ratified catalog (wired ⊆ canonical)', () => {
    const orphans = INTEREST_LEXICONS.map((l) => l.label).filter(
      (id) => !CANONICAL_THEME_IDS.has(id),
    );
    expect(
      orphans,
      `thèmes hors catalogue (extension non ratifiée) : ${orphans.join(', ')}`,
    ).toEqual([]);
  });

  it('unique theme identities (no slug doublon)', () => {
    const ids = INTEREST_LEXICONS.map((l) => l.label);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// --- SHARED D1×D2 dedup on REAL lexicons ---------------------------------------------------------

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

describe('interests — D1×D2 CO-CITATION of the same comment, on real lexicons', () => {
  it('a comment proving an interest AND a sensitive finding is cited by both, each with ITS surfaces', () => {
    // Former « stored ONCE, referenced by both »: the store is removed, the dedup by `EvidenceId`
    // with it, and the verbatim is DUPLICATED (yuya arbitration). The lock that mattered survives
    // intact — and it is the only one that mattered: two findings citing the same source NEVER lend
    // each other their surfaces (« jeu video » on the interest side, « dépression » on the sensitive
    // side). It is also what the duplication makes structurally possible.
    const input = withComments([
      'un bon jeu video ce soir', // gaming 1
      'encore ce jeu video, ma dépression me plombe', // gaming 2 + explicit mental_health
    ]);
    const out = analyze(input);

    /** The citation of the comment at index 1 by this finding, if it cites it. */
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

    // Same source, verbatim duplicated — the assumed cost...
    expect(parIntéret?.text).toBe(parSensible?.text);
    // ... and DISTINCT surfaces: the gain, and what the shared store could not guarantee.
    expect(parIntéret?.triggerTerms).not.toEqual(parSensible?.triggerTerms);

    // D2 never emits a sensitive finding, even while sharing the evidence of one that is.
    for (const theme of out.themes) {
      for (const deduction of theme.deductions) {
        expect(deduction.sensitive).toBe(false);
      }
    }
  });
});
