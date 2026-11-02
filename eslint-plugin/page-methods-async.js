/**
 * Правило: page-methods-async
 *
 * Проверяет, что все методы страницы являются async.
 * Это важно для единообразия и корректной работы с Playwright.
 *
 * @example
 *   // ✅ Хорошо
 *   async getTitle(): Promise<string> { ... }
 *
 *   // ❌ Плохо
 *   getTitle(): string { ... }
 */
export const pageMethodsAsync = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Все методы страницы должны быть async',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      notAsync: 'Метод "{{methodName}}" в странице "{{className}}" должен быть async',
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

        // Проверяем все методы класса
        const methods = node.body.body.filter(
          (member) =>
            member.type === 'MethodDefinition' &&
            member.kind === 'method' &&
            member.key.name !== 'constructor',
        );

        methods.forEach((method) => {
          if (!method.value.async) {
            context.report({
              node: method,
              messageId: 'notAsync',
              data: { className, methodName: method.key.name },
            });
          }
        });
      },
    };
  },
};
