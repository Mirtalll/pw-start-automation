# pw-start-automation

**Версия: 1.0.0**

![version](https://img.shields.io/badge/version-1.0.0-blue)
![Playwright](https://img.shields.io/badge/Playwright-1.58-2EAD33)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)
![Node](https://img.shields.io/badge/Node.js-%3E%3D18-339933)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

Стартовый фреймворк для E2E-автоматизации на **Playwright + TypeScript**. Построен вокруг иерархии **Page → Fragment → Component**, шаги обёрнуты в **Allure**, API-моки вынесены в фикстуры, а архитектура проверяется собственным **ESLint-плагином**.

## Архитектура

```
Тест (tests/*.spec.ts)
  └── Page        MainPage extends BasePage
        └── Fragment   HeaderFragment / DocSearchModalFragment extends BaseFragment
              └── Component   Button / Input / Label / Checkbox / Select / Title extends BaseComponent
```

| Слой | Ответственность | Правила |
|------|-----------------|---------|
| **Page** | Точка входа: открытие страницы, оркестрация фрагментов | Наследует `BasePage`, вызывает `super(page)`, инициализирует фрагменты в конструкторе, методы `async` |
| **Fragment** | Самостоятельный блок UI (хедер, модальное окно) | Наследует `BaseFragment`, имеет собственный `root: Locator`, дочерние элементы ищутся **внутри root** |
| **Component** | Атомарный элемент (кнопка, поле, чекбокс) | Наследует `BaseComponent`, получает `name` для шагов в Allure |

- Селекторы живут только в Page/Fragment/Component — в тестах их нет.
- Каждое действие и проверка попадают в отчёт Allure отдельным шагом.
- Фикстура `mainPage` создаёт страницу, `apiMock` — изолированный мок, который автоматически сбрасывается после теста.

## Структура

| Путь | Назначение |
|------|------------|
| `src/ui/pages/` | Page Object: `BasePage`, `MainPage` |
| `src/ui/fragments/` | Фрагменты: `HeaderFragment`, `DocSearchModalFragment` |
| `src/ui/components/` | Компоненты: `Button`, `Input`, `Label`, `Checkbox`, `Select`, `Title` |
| `src/fixtures/` | `pom.fixtures` (страницы и моки), `merge.fixtures` (test + expect) |
| `src/mocks/` | `ApiMock` — подмена ответов API через `page.route` |
| `src/expects/` | 19 кастомных Allure-матчеров `*Allure` |
| `eslint-plugin/` | 7 правил архитектуры Page/Fragment |
| `docs/` | Документация по фрагментам (DocSearch) |
| `.cursor/skills/` | 7 навыков Cursor: POM, API-моки, E2E, проверка спеков |
| `tests/` | E2E-тесты: хедер, модальное окно поиска, API-моки |
| `index.ts` | Публичный API фреймворка (`test`, `expect`, страницы, компоненты, `ApiMock`) |

## Возможности

### Allure-отчётность

- `allure-playwright` как репортёр: шаги действий, вложения только при падении, окружение (OS, Node).
- Кастомные матчеры — каждый вызов становится шагом с понятным описанием.
- `trace: 'on-first-retry'` и `screenshot: 'only-on-failure'` — диагностика флейков.

### API-моки

`ApiMock` подменяет XHR/fetch-запросы и умеет:

- `mock(config)` / `get` / `post` — URL строкой или RegExp, метод, статус, заголовки, тело, `contentType`;
- `once` — ответ только на первый запрос;
- `delayMs` — задержка ответа;
- `reset()` — снятие всех моков (вызывается автоматически после каждого теста).

```typescript
import { test, expect } from '../index';

test('Ответ API подменён', async ({ apiMock, mainPage, page }) => {
  await apiMock.get('**/api/users', { items: ['alice'] }, { status: 200 });
  await mainPage.openPage('/');

  const data = await page.evaluate(async () => (await fetch('/api/users')).json());

  await expect(data).toEqualAllure({ items: ['alice'] }, 'Ответ мока API');
});
```

### Кастомные Allure-матчеры (19)

| Категория | Матчеры |
|-----------|---------|
| Состояние UI | `toBeVisibleAllure`, `toBeHiddenAllure`, `toBeEnabledAllure`, `toBeDisabledAllure`, `toBeEditableAllure` |
| Текст и атрибуты | `toHaveTextAllure`, `toHaveAttributeAllure`, `toHaveClassAllure`, `toHaveValueAllure`, `toContainAllure` |
| Значения и типы | `toBeAllure`, `toEqualAllure`, `toBeNumberAllure`, `toBeStringAllure`, `toBeBooleanAllure`, `toBeArrayAllure`, `toBeObjectAllure`, `toBeUndefinedAllure`, `toBeNullAllure` |

Каждый матчер принимает вторым аргументом описание шага: `await expect(locator).toBeVisibleAllure('Логотип')`. Поддерживается `expect.soft(...)` — падение фиксируется корректно.

### ESLint-правила архитектуры

| Правило | Проверяет |
|---------|-----------|
| `custom/fragment-extends-base` | Фрагмент наследует `BaseFragment` |
| `custom/fragment-has-root-locator` | У фрагмента есть `root: Locator` |
| `custom/fragment-component-names` | У компонентов задано имя для Allure |
| `custom/page-extends-base` | Страница наследует `BasePage` |
| `custom/page-constructor-super` | Конструктор вызывает `super(page)` |
| `custom/page-fragments-init` | Фрагменты инициализируются в конструкторе |
| `custom/page-methods-async` | Методы страницы объявлены `async` |

## Быстрый старт

```bash
npm ci
npx playwright install chromium
npm test
```

## Команды

| Команда | Действие |
|---------|----------|
| `npm test` | Запуск всех E2E-тестов |
| `npm run test:ui` | Playwright UI Mode |
| `npm run typecheck` | Проверка типов (`tsc --noEmit`) |
| `npm run lint` | ESLint: TypeScript, Playwright и правила архитектуры |
| `npm run lint:fix` | Автоисправление линтера |
| `npm run format` | Форматирование Prettier |
| `npm run format:check` | Проверка форматирования |

## Пример теста

```typescript
import { test, expect } from '../index';

test.describe('Хедер', () => {
  test.beforeEach(async ({ mainPage }) => {
    await mainPage.openPage('/');
  });

  test('Хедер виден', async ({ mainPage }) => {
    const header = mainPage.headerFragment;
    await expect(header.root).toBeVisibleAllure('Корень хедера');
    await expect(header.logo).toBeVisibleAllure('Логотип');
    await expect(header.searchButton).toBeVisibleAllure('Кнопка поиска');
  });
});
```

## CI

`.github/workflows/playwright.yml` запускается на push и pull request в `main`/`master`, а также вручную:

1. Node.js 22 + кэш npm;
2. `npm ci`;
3. установка Chromium;
4. `npm test`;
5. выгрузка `allure-results` артефактом при падении.

## Версия

Текущая версия — **1.0.0**: базовые классы, компоненты и фрагменты, `MainPage`, фикстуры, `ApiMock`, 19 Allure-матчеров, ESLint-плагин, E2E-тесты и CI.
