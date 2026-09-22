import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

test('salary overflow investigation', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.loginAsTestUser();

  await page.goto('https://nation.dev/profile');

  await page.getByRole('button', {
    name: 'Preferences'
  }).click();

  const hourlyRateField = page.getByRole('spinbutton', {
    name: /Freelancing hourly rate/i
  });

  await hourlyRateField.fill(
    '99999999999999999999999999999999999999'
  );

  await page.getByRole('button', {
    name: /save/i
  }).click();

  await page.screenshot({
    path: 'salary-after-save.png',
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
    'Stored value:',
    JSON.stringify(savedValue)
  );

  expect(savedValue).toBe(
    '99999999999999999999999999999999999999'
  );
});