import { expect as baseExpect } from '@playwright/test';
import { assertionBase } from './expectBase';

export const toContainAllure = baseExpect.extend({
  async toContainAllure(value: unknown, expected: unknown, whatMessage?: string) {
    const subject = whatMessage ?? 'значение';
    const logMessage = `🔍 Проверка: "${subject}" должен содержать "${expected}"`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toContain',
      logMessage,
      data: {
        actualValue: value,
        expectedValue: expected,
      },
    });
  },
});
