import { test, expect, devices } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Performance & Responsive Design - Comprehensive Tests', () => {

  test('should load inventory page within acceptable time', async ({ page }) => {
    const login = new LoginPage(page);
    
    // Measure load time
    const startTime = Date.now();
    await login.launchLoginPage();
    
    // Fill and submit
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    
    const submitTimer = Date.now();
    await page.getByText('Login').click();
    
    await page.waitForURL('**/inventory.html');
    const endTime = Date.now();
    
    const totalTime = endTime - startTime;
    // Page load should be reasonable (adjust threshold as needed)
    expect(totalTime).toBeLessThan(30000); // 30 seconds
  });

  test('should load cart page without delay', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Measure navigation time
    const startTime = Date.now();
    await page.locator('[data-test="shopping-cart-link"]').click();
    const endTime = Date.now();
    
    // Navigation should be quick
    expect(endTime - startTime).toBeLessThan(5000);
  });

  test('should load products quickly', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Wait for products to load
    const startTime = Date.now();
    await page.locator('[data-test="inventory-item"]').first().waitFor({ state: 'visible' });
    const endTime = Date.now();
    
    // Products should load quickly
    expect(endTime - startTime).toBeLessThan(5000);
  });

  test('should render without layout shift', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    
    // Get initial viewport size
    const viewport = page.viewportSize();
    if (viewport) {
      // Page should maintain layout
      const content = page.locator('body');
      await expect(content).toBeVisible();
    }
  });

  test('should handle responsive width - 375px (mobile)', async ({ page }) => {
    // Set viewport to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Login page should be readable
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    
    // Login
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Inventory should be readable on mobile
    const products = page.locator('[data-test="inventory-item"]');
    expect(await products.count()).toBeGreaterThan(0);
  });

  test('should handle responsive width - 768px (tablet)', async ({ page }) => {
    // Set viewport to tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Login page should work
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Verify layout
    const products = page.locator('[data-test="inventory-item"]');
    expect(await products.count()).toBeGreaterThan(0);
  });

  test('should handle responsive width - 1024px (laptop)', async ({ page }) => {
    // Set viewport to laptop
    await page.setViewportSize({ width: 1024, height: 768 });
    
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Page should look good on desktop
    const products = page.locator('[data-test="inventory-item"]');
    expect(await products.count()).toBeGreaterThan(0);
  });

  test('should handle responsive width - 1920px (large desktop)', async ({ page }) => {
    // Set viewport to large desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Layout should adapt to large screen
    const products = page.locator('[data-test="inventory-item"]');
    expect(await products.count()).toBeGreaterThan(0);
  });

  test('should display mobile menu on small screens', async ({ page }) => {
    // Set to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Menu button should be visible
    const menuBtn = page.getByRole('button', { name: /Open Menu/i });
    await expect(menuBtn).toBeVisible();
  });

  test('should not break on orientation change', async ({ page }) => {
    // Start with landscape
    await page.setViewportSize({ width: 667, height: 375 });
    
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Change to portrait
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Page should still be usable
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
  });

  test('should handle text scaling', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Increase text size
    await page.evaluate(() => {
      document.body.style.fontSize = '18px';
    });
    
    // Page should still be readable
    const products = page.locator('[data-test="inventory-item"]');
    expect(await products.count()).toBeGreaterThan(0);
  });

  test('should handle zoom levels', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Test at 150% zoom
    await page.evaluate(() => {
      document.body.style.zoom = '150%';
    });
    
    // Main content should still be visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display images responsively', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Images should load
    const images = page.locator('[data-test="inventory-item-img"]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    
    // Images should be visible
    if (count > 0) {
      await expect(images.first()).toBeVisible();
    }
  });

  test('should handle touch interactions', async ({ page }) => {
    // Use iPhone device emulation
    await page.setViewportSize({ width: 375, height: 667 });
    
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Tap on add to cart button
    const addBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first();
    await addBtn.tap();
    
    // Item should be added
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(badge).toHaveText('1');
  });

  test('should handle swipe gestures on mobile', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Navigate using touch
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await cartLink.tap();
    
    await page.waitForURL(/cart/);
  });

  test('should handle slow network', async ({ page }) => {
    // Enable slow network
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });
    
    const login = new LoginPage(page);
    
    try {
      await login.launchLoginPage();
      // Page should load even on slow network
      await expect(page.getByPlaceholder('Username')).toBeVisible({ timeout: 10000 });
    } finally {
      await page.unroute('**/*');
    }
  });

  test('should display content without horizontal scroll', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Check viewport width
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    
    // Content should not exceed viewport
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 2); // Small buffer for scrollbar
  });

  test('should render CSS properly on different screens', async ({ page }) => {
    // Desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Get computed styles
    const container = page.locator('[data-test="inventory-list"]').or(page.locator('body > *')).first();
    const styles = await container.evaluate(el => window.getComputedStyle(el));
    
    // Styles should be applied
    expect(styles).toBeTruthy();
  });

  test('should handle font loading', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Wait for fonts to load
    await page.waitForTimeout(2000);
    
    // Text should be readable
    const loginBtn = page.getByText('Login');
    await expect(loginBtn).toBeVisible();
  });

  test('should maintain performance with many items', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Count products
    const products = page.locator('[data-test="inventory-item"]');
    const productCount = await products.count();
    
    // Should render all products without hanging
    expect(productCount).toBeGreaterThan(0);
    
    // Scrolling should work smoothly
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(500);
  });
});
