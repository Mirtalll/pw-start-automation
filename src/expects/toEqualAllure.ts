import { expect as baseExpect } from '@playwright/test';
import { assertionBase } from './expectBase';

export const toEqualAllure = baseExpect.extend({
  async toEqualAllure(actual: unknown, expected: unknown, whatMessage?: string) {
    const subject = whatMessage ?? 'значения';
    const logMessage = `🎯 Проверка: "${subject}" должен равняться "${expected}"`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toEqual',
      logMessage,
      data: {
        actualValue: actual,
        expectedValue: expected,
      },
    });
  },
});
