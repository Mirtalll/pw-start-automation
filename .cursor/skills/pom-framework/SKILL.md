---
name: pom-framework
description: Creates POM components, fragments, and pages for pw-start-automation. Use when creating new UI components, fragments, pages, or extending fixtures. Trigger terms: component, fragment, page, BaseComponent, BaseFragment, создать компонент, новый фрагмент, сайдбар, модалка.
---

# Purpose

Расширение фреймворка pw-start-automation: новые UI-компоненты, фрагменты, страницы, фикстуры. Иерархия: Page → Fragment → Component.

# When to use

- Создание компонента (если нет подходящего: Button, Input, Label, Checkbox, Select, Title)
- Создание фрагмента (хедер, сайдбар, модалка, любой переиспользуемый блок)
- Создание страницы (новый URL/маршрут)
- Регистрация новой страницы в фикстурах

# Inputs needed

- Селекторы элементов (CSS, data-\*, role)
- Иерархия: что внутри чего (parent → child)
- Статичные (всегда в DOM) vs динамичные (появляются после действия или зависят от параметра)
- Есть ли уже нужные локаторы/методы во фрагментах и страницах (проверить перед созданием)

# Procedure

## 0. Проверка на дублирование

Перед созданием — проверить src/ui/fragments/, src/ui/pages/, src/ui/components/. Не дублировать локаторы и методы. Если элемент или метод уже есть — использовать существующий, не создавать новый.

## Компонент

1. Проверить: есть ли подходящий в src/ui/components/? Button, Input, Label, Checkbox, Select, Title.
2. Если нужен новый: extends BaseComponent, конструктор `(page, parentOrLocator, locator?, name?)`.
3. parentOrLocator: Locator (root или component.element) или string (селектор страницы).
4. locator: CSS внутри parent. name: читаемое описание для Allure.
5. Действия (click, fill, hover и т.п.) — обёрнуты в allure.step().
6. Экспорт в index.ts.

**Выбор компонента:**

| Элемент                           | Компонент |
| --------------------------------- | --------- |
| Текст, лого, заголовок (чтение)   | Label     |
| Кнопка, ссылка `<a>`, клик, hover | Button    |
| Поле ввода input                  | Input     |
| Чекбокс                           | Checkbox  |
| Выпадающий список select          | Select    |
| Заголовок h1-h6                   | Title     |

## Фрагмент

1. JSDoc-комментарий над классом: кратко описать, что за фрагмент. Пример: `/** Фрагмент хедера страницы. */`
2. extends BaseFragment, super(page).
3. root: Locator = this.page.locator('.container-selector') — корневой контейнер блока.
4. Статичные элементы — в конструкторе: new Button(this.page, this.root, 'selector', 'Name').
5. Динамичные (dropdown items, modal content, зависят от параметра) — в методах с allure.step().
6. Вложенные элементы: parent = parentComponent.element, не page.locator.
7. Методы, возвращающие компонент: Promise<Button> и т.п.

**Шаблон фрагмента:**

```typescript
import { allure } from 'allure-playwright';
import type { Page, Locator } from '@playwright/test';
import { BaseFragment } from './base.fragment';
import { Button } from '../components/button.component';
import { Label } from '../components/label.component';

/** Фрагмент [краткое описание]. */
export class MyFragment extends BaseFragment {
  root: Locator;
  someButton: Button;
  someLabel: Label;

  constructor(page: Page) {
    super(page);
    this.root = this.page.locator('.container-selector');
    this.someButton = new Button(this.page, this.root, 'button.submit', 'Submit button');
    this.someLabel = new Label(this.page, this.root, '.title', 'Title');
  }

  async getDynamicOption(id: string): Promise<Button> {
    return allure.step(`Получение опции: ${id}`, async () => {
      return new Button(this.page, this.someButton.element, `[data-id="${id}"]`, `Option ${id}`);
    });
  }
}
```

## Страница

1. extends BasePage, super(page).
2. Агрегирует только фрагменты, не компоненты.
3. Фрагменты в конструкторе: new HeaderFragment(page).
4. Методы BasePage: openPage(url), waitForUrl(), reload(), getTitle(), getUrl(), screenshot().
5. Специфичные действия страницы — в методах с allure.step().

**Регистрация в фикстурах:**

- Добавить в pom.fixtures.ts: `docsPage: async ({ page }, use) => { await use(new DocsPage(page)); }`
- Тип в extend: `pomTest.extend<{ mainPage: MainPage; docsPage: DocsPage }>({ ... })`
- merge.fixtures.ts не трогать — он уже использует pomTest.

## Селекторы

- Предпочитать: data-\*, role, семантические классы.
- Избегать: сгенерированные (.colorModeToggle_DEke). Если нет выбора — использовать и закомментировать риск.

# Output format

- Файлы: src/ui/components/_.component.ts, src/ui/fragments/_.fragment.ts, src/ui/pages/\*.page.ts
- Обновления: index.ts (экспорт компонента/фрагмента/страницы), pom.fixtures.ts (фикстура для новой страницы)

# Quality bar (self-check)

- [ ] Фрагмент имеет JSDoc-комментарий над классом (краткое описание)
- [ ] Проверено: нет дублирующих локаторов и методов во фрагментах/страницах
- [ ] Scoping: все элементы фрагмента внутри root; вложенные через parentComponent.element
- [ ] Динамичные элементы — только в методах с allure.step()
- [ ] Страница агрегирует фрагменты, не компоненты
- [ ] npm run typecheck проходит

# Anti-patterns

- ❌ Дублировать локаторы и методы фрагмента/страницы, если они уже есть
- ❌ page.locator() для элементов, принадлежащих фрагменту
- ❌ Динамичный элемент в конструкторе фрагмента
- ❌ Компоненты напрямую в странице (страница → фрагменты → компоненты)
- ❌ parent = page.locator для вложенного в dropdown/modal (использовать parentComponent.element)
- ❌ Сгенерированные селекторы без комментария

# Examples

**Input:** Создай фрагмент для сайдбара с ссылками Docs и API.

**Output:**

```typescript
// src/ui/fragments/sidebar.fragment.ts
import type { Page, Locator } from '@playwright/test';
import { BaseFragment } from './base.fragment';
import { Button } from '../components/button.component';

/** Фрагмент сайдбара страницы. */
export class SidebarFragment extends BaseFragment {
  root: Locator;
  docsLink: Button;
  apiLink: Button;

  constructor(page: Page) {
    super(page);
    this.root = this.page.locator('.sidebar');
    this.docsLink = new Button(this.page, this.root, 'a[href="/docs/intro"]', 'Docs link');
    this.apiLink = new Button(this.page, this.root, 'a[href="/docs/api"]', 'API link');
  }
}
```

**Input:** Добавь страницу DocsPage с SidebarFragment и зарегистрируй фикстуру.

**Output:**

- DocsPage в src/ui/pages/docsPage.ts с sidebarFragment: SidebarFragment
- pom.fixtures.ts: docsPage fixture
- index.ts: export { DocsPage }
