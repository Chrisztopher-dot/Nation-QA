import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

test('navigation works between pages', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.loginAsTestUser();

  await page.goto('https://nation.dev/profile');

  await expect(page).toHaveURL(/profile/);

  await page.goBack();

  await expect(page).toHaveURL(/home/);

  await page.goForward();

  await expect(page).toHaveURL(/profile/);

  await page.reload();

  await expect(page).toHaveURL(/profile/);
});