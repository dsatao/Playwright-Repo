import type { Locator, Page } from "@playwright/test";
import { setMaxIdleHTTPParsers } from "http";
import { CommonUtils } from "../utils/common-actions";
import {loginData} from "../resources/data.json";

export class LoginPage {
    readonly page: Page;
    sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    private userNameTxt: Locator;
    private passwordTxt: Locator;
    private loginBtn: Locator;
    constructor(page: Page) {
        this.page = page;
        this.userNameTxt = this.page.getByPlaceholder("Username");
        this.passwordTxt = this.page.getByPlaceholder("Password");
        this.loginBtn = this.page.getByText("Login");
    }

    async launchLoginPage() {
        await this.page.goto("/");
        await this.page.waitForTimeout(3000);
    }

    async loginToApplication(dataKey:string ) {
        await this.userNameTxt.fill(loginData[dataKey].userName);
        await this.passwordTxt.fill(loginData[dataKey].password);
        await this.loginBtn.click();
    }
}