import { test, expect } from '../index';

test.describe('DocSearch modal', () => {
  test.beforeEach(async ({ mainPage }) => {
    await mainPage.openPage('/');
  });

  test('Поиск по запросу показывает результаты', async ({ mainPage }) => {
    await mainPage.headerFragment.searchButton.click();

    const docSearchModal = mainPage.docSearchModal;
    await expect(docSearchModal.root).toBeVisibleAllure('Модальное окно поиска');

    await docSearchModal.search('locator');

    const firstHitTitle = await docSearchModal.getHitTitleByIndex(0);
    await expect(docSearchModal.searchInput).toHaveValueAllure('locator', 'Поле поиска содержит запрос');
    await expect(docSearchModal.resultsList).toBeVisibleAllure('Список результатов поиска');
    await expect(firstHitTitle).toHaveTextAllure(/\S+/, 'Первый результат поиска содержит заголовок');
  });

  test('Escape закрывает модалку поиска без навигации', async ({ mainPage }) => {
    const initialUrl = await mainPage.getUrl();

    await mainPage.headerFragment.searchButton.click();

    const docSearchModal = mainPage.docSearchModal;
    await expect(docSearchModal.root).toBeVisibleAllure('Модальное окно поиска');

    await docSearchModal.closeWithEscape();

    await expect(docSearchModal.root).toBeHiddenAllure('Модальное окно поиска закрыто');
    await expect(await mainPage.getUrl()).toEqualAllure(initialUrl, 'URL не изменился после закрытия поиска');
  });

  test('Выбор результата поиска ведёт на страницу документации', async ({ page, mainPage }) => {
    await mainPage.headerFragment.searchButton.click();

    const docSearchModal = mainPage.docSearchModal;
    await expect(docSearchModal.root).toBeVisibleAllure('Модальное окно поиска');

    await docSearchModal.search('locator');

    const firstHit = await docSearchModal.getHitByIndex(0);
    await expect(firstHit).toBeVisibleAllure('Первый результат поиска');

    await firstHit.click();
    await page.waitForURL(/\/docs\//);
  });
});
