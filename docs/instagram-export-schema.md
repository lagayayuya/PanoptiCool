# Instagram Data Export — Structural Contract (JSON format)

> **Source of truth for the Instagram connector and its synthetic fixture.**
> Derived from a **real** Instagram export with **all values stripped**. This file contains
> **zero real data**: what crossed is the shape, the key names, the counts and the encodings —
> never a value. Every value the fixture emits MUST be synthetic (repo invariant, `CLAUDE.md`).
>
> It is the Instagram counterpart of [`tiktok-export-schema.md`](tiktok-export-schema.md), and the
> two are **not** variants of one format. TikTok hands over one JSON file; Instagram hands over a
> directory tree of 500+ files in two coexisting dialects. Nothing here generalises to that one.

---

## ⚠ WHAT THIS CONTRACT DOES NOT COVER

`CLAUDE.md` requires a proof mechanism to declare its border in its own header, and this document is
cited as one. Four gaps, and the third is the one that will bite:

1. **ONE ACCOUNT, ONE EXPORT DATE.** Everything below was read from a single export (2026-07-07). A
   field absent from that account — a business profile, a monetised account, a Threads cross-post —
   is absent from this contract. Absence here means *not observed*, never *does not exist*.
2. **JSON ONLY.** Instagram also serves an HTML export. This contract says nothing about it, and the
   connector refuses it rather than guessing.
3. **⚠ THE ENGLISH LABEL TABLE IS DERIVED, NOT VERIFIED.** §3 is the load-bearing section — the
   extractors match field labels *by string* — and **no English Instagram export was available**.
   The English column was reconstructed from Instagram's own interface wording, not read from a
   file. Until an English export is checked against it, every English row is a **hypothesis**, and
   the failure mode is silent: a label that does not match yields an empty section, not an error.
   The connector therefore counts its matches and says so, rather than rendering a confident blank.
4. **THE MEDIA BYTES.** Volumes and extensions are counted (§2); nothing here describes the
   contents, the codecs or the EXIF of the media files themselves.

---

## 0. Container

- A `.zip` whose root holds **9 top-level directories**. No single manifest, no index: the tree
  *is* the structure, and a reader has to know the paths.
- Observed: **507 JSON files** and **5 413 media files**.
- The nine directories: `ads_information`, `apps_and_websites_off_of_instagram`, `connections`,
  `logged_information`, `personal_information`, `preferences`, `security_and_login_information`,
  `your_instagram_activity`, plus a `media` directory holding the bytes the JSON refers to.
- **Paths are stable, filenames are paged.** A section too large for one file is split with a
  numeric suffix (`followers_1.json`, `post_comments_1.json`, `posts_1.json`) — and the suffix
  appears **even when there is only one file**. A reader that opens `followers.json` finds nothing.

### 0.1 Messages — the one sub-tree with a shape of its own

```
your_instagram_activity/messages/
  inbox/<thread>/message_1.json … message_N.json     ← 349 threads observed
  message_requests/<thread>/message_1.json
  broadcast/
  photos/
  secret_conversations.json
```

- **⚠ `<thread>` IS A DIRECTORY NAME BUILT FROM A REAL PERSON**: the contact's handle, an
  underscore, then a numeric thread id. It is therefore a **value**, not structure, and it does not
  appear in this document, in the fixture, or in any tooling output. The fixture generates its own
  synthetic handles. *(This rule is written down because a shape-extraction script whose header
  claimed it could not emit a value emitted 422 of them, through the paths — a claim broader than
  its guarantee, which is the pattern `CLAUDE.md` watches for.)*
- Threads are **paged in reverse**: `message_1.json` holds the **most recent** messages, and the
  numbering grows backwards through time. Concatenating in filename order gives a reversed history.

Thread shape:

```json
{
  "participants": [{ "name": "str" }],
  "messages": [{
    "sender_name": "str",
    "timestamp_ms": 0,
    "content": "str",
    "is_geoblocked_for_viewer": false,
    "is_unsent_image_by_messenger_kid_parent": false
  }],
  "title": "str",
  "is_still_participant": true,
  "thread_path": "str",
  "magic_words": [],
  "joinable_mode": { "mode": 0, "link": "str" }
}
```

