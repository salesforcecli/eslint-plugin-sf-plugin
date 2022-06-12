/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { extendsSfCommand, getClassPropertyIdentifierName, isInCommandDirectory } from '../shared/commands';
export const commandSummary = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Ensure commands have a summary',
      recommended: 'error',
    },
    messages: {
      summary: 'Commands should have a summary property',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node): void {
        // verify it extends SfCommand
        if (isInCommandDirectory(context) && extendsSfCommand(node)) {
          if (!node.body.body.some((member) => getClassPropertyIdentifierName(member) === 'summary')) {
            context.report({
              node,
              messageId: 'summary',
            });
          }
        }
      },
    };
  },
});
