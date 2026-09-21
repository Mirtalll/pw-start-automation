import { allure } from 'allure-playwright';
import type { Page } from '@playwright/test';

export class BasePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openPage(url: string): Promise<void> {
    await allure.step(`Открытие страницы ${url}`, async () => {
      await this.page.goto(url, { waitUntil: 'domcontentloaded' });
      await this.page.waitForLoadState('load');
    });
  }

  async reload(): Promise<void> {
    await allure.step('Обновление страницы', async () => {
      await this.page.reload();
    });
  }

  async goBack(): Promise<void> {
    await allure.step('Назад по истории', async () => {
      await this.page.goBack();
    });
  }

  async goForward(): Promise<void> {
    await allure.step('Вперёд по истории', async () => {
      await this.page.goForward();
    });
  }

  async getTitle(): Promise<string> {
    return allure.step('Получение заголовка страницы', async () => {
      return this.page.title();
    });
  }

  async getUrl(): Promise<string> {
    return allure.step('Получение URL страницы', async () => {
      return this.page.url();
    });
  }

  async waitForUrl(url: string | RegExp, options: { timeout?: number } = {}): Promise<void> {
    await allure.step(`Ожидание URL: ${url}`, async () => {
      await this.page.waitForURL(url, options);
    });
  }

  async screenshot(options?: { path?: string; type?: 'png' | 'jpeg'; fullPage?: boolean }): Promise<Buffer> {
    return allure.step('Скриншот страницы', async () => {
      return this.page.screenshot(options);
    });
  }
}
