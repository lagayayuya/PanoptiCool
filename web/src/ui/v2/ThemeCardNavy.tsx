// Carte de thème « navy » (maquette « ThemeCardNavy », refonte 2026-07-15) — remplace `ThemeCard`
// (PANO-56) sur le nouveau parcours. Même sémantique qu'avant, nouvel habillage :
//   - en-tête FERMÉ : nom + badge « sensible » + « N inf · M src » + 3 puces de confiance ;
//   - ouvert : inférences (pastille + claim + niveau), preuves groupées par éventail (lectures
//     principale/secondaire ou équivalentes), texte-source avec SURLIGNAGE des mots déclencheurs
//     (`triggerTerms`, ADR-0003 — première consommation réelle du champ), ligne « aussi exploité
//     par », bloc usage (orange).
//
// PAS de flou/« contenu masqué » (décision yuya, refonte 2026-07-15) : le badge « sensible » suffit
// à signaler la nature du contenu ; le geste d'ouverture reste le même que pour les autres cartes.
//
// `SignalCardNavy` (décision yuya, refonte) : les constats sensibles isolés (D1) sont des cartes
// DÉPLIABLES comme les thèmes, à en-tête « mot » (pas la phrase-claim) + badge « sensible ».
//
// LOT A1/A3 — CE QUE CE FICHIER NE FAIT PLUS. Il ne lit plus le moteur, il rend une valeur nommée :
//   - le badge « sensible » lisait `theme.sensitive` (toujours `false`) sur les thèmes et
//     `insight.sensitivity !== undefined` (toujours `3`) sur les signaux : DEUX axes dégénérés pour
//     une distinction binaire. C'est désormais le discriminant `deduction.sensitive` (§2.1) ;
//   - l'en-tête d'un signal était retrouvé en INVERSANT `D1_TEMPLATE_IDS` (templateId → label) : le
//     moteur NOMME (`Signal.label`), il n'y a plus rien à inverser — ni le repli défensif qui allait
//     avec (le type garantit le nom) ;
//   - plus de `renderTemplate`/`actorLabel` : `Analysis` porte les TEXTES (lot A2) ;
//   - plus de `resolved[index]` (tableau parallèle aligné sur `insights[]`) : chaque constat porte
//     ses preuves ; seul « aussi exploité par » est recalculé (`reuse.ts`).

import { useState } from 'preact/hooks';
import type {
  AnalysisTheme,
  Deduction,
  Evidence,
  ReadingFan,
  Signal,
  ThemeUsageLine,
} from '../../engine/analysis';
import { splitTriggerTerms } from './highlight';
import { NAVY } from './palette';
import { type Citation, evidenceKey, reuseLabel } from './reuse';

export type Level = 'low' | 'medium' | 'high';

export const LEVEL_LABEL: Record<Level, string> = {
  low: 'incertaine',
  medium: 'moyenne',
  high: 'solide',
};
const LEVEL_COLOR: Record<Level, string> = {
  low: NAVY.confidenceLow,
  medium: NAVY.confidenceMedium,
  high: NAVY.confidenceHigh,
};
const LEVEL_FILL: Record<Level, number> = { low: 1, medium: 2, high: 3 };

/** Catégorie de source affichée en tête de carte-preuve. Clé sur le CANAL de la preuve (`comment` /
 * `search`) — la preuve porte son canal en donnée, on ne dérive plus le libellé du dernier segment
 * d'un chemin de section (`SectionRef.path`, retiré avec le magasin). Union fermée ⇒ exhaustivité
 * tenue par le compilateur, et le repli sur le segment brut n'a plus lieu d'être. */
const SOURCE_KIND_LABEL: Record<Evidence['channel'], string> = {
  search: 'recherche',
  comment: 'commentaire',
};

function sourceKindLabel(channel: Evidence['channel']): string {
  return SOURCE_KIND_LABEL[channel];
}

/** 3 puces de confiance — même teinte que le niveau, puces vides à faible opacité (maquette). */
export function ConfidenceDots({ level }: { level: Level }) {
  const filled = LEVEL_FILL[level];
  const color = LEVEL_COLOR[level];
  return (
    <div style={SEGS_ROW}>
      <div style={SEGS}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              ...SEG_DOT,
              background: color,
              opacity: i < filled ? 1 : NAVY.confidenceEmptyOpacity,
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: '9.5px', color }}>confiance {LEVEL_LABEL[level]}</span>
    </div>
  );
}

// --- Éventail de lectures (au-dessus des sources qu'il interprète, maquette) ---------------------

