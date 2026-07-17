"""Volume — combien d'items par section, à l'échelle (§2 du contrat).

`--volume N` fixe la section dominante `Watch History` à ≈ N et met les autres à
l'échelle selon les ratios observés sur un compte réel (§2). Les sections « 1–4 »
gardent un petit volume fixe. C'est une préoccupation de *population*, séparée de la
structure (registre) et de la fabrication de valeurs (populators).
"""

from __future__ import annotations

# Compte de référence de la section dominante (§2). Sert d'ancre aux ratios.
_ANCHOR = 9339

# Ratios relatifs à Watch History, dérivés de la table §2 (count_réel / 9339).
RATIO = {
    ("Your Activity", "Watch History"): 9339 / _ANCHOR,
    ("Likes and Favorites", "Like List"): 3491 / _ANCHOR,
    ("Likes and Favorites", "Favorite Videos"): 1843 / _ANCHOR,
    ("Your Activity", "Login History"): 345 / _ANCHOR,
    ("Profile And Settings", "Following"): 147 / _ANCHOR,
    ("Your Activity", "Searches"): 134 / _ANCHOR,
    ("Comment", "Comments"): 95 / _ANCHOR,
    ("Your Activity", "Status"): 37 / _ANCHOR,
    ("TikTok Live", "Watch Live History"): 15 / _ANCHOR,
    ("Your Activity", "Reposts"): 12 / _ANCHOR,
}

# Sections à petit volume (≈ 1–4), non mises à l'échelle (§2, dernière ligne).
FIXED = {
    ("Income+ Wallet", "Coin Purchase History"): 2,
    ("Likes and Favorites", "Favorite Collection"): 4,
    ("Likes and Favorites", "Favorite Effects"): 1,
    ("Likes and Favorites", "Favorite Sounds"): 4,
    ("Direct Message", "Tako Chat History"): 1,
    ("Your Activity", "Ads Visit History"): 2,
}


def count_for(path: tuple, volume: int) -> int:
    """Nombre d'items à générer pour `path` à `--volume` donné.

    Plancher à 1 pour toute section à ratio, afin que chaque quirk reste visible
    même à volume modeste. Les sections objet/scalaire (ProfileMap, SettingsMap…)
    ne sont pas listées : elles renvoient 1, ignoré par leur populator.
    """
    if path in RATIO:
        return max(1, round(volume * RATIO[path]))
    if path in FIXED:
        return FIXED[path]
    return 1
