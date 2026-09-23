import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Shopping Cart - Comprehensive Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Login and navigate to inventory
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
  });

  test('should display empty cart message', async ({ page }) => {
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify cart page loads with Your Cart heading
    const cartHeading = page.getByText(/Your Cart/i);
    await expect(cartHeading).toBeVisible();
    
    // Verify continue shopping button is displayed
    const continueBtn = page.locator('[data-test="continue-shopping"]');
    await expect(continueBtn).toBeVisible();
  });

  test('should display continue shopping button', async ({ page }) => {
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify continue shopping button
    const continueBtn = page.locator('[data-test="continue-shopping"]');
    await expect(continueBtn).toBeVisible();
  });

  test('should add single item to cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(1);
  });

  test('should add multiple items to cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);
  });

  test('should display correct item details in cart', async ({ page }) => {
    // Add item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify item details
    const itemName = page.locator('[data-test="inventory-item-name"]');
    await expect(itemName).toBeVisible();
    
    const itemPrice = page.locator('[data-test="inventory-item-price"]');
    await expect(itemPrice).toBeVisible();
  });

  test('should display quantity selector', async ({ page }) => {
    // Add item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify quantity display
    const quantity = page.locator('[data-test="item-quantity"]');
    await expect(quantity).toBeVisible();
  });

  test('should remove item from cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(0);
  });

  test('should display subtotal accurately', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.getByText('Description')).toBeVisible();
  });

  test('should calculate cart total correctly', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page.getByText('$29.99')).toBeVisible();
  });

  test('should display tax amount', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
  });

  test('should show checkout button', async ({ page }) => {
    // Add item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify checkout button
    const checkoutBtn = page.locator('[data-test="checkout"]');
    await expect(checkoutBtn).toBeVisible();
  });

  test('should navigate to checkout', async ({ page }) => {
    // Add item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Click checkout
    await page.locator('[data-test="checkout"]').click();
    
    // Verify on checkout page
    await expect(page).toHaveURL(/checkout/);
  });

  test('should continue shopping from cart', async ({ page }) => {
    // Add item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Click continue shopping
    await page.locator('[data-test="continue-shopping"]').click();
    
    // Verify back on inventory page
    await expect(page).toHaveURL(/inventory/);
  });

  test('should persist cart items on page reload', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.reload();

    const cartItems = page.locator('.cart_item');
    await expect(cartItems.first()).toBeVisible();
  });

  test('should display cart badge after adding items', async ({ page }) => {
    // Add item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Verify badge shows 1
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(badge).toHaveText('1');
  });

  test('should update badge when removing items from cart', async ({ page }) => {
    // Add 2 items
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').first().click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Remove item
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    
    // Verify badge shows 1
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(badge).toHaveText('1');
  });
});
