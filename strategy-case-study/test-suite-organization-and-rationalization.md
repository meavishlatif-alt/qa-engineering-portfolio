# Test Suite Organization and Rationalization Plan

**Scenario:** you inherit a large, manual-heavy regression suite —
duplicated coverage, unclear priority, no automation, and no one is
certain what's actually still needed. This is how I'd approach bringing
structure to it.

**Note on tool references:** examples reference Jira and Xray because
that's what I've practiced hands-on, but the approach is general —
the same reasoning applies in TestRail, Azure DevOps, or qTest, with
different field names and query syntax.

## Test Repository and Metadata Strategy

The repository should make the test suite easy to understand without
creating multiple copies of the same test.

### Structure = where

Organize tests primarily by stable functional areas, for example:

- Order Management
- Payment
- Authentication
- Inventory

In Xray, this is supported through the Test Repository. Jira Components
can also be used when the same functional grouping needs to be queried
across Stories, Bugs, and other work item types — the two are
complementary, not the same mechanism.

### Metadata = what

I'd reuse existing tool fields wherever possible rather than creating
custom fields unnecessarily. Jira already provides native fields —
Priority, Components, Labels, Fix Version, Parent, and Issue Links —
and Xray provides its own native issue types — Test, Test Plan, Test
Set, Test Execution, Precondition — built for exactly this purpose.

| Attribute | Purpose | Typical implementation |
|---|---|---|
| Priority | Business urgency | Jira Priority (native) |
| Functional area | Product/component ownership | Jira Component + Xray Test Repository |
| Release | Release scope | Jira Fix Version (native) |
| Testing campaign scope | What's planned for a specific test cycle | Xray Test Plan (native) — used alongside Fix Version, not instead of it |
| Labels | Flexible, cross-cutting tags | Jira Labels (native) |
| Business Risk | Business/customer impact if the scenario fails | Custom field, added only where risk reporting is needed |
| Automation Candidate | The team's current decision that a test is suitable for automation | Custom field, added only where the team needs a visible, revisitable decision |
| Automation Status | Current implementation state | Custom field: Manual / In Progress / Automated |

**Fix Version and Test Plan used together, not interchangeably:**
```
Fix Version = Release 10
Test Plan = Release 10 Regression
```
Fix Version is Jira's generic way to associate any work item with a
release. Test Plan is Xray's more specific mechanism for defining and
managing a planned testing scope tied to that release.

A test can carry several of these characteristics at once. For example:

> "Payment fails → order must not be created"

can be **Negative + Highest Priority + Critical Risk + Regression +
Automation Candidate**, simultaneously. These are represented as
metadata on one test, not as separate repository folders.

### Why record "Automation Candidate"?

During a suite review, QA can record this decision once — a test judged
stable, repeatable, and valuable enough to automate gets tagged `Yes`.
That decision then stays visible and searchable for the whole team,
rather than every future automation discussion starting from scratch
across thousands of tests. It's the team's *current* assessment, not a
permanent verdict — it can be revisited if the feature's stability or
risk profile changes later.

**Automation Candidate vs. Automation Status:**
- **Automation Candidate** = should we automate this?
- **Automation Status** = where are we today?

```
Automation Candidate = Yes
Automation Status = Manual
```
means the test has been identified as worth automating, but the work
hasn't happened yet — keeping these as two fields is what lets a later
query tell "still needs automating" apart from "already done."

## Traceability

The goal:

```
Requirement → Test → Execution → Result → Defect
```

I'd use the test-management tool's requirement/test relationships and
reporting to identify coverage gaps — in Xray, this is what the
**Traceability Report** is built for. In plain Jira, one useful,
verified mechanism is the `linkedWorkItems()` JQL function, which finds
work items connected via a specific link type:

```
project in (QASANDBOX) AND issuetype in (Test)
  AND work item not in linkedWorkItems("REQ-101")
```

The exact query depends on how the project's hierarchy and link types
are configured — this illustrates the mechanism, not a universal query
that works unmodified in every instance.

**Important distinction:** an unlinked test is a *review candidate*,
not automatically a defect or something to delete. It may legitimately
be exploratory testing, security testing, technical/infrastructure
testing, or a regression test written in response to a past production
incident — none of which need a formal requirement link to be valid.

```
No traceability found
        ↓
     Review
        ↓
Link / retain / consolidate / retire
```

## Rationalization

Once visibility exists, I'd review:
- Duplicate or overlapping coverage
- Missing traceability
- Execution history
- Historical defects and production incidents
- Business risk and change impact
- Dependencies between tests

**On duplicates — including near-duplicates, not just exact ones.**
Multiple test cases covering the same acceptance criteria with only
minor input variation, none of them boundary cases, are redundant
coverage rather than thorough coverage — worth consolidating into one
parameterized case. This isn't limited to identical tests: two cases
can be worded differently while testing the same underlying concept,
which is harder to catch by eye across a large suite. This is a
reasonable place to use an AI tool as an accelerator — feeding it a
batch of test titles and steps to flag likely conceptual overlaps for
human review — the same way AI is used elsewhere in this project: to
surface candidates faster, never to decide on its own what gets
removed.

**On execution history — evidence, not a rule.** A test that's passed
20+ times in a low-risk area may be a reasonable candidate for
consolidation or automation. It is *not* automatic grounds for removal
— a critical authentication test could pass 500 times in a row and
still be essential. Pass history is one input into the decision, never
the decision by itself.

Each reviewed test lands in one of: **Keep → Consolidate → Automate →
Retire.**

## Prioritization

Combine business impact, likelihood of failure, change impact,
dependencies, and historical/production defect evidence. The exact
scoring model should be agreed with the team — a simple version:

```
project in (QASANDBOX) AND issuetype in (Test)
  AND "Business Risk" in (Critical) AND "Regression" in (Yes)
```
→ the "cannot skip, ever" list.

```
project in (QASANDBOX) AND issuetype in (Test)
  AND "Regression" in (No)
```
→ the reconsideration list — cross-referenced against Business Risk,
since anything high-risk showing up here is a real coverage gap worth
surfacing, not an oversight to quietly fix.

## Automation backlog

Risk determines where strong coverage is needed. Automation suitability
is a separate decision. Good automation candidates are stable,
repeatable, deterministic, frequently executed, and valuable enough to
justify ongoing maintenance.

Example filter logic:
```
project in (QASANDBOX) AND issuetype in (Test)
  AND "Business Risk" in (Critical, High)
  AND priority in (Highest, High)
  AND "Automation Candidate" in (Yes)
  AND "Automation Status" in (Manual)
  ORDER BY priority DESC
```

Including `"Automation Status" in (Manual)` is what keeps this list
accurate over time — without it, a test automated last sprint would
still appear as if it still needed work, simply because it was
originally flagged as a candidate. The exact fields and syntax depend
on what's configured in the team's actual Jira/Xray instance — this is
illustrative filter logic, not a universal query.

### Fetching by situation, not just once

The same fields support a narrower, situational query — for example,
everything that must be covered for one specific upcoming release:

```
project in (QASANDBOX) AND issuetype in (Test)
  AND work item in linkedWorkItems("REL10-FEATURE-STORY")
  AND "Business Risk" in (Critical, High)
```

This answers a different question than the general automation backlog
— not "what should we eventually automate," but "what absolutely must
be covered for *this* release, on *this* functionality, right now."
Because priority and risk are attributes of the test itself, the same
metadata supports both questions, queried however the current situation
requires.
