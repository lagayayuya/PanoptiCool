// Vue de résultats « parcours guidé » (maquette « PanoptiCool v4 », refonte 2026-07-15) — remplace
// `ResultsPage` (qui reste servie telle quelle sur /temp). Quatre étapes, du plus factuel au plus
// interprété : 01 activité (rythme + volumes + mur sémantique), 02 déductions par thème
// (`ThemeCardNavy` ; les constats sans thème deviennent des cartes NORMALES, `SignalCardNavy`),
// 03 en résumé (contenu statique de la maquette), 04 IA locale (`AiSection`, bande pleine largeur).
//
// Sections de l'ancienne page ABSENTES de la maquette, donc RETIRÉES d'ici (décision yuya, refonte) :
// carte « ciblage publicitaire » (adPrivacyGroup), carte appareil/réseau (deviceNetworkGroup),
// cadre générique `exposedGroup`, cartes `absence`/`exposed` isolées. Les données du panneau
// Activité (PANO-84) et du mur sémantique (opacity) sont REVENTILÉES dans la section 01 plutôt que
// supprimées. Le bloc « rester informé » du sommaire de la maquette (newsletter) n'est PAS repris.

import type { VNode } from 'preact';
import { useState } from 'preact/hooks';
import type { Analysis } from '../../engine/analysis';
import { AnalyzableShareCard, RhythmCard, VolumesCard } from './ActivitySection';
import { AiMobileNotice, AiSection } from './AiSection';
import type { AiSource } from './ai-source';
import { EyeLogo } from './EyeLogo';
import { LearnPanel, LearnToggle } from './LearnPanel';
import { NoDeductionCard } from './NoDeductionCard';
import { NAVY } from './palette';
import { buildReuseMap, type Citation } from './reuse';
import {
  CONFIDENCE_RANK,
  distinctEvidenceCount,
  type Level,
  SignalCardNavy,
  ThemeCardNavy,
  themeLevel,
} from './ThemeCardNavy';
import { useIsMobile } from './useIsMobile';

/**
 * Légende de confiance — « solide » RETIRÉ (décision yuya, Refonte A).
 *
 * `high` n'a AUCUN producteur, et n'en a jamais eu : le plafond `low|medium` de l'inféré couvrait
 * D1 comme D2 (mesuré, §2.1). La légende annonçait donc à l'utilisateur un niveau qu'aucune carte ne
 * peut porter — une légende sans référent, qui promet une gradation que la page ne rend pas.
 *
 * Le TYPE, lui, garde la porte ouverte (FORK 3 : `sensitive: false` autorise `high`) et
 * `LEVEL_LABEL` garde son entrée — permettre n'est pas produire. Si une règle émet un jour du
 * `high` (recoupement multi-canal ?), la légende reviendra CONÇUE, avec ce qui l'atteint.
 *
 * ⚠ C'est le SEUL delta VOULU du golden de rendu sur cette refonte (4 lignes : la légende est rendue
 * une fois par cas). Le reste est à diff strictement nul. Un delta ordonné n'est pas une dérive —
 * mais il devait être isolé pour être lisible comme tel.
 */
const LEGEND = [
  { label: 'moyenne', color: NAVY.confidenceMedium },
  { label: 'incertaine', color: NAVY.confidenceLow },
] as const;

/**
 * HIÉRARCHIE DES CARTES DE DÉDUCTION (FORK 1, option (d) ratifiée yuya — audit §9).
 *
 * Le problème posé n'est PAS le nombre : « onze cartes à plat se neutralisent ; trois cartes fortes +
 * huit repliées, non ». Donc AUCUN constat n'est supprimé ni tu — `HIGHLIGHT_COUNT` cartes ouvrent la
 * section, le reste part derrière UN dépli qui ANNONCE SON COMPTE. Le plafond mesuré reste ~11
 * (≤ 6 signaux D1 + ≤ 5 thèmes D2) ; ce qui change est ce que l'œil rencontre, pas ce que la page dit.
 *
 * Le repli est un SECOND niveau : les cartes étaient déjà fermées une à une, mais onze en-têtes
 * alignés restent onze objets à trier pour le lecteur. C'est cet aplatissement-là qu'on retire.
 */
