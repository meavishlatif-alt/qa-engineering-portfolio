# Risk-Based Testing Approach

**Purpose:** showing the actual reasoning behind which test cases exist
in this project's `tests/` folder — not just what was built, but why
these specific scenarios were chosen over others.

## The method, in five steps

1. **List what the application actually does** — every real feature, not
   an assumed one.
2. **Score business impact** if that feature breaks — Critical / High /
   Medium / Low.
3. **Score probability** of it breaking or being misused — High / Medium
   / Low.
4. **Risk = Impact × Probability.** This produces a ranked list, not a
   guess.
5. **Test coverage and automation follow the ranking** — highest risk
   gets tested first and automated first; lowest risk is covered last,
   if at all.

## Applied to this project's actual application (saucedemo.com)

| Feature | Impact | Probability | Risk | Why |
|---|---|---|---|---|
| Checkout completes end-to-end | Critical | Medium | **Highest** | If this breaks, no customer can complete a purchase — direct revenue loss, the single most damaging failure possible on an e-commerce site |
| Login (valid + locked-out) | High | Medium | **High** | Every other feature sits behind this — if login breaks, nothing downstream can be tested or used at all |
| Add / remove product from cart | High | Medium | **High** | Wrong cart contents carried into checkout means a customer is charged incorrectly — a trust and financial risk, not just a UI glitch |
| Cart total, tax, and order total accuracy | High | Low | **High** | An incorrect total is a direct financial/trust issue if it ever regresses — high impact even with low probability of occurring |
| Product sorting / display order | Low | Low | **Low** | Annoying if broken, but doesn't block a purchase or cause financial harm |
| PDF order receipt generation | Medium | Low | **Low-Medium** | Useful confirmation for the customer, but the order itself already succeeded by this point — a receipt issue is an inconvenience, not a failed transaction |

## How this ranking is reflected in the actual test suite

This isn't a theoretical exercise sitting separately from the code — it
maps directly onto what was actually built:

- **`tests/e2e/checkout.spec.ts`** — automated, because checkout scored
  highest risk. Extended to also verify the cart total, tax, and order
  total match the expected calculation from the cart contents, since
  that's High risk despite low probability of failure.
- **`tests/e2e/checkout.negative.spec.ts`** — covers the locked-out
  login case and a missing-field checkout case, both High risk — tested
  as negative scenarios specifically because a High-risk feature needs
  proof it fails safely, not just proof it works.
- **PDF receipt generation** — a real in-app feature ("Generate PDF
  order" button on the confirmation page), automated at Low-Medium
  priority: deterministic and stable, but lower business impact since
  the transaction has already succeeded by this point.
- **Product sorting** — automated at Low priority: stable and
  deterministic, cheap to check, even though the business impact of it
  breaking is minor.
- **Product search and promotional banners are not covered** — neither
  feature exists on the real application, so no test scope was assigned
  to them.

## Why this approach, generically

Risk-based prioritization means every testing decision has a
justification tied to business impact, not intuition or habit. Applied
consistently, it produces a test suite where effort is concentrated on
what would actually hurt the business most if it broke — and just as
importantly, it's explicit about what's *not* covered and why, rather
than leaving gaps unstated.
