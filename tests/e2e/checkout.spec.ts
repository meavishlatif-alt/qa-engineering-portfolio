import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import users from '../../test-data/users.json';

// Critical business flow: log in -> add product -> checkout -> confirmation
test.describe('Critical purchase journey', () => {
  test('standard user can log in, add a product, and complete checkout', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const checkout = new CheckoutPage(page);

    await login.goto();
    await login.login(users.standardUser.username, users.standardUser.password);
    await inventory.expectLoaded();

    await inventory.addProductToCart('Sauce Labs Backpack');
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.goToCart();
    await checkout.startCheckout();
    await checkout.fillShippingInfo('Meavish', 'Latif', '28001');
    await checkout.finishOrder();
    await checkout.expectOrderConfirmed();
  });
});
