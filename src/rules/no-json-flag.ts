/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { isFlag } from '../shared/flags';

export const jsonFlag = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Do not allow creation of json flag',
      recommended: 'recommended',
    },
    messages: {
      message: 'It is not necessary to add a --json flag.  That flag is provided by sfCommand/oclif',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          Property(node): void {
            if (isFlag(node) && ancestorsContainsSfCommand(context)) {
              if (node.key.type === AST_NODE_TYPES.Identifier && node.key.name === 'json') {
                context.report({
                  node,
                  messageId: 'message',
                });
              }
            }
          },
        }
      : {};
  },
});
