// Test du lecteur factuel Activity Summary (PANO-84) — pure projection-source, pas de règle.

import { describe, expect, it } from 'vitest';
import { readActivitySummary } from './activity-summary';
import { normalizeExport } from './normalize';
import type { TikTokExport } from './tiktok-export';
import { validTikTokExport } from './valid-export.fixture';

function exportWithActivitySummary(
  videosShared: number,
  videosWatchedToEnd: number,
  videosCommentedOn = 0,
): TikTokExport {
  const base = validTikTokExport();
  return {
    ...base,
    'Your Activity': {
      ...base['Your Activity'],
      'Activity Summary': {
        ActivitySummaryMap: {
          note: '',
          videosCommentedOnSinceAccountRegistration: videosCommentedOn,
          videosSharedSinceAccountRegistration: videosShared,
          videosWatchedToTheEndSinceAccountRegistration: videosWatchedToEnd,
        },
      },
    },
  };
}

describe('readActivitySummary', () => {
  it('projette videosShared/videosWatchedToEnd verbatim depuis ActivitySummaryMap', () => {
    const input = normalizeExport(exportWithActivitySummary(42, 9001));
    expect(readActivitySummary(input)).toEqual({ videosShared: 42, videosWatchedToEnd: 9001 });
  });

  it('zéro partout (compte neuf) → totaux à zéro, jamais absent', () => {
    const input = normalizeExport(exportWithActivitySummary(0, 0));
    expect(readActivitySummary(input)).toEqual({ videosShared: 0, videosWatchedToEnd: 0 });
  });

  it('ignore videosCommentedOnSinceAccountRegistration (couvert par R2, autre fenêtre)', () => {
    const input = normalizeExport(exportWithActivitySummary(5, 5, 999));
    expect(readActivitySummary(input)).toEqual({ videosShared: 5, videosWatchedToEnd: 5 });
  });
});
