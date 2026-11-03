---
name: ui-fragment-analysis
description: Анализирует UI и разбивает на фрагменты POM. Принимает HTML или использует Playwright MCP для изучения живого приложения. Режим «HTML одного фрагмента»: пишет/корректирует класс фрагмента и тесты. Use when: анализ UI, разбить на фрагменты, HTML в фрагменты, изучить UI, browser snapshot, структура страницы, изучить страницу, изучить по ссылке, explore page, HTML фрагмент, напиши фрагмент по HTML.
---

# Purpose

Анализ UI приложения и разбиение на фрагменты для POM фреймворка pw-start-automation. Три режима: (1) HTML одного фрагмента → класс + тесты; (2) HTML целиком → разбить на фрагменты; (3) живое приложение через Playwright MCP (cursor-ide-browser).

## Команды (скопируй в чат)

**Режим 1 (HTML одного фрагмента):** Вот HTML фрагмента, напиши класс и тесты: `<nav>...</nav>`

**Режим 3 (живое приложение):** Изучи страницу по ссылке, разбей на фрагменты POM и напиши базовые тесты: `https://example.com`

# When to use

- **Пользователь дал кусок HTML одного фрагмента** — написать/скорректировать класс фрагмента и тесты (Режим 1)
- Пользователь дал HTML-код целиком — разбить на фрагменты (Режим 2)
- Нужно изучить UI приложения — использовать browser MCP (Режим 3)
- Планирование структуры POM перед написанием кода
- Рефакторинг: понять текущую структуру страницы

# Inputs needed

- **Режим 1:** кусок HTML одного фрагмента; опционально: имя фрагмента, страница, где он используется
- **Режим 2:** HTML-код целиком
- **Режим 3:** URL приложения
- Контекст: какая страница, что тестируем

# Procedure

## Режим 1: HTML одного фрагмента → класс + тесты

**Когда:** пользователь дал кусок HTML, содержащий один UI-фрагмент.

1. Проанализировать HTML: root (корневой контейнер), элементы, статичные/динамичные.
2. Проверить: есть ли уже класс фрагмента в `src/ui/fragments/` для этого блока.
3. **Написать или скорректировать класс фрагмента** — skill **pom-framework**. Файл `src/ui/fragments/{name}.fragment.ts`. Root, компоненты (Button, Label, Input...), методы для динамичных элементов.
4. **Написать тесты** — skill **playwright-e2e**. Файл `tests/{fragmentName}.spec.ts`. Покрыть: видимость root и элементов, клики/навигация, атрибуты (href и т.п.).
5. Убедиться, что фрагмент зарегистрирован на странице (MainPage или другая) и доступен через фикстуру.

**Output:** готовый `.fragment.ts` и `.spec.ts`, без лишнего анализа — сразу код.

## Режим 2: HTML-код целиком

1. Проанализировать структуру HTML.
2. Выделить логические блоки по критериям (см. ниже).
3. Для каждого блока: root selector, элементы, статичные/динамичные.
4. Сформировать output.

## Режим 3: Playwright MCP (живое приложение)

MCP-сервер: **cursor-ide-browser** (у user-playwright нет browser_lock).

**Порядок при URL-first (пользователь дал только ссылку):**

1. **browser_tabs** (action: list) — проверить открытые вкладки.
2. **browser_navigate** (url) — открыть страницу.
3. **browser_lock** — зафиксировать вкладку (после navigate; если вкладка уже есть — lock первым).
4. **browser_snapshot** — получить структуру страницы (accessibility tree).
5. Опционально: **browser_snapshot** с `selector` — снимок поддерева (например, только header).
6. Для dropdown/modal: **browser_click** или **browser_hover** → подождать → **browser_snapshot** — увидеть динамический контент.
7. **browser_unlock** — в конце всех операций.
8. Проанализировать snapshot, выделить фрагменты.
9. Сформировать output фрагментов.
10. **Написать базовые тесты** — на увиденный функционал (элементы, ссылки, кнопки из snapshot) создать spec в tests/, следуя skill playwright-e2e.

**Порядок MCP:** navigate → lock → (snapshot, click, hover...) → unlock.

## Шаг после фрагментов: базовые тесты

После вывода анализа фрагментов (Режим 2 и 3) — написать базовые тесты на **увиденный функционал**. В Режиме 1 тесты пишутся сразу вместе с классом. Использовать skill **playwright-e2e**.

**Что покрыть тестами (минимум):**

- Видимость root и ключевых элементов каждого фрагмента
- Клики по ссылкам → проверка waitForURL
- Интерактив (кнопки, dropdown, модалки) → click/hover + проверка результата
- Атрибуты (href у ссылок) → toHaveAttributeAllure

**Файл:** tests/{fragmentName}.spec.ts или расширить существующий. Импорт из ../index, Allure-матчеры.

