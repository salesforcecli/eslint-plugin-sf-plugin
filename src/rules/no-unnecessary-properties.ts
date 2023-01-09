/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { extendsSfCommand, isInCommandDirectory } from '../shared/commands';

const props = ['requiresProject', 'hidden'];

export const noUnnecessaryProperties = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Boolean properties are false by default, so they should not be set to false',
      recommended: 'warn',
    },
    messages: {
      message: 'The {{prop}} property can be omitted since it is false by default',
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
              !node.readonly &&
              node.static &&
              node.key.type === AST_NODE_TYPES.Identifier &&
              props.includes(node.key.name) &&
              node.parent.type === AST_NODE_TYPES.ClassBody &&
              node.parent.parent.type === AST_NODE_TYPES.ClassDeclaration &&
              node.value.type === AST_NODE_TYPES.Literal &&
              node.value.value === false &&
              extendsSfCommand(node.parent.parent)
            ) {
              context.report({
                node,
                messageId: 'message',
                data: { prop: node.key.name },
                fix: (fixer) => fixer.remove(node),
              });
            }
          },
        }
      : {};
  },
});
