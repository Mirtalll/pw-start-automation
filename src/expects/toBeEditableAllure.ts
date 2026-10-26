import { expect as baseExpect } from '@playwright/test';
import { assertionBase, logMessageElem } from './expectBase';

export const toBeEditableAllure = baseExpect.extend({
  async toBeEditableAllure(locator: unknown, whatMessage?: string) {
    const subject = whatMessage ?? logMessageElem(locator);
    const logMessage = `👁️ Проверка: "${subject}" должен быть редактируем`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toBeEditable',
      logMessage,
      data: { locator },
    });
  },
});
