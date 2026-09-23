import { expect, test } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';
import { ProfilePage } from './ProfilePage';

test('historical birthday persists after reload and restores the shared account state', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsTestUser();

  const profilePage = new ProfilePage(page);
  await profilePage.openPersonalDetails();

  await profilePage.withDateOfBirth(async () => {
    const historicalDate = new Date(1900, 8, 12);

    await profilePage.selectDateOfBirth(historicalDate);
    await profilePage.savePersonalDetails();
    await profilePage.reloadPersonalDetails();

    await expect(page.locator('#dateOfBirth')).toHaveText(
      'September 12th, 1900',
    );
  });
});