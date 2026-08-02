# Google Ads & GA4 Conversion Import Guide

This guide walks you through importing Google Analytics 4 (GA4) key events (conversions) into your linked **Google Ads** account (`8988909411`).

---

## Step 1: Mark Events as Key Events in Google Analytics 4

1. Log into your [Google Analytics Admin Console](https://analytics.google.com/).
2. Select Property: **JTR - Realtor Website** (`520040567`).
3. Under the **Admin** gear icon ⚙️ (bottom left), navigate to **Data display** → **Key events** (formerly Conversions).
4. Click **New key event**.
5. Type in the exact event names emitted by your website:
   * `form_success` (triggered when a contact form is successfully submitted)
   * `call_click` (triggered when someone clicks the phone CTA button)
   * `messenger_click` (triggered when someone clicks the Facebook Messenger CTA)
6. Toggle the switch to **Active / Enabled**.

---

## Step 2: Verify Google Ads Account Link in GA4

1. In GA4 Admin ⚙️, under **Product links**, click **Google Ads links**.
2. Confirm that Google Ads Customer ID `8988909411` is listed with status **Linked**.
   *(We confirmed via API that link ID `13304921856` is active for customer `8988909411`)*.
3. Ensure **Enable Personalized Advertising** and **Auto-tagging** options are turned ON.

---

## Step 3: Import GA4 Conversions into Google Ads

1. Log into your [Google Ads Dashboard](https://ads.google.com/) for Account `8988909411`.
2. In the top navigation menu, click **Goals** → **Conversions** → **Summary**.
3. Click **+ New conversion action**.
4. Select **Import**.
5. Choose **Google Analytics 4 properties** → select **Web**.
6. Click **Continue**.
7. You will see the list of GA4 Key Events you enabled in Step 1:
   * `form_success`
   * `call_click`
   * `messenger_click`
8. Check the boxes next to the events and click **Import and continue**.

---

## Step 4: Configure Conversion Optimization Settings

For each imported conversion action in Google Ads:

1. **Category**:
   * Set `form_success` to **Submit lead form**.
   * Set `call_click` to **Phone call lead** or **Outbound click**.
2. **Action Optimization**:
   * Set to **Primary action** if you want Smart Bidding (e.g. Target CPA / Maximize Conversions) to optimize for these lead actions.
3. **Attribution Model**:
   * Leave set to **Data-driven attribution** (recommended by Google).

---

## Testing & Verification

* After setting up the conversion import, any ad click that leads to a form submission or phone call click will automatically be attributed in your Google Ads campaign metrics within 24 hours.
* You can verify real-time event triggers using the **GA4 DebugView** by enabling the Google Analytics Debugger extension in Chrome.
