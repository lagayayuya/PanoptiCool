"""Validateur autonome — recharge un .zip produit et vérifie sa conformité au contrat.

Usage : ``python -m panopticool.validate <export.zip> [<autre.zip> ...]``

Contrôles (dérivés du registre, *indépendants* de la config de génération) :
catégories présentes et ordonnées (§0), présence de chaque section, encodage du vide
par section (§1.2), casse des clés d'item (§1.3), format de date par champ (§1.1),
siblings/types (§1.4), clé malformée verbatim (§1.7), map à clés opaques (§1.5),
formes des champs à fort signal (§1.8). Tout écart est rapporté ; code de sortie non
nul s'il en reste.

Les sections *ads* (NON VÉRIFIÉES, §3) sont validées avec indulgence : vide attendu,
ou liste reconstruite acceptée — leur forme peuplée n'est pas un fait du contrat.
"""

from __future__ import annotations

import json
import re
import sys
import zipfile

from .registry import (CATEGORIES, Container, DirectEmpty, Scalar, Section,
                       enumerate_sections)

JSON_FILENAME = "user_data_tiktok.json"
MALFORMED_KEY = "Who can see your following list::"  # §1.7

_RE_DATE = re.compile(r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$")
_RE_DATE_UTC = re.compile(r"^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC$")
_RE_UUID = re.compile(r"^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-"
                      r"[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$")
_RE_IPV4 = re.compile(r"^\d{1,3}(\.\d{1,3}){3}$")
_RE_IPV6 = re.compile(r"^[0-9a-f]{1,4}(:[0-9a-f]{0,4}){2,7}$")
_RE_OPAQUE = re.compile(r"^[1-9]\d{17,19}$")
_RE_HEX16 = re.compile(r"^[0-9a-f]{16}$")

# Chemins des sections ads (forme peuplée NON VÉRIFIÉE, §3) — validées avec indulgence.
_ADS_PATHS = {
    ("Your Activity", "Ad Interests"),
    ("Your Activity", "Ad Interests", "AdInterestCategories"),
    ("Your Activity", "Instant Form Ads Responses"),
    ("Profile And Settings", "Off TikTok Activity"),
    ("Your Activity", "Off TikTok Activity"),
}

# Libellés de contrôle (ordre d'affichage). Un écart est étiqueté par l'un d'eux.
LABELS = (
    "Archive (1 fichier, JSON valide)",
    "Catégories présentes et ordonnées (§0)",
    "Présence des sections",
    "Encodage du vide par section (§1.2)",
    "Casse des clés d'item (§1.3)",
    "Format de date par champ (§1.1)",
    "Siblings / types (§1.4)",
    "Clé malformée verbatim (§1.7)",
    "Map à clés opaques (§1.5)",
    "Champs à fort signal (§1.8)",
)


def _find(root, path):
    """Renvoie (trouvé, valeur) en suivant `path` clé à clé depuis la racine."""
    cur = root
    for key in path:
        if not isinstance(cur, dict) or key not in cur:
            return False, None
        cur = cur[key]
    return True, cur


def _iter_dates(value):
    if isinstance(value, str):
        if _RE_DATE.match(value) or _RE_DATE_UTC.match(value):
            yield value
    elif isinstance(value, dict):
        for v in value.values():
            yield from _iter_dates(v)
    elif isinstance(value, list):
        for v in value:
            yield from _iter_dates(v)


def _is_empty(value):
    return value is None or value == [] or value == {}


def validate(root: dict) -> list:
    """Renvoie la liste des écarts `(label, localisation, détail)` (vide si conforme)."""
    dev = []

    def flag(label, where, detail=""):
        dev.append((label, where, detail))

    # Catégories présentes et ordonnées (§0).
    if tuple(root) != CATEGORIES:
        flag(LABELS[1], "racine", f"obtenu {list(root)}")

    for path, node in enumerate_sections():
        where = "/".join(path)
        ads_lenient = path in _ADS_PATHS

        found, value = _find(root, path)
        if not found:
            flag(LABELS[2], where, "section absente")
            continue

        if isinstance(node, DirectEmpty):
            if value != node.empty.render():
                flag(LABELS[3], where, f"attendu {node.empty.value}")
            continue

        if isinstance(node, Scalar):
            if not ads_lenient and value != node.value:
                flag(LABELS[3], where, f"attendu {node.value!r}, obtenu {value!r}")
            continue

        # Section : wrapper objet + clé de liste/map.
        if not isinstance(value, dict):
            flag(LABELS[2], where, "wrapper non-objet")
            continue
        for sib in node.siblings:  # §1.4
            if sib.name not in value:
                flag(LABELS[6], where, f"sibling {sib.name} absent")
            elif not isinstance(value[sib.name], type(sib.value)):
                flag(LABELS[6], where, f"{sib.name} type inattendu")
        if node.key not in value:
            flag(LABELS[2], where, f"clé {node.key} absente")
            continue
        inner = value[node.key]

        if _is_empty(inner):
            if not ads_lenient and inner != node.empty.render():
                flag(LABELS[3], where,
                     f"vide {inner!r}, attendu {node.empty.value}")
            continue

        # Section peuplée — forme selon le conteneur.
        if node.container is Container.LIST:
            if not isinstance(inner, list):
                flag(LABELS[2], where, "attendu une liste")
            elif node.item_keys and not ads_lenient:
                for item in inner:
                    if not isinstance(item, dict) or tuple(item.keys()) != node.item_keys:
                        flag(LABELS[4], where,
                             f"clés {tuple(item.keys()) if isinstance(item, dict) else type(item).__name__}")
                        break
        elif node.container is Container.MAP:
            if not isinstance(inner, dict):
                flag(LABELS[2], where, "attendu un objet")
            elif node.key_kind == "opaque_id":
                bad = [k for k in inner if not _RE_OPAQUE.match(k)]
                if bad:
                    flag(LABELS[8], where, f"clés non opaques : {bad[:3]}")

        # Format de date par champ (§1.1).
        if node.date_format:
            want_utc = "UTC" in node.date_format
            for d in _iter_dates(inner):
                if bool(_RE_DATE_UTC.match(d)) != want_utc:
                    flag(LABELS[5], where,
                         f"{'UTC attendu' if want_utc else 'UTC inattendu'} : {d}")
                    break

    # Clé malformée verbatim (§1.7), si Settings est peuplé.
    ok, settings = _find(root, ("Profile And Settings", "Settings"))
    if ok and isinstance(settings, dict):
        sm = settings.get("SettingsMap")
        if isinstance(sm, dict) and sm and MALFORMED_KEY not in sm:
            flag(LABELS[7], "Profile And Settings/Settings/SettingsMap",
                 "clé malformée absente")

    # Champs à fort signal (§1.8), si peuplés.
    ok, st = _find(root, ("Your Activity", "Status"))
    if ok and isinstance(st.get("Status List"), list):
        for s in st["Status List"]:
            problems = []
            if not _RE_UUID.match(s.get("IDFA", "")):
                problems.append("IDFA")
            if not _RE_UUID.match(s.get("IDFV", "")):
                problems.append("IDFV")
            if not (s.get("GAID", "") == "" or _RE_UUID.match(s["GAID"])):
                problems.append("GAID")
            if not (s.get("Android ID", "") == "" or _RE_HEX16.match(s["Android ID"])):
                problems.append("Android ID")
            if not isinstance(s.get("UID"), int):
                problems.append("UID")
            if not _RE_OPAQUE.match(str(s.get("DID", ""))):
                problems.append("DID")
            if problems:
                flag(LABELS[9], "Your Activity/Status", ", ".join(problems))
                break
    ok, lh = _find(root, ("Your Activity", "Login History"))
    if ok and isinstance(lh.get("LoginHistoryList"), list):
        for e in lh["LoginHistoryList"]:
            ip = e.get("IP", "")
            if not (_RE_IPV4.match(ip) or _RE_IPV6.match(ip)):
                flag(LABELS[9], "Your Activity/Login History", f"IP {ip!r}")
                break

    return dev


def load_zip(path):
    """Charge le .zip ; renvoie (root|None, écarts d'archive)."""
    dev = []
    try:
        with zipfile.ZipFile(path) as zf:
            names = zf.namelist()
            if names != [JSON_FILENAME]:
                dev.append((LABELS[0], path, f"contenu {names}"))
                if JSON_FILENAME not in names:
                    return None, dev
            with zf.open(JSON_FILENAME) as fh:
                root = json.load(fh)
            return root, dev
    except (zipfile.BadZipFile, json.JSONDecodeError, KeyError, OSError) as exc:
        dev.append((LABELS[0], path, f"{type(exc).__name__}: {exc}"))
        return None, dev


def print_report(path, deviations) -> bool:
    """Affiche un rapport par contrôle ; renvoie True si conforme."""
    by_label = {}
    for label, where, detail in deviations:
        by_label.setdefault(label, []).append((where, detail))
    print(f"validation : {path}")
    for label in LABELS:
        items = by_label.get(label)
        if not items:
            print(f"  [OK  ] {label}")
        else:
            print(f"  [FAIL] {label} — {len(items)} écart(s)")
            for where, detail in items[:8]:
                print(f"         · {where}: {detail}")
            if len(items) > 8:
                print(f"         · … (+{len(items) - 8})")
    conforme = not deviations
    print(f"  => {'CONFORME' if conforme else 'NON CONFORME'}")
    return conforme


def validate_file(path) -> bool:
    root, dev = load_zip(path)
    if root is not None:
        dev = dev + validate(root)
    return print_report(path, dev)


def main(argv=None) -> int:
    argv = sys.argv[1:] if argv is None else argv
    if not argv:
        print("usage : python -m panopticool.validate <export.zip> [...]")
        return 2
    all_ok = True
    for path in argv:
        all_ok = validate_file(path) and all_ok
    return 0 if all_ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
