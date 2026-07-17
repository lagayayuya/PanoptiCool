// Page d'accueil (maquette « Accueil v2 », refonte 2026-07-15). Écarts VOULUS vs la maquette
// (décisions yuya) : pas de section newsletter ; une seule plateforme sélectionnable (TikTok), la
// chip pointillée devient « Instagram, YouTube… bientôt » ; FR/EN et « Mentions légales » = boutons
// seuls, sans page ni traduction derrière.
//
// La modale de consentement reprend la maquette telle quelle : le clic « Continuer vers l'export »
// (case cochée obligatoire) mène au parcours réel (/analyse) ; le lien « données fictives » mène à
// la même page en mode démo (/analyse?demo) — même rendu, source synthétique.

import { useState } from 'preact/hooks';
import { EyeLogo } from './EyeLogo';
import { NAVY } from './palette';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { useIsMobile } from './useIsMobile';

const DEMO_HREF = '/analyse?demo';
const ANALYSE_HREF = '/analyse';

const STEPS = [
  {
    n: '1',
    title: 'Récupère ton export TikTok',
    text: 'Dans l’app : Profil → Paramètres → Compte → Télécharger tes données. Choisis le format JSON — le fichier peut prendre 1 h à 48 h pour être disponible.',
  },
  {
    n: '2',
    title: 'Dépose-le ici',
    text: 'Le fichier est lu directement dans ton navigateur. Il ne quitte jamais ton ordinateur, le code est ouvert si tu veux vérifier.',
  },
  {
    n: '3',
    title: 'Explore les déductions',
    text: 'Rythmes, thèmes, signaux sensibles avec leur niveau de confiance. Et si tu veux, une IA locale pousse l’analyse plus loin.',
  },
] as const;

interface Feat {
  tag: string;
  tagColor: string;
  border: string;
  title: string;
  text: string;
  /** Badge + texte remplaçant `text` sur MOBILE (maquette « Accueil v2 Mobile »). */
  mobileBadge?: string;
  mobileText?: string;
}

const FEATS: readonly Feat[] = [
  {
    tag: 'analyse',
    tagColor: NAVY.accent,
    border: NAVY.borderCard,
    title: 'Ton profil, tel qu’un algorithme le voit',
    text: 'Chaque déduction est reliée aux données exactes qui la nourrissent — recherches, commentaires, métadonnées — avec un score de confiance.',
  },
  {
    tag: 'ia locale',
    tagColor: NAVY.accent,
    border: NAVY.borderCard,
    title: 'Une IA qui tourne chez toi',
    text: 'Installe un petit modèle open source et fais-lui analyser tes traces. Coupe le wifi si tu veux : tout fonctionne hors ligne.',
    // Variante MOBILE (maquette « Accueil v2 Mobile ») : badge « sur ordinateur » + texte adapté —
    // l'analyse IA locale n'est pas disponible sur téléphone (cf. encart du parcours mobile).
    mobileBadge: 'sur ordinateur',
    mobileText:
      'Installe un petit modèle open source et fais-lui analyser tes traces. Pour l’instant, cette analyse n’est disponible que sur ordinateur.',
  },
  {
    tag: 'pour comprendre',
    tagColor: '#8fa3ff',
    border: NAVY.learnBorder,
    title: 'Apprendre en explorant',
    text: 'À chaque section, des explications dépliables : comment un algorithme devine, où vont les profils, ce qu’est un token, tes droits RGPD.',
  },
];

