// « 01 · L'identité » — the first piece, and the one the shell opens on.
//
// THE PAGE IS THE FILE, ALREADY OPEN. It classes rather than stacks: first what was GIVEN against
// what was GUESSED — that juxtaposition IS the demonstration — then the gestures, then the way into
// the other five pieces. The rest of the account's history sits behind the card's « En détail »
// toggle rather than running down the page.
//
// ⚠ THE LIMIT THE PIECE IMPOSES ON ITSELF: the vocabulary is a FILE's, never an official document's.
// No emblem, no machine-readable strip, no state-issued layout. It is not one, and letting a reader
// believe otherwise would be the exact opposite of the point.
//
// ─── ⚠ WHAT IS ABSENT FROM THIS PORT, AND WHY ───────────────────────────────────────────────────
// THE VALUE CARD IS NOT HERE — « ce que le compte a rapporté », the counter and the per-year ARPU
// bars. It renders `ValueReport`, which `runValue` returns as `null` while its reference table is
// an unratified research proposal (`value-table.ts`, `docs/data-value-reference-table.md`).
// Porting it would have meant writing a card that cannot mount, plus an unavailable-state for it —
// work that may not survive the ratification. It comes back with the flag, from the same source.
//
// Two smaller things go with it, because both read the same report: the « Ce qui n'y est pas »
// block of the detail view (which lists the value categories the export lacks), and the footer's
// « table de références datée du … ». Their absence is why the footer below is one sentence shorter
// than the mockup's.
//
// ─── WHAT THIS MODULE DOES NOT DO ───────────────────────────────────────────────────────────────
//   - IT SHOWS NO EMPTY ROW. A field with no value is not rendered — a « — » occupies the place of a
//     fact without being one — so the « champs remplis » count is DERIVED from the rows rather than
//     written beside them;
//   - IT DOES NOT INFER A GENDER, ANYWHERE, INCLUDING GRAMMATICALLY. See the note on the lede in
//     `copy.instagram.fr.ts`: a product that shows what a platform infers about someone cannot open
//     by inferring one itself;
//   - IT READS NO REPORT IT WAS NOT GIVEN. Everything comes from `inventory` and `identity`.

import { useMemo, useState } from 'preact/hooks';
import type { IdentityReport } from '../../engine/instagram/identity';
import type { InventoryReport } from '../../engine/instagram/inventory';
import { UI_IG_IDENTITY, UI_IG_SHELL } from '../copy.instagram';
import { formatDecimal, formatInt } from '../format';
import { monthYear, monthYearLong } from './dates';
import type { ModuleStatus } from './ModuleRail';
import './identity.css';

/** ⚠ Locale-aware, unlike the prototype's hard-coded `toLocaleString('fr-FR')` — which rendered
 *  French separators on an English page. `format.ts` already resolves the language once. */
const int = formatInt;
const dec = formatDecimal;

interface Field {
  key: string;
  label: string;
  value: string;
  note?: string;
}
interface Gesture {
  key: string;
  label: string;
  n: number;
}

