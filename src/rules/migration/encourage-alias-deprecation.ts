/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { ASTUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { isInCommandDirectory, ancestorsContainsSfCommand } from '../../shared/commands';
import { flagPropertyIsNamed, isFlag } from '../../shared/flags';

export const encourageAliasDeprecation = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description:
        'Commands and flags aliases probably want to deprecate their old names to provide more warnings to users',
      recommended: 'stylistic',
    },
    messages: {
      command:
        'Suggestion: add deprecateAliases = true to your command to provide warning when users use one of its aliases',
      flag: 'Suggestion: add deprecateAliases:true to your flag to provide warning when users use one of its aliases',
    },
    type: 'suggestion',
    hasSuggestions: true,
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          PropertyDefinition(node): void {
            if (ancestorsContainsSfCommand(context)) {
              if (node.key.type === AST_NODE_TYPES.Identifier && node.key.name === 'aliases') {
                // but you don't have deprecateAliases = true then add id
                if (
                  node.parent?.type === AST_NODE_TYPES.ClassBody &&
                  !node.parent.body.some(
                    (n) =>
                      n.type === AST_NODE_TYPES.PropertyDefinition &&
                      n.key.type === AST_NODE_TYPES.Identifier &&
                      n.key.name === 'deprecateAliases'
                  )
                ) {
                  context.report({
                    node,
                    messageId: 'command',
                    suggest: [
                      {
                        messageId: 'command',
                        fix: (fixer) => fixer.insertTextBefore(node, 'public static readonly deprecateAliases = true;'),
                      },
                    ],
                  });
                }
              }
            }
          },
          Property(node): void {
            if (
              isFlag(node) &&
              node.value?.type === AST_NODE_TYPES.CallExpression &&
              node.value.arguments?.[0]?.type === AST_NODE_TYPES.ObjectExpression &&
              ancestorsContainsSfCommand(context)
            ) {
              const argProps = node.value.arguments[0].properties.filter(
                ASTUtils.isNodeOfType(AST_NODE_TYPES.Property)
              );

              const aliasesProperty = argProps.find((property) => flagPropertyIsNamed(property, 'aliases'));
              if (aliasesProperty && !argProps.some((property) => flagPropertyIsNamed(property, 'deprecateAliases'))) {
                context.report({
                  node: aliasesProperty,
                  messageId: 'flag',
                  suggest: [
                    {
                      messageId: 'flag',
                      fix: (fixer) => fixer.insertTextBefore(aliasesProperty, 'deprecateAliases:true,'),
                    },
                  ],
                });
              }
            }
          },
        }
      : {};
  },
});
