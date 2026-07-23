// Test of the factual Activity Summary reader (PANO-84) — pure source-projection, not a rule.

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
  it('projects videosShared/videosWatchedToEnd verbatim from ActivitySummaryMap', () => {
    const input = normalizeExport(exportWithActivitySummary(42, 9001));
    expect(readActivitySummary(input)).toEqual({ videosShared: 42, videosWatchedToEnd: 9001 });
  });

  it('zero everywhere (fresh account) → totals at zero, never absent', () => {
    const input = normalizeExport(exportWithActivitySummary(0, 0));
    expect(readActivitySummary(input)).toEqual({ videosShared: 0, videosWatchedToEnd: 0 });
  });

  it('ignores videosCommentedOnSinceAccountRegistration (covered by R2, another window)', () => {
    const input = normalizeExport(exportWithActivitySummary(5, 5, 999));
    expect(readActivitySummary(input)).toEqual({ videosShared: 5, videosWatchedToEnd: 5 });
  });
});
