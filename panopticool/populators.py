"""Populators — factory of **synthetic values** for the data sections.

Privacy invariant (cf. CLAUDE.md): **every value here is invented**, with no PII,
no link to a real person. "Clearly fake but faithful in shape" choices:
emails at `@example.com` (RFC 2606), IPs in documentation ranges (RFC 5737/3849),
opaque identifiers drawn from `random` (seed fixed by the CLI → reproducible).

A *populator* is `f(count) -> value`: it returns the value to place under the
list/map key of a `Section` (or the replacement value of a `Scalar`). It is
wired by *path* (tuple of keys from the JSON root) in `DEFAULT_POPULATORS`.
`count` comes from `volume.count_for`; scalar-object populators ignore it.

The contract quirks (§1) are reproduced *here* at the source:
* per-section key case (§1.3) — lowercase for `ItemFavoriteList` and
  `CommentsList`, capitalized elsewhere;
* two date formats per field (§1.1) — the `… UTC` variant for Comments and Tako;
* plausible high-signal fields (§1.8) — IP, device, IDFA/IDFV, tiktok links.

The reconstruction of the *ads* sections (UNVERIFIED, §3) is kept apart in
``ads_unverified.py`` and is never imported here.
"""

from __future__ import annotations

import random
from datetime import datetime, timedelta

from .registry import DATE, DATE_UTC

# --- Synthetic time window ---------------------------------------------------
_WINDOW_START = datetime(2025, 1, 1, 0, 0, 0)
_WINDOW_END = datetime(2026, 6, 18, 0, 0, 0)
_WINDOW_SECONDS = int((_WINDOW_END - _WINDOW_START).total_seconds())


def _dt() -> datetime:
    return _WINDOW_START + timedelta(seconds=random.randint(0, _WINDOW_SECONDS))


def _date(fmt: str = DATE) -> str:
    """Synthetic timestamp within the window, formatted per `fmt` (§1.1)."""
    return _dt().strftime(fmt)


# --- Opaque identifiers / UUID / IP (faithful shapes, fake values) ----------
_HEX = "0123456789abcdef"


def _opaque_id(digits: int = 19) -> str:
    """Opaque numeric string of `digits` digits (first non-zero) — §1.5."""
    return str(random.randint(1, 9)) + "".join(
        random.choice("0123456789") for _ in range(digits - 1)
    )


def _hex4() -> str:
    return "".join(random.choice(_HEX) for _ in range(4))


def _uuid_like(upper: bool = True) -> str:
    """UUID-shaped (8-4-4-4-12) drawn from `random` — IDFA/IDFV (§1.8)."""
    groups = ["".join(random.choice(_HEX) for _ in range(n))
              for n in (8, 4, 4, 4, 12)]
    out = "-".join(groups)
    return out.upper() if upper else out


# Documentation ranges: IPv4 RFC 5737, IPv6 RFC 3849 — unambiguously fake.
_IPV4_NETS = ((192, 0, 2), (198, 51, 100), (203, 0, 113))


def _ip() -> str:
    if random.random() < 0.85:
        a, b, c = random.choice(_IPV4_NETS)
        return f"{a}.{b}.{c}.{random.randint(1, 254)}"
    return "2001:db8:" + ":".join(_hex4() for _ in range(6))


# --- "tiktok-shaped" links with synthetic identifiers (§1.8) ----------------
def _video_url() -> str:
    return f"https://www.tiktokv.com/share/video/{_opaque_id()}/"


def _user_url(handle: str) -> str:
    return f"https://www.tiktok.com/@{handle.lstrip('@')}"


def _music_url() -> str:
    slug = random.choice(("original-sound", "lofi-loop", "summer-pop", "ambient-rain"))
    return f"https://www.tiktok.com/music/{slug}-{_opaque_id()}"


def _effect_url() -> str:
    return f"https://www.tiktok.com/magic/share/effect/{_opaque_id()}"


def _live_url(handle: str) -> str:
    return f"https://www.tiktok.com/@{handle.lstrip('@')}/live"


