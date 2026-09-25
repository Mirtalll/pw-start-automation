import { allure } from 'allure-playwright';
import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

/**
 * Класс, представляющий поля ввода.
 * Наследуется от BaseComponent и использует его методы для взаимодействия.
 */
export class Input extends BaseComponent {
  constructor(page: Page, parentOrLocator: string | Locator, locator?: string, name?: string) {
    super(page, parentOrLocator, locator, name);
  }

  async getText(): Promise<string> {
    return await allure.step(`Получение значения "${this.name}"`, async () => {
      return await this.element.inputValue();
    });
  }

  async fill(value: string, options?: { timeout?: number }): Promise<void> {
    await allure.step(`Заполнение "${this.name}" значением "${value}"`, async () => {
      await this.element.fill(value, options);
    });
  }

  async clear(options?: { timeout?: number }): Promise<void> {
    await allure.step(`Очистка "${this.name}"`, async () => {
      await this.element.clear(options);
    });
  }
}
