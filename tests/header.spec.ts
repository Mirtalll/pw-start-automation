import { test, expect } from '../index';

test.describe('Хедер', () => {
  test.beforeEach(async ({ mainPage }) => {
    await mainPage.openPage('/');
  });

  test('Хедер виден', async ({ mainPage }) => {
    const headerFragment = mainPage.headerFragment;
    await expect(headerFragment.root).toBeVisibleAllure('Корень хедера');
    await expect(headerFragment.logo).toBeVisibleAllure('Логотип');
    await expect(headerFragment.docsLink).toBeVisibleAllure('Ссылка Docs');
    await expect(headerFragment.apiLink).toBeVisibleAllure('Ссылка API');
    await expect(headerFragment.communityLink).toBeVisibleAllure('Ссылка Community');
    await expect(headerFragment.searchButton).toBeVisibleAllure('Кнопка поиска');
    await expect(headerFragment.githubLink).toBeVisibleAllure('Ссылка GitHub');
    await expect(headerFragment.discordLink).toBeVisibleAllure('Ссылка Discord');
    await expect(headerFragment.languageDropdown).toBeVisibleAllure('Выпадающий список языка');
    await expect(headerFragment.themeToggle).toBeVisibleAllure('Переключатель темы');
  });

  test('Логотип содержит текст Playwright', async ({ mainPage }) => {
    await expect(mainPage.headerFragment.logo).toHaveTextAllure(/Playwright/, 'Логотип');
  });

  test('Ссылка Docs ведёт на intro', async ({ page, mainPage }) => {
    await mainPage.headerFragment.docsLink.click();
    await page.waitForURL(/\/docs\/intro/);
  });

  test('Ссылка API ведёт на API docs', async ({ page, mainPage }) => {
    await mainPage.headerFragment.apiLink.click();
    await page.waitForURL(/\/docs\/api/);
  });

  test('Ссылка Community ведёт на community', async ({ page, mainPage }) => {
    await mainPage.headerFragment.communityLink.click();
    await page.waitForURL(/\/community/);
  });

  test('Кнопка Search открывает модальное окно поиска', async ({ page, mainPage }) => {
    await mainPage.headerFragment.searchButton.click();
    const searchModal = page.locator('.DocSearch-Modal');
    await expect(searchModal).toBeVisibleAllure('Модальное окно поиска');
  });

  test('Переключатель темы виден и кликабелен', async ({ mainPage }) => {
    await expect(mainPage.headerFragment.themeToggle).toBeVisibleAllure('Переключатель темы');
    await mainPage.headerFragment.themeToggle.click();
  });

  test('Ссылка GitHub имеет корректный href', async ({ mainPage }) => {
    await expect(mainPage.headerFragment.githubLink).toHaveAttributeAllure('href', /github\.com\/microsoft\/playwright/, 'Ссылка GitHub');
  });

  test('Ссылка Discord имеет корректный href', async ({ mainPage }) => {
    await expect(mainPage.headerFragment.discordLink).toHaveAttributeAllure('href', /aka\.ms\/playwright\/discord/, 'Ссылка Discord');
  });

  test('Выпадающий список языка открывается, опция Python ведёт на страницу', async ({ page, mainPage }) => {
    await mainPage.headerFragment.languageDropdown.hover();
    const dropdownMenu = mainPage.headerFragment.root.locator('.dropdown--hoverable .dropdown__menu');
    await expect(dropdownMenu).toBeVisibleAllure('Меню выбора языка');

    const pythonOption = await mainPage.headerFragment.getLanguageOption('/python/');
    await pythonOption.click();
    await page.waitForURL(/\/python\//);
  });
});
