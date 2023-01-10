/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { RuleFix, RuleFixer } from '@typescript-eslint/utils/dist/ts-eslint';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { flagPropertyIsNamed, isFlag } from '../shared/flags';

export const idFlagSuggestions = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Create better salesforceId flags with length and startsWith properties',
      recommended: 'warn',
    },
    hasSuggestions: true,
    messages: {
      message: 'Suggestion: salesforceId flags have additional properties to validate the Id.  Consider using them.',
      lengthSuggestion15: 'require the ID to be 15 characters',
      lengthSuggestion18: 'require the ID to be 18 characters',
      lengthSuggestionBoth: 'require the ID to be 15 or 18 characters',
      typeSuggestion: 'require the ID to start with a 3-character prefix',
    },
    type: 'suggestion',
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
                (node.key.type === AST_NODE_TYPES.Identifier || node.key.type === AST_NODE_TYPES.Literal) &&
                node.value?.type === AST_NODE_TYPES.CallExpression &&
                node.value.callee?.type === AST_NODE_TYPES.MemberExpression &&
                node.value.callee.property?.type === AST_NODE_TYPES.Identifier &&
                node.value.callee.property.name === 'salesforceId' &&
                node.value.arguments?.[0]?.type === AST_NODE_TYPES.ObjectExpression
              ) {
                const hasStartsWith = node.value.arguments[0].properties.some(
                  (property) => property.type === AST_NODE_TYPES.Property && flagPropertyIsNamed(property, 'startsWith')
                );
                const hasLength = node.value.arguments[0].properties.some(
                  (property) => property.type === AST_NODE_TYPES.Property && flagPropertyIsNamed(property, 'length')
                );
                if (!hasStartsWith || !hasLength) {
                  const existing = context.getSourceCode().getText(node);
                  const fixedStartsWith = existing.replace('salesforceId({', "salesforceId({startsWith: '000',");
                  const fixer15 = existing.replace('salesforceId({', 'salesforceId({length: 15,');
                  const fixer18 = existing.replace('salesforceId({', 'salesforceId({length: 18,');
                  const fixerBoth = existing.replace('salesforceId({', "salesforceId({length: 'both',");

                  context.report({
                    node: node.key,
                    messageId: 'message',
                    suggest: (!hasStartsWith
                      ? [
                          {
                            // I think this is a TS problem in the utils
                            messageId: 'typeSuggestion' as keyof typeof idFlagSuggestions.meta.messages,
                            fix: (fixer: RuleFixer): RuleFix => {
                              return fixer.replaceText(node, fixedStartsWith);
                            },
                          },
                        ]
                      : []
                    ).concat(
                      !hasLength
                        ? [
                            {
                              messageId: 'lengthSuggestionBoth',
                              fix: (fixer: RuleFixer): RuleFix => {
                                return fixer.replaceText(node, fixerBoth);
                              },
                            },
                            {
                              messageId: 'lengthSuggestion15',
                              fix: (fixer: RuleFixer): RuleFix => {
                                return fixer.replaceText(node, fixer15);
                              },
                            },
                            {
                              messageId: 'lengthSuggestion18',
                              fix: (fixer: RuleFixer): RuleFix => {
                                return fixer.replaceText(node, fixer18);
                              },
                            },
                          ]
                        : []
                    ),
                  });
                }
              }
            }
          },
        }
      : {};
  },
});
