import { test, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';

const protectedRoutes = [
  'https://nation.dev/home',
  'https://nation.dev/profile',
];

function formatUrl(url: string) {
  const parsedUrl = new URL(url);
  return `${parsedUrl.origin}${parsedUrl.pathname}`;
}

test.describe('authentication session resilience', () => {
  for (const route of protectedRoutes) {
    test(`unauthenticated visitors are redirected from ${new URL(route).pathname}`, async ({
      page,
    }) => {
      await page.goto(route);

      await expect(page).toHaveURL(/\/signin(?:[/?#]|$)/);
      await expect(page.getByRole('textbox', {
        name: 'Email address',
      })).toBeVisible();
    });
  }

  test('a fresh sign-in persists across reload, protected navigation, and a new tab', async ({
    page,
    context,
  }, testInfo) => {
    const navigations: string[] = [];
    const loginPage = new LoginPage(page);

    page.on('framenavigated', frame => {
      if (frame === page.mainFrame()) {
        navigations.push(formatUrl(frame.url()));
      }
    });

    try {
      await loginPage.loginAsTestUser();

      const accountMenu = page.getByRole('button', {
        name: /tester/i,
      });

      await expect(
        accountMenu,
        'A fresh credential sign-in must retain its session until authenticated navigation is available.'
      ).toBeVisible({ timeout: 10_000 });

      await page.reload();
      await expect(page).toHaveURL(/\/home(?:[/?#]|$)/);
      await expect(accountMenu).toBeVisible();

      await page.goto('https://nation.dev/profile');
      await expect(page).toHaveURL(/\/profile(?:[/?#]|$)/);
      await expect(accountMenu).toBeVisible();

      const secondPage = await context.newPage();
      await secondPage.goto('https://nation.dev/home');

      await expect(secondPage).toHaveURL(/\/home(?:[/?#]|$)/);
      await expect(secondPage.getByRole('button', {
        name: /tester/i,
      })).toBeVisible();
    } finally {
      await testInfo.attach('fresh-session-navigation', {
        body: Buffer.from([
          `Final page URL: ${formatUrl(page.url())}`,
          '',
          'Main-frame navigations:',
          ...(navigations.length > 0 ? navigations : ['(none)']),
        ].join('\n')),
        contentType: 'text/plain',
      });
    }
  });
});
