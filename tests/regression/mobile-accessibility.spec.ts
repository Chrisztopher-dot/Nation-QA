import { expect, test, type Page } from '@playwright/test';
import { LoginPage } from '../auth/LoginPage';

const mobileViewport = { width: 390, height: 844 };

async function expectNoHorizontalOverflow(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
}

test.describe('mobile accessibility smoke coverage', () => {
  test.use({ viewport: mobileViewport });

  test('sign-in controls retain accessible labels without horizontal overflow', async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: mobileViewport,
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    try {
      await page.goto('https://nation.dev/signin');

      await expect(
        page.getByRole('textbox', { name: 'Email address' }),
      ).toBeVisible();
      await expect(
        page.getByRole('textbox', { name: 'Password' }),
      ).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Sign in' }),
      ).toBeVisible();
      await expectNoHorizontalOverflow(page);
    } finally {
      await context.close();
    }
  });

  test('mobile sidebar exposes all primary navigation routes', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.loginAsTestUser();

    await page.setViewportSize(mobileViewport);

    await page.getByRole('button', { name: 'Toggle Sidebar' }).click();

    for (const route of ['Feed', 'Benchmarks', 'Jobs', 'Profile']) {
      await expect(
        page.getByRole('link', { name: route, exact: true }),
      ).toBeVisible();
    }
    await expectNoHorizontalOverflow(page);
  });

  test('jobs tabs are keyboard-operable', async ({ page }) => {
    test.fail(
      true,
      'The tablist does not move focus or selection when ArrowRight is pressed.',
    );

    const loginPage = new LoginPage(page);
    await loginPage.loginAsTestUser();

    await page.setViewportSize(mobileViewport);
    await page.goto('https://nation.dev/jobs');

    const forYouTab = page.getByRole('tab', { name: 'For You', exact: true });
    const browseTab = page.getByRole('tab', { name: 'Browse', exact: true });

    await forYouTab.focus();
    await page.keyboard.press('ArrowRight');

    await expect(browseTab).toBeFocused();
    await expect(browseTab).toHaveAttribute('aria-selected', 'true');
  });
});
