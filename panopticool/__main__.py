"""CLI entry point: ``python -m panopticool``.

Writes a .zip containing a single synthetic ``user_data_tiktok.json``,
structurally conformant to the contract (docs/tiktok-export-schema.md), then
**validates** it with the standalone validator (`panopticool.validate`).

Configurable surface:
  --volume N        Watch History ≈ N, the rest scaled per §2 (up to tens of thousands)
  --ads on|off      UNVERIFIED ads reconstruction (§3), off by default
  --persona NAME    identity profile of the demo persona (default = random)
  --empty  SECTION  forces a section to its empty encoding ("absence as signal")
  --absent SECTION  omits a section's key entirely
"""

from __future__ import annotations

import argparse
import random
import sys
from pathlib import Path

from .generator import DEFAULT_VOLUME, EMPTY, ABSENT, generate
from .personas import NAMES as PERSONA_NAMES, get as get_persona
from .registry import enumerate_sections
from .validate import validate_file

DEFAULT_OUT = "out/user_data_tiktok.zip"
DEFAULT_SEED = 1337


def _valid_paths() -> set:
    """All valid section paths (leaves + prefixes) for --empty/--absent."""
    paths = set()
    for path, _ in enumerate_sections():
        for i in range(1, len(path) + 1):
            paths.add(path[:i])
    return paths


def _overrides(empty, absent):
    """Builds the overrides dict from the CLI options; warns on an unknown path."""
    valid = _valid_paths()
    overrides = {}
    for raw, state in [(s, EMPTY) for s in empty] + [(s, ABSENT) for s in absent]:
        path = tuple(p for p in raw.split("/") if p)
        if path not in valid:
            print(f"avertissement : section inconnue ignorée : {raw!r}", file=sys.stderr)
            continue
        overrides[path] = state
    return overrides


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m panopticool",
        description="Génère un faux export TikTok synthétique (.zip) et le valide.")
    parser.add_argument("-o", "--out", default=DEFAULT_OUT,
                        help=f"chemin du .zip de sortie (défaut : {DEFAULT_OUT})")
    parser.add_argument("-s", "--seed", type=int, default=DEFAULT_SEED,
                        help=f"graine aléatoire (sorties reproductibles ; défaut : {DEFAULT_SEED})")
    parser.add_argument("-v", "--volume", type=int, default=DEFAULT_VOLUME,
                        help=f"Watch History ≈ N, reste à l'échelle §2 (défaut : {DEFAULT_VOLUME})")
    parser.add_argument("--ads", choices=("off", "on"), default="off",
                        help="off (défaut) : sections ads vides/null ; on : reconstruction NON VÉRIFIÉE (§3)")
    parser.add_argument("--persona", choices=PERSONA_NAMES, default="default",
                        help="profil d'identité (défaut : aléatoire)")
    parser.add_argument("--empty", action="append", default=[], metavar="SECTION",
                        help="force une section à son encodage du vide (répétable), ex. 'Your Activity/Searches'")
    parser.add_argument("--absent", action="append", default=[], metavar="SECTION",
                        help="omet entièrement la clé d'une section (répétable)")
    parser.add_argument("--no-validate", action="store_true",
                        help="n'exécute pas le validateur après écriture")
    args = parser.parse_args(argv)

    ads = args.ads == "on"
    persona = get_persona(args.persona)
    overrides = _overrides(args.empty, args.absent)

    random.seed(args.seed)
    zip_path = generate(args.out, volume=args.volume, ads=ads, persona=persona,
                        overrides=overrides)
    size = Path(zip_path).stat().st_size
    print(f"écrit : {zip_path} ({size} octets) — volume={args.volume} "
          f"ads={args.ads} persona={args.persona}")

    if args.no_validate:
        return 0
    return 0 if validate_file(zip_path) else 1


if __name__ == "__main__":
    raise SystemExit(main())
