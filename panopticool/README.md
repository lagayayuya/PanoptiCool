# `panopticool/` — the fake-export generator

This is **not the product**: it's its test bench, and the reproducible provenance of the archives in
[`samples/`](../samples/). It produces a `.zip` containing a `user_data_tiktok.json` whose values are
**100 % synthetic** but whose structure is identical to a real export, then validates the result
against the [structure contract](../docs/tiktok-export-schema.md).

Python ≥ 3.10, **stdlib only**, zero dependencies. All commands run from the repo root.

```sh
python -m panopticool                                    # out/user_data_tiktok.zip (volume 500)
python -m panopticool.validate out/user_data_tiktok.zip  # must report CONFORME
```

## Options

| Flag | What it does |
|---|---|
| `-o, --out PATH` | output `.zip` (default `out/user_data_tiktok.zip`) |
| `-s, --seed N` | random seed — same seed, same bytes (default `1337`) |
| `-v, --volume N` | `Watch History` ≈ N entries, the rest scaled to the real weights (contract §2) |
| `--persona {default,foodie,gamer,traveler}` | a coherent demo identity (default: random) |
| `--ads {off,on}` | `off` (default) leaves the ads sections empty; `on` uses a reconstruction that is **NOT verified** against a real export (§3) |
| `--empty SECTION` | force a section to its empty encoding — repeatable |
| `--absent SECTION` | omit a section's key entirely — repeatable |
| `--no-validate` | skip the validator after writing |

```sh
python -m panopticool -v 50000                # large volume
python -m panopticool --persona foodie        # coherent demo identity
```

## Adversarial entries

`--empty` and `--absent` exist so that **"absence as a signal" is tested and not merely asserted** —
one is a conforming case the engine must handle, the other a deviation it must reject cleanly:

```sh
python -m panopticool --empty  'Your Activity/Searches'                 # emptied section — must validate
python -m panopticool --absent 'Likes and Favorites/Favorite Sounds'    # omitted key — must be rejected
```

The archives built this way are consumed by the engine's golden tests. See
[`samples/README.md`](../samples/README.md) for the exact commands that reproduce the shipped
archives **bit for bit** — they are deterministic (fixed seed, frozen ZIP date).

## Modules

The pipeline separates **shape** from **values**, on purpose:

| Module | Role |
|---|---|
| `registry.py` | the **structural oracle** — describes the shape, fabricates no data |
| `populators.py` | synthetic values, pluggable — with `personas.py` and `ads_unverified.py` |
| `generator.py` | rendering + streamed zip |
| `volume.py` | scale |
| `validate.py` | conformance to the contract — standalone, usable on any archive |

## The rule this exists to serve

**No value drawn from a real export enters this repo** — not in the code, not in the tests, not in
the versioned fixtures. Every value emitted here is invented, carries no PII, and designates no real
person. What is allowed to cross from the real world is a **structure** or a **statistic** — a
schema, a distribution, an order of magnitude — never a fragment of text, a pseudonym, a date or an
identifier. The full invariant is in [`CLAUDE.md`](../CLAUDE.md).

Generated outputs (`out/`) are synthetic but stay out of versioning, as a matter of hygiene.
