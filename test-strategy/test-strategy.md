# Test Strategy

## Approach
Risk-based, following the test pyramid: fast and numerous at the API/unit
level, fewer and slower at the E2E level, reserved for the critical
customer journey only.

## Test Pyramid for this project

| Layer | What belongs here | Where in this repo |
|---|---|---|
| API/Integration | Contract correctness of each endpoint - status codes, response shape, positive and negative cases | `tests/api/` |
| E2E (few, critical only) | The one journey that matters most: login -> add to cart -> checkout -> confirmation | `tests/e2e/checkout.spec.ts` |
| Negative / edge case | Locked-out login, missing required checkout fields | `tests/e2e/checkout.negative.spec.ts` |

In a real codebase, unit tests for pure logic (e.g. price calculation,
discount rules) would sit below the API layer - not demonstrated here since
this project tests a live application rather than owning its source code.

## What's automated, and why
- **API tests are automated first.** They're faster, more stable, and test
  business rules closer to the source of truth than driving everything
  through the UI.
- **Only one full E2E happy path is automated.** Additional scenarios
  (different products, different shipping data) are better covered at the
  API level or as short negative UI checks, not by multiplying E2E tests.
- **Negative/security-adjacent scenarios kept separate** from the happy
  path so a single failing edge case never blocks the critical-path signal.

## What's deliberately NOT automated here
- Visual/pixel-level UI regression - would use a dedicated visual-diff tool.
- Performance/load testing - would use k6 or JMeter, run on a schedule,
  not on every commit.
- Full cross-browser matrix on every push - Playwright projects support it
  (see `playwright.config.ts`), but CI runs it on a lighter cadence to
  keep pipeline time reasonable.

## CI/CD
Every push and pull request to `main` runs the full suite via GitHub
Actions (`.github/workflows/tests.yml`): install, install browsers, run
API tests, run E2E tests, upload the HTML report as a build artifact
regardless of pass/fail, so failures are always inspectable.

## AI-assisted testing
Used AI as an accelerator, not as the strategist: generating first-draft
test skeletons and suggesting edge cases I then reviewed and adjusted
myself, rather than accepting generated tests as-is. Test scope,
prioritisation, and pass/fail judgement stayed a manual decision.

## Known limitations
- This targets a public demo app, so certain real-world concerns (real
  payment gateways, real account creation, real inventory/stock state)
  aren't representable here - noted explicitly rather than glossed over.
