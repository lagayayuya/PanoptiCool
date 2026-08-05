// Renders the site's own images FROM THE SITE — the landing-card preview, the share card, and the
// README screenshot. One script, three targets, because they are one problem: a picture of the
// product that has to stay true to it, in each language.
//
// ⚠ WHY A SCRIPT AND NOT A SCREENSHOT BY HAND. This image is one of the two artefacts in the
// repository that no grep and no diff can review: a reviewer sees `Bin 21870 -> 22314` and takes the
// rest on trust. The invariant it sits under is the first one in CLAUDE.md — no value drawn from a
// real export enters this repo — so « it comes from the synthetic persona » has to be something
// anyone can RE-RUN, not something a commit message asserts.
//
// What guarantees it is that the script cannot reach a real export: it drives the site's own `?demo`
// route, which builds a synthetic archive in the browser and analyses it with the real engine. There
// is no file input, no path argument, nothing to point at an `Instagram/` folder. The provenance is
// the mechanism rather than a claim about it.
//
// Run with the dev server up (`npm run dev`, port 8080):
//     node scripts/shoot-preview.mjs preview fr    → public/previews/tiktok.fr.webp
//     node scripts/shoot-preview.mjs og en         → public/og.en.jpg
//     node scripts/shoot-preview.mjs docs en       → docs/assets/screenshot-deductions.png
//
// ⚠ THE `docs` TARGET LEAVES THE SENSITIVE CARDS SHUT, like `preview`. A sensitive finding starts
// COLLAPSED by doctrine (ADR-0003, `sensitive-collapse.test.ts`); the README screenshot it replaces
// showed « Mental health · sensitive » open, with its evidence — the doctrine broken in the one
// image most people see before they see the product.
//
// ─── WHAT THIS SCRIPT DOES NOT DO ───────────────────────────────────────────────────────────────
//   - IT DOES NOT CHECK WHAT IT PHOTOGRAPHED. It opens the first non-sensitive card and shoots it;
//     whether the card that came up is the telling one is a human's call — which is why the output
//     is committed rather than generated at build time;
//   - IT IS NOT IN THE BUILD, and must not be: a new render changes what the home page promises, so
//     it is a decision and not a side effect;
//   - IT PINS NO BROWSER VERSION. It borrows whichever Chromium-family browser is installed, so two
//     machines can produce two slightly different renders of the same page;
//   - IT SAYS NOTHING ABOUT THE INSTAGRAM PREVIEW, which is a render of the media universe and
//     carries no interface text — one image serves both languages, and it has no script;
//   - IT DOES NOT ENCODE. It writes PNG to `/tmp`; the `webp`/`jpg` conversion is one `sharp` call
//     away and lives in the command that calls this, so a re-encode never needs a re-shoot.

import { spawn } from 'node:child_process';
import { accessSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, '..', 'public', 'previews');
const ORIGIN = 'http://localhost:8080';
const PORT = 9222;

const BROWSERS = [
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
];

/** ⚠ THE CARD IS OPENED, AND IT IS THE NON-SENSITIVE ONE. A sensitive finding starts COLLAPSED by
 *  doctrine (ADR-0003); prising one open for a shop-window picture would break the doctrine in the
 *  one place everybody looks. The first card that does not carry the sensitive badge is taken. */
const FIND_CARD = `
  const arts = [...document.querySelectorAll('article')];
  return arts.findIndex((a) => !/sensitive|sensible/i.test((a.innerText.split('\\n')[1] ?? '')));
`;

/**
 * The three targets. Each says WHERE to go, WHAT to open, and WHAT rectangle to keep.
 *
 * `frame` receives the page's own measurement and returns a clip in CSS pixels. `preview` and `og`
 * derive their width from a fixed ratio because both land in a slot the layout has already sized —
 * a picture of another shape is cropped there by `object-fit`, and a crop chosen by the browser
 * cuts a sentence rather than the background.
 */
