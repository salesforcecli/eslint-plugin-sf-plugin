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
    // function extendsSfCommand(node: TSESTree.ClassDeclaration, context: RuleContext<any, any>): boolean {
    //   // Track imported classes and their aliases
    //   const importedClasses = new Map();
    //
    //   for (const node of (context.sourceCode).ast.body) {
    //     if (node.type === 'ImportDeclaration') {
    //       node.specifiers.forEach(specifier => {
    //         if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'SfCommand') {
    //           importedClasses.set(specifier.local.name, 'SfCommand');
    //         }
    //         // Handle import aliases
    //         else if (specifier.type === 'ImportSpecifier' && specifier.local.name !== specifier.imported.name) {
    //           importedClasses.set(specifier.local.name, specifier.imported.name);
    //         }
    //       })
    //     }
    //   }
    //
    //   return node.superClass?.type === AST_NODE_TYPES.Identifier && (importedClasses.get(node.superClass.name) == 'SfCommand');
    // }

    return isInCommandDirectory(context)
      ? {
        ClassDeclaration(node): void {
          // verify it extends SfCommand
          // importedClasses.has()
          if (!extendsSfCommand(node, context) && node.id) {
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
