import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

test('smoke test application health', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.loginAsTestUser();

  // Home
  await expect(page).toHaveURL(/home/);

  await expect(
    page.getByText('EARLY ACCESS')
  ).toBeVisible();

  // Profile
  await page.goto('https://nation.dev/profile');

  await expect(page).toHaveURL(/profile/);

  // Session
  await page.reload();

  await expect(page).toHaveURL(/profile/);

});