/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';

import { ancestorsContainsSfCommand, isInCommandDirectory } from '../../shared/commands';
import { getCalleePropertyByName, isFlag } from '../../shared/flags';

export const noNumberFlags = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Change number flag to integer',
      recommended: 'recommended',
    },
    messages: {
      message: 'number flags are not available on sfCommand.  Use integer instead',
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
            if (isFlag(node) && ancestorsContainsSfCommand(context)) {
              const toReplace = getCalleePropertyByName(node, 'number');
              if (toReplace) {
                context.report({
                  node: toReplace,
                  messageId: 'message',
                  fix: (fixer) => fixer.replaceText(toReplace, 'integer'),
                });
              }
            }
          },
        }
      : {};
  },
});
