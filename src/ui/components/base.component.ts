import { allure } from 'allure-playwright';
import type { Page, Locator } from '@playwright/test';

/**
 * Базовый класс для всех UI-компонентов фреймворка.
 * Предоставляет базовые методы взаимодействия с элементами и интеграцию с Allure.
 */
export class BaseComponent {
  page: Page;
  parentLocator: string | Locator | null;
  element: Locator;
  name: string;

  constructor(page: Page, parentOrLocator: string | Locator, locator?: string, name?: string) {
    this.page = page;
    this.name = name ?? 'элемент';
    if (locator !== undefined) {
      this.parentLocator = parentOrLocator;
      this.element = this._addDescription(this._buildStringLocator(locator));
    } else {
      this.parentLocator = null;
      this.element = this._addDescription(this._buildStringLocator(parentOrLocator as string));
    }
  }

  private _buildStringLocator(locator: string): Locator {
    if (!this.parentLocator) {
      return this.page.locator(locator);
    }
    const parentElement = this._getParentElement();
    return parentElement.locator(locator);
  }

  private _getParentElement(): Locator {
    if (typeof this.parentLocator === 'string') {
      return this.page.locator(this.parentLocator);
    }
    if (!this.parentLocator) {
      throw new Error('parentLocator не определён');
    }
    return this.parentLocator;
  }

  private _addDescription(baseLocator: Locator): Locator {
    return baseLocator.describe(this.name);
  }

  async waitFor(options: { state?: 'attached' | 'detached' | 'visible' | 'hidden'; timeout?: number } = {}): Promise<void> {
    await allure.step(`Ожидание появления "${this.name}"`, async () => {
      await this.element.waitFor(options);
    });
  }

  async focus(): Promise<void> {
    await allure.step(`Фокус на "${this.name}"`, async () => {
      await this.element.focus();
    });
  }

  async blur(): Promise<void> {
    await allure.step(`Снятие фокуса с "${this.name}"`, async () => {
      await this.element.blur();
    });
  }

  async getAttribute(attributeName: string): Promise<string | null> {
    return await allure.step(`Получение атрибута "${attributeName}" у "${this.name}"`, async () => {
      return await this.element.getAttribute(attributeName);
    });
  }

  async scrollIntoView(): Promise<void> {
    await allure.step(`Прокрутка к "${this.name}"`, async () => {
      await this.element.scrollIntoViewIfNeeded();
    });
  }

  async getText(): Promise<string> {
    return await allure.step(`Получение текста "${this.name}"`, async () => {
      const text = await this.element.textContent();
      return text?.trim() ?? '';
    });
  }
}
