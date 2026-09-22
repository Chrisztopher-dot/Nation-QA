import { test } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

test('inspect current salary value', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.loginAsTestUser();

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