/**
 * Правило: fragment-extends-base
 *
 * Проверяет, что все файлы в папке fragments/ содержат класс,
 * который наследуется от BaseFragment.
 *
 * @example
 *   // ✅ Хорошо
 *   export class HeaderFragment extends BaseFragment { ... }
 *
 *   // ❌ Плохо
 *   export class HeaderFragment { ... }
 */
export const fragmentExtendsBase = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Фрагменты должны наследоваться от BaseFragment',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      missingExtends: 'Фрагмент "{{className}}" должен наследоваться от BaseFragment',
    },
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename || context.getFilename();
    if (!filename.includes('fragments/')) {
      return {};
    }

    return {
      ClassDeclaration(node) {
        const className = node.id?.name;
        if (!className) return;

        // Пропускаем базовые классы
        if (className === 'BaseFragment') return;

        const superClass = node.superClass;
        if (!superClass || superClass.name !== 'BaseFragment') {
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
