import { allure } from 'allure-playwright';
import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

/**
 * Класс, представляющий кнопки.
 * Наследуется от BaseComponent и использует его методы для взаимодействия.
 */
export class Button extends BaseComponent {
  constructor(page: Page, parentOrLocator: string | Locator, locator?: string, name?: string) {
    super(page, parentOrLocator, locator, name);
  }

  async click(): Promise<void> {
    await allure.step(`Клик по "${this.name}"`, async () => {
      await this.element.click();
    });
  }

  async hover(): Promise<void> {
    await allure.step(`Наведение курсора на "${this.name}"`, async () => {
      await this.element.hover();
    });
  }
}
