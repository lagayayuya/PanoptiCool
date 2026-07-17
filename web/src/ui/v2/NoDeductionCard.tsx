// Cas limite « Aucune déduction » (maquettes « parcours guidé » / « v4 Mobile », section 02) —
// remplace le paragraphe vide quand AUCUN bloc thème/signal ne ressort de l'export. La carte :
//   - nomme le cas (3 puces éteintes + titre) et donne LA raison probable, choisie selon le volume
//     de texte disponible (`lowData` : < 5 items — même seuil que la bannière IA, cf. AiSection) ;
//   - rappelle l'asymétrie (encart orange : l'export ≈ 26 % des données, les modèles de TikTok
//     analysent plus finement que nos lexiques) ;
//   - « Tes données, quand même » : compte recherches/commentaires + dépli des textes BRUTS que
//     les lexiques ont parcourus (transparence : voir exactement ce qui a été lu) ;
//   - si l'export contient du texte (`!lowData`) : bloc « Aide-nous à enrichir le vocabulaire » —
//     textarea locale + issue GitHub pré-remplie OU e-mail. RIEN ne part sans clic (invariant) ;
//   - trois tuiles de conseils (vérifier l'export, IA locale, revenir plus tard).
//
// Les textes bruts viennent d'une extraction LOCALE (worker `items-worker`, même voie que la
// section IA — PANO-45) : `EngineOutput` ne porte que les preuves citées par un constat (magasin
// borné, ADR-0003), donc RIEN dans ce cas précis. Double extraction assumée avec AiSection :
// elle ne court que sur ce cas limite, entièrement sur l'appareil.

import { useEffect, useState } from 'preact/hooks';
import type { AiItem } from '../../ai/items';
import { extractAiItemsInWorker } from '../../ai/items-client';
import type { AiSource } from './ai-source';
import { NAVY } from './palette';

/** Seuil « peu de données » (maquette : « en dessous de 5 items, chaque phrase pèse trop lourd »).
 * Partagé avec la bannière de la section IA (AiSection). */
export const LOW_DATA_THRESHOLD = 5;

const GH_ISSUE_BASE = 'https://github.com/lagayayuya/PanoptiCool/issues/new';
const SUGGEST_MAIL = 'yuya@panopti.cool';

function suggestBody(text: string): string {
  return `${text || '(liste tes mots ici)'}\n\n—\nProposé depuis la page résultats de PanoptiCool.`;
}