def _photo_url() -> str:
    return f"https://p16-sign.tiktokcdn.com/aweme/{_opaque_id(16)}~c5_100x100.jpeg"


def _ad_link() -> str:
    slug = random.choice(("spring_sale", "app_install", "lead_gen", "retarget_q2"))
    return (
        "https://analytics.tiktok.com/api/v2/redirect"
        f"?campaign_id={_opaque_id(13)}&adgroup_id={_opaque_id(13)}"
        f"&creative_id={_opaque_id(13)}&ad_id={_opaque_id(13)}"
        f"&click_id={_uuid_like(False)}&ttclid={_uuid_like(False)}"
        f"&utm_source=tiktok&utm_medium=paid_social&utm_campaign={slug}"
    )


# --- Fictional, harmless pools (no PII) -------------------------------------
_SEARCH_TERMS = (
    "lo-fi beats to study", "ramen recipe quick", "golden retriever puppies",
    "synthwave playlist 2026", "how to fold a fitted sheet", "indoor plants low light",
    "bouldering for beginners", "cold brew at home", "origami crane tutorial",
    "city night timelapse", "homemade pasta", "watercolor basics",
)
_HANDLE_ADJ = ("mossy", "amber", "quiet", "neon", "velvet", "brisk", "lunar", "tidal")
_HANDLE_NOUN = ("lantern", "harbor", "cipher", "meadow", "vortex", "pixel", "ferry", "comet")
_COMMENT_TEXTS = (
    "this is so cool", "love this", "how did you do that?", "need a tutorial",
    "underrated", "saving this", "wholesome", "where is this?", "first try?",
    "the editing though", "instant follow", "🔥",
)
_VIDEO_TITLES = (
    "", "", "", "morning routine", "3 quick recipes", "studio tour",
    "before / after", "behind the scenes", "day in the life",
)
_COLLECTIONS = ("Recipes", "Travel", "Workout", "DIY", "Study", "Plants", "Music", "Gaming")
_AD_TITLES = (
    "Try our new app", "50% off this week", "Learn a language fast",
    "Game of the year", "Sneaker drop", "Meal kit delivery", "Book a demo",
)
_COIN_TYPES = ("Recharge", "In-App Purchase", "Bundle")
_RESOLUTIONS = ("1170x2532", "1284x2778", "1080x2400", "1440x3200", "828x1792")
_APP_VERSIONS = ("31.9.4", "32.4.0", "33.1.0", "34.5.2", "35.0.1")
_CARRIERS = ("", "", "", "Orange", "SFR", "Free", "Bouygues Telecom", "Verizon", "T-Mobile")
_DEVICES = (
    ("iPhone14,5", "iOS 17.4.1"), ("iPhone15,3", "iOS 17.5.1"),
    ("iPhone13,2", "iOS 16.7.2"), ("iPhone16,1", "iOS 18.0"),
    ("SM-G991B", "Android 13"), ("SM-S918B", "Android 14"),
    ("Pixel 7", "Android 14"), ("Pixel 8 Pro", "Android 15"),
    ("2201116SG", "Android 13"),
)
_BIOS = (
    "just here for the recipes", "ngl mostly cat videos", "student / part-time barista",
    "i make things sometimes", "coffee + code", "plant parent", "",
)
_REGIONS = ("FR", "US", "GB", "DE", "CA", "ES")
_DISPLAY_FIRST = ("Robin", "Sasha", "Noa", "Charlie", "Alex", "Sam", "Lou", "Andrea")
_DISPLAY_LAST = ("Lake", "Moreau", "Park", "Rivera", "Bauer", "Nguyen", "Costa", "Hale")


def _username() -> str:
    return "{}_{}_{}".format(
        random.choice(_HANDLE_ADJ), random.choice(_HANDLE_NOUN), random.randint(10, 99))


def _handle() -> str:
    return "@" + _username()


