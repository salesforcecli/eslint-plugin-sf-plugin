/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { flagPropertyIsNamed, isFlag } from '../shared/flags';

export const jsonFlag = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'do not allow creation of json flag',
      recommended: 'error',
    },
    messages: {
      message: 'It is not necessary to add a --json flag.  That flag is provided by sfCommand/oclif',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      Property(node): void {
        if (isInCommandDirectory(context) && isFlag(node) && ancestorsContainsSfCommand(context.getAncestors())) {
          if (node.key.type === 'Identifier' && node.key.name === 'json') {
            context.report({
              node,
              messageId: 'message',
            });
          }
        }
      },
    };
  },
});
