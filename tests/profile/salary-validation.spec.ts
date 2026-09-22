import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

test('salary validation investigation', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.loginAsTestUser();

  await page.goto('https://nation.dev/profile');

  await page.getByRole('button', {
    name: 'Preferences'
  }).click();

  const salaryField = page.getByRole('spinbutton', {
    name: 'Expected full-time salary ('
  });

  await salaryField.fill('0');

  await page.getByRole('button', {
    name: 'Save'
  }).click();

  await page.reload();

  await page.getByRole('button', {
    name: 'Preferences'
  }).click();

  const reloadedField = page.getByRole('spinbutton', {
    name: 'Expected full-time salary ('
  });

  const savedValue =
    await reloadedField.inputValue();

  console.log(
    'Zero salary stored:',
    JSON.stringify(savedValue)
  );

  expect(savedValue).toBe('0');
});