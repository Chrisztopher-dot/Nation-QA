import { expect, test } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

test('jobs tabs expose their expected states without saving or applying', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsTestUser();

  await page.goto('https://nation.dev/jobs');
  await expect(page).toHaveURL(/jobs/);

  const forYouTab = page.getByRole('tab', { name: 'For You', exact: true });
  const browseTab = page.getByRole('tab', { name: 'Browse', exact: true });
  const partnersTab = page.getByRole('tab', { name: 'Partners', exact: true });
  const savedTab = page.getByRole('tab', { name: 'Saved', exact: true });
  const appliedTab = page.getByRole('tab', { name: 'Applied', exact: true });

  await expect(forYouTab).toHaveAttribute('aria-selected', 'true');
  await expect.poll(() => page.getByRole('link').count()).toBeGreaterThan(6);

  await browseTab.click();
  await expect(browseTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText("You're all caught up.")).toBeVisible();

  await partnersTab.click();
  await expect(partnersTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText("You're all caught up.")).toBeVisible();

  await savedTab.click();
  await expect(savedTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: 'Apply Filters' })).toHaveCount(0);

  await appliedTab.click();
  await expect(appliedTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: 'Apply Filters' })).toHaveCount(0);
});