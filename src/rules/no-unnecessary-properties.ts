/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { extendsSfCommand, isInCommandDirectory } from '../shared/commands';

const falseProps = ['requiresProject', 'hidden'];
const emptyProps = ['aliases'];

export const noUnnecessaryProperties = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Boolean properties are false by default, so they should not be set to false',
      recommended: 'warn',
    },
    messages: {
      messageFalse: 'The {{prop}} property can be omitted since it is false by default',
      messageEmpty: 'The {{prop}} property can be omitted since it is empty',
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
              node.key?.type === AST_NODE_TYPES.Identifier &&
              node.parent?.type === AST_NODE_TYPES.ClassBody &&
              node.parent?.parent?.type === AST_NODE_TYPES.ClassDeclaration &&
              node.value &&
              extendsSfCommand(node.parent.parent)
            ) {
              // properties that default to false
              if (
                node.value?.type === AST_NODE_TYPES.Literal &&
                falseProps.includes(node.key.name) &&
                node.value.value === false
              ) {
                context.report({
                  node,
                  messageId: 'messageFalse',
                  data: { prop: node.key.name },
                  fix: (fixer) => fixer.remove(node),
                });
              }
              // properties that default to emptyArrays
              if (
                node.value?.type === AST_NODE_TYPES.ArrayExpression &&
                emptyProps.includes(node.key.name) &&
                node.value.elements.length === 0
              ) {
                context.report({
                  node,
                  messageId: 'messageEmpty',
                  data: { prop: node.key.name },
                  fix: (fixer) => fixer.remove(node),
                });
              }
            }
          },
        }
      : {};
  },
});
