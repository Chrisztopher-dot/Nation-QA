import { test, expect } from '@playwright/test';

test('future birthday selection investigation', async ({ page }) => {

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

  await page.goto('https://nation.dev/profile');

  await page.getByRole('button', {
    name: 'Personal Details'
  }).click();

  await page.getByRole('button', {
    name: 'Date of Birth'
  }).click();

  await page.screenshot({
    path: 'birthday-before-test.png',
    fullPage: true
  });

await expect(
  page.getByRole('button', {
    name: 'Date of Birth'
  })
).toBeVisible();
});