const HIGHLIGHT_COUNT = 3;

/** Une carte de la section 02, prête à rendre, avec les seuls nombres qui la classent.
 *  (Pas de champ `key` : la clé vit sur le `node`, là où Preact la lit — un champ de plus ici serait
 *  un champ que personne ne lit, exactement ce que l'audit reproche au moteur d'avant.) */
export interface RankedCard {
  /** `true` = constat D1 (santé mentale, politique…). Cf. `compareCards` : c'est le 1ᵉʳ critère. */
  sensitive: boolean;
  /** Niveau affiché par l'en-tête fermé (thème : le MAX de ses constats). */
  level: Level;
  /** Preuves DISTINCTES — le « M src » de l'en-tête. */
  src: number;
  node: VNode;
}

/**
 * L'ORDRE, et l'argument qui le tient. Trois critères, du plus décisif au départage :
 *
 *  1. LE SENSIBLE D'ABORD — ⚠ FORK OUVERT, c'est la porte de yuya (doctrine), pas la mienne. Retenu
 *     ici parce que `Analysis` a DÉJÀ tranché un cran plus bas : `signals` et `themes` sont deux
 *     champs séparés, et le type le motive — « un sujet sensible n'est pas un centre d'intérêt parmi
 *     d'autres — les mélanger les aplatirait ». Classer sur la seule confiance RE-FUSIONNERAIT les
 *     deux populations que le schéma tient disjointes, en contredisant cette décision depuis l'UI.
 *     Ce que ça coûte est réel et se dit : la page peut s'ouvrir sur « Santé mentale ».
 *  2. CONFIANCE DÉCROISSANTE — l'axe que la page ENSEIGNE déjà (légende du sommaire, 3 puces par
 *     carte). L'ordre se lit donc sans légende neuve : ce qui est en haut est ce que la plateforme
 *     oserait le plus. Et il DISCRIMINE vraiment — D1 comme D2 émettent `low` ET `medium`
 *     (`d1Level` : explicite ⇒ medium ; `d2Level` : auto-déclaré ou volumineux ⇒ medium).
 *  3. VOLUME DE PREUVES — départage SEULEMENT. Il ne peut pas être le critère principal : D2 s'en
 *     sert déjà pour son top-5 interne (`rankInterests`), le reprendre ici compterait deux fois la
 *     même chose ; et il mesure de quoi l'utilisateur PARLE le plus, quand la page traite de ce qui
 *     est déductible SUR lui — un sujet lâché une fois peut être le constat qui compte.
 *
 * À égalité complète, le tri STABLE (ES2019+) garde l'ordre du moteur — déterministe, testable.
 *
 * EXPORTÉ pour `ranking.test.ts` : ces trois critères sont de la DOCTRINE, et le golden de rendu ne
 * les atteint pas (la persona ne produit que 4 cartes, sur lesquelles le critère reproduit l'ordre
 * antérieur — il passerait à l'identique avec un comparateur faux). Le témoin est donc unitaire.
 */
export function compareCards(a: RankedCard, b: RankedCard): number {
  if (a.sensitive !== b.sensitive) {
    return a.sensitive ? -1 : 1;
  }
  if (a.level !== b.level) {
    return CONFIDENCE_RANK[b.level] - CONFIDENCE_RANK[a.level];
  }
  return b.src - a.src;
}

