# Test Strategy

## Approach
Risk-based, following the test pyramid: fast and numerous at the API/unit
level, fewer and slower at the E2E level, reserved for the critical
customer journey only.

## Test Pyramid for this project

| Layer | What belongs here | Where in this repo |
|---|---|---|
| API/Integration | Functional correctness of each endpoint - status codes, response shape, positive and negative cases | `tests/api/` |
| E2E (few, critical only) | The one journey that matters most: login -> add to cart -> checkout -> confirmation | `tests/e2e/checkout.spec.ts` |
| Negative / edge case | Locked-out login, missing required checkout fields | `tests/e2e/checkout.negative.spec.ts` |

In a real codebase, unit tests for pure logic (e.g. price calculation,
discount rules) would sit below the API layer - not demonstrated here
since this project tests a live application rather than owning its
source code.

**A specific example of this gap:** the checkout total/tax calculation
is verified in this project at the E2E layer, by comparing the rendered
total against an expected calculation from cart contents. In a real
codebase, this calculation would ideally be covered by a unit test
against the pricing function directly - faster, and independent of the
UI rendering it correctly. It's tested here at E2E only because that's
the access level available against a live, third-party demo site - the
gap is documented rather than left implicit.

Note on terminology: these are called "API tests," not "contract
tests" - they validate each endpoint's own behavior (status codes,
response shape), not a formal consumer/provider contract (e.g. via
Pact). That distinction matters and is kept deliberate throughout this
project.

## What's automated, and why
- **API tests are automated first.** They're faster, more stable, and
  test business rules closer to the source of truth than driving
  everything through the UI.
- **Only one full E2E happy path is automated**, extended to also verify
  the checkout total/tax calculation and PDF receipt generation as part
  of that same flow, rather than as separate large tests.
- **Negative/security-adjacent scenarios kept separate** from the happy
  path so a single failing edge case never blocks the critical-path
  signal.

## Cross-browser, responsive, and accessibility testing

**Cross-browser rendering** matters here specifically because a real
finding during testing was a CSS layout issue: a login error message
("Epic sadface: ...") was visually truncated inside its container on
one browser configuration, even though the full text was confirmed
present in the DOM via inspection - a rendering/overflow bug, not a
content bug. This is exactly the class of issue that only surfaces when
the same page is checked across multiple rendering engines, which is
why this project's `playwright.config.ts` already runs against three
browser projects (Chromium, Firefox, WebKit) rather than one - not
originally added for this specific bug, but exactly the kind of case
that justifies keeping it that way.

**Responsive/screen-size testing** is the natural extension of the same
idea: a container that renders correctly at one viewport width can still
truncate or overflow at another. Playwright supports this directly via
device emulation profiles and manual viewport sizing
(`page.setViewportSize()`), which would be the next step to formally
add coverage for this class of bug rather than relying on catching it
by chance during manual exploration.

**Accessibility testing** - a single line, since it's out of scope for
this project's current automation: a full implementation would use a
tool such as axe-core (via `@axe-core/playwright`) or Playwright's
built-in accessibility snapshot support to check for issues like
insufficient color contrast, missing labels, and keyboard-navigation
gaps, rather than relying on manual review alone.

## What's deliberately NOT automated here
- Visual/pixel-level UI regression - would use a dedicated visual-diff tool.
- Performance/load testing - would use k6 or JMeter, run on a schedule,
  not on every commit.
- Full cross-browser matrix on every push - the three Playwright projects
  above support it, but CI runs it on a lighter cadence to keep pipeline
  time reasonable.

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
- Accessibility and full responsive/viewport testing are documented as
  an approach above, not yet implemented as automated checks.
