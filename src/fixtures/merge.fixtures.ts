import { test as baseTest, mergeTests, mergeExpects } from '@playwright/test';
import { expectExtensions } from '../expects';
import { pomTest } from './pom.fixtures';

export const test = mergeTests(baseTest, pomTest);
export const expect = mergeExpects(...expectExtensions);
