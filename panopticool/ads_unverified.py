"""ads_unverified — UNVERIFIED reconstruction of the "ads" sections (§3).

⚠️  THIS WHOLE MODULE IS "UNVERIFIED".  The source account had ads
**disabled**: these sections are empty/null in the oracle, so their **populated
shape is NOT verified by the contract**. We reconstruct here a *plausible* shape
for `--ads on`, **physically separated** from the rest, so that it is trivial to
correct as soon as a real "ads on" export becomes available.

Sections concerned (§3):
* `Your Activity → Ad Interests → AdInterestCategories` — `""` when empty;
  assumed populated shape: list of category strings.
* `Your Activity → Instant Form Ads Responses → ResponsesList` — `null` when empty.
* `Off TikTok Activity → OffTikTokActivityDataList` — `null` (under BOTH of its
  parents, §1.6).

`--ads off` (default) never imports this module: the sections stay at their
empty encoding, strictly faithful to the oracle.
"""

from __future__ import annotations

import random

from .populators import _date, _opaque_id, _uuid_like
from .registry import DATE

# Explicit marker: these shapes are hypotheses, not facts from the contract.
UNVERIFIED = True

# Plausible interest categories (hypothesis: list of strings — §3).
_AD_INTEREST_CATEGORIES = (
    "Cooking", "Travel", "Fitness", "Gaming", "Beauty", "Technology",
    "Music", "Pets", "Outdoors", "Fashion", "Finance", "DIY",
)

# Plausible "Off TikTok Activity" sources (shape hypothesis — UNVERIFIED).
_OFF_TIKTOK_SOURCES = (
    "example-shop.com", "demo-news.example", "sample-game.example", "fixture-store.example",
)
_OFF_TIKTOK_EVENTS = ("PageView", "AddToCart", "Purchase", "Search", "ViewContent")


def ad_interest_categories(count):
    """AdInterestCategories populated — hypothesis: list of strings (UNVERIFIED §3)."""
    k = random.randint(3, 8)
    return random.sample(_AD_INTEREST_CATEGORIES, k=k)


def instant_form_responses(count):
    """ResponsesList populated — reconstructed shape, UNVERIFIED (§3)."""
    return [{
        "FormName": random.choice(("Newsletter", "Demo Request", "Giveaway")),
        "SubmittedTime": _date(DATE),
        "LeadId": _opaque_id(19),
    } for _ in range(random.randint(1, 4))]


def off_tiktok_activity(count):
    """OffTikTokActivityDataList populated — reconstructed shape, UNVERIFIED (§1.6/§3)."""
    return [{
        "Source": random.choice(_OFF_TIKTOK_SOURCES),
        "Event": random.choice(_OFF_TIKTOK_EVENTS),
        "TimeStamp": _date(DATE),
        "EventId": _uuid_like(upper=False),
    } for _ in range(random.randint(2, 6))]


# Wiring by path — merged into the populators only if `--ads on`.
ADS_POPULATORS = {
    ("Your Activity", "Ad Interests", "AdInterestCategories"): ad_interest_categories,
    ("Your Activity", "Instant Form Ads Responses"): instant_form_responses,
    ("Profile And Settings", "Off TikTok Activity"): off_tiktok_activity,
    ("Your Activity", "Off TikTok Activity"): off_tiktok_activity,
}
