// Section 01 « Ton activité en chiffres » (maquette « parcours guidé ») — trois cartes :
//   - Rythme d'activité : barres horaires (aggregate `activity-rhythm`), légende NEUTRE
//     nuit/journée (PANO-85 : plus de verdict « créneau à risque » dans la légende), encart orange
//     portant le qualificatif nocturne GRADUÉ (`claim`, gabarit) + compteurs + estimation « jours de
//     ta vie » (constat fort PANO-85, conservé bien qu'absent de la maquette — signalé à yuya) ;
//   - Volumes dans ton export : tuiles chiffrées depuis R1/R2/R3/R5 + les 2 totaux all-time
//     Activity Summary, chaque fenêtre étiquetée (PANO-84 : jamais mélangées) ;
//   - Ce qu'on peut vraiment analyser : donut du mur sémantique (insight `opacity` — lisible vs
//     opaque). La maquette illustrait « visible dans l'export vs gardé par TikTok » avec un 26 %
//     factice ; ici le donut porte les comptes RÉELS du moteur, avec le claim + l'explication du
//     gabarit — la sémantique du moteur prime sur le texte d'illustration de la maquette.

import type { Opacity, Rhythm, Volumes } from '../../engine/analysis';
import { opacitySemanticWallClaim, opacitySemanticWallExplainer } from '../../engine/wording';
import { NAVY } from './palette';
import { timeEstimateSentence } from './time-estimate';

/** Heures « nuit » — MÊME convention que la règle `engine/rules/activity-rhythm.ts` : les deux
 * doivent rester alignées, sinon le graphe colore une plage que le moteur ne compte pas. */
const NIGHT_HOURS = new Set([23, 0, 1, 2, 3, 4]);
const HOUR_MARKS = ['0h', '6h', '12h', '18h', '23h'];

