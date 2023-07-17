/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../../shared/commands';

export const sfdxFlagsProperty = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Change flag definitions to SfCommand version',
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
    return isInCommandDirectory(context)
      ? {
          PropertyDefinition(node): void {
            if (ancestorsContainsSfCommand(context.getAncestors())) {
              if (node.key.type === AST_NODE_TYPES.Identifier && node.key.name === 'flagsConfig') {
                context.report({
                  node,
                  messageId: 'flagsConfig',
                  fix: (fixer) => fixer.replaceTextRange(node.key.range, 'flags'),
                });
              }
              if (
                node.key.type === AST_NODE_TYPES.Identifier &&
                node.typeAnnotation?.type === AST_NODE_TYPES.TSTypeAnnotation &&
                node.typeAnnotation.typeAnnotation?.type === AST_NODE_TYPES.TSTypeReference &&
                node.typeAnnotation.typeAnnotation.typeName?.type === AST_NODE_TYPES.Identifier &&
                node.typeAnnotation.typeAnnotation.typeName.name === 'FlagsConfig'
              ) {
                const toRemove = node.typeAnnotation;
                context.report({
                  node,
                  messageId: 'flagsConfigType',
                  fix: (fixer) => fixer.remove(toRemove),
                });
              }
            }
          },
        }
      : {};
  },
});
