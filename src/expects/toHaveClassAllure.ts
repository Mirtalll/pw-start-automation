import { expect as baseExpect } from '@playwright/test';
import { assertionBase, logMessageElem } from './expectBase';

export const toHaveClassAllure = baseExpect.extend({
  async toHaveClassAllure(locator: unknown, expectedClass: string | RegExp, options?: { timeout?: number }) {
    const logMessage = `📝 Проверка: "${logMessageElem(locator)}" должен иметь класс "${expectedClass}"`;

    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toHaveClass',
      logMessage,
      data: {
        locator,
        expectedValue: expectedClass,
        timeout: options?.timeout,
      },
    });
  },
});
