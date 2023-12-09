/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export const noExecCmdDoubleQuotes = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Do not use double quotes in NUT examples.  They will not work on windows',
      recommended: 'strict',
    },
    messages: {
      message:
        'Do not use double quotes in NUT examples.  They will not work on windows. Convert your execCmd to use single quotes',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node): void {
        if (node.callee.type === AST_NODE_TYPES.Identifier && node.callee.name === 'execCmd') {
          if (
            node.arguments[0].type === AST_NODE_TYPES.Literal &&
            typeof node.arguments[0].value === 'string' &&
            node.arguments[0].value.includes('"')
          ) {
            context.report({
              node: node.arguments[0],
              messageId: 'message',
            });
          } else if (node.arguments[0].type === AST_NODE_TYPES.TemplateLiteral) {
            const source = context.getSourceCode().getText(node.arguments[0]);
            if (source.includes('"'))
              context.report({
                node: node.arguments[0],
                messageId: 'message',
              });
          }
        }
      },
    };
  },
});
