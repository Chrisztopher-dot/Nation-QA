import { test, expect } from '@playwright/test';

test('session persists after page reload', async ({ page }) => {

  // Login
  await page.goto('https://nation.dev/');

  await page.getByRole('link', {
    name: 'Sign in'
  }).click();

  await page.getByRole('textbox', {
    name: 'Email address'
  }).fill(process.env.TEST_EMAIL!);

  await page.getByRole('textbox', {
    name: 'Password'
  }).fill(process.env.TEST_PASSWORD!);

  await page.getByRole('button', {
    name: 'Sign in'
  }).click();

  // Bekräfta login
  await expect(page).toHaveURL(/home/);

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