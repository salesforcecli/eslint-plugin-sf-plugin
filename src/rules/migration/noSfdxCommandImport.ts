/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { isInCommandDirectory } from '../../shared/commands';
export const noSfdxCommandImport = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Change import and base class from SfdxCommand to sfCommand',
      recommended: 'error',
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
    return {
      ClassDeclaration(node): void {
        if (isInCommandDirectory(context)) {
          if (node.superClass?.type === 'Identifier' && node.superClass.name === 'SfdxCommand') {
            context.report({
              node: node.superClass,
              messageId: 'superClass',
              fix: (fixer) => {
                return fixer.replaceTextRange(node.superClass.range, 'SfCommand<unknown>');
              },
            });
          }
        }
      },
      ImportDeclaration(node): void {
        // verify it extends SfCommand
        if (isInCommandDirectory(context)) {
          if (node.source.value === '@salesforce/command') {
            context.report({
              node,
              messageId: 'import',
              fix: (fixer) => {
                return fixer.replaceText(node, "import {Flags, SfCommand} from '@salesforce/sf-plugins-core'");
              },
            });
          }
        }
      },
    };
  },
});
