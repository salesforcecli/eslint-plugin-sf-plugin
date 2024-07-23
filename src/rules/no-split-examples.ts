/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { extendsSfCommand, isInCommandDirectory } from '../shared/commands';

export const noSplitExamples = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Arrays of messags should use getMessages instead of getMessage followed by EOL splitting',
      recommended: 'strict',
    },
    messages: {
      message: 'use getMessages',
    },
    type: 'problem',
    fixable: 'code',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          PropertyDefinition(node): void {
            if (
              node.static &&
              node.key.type === AST_NODE_TYPES.Identifier &&
              node.key.name === 'examples' &&
              node.parent?.type === AST_NODE_TYPES.ClassBody &&
              node.parent.parent?.type === AST_NODE_TYPES.ClassDeclaration &&
              node.value?.type === AST_NODE_TYPES.CallExpression &&
              node.value.callee.type === AST_NODE_TYPES.MemberExpression &&
              node.value.callee.object.type === AST_NODE_TYPES.CallExpression &&
              node.value.callee.object.callee.type === AST_NODE_TYPES.MemberExpression &&
              node.value.callee.object.callee.property.type === AST_NODE_TYPES.Identifier &&
              node.value.callee.object.callee.property.name === 'getMessage' &&
              node.value.callee.property.type === AST_NODE_TYPES.Identifier &&
              node.value.callee.property.name === 'split' &&
              extendsSfCommand(node.parent.parent, context)
            ) {
              const target = node.value;
              const fixedText = context
                .getSourceCode()
                .getText(node.value)
                .replace('getMessage', 'getMessages')
                .replace(/\.split\(.*\)/, '');
              context.report({
                node: node.value.callee.property,
                messageId: 'message',
                fix: (fixer) => fixer.replaceText(target, fixedText),
              });
            }
          },
        }
      : {};
  },
});
