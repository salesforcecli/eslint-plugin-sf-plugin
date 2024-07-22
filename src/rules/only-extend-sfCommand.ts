/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {
  isInCommandDirectory,
  extendsSfCommand,
} from "../shared/commands";
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';

export const onlyExtendSfCommand = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Only allow commands that directly extend SfCommand',
      recommended: 'recommended',
    },
    messages: {
      message: 'In order to inherit default flags correctly, extend from SfCommand directly',
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
          if (!extendsSfCommand(node) && node.id) {
              context.report({
                node: node.id,
                messageId: 'message',
              });
          }
        },
      }
      : {};
  },
});
