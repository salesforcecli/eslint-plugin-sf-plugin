/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { extendsSfCommand, getClassPropertyIdentifierName, isInCommandDirectory } from '../shared/commands';

const propertiesYouShouldntHardCode = ['description', 'summary'];

export const extractMessageCommand = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Use loaded messages and separate files for messages',
      recommended: 'warn',
    },
    messages: {
      message:
        'Summary/Description property should use messages.getMessage instead of hardcoding the message.  See https://github.com/forcedotcom/sfdx-core/blob/v3/MIGRATING_V2-V3.md#messages',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ClassDeclaration(node): void {
        // verify it extends SfCommand
        if (isInCommandDirectory(context) && extendsSfCommand(node)) {
          node.body.body
            .filter((prop) => propertiesYouShouldntHardCode.includes(getClassPropertyIdentifierName(prop)))
            .forEach((prop) => {
              if (prop.type === 'PropertyDefinition' && prop.value.type === 'Literal') {
                context.report({
                  node,
                  messageId: 'message',
                });
              }
            });
        }
      },
    };
  },
});