def _sorted_desc(items: list) -> list:
    """Sorts by the 1st date-looking value (most recent first)."""
    def keyfn(it):
        for v in it.values():
            if isinstance(v, str) and len(v) >= 19 and v[4] == "-" and v[7] == "-":
                return v
        return ""
    items.sort(key=keyfn, reverse=True)
    return items


# ===========================================================================
#  List populators — EXACT case and date format per section
# ===========================================================================
def searches(count, persona=None):
    """Your Activity → Searches → SearchList: {Date, SearchTerm} (persona theme)."""
    pool = persona.search_terms if persona and persona.search_terms else _SEARCH_TERMS
    items = [{"Date": _date(DATE), "SearchTerm": random.choice(pool)}
             for _ in range(count)]
    return _sorted_desc(items)


def following(count):
    """Profile And Settings → Following → Following: {Date, UserName}."""
    items = [{"Date": _date(DATE), "UserName": _handle()} for _ in range(count)]
    return _sorted_desc(items)


def comments(count, persona=None):
    """Comment → Comments → CommentsList: LOWERCASE keys (§1.3), UTC date (§1.1)."""
    pool = persona.comment_texts if persona and persona.comment_texts else _COMMENT_TEXTS
    items = []
    for _ in range(count):
        url = _video_url()
        items.append({
            "date": _date(DATE_UTC),
            "comment": random.choice(pool),
            "photo": "",
            "video": "",
            "sticker": "",
            "originalPostUrl": url,
            "original post link": url,
        })
    return _sorted_desc(items)


def coin_purchases(count):
    """Income+ Wallet → Coin Purchase History: {Date, Type, CoinAmount}."""
    items = [{
        "Date": _date(DATE),
        "Type": random.choice(_COIN_TYPES),
        "CoinAmount": random.choice((70, 350, 700, 1400, 3500)),
    } for _ in range(count)]
    return _sorted_desc(items)


def favorite_collections(count):
    """Likes and Favorites → Favorite Collection: {Date, FavoriteCollection}."""
    items = [{"Date": _date(DATE), "FavoriteCollection": random.choice(_COLLECTIONS)}
             for _ in range(count)]
    return _sorted_desc(items)


def favorite_effects(count):
    """Likes and Favorites → Favorite Effects: {Date, EffectLink}."""
    items = [{"Date": _date(DATE), "EffectLink": _effect_url()} for _ in range(count)]
    return _sorted_desc(items)


def favorite_sounds(count):
    """Likes and Favorites → Favorite Sounds: {Date, Link}."""
    items = [{"Date": _date(DATE), "Link": _music_url()} for _ in range(count)]
    return _sorted_desc(items)


def favorite_videos(count):
    """Likes and Favorites → Favorite Videos: {Date, Link}."""
    items = [{"Date": _date(DATE), "Link": _video_url()} for _ in range(count)]
    return _sorted_desc(items)


def like_list(count):
    """Likes and Favorites → Like List → ItemFavoriteList: LOWERCASE keys (§1.3)."""
    items = [{"date": _date(DATE), "link": _video_url()} for _ in range(count)]
    return _sorted_desc(items)


def reposts(count):
    """Your Activity → Reposts → RepostList: {Date, Link}."""
    items = [{"Date": _date(DATE), "Link": _video_url()} for _ in range(count)]
    return _sorted_desc(items)


def watch_history(count):
    """Your Activity → Watch History → VideoList: {Date, Link, Title}; Title "" frequent."""
    items = [{
        "Date": _date(DATE),
        "Link": _video_url(),
        "Title": random.choice(_VIDEO_TITLES),
    } for _ in range(count)]
    return _sorted_desc(items)


def ads_visit_history(count):
    """Your Activity → Ads Visit History: {CreateTime, AdTitle, AdLink} (verified shape, §3)."""
    items = [{
        "CreateTime": _date(DATE),
        "AdTitle": random.choice(_AD_TITLES),
        "AdLink": _ad_link(),
    } for _ in range(count)]
    return _sorted_desc(items)


