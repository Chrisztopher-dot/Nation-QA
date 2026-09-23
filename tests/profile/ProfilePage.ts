import { expect, Locator, Page } from '@playwright/test';

export type PreferenceState = {
  expectedFullTimeSalary: string;
  freelancingHourlyRate: string;
};

const ordinal = (day: number): string => {
  if (day % 100 >= 11 && day % 100 <= 13) {
    return `${day}th`;
  }

  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

export class ProfilePage {
  constructor(private readonly page: Page) {}

  private get expectedFullTimeSalary(): Locator {
    return this.page.locator('#expectedFullTimeSalary');
  }

  private get freelancingHourlyRate(): Locator {
    return this.page.locator('#freelancingHourlyRate');
  }

  private get savePreferencesButton(): Locator {
    return this.page.getByRole('button', { name: 'Save', exact: true });
  }

  async openPreferences(): Promise<void> {
    await this.page.goto('https://nation.dev/profile');
    await this.page.getByRole('button', { name: /Preferences/ }).click();
    await expect(this.expectedFullTimeSalary).toBeVisible();
    await expect(this.freelancingHourlyRate).toBeVisible();
  }

  async readPreferenceState(): Promise<PreferenceState> {
    return {
      expectedFullTimeSalary: await this.expectedFullTimeSalary.inputValue(),
      freelancingHourlyRate: await this.freelancingHourlyRate.inputValue(),
    };
  }

  async savePreferenceState(state: PreferenceState): Promise<void> {
    await this.expectedFullTimeSalary.fill(state.expectedFullTimeSalary);
    await this.freelancingHourlyRate.fill(state.freelancingHourlyRate);
    await this.savePreferencesButton.click();
  }

  async reloadPreferences(): Promise<void> {
    await this.page.reload();
    await this.page.getByRole('button', { name: /Preferences/ }).click();
    await expect(this.expectedFullTimeSalary).toBeVisible();
  }

  async expectPreferenceState(state: PreferenceState): Promise<void> {
    await expect(this.expectedFullTimeSalary).toHaveValue(
      state.expectedFullTimeSalary,
    );
    await expect(this.freelancingHourlyRate).toHaveValue(
      state.freelancingHourlyRate,
    );
  }

  async withPreferenceState(
    action: (originalState: PreferenceState) => Promise<void>,
  ): Promise<void> {
    const originalState = await this.readPreferenceState();

    try {
      await action(originalState);
    } finally {
      await this.savePreferenceState(originalState);
      await this.reloadPreferences();
      await this.expectPreferenceState(originalState);
    }
  }

  async openPersonalDetails(): Promise<void> {
    await this.page.goto('https://nation.dev/profile');
    await this.page.getByRole('button', { name: 'Personal Details' }).click();
    await expect(this.page.locator('#dateOfBirth')).toBeVisible();
  }

  async openDatePicker(): Promise<Locator> {
    const dateOfBirth = this.page.locator('#dateOfBirth');
    await dateOfBirth.click();

    const yearSelector = this.page.getByLabel('Choose the Year');
    await expect(yearSelector).toBeVisible();
    return yearSelector;
  }

  async readDateOfBirth(): Promise<string> {
    return this.page.locator('#dateOfBirth').innerText();
  }

  async selectDateOfBirth(date: Date): Promise<void> {
    await this.openDatePicker();
    await this.page
      .getByLabel('Choose the Month')
      .selectOption(String(date.getMonth()));
    await this.page
      .getByLabel('Choose the Year')
      .selectOption(String(date.getFullYear()));

    const dateLabel = `${date.toLocaleDateString('en-US', {
      weekday: 'long',
    })}, ${date.toLocaleDateString('en-US', {
      month: 'long',
    })} ${ordinal(date.getDate())},`;

    await this.page.getByRole('button', { name: dateLabel }).click();
  }

  async savePersonalDetails(): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Save Personal Details' })
      .click();
  }

  async reloadPersonalDetails(): Promise<void> {
    await this.page.reload();
    await this.page.getByRole('button', { name: 'Personal Details' }).click();
    await expect(this.page.locator('#dateOfBirth')).toBeVisible();
  }

  async withDateOfBirth(
    action: (originalDate: string) => Promise<void>,
  ): Promise<void> {
    const originalDate = await this.readDateOfBirth();

    try {
      await action(originalDate);
    } finally {
      const parsedDate = new Date(
        originalDate.replace(/(\d+)(st|nd|rd|th)/, '$1'),
      );

      if (Number.isNaN(parsedDate.getTime())) {
        throw new Error(
          `Cannot restore the saved date of birth: "${originalDate}".`,
        );
      }

      await this.selectDateOfBirth(parsedDate);
      await this.savePersonalDetails();
      await this.reloadPersonalDetails();
      await expect(this.page.locator('#dateOfBirth')).toHaveText(originalDate);
    }
  }
}
