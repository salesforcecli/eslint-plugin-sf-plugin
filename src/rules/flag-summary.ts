/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ASTUtils, AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { flagPropertyIsNamed, isFlag } from '../shared/flags';

export const flagSummary = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Enforce that flags have a summary property and that longDescription is renamed to description',
      recommended: 'error',
    },
    messages: {
      message: 'Flags should have a summary property',
      longDescription: 'use "description" instead of "longDescription"',
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
            if (
              isFlag(node) &&
              ancestorsContainsSfCommand(context.getAncestors()) &&
              node.value?.type === AST_NODE_TYPES.CallExpression &&
              node.value.arguments?.[0]?.type === AST_NODE_TYPES.ObjectExpression
            ) {
              if (
                !node.value.arguments[0].properties.some(
                  (property) => property.type === AST_NODE_TYPES.Property && flagPropertyIsNamed(property, 'summary')
                )
              ) {
                const descriptionProp = node.value.arguments[0].properties
                  .filter(ASTUtils.isNodeOfType(AST_NODE_TYPES.Property))
                  .find((property) => flagPropertyIsNamed(property, 'description'));

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
              if (
                !node.value.arguments[0].properties.some(
                  (property) =>
                    property.type === AST_NODE_TYPES.Property && flagPropertyIsNamed(property, 'description')
                )
              ) {
                // if there is no description, but there is a longDescription, turn that into the description
                const longDescriptionProp = node.value.arguments[0].properties.find(
                  (property) =>
                    property.type === AST_NODE_TYPES.Property && flagPropertyIsNamed(property, 'longDescription')
                );
                if (!longDescriptionProp) {
                  return;
                }
                const range =
                  longDescriptionProp && 'key' in longDescriptionProp ? longDescriptionProp?.key.range : undefined;
                return context.report({
                  node: longDescriptionProp,
                  messageId: 'longDescription',
                  ...(range
                    ? {
                        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                        fix: (fixer) => {
                          return fixer.replaceTextRange(range, 'description');
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
