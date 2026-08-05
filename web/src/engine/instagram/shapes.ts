// Tolerance for the TWO JSON DIALECTS that coexist in an Instagram export
// (`docs/instagram-export-schema.md` §1):
//
//   legacy  { "<root_key>": [ { string_map_data: {...}, string_list_data: [...] } ] }
//   recent  [ { label_values: [ { label, value, href, … } ] } ]
//
// Lists are sometimes at the top level and sometimes under a single key (`relationships_following`,
// `likes_media_likes`) — and the root key is not derivable from the path.
//
// These helpers extract structure without presuming the dialect. They count, they list labels, they
// read timestamps.
//
// ⚠ THEY NEVER EXPOSE CONTENT. That is a design bound, not a habit: the engine reads structure and
// metadata, message text goes only to the local-AI path (ADR-0003 for the doctrine,
// `docs/instagram-export-schema.md` §6 for what is deliberately not read).
//
// ─── WHAT THESE HELPERS DO NOT DO ───────────────────────────────────────────────────────────────
//   - THEY DO NOT VALIDATE. A malformed item yields `undefined`/`[]`, never an error. An export is
//     an untrusted external artefact and half of it is optional; refusing on the first surprise
//     would mean refusing most real accounts;
//   - THEY DO NOT REPAIR VALUES. `fixMojibake` is applied to LABELS only, where the comparison
//     happens. A value goes to its caller as it came, because a display name may hold emoji that
//     the repair would corrupt;
//   - `toList` RETURNS THE FIRST ARRAY IT FINDS in a wrapper object. If Instagram ever ships an
//     object with two array-valued keys, this picks one — an ambiguity no caller can currently
//     detect, and the reason the contract records the wrapping rule rather than leaving it here.

import { fixMojibake } from './mojibake';

export interface LabelValue {
  label?: string;
  value?: string;
  href?: string;
  timestamp_value?: number;
  /** Nested one level deeper — see `nestedValueByLabel`. */
  dict?: unknown;
  vec?: unknown;
}

export interface StringMapEntry {
  value?: string;
  href?: string;
  timestamp?: number;
}

/** The item list, whether `d` is already an array or an object wrapping one. */
export function toList(d: unknown): unknown[] {
  if (Array.isArray(d)) return d;
  if (d && typeof d === 'object') {
    for (const v of Object.values(d as Record<string, unknown>)) {
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

/** An item's `label_values` array (recent dialect). */
export function labelValues(item: unknown): LabelValue[] {
  if (
    item &&
    typeof item === 'object' &&
    Array.isArray((item as { label_values?: unknown }).label_values)
  ) {
    return (item as { label_values: LabelValue[] }).label_values;
  }
  return [];
}

/** An item's `string_map_data` object (legacy dialect). */
export function stringMap(item: unknown): Record<string, StringMapEntry> {
  if (item && typeof item === 'object' && (item as { string_map_data?: unknown }).string_map_data) {
    return (item as { string_map_data: Record<string, StringMapEntry> }).string_map_data;
  }
  return {};
}

/** A value by its exact label (recent dialect), mojibake repaired on the label before comparing. */
export function valueByLabel(item: unknown, label: string): string | undefined {
  for (const lv of labelValues(item)) {
    if (lv.label && fixMojibake(lv.label) === label) return lv.value;
  }
  return undefined;
}

/**
 * A value nested ONE LEVEL DEEPER, under a `label_values` entry's `dict` or `vec`.
 *
 * ⚠ THIS IS NOT AN EDGE CASE, it is the shape `profile_based_in` uses for the declared city:
 * `{ label: "Détails", dict: [{ label: "Lieu", value: … }] }`. A flat walk of `label_values` does
 * not see it — and that is exactly how the prototype missed 199 DECLARED cities and replaced them
 * with a Geo-IP inference, which is a worse answer wearing the same confidence.
 */
export function nestedValueByLabel(item: unknown, label: string): string | undefined {
  for (const lv of labelValues(item)) {
    for (const branch of [lv.dict, lv.vec]) {
      if (!Array.isArray(branch)) continue;
      for (const sub of branch as LabelValue[]) {
        if (sub && typeof sub === 'object' && sub.label && fixMojibake(sub.label) === label) {
          return sub.value;
        }
      }
    }
  }
  return undefined;
}

/**
 * An item's timestamp in SECONDS, whichever field carries it.
 *
 * ⚠ `timestamp_ms` IS FLOORED, not rounded. A rounded millisecond can land a message in the next
 * second and, at a month boundary, in the next month — which is visible on the conversation
 * heatmap and on nothing else, i.e. invisible until someone counts.
 */
export function itemTimestampSec(item: unknown): number | undefined {
  if (!item || typeof item !== 'object') return undefined;
  const o = item as Record<string, unknown>;
  if (typeof o.timestamp === 'number') return o.timestamp;
  if (typeof o.timestamp_ms === 'number') return Math.floor(o.timestamp_ms / 1000);
  return undefined;
}

/** An item's URL (recent dialect: the first non-empty `href` of its `label_values`). */
export function hrefOf(item: unknown): string | undefined {
  for (const lv of labelValues(item)) {
    if (lv.href) return lv.href;
  }
  return undefined;
}
