import type { Page } from 'playwright';
import type { Locator } from "@playwright/test";

export class CommonUtils {
    static async isVisible(page: Page, locator: string): Promise<boolean> {
        await page.waitForSelector(locator);
        return await page.isVisible(locator);
    }
}
