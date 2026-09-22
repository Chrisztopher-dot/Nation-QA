import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

test('negative salary investigation', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.loginAsTestUser();

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