/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { isInCommandDirectory, ancestorsContainsSfCommand } from '../../shared/commands';
export const noDeprecatedProperties = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Removes non-existent properties left over from SfdxCommand',
      recommended: 'error',
    },
    messages: {
      property: 'Class property {{property}} is not available on SfCommand and should be removed',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          PropertyDefinition(node): void {
            if (ancestorsContainsSfCommand(context.getAncestors())) {
              if (
                node.key.type === AST_NODE_TYPES.Identifier &&
                [
                  'requiresUsername',
                  'supportUsername',
                  'supportsDevhubUsername',
                  'requiresDevhubUsername',
                  'varargs',
                ].includes(node.key.name)
              ) {
                context.report({
                  node,
                  messageId: 'property',
                  data: {
                    property: node.key.name,
                  },
                  fix: (fixer) => {
                    return fixer.remove(node);
                  },
                });
              }
            }
          },
        }
      : {};
  },
});
