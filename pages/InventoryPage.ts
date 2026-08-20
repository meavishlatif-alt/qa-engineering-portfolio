import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.inventoryItems = page.locator('.inventory_item');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory.html/);
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  async addProductToCart(productName: string) {
    const item = this.page.locator('.inventory_item', { hasText: productName });
    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}
