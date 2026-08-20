import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import users from '../../test-data/users.json';

// Negative and boundary scenarios - deliberately not part of the happy-path E2E
test.describe('Negative and edge-case scenarios', () => {
  test('locked-out user is blocked with a clear error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.lockedOutUser.username, users.lockedOutUser.password);
    await login.expectLoginError('Sorry, this user has been locked out');
  });

  test('checkout cannot proceed without required shipping fields', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.standardUser.username, users.standardUser.password);

    await page.locator('.inventory_item', { hasText: 'Sauce Labs Backpack' })
      .getByRole('button', { name: 'Add to cart' }).click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('#checkout').click();
    await page.locator('#continue').click();

    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });
});
