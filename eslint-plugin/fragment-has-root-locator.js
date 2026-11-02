/**
 * Правило: fragment-has-root-locator
 *
 * Проверяет, что каждый фрагмент имеет публичное свойство root: Locator.
 *
 * @example
 *   // ✅ Хорошо
 *   export class HeaderFragment extends BaseFragment {
 *     root: Locator;
 *     constructor(page: Page) {
 *       super(page);
 *       this.root = this.page.locator('.navbar__inner');
 *     }
 *   }
 *
 *   // ❌ Плохо
 *   export class HeaderFragment extends BaseFragment {
 *     constructor(page: Page) { ... }
 *   }
 */
export const fragmentHasRootLocator = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Фрагменты должны иметь root: Locator',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      missingRoot: 'Фрагмент "{{className}}" должен иметь свойство root: Locator',
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
        if (!className || className === 'BaseFragment') return;

        // Ищем PropertyDefinition с именем 'root'
        const hasRoot = node.body.body.some(
          (member) =>
            member.type === 'PropertyDefinition' &&
            member.key?.name === 'root',
        );

        if (!hasRoot) {
          context.report({
            node,
            messageId: 'missingRoot',
            data: { className },
          });
        }
      },
    };
  },
};
