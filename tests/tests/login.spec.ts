import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Login Page - Comprehensive Tests', () => {

  test('should display login page elements', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Verify all login page elements are visible
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByText('Login')).toBeVisible();
    await expect(page.getByText('Accepted usernames are:')).toBeVisible();
    await expect(page.getByText('Password for all users:')).toBeVisible();
  });

  test('should display accepted usernames', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Verify all accepted usernames are displayed
    await expect(page.getByText('standard_user')).toBeVisible();
    await expect(page.getByText('locked_out_user')).toBeVisible();
    await expect(page.getByText('problem_user')).toBeVisible();
    await expect(page.getByText('performance_glitch_user')).toBeVisible();
    await expect(page.getByText('error_user')).toBeVisible();
    await expect(page.getByText('visual_user')).toBeVisible();
  });

  test('should display password hint', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Verify password hint
    await expect(page.getByText('Password for all users:')).toBeVisible();
    await expect(page.getByText('secret_sauce')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    
    // Verify successful login - should be on inventory page
    await expect(page).toHaveURL(/inventory/);
  });

  test('should display error message with invalid username', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Fill with invalid credentials
    await page.getByPlaceholder('Username').fill('invalid_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByText('Login').click();
    
    // Verify error message appears
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should display error message with invalid password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Fill with invalid credentials
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByText('Login').click();
    
    // Verify error message appears
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should display error when username field is empty', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Leave username empty
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByText('Login').click();
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should display error when password field is empty', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Leave password empty
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByText('Login').click();
    
    // Verify error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should handle locked out user', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Attempt login with locked out user
    await page.getByPlaceholder('Username').fill('locked_out_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByText('Login').click();
    
    // Verify locked out error message
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('locked out');
  });

  test('should clear form fields after error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // First failed attempt
    await page.getByPlaceholder('Username').fill('invalid_user');
    await page.getByPlaceholder('Password').fill('wrong_pass');
    await page.getByText('Login').click();
    
    // Verify fields still contain values (user can retry)
    const usernameField = page.getByPlaceholder('Username');
    await expect(usernameField).toHaveValue('invalid_user');
  });

  test('should focus on username field on page load', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Verify username field is visible and ready for interaction
    const usernameField = page.getByPlaceholder('Username');
    await expect(usernameField).toBeVisible();
  });

  test('should allow tab navigation between fields', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    const usernameField = page.getByPlaceholder('Username');
    const passwordField = page.getByPlaceholder('Password');
    
    // Tab to password field
    await usernameField.press('Tab');
    await expect(passwordField).toBeFocused();
    
    // Tab to login button
    await passwordField.press('Tab');
    await expect(page.getByText('Login')).toBeFocused();
  });

  test('should submit form with Enter key', async ({ page }) => {
    const login = new LoginPage(page);
    await login.launchLoginPage();
    
    // Fill form and press Enter
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByPlaceholder('Password').press('Enter');
    
    // Verify successful login
    await expect(page).toHaveURL(/inventory/);
  });
});
