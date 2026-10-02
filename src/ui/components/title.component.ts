import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

/**
 * Класс, представляющий заголовки (h1, h2, span и т.д.).
 * Наследуется от BaseComponent и использует его методы для взаимодействия.
 */
export class Title extends BaseComponent {
  constructor(page: Page, parentOrLocator: string | Locator, locator?: string, name?: string) {
    super(page, parentOrLocator, locator, name);
  }
}
