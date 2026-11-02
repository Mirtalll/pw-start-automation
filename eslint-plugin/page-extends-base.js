/**
 * Правило: page-extends-base
 *
 * Проверяет, что все файлы в папке pages/ содержат класс,
 * который наследуется от BasePage.
 *
 * @example
 *   // ✅ Хорошо
 *   export class MainPage extends BasePage { ... }
 *
 *   // ❌ Плохо
 *   export class MainPage { ... }
 */
export const pageExtendsBase = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Страницы должны наследоваться от BasePage',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      missingExtends: 'Страница "{{className}}" должна наследоваться от BasePage',
    },
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename || context.getFilename();
    if (!filename.includes('pages/')) {
      return {};
    }

    return {
      ClassDeclaration(node) {
        const className = node.id?.name;
        if (!className) return;

        // Пропускаем базовый класс
        if (className === 'BasePage') return;

        const superClass = node.superClass;
        if (!superClass || superClass.name !== 'BasePage') {
          context.report({
            node,
            messageId: 'missingExtends',
            data: { className },
          });
        }
      },
    };
  },
};
