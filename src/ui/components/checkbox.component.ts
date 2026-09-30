import { allure } from 'allure-playwright';
import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

/**
 * Класс, представляющий чекбоксы.
 * Наследуется от BaseComponent и использует его методы для взаимодействия.
 */
export class Checkbox extends BaseComponent {
  constructor(page: Page, parentOrLocator: string | Locator, locator?: string, name?: string) {
    super(page, parentOrLocator, locator, name);
  }

  async click(): Promise<void> {
    await allure.step(`Клик по "${this.name}"`, async () => {
      await this.element.click();
    });
  }

  async check(options?: { timeout?: number; force?: boolean }): Promise<void> {
    await allure.step(`Установка галочки "${this.name}"`, async () => {
      await this.element.check(options);
    });
  }

  async uncheck(options?: { timeout?: number; force?: boolean }): Promise<void> {
    await allure.step(`Снятие галочки "${this.name}"`, async () => {
      await this.element.uncheck(options);
    });
  }

  async isChecked(options?: { timeout?: number }): Promise<boolean> {
    return allure.step(`Проверка состояния галочки "${this.name}"`, async () => {
      return this.element.isChecked(options);
    });
  }
}
