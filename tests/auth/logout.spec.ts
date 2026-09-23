import { test, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';

function formatUrl(url: string) {
  const parsedUrl = new URL(url);
  return `${parsedUrl.origin}${parsedUrl.pathname}`;
}

test('user can logout', async ({ page }, testInfo) => {
  const navigations: string[] = [];
  const responses: string[] = [];
  const failedRequests: string[] = [];

  const loginPage = new LoginPage(page);

  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      navigations.push(formatUrl(frame.url()));
    }
  });


  page.on('response', response => {
    const request = response.request();
    const resourceType = request.resourceType();
    const url = new URL(response.url());

    if (
      url.hostname.endsWith('nation.dev') &&
      ['document', 'fetch', 'xhr'].includes(resourceType)
    ) {
      responses.push(
        `${response.status()} ${request.method()} ${formatUrl(response.url())}`
      );
    }
  });

  page.on('requestfailed', request => {
    const url = new URL(request.url());

    if (url.hostname.endsWith('nation.dev')) {
      failedRequests.push(
        `${request.method()} ${formatUrl(request.url())}: ${request.failure()?.errorText ?? 'unknown failure'}`
      );
    }
  });

  try {
    await loginPage.loginAsTestUser();

    const accountMenu = page.getByRole('button', {
      name: /tester/i
    });

    await expect(
      accountMenu,
      'A fresh credential login must retain its session until the authenticated account menu is available.'
    ).toBeVisible({ timeout: 10_000 });

    await accountMenu.click();
    await page.getByText('Log out', { exact: true }).click();

    await expect(page).toHaveURL('https://nation.dev/');
    await expect(page.getByRole('link', {
      name: 'Sign in'
    })).toBeVisible();
  } finally {
    await testInfo.attach('authentication-session-diagnostics', {
      body: Buffer.from([
        `Final page URL: ${formatUrl(page.url())}`,
        '',
        'Main-frame navigations:',
        ...(navigations.length > 0 ? navigations : ['(none)']),
        '',
        'Nation responses:',
        ...(responses.length > 0 ? responses : ['(none)']),
        '',
        'Failed Nation requests:',
        ...(failedRequests.length > 0 ? failedRequests : ['(none)']),
      ].join('\n')),
      contentType: 'text/plain',
    });
  }
});