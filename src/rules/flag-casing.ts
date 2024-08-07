/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { isFlag, resolveFlagName } from '../shared/flags';

const toLowerKebabCase = (str: string): string =>
  str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

export const flagCasing = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Enforce lowercase kebab-case flag names',
      recommended: 'strict',
    },
    messages: {
      message: 'Flag {{flagName}} should be lowercase and use kebab-case to separate words',
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
              const flagName = resolveFlagName(node);
              if (flagName && toLowerKebabCase(flagName) !== flagName) {
                context.report({
                  node,
                  messageId: 'message',
                  data: { flagName },
                  fix: (fixer) => fixer.replaceText(node.key, `'${toLowerKebabCase(flagName)}'`),
                });
              }
            }
          },
        }
      : {};
  },
});
