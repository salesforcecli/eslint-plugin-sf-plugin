/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';
import { isFlag } from '../shared/flags';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';

export const extractMessageFlags = ESLintUtils.RuleCreator.withoutDocs({
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
    return isInCommandDirectory(context)
      ? {
          Property(node): void {
            const ancestors = context.getAncestors();
            if (
              node.key.type === AST_NODE_TYPES.Identifier &&
              (node.key.name === 'summary' || node.key.name === 'description') &&
              ancestors.some((a) => isFlag(a)) &&
              node.value.type === AST_NODE_TYPES.Literal &&
              ancestorsContainsSfCommand(ancestors)
            ) {
              context.report({
                node,
                messageId: 'message',
              });
            }
          },
        }
      : {};
  },
});
