/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';
import { isFlag, isFlagsStaticProperty } from '../shared/flags';

// properties that reference other flags by name
const propertyNames = ['dependsOn', 'exactlyOne', 'exclusive'];

export const flagCrossReferences = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Enforce flag cross references for dependOn,exclusive,exactlyOne',
      recommended: 'error',
    },
    messages: {
      missingFlag: 'There is no flag named {{flagName}}',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      Property(node): void {
        if (!isInCommandDirectory(context)) {
          return;
        }
        const ancestors = context.getAncestors();
        if (
          node.key.type === 'Identifier' &&
          node.value.type === 'ArrayExpression' &&
          node.value.elements.every((e) => e.type === 'Literal' && e.raw) &&
          propertyNames.includes(node.key.name) &&
          ancestorsContainsSfCommand(ancestors) &&
          ancestors.some((a) => isFlag(a))
        ) {
          const flagsNode = ancestors.find((a) => isFlagsStaticProperty(a));

          const arrayValues = node.value.elements
            .map((e) => (e.type === 'Literal' ? e.value : undefined))
            .filter(Boolean);

          if (
            flagsNode?.type === 'PropertyDefinition' &&
            flagsNode.key.type === 'Identifier' &&
            flagsNode.value.type === 'ObjectExpression'
          ) {
            // get the names of all the flags as an array
            const flagNames = flagsNode.value.properties.map((flagProp) => {
              if (flagProp.type === 'Property') {
                if (flagProp.key.type === 'Identifier') {
                  return flagProp.key.name;
                } else if (flagProp.key.type === 'Literal') {
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
    };
  },
});
