import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://nation.dev/');

    await this.page.getByRole('link', {
      name: 'Sign in'
    }).click();
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
    await this.goto();

    await this.login(
      process.env.TEST_EMAIL!,
      process.env.TEST_PASSWORD!
    );

    await expect(this.page).toHaveURL(/home/);
  }
}