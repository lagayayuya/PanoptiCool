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
import { UI_LEARN_PANELS, UI_RESULTS } from '../copy';
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

// L'AFFICHAGE de la confiance (légende du sommaire + légende inline mobile) est RETIRÉ (itération
// 2026-07-20 du design v4, tests utilisateurs) : les niveaux n'apparaissent plus nulle part sur la
// page, et le cadrage « hypothèses, pas un verdict » vit dans l'intro de la section 02
// (`sec02Framing`). Le moteur GARDE `confidence`, et le CLASSEMENT des cartes le lit toujours
// (`compareCards` ci-dessous) — c'est l'axe d'affichage qui disparaît, pas la donnée ni la doctrine.

// Le DÉPLI lead/rest (FORK 1, option (d)) est RETIRÉ (décision yuya, retouches 2026-07-20) : toutes
// les cartes s'affichent à la suite, classées par `compareCards`. Ce que le dépli protégeait — onze
// en-têtes alignés qui se neutralisent — est aujourd'hui porté par les cartes FERMÉES par défaut :
// un en-tête d'une ligne par carte, pas onze blocs ouverts.

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
 *  2. CONFIANCE DÉCROISSANTE — un axe désormais INTERNE (les niveaux ne s'affichent plus,
 *     itération 2026-07-20) mais qui reste le bon ordre de lecture : ce qui est en haut est ce que
 *     la plateforme oserait le plus. Et il DISCRIMINE vraiment — D1 comme D2 émettent `low` ET
 *     `medium` (`d1Level` : explicite ⇒ medium ; `d2Level` : auto-déclaré ou volumineux ⇒ medium).
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

const TOC = [
  { n: '01', label: UI_RESULTS.tocActivity, href: '#sec-activite' },
  { n: '02', label: UI_RESULTS.tocDeductions, href: '#sec-deductions' },
  { n: '03', label: UI_RESULTS.tocSummary, href: '#sec-resume' },
  { n: '04', label: UI_RESULTS.tocAi, href: '#sec-ia' },
] as const;

// Les contenus pédagogiques et les listes du résumé vivent dans le catalogue d'interface
// (`ui/copy.ts`) — cette vue les rend, elle ne les écrit plus.

