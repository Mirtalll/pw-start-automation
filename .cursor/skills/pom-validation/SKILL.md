---
name: pom-validation
description: Validates POM structure in pw-start-automation: components, fragments, pages, fixtures. Audits against manifest and soul rules. Use when validating POM, auditing, reviewing Page Object structure, or when user says проверить POM, валидация, аудит, review POM, корректность POM.
---

# POM Validation

Проверка корректности реализации POM в pw-start-automation. Аудит по правилам manifest и soul.

## When to use

- Проверка POM перед коммитом или PR
- Аудит после рефакторинга
- Запросы «проверь POM», «валидация», «корректность»

## Inputs

- Файлы: `src/ui/components/`, `src/ui/fragments/`, `src/ui/pages/`, `src/fixtures/`
- Контекст изменений (если есть)

## Procedure

Проверить каждый слой по чеклисту. Для каждого нарушения — путь, строка, описание.

### 1. Компоненты (src/ui/components/)

- [ ] extends BaseComponent
- [ ] Конструктор: (page, parentOrLocator, locator?, name?)
- [ ] Действия обёрнуты в allure.step()
- [ ] Экспорт в index.ts
- [ ] Нет дублирования с другими компонентами

### 2. Фрагменты (src/ui/fragments/)

- [ ] extends BaseFragment, super(page)
- [ ] root: Locator объявлен, root всегда Locator (не компонент)
- [ ] Статичные элементы — в конструкторе
- [ ] Динамичные элементы — в методах с allure.step()
- [ ] parent для вложенных = parentComponent.element, не page.locator
- [ ] Нет page.locator() для элементов, принадлежащих фрагменту
- [ ] Методы, возвращающие компонент: Promise<Button> и т.п.
- [ ] Нет дублирующих локаторов и методов

### 3. Страницы (src/ui/pages/)

- [ ] extends BasePage, super(page)
- [ ] Агрегирует только фрагменты, не компоненты
- [ ] Фрагменты создаются в конструкторе: new XxxFragment(page)
- [ ] Специфичные действия — в методах с allure.step()
- [ ] Нет дублирующих методов

### 4. Фикстуры (src/fixtures/)

- [ ] pom.fixtures.ts: страницы зарегистрированы в extend
- [ ] merge.fixtures.ts не изменён без необходимости (только pomTest + expectExtensions)
- [ ] Типы в extend соответствуют классам страниц

### 5. Селекторы (все слои)

- [ ] Предпочтение: data-\*, role, семантические классы
- [ ] Сгенерированные классы — с комментарием о риске
- [ ] Scoping: элементы фрагмента внутри root

### 6. Иерархия

- [ ] Page → Fragment → Component (страница не содержит компоненты напрямую)
- [ ] Один элемент — одно место (нет дублирования локаторов)

## Output format

```markdown
## POM Validation Report

### Passed

- [x] Компоненты: ...
- [x] Фрагменты: ...

### Violations

#### Critical

- `src/ui/fragments/foo.fragment.ts:15` — page.locator для элемента фрагмента, нужен root
- ...

#### Suggestion

- `src/ui/pages/bar.page.ts` — метод X можно вынести во фрагмент
- ...

### Summary

- Passed: N checks
- Critical: N
- Suggestion: N
```

## Quality bar

- [ ] Все файлы в src/ui/ и src/fixtures/ проверены
- [ ] Каждое нарушение — с путём и строкой
- [ ] Уровни Critical / Suggestion разделены
- [ ] Рекомендации конкретные, не общие

## Anti-patterns

- ❌ Общие фразы без указания файла/строки
- ❌ Пропуск слоёв (проверить только фрагменты, забыть страницы)
- ❌ Смешивание Critical и Suggestion без разделения
- ❌ Игнорирование дублирования локаторов/методов

## Example

**Input:** Проверь корректность POM в проекте.

**Output:** Отчёт по чеклисту с перечислением passed/violations, файл:строка для каждого нарушения, уровни Critical/Suggestion.
