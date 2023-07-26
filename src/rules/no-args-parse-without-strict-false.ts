/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils, ASTUtils } from '@typescript-eslint/utils';
import { isInCommandDirectory, getSfCommand } from '../shared/commands';

export const noArgsParseWithoutStrictFalse = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'If you parse args/argv, the class should have strict set to false',
      recommended: 'error',
    },
    messages: {
      summary: 'If you parse args/argv, the class should have strict set to false',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          // eslint-disable-next-line complexity
          VariableDeclarator(node): void {
            if (
              ASTUtils.isAwaitExpression(node.init) &&
              node.init.argument.type === AST_NODE_TYPES.CallExpression &&
              node.init.argument.callee.type === AST_NODE_TYPES.MemberExpression &&
              node.init.argument.callee.object.type === AST_NODE_TYPES.ThisExpression &&
              node.init.argument.callee.property.type === AST_NODE_TYPES.Identifier &&
              node.init.argument.callee.property.name === 'parse' &&
              node.id.type === AST_NODE_TYPES.ObjectPattern &&
              node.id.properties.some(
                (p) =>
                  p.type === AST_NODE_TYPES.Property &&
                  p.key.type === AST_NODE_TYPES.Identifier &&
                  p.key.name === 'argv'
              )
            ) {
              // Verify that the class has strict = false
              const ancestors = context.getAncestors();
              const sfCommand = getSfCommand(ancestors);
              if (!sfCommand) {
                return;
              }
              const strictProperty = sfCommand.body.body.find(
                (p) =>
                  p.type === AST_NODE_TYPES.PropertyDefinition &&
                  ASTUtils.isIdentifier(p.key) &&
                  p.key.name === 'strict'
              );
              if (
                strictProperty?.type === AST_NODE_TYPES.PropertyDefinition &&
                strictProperty.value?.type === AST_NODE_TYPES.Literal &&
                strictProperty.value.value === true
              ) {
                context.report({
                  node: strictProperty,
                  messageId: 'summary',
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  fix: (fixer) => fixer.replaceText(strictProperty.value!, 'false'),
                });
              } else if (!strictProperty) {
                context.report({
                  node: node.id,
                  messageId: 'summary',
                  fix: (fixer) =>
                    fixer.insertTextBefore(sfCommand.body.body[0], 'public static readonly strict = false;'),
                });
              }
            }
          },
        }
      : {};
  },
});
