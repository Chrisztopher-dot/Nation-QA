import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://nation.dev/');

    const signInLink = this.page.getByRole('link', { name: 'Sign in' });
    const authenticatedUser = this.page.getByText('Tester', { exact: true });

    if (this.page.url().includes('/home') || await authenticatedUser.isVisible()) {
      return;
    }

    await signInLink.click();
  }

  async login(email: string, password: string) {
    await this.page.getByRole('textbox', {
      name: 'Email address'
    }).fill(email);

    await this.page.getByRole('textbox', {
      name: 'Password'
    }).fill(password);

    await this.page.getByRole('button', {
      name: 'Sign in'
    }).click();
  }

  async loginAsTestUser() {
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;

    if (!email || !password) {
      throw new Error(
        'TEST_EMAIL and TEST_PASSWORD must be set before running authenticated tests.'
      );
    }

    if (/home/.test(this.page.url()) ||
        await this.page.getByText('Tester', { exact: true }).isVisible()) {
      return;
    }

    await this.goto();

    await this.login(email, password);

    await expect(this.page).toHaveURL(/\/home(?:\/|$)/, {
      timeout: 30_000
    });
  }
}