// @ts-check
import { test, expect } from "@playwright/test";

test("it visits the app root url", async ({ page, baseURL }) => {
    await page.goto(baseURL);
    await expect(page).toHaveTitle("Sinim Bible App");
});
