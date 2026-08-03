# Sample — synthetic TikTok export

`user_data_tiktok.sample.zip` is a **100% synthetic fake TikTok export** (small
volume), structurally conforming to the contract `docs/tiktok-export-schema.md`. No
value is real; none designates a real person (see the privacy invariant in
`CLAUDE.md`).

## Contents
- `user_data_tiktok.json` — the 10 top-level categories; `Watch History` ≈ 300 entries,
  the other sections at the scale of the real weights (§2). ~89 KB uncompressed (91 457 bytes).

## Reproduce identically
The archive is deterministic (fixed seed, frozen ZIP date):

```sh
python -m panopticool -v 300 -s 1337 -o samples/user_data_tiktok.sample.zip
```

## Variants — golden tests (PANO-28)
Two **adversarial** entries consumed by the engine's golden tests (`web/src/engine/golden.test.ts`),
both synthetic and deterministic. **Volume 60** (≠ baseline 300) — to be respected to reproduce
identically:

- `user_data_tiktok.empty.zip` — `Your Activity/Searches` forced to its **empty encoding**:
  `SearchList → null` (registry PANO-11, §1.2). Conforming case ("absence as a signal"), must validate.
- `user_data_tiktok.absent.zip` — the key `Your Activity/Searches` **entirely omitted** (deviation):
  the ingest validator must reject it (`stage: validate`), not crash.

```sh
python -m panopticool -v 60 -s 1337 --empty  'Your Activity/Searches' -o samples/user_data_tiktok.empty.zip
python -m panopticool -v 60 -s 1337 --absent 'Your Activity/Searches' -o samples/user_data_tiktok.absent.zip
```

## Inspect / validate
```sh
unzip -p samples/user_data_tiktok.sample.zip user_data_tiktok.json | less   # read the JSON
python -m panopticool.validate samples/user_data_tiktok.sample.zip          # check conformance
```

The validator must report **CONFORME** (no deviation).
