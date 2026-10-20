import { test as baseTest } from '@playwright/test';
import { ApiMock } from '../mocks/api.mock';
import { MainPage } from '../ui/pages/mainPage';

interface PomFixtures {
  mainPage: MainPage;
  apiMock: ApiMock;
}

export const pomTest = baseTest.extend<PomFixtures>({
  apiMock: async ({ page }, use) => {
    const apiMock = new ApiMock(page);
    await use(apiMock);
  },
  mainPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    await use(mainPage);
  },
});
