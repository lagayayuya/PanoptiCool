"""PanoptiCool — 100% synthetic TikTok export fixture generator (PANO-11).

See CLAUDE.md for the purpose and the privacy invariant, and
docs/tiktok-export-schema.md for the structure contract (the sole source of truth).
"""

from .generator import build_export, generate, make_populators, write_zip
from .personas import PERSONAS, Persona
from .registry import REGISTRY, CATEGORIES, enumerate_sections

# NB: `validate` is deliberately not imported here so that
# `python -m panopticool.validate` does not trigger runpy's double-import
# warning. It remains reachable via `from panopticool.validate import validate`.

__all__ = [
    "build_export",
    "generate",
    "make_populators",
    "write_zip",
    "PERSONAS",
    "Persona",
    "REGISTRY",
    "CATEGORIES",
    "enumerate_sections",
]
