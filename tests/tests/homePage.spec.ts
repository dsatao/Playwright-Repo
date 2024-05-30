import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home-page';

test('search on amazon', async ({ page }) => {
    const home = new HomePage(page);
    await home.openAmazonHomePage();
  
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Amazon.com/);

    await home.searchWithText("Mens Watches");
  });
  