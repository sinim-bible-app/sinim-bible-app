// @ts-check
import { test, expect } from "@playwright/test";

test.use({ javaScriptEnabled: false });

test("it warns user that javascript is required", async ({ page, baseURL }) => {
    await page.goto(baseURL);
    await expect(page.getByRole("heading")).toHaveText([
        "JavaScript is disabled, please enable to use this app.",
        "JavaScript 已禁用，请启用以使用此应用程序。",
    ]);
});
