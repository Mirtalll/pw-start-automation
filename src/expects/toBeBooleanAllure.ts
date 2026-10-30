import { expect as baseExpect } from '@playwright/test';
import { assertionBase } from './expectBase';

export const toBeBooleanAllure = baseExpect.extend({
  async toBeBooleanAllure(value: unknown, whatMessage?: string) {
    const subject = whatMessage ?? 'значение';
    const logMessage = `🔍 Проверка: "${subject}" должен быть булевым значением`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toBe',
      logMessage,
      data: {
        actualValue: typeof value,
        expectedValue: 'boolean',
      },
    });
  },
});
