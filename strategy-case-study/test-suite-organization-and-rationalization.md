# Test Suite Organization and Rationalization Plan

**Scenario:** a large, manual-heavy regression suite — duplicated coverage, unclear priority, no automation, unclear what's still needed. This is the approach to bringing structure to it.

Examples reference Jira and Xray; the approach generalizes to other test management platforms.

## Test Repository and Metadata Strategy

### Structure = where

Organize tests primarily by stable functional areas — Order Management, Payment, Authentication, Inventory. In Xray, the Test Repository provides the hierarchy. Jira Components can be used when the same grouping needs to be queried across Stories, Bugs, and other work items.

### Metadata = what

Existing fields are reused wherever possible, rather than creating custom fields unnecessarily.

| Field | Purpose | Implementation |
|---|---|---|
| Priority | Testing priority, derived from risk assessment | Jira Priority (native) |
| Functional area | Product/component ownership | Jira Component + Xray Test Repository |
| Release | Release scope | Jira Fix Version (native) |
| Testing campaign scope | Planned scope for a test cycle | Xray Test Plan (native) — used alongside Fix Version, not instead of it |
| Labels | Flexible cross-cutting tags | Jira Labels (native) |
| Test Type | What kind of check this is — Functional, Negative, Regression, Exploratory, Accessibility | Custom field |
| Regression | Whether the test is part of the maintained regression scope | Custom field: Yes / No |
| Automation Candidate | Whether the test has been selected as suitable for automation | Custom field: Yes / No |
| Automation Status | Current automation implementation state | Custom field: Manual / In Progress / Automated |

### Regression

A deliberate suite-selection decision, independent of automation:

```text
Priority = High
Regression = Yes
Automation Candidate = Yes
Automation Status = Manual
```

A test can belong to regression and still be manual. Revisited when the suite is rationalized or the test's scope/risk changes, not automatically every cycle.

### Automation Candidate vs. Automation Status

```text
Automation Candidate = Yes
Automation Status = Manual
```

Identified as worth automating, but not yet built. Keeping these separate lets a query tell "still needs automating" apart from "already done."

### Fix Version and Test Plan

```text
Fix Version = Release 10
Test Plan = Release 10 Regression
```

Fix Version associates any work item with a release. Test Plan defines and manages the testing scope for that release or cycle.

## Traceability

```text
Requirement → Test → Execution → Result → Defect
```

```
project in (QASANDBOX) AND issuetype in (Test)
  AND work item not in linkedWorkItems("REQ-101")
```

An unlinked test is a review candidate, not automatically a defect — it may be exploratory, security, or incident-driven testing that never needed a formal link.

```text
No traceability found
        ↓
     Review
        ↓
Link / retain / consolidate / retire
```

## Rationalization

Review: duplicate/overlapping coverage, missing traceability, execution history, historical defects, priority and change impact, dependencies, regression membership, automation status.

**Duplicates, including near-duplicates** — consolidate into one parameterized case where two cases test the same underlying concept. AI can accelerate finding likely overlaps; a human confirms before anything is removed.

**Execution history is evidence, not a rule** — a critical test passing 500 times in a row can still be essential. Pass history is one input, never the decision alone.

Each reviewed test lands in one of: **Keep → Consolidate → Automate → Retire.**

## Extracting tests by scenario

**Highest-priority regression:**
```
project in (QASANDBOX) AND issuetype in (Test)
  AND priority in (Highest) AND "Regression" in (Yes)
```

**All regression tests, ranked:**
```
project in (QASANDBOX) AND issuetype in (Test)
  AND "Regression" in (Yes)
  ORDER BY priority DESC
```

**Tests currently outside regression, for review:**
```
project in (QASANDBOX) AND issuetype in (Test)
  AND "Regression" in (No)
  ORDER BY priority DESC
```

**High-priority tests outside regression — coverage gap check:**
```
project in (QASANDBOX) AND issuetype in (Test)
  AND priority in (Highest, High) AND "Regression" in (No)
```

**All tests for one feature:**
```
project in (QASANDBOX) AND issuetype in (Test)
  AND component in (Checkout)
```

**Regression tests for one feature — focused regression pass:**
```
project in (QASANDBOX) AND issuetype in (Test)
  AND component in (Checkout) AND "Regression" in (Yes)
  ORDER BY priority DESC
```

**Automation backlog:**
```
project in (QASANDBOX) AND issuetype in (Test)
  AND priority in (Highest, High)
  AND "Regression" in (Yes)
  AND "Automation Candidate" in (Yes)
  AND "Automation Status" in (Manual)
  ORDER BY priority DESC
```

**Automation candidates regardless of regression status:**
```
project in (QASANDBOX) AND issuetype in (Test)
  AND "Automation Candidate" in (Yes)
  ORDER BY priority DESC
```

**Regression tests already automated:**
```
project in (QASANDBOX) AND issuetype in (Test)
  AND "Regression" in (Yes) AND "Automation Status" in (Automated)
  ORDER BY priority DESC
```

**Tests scoped to one release:**
```
project in (QASANDBOX) AND issuetype in (Test)
  AND fixVersion in ("Release 10")
  ORDER BY priority DESC
```

**Regression scope for one release:**
```
project in (QASANDBOX) AND issuetype in (Test)
  AND fixVersion in ("Release 10") AND "Regression" in (Yes)
  ORDER BY priority DESC
```

Exact fields and syntax depend on the actual Jira/Xray configuration — these illustrate the mechanism, not a universal query.

## Four independent dimensions, on the same test

| Priority | Regression | Automation Candidate | Automation Status |
|---|---|---|---|
| Highest | Yes | Yes | Automated |
| High | Yes | Yes | Manual |
| High | Yes | No | Manual |
| Low | No | Yes | Automated |

Each field answers a different question. A manually-executed test can belong to regression; an automated test can sit outside it — the fields aren't required to move together.

## Related files

`risk-based-testing-approach.md` — how Priority values are determined.
`automation-decision-matrix.md` — how Automation Candidate decisions are made.