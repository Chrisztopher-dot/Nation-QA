import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

test('future birthday selection investigation', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.loginAsTestUser();

  await page.goto('https://nation.dev/profile');

  await page.getByRole('button', {
    name: 'Personal Details'
  }).click();

  const dobButton = page.getByRole('button', {
    name: 'Date of Birth'
  });

  await dobButton.click();

  await page.screenshot({
    path: 'birthday-before-test.png',
    fullPage: true
  });

  await expect(dobButton).toBeVisible();
});