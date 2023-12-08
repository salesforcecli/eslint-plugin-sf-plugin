/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* eslint-disable complexity */

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

export const esmMessageImport = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description:
        'Looks for the verbose `Messages.importMessagesDirectory(dirname(fileURLToPath(import.meta.url)))` to offer a simpler alternative',
      recommended: 'error',
    },
    messages: {
      changeImport: 'use Messages.importMessagesDirectoryFromMetaUrl(import.meta.url) instead',
      unnecessaryImport: 'the only code using this import was removed by this rule',
    },
    fixable: 'code',
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      MemberExpression(node): void {
        if (
          node.object.type === AST_NODE_TYPES.Identifier &&
          node.object.name === 'Messages' &&
          node.property.type === AST_NODE_TYPES.Identifier &&
          node.property.name === 'importMessagesDirectory' &&
          node.parent?.parent &&
          context.getSourceCode().getText(node.parent.parent).includes('dirname(fileURLToPath(import.meta.url))')
        ) {
          const toReplace = node.parent.parent;
          // we never found the message at all, we can report and exit
          return context.report({
            node,
            messageId: 'changeImport',
            fix: (fixer) =>
              fixer.replaceText(toReplace, 'Messages.importMessagesDirectoryFromMetaUrl(import.meta.url)'),
          });
        }
      },
      ImportDeclaration(node): void {
        if (
          node.specifiers.length === 1 &&
          node.specifiers[0].type === AST_NODE_TYPES.ImportSpecifier &&
          node.specifiers[0].local.type === AST_NODE_TYPES.Identifier &&
          ((node.source.value === 'node:url' &&
            node.specifiers[0].local.name === 'fileURLToPath' &&
            Array.from(
              context
                .getSourceCode()
                .getText()
                .matchAll(/fileURLToPath/g)
            ).length === 1) ||
            (node.source.value === 'node:path' &&
              node.specifiers[0].local.name === 'dirname' &&
              Array.from(
                context
                  .getSourceCode()
                  .getText()
                  .matchAll(/dirname/g)
              ).length === 1)) &&
          // we've already removed the old way of doing it
          context.getSourceCode().getText().includes('Messages.importMessagesDirectoryFromMetaUrl(import.meta.url)')
        ) {
          return context.report({
            node,
            messageId: 'unnecessaryImport',
            fix: (fixer) => fixer.remove(node),
          });
        }
      },
      // now we're going to clean up unused imports if they're left over
      //   ImportDeclaration(node): void {
      //         // verify it extends SfCommand
      //         if (node.source.value === '@salesforce/command') {
      //           context.report({
      //             node,
      //             messageId: 'import',
      //             fix: (fixer) =>
      //               fixer.replaceText(node, "import {Flags, SfCommand} from '@salesforce/sf-plugins-core';"),
      //           });
      //         }
      //       },(node): void {
      //     if (
      //       node.object.type === AST_NODE_TYPES.Identifier &&
      //       node.object.name === 'Messages' &&
      //       node.property.type === AST_NODE_TYPES.Identifier &&
      //       node.property.name === 'importMessagesDirectory' &&
      //       node.parent?.parent &&
      //       context.getSourceCode().getText(node.parent.parent).includes('dirname(fileURLToPath(import.meta.url))')
      //     ) {
      //       const toReplace = node.parent.parent;
      //       // we never found the message at all, we can report and exit
      //       return context.report({
      //         node,
      //         messageId: 'changeImport',
      //         fix: (fixer) =>
      //           fixer.replaceText(toReplace, 'Messages.importMessagesDirectoryFromMetaUrl(import.meta.url)'),
      //       });
      //     }
      //   },
    };
  },
});
