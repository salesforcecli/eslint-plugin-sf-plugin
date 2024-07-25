/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { isFlag } from '../shared/flags';

export const noDependsOnBooleanFlags = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Do not allow flags to depend on boolean flags',
      recommended: 'recommended',
    },
    messages: {
      message: 'Cannot create a flag that `dependsOn` a boolean flag',
    },
    type: 'problem',
    schema: [],
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
              const dependsOnFlagsProp = node.value.arguments[0].properties.find(
                (p) => p.type === 'Property' && p.key.type === 'Identifier' && p.key.name === 'dependsOn'
              );

              if (dependsOnFlagsProp) {
                // @ts-ignore we know `dependsOn` exists/is an array
                const dependedOnFlags = dependsOnFlagsProp.value.elements.map((l) => l.value);

                for (const flag of dependedOnFlags) {
                  if (node.parent.type === 'ObjectExpression') {
                    const possibleBoolFlag = node.parent.properties.find(
                      (f) =>
                        f.type === AST_NODE_TYPES.Property &&
                        f.key.type == AST_NODE_TYPES.Identifier &&
                        f.key.name === flag &&
                        f.value.type == AST_NODE_TYPES.CallExpression &&
                        f.value.callee.type == AST_NODE_TYPES.MemberExpression &&
                        f.value.callee.property.type == AST_NODE_TYPES.Identifier &&
                        f.value.callee.property.name === 'boolean'
                    );
                    if (possibleBoolFlag) {
                      context.report({
                        node: node,
                        messageId: 'message',
                      });
                    }
                  }
                }
              }
            }
          },
        }
      : {};
  },
});
