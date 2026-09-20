import { test, expect } from '@playwright/test';

test('home feed loads after login', async ({ page }) => {
  await page.goto('https://nation.dev/');

  await page.getByRole('link', {
    name: 'Sign in'
  }).click();

  // Ersätt med ditt testkonto
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

  await expect(
    page.getByText('EARLY ACCESS')
  ).toBeVisible();
});