# Google Retargeting Checklist — josetherealtor.com

Step-by-step guide for the manual work in GTM, GA4, and Google Ads. The code
side (attribution capture, admin-page tag blocking, CSP, Enhanced Conversions
data layer) is already built into the site — this doc is what YOU do in the
Google UIs. Work top to bottom; each phase gates the next.

**Accounts:**
- GTM container: `GTM-53SVHBKB` (www.JoseTheRealtor.com)
- Google Ads tag: `AW-17877884469`
- GA4 property: "JTR - Realtor Website"

---

## Phase 0 — Account triage (do first, ~10 minutes)

- [ ] **Fix the payment method.** Google Ads → the red banner "Your ads aren't
      running" → **Fix it** → verify/re-enter the payment method. Nothing
      serves until this is done.
- [ ] **Demote the pageview "conversion".** Google Ads → Goals → Conversions →
      find the action fired by the GTM tag "JTR - Goal Page Visitors" (it
      counts every pageview as a conversion — that's why "All converters" ≈
      all visitors). Set it to **Secondary** (or remove it). Do NOT leave it
      Primary or Smart Bidding will optimize toward pageviews.

## Phase 1 — Deploy the site changes

- [ ] Deploy the code changes (CSP, admin-page tag blocking, attribution
      capture, `user_data` on `form_success`). Everything below depends on
      the deployed site.

## Phase 2 — GTM container (one workspace, one publish)

Keep the existing **Google Analytics** tag, **Google Tag AW-17877884469**, and
**Conversion Linker** — they're correct. In workspace:

- [ ] **Pause "JTR - Goal Page Visitors"** (Tags → open it → ⋮ → Pause). Its
      replacement is step 6 below.
- [ ] **Variables — create Data Layer Variables** (Variables → New → Data
      Layer Variable), all Version 2:
  - `dlv - form_name` → variable name `form_name`
  - `dlv - service_type` → variable name `service_type`
  - `dlv - user_data` → variable name `user_data`
- [ ] **Variable — User-Provided Data** (for Enhanced Conversions):
      Variables → New → **User-Provided Data** → Type: *Data Layer* →
      Data Layer Variable Name: `user_data`. Name it `UPD - form user data`.
- [ ] **Triggers — Custom Event** (Triggers → New → Custom Event):
  - `CE - form_success (contact)` — Event name `form_success`, fire on Some
    Custom Events where `dlv - form_name` equals `contact_form`
  - `CE - form_success (valuation)` — Event name `form_success`, where
    `dlv - form_name` equals `valuation_form`
  - `CE - form_success (all)` — Event name `form_success`, All Custom Events
- [ ] **Tag — GA4 event**: Tags → New → Google Analytics: GA4 Event →
      Measurement ID: (same as the existing Google Analytics tag) → Event
      name `form_success` → Event parameters: `form_name` = `{{dlv - form_name}}`,
      `service_type` = `{{dlv - service_type}}` → Trigger: `CE - form_success (all)`.
- [ ] **Conversion actions in Google Ads first** (needed for the tags below):
      Google Ads → Goals → Conversions → New conversion action → Website →
      enter site → create **manually**, two actions:
  - "Lead — Contact Form" — Category: *Submit lead form*, Value: none (or a
    flat value if you want ROAS math later), Count: One, Click-through
    window: 90 days, **Enhanced conversions: ON**. One action covers ALL
    service types (Contact Us / Sell My House / General Inquiry) — they all
    fire the same `form_success` event; the split lives in GA4's
    `service_type` param.
  - "Lead — Home Valuation" — same settings
  - "Phone Call Click" — Category: *Phone call lead*, Count: One, Enhanced
    conversions OFF (a tap carries no user data). Primary, but demote to
    Secondary if accidental mobile taps inflate it.
  - Copy each action's **Conversion ID + Label** (Tag setup → "Use Google
    Tag Manager").
  - "Consultation Booked" — Category: *Book appointment*, **Primary**,
    Count One, click-through 90d, Enhanced conversions OFF. Requires the
    GHL redirect below — without it this action never fires.
- [ ] **Tags — 2× Google Ads Conversion Tracking**:
  - "GAds Conversion — Contact Form": Conversion ID `AW-17877884469` +
    contact Label → check **Include user-provided data** → select
    `UPD - form user data` → Trigger: `CE - form_success (contact)`
  - "GAds Conversion — Valuation": same, valuation Label, trigger
    `CE - form_success (valuation)`
