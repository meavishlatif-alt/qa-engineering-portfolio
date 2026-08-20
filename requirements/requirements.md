# Feature: Checkout Journey (Sauce Labs demo application)

## User Story
As a returning customer
I want to log in, add a product to my cart, and complete checkout
So that I can purchase an item

## Acceptance Criteria
- A user with valid credentials can log in and reach the inventory page.
- A locked-out user is blocked and shown a clear error message.
- Adding a product to the cart updates the cart badge count.
- Checkout requires first name, last name, and postal code before continuing.
- Submitting a completed order shows a confirmation message.

## Out of scope for this exercise
- Real payment processing (the demo site does not process real cards).
- Account registration (the demo site uses fixed seeded accounts).

## Notes / assumptions
- Treated as a public demo application for practice purposes, not a real
  production system - used here to demonstrate test strategy and coverage,
  not to represent MarsAir or any client work.
