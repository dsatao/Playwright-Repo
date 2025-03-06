import type { Locator, Page } from "@playwright/test";
import { setMaxIdleHTTPParsers } from "http";
import { CommonUtils } from "../utils/common-actions";
export class HomePage {
    readonly page: Page;

    sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    constructor(page: Page) {
        this.page = page;
    }

}