import { expect as baseExpect } from '@playwright/test';
import { assertionBase, logMessageElem } from './expectBase';

export const toHaveAttributeAllure = baseExpect.extend({
  async toHaveAttributeAllure(locator: unknown, attributeName: string, expectedValue: string | RegExp, whatMessage?: string) {
    const subject = whatMessage ?? logMessageElem(locator);
    const logMessage = `📝 Проверка: "${subject}" должен иметь атрибут "${attributeName}" со значением "${expectedValue}"`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toHaveAttribute',
      logMessage,
      data: {
        locator,
        attribute: attributeName,
        expectedValue,
      },
    });
  },
});
