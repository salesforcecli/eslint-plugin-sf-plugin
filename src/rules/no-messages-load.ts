/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

export const noMessagesLoad = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Use Messages.loadMessages() instead of Messages.load()',
      recommended: 'error',
    },
    messages: {
      message: 'Use Messages.loadMessages() instead of Messages.load()',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node): void {
        if (
          node.callee.type === AST_NODE_TYPES.MemberExpression &&
          node.callee.object.type === AST_NODE_TYPES.Identifier &&
          node.callee.object.name === 'Messages' &&
          node.callee.property.type === AST_NODE_TYPES.Identifier &&
          node.callee.property.name === 'load' &&
          node.arguments[0].type === AST_NODE_TYPES.Literal &&
          node.arguments[1].type === AST_NODE_TYPES.Literal
        ) {
          const replacementText = `Messages.loadMessages(${node.arguments[0].raw}, ${node.arguments[1].raw})`;
          context.report({
            node: node.callee.property,
            messageId: 'message',
            fix: (fixer) => fixer.replaceText(node, replacementText),
          });
        }
      },
    };
  },
});
