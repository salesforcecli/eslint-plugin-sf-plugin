/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { flagPropertyIsNamed, isFlag } from '../shared/flags';

export const noDefaultDependsOnFlags = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Do not allow creation of a flag with default value and dependsOn',
      recommended: 'recommended',
    },
    messages: {
      message: 'Cannot create a flag with a default value and dependsOn',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          Property(node): void {
            // is a flag
            if (
              isFlag(node) &&
              ancestorsContainsSfCommand(context.getAncestors()) &&
              node.value?.type === AST_NODE_TYPES.CallExpression &&
              node.value.arguments?.[0]?.type === AST_NODE_TYPES.ObjectExpression
            ) {
              const dependsOnProperty = node.value.arguments[0].properties.find(
                (property) => property.type === AST_NODE_TYPES.Property && flagPropertyIsNamed(property, 'dependsOn')
              );
              const defaultValueProperty = node.value.arguments[0].properties.find(
                (property) => property.type === AST_NODE_TYPES.Property && flagPropertyIsNamed(property, 'default')
              );

              // @ts-expect-error from the node (flag), go up a level (parent) and find the dependsOn flag definition, see if it has a default
              const dependsOnFlagDefaultValue = node.parent.properties
                .find(
                  // @ts-expect-error value type on dependsOn
                  (f) => f.type === AST_NODE_TYPES.Property && f.key.name === dependsOnProperty?.value.elements[0].value
                )
                ?.value.arguments[0].properties.find((p) => p.key.name === 'default');
              if (dependsOnProperty && defaultValueProperty && !dependsOnFlagDefaultValue) {
                context.report({
                  node: dependsOnProperty,
                  messageId: 'message',
                });
              }
            }
          },
        }
      : {};
  },
});