const TARGETS = {
  preview: {
    path: (locale) => `/${locale}/tiktok?demo`,
    ratio: 16 / 9,
    open: (idx) => `
      const a = document.querySelectorAll('article')[${idx}];
      a.querySelector('button')?.click();
      a.scrollIntoView({ block: 'center' });
      return 'ok';
    `,
    rect: (idx) => `
      const a = document.querySelectorAll('article')[${idx}];
      const b = a.getBoundingClientRect();
      return JSON.stringify({ x: b.x + scrollX, y: b.y + scrollY, w: b.width, h: b.height });
    `,
  },
  // ⚠ THE SHARE CARD IS A PHOTOGRAPH OF THE HOME PAGE, not a picture drawn beside it. The one it
  // replaces was a separate design in a monospace theme two versions old, carrying a French
  // sentence to every English reader — because it was an ASSET, and assets do not follow a
  // redesign or a translation. Shot from the hero, it cannot say anything the page does not.
  og: {
    path: (locale) => `/${locale}/`,
    ratio: 1200 / 630,
    // A share card is read at thumbnail size in a conversation: the hero needs air around it or it
    // reads as a screenshot someone forgot to crop.
    pad: 56,
    open: () => `window.scrollTo(0, 0); return 'ok';`,
    rect: () => `
      const h = document.querySelector('h1');
      const box = h.closest('section') ?? h.parentElement;
      const b = box.getBoundingClientRect();
      return JSON.stringify({ x: b.x + scrollX, y: b.y + scrollY, w: b.width, h: b.height });
    `,
  },
  // The README's screenshot: the section's own introduction and its three cards, SHUT.
  //
  // ⚠ THE RECTANGLE IS THE INTRO PLUS THE CARDS, and it is built from DOM order rather than from a
  // container, because there is no element that holds exactly those two and nothing else: the cards
  // have a parent of their own (268 px for three collapsed cards), and its parent is the whole page
  // column (2 390 px). Taking the cards' parent together with its previous sibling is what frames
  // the claim and the evidence for it without dragging in the section that follows.
  docs: {
    path: (locale) => `/${locale}/tiktok?demo`,
    ratio: null,
    pad: 28,
    // Nothing is opened: the point of this picture is the state a reader meets first.
    open: () => `return 'ok';`,
    rect: () => `
      const cards = document.querySelector('article').parentElement;
      const intro = cards.previousElementSibling ?? cards;
      const a = intro.getBoundingClientRect();
      const b = cards.getBoundingClientRect();
      const top = Math.min(a.top, b.top);
      return JSON.stringify({
        x: Math.min(a.left, b.left) + scrollX,
        y: top + scrollY,
        w: Math.max(a.width, b.width),
        h: Math.max(a.bottom, b.bottom) - top,
      });
    `,
  },
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function findBrowser() {
  for (const b of BROWSERS) {
    try {
      accessSync(b);
      return b;
    } catch {}
  }
  throw new Error(`no Chromium-family browser found:\n  ${BROWSERS.join('\n  ')}`);
}

let seq = 0;
function cdp(ws, method, params = {}) {
  const id = ++seq;
  ws.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${method}: timed out`)), 90_000);
    const on = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id !== id) return;
      clearTimeout(timer);
      ws.removeEventListener('message', on);
      if (msg.error) reject(new Error(`${method}: ${msg.error.message}`));
      else resolve(msg.result);
    };
    ws.addEventListener('message', on);
  });
}

async function main() {
  const what = process.argv[2] ?? 'preview';
  const locale = process.argv[3] ?? 'fr';
  const target = TARGETS[what];
  if (target === undefined) throw new Error(`unknown target ${what} — ${Object.keys(TARGETS)}`);
  if (locale !== 'fr' && locale !== 'en') throw new Error(`locale must be fr or en, got ${locale}`);

  const profile = join('/tmp', `pano-shoot-${process.pid}`);
  const proc = spawn(findBrowser(), [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--hide-scrollbars',
    '--window-size=1700,1000',
    'about:blank',
  ]);
  proc.stderr.on('data', () => {});

  try {
    await mkdir(OUT_DIR, { recursive: true });
    for (let i = 0; i < 60; i++) {
      try {
        await fetch(`http://localhost:${PORT}/json/version`);
        break;
      } catch {
        await wait(250);
      }
    }

    const url = `${ORIGIN}${target.path(locale)}`;
    const res = await fetch(`http://localhost:${PORT}/json/new?${url}`, { method: 'PUT' });
    const tab = await res.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r, { once: true }));

    await cdp(ws, 'Page.enable');
    await cdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1700,
      height: 1000,
      // 2 so the committed file is crisp wherever it is shown at half its pixel width.
      deviceScaleFactor: 2,
      mobile: false,
    });

    const run = async (expression) => {
      const r = await cdp(ws, 'Runtime.evaluate', {
        expression: `(() => {${expression}})()`,
        awaitPromise: true,
        returnByValue: true,
      });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
      return r.result.value;
    };

    // A demo builds an archive and runs the real engine: that is not a page load. The home page
    // has nothing to wait for, so the poll below simply falls through on its first look.
    const needsAnalysis = target.path(locale).includes('demo');
    for (let i = 0; i < 40; i++) {
      await wait(1_000);
      if (!needsAnalysis) break;
      if ((await run('return document.querySelectorAll("article").length;')) > 0) break;
    }

    // `preview` needs the index of the first NON-SENSITIVE card; the others do not use it.
    const idx = what === 'preview' ? await run(FIND_CARD) : 0;
    if (what === 'preview' && idx < 0) throw new Error('no non-sensitive card on the page');
    await run(target.open(idx));
    await wait(2_500);

    const r = JSON.parse(await run(target.rect(idx)));

    // ⚠ THE FRAME CONTAINS THE BOX — it never crops it. Both slots that receive these pictures give
    // them a fixed shape, so a frame of any other one is cropped by `object-fit` at display time,
    // and a crop the browser chooses cuts a sentence rather than the background. So the frame is the
    // SMALLEST rectangle of the required ratio that holds the measured box, centred on it: whatever
    // fills the extra room is page background, which is what empty space in these pictures should be.
    //
    // ⚠ AND IT IS THE FIRST VERSION THAT WAS WRONG, in a way only looking caught. Deriving the width
    // from the height alone (`w = h × ratio`) is correct when the box is TALLER than the ratio — the
    // deduction card — and silently amputating when it is wider: the home page's hero came out with
    // « Find out what Instagram » cut off at the F, on the image that represents the site everywhere
    // it is shared. A `null` ratio keeps the measured rectangle: the README screenshot fits no slot.
    const pad = target.pad ?? 0;
    const boxW = r.w + pad * 2;
    const boxH = r.h + pad * 2;
    let width = boxW;
    let height = target.ratio === null ? boxH : boxW / target.ratio;
    if (target.ratio !== null && height < boxH) {
      height = boxH;
      width = boxH * target.ratio;
    }
    width = Math.round(width);
    height = Math.round(height);
    const clip = {
      x: Math.round(r.x + r.w / 2 - width / 2),
      y: Math.round(r.y + r.h / 2 - height / 2),
      width,
      height,
      scale: 1,
    };

    const { data } = await cdp(ws, 'Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
      clip,
    });
    const out = join('/tmp', `${what}-${locale}.png`);
    await writeFile(out, Buffer.from(data, 'base64'));
    console.log(`${out} — ${Math.round(width)}×${Math.round(height)} css px at dpr 2`);
    ws.close();
  } finally {
    proc.kill();
    await rm(profile, { recursive: true, force: true }).catch(() => {});
  }
}

await main();
