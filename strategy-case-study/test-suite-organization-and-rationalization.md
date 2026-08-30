# Test Suite Rationalization Plan

**Scenario:** you inherit a large, manual-heavy regression suite —
duplicated coverage, unclear priority, no automation, and no one is
certain what's actually still needed. This is a written version of how
I'd approach it, including the exact queries I'd run once metadata exists.

## Phase 1 — Inventory before judging

Before removing or automating anything: how many tests actually exist,
what do they cover, and is any of it linked to a real requirement. I
wouldn't trust a spreadsheet count — I'd pull this directly from the test
management tool.

## Phase 2 — Structure: folders answer "where," fields answer "what"

A common early mistake is organizing a repository by test *type* —
folders like `P1/`, `Regression/`, `Negative/`. This breaks immediately,
because one test case is often several of these at once:

> "Payment fails → order must not be created" is simultaneously
> **Negative**, **P1**, **Critical risk**, **Regression**, and an
> **Automation Candidate** — all at the same time.

Instead:
- **Folders** = functional area (`Order Management`, `Payment`,
  `Certificate Lifecycle`, `Authentication`) — stable, rarely reorganized
- **Structured fields** = `Priority`, `Test Risk`, `Probability`,
  `Regression (Yes/No)`, `Automation Candidate (Yes/No)` — filterable,
  reportable, and can all apply to the same test at once
- **Labels** reserved only for loose, cross-cutting tags
  (`release-2026-q3`, `production-defect`) — not for anything you plan to
  report on regularly

## Phase 3 — Find what to eliminate

Once every test has a **Parent** link to its originating requirement, one
query finds the first cleanup candidates — tests nobody can currently
justify:

```
project in (QASANDBOX) AND issuetype in (Test) AND parent is EMPTY
```

Second pass: pull execution history. Tests that have run 20+ times with
zero failures, in a low-risk area, are low-value to keep running manually
— either cheap to automate, or safe to retire.

Third pass: group by requirement/acceptance criteria. Multiple test cases
covering the exact same AC with only minor input variation, and none of
them boundary cases, are redundant coverage rather than thorough coverage
— consolidate into one parameterized case.

## Phase 4 — Rank what's left

```
project in (QASANDBOX) AND issuetype in (Test)
  AND "Test Risk" in (Critical) AND "Regression" in (Yes)
```
→ the "cannot skip, ever" list — what runs even under release-day time
pressure.

```
project in (QASANDBOX) AND issuetype in (Test)
  AND "Regression" in (No)
```
→ the reconsideration list. Cross-referenced against the risk field: if
anything here is also high-risk, that's a real coverage gap worth
surfacing, not just an oversight to quietly fix.

## Phase 5 — Build the automation backlog

```
project in (QASANDBOX) AND issuetype in (Test)
  AND "Automation Candidate" in (Yes)
  AND "Test Risk" in (Critical, High)
  AND priority in (Highest, High)
  ORDER BY priority DESC
```

This is the backlog handed to automation engineers — already ranked, not
a raw list of "everything important."

## Phase 6 — Close the loop with CI

Once a test is automated, its execution result should update the same
Jira/Xray Test issue automatically — via CI publishing JUnit results
through the test-management tool's import API — rather than someone
manually marking "automated" in a spreadsheet that immediately goes
stale. That's what makes coverage and automation-progress metrics
trustworthy enough to report to leadership.

## The 20-second version, if asked to summarize live

> "I wouldn't organize a bloated suite by priority or test type, because
> those overlap on the same test. I'd organize by functional area, and use
> structured fields — risk, priority, regression status, automation
> candidacy — to filter and rank. Traceability finds what to eliminate
> first: anything with no linked requirement, or anything that's run
> repeatedly and never failed in a low-risk area. What's left gets ranked
> by risk and business priority, and only the stable, repeatable,
> deterministic slice of that becomes the automation backlog."
