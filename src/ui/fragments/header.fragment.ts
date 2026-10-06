import { allure } from 'allure-playwright';
import type { Page, Locator } from '@playwright/test';
import { BaseFragment } from './base.fragment';
import { Button } from '../components/button.component';
import { Label } from '../components/label.component';

/** Фрагмент хедера страницы. */
export class HeaderFragment extends BaseFragment {
  root: Locator;
  logo: Label;
  docsLink: Button;
  apiLink: Button;
  communityLink: Button;
  languageDropdown: Button;
  themeToggle: Button;
  searchButton: Button;
  githubLink: Button;
  discordLink: Button;

  constructor(page: Page) {
    super(page);
    this.root = this.page.locator('nav[aria-label="Main"]');
    this.logo = new Label(this.page, this.root, '.navbar__title', 'Логотип');
    this.docsLink = new Button(this.page, this.root, 'a.navbar__link[href="/docs/intro"]', 'Ссылка Docs');
    this.apiLink = new Button(this.page, this.root, 'a.navbar__link[href="/docs/api/class-playwright"]', 'Ссылка API');
    this.communityLink = new Button(this.page, this.root, 'a.navbar__link[href="/community/welcome"]', 'Ссылка Community');
    this.languageDropdown = new Button(this.page, this.root, '.dropdown--hoverable > a', 'Выпадающий список языка');
    this.themeToggle = new Button(this.page, this.root, 'button[aria-label*="Switch between dark and light mode"]', 'Переключатель темы');
    this.searchButton = new Button(this.page, this.root, 'button.DocSearch-Button', 'Кнопка поиска');
    this.githubLink = new Button(this.page, this.root, 'a[aria-label="GitHub repository"]', 'Ссылка GitHub');
    this.discordLink = new Button(this.page, this.root, 'a[aria-label="Discord server"]', 'Ссылка Discord');
  }

  async getLanguageOption(prefix: string): Promise<Button> {
    return allure.step(`Получение опции языка: ${prefix}`, async () => {
      const menu = this.root.locator('.dropdown--hoverable .dropdown__menu');
      return new Button(this.page, menu, `a.dropdown__link[href="${prefix}"]`, `Опция языка ${prefix}`);
    });
  }
}