- [ ] **Consultation Booked tracking** (booking iframe made visible via a
      same-origin confirmation page):
  - **GHL first**: Calendars → calendar `tuC1rqAOzPTThWUC7rvS` →
    settings → Confirmation/Customizations → set the custom **Thank You /
    redirect URL** to `https://www.josetherealtor.com/booking-confirmed`.
    After booking, the widget redirects (inside its iframe) to that page on
    OUR domain — where GTM runs and cookies/attribution carry over. If your
    GHL plan has no redirect setting, stop and tell Claude (fallback:
    appointment webhook → server-side conversion).
  - Trigger `PV - booking confirmed`: Page View → Some Page Views →
    Page Path equals `/booking-confirmed`
  - Tag "GAds Conversion — Consultation Booked": Conversion ID + booked
    Label → trigger `PV - booking confirmed`
  - Optional GA4 event tag on the same trigger: event `consultation_booked`
- [ ] **Phone click tracking** (no site code needed — every phone button uses
      a `tel:` link, including the (908) mailer tracking line):
  - Variables → Configure built-ins → enable **Click URL**
  - Trigger `Click - tel link`: Click – Just Links → Some Link Clicks →
    Click URL contains `tel:`
  - Tag "GAds Conversion — Phone Click": Conversion ID + Phone label →
    trigger `Click - tel link`
  - Optional GA4 event tag on the same trigger: event `phone_call_click`,
    param `link_url` = `{{Click URL}}` → shows 973 (site) vs 908 (mailer)
    call splits in GA4
- [ ] **Preview** (GTM Preview → connect to www.josetherealtor.com): submit a
      test on /contact and on the valuation form → verify both conversion
      tags + the GA4 event tag fire on `form_success`; click a phone button →
      phone tag fires; and the paused tag doesn't fire anywhere.
- [ ] **Publish** as version **"Form conversions + EC; pause pageview goal"**
      with notes listing what changed. (Convention: every publish gets a
      descriptive name + notes — see Appendix.)

## Phase 3 — GA4 + Google Ads console

- [ ] GA4 → Admin → Product links → confirm the **Google Ads link** exists
      (create it if not).
