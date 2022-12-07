/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../../shared/commands';
import { MemberExpressionContainsMemberExpressionThisDotFoo } from '../../shared/expressions';

const spinnerMigration = new Map([
  ['startSpinner', 'this.spinner.start'],
  ['stopSpinner', 'this.spinner.stop'],
]);

export const noThisUx = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'SfCommand does not have a ux property',
      recommended: 'error',
    },
    messages: {
      message: 'SfCommand does not have a ux property.  Use methods from this like this.log() or this.table()',
      spinner: 'SfCommand does not have a ux.spinner.  Use this.spinner.start() or this.spinner.stop()',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          MemberExpression(node): void {
            if (
              MemberExpressionContainsMemberExpressionThisDotFoo(node, 'ux') &&
              ancestorsContainsSfCommand(context.getAncestors())
            ) {
              // spinner cases
              if (node.property.type === AST_NODE_TYPES.Identifier && spinnerMigration.has(node.property.name)) {
                const toRemove = node;
                const original = node.property.name;
                context.report({
                  node,
                  messageId: 'spinner',
                  fix: (fixer) => {
                    return fixer.replaceText(toRemove, spinnerMigration.get(original));
                  },
                });
              } else if (node.property.type === AST_NODE_TYPES.Identifier && node.property.name === 'logJson') {
                // this.ux.logJson => this.styledJson
                const toRemove = node;

                context.report({
                  node,
                  messageId: 'message',
                  fix: (fixer) => {
                    return fixer.replaceText(toRemove, 'this.styledJSON');
                  },
                });
              } else {
                // all other this.ux cases
                const toRemove = node;
                context.report({
                  node,
                  messageId: 'message',
                  fix: (fixer) => {
                    return fixer.replaceText(toRemove, `this.${context.getSourceCode().getText(node.property)}`);
                  },
                });
              }
            }
          },
        }
      : {};
  },
});
