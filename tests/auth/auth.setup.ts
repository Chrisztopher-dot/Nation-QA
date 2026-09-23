import { test as setup, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

setup('authenticate', async ({ page }) => {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'TEST_EMAIL and TEST_PASSWORD must be set before running authenticated tests.'
    );
  }

  await page.goto('https://nation.dev/signin');

  if (new URL(page.url()).pathname !== '/home') {
    await page.getByRole('textbox', {
      name: 'Email address'
    }).fill(email);

    await page.getByRole('textbox', {
      name: 'Password'
    }).fill(password);

    await page.getByRole('button', {
      name: 'Sign in'
    }).click();
  }

  await expect(page).toHaveURL(/home/);

  mkdirSync(path.resolve(__dirname, '../../playwright-auth'), {
    recursive: true
  });

  await page.context().storageState({
    path: path.resolve(__dirname, '../../playwright-auth/user.json')
  });
});