function ConsentModal({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) {
  const [checked, setChecked] = useState(false);
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: fermeture au clic hors modale — Échap serait un plus, pas un prérequis.
    // biome-ignore lint/a11y/noStaticElementInteractions: voile de fermeture, pas un contrôle — le bouton ✕ reste le chemin accessible.
    <div style={isMobile ? M_OVERLAY : OVERLAY} onClick={onClose}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: stoppe seulement la propagation du clic overlay. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Avant de continuer"
        style={isMobile ? M_MODAL : MODAL}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={MODAL_HEAD}>
          <span style={KICKER}>avant de continuer</span>
          <span style={{ flex: 1 }} />
          <button type="button" aria-label="Fermer" style={CLOSE_BTN} onClick={onClose}>
            ✕
          </button>
        </div>
        <span style={MODAL_TITLE}>Tu vas regarder tes données de très près.</span>
        <div style={MODAL_BODY}>
          <div style={MODAL_LINE}>
            <span style={{ color: NAVY.risk, flex: 'none' }}>▲</span>
            <span>
              Ton export contient des données{' '}
              <span style={EM}>personnelles, parfois sensibles ou intimes</span> : messages,
              recherches, horaires nocturnes, lieux. Les voir rassemblées et interprétées peut être{' '}
              <span style={EM}>déstabilisant</span>
            </span>
          </div>
          <div style={MODAL_LINE}>
            <span style={{ color: NAVY.ok, flex: 'none' }}>●</span>
            <span>
              Tout est analysé <span style={EM}>localement, dans ton navigateur</span>. Rien n’est
              envoyé, rien n’est conservé après fermeture de l’onglet.
            </span>
          </div>
          <div style={MODAL_LINE}>
            <span style={{ color: '#8fa3ff', flex: 'none' }}>●</span>
            <span>
              Si tu es sur un {isMobile ? 'téléphone partagé' : 'ordinateur partagé ou public'},
              pense à fermer l’onglet et supprimer le fichier d’export après usage.
            </span>
          </div>
        </div>
        <label style={CONSENT_LABEL}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.currentTarget.checked)}
            style={isMobile ? M_CHECKBOX : CHECKBOX}
          />
          <span style={CONSENT_TEXT}>
            J’ai compris la nature de ces données et je choisis de consulter mon analyse.
          </span>
        </label>
        {/* Mobile (bottom sheet) : boutons EMPILÉS pleine largeur, « Continuer » en premier
            (maquette « Accueil v2 Mobile ») ; desktop : rangée avec « Pas maintenant » à gauche. */}
        <div style={isMobile ? M_MODAL_ACTIONS : MODAL_ACTIONS}>
          {!isMobile && (
            <button type="button" style={LATER_BTN} onClick={onClose}>
              Pas maintenant
            </button>
          )}
          {!isMobile && <span style={{ flex: 1 }} />}
          <button
            type="button"
            disabled={!checked}
            style={{
              ...(checked ? GO_BTN : GO_BTN_OFF),
              ...(isMobile ? M_FULL_BTN : {}),
            }}
            onClick={() => {
              if (checked) window.location.href = ANALYSE_HREF;
            }}
          >
            Continuer vers l’export →
          </button>
          {isMobile && (
            <button type="button" style={{ ...LATER_BTN, ...M_FULL_BTN }} onClick={onClose}>
              Pas maintenant
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [consentOpen, setConsentOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div style={isMobile ? M_PAGE : PAGE}>
      <SiteHeader />
      <div style={isMobile ? M_SHELL : SHELL}>
        {/* --- Héros (mobile : colonne unique, logo statique centré — maquette Mobile) --------- */}
        <div style={isMobile ? undefined : HERO}>
          <div style={HERO_COL}>
            <span style={isMobile ? M_KICKER : KICKER}>
              tes exports de données, décodés chez toi
            </span>
            <h1 style={isMobile ? M_HERO_TITLE : HERO_TITLE}>Découvre ce que tes réseaux savent de toi.</h1>
            <p style={isMobile ? M_HERO_LEDE : HERO_LEDE}>
              Chaque plateforme doit te remettre tes données si tu les demandes. PanoptiCool lit ces
              exports et te montre ce qu’un algorithme pourrait en déduire : tes rythmes, tes
              centres d’intérêt et les signaux sensibles que tu ne penses pas laisser.
            </p>
            <div style={PICK_BLOCK}>
              <span style={PICK_LABEL}>choisis ta plateforme</span>
              <div style={isMobile ? M_PICK_COL : PICK_ROW}>
                <div style={isMobile ? M_PLATFORM_ON : PLATFORM_ON}>
                  <span style={isMobile ? M_PLATFORM_NAME : PLATFORM_NAME}>TikTok</span>
                  <span style={isMobile ? M_PLATFORM_SUB : PLATFORM_SUB}>disponible</span>
                </div>
                <div style={isMobile ? M_PLATFORM_SOON : PLATFORM_SOON}>
                  <span style={isMobile ? M_SOON_TEXT : SOON_TEXT}>
                    Instagram, YouTube… bientôt
                  </span>
                </div>
              </div>
            </div>
            <div style={isMobile ? M_CTA_COL : CTA_ROW}>
              <button
                type="button"
                style={isMobile ? M_CTA : CTA}
                onClick={() => setConsentOpen(true)}
              >
                Analyser mes données TikTok{' '}
                <span style={{ fontSize: isMobile ? '15px' : '13px' }}>→</span>
              </button>
              <a href={DEMO_HREF} style={isMobile ? M_DEMO_BTN : DEMO_LINK}>
                ou essaie d’abord avec des données fictives →
              </a>
            </div>
            <div style={isMobile ? M_TRUST_COL : TRUST_ROW}>
              {['100 % local — rien n’est envoyé', 'open source', 'gratuit, sans compte'].map(
                (t) => (
                  <span key={t} style={isMobile ? M_TRUST_ITEM : TRUST_ITEM}>
                    <span style={isMobile ? M_TRUST_DOT : TRUST_DOT} />
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
          {!isMobile && (
            <div style={HERO_EYE}>
              <EyeLogo variant="hero" />
            </div>
          )}
        </div>

        {/* --- Comment ça marche -------------------------------------------------------------- */}
        <div style={isMobile ? M_SECTION : SECTION}>
          {isMobile ? (
            <div style={M_SECTION_HEAD}>
              <span style={M_SECTION_TITLE}>Comment ça marche</span>
              <span style={SECTION_NOTE}>avec TikTok</span>
            </div>
          ) : (
            <div style={SECTION_HEAD}>
              <span style={SECTION_TITLE}>Comment ça marche</span>
              <span style={RULE} />
              <span style={SECTION_NOTE}>avec TikTok</span>
            </div>
          )}
          <div style={isMobile ? M_CARD_COL : CARD_GRID}>
            {STEPS.map((st) => (
              <div key={st.n} style={isMobile ? M_STEP_CARD : STEP_CARD}>
                <span style={STEP_N}>{st.n}</span>
                <span style={isMobile ? M_CARD_TITLE : CARD_TITLE}>{st.title}</span>
                <span style={isMobile ? M_CARD_TEXT : CARD_TEXT}>{st.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- Ce que tu vas découvrir ---------------------------------------------------------- */}
        <div style={isMobile ? M_SECTION : SECTION}>
          {isMobile ? (
            <span style={M_SECTION_TITLE}>Ce que tu vas découvrir</span>
          ) : (
            <div style={SECTION_HEAD}>
              <span style={SECTION_TITLE}>Ce que tu vas découvrir</span>
              <span style={RULE} />
            </div>
          )}
          <div style={isMobile ? M_CARD_COL : CARD_GRID}>
            {FEATS.map((f) => (
              <div
                key={f.tag}
                style={{
                  ...(isMobile ? M_FEAT_CARD : FEAT_CARD),
                  border: `1px solid ${f.border}`,
                }}
              >
                <div style={FEAT_TAG_ROW}>
                  <span style={{ ...FEAT_TAG, color: f.tagColor }}>{f.tag}</span>
                  {isMobile && f.mobileBadge !== undefined && (
                    <span style={M_DESKTOP_ONLY_BADGE}>{f.mobileBadge}</span>
                  )}
                </div>
                <span style={isMobile ? M_CARD_TITLE : CARD_TITLE}>{f.title}</span>
                <span style={isMobile ? M_CARD_TEXT : CARD_TEXT}>
                  {isMobile && f.mobileText !== undefined ? f.mobileText : f.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- Pourquoi « panopticool » ? ------------------------------------------------------- */}
        <div style={isMobile ? M_WHY_CARD : WHY_CARD}>
          <span style={isMobile ? M_KICKER : KICKER}>pourquoi « panopticool » ?</span>
          <p style={isMobile ? M_WHY_TEXT : WHY_TEXT}>
            Le panoptique (en anglais, <i>panopticon</i>) est une prison où un seul gardien peut
            observer tout le monde sans être vu. Les plateformes fonctionnent un peu pareil, mais
            ici c'est toi qui observes depuis ton ordinateur, et ça c'est... cool?
          </p>
          <a href={DEMO_HREF} style={isMobile ? M_WHY_LINK : WHY_LINK}>
            Voir la démo avec des données fictives →
          </a>
        </div>

        <SiteFooter />
      </div>

      {consentOpen && <ConsentModal onClose={() => setConsentOpen(false)} isMobile={isMobile} />}
    </div>
  );
}

// --- Styles (valeurs des maquettes, palette NAVY) -------------------------------------------------
const PAGE = {
  minHeight: '100vh',
  background: `linear-gradient(180deg, ${NAVY.bgPageTop} 0%, ${NAVY.bgPage} 480px)`,
  color: NAVY.textBright,
} as const;
const SHELL = {
  maxWidth: '1160px',
  margin: '0 auto',
  padding: '72px 40px 64px',
  display: 'flex',
  flexDirection: 'column',
  gap: '72px',
} as const;
const HERO = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 440px)',
  gap: '56px',
  alignItems: 'center',
} as const;
const HERO_COL = { display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 } as const;
const HERO_EYE = { minWidth: 0 } as const;
const KICKER = {
  fontSize: '10px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const HERO_TITLE = {
  margin: 0,
  fontSize: '42px',
  fontWeight: 500,
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
  color: NAVY.textBright,
  textWrap: 'balance',
} as const;
const HERO_LEDE = {
  margin: 0,
  fontSize: '13px',
  lineHeight: 1.8,
  color: NAVY.textLede,
  maxWidth: '540px',
} as const;
const PICK_BLOCK = {
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
  paddingTop: '6px',
} as const;
const PICK_LABEL = {
  fontSize: '9px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: NAVY.textDim,
} as const;
const PICK_ROW = { display: 'flex', gap: '10px', flexWrap: 'wrap' } as const;
const PLATFORM_ON = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '12px 18px',
  background: NAVY.accentBgSoft,
  border: `1px solid ${NAVY.accentBorderSoft}`,
  borderRadius: '10px',
} as const;
const PLATFORM_NAME = { fontSize: '12px', fontWeight: 600, color: NAVY.accentBright } as const;
const PLATFORM_SUB = {
  fontSize: '9px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const PLATFORM_SOON = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 18px',
  border: `1px dashed ${NAVY.borderInset}`,
  borderRadius: '10px',
} as const;
const SOON_TEXT = { fontSize: '10px', lineHeight: 1.3, color: NAVY.textGhost } as const;
const CTA_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  flexWrap: 'wrap',
  paddingTop: '4px',
} as const;
const CTA = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '9px',
  fontSize: '12px',
  fontWeight: 600,
  fontFamily: 'inherit',
  letterSpacing: '0.03em',
  color: NAVY.bgPage,
  background: NAVY.accent,
  border: 'none',
  borderRadius: '9px',
  padding: '15px 24px',
} as const;
const DEMO_LINK = {
  fontSize: '11.5px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textLede,
  textDecoration: 'none',
  borderBottom: `1px solid ${NAVY.borderChip}`,
  paddingBottom: '3px',
} as const;
const TRUST_ROW = { display: 'flex', gap: '18px', flexWrap: 'wrap', paddingTop: '4px' } as const;
const TRUST_ITEM = {
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  fontSize: '10px',
  color: NAVY.textDim,
} as const;
const TRUST_DOT = {
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  background: NAVY.ok,
} as const;
const SECTION = { display: 'flex', flexDirection: 'column', gap: '22px' } as const;
const SECTION_HEAD = { display: 'flex', alignItems: 'center', gap: '14px' } as const;
const SECTION_TITLE = {
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: NAVY.textBright,
} as const;
const RULE = { flex: 1, height: '1px', background: NAVY.borderCard } as const;
const SECTION_NOTE = {
  fontSize: '9.5px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.textDim,
} as const;
const CARD_GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '16px',
} as const;
const STEP_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '24px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderCard}`,
  borderRadius: '12px',
} as const;
const STEP_N = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '26px',
  height: '26px',
  borderRadius: '50%',
  border: '1px solid rgba(47,212,240,.5)',
  fontSize: '11px',
  fontWeight: 600,
  color: NAVY.accent,
} as const;
const CARD_TITLE = {
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textBright,
} as const;
const CARD_TEXT = { fontSize: '11px', lineHeight: 1.7, color: NAVY.textLede } as const;
const FEAT_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '24px',
  background: NAVY.bgCard,
  borderRadius: '12px',
} as const;
const FEAT_TAG = { fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' } as const;
const WHY_CARD = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '32px',
  background: 'linear-gradient(180deg, #0e1836, #0b1226)',
  border: '1px solid #243362',
  borderRadius: '14px',
  alignItems: 'flex-start',
} as const;
const WHY_TEXT = {
  margin: 0,
  fontSize: '12px',
  lineHeight: 1.8,
  color: NAVY.textLede,
  maxWidth: '760px',
} as const;
const WHY_LINK = {
  fontSize: '11px',
  fontWeight: 500,
  color: NAVY.accent,
  borderBottom: '1px solid rgba(47,212,240,.4)',
  paddingBottom: '2px',
  textDecoration: 'none',
} as const;

// --- Modale de consentement ---------------------------------------------------------------------
const OVERLAY = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  background: 'rgba(7,11,24,.8)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
} as const;
const MODAL = {
  width: '560px',
  maxWidth: '100%',
  maxHeight: '100%',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '14px',
  boxShadow: '0 30px 80px rgba(0,0,0,.6)',
  padding: '28px 30px',
} as const;
const MODAL_HEAD = { display: 'flex', alignItems: 'center', gap: '12px' } as const;
const CLOSE_BTN = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  borderRadius: '7px',
  border: `1px solid ${NAVY.borderChip}`,
  background: 'transparent',
  color: NAVY.textLede,
  fontSize: '13px',
} as const;
const MODAL_TITLE = {
  fontSize: '17px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.textBright,
} as const;
const MODAL_BODY = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  fontSize: '11.5px',
  lineHeight: 1.75,
  color: NAVY.textLede,
} as const;
const MODAL_LINE = { display: 'flex', gap: '11px' } as const;
const EM = { color: NAVY.textBright } as const;
const CONSENT_LABEL = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '11px',
  cursor: 'pointer',
  background: NAVY.bgInset,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '9px',
  padding: '13px 15px',
} as const;
const CHECKBOX = {
  accentColor: NAVY.accent,
  width: '15px',
  height: '15px',
  marginTop: '1px',
  flex: 'none',
} as const;
const CONSENT_TEXT = { fontSize: '11px', lineHeight: 1.6, color: NAVY.textSecondary } as const;
const MODAL_ACTIONS = { display: 'flex', alignItems: 'center', gap: '14px' } as const;
const LATER_BTN = {
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: 500,
  fontFamily: 'inherit',
  lineHeight: 1.3,
  color: NAVY.textLede,
  background: 'transparent',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '8px',
  padding: '12px 18px',
} as const;
const GO_BTN = {
  cursor: 'pointer',
  fontSize: '11.5px',
  fontWeight: 600,
  fontFamily: 'inherit',
  letterSpacing: '0.03em',
  lineHeight: 1.3,
  color: NAVY.bgPage,
  background: NAVY.accent,
  border: 'none',
  borderRadius: '8px',
  padding: '13px 20px',
} as const;
const GO_BTN_OFF = {
  ...GO_BTN,
  cursor: 'not-allowed',
  color: NAVY.textDim,
  background: '#1c2749',
} as const;

