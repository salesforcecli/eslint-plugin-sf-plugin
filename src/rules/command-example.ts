/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { extendsSfCommand, getClassPropertyIdentifierName, isInCommandDirectory } from '../shared/commands';

const createRule = ESLintUtils.RuleCreator((name) => `https://example.com/rule/${name}`);

export const commandExamples = createRule({
  name: 'command-example',
  meta: {
    docs: {
      description: 'Ensure commands have a summary, description, and examples',
      recommended: 'error',
    },
    messages: {
      example: 'Commands should have an examples property',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          ClassDeclaration(node): void {
            // verify it extends SfCommand
            if (extendsSfCommand(node) && node.id) {
              if (!node.body.body.some((member) => getClassPropertyIdentifierName(member) === 'examples')) {
                context.report({
                  node: node.id,
                  messageId: 'example',
                });
              }
            }
          },
        }
      : {};
  },
});
