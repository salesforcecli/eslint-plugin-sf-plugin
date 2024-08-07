/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import {
  ancestorsContainsSfCommand,
  getRunMethod,
  getSfCommand,
  isInCommandDirectory,
  isRunMethod,
} from '../../shared/commands';
import { MemberExpressionIsThisDotFoo } from '../../shared/expressions';

export const noThisFlags = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Fix references to this.org (property on SfdxCommand)',
      recommended: 'recommended',
    },
    messages: {
      noThisFlags: 'SfCommand does not have a this.flags property.  Make sure you parse the flag.',
      useFlags: 'change this.flags to flags',
      instanceProp: 'create a this.flags property on SfCommand',
      setThisFlags: 'flags is defined on the class, but never set.  Set it equal to the parsed flags property.',
    },
    hasSuggestions: true,
    type: 'suggestion',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          MemberExpression(node): void {
            if (MemberExpressionIsThisDotFoo(node, 'flags') && ancestorsContainsSfCommand(context)) {
              // it's ok if there's a this.flags on the class...
              const classAbove = getSfCommand(context);
              if (!classAbove) {
                return;
              }
              const runMethod = getRunMethod(classAbove);
              if (!runMethod) {
                return;
              }
              if (
                classAbove.body.body.find(
                  (b) =>
                    b.type === AST_NODE_TYPES.PropertyDefinition &&
                    b.key.type === AST_NODE_TYPES.Identifier &&
                    b.key.name === 'flags' &&
                    b.static === false
                )
              ) {
                // ...as long as it's been set in the run method
                const flagsParse =
                  runMethod?.type === AST_NODE_TYPES.MethodDefinition
                    ? runMethod.value.body?.body.find(
                        (b) =>
                          b.type === AST_NODE_TYPES.VariableDeclaration &&
                          context.sourceCode.getText(b).includes('this.parse')
                      )
                    : undefined;
                const source = context.sourceCode.getText();
                if (!source.includes('this.flags = ') && flagsParse) {
                  context.report({
                    node,
                    messageId: 'instanceProp',
                    fix: (fixer) => fixer.insertTextAfter(flagsParse, 'this.flags = flags;'),
                  });
                }
              }
              // we have no this.flags.
              // in run method, convert to parsed flags value.
              else if (context.getAncestors().some((b) => isRunMethod(b))) {
                context.report({
                  node,
                  messageId: 'noThisFlags',
                  fix: (fixer) => fixer.replaceText(node, 'flags'),
                });
              } else if (runMethod) {
                // otherwise, your options are: Make one, or use flags
                context.report({
                  node,
                  messageId: 'noThisFlags',
                  suggest: [
                    {
                      messageId: 'useFlags',
                      fix: (fixer) => fixer.replaceText(node, 'flags'),
                    },
                    {
                      messageId: 'instanceProp',
                      fix: (fixer) =>
                        fixer.insertTextBefore(
                          runMethod,
                          `private flags: Interfaces.InferredFlags<typeof ${classAbove.id?.name}.flags>;`
                        ),
                    },
                  ],
                });
              }
            }
          },
        }
      : {};
  },
});
