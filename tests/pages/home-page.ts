import type { Locator, Page } from "@playwright/test";
import { setMaxIdleHTTPParsers } from "http";

export class HomePage {
    readonly page: Page;
    private searchTextBox: Locator;
    private searchBtn: Locator;
    sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


    constructor(page: Page) {
        this.page = page;
        this.searchTextBox = this.page.getByPlaceholder("Search Amazon");
        this.searchBtn = this.page.getByRole('button', { name: 'Go' });
    }

    async openAmazonHomePage() {
        await this.page.goto("https://www.amazon.com");
    }

    private async fillSearchTxtBox(searchTxt: string) {
       await this.searchTextBox.fill(searchTxt);
    }
    private async clickOnSearchBtn() {
        await this.searchBtn.click();
    }

    async searchWithText(searchTxt: string) {
        this.fillSearchTxtBox(searchTxt);
        //this.clickOnSearchBtn();
        //await this.sleep(50000);
    }

}