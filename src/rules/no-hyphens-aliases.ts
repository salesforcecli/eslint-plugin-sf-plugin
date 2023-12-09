/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { isInCommandDirectory, ancestorsContainsSfCommand } from '../shared/commands';
import { isFlag } from '../shared/flags';

export const noHyphenAliases = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Mark when an alias starts with a hyphen, like -f or --foo',
      recommended: 'recommended',
    },
    messages: {
      summary: 'aliases should not start with hyphens',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          Literal(node): void {
            if (
              typeof node.value === 'string' &&
              node.value.startsWith('-') &&
              node.parent?.type === AST_NODE_TYPES.ArrayExpression &&
              node.parent.parent?.type === AST_NODE_TYPES.Property &&
              node.parent.parent.key.type === AST_NODE_TYPES.Identifier &&
              node.parent.parent.key.name === 'aliases' &&
              node.parent.parent.parent?.parent?.parent &&
              isFlag(node.parent.parent.parent?.parent?.parent) &&
              ancestorsContainsSfCommand(context.getAncestors())
            ) {
              context.report({
                node,
                messageId: 'summary',
                fix: (fixer) => fixer.replaceText(node, `'${node.value.replace(/^-+/, '')}'`),
              });
            }
          },
        }
      : {};
  },
});
