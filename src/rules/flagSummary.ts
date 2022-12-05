/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { flagPropertyIsNamed, isFlag } from '../shared/flags';

export const flagSummary = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Enforce that flags have a summary property',
      recommended: 'error',
    },
    messages: {
      message: 'Flags should have a summary property',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          Property(node): void {
            if (isFlag(node) && ancestorsContainsSfCommand(context.getAncestors())) {
              if (
                node.value?.type === AST_NODE_TYPES.CallExpression &&
                node.value.arguments?.[0]?.type === AST_NODE_TYPES.ObjectExpression &&
                !node.value.arguments[0].properties.some(
                  (property) => property.type === AST_NODE_TYPES.Property && flagPropertyIsNamed(property, 'summary')
                )
              ) {
                // use the description as the summary if it exists
                const descriptionProp = node.value.arguments[0].properties.find(
                  (property) =>
                    property.type === AST_NODE_TYPES.Property && flagPropertyIsNamed(property, 'description')
                );
                const range = descriptionProp && 'key' in descriptionProp ? descriptionProp?.key.range : undefined;
                return context.report({
                  node,
                  messageId: 'message',
                  ...(range
                    ? {
                        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                        fix: (fixer) => {
                          return fixer.replaceTextRange(range, 'summary');
                        },
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
