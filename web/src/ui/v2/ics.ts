// The calendar reminder of the export guide, as an iCalendar file (RFC 5545).
//
// WHY A FILE AND NOT A NOTIFICATION. Asking a platform for your data takes days — TikTok announces
// up to four, Meta says nothing precise. The guide's last slide is therefore about the wait, and
// the only thing the product can honestly offer there is a reminder the person owns: a `.ics` their
// own calendar swallows. No account, no push subscription, no third party — a Blob built here and
// handed to a download. The invariant holds by construction: there is no recipient.
//
// This module is PURE — it returns a string. Building the Blob and triggering the download is the
// caller's business (`ExportGuide.tsx`), which keeps the format testable without a DOM.
//
// ─── THE THREE THINGS THAT ARE EASY TO GET WRONG, AND ARE PINNED BY THE TEST ────────────────────
//   - LINE ENDINGS ARE CRLF. §3.1 is explicit and calendars are not forgiving: an `.ics` with bare
//     LF is rejected outright by some clients and silently truncated by others.
//   - THE TEXT VALUES ARE ESCAPED. A comma, a semicolon or a backslash in a summary ends the
//     property early (§3.3.11). Our own strings are tame today, but they are ratifiable copy: the
//     day one gains a comma, an unescaped builder breaks the file for everyone.
//   - AN ALL-DAY EVENT IS A `DATE`, NOT A `DATE-TIME`. `DTSTART;VALUE=DATE:20260803` is a whole
//     day in the reader's own timezone, which is what we want; a UTC instant would land on the
//     previous evening for anyone west of Greenwich.

/** What the reminder says, supplied by the caller from the ratifiable copy. */
export interface ReminderText {
  readonly summary: string;
  readonly description: string;
  /** Absolute URL of the analysis page, so the event links back to where the file gets dropped. */
  readonly url: string;
}

/**
 * Escapes a text value (§3.3.11). Order matters: the backslash first, or the escapes we add would
 * themselves get escaped.
 */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/** `YYYYMMDD`, read off the LOCAL date — an all-day event belongs to the reader's calendar day. */
function localDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

/** `YYYYMMDDTHHMMSSZ` — `DTSTAMP` is a UTC instant, unlike `DTSTART` above. */
function utcStamp(d: Date): string {
  return `${d.toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`;
}

export const DEFAULT_REMINDER_DAYS = 3;

/**
 * The reminder file, as a string.
 *
 * `now` is injected rather than read from the clock: a builder that calls `Date.now()` cannot be
 * tested on an absolute value without rotting, and the goldens freeze their clock for the same
 * reason.
 *
 * `uid` is injected too. RFC 5545 requires one, and the obvious source — a random value — would
 * make the output non-reproducible, so the caller passes something stable and the test passes a
 * constant.
 */
export function buildReminderIcs(
  text: ReminderText,
  now: Date,
  uid: string,
  days = DEFAULT_REMINDER_DAYS,
): string {
  const start = new Date(now.getTime());
  start.setDate(start.getDate() + days);
  const end = new Date(start.getTime());
  end.setDate(end.getDate() + 1); // DTEND of an all-day event is EXCLUSIVE (§3.8.2.2)

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PanoptiCool//Export reminder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${utcStamp(now)}`,
    `DTSTART;VALUE=DATE:${localDate(start)}`,
    `DTEND;VALUE=DATE:${localDate(end)}`,
    `SUMMARY:${escapeText(text.summary)}`,
    `DESCRIPTION:${escapeText(text.description)}`,
    `URL:${escapeText(text.url)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}
