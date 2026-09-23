import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Checkout Flow - Comprehensive Tests', () => {

  async function addItemToCart(page: any) {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Add item to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
  }

  test('should display checkout info page', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Verify on checkout page
    await expect(page).toHaveURL(/checkout-step-one/);
    await expect(page.getByText(/Checkout: Your Information/i)).toBeVisible();
  });

  test('should display checkout form fields', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Verify form fields
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
  });

  test('should display continue button on checkout page', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Verify continue button
    const continueBtn = page.locator('[data-test="continue"]');
    await expect(continueBtn).toBeVisible();
  });

  test('should display error when firstName is empty', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill only lastName and zip
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click continue without firstName
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should display error when lastName is empty', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill only firstName and zip
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click continue without lastName
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should display error when postal code is empty', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill only firstName and lastName
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    
    // Click continue without postal code
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should proceed to checkout overview with valid data', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill form with valid data
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Click continue
    await page.locator('[data-test="continue"]').click();
    
    // Verify on overview page
    await expect(page).toHaveURL(/checkout-step-two/);
  });

  test('should display checkout overview page', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate through checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Verify overview page
    await expect(page.getByText(/Checkout: Overview/i)).toBeVisible();
  });

  test('should display cart items on overview page', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate through checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Verify item is displayed
    const cartItem = page.locator('[data-test="cart-item"]');
    expect(await cartItem.count()).toBeGreaterThan(0);
  });

  test('should display order summary', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate through checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Verify order summary
    await expect(page.locator('[data-test="subtotal-label"]')).toBeVisible();
    await expect(page.locator('[data-test="tax-label"]')).toBeVisible();
    await expect(page.locator('[data-test="total-label"]')).toBeVisible();
  });

  test('should display finish button', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate through checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Verify finish button
    const finishBtn = page.locator('[data-test="finish"]');
    await expect(finishBtn).toBeVisible();
  });

  test('should display cancel button', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate to checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Verify cancel button
    const cancelBtn = page.locator('[data-test="cancel"]');
    await expect(cancelBtn).toBeVisible();
  });

  test('should complete order successfully', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate through checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Click finish
    await page.locator('[data-test="finish"]').click();
    
    // Verify order completion
    await expect(page.getByText(/Order dispatched/i)).toBeVisible();
    await expect(page).toHaveURL(/checkout-complete/);
  });

  test('should display order confirmation message', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate through checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Click finish
    await page.locator('[data-test="finish"]').click();
    
    // Verify confirmation
    await expect(page.getByText(/Thank you for your order/i)).toBeVisible();
  });

  test('should display back home button after order completion', async ({ page }) => {
    await addItemToCart(page);
    
    // Navigate through checkout
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    await page.locator('[data-test="continue"]').click();
    
    // Click finish
    await page.locator('[data-test="finish"]').click();
    
    // Verify back home button
    const backBtn = page.locator('[data-test="back-to-products"]');
    await expect(backBtn).toBeVisible();
  });
});
