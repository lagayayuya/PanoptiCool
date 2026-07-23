"""Structural registry — the shape oracle of the fake TikTok export.

This module **describes the structure** derived from `docs/tiktok-export-schema.md`
and **nothing else**: it fabricates no value (the synthetic population lives in
``populators.py``). Every shape here must be justified by a line of the contract; we
invent neither field nor category.

Model — the registry is a tree of `dict` (= object
containers) whose leaves are:

* `Section`     — a data location: an object wrapper holding a list
                  (`LIST`) or a map (`MAP`) under a key, plus optional
                  metadata *siblings* (`App`, `IsFastLane`).
* `DirectEmpty` — a subsection that **directly** equals an empty encoding
                  (`{}` / `[]` / `null`), without a wrapper.
* `Scalar`      — a leaf scalar field (sentinel `""`, `"N/A"`, `"None"`, …).

Each `Section` carries the attributes required by PANO-11: container type,
list key, item-key case (§1.3), empty encoding (§1.2), siblings (§1.4),
and the applicable date format (§1.1). The *path* is not stored: it follows from
the position in the tree and is recovered via `enumerate_sections()`.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

# --- Coexisting date formats (§1.1) -----------------------------------------
# strftime strings, directly consumable by the populators.
DATE = "%Y-%m-%d %H:%M:%S"
DATE_UTC = "%Y-%m-%d %H:%M:%S UTC"  # CommentsList[].date, Tako Chat History


# --- Empty encodings (§1.2) --------------------------------------------------
class Empty(Enum):
    """The three empty encodings, not interchangeable, fixed per section."""

    NULL = "null"
    LIST = "[]"
    OBJECT = "{}"

    def render(self):
        return {Empty.NULL: None, Empty.LIST: [], Empty.OBJECT: {}}[self]


# --- Container types ---------------------------------------------------------
class Container(Enum):
    LIST = "list"  # wrapper -> {..siblings.., key: [items] | empty_encoding}
    MAP = "map"    # wrapper -> {..siblings.., key: {..} | empty_encoding}


@dataclass(frozen=True)
class Sibling:
    """Metadata neighbor of a list within its wrapper (§1.4) — synthetic value."""

    name: str
    value: object


@dataclass(frozen=True)
class Section:
    """Data location: an object wrapper holding a list or a map."""

    container: Container          # container type (LIST | MAP)
    key: str                      # key holding the list/map in the wrapper
    item_keys: tuple = ()         # exact case of the item keys (§1.3)
    date_format: str = ""         # applicable date format (§1.1), if relevant
    empty: Empty = Empty.NULL     # default empty encoding (§1.2)
    siblings: tuple = ()          # neighboring metadata (§1.4)
    key_kind: str = ""            # for MAP: "opaque_id" | "fixed_keys"
    note: str = ""                # fidelity pitfall / next-phase TODO


@dataclass(frozen=True)
class DirectEmpty:
    """Subsection equal directly to an empty encoding (without a wrapper)."""

    empty: Empty
    note: str = ""


@dataclass(frozen=True)
class Scalar:
    """Leaf scalar field — empty sentinel for the skeleton."""

    value: object = ""
    note: str = ""


# --- Synthetic sibling constants (§1.4) --------------------------------------
# `App` is an integer application identifier; constant synthetic value.
APP = Sibling("App", 1233)
FASTLANE_OFF = Sibling("IsFastLane", False)


# Reading shortcuts ----------------------------------------------------------
NULL, LIST, OBJECT = Empty.NULL, Empty.LIST, Empty.OBJECT


def _list(key, *, items=(), date=None, empty=NULL, siblings=(), note=""):
    return Section(Container.LIST, key, items, date or "", empty, siblings, "", note)


def _map(key, *, kind="fixed_keys", date=None, empty=OBJECT, siblings=(), note=""):
    return Section(Container.MAP, key, (), date or "", empty, siblings, kind, note)


# The exact 10 top-level categories, in contract order (§0).
CATEGORIES = (
    "Comment",
    "Direct Message",
    "Income+ Wallet",
    "Likes and Favorites",
    "Location Review",
    "Post",
    "Profile And Settings",
    "TikTok Live",
    "TikTok Shop",
    "Your Activity",
)


# ===========================================================================
#  REGISTRY — faithful transcription of docs/tiktok-export-schema.md §4
# ===========================================================================
REGISTRY: dict = {
    # --- Comment -----------------------------------------------------------
    "Comment": {
        "Comments": _list(
            "CommentsList",
            items=("date", "comment", "photo", "video", "sticker",
                   "originalPostUrl", "original post link"),
            date=DATE_UTC,  # CommentsList[].date is UTC-suffixed (§1.1)
            empty=NULL,
            siblings=(APP,),
            note="clés d'item minuscules (§1.3) ; date suffixée UTC (§1.1) ; "
                 "peuplé à la source (≈95)",
        ),
    },

    # --- Direct Message ----------------------------------------------------
    "Direct Message": {
        "Direct Messages": _map(
            "ChatHistory", kind="opaque_id", empty=OBJECT,
            note="encodage objet vide {} ; map de conversations",
        ),
        "Group Chat": _map(
            "GroupChat", kind="opaque_id", empty=OBJECT,
            note="encodage objet vide {}",
        ),
        "Tako Chat History": _list(
            "TakoChatHistoryList",
            items=("Chat Title", "Messages"),
            date=DATE_UTC,  # Messages[].Date UTC-suffixed (§1.1)
            empty=NULL,
            note="Messages: list of {Date[..UTC], Content:object} ; peuplé (≈1)",
        ),
    },

    # --- Income+ Wallet ----------------------------------------------------
    "Income+ Wallet": {
        "Coin Purchase History": _list(
            "CoinPurchaseHistoryList",
            items=("Date", "Type", "CoinAmount"),
            date=DATE, empty=NULL, note="peuplé (≈2)",
        ),
        "Transaction History": _list(
            "TransactionsList", date=DATE, empty=NULL,
            note="vide documenté : null",
        ),
    },

    # --- Likes and Favorites ----------------------------------------------
    "Likes and Favorites": {
        "Collection": DirectEmpty(OBJECT, note="encodage objet vide {}"),
        "Favorite Collection": _list(
            "FavoriteCollectionList",
            items=("Date", "FavoriteCollection"), date=DATE, empty=NULL,
            note="peuplé (≈4)",
        ),
        "Favorite Comment": _list(
            "FavoriteCommentList", date=DATE, empty=LIST,
            note="vide documenté : []",
        ),
        "Favorite Drama": DirectEmpty(OBJECT, note="encodage objet vide {}"),
        "Favorite Effects": _list(
            "FavoriteEffectsList",
            items=("Date", "EffectLink"), date=DATE, empty=NULL,
            note="peuplé (≈1)",
        ),
        "Favorite Hashtags": _list(
            "FavoriteHashtagList", date=DATE, empty=LIST,
            note="vide documenté : []",
        ),
        "Favorite Location": _list(
            "FavoriteLocationList", date=DATE, empty=LIST,
            note="vide documenté : []",
        ),
        "Favorite Movies and TV": _list(
            "FavoriteMoviesAndTVList", date=DATE, empty=LIST,
            note="vide documenté : []",
        ),
        "Favorite Playlists": _list(
            "FavoritePlaylistList", date=DATE, empty=LIST,
            note="vide documenté : []",
        ),
        "Favorite Sounds": _list(
            "FavoriteSoundList",
            items=("Date", "Link"), date=DATE, empty=NULL, note="peuplé (≈4)",
        ),
        "Favorite Videos": _list(
            "FavoriteVideoList",
            items=("Date", "Link"), date=DATE, empty=NULL,
            siblings=(APP,), note="peuplé (≈1843)",
        ),
        "Like List": _list(
            "ItemFavoriteList",
            items=("date", "link"),  # lowercase keys! (§1.3)
            date=DATE, empty=NULL, siblings=(APP,),
            note="clés d'item minuscules (§1.3) ; peuplé (≈3491)",
        ),
    },

    # --- Location Review ---------------------------------------------------
    "Location Review": {
        "Location Reviews": _list(
            "ReviewsList", date=DATE, empty=NULL, note="vide documenté : null",
        ),
    },

    # --- Post --------------------------------------------------------------
    "Post": {
        "Posts": _list(
            "VideoList", date=DATE, empty=NULL,
            note="vide documenté : null ; les vidéos vivent ici (§0)",
        ),
        "Recently Deleted Posts": _list(
            "PostList", date=DATE, empty=LIST, note="vide documenté : []",
        ),
        "Story": DirectEmpty(OBJECT, note="encodage objet vide {}"),
    },

    # --- Profile And Settings ---------------------------------------------
    "Profile And Settings": {
        "AI-Moji": {
            "CreateDate": Scalar(""),
            "AIMojiList": DirectEmpty(NULL, note="vide documenté : null"),
        },
        "AISelfImage": DirectEmpty(OBJECT, note="encodage objet vide {}"),
        "Autofill": {  # flat object of scalars, "N/A" when empty (§4)
            "PhoneNumber": Scalar("N/A"),
            "Email": Scalar("N/A"),
            "FirstName": Scalar("N/A"),
            "LastName": Scalar("N/A"),
            "Address": Scalar("N/A"),
            "ZipCode": Scalar("N/A"),
            "Unit": Scalar("N/A"),
            "City": Scalar("N/A"),
            "State": Scalar("N/A"),
            "Country": Scalar("N/A"),
        },
        "Block List": _list(
            "BlockList", empty=NULL, siblings=(APP,),
            note="vide documenté : null",
        ),
        "Follower": _list(
            "FansList", empty=LIST, siblings=(APP, FASTLANE_OFF),
            note="vide documenté : [] ; IsFastLane (§1.4)",
        ),
        "Following": _list(
            "Following",
            items=("Date", "UserName"), date=DATE, empty=NULL,
            siblings=(APP, FASTLANE_OFF),
            note="IsFastLane (§1.4) ; peuplé (≈147) ; PEUPLÉ par le squelette",
        ),
        # Duplicate §1.6 — also present under Your Activity.
        "Off TikTok Activity": _list(
            "OffTikTokActivityDataList", empty=NULL,
            note="DOUBLON (§1.6) ; vide documenté : null",
        ),
        "Profile Info": _map(
            "ProfileMap", kind="fixed_keys", empty=OBJECT, siblings=(APP,),
            note="map PII à fort signal (§1.8) : accountRegion, birthDate, "
                 "emailAddress, telephoneNumber, inferredGender, userName, "
                 "displayName, followerCount… + PlatformInfo(list) ; "
                 "TODO génération par section",
        ),
        "ProfileViews": _list(
            "ProfileViewList", empty=NULL, note="vide documenté : null",
        ),
        "Settings": _map(
            "SettingsMap", kind="fixed_keys", empty=OBJECT, siblings=(APP,),
            note="25 clés dont la clé MALFORMÉE "
                 "'Who can see your following list::' (§1.7) ; "
                 "Content Preferences/[]×3, Family Content Preferences/{} ; "
                 "TODO génération par section",
        ),
    },

    # --- TikTok Live -------------------------------------------------------
    "TikTok Live": {
        "Go Live History": _list(
            "GoLiveList", empty=NULL, note="vide documenté : null",
        ),
        "Go Live Settings": _map(
            "SettingsMap", kind="fixed_keys", empty=OBJECT,
            note="11 clés, surtout N/A/On ; une liste vide, un null ; "
                 "TODO génération par section",
        ),
        "Watch Live History": _map(
            "WatchLiveMap", kind="opaque_id", date=DATE, empty=OBJECT,
            note="MAP à clés opaques 19 chiffres (§1.5) ; items "
                 "{Comments[list], Questions:null, WatchTime, Link} ; ≈15 ; "
                 "TODO génération par section",
        ),
        "Watch Live Settings": {
            "WatchLiveSettingsMap": {"app": Scalar(""), "web": Scalar("")},
            "MostRecentModificationTimeInApp": Scalar(""),
            "MostRecentModificationTimeInWeb": Scalar(""),
        },
    },

    # --- TikTok Shop (all null at the source — shop unused) ----------------
    "TikTok Shop": {
        "Communication With Shops": _list(
            "CommunicationHistories", empty=NULL, note="shop inutilisé ; null"),
        "Current Payment Information": _list("PayCard", empty=NULL, note="null"),
        "Customer Support History": _list(
            "CustomerSupportHistories", empty=NULL, note="null"),
        "Order Dispute History": _list(
            "OrderDisputeHistories", empty=NULL, note="null"),
        "Order History": _list("OrderHistories", empty=NULL, note="null"),
        "Product Browsing History": _list(
            "ProductBrowsingHistories", empty=NULL, note="null"),
        "Product Reviews": _list(
            "ProductReviewHistories", empty=NULL, note="null"),
        "Returns and Refunds History": _list(
            "ReturnAndRefundHistories", empty=NULL, note="null"),
        "Saved Address Information": _list("SavedAddress", empty=NULL, note="null"),
        "Shopping Cart List": _list("ShoppingCart", empty=NULL, note="null"),
        "TikTokFavoriteItem": {  # extra nesting (§4)
            "TikTokFavoriteItemResult": _list(
                "TikTokFavoriteItemList", empty=NULL, note="null"),
        },
        "Vouchers": _list("Vouchers", empty=NULL, note="null"),
    },

    # --- Your Activity -----------------------------------------------------
    "Your Activity": {
        "Activity Summary": _map(
            "ActivitySummaryMap", kind="fixed_keys", empty=OBJECT,
            note="{note, videosCommentedOn…, videosShared…, videosWatched…:int} ; "
                 "TODO génération par section",
        ),
        "Ad Interests": {
            "AdInterestCategories": Scalar(
                "", note="§3 : '' quand vide ; forme peuplée NON VÉRIFIÉE"),
        },
        "Ads Visit History": _list(
            "AdsVisitHistoryList",
            items=("CreateTime", "AdTitle", "AdLink"), date=DATE, empty=NULL,
            note="forme vérifiée (§1.8) ; peuplé (≈2) ; AdLink = URL de tracking",
        ),
        "Donation": _list("DonationList", empty=NULL, note="null"),
        "Fundraiser": _list("FundraiserList", empty=NULL, note="null"),
        "Hashtag": _list("HashtagList", empty=NULL, note="null"),
        "Instant Form Ads Responses": _list(
            "ResponsesList", empty=NULL,
            note="§3 : NON VÉRIFIÉ si peuplé ; null"),
        "Login History": _list(
            "LoginHistoryList",
            items=("Date", "IP", "DeviceModel", "DeviceSystem",
                   "NetworkType", "Carrier"),
            date=DATE, empty=NULL,
            note="champs de tracking à fort signal (§1.8) ; ≈345",
        ),
        "Mini Drama Watch History": DirectEmpty(
            OBJECT, note="encodage objet vide {}"),
        # Duplicate §1.6 — also present under Profile And Settings.
        "Off TikTok Activity": _list(
            "OffTikTokActivityDataList", empty=NULL,
            note="DOUBLON (§1.6) ; null"),
        "Purchases": {
            "SendGifts": _list("SendGifts", empty=NULL, note="null"),
            "BuyGifts": _list("BuyGifts", empty=NULL, note="null"),
        },
        "Reposts": _list(
            "RepostList", items=("Date", "Link"), date=DATE, empty=NULL,
            note="peuplé (≈12)"),
        "Searches": _list(
            "SearchList",
            items=("Date", "SearchTerm"), date=DATE, empty=NULL,
            note="≈134 ; PEUPLÉ par le squelette"),
        "Share History": _list("ShareHistoryList", empty=NULL, note="null"),
        "Status": _list(
            "Status List",  # list key with a space
            items=("Resolution", "App Version", "IDFA", "GAID", "Android ID",
                   "IDFV", "UID", "DID", "Web ID"),
            empty=NULL,
            note="identifiants device/publicité (§1.8) ; ≈37"),
        "Stickers": _list("StickerList", empty=NULL, note="null"),
        "Watch History": _list(
            "VideoList",
            items=("Date", "Link", "Title"), date=DATE, empty=NULL,
            note="section la plus volumineuse, pilote --volume ; ≈9339"),
    },
}


# --- Guard-rail: exactly the 10 categories of the contract (§0) -------------
assert tuple(REGISTRY.keys()) == CATEGORIES, (
    "Le registre doit refléter exactement les 10 catégories top-level du contrat."
)


# --- Flat enumeration of the sections (path + descriptor) -------------------
_LEAF = (Section, DirectEmpty, Scalar)


def enumerate_sections(node=REGISTRY, path=()):
    """Walks the tree and emits ``(path, descriptor)`` for each leaf.

    The *path* is the tuple of keys from the JSON root. This is the "enumerated"
    form of the registry required by PANO-11: each section with its
    path, its container type, its list key, the case of its item keys,
    and its empty encoding.
    """
    if isinstance(node, dict):
        for key, child in node.items():
            yield from enumerate_sections(child, path + (key,))
    elif isinstance(node, _LEAF):
        yield path, node
