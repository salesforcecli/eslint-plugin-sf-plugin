/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { isInCommandDirectory } from '../../shared/commands';
export const noSfdxCommandImport = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Change import and base class from SfdxCommand to sfCommand',
      recommended: 'recommended',
    },
    messages: {
      import: 'Use SfCommand from sf-plugins-core',
      superClass: 'Use SfCommand as the base class',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          ClassDeclaration(node): void {
            if (node.superClass?.type === AST_NODE_TYPES.Identifier && node.superClass.name === 'SfdxCommand') {
              const fixTarget = node.superClass.range;
              context.report({
                node: node.superClass,
                messageId: 'superClass',
                fix: (fixer) => fixer.replaceTextRange(fixTarget, 'SfCommand<unknown>'),
              });
            }
          },
          ImportDeclaration(node): void {
            // verify it extends SfCommand
            if (node.source.value === '@salesforce/command') {
              context.report({
                node,
                messageId: 'import',
                fix: (fixer) =>
                  fixer.replaceText(node, "import {Flags, SfCommand} from '@salesforce/sf-plugins-core';"),
              });
            }
          },
        }
      : {};
  },
});
