import { expect as baseExpect } from '@playwright/test';
import { assertionBase, logMessageElem } from './expectBase';

export const toHaveValueAllure = baseExpect.extend({
  async toHaveValueAllure(locator: unknown, expectedValue: string | RegExp, whatMessage?: string) {
    const subject = whatMessage ?? logMessageElem(locator);
    const logMessage = `📝 Проверка: "${subject}" должен иметь значение "${expectedValue}"`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toHaveValue',
      logMessage,
      data: {
        locator,
        expectedValue,
      },
    });
  },
});
