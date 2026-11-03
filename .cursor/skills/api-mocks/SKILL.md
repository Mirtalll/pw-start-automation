---
name: api-mocks
description: Проектный паттерн для fixture-based API mocks через `apiMock` в Playwright тестах. Use when user mentions mock, мок, intercept, route, stub, API response, network mocking, or when a test needs controlled fetch/xhr responses.
---

# API Mocks

## Purpose

Использовать единый подход к API-мокам в проекте: через fixture `apiMock`, до навигации и без переноса network-логики в POM.

## When to use

- Нужно замокать `fetch` или `xhr` ответ в UI-тесте
- Нужно стабилизировать тест данными, не зависящими от реального API
- Нужно проверить success/error/empty state через контролируемый ответ
- Пользователь просит `mock`, `intercept`, `route`, `stub`, `network mock`

## Rules

- Используй `apiMock` из test fixtures, а не сырой `page.route()`, если хватает возможностей helper
- Ставь мок до `mainPage.openPage()` или другого `goto`, если запрос может уйти на загрузке страницы
- Предпочитай короткие методы `apiMock.get()` и `apiMock.post()`
- Используй `apiMock.mock()` для редких кейсов: `once`, `headers`, `delayMs`, `contentType`
- Если в одном тесте мок больше не нужен, вызывай `apiMock.reset()`
- Не прячь моки в `Page`, `Fragment` или `Component`
- Не перехватывай document/assets без отдельной необходимости

## Quick patterns

### GET mock before navigation

```typescript
test.beforeEach(async ({ apiMock, mainPage }) => {
  await apiMock.get('**/api/search', { results: [] });
  await mainPage.openPage('/');
});
```

### POST mock

```typescript
await apiMock.post('**/api/save', { saved: true }, { status: 201 });
```

### Advanced mock

```typescript
await apiMock.mock(
  '**/api/report',
  { items: [] },
  {
    method: 'GET',
    once: true,
    delayMs: 300,
  },
);
```

### Reset mocks

```typescript
await apiMock.reset();
```

## Test writing guidance

- Arrange: зарегистрировать мок
- Act: открыть страницу или выполнить действие, которое шлёт запрос
- Assert: проверить UI или payload через Allure-матчеры
- Если проверяешь сам ответ, можно вызвать `fetch()` внутри `page.evaluate()`, чтобы пройти тем же путём, что и приложение

## Anti-patterns

- ❌ `page.route()` прямо в spec для обычного GET/POST кейса
- ❌ Мок после `openPage()`, если запрос уже мог уйти
- ❌ Мок в Page Object
- ❌ Перехват слишком широких URL без нужды

## Example

```typescript
import { test, expect } from '../index';

test('Список загружается из мокированного API', async ({ apiMock, mainPage, page }) => {
  await apiMock.get('**/api/items', { items: ['A', 'B'] });
  await mainPage.openPage('/');

  const response = await page.evaluate(async () => {
    const apiResponse = await fetch('/api/items');
    return apiResponse.json();
  });

  await expect(response).toEqualAllure({ items: ['A', 'B'] }, 'Mocked items response');
});
```