function frInt(n: number): string {
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Le callout nocturne du moteur (qualificatif gradué `claim`) n'est PAS rendu (décision yuya, refonte
// 2026-07-15) : juxtaposé à l'estimation « jours de ta vie » ci-dessous, le second encart orange
// créait un doublon visuel parasite. Seule l'estimation reste ; le graphe garde sa coloration
// nuit/journée + légende. Plus aucune vue n'affiche ce verdict — s'il revient, il reviendra conçu
// et rendu, pas réactivé en douce.

export function RhythmCard({ rhythm }: { rhythm: Rhythm }) {
  const { hourlyActivity, videosWatched, estimatedMinutes } = rhythm;
  const max = Math.max(1, ...hourlyActivity);
  return (
    <div style={CARD}>
      <div style={CARD_HEAD}>
        <span style={CARD_TITLE}>Rythme d'activité</span>
        <span style={CARD_NOTE}>ta journée type · heure par heure</span>
      </div>
      <div style={BARS}>
        {hourlyActivity.map((count, hour) => (
          <div key={hour} style={BAR_CELL}>
            <div
              style={{
                ...BAR,
                height: `${Math.max(4, Math.round((count / max) * 100))}%`,
                background: NIGHT_HOURS.has(hour) ? NAVY.risk : NAVY.graphDay,
              }}
            />
          </div>
        ))}
      </div>
      <div style={AXIS}>
        {HOUR_MARKS.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      <div style={RHYTHM_FOOT}>
        <div style={LEGEND_ROW}>
          <div style={LEGEND_ITEM}>
            <div style={{ ...LEGEND_SQ, background: NAVY.risk }} />
            <span style={LEGEND_LABEL}>nuit</span>
          </div>
          <div style={LEGEND_ITEM}>
            <div style={{ ...LEGEND_SQ, background: NAVY.graphDay }} />
            <span style={LEGEND_LABEL}>journée</span>
          </div>
        </div>
      </div>
      <p style={COUNTERS}>
        vidéos regardées : <strong>{frInt(videosWatched.total)}</strong> au total ·{' '}
        <strong>{frInt(videosWatched.last12Months)}</strong> sur 12 mois ·{' '}
        <strong>{frInt(videosWatched.last30Days)}</strong> sur 30 jours
      </p>
      <div style={ESTIMATE}>
        <span style={ESTIMATE_TAG}>estimation</span>
        <span>{timeEstimateSentence(estimatedMinutes)}</span>
      </div>
    </div>
  );
}

// --- Volumes dans ton export ----------------------------------------------------------------------

/** Les 4 tuiles, dans l'ORDRE D'AFFICHAGE de la maquette (jamais l'ordre du moteur).
 *
 * Lot A1 : la carte lisait `insight.ruleId` et re-devinait, via un `Set` partagé avec `grouping.ts`,
 * lesquelles des 8 règles la concernaient — pour n'en tirer QUE `value.signalCount`. Les champs sont
 * nommés (`volumes.searches`…) : la table est désormais champ → libellé, et l'ordre est une liste de
 * champs. Plus de `ruleId`, plus de `Set`, plus de repli `?? ruleId` sur une clé non routée — le
 * compilateur tient l'exhaustivité (`keyof` sur une union fermée). */
const TILES_IN_DISPLAY_ORDER: readonly { key: keyof Omit<Volumes, 'allTime'>; label: string }[] = [
  { key: 'endorsements', label: 'likes, favoris et republications' },
  { key: 'comments', label: 'commentaires postés' },
  { key: 'searches', label: 'recherches tapées' },
  { key: 'follows', label: 'comptes suivis' },
];

export function VolumesCard({ volumes }: { volumes: Volumes }) {
  const activitySummary = volumes.allTime;
  const tiles = TILES_IN_DISPLAY_ORDER.flatMap((t) => {
    const count = volumes[t.key];
    return count === undefined ? [] : [{ ...t, count }];
  });
  if (tiles.length === 0 && activitySummary === undefined) {
    return null;
  }
  return (
    <div style={{ ...CARD, flex: '2 1 340px' }}>
      <div style={CARD_HEAD}>
        <span style={CARD_TITLE}>Volumes dans ton export</span>
        <span style={CARD_NOTE}>sur la période couverte par l'export (~1 an)</span>
      </div>
      <div style={TILES}>
        {tiles.map((t) => (
          <div key={t.key} style={TILE}>
            <span style={TILE_N}>{frInt(t.count)}</span>
            <span style={TILE_LABEL}>{t.label}</span>
          </div>
        ))}
      </div>
      {activitySummary !== undefined && (
        <div style={ALLTIME}>
          Depuis l'inscription au compte : <strong>{frInt(activitySummary.videosShared)}</strong>{' '}
          vidéos partagées · <strong>{frInt(activitySummary.videosWatchedToEnd)}</strong> vidéos
          regardées jusqu'au bout.
        </div>
      )}
    </div>
  );
}

// --- Ce qu'on peut vraiment analyser (mur sémantique, donut) ---------------------------------------

export function AnalyzableShareCard({ opacity }: { opacity: Opacity }) {
  const { readableCount, opaqueCount } = opacity;
  const total = readableCount + opaqueCount;
  const pct = total > 0 ? (readableCount / total) * 100 : 0;
  // `toFixed(0)` arrondirait un pourcentage non nul (ex. 0,44 %) à « 0 % », affichant l'inverse du
  // constat (« rien de lisible » au lieu de « presque rien ») — jamais pour une valeur > 0.
  const pctLabel = pct > 0 && pct < 1 ? '< 1 %' : `${pct.toFixed(0)} %`;
  return (
    <div style={{ ...CARD, flex: '1 1 300px' }}>
      <span style={{ ...CARD_TITLE, lineHeight: 1.35 }}>Ce qu'on peut vraiment analyser</span>
      <div style={DONUT_ROW}>
        <div
          style={{
            ...DONUT,
            background: `conic-gradient(${NAVY.accent} 0 ${pct}%, ${NAVY.donutRest} ${pct}% 100%)`,
          }}
          role="img"
          aria-label={`${pctLabel} des items sont lisibles hors-ligne`}
        >
          <div style={DONUT_HOLE}>
            <span style={DONUT_PCT}>{pctLabel}</span>
          </div>
        </div>
        <div style={DONUT_LEGEND}>
          <div style={LEGEND_ITEM}>
            <div style={{ ...LEGEND_SQ2, background: NAVY.accent }} />
            <span style={LEGEND_LABEL}>lisible hors-ligne · {frInt(readableCount)} items</span>
          </div>
          <div style={LEGEND_ITEM}>
            <div style={{ ...LEGEND_SQ2, background: NAVY.donutRest }} />
            <span style={LEGEND_LABEL}>opaque (liens muets) · {frInt(opaqueCount)} items</span>
          </div>
        </div>
      </div>
      {/* Le claim n'est plus porté par le constat : son texte est CONSTANT, la carte appelle la
          fonction — comme elle appelait déjà l'explainer en dur (lot A2). */}
      <div style={CARD_FOOT2}>
        {opacitySemanticWallClaim()} {opacitySemanticWallExplainer()}
      </div>
    </div>
  );
}

// --- Styles (maquette « parcours guidé », section 01) ----------------------------------------------
const CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  padding: '24px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '12px',
  minWidth: 0,
} as const;
const CARD_HEAD = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '8px',
  flexWrap: 'wrap',
} as const;
const CARD_TITLE = {
  fontSize: '13.5px',
  fontWeight: 500,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.textHeading,
} as const;
const CARD_NOTE = { fontSize: '11.5px', color: NAVY.textMuted } as const;
const BARS = { display: 'flex', alignItems: 'flex-end', gap: '3px', height: '120px' } as const;
const BAR_CELL = { flex: 1, display: 'flex', alignItems: 'flex-end', height: '100%' } as const;
const BAR = { width: '100%', minHeight: '4px', borderRadius: '3px 3px 0 0' } as const;
const AXIS = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '10.5px',
  color: NAVY.textFaint,
} as const;
const RHYTHM_FOOT = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '18px',
  flexWrap: 'wrap',
} as const;
const LEGEND_ROW = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '18px',
  alignItems: 'center',
} as const;
const LEGEND_ITEM = { display: 'flex', alignItems: 'center', gap: '8px' } as const;
const LEGEND_SQ = { width: '13px', height: '13px', borderRadius: '2px', flex: 'none' } as const;
const LEGEND_SQ2 = { width: '10px', height: '10px', borderRadius: '2px', flex: 'none' } as const;
const LEGEND_LABEL = { fontSize: '11.5px', lineHeight: 1.35, color: NAVY.textBody } as const;
const COUNTERS = { margin: 0, fontSize: '11px', lineHeight: 1.6, color: NAVY.textBody } as const;
const ESTIMATE = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  fontSize: '11px',
  lineHeight: 1.6,
  color: NAVY.riskLabel,
  background: NAVY.riskBg,
  border: `1px solid ${NAVY.riskBorder}`,
  borderRadius: '9px',
  padding: '10px 14px',
  alignSelf: 'flex-start',
} as const;
const ESTIMATE_TAG = {
  fontSize: '9px',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: NAVY.risk,
} as const;
const TILES = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
  gap: '10px',
  flex: 1,
  alignContent: 'center',
} as const;
const TILE = {
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
  padding: '14px 15px',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '9px',
} as const;
const TILE_N = {
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 1,
  letterSpacing: '-0.02em',
  color: NAVY.textBright,
} as const;
const TILE_LABEL = { fontSize: '11px', lineHeight: 1.45, color: '#a3b0cf' } as const;
const ALLTIME = { fontSize: '11px', lineHeight: 1.65, color: NAVY.textBody } as const;
const CARD_FOOT2 = {
  fontSize: '11px',
  lineHeight: 1.7,
  color: NAVY.textMuted,
  borderTop: `1px solid ${NAVY.borderCard}`,
  paddingTop: '12px',
} as const;
const DONUT_ROW = { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' } as const;
const DONUT = {
  flex: 'none',
  width: '92px',
  height: '92px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;
const DONUT_HOLE = {
  width: '58px',
  height: '58px',
  borderRadius: '50%',
  background: NAVY.bgCard,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const;
const DONUT_PCT = { fontSize: '14px', fontWeight: 600, color: NAVY.accent } as const;
const DONUT_LEGEND = { display: 'flex', flexDirection: 'column', gap: '9px', minWidth: 0 } as const;
