/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { isInCommandDirectory, extendsSfCommand, isClassDeclaration } from '../../shared/commands';
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
            if (
              node.key.type === AST_NODE_TYPES.Identifier &&
              node.key.name === 'run' &&
              node.accessibility === 'public' &&
              node.value?.body?.body
            ) {
              // OK, looks like a run method has a type annotation
              const ancestors = context.getAncestors();
              const classDeclaration = ancestors.find(
                (ancestor) => isClassDeclaration(ancestor) && extendsSfCommand(ancestor)
              );
              if (
                classDeclaration?.type === AST_NODE_TYPES.ClassDeclaration &&
                classDeclaration.superClass?.type === AST_NODE_TYPES.Identifier &&
                classDeclaration.superClass.name === 'SfCommand' &&
                // and it has flags to be parsed
                classDeclaration.body?.body?.some((prop) => isFlagsStaticProperty(prop))
              ) {
                // get the text for the two nodes
                const sourceCode = context.getSourceCode();
                const runBody = sourceCode.getText(node.value.body);
                const className = classDeclaration.id.name;

                if (!runBody.includes(`await this.parse(${className})`)) {
                  context.report({
                    node,
                    messageId: 'summary',
                    fix: (fixer) => {
                      return fixer.insertTextBefore(
                        node.value.body.body[0],
                        `const {flags} = await this.parse(${className});`
                      );
                    },
                  });
                }
              }
            }
          },
        }
      : {};
  },
});