- A message carries **at most one** payload sibling — `content`, or `photos`, or `videos`, or
  `audio_files`, or `share`. A media message has **no `content` key at all** rather than an empty
  one, so a reader keyed on `content` silently drops every photo, voice note and reel.
- `participants` includes **the account holder**, so a one-to-one thread has 2 entries and a group
  has N+1. Sender identity is by **display name**, not by id — two participants may share one.

---

## 1. The two coexisting JSON dialects

Both appear in the same export, sometimes in sibling files. Neither is being migrated away from;
a reader must accept both.

### 1.1 Legacy — keyed object of `string_map_data`

```json
{ "<root_key>": [ {
    "title": "str",
    "media_map_data": {},
    "string_map_data": { "<LABEL>": { "href": "str", "value": "str", "timestamp": 0 } },
    "string_list_data": [ { "href": "str", "value": "str", "timestamp": 0 } ]
} ] }
```

The `<root_key>` is section-specific and unguessable from the path: `relationships_following`,
`account_history_login_history`, `account_history_imprecise_last_known_location`, `profile_user`.

### 1.2 Recent — flat array of `label_values`

```json
[ { "timestamp": 0, "media": [], "fbid": "str",
    "label_values": [ { "label": "str", "value": "str", "href": "str" } ] } ]
```

### 1.3 The three rules a reader needs

- **A list may or may not be wrapped.** Sometimes top level, sometimes the single array-valued
  property of an object. Resolve by *finding the array*, never by trusting the shape.
- **⚠ VALUES NEST ONE LEVEL DEEPER, WITHOUT WARNING.** A `label_values` entry may carry `dict` or
  `vec` instead of `value`, holding the real entries. `profile_based_in` puts the declared city
  there. A flat walk does not see it — *this exact gap made the prototype miss 199 declared cities
  and replace them with a Geo-IP inference*, which is a worse answer wearing the same confidence.
- **`href` is often present and often empty.** Never a signal of anything.

---

## 2. Volumes observed (one real account — scale, never copy)

Orders of magnitude are statistics and may cross; they are here so the fixture is plausible.

| What | Observed | Note |
|---|---|---|
| JSON files | 507 | across 9 directories |
| Media files | 5 413 | 2 364 jpg · 2 317 mp4 · 540 aac · 100 m4a · 49 png · 43 webp |
| Largest single JSON | 16.2 MB | `your_instagram_activity/likes/liked_posts.json` |
| Next largest | 5.9 / 3.9 / 3.7 MB | saved posts, stories viewed, polls |
| Message threads | 349 | inbox only |
| Liked posts | ~8 000 | recent dialect |
| Following | ~550 | legacy dialect |
| Login history entries | 166 | legacy dialect, one IP each |

**⚠ THE 16 MB ENTRY IS WHY THE MEMORY GUARD IS PER-ENTRY.** Peak memory tracks the largest single
file being inflated, not the archive total — so the guard is a measured per-entry budget, not a
guess about the reader's machine. A 2 GB archive of 16 MB entries is readable; a 500 MB archive
holding one 400 MB entry may not be.

---

## 3. ⚠ Field labels are in the ACCOUNT'S LANGUAGE

This is the single most consequential rule in this document, and the one §3 of the border above
qualifies. The extractors match **field labels by string**, and those labels are localised. An
export from a French account says `Nom de profil`; the same field from an English account does not.

### 3.1 Labels observed (French export)

| Section | Labels |
|---|---|
| `personal_information` | `Nom de profil`, `Nom`, `Adresse e-mail`, `Numéro de téléphone`, `Numéro de téléphone confirmé`, `Méthode de confirmation du numéro de téléphone`, `Genre`, `Date de naissance`, `Compte privé` |
| `login_activity` | `Nom du cookie`, `Adresse IP`, `Port`, `Code de langue`, `Heure`, `Agent utilisateur` |
| `last_known_location` | `Latitude imprécise`, `Longitude inexacte`, `Latitude exacte`, `Longitude exacte`, `Heure GPS de l'importation` |
| `profile_based_in` | nested under `dict` — the declared city |