## Критерии разбиения на фрагменты

**Фрагмент — это:**

- Логический блок UI (header, sidebar, main content, modal, form, card)
- Имеет один корневой контейнер (root)
- Содержит несколько элементов (кнопки, ссылки, поля, текст)
- Переиспользуется на странице или между страницами

**Признаки фрагмента:**

- Семантические теги: `<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<form>`
- Контейнеры с классом/ролью: `.navbar`, `.sidebar`, `.modal`, `.card`
- Повторяющиеся блоки (список карточек, меню)
- Блоки, появляющиеся по действию (dropdown menu, modal, tooltip) — отдельный фрагмент или метод внутри родительского

**Статичные vs динамичные:**

- Статичные: всегда в DOM при загрузке — в конструкторе фрагмента
- Динамичные: появляются после click/hover (dropdown, modal) — в методах фрагмента

**Выбор компонента для элемента:**
| Элемент | Компонент |
|---------|-----------|
| Текст, лого | Label |
| Кнопка, ссылка \<a\> | Button |
| input | Input |
| checkbox | Checkbox |
| select | Select |
| h1-h6 | Title |

# Output format

```markdown
## UI Fragment Analysis

### Фрагменты

#### 1. HeaderFragment

- **Root:** `.navbar__inner` (или селектор из HTML/snapshot)
- **Статичные элементы:**
  - logo: Label — `.navbar__brand`
  - docsLink: Button — `a.navbar__link[href="/docs/intro"]`
  - searchButton: Button — `button.DocSearch-Button`
  - ...
- **Динамичные (методы):**
  - getLanguageOption(prefix): Button — внутри dropdown после hover

#### 2. SidebarFragment

- **Root:** `.sidebar` (или аналог)
- **Статичные элементы:** ...

#### 3. SearchModalFragment (если модалка)

- **Root:** `.DocSearch-Modal`
- Появляется после click на searchButton — либо отдельный фрагмент, либо метод в HeaderFragment

### Рекомендации

- Селекторы: предпочитать data-\*, role, стабильные классы
- Избегать сгенерированных классов
```

# Quality bar (self-check)

- [ ] Режим 1: класс фрагмента + тесты написаны, фрагмент на странице
- [ ] Все логические блоки выделены (Режим 2/3)
- [ ] У каждого фрагмента есть root
- [ ] Элементы сопоставлены с компонентами (Button, Label, Input...)
- [ ] Динамичные элементы отмечены как методы
- [ ] При MCP: lock/unlock соблюдён, snapshot получен
- [ ] Базовые тесты на увиденный функционал написаны (видимость, навигация, интерактив)

# Anti-patterns

- ❌ Режим 1: только анализ без кода — нужен готовый .fragment.ts и .spec.ts
- ❌ Один фрагмент на всю страницу (разбить на header, sidebar, main...)
- ❌ Элемент без родительского root (каждый элемент внутри root фрагмента)
- ❌ Путать статичное и динамичное (dropdown items — метод, не конструктор)
- ❌ Игнорировать семантику HTML (nav, header, aside — кандидаты в фрагменты)

# Examples

**Input (Режим 1 — HTML одного фрагмента):** Вот HTML фрагмента, напиши класс и тесты.

```html
<nav class="navbar__inner">
  <a class="navbar__brand">Playwright</a>
  <a class="navbar__link" href="/docs/intro">Docs</a>
  <a class="navbar__link" href="/docs/api">API</a>
  <button class="DocSearch-Button">Search</button>
</nav>
```

**Output:** Готовый `header.fragment.ts` (или скорректированный) с root `.navbar__inner`, logo: Label, docsLink: Button, apiLink: Button, searchButton: Button. Плюс `tests/header.spec.ts` с тестами на видимость, клики, href.

---

**Input (Режим 2 — HTML целиком):** Вот HTML навбара, разбей на фрагменты.

```html
<nav class="navbar__inner">
  <a class="navbar__brand">Playwright</a>
  <a class="navbar__link" href="/docs/intro">Docs</a>
  <a class="navbar__link" href="/docs/api">API</a>
  <button class="DocSearch-Button">Search</button>
</nav>
```

**Output:** HeaderFragment, root `.navbar__inner`, logo: Label `.navbar__brand`, docsLink: Button `a[href="/docs/intro"]`, apiLink: Button `a[href="/docs/api"]`, searchButton: Button `button.DocSearch-Button`.

**Input:** Открой playwright.dev и разбей главную на фрагменты.

**Output:** Использовать browser_navigate → browser_lock → browser_snapshot → анализ → browser_unlock. Выдать список фрагментов с root и элементами. Затем написать базовые тесты на увиденный функционал в tests/ по skill playwright-e2e.
