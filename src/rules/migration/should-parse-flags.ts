/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { isInCommandDirectory, getSfCommand, isRunMethod } from '../../shared/commands';
import { isFlagsStaticProperty } from '../../shared/flags';

export const shouldParseFlags = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'The run method should call this.parse when there are flags',
      recommended: 'error',
    },
    messages: {
      summary: 'The run method should call this.parse when there are flags',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          // eslint-disable-next-line complexity
          MethodDefinition(node): void {
            if (isRunMethod(node) && node.value?.body?.body) {
              // OK, looks like a run method has a type annotation
              const ancestors = context.getAncestors();
              const classDeclaration = getSfCommand(ancestors);
              if (
                // and it has flags to be parsed
                classDeclaration?.body?.body?.some((prop) => isFlagsStaticProperty(prop))
              ) {
                // get the text for the two nodes
                const sourceCode = context.getSourceCode();
                const runBody = sourceCode.getText(node.value.body);
                const className = classDeclaration.id?.name;

                if (!runBody.includes(`await this.parse(${className})`)) {
                  const target = node.value.body.body[0];
                  context.report({
                    node,
                    messageId: 'summary',
                    fix: (fixer) => fixer.insertTextBefore(target, `const {flags} = await this.parse(${className});`),
                  });
                }
              }
            }
          },
        }
      : {};
  },
});
