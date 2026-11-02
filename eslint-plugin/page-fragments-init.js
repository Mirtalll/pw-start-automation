/**
 * Правило: page-fragments-init
 *
 * Проверяет, что все фрагменты страницы инициализируются в конструкторе.
 * Фрагменты, объявленные как свойства класса, должны быть инициализированы
 * через this.<fragment> = new <Fragment>(page).
 *
 * @example
 *   // ✅ Хорошо
 *   export class MainPage extends BasePage {
 *     headerFragment: HeaderFragment;
 *     constructor(page: Page) {
 *       super(page);
 *       this.headerFragment = new HeaderFragment(page);
 *     }
 *   }
 *
 *   // ❌ Плохо
 *   export class MainPage extends BasePage {
 *     headerFragment: HeaderFragment;
 *     constructor(page: Page) {
 *       super(page);
 *       // fragment не инициализирован
 *     }
 *   }
 */
export const pageFragmentsInit = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Фрагменты страницы должны инициализироваться в конструкторе',
      category: 'Best Practices',
      recommended: true,
    },
    schema: [],
    messages: {
      missingInit: 'Фрагмент "{{fragmentName}}" в странице "{{className}}" должен быть инициализирован в конструкторе',
    },
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename || context.getFilename();
    if (!filename.includes('pages/')) {
      return {};
    }

    // Имена, которые считаются фрагментами (содержат Fragment)
    const isFragmentType = (typeName) => typeName.includes('Fragment');

    return {
      ClassDeclaration(node) {
        const className = node.id?.name;
        if (!className || className === 'BasePage') return;

        // Собираем все свойства-фрагменты
        const fragmentProperties = node.body.body.filter(
          (member) =>
            member.type === 'PropertyDefinition' &&
            member.typeAnnotation?.typeAnnotation?.typeName &&
            isFragmentType(member.typeAnnotation.typeAnnotation.typeName.name),
        );

        if (fragmentProperties.length === 0) return;

        // Получаем конструктор
        const constructor = node.body.body.find(
          (member) => member.type === 'MethodDefinition' && member.kind === 'constructor',
        );

        if (!constructor) {
          // Нет конструктора — фрагменты точно не инициализированы
          fragmentProperties.forEach((prop) => {
            context.report({
              node: prop,
              messageId: 'missingInit',
              data: { className, fragmentName: prop.key.name },
            });
          });
          return;
        }

        // Ищем все присваивания this.<prop> = new ... в конструкторе
        const body = constructor.value.body?.body || [];
        const initializedProps = new Set();

        body.forEach((stmt) => {
          if (
            stmt.type === 'ExpressionStatement' &&
            stmt.expression.type === 'AssignmentExpression' &&
            stmt.expression.left.object?.type === 'ThisExpression'
          ) {
            initializedProps.add(stmt.expression.left.property?.name);
          }
        });

        // Проверяем, что все фрагменты инициализированы
        fragmentProperties.forEach((prop) => {
          if (!initializedProps.has(prop.key.name)) {
            context.report({
              node: prop,
              messageId: 'missingInit',
              data: { className, fragmentName: prop.key.name },
            });
          }
        });
      },
    };
  },
};
