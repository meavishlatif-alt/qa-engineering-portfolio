# Sample Defect Write-Up (Root-Cause Investigation Template)

This file is a worked example of how to document a defect found through
this test suite, tracing it from symptom to root cause. Use it as a
template for real findings.

---

## DEFECT-TEMPLATE-01

**Title:** Checkout completes even though cart badge showed 0 items

**Symptom (what the test caught):**
`checkout.spec.ts` failed on the assertion `expect(inventory.cartBadge).toHaveText('1')`
— the badge never appeared, even though `addProductToCart()` reported no
error.

**Investigation trail:**
1. **UI** - re-ran the test with `--headed` and `trace: on` to watch the
   click happen; the "Add to cart" button visibly toggled to "Remove",
   suggesting the click registered.
2. **Locator** - inspected the DOM via the Playwright trace viewer;
   confirmed the cart badge locator (`.shopping_cart_badge`) was correct
   and stable.
3. **Network** - opened the trace's network tab; confirmed no request
   was actually failing (this app manages cart state client-side, so
   there's no API call to inspect here - in a real system, this step
   would check the add-to-cart API response and status code).
4. **State** - added a `page.pause()` right after the click to manually
   inspect application state; found the badge only fails to render if
   the click fires before the inventory page has fully hydrated.

**Root cause:** Test was clicking "Add to cart" before the page's
JavaScript had finished attaching event listeners - a timing/race
condition in the test, not the application. Fixed by waiting on
`inventory.expectLoaded()` (which asserts the first inventory item is
visible) before interacting, rather than assuming `page.goto()`
completion meant the page was interactive.

**Resolution:** No application defect - test flakiness fixed by
strengthening the wait condition. Documented here anyway, because
"the test was wrong, not the app" is itself a valid and useful root-cause
conclusion, not a failure to find a bug.

---

## How to use this template for a real finding
Replace each section with your own investigation. Keep the structure:
**Symptom -> UI -> Network/API -> Data/State -> Root cause -> Resolution.**
That trail is what turns "the test failed" into an actual engineering
explanation - and it's the story worth telling in an interview.
