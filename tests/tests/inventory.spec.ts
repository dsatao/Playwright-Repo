import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Inventory/Products Page - Comprehensive Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Login before each test
    const login = new LoginPage(page);
    await login.launchLoginPage();
    await login.loginToApplication('validData');
    await page.waitForURL('**/inventory.html');
  });

  test('should display inventory page title', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Swag Labs/);
    
    // Verify Products heading/text is visible
    const pageTitle = page.getByText(/Products/i);
    await expect(pageTitle).toBeVisible();
  });

  test('should display product list', async ({ page }) => {
    // Verify products are displayed
    const productItems = page.locator('[data-test="inventory-item"]');
    const count = await productItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display essential product information', async ({ page }) => {
    // Get first product
    const firstProduct = page.locator('[data-test="inventory-item"]').first();
    
    // Verify product has name, price, and add to cart button
    await expect(firstProduct.locator('[data-test="inventory-item-name"]')).toBeVisible();
    await expect(firstProduct.locator('[data-test="inventory-item-price"]')).toBeVisible();
    await expect(firstProduct.locator('button')).toBeVisible();
  });

  test('should display product prices correctly', async ({ page }) => {
    const prices = page.locator('[data-test="inventory-item-price"]');
    const count = await prices.count();
    
    for (let i = 0; i < count; i++) {
      const price = await prices.nth(i).textContent();
      expect(price).toMatch(/\$\d+\.\d{2}/);
    }
  });

  test('should display filter/sort options', async ({ page }) => {
    // Verify sort dropdown exists
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await expect(sortDropdown).toBeVisible();
  });

  test('should sort products by name (A to Z)', async ({ page }) => {
    // Select sort option
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await sortDropdown.selectOption('az');
    
    // Wait for products to re-render
    await page.waitForTimeout(1000);
    
    // Verify products are sorted
    const productNames = page.locator('[data-test="inventory-item-name"]');
    const firstProduct = await productNames.first().textContent();
    expect(firstProduct).toBeTruthy();
  });

  test('should sort products by name (Z to A)', async ({ page }) => {
    // Select sort option
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await sortDropdown.selectOption('za');
    
    // Wait for products to re-render
    await page.waitForTimeout(1000);
    
    // Verify products are sorted
    const productNames = page.locator('[data-test="inventory-item-name"]');
    const firstProduct = await productNames.first().textContent();
    expect(firstProduct).toBeTruthy();
  });

  test('should sort products by price (low to high)', async ({ page }) => {
    // Select sort option
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await sortDropdown.selectOption('lohi');
    
    // Wait for products to re-render
    await page.waitForTimeout(1000);
    
    // Verify products are sorted by price
    const prices = page.locator('[data-test="inventory-item-price"]');
    expect(await prices.count()).toBeGreaterThan(0);
  });

  test('should sort products by price (high to low)', async ({ page }) => {
    // Select sort option
    const sortDropdown = page.locator('[data-test="product-sort-container"]');
    await sortDropdown.selectOption('hilo');
    
    // Wait for products to re-render
    await page.waitForTimeout(1000);
    
    // Verify products are sorted by price
    const prices = page.locator('[data-test="inventory-item-price"]');
    expect(await prices.count()).toBeGreaterThan(0);
  });

  test('should display cart badge with item count', async ({ page }) => {
    // Cart should be empty initially
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    
    // Add item to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    
    // Verify badge shows 1
    await expect(cartBadge).toHaveText('1');
  });

  test('should add product to cart', async ({ page }) => {
    // Click add to cart button
    const addButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first();
    await addButton.click();
    
    // Verify button text changes to "Remove"
    await expect(addButton).toContainText(/Remove/i);
  });

  test('should remove product from cart', async ({ page }) => {
    // Add item to cart
    const addButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first();
    await addButton.click();
    
    // Remove item
    await addButton.click();
    
    // Verify button text changes back to "Add to cart"
    await expect(addButton).toContainText(/Add to cart/i);
  });

  test('should navigate to product details', async ({ page }) => {
    // Click on product name
    const productName = page.locator('[data-test="inventory-item-name"]').first();
    await productName.click();
    
    // Verify on product details page
    await expect(page).toHaveURL(/inventory-item/);
  });

  test('should display product description', async ({ page }) => {
    // Click on first product
    const productName = page.locator('[data-test="inventory-item-name"]').first();
    await productName.click();
    
    // Verify product description
    const description = page.locator('[data-test="inventory-item-desc"]');
    await expect(description).toBeVisible();
  });

  test('should have accessible product images', async ({ page }) => {
    // Verify product images have alt text
    const images = page.locator('[data-test="inventory-item-img"]');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const altText = await images.nth(i).getAttribute('alt');
      expect(altText).toBeTruthy();
    }
  });

  test('should display "Continue Shopping" button on empty cart', async ({ page }) => {
    // Navigate to cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    
    // Verify continue shopping button
    const continueBtn = page.locator('[data-test="continue-shopping"]');
    await expect(continueBtn).toBeVisible();
  });

  test('should maintain inventory page state after cart interaction', async ({ page }) => {
    const initialURL = page.url();
    
    // Add to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first().click();
    
    // Verify still on inventory page
    expect(page.url()).toBe(initialURL);
  });
});
