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
| Cart total, tax, and order total accuracy | High | Low | **High** | Confirmed correct across multiple manual checks, but an incorrect total is a direct financial/trust issue if it ever regresses — high impact even with currently low probability |
| Product sorting / display order | Low | Low | **Low** | Annoying if broken, but doesn't block a purchase or cause financial harm |
| PDF order receipt generation | Medium | Low | **Low-Medium** | Useful confirmation for the customer, but the order itself already succeeded by this point — a receipt issue is an inconvenience, not a failed transaction |

## How this ranking is reflected in the actual test suite

This isn't a theoretical exercise sitting separately from the code — it
maps directly onto what was actually built:

- **`tests/e2e/checkout.spec.ts`** — automated, because checkout scored
  highest risk. Extended to also assert the cart total, tax, and order
  total match the expected calculation from the cart contents — verified
  correct across four separate manual checks before being written as a
  regression guard, not filed as a bug.
- **`tests/e2e/checkout.negative.spec.ts`** — covers the locked-out
  login case and a missing-field checkout case, both High risk — tested
  as negative scenarios specifically because a High-risk feature needs
  proof it fails safely, not just proof it works.
- **PDF receipt generation** is a real in-app feature ("Generate PDF
  order" button on the confirmation page) — automated at Low-Medium
  priority: deterministic and stable, but the transaction has already
  succeeded by this point, so a defect here is an inconvenience, not a
  failed purchase.
- **Product sorting** — automated at Low priority: stable, deterministic,
  cheap to check, even though the business impact of it breaking is
  minor.
- **Product search/promo banners were deliberately not built into this
  suite** — neither feature exists on the real application. An earlier
  version of this matrix incorrectly included them as hypothetical rows;
  they were removed once checked against the actual site rather than
  left in on the assumption they were plausible.

## Confirmed bug found through this process

**Cart item removed, but the "Remove" button remains displayed on the
item** instead of reverting to "Add to cart." Confirmed via manual
testing: the item is genuinely removed from the cart (count decreases
correctly), but the button's state doesn't reflect it. Classified as a
**confirmed bug, Low priority** — low business impact, but a
deterministic state mismatch, not a subjective visual judgment, so it's
a good automation candidate: assert cart count decreases *and* the
button text reverts, in the same test.

## Observation — not yet a confirmed bug

**"Reset App State" does not revert product sorting back to default**
after a non-default sort has been applied. Not logged as a bug: the
documented/intended scope of "Reset App State" isn't confirmed — it may
be intentionally limited to cart contents only. Treated as an open
question pending that confirmation, rather than assumed either way.

## Requirement gap surfaced during testing

The Checkout button remains enabled even with an empty cart, which would
allow a user to proceed through checkout with zero items and a $0 total.
This isn't logged as a bug or an improvement — nothing confirms the
intended behavior either way. It's logged as a clarification question
for Product: **should Checkout be disabled when the cart is empty?**
Deciding this up front, rather than assuming an answer, avoids either
wrongly filing a defect against a rule that was never actually defined,
or missing a real one.

## The one-paragraph version, if asked to explain this live

> "I didn't pick these test cases arbitrarily. I ranked every real
> feature on the site by business impact and likelihood of failure, and
> let that ranking decide what got tested and automated first. Along the
> way, testing this way surfaced a real bug, an open question worth
> asking Product rather than guessing, and two rows I'd originally
> written into an earlier version of this matrix based on assumption —
> which I removed once I checked them against the real site and found
> they didn't exist. That correction is itself part of the process: I'd
> rather catch and fix my own assumption than leave it in because it
> sounded plausible."
