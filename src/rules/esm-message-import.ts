/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* eslint-disable complexity */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';

export const esmMessageImport = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description:
        'Looks for the verbose `Messages.importMessagesDirectory(dirname(fileURLToPath(import.meta.url)))` to offer a simpler alternative',
      recommended: 'strict',
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
          context.sourceCode.getText(node.parent.parent).includes('dirname(fileURLToPath(import.meta.url))')
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
        const allCode = context.sourceCode.getText();
        // true for all cases
        if (
          ((node.source.value === 'node:url' &&
            node.specifiers.some((s) => s.local.name === 'fileURLToPath') &&
            // it's the only reference to fileURLToPath
            Array.from(allCode.matchAll(/fileURLToPath/g)).length === 1) ||
            (node.source.value === 'node:path' &&
              node.specifiers.some((s) => s.local.name === 'dirname') &&
              // it's the only reference to dirname
              Array.from(allCode.matchAll(/dirname/g)).length === 1)) &&
          // we've already removed the old way of doing it
          allCode.includes('Messages.importMessagesDirectoryFromMetaUrl(import.meta.url)')
        ) {
          if (
            // case 1: single specifier removes the entire import line
            node.specifiers.length === 1 &&
            node.specifiers[0].type === AST_NODE_TYPES.ImportSpecifier &&
            node.specifiers[0].local.type === AST_NODE_TYPES.Identifier
          ) {
            return context.report({
              node,
              messageId: 'unnecessaryImport',
              fix: (fixer) => fixer.remove(node),
            });
          } else {
            // case 2, just remove the 1 unused specifier
            if (node.specifiers.length > 1) {
              const replacementSpecifiers = node.specifiers
                .filter((s) => s.local.name !== 'dirname' && s.local.name !== 'fileURLToPath')
                .map((s) => context.sourceCode.getText(s))
                .join(', ');
              const replacementRange = [
                node.specifiers[0].range[0],
                node.specifiers[node.specifiers.length - 1].range[1],
              ] as const;
              return context.report({
                node,
                messageId: 'unnecessaryImport',
                fix: (fixer) => fixer.replaceTextRange(replacementRange, replacementSpecifiers),
              });
            }
          }
        }
      },
    };
  },
});