Note `Latitude imprécise` beside `Longitude inexacte`: **two different adjectives for the same
pair**, in the source. Not a transcription error here — do not "fix" it.

### 3.2 The failure mode, and why it must be counted

A label that does not match produces **an empty section, not an error**. The prototype hard-codes
French strings in seven places with an English fallback in only two, so an English-locale export
yields a near-empty Identity, Relations and Geo report — silently, and looking exactly like an
account with nothing to show. The connector therefore reports **how many labels it matched**, so
that zero can be told apart from empty.

---

## 4. ⚠ Systematic mojibake — in the KEYS, not only the values

Every text field is double-encoded: the original UTF-8 bytes were read as Latin-1 and re-encoded as
UTF-8. After a normal UTF-8 decode one gets `NumÃ©ro de tÃ©lÃ©phone`, `Compte privÃ©`,
`Latitude imprÃ©cise`. Repair is deterministic: take the string's Latin-1 bytes (one per character)
and decode them as UTF-8; if any character exceeds `0xFF` the string is not pure Latin-1 mojibake
and must be returned untouched.

Two consequences that are easy to get wrong:

- **THE OBJECT KEYS ARE MOJIBAKE TOO.** In the legacy dialect the label *is* the key of
  `string_map_data`. Repairing only values leaves every French-accented field unfindable.
- **⚠ APPLY IT TO STRUCTURAL LABELS ONLY — NEVER TO CONTENT.** Display names and message bodies
  contain emoji and characters outside Latin-1; re-interpreting those corrupts them. The rule is
  not a precaution, it is a correctness bound: `Heure GPS de l'importation` arrives as
  `HeureÂ GPS de lâimportation`, where the apostrophe and a non-breaking space have each become
  their own artefact. Guessing at that in a message body would destroy real text.

---

## 5. What the connector reads

Roughly thirty files of the 507. The rest is either empty for this account, or outside what the
product is willing to infer from.

| Purpose | Paths |
|---|---|
| Identity | `personal_information/personal_information/{personal_information,profile_changes}.json`, `personal_information/information_about_you/{profile_based_in,possible_phone_numbers}.json`, `personal_information/autofill_information/autofill_information.json` |
| Relations | `connections/followers_and_following/{followers_1,following,close_friends,blocked_profiles,hide_story_from,pending_follow_requests}.json` |
| Geo | `security_and_login_information/login_and_profile_creation/{login_activity,last_known_location,profile_activity,signup_details,password_change_activity,profile_privacy_changes}.json` |
| Inventory | `your_instagram_activity/media/{posts_1,stories,archived_posts}.json`, `your_instagram_activity/comments/{post_comments_1,reels_comments,hype}.json`, `your_instagram_activity/likes/liked_comments.json`, `your_instagram_activity/story_interactions/{polls,story_likes}.json` |
| Conversations | `your_instagram_activity/messages/inbox/<thread>/message_*.json` |
| Ad value | `ads_information/instagram_ads_and_businesses/other_categories_used_to_reach_you.json` |
| Export date | `your_instagram_activity/other_activity/your_information_download_requests.json` |

---

## 6. What is deliberately NOT read

Stated because a contract that lists only what it uses reads as if the rest were unusable.

- **Message CONTENT is not read by the engine.** The conversation report counts, dates and
  measures rhythm; the text itself goes only to the **local AI path**, on an explicit click, and
  never leaves the device. That separation is the reason the mojibake rule above can be restricted
  to structural labels without ever being tested against a message body.
- `ads_viewed`, `posts_viewed`, `videos_watched` — hundreds of thousands of rows of pure viewing
  telemetry. Read for volume only: naming what was watched would build the very profile the tool
  exists to expose.
- `apps_and_websites_off_of_instagram` — off-platform activity. Out of scope for now, and worth
  its own decision rather than a quiet inclusion.
