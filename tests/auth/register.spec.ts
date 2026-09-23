import { expect, test } from '@playwright/test';

test.describe('registration validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://nation.dev/signup');
  });

  test('requires all registration fields without creating an account', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByText('First name is required')).toBeVisible();
    await expect(page.getByText('Last name is required')).toBeVisible();
    await expect(page.getByText('Enter a valid email')).toBeVisible();
    await expect(page.getByText('Invalid phone number')).toBeVisible();
    await expect(page.getByText('Minimum 8 characters')).toHaveCount(2);
    await expect(page).toHaveURL(/\/signup(?:[/?#]|$)/);
  });

  test('rejects malformed email addresses without creating an account', async ({
    page,
  }) => {
    await page.locator('input[name="firstName"]').fill('QA');
    await page.locator('input[name="lastName"]').fill('Validation');
    await page.locator('input[name="email"]').fill('not-an-email');
    await page.locator('input[name="phoneNumber"]').fill('invalid');
    await page.locator('input[name="password"]').fill('valid-password');
    await page.locator('input[name="confirmPassword"]').fill('different-password');
    await page.getByRole('button', { name: 'Sign up' }).click();

    expect(await page.locator('input[name="email"]').evaluate(
      input => input.validity.valid,
    )).toBeFalsy();
    await expect(page).toHaveURL(/\/signup(?:[/?#]|$)/);
  });

  test('rejects mismatched passwords without creating an account', async ({ page }) => {
    await page.locator('input[name="firstName"]').fill('QA');
    await page.locator('input[name="lastName"]').fill('Validation');
    await page.locator('input[name="email"]').fill('qa-validation@example.invalid');
    await page.locator('input[name="phoneNumber"]').fill('invalid');
    await page.locator('input[name="password"]').fill('valid-password');
    await page.locator('input[name="confirmPassword"]').fill('different-password');
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByText('Invalid phone number')).toBeVisible();
    await expect(page.getByText('Passwords must match')).toBeVisible();
    await expect(page).toHaveURL(/\/signup(?:[/?#]|$)/);
  });
});