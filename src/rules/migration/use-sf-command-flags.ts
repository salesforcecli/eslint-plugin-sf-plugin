/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../../shared/commands';

export const useSfCommandFlags = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Use Flags export from sf-plugins-core',
      recommended: 'error',
    },
    messages: {
      message: 'for SfCommand, each flag definition should use "Flags", not "flags"',
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
              node.type === AST_NODE_TYPES.Property &&
              node.value?.type === AST_NODE_TYPES.CallExpression &&
              node.value?.callee?.type === AST_NODE_TYPES.MemberExpression &&
              node.value?.callee?.object?.type === AST_NODE_TYPES.Identifier &&
              node.value?.callee?.object?.name === 'flags' &&
              ancestorsContainsSfCommand(context.getAncestors())
            ) {
              const range = node.value.callee.object.range;
              context.report({
                node,
                messageId: 'message',
                fix: (fixer) => {
                  // TS isn't using the type narrowing done above.
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore, eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
                  return fixer.replaceTextRange(range, 'Flags');
                },
              });
            }
          },
        }
      : {};
  },
});
