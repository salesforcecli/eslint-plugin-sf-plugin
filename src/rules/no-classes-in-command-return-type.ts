/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils, ParserServices } from '@typescript-eslint/utils';
import * as ts from 'typescript';
import { isRunMethod } from '../shared/commands';

export const noClassesInCommandReturnType = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'The return type of the run method should not contain a class.',
      recommended: 'error',
    },
    messages: {
      summary:
        'The return type of the run method should not contain a class.  Return something that can be expressed as an object so that it supports JSON.',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      // eslint-disable-next-line complexity
      MethodDefinition(node): void {
        if (
          isRunMethod(node) &&
          node.value.returnType?.typeAnnotation.type === AST_NODE_TYPES.TSTypeReference &&
          node.value.returnType?.typeAnnotation.typeParameters.params[0].type === AST_NODE_TYPES.TSTypeReference
        ) {
          const parserServices = ESLintUtils.getParserServices(context);
          const runType = node.value.returnType?.typeAnnotation.typeParameters.params[0];

          const realNode = parserServices.esTreeNodeToTSNodeMap.get(runType);

          const usesClass = hasOrIsClass(realNode, parserServices);
          if (usesClass) {
            return context.report({
              node: node.value.returnType?.typeAnnotation.typeParameters.params[0],
              messageId: 'summary',
            });
          }
        }
      },
    };
  },
});

const hasOrIsClass = (tn: ts.TypeNode | ts.TypeElement, parserServices: ParserServices): boolean => {
  // get the TS for this node
  const checker = parserServices.program.getTypeChecker();
  // follow the type to where it came from
  const underlyingNode = checker.getSymbolAtLocation(tn.getChildAt(0));
  const declaration = underlyingNode?.getDeclarations()?.[0];
  if (!declaration) return false;
  if (ts.isClassLike(declaration)) {
    return true;
  }
  if (ts.isInterfaceDeclaration(declaration) || ts.isTypeLiteralNode(declaration)) {
    return declaration.members.some((m) => hasOrIsClass(m, parserServices));
  }
  if (ts.isTypeAliasDeclaration(declaration) && ts.isTypeLiteralNode(declaration.type)) {
    return declaration.type.members.some((m) => hasOrIsClass(m, parserServices));
  }
  if (
    (ts.isPropertyDeclaration(declaration) || ts.isPropertySignature(declaration)) &&
    ts.isTypeNode(declaration.type)
  ) {
    return hasOrIsClass(declaration.type, parserServices);
  }
  if (ts.isImportSpecifier(declaration)) {
    // Follow the import
    const type = checker.getTypeAtLocation(declaration);
    const symbolDeclarations = type.getSymbol().getDeclarations();
    return symbolDeclarations.some(
      (d) => ts.isClassLike(d) || ((ts.isTypeNode(d) || ts.isTypeElement(d)) && hasOrIsClass(d, parserServices))
    );
  }
  // anything other than a type/interface/class

  return false;
};
