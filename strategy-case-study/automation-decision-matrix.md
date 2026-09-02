# Automation Decision Matrix

**Purpose:** a reusable framework for deciding what to automate, applied to this project's real, risk-assessed test scenarios (see `risk-based-testing-approach.md`).

Priority tells you what deserves strong coverage. Automation suitability is a separate decision. `Priority` values come directly from the risk analysis in `risk-based-testing-approach.md`.

## The four factors

- **Priority** — set by the risk analysis (Highest / High / Medium / Low)
- **Frequency** — how often is this exercised?
- **Stability** — does the behavior change often, or is it settled?
- **Determinism** — is there one clear, checkable expected outcome?

A high-priority scenario is not automatically a good automation candidate: if its behavior isn't stable or deterministic, it stays manual, regardless of priority. A low-priority scenario can still be worth automating if it's cheap, frequent, and deterministic.

## Applied matrix

| TC ref | Scenario | Priority | Frequency | Stability | Determinism | Automate? | Layer |
|---|---|---|---|---|---|---|---|
| TC01 | Valid login | Highest | Every release | Stable | Yes | **Yes** | E2E |
| TC15 | Checkout completes end-to-end | Highest | Every release | Stable | Yes | **Yes** | E2E — critical path |
| TC11/TC14 | Add single/multiple items to cart | Highest | Every release | Stable | Yes | **Yes** | E2E |
| TC12 | Remove item from cart (both locations) | Highest | Every regression | Stable | Yes | **Yes** | E2E |
| TC17 | Back Home resets cart/buttons | Highest | Every regression | Stable | Yes | **Yes** | E2E |
| TC18 | Checkout blocked on missing required field | Highest | Every regression | Stable | Yes | **Yes** | E2E — negative |
| TC25 | Cart total, tax, and order total accuracy | High | Every checkout | Stable | Yes | **Yes** | E2E (ideally unit-level — see `test-strategy.md`) |
| TC16 | Generate PDF order receipt | Medium | Every completed order | Stable | Yes | **Yes** | E2E |
| TC07-TC10 | Product sorting | Low | Every regression | Stable | Yes | **Yes** | E2E / UI |
| TC19 | Postal/name fields accept unrestricted input | Medium | Every regression | Stable | Yes | **Yes** | E2E / UI |

## Decision flow

```text
Risk priority
      +
Execution frequency
      +
Behaviour stability
      +
Deterministic outcome
      ↓
Automation decision
```

Check Priority, then Frequency, Stability, and Determinism. Automate only when Priority is meaningful *and* the behavior is stable and deterministic enough to trust an automated check. Revisit if the application's behavior, frequency, or maintenance cost changes.

## Related files

`risk-based-testing-approach.md` — where Priority values come from.
`test-suite-organization-and-rationalization.md` — how automation decisions are tagged and queried at scale.