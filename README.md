# QA Engineering Portfolio Project

A small, real, runnable project demonstrating risk-based test strategy,
the test pyramid in practice, and CI/CD — built with Playwright, covering
both API testing and browser E2E automation in a single framework.

## What this project demonstrates
- **Test pyramid applied, not just diagrammed** — more, faster API-level
  tests; fewer, slower E2E tests reserved for the one journey that
  matters most.
- **API testing and browser E2E in the same suite** — one framework, one
  config, two different testing disciplines, run together.
- **Page Object Model** — locators live in one place per page, not
  scattered through test files.
- **Real CI/CD** — GitHub Actions runs the full suite on every push,
  including a securely-stored API key, not hardcoded.
- **Root-cause investigation, not just pass/fail** — see
  [`defects/sample-defects.md`](./defects/sample-defects.md) and the
  real-world troubleshooting note below.
- **Negative and edge-case testing kept separate** from the happy path,
  deliberately, so one broken edge case never hides a broken critical
  journey in CI results.

## What is the application?
This project tests two public, stable practice targets rather than a
private app, so anyone can clone it and run it immediately:
- **E2E target:** [saucedemo.com](https://www.saucedemo.com) — a
  standard e-commerce login/cart/checkout flow.
- **API target:** [reqres.in](https://reqres.in) — a public REST API.

## The test pyramid, in this repo

```
              /\
             /  \      E2E — 3 tests
            / UI \     Login -> cart -> checkout -> confirmation
           /------\    Slow, expensive, highest confidence
          /  API   \   API — 4 tests
         / (fast,   \  Direct HTTP requests, no browser
        /  numerous) \ Fast, cheap, tests business rules directly
       --------------
```

In a real codebase with source access, unit tests would sit below the
API layer (e.g. testing a discount calculation function in isolation).
Not demonstrated here since this project tests a live application
rather than owning its source code — noted explicitly rather than
glossed over.

## Project layout
```
qa-engineering-project/
├── requirements/requirements.md      # the story + AC under test
├── test-strategy/test-strategy.md    # pyramid, automation decisions, CI, AI use
├── tests/
│   ├── api/          # fast, independent contract tests
│   └── e2e/          # critical happy path + negative/edge cases
├── test-data/         # seeded, reusable test data (not hardcoded in tests)
├── pages/             # Page Object Model — one class per page
├── defects/           # root-cause investigation write-ups
├── .github/workflows/  # CI — runs on every push/PR
├── playwright.config.ts
└── package.json
```

## What's automated and why
- **API contract tests** (`tests/api/`) — fast, stable, test business
  rules at the source: valid lookup, 404 on a missing resource, create,
  update.
- **One critical E2E journey** (`tests/e2e/checkout.spec.ts`) — login to
  order confirmation, the path that matters most to the business.
- **Negative/edge cases kept in a separate file** so they never block
  the happy-path signal in CI.

## Real-world troubleshooting encountered while building this
Worth including on purpose, not hiding — this is what actually
happened, and it's a fair sample of real QA work:
- **reqres.in changed its authentication policy mid-project** — it
  relaunched as a freemium service requiring an `x-api-key` header,
  which broke every API test with a 401. Investigated via the response
  code, confirmed via their docs, fixed by adding the header and moving
  the key to an environment variable / GitHub secret rather than
  hardcoding it.
- **Firefox failed to launch locally** due to a missing Windows system
  library (`msvcp140_1.dll`) — unrelated to the test code. Confirmed by
  the fact Chromium and WebKit ran the identical suite successfully,
  isolating the cause to the local environment, not the tests.

## Running it yourself

```bash
npm install
npx playwright install --with-deps

npm run test:api      # API tests only
npm run test:e2e      # E2E tests only
npm test               # everything
npm run report         # open the last HTML report
```

If API tests return 401, you need a free reqres.in API key — see below.

## CI/CD
Every push and pull request to `main` triggers
[`.github/workflows/tests.yml`](./.github/workflows/tests.yml): installs
dependencies and browsers, runs API tests, runs E2E tests, and uploads
the HTML report as a build artifact — pass or fail — so any failure is
inspectable without re-running locally. The API key is read from a
GitHub Actions secret, never committed to the repo.

## Root-cause investigation
[`defects/sample-defects.md`](./defects/sample-defects.md) is a worked
example tracing a failing test to its root cause: UI -> network/API ->
data/state -> conclusion. Used as the template for real findings.

## Security & performance approach
Out of scope for automated coverage on these public demo targets, but
documented as part of the strategy rather than ignored — see the "Known
limitations" section of
[`test-strategy/test-strategy.md`](./test-strategy/test-strategy.md).

## AI usage
Used to accelerate test-skeleton generation and surface edge cases —
not used to decide test scope or judge pass/fail. That decision-making
stayed manual throughout.

## Known limitations
See the bottom of
[`test-strategy/test-strategy.md`](./test-strategy/test-strategy.md).
