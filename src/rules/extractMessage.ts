/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';
import { isFlag } from '../shared/flags';

export const extractMessage = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Use loaded messages and separate files for messages',
      recommended: 'warn',
    },
    messages: {
      message:
        'Summary/Description property should use messages.getMessage instead of hardcoding the message.  See https://github.com/forcedotcom/sfdx-core/blob/v3/MIGRATING_V2-V3.md#messages',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      Property(node): void {
        if (
          node.type === AST_NODE_TYPES.Property &&
          node.key.type === AST_NODE_TYPES.Identifier &&
          (node.key.name === 'summary' || node.key.name === 'description') &&
          context.getAncestors().some((a) => isFlag(a))
        ) {
          if (node.value.type === 'Literal') {
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
