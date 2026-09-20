import { test, expect } from '@playwright/test';

test('salary overflow investigation', async ({ page }) => {

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
    name: 'Preferences'
  }).click();

  const hourlyRateField = page.getByRole('spinbutton', {
    name: 'Freelancing hourly rate (USD/'
  });

  await hourlyRateField.fill(
    '999999999999999999999999999999'
  );

  await page.getByRole('button', {
    name: 'Save'
  }).click();

  await page.screenshot({
    path: 'salary-overflow.png',
    fullPage: true
  });

});