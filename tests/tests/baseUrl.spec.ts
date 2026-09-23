import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Base URL Coverage', () => {
  
  test('should navigate to base URL', async ({ page }) => {
    // Navigate using relative path (relies on baseURL from config)
    await page.goto('/');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('should load base URL and verify page is accessible', async ({ page }) => {
    await page.goto('/');
    // Verify page has loaded with login form
    const loginButton = page.getByText('Login');
    await expect(loginButton).toBeVisible();
  });

  test('should verify base URL is applied to all navigation', async ({ page }) => {
    await page.goto('/');
    const currentURL = page.url();
    expect(currentURL).toContain('saucedemo.com');
  });

  test('should navigate to inventory page with base URL after login', async ({ page }) => {
    // Login first to access protected page
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
    
    // Verify navigation to inventory page
    expect(page.url()).toContain('inventory.html');
  });

  test('should handle navigation correctly with base URL', async ({ page }) => {
    // Start at base URL
    await page.goto('/');
    const initialURL = page.url();
    expect(initialURL).toContain('saucedemo.com');
    expect(initialURL).toContain('://');
    
    // Verify login page is displayed
    const loginButton = page.getByText('Login');
    await expect(loginButton).toBeVisible();
  });
});
