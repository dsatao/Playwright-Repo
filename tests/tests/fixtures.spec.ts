import { test } from "@playwright/test";
import { HomePage } from "../pages/home-page";

test.describe('First Testing Suite', async () => {
    test('First Test Case', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.openAmazonHomePage(); // Ensure to await the method
    });

    test.afterEach('After Each', async () => {
        console.log("After Each");
    });

    test.beforeAll('Before All', async () => {
        console.log("Before All");
    });

    test.afterAll('After All', async () => {
        console.log("After All");
    });

    test.beforeEach('Before Each', async () => {
        console.log("Before Each");
    });

    test('skip based on browser name', async ({ browserName, page }) => {
        test.skip(browserName === 'chromium', 'Still working on fixing on chrome');
        const homePage = new HomePage(page);
        await homePage.openAmazonHomePage(); // Ensure to await the method
    });
})