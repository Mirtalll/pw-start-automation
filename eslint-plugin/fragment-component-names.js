/**
 * Правило: fragment-component-names
 *
 * Проверяет, что все компоненты, создаваемые внутри фрагмента,
 * имеют параметр name (последний аргумент конструктора).
 *
 * @example
 *   // ✅ Хорошо
 *   this.logo = new Label(this.page, this.root, '.brand', 'Логотип');
 *
 *   // ❌ Плохо
 *   this.logo = new Label(this.page, this.root, '.brand');
 */
export const fragmentComponentNames = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Компоненты внутри фрагмента должны иметь name',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      missingName: 'Компонент "{{componentType}}" должен иметь параметр name',
    },
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename || context.getFilename();
    if (!filename.includes('fragments/')) {
      return {};
    }

    // Компоненты, которые требуют name
    const knownComponents = new Set([
      'Button',
      'Input',
      'Checkbox',
      'Label',
      'Select',
      'Title',
    ]);

    return {
      NewExpression(node) {
        const calleeName = node.callee?.name;
        if (!knownComponents.has(calleeName)) return;

        // Проверяем количество аргументов
        // Конструктор: (page, parentOrLocator, locator?, name?)
        // name — 4-й аргумент, должен быть строкой
        if (node.arguments.length < 4) {
          context.report({
            node,
            messageId: 'missingName',
            data: { componentType: calleeName },
          });
          return;
        }

        const nameArg = node.arguments[3];
        // Поддерживаем строковые литералы и шаблонные строки
        const isValidName =
          (nameArg.type === 'Literal' && typeof nameArg.value === 'string' && nameArg.value) ||
          nameArg.type === 'TemplateLiteral' ||
          (nameArg.type === 'BinaryExpression' && nameArg.operator === '+');

        if (!isValidName) {
          context.report({
            node: nameArg,
            messageId: 'missingName',
            data: { componentType: calleeName },
          });
        }
      },
    };
  },
};
