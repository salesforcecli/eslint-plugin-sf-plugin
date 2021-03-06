/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

export const getFlagName = (node: TSESTree.Node): string => {
  if (node.type === AST_NODE_TYPES.Property) {
    switch (node.key.type) {
      case 'Identifier':
        return node.key.name;
      case 'Literal':
        return node.key.value as string;
      default:
        throw new Error(`Unknown flag type ${node.key.type}`);
    }
  }
};

/** Current node is 'foo' : Flags.x({}) */
export const isFlag = (node: TSESTree.Node): boolean =>
  node.type === AST_NODE_TYPES.Property &&
  node.value?.type === 'CallExpression' &&
  node.value?.callee?.type === 'MemberExpression' &&
  node.value?.callee?.object?.type === 'Identifier' &&
  node.value?.callee?.object?.name === 'Flags';

/** Current node is public static flags = */
export const isFlagsStaticProperty = (node: TSESTree.Node): boolean =>
  node.type === AST_NODE_TYPES.PropertyDefinition &&
  node.static &&
  node.value?.type === AST_NODE_TYPES.ObjectExpression &&
  node.key.type === AST_NODE_TYPES.Identifier &&
  node.key.name === 'flags' &&
  node.accessibility === 'public';

export const flagPropertyIsNamed = (node: TSESTree.Property, name: string): node is TSESTree.Property =>
  resolveFlagName(node) === name;

/** pass in a flag Property and it gives back the key name/value depending on type */
export const resolveFlagName = (flag: TSESTree.PropertyComputedName | TSESTree.PropertyNonComputedName): string => {
  if (flag.key.type === AST_NODE_TYPES.Identifier) {
    return flag.key.name;
  }
  if (flag.key.type === AST_NODE_TYPES.Literal && typeof flag.key.value === 'string') {
    return flag.key.value;
  }
};
