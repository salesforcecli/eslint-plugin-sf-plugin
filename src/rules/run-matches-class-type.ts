/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import { isInCommandDirectory, extendsSfCommand, isClassDeclaration } from '../shared/commands';

export const runMatchesClassType = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'The return type of the run method should match the Type passed to sfCommand',
      recommended: 'error',
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
            if (
              node.key.type === AST_NODE_TYPES.Identifier &&
              node.key.name === 'run' &&
              node.value.returnType?.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference
            ) {
              // OK, run method has a type annotation.  Now we need to check if the class extends SfCommand and get the <type parameter>
              const ancestors = context.getAncestors();
              const classDeclaration = ancestors.find(
                (ancestor) => isClassDeclaration(ancestor) && extendsSfCommand(ancestor)
              );
              if (
                classDeclaration?.type === AST_NODE_TYPES.ClassDeclaration &&
                classDeclaration.superClass?.type === AST_NODE_TYPES.Identifier &&
                classDeclaration.superClass.name === 'SfCommand'
              ) {
                // get the text for the two nodes
                const sourceCode = context.getSourceCode();
                const runType = sourceCode.getText(node.value.returnType?.typeAnnotation.typeParameters.params[0]);
                const classType = sourceCode.getText(classDeclaration.superTypeParameters?.params[0]);

                if (runType && classType && runType !== classType) {
                  if (classDeclaration.superTypeParameters?.params[0].type === AST_NODE_TYPES.TSUnknownKeyword) {
                    // When Class Type is "unknown", but the run method has a return type, we can make the Class match the method.
                    context.report({
                      node,
                      messageId: 'summary',
                      data: {
                        runMethodReturnType: runType,
                        classTypeParameter: classType,
                      },
                      fix: (fixer) => {
                        return fixer.replaceTextRange(classDeclaration.superTypeParameters?.params[0].range, runType);
                      },
                    });
                  } else {
                    context.report({
                      node: classDeclaration.superTypeParameters?.params[0],
                      messageId: 'summary',
                      data: {
                        runMethodReturnType: runType,
                        classTypeParameter: classType,
                      },
                    });
                    context.report({
                      node: node.value.returnType?.typeAnnotation.typeParameters.params[0],
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
          },
        }
      : {};
  },
});
