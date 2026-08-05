// THUMBNAILS, made locally.
//
// ⚠ A STILL IS EXTRACTED FROM A VIDEO rather than the video being played. Playing N `VideoTexture`s
// is what made the media universe stutter; a poster costs one decode and then nothing. Actually
// watching the video is the viewer's job, on an explicit click.
//
// ─── ⚠ WHAT THIS MODULE DOES NOT DO ─────────────────────────────────────────────────────────────
//   - IT DOES NOT CACHE. Callers hold the canvases they asked for — the universe holds a bounded
//     pool and disposes what leaves it, which is a decision this module must not make for it;
//   - IT DOES NOT SURVIVE A CODEC IT CANNOT DECODE. A video the browser refuses rejects, and the
//     caller falls back to a placeholder. That is the honest outcome: a black square would look like
//     a black video;
//   - IT DOES NOT READ AUDIO. A voice note has no frame to take, and its placeholder is drawn by the
//     piece that shows it.

/** Loads an image into a canvas of at most `maxW` wide. Falls back to `<img>` if bitmaps fail. */
export async function loadImageThumb(url: string, maxW = 128): Promise<HTMLCanvasElement> {
  try {
    const blob = await (await fetch(url)).blob();
    const bmp = await createImageBitmap(blob, { resizeWidth: maxW });
    const c = document.createElement('canvas');
    c.width = bmp.width;
    c.height = bmp.height;
    c.getContext('2d')?.drawImage(bmp, 0, 0);
    bmp.close();
    return c;
  } catch {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = maxW / Math.max(img.naturalWidth, 1);
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(img.naturalWidth * scale));
    c.height = Math.max(1, Math.round(img.naturalHeight * scale));
    c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height);
    return c;
  }
}

/** Captures a cover frame from a video. Rejects if it does not decode. */
export function loadVideoPoster(url: string, maxW = 160): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = url;
    let settled = false;

    const cleanup = () => {
      video.removeAttribute('src');
      video.load();
    };
    const capture = () => {
      if (settled) return;
      settled = true;
      try {
        const w = video.videoWidth || 1;
        const h = video.videoHeight || 1;
        const scale = maxW / Math.max(w, 1);
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(w * scale));
        c.height = Math.max(1, Math.round(h * scale));
        c.getContext('2d')?.drawImage(video, 0, 0, c.width, c.height);
        cleanup();
        resolve(c);
      } catch (e) {
        cleanup();
        reject(e instanceof Error ? e : new Error('poster'));
      }
    };

    video.onloadeddata = () => {
      // ⚠ SEEK PAST THE START. The very first frame of a video is very often black — a poster taken
      // at 0 makes a whole grid of media look empty.
      try {
        video.currentTime = Math.min(0.1, (video.duration || 1) / 2);
      } catch {
        capture();
      }
    };
    video.onseeked = capture;
    video.onerror = () => {
      cleanup();
      reject(new Error('video'));
    };
    // A video that never fires either event would otherwise hold its slot in the pool for ever.
    setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('timeout'));
    }, 8000);
  });
}
