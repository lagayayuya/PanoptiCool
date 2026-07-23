"""Generator — renders the registry into a JSON tree, then packs it into a .zip (streamed).

Rendering is a recursive walk of the registry (the shape oracle):

* a `dict`           -> a JSON object;
* a `Section`        -> its object wrapper: siblings (§1.4) + list/map key holding
                        either the **populated value** (if a populator is wired to
                        its path) or its **empty encoding**;
* a `DirectEmpty`    -> the literal empty encoding (`null` / `[]` / `{}`);
* a `Scalar`         -> its sentinel, or its populated value if a populator is
                        wired to its path (the `Ad Interests` case under `--ads on`).

Per-section overrides ("absence as signal", §1.2):
* `absent`  -> the section's key is **omitted** from the output;
* `empty`   -> the section is forced to its declared **empty encoding**.

The number of items per section comes from `volume.count_for` (§2). JSON writing is
**streamed** into the zip entry via `iterencode`, to handle N = 50,000 without
materializing the whole JSON string.
"""

from __future__ import annotations

import json
import zipfile
from pathlib import Path

from .populators import (DEFAULT_POPULATORS, comments, profile_info, searches)
from .registry import REGISTRY, DirectEmpty, Scalar, Section
from .volume import count_for

# Name of the single file in the archive (§0 of the contract).
JSON_FILENAME = "user_data_tiktok.json"

# Moderate default volume: Watch History ≈ 500, the rest scaled (§2).
DEFAULT_VOLUME = 500

# Per-section override states.
ABSENT = "absent"
EMPTY = "empty"


def _render(node, path, populators, volume, overrides):
    if isinstance(node, dict):
        out = {}
        for key, child in node.items():
            child_path = path + (key,)
            if overrides.get(child_path) == ABSENT:
                continue  # key omitted — tests hard "absence"
            out[key] = _render(child, child_path, populators, volume, overrides)
        return out

    if isinstance(node, DirectEmpty):
        return node.empty.render()

    if isinstance(node, Scalar):
        if overrides.get(path) == EMPTY:
            return node.value
        populate = populators.get(path)
        return populate(count_for(path, volume)) if populate else node.value

    if isinstance(node, Section):
        wrapper = {sib.name: sib.value for sib in node.siblings}
        populate = populators.get(path)
        if overrides.get(path) == EMPTY or populate is None:
            wrapper[node.key] = node.empty.render()
        else:
            wrapper[node.key] = populate(count_for(path, volume))
        return wrapper

    raise TypeError(f"Nœud de registre non géré : {type(node).__name__!r} à {path}")


def make_populators(ads: bool = False, persona=None) -> dict:
    """Assembles the set of populators: verified (with persona), + ads if requested."""
    populators = dict(DEFAULT_POPULATORS)
    # Injection of the persona into the identity/theme-sensitive populators.
    populators[("Profile And Settings", "Profile Info")] = \
        lambda count: profile_info(count, persona)
    populators[("Your Activity", "Searches")] = \
        lambda count: searches(count, persona)
    populators[("Comment", "Comments")] = \
        lambda count: comments(count, persona)
    if ads:
        # Lazy import: the UNVERIFIED module (§3) is loaded only on demand,
        # which keeps it physically away from the default path.
        from .ads_unverified import ADS_POPULATORS
        populators.update(ADS_POPULATORS)
    return populators


def build_export(volume: int = DEFAULT_VOLUME, ads: bool = False, persona=None,
                 overrides=None, populators=None) -> dict:
    """Builds the complete JSON root: 10 categories, each section populated,
    empty, or absent according to the contract and the overrides."""
    if populators is None:
        populators = make_populators(ads=ads, persona=persona)
    return _render(REGISTRY, (), populators, volume, overrides or {})


def write_zip(root: dict, out_path, *, indent: int = 2) -> Path:
    """Writes `root` as `user_data_tiktok.json` into a .zip archive, **streamed**.

    `iterencode` produces the JSON in fragments; we write them in ~64 KB blocks into
    the zip entry (compressed on the fly), without ever materializing the whole string.
    """
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    encoder = json.JSONEncoder(ensure_ascii=False, indent=indent)
    # Fixed date (ZIP epoch 1980-01-01) -> archive reproducible bit for bit at
    # equal content (useful for the committed sample, avoids git noise).
    entry = zipfile.ZipInfo(JSON_FILENAME, date_time=(1980, 1, 1, 0, 0, 0))
    entry.compress_type = zipfile.ZIP_DEFLATED
    with zipfile.ZipFile(out_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        with zf.open(entry, "w") as fh:
            buf, size = [], 0
            for chunk in encoder.iterencode(root):
                buf.append(chunk)
                size += len(chunk)
                if size >= 65536:
                    fh.write("".join(buf).encode("utf-8"))
                    buf, size = [], 0
            if buf:
                fh.write("".join(buf).encode("utf-8"))
    return out_path


def generate(out_path, volume: int = DEFAULT_VOLUME, ads: bool = False,
             persona=None, overrides=None) -> Path:
    """Builds the export and writes it; returns the path of the .zip."""
    root = build_export(volume=volume, ads=ads, persona=persona, overrides=overrides)
    return write_zip(root, out_path)