export function NoDeductionCard({
  aiSource,
  isMobile,
}: {
  aiSource?: AiSource | undefined;
  isMobile: boolean;
}) {
  const [items, setItems] = useState<AiItem[] | null>(null);
  const [dataOpen, setDataOpen] = useState(false);
  const [suggestText, setSuggestText] = useState('');

  // Extraction locale des textes bruts — uniquement quand cette carte est affichée (cas limite).
  useEffect(() => {
    if (aiSource === undefined) return;
    let cancelled = false;
    void (async () => {
      try {
        const bytes = await aiSource();
        const result = await extractAiItemsInWorker(bytes);
        if (!cancelled && result.ok) setItems(result.items);
      } catch {
        // Échec de relecture : la carte reste utile sans le dépli des données (pas de crash).
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [aiSource]);

  const known = items !== null;
  const searches = (items ?? []).filter((i) => i.kind === 'search');
  const comments = (items ?? []).filter((i) => i.kind === 'comment');
  const lowData = known && (items?.length ?? 0) < LOW_DATA_THRESHOLD;
  // Bloc d'enrichissement : seulement quand l'export contient du texte non reconnu (maquette).
  const showEnrich = known && !lowData;

  const ndReason = lowData
    ? 'La raison la plus probable : ton export contient très peu de texte à lire — presque rien à comparer aux lexiques thématiques (cuisine, santé, politique…). Ce n’est pas une anomalie, juste un manque de matière.'
    : 'Ton export contient pourtant du texte : c’est ton vocabulaire qui ne recoupe pas les thèmes que PanoptiCool sait repérer (cuisine, santé, politique…). Nos lexiques sont rudimentaires, tu peux nous aider à les compléter, plus bas.';

  const ghHref = `${GH_ISSUE_BASE}?title=${encodeURIComponent('Proposition de mots pour les lexiques')}&body=${encodeURIComponent(suggestBody(suggestText))}`;
  const mailHref = `mailto:${SUGGEST_MAIL}?subject=${encodeURIComponent('Mots à ajouter aux lexiques PanoptiCool')}&body=${encodeURIComponent(suggestBody(suggestText))}`;

  return (
    <div style={isMobile ? M_CARD : CARD}>
      <div style={HEAD_ROW}>
        <div style={DOTS} aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} style={DOT} />
          ))}
        </div>
        <span style={isMobile ? M_TITLE : TITLE}>Aucune déduction ne ressort de ton export</span>
      </div>
      <div style={REASON}>{ndReason}</div>
      <div style={WARN_BOX}>
        <span style={WARN_ICON} aria-hidden="true">
          ▲
        </span>
        <span style={WARN_TEXT}>
          Ça ne veut pas dire que TikTok ne déduit rien : l'export ne montre que ~26 % des données
          collectées, et leurs modèles analysent bien plus finement que nos lexiques.
        </span>
      </div>

      {/* --- Tes données, quand même ------------------------------------------------------------ */}
      {known && (
        <div style={DATA_BLOCK}>
          <div style={isMobile ? M_DATA_HEAD : DATA_HEAD}>
            <span style={DATA_TITLE}>Tes données, quand même</span>
            <span style={DATA_COUNTS}>
              {searches.length} recherche(s) · {comments.length} commentaire(s)
            </span>
            {!isMobile && <span style={{ flex: 1 }} />}
            <button
              type="button"
              style={isMobile ? M_DATA_TOGGLE : DATA_TOGGLE}
              aria-expanded={dataOpen}
              onClick={() => setDataOpen(!dataOpen)}
            >
              {dataOpen ? 'masquer ▴' : 'consulter ▾'}
            </button>
          </div>
          {dataOpen && (
            <>
              <div style={isMobile ? M_DATA_GRID : DATA_GRID}>
                <div style={DATA_COL}>
                  <span style={DATA_COL_TITLE}>recherches</span>
                  {searches.map((it) => (
                    <div key={it.index} style={DATA_LINE}>
                      <span style={DATA_CHEVRON}>›</span>
                      <span>« {it.text} »</span>
                    </div>
                  ))}
                  {searches.length === 0 && (
                    <span style={DATA_EMPTY}>aucune recherche dans l'export</span>
                  )}
                </div>
                <div style={DATA_COL}>
                  <span style={DATA_COL_TITLE}>commentaires</span>
                  {comments.map((it) => (
                    <div key={it.index} style={DATA_LINE}>
                      <span style={DATA_CHEVRON}>›</span>
                      <span>« {it.text} »</span>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <span style={DATA_EMPTY}>aucun commentaire dans l'export</span>
                  )}
                </div>
              </div>
              <div style={DATA_FOOT}>
                C'est exactement ce texte que nos lexiques ont parcouru sans trouver de
                correspondance.
              </div>
            </>
          )}
        </div>
      )}

      {/* --- Aide-nous à enrichir le vocabulaire -------------------------------------------------- */}
      {showEnrich && (
        <div style={isMobile ? M_ENRICH : ENRICH}>
          <span style={ENRICH_TITLE}>Aide-nous à enrichir le vocabulaire</span>
          <span style={ENRICH_TEXT}>
            Ton export contient du texte, mais nos lexiques ne l'ont pas reconnu. Si tu repères dans
            tes données des mots qu'on aurait dû comprendre, propose-les anonymement : ils
            profiteront à tout le monde. Rien n'est envoyé sans ton clic.
          </span>
          <textarea
            value={suggestText}
            spellcheck={false}
            placeholder="ex. « batch cooking », « air fryer », « mid » …"
            aria-label="Mots à proposer"
            style={isMobile ? M_SUGGEST_AREA : SUGGEST_AREA}
            onInput={(e) => setSuggestText(e.currentTarget.value)}
          />
          <div style={isMobile ? M_ENRICH_ACTIONS : ENRICH_ACTIONS}>
            <a href={ghHref} target="_blank" rel="noreferrer" style={isMobile ? M_GH_BTN : GH_BTN}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              Proposer sur GitHub
            </a>
            <a href={mailHref} style={isMobile ? M_MAIL_BTN : MAIL_BTN}>
              ou par e-mail → {SUGGEST_MAIL}
            </a>
          </div>
        </div>
      )}

      {/* --- Conseils ----------------------------------------------------------------------------- */}
      <div style={isMobile ? M_TIPS : TIPS}>
        <div style={TIP}>
          <span style={TIP_TITLE}>Vérifie ton export</span>
          <span style={TIP_TEXT}>
            Format JSON, toutes les catégories cochées : un export partiel arrive vite.
          </span>
        </div>
        <div style={TIP}>
          <span style={TIP_TITLE}>Essaie l'IA locale</span>
          <span style={TIP_TEXT}>
            Elle lit tes données plus finement que les lexiques :{' '}
            {isMobile ? 'sur ordinateur, ' : ''}
            <a href="#sec-ia" style={{ color: NAVY.accent, textDecoration: 'none' }}>
              section 04 →
            </a>
          </span>
        </div>
        <div style={TIP}>
          <span style={TIP_TITLE}>Reviens plus tard</span>
          <span style={TIP_TEXT}>
            Un nouvel export dans quelques semaines contiendra plus de traces à lire.
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Styles (maquettes « parcours guidé » / « v4 Mobile », bloc noDeductions) ----------------------
const CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  padding: '32px 34px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '12px',
} as const;
const M_CARD = { ...CARD, gap: '16px', padding: '22px 20px' } as const;
const HEAD_ROW = { display: 'flex', alignItems: 'center', gap: '14px' } as const;
const DOTS = { display: 'flex', gap: '5px', flex: 'none' } as const;
const DOT = {
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  background: NAVY.accent,
  opacity: NAVY.confidenceEmptyOpacity,
} as const;
const TITLE = {
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textBright,
} as const;
const M_TITLE = { ...TITLE, fontSize: '15px', lineHeight: 1.45 } as const;
const REASON = {
  fontSize: '12.5px',
  lineHeight: 1.75,
  color: NAVY.textBody,
  maxWidth: '720px',
} as const;
const WARN_BOX = {
  display: 'flex',
  gap: '10px',
  alignItems: 'flex-start',
  background: NAVY.riskBg,
  border: `1px solid ${NAVY.riskBorder}`,
  borderRadius: '8px',
  padding: '12px 15px',
  maxWidth: '720px',
} as const;
const WARN_ICON = { color: NAVY.risk, fontSize: '12px', lineHeight: 1.5, flex: 'none' } as const;
const WARN_TEXT = { flex: 1, fontSize: '12px', lineHeight: 1.7, color: NAVY.riskText } as const;
const DATA_BLOCK = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  borderTop: `1px solid ${NAVY.borderCard}`,
  paddingTop: '18px',
} as const;
const DATA_HEAD = { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' } as const;
const M_DATA_HEAD = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
} as const;
const DATA_TITLE = {
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.textHeading,
} as const;
const DATA_COUNTS = { fontSize: '11px', lineHeight: 1.4, color: NAVY.textMuted } as const;
const DATA_TOGGLE = {
  cursor: 'pointer',
  fontSize: '10.5px',
  fontWeight: 500,
  fontFamily: 'inherit',
  lineHeight: 1.3,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.accent,
  background: 'transparent',
  border: '1px solid rgba(47,212,240,.4)',
  borderRadius: '20px',
  padding: '8px 14px',
} as const;
const M_DATA_TOGGLE = {
  ...DATA_TOGGLE,
  minHeight: '44px',
  fontSize: '11.5px',
  borderRadius: '22px',
  padding: '11px 18px',
} as const;
const DATA_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '12px',
} as const;
const M_DATA_GRID = { display: 'flex', flexDirection: 'column', gap: '8px' } as const;
const DATA_COL = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '15px 17px',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '9px',
} as const;
const DATA_COL_TITLE = {
  fontSize: '10px',
  lineHeight: 1.3,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: NAVY.textMuted,
} as const;
const DATA_LINE = {
  display: 'flex',
  gap: '9px',
  fontSize: '12px',
  lineHeight: 1.65,
  color: NAVY.textSecondary,
} as const;
const DATA_CHEVRON = { color: NAVY.textFaint, flex: 'none' } as const;
const DATA_EMPTY = {
  fontSize: '11.5px',
  lineHeight: 1.5,
  color: NAVY.textFaint,
  fontStyle: 'italic',
} as const;
const DATA_FOOT = { fontSize: '11px', lineHeight: 1.65, color: NAVY.textMuted } as const;
const ENRICH = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  border: `1px dashed ${NAVY.learnBorder}`,
  borderRadius: '10px',
  padding: '18px 20px',
  background: 'rgba(124,150,255,.04)',
} as const;
const M_ENRICH = { ...ENRICH, padding: '16px' } as const;
const ENRICH_TITLE = {
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.learnTitle,
} as const;
const ENRICH_TEXT = {
  fontSize: '12px',
  lineHeight: 1.7,
  color: NAVY.textBody,
  maxWidth: '720px',
} as const;
const SUGGEST_AREA = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '64px',
  resize: 'vertical',
  fontSize: '12px',
  lineHeight: 1.7,
  fontFamily: 'inherit',
  color: NAVY.textHeading,
  background: NAVY.bgPage,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '8px',
  padding: '11px 13px',
} as const;
const M_SUGGEST_AREA = {
  ...SUGGEST_AREA,
  minHeight: '72px',
  fontSize: '13px',
  padding: '12px 13px',
} as const;
const ENRICH_ACTIONS = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  alignItems: 'center',
} as const;
const M_ENRICH_ACTIONS = { display: 'flex', flexDirection: 'column', gap: '10px' } as const;
const GH_BTN = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  fontSize: '11px',
  fontWeight: 500,
  lineHeight: 1,
  letterSpacing: '0.04em',
  color: NAVY.bgPage,
  background: NAVY.accent,
  borderRadius: '7px',
  padding: '11px 15px',
  textDecoration: 'none',
} as const;
const M_GH_BTN = {
  ...GH_BTN,
  justifyContent: 'center',
  gap: '8px',
  minHeight: '44px',
  boxSizing: 'border-box',
  fontSize: '12px',
  borderRadius: '8px',
  padding: '12px 16px',
} as const;
const MAIL_BTN = {
  fontSize: '11px',
  fontWeight: 500,
  lineHeight: 1,
  letterSpacing: '0.04em',
  color: NAVY.textSecondary,
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '7px',
  padding: '11px 15px',
  textDecoration: 'none',
} as const;
const M_MAIL_BTN = {
  ...MAIL_BTN,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  boxSizing: 'border-box',
  fontSize: '12px',
  lineHeight: 1.3,
  borderRadius: '8px',
  padding: '12px 16px',
  textAlign: 'center',
} as const;
const TIPS = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
  gap: '10px',
} as const;
const M_TIPS = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  borderTop: `1px solid ${NAVY.borderCard}`,
  paddingTop: '16px',
} as const;
const TIP = {
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  padding: '14px 16px',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '9px',
} as const;
const TIP_TITLE = {
  fontSize: '11px',
  fontWeight: 500,
  lineHeight: 1.4,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.learnTitle,
} as const;
const TIP_TEXT = { fontSize: '11.5px', lineHeight: 1.65, color: NAVY.textLede } as const;
