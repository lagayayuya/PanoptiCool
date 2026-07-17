"""PanoptiCool — générateur de fixture d'export TikTok 100 % synthétique (PANO-11).

Voir CLAUDE.md pour le but et l'invariant de privacy, et
docs/tiktok-export-schema.md pour le contrat de structure (seule source de vérité).
"""

from .generator import build_export, generate, make_populators, write_zip
from .personas import PERSONAS, Persona
from .registry import REGISTRY, CATEGORIES, enumerate_sections

# NB : `validate` n'est volontairement pas importé ici pour que
# `python -m panopticool.validate` ne déclenche pas l'avertissement runpy de
# double-import. Il reste accessible via `from panopticool.validate import validate`.

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