export function IdentityModule({
  report,
  status,
  onSelect,
}: {
  report: { inventory?: InventoryReport; identity?: IdentityReport };
  status: Record<string, ModuleStatus>;
  onSelect: (id: string) => void;
}) {
  const { inventory, identity } = report;
  // The shell only mounts this piece once both are there (`MODULE_READY`); the guard is what makes
  // that contract visible from inside rather than assumed.
  if (inventory === undefined || identity === undefined) return null;
  const [learn, setLearn] = useState(false);
  const t = UI_IG_IDENTITY;
  const value = (key: string) => identity.anchors.find((x) => x.key === key)?.values[0] ?? '';
  const handle = value('profileName') || inventory.rootName;

  /** DECLARED — what the person gave themselves. */
  const declaredAll: Field[] = [
    { key: 'name', label: t.fields.name, value: value('name') },
    { key: 'handle', label: t.fields.handle, value: value('profileName') },
    { key: 'dob', label: t.fields.dob, value: value('dateOfBirth') },
    { key: 'gender', label: t.fields.gender, value: value('gender') },
    { key: 'email', label: t.fields.email, value: value('email') },
    { key: 'phone', label: t.fields.phone, value: value('phone') },
    { key: 'address', label: t.fields.address, value: value('address') },
  ];
  const declared = declaredAll.filter((f) => f.value !== '');

  /** ⚠ GUESSED — what nobody asked for. This register carries the argument. */
  const deducedAll: Field[] = [
    {
      key: 'city',
      label: t.fields.city,
      value: inventory.location.inferredCity,
      note: t.notes.cityNeverGiven,
    },
    {
      key: 'secondPhone',
      label: t.fields.secondPhone,
      value: value('deducedPhone'),
      note: t.notes.phoneNeverGiven,
    },
    {
      key: 'ads',
      label: t.fields.adTargeting,
      value:
        inventory.location.adCategories > 0
          ? t.adCategories(int(inventory.location.adCategories))
          : '',
      note: t.notes.adsNeverChosen,
    },
  ];
  const deduced = deducedAll.filter((f) => f.value !== '');

  return (
    <div class="idt">
      <section class="idt-hero">
        <div class="idt-hero-text">
          <h1 class="idt-h1">{t.h1}</h1>
          <p class="idt-lede">{t.lede(dec(identity.account.ageYears))}</p>
          <p class="idt-sub">{t.sub}</p>
          <button
            type="button"
            class="learn-btn"
            aria-expanded={learn}
            onClick={() => setLearn((x) => !x)}
          >
            {t.learnOpen} {learn ? UI_IG_SHELL.learnGlyphOpen : UI_IG_SHELL.learnGlyphClosed}
          </button>
        </div>
      </section>

      {learn && (
        <div class="learn-panel">
          <span class="learn-h">{t.learnTitle}</span>
          <div class="learn-cols">
            {t.learnCols.map((c) => (
              <div key={c.k}>
                <span class="learn-k">{c.k}</span>
                <span class="learn-p">{c.p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <section class="idt-band">
        <div class="idt-band-who">
          <span class="idt-handle">@{handle}</span>
          <span class="idt-opened">
            {identity.account.signupTs !== null
              ? t.openedIn(monthYearLong(identity.account.signupTs))
              : t.openedUnknown}
          </span>
        </div>
        <span class="kit-spacer" />
        <Fiche k={t.age} v={t.ageValue(dec(identity.account.ageYears))} />
        <Fiche k={t.logins} v={int(identity.account.loginEvents)} />
        <Fiche
          k={t.fieldsFilled}
          // Derived from the rows, never written beside them: an empty field is not rendered, so a
          // hand-written total would drift from what is on screen.
          v={t.fieldsFilledValue(
            String(declared.length + deduced.length),
            String(declaredAll.length + deducedAll.length),
          )}
        />
      </section>

      <Registres declared={declared} deduced={deduced} />
      <ActionsCard activity={inventory.activity} identity={identity} />
      <Suite inventory={inventory} status={status} onSelect={onSelect} />

      <p class="idt-foot">{t.foot}</p>
    </div>
  );
}

function Fiche({ k, v }: { k: string; v: string }) {
  return (
    <div class="idt-fiche">
      <span class="idt-fiche-k">{k}</span>
      <span class="idt-fiche-v">{v}</span>
    </div>
  );
}

/**
 * The two registers, side by side: their juxtaposition IS the demonstration.
 *
 * ⚠ WHEN ONE IS EMPTY THE OTHER TAKES THE FULL WIDTH, rather than facing a hollow card — an export
 * with no inferred city must not display an orange frame that accuses nothing.
 */
function Registres({ declared, deduced }: { declared: Field[]; deduced: Field[] }) {
  const t = UI_IG_IDENTITY;
  if (declared.length === 0 && deduced.length === 0) return null;
  const solo = declared.length === 0 || deduced.length === 0;
  return (
    <div class={`idt-regs ${solo ? 'solo' : ''}`}>
      {declared.length > 0 && (
        <section class="card">
          <header class="reg-head">
            <h2 class="card-h">{t.declaredTitle}</h2>
            <span class="card-sub">{t.declaredSub(declared.length)}</span>
          </header>
          <dl class="reg-rows">
            {declared.map((f) => (
              <div key={f.key} class="reg-row">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {deduced.length > 0 && (
        <section class="card reg-guessed">
          <header class="reg-head">
            <h2 class="card-h">{t.guessedTitle}</h2>
            <span class="card-sub warm">{t.guessedSub(deduced.length)}</span>
          </header>
          <dl class="reg-rows guessed">
            {deduced.map((f) => (
              <div key={f.key} class="reg-row">
                <dt>{f.label}</dt>
                {/* ⚠ The note stays INSIDE the `<dd>`: within a `<dl>`, a `<div>` admits only
                    `<dt>` and `<dd>`, so a sibling `<p>` there would be invalid markup. */}
                <dd>
                  {f.value}
                  {f.note !== undefined && <span class="reg-tag">{f.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
          <span class="kit-spacer" />
          <p class="reg-foot">{t.guessedFoot}</p>
        </section>
      )}
    </div>
  );
}

function ActionsCard({
  activity,
  identity,
}: {
  activity: InventoryReport['activity'];
  identity: IdentityReport;
}) {
  const t = UI_IG_IDENTITY;
  const [detail, setDetail] = useState(false);

  const gestures: Gesture[] = useMemo(
    () =>
      [
        { key: 'likes', label: t.gestures.likes, n: activity.likedPosts },
        { key: 'saves', label: t.gestures.saves, n: activity.savedPosts },
        { key: 'slikes', label: t.gestures.storyLikes, n: activity.storyLikes },
        { key: 'comments', label: t.gestures.comments, n: activity.comments },
        { key: 'clikes', label: t.gestures.commentLikes, n: activity.likedComments },
        { key: 'polls', label: t.gestures.polls, n: activity.polls },
      ]
        .filter((g) => g.n > 0)
        .sort((x, y) => y.n - x.n),
    [activity, t],
  );
  if (gestures.length === 0) return null;

  const total = gestures.reduce((s, g) => s + g.n, 0);
  const top = gestures.slice(0, 3);
  const rest = gestures.slice(3);
  const max = Math.max(...gestures.map((g) => g.n));

  // The card's last line picks up what the three tiles leave: the remaining gestures, then the
  // stories viewed. It disappears when there is nothing to pick up.
  const restParts = rest.map((g) => `${int(g.n)} ${g.label.toLowerCase()}`);
  if (activity.storiesViewed > 0) {
    restParts.push(t.storiesViewedPart(int(activity.storiesViewed)));
  }

  return (
    <section class="card">
      <header class="kit-head">
        <h2 class="card-h">{t.actionsTitle}</h2>
        <span class="act-count">{t.actionsCount(int(total))}</span>
        <span class="kit-spacer" />
        {/* biome-ignore lint/a11y/useSemanticElements: `<fieldset>` groups FORM controls; these
            are view switches, and `role="group"` with a label is the ARIA pattern for them. */}
        <div class="seg" role="group" aria-label={t.viewGroupLabel}>
          <button type="button" aria-pressed={!detail} onClick={() => setDetail(false)}>
            {t.viewOverview}
          </button>
          <button type="button" aria-pressed={detail} onClick={() => setDetail(true)}>
            {t.viewDetail}
          </button>
        </div>
      </header>

      {detail ? (
        <ActionsDetail
          gestures={gestures}
          max={max}
          storiesViewed={activity.storiesViewed}
          identity={identity}
        />
      ) : (
        <>
          <div class="act-tiles">
            {top.map((g) => (
              <div key={g.key} class="act-tile">
                <span class="act-tile-v">{int(g.n)}</span>
                <span class="act-tile-k">{g.label}</span>
              </div>
            ))}
          </div>
          {restParts.length > 0 && <p class="act-foot">{t.actionsMore(restParts.join(', '))}</p>}
        </>
      )}
    </section>
  );
}

function ActionsDetail({
  gestures,
  max,
  storiesViewed,
  identity,
}: {
  gestures: Gesture[];
  max: number;
  storiesViewed: number;
  identity: IdentityReport;
}) {
  const t = UI_IG_IDENTITY;
  const acc = identity.account;
  const past = identity.history.previousIdentities;
  const privacy = identity.anchors.find((a) => a.key === 'privacy');

  /** The account's LIFE: what Meta logs ABOUT the account, not what is done with it. */
  const life = [
    { k: t.life.logins, n: acc.loginEvents },
    { k: t.life.checkpoints, n: acc.securityCheckpoints },
    { k: t.life.passwords, n: acc.passwordChanges },
    { k: t.life.privacy, n: acc.privacyChanges },
    { k: t.life.exports, n: acc.exportRequests },
  ].filter((x) => x.n > 0);

  return (
    <div class="det">
      <section class="det-block">
        <h3 class="det-h">{t.detailGesturesTitle}</h3>
        <ul class="det-bars">
          {gestures.map((g) => (
            <li key={g.key}>
              <span class="det-bar-k">{g.label}</span>
              <span class="det-bar-track">
                <i style={{ width: `${(g.n / max) * 100}%` }} />
              </span>
              <b class="det-bar-v">{int(g.n)}</b>
            </li>
          ))}
        </ul>
        {storiesViewed > 0 && <p class="det-note">{t.detailStoriesNote(int(storiesViewed))}</p>}
      </section>

      {(life.length > 0 || privacy?.present === true) && (
        <section class="det-block">
          <h3 class="det-h">{t.lifeTitle}</h3>
          <p class="det-lede">{t.lifeLede}</p>
          <dl class="det-rows">
            {life.map((x) => (
              <div key={x.k} class="det-row">
                <dt>{x.k}</dt>
                <dd>{int(x.n)}</dd>
              </div>
            ))}
            {/* The visibility setting is the one STATE among counters. It belongs here because it
                describes the account rather than the person — and it has no business in the map's
                detail view, where it would situate nothing. */}
            {privacy?.present === true && privacy.values[0] !== undefined && (
              <div class="det-row">
                <dt>{t.fields.privateAccount}</dt>
                <dd>{privacy.values[0]}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {past.length > 0 && (
        <section class="det-block">
          <h3 class="det-h">{t.pastTitle}</h3>
          <p class="det-lede">{t.pastLede(past.length)}</p>
          <ul class="det-past">
            {past.map((p, i) => (
              <li key={`${p.field}-${p.value}-${i}`}>
                <span class="det-when">{p.ts !== null ? monthYear(p.ts) : t.pastUnknownDate}</span>
                {/* ⚠ The engine emits a KEY here, not a French word — the prototype emitted
                    « pseudo » / « nom affiché » from inside the extractor. The interface names it. */}
                <span class="det-what">{t.pastFields[p.field]}</span>
                <span class="det-val">{p.value}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** « The rest of the file » — one card per piece, with the figure that calls it. */
function Suite({
  inventory,
  status,
  onSelect,
}: {
  inventory: InventoryReport;
  status: Record<string, ModuleStatus>;
  onSelect: (id: string) => void;
}) {
  const t = UI_IG_IDENTITY;
  const m = inventory.messages;
  const c = inventory.connections;
  const loc = inventory.location;
  const media = m.contentTypes.photos + m.contentTypes.videos + m.contentTypes.audio;

  const cards = [
    {
      id: 'map',
      label: t.suite.mapLabel,
      big: t.suite.mapBig(int(loc.distinctLoginIps + loc.gpsPosts)),
      sub: t.suite.mapSub(int(loc.distinctLoginIps), int(loc.gpsPosts)),
    },
    {
      id: 'messages',
      label: t.suite.messagesLabel,
      big: t.suite.messagesBig(int(m.totalMessages)),
      sub: t.suite.messagesSub(int(m.conversations), int(m.distinctParticipants)),
    },
    {
      id: 'interactions',
      label: t.suite.interactionsLabel,
      big: t.suite.interactionsBig(int(c.following)),
      sub: t.suite.interactionsSub(int(c.followers), int(c.pendingSent)),
    },
    {
      id: 'files',
      label: t.suite.filesLabel,
      big: t.suite.filesBig(int(media)),
      sub: t.suite.filesSub,
    },
  ];

  return (
    <section class="idt-suite">
      <h2 class="idt-suite-h">{t.suiteTitle}</h2>
      <div class="suite-grid">
        {cards.map((k) => {
          const st = status[k.id] ?? 'soon';
          return (
            <button
              key={k.id}
              type="button"
              class="suite-card"
              disabled={st !== 'ready'}
              onClick={() => st === 'ready' && onSelect(k.id)}
            >
              <span class="suite-label">{k.label}</span>
              <span class="suite-big">{k.big}</span>
              <span class="suite-sub">{k.sub}</span>
              {st !== 'ready' && (
                <span class="suite-state">
                  {st === 'loading' ? t.suiteStateLoading : t.suiteStateSoon}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
