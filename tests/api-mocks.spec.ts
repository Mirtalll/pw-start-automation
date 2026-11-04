import { test, expect } from '../index';

test.describe('API-моки', () => {
  test('Метод get подменяет GET API-ответ после навигации', async ({ apiMock, mainPage, page }) => {
    await apiMock.get('**/api/mock-demo', {
      source: 'mock',
      items: ['playwright'],
    });

    await mainPage.openPage('/');

    const response = await page.evaluate(async () => {
      const apiResponse = await fetch('/api/mock-demo');

      return {
        status: apiResponse.status,
        payload: await apiResponse.json(),
      };
    });

    await expect(response).toEqualAllure(
      {
        status: 200,
        payload: {
          source: 'mock',
          items: ['playwright'],
        },
      },
      'Ответ мока API',
    );
  });

  test('Метод post подменяет POST API-ответ', async ({ apiMock, mainPage, page }) => {
    await apiMock.post(
      '**/api/mock-submit',
      {
        saved: true,
        id: 101,
      },
      {
        status: 201,
      },
    );

    await mainPage.openPage('/');

    const response = await page.evaluate(async () => {
      const apiResponse = await fetch('/api/mock-submit', {
        method: 'POST',
      });

      return {
        status: apiResponse.status,
        payload: await apiResponse.json(),
      };
    });

    await expect(response).toEqualAllure(
      {
        status: 201,
        payload: {
          saved: true,
          id: 101,
        },
      },
      'Ответ мока POST API',
    );
  });

  test('Метод reset снимает зарегистрированные моки', async ({ apiMock, mainPage, page }) => {
    await apiMock.get('**/api/reset-demo', {
      source: 'mock',
    });
    await apiMock.reset();

    await mainPage.openPage('/');

    const responseOk = await page.evaluate(async () => {
      const apiResponse = await fetch('/api/reset-demo');
      return apiResponse.ok;
    });

    await expect(responseOk).toEqualAllure(false, 'Мок API снят после reset');
  });
});
