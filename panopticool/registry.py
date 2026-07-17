"""Registre structurel — l'oracle de forme du faux export TikTok.

Ce module **décrit la structure** dérivée de `docs/tiktok-export-schema.md` et
**rien d'autre** : il ne fabrique aucune valeur (la population synthétique vit dans
``populators.py``). Toute forme ici doit se justifier par une ligne du contrat ; on
n'invente ni champ ni catégorie.

Modèle — le registre est un arbre de `dict` (= conteneurs
objet) dont les feuilles sont :

* `Section`     — un emplacement de données : un wrapper objet portant une liste
                  (`LIST`) ou une map (`MAP`) sous une clé, plus d'éventuels
                  *siblings* de métadonnées (`App`, `IsFastLane`).
* `DirectEmpty` — une sous-section qui vaut **directement** un encodage du vide
                  (`{}` / `[]` / `null`), sans wrapper.
* `Scalar`      — un champ scalaire feuille (sentinelle `""`, `"N/A"`, `"None"`, …).

Chaque `Section` porte les attributs demandés par PANO-11 : type de conteneur,
clé de liste, casse des clés d'item (§1.3), encodage du vide (§1.2), siblings (§1.4),
et le format de date applicable (§1.1). Le *chemin* n'est pas stocké : il découle de
la position dans l'arbre et se récupère via `enumerate_sections()`.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum

# --- Formats de date coexistants (§1.1) -------------------------------------
# Chaînes strftime, directement consommables par les populators.
DATE = "%Y-%m-%d %H:%M:%S"
DATE_UTC = "%Y-%m-%d %H:%M:%S UTC"  # CommentsList[].date, Tako Chat History


# --- Encodages du vide (§1.2) ------------------------------------------------
class Empty(Enum):
    """Les trois encodages du vide, non interchangeables, fixés par section."""

    NULL = "null"
    LIST = "[]"
    OBJECT = "{}"

    def render(self):
        return {Empty.NULL: None, Empty.LIST: [], Empty.OBJECT: {}}[self]


# --- Types de conteneur ------------------------------------------------------
class Container(Enum):
    LIST = "list"  # wrapper -> {..siblings.., key: [items] | encodage_vide}
    MAP = "map"    # wrapper -> {..siblings.., key: {..} | encodage_vide}


@dataclass(frozen=True)
class Sibling:
    """Métadonnée voisine d'une liste dans son wrapper (§1.4) — valeur synthétique."""

    name: str
    value: object


@dataclass(frozen=True)
class Section:
    """Emplacement de données : un wrapper objet portant une liste ou une map."""

    container: Container          # type de conteneur (LIST | MAP)
    key: str                      # clé portant la liste/map dans le wrapper
    item_keys: tuple = ()         # casse exacte des clés d'item (§1.3)
    date_format: str = ""         # format de date applicable (§1.1), si pertinent
    empty: Empty = Empty.NULL     # encodage du vide par défaut (§1.2)
    siblings: tuple = ()          # métadonnées voisines (§1.4)
    key_kind: str = ""            # pour MAP : "opaque_id" | "fixed_keys"
    note: str = ""                # piège de fidélité / TODO de phase suivante


@dataclass(frozen=True)
class DirectEmpty:
    """Sous-section valant directement un encodage du vide (sans wrapper)."""

    empty: Empty
    note: str = ""


@dataclass(frozen=True)
class Scalar:
    """Champ scalaire feuille — sentinelle de vide pour le squelette."""

    value: object = ""
    note: str = ""


# --- Constantes de siblings synthétiques (§1.4) ------------------------------
# `App` est un identifiant applicatif entier ; valeur synthétique constante.
APP = Sibling("App", 1233)
FASTLANE_OFF = Sibling("IsFastLane", False)


# Raccourcis de lecture ------------------------------------------------------
NULL, LIST, OBJECT = Empty.NULL, Empty.LIST, Empty.OBJECT


def _list(key, *, items=(), date=None, empty=NULL, siblings=(), note=""):
    return Section(Container.LIST, key, items, date or "", empty, siblings, "", note)


def _map(key, *, kind="fixed_keys", date=None, empty=OBJECT, siblings=(), note=""):
    return Section(Container.MAP, key, (), date or "", empty, siblings, kind, note)


# Les 10 catégories top-level exactes, dans l'ordre du contrat (§0).
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
#  REGISTRE — transcription fidèle de docs/tiktok-export-schema.md §4
# ===========================================================================
REGISTRY: dict = {
    # --- Comment -----------------------------------------------------------
    "Comment": {
        "Comments": _list(
            "CommentsList",
            items=("date", "comment", "photo", "video", "sticker",
                   "originalPostUrl", "original post link"),
            date=DATE_UTC,  # CommentsList[].date est suffixé UTC (§1.1)
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
            date=DATE_UTC,  # Messages[].Date suffixé UTC (§1.1)
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
            items=("date", "link"),  # clés minuscules ! (§1.3)
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
        "Autofill": {  # objet plat de scalaires, "N/A" quand vide (§4)
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
        # Doublon §1.6 — présent aussi sous Your Activity.
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

    # --- TikTok Shop (tout null à la source — shop inutilisé) --------------
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
        "TikTokFavoriteItem": {  # imbrication supplémentaire (§4)
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
        # Doublon §1.6 — présent aussi sous Profile And Settings.
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
            "Status List",  # clé de liste avec espace
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


# --- Garde-fou : exactement les 10 catégories du contrat (§0) ---------------
assert tuple(REGISTRY.keys()) == CATEGORIES, (
    "Le registre doit refléter exactement les 10 catégories top-level du contrat."
)


# --- Énumération à plat des sections (chemin + descripteur) -----------------
_LEAF = (Section, DirectEmpty, Scalar)


def enumerate_sections(node=REGISTRY, path=()):
    """Parcourt l'arbre et émet ``(chemin, descripteur)`` pour chaque feuille.

    Le *chemin* est le tuple de clés depuis la racine JSON. C'est la forme
    « énumérée » du registre demandée par PANO-11 : chaque section avec son
    chemin, son type de conteneur, sa clé de liste, la casse de ses clés d'item
    et son encodage du vide.
    """
    if isinstance(node, dict):
        for key, child in node.items():
            yield from enumerate_sections(child, path + (key,))
    elif isinstance(node, _LEAF):
        yield path, node
