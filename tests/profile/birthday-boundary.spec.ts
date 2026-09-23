import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';
import { ProfilePage } from './ProfilePage';

test('date picker retains the saved birthday as its selected year and date', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsTestUser();

  const profilePage = new ProfilePage(page);
  await profilePage.openPersonalDetails();

  const dateOfBirth = page.locator('#dateOfBirth');
  const savedDate = await dateOfBirth.innerText();
  const yearSelector = await profilePage.openDatePicker();
  const savedYear = new Date(
    savedDate.replace(/(\d+)(st|nd|rd|th)/, '$1'),
  ).getFullYear();

  await expect(yearSelector).toHaveValue(String(savedYear));
  await expect(
    page.getByRole('button', { name: new RegExp(savedDate.split(',')[0]) }),
  ).toBeVisible();
});