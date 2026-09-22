import { test, expect } from '@playwright/test';

test('inspect current salary value', async ({ page }) => {

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
    name: /Expected full-time salary/i
  });

  const value =
    await salaryField.inputValue();

  console.log(
    'CURRENT SALARY VALUE:',
    JSON.stringify(value)
  );

});