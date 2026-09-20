import { test, expect } from '@playwright/test';

test('birthday allows year 1900 and persists after reload', async ({ page }) => {

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


await page.getByRole('button', {
  name: 'Personal Details'
}).click();

await page.getByRole('button', {
  name: 'Date of Birth'
}).click();

  // Välj år 1900
  await page.getByLabel('Choose the Year')
    .selectOption('1900');

  // Välj datum
  await page.getByRole('button', {
    name: 'Wednesday, September 12th,'
  }).click();

  // Spara
  await page.getByRole('button', {
    name: 'Save Personal Details'
  }).click();

// Ladda om sidan
await page.reload();

// Öppna Personal Details igen
await page.getByRole('button', {
  name: 'Personal Details'
}).click();

// Ta screenshot
await page.screenshot({
  path: 'birthday-after-reload.png',
  fullPage: true
});
});