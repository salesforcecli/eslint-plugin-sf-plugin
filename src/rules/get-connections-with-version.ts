/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';

export const getConnectionWithVersion = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Calls to getConnection should pass in a version',
      recommended: 'stylistic',
    },
    messages: {
      addVersion: `getConnection should pass in a version, typically from the api-version flag,
        even if that value may be undefined.
        Otherwise, the org will default to its maximum version`,
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          CallExpression(node): void {
            if (
              node.type === AST_NODE_TYPES.CallExpression &&
              node.arguments.length === 0 &&
              node.callee?.type === AST_NODE_TYPES.MemberExpression &&
              node.callee.property.type === AST_NODE_TYPES.Identifier &&
              node.callee.property?.name === 'getConnection' &&
              ancestorsContainsSfCommand(context)
            ) {
              context.report({
                node: node.callee.property,
                messageId: 'addVersion',
              });
            }
          },
        }
      : {};
  },
});
