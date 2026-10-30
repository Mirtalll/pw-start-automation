import { expect as baseExpect } from '@playwright/test';
import { assertionBase } from './expectBase';

export const toBeUndefinedAllure = baseExpect.extend({
  async toBeUndefinedAllure(value: unknown, whatMessage?: string) {
    const subject = whatMessage ?? 'значение';
    const logMessage = `🔍 Проверка: "${subject}" должен быть undefined`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toBe',
      logMessage,
      data: {
        actualValue: value,
        expectedValue: undefined,
      },
    });
  },
});