def login_history(count):
    """Your Activity → Login History: high-signal tracking fields (§1.8)."""
    items = []
    for _ in range(count):
        model, system = random.choice(_DEVICES)
        items.append({
            "Date": _date(DATE),
            "IP": _ip(),
            "DeviceModel": model,
            "DeviceSystem": system,
            "NetworkType": random.choice(("WIFI", "4G", "5G", "Cellular")),
            "Carrier": random.choice(_CARRIERS),  # "" frequent
        })
    return _sorted_desc(items)


def statuses(count):
    """Your Activity → Status → Status List: device/ad identifiers (§1.8)."""
    items = []
    for _ in range(count):
        # GAID / Android ID / Web ID often "" (iOS-dominant account), §1.8.
        gaid = "" if random.random() < 0.85 else _uuid_like(upper=False)
        android_id = "" if random.random() < 0.85 else "".join(
            random.choice(_HEX) for _ in range(16))
        web_id = "" if random.random() < 0.7 else _opaque_id(19)
        items.append({
            "Resolution": random.choice(_RESOLUTIONS),
            "App Version": random.choice(_APP_VERSIONS),
            "IDFA": _uuid_like(upper=True),
            "GAID": gaid,
            "Android ID": android_id,
            "IDFV": _uuid_like(upper=True),
            "UID": random.randint(10 ** 8, 10 ** 10),
            "DID": _opaque_id(19),
            "Web ID": web_id,
        })
    return items


# ===========================================================================
#  Map / object populators — fixed keys known from the contract
# ===========================================================================
def watch_live_history(count):
    """TikTok Live → Watch Live History → WatchLiveMap: opaque-key map (§1.5)."""
    out = {}
    while len(out) < count:
        out[_opaque_id(19)] = {
            "Comments": [{
                "CommentTime": _date(DATE),
                "CommentContent": random.choice(_COMMENT_TEXTS),
                "RawTime": int(_dt().timestamp()),
            } for _ in range(random.randint(0, 3))],
            "Questions": None,
            "WatchTime": _date(DATE),
            "Link": _live_url(_username()),
        }
    return out


def profile_info(count, persona=None):
    """Profile And Settings → Profile Info → ProfileMap: high-signal PII, ALL FAKE (§1.8).

    Identity drawn from the `persona` if provided, otherwise random. Content values
    synthesized (region, @example.com email, handle…); sentinels `"N/A"` / `"None"`
    reproduced where §4 fixes them; cross-platform links left `""` (not filled in
    at the source).
    """
    if persona is not None:
        username = persona.user_name
        display = persona.display_name
        region = persona.region
        bio = persona.bio
        birth = persona.birth_date
        followers = persona.follower_count
        followings = persona.following_count
    else:
        username = _username()
        display = "{} {}".format(
            random.choice(_DISPLAY_FIRST), random.choice(_DISPLAY_LAST))
        region = random.choice(_REGIONS)
        bio = random.choice(_BIOS)
        birth = datetime(random.randint(1991, 2006), random.randint(1, 12),
                         random.randint(1, 28)).strftime("%Y-%m-%d")
        followers = random.randint(12, 4800)
        followings = random.randint(30, 900)
    return {
        "PlatformInfo": [{
            "Description": "",
            "Name": display,
            "Platform": "TikTok",
            "Profile Photo": _photo_url(),
        }],
        "accountRegion": region,
        "aiSelf": "auto-generated persona summary; values are synthetic and "
                  "do not describe a real person",
        "bioDescription": bio,
        "birthDate": birth,
        "displayName": display,
        "emailAddress": f"{username}@example.com",
        "followerCount": followers,
        "followingCount": followings,
        "fundraiser": "N/A",
        "inferredGender": "None",
        "instagramLink": "",
        "lemon8Link": "",
        "likesReceived": "None",
        "profilePhoto": _photo_url(),
        "profileVideo": "None",
        "telephoneNumber": "None",
        "userName": username,
        "youtubeLink": "",
    }


