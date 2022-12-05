/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

export const MembersExpressionIsThisDotFoo = (node: TSESTree.Node, name: string): boolean =>
  node.type === AST_NODE_TYPES.MemberExpression &&
  node.object?.type === AST_NODE_TYPES.ThisExpression &&
  node.property?.type === AST_NODE_TYPES.Identifier &&
  node.property?.name === name;
