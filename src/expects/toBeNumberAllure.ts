import { expect as baseExpect } from '@playwright/test';
import { assertionBase } from './expectBase';

export const toBeNumberAllure = baseExpect.extend({
  async toBeNumberAllure(value: unknown, whatMessage?: string) {
    const subject = whatMessage ?? 'значение';
    const logMessage = `🔍 Проверка: "${subject}" должен быть числом`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toBe',
      logMessage,
      data: {
        actualValue: typeof value,
        expectedValue: 'number',
      },
    });
  },
});
