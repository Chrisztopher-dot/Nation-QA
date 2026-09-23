import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

test('jobs page loads correctly', async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.loginAsTestUser();

  await page.goto('https://nation.dev/jobs');

  await expect(page).toHaveURL(/jobs/);

  await expect(
    page.getByRole('tab', {
      name: 'For You'
    })
  ).toBeVisible();

  await expect(
    page.getByRole('tab', {
      name: 'Browse'
    })
  ).toBeVisible();

  await expect(
    page.getByRole('tab', {
      name: 'Partners'
    })
  ).toBeVisible();

  await expect(
    page.getByRole('tab', {
      name: 'Saved'
    })
  ).toBeVisible();

  await expect(
    page.getByRole('tab', {
      name: 'Applied'
    })
  ).toBeVisible();

});