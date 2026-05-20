# Page — Pricing

**Frontend file:** `frontend/src/app/pricing/pricing-content.tsx`
**Page route:** `/pricing`
**Auth required:** No (marketing page)

---

## What the page displays

- 4 plan cards: Free (£0), Professional (£9/mo or £79/yr), Institutional (£499/yr), Enterprise (Custom).
- Currency toggle: GBP / NGN / USD (purchasing-power-parity prices for NGN).
- Billing toggle: Monthly / Annual (Annual saves 27%).
- ACU member institution callout: free forever.
- CIPM CPD recognition banner (launching late 2026).
- Founding partner window banner: Sep 2026 – Mar 2027 (40% off Institutional).
- Feature comparison table.

---

## Endpoints

### Status: no backend needed for v1

This page is **marketing-only** today — pricing is hardcoded and all CTAs go to `/signup`, `mailto:`, or `/partner-register`. No checkout is wired.

When the team is ready to take payments, the following endpoints will be needed (specs to be filled in then):

- `POST /api/billing/checkout-session` — create a Stripe (GBP/USD) or Paystack (NGN) checkout session for a given plan + billing period.
- `POST /api/billing/webhook` — Stripe + Paystack webhook handler to confirm payment and upgrade the user's plan.
- `GET /api/billing/subscription` — return the authenticated user's current plan, renewal date, payment method (masked).
- `POST /api/billing/subscription/cancel` — cancel at period end.
- `POST /api/billing/portal-session` — Stripe customer portal redirect.

### Public pricing data (optional)

If we want pricing to be editable without a redeploy, add:

### GET `/api/pricing` (optional v2)

Returns the plan catalog so the page can render dynamically.

```json
{
  "plans": [
    {
      "id": "free",
      "name": "Free",
      "prices": { "GBP": 0, "NGN": 0, "USD": 0 },
      "billing_periods": ["forever"],
      "features": ["..."],
      "cta_label": "Start for free",
      "cta_url": "/signup",
      "highlighted": false
    }
  ],
  "founding_partner_window": { "start": "2026-09-01", "end": "2027-03-31", "discount_percent": 40 }
}
```

Skip until pricing changes often enough to justify it.

---

## Notes for backend

- Don't build billing endpoints until the team decides which provider(s) to use and which plans are real.
- Keep pricing in the frontend until then — there's no value moving static data to an endpoint.
