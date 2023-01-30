/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../../shared/commands';
import { getCalleePropertyByName, isFlag } from '../../shared/flags';

export const noFilepathFlags = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Change filepath flag to file flag',
      recommended: 'error',
    },
    messages: {
      message: 'filepath flags are not available on sfCommand.  Use file instead',
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
            if (isFlag(node) && ancestorsContainsSfCommand(context.getAncestors())) {
              const toReplace = getCalleePropertyByName(node, 'filepath');
              if (toReplace) {
                context.report({
                  node: toReplace,
                  messageId: 'message',
                  fix: (fixer) => {
                    return fixer.replaceText(toReplace, 'file');
                  },
                });
              }
            }
          },
        }
      : {};
  },
});
