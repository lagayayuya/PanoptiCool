# "How much is your data worth" reference table — PROPOSAL, NOT RATIFIED

> **⚠ STATUS: A PROPOSAL. NOTHING RENDERS FROM IT.** yuya reviews, corrects, decides.
>
> The status is **enforced in code**, not left to memory: `web/src/engine/instagram/value-table.ts`
> exports `VALUE_TABLE_RATIFIED = false`, and `runValue` returns `null` while it is — so the value
> module produces nothing at all rather than an empty report, because an empty report renders as
> "your data is worth nothing", which is a claim and a false one.
>
> Ratifying means: reading this document line by line, then flipping that one constant. Both halves,
> or neither.
>
> **Principle**: three **distinct** registers (they don't add up — they answer three
> different questions), each with its method, its dated sources and its confidence level.
> Always **ranges**, never a single figure. Static embedded table, deterministic
> recomputation, zero network call.
>
> Research carried out on 2026-07-15.

---

## Framing warning (to be displayed in the module)

These amounts don't say "what you're worth". They say **what the data market charges
for someone like you**. Systemic register — mirror, not oracle. Three honest clarifications:

1. ARPU is **revenue**, not profit, and it covers **all of Meta** (Facebook +
   Instagram + WhatsApp), not Instagram alone.
2. Data broker prices are **catalog prices for aggregated profiles**, not "your dossier" sold as-is.
3. Black-market prices are **observed listing prices**, with high variance and resale data
   that is often stale.

---

## Register 1 — Advertising value: what you have earned Meta

