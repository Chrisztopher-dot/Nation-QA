import { test, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';

test('user can login', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.loginAsTestUser();

  await expect(page).toHaveURL(/home/);

  await expect(
    page.getByText('EARLY ACCESS')
  ).toBeVisible();

});