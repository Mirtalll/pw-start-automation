import { expect as baseExpect } from '@playwright/test';
import { assertionBase } from './expectBase';

function isPlainObject(val: unknown): boolean {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

export const toBeObjectAllure = baseExpect.extend({
  async toBeObjectAllure(value: unknown, whatMessage?: string) {
    const subject = whatMessage ?? 'значение';
    const logMessage = `🔍 Проверка: "${subject}" должен быть объектом`;
    return assertionBase({
      assertionContext: this,
      baseAssertionName: 'toBe',
      logMessage,
      data: {
        actualValue: isPlainObject(value),
        expectedValue: true,
      },
    });
  },
});
