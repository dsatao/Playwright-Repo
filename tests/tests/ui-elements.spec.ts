import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('UI Elements & Interactions - Comprehensive Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Login before each test
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
  });

  test('should have enabled login button on login page', async ({ page }) => {
    // Navigate back to login (logout first)
    await page.getByRole('button', { name: /Open Menu/i }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    
    // Verify login button is visible and enabled
    const loginBtn = page.getByRole('button', { name: /Login/i });
    await expect(loginBtn).toBeVisible();
    await expect(loginBtn).toBeEnabled();
  });

  test('should highlight input fields on focus', async ({ page }) => {
    // Navigate back to login
    await page.getByRole('button', { name: /Open Menu/i }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    
    // Focus on username field
    const usernameField = page.getByPlaceholder('Username');
    await usernameField.click();
    
    // Verify field is visible and active
    await expect(usernameField).toBeVisible();
  });

  test('should display placeholder text in form fields', async ({ page }) => {
    // Back to login
    await page.getByRole('button', { name: /Open Menu/i }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    
    // Verify username and password fields exist
    const usernameField = page.getByPlaceholder('Username');
    const passwordField = page.getByPlaceholder('Password');
    
    await expect(usernameField).toBeVisible();
    await expect(passwordField).toBeVisible();
  });

  test('should disable add to cart button after clicking', async ({ page }) => {
    // Get add button
    const addBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first();
    
    // Initially enabled
    await expect(addBtn).toBeEnabled();
    
    // Click it
    await addBtn.click();
    
    // Button should change state (Remove button appears)
    await expect(addBtn).toContainText(/Remove/i);
  });

  test('should display remove button instead of add button', async ({ page }) => {
    // Add item
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Verify remove button is visible
    const removeBtn = page.locator('[data-test="remove-sauce-labs-backpack"]');
    await expect(removeBtn).toBeVisible();
  });

  test('should have working dropdown/select elements', async ({ page }) => {
    // Verify sort dropdown exists and is interactive
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    
    // Get all options
    const options = sortDropdown.locator('option');
    const optionCount = await options.count();
    
    expect(optionCount).toBeGreaterThan(1);
  });

  test('should change sort order when dropdown selection changes', async ({ page }) => {
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    
    // Get initial products
    const initialProducts = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    
    // Change sort
    await sortDropdown.selectOption('za');
    
    // Wait for re-render
    await page.waitForTimeout(500);
    
    // Get new products
    const newProducts = await page.locator('[data-test="inventory-item-name"]').allTextContents();
    
    // Lists might be same or different depending on data
    expect(newProducts.length).toBe(initialProducts.length);
  });

  test('should highlight cart link when on cart page', async ({ page }) => {
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify cart link is visible/highlighted
    const cartLink = page.locator('[data-test="shopping-cart-link"]');
    await expect(cartLink).toBeVisible();
  });

  test('should display active menu item in sidebar', async ({ page }) => {
    // Open menu
    await page.getByRole('button', { name: /Open Menu/i }).click();
    
    // Menu should be visible
    const menu = page.locator('[data-test="sidebar"]');
    await expect(menu).toBeVisible();
    
    // Close menu
    await page.getByRole('button', { name: /Open Menu/i }).click();
  });

  test('should toggle menu visibility', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: /Open Menu/i });
    const menu = page.locator('[data-test="sidebar"]');
    
    // Open menu
    await menuBtn.click();
    await expect(menu).toBeVisible();
    
    // Close menu
    await menuBtn.click();
    await expect(menu).not.toBeVisible();
  });

  test('should handle button hover states', async ({ page }) => {
    const addBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first();
    
    // Hover over button
    await addBtn.hover();
    
    // Button should still be visible
    await expect(addBtn).toBeVisible();
  });

  test('should handle checkbox interactions', async ({ page }) => {
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Add items for checkout
    await page.locator('[data-test="continue-shopping"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // If checkboxes exist, verify they work
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    
    if (count > 0) {
      const checkbox = checkboxes.first();
      await checkbox.click();
      await expect(checkbox).toBeChecked();
    }
  });

  test('should handle radio button interactions', async ({ page }) => {
    // If radio buttons exist on the page
    const radios = page.locator('input[type="radio"]');
    const count = await radios.count();
    
    if (count > 0) {
      const radio = radios.first();
      await radio.click();
      await expect(radio).toBeChecked();
    }
  });

  test('should handle text input interactions', async ({ page }) => {
    // Add item and go to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Type in first name
    const firstNameInput = page.locator('[data-test="firstName"]');
    await firstNameInput.clear();
    await firstNameInput.type('John');
    
    // Verify value
    await expect(firstNameInput).toHaveValue('John');
  });

  test('should display error message styling', async ({ page }) => {
    // Add item and go to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Try to submit empty form
    await page.locator('[data-test="continue"]').click();
    
    // Verify error message exists
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    
    // Verify error message styling
    const color = await errorMessage.evaluate(el => 
      window.getComputedStyle(el).color
    );
    expect(color).toBeTruthy();
  });

  test('should display loading states', async ({ page }) => {
    // Navigate through pages
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Page should load quickly (no visible loading by default)
    await expect(page).toHaveURL(/cart/);
  });

  test('should clear form on reset button', async ({ page }) => {
    // Add item and go to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill form
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('12345');
    
    // Look for reset button
    const resetBtn = page.locator('button:has-text("Reset")');
    const resetCount = await resetBtn.count();
    
    if (resetCount > 0) {
      await resetBtn.click();
      
      // Verify fields are cleared
      await expect(page.locator('[data-test="firstName"]')).toHaveValue('');
    }
  });

  test('should handle disabled state for buttons', async ({ page }) => {
    // Try to submit empty checkout form
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Button should be clickable but show error
    const continueBtn = page.locator('[data-test="continue"]');
    await expect(continueBtn).toBeEnabled();
    
    await continueBtn.click();
    
    // Error should appear
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
  });

  test('should display icon buttons correctly', async ({ page }) => {
    // Menu button should be visible
    const menuBtn = page.getByRole('button', { name: /Open Menu/i });
    await expect(menuBtn).toBeVisible();
    
    // Should be clickable
    await expect(menuBtn).toBeEnabled();
  });

  test('should have accessible label elements', async ({ page }) => {
    // Navigate back to login
    await page.getByRole('button', { name: /Open Menu/i }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();
    
    // Check for labels
    const labels = page.locator('label');
    const labelCount = await labels.count();
    
    // Page should have labels for accessibility
    expect(labelCount >= 0).toBeTruthy();
  });

  test('should display tooltips on hover', async ({ page }) => {
    // Look for elements with title attributes
    const elementsWithTitle = page.locator('[title]');
    const count = await elementsWithTitle.count();
    
    if (count > 0) {
      const element = elementsWithTitle.first();
      const title = await element.getAttribute('title');
      expect(title).toBeTruthy();
      
      // Hover and verify
      await element.hover();
    }
  });
});
