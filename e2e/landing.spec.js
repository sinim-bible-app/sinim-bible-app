// @ts-check
import { test, expect } from "@playwright/test";

test("visits the app root url", async ({ page, baseURL }) => {
    await page.goto(baseURL);
    await expect(page).toHaveTitle("Sinim Bible App");
});
