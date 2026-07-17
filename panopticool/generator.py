"""Générateur — rend le registre en arbre JSON, puis l'emballe en .zip (en flux).

Le rendu est un parcours récursif du registre (l'oracle de forme) :

* un `dict`          -> un objet JSON ;
* une `Section`      -> son wrapper objet : siblings (§1.4) + clé de liste/map
                        valant soit la **valeur peuplée** (si un populator est
                        branché sur son chemin), soit son **encodage du vide** ;
* un `DirectEmpty`   -> l'encodage du vide littéral (`null` / `[]` / `{}`) ;
* un `Scalar`        -> sa sentinelle, ou sa valeur peuplée si un populator est
                        branché sur son chemin (cas `Ad Interests` sous `--ads on`).

Surcharges par section (« l'absence comme signal », §1.2) :
* `absent`  -> la clé de la section est **omise** de la sortie ;
* `empty`   -> la section est forcée à son **encodage du vide** déclaré.

Le nombre d'items par section vient de `volume.count_for` (§2). L'écriture JSON est
**streamée** dans l'entrée zip via `iterencode`, pour tenir à N = 50 000 sans
matérialiser la chaîne JSON entière.
"""

from __future__ import annotations

import json
import zipfile
from pathlib import Path

from .populators import (DEFAULT_POPULATORS, comments, profile_info, searches)
from .registry import REGISTRY, DirectEmpty, Scalar, Section
from .volume import count_for

# Nom de l'unique fichier dans l'archive (§0 du contrat).
JSON_FILENAME = "user_data_tiktok.json"

# Volume modéré par défaut : Watch History ≈ 500, le reste à l'échelle (§2).
DEFAULT_VOLUME = 500

# États de surcharge par section.
ABSENT = "absent"
EMPTY = "empty"


def _render(node, path, populators, volume, overrides):
    if isinstance(node, dict):
        out = {}
        for key, child in node.items():
            child_path = path + (key,)
            if overrides.get(child_path) == ABSENT:
                continue  # clé omise — teste l'« absence » dure
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
    """Assemble le jeu de populators : vérifiés (avec persona), + ads si demandé."""
    populators = dict(DEFAULT_POPULATORS)
    # Injection du persona dans les populators sensibles à l'identité/au thème.
    populators[("Profile And Settings", "Profile Info")] = \
        lambda count: profile_info(count, persona)
    populators[("Your Activity", "Searches")] = \
        lambda count: searches(count, persona)
    populators[("Comment", "Comments")] = \
        lambda count: comments(count, persona)
    if ads:
        # Import paresseux : le module NON VÉRIFIÉ (§3) n'est chargé que sur demande,
        # ce qui le tient physiquement à l'écart du chemin par défaut.
        from .ads_unverified import ADS_POPULATORS
        populators.update(ADS_POPULATORS)
    return populators


def build_export(volume: int = DEFAULT_VOLUME, ads: bool = False, persona=None,
                 overrides=None, populators=None) -> dict:
    """Construit la racine JSON complète : 10 catégories, chaque section peuplée,
    vide ou absente selon le contrat et les surcharges."""
    if populators is None:
        populators = make_populators(ads=ads, persona=persona)
    return _render(REGISTRY, (), populators, volume, overrides or {})


def write_zip(root: dict, out_path, *, indent: int = 2) -> Path:
    """Écrit `root` en `user_data_tiktok.json` dans une archive .zip, **en flux**.

    `iterencode` produit le JSON par fragments ; on les écrit par blocs ~64 Ko dans
    l'entrée zip (compressée à la volée), sans jamais matérialiser la chaîne entière.
    """
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    encoder = json.JSONEncoder(ensure_ascii=False, indent=indent)
    # Date figée (époque ZIP 1980-01-01) -> archive reproductible bit à bit à
    # contenu égal (utile pour l'échantillon commité, évite le bruit git).
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
    """Construit l'export et l'écrit ; renvoie le chemin du .zip."""
    root = build_export(volume=volume, ads=ads, persona=persona, overrides=overrides)
    return write_zip(root, out_path)