function SectionHead({
  id,
  n,
  title,
  sub,
  framing,
  learn,
  isMobile,
}: {
  id: string;
  n: string;
  title: string;
  sub?: string;
  /** Cadrage optionnel sous le sous-titre — DANS l'en-tête (gap resserré de la maquette), pas
   * dans le flux de la section : entre les deux il y aurait l'espacement inter-blocs, trop grand. */
  framing?: VNode;
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
      {framing !== undefined && <div style={isMobile ? M_SEC_FRAMING : SEC_FRAMING}>{framing}</div>}
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

  // Toutes les cartes, classées (`compareCards`), à la suite — plus de coupe lead/rest (retouches
  // 2026-07-20).
  const cards = rankedCards(output, reuseMap);

  // Mobile (maquette « v4 Mobile ») : pas de sidebar (le sommaire vit en chips dans le header,
  // cf. SiteHeader/AnalysisPage), héros en colonne SANS l'œil, légende de confiance INLINE sous le
  // héros, kicker portant la mention démo.
  // Le suffixe démo ne vit dans le kicker QUE sur mobile — sur desktop, le badge du header porte
  // déjà l'information (pas de doublon).
  const kicker = demo && isMobile ? UI_RESULTS.kickerDemo : UI_RESULTS.kicker;

  return (
    <div style={PAGE}>
      <div style={isMobile ? M_SHELL : GRID}>
        {!isMobile && (
          <nav aria-label={UI_RESULTS.tocAriaLabel} style={SIDEBAR}>
            <span style={TOC_TITLE}>{UI_RESULTS.tocTitle}</span>
            {TOC.map((t) => (
              <a key={t.n} href={t.href} class="hv-toc" style={TOC_LINK}>
                <span style={TOC_N}>{t.n}</span>
                {t.label}
              </a>
            ))}
          </nav>
        )}

        <div style={isMobile ? M_CONTENT : CONTENT}>
          {/* --- Héros ------------------------------------------------------------------------ */}
          <div style={isMobile ? M_HERO : HERO}>
            <div style={HERO_COL}>
              <span style={isMobile ? M_KICKER : KICKER}>{kicker}</span>
              <h1 style={isMobile ? M_HERO_TITLE : HERO_TITLE}>
                {UI_RESULTS.heroTitleLine1}
                {!isMobile && <br />}
                {isMobile ? ' ' : ''}
                {UI_RESULTS.heroTitleLine2}
              </h1>
              <p style={isMobile ? M_HERO_LEDE : HERO_LEDE}>{UI_RESULTS.heroLede}</p>
              <p style={isMobile ? M_HERO_SUB : HERO_SUB}>{UI_RESULTS.heroSub}</p>
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
            title={UI_RESULTS.sec01Title}
            sub={UI_RESULTS.sec01Sub}
            learn={{
              open: !!learn.rythme,
              label: UI_RESULTS.sec01LearnLabel,
              onToggle: () => toggleLearn('rythme'),
            }}
          />
          {learn.rythme && (
            <LearnPanel
              question={UI_LEARN_PANELS.rhythm.question}
              columns={UI_LEARN_PANELS.rhythm.columns}
            />
          )}
          {output.rhythm !== undefined && <RhythmCard rhythm={output.rhythm} />}
          <div style={CARDS_ROW}>
            <VolumesCard
              volumes={output.volumes}
              videosWatchedTotal={output.rhythm?.videosWatched.total}
            />
            {output.opacity !== undefined && <AnalyzableShareCard opacity={output.opacity} />}
          </div>

          {/* --- 02 · Déductions par thème -------------------------------------------------------- */}
          <SectionHead
            id="sec-deductions"
            isMobile={isMobile}
            n="02"
            title={UI_RESULTS.sec02Title}
            sub={UI_RESULTS.sec02Sub(
              isMobile ? UI_RESULTS.sec02TapVerbMobile : UI_RESULTS.sec02TapVerbDesktop,
            )}
            framing={
              /* Le CADRAGE de la section : une fois, en intro, « hypothèses, jamais un verdict » —
                 à la place de l'appareil de confiance que chaque carte répétait. Les deux
                 mots-exemples portent le style de ce qu'ils nomment (maquette) : « surlignage »
                 est surligné, « principale » a la teinte de la lecture principale. */
              <>
                {UI_RESULTS.sec02FramingLead}
                <span style={FRAMING_HIGHLIGHT}>{UI_RESULTS.sec02FramingHighlightWord}</span>
                {UI_RESULTS.sec02FramingMiddle}
                <span style={FRAMING_PRIMARY}>{UI_RESULTS.sec02FramingPrimaryWord}</span>
                {UI_RESULTS.sec02FramingTail}
              </>
            }
            learn={{
              open: !!learn.deduc,
              label: UI_RESULTS.sec02LearnLabel,
              onToggle: () => toggleLearn('deduc'),
            }}
          />
          {learn.deduc && (
            <LearnPanel
              question={UI_LEARN_PANELS.deductions.question}
              columns={UI_LEARN_PANELS.deductions.columns}
              footnote={UI_LEARN_PANELS.deductions.footnote}
            />
          )}
          {/* L'ordre de la page est une décision de MISE EN SCÈNE : elle vit ici (`compareCards`),
              plus dans l'ordre d'un registre moteur. Il ne suit plus « les signaux, puis les
              thèmes » — ce qui n'était que l'ordre de composition d'`insights[]` hérité de
              `buildPageBlocks`, jamais un choix. Le sensible reste en tête, mais parce qu'un critère
              le dit, et à confiance égale une carte mieux étayée passe devant. */}
          <div style={THEME_LIST}>
            {cards.map((c) => c.node)}
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
            title={UI_RESULTS.sec03Title}
            learn={{
              open: !!learn.marche,
              label: UI_RESULTS.sec03LearnLabel,
              onToggle: () => toggleLearn('marche'),
            }}
          />
          {learn.marche && (
            <LearnPanel
              question={UI_LEARN_PANELS.market.question}
              columns={UI_LEARN_PANELS.market.columns}
            />
          )}
          <div style={SUMMARY_CARD}>
            <div style={SUMMARY_LEDE}>{UI_RESULTS.summaryLede}</div>
            <div style={SUMMARY_COLS}>
              <div style={SUMMARY_COL_LEFT}>
                <div style={SUMMARY_COL_TITLE}>{UI_RESULTS.summaryDataTypesTitle}</div>
                <div style={CHIP_ROW}>
                  {UI_RESULTS.summaryDataTypes.map((t) => (
                    <span key={t} style={DATA_CHIP}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div style={SUMMARY_COL_RIGHT}>
                <div style={SUMMARY_COL_TITLE}>{UI_RESULTS.summaryActorsTitle}</div>
                <div style={TAKEAWAYS}>
                  {UI_RESULTS.summaryActorTakeaways.map((t) => (
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
// Cadrage de la section 02 — même retrait que le sous-titre, un ton plus discret (maquette).
const SEC_FRAMING = {
  fontSize: '11px',
  lineHeight: 1.7,
  color: NAVY.textFaint,
  paddingLeft: '44px',
  maxWidth: '720px',
} as const;
const M_SEC_FRAMING = { fontSize: '12px', lineHeight: 1.7, color: NAVY.textFaint } as const;
// Les deux mots-exemples du cadrage — mêmes styles que ce qu'ils désignent (maquette) :
// le surlignage des sources (`highlight`), la teinte de la lecture principale.
const FRAMING_HIGHLIGHT = {
  color: NAVY.textBright,
  borderBottom: '1px solid rgba(255,255,255,.45)',
} as const;
const FRAMING_PRIMARY = { color: '#cdb6f0' } as const;
const CARDS_ROW = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
  alignItems: 'stretch',
} as const;
const THEME_LIST = { display: 'flex', flexDirection: 'column', gap: '16px' } as const;
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
const M_SEC_TITLE = {
  fontSize: '15.5px',
  fontWeight: 500,
  lineHeight: 1.35,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: NAVY.textBright,
} as const;
const M_SEC_SUB = { fontSize: '12.5px', lineHeight: 1.65, color: NAVY.textMuted } as const;
