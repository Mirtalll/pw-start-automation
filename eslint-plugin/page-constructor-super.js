/**
 * Правило: page-constructor-super
 *
 * Проверяет, что конструктор страницы вызывает super(page).
 *
 * @example
 *   // ✅ Хорошо
 *   constructor(page: Page) {
 *     super(page);
 *   }
 *
 *   // ❌ Плохо
 *   constructor(page: Page) {
 *     this.page = page;
 *   }
 */
export const pageConstructorSuper = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Конструктор страницы должен вызывать super(page)',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      missingSuper: 'Конструктор страницы "{{className}}" должен вызывать super(page)',
      wrongSuperArg: 'Конструктор страницы "{{className}}" должен передавать page в super(page)',
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
        if (!className || className === 'BasePage') return;

        // Ищем конструктор
        const constructor = node.body.body.find(
          (member) => member.type === 'MethodDefinition' && member.kind === 'constructor',
        );

        if (!constructor) {
          context.report({
            node,
            messageId: 'missingSuper',
            data: { className },
          });
          return;
        }

        // Ищем вызов super() в теле конструктора
        const body = constructor.value.body?.body || [];
        const superCall = body.find(
          (stmt) =>
            stmt.type === 'ExpressionStatement' &&
            stmt.expression.type === 'CallExpression' &&
            stmt.expression.callee.type === 'Super',
        );

        if (!superCall) {
          context.report({
            node: constructor,
            messageId: 'missingSuper',
            data: { className },
          });
          return;
        }

        // Проверяем, что аргумент super — это page
        const superArgs = superCall.expression.arguments;
        if (superArgs.length === 0 || superArgs[0].type !== 'Identifier' || superArgs[0].name !== 'page') {
          context.report({
            node: superCall,
            messageId: 'wrongSuperArg',
            data: { className },
          });
        }
      },
    };
  },
};
