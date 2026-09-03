# Test Strategy

**Purpose:** the overall test strategy for this application — scope, test levels, approach to risk and automation, and completion criteria. This is a planning document, not a status report: it defines *how* testing decisions get made, using the identified test cases as a working example. Specific risk scoring, automation decisions, and suite-organization detail each live in their own document; this one ties the approach together.

## Scope

Testing covers the identified functionality of the application under `standard_user` access — authentication, product browsing and sorting, cart management, checkout, order confirmation, and navigation. Twenty-six test scenarios (TC01-TC26) were identified through exploration and form the working example referenced throughout this strategy.

## Test Levels

Testing follows a pyramid approach — more coverage at faster, cheaper levels, less at slower, more expensive ones:

- **Unit** — pure logic (e.g. price/tax calculation) would sit here in a codebase-owning context. Not directly available against a live third-party application, but named explicitly as the ideal home for this class of check, not skipped silently.
- **API/Integration** — endpoint-level correctness, independent of UI rendering.
- **UI/E2E** — full user journeys. Reserved for the highest-priority scenarios only; not every test case needs to run at this level.

## Test Types

- **Functional** — does the feature behave correctly under normal use.
- **Negative** — does the system fail safely under invalid input or unauthorized access.
- **Regression** — a maintained subset re-run to catch reintroduced defects.
- **Non-functional** — cross-browser consistency, responsiveness, accessibility, and performance. Treated as a deliberate category of risk, not an afterthought, even where full automated coverage isn't yet built.

## Risk Approach

Priority is assigned through structured risk analysis — impact and likelihood assessed per scenario, not assumed from intuition. See `strategy-case-study/risk-based-testing-approach.md` for the full method and the worked register (TC01-TC26). This strategy treats risk as the primary driver of test depth: higher-priority scenarios get more test types and more scrutiny; lower-priority ones get basic coverage only.

## Automation Approach

Automation is a suitability decision, separate from priority. A scenario becomes a good automation candidate when it's stable, deterministic, frequently exercised, and cheap enough to maintain relative to its value — not simply because it's high priority. See `strategy-case-study/automation-decision-matrix.md` for the full framework and applied decisions per test case.

## Suite Organization Approach

As the set of test cases grows, structure and metadata (functional area, priority, regression membership, automation status) keep the suite navigable and queryable rather than an unmanaged list. See `strategy-case-study/test-suite-organization-and-rationalization.md` for the full approach, including how to extract subsets for regression, a specific release, or a specific feature.

## Entry and Exit Criteria

**Entry criteria** — testing a feature begins once it reaches Definition of Ready (DoR): expected behavior defined clearly enough to assess pass/fail. Where behavior is ambiguous (see TC26 in the risk register), testing is deferred until clarified rather than guessed at.

**Exit criteria** — a feature is considered adequately tested once it reaches Definition of Done (DoD) from a QA perspective: all Highest and High priority scenarios pass, confirmed defects are logged with evidence, and open questions are either resolved or explicitly accepted as known gaps rather than silently ignored.

## Tools

Test management and traceability approach demonstrated using Jira/Xray conventions (see `strategy-case-study/test-suite-organization-and-rationalization.md`); the same principles apply with any equivalent tool (TestRail, Azure DevOps, qTest).

## Relationship to the automation project in this repository

The Playwright/TypeScript suite in `tests/` is a separate, hands-on implementation exercise — proof of automation and CI/CD capability, not the definition of this strategy's scope. It automates a small set of API tests against a public REST API and one critical E2E journey (login through checkout) against a public e-commerce demo site, running in a GitHub Actions pipeline on every push — see the project README for the full breakdown. This strategy stands on its own and would apply the same way regardless of which specific scenarios happen to be coded up at any given time.