def settings_map(count):
    """Profile And Settings → Settings → SettingsMap: 25 keys, §4 order, MALFORMED key (§1.7)."""
    return {
        "Allow DownLoad": "On",
        "Allow Others to Find Me": "On",
        "Allow Reuse of Content": "Off",
        "App Language": "en",
        "Autofill contact information": "Off",
        "Autofill payment information": "Off",
        "Content Preferences": {
            "Keyword filters for videos in Following feed": [],
            "Keyword filters for videos in For You feed": [],
            "Video Languages Preferences": [],
        },
        "Family Content Preferences": {},
        "FamilyPairing": [],  # empty list: no family pairing (ambiguous §4 shape)
        "Filter Comments": "Off",
        "Interests": "On",
        "Personalized Ads": "Off",  # ads disabled at the source (§3)
        "Private Account": "Off",
        "Push Notification": {
            "Desktop notification": "Off",
            "New Comments on My Video": "On",
            "New Fans": "On",
            "New Likes on My Video": "On",
        },
        "ScreenTime": [{
            "DailyScreenTimeLimit": "N/A",
            "DailyScreenTimeToggleStatus": "Off",
            "SleepHoursDuration": "N/A",
            "SleepHoursToggleStatus": "Off",
            "WeeklyScreenTimeUpdatesToggleStatus": "Off",
        }],
        "Suggest your account to Facebook friends": "Off",
        "Suggest your account to contacts": "Off",
        "Suggest your account to people who open or send links to you": "Off",
        "Web Language": "N/A",
        "Who Can Duet With Me": "Everyone",
        "Who Can Post Comments": "Everyone",
        "Who Can Send Me Message": "Friends",
        "Who Can Stitch with your videos": "Everyone",
        "Who Can View Videos I Liked": "Only me",
        "Who can see your following list::": "Everyone",  # verbatim malformed key (§1.7)
    }


def activity_summary(count):
    """Your Activity → Activity Summary → ActivitySummaryMap: {note, 3×int}."""
    return {
        "note": "Counts are estimates and may not be exact.",
        "videosCommentedOnSinceAccountRegistration": random.randint(20, 200),
        "videosSharedSinceAccountRegistration": random.randint(10, 120),
        "videosWatchedToTheEndSinceAccountRegistration": random.randint(2000, 12000),
    }


def tako_chat_history(count):
    """Direct Message → Tako Chat History → TakoChatHistoryList: Messages[].Date in UTC (§1.1).

    `Content` is an object whose shape is undocumented in the contract: left `{}` rather
    than inventing keys.
    """
    items = []
    for _ in range(count):
        items.append({
            "Chat Title": "Tako",
            "Messages": [
                {"Date": _date(DATE_UTC), "Content": {}}
                for _ in range(random.randint(1, 3))
            ],
        })
    return items


# Wiring by path (tuple of keys from the JSON root) — VERIFIED sections.
DEFAULT_POPULATORS = {
    ("Comment", "Comments"): comments,
    ("Direct Message", "Tako Chat History"): tako_chat_history,
    ("Income+ Wallet", "Coin Purchase History"): coin_purchases,
    ("Likes and Favorites", "Favorite Collection"): favorite_collections,
    ("Likes and Favorites", "Favorite Effects"): favorite_effects,
    ("Likes and Favorites", "Favorite Sounds"): favorite_sounds,
    ("Likes and Favorites", "Favorite Videos"): favorite_videos,
    ("Likes and Favorites", "Like List"): like_list,
    ("Profile And Settings", "Following"): following,
    ("Profile And Settings", "Profile Info"): profile_info,
    ("Profile And Settings", "Settings"): settings_map,
    ("TikTok Live", "Watch Live History"): watch_live_history,
    ("Your Activity", "Activity Summary"): activity_summary,
    ("Your Activity", "Ads Visit History"): ads_visit_history,
    ("Your Activity", "Login History"): login_history,
    ("Your Activity", "Reposts"): reposts,
    ("Your Activity", "Searches"): searches,
    ("Your Activity", "Status"): statuses,
    ("Your Activity", "Watch History"): watch_history,
}
