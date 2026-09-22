import { test, expect } from '@playwright/test';

test('negative salary investigation', async ({ page }) => {

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
    name: /Freelancing hourly rate/i
  });

  await hourlyRateField.fill('-999999');

  await page.getByRole('button', {
    name: /save/i
  }).click();

  await page.screenshot({
    path: 'negative-salary-save.png',
    fullPage: true
  });

  await page.reload();

  await page.getByRole('button', {
    name: 'Preferences'
  }).click();

  const reloadedField = page.getByRole('spinbutton', {
    name: /Freelancing hourly rate/i
  });

const savedValue =
  await reloadedField.inputValue();

console.log(
  'Negative salary stored:',
  JSON.stringify(savedValue)
);

expect(savedValue).toBe('-999999');
});