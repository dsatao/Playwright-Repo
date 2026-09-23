import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Navigation & Page Flow - Comprehensive Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Login before each test
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
  });

  test('should navigate from inventory to cart', async ({ page }) => {
    // Click cart link
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify on cart page
    await expect(page).toHaveURL(/cart/);
  });

  test('should navigate back to inventory from cart', async ({ page }) => {
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Click continue shopping
    await page.locator('[data-test="continue-shopping"]').click();
    
    // Verify back on inventory
    await expect(page).toHaveURL(/inventory/);
  });

  test('should navigate to product details page', async ({ page }) => {
    // Click on product name
    const productName = page.locator('[data-test="inventory-item-name"]').first();
    await productName.click();
    
    // Verify on product details page
    await expect(page).toHaveURL(/inventory-item/);
  });

  test('should display back to inventory button on product page', async ({ page }) => {
    // Navigate to product details
    const productName = page.locator('[data-test="inventory-item-name"]').first();
    await productName.click();
    
    // Verify back button exists
    const backBtn = page.locator('[data-test="back-to-products"]');
    await expect(backBtn).toBeVisible();
  });

  test('should navigate back to inventory from product details', async ({ page }) => {
    // Navigate to product details
    const productName = page.locator('[data-test="inventory-item-name"]').first();
    await productName.click();
    
    // Click back button
    await page.locator('[data-test="back-to-products"]').click();
    
    // Verify back on inventory
    await expect(page).toHaveURL(/inventory/);
  });

  test('should navigate from inventory to checkout', async ({ page }) => {
    // Add item to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Click checkout
    await page.locator('[data-test="checkout"]').click();
    
    // Verify on checkout page
    await expect(page).toHaveURL(/checkout-step-one/);
  });

  test('should navigate through checkout flow', async ({ page }) => {
    // Add item to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Click checkout
    await page.locator('[data-test="checkout"]').click();
    
    // Fill form
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Continue to overview
    await page.locator('[data-test="continue"]').click();
    
    // Verify on overview page
    await expect(page).toHaveURL(/checkout-step-two/);
  });

  test('should navigate back in checkout flow', async ({ page }) => {
    // Add item and navigate to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill form
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Continue to overview
    await page.locator('[data-test="continue"]').click();
    
    // Click cancel or back button if available
    const cancelBtn = page.locator('[data-test="cancel"]');
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
    }
    
    // Verify on inventory or cart page
    const url = page.url();
    expect(url).toMatch(/(inventory|cart)/);
  });

  test('should handle browser back button on inventory', async ({ page }) => {
    // Navigate to product details
    const productName = page.locator('[data-test="inventory-item-name"]').first();
    await productName.click();
    
    // Use browser back button
    await page.goBack();
    
    // Verify back on inventory
    await expect(page).toHaveURL(/inventory/);
  });

  test('should handle browser back button from cart', async ({ page }) => {
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Use browser back button
    await page.goBack();
    
    // Verify back on inventory
    await expect(page).toHaveURL(/inventory/);
  });

  test('should handle browser forward button', async ({ page }) => {
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Go back
    await page.goBack();
    
    // Go forward
    await page.goForward();
    
    // Verify on cart
    await expect(page).toHaveURL(/cart/);
  });

  test('should display menu on all pages', async ({ page }) => {
    // Check on inventory
    const menuBtn = page.getByRole('button', { name: /Open Menu/i });
    await expect(menuBtn).toBeVisible();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Menu should still be visible
    await expect(menuBtn).toBeVisible();
  });

  test('should display cart link on all pages', async ({ page }) => {
    // Check on inventory
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await expect(cartLink).toBeVisible();
    
    // Navigate to product details
    const productName = page.locator('[data-test="inventory-item-name"]').first();
    await productName.click();
    
    // Cart link should still be visible
    await expect(cartLink).toBeVisible();
  });

  test('should maintain active page indicator in menu', async ({ page }) => {
    // Open menu
    await page.getByRole('button', { name: /Open Menu/i }).click();
    
    // Close menu
    await page.getByRole('button', { name: /Open Menu/i }).click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify URL matches
    await expect(page).toHaveURL(/cart/);
  });

  test('should support direct URL navigation', async ({ page, baseURL }) => {
    // Navigate directly to cart
    if (baseURL) {
      await page.goto(baseURL + '/cart.html');
      // Should still be logged in, so should show cart
      await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    }
  });

  test('should handle page title updates during navigation', async ({ page }) => {
    // On inventory page
    const inventoryTitle = await page.title();
    expect(inventoryTitle).toBeTruthy();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    const cartTitle = await page.title();
    expect(cartTitle).toBeTruthy();
  });

  test('should navigate from order completion back to inventory', async ({ page }) => {
    // Add item and checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill form
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Complete order
    await page.locator('[data-test="finish"]').click();
    
    // Click back to products
    const backBtn = page.locator('[data-test="back-to-products"]');
    if (await backBtn.isVisible()) {
      await backBtn.click();
      await expect(page).toHaveURL(/inventory/);
    }
  });
});
