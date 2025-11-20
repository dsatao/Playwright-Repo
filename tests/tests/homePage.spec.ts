import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';
import { beforeEach } from 'node:test';
import { assert } from 'node:console';

test.describe("Initial Testing", () => {

  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.beforeTest();
  });

  test('search on amazon', async ({ page }) => {
    const home = new HomePage(page);
    await home.openAmazonHomePage();
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Amazon.com/);
    await home.searchWithText("Mens Watches");
  });

  test('search on amazon1', async ({ page }) => {
    const home = new HomePage(page);
    await home.openAmazonHomePage();
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Amazon.com/);
    await home.searchWithText("Mens Watches");
  });

  test.skip('search on amazon1 Skip', async ({ page }) => {
    const home = new HomePage(page);
    await home.openAmazonHomePage();
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Amazon.com/);
    await home.searchWithText("Mens Watches");
  });

  test.fail('search on amazon1 Fail', async ({ page }) => {
    const home = new HomePage(page);
    await home.openAmazonHomePage();
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Amazon1.com/);
    await home.searchWithText("Mens TShirts");
  });

  test.fixme('search on amazon1 FixMe', async ({ page }) => {
    const home = new HomePage(page);
    await home.openAmazonHomePage();
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Amazon.com/);
    await home.searchWithText("Mens Watches");
  });

  test('search on amazon1 Slow', async ({ page, browserName }) => {
    test.slow(browserName === 'chromium', 'This is slow test');
    const home = new HomePage(page);
    await home.openAmazonHomePage();
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Amazon.com/);
    await home.searchWithText("Mens Watches");
  });

  test.afterEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.afterTest();
  });
})
