/*
 * Copyright (c) 2023, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { ASTUtils, AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { isInCommandDirectory } from '../shared/commands';
import {
  MemberExpressionContainsMemberExpressionThisDotFoo,
  MemberExpressionHasNameOrValue,
} from '../shared/expressions';

export const noFlagTypeAssertions = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Prevent type assertions on flags',
      recommended: 'error',
    },
    messages: {
      summary: 'do not use type assertions on flags',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          TSAsExpression(node): void {
            if (
              ASTUtils.isNodeOfType(AST_NODE_TYPES.MemberExpression)(node.expression) &&
              (MemberExpressionHasNameOrValue(node.expression, 'flags') ||
                MemberExpressionContainsMemberExpressionThisDotFoo(node.expression, 'flags'))
            ) {
              const wrappedExpression = context.getSourceCode().getText(node.expression);
              context.report({
                node,
                messageId: 'summary',
                fix: (fixer) => fixer.replaceTextRange(node.range, wrappedExpression),
              });
            }
          },
        }
      : {};
  },
});
