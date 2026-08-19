/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ASTUtils } from '@typescript-eslint/utils';
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { flagPropertyIsNamed, isFlag } from '../shared/flags';

export const noDefaultDependsOnFlags = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Do not allow creation of a flag with default value and dependsOn',
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
              ancestorsContainsSfCommand(node, context) &&
              node.value?.type === AST_NODE_TYPES.CallExpression &&
              node.value.arguments?.[0]?.type === AST_NODE_TYPES.ObjectExpression
            ) {
              const props = node.value.arguments[0].properties.filter(ASTUtils.isNodeOfType(AST_NODE_TYPES.Property));
              const dependsOnProperty = props.find(flagPropertyIsNamed('dependsOn'));
              const defaultValueProperty = props.find(flagPropertyIsNamed('default'));

              if (!dependsOnProperty || !defaultValueProperty) {
                return;
              }

              const dependsOnFlagDefaultValue = (node.parent as { properties?: Array<any> }).properties
                ?.find(
                  (f: any) =>
                    f.type === AST_NODE_TYPES.Property && f.key.name === (dependsOnProperty.value as any).elements?.at(0)?.value
                )
                ?.value?.arguments?.at(0)
                ?.properties?.find((p: any) => p.key?.name === 'default');
              if (!dependsOnFlagDefaultValue) {
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
