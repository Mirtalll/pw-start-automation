import { expect as baseExpect } from '@playwright/test';
import { assertionBase } from './expectBase';

export const toBeArrayAllure = baseExpect.extend({
  async toBeArrayAllure(value: unknown, whatMessage?: string) {
    const subject = whatMessage ?? 'значение';
    const logMessage = `🔍 Проверка: "${subject}" должен быть массивом`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toBe',
      logMessage,
      data: {
        actualValue: Array.isArray(value),
        expectedValue: true,
      },
    });
  },
});
