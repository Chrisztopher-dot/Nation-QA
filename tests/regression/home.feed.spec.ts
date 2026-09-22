import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

test('home feed loads after login', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.loginAsTestUser();

  await expect(
    page.getByText('EARLY ACCESS')
  ).toBeVisible();

});