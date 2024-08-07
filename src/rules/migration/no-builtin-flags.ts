/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../../shared/commands';
import { getCalleePropertyByName, isFlag } from '../../shared/flags';

const builtInFlagTypes = ['verbose', 'concise', 'quiet'];

export const noBuiltinFlags = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: "Handling for sfdxCommand's flags.builtin",
      recommended: 'recommended',
    },
    messages: {
      message: 'Built-in flags are not available on sfCommand.  Use a boolean and add your own summary message',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          Property(node): void {
            if (
              isFlag(node) &&
              node.key.type === AST_NODE_TYPES.Identifier &&
              builtInFlagTypes.includes(node.key.name) &&
              ancestorsContainsSfCommand(context)
            ) {
              const toReplace = getCalleePropertyByName(node, 'builtin');
              if (toReplace) {
                context.report({
                  node: toReplace,
                  messageId: 'message',
                  fix: (fixer) => fixer.replaceText(toReplace, 'boolean'),
                });
              }
            }
          },
        }
      : {};
  },
});