**Deterministic method**: Σ (year's Europe ARPU × fraction of the year the account existed),
from the account's creation year to today. **Not** "current ARPU × number of years" —
ARPU was multiplied by ~6 over the period, this would be off by a factor of 2 to 3.

### Europe ARPU table (annual, in $)

| Year | Europe ARPU | Confidence | Source |
|---|---|---|---|
| 2014 | 11.60 | **confirmed** | Meta reporting (regional series) |
| 2015 | ~14.5 | *interpolated* | between the 2014 and 2017 anchors |
| 2016 | ~19.5 | *interpolated* | between the 2014 and 2017 anchors |
| 2017 | 26.80 | **confirmed** | Meta reporting (CAGR >35% since 2014) |
| 2018 | ~36 | *interpolated* | between the 2017 and 2019 anchors |
| 2019 | 44.14 | **confirmed** | +20.3% YoY, historical record |
| 2020 | ~50 | *derived* | +15% Europe announced |
| 2021 | ~68 | *derived* | +35% Europe announced |
| 2022 | ~58 | *derived* | post-ATT decline; Q4 2022 = $17.29 |
| 2023 | ~72 | *derived* | **Q4 2023 = $23.14 (confirmed)**, annualized |
| 2024 | ~83 | *extrapolated* | Meta **stops** publishing regional ARPU after 2023 |
| 2025 | ~95 | *extrapolated* | via global ARPP growth ($57.03 in 2025, +$7.4 vs 2024) |

**Control benchmark**: Meta's Europe revenue = **$46.6B in 2025** (23.2% of global revenue).

**Result for Yul's export** (account created **2014-05-23**, ~12.1 years):
**≈ $550 – 650** of cumulative advertising revenue, i.e. **≈ €510 – 600**.

**Fork no. 1**: display the wide range ($550-650) or only the **confirmed** years
(2014, 2017, 2019, 2023 → a very defensible but less striking floor)?

---

## Register 2 — Data broker value: what you're worth at legal resale

**Method**: catalog price per profile, modulated by the categories actually present in
the export. No temporal sum — it's a **stock** price, not a flow.

| Element | Range | Confidence | Source / note |
|---|---|---|---|
| Profile packaged by a broker | **$0.50 – 200** | solid | most cited market range |
| Annual value per person (depending on buyer) | **$0.10 – 1,200/yr** | wide | depends entirely on the buyer's sector |
| Raw data per person, 18-25 y.o. | ~$0.36 | solid | most expensive segment |
| Raw data per person, 55+ y.o. | ~$0.05 | solid | cheapest segment |
| Value generated / internet user / year (ad industry) | **~$240 – 263/yr** | indicative | macro order of magnitude |
| Size of the data broker market | $278B (2024) → $512B (2033) | solid | context, not an individual price |

**Modulation by completeness** (deterministic, from the inventory): the price rises with the number of
categories present. In Yul's export: civil identity ✔ · postal address ✔ · phone ✔ ·
social graph ✔ · geolocation ✔ · consumption history ✔ · health ✘ · finances ✘.
**6 categories out of 8 → top of the range.**

**Proposed result**: **≈ $15 – 60** for the packaged profile (top of the $0.50-200 range
given the completeness), with the note "i.e. $0.10 to 1,200/yr depending on the buyer".

**Fork no. 2**: keep the "$240-263/yr of value generated" line? It's spectacular but
it's a US macro average, not a resale price — risk of confusion with register 1.

---

## Register 3 — Black-market value: what you're worth stolen

**Method**: listing prices observed on marketplaces, per data type. Sources
consolidated August 2025 (dark web monitoring + Trustwave, SOCRadar, Privacy Affairs).

| Element | Observed price | Confidence | Note |
|---|---|---|---|
| Stolen **Instagram account** | ~**$12** | solid | low price: account age raises the value |
| Stolen Facebook account | **$45 – 50** | solid | 40% of stolen accounts sold; gives access to the linked IG |
| Gmail account | **$60 – 65** | solid | the most expensive of the communication accounts |
| **"Fullz"** (complete identity) | **$20 – 100** | solid | ~$37 median, price collapsed by oversupply |
| Passport scan | ~**$100** | solid | |
| Driver's license scan | **$70 – 165** | solid | |
| Bank card (with CVV) | **$10 – 40** | solid | *not present in the export* |

**What applies to Yul's export**: Instagram account (~$12) + partial fullz — the export
contains name, postal address, phone, email, date of birth, i.e. the essentials of a fullz
**without the social security number** (a US specificity, absent here).

**Proposed result**: **≈ $30 – 110**, phrased as "what your dossier would cost a
buyer", with the nuance that the account age (12 years) places it at the **top of the range**
— old accounts pass anti-fraud filters, that's explicitly what sets the price.

**Fork no. 3**: this register is the most striking but the most delicate. Three options:
(a) displayed like the other two · (b) behind a "learn more" · (c) set aside.
*My opinion: (a), but without the bank-card/SSN lines absent from the export — show only what
actually concerns you, otherwise we tip into generic fear.*

---

## Proposed synthesis for the screen

```
┌ Your dossier, at market price ──────────────────────────────┐
│  What you have earned Meta           ≈ €510 – 600          │
│  in 12 years of advertising          (Σ Europe ARPU 2014→2026)│
│                                                              │
│  Your profile at a broker            ≈ $15 – 60            │
│  6 categories out of 8 present       (catalog price)         │
│                                                              │
│  Your dossier stolen                 ≈ $30 – 110           │
│  12-year account + identity          (observed listings)     │
├──────────────────────────────────────────────────────────────┤
│  These three amounts do not add up: they answer             │
│  three different questions. Sources and method ▸            │
└──────────────────────────────────────────────────────────────┘
```

Each expandable line → method + sources + date + confidence level.

---

## What I recommend settling

1. **Fork 1** — wide range ($550-650) or floor of the confirmed years only?
2. **Fork 2** — keep the "$240-263/yr" macro line in register 2?
3. **Fork 3** — black-market register: displayed / collapsed / set aside?
4. **Currency** — everything in € (conversion ~0.92) or keep the sources' $ with the conversion displayed?
5. **Expiry** — display "reference table dated 2026-07-15" and plan for its revision?

## Sources

- [Meta ARPU 2025 — Statista](https://www.statista.com/statistics/234056/facebooks-average-advertising-revenue-per-user/)
- [Meta Earnings Presentation Q4 2025](https://s21.q4cdn.com/399680738/files/doc_financials/2025/q4/Earnings-Presentation-Q4-2025-FINAL.pdf)
- [Meta ARPP — StockDividendScreener](https://stockdividendscreener.com/information-technology/meta/meta-family-average-revenue-per-person/)
- [Meta revenue by region — StockDividendScreener](https://stockdividendscreener.com/information-technology/meta/meta-revenue-breakdown-by-region-and-user-geography/)
- [Facebook ARPU by region — Statista](https://www.statista.com/statistics/251328/facebooks-average-revenue-per-user-by-region/)
- [Facebook ARPU by region by year — Dazeinfo](https://dazeinfo.com/2020/04/17/facebook-arpu-by-region-by-year-graphfarm/)
- [Dark Web Data Pricing 2025 — DeepStrike](https://deepstrike.io/blog/dark-web-data-pricing-2025)
- [Dark Web Price Index — PrivacySharks](https://www.privacysharks.com/dark-web-price-index/)
- [Research on dark web market prices — NordVPN](https://nordvpn.com/research-lab/dark-web-market/)
- [Hacked social accounts, Whizcase study — DarkReading](https://www.darkreading.com/cyberattacks-data-breaches/how-6-can-buy-hacked-social-media-streaming-accounts-from-the-dark-web-whizcase-study-reveals)
- [How Much Is Your Personal Data Worth 2026 — Lunyb](https://lunyb.com/blog/how-much-is-your-personal-data-worth-2026-mr8w71iy)
- [What your data is actually worth — Datapods](https://www.datapods.app/en-US/blog/what-your-data-is-actually-worth)
- [Data Broker Market Report — Grand View Research](https://www.grandviewresearch.com/industry-analysis/data-broker-market-report)
