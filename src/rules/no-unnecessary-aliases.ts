/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { isInCommandDirectory, ancestorsContainsSfCommand, getCommandNameParts } from '../shared/commands';

export const noUnnecessaryAliases = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description:
        'Mark when an alias is unnecessary because its only an order permutation, not really a different name',
      recommended: 'recommended',
    },
    messages: {
      summary: 'the Salesforce CLI will match the command words in any order, so this alias is unnecessary',
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
              node.parent?.type === AST_NODE_TYPES.ArrayExpression &&
              node.parent.parent?.type === AST_NODE_TYPES.PropertyDefinition &&
              node.parent.parent.key.type === AST_NODE_TYPES.Identifier &&
              node.parent.parent.key.name === 'aliases' &&
              context.getPhysicalFilename &&
              ancestorsContainsSfCommand(context.getAncestors())
            ) {
              const parentLength = node.parent.elements.length;
              const cmdParts = getCommandNameParts(context.getPhysicalFilename());
              const aliasParts = typeof node.value === 'string' ? node.value.split(':') : [];
              if (
                aliasParts.every((part) => cmdParts.includes(part)) &&
                cmdParts.every((part) => aliasParts.includes(part))
              ) {
                context.report({
                  node,
                  messageId: 'summary',
                  fix: (fixer) => {
                    const comma = context.sourceCode.getTokenAfter(node);
                    if (parentLength === 1 && node.parent?.parent) {
                      return fixer.remove(node.parent.parent);
                    }
                    return comma?.value === ','
                      ? fixer.removeRange([node.range[0], node.range[1] + 1])
                      : fixer.remove(node);
                  },
                });
              }
            }
          },
        }
      : {};
  },
});
