import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import playwrightPlugin from 'eslint-plugin-playwright';
import customPlugin from './eslint-plugin/index.js';

/**
 * ESLint Flat Configuration
 *
 * Используется ESLint v10 с поддержкой flat config.
 * Плагины:
 * - @typescript-eslint: правила для TypeScript (типизация, синтаксис)
 * - eslint-plugin-playwright: правила для Playwright-тестов
 * - custom (eslint-plugin): правила для архитектуры фрагментов и страниц
 *
 * Команды:
 * - npm run lint — проверка всех .ts файлов
 * - npm run lint:fix — автоисправление проблем
 */
export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json', // Включает правила, требующие анализа типов
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      playwright: playwrightPlugin,
      'custom': customPlugin,
    },
    rules: {
      /* ============================
       * TypeScript — TypeScript правила
       * ============================ */

      // error: Запрещает неиспользуемые переменные (аргументы с _ в начале разрешены)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // off: Не требует явного указания возвращаемого типа у функций
      '@typescript-eslint/explicit-function-return-type': 'off',

      // off: Не требует явного указания типов для экспортируемых модулей
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // warn: Предупреждает об использовании any (лучше использовать конкретные типы)
      '@typescript-eslint/no-explicit-any': 'warn',

      // warn: Предупреждает о non-null assertion операторе (!) — может скрыть потенциальные null/undefined
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // error: Обязательно использовать await/return для промисов (защита от забытых await)
      '@typescript-eslint/no-floating-promises': 'error',

      // error: Запрещает передачу промисов в места, где ожидается синхронное значение (например, в if, &&, ||)
      '@typescript-eslint/no-misused-promises': 'error',

      /* ============================
       * Playwright — правила для автотестов
       * ============================ */

      // warn: Предупреждает о page.waitForTimeout() — лучше использовать явные ожидания событий
      'playwright/no-wait-for-timeout': 'warn',

      // warn: Предупреждает о page.waitForSelector() — часто можно заменить на встроенные методы locators
      'playwright/no-wait-for-selector': 'warn',

      // off: Разрешает писать тесты без обёртки describe на верхнем уровне
      'playwright/require-top-level-describe': 'off',

      /* ============================
       * Custom — правила архитектуры
       * ============================ */

      // Фрагменты
      'custom/fragment-extends-base': 'error',
      'custom/fragment-has-root-locator': 'error',
      'custom/fragment-component-names': 'error',

      // Страницы
      'custom/page-extends-base': 'error',
      'custom/page-constructor-super': 'error',
      'custom/page-fragments-init': 'error',
      'custom/page-methods-async': 'error',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/allure-results/**',
      '**/dist/**',
      '**/*.js',
    ],
  },
];