/** Les cartes de la section 02, classées. Les deux populations entrent, l'ordre les range. */
function rankedCards(output: Analysis, reuseMap: ReadonlyMap<string, Citation[]>): RankedCard[] {
  const cards: RankedCard[] = output.signals.map((signal, i) => ({
    sensitive: signal.sensitive,
    level: signal.confidence,
    src: distinctEvidenceCount([signal]),
    node: (
      <SignalCardNavy key={`signal-${signal.label}-${i}`} signal={signal} reuseMap={reuseMap} />
    ),
  }));
  for (const theme of output.themes) {
    cards.push({
      // Aucun thème n'est sensible : les deux populations sont disjointes par construction (§2.1).
      sensitive: false,
      // Un thème sans constat n'a pas de niveau ; il ne peut alors rien affirmer — donc le plus bas.
      level: themeLevel(theme.deductions) ?? 'low',
      src: distinctEvidenceCount(theme.deductions),
      node: <ThemeCardNavy key={theme.id} theme={theme} reuseMap={reuseMap} />,
    });
  }
  return cards.sort(compareCards);
}

/** Libellé du dépli — il ANNONCE COMBIEN il cache : replier n'est pas taire (option (d)). */
function restLabel(n: number): string {
  return n === 1 ? 'voir 1 autre déduction' : `voir les ${n} autres déductions`;
}

const TOC = [
  { n: '01', label: 'Ton activité', href: '#sec-activite' },
  { n: '02', label: 'Déductions', href: '#sec-deductions' },
  { n: '03', label: 'En résumé', href: '#sec-resume' },
  { n: '04', label: 'IA locale', href: '#sec-ia' },
] as const;

// Contenus pédagogiques statiques (wording de la maquette, validé dans Claude Design).
const LEARN_RYTHME = {
  question: 'Pourquoi mes horaires intéressent-ils TikTok ?',
  columns: [
    {
      title: 'Ce qui est mesuré',
      text: 'Chaque ouverture de l’app, chaque vidéo et chaque pause est horodatée. Ce ne sont pas tes contenus : ce sont des métadonnées — des données sur ton comportement.',
    },
    {
      title: 'Ce que ça permet',
      text: 'Mises bout à bout, elles dessinent ton rythme de vie : sommeil, trajets, moments creux. L’algorithme s’en sert pour te solliciter quand tu es le plus réceptif.',
    },
    {
      title: 'Pourquoi c’est sensible',
      text: 'Ces traces paraissent anodines, mais elles révèlent fatigue, insomnie ou disponibilité — des états exploitables commercialement, sans que tu aies rien « publié ».',
    },
  ],
} as const;

const LEARN_DEDUC = {
  question: 'Comment un algorithme « devine »-t-il ?',
  columns: [
    {
      title: 'Par comparaison',
      text: 'Il ne comprend pas tes mots : il compare tes traces à celles de millions d’autres comptes. Si ceux qui cherchent X font souvent Y, tu es rangé dans la case Y.',
    },
    {
      title: 'Avec un score',
      // « solide » RETIRÉ — dernier porteur du mot. Aucune règle n'émet `high` (le plafond de
      // l'inféré couvre D1 comme D2), et la légende du sommaire l'a déjà perdu (5f58023) pour cette
      // raison. Cette prose l'annonçait encore : elle promettait au lecteur une graduation à trois
      // crans que la page n'a jamais rendue — et l'enseignait dans le panneau censé la lui expliquer.
      // On nomme donc la graduation RÉELLEMENT offerte. Si une règle émet un jour du `high`, le mot
      // revient ici ET dans la légende, ensemble.
      text: 'Chaque déduction porte un niveau de confiance — c’est le sens des mentions moyenne / incertaine utilisées ici. Plus les signaux se recoupent, plus le score monte.',
    },
    {
      title: 'Donc faillible',
      text: 'C’est une corrélation statistique, pas une preuve : chercher « aider quelqu’un qui déprime » ne dit pas qui déprime. Mais la case, elle, reste attachée au profil.',
    },
  ],
  footnote:
    'Et PanoptiCool, dans cette section ? Rien de tout ça : on repère simplement tes mots dans des lexiques thématiques (cuisine, santé, politique…) — c’est le surlignage que tu vois. Bien plus rudimentaire que les modèles des plateformes, mais ça suffit à montrer le principe.',
} as const;

