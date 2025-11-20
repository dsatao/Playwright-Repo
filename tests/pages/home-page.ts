import type { Locator, Page } from "@playwright/test";
import { setMaxIdleHTTPParsers } from "http";
import { CommonUtils } from "../utils/common-actions";
export class HomePage {
    readonly page: Page;
    private searchTextBox: Locator;
    private searchBtn: Locator;
    constructor(page: Page) {
        this.page = page;
        this.searchTextBox = this.page.getByPlaceholder("Search Amazon");
        this.searchBtn = this.page.getByRole('button', { name: 'Go' });
    }

    async openAmazonHomePage() {
        await this.page.goto("https://www.amazon.com");
    }
    async beforeTest() {
        await console.log("Besfore Test")
    }

    async afterTest() {
        await console.log("After Test")
    }

    private async fillSearchTxtBox(searchTxt: string) {
        await this.searchTextBox.fill(searchTxt);
    }
    private async clickOnSearchBtn() {
       // await this.searchBtn.dblclick();
    }

    async searchWithText(searchTxt: string) {
       // await this.fillSearchTxtBox(searchTxt);
       // await this.clickOnSearchBtn();
    }

}