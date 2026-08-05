// IS THE PERSON TYPING?
//
// ⚠ IT EXISTS BECAUSE OF A REAL COLLISION. The two 3D scenes drive their camera from bare keys —
// Z/Q/S/D and the arrows — and both also carry a search field. Without this guard, typing a name
// into that field walked the camera three paces and wrote only the letters that were not movement
// keys.
//
// ─── WHAT IT DOES NOT COVER ─────────────────────────────────────────────────────────────────────
//   - A FOCUSED ELEMENT INSIDE A SHADOW ROOT. `document.activeElement` stops at the host, so a field
//     inside one would not be seen. Nothing in this product uses shadow DOM;
//   - A KEY HANDLER THAT SHOULD YIELD FOR ANOTHER REASON. This answers one question — is a text
//     field taking the keystrokes — and a caller wanting more has to ask more.

export function isTyping(): boolean {
  const el = document.activeElement;
  if (!(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}
