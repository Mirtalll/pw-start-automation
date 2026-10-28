import { expect as baseExpect } from '@playwright/test';
import { assertionBase, logMessageElem } from './expectBase';

export const toHaveTextAllure = baseExpect.extend({
  async toHaveTextAllure(locator: unknown, expectedText: string | RegExp, whatMessage?: string) {
    const subject = whatMessage ?? logMessageElem(locator);
    const logMessage = `📝 Проверка: "${subject}" должен содержать текст "${expectedText}"`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toHaveText',
      logMessage,
      data: {
        locator,
        expectedValue: expectedText,
      },
    });
  },
});