function FanView({ fan }: { fan: ReadingFan }) {
  if (fan.mode === 'equal') {
    return (
      <div style={FAN}>
        <div style={FAN_TITLE}>lectures équivalentes · aucune privilégiée</div>
        <div style={FAN_EQUAL_ROW}>
          <span style={CHIP_EQUAL}>{fan.readings[0] ?? ''}</span>
          <span style={FAN_EQUAL_SEP}>≡</span>
          <span style={CHIP_EQUAL}>{fan.readings[1] ?? ''}</span>
        </div>
      </div>
    );
  }
  const [main, ...rest] = fan.readings;
  return (
    <div style={FAN}>
      <div style={FAN_TITLE}>lectures pertinentes</div>
      <div style={FAN_RANKED_ROW}>
        {main !== undefined && (
          <div style={RANKED_COL}>
            <span style={RANKED_LABEL_MAIN}>principale</span>
            <span style={CHIP_MAIN}>{main}</span>
          </div>
        )}
        {rest.map((r) => (
          <div key={r} style={RANKED_COL}>
            <span style={RANKED_LABEL_SEC}>secondaire</span>
            <span style={CHIP_SEC}>{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Carte d'une source-preuve --------------------------------------------------------------------

function SourceCard({ ev, reuse }: { ev: Evidence; reuse: string | null }) {
  const parts = splitTriggerTerms(ev.text, ev.triggerTerms);
  return (
    <div style={SRC_CARD}>
      <div style={SRC_HEAD}>
        <span style={SRC_KIND}>{sourceKindLabel(ev.channel)}</span>
        <span style={{ flex: 1 }} />
        {reuse !== null && <span style={SRC_SHARED}>recoupé</span>}
      </div>
      <div style={SRC_TEXT}>
        «{' '}
        {parts.map((p, i) => (
          <span key={`${i}-${p.text}`} style={p.marked ? MARK_ON : undefined}>
            {p.text}
          </span>
        ))}{' '}
        »
      </div>
      {reuse !== null && (
        <div style={SRC_REUSE}>
          ↳ aussi exploité par : <span style={{ color: NAVY.textBright }}>{reuse}</span>
        </div>
      )}
    </div>
  );
}

// --- Groupement éventail + sources (même logique consécutive que `EvidenceDepli`, PANO-57) --------

type RenderGroup =
  | { kind: 'fan'; fan: ReadingFan; items: Evidence[] }
  | { kind: 'plain'; item: Evidence };

/** Deux éventails sont « le même » s'ils ordonnent pareil les mêmes lectures. La comparaison est
 *  désormais une égalité de CHAÎNES : une lecture était un `TemplateRef`, dont l'égalité demandait de
 *  comparer l'id ET les params via `JSON.stringify` — une lecture n'a jamais pris de param. */
function fansEqual(a: ReadingFan, b: ReadingFan): boolean {
  return (
    a.mode === b.mode &&
    a.readings.length === b.readings.length &&
    a.readings.every((r, i) => r === b.readings[i])
  );
}

function groupConsecutiveFans(evidence: readonly Evidence[]): RenderGroup[] {
  const groups: RenderGroup[] = [];
  for (const ev of evidence) {
    if (ev.readings === undefined) {
      groups.push({ kind: 'plain', item: ev });
      continue;
    }
    const last = groups[groups.length - 1];
    if (last?.kind === 'fan' && fansEqual(last.fan, ev.readings)) {
      last.items.push(ev);
    } else {
      groups.push({ kind: 'fan', fan: ev.readings, items: [ev] });
    }
  }
  return groups;
}

function EvidenceList({
  deduction,
  reuseMap,
  currentThemeLabel,
}: {
  deduction: Deduction;
  reuseMap: ReadonlyMap<string, Citation[]>;
  currentThemeLabel?: string | undefined;
}) {
  const evidence = deduction.evidence;
  if (evidence.length === 0) {
    return null;
  }
  const reuseOf = (ev: Evidence) => reuseLabel(reuseMap, ev, deduction, currentThemeLabel);
  return (
    <div style={EV_BLOCK}>
      <div style={EV_COUNT}>données · {evidence.length}</div>
      {groupConsecutiveFans(evidence).map((group, gi) =>
        group.kind === 'fan' ? (
          <div key={group.items[0] ? evidenceKey(group.items[0]) : gi} style={EV_GROUP}>
            <FanView fan={group.fan} />
            <div style={EV_FAN_SOURCES}>
              {group.items.map((ev) => (
                <SourceCard key={evidenceKey(ev)} ev={ev} reuse={reuseOf(ev)} />
              ))}
            </div>
          </div>
        ) : (
          <div key={evidenceKey(group.item)} style={EV_GROUP}>
            <SourceCard ev={group.item} reuse={reuseOf(group.item)} />
          </div>
        ),
      )}
    </div>
  );
}

// --- Rendu d'une inférence (pastille + claim + niveau + preuves) ----------------------------------

function InferenceView({
  deduction,
  reuseMap,
  currentThemeLabel,
}: {
  deduction: Deduction;
  reuseMap: ReadonlyMap<string, Citation[]>;
  currentThemeLabel?: string | undefined;
}) {
  // Le niveau est TOUJOURS présent : `Deduction.confidence` est un niveau, plus une union
  // `scored | factual` à discriminer. Le factuel n'est plus un constat — c'est `volumes`/`rhythm`.
  const level = deduction.confidence;
  const color = LEVEL_COLOR[level];
  return (
    <div style={INF}>
      <div style={INF_HEAD}>
        <div style={{ ...INF_DOT, background: color }} />
        <div style={INF_LABEL}>{deduction.claim}</div>
        <span style={{ ...INF_LEVEL, color }}>{LEVEL_LABEL[level]}</span>
      </div>
      <div style={INF_BODY}>
        <EvidenceList
          deduction={deduction}
          reuseMap={reuseMap}
          currentThemeLabel={currentThemeLabel}
        />
      </div>
    </div>
  );
}

// --- Bloc usage (« ce qui peut en être fait ») ----------------------------------------------------

function UsageBlock({ usage }: { usage: readonly ThemeUsageLine[] }) {
  return (
    <div style={USAGE}>
      <div style={USAGE_HEAD}>
        <span style={{ color: NAVY.risk, fontSize: '11px', lineHeight: 1 }}>▲</span>
        <span style={USAGE_TITLE}>Ce qui peut en être fait — selon qui y accède</span>
      </div>
      <div style={USAGE_LIST}>
        {usage.map((u, i) => (
          <div key={`${u.actor}-${i}`} style={USAGE_ROW}>
            <span style={USAGE_ACTOR}>{u.actor}</span>
            <span style={USAGE_TEXT}>{u.usage}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Carte de THÈME -------------------------------------------------------------------------------

export const CONFIDENCE_RANK: Record<Level, number> = { low: 0, medium: 1, high: 2 };

/** Niveau agrégé d'un thème (en-tête FERMÉ) : le MAX de ses constats — la lecture la plus affirmée
 * que la plateforme oserait pour ce thème. (Ex-`themeConfidenceLevel` de `grouping.ts` : plus de `state` à discriminer,
 * tout constat porte un niveau.)
 *
 * EXPORTÉ depuis la passe « hiérarchie » : `ResultsView` classe les cartes sur CE niveau — celui que
 * l'en-tête affiche. Le tri et les puces lisent le même nombre ; une carte ne peut pas être rangée
 * haut tout en s'affichant basse. */
export function themeLevel(deductions: readonly Deduction[]): Level | undefined {
  let best: Level | undefined;
  for (const d of deductions) {
    if (best === undefined || CONFIDENCE_RANK[d.confidence] > CONFIDENCE_RANK[best]) {
      best = d.confidence;
    }
  }
  return best;
}

/** Nombre de preuves DISTINCTES d'un thème (compte « src »), tous constats confondus — une même
 * miette partagée (C5) ne compte qu'une fois. Ex-`themeEvidenceCount`, clé sur la paire.
 * EXPORTÉ : c'est le « M src » de l'en-tête, et le départage du tri de `ResultsView` (même nombre). */
export function distinctEvidenceCount(deductions: readonly Deduction[]): number {
  const keys = new Set<string>();
  for (const d of deductions) {
    for (const e of d.evidence) {
      keys.add(evidenceKey(e));
    }
  }
  return keys.size;
}

export function ThemeCardNavy({
  theme,
  reuseMap,
}: {
  theme: AnalysisTheme;
  reuseMap: ReadonlyMap<string, Citation[]>;
}) {
  const [open, setOpen] = useState(false);
  const level = themeLevel(theme.deductions);

  return (
    <article style={CARD}>
      <button type="button" style={HEAD_BTN} aria-expanded={open} onClick={() => setOpen(!open)}>
        <div style={HEAD_TOP}>
          <div style={HEAD_NAME_ROW}>
            <span style={NAME}>{theme.label}</span>
            {/* Aucun badge « sensible » sur un thème : les deux populations sont disjointes par
                construction (§2.1) — le badge vit sur `SignalCardNavy`. L'ex-`theme.sensitive`
                n'était jamais `true` ; le type le dit désormais, plutôt qu'une condition morte. */}
          </div>
          <span style={HEAD_META}>
            {theme.deductions.length} inf · {distinctEvidenceCount(theme.deductions)} src
          </span>
        </div>
        {level !== undefined && <ConfidenceDots level={level} />}
      </button>
      {open && (
        <div style={BODY}>
          {theme.deductions.map((deduction, i) => (
            <InferenceView
              key={`${theme.id}-${i}`}
              deduction={deduction}
              reuseMap={reuseMap}
              currentThemeLabel={theme.label}
            />
          ))}
          {theme.usage.length > 0 && <UsageBlock usage={theme.usage} />}
        </div>
      )}
    </article>
  );
}

// --- Carte de SIGNAL sans thème (D1 sensible : PANO-71) -------------------------------------------
// Refonte 2026-07-15 (décisions yuya) : rendues comme les cartes de thème — dépliables, en-tête à MOT
// court (pas la phrase-claim, qui créait une dissonance avec les thèmes) + badge « sensible »,
// phrase-claim révélée à l'ouverture. AUCUN flou : le badge « sensible » suffit.
//
// Lot A1 : les 3 appareils que ce bloc portait ont disparu, sans qu'un seul pixel bouge —
//   - `SENSITIVE_LABEL_WORD` (table de mots courts) → `wording.ts` : c'est de la prose, elle vit
//     dans LE fichier de wording ;
//   - `LABEL_BY_CLAIM_TEMPLATE_ID` (inverse de l'allowlist D1, reconstruit à chaque chargement pour
//     retrouver le label depuis le claim) → le moteur NOMME : `signal.label` ;
//   - le repli `word === null` → il couvrait le cas « claim non résolu en label » ; `Signal.label`
//     étant requis, ce cas ne se représente plus. Un repli de moins, parce qu'un type de plus.

export function SignalCardNavy({
  signal,
  reuseMap,
}: {
  signal: Signal;
  reuseMap: ReadonlyMap<string, Citation[]>;
}) {
  const [open, setOpen] = useState(false);
  const srcCount = new Set(signal.evidence.map(evidenceKey)).size;

  return (
    <article style={CARD}>
      <button type="button" style={HEAD_BTN} aria-expanded={open} onClick={() => setOpen(!open)}>
        <div style={HEAD_TOP}>
          <div style={HEAD_NAME_ROW}>
            <span style={NAME}>{signal.label}</span>
            {signal.sensitive && <span style={SENSIBLE_TAG}>sensible</span>}
          </div>
          <span style={HEAD_META}>1 inf · {srcCount} src</span>
        </div>
        <ConfidenceDots level={signal.confidence} />
      </button>
      {open && (
        <div style={BODY}>
          <InferenceView deduction={signal} reuseMap={reuseMap} />
        </div>
      )}
    </article>
  );
}

// --- Styles (maquette « ThemeCardNavy ») ----------------------------------------------------------
const CARD = {
  background: NAVY.bgThemeCard,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '11px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
} as const;
const HEAD_BTN = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  cursor: 'pointer',
  background: 'transparent',
  border: 'none',
  padding: 0,
  textAlign: 'left',
  width: '100%',
  fontFamily: 'inherit',
  color: 'inherit',
} as const;
const HEAD_TOP = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
} as const;
const HEAD_NAME_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  flexWrap: 'wrap',
  minWidth: 0,
} as const;
const NAME = {
  fontSize: '15px',
  fontWeight: 500,
  lineHeight: 1.2,
  color: NAVY.textBright,
} as const;
const SENSIBLE_TAG = {
  fontSize: '8px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#93a0bf',
  border: `1px solid ${NAVY.borderPill}`,
  borderRadius: '20px',
  padding: '4px 8px',
} as const;
const HEAD_META = {
  fontSize: '9.5px',
  lineHeight: 1.5,
  color: NAVY.textDim,
  textAlign: 'right',
  whiteSpace: 'nowrap',
} as const;
const SEGS_ROW = { display: 'flex', alignItems: 'center', gap: '9px' } as const;
const SEGS = { display: 'flex', gap: '5px' } as const;
const SEG_DOT = { width: '9px', height: '9px', borderRadius: '50%' } as const;
const BODY = {
  marginTop: '14px',
  borderTop: `1px solid ${NAVY.borderInset}`,
  paddingTop: '15px',
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
} as const;
const INF = { display: 'flex', flexDirection: 'column', gap: '11px' } as const;
const INF_HEAD = { display: 'flex', gap: '10px', alignItems: 'flex-start' } as const;
const INF_DOT = {
  marginTop: '6px',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  flex: 'none',
} as const;
const INF_LABEL = {
  flex: 1,
  minWidth: 0,
  fontSize: '14px',
  lineHeight: 1.6,
  color: NAVY.textBright,
} as const;
const INF_LEVEL = { fontSize: '9px', whiteSpace: 'nowrap', marginTop: '5px' } as const;
const INF_BODY = { marginLeft: '18px', display: 'flex', flexDirection: 'column' } as const;
const EV_BLOCK = { display: 'flex', flexDirection: 'column' } as const;
const EV_COUNT = {
  fontSize: '9px',
  lineHeight: 1.4,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: NAVY.textDim,
} as const;
const EV_GROUP = {
  marginTop: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
} as const;
const EV_FAN_SOURCES = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  borderLeft: `2px solid ${NAVY.borderChip}`,
  paddingLeft: '12px',
} as const;
const FAN = { display: 'flex', flexDirection: 'column', gap: '7px' } as const;
const FAN_TITLE = {
  fontSize: '8.5px',
  lineHeight: 1.3,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: NAVY.textDim,
} as const;
const FAN_RANKED_ROW = { display: 'flex', flexWrap: 'wrap', gap: '8px' } as const;
const RANKED_COL = { display: 'flex', flexDirection: 'column', gap: '4px' } as const;
const RANKED_LABEL_MAIN = {
  fontSize: '7.5px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: NAVY.readingPrimaryLabel,
} as const;
const RANKED_LABEL_SEC = { ...RANKED_LABEL_MAIN, color: NAVY.textDim } as const;
const CHIP_BASE = {
  fontSize: '11px',
  lineHeight: 1.3,
  borderRadius: '7px',
  padding: '7px 11px',
} as const;
const CHIP_MAIN = {
  ...CHIP_BASE,
  color: NAVY.readingPrimaryText,
  background: NAVY.readingPrimaryBg,
  border: `1px solid ${NAVY.readingPrimaryBorder}`,
} as const;
const CHIP_SEC = {
  ...CHIP_BASE,
  color: '#aab0b8',
  background: NAVY.bgSourceCard,
  border: `1px solid ${NAVY.borderChip}`,
} as const;
const CHIP_EQUAL = {
  ...CHIP_BASE,
  color: NAVY.textHeading,
  background: NAVY.bgSourceCard,
  border: `1px solid ${NAVY.borderChip}`,
} as const;
const FAN_EQUAL_ROW = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '9px',
  alignItems: 'center',
} as const;
const FAN_EQUAL_SEP = { fontSize: '13px', lineHeight: 1, color: NAVY.textDim } as const;
const SRC_CARD = {
  padding: '11px 13px',
  background: NAVY.bgSourceCard,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '7px',
} as const;
const SRC_HEAD = { display: 'flex', alignItems: 'center', gap: '8px' } as const;
const SRC_KIND = {
  color: NAVY.textDim,
  fontSize: '8.5px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
} as const;
const SRC_SHARED = {
  fontSize: '8.5px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.textSecondary,
  border: `1px solid ${NAVY.borderPill}`,
  borderRadius: '10px',
  padding: '2px 7px',
} as const;
const SRC_TEXT = { fontSize: '11.5px', lineHeight: 1.7, color: NAVY.textSecondary } as const;
const MARK_ON = {
  color: '#ffffff',
  background: 'rgba(255,255,255,.10)',
  borderBottom: '1px solid rgba(255,255,255,.45)',
  borderRadius: '2px',
  padding: '1px 3px',
  fontWeight: 600,
} as const;
const SRC_REUSE = { fontSize: '10px', lineHeight: 1.45, color: '#8592b4' } as const;
const USAGE = {
  border: `1px solid ${NAVY.riskBorder}`,
  background: NAVY.riskBg,
  borderRadius: '9px',
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '11px',
} as const;
const USAGE_HEAD = { display: 'flex', alignItems: 'center', gap: '8px' } as const;
const USAGE_TITLE = {
  fontSize: '9px',
  fontWeight: 600,
  lineHeight: 1.3,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: NAVY.riskLabel,
} as const;
const USAGE_LIST = { display: 'flex', flexDirection: 'column', gap: '9px' } as const;
const USAGE_ROW = { display: 'flex', gap: '10px', alignItems: 'baseline' } as const;
const USAGE_ACTOR = {
  flex: 'none',
  width: '104px',
  fontSize: '9px',
  fontWeight: 600,
  lineHeight: 1.4,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  color: '#d9d2cb',
} as const;
const USAGE_TEXT = {
  flex: 1,
  minWidth: 0,
  fontSize: '10.5px',
  lineHeight: 1.5,
  color: '#93a0bf',
} as const;
