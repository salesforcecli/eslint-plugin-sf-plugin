/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { extendsSfCommand, isInCommandDirectory } from '../shared/commands';
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';

const props = ['summary', 'description', 'examples', 'flags', 'requiresProject', 'hidden', 'aliases'];

export const readOnlyProperties = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Class-level static properties, like flags or descriptions, should be marked public and read-only',
      recommended: 'recommended',
    },
    messages: {
      readonly: 'The {{prop}} property should be read-only',
      public: 'The {{prop}} property should be public',
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
              props.includes(node.key.name) &&
              node.parent?.type === AST_NODE_TYPES.ClassBody &&
              node.parent.parent?.type === AST_NODE_TYPES.ClassDeclaration &&
              extendsSfCommand(node.parent.parent)
            ) {
              if (!node.readonly) {
                context.report({
                  node,
                  messageId: 'readonly',
                  data: { prop: node.key.name },
                  fix: (fixer) => fixer.insertTextBefore(node.key, 'readonly '),
                });
              } else if (node.accessibility && node.accessibility !== 'public') {
                const replacementText = context.sourceCode.getText(node).replace(node.accessibility, 'public');
                context.report({
                  node,
                  messageId: 'public',
                  data: { prop: node.key.name },
                  fix: (fixer) => fixer.replaceText(node, replacementText),
                });
              }
            }
          },
        }
      : {};
  },
});