// --- Styles MOBILE (maquette « Accueil v2 Mobile » : colonne unique, cibles tactiles ≥ 44 px) ------
const FEAT_TAG_ROW = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
} as const;
// Le fond (dégradé) couvre TOUTE la largeur — pas de plafond ici, sinon le body noir apparaît en
// bandes de part et d'autre du conteneur 480 px sur les écrans intermédiaires (720 px et moins,
// mais plus larges que 480). Seul le CONTENU est centré à 480 px (M_SHELL).
const M_PAGE = { ...PAGE } as const;
const M_SHELL = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '36px 20px 48px',
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
} as const;
const M_KICKER = {
  fontSize: '11px',
  lineHeight: 1.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const M_HERO_TITLE = {
  margin: 0,
  fontSize: '28px',
  fontWeight: 500,
  lineHeight: 1.25,
  letterSpacing: '-0.02em',
  color: NAVY.textBright,
  textWrap: 'balance',
} as const;
const M_HERO_LEDE = {
  margin: 0,
  fontSize: '14px',
  lineHeight: 1.75,
  color: NAVY.textLede,
} as const;
const M_PICK_COL = { display: 'flex', flexDirection: 'column', gap: '10px' } as const;
const M_PLATFORM_ON = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '52px',
  padding: '14px 18px',
  background: NAVY.accentBgSoft,
  border: `1px solid ${NAVY.accentBorderSoft}`,
  borderRadius: '12px',
} as const;
const M_PLATFORM_NAME = { fontSize: '14px', fontWeight: 600, color: NAVY.accentBright } as const;
const M_PLATFORM_SUB = {
  fontSize: '11px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.accent,
} as const;
const M_PLATFORM_SOON = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  boxSizing: 'border-box',
  padding: '10px 18px',
  border: `1px dashed ${NAVY.borderInset}`,
  borderRadius: '12px',
} as const;
const M_SOON_TEXT = { fontSize: '12px', lineHeight: 1.4, color: NAVY.textGhost } as const;
const M_CTA_COL = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  paddingTop: '4px',
} as const;
const M_CTA = {
  ...CTA,
  justifyContent: 'center',
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '54px',
  fontSize: '14px',
  lineHeight: 1.3,
  borderRadius: '12px',
  padding: '16px 24px',
} as const;
const M_DEMO_BTN = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '48px',
  boxSizing: 'border-box',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.5,
  color: NAVY.textSecondary,
  textDecoration: 'none',
  border: `1px solid ${NAVY.borderChip}`,
  borderRadius: '12px',
  padding: '12px 18px',
  textAlign: 'center',
} as const;
const M_TRUST_COL = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  paddingTop: '2px',
} as const;
const M_TRUST_ITEM = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px',
  lineHeight: 1.4,
  color: NAVY.textMuted,
} as const;
const M_TRUST_DOT = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: NAVY.ok,
  flex: 'none',
} as const;
const M_SECTION = { display: 'flex', flexDirection: 'column', gap: '18px' } as const;
const M_SECTION_HEAD = { display: 'flex', flexDirection: 'column', gap: '6px' } as const;
const M_SECTION_TITLE = {
  fontSize: '15px',
  fontWeight: 500,
  lineHeight: 1.3,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: NAVY.textBright,
} as const;
const M_CARD_COL = { display: 'flex', flexDirection: 'column', gap: '14px' } as const;
const M_STEP_CARD = { ...STEP_CARD, gap: '11px', padding: '20px' } as const;
const M_FEAT_CARD = { ...FEAT_CARD, padding: '20px' } as const;
const M_CARD_TITLE = {
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.45,
  color: NAVY.textBright,
} as const;
const M_CARD_TEXT = { fontSize: '12.5px', lineHeight: 1.7, color: NAVY.textLede } as const;
const M_DESKTOP_ONLY_BADGE = {
  fontSize: '9.5px',
  lineHeight: 1.3,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: NAVY.riskLabel,
  border: '1px solid rgba(232,117,78,.4)',
  borderRadius: '20px',
  padding: '4px 8px',
} as const;
const M_WHY_CARD = { ...WHY_CARD, gap: '14px', padding: '24px 20px' } as const;
const M_WHY_TEXT = { margin: 0, fontSize: '13px', lineHeight: 1.75, color: NAVY.textLede } as const;
const M_WHY_LINK = {
  display: 'flex',
  alignItems: 'center',
  minHeight: '44px',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: 1.4,
  color: NAVY.accent,
  textDecoration: 'none',
} as const;

// --- Modale mobile : bottom sheet (maquette « Accueil v2 Mobile ») ---------------------------------
const M_OVERLAY = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  background: 'rgba(7,11,24,.8)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
} as const;
const M_MODAL = {
  width: '100%',
  maxWidth: '480px',
  maxHeight: '88vh',
  overflow: 'auto',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  background: NAVY.bgCard,
  border: `1px solid ${NAVY.borderInset}`,
  borderRadius: '18px 18px 0 0',
  boxShadow: '0 -20px 60px rgba(0,0,0,.6)',
  padding: '22px 20px 28px',
} as const;
const M_CHECKBOX = {
  accentColor: NAVY.accent,
  width: '20px',
  height: '20px',
  marginTop: '1px',
  flex: 'none',
} as const;
const M_MODAL_ACTIONS = { display: 'flex', flexDirection: 'column', gap: '10px' } as const;
const M_FULL_BTN = {
  width: '100%',
  boxSizing: 'border-box',
  minHeight: '50px',
  justifyContent: 'center',
  textAlign: 'center',
} as const;
