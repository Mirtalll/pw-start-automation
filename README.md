# pw-start-automation

Стартовый набор автоматизации на базе **Playwright** (TypeScript).

Архитектура: **страница → фрагмент → компонент**. Логика шагов обёрнута в **Allure**. API-моки вынесены из Page Object в фикстуры.

## Что внутри

| Папка | Назначение |
|-------|------------|
| `src/ui/pages/` | Page Object (MainPage, ...) |
| `src/ui/fragments/` | Переиспользуемые блоки UI (Header, DocSearchModal, ...) |
| `src/ui/components/` | Атомарные компоненты (Button, Input, Label, Checkbox, Select, Title) |
| `src/fixtures/` | Фикстуры Playwright (pom.fixtures, merge.fixtures) |
| `src/mocks/` | `ApiMock` — подмена ответов API (route.fulfill) |
| `src/expects/` | Кастомные Allure-матчеры (`toBe*Allure`) |
| `eslint-plugin/` | Кастомные ESLint-правила для POM и фрагментов |
| `.cursor/skills/` | Навыки Cursor для разработки автотестов |
| `tests/` | E2E-тесты |

## Команды

```bash
npm ci              # установить зависимости
npm test            # запустить тесты
npm run typecheck   # проверка типов TypeScript
npm run lint        # линтинг
npm run lint:fix    # автоисправление линтера
npm run format      # форматирование Prettier
```

## Запуск в CI

См. `.github/workflows/playwright.yml`.
