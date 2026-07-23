"""Volume — how many items per section, to scale (§2 of the contract).

`--volume N` sets the dominant section `Watch History` to ≈ N and scales the
others according to the ratios observed on a real account (§2). The "1–4"
sections keep a small fixed volume. This is a *population* concern, separate from
structure (registry) and from value fabrication (populators).
"""

from __future__ import annotations

# Reference count of the dominant section (§2). Serves as anchor for the ratios.
_ANCHOR = 9339

# Ratios relative to Watch History, derived from the §2 table (real_count / 9339).
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

# Small-volume sections (≈ 1–4), not scaled (§2, last row).
FIXED = {
    ("Income+ Wallet", "Coin Purchase History"): 2,
    ("Likes and Favorites", "Favorite Collection"): 4,
    ("Likes and Favorites", "Favorite Effects"): 1,
    ("Likes and Favorites", "Favorite Sounds"): 4,
    ("Direct Message", "Tako Chat History"): 1,
    ("Your Activity", "Ads Visit History"): 2,
}


def count_for(path: tuple, volume: int) -> int:
    """Number of items to generate for `path` at the given `--volume`.

    Floors at 1 for any ratio section, so that each quirk stays visible even at a
    modest volume. Object/scalar sections (ProfileMap, SettingsMap…) are not
    listed: they return 1, ignored by their populator.
    """
    if path in RATIO:
        return max(1, round(volume * RATIO[path]))
    if path in FIXED:
        return FIXED[path]
    return 1
