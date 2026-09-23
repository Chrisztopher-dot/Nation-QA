import { expect, test } from '@playwright/test';

test('onboarding renders each profile section without saving changes', async ({ page }) => {
  await page.goto('https://nation.dev/onboarding');

  await expect(page).toHaveURL(/\/onboarding(?:[/?#]|$)/);
  await expect(page.getByRole('heading', { name: 'Progress' })).toBeVisible();

  await page.getByRole('button', {
    name: 'Personal Details',
    exact: true,
  }).click();
  await expect(page.getByRole('heading', {
    name: 'Personal Details',
    exact: true,
  })).toBeVisible();
  await expect(page.getByRole('button', {
    name: 'Date of Birth',
  })).toBeVisible();

  await page.getByRole('button', {
    name: 'Your Skills',
    exact: true,
  }).click();
  await expect(page.getByRole('heading', {
    name: 'Pick Your Skills',
  })).toBeVisible();
  await expect(page.getByText('Search and add skills')).toBeVisible();

  await page.getByRole('button', {
    name: 'Preferences',
    exact: true,
  }).click();
  await expect(page.getByRole('heading', {
    name: 'Your Preferences',
  })).toBeVisible();
  await expect(page.getByText('Expected full-time salary (USD/year)')).toBeVisible();

  await page.getByRole('button', {
    name: 'Complete Profile',
    exact: true,
  }).click();
  await expect(page.getByRole('heading', {
    name: 'Tell Me About Yourself',
  })).toBeVisible();
  await expect(page.getByRole('heading', {
    name: 'Work History',
  })).toBeVisible();
});