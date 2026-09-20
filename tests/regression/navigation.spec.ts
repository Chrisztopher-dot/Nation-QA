import { test, expect } from '@playwright/test';

test('navigation works between pages', async ({ page }) => {

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

  await expect(page).toHaveURL(/home/);

  await page.goto('https://nation.dev/profile');

  await expect(page).toHaveURL(/profile/);

  await page.goBack();
  await expect(page).toHaveURL(/home/);

  await page.goForward();
  await expect(page).toHaveURL(/profile/);

  await page.reload();
  await expect(page).toHaveURL(/profile/);
});