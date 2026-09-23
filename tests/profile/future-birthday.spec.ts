import { expect, test } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';
import { ProfilePage } from './ProfilePage';

test('date picker does not offer years beyond the current calendar year', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsTestUser();

  const profilePage = new ProfilePage(page);
  await profilePage.openPersonalDetails();

  const yearSelector = await profilePage.openDatePicker();
  const years = await yearSelector.locator('option').evaluateAll((options) =>
    options.map((option) => Number((option as HTMLOptionElement).value)),
  );

  expect(Math.max(...years)).toBe(new Date().getFullYear());
  expect(years).toContain(1900);
});
