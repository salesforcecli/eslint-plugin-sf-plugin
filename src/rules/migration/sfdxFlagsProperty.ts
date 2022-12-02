/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../../shared/commands';
export const sfdxFlagsProperty = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Change flag definitions to SfCommmand version',
      recommended: 'error',
    },
    messages: {
      flagsConfig: 'Use public readonly static flags = {',
      flagsConfigType: 'The FlagsConfig type is not used by SfCommand',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      PropertyDefinition(node): void {
        if (isInCommandDirectory(context) && ancestorsContainsSfCommand(context.getAncestors())) {
          if (node.key.type === 'Identifier' && node.key.name === 'flagsConfig') {
            context.report({
              node,
              messageId: 'flagsConfig',
              fix: (fixer) => {
                return fixer.replaceTextRange(node.key.range, 'flags');
              },
            });
          }
          if (
            node.key.type === 'Identifier' &&
            node.typeAnnotation?.type === 'TSTypeAnnotation' &&
            node.typeAnnotation.typeAnnotation?.type === 'TSTypeReference' &&
            node.typeAnnotation.typeAnnotation.typeName?.type === 'Identifier' &&
            node.typeAnnotation.typeAnnotation.typeName.name === 'FlagsConfig'
          ) {
            context.report({
              node,
              messageId: 'flagsConfigType',
              fix: (fixer) => {
                return fixer.remove(node.typeAnnotation);
              },
            });
          }
        }
      },
    };
  },
});
