/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/typescript-estree';

/** Current node is 'foo' : Flags.x({}) */
export const isFlag = (node: TSESTree.Node): boolean =>
  node.type === AST_NODE_TYPES.Property &&
  node.value?.type === AST_NODE_TYPES.CallExpression &&
  node.value?.callee?.type === AST_NODE_TYPES.MemberExpression &&
  node.value?.callee?.object?.type === AST_NODE_TYPES.Identifier &&
  node.value?.callee?.object?.name === 'Flags';

/** Current node is public static flags = */
export const isFlagsStaticProperty = (node: TSESTree.Node): node is TSESTree.PropertyDefinition =>
  node.type === AST_NODE_TYPES.PropertyDefinition &&
  typeof node.accessibility === 'string' &&
  node.static &&
  node.value?.type === AST_NODE_TYPES.ObjectExpression &&
  node.key.type === AST_NODE_TYPES.Identifier &&
  node.key.name === 'flags' &&
  ['public', 'protected'].includes(node.accessibility);

export const isBaseFlagsStaticProperty = (node: TSESTree.Node): node is TSESTree.PropertyDefinition =>
  node.type === AST_NODE_TYPES.PropertyDefinition &&
  typeof node.accessibility === 'string' &&
  node.static &&
  node.value?.type === AST_NODE_TYPES.ObjectExpression &&
  node.key.type === AST_NODE_TYPES.Identifier &&
  node.key.name === 'baseFlags' &&
  ['public', 'protected'].includes(node.accessibility);

export const flagPropertyIsNamed =
  (name: string) =>
  (node: TSESTree.Property): node is TSESTree.Property =>
    resolveFlagName(node) === name;

/** pass in a flag Property and it gives back the key name/value depending on type */
export const resolveFlagName = (
  flag: TSESTree.PropertyComputedName | TSESTree.PropertyNonComputedName
): string | undefined => {
  if (flag.key.type === AST_NODE_TYPES.Identifier) {
    return flag.key.name;
  }
  if (flag.key.type === AST_NODE_TYPES.Literal && typeof flag.key.value === 'string') {
    return flag.key.value;
  }
};

export const getFlagsStaticPropertyFromCommandClass = (
  classDeclaration: TSESTree.ClassDeclaration
): TSESTree.PropertyDefinition | undefined => {
  if (classDeclaration.body.type === AST_NODE_TYPES.ClassBody) {
    return classDeclaration.body.body.find(isFlagsStaticProperty);
  }
};

export const getBaseFlagsStaticPropertyFromCommandClass = (
  classDeclaration: TSESTree.ClassDeclaration
): TSESTree.PropertyDefinition | undefined => {
  if (classDeclaration.body.type === AST_NODE_TYPES.ClassBody) {
    return classDeclaration.body.body.find(isBaseFlagsStaticProperty);
  }
};

export const getCalleePropertyByName = (
  node: TSESTree.Property,
  calleePropName: string
): TSESTree.Identifier | undefined =>
  (node.key.type === AST_NODE_TYPES.Identifier || node.key.type === AST_NODE_TYPES.Literal) &&
  node.value?.type === AST_NODE_TYPES.CallExpression &&
  node.value.callee?.type === AST_NODE_TYPES.MemberExpression &&
  node.value.callee.property?.type === AST_NODE_TYPES.Identifier &&
  node.value.callee.property.name === calleePropName
    ? node.value.callee.property
    : undefined;
