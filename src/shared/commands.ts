/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { sep, parse } from 'path';
import { AST_NODE_TYPES, TSESTree, ASTUtils } from '@typescript-eslint/utils';
import { RuleContext } from '@typescript-eslint/utils/ts-eslint';

export const ancestorsContainsSfCommand = (node: TSESTree.Node, context: RuleContext<any,any>): boolean =>
  context.sourceCode.getAncestors(node).some((a) => a.type === AST_NODE_TYPES.ClassDeclaration && extendsSfCommand(a,context));

export const getSfCommand = (node: TSESTree.Node, context: RuleContext<any, any>): TSESTree.ClassDeclaration | undefined =>
  context.sourceCode.getAncestors(node).filter(ASTUtils.isNodeOfType(AST_NODE_TYPES.ClassDeclaration)).find((a) => a && extendsSfCommand(a,context));

export const extendsSfCommand = (node: TSESTree.ClassDeclaration, context: RuleContext<any, any>): boolean => {
  // Track imported classes and their aliases
  const importedClasses = new Map();

  for (const node of (context.sourceCode).ast.body) {
    if (node.type === 'ImportDeclaration') {
      node.specifiers.forEach(specifier => {
        if (specifier.type === 'ImportSpecifier') {
          const importedName = specifier.imported.type === AST_NODE_TYPES.Identifier
            ? specifier.imported.name
            : specifier.imported.value;
          if (importedName === 'SfCommand') {
            importedClasses.set(specifier.local.name, 'SfCommand');
          } else if (specifier.local.name !== importedName) {
            importedClasses.set(specifier.local.name, importedName);
          }
        }
      })
    }
  }

  return node.superClass?.type === AST_NODE_TYPES.Identifier && (importedClasses.get(node.superClass.name) == 'SfCommand');
}

export const getClassPropertyIdentifierName = (node: TSESTree.ClassElement): string | undefined =>
  node.type === AST_NODE_TYPES.PropertyDefinition && node.key.type === AST_NODE_TYPES.Identifier
    ? node.key.name
    : undefined;

// we don't care what the types are, really any context will do
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isInCommandDirectory = (context: RuleContext<any, any>): boolean =>
  context.physicalFilename?.includes(`src${sep}commands${sep}`) ?? false;

export const isRunMethod = (node: TSESTree.Node): boolean =>
  node.type === AST_NODE_TYPES.MethodDefinition &&
  node.kind === 'method' &&
  node.computed === false &&
  node.accessibility === 'public' &&
  node.static === false &&
  node.override === false &&
  node.key.type === AST_NODE_TYPES.Identifier &&
  node.key.name === 'run';

export const getRunMethod = (node: TSESTree.ClassDeclaration): TSESTree.ClassElement | undefined =>
  node.body.body.find((b) => isRunMethod(b));

export const getSfImportFromProgram = (node: TSESTree.Node): TSESTree.ImportDeclaration | undefined => {
  if (node.type === AST_NODE_TYPES.Program) {
    return node.body
      .filter(ASTUtils.isNodeOfType(AST_NODE_TYPES.ImportDeclaration))
      .find(
        (item) => item.source.type === AST_NODE_TYPES.Literal && item.source.value === '@salesforce/sf-plugins-core'
      );
  }
};

/** pass a filename, and get back an array of the parts that occur after `commands`
 * in other words, the command's canonical name
 */
export const getCommandNameParts = (filename: string): string[] => {
  const parts = filename.replace(parse(filename).ext, '').split(sep);
  return parts.slice(parts.indexOf('commands') + 1);
};
