import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

test('session persists after page reload', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.loginAsTestUser();

  // Reload sidan
  await page.reload();

  // Ska fortfarande vara inloggad
  await expect(page).toHaveURL(/home/);

  // Gå till profil
  await page.goto('https://nation.dev/profile');

  await expect(page).toHaveURL(/profile/);

  // Reload igen
  await page.reload();

  // Ska fortfarande vara på profil
  await expect(page).toHaveURL(/profile/);
});