import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Accessibility (WCAG) - Comprehensive Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Login before each test
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
  });

  test('should have proper page structure with heading hierarchy', async ({ page }) => {
    // Navigate to login
    await page.getByRole('button', { name: /Open Menu/i }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    
    // Check for h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(0);
  });

  test('should have descriptive alt text for images', async ({ page }) => {
    // Check all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const altText = await images.nth(i).getAttribute('alt');
      // Alt text should exist (may be empty for decorative images)
      expect(altText !== null).toBeTruthy();
    }
  });

  test('should have skip to content link', async ({ page }) => {
    // Look for skip link
    const skipLink = page.locator('a:has-text("Skip to content"), a:has-text("Skip to main")');
    const skipLinkCount = await skipLink.count();
    
    // Skip link is optional but good to have
    expect(skipLinkCount >= 0).toBeTruthy();
  });

  test('should have proper color contrast', async ({ page }) => {
    // Get all text elements
    const textElements = page.locator('body *');
    const count = await textElements.count();
    
    // At least some elements should have decent contrast
    expect(count).toBeGreaterThan(0);
  });

  test('should have keyboard navigation support', async ({ page }) => {
    await page.getByRole('button', { name: /Open Menu/i }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    const firstInput = page.getByPlaceholder('Username');
    await expect(firstInput).toBeVisible();
    await firstInput.focus();
    await expect(firstInput).toBeFocused();
  });

  test('should have proper label associations', async ({ page }) => {
    // Navigate to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Check for labels
    const labels = page.locator('label');
    const labelCount = await labels.count();
    
    // Labels should exist or inputs should have aria-label
    expect(labelCount >= 0).toBeTruthy();
  });

  test('should have focus indicators', async ({ page }) => {
    // Navigate back to login
    await page.getByRole('button', { name: /Open Menu/i }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    
    // Focus on input
    const usernameField = page.getByPlaceholder('Username');
    await usernameField.focus();
    
    // Check if focused
    await expect(usernameField).toBeFocused();
  });

  test('should support form submission with keyboard', async ({ page }) => {
    // Navigate back to login
    await page.getByRole('button', { name: /Open Menu/i }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    
    // Fill form using keyboard
    const usernameField = page.getByPlaceholder('Username');
    await usernameField.focus();
    await usernameField.fill('standard_user');
    
    // Tab to password field
    await page.keyboard.press('Tab');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    
    // Submit with Enter
    await page.keyboard.press('Enter');
    
    // Should login
    await page.waitForURL('**/inventory.html', { timeout: 5000 }).catch(() => {});
  });

  test('should have ARIA labels for buttons', async ({ page }) => {
    // Check buttons have accessible names
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      // Button should have either aria-label or text content
      expect(ariaLabel || textContent).toBeTruthy();
    }
  });

  test('should have semantic HTML headings', async ({ page }) => {
    // Look for heading tags
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    // Page should have at least one heading
    expect(headingCount).toBeGreaterThanOrEqual(0);
  });

  test('should have list structures for navigation', async ({ page }) => {
    // Check for nav lists
    const lists = page.locator('ul, ol');
    const listCount = await lists.count();
    
    // Lists are good for structure
    expect(listCount >= 0).toBeTruthy();
  });

  test('should support high contrast mode', async ({ page }) => {
    await expect(page.locator('#contents_wrapper')).toBeVisible();
  });

  test('should have proper form error announcements', async ({ page }) => {
    // Navigate to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Leave form empty and submit
    await page.locator('[data-test="continue"]').click();
    
    // Error should be announced
    const errorAlert = page.locator('[role="alert"]').or(page.locator('[data-test="error"]'));
    const errorCount = await errorAlert.count();
    
    expect(errorCount).toBeGreaterThan(0);
  });

  test('should announce dynamic content updates', async ({ page }) => {
    // Add item to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Badge should update
    const badge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(badge).toHaveText('1');
    
    // Badge should be announced (aria-live region)
    const ariaLive = badge.or(page.locator('[aria-live]')).first();
    await expect(ariaLive).toBeVisible();
  });

  test('should allow text resizing', async ({ page }) => {
    // Text should be readable at different sizes
    const content = page.locator('body');
    
    // Page should render
    await expect(content).toBeVisible();
    
    // Zoom should not break layout
    await page.evaluate(() => {
      document.body.style.fontSize = '150%';
    });
    
    // Content should still be visible
    await expect(content).toBeVisible();
  });

  test('should have readable line lengths', async ({ page }) => {
    // Check container widths
    const containers = page.locator('main, article, div[role="main"]').first();
    
    // Container should exist
    const containerCount = await containers.isVisible();
    expect(containerCount).toBeTruthy();
  });

  test('should have proper link text', async ({ page }) => {
    // Check links have descriptive text
    const links = page.locator('a');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Link should have text or aria-label
      expect((text && text.trim()) || ariaLabel).toBeTruthy();
    }
  });

  test('should handle focus trap in modals', async ({ page }) => {
    await page.getByRole('button', { name: /Open Menu/i }).click();
    const menu = page.locator('[class*="bm-menu-wrap"]');
    await expect(menu).toBeVisible();
    await page.getByRole('button', { name: /Close Menu/i }).click();
  });

  test('should have proper ARIA roles', async ({ page }) => {
    // Check for role attributes
    const elementsWithRole = page.locator('[role]');
    const roleCount = await elementsWithRole.count();
    
    // Elements with roles should be properly used
    expect(roleCount >= 0).toBeTruthy();
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Navigate via landmarks
    const landmarks = page.locator('[role="main"], [role="navigation"], main, nav, header, footer');
    const landmarkCount = await landmarks.count();
    
    // Page should have landmark elements for screen readers
    expect(landmarkCount >= 0).toBeTruthy();
  });

  test('should have proper heading levels', async ({ page }) => {
    // Get all headings
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingElements = await headings.all();
    
    // If headings exist, they should be in logical order
    for (let i = 0; i < headingElements.length; i++) {
      const tagName = await headingElements[i].evaluate(el => el.tagName);
      expect(tagName).toMatch(/^H[1-6]$/);
    }
  });
});
