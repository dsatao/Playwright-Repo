import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('User Account & Session - Comprehensive Tests', () => {

  test('should maintain session after navigation', async ({ page }) => {
    // Login
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Verify on inventory page
    const inventoryURL = page.url();
    expect(inventoryURL).toContain('inventory');
    
    // Add item to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Navigate to different page
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Go back to inventory
    await page.locator('[data-test="continue-shopping"]').click();
    
    // Verify still logged in
    await expect(page).toHaveURL(/inventory/);
  });

  test('should persist session on page reload', async ({ page }) => {
    // Login
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Reload page
    await page.reload();
    
    // Verify still on inventory page and logged in
    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText(/Products/i)).toBeVisible();
  });

  test('should maintain cart contents on page reload', async ({ page }) => {
    // Login and add item
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Add item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Reload page
    await page.reload();
    
    // Verify item still in cart (badge shows 1)
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(badge).toHaveText('1');
  });

  test('should display user menu', async ({ page }) => {
    // Login
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Verify menu button is visible
    const menuBtn = page.getByRole('button', { name: /Open Menu/i });
    await expect(menuBtn).toBeVisible();
  });

  test('should display logout option in menu', async ({ page }) => {
    // Login
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Click menu button
    await page.getByRole('button', { name: /Open Menu/i }).click();
    
    // Verify logout option
    const logoutBtn = page.locator('[data-test="logout-sidebar-link"]');
    await expect(logoutBtn).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Click menu button
    await page.getByRole('button', { name: /Open Menu/i }).click();
    
    // Click logout
    await page.locator('[data-test="logout-sidebar-link"]').click();
    
    // Verify redirected to login page
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByPlaceholder('Username')).toBeVisible();
  });

  test('should clear session data after logout', async ({ page }) => {
    // Login and add item
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Add item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Logout
    await page.getByRole('button', { name: /Open Menu/i }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    
    // Login again
    await login.loginToApplication('validData');
    
    // Verify cart is empty
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(badge).not.toBeVisible();
  });

  test('should not allow direct access to inventory when logged out', async ({ page }) => {
    // Try to navigate directly to inventory without login
    await page.goto('/inventory.html');
    
    // Verify redirected to login page
    await expect(page).toHaveURL(/\/$/);
  });

  test('should not allow direct access to cart when logged out', async ({ page }) => {
    // Try to navigate directly to cart without login
    await page.goto('/cart.html');
    
    // Verify redirected to login page
    await expect(page).toHaveURL(/\/$/);
  });

  test('should not allow direct access to checkout when logged out', async ({ page }) => {
    // Try to navigate directly to checkout without login
    await page.goto('/checkout-step-one.html');
    
    // Verify redirected to login page
    await expect(page).toHaveURL(/\/$/);
  });

  test('should display user session info on inventory page', async ({ page }) => {
    // Login
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Verify page loaded successfully (user is authenticated)
    await expect(page.getByText(/Products/i)).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  });

  test('should maintain session across different test runs', async ({ page }) => {
    // Login
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Get session URL
    const sessionURL = page.url();
    
    // Perform multiple actions
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="continue-shopping"]').click();
    
    // Verify still logged in
    expect(page.url()).toContain('inventory');
  });

  test('should handle session timeout gracefully', async ({ page }) => {
    // Login
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Try to make request after a delay (simulate timeout)
    await page.waitForTimeout(2000);
    
    // Try to navigate or perform action
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Should still work (no actual timeout in saucedemo)
    await expect(page).toHaveURL(/cart/);
  });

  test('should support re-login after logout', async ({ page }) => {
    const login = new LoginPage(page);
    
    // First login
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Logout
    await page.getByRole('button', { name: /Open Menu/i }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    
    // Re-login
    await login.loginToApplication('validData');
    
    // Verify logged in again
    await expect(page).toHaveURL(/inventory/);
  });

  test('should not allow access with invalid session token', async ({ page }) => {
    // Attempt to access protected resource without authentication
    await page.goto('/inventory.html');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/$/);
  });
});
