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
      description: 'Prevent duplicate use of short characters',
      recommended: 'error',
    },
    messages: {
      message: 'Flag {{flag1}} and {{flag2}} share duplicate character {{char}}',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      PropertyDefinition(node): void {
        // is "public static flags" property
        if (
          isInCommandDirectory(context) &&
          node.value?.type === AST_NODE_TYPES.ObjectExpression &&
          isFlagsStaticProperty(node) &&
          ancestorsContainsSfCommand(context.getAncestors())
        ) {
          const charFlagMap = new Map();
          node.value.properties.forEach((flag) => {
            // only if it has a char prop
            if (
              flag.type === 'Property' &&
              flag.value.type === 'CallExpression' &&
              flag.value.arguments?.[0]?.type === AST_NODE_TYPES.ObjectExpression &&
              flag.value.arguments?.[0]?.properties.some((p) => p.type === 'Property' && flagPropertyIsNamed(p, 'char'))
            ) {
              const charNode = flag.value.arguments[0].properties.find(
                (p) => p.type === 'Property' && flagPropertyIsNamed(p, 'char')
              );
              if (charNode.type === 'Property' && charNode.value.type === AST_NODE_TYPES.Literal) {
                const char = charNode.value.raw;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const flagName = resolveFlagName(flag);
                if (!charFlagMap.has(char)) {
                  charFlagMap.set(char, flagName);
                } else {
                  context.report({
                    node,
                    messageId: 'message',
                    data: {
                      flag1: flagName,
                      flag2: charFlagMap.get(char),
                      char,
                    },
                  });
                }
              }
            }
          });
        }
      },
    };
  },
});
