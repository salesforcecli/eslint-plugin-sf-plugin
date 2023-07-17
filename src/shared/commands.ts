/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { sep, parse } from 'path';
import { AST_NODE_TYPES, TSESTree, ASTUtils } from '@typescript-eslint/utils';
import { RuleContext } from '@typescript-eslint/utils/dist/ts-eslint';

export const ancestorsContainsSfCommand = (ancestors: TSESTree.Node[]): boolean =>
  ancestors.some((a) => ASTUtils.isNodeOfType(AST_NODE_TYPES.ClassDeclaration)(a) && extendsSfCommand(a));

export const getSfCommand = (ancestors: TSESTree.Node[]): TSESTree.ClassDeclaration | undefined =>
  ancestors.filter(ASTUtils.isNodeOfType(AST_NODE_TYPES.ClassDeclaration)).find((a) => a && extendsSfCommand(a));

export const extendsSfCommand = (node: TSESTree.ClassDeclaration): boolean =>
  node.superClass?.type === AST_NODE_TYPES.Identifier && node.superClass.name === 'SfCommand';

export const getClassPropertyIdentifierName = (node: TSESTree.ClassElement): string | undefined =>
  node.type === AST_NODE_TYPES.PropertyDefinition && node.key.type === AST_NODE_TYPES.Identifier
    ? node.key.name
    : undefined;

// we don't care what the types are, really any context will do
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isInCommandDirectory = (context: RuleContext<any, any>): boolean =>
  context.getPhysicalFilename?.().includes(`src${sep}commands${sep}`) ?? false; // not an sfCommand

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
