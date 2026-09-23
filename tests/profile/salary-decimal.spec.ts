import { test } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';
import { ProfilePage } from './ProfilePage';

test('decimal hourly rate is rejected without changing the saved value', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsTestUser();

  const profilePage = new ProfilePage(page);
  await profilePage.openPreferences();

  await profilePage.withPreferenceState(async (originalState) => {
    await profilePage.savePreferenceState({
      ...originalState,
      freelancingHourlyRate: '100.5',
    });
    await profilePage.reloadPreferences();
    await profilePage.expectPreferenceState(originalState);
  });
});
