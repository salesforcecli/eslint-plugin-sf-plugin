/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../../shared/commands';
import { isFlag } from '../../shared/flags';

const timeFlags = ['seconds', 'minutes', 'milliseconds'];

export const noTimeFlags = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Migrate time flags to Flags.duration',
      recommended: 'recommended',
    },
    messages: {
      message: 'flags for {{time}} should use the Flags.duration (and specify the unit)',
    },
    type: 'problem',
    fixable: 'code',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          Property(node): void {
            if (isFlag(node) && ancestorsContainsSfCommand(context.getAncestors())) {
              if (
                (node.key.type === AST_NODE_TYPES.Identifier || node.key.type === AST_NODE_TYPES.Literal) &&
                node.value.type === AST_NODE_TYPES.CallExpression &&
                node.value.callee.type === AST_NODE_TYPES.MemberExpression &&
                node.value.callee.property.type === AST_NODE_TYPES.Identifier &&
                timeFlags.includes(node.value.callee.property.name)
              ) {
                const original = context.sourceCode.getText(node);
                const unit = node.value.callee.property.name;
                const fixed = original
                  .replace(`Flags.${unit}({`, `Flags.duration({ unit: '${unit}',`)
                  .replace('default:', 'defaultValue:')
                  .replace(new RegExp(`Duration.${unit}\\((.*)\\)`, 'g'), '$1');
                context.report({
                  node,
                  messageId: 'message',
                  data: { time: node.value.callee.property.name },
                  fix: (fixer) => fixer.replaceText(node, fixed),
                });
              }
            }
          },
        }
      : {};
  },
});
