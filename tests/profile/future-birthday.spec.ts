import { test, expect } from '@playwright/test';

test('future birthday investigation', async ({ page }) => {

  // Login
  await page.goto('https://nation.dev/');

  await page.getByRole('link', {
    name: 'Sign in'
  }).click();

  await page.getByRole('textbox', {
    name: 'Email address'
  }).fill(process.env.TEST_EMAIL!);

  await page.getByRole('textbox', {
    name: 'Password'
  }).fill(process.env.TEST_PASSWORD!);

  await page.getByRole('button', {
    name: 'Sign in'
  }).click();

  await expect(page).toHaveURL(/home/);

  // Gå till profil
  await page.goto('https://nation.dev/profile');

  // Öppna Personal Details
  await page.getByRole('button', {
    name: 'Personal Details'
  }).click();

  // Öppna Date of Birth
  await page.getByRole('button', {
    name: 'Date of Birth'
  }).click();

  // Dokumentera hur datepickern ser ut
  await page.screenshot({
    path: 'future-birthday-datepicker.png',
    fullPage: true
  });
});