# Automation Decision Matrix

**Purpose:** a reusable framework for deciding what to automate — applied
to this project's real application, plus a couple of common e-commerce
scenarios beyond it, to show the logic generalizes rather than being
tied to one specific feature.

## The framework

**Risk tells me what deserves strong coverage. Automation suitability is
a separate decision.** A test can be high-risk and still be a poor
automation candidate — the "checkout during a payment-provider outage"
row below is High risk and stays manual, because the behavior itself
isn't stable or fully defined yet. Conversely, a low-risk test can be
worth automating if it's extremely frequent, stable, and cheap to check.

I score four things separately, and only automate when they line up:

- **Risk** — how bad is it if this fails? (Critical / High / Medium / Low)
- **Frequency** — how often does this get exercised? (Every release / Every regression / Occasional / Rare)
- **Stability** — does the behavior itself change often, or is it settled?
- **Determinism** — does this have one clear, checkable expected outcome, or does it need human judgment?

## Applied matrix

| Scenario | Risk | Frequency | Stability | Determinism | Automate? | Layer |
|---|---|---|---|---|---|---|
| Valid login | High | Every release | Stable | Yes | **Yes** | E2E |
| Locked-out user blocked | High | Every regression | Stable | Yes | **Yes** | E2E |
| Checkout completes end-to-end | Critical | Every release | Stable | Yes | **Yes** | E2E (critical path only) |
| Cart total, tax, and order total match expected calculation | High | Every checkout | Stable | Yes | **Yes** | E2E (ideally unit-level — see test-strategy.md for the access-level gap) |
| Checkout with missing required field | High | Every regression | Stable | Yes | **Yes** | E2E (negative) |
| Generate PDF order receipt | Medium | Every completed order | Stable | Yes | **Yes** | E2E |
| Product sorting (price, name) | Low | Every regression | Stable | Yes | **Yes** | E2E / UI |
| Cart item removed but "Remove" button still displayed | Low | Every regression | Stable | Yes | **Yes — confirmed bug, deterministic state check** | E2E / UI |
| Checkout during a payment-provider outage | High | Rare | Unstable — fallback behavior undefined | No | **No — manual for now** | Manual |
| Exploratory usability pass on a new feature | Medium | Once per feature | N/A — requires judgment | No | **No** | Manual, always |

## What this table is actually for

This isn't a static list — it's the **query I'd run against a real test
management tool** (Jira/Xray, TestRail, Azure DevOps) once test cases carry
this same metadata as structured fields, not folder placement:

```
Risk in (Critical, High) AND Automation Candidate = Yes AND Regression = Yes
```

That query *is* the automation backlog. This matrix is the manual version
of the same logic, before the tooling does it for you.

## The two traps this matrix is designed to avoid

1. **"It's high risk, so automate it"** — risk and automation suitability
   are two different axes. The "outage" row is High risk and correctly
   stays manual, because stability and determinism aren't there yet.
   Automating unstable behavior means maintaining a test that breaks for
   the wrong reasons.
2. **"It's low risk, so don't bother automating it"** — the removed-item
   button bug is Low risk but still a good automation candidate: it's a
   deterministic state check (button text + cart count), not a
   subjective visual judgment, so a human doesn't need to re-check it by
   eye every release.
