/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ASTUtils } from '@typescript-eslint/utils';
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { flagPropertyIsNamed, isFlag } from '../shared/flags';

export const noDependsOnBooleanFlags = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Do not allow flags to depend on boolean flags',
      recommended: 'recommended',
      url: 'https://github.com/salesforcecli/eslint-plugin-sf-plugin/blob/main/docs/rules/no-depends-on-boolean-flag.md'
    },
    messages: {
      message: 'Depending on a boolean flag can lead to unexpected behavior. Use `flag.relationships` to check flag values instead'
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
              const dependsOnFlagsProp = node.value.arguments[0].properties
                .filter(ASTUtils.isNodeOfType(AST_NODE_TYPES.Property))
                .find(flagPropertyIsNamed('dependsOn'));

              if (dependsOnFlagsProp) {
                const dependedOnFlags =
                  'value' in dependsOnFlagsProp &&
                  ASTUtils.isNodeOfType(AST_NODE_TYPES.ArrayExpression)(dependsOnFlagsProp.value)
                    ? dependsOnFlagsProp.value.elements
                        .filter(ASTUtils.isNodeOfType(AST_NODE_TYPES.Literal))
                        .map((l) => l.value)
                    : [];

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
