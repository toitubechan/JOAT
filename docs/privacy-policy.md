# Privacy Policy — Joat (Jack of All Trades)

> **This is a template/draft, not legal advice.** Fill in every `[BRACKETED]`
> placeholder, review it against how your app actually behaves, and have a
> qualified professional check it before you publish. Google Play requires a
> **publicly hosted URL** for this policy (e.g. GitHub Pages) that you link in
> both the Play listing and the app.

**Effective date:** July 15, 2026
**App:** Joat (Jack of All Trades) — Android
**Developer:** toitubechan
**Contact:** toitubechan@gmail.com

---

## Overview

Joat is a micro-learning app that teaches practical life skills through a
card-based feed, quizzes, and a coins/XP/streak progression. This policy explains
what data the app collects, why, who it is shared with, and your choices.

We keep data collection to what the app needs to function. Your learning progress
is stored **on your device**; the only data that leaves your device is what the
third-party services below require to provide authentication, analytics, ads
(free users only), and purchases.

## Information we collect

**You provide it (account):**
- **Email address and name** — when you create an account or sign in. Handled by
  our authentication provider (Clerk).

**Collected automatically:**
- **Usage & product analytics** — which screens and features you use, lessons
  started/completed, quiz results, and basic device/app info (app version, device
  model, OS version). Used to understand and improve the app. Handled by PostHog.
  We send only specific events; we do **not** enable broad automatic capture.
- **Advertising data (free users only)** — for users who have not purchased Pro,
  our ads provider (Google AdMob) may access your device's **advertising ID** and
  related device info to serve and measure ads. **Pro users see no ads.**
- **Purchase status** — if you buy Joat Pro, our purchases provider (RevenueCat)
  and the Google Play Store process the transaction and your entitlement status.
  We never receive or store your full payment card details.

**Stored only on your device (not sent to us):**
- Your **progress and preferences** — coins, XP, level, streak, completed lessons,
  saved lessons, chosen categories, and theme — via local storage (AsyncStorage).
- Your **session token**, stored securely on the device to keep you signed in.

## How we use your information

- To provide and secure your account and keep you signed in.
- To deliver lessons and save your progress.
- To measure and improve app performance and content.
- To show ads to free users and to offer/manage the Pro upgrade.
- To comply with legal obligations.

We do **not** sell your personal information.

## Third-party services (sub-processors)

The app shares the limited data described above with these providers, each under
their own privacy policy:

| Provider | Purpose | Their policy |
| --- | --- | --- |
| **Clerk** | Authentication / accounts | https://clerk.com/legal/privacy |
| **PostHog** | Product analytics | https://posthog.com/privacy |
| **Google AdMob** | Ads (free users only) | https://policies.google.com/privacy |
| **RevenueCat** | Purchase / subscription management | https://www.revenuecat.com/privacy |
| **Google Play** | App distribution & billing | https://policies.google.com/privacy |

## Advertising & consent

Free users are shown ads via Google AdMob (occasional full-screen ads between
lessons and optional "watch to earn coins" ads). Where required by law (e.g. the
EEA/UK under GDPR), the app presents a **consent prompt** (Google's User Messaging
Platform) before serving personalized ads, and respects your choice. You can
remove all ads by purchasing **Joat Pro**.

## Children

Joat is intended for a **general audience** and is **not directed to children
under 13**. We do not knowingly collect personal information
from children. If you believe a child has provided us data, contact us and we will
delete it.

## Data retention

- On-device data (progress, preferences) remains until you clear it, sign out
  where applicable, or uninstall the app.
- Account and analytics data is retained by our providers for as long as your
  account is active or as needed to provide the service, then deleted or
  anonymized per their policies.

## Your rights & choices

Depending on your region (e.g. **GDPR** in the EEA/UK, **CCPA/CPRA** in
California), you may have the right to access, correct, delete, or export your
personal data, and to object to or restrict certain processing.

- **Delete your account/data:** follow the instructions in our
  [Account Deletion Guide](./account-deletion.md) or contact us at
  toitubechan@gmail.com.
- **Ad choices:** reset or limit your advertising ID in your device settings, and
  use the in-app consent controls where shown.

## Security

We use reasonable technical measures to protect your data (e.g. secure device
storage for your session token, encrypted transport to our providers). No method
of transmission or storage is 100% secure.

## Changes to this policy

We may update this policy from time to time. Material changes will be reflected by
updating the "Effective date" above and, where appropriate, an in-app notice.

## Contact

Questions or requests: **toitubechan@gmail.com** — toitubechan.

---

## Appendix — Play "Data safety" form cheat-sheet

Use this to fill Google Play Console → **App content → Data safety** (verify each
against your final build):

- **Personal info → Email address / Name:** Collected, shared with Clerk. Required
  for account.
- **App activity / App info & performance:** Collected (usage events, crash/perf,
  device info) — PostHog. Used for Analytics / App functionality.
- **Device or other IDs (Advertising ID):** Collected for **free users** — AdMob.
  Used for Advertising. Declare this only if you ship ads.
- **Purchases:** Purchase history / entitlement — RevenueCat + Google Play. Used
  for App functionality.
- **Data encrypted in transit:** Yes.
- **Users can request deletion:** Yes (provide the contact method above).
- Declare AdMob/analytics data as **shared** with third parties as applicable.
