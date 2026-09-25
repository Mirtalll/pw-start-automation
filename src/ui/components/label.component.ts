import type { Page, Locator } from '@playwright/test';
import { BaseComponent } from './base.component';

/**
 * Класс, представляющий лейблы.
 * Наследуется от BaseComponent и использует его методы для взаимодействия.
 */
export class Label extends BaseComponent {
  constructor(page: Page, parentOrLocator: string | Locator, locator?: string, name?: string) {
    super(page, parentOrLocator, locator, name);
  }
}
