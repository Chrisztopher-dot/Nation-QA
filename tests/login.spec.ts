import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('https://nation.dev/login');

  await page.fill('[name="email"]', 'test@test.se');
  await page.fill('[name="password"]', 'password123');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/dashboard/);
});
``