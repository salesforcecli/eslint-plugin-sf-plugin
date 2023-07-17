/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { isInCommandDirectory } from '../shared/commands';
export const noOclifFlagsCommandImport = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Change import of flags and Command from oclif to use sf-plugins-core',
      recommended: 'error',
    },
    messages: {
      flags: 'Use Flags from sf-plugins-core',
      command: 'Use SfCommand from sf-plugins-core',
      empty: 'no empty imports',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          ImportDeclaration(node): void {
            // verify it extends SfCommand
            if (node.source.value === '@oclif/core') {
              node.specifiers.forEach((specifier) => {
                if (specifier.local.name === 'Flags') {
                  context.report({
                    node: specifier,
                    messageId: 'flags',
                    fix: (fixer) => {
                      const comma = context.getSourceCode().getTokenAfter(specifier);
                      return comma?.value === ','
                        ? fixer.removeRange([specifier.range[0], specifier.range[1] + 1])
                        : fixer.remove(specifier);
                    },
                  });
                }
                if (specifier.local.name === 'Command') {
                  context.report({
                    node: specifier,
                    messageId: 'command',
                    fix: (fixer) => {
                      const comma = context.getSourceCode().getTokenAfter(specifier);
                      return comma?.value === ','
                        ? fixer.removeRange([specifier.range[0], specifier.range[1] + 1])
                        : fixer.remove(specifier);
                    },
                  });
                }
              });
              if (node.specifiers.length === 0) {
                context.report({
                  node,
                  messageId: 'empty',
                  fix: (fixer) => fixer.remove(node),
                });
              }
            }
          },
        }
      : {};
  },
});
