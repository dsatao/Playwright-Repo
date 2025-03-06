import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { HomePage } from '../pages/home-page';

test('Swag Labs Home Page', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    await loginPage.launchLoginPage();
  
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle("Swag Labs");
    await loginPage.loginToApplication("validData");
  });
  