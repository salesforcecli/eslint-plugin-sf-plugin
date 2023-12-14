/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';

import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { flagPropertyIsNamed, isFlag } from '../shared/flags';

export const flagMinMaxDefault = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Enforce that flags with min/max values have a default value',
      recommended: 'stylistic',
    },
    messages: {
      message: 'If your flag has a min or max value, it should have a default value.  Otherwise, it will be undefined',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          Property(node): void {
            if (isFlag(node) && ancestorsContainsSfCommand(context.getAncestors())) {
              if (
                node.value?.type === AST_NODE_TYPES.CallExpression &&
                node.value.arguments?.[0]?.type === AST_NODE_TYPES.ObjectExpression &&
                // has min/max
                node.value.arguments[0].properties.some(
                  (property) =>
                    property.type === AST_NODE_TYPES.Property &&
                    (flagPropertyIsNamed(property, 'min') || flagPropertyIsNamed(property, 'max'))
                ) &&
                !node.value.arguments[0].properties.some(
                  (property) =>
                    property.type === AST_NODE_TYPES.Property &&
                    // defaultValue for DurationFlags
                    (flagPropertyIsNamed(property, 'default') || flagPropertyIsNamed(property, 'defaultValue'))
                )
              ) {
                context.report({
                  node,
                  messageId: 'message',
                });
              }
            }
          },
        }
      : {};
  },
});
