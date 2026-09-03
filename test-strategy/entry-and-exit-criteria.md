# Entry and Exit Criteria

**Purpose:** A lightweight framework to reduce delivery and quality risk by establishing what should be considered before work starts and what should be satisfied before it is considered complete.

This is **proposed guidance**, adapted through team agreement rather than a fixed rule. Teams may adjust the criteria based on applicable standards, product needs, organizational requirements, and collective agreement.

---

## 1. Definition of Ready — Entry Criteria

The **Definition of Ready (DoR)** provides guidance on whether a backlog item is sufficiently understood to begin development.

### Proposed checklist

- Business/user need is considered and stated
- Acceptance criteria are defined and testable
- Expected behaviour is clearly specified
- Validation and error behaviour is considered
- Relevant data/state requirements are considered
- Known dependencies are identified and not blocking
- The work is estimable by the team
- A wireframe or mockup is attached where the story involves UI
- Scope is appropriately sized

The checklist is intended to provide **visibility and a shared point of consideration**, not to create a rigid gate that every story must completely satisfy before work can begin.

Development can begin when the team agrees that the story is sufficiently understood and any remaining uncertainty is manageable.

The exact criteria can vary based on the product, industry standards, organizational requirements, and team consensus.

**Recommended implementation:** Add the DoR checklist directly to the Jira user story as a custom checklist so that the considerations remain visible and checkable while the story is being prepared.

---

## 2. Refinement and Three Amigos

Refinement is a continuous activity used to add clarity, detail, estimates, and appropriate ordering to backlog items. Teams can determine when and how much refinement they need. [1]

For items being prepared for a Sprint, the relevant refinement and DoR considerations should normally be addressed before Sprint Planning.

```text
Backlog Item
     ↓
Refinement
     ↓
Three Amigos / Clarification
     ↓
DoR Review
     ↓
Sprint Planning
```

**Three Amigos** provides a collaborative mechanism for Product/Business, Development, and QA to establish shared understanding and agree on expected behaviour and acceptance criteria.

Three Amigos discussions can also happen **at any time during the development cycle** when new questions, dependencies, or clarification needs emerge.

Refinement should remain adaptable to the team's working model rather than being treated as a fixed meeting or ceremony.

---

## 3. QA Considerations During Refinement

QA should use refinement and Three Amigos discussions to identify areas that may need clarification before development begins.

| Area | What to consider |
|---|---|
| **Expected behaviour** | What happens in the normal flow? What is the expected outcome? |
| **Validation & negative behaviour** | What happens with missing or invalid input? Are boundary conditions relevant? What validation rules apply? What error message or response is expected? |
| **Data & state** | What data is required? What happens with existing, missing, invalid, or duplicate data? Does the action change application state? |
| **Dependencies** | Are there dependent services, systems, teams, configurations, or other backlog items? Could any dependency affect delivery or testing? |
| **Testability** | What observable evidence demonstrates that the requirement is satisfied? Can the acceptance criteria be objectively verified? |

The objective is **not to create the complete test specification during refinement**.

The objective is to identify important questions early and ensure there is enough clarity for development and testing to proceed without unnecessary guesswork.

---

## 4. Definition of Done — Exit Criteria

The **Definition of Done (DoD)** defines the conditions that should be satisfied before a backlog item is considered complete.

A Definition of Done should provide a shared understanding of what "Done" means for the team and product. [2]

The DoD is established and maintained through **team and organizational agreement**. QA contributes quality and testing considerations but does not own the Definition of Done alone.

The following provides a proposed baseline and should be adapted to the organization's product, process, and quality requirements.

### Standard DoD Checklist

- Acceptance criteria are satisfied
- Required development work is completed and reviewed
- Required automated and/or manual testing is completed
- Required build and deployment checks have passed
- Known defects are reviewed and dispositioned according to team/release policy
- Required UAT or business acceptance is completed, where applicable
- Required documentation is updated
- Required Product Owner/business acceptance is completed, where applicable
- QA quality and visibility checks are completed

### QA Quality and Visibility Checks

As part of the agreed Definition of Done, QA should verify that testing and quality risks are visible and appropriately communicated:

- **Acceptance criteria tested and results recorded**
- **Risk-based testing completed for important scenarios**
- **Agreed regression scope executed**
- **Regression coverage and untested areas are visible**
- **Deferred testing is documented and remaining risk communicated**
- **Known defects and their disposition are documented**
- **Test results/evidence are available where required**
- **Applicable non-functional checks completed**, such as accessibility
- **Significant quality risks communicated before completion/release**

> **The objective is not 100% testing in every situation. Testing completed, testing deferred, known defects, and remaining quality risks should be visible so the team can make an informed decision.**

---

## 5. DoR vs. DoD

| | Definition of Ready | Definition of Done |
|---|---|---|
| **Question** | Can we start this confidently? | Can we consider this complete? |
| **Focus** | Clarity and readiness | Completion and quality |
| **Purpose** | Reduce ambiguity before development | Establish the agreed completion and quality standard |
| **Mechanism** | Refinement / Three Amigos / Jira checklist | Development / Testing / Review / Acceptance |
| **Ownership** | Team working agreement | Team and organizational agreement |

---

## Operating Model

```text
Backlog Item Created
        ↓
Refinement + Three Amigos
        ↓
DoR Checklist Reviewed
        ↓
Ready for Sprint Planning
        ↓
Development + Testing
        ↕
Refinement / Three Amigos as needed
        ↓
DoD Checklist Reviewed
        ↓
Sprint Review
```

### Working Principle

- **DoR** provides direction on what should be considered before starting.
- **Refinement and Three Amigos** establish shared understanding and can continue whenever clarification is needed.
- **QA** identifies testing, risk, validation, data, dependency, and testability considerations.
- **DoD** establishes the agreed completion and quality standard.
- **QA quality checks** make testing coverage, gaps, defects, evidence, and remaining risks visible rather than silent.

These criteria are **not hard-and-fast rules**. They are a practical baseline that teams can review, adapt, and improve through collective discussion.

**Important:** Sprint Review is shown as a point for inspection and collaboration, not as the event that makes work "Done." In Scrum, work is considered Done when it meets the agreed Definition of Done; Sprint Review is used to inspect the Increment and adapt the Product Backlog.

