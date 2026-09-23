import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://nation.dev/signin');

    if (new URL(this.page.url()).pathname === '/home') {
      return true;
    }

    await expect(this.page).toHaveURL(/\/signin(?:[/?#]|$)/);
    await expect(this.page.getByRole('textbox', {
      name: 'Email address'
    })).toBeVisible();
    return false;
    return false;
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

    const isAuthenticated = await this.goto();

    if (!isAuthenticated) {
      await this.login(email, password);
    }

    await expect(this.page).toHaveURL(/\/home(?:\/|$)/, {
      timeout: 30_000
    });
  }
}