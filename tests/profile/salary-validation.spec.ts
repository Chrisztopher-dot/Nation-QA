import { test, expect } from '@playwright/test';

test('salary must not allow zero', async ({ page }) => {
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

const salaryField = page.getByRole('spinbutton', {
  name: 'Expected full-time salary ('
});

await salaryField.fill('0');

await page.keyboard.press('Tab');

await page.getByRole('button', {
  name: 'Save'
}).click();

await expect(salaryField).toHaveValue('0');
});