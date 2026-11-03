---
name: playwright-e2e
description: Пишет и изменяет E2E UI-тесты для playwright.dev по стандартам фреймворка pw-start-automation. POM, Allure-матчеры, импорт из index, fixture-based API mocks через apiMock. Use when adding spec files, writing tests, covering new UI blocks, or when user mentions test, e2e, playwright, spec, тест, проверка, mock, мок, intercept, route.
---

# Purpose

Написание и изменение E2E UI-тестов для playwright.dev по стандартам фреймворка pw-start-automation. Тесты используют POM, Allure-матчеры, фикстуры.

# When to use

- Добавление/изменение spec-файлов в tests/
- Запросы на написание тестов, проверок, сценариев
- Покрытие нового UI-блока или страницы

# Inputs needed

- Что проверяем (элемент, сценарий, страница)
- Есть ли уже похожие тесты в tests/ (проверить перед написанием)
- Есть ли нужные фрагменты/компоненты в POM (если нет — использовать skill pom-framework)
- URL или маршрут для beforeEach
- Нужны ли API-моки и должен ли мок ставиться до навигации

# Procedure

## 0. Проверка существующих тестов

Перед написанием — проверить, есть ли уже похожие автотесты в tests/. Искать по ключевым словам: название блока (хедер, сайдбар), элемент (Search, Docs, логотип), сценарий (навигация, модалка). Не дублировать проверки. При необходимости расширить существующий spec или добавить тест в подходящий describe.

## 1. Импорт

Только из index. Никогда @playwright/test.

```typescript
import { test, expect } from '../index';
```

## 2. Структура теста

Arrange → Act → Assert. Один тест — одна логическая проверка. Несколько связанных expect в одном тесте допустимы (например, «хедер виден» — несколько элементов подряд).

## 3. Viewport

Только десктоп. Не использовать `setViewportSize` для мобильных. Не писать тесты для мобильных элементов (hamburger, mobile menu).

## 4. Фикстуры

- `async ({ mainPage })` — когда достаточно Page Object.
- `async ({ page, mainPage })` — когда нужен page: waitForURL, locator для элементов вне POM.

## 5. beforeEach

