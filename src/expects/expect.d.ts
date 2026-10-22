declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeVisibleAllure(whatMessage?: string): R;
      toBeHiddenAllure(whatMessage?: string): R;
      toBeEnabledAllure(whatMessage?: string): R;
      toBeDisabledAllure(whatMessage?: string): R;
      toBeEditableAllure(whatMessage?: string): R;
      toHaveTextAllure(expectedText: string | RegExp, whatMessage?: string): R;
      toHaveValueAllure(expectedValue: string | RegExp, whatMessage?: string): R;
      toHaveAttributeAllure(attributeName: string, expectedValue: string | RegExp, whatMessage?: string): R;
      toHaveClassAllure(expectedClass: string | RegExp, options?: { timeout?: number }): R;
      toEqualAllure(expected: unknown, whatMessage?: string): R;
      toBeAllure(expected: unknown, whatMessage?: string): R;
      toBeNumberAllure(whatMessage?: string): R;
      toBeStringAllure(whatMessage?: string): R;
      toBeBooleanAllure(whatMessage?: string): R;
      toBeArrayAllure(whatMessage?: string): R;
      toBeObjectAllure(whatMessage?: string): R;
      toBeNullAllure(whatMessage?: string): R;
      toBeUndefinedAllure(whatMessage?: string): R;
      toContainAllure(expected: unknown, whatMessage?: string): R;
    }
  }
}

export {};
