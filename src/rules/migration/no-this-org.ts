/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ASTUtils, ESLintUtils } from '@typescript-eslint/utils';
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { RuleFix, RuleFixer } from '@typescript-eslint/utils/dist/ts-eslint';
import { ancestorsContainsSfCommand, getRunMethod, getSfCommand, isInCommandDirectory } from '../../shared/commands';
import { MemberExpressionIsThisDotFoo } from '../../shared/expressions';

export const noThisOrg = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Fix references to this.org (property on SfdxCommand)',
      recommended: 'error',
    },
    messages: {
      noThisOrg: 'SfCommand does not have a this.org property.  Make sure you parse the org flag.',
      useFlags: "change this.org to flags['target-org']",
      instanceProp: 'create a this.org property on SfCommand',
      setThisOrg: 'this org is defined on the class, but never set.  Set it equal to the org flag.',
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
            if (MemberExpressionIsThisDotFoo(node, 'org') && ancestorsContainsSfCommand(context.getAncestors())) {
              // it's ok if there's a this.org on the class...
              const classAbove = getSfCommand(context.getAncestors());
              const runMethod = getRunMethod(classAbove);
              if (
                classAbove &&
                classAbove.body.body.find(
                  (b) =>
                    b.type === AST_NODE_TYPES.PropertyDefinition &&
                    b.key.type === AST_NODE_TYPES.Identifier &&
                    b.key.name === 'org'
                )
              ) {
                // ...as long as it's been set in the run method
                const flagsParse =
                  runMethod.type === AST_NODE_TYPES.MethodDefinition
                    ? runMethod.value.body.body
                        .filter(ASTUtils.isNodeOfType(AST_NODE_TYPES.VariableDeclaration))
                        .find((b) => context.getSourceCode().getText(b).includes('this.parse'))
                    : undefined;
                const source = context.getSourceCode().getText();
                if (!source.includes('this.org = ')) {
                  context.report({
                    node,
                    messageId: 'setThisOrg',
                    fix: (fixer) => {
                      return fixer.insertTextAfter(flagsParse, "this.org = flags['target-org'];");
                    },
                  });
                }
              } else {
                context.report({
                  node,
                  messageId: 'noThisOrg',
                  suggest: [
                    {
                      messageId: 'useFlags',
                      fix: (fixer: RuleFixer): RuleFix => {
                        return fixer.replaceText(node, "flags['target-org']");
                      },
                    },
                    {
                      messageId: 'instanceProp',
                      fix: (fixer: RuleFixer): RuleFix => {
                        return fixer.insertTextBefore(runMethod, 'private org: Org;\n');
                      },
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
