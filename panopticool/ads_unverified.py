"""ads_unverified — reconstruction NON VÉRIFIÉE des sections « ads » (§3).

⚠️  TOUT CE MODULE EST « UNVERIFIED ».  Le compte source avait les publicités
**désactivées** : ces sections sont vides/null dans l'oracle, donc leur **forme
peuplée n'est PAS vérifiée par le contrat**. On reconstruit ici une forme
*plausible* pour `--ads on`, **physiquement séparée** du reste, de sorte qu'elle
soit triviale à corriger dès qu'un vrai export « ads on » sera disponible.

Sections concernées (§3) :
* `Your Activity → Ad Interests → AdInterestCategories` — `""` quand vide ;
  forme peuplée supposée : liste de chaînes de catégories.
* `Your Activity → Instant Form Ads Responses → ResponsesList` — `null` quand vide.
* `Off TikTok Activity → OffTikTokActivityDataList` — `null` (sous ses DEUX parents,
  §1.6).

`--ads off` (défaut) n'importe jamais ce module : les sections restent à leur
encodage du vide, strictement fidèles à l'oracle.
"""

from __future__ import annotations

import random

from .populators import _date, _opaque_id, _uuid_like
from .registry import DATE

# Marqueur explicite : ces formes sont des hypothèses, pas des faits du contrat.
UNVERIFIED = True

# Catégories d'intérêt plausibles (hypothèse : liste de chaînes — §3).
_AD_INTEREST_CATEGORIES = (
    "Cooking", "Travel", "Fitness", "Gaming", "Beauty", "Technology",
    "Music", "Pets", "Outdoors", "Fashion", "Finance", "DIY",
)

# Sources plausibles d'« Off TikTok Activity » (hypothèse de forme — NON VÉRIFIÉE).
_OFF_TIKTOK_SOURCES = (
    "example-shop.com", "demo-news.example", "sample-game.example", "fixture-store.example",
)
_OFF_TIKTOK_EVENTS = ("PageView", "AddToCart", "Purchase", "Search", "ViewContent")


def ad_interest_categories(count):
    """AdInterestCategories peuplé — hypothèse : liste de chaînes (UNVERIFIED §3)."""
    k = random.randint(3, 8)
    return random.sample(_AD_INTEREST_CATEGORIES, k=k)


def instant_form_responses(count):
    """ResponsesList peuplé — forme reconstruite, NON VÉRIFIÉE (§3)."""
    return [{
        "FormName": random.choice(("Newsletter", "Demo Request", "Giveaway")),
        "SubmittedTime": _date(DATE),
        "LeadId": _opaque_id(19),
    } for _ in range(random.randint(1, 4))]


def off_tiktok_activity(count):
    """OffTikTokActivityDataList peuplé — forme reconstruite, NON VÉRIFIÉE (§1.6/§3)."""
    return [{
        "Source": random.choice(_OFF_TIKTOK_SOURCES),
        "Event": random.choice(_OFF_TIKTOK_EVENTS),
        "TimeStamp": _date(DATE),
        "EventId": _uuid_like(upper=False),
    } for _ in range(random.randint(2, 6))]


# Branchement par chemin — fusionné dans les populators seulement si `--ads on`.
ADS_POPULATORS = {
    ("Your Activity", "Ad Interests", "AdInterestCategories"): ad_interest_categories,
    ("Your Activity", "Instant Form Ads Responses"): instant_form_responses,
    ("Profile And Settings", "Off TikTok Activity"): off_tiktok_activity,
    ("Your Activity", "Off TikTok Activity"): off_tiktok_activity,
}
