import { test, expect } from '@playwright/test';

test('birthday datepicker investigation', async ({ page }) => {

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

  await page.getByRole('button', {
    name: 'Personal Details'
  }).click();

  const dobButton = page.getByRole('button', {
    name: 'Date of Birth'
  });

  await dobButton.click();

  await page.screenshot({
    path: 'birthday-datepicker-open.png',
    fullPage: true
  });

  await expect(dobButton).toBeVisible();
});