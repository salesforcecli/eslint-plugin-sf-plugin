/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { flagPropertyIsNamed, isFlag } from '../shared/flags';

export const flagSummary = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Enforce that flags have a summary property',
      recommended: 'error',
    },
    messages: {
      message: 'Flags should have a summary property',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      Property(node): void {
        if (isInCommandDirectory(context) && isFlag(node) && ancestorsContainsSfCommand(context.getAncestors())) {
          if (
            node.value?.type === 'CallExpression' &&
            node.value.arguments?.[0]?.type === 'ObjectExpression' &&
            !node.value.arguments[0].properties.some(
              (property) => property.type === 'Property' && flagPropertyIsNamed(property, 'summary')
            )
          ) {
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
