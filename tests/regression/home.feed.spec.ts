import { expect, test } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

test('feed filters render the corresponding article states without mutating data', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsTestUser();

  await expect(page.getByText('Early Access')).toBeVisible();

  const allFilter = page.getByRole('button', { name: 'All', exact: true });
  const likedFilter = page.getByRole('button', { name: 'Liked', exact: true });
  const savedFilter = page.getByRole('button', { name: 'Saved', exact: true });
  const articleLinks = page.getByRole('link', {
    name: 'Read More',
    exact: true,
  });

  await allFilter.click();
  await expect.poll(() => articleLinks.count()).toBeGreaterThan(0);

  await likedFilter.click();
  await expect(articleLinks).toHaveCount(0);

  await savedFilter.click();
  await expect(articleLinks).toHaveCount(0);

  await allFilter.click();
  await expect.poll(() => articleLinks.count()).toBeGreaterThan(0);
});