import { test, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';

test('user can logout', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.loginAsTestUser();

  // Öppna användarmenyn
  await page.getByText('Tester').click();

  // Logga ut
  await page.getByText('Log out').click();

  // Ska inte längre vara på home
  await expect(page).not.toHaveURL(/home/);

  // Ska kunna se Sign in igen
  await expect(
    page.getByRole('link', {
      name: 'Sign in'
    })
  ).toBeVisible();

});