/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { ASTUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { isFlag, isFlagsStaticProperty } from '../shared/flags';

// properties that reference other flags by name
const propertyNames = ['dependsOn', 'exactlyOne', 'exclusive'];

export const flagCrossReferences = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Enforce flag cross references for dependOn,exclusive,exactlyOne',
      recommended: 'recommended',
    },
    messages: {
      missingFlag: 'There is no flag named {{flagName}}',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          Property(node): void {
            const ancestors = context.getAncestors();
            if (
              node.key.type === AST_NODE_TYPES.Identifier &&
              node.value.type === AST_NODE_TYPES.ArrayExpression &&
              node.value.elements.every((e) => e?.type === AST_NODE_TYPES.Literal && e?.raw) &&
              propertyNames.includes(node.key.name) &&
              ancestorsContainsSfCommand(context) &&
              ancestors.some((a) => isFlag(a))
            ) {
              const flagsNode = ancestors
                .filter(ASTUtils.isNodeOfType(AST_NODE_TYPES.PropertyDefinition))
                .find((a) => isFlagsStaticProperty(a));

              const arrayValues = node.value.elements
                .map((e) => (e?.type === AST_NODE_TYPES.Literal ? e.value : undefined))
                .filter(Boolean);

              if (
                flagsNode?.key.type === AST_NODE_TYPES.Identifier &&
                flagsNode.value?.type === AST_NODE_TYPES.ObjectExpression
              ) {
                // get the names of all the flags as an array
                const flagNames = flagsNode.value.properties.map((flagProp) => {
                  if (flagProp.type === AST_NODE_TYPES.Property) {
                    if (flagProp.key.type === AST_NODE_TYPES.Identifier) {
                      return flagProp.key.name;
                    } else if (flagProp.key.type === AST_NODE_TYPES.Literal) {
                      return flagProp.key.value;
                    }
                  }
                });

                // for each of the _Literal_ values in the dependOn/exactlyOne/exclusive array
                arrayValues.forEach((value) => {
                  if (!flagNames.includes(value)) {
                    context.report({
                      node,
                      messageId: 'missingFlag',
                      data: { flagName: value },
                    });
                  }
                });
              }
            }
          },
        }
      : {};
  },
});
