/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { getFlagName, isFlag } from '../shared/flags';

export const flagCasing = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Enforce flag cross references for dependOn,exclusive,exactlyOne',
      recommended: 'error',
    },
    messages: {
      message: 'Flag {{flagName}} should be lowercase (use kebab-case to separate words)',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      Property(node): void {
        if (isFlag(node)) {
          const flagName = getFlagName(node);
          if (flagName.toLowerCase() !== flagName) {
            context.report({
              node,
              messageId: 'message',
              data: { flagName },
            });
          }
        }
      },
    };
  },
});