- [ ] GA4 → Admin → Events → mark `form_success` as a **Key event**
      (reporting only — bidding uses the GTM conversion tags; don't ALSO
      import it into Ads or you'll double-count).
- [ ] Google Ads → Goals → Conversions → confirm the two new Lead actions are
      **Primary** and the old pageview action is Secondary/removed.
- [ ] GA4 → Admin → Data streams → web stream → Configure tag settings →
      **Define internal traffic** → add your home/office IP; then Admin →
      Data settings → Data filters → activate the internal-traffic filter.
      (The site already blocks all tags on /admin pages after deploy.)
- [ ] **Verify the PII fix**: after deploy, browse /admin/leads and confirm
      those page titles no longer appear in GA4 Realtime.

### Audiences — create all now, they fill while you wait

Google Ads → Tools → Shared library → Audience manager → + → Website visitors.
Display needs ~100 active members before a list can serve; create them now so
they accumulate. Membership duration 540 days for all.

- [ ] **All Visitors — 540d** — Visitors of a page: URL contains `josetherealtor.com`
- [ ] **Probate / Inherited** — URL contains `inherited-property` (covers the
      pillar page, every `/inherited-property-{town}-nj` page, and the blog
      guide URLs)
- [ ] **Pre-Foreclosure** — visitors matching any of: URL contains
      `foreclosure`, `sheriff-sale`, `lis-pendens`, `short-sale`
- [ ] **High Intent** — URL contains `/contact` OR `/inherited-property-new-jersey`
      (the valuation form lives on that pillar)
- [ ] **Postcard QR** — URL contains `/mailer/`
- [ ] Optional GA4 mirror audiences (GA4 → Admin → Audiences) if you want the
      same lists usable in GA4 reports.

⚠️ **Policy note:** probate and foreclosure audiences touch Google's
personalized-ads *sensitive categories* (financial/personal hardship). Ads to
these lists must be educational and generic — "Know Your Options When Selling
an Inherited Home" ✅, "Facing Foreclosure?" ❌. Never imply you know the
viewer's situation. If a disapproval cites personalized-ads policy, soften the
creative before appealing.

### Direct-mail QR attribution (Thanks.io UI, ~10 min)

Add UTMs to each mail template's QR URL, keeping every existing param
(`cid`, `addr`, `city`, `name`, `zest`, `msg`). The `msg` param still swaps
the hero; `utm_content` mirrors it so GA4/DynamoDB/GHL all see the exact
piece:

```
...&msg=breakup&utm_source=thanksio&utm_medium=direct-mail&utm_campaign=probate-3touch&utm_content=breakup
```

- [ ] Breakup letter (#593401): `&utm_content=breakup`
- [ ] Standard postcard (#593400): `&utm_content=standard`
- [ ] Borrero intro letter (#592411): `&utm_content=intro`
- [ ] Monthly update (#593396): `&utm_content=update` (+ its own
      `utm_campaign=monthly-update`)

Payoff: a scan → booked appointment now attributes to the exact mail piece
(the site stores utm_* per lead and the booking conversion fires on the
same-origin confirmation page with attribution intact).

## Phase 4 — Launch (gated: wait until All Visitors ≥ ~100 members)

Check size in Audience manager ("Size: Display" column must clear "Too small
to serve").

- [ ] **One campaign only**: New campaign → objective *Leads* → **Display** →
      NJ locations (people IN the location, not "interested in") →
      $5/day → bidding: Clicks to start (switch to Conversions after ~15-30
      recorded conversions) → Audience segment: **All Visitors — 540d** →
      turn **optimized targeting OFF** (otherwise Google expands beyond your
      list and it's not remarketing anymore) → frequency cap ~3/day →
      content exclusions per taste.
- [ ] **Exclude converters**: campaign → Audiences → Exclusions → add "All
      converters".
- [ ] **2–3 responsive display ads**: headshot + RE/MAX branding, educational
      headlines ("Selling an Inherited NJ Home — Learn Your Options",
      "Get a Free Home Valuation", "Local NJ Guidance, No Pressure"), CTAs
      "Learn Your Options" / "Schedule a Consultation". Land on
      `/inherited-property-new-jersey`, `/foreclosure`, or `/sell-as-is` —
      never the homepage. Add `?utm_source=google&utm_medium=display&utm_campaign=remarketing-all`
      to final URLs so the site's attribution capture records ad-driven leads.
- [ ] **Split-out rule** (later): when the Probate or Pre-Foreclosure list
      individually clears ~100, clone the campaign with segment-specific
      creative and its own utm_campaign. YouTube remarketing waits for a
      1,000-member list + a video library.

## Weekly check (5 minutes)

- Audience manager: list sizes (especially All Visitors vs the 100 threshold)
- Conversions: only form leads counting? (no pageview "conversions")
- Once serving: CTR, cost/conversion; pause the weakest ad, add a variant
- GHL: leads tagged `ad:google` = leads whose gclid came from an ad click

## Monthly KPI list

| Metric | Where |
|---|---|
| Website visitors | GA4 |
| Remarketing list sizes | Ads Audience manager |
| CTR / CPC / cost per lead | Ads campaign |
| Form conversions (contact vs valuation) | Ads Conversions + GA4 `form_success` |
| Leads with `ad:google` tag | GHL |
| Appointments booked | GHL calendar (booking iframe is cross-origin — not trackable on-site) |
| Listings signed / ROAS | Manual |

## Appendix — conventions

- **GTM publishes**: descriptive version name + notes, every time.
- **Naming**: tags `GAds Conversion — X` / `GA4 — X`, triggers `CE - event (scope)`,
  variables `dlv - name` / `UPD - name`, audiences `Segment — duration`.
- **UTM convention**: `utm_source=google|thanksio|facebook`,
  `utm_medium=display|mail|social`, `utm_campaign=<campaign-slug>`. The site
  stores these + `gclid` on every lead (DynamoDB) and notes them in GHL.
- **Follow-up (not now)**: offline conversion import — the site already stores
  each lead's `gclid`, so signed listings can later be uploaded to Google Ads
  as high-value conversions.
- **Mail opt-out ops**: the update-variant mailer page (`msg=update`) has a
  one-click "take me off your mailing list" button that tags the GHL contact
  `mail:optout`. Set up a GHL workflow (or check a saved filter regularly) on
  that tag → remove the recipient from the Thanks.io monthly loop. Opt-outs
  are wins: postage saved + a clean list.
- **Update-variant VSL**: when the video is recorded, set `videoId` on the
  `update` entry of MESSAGE_VARIANTS in `app/mailer/[type]/page.tsx` — the
  decision block renders it automatically.
