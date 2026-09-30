import { allure } from 'allure-playwright';
import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

/**
 * Класс, представляющий элементы select.
 * Наследуется от BaseComponent и предоставляет метод selectOption.
 */
export class Select extends BaseComponent {
  constructor(page: Page, parentOrLocator: string | Locator, locator?: string, name?: string) {
    super(page, parentOrLocator, locator, name);
  }

  async selectOption(value: string | { value?: string; label?: string; index?: number } | Array<string | { value?: string; label?: string; index?: number }>, options?: { timeout?: number; force?: boolean }): Promise<string[]> {
    return allure.step(`Выбор опции "${value}" в "${this.name}"`, async () => {
      return await this.element.selectOption(value as Parameters<Locator['selectOption']>[0], options);
    });
  }
}
