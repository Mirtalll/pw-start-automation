import { allure } from 'allure-playwright';
import { expect as baseExpected } from '@playwright/test';

export interface AssertionData {
  actualValue?: unknown;
  expectedValue?: unknown;
  locator?: unknown;
  page?: unknown;
  attribute?: string;
  timeout?: number;
}

export interface AssertionContext {
  isSoft?: boolean;
  isNot?: boolean;
  utils?: {
    matcherHint?: (name: string, received?: unknown, expected?: unknown, options?: { isNot?: boolean }) => string;
  };
}

export interface AssertionOptions {
  assertionContext: AssertionContext;
  baseAssertionName: string;
  logMessage: string;
  message?: string;
  data: AssertionData;
}

export interface MatcherResult {
  message: () => string;
  pass: boolean;
  name: string;
  expectedValue?: unknown;
  actual?: unknown;
}

export async function assertionBase(options: AssertionOptions): Promise<MatcherResult> {
  const { assertionContext, baseAssertionName, logMessage, message } = options;
  const { actualValue, expectedValue, locator, page } = options.data;

  const customAssertionName = `${baseAssertionName}Allure`;

  let pass = false;
  let matcherResult: unknown;

  try {
    let actualInExpected: unknown;
    if (actualValue !== undefined) {
      actualInExpected = actualValue;
    } else if (locator !== undefined) {
      const loc = locator as { getLocator?: () => unknown; element?: unknown };
      actualInExpected = typeof loc?.getLocator === 'function' ? loc.getLocator() : locator;
      if (typeof locator === 'object' && loc?.element) {
        actualInExpected = loc.element;
      }
    } else {
      actualInExpected = page;
    }

    const expectedInExpected = getExpectedOptions(options);

    await allure.step(logMessage, async () => {
      const expectBuilder = assertionContext.isSoft ? baseExpected.soft(actualInExpected) : baseExpected(actualInExpected);
      const expectChain = assertionContext.isNot ? expectBuilder.not : expectBuilder;
      const chain = expectChain as unknown as Record<string, (...args: unknown[]) => Promise<unknown>>;
      await chain[baseAssertionName](...expectedInExpected);
    });

    pass = true;
  } catch (err) {
    const error = err as { matcherResult?: { actual?: unknown; message?: string } };
    matcherResult = error?.matcherResult ?? error;
    pass = false;
  }

  const finalMessage = getMessage(assertionContext, pass, customAssertionName, matcherResult, message);
  const msg = matcherResult as { actual?: unknown } | undefined;

  return {
    message: () => finalMessage,
    pass,
    name: customAssertionName,
    expectedValue,
    actual: msg && typeof msg === 'object' && 'actual' in msg && msg.actual !== undefined ? msg.actual : actualValue,
  };
}

function getExpectedOptions(options: AssertionOptions): unknown[] {
  const { expectedValue, attribute, timeout } = options.data;
  const arr: unknown[] = [];
  if (attribute) arr.push(attribute);
  if (expectedValue !== undefined) arr.push(expectedValue);
  if (timeout) arr.push({ timeout });
  return arr;
}

export function logMessageElem(locator: unknown, message?: string): string {
  if (message) return message;

  if (typeof locator === 'object' && locator !== null) {
    const loc = locator as { displayName?: string; description?: string; name?: unknown };
    if (loc.displayName) return loc.displayName;
    if (loc.description) return loc.description;
    if (loc.name) return loc.name.toString();
  }

  if (locator && typeof (locator as { toString?: () => string }).toString === 'function') {
    const str = (locator as { toString: () => string }).toString();
    const match = str.match(/\.describe\("([^"]+)"\)/);
    if (match) return match[1];
    return str;
  }
  return String(locator);
}

export function getMessage(assertionContext: AssertionContext, pass: boolean, customAssertionName: string, matcherResult: unknown, message?: string): string {
  if (pass) return 'пройдено';
  const hint = assertionContext.utils?.matcherHint
    ? assertionContext.utils.matcherHint(customAssertionName, undefined, undefined, {
        isNot: assertionContext.isNot,
      })
    : customAssertionName;
  const msg = matcherResult && typeof matcherResult === 'object' && 'message' in matcherResult ? (matcherResult as { message?: string }).message : undefined;
  return message || msg || (typeof matcherResult === 'string' ? matcherResult : undefined) || hint;
}
