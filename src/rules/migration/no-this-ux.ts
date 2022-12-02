/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../../shared/commands';

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
    return {
      MemberExpression(node): void {
        if (
          isInCommandDirectory(context) &&
          node.type === AST_NODE_TYPES.MemberExpression &&
          node.object?.type === AST_NODE_TYPES.MemberExpression &&
          node.object?.object?.type === AST_NODE_TYPES.ThisExpression &&
          node.object?.property?.type === AST_NODE_TYPES.Identifier &&
          node.object?.property?.name === 'ux' &&
          ancestorsContainsSfCommand(context.getAncestors())
        ) {
          // spinner cases
          if (node.property.type === 'Identifier' && spinnerMigration.has(node.property.name)) {
            // all other this.ux cases
            const toRemove = node;
            const original = node.property.name;
            context.report({
              node,
              messageId: 'spinner',
              fix: (fixer) => {
                return fixer.replaceText(toRemove, spinnerMigration.get(original));
              },
            });
          } else if (node.property.type === 'Identifier' && node.property.name === 'logJson') {
            // this.ux.logJson => this.styledJson
            const toRemove = node;
            context.report({
              node,
              messageId: 'spinner',
              fix: (fixer) => {
                return fixer.replaceText(toRemove, 'this.styledJSON');
              },
            });
          } else {
            // all other this.ux cases
            const toRemove = node.object;
            context.report({
              node,
              messageId: 'message',
              fix: (fixer) => {
                return fixer.replaceText(toRemove, 'this');
              },
            });
          }
        }
      },
    };
  },
});
