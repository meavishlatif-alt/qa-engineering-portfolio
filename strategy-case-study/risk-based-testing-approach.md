# Risk-Based Testing Approach

**Purpose:** how the application's identified test scenarios were assessed and prioritized based on product risk. The test inventory below (TC01-TC26) was established through personal exploration of the application, using `standard_user` / `secret_sauce` only — other seeded accounts are out of scope for this document.

Risk assessment and test automation are separate decisions. This document identifies, assesses, and prioritizes risk. See `automation-decision-matrix.md` for what should be automated.

`Priority` is a native Jira field. Its value here comes directly from the risk analysis below.

## Process

```text
Explore the application
        ↓
Identify test scenarios
        ↓
Assess impact and likelihood
        ↓
Assign testing priority
        ↓
Define test response
```

## How priority is determined

Each scenario is scored on **Impact** and **Likelihood**, both 1-3. Multiplying them gives a number that maps to one of four priority levels:

| Impact × Likelihood | Priority |
|---:|---|
| 1 | Low |
| 2 | Medium |
| 3-4 | High |
| 6 | Highest |

Project-specific scoring convention, not a prescribed industry formula.

**Impact:** 1 = minor consequence, limited effect. 2 = significant, noticeable functional/user impact. 3 = critical, core business flow blocked.

**Likelihood:** 1 = unlikely. 2 = possible. 3 = likely. A structured tester assessment based on available evidence, not a statistically measured probability.

## Worked example

> **TC15 — Complete checkout**
> **Potential failure:** customer cannot complete an order.
> **Consequence:** the core transaction flow is blocked entirely.
> **Evidence:** verified working correctly across multiple manual runs, including checkout-total accuracy checked against expected calculation each time.
> **Impact:** 3 — critical, failure blocks the core transaction.
> **Likelihood:** 2 — possible. Checkout is the most complex multi-step flow in the application, giving it more surface area for a future regression than a simple navigation or sort function.
> **Impact × Likelihood = 6 → Priority: Highest.**

A successful test run doesn't make the underlying priority Low — the test proves the scenario currently works; the assessment reflects consequence and potential for future failure. The same reasoning was applied to every row below.

## Test cases and risk register

| ID | Scenario | Evidence Status | Impact | Likelihood | Priority | Test Response |
|---|---|---|---:|---:|---|---|
| TC01 | Valid login | Confirmed | 3 | 2 | Highest | Positive functional test |
| TC02 | Empty username + password | Confirmed | 2 | 2 | High | Negative/validation test |
| TC03 | Valid username, empty password | Confirmed | 2 | 2 | High | Negative/validation test |
| TC04 | Invalid username, empty password | Confirmed | 2 | 1 | Medium | Negative/validation test |
| TC05 | Empty username, valid/invalid password | Confirmed | 2 | 2 | High | Negative/validation test |
| TC06 | Invalid username + password (message visually cut off) | Confirmed | 2 | 2 | High | Negative test + layout defect |
| TC07 | Sort Name Z→A | Confirmed | 1 | 1 | Low | Functional check |
| TC08 | Sort Name A→Z | Confirmed | 1 | 1 | Low | Functional check |
| TC09 | Sort Price low→high | Confirmed | 1 | 1 | Low | Functional check |
| TC10 | Sort Price high→low | Confirmed | 1 | 1 | Low | Functional check |
| TC11 | Add item to cart | Confirmed | 3 | 2 | Highest | Functional test |
| TC12 | Remove item (main page + cart page) | Confirmed | 3 | 2 | Highest | Functional + state check |
| TC13 | Continue Shopping | Confirmed | 1 | 1 | Low | Functional check |
| TC14 | Add multiple items | Confirmed | 3 | 2 | Highest | Functional test |
| TC15 | Complete checkout | Confirmed | 3 | 2 | Highest | E2E critical-path test |
| TC16 | Generate PDF receipt, verify content | Confirmed | 2 | 1 | Medium | Functional + content validation |
| TC17 | Back Home resets cart/buttons | Confirmed | 3 | 2 | Highest | Functional + state check |
| TC18 | Checkout required-field validation (sequential) | Confirmed | 3 | 2 | Highest | Negative test |
| TC19 | No input restriction — First/Last Name, Postal Code | Confirmed | 1 | 2 | Medium | Defect — input validation |
| TC20 | Side menu open/close | Confirmed | 1 | 1 | Low | Functional check |
| TC21 | "All Items" navigation | Confirmed | 1 | 1 | Low | Functional check |
| TC22 | "About" navigation | Confirmed | 1 | 1 | Low | Functional check |
| TC23 | Logout | Confirmed | 3 | 1 | High | Functional + session check |
| TC24 | Reset App State clears cart | Confirmed | 3 | 1 | High | Functional + state check |
| TC25 | Checkout total = sum of item prices + tax | Confirmed — verified manually across 4 orders | 3 | 1 | High | Calculation/validation check |
| TC26 | Empty cart, Continue still enabled, $0 checkout proceeds | Observed; expected behaviour unconfirmed | — | — | **Open question** | Clarify with Product before scoring |

**TC19:** Medium priority, same tier as TC04 and TC16. A confirmed defect doesn't automatically raise priority — priority reflects impact and likelihood, not defect status.

## Priority groups

**Highest:** TC01, TC11, TC12, TC14, TC15, TC17, TC18
**High:** TC02, TC03, TC05, TC06, TC23, TC24, TC25
**Medium:** TC04, TC16, TC19
**Low:** TC07-TC10, TC13, TC20-TC22
**Open question:** TC26 — expected behaviour hasn't been established, no priority forced.

## Risk control

| Priority | Testing response |
|---|---|
| Highest | Strongest regression attention, deeper functional/state coverage |
| High | Regular regression coverage, targeted negative/functional testing |
| Medium | Basic functional coverage, track any confirmed defects separately |
| Low | Basic functional coverage; deeper testing only if new evidence raises priority |
| Open question | Clarify expected behaviour before assigning any priority |

Revisited when the application changes, new defects are found, or new evidence changes the assessment.

## Related files

`automation-decision-matrix.md` — what should be automated, using Priority from this document as one of four inputs.
`test-suite-organization-and-rationalization.md` — how tests are structured, tagged, and queried at scale.