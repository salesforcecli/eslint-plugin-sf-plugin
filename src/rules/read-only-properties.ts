/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { extendsSfCommand, isInCommandDirectory } from '../shared/commands';

const props = ['summary', 'description', 'examples', 'flags', 'requiresProject', 'hidden'];

export const readOnlyProperties = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Class-level static properties, like flags or descriptions, should be marked read-only',
      recommended: 'error',
    },
    messages: {
      message: 'The {{prop}} property should be read-only',
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
              extendsSfCommand(node.parent.parent)
            ) {
              context.report({
                node,
                messageId: 'message',
                data: { prop: node.key.name },
                fix: (fixer) => fixer.insertTextBefore(node.key, 'readonly '),
              });
            }
          },
        }
      : {};
  },
});
