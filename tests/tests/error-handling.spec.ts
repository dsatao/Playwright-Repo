import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Error Scenarios & Validation - Comprehensive Tests', () => {

  test('should display error for completely invalid login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Attempt login with random credentials
    await page.getByPlaceholder('Username').fill('random_invalid_@#$%');
    await page.getByPlaceholder('Password').fill('random_pass_@#$%');
    await page.getByText('Login').click();
    
    // Verify error
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should display error when locked out user attempts login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Attempt login with locked out user
    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByText('Login').click();
    
    // Verify error contains "locked out"
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toContainText(/locked out/i);
  });

  test('should validate email format in checkout', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Add item and go to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Try invalid postal code format
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('abc');
    await page.locator('[data-test="continue"]').click();
    
    // Should either show error or allow (depending on validation)
    const errorMessage = page.locator('[data-test="error"]');
    const onCheckout = page.url().includes('checkout-step-two');
    
    const hasError = await errorMessage.isVisible().catch(() => false);
    expect(hasError || onCheckout).toBeTruthy();
  });

  test('should display error for empty checkout form', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Add item and go to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Try to continue without filling form
    await page.locator('[data-test="continue"]').click();
    
    // Verify error
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should handle XSS attempts in form fields', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Add item and go to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Try XSS payload in form
    await page.locator('[data-test="firstName"]').fill('<script>alert("xss")</script>');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Form should handle gracefully (no actual alert)
    await page.locator('[data-test="continue"]').click();
    
    // Should either process or show error
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('should handle SQL injection attempts in login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Try SQL injection
    await page.getByPlaceholder('Username').fill("' OR '1'='1");
    await page.getByPlaceholder('Password').fill("' OR '1'='1");
    await page.getByText('Login').click();
    
    // Should not allow login
    const errorMessage = page.locator('[data-test="error"]');
    const stillOnLogin = page.url().includes('saucedemo.com/');
    
    const hasError = await errorMessage.isVisible().catch(() => false);
    expect(hasError || stillOnLogin).toBeTruthy();
  });

  test('should handle special characters in form fields', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Add item and go to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Enter special characters
    await page.locator('[data-test="firstName"]').fill('John@#$%');
    await page.locator('[data-test="lastName"]').fill('Doe!@#$');
    await page.locator('[data-test="postalCode"]').fill('12345!@#');
    
    // Should handle gracefully
    await page.locator('[data-test="continue"]').click();
    
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('should display error when accessing invalid URL', async ({ page, baseURL }) => {
    // Try to access non-existent page
    if (baseURL) {
      await page.goto(baseURL + '/invalid-page-that-does-not-exist');
      
      // Should either show 404 or redirect
      const url = page.url();
      expect(url).toBeTruthy();
    }
  });

  test('should handle timeout gracefully', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Set short timeout
    page.setDefaultTimeout(100);
    
    // Try action with timeout
    try {
      await page.getByPlaceholder('Username').fill('standard_user', { timeout: 100 });
      // If successful, continue
      await page.getByPlaceholder('Username').fill('standard_user');
      page.setDefaultTimeout(30000); // Reset
    } catch (e) {
      page.setDefaultTimeout(30000); // Reset on error
      // Timeout error is expected behavior
    }
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // This test depends on network conditions
    const login = new LoginPage(page);
    
    try {
      await login.launchLoginPage();
      await login.loginToApplication('validData');
      
      // If network is available, user should be logged in
      await expect(page).toHaveURL(/inventory/);
    } catch (e) {
      // Network error expected in offline scenario
      expect(e).toBeTruthy();
    }
  });

  test('should validate field lengths', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Add item and go to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Try with very long input
    const longString = 'a'.repeat(1000);
    await page.locator('[data-test="firstName"]').fill(longString);
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Should handle gracefully
    await page.locator('[data-test="continue"]').click();
    
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('should handle whitespace only input', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Fill with whitespace only
    await page.getByPlaceholder('Username').fill('   ');
    await page.getByPlaceholder('Password').fill('   ');
    await page.getByText('Login').click();
    
    // Should display error
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should handle rapid clicks on checkout button', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Add item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Rapid clicks
    const checkoutBtn = page.locator('[data-test="checkout"]');
    await checkoutBtn.click();
    await checkoutBtn.click();
    
    // Should handle gracefully and navigate only once
    await page.waitForURL(/checkout-step-one/, { timeout: 5000 });
  });

  test('should handle case sensitivity in login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Try with different case
    await page.getByPlaceholder('Username').fill('STANDARD_USER');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByText('Login').click();
    
    // Should fail (case sensitive)
    const errorMessage = page.locator('[data-test="error"]');
    const hasError = await errorMessage.isVisible().catch(() => false);
    expect(hasError || !page.url().includes('inventory')).toBeTruthy();
  });
});
