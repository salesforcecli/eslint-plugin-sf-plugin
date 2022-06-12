/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { sep } from 'path';
import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';
import { RuleContext } from '@typescript-eslint/utils/dist/ts-eslint';

export const isClassDeclaration = (node: TSESTree.Node): node is TSESTree.ClassDeclaration =>
  node.type === AST_NODE_TYPES.ClassDeclaration;

export const ancestorsContainsSfCommand = (ancestors: TSESTree.Node[]): boolean =>
  ancestors.some((a) => isClassDeclaration(a) && extendsSfCommand(a));

export const extendsSfCommand = (node: TSESTree.ClassDeclaration): boolean =>
  node.superClass?.type === AST_NODE_TYPES.Identifier && node.superClass.name === 'SfCommand';

export const getClassPropertyIdentifierName = (node: TSESTree.ClassElement): string =>
  node.type === 'PropertyDefinition' && node.key.type === AST_NODE_TYPES.Identifier ? node.key.name : undefined;

// we don't care what the types are, really any context will do
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isInCommandDirectory = (context: RuleContext<any, any>): boolean => {
  return context.getPhysicalFilename().includes(`${sep}commands${sep}`); // not an sfCommand
};
