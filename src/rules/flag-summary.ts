/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { ASTUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { flagPropertyIsNamed, isFlag } from '../shared/flags';

export const flagSummary = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Enforce that flags have a summary property and that longDescription is renamed to description',
      recommended: 'recommended',
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
              ancestorsContainsSfCommand(context) &&
              node.value?.type === AST_NODE_TYPES.CallExpression &&
              node.value.arguments?.[0]?.type === AST_NODE_TYPES.ObjectExpression
            ) {
              const propertyArguments = node.value.arguments[0].properties.filter(
                ASTUtils.isNodeOfType(AST_NODE_TYPES.Property)
              );

              if (!propertyArguments.some(flagPropertyIsNamed('summary'))) {
                const descriptionProp = propertyArguments.find(flagPropertyIsNamed('description'));

                const range = descriptionProp && 'key' in descriptionProp ? descriptionProp?.key.range : undefined;
                return context.report({
                  node,
                  messageId: 'message',
                  ...(range
                    ? {
                        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                        fix: (fixer) => fixer.replaceTextRange(range, 'summary'),
                      }
                    : {}),
                });
              }
              if (!propertyArguments.some(flagPropertyIsNamed('description'))) {
                // if there is no description, but there is a longDescription, turn that into the description
                const longDescriptionProp = propertyArguments.find(flagPropertyIsNamed('longDescription'));
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
                        fix: (fixer) => fixer.replaceTextRange(range, 'description'),
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
