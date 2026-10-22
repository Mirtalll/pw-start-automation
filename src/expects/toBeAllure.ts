import { expect as baseExpect } from '@playwright/test';
import { assertionBase } from './expectBase';

export const toBeAllure = baseExpect.extend({
  async toBeAllure(value: unknown, expected: unknown, whatMessage?: string) {
    const subject = whatMessage ?? 'значение';
    const logMessage = `🎯 Проверка: "${subject}" должен быть "${expected}"`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toBe',
      logMessage,
      data: {
        actualValue: value,
        expectedValue: expected,
      },
    });
  },
});
