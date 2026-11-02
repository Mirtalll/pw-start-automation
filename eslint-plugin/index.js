import { fragmentExtendsBase, fragmentHasRootLocator, fragmentComponentNames } from './fragment-rules.js';
import { pageExtendsBase, pageConstructorSuper, pageFragmentsInit, pageMethodsAsync } from './page-rules.js';

/**
 * Кастомный ESLint-плагин для проверки архитектуры Playwright-тестов.
 *
 * Правила для фрагментов (src/ui/fragments/):
 * - fragment-extends-base — фрагменты должны extends BaseFragment
 * - fragment-has-root-locator — фрагменты должны иметь root: Locator
 * - fragment-component-names — компоненты должны иметь name
 *
 * Правила для страниц (src/ui/pages/):
 * - page-extends-base — страницы должны extends BasePage
 * - page-constructor-super — конструктор должен вызывать super(page)
 * - page-fragments-init — фрагменты должны инициализироваться в конструкторе
 * - page-methods-async — все методы должны быть async
 */
export default {
  rules: {
    // Fragment rules
    'fragment-extends-base': fragmentExtendsBase,
    'fragment-has-root-locator': fragmentHasRootLocator,
    'fragment-component-names': fragmentComponentNames,

    // Page rules
    'page-extends-base': pageExtendsBase,
    'page-constructor-super': pageConstructorSuper,
    'page-fragments-init': pageFragmentsInit,
    'page-methods-async': pageMethodsAsync,
  },
};