const LEARN_MARCHE = {
  question: 'Où vont ces profils ensuite ?',
  columns: [
    {
      title: 'Enchères en temps réel',
      text: 'À chaque contenu affiché, des annonceurs enchérissent en quelques millisecondes pour toucher ton profil. Les segments (« cuisine », « anxiété probable ») fixent le prix.',
    },
    {
      title: 'Courtiers de données',
      text: 'Des intermédiaires agrègent des segments venus de dizaines d’apps et les revendent — à des marques, des assureurs, parfois des autorités.',
    },
    {
      title: 'Tes droits (RGPD)',
      text: 'En Europe, tu peux demander l’accès à tes données, leur effacement, et t’opposer au profilage. L’export que tu analyses ici vient de ce droit d’accès.',
    },
  ],
} as const;

const DATA_TYPES = [
  'recherches',
  'commentaires',
  'métadonnées de session',
  'interactions',
  'visionnage',
] as const;

const ACTOR_TAKEAWAYS = [
  'centres d’intérêt et habitudes de consommation',
  'disponibilité, fatigue, fenêtres d’attention exploitables',
  'signaux sensibles — santé mentale, opinion politique, conflictualité — assortis d’un niveau de confiance',
  'des segments revendables à des annonceurs, courtiers de données, voire autorités',
] as const;

function SectionHead({
  id,
  n,
  title,
  sub,
  learn,
  isMobile,
}: {
  id: string;
  n: string;
  title: string;
  sub?: string;
  learn?: { open: boolean; label: string; onToggle: () => void };
  isMobile?: boolean;
}) {
  // Mobile (maquette « v4 Mobile ») : pas de filet, sous-titre sans retrait, bouton « comprendre »
  // SOUS le titre (align-self flex-start) plutôt qu'à droite.
  return (
    <div id={id} style={SEC_HEAD_WRAP}>
      <div style={SEC_HEAD_ROW}>
        <span style={SEC_N}>{n}</span>
        <span style={isMobile ? M_SEC_TITLE : SEC_TITLE}>{title}</span>
        {!isMobile && <span style={SEC_RULE} />}
        {!isMobile && learn !== undefined && (
          <LearnToggle open={learn.open} label={learn.label} onToggle={learn.onToggle} />
        )}
      </div>
      {sub !== undefined && <div style={isMobile ? M_SEC_SUB : SEC_SUB}>{sub}</div>}
      {isMobile && learn !== undefined && (
        <div style={{ alignSelf: 'flex-start' }}>
          <LearnToggle open={learn.open} label={learn.label} onToggle={learn.onToggle} />
        </div>
      )}
    </div>
  );
}

