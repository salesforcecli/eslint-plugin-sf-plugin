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

export const dashH = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Do not allow creation of a flag with short char -h',
      recommended: 'recommended',
    },
    messages: {
      message: '-h is reserved for help.  Choose a different short character',
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
              ancestorsContainsSfCommand(context) &&
              node.value?.type === AST_NODE_TYPES.CallExpression &&
              node.value.arguments?.[0]?.type === AST_NODE_TYPES.ObjectExpression
            ) {
              const hChar = node.value.arguments[0].properties
                .filter(flagPropertyIsNamed('char'))
                .find((property) => property.value.type === AST_NODE_TYPES.Literal && property.value.value === 'h');
              if (hChar) {
                context.report({
                  node: hChar,
                  messageId: 'message',
                });
              }
            }
          },
        }
      : {};
  },
});
