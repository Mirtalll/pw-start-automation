import { expect as baseExpect } from '@playwright/test';
import { assertionBase } from './expectBase';

export const toBeStringAllure = baseExpect.extend({
  async toBeStringAllure(value: unknown, whatMessage?: string) {
    const subject = whatMessage ?? 'значение';
    const logMessage = `🔍 Проверка: "${subject}" должен быть строкой`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toBe',
      logMessage,
      data: {
        actualValue: typeof value,
        expectedValue: 'string',
      },
    });
  },
});