Подготовка состояния. openPage('/') — относительный путь к baseURL (https://playwright.dev).

```typescript
test.beforeEach(async ({ mainPage }) => {
  await mainPage.openPage('/');
});
```

Если сценарий требует API-мока на загрузке страницы, сначала поставить `apiMock`, потом открыть страницу:

```typescript
test.beforeEach(async ({ apiMock, mainPage }) => {
  await apiMock.get('**/api/search', { results: [] });
  await mainPage.openPage('/');
});
```

## 6. Доступ к элементам

Через POM: mainPage.headerFragment.docsLink, mainPage.headerFragment.logo.

Не page.locator() для элементов, которые уже во фрагменте.

## 7. Действия

- Клик, hover: mainPage.headerFragment.docsLink.click(), .hover()
- Динамические элементы: const option = await mainPage.headerFragment.getLanguageOption('/python/'); await option.click()
- Элементы вне POM (модалки, оверлеи): page.locator('.DocSearch-Modal'), затем expect(...).toBeVisibleAllure() (без waitFor)

## 7.1 API-моки

- Использовать fixture `apiMock`, а не `page.route()` прямо в spec, если нет особой причины
- Для стандартных кейсов предпочитать `apiMock.get(...)` и `apiMock.post(...)`
- Для нестандартных ответов использовать `apiMock.mock(url, body, options)` или `apiMock.mock({ ... })`
- Если мок больше не нужен в середине теста, вызывать `apiMock.reset()`
- Мокировать только `fetch/xhr`, не ассеты и не HTML документа
- Не переносить моки в POM

## 8. Проверки

Только через Allure-матчеры. Второй аргумент — описание для отчёта.

## 9. Навигация и ожидания

- await page.waitForURL(/\/docs\/intro/) — для перехода по URL
- Не использовать locator.waitFor() — expect() и действия (click, fill) сами ждут появления элемента (auto-retry). Вместо `await el.waitFor({ state: 'visible' }); expect(el).toBeVisibleAllure()` достаточно `expect(el).toBeVisibleAllure()`

# Output format

- Готовый spec-файл или изменения в существующий
- Файлы в tests/\*.spec.ts
- Один тест — одна логическая проверка

# Allure-матчеры

| Матчер                                         | Пример                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| toBeVisibleAllure('описание')                  | expect(headerFragment.root).toBeVisibleAllure('Header root')             |
| toBeHiddenAllure('описание')                   | expect(modal).toBeHiddenAllure('Modal closed')                           |
| toHaveTextAllure(regex, 'описание')            | expect(logo).toHaveTextAllure(/Playwright/, 'Logo')                      |
| toHaveAttributeAllure(attr, regex, 'описание') | expect(link).toHaveAttributeAllure('href', /github\.com/, 'GitHub link') |
| toHaveClassAllure(regex, 'описание')           | expect(el).toHaveClassAllure(/active/, 'Active state')                   |
| toBeEnabledAllure('описание')                  | expect(button).toBeEnabledAllure('Submit button')                        |
| toBeDisabledAllure('описание')                 | expect(button).toBeDisabledAllure('Disabled button')                     |
| toBeEditableAllure('описание')                 | expect(input).toBeEditableAllure('Search input')                         |
| toEqualAllure(value, 'описание')               | expect(result).toEqualAllure(expected, 'Result')                         |
| toContainAllure(value, 'описание')             | expect(list).toContainAllure(item, 'List contains item')                 |

Матчеры принимают Locator или компонент (Button, Label и т.п.) — для компонентов автоматически используется .element.

# Шаблон теста

```typescript
import { test, expect } from '../index';

test.describe('Название группы', () => {
  test.beforeEach(async ({ mainPage }) => {
    await mainPage.openPage('/');
  });

  test('Описание ожидаемого результата', async ({ mainPage }) => {
    await expect(mainPage.headerFragment.logo).toBeVisibleAllure('Logo');
  });

  test('Ссылка ведёт на нужную страницу', async ({ page, mainPage }) => {
    await mainPage.headerFragment.docsLink.click();
    await page.waitForURL(/\/docs\/intro/);
  });
});
```

# Quality bar (self-check)

- [ ] Проверено: нет дублирующих тестов в tests/
- [ ] Импорт test, expect из ../index
- [ ] Все проверки через toXxxAllure с описанием
- [ ] Элементы через POM (кроме вне POM)
- [ ] Один тест — одна логическая проверка
- [ ] Нет locator.waitFor() — только expect и действия
- [ ] Если нужны моки, используется `apiMock`, а не сырой `page.route()`
- [ ] npm run typecheck проходит

# Anti-patterns

- ❌ locator.waitFor() — использовать expect() или действия (click, fill), они сами ждут
- ❌ setViewportSize для мобильных, тесты для hamburger/mobile menu
- ❌ Дублировать проверки, уже есть в tests/
- ❌ import { test, expect } from '@playwright/test'
- ❌ expect(el).toBeVisible() без Allure
- ❌ page.locator() для элементов во фрагменте
- ❌ Много несвязанных expect в одном тесте (разбить на отдельные тесты)
- ❌ test('клик по Docs') — описание действия; нужно test('Ссылка Docs ведёт на intro') — описание результата
- ❌ page.route() в тесте вместо `apiMock`, если сценарий укладывается в общий helper

# Examples

**Input:** Добавь тест, что кнопка Search открывает модалку.

**Output:**

```typescript
test('Кнопка Search открывает модальное окно поиска', async ({ mainPage }) => {
  await mainPage.headerFragment.searchButton.click();
  await expect(mainPage.docSearchModal.root).toBeVisibleAllure('DocSearch modal');
});
```

**Input:** Проверь, что логотип содержит текст Playwright.

**Output:**

```typescript
test('Логотип содержит текст Playwright', async ({ mainPage }) => {
  await expect(mainPage.headerFragment.logo).toHaveTextAllure(/Playwright/, 'Logo');
});
```

**Input:** Тест на выпадающий список языка — hover, опция Python ведёт на страницу.

**Output:**

```typescript
test('Выпадающий список языка открывается, опция Python ведёт на страницу', async ({ page, mainPage }) => {
  await mainPage.headerFragment.languageDropdown.hover();
  const dropdownMenu = page.locator('.dropdown__menu');
  await expect(dropdownMenu).toBeVisibleAllure('Language dropdown menu');

  const pythonOption = await mainPage.headerFragment.getLanguageOption('/python/');
  await pythonOption.click();
  await page.waitForURL(/\/python\//);
});
```

**Input:** Проверь href ссылки GitHub.

**Output:**

```typescript
test('Ссылка GitHub имеет корректный href', async ({ mainPage }) => {
  await expect(mainPage.headerFragment.githubLink).toHaveAttributeAllure('href', /github\.com\/microsoft\/playwright/, 'GitHub link');
});
```

**Input:** Нужен тест с мокированным GET API-ответом.

**Output:**

```typescript
test('Поиск использует мокированный API-ответ', async ({ apiMock, mainPage, page }) => {
  await apiMock.get('**/api/search', { results: ['playwright'] });
  await mainPage.openPage('/');

  const response = await page.evaluate(async () => {
    const apiResponse = await fetch('/api/search');
    return apiResponse.json();
  });

  await expect(response).toEqualAllure({ results: ['playwright'] }, 'Mocked search response');
});
```
