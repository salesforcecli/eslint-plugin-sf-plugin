/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { isInCommandDirectory, isRunMethod, getSfCommand } from '../shared/commands';
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';

export const runMatchesClassType = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'The return type of the run method should match the Type passed to sfCommand',
      recommended: 'recommended',
    },
    messages: {
      summary:
        'The return type of the run method ({{runMethodReturnType}}) does not match the Type passed to sfCommand ({{classTypeParameter}})',
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
            if (isRunMethod(node) && node.value.returnType?.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference) {
              // OK, run method has a type annotation.  Now we need to check if the class extends SfCommand and get the <type parameter>
              const ancestors = context.getAncestors();
              const classDeclaration = getSfCommand(context);

              if (classDeclaration) {
                // get the text for the two nodes
                const sourceCode = context.sourceCode;
                const runType = sourceCode.getText(node.value.returnType?.typeAnnotation.typeParameters?.params[0]);
                const classType = sourceCode.getText(classDeclaration.superTypeParameters?.params[0]);

                if (runType && classType && runType !== classType) {
                  if (classDeclaration.superTypeParameters?.params[0].type === AST_NODE_TYPES.TSUnknownKeyword) {
                    // When Class Type is "unknown", but the run method has a return type, we can make the Class match the method.
                    const target = classDeclaration.superTypeParameters?.params[0].range;
                    context.report({
                      node,
                      messageId: 'summary',
                      data: {
                        runMethodReturnType: runType,
                        classTypeParameter: classType,
                      },
                      fix: (fixer) => fixer.replaceTextRange(target, runType),
                    });
                  } else {
                    const targetNode = classDeclaration.superTypeParameters?.params[0];
                    if (targetNode) {
                      context.report({
                        node: targetNode,
                        messageId: 'summary',
                        data: {
                          runMethodReturnType: runType,
                          classTypeParameter: classType,
                        },
                      });
                    }
                    const targetNode2 = node.value.returnType?.typeAnnotation.typeParameters?.params[0];
                    if (targetNode2) {
                      context.report({
                        node: targetNode2,
                        messageId: 'summary',
                        data: {
                          runMethodReturnType: runType,
                          classTypeParameter: classType,
                        },
                      });
                    }
                  }
                }
              }
            }
          },
        }
      : {};
  },
});
