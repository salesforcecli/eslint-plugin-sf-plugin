/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../../shared/commands';
import { isFlag } from '../../shared/flags';

export const noNumberFlags = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Change number flag to integer',
      recommended: 'error',
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
            if (isFlag(node) && ancestorsContainsSfCommand(context.getAncestors())) {
              if (
                (node.key.type === AST_NODE_TYPES.Identifier || node.key.type === AST_NODE_TYPES.Literal) &&
                node.value?.type === AST_NODE_TYPES.CallExpression &&
                node.value.callee?.type === AST_NODE_TYPES.MemberExpression &&
                node.value.callee.property?.type === AST_NODE_TYPES.Identifier &&
                node.value.callee.property.name === 'number'
              ) {
                const toReplace = node.value.callee.property;
                context.report({
                  node: node.value.callee.property,
                  messageId: 'message',
                  fix: (fixer) => {
                    return fixer.replaceText(toReplace, 'integer');
                  },
                });
              }
            }
          },
        }
      : {};
  },
});
