import { allure } from 'allure-playwright';
import type { Locator, Page } from '@playwright/test';
import { BaseFragment } from './base.fragment';
import { Button } from '../components/button.component';
import { Input } from '../components/input.component';
import { Label } from '../components/label.component';

/** Фрагмент модального окна DocSearch. */
export class DocSearchModalFragment extends BaseFragment {
  root: Locator;
  searchInput: Input;
  cancelButton: Button;
  resetButton: Button;
  recentSectionTitle: Label;
  resultsList: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.page.locator('.DocSearch-Modal:visible');
    this.searchInput = new Input(this.page, this.root, '.DocSearch-Input', 'Поле поиска');
    this.cancelButton = new Button(this.page, this.root, '.DocSearch-Cancel', 'Кнопка Cancel');
    this.resetButton = new Button(this.page, this.root, '.DocSearch-Reset', 'Кнопка очистки поиска');
    this.recentSectionTitle = new Label(this.page, this.root, '.DocSearch-Hit-source', 'Заголовок секции Recent');
    this.resultsList = this.root.locator('.DocSearch-Dropdown');
  }

  async search(query: string): Promise<void> {
    await allure.step(`Поиск по запросу "${query}"`, async () => {
      await this.searchInput.fill(query);
    });
  }

  async closeWithEscape(): Promise<void> {
    await allure.step('Закрытие поиска клавишей Escape', async () => {
      await this.page.keyboard.press('Escape');
    });
  }

  async getHitByIndex(index: number): Promise<Button> {
    return allure.step(`Получение результата поиска с индексом ${index}`, async () => {
      return new Button(this.page, this.root, `.DocSearch-Hit a >> nth=${index}`, `Результат поиска ${index + 1}`);
    });
  }

  async getHitTitleByIndex(index: number): Promise<Label> {
    return allure.step(`Получение заголовка результата поиска с индексом ${index}`, async () => {
      return new Label(this.page, this.root, `.DocSearch-Hit-title >> nth=${index}`, `Заголовок результата поиска ${index + 1}`);
    });
  }

  async getHitPathByIndex(index: number): Promise<Label> {
    return allure.step(`Получение пути результата поиска с индексом ${index}`, async () => {
      return new Label(this.page, this.root, `.DocSearch-Hit-path >> nth=${index}`, `Путь результата поиска ${index + 1}`);
    });
  }
}
