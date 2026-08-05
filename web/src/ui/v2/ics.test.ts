// The net on the reminder file. It pins the FORMAT, because the format is the whole product here:
// a `.ics` that a calendar refuses is indistinguishable, from the page, from one it accepts —
// nothing goes red, the user just never gets a reminder.
//
// ─── WHAT THIS NET DOES NOT COVER ───────────────────────────────────────────────────────────────
//   - IT DOES NOT OPEN A CALENDAR. That Apple Calendar, Google Calendar and Thunderbird actually
//     accept this file is not reachable from Node. What is checked is conformance to the clauses of
//     RFC 5545 that these clients are known to enforce — line endings, escaping, DATE vs DATE-TIME.
//     A client-specific quirk would pass here.
//   - IT DOES NOT CHECK THE DOWNLOAD. Building the Blob, the object URL and the click belong to the
//     component; this module returns a string and stops there.
//   - IT DOES NOT JUDGE THE COPY. The summary and description come from the ratifiable perimeter;
//     that they say something useful is a human matter.

import { describe, expect, it } from 'vitest';
import { buildReminderIcs } from './ics';

const NOW = new Date('2026-08-03T09:30:00Z');
const UID = 'panopticool-reminder-test@panopti.cool';

const TEXT = {
  summary: 'Récupérer mon export TikTok',
  description: 'Le fichier devrait être prêt : retourne dans l’app, onglet « Télécharger ».',
  url: 'https://panopti.cool/fr/tiktok',
};

describe('buildReminderIcs', () => {
  const ics = buildReminderIcs(TEXT, NOW, UID);

  it('is a well-formed VCALENDAR with a single VEVENT', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(1);
    expect(ics.match(/END:VEVENT/g)).toHaveLength(1);
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain(`UID:${UID}`);
  });

  // §3.1. Not decoration: some clients reject a bare-LF file outright, others truncate it silently.
  it('every line ends with CRLF, and none is bare LF', () => {
    expect(ics.split('\r\n').length).toBeGreaterThan(10);
    expect(ics.replace(/\r\n/g, '')).not.toContain('\n');
  });

  // The reminder lands `days` later, as a WHOLE DAY in the reader's own timezone. A DATE-TIME in
  // UTC would show up the previous evening for anyone west of Greenwich.
  it('is an all-day event three days out, DTEND exclusive', () => {
    expect(ics).toContain('DTSTART;VALUE=DATE:20260806');
    expect(ics).toContain('DTEND;VALUE=DATE:20260807');
    expect(ics).not.toMatch(/DTSTART(?!;VALUE=DATE)/);
  });

  it('DTSTAMP is a UTC instant, unlike DTSTART', () => {
    expect(ics).toContain('DTSTAMP:20260803T093000Z');
  });

  it('honours the day offset', () => {
    expect(buildReminderIcs(TEXT, NOW, UID, 1)).toContain('DTSTART;VALUE=DATE:20260804');
    expect(buildReminderIcs(TEXT, NOW, UID, 30)).toContain('DTSTART;VALUE=DATE:20260902');
  });

  // §3.3.11. Our own copy is tame today — but it is ratifiable prose, and the day a translator adds
  // a comma an unescaped builder truncates the property for everyone.
  it('escapes the characters that would end a property early', () => {
    const nasty = buildReminderIcs(
      {
        summary: 'a, b; c\\d',
        description: 'line one\nline two',
        url: 'https://example.invalid/x',
      },
      NOW,
      UID,
    );
    expect(nasty).toContain('SUMMARY:a\\, b\\; c\\\\d');
    expect(nasty).toContain('DESCRIPTION:line one\\nline two');
    // ...and the escaping did not introduce a real line break, which would split the property.
    expect(nasty.split('\r\n').filter((l) => l.startsWith('DESCRIPTION'))).toHaveLength(1);
  });

  // Control « by which path the zero arrives »: the assertion above would pass on an empty string
  // too. This one proves the builder actually carries the text through.
  it('carries the supplied text', () => {
    expect(ics).toContain('SUMMARY:Récupérer mon export TikTok');
    expect(ics).toContain('URL:https://panopti.cool/fr/tiktok');
  });
});
