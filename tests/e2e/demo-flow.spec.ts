import { expect, test } from "@playwright/test";

test("demo user can inspect dashboard, run simulation, and open report", async ({ page }) => {
  await page.goto("/login", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible();
  await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /pricing change command center/i })).toBeVisible();
  await page.goto("/simulations/new", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /scenario builder/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /run simulation/i })).toBeVisible();
  await page.goto("/simulations/scenario-sso-audit-pro-to-enterprise/results", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /simulation results/i })).toBeVisible();
  await page.getByRole("link", { name: /open report/i }).click();
  await expect(page.getByRole("heading", { name: "Impact report", exact: true })).toBeVisible();
  await expect(page.getByText("Executive summary", { exact: true })).toBeVisible();
});
