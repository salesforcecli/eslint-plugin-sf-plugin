/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { extendsSfCommand, getClassPropertyIdentifierName, isInCommandDirectory } from '../shared/commands';
export const commandSummary = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Ensure commands have a summary',
      recommended: 'error',
    },
    messages: {
      summary: 'Commands should have a summary property',
    },
    type: 'problem',
    fixable: 'code',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          ClassDeclaration(node): void {
            // verify it extends SfCommand
            if (extendsSfCommand(node)) {
              if (!node.body.body.some((member) => getClassPropertyIdentifierName(member) === 'summary')) {
                const descriptionNode = node.body.body.find(
                  (member) => getClassPropertyIdentifierName(member) === 'description'
                );
                context.report({
                  node: node.id,
                  messageId: 'summary',
                  // if you have a description, create a summary property with the same value
                  ...(descriptionNode && descriptionNode.type === AST_NODE_TYPES.PropertyDefinition
                    ? {
                        fix: (fixer) =>
                          fixer.insertTextBefore(
                            descriptionNode,
                            `public static readonly summary = ${context
                              .getSourceCode()
                              .getText(descriptionNode.value)};`
                          ),
                      }
                    : {}),
                });
              }
            }
          },
        }
      : {};
  },
});