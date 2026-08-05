// Main-thread client of the Instagram connector. Shell side (DOM allowed, outside `engine/`):
// starts the worker, hands it the `File` or the directory handle, and streams back what it posts.
//
// ⚠ THE FILE IS CLONED, NOT TRANSFERRED, and that is correct here where it would be wrong for
// TikTok. A `File` clone is a reference to the same disk-backed blob, not a copy of its bytes — so
// cloning a 2 GB archive costs nothing. Transferring, on the other hand, would DETACH it, and the
// page still needs it afterwards for the thread reader and the media resolver.
//
// The worker is thrown away when the analysis ends. What outlives it is the `File`, held by the
// page — the on-demand paths run there.
//
// ─── WHAT THIS CLIENT DOES NOT DO ───────────────────────────────────────────────────────────────
//   - ⚠ IT RETRIES ONCE, AND ONLY ON A STARTUP FAILURE. A worker that dies before it has parsed
//     anything — its module graph still being transformed, a chunk that lost the race — is a
//     different event from an archive that will not read, and it is the one a second click fixes.
//     Reported from the field: the first pick failed, the second worked. So the retry is bounded to
//     one, applies ONLY when no message ever arrived, and is not a general retry — a failed
//     ANALYSIS is reported once and the person decides;
//   - IT DOES NOT RECOVER A HALF-ANALYSIS. If the worker errors after three reports, those three
//     are already on screen and the error says the rest is missing — better than discarding what
//     was read, and honest about it;
//   - IT KNOWS NOTHING OF WHAT THE REPORTS MEAN. It routes messages; the page decides what a
//     missing geo database or a low label coverage should say.

import type { ReportPatch } from '../engine/instagram/connector';
import type { DirHandle } from '../engine/instagram/fs-directory-source';
import type { InstagramWorkerMessage, InstagramWorkerRequest } from '../engine/instagram/worker';
import type { Locale } from '../i18n/locales';

export interface InstagramRunHandlers {
  onProgress?: (p: { phase: string; done: number; total: number }) => void;
  onReport?: (patch: ReportPatch) => void;
  onGeoDatabase?: (available: boolean) => void;
  onCoverage?: (c: { matched: number; total: number }) => void;
  /** `stage` is the coarse `ConnectorFailure` kind — the page maps it to a sentence. */
  onError?: (stage: string) => void;
  onDone?: () => void;
}

export interface InstagramRunInput {
  readonly file?: File;
  readonly directory?: DirHandle;
  readonly locale: Locale;
  readonly now?: number;
}

/** Runs an analysis in a dedicated worker. Resolves when it finishes, one way or the other. */
export function runInstagramAnalysis(
  input: InstagramRunInput,
  handlers: InstagramRunHandlers = {},
): Promise<void> {
  return attempt(input, handlers, true);
}

function attempt(
  input: InstagramRunInput,
  handlers: InstagramRunHandlers,
  mayRetry: boolean,
): Promise<void> {
  const worker = new Worker(new URL('../engine/instagram/worker.ts', import.meta.url), {
    type: 'module',
  });
  /** ⚠ Did the worker ever speak? A failure BEFORE the first message is a startup failure — a
   *  different event from an archive that will not read, and the only one worth a second try. */
  let spoke = false;

  return new Promise<void>((resolve) => {
    const finish = () => {
      worker.terminate();
      resolve();
    };

    worker.onmessage = (event: MessageEvent<InstagramWorkerMessage>) => {
      spoke = true;
      const m = event.data;
      switch (m.kind) {
        case 'progress':
          handlers.onProgress?.({ phase: m.phase, done: m.done, total: m.total });
          break;
        case 'report':
          handlers.onReport?.(m.patch);
          break;
        case 'geo-database':
          handlers.onGeoDatabase?.(m.available);
          break;
        case 'coverage':
          handlers.onCoverage?.({ matched: m.matched, total: m.total });
          break;
        case 'error':
          handlers.onError?.(m.stage);
          finish();
          break;
        case 'done':
          handlers.onDone?.();
          finish();
          break;
      }
    };

    worker.onerror = () => {
      // A worker that dies outright — a module that failed to load, an out-of-memory — reaches
      // here rather than through the `error` message, and must not leave the page waiting.
      worker.terminate();
      if (!spoke && mayRetry) {
        // It never got as far as answering. One more try, then the failure is real — and it is
        // reported as `worker`, never as `parse`: telling someone their archive is corrupt when
        // our own code failed to start is the wrong sentence, and it sends them to re-download a
        // file that was fine.
        resolve(attempt(input, handlers, false));
        return;
      }
      handlers.onError?.('worker');
      resolve();
    };

    const request: InstagramWorkerRequest = {
      ...(input.file !== undefined && { file: input.file }),
      ...(input.directory !== undefined && { directory: input.directory }),
      locale: input.locale,
      ...(input.now !== undefined && { now: input.now }),
    };
    // No transfer list: see the header. Cloning a `File` is cheap; detaching it would break the
    // page's own on-demand reads.
    worker.postMessage(request);
  });
}
