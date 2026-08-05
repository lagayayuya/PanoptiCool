// Repair of the SYSTEMATIC mojibake in Instagram exports (`docs/instagram-export-schema.md` §4).
//
// The JSON stores UTF-8 bytes, but the text was double-encoded: the original UTF-8 bytes were read
// as Latin-1 and re-encoded as UTF-8. After a normal UTF-8 decode one reads `NumÃ©ro de tÃ©lÃ©phone`
// instead of `Numéro de téléphone`.
//
// The repair is deterministic: take the mojibake string's Latin-1 bytes (one byte per character)
// and decode them as UTF-8.
//
// ⚠ WHAT THIS IS APPLIED TO, and a bound that was stated too widely at first.
//
// It read « structural labels only — never to content », justified by « the engine never reads
// message content ». Both halves have since been tested rather than assumed, and the second stopped
// being true the day the thread reader fed the local-AI path (`connector.ts`), which needs message
// text and sender names REPAIRED: an export writes them double-encoded like everything else, and a
// model handed `je t'aime` as `je tâ€™aime` reads noise where the sentence was.
//
// The real bound is the two guards below, and it was MEASURED, not reasoned:
//   - an emoji's mojibake form is entirely below U+0100 (`😀` → four Latin-1 characters), so it
//     passes the first guard and is RESTORED. The old comment predicted the opposite;
//   - already-clean text — `déjà vu`, `ça va 😀` — fails the fatal UTF-8 decode and returns
//     untouched. Verified on both, in both states.
//
// What remains, and no guard can settle it: a clean string whose Latin-1 bytes happen to BE valid
// UTF-8 is indistinguishable from a mojibake one, and gets « repaired ». It is rare and it is the
// price of the repair, not a defect in it.

// ⚠ `fatal: true` IS LOAD-BEARING, and its absence was a real defect inherited from the prototype.
// A `TextDecoder` is NON-FATAL by default: given bytes that are not valid UTF-8 it does not throw,
// it substitutes U+FFFD. So the `try/catch` below — written precisely to return the string
// untouched when the re-interpretation makes no sense — COULD NEVER FIRE, and an already-clean
// French label was silently mangled: `Compte privé` → `Compte priv\uFFFD`. Measured, not reasoned:
// the same input through a fatal decoder throws and comes back intact.
//
// The case is not hypothetical. Not every field of an export is double-encoded, and a table of
// labels compares against CLEAN strings — so the corruption lands exactly where a label lookup
// would then fail to match, producing the empty section this connector's design is built to avoid.
const utf8 = new TextDecoder('utf-8', { fatal: true });

export function fixMojibake(s: string): string {
  // First guard: a character above 0xFF means the string is not pure Latin-1 mojibake. Cheap, and
  // it catches emoji and anything already decoded from a non-Latin script.
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code > 0xff) return s;
    bytes[i] = code;
  }
  try {
    return utf8.decode(bytes);
  } catch {
    // Second guard, and the one that actually does the work: the Latin-1 bytes are not valid UTF-8,
    // so this string was never double-encoded. Return it as it came.
    return s;
  }
}