export function ResultsView({
  output,
  aiSource,
  demo = false,
}: {
  output: Analysis;
  aiSource?: AiSource;
  /** Mode démo (mobile : le badge de header n'a pas la place — l'info passe dans le kicker). */
  demo?: boolean;
}) {
  const [learn, setLearn] = useState<Record<string, boolean>>({});
  const toggleLearn = (key: string) => setLearn((l) => ({ ...l, [key]: !l[key] }));
  // Fermé par défaut : c'est le repli lui-même. (Le golden force les bascules `false` à `true` — il
  // voit donc TOUTES les cartes, et « aucune n'a disparu » se prouve par diff.)
  const [showRest, setShowRest] = useState(false);
  const isMobile = useIsMobile();

  // Ventilation par section — lot A1 : il n'y a plus rien à ventiler. Cette vue faisait TROIS
  // passes pour retrouver ce que le moteur savait déjà : `find(kind === 'aggregate')`,
  // `find(kind === 'opacity')`, et `buildPageBlocks` (144 lignes de regroupement par thème, de
  // dispatch sur un `Set` de `ruleId` et de filtrage des natures hors maquette). Le moteur nomme :
  // `output.rhythm`, `output.opacity`, `output.themes`, `output.signals` — le tri est lu, plus fait.
  //
  // Seul « aussi exploité par » demande encore un calcul, parce que c'est une relation ENTRE constats
  // qu'aucun d'eux ne porte seul : recalculée ici, plus stockée (C5, §5.4).
  const reuseMap = buildReuseMap(output);
  const hasDeductions = output.signals.length > 0 || output.themes.length > 0;

  // FORK 1 (option (d)) : les cartes sont CLASSÉES (`compareCards`) puis coupées en deux — aucune
  // n'est écartée, la coupe ne décide que du premier regard.
  const cards = rankedCards(output, reuseMap);
  const leadCards = cards.slice(0, HIGHLIGHT_COUNT);
  const restCards = cards.slice(HIGHLIGHT_COUNT);

  // Mobile (maquette « v4 Mobile ») : pas de sidebar (le sommaire vit en chips dans le header,
  // cf. SiteHeader/AnalysisPage), héros en colonne SANS l'œil, légende de confiance INLINE sous le
  // héros, kicker portant la mention démo.
  // Le suffixe démo ne vit dans le kicker QUE sur mobile — sur desktop, le badge du header porte
  // déjà l'information (pas de doublon).
  const kicker =
    demo && isMobile ? 'résultats d’analyse · démo, données fictives' : 'résultats d’analyse';

  return (
    <div style={PAGE}>
      <div style={isMobile ? M_SHELL : GRID}>
        {!isMobile && (
          <nav aria-label="Sommaire" style={SIDEBAR}>
            <span style={TOC_TITLE}>sommaire</span>
            {TOC.map((t) => (
              <a key={t.n} href={t.href} style={TOC_LINK}>
                <span style={TOC_N}>{t.n}</span>
                {t.label}
              </a>
            ))}
            <div style={LEGEND_BLOCK}>
              <span style={TOC_TITLE}>confiance</span>
              {LEGEND.map((l) => (
                <div key={l.label} style={LEGEND_ROW}>
                  <div style={{ ...LEGEND_DOT, background: l.color }} />
                  <span style={LEGEND_LABEL}>{l.label}</span>
                </div>
              ))}
            </div>
          </nav>
        )}

        <div style={isMobile ? M_CONTENT : CONTENT}>
          {/* --- Héros ------------------------------------------------------------------------ */}
          <div style={isMobile ? M_HERO : HERO}>
            <div style={HERO_COL}>
              <span style={isMobile ? M_KICKER : KICKER}>{kicker}</span>
              <h1 style={isMobile ? M_HERO_TITLE : HERO_TITLE}>
                Ce que TikTok
                {!isMobile && <br />}
                {isMobile ? ' ' : ''}pourrait déduire
              </h1>
              <p style={isMobile ? M_HERO_LEDE : HERO_LEDE}>
                À partir de ce que tu cherches, regardes et commentes, TikTok essaie de deviner des
                choses sur toi. Ce sont des suppositions, pas des certitudes.
              </p>
              <p style={isMobile ? M_HERO_SUB : HERO_SUB}>
                Quatre étapes, du plus factuel au plus interprété : ton activité brute, les
                déductions thème par thème, un résumé de l'utilisation de tes données et la
                possibilité de les analyser localement avec un modèle IA.
              </p>
              {isMobile && (
                <div style={M_LEGEND_ROW}>
                  <span style={M_LEGEND_LABEL}>confiance :</span>
                  {LEGEND.map((l) => (
                    <span key={l.label} style={M_LEGEND_ITEM}>
                      <span style={{ ...LEGEND_DOT, background: l.color }} />
                      <span style={LEGEND_LABEL}>{l.label}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {!isMobile && (
              <div style={HERO_EYE}>
                <EyeLogo variant="hero" />
              </div>
            )}
          </div>

          {/* --- 01 · Ton activité ---------------------------------------------------------------- */}
          <SectionHead
            id="sec-activite"
            isMobile={isMobile}
            n="01"
            title="Ton activité en chiffres"
            sub="Quand tu utilises l'app, et combien de traces tu laisses."
            learn={{
              open: !!learn.rythme,
              label: 'les métadonnées',
              onToggle: () => toggleLearn('rythme'),
            }}
          />
          {learn.rythme && (
            <LearnPanel question={LEARN_RYTHME.question} columns={LEARN_RYTHME.columns} />
          )}
          {output.rhythm !== undefined && <RhythmCard rhythm={output.rhythm} />}
          <div style={CARDS_ROW}>
            <VolumesCard volumes={output.volumes} />
            {output.opacity !== undefined && <AnalyzableShareCard opacity={output.opacity} />}
          </div>

          {/* --- 02 · Déductions par thème -------------------------------------------------------- */}
          <SectionHead
            id="sec-deductions"
            isMobile={isMobile}
            n="02"
            title="Déductions par thème"
            sub={`Ce que l'algorithme pourrait conclure, thème par thème. ${isMobile ? 'Touche' : 'Clique sur'} une carte pour voir les preuves : le surlignage montre le mot repéré, et chaque donnée propose une lecture principale et une secondaire — ou deux à égalité quand rien ne tranche.`}
            learn={{
              open: !!learn.deduc,
              label: 'l’algorithme',
              onToggle: () => toggleLearn('deduc'),
            }}
          />
          {learn.deduc && (
            <LearnPanel
              question={LEARN_DEDUC.question}
              columns={LEARN_DEDUC.columns}
              footnote={LEARN_DEDUC.footnote}
            />
          )}
          {/* L'ordre de la page est une décision de MISE EN SCÈNE : elle vit ici (`compareCards`),
              plus dans l'ordre d'un registre moteur. Il ne suit plus « les signaux, puis les
              thèmes » — ce qui n'était que l'ordre de composition d'`insights[]` hérité de
              `buildPageBlocks`, jamais un choix. Le sensible reste en tête, mais parce qu'un critère
              le dit, et à confiance égale une carte mieux étayée passe devant. */}
          <div style={THEME_LIST}>
            {leadCards.map((c) => c.node)}
            {/* Le reste : REPLIÉ, jamais retiré. Le bouton dit son compte, et l'ouvrir rend
                exactement les cartes que le classement a mises après — mêmes cartes, même rendu. */}
            {restCards.length > 0 && (
              <>
                <button
                  type="button"
                  style={MORE_BTN}
                  aria-expanded={showRest}
                  onClick={() => setShowRest(!showRest)}
                >
                  {showRest ? 'replier ✕' : restLabel(restCards.length)}
                </button>
                {showRest && restCards.map((c) => c.node)}
              </>
            )}
            {/* Cas limite « aucune déduction » (maquettes CasAucuneDeduction) : carte complète —
                raison probable, rappel d'asymétrie, dépli des textes bruts, enrichissement des
                lexiques, conseils — à la place de l'ancien paragraphe sec. */}
            {!hasDeductions && <NoDeductionCard aiSource={aiSource} isMobile={isMobile} />}
          </div>

          {/* --- 03 · En résumé ------------------------------------------------------------------- */}
          <SectionHead
            id="sec-resume"
            isMobile={isMobile}
            n="03"
            title="En résumé"
            learn={{
              open: !!learn.marche,
              label: 'le marché des données',
              onToggle: () => toggleLearn('marche'),
            }}
          />
          {learn.marche && (
            <LearnPanel question={LEARN_MARCHE.question} columns={LEARN_MARCHE.columns} />
          )}
          <div style={SUMMARY_CARD}>
            <div style={SUMMARY_LEDE}>
              Prises une à une, ces données sont banales. Recoupées, elles dessinent un profil où
              une même donnée anodine peut nourrir plusieurs lectures à la fois.
            </div>
            <div style={SUMMARY_COLS}>
              <div style={SUMMARY_COL_LEFT}>
                <div style={SUMMARY_COL_TITLE}>Types de données lues</div>
                <div style={CHIP_ROW}>
                  {DATA_TYPES.map((t) => (
                    <span key={t} style={DATA_CHIP}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div style={SUMMARY_COL_RIGHT}>
                <div style={SUMMARY_COL_TITLE}>
                  Ce que des acteurs comme TikTok ou des agrégateurs peuvent en tirer
                </div>
                <div style={TAKEAWAYS}>
                  {ACTOR_TAKEAWAYS.map((t) => (
                    <div key={t} style={TAKEAWAY_ROW}>
                      <span style={{ color: NAVY.textFaint }}>›</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 04 · IA locale (bande pleine largeur) -------------------------------------------------- */}
      {/* Mobile : l'IA locale demande un ordinateur (llama.cpp) — encart explicatif + aperçu
          décoratif à la place de la section interactive (maquette « v4 Mobile »). L'encart vit DANS
          le flux de contenu (pas de bande pleine largeur). */}
      {aiSource !== undefined &&
        (isMobile ? (
          <div style={M_SHELL_TAIL}>
            <AiMobileNotice />
          </div>
        ) : (
          <AiSection source={aiSource} />
        ))}
    </div>
  );
}

// --- Styles (maquette « parcours guidé ») ----------------------------------------------------------
const PAGE = { display: 'flex', flexDirection: 'column' } as const;
const GRID = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '48px 40px 32px',
  display: 'grid',
  gridTemplateColumns: '210px minmax(0, 1fr)',
  gap: '52px',
  alignItems: 'start',
  width: '100%',
  boxSizing: 'border-box',
} as const;
const SIDEBAR = {
  position: 'sticky',
  top: '78px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
} as const;
const TOC_TITLE = {
  fontSize: '10px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: NAVY.textMuted,
  padding: '0 12px 8px',
} as const;
const TOC_LINK = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textSecondary,
  textDecoration: 'none',
  borderRadius: '8px',
  padding: '10px 12px',
  border: '1px solid transparent',
} as const;
const TOC_N = { fontSize: '11px', fontWeight: 600, lineHeight: 1, color: NAVY.accent } as const;
const LEGEND_BLOCK = {
  marginTop: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
  borderTop: `1px solid ${NAVY.borderCard}`,
  padding: '14px 12px 0',
} as const;
const LEGEND_ROW = { display: 'flex', alignItems: 'center', gap: '8px' } as const;
const LEGEND_DOT = { width: '10px', height: '10px', borderRadius: '50%' } as const;
const LEGEND_LABEL = { fontSize: '11.5px', lineHeight: 1, color: NAVY.textBody } as const;
const CONTENT = { display: 'flex', flexDirection: 'column', gap: '26px', minWidth: 0 } as const;
const HERO = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(220px, 320px)',
  gap: '40px',
  alignItems: 'center',
  paddingBottom: '28px',
} as const;
const HERO_COL = { display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 } as const;
const HERO_EYE = { minWidth: 0 } as const;
const KICKER = {
  fontSize: '11px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const HERO_TITLE = {
  margin: 0,
  fontSize: '38px',
  fontWeight: 500,
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
  color: NAVY.textBright,
} as const;
const HERO_LEDE = {
  margin: 0,
  fontSize: '14px',
  lineHeight: 1.8,
  color: NAVY.textBody,
  maxWidth: '560px',
} as const;
const HERO_SUB = {
  margin: 0,
  fontSize: '12px',
  lineHeight: 1.75,
  color: NAVY.textMuted,
  maxWidth: '560px',
} as const;
const SEC_HEAD_WRAP = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  paddingTop: '22px',
} as const;
const SEC_HEAD_ROW = { display: 'flex', alignItems: 'center', gap: '14px' } as const;
const SEC_N = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: '1px solid rgba(47,212,240,.5)',
  fontSize: '12px',
  fontWeight: 600,
  color: NAVY.accent,
  flex: 'none',
} as const;
const SEC_TITLE = {
  fontSize: '17px',
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.textBright,
} as const;
const SEC_RULE = { flex: 1, height: '1px', background: NAVY.borderCard } as const;
const SEC_SUB = {
  fontSize: '12px',
  lineHeight: 1.6,
  color: NAVY.textMuted,
  paddingLeft: '44px',
} as const;
const CARDS_ROW = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  alignItems: 'stretch',
} as const;
const THEME_LIST = { display: 'flex', flexDirection: 'column', gap: '16px' } as const;
// Dépli du reste : une « carte fantôme » — même gabarit que les cartes (rayon, largeur), mais creuse
// et pointillée. Elle occupe la place d'une carte sans en avoir le poids : c'est ce contraste qui
// FAIT la hiérarchie. Pointillé volontairement NEUTRE (bordure de carte), pas l'indigo de
// `LearnPanel` — celui-ci signale la pédagogie ; ici on montre du contenu, pas une explication.
const MORE_BTN = {
  cursor: 'pointer',
  width: '100%',
  fontFamily: 'inherit',
  fontSize: '10.5px',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY.textSecondary,
  background: 'transparent',
  border: `1px dashed ${NAVY.borderPill}`,
  borderRadius: '11px',
  padding: '14px',
} as const;
const SUMMARY_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '26px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '12px',
} as const;
const SUMMARY_LEDE = {
  fontSize: '13.5px',
  lineHeight: 1.75,
  color: NAVY.textBody,
  maxWidth: '820px',
} as const;
const SUMMARY_COLS = { display: 'flex', gap: '40px', flexWrap: 'wrap' } as const;
const SUMMARY_COL_LEFT = {
  flex: '1 1 240px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '11px',
} as const;
const SUMMARY_COL_RIGHT = {
  flex: '2 1 320px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '11px',
} as const;
const SUMMARY_COL_TITLE = {
  fontSize: '11px',
  lineHeight: 1.3,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.textMuted,
} as const;
const CHIP_ROW = { display: 'flex', flexWrap: 'wrap', gap: '8px' } as const;
const DATA_CHIP = {
  fontSize: '12px',
  lineHeight: 1.3,
  color: NAVY.textHeading,
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '6px',
  padding: '7px 11px',
} as const;
const TAKEAWAYS = {
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
  fontSize: '12.5px',
  lineHeight: 1.6,
  color: NAVY.textBody,
} as const;
const TAKEAWAY_ROW = { display: 'flex', gap: '10px' } as const;

// --- Styles MOBILE (maquette « PanoptiCool v4 Mobile ») --------------------------------------------
const M_SHELL = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '32px 20px 56px',
  width: '100%',
  boxSizing: 'border-box',
} as const;
// L'encart IA mobile vit dans la même colonne que le reste (pas de bande pleine largeur).
const M_SHELL_TAIL = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '0 20px 56px',
  width: '100%',
  boxSizing: 'border-box',
} as const;
const M_CONTENT = { display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 } as const;
const M_HERO = { display: 'flex', flexDirection: 'column', paddingBottom: '8px' } as const;
const M_KICKER = {
  fontSize: '11px',
  lineHeight: 1.4,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const M_HERO_TITLE = {
  margin: 0,
  fontSize: '27px',
  fontWeight: 500,
  lineHeight: 1.25,
  letterSpacing: '-0.02em',
  color: NAVY.textBright,
} as const;
const M_HERO_LEDE = {
  margin: 0,
  fontSize: '13.5px',
  lineHeight: 1.75,
  color: NAVY.textBody,
} as const;
const M_HERO_SUB = {
  margin: 0,
  fontSize: '12.5px',
  lineHeight: 1.7,
  color: NAVY.textMuted,
} as const;
const M_LEGEND_ROW = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '14px',
  alignItems: 'center',
  paddingTop: '2px',
} as const;
const M_LEGEND_LABEL = {
  fontSize: '10.5px',
  lineHeight: 1,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY.textMuted,
} as const;
const M_LEGEND_ITEM = { display: 'flex', alignItems: 'center', gap: '7px' } as const;
const M_SEC_TITLE = {
  fontSize: '15.5px',
  fontWeight: 500,
  lineHeight: 1.35,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: NAVY.textBright,
} as const;
const M_SEC_SUB = { fontSize: '12.5px', lineHeight: 1.65, color: NAVY.textMuted } as const;
