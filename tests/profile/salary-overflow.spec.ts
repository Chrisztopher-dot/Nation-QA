import { test, expect } from '@playwright/test';

test('hourly rate should not cause server error when value is extremely large', async ({ page }) => {

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

  await page.getByText('Preferences').click();

  const hourlyRateField = page.getByRole('spinbutton', {
    name: /Freelancing hourly rate/i
  });

  await hourlyRateField.fill(
    '999999999999999999999999999999'
  );

  await page.getByRole('button', {
    name: 'Save'
  }).click();

  await expect(page.locator('body'))
    .not.toContainText('500');
});