/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { isFlagsStaticProperty, resolveFlagName, flagPropertyIsNamed } from '../shared/flags';

export const noDuplicateShortCharacters = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Prevent duplicate use of short characters or conflicts between aliases and flags',
      recommended: 'error',
    },
    messages: {
      flagCollision: 'Flag {{flag1}} has a name already in use as the name or alias of {{flag2}}',
      charCollision: 'Flags {{flag1}} and {{flag2}} share duplicate character {{char}}',
      aliasCollision: 'Flags {{flag1}} and {{flag2}} share alias {{alias}}',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          PropertyDefinition(node): void {
            // is "public static flags" property
            if (
              ancestorsContainsSfCommand(context.getAncestors()) &&
              node.value?.type === AST_NODE_TYPES.ObjectExpression &&
              isFlagsStaticProperty(node)
            ) {
              const previouslyUsed = new Map();
              node.value.properties.forEach((flag) => {
                // only if it has a char prop
                if (
                  flag.type === AST_NODE_TYPES.Property &&
                  flag.value.type === AST_NODE_TYPES.CallExpression &&
                  flag.value.arguments?.[0]?.type === AST_NODE_TYPES.ObjectExpression
                ) {
                  const flagName = resolveFlagName(flag);

                  // 1. Has the flag name already been used?  If so, mark the flag name as a problem
                  if (previouslyUsed.has(flagName)) {
                    context.report({
                      node: flag.key,
                      messageId: 'flagCollision',
                      data: {
                        flag1: flagName,
                        flag2: previouslyUsed.get(flagName),
                      },
                    });
                  } else {
                    previouslyUsed.set(flagName, flagName);
                  }
                  // 2. has the char already been used?  If so, mark the char as a problem
                  const charNode = flag.value.arguments[0].properties.find(
                    (p) =>
                      p.type === AST_NODE_TYPES.Property &&
                      flagPropertyIsNamed(p, 'char') &&
                      p.value.type === AST_NODE_TYPES.Literal
                  );
                  if (charNode?.type === AST_NODE_TYPES.Property && charNode?.value.type === AST_NODE_TYPES.Literal) {
                    const char = charNode.value.value;
                    if (previouslyUsed.has(char)) {
                      context.report({
                        node: charNode,
                        messageId: 'charCollision',
                        data: {
                          flag1: flagName,
                          flag2: previouslyUsed.get(char),
                          char,
                        },
                      });
                    } else {
                      previouslyUsed.set(char, flagName);
                    }
                  }

                  // 3. is anything in this this flag's aliases already seen (alias or char)?  If so, mark that alias as a problem
                  const aliasesNode = flag.value.arguments[0].properties.find(
                    (p) =>
                      p.type === AST_NODE_TYPES.Property &&
                      flagPropertyIsNamed(p, 'aliases') &&
                      p.value.type === AST_NODE_TYPES.ArrayExpression
                  );
                  if (
                    aliasesNode?.type === AST_NODE_TYPES.Property &&
                    aliasesNode.value.type === AST_NODE_TYPES.ArrayExpression
                  ) {
                    aliasesNode.value.elements.forEach((alias) => {
                      if (alias.type === AST_NODE_TYPES.Literal)
                        if (previouslyUsed.has(alias.value)) {
                          context.report({
                            node: alias,
                            messageId: 'aliasCollision',
                            data: {
                              flag1: flagName,
                              flag2: previouslyUsed.get(alias.value),
                              alias: alias.value,
                            },
                          });
                        } else {
                          previouslyUsed.set(alias.value, flagName);
                        }
                    });
                  }
                }
              });
            }
          },
        }
      : {};
  },
});
