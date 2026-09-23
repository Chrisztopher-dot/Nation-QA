import { test, expect } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';
import { ProfilePage } from './ProfilePage';

test('valid salary persists after reload and restores the shared account state', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsTestUser();

  const profilePage = new ProfilePage(page);
  await profilePage.openPreferences();

  await profilePage.withPreferenceState(async (originalState) => {
    const updatedState = {
      ...originalState,
      expectedFullTimeSalary: '120000',
    };

    await profilePage.savePreferenceState(updatedState);
    await profilePage.reloadPreferences();
    await profilePage.expectPreferenceState(updatedState);
    expect(updatedState.expectedFullTimeSalary).not.toBe(
      originalState.expectedFullTimeSalary,
    );
  });
});