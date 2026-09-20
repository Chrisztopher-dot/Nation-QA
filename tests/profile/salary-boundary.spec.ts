import { test, expect } from '@playwright/test';

test('salary boundary investigation', async ({ page }) => {

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

  const salaryField = page.getByRole('spinbutton', {
    name: 'Expected full-time salary ('
  });

  const values = [
    '-1',
    '0',
    '1',
    '10',
    '1000',
    '10000'
  ];

  for (const value of values) {

    await salaryField.fill(value);

    await page.getByRole('button', {
      name: 'Save'
    }).click();

    await page.screenshot({
      path: `salary-${value}.png`,
      fullPage: true
    });

  }

});