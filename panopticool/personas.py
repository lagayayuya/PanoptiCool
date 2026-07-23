"""Personas — coherent identity profiles for the demo persona.

A `Persona` fixes a coherent **synthetic** identity (handle, display name, region,
bio, birth date, counters) and, optionally, themed content pools (searches,
comments). `--persona default` (or none) leaves the identity random (but
deterministic under a seed).

Privacy invariant: these personas are **fictional**; none designates a real
person (cf. CLAUDE.md).
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class Persona:
    name: str
    user_name: str
    display_name: str
    region: str            # 2-letter code
    bio: str
    birth_date: str        # YYYY-MM-DD
    follower_count: int
    following_count: int
    search_terms: tuple = field(default=())
    comment_texts: tuple = field(default=())


_FOODIE = Persona(
    name="foodie",
    user_name="olive_and_oregano",
    display_name="Olive Marchetti",
    region="IT",
    bio="home cook, always hungry",
    birth_date="1994-03-09",
    follower_count=1820,
    following_count=312,
    search_terms=("sourdough starter", "ramen broth recipe", "pasta from scratch",
                  "knife skills basics", "cast iron care", "30 min weeknight dinner"),
    comment_texts=("recipe please", "saving this", "yum", "what pan is that?",
                   "made it tonight", "chef's kiss"),
)

_GAMER = Persona(
    name="gamer",
    user_name="pixel_raptor",
    display_name="Theo Vance",
    region="US",
    bio="fps + cozy games, controller in hand",
    birth_date="2003-11-02",
    follower_count=4120,
    following_count=540,
    search_terms=("speedrun world record", "indie game trailer", "boss fight no hit",
                  "settings for low input lag", "cozy farming game", "patch notes"),
    comment_texts=("clip it", "gg", "what's the build", "insane reaction",
                   "tutorial when", "rage bait fr"),
)

_TRAVELER = Persona(
    name="traveler",
    user_name="atlas_wander",
    display_name="Mara Lindqvist",
    region="SE",
    bio="32 countries and counting",
    birth_date="1990-07-21",
    follower_count=2670,
    following_count=410,
    search_terms=("hidden beaches europe", "night train routes", "street food market",
                  "carry on packing", "visa free countries", "sunrise hike spots"),
    comment_texts=("adding to bucket list", "where is this", "how much was it",
                   "saving for later", "dreamy", "what camera"),
)

# Registry of named personas. `default` = random identity (key absent here).
PERSONAS = {p.name: p for p in (_FOODIE, _GAMER, _TRAVELER)}

# Names accepted by the CLI (with the "random" option).
NAMES = ("default", *sorted(PERSONAS))


def get(name) -> Persona | None:
    """Returns the named `Persona`, or `None` for `default`/`None` (random)."""
    if name in (None, "default"):
        return None
    try:
        return PERSONAS[name]
    except KeyError:
        raise ValueError(f"persona inconnu : {name!r} (attendus : {', '.join(NAMES)})")
