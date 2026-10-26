import { expect as baseExpect } from '@playwright/test';
import { assertionBase, logMessageElem } from './expectBase';

export const toBeHiddenAllure = baseExpect.extend({
  async toBeHiddenAllure(locator: unknown, whatMessage?: string) {
    const subject = whatMessage ?? logMessageElem(locator);
    const logMessage = `👁️ Проверка: "${subject}" должен быть скрыт`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toBeHidden',
      logMessage,
      data: { locator },
    });
  },
});
