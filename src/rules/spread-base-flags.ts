/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { isInCommandDirectory, ancestorsContainsSfCommand, getSfCommand } from '../shared/commands';
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { getFlagsStaticPropertyFromCommandClass, isFlagsStaticProperty } from '../shared/flags';
import { ASTUtils, AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

export const spreadBaseFlags = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description:
        "When not directly extending SfCommand, the parent's flags must be spread like flags = {...{{parent}}.flags}",
      recommended: 'recommended',
    },
    messages: {
      message:
        "When not directly extending SfCommand, the parent's flags must be spread like flags = {...{{parent}}.flags}",
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          ClassDeclaration(node): void {
            const flagsProperty = getFlagsStaticPropertyFromCommandClass(node);
            if (!flagsProperty) return;
            // @ts-ignore
            const flag = flagsProperty.value?.properties?.find((f) => f.type === 'SpreadElement');
            // @ts-ignore name will not be undefined because we're in a command class, which has to at least extend Command
            const parent = node.superClass?.name;

            if (parent !== 'SfCommand' && !flag) {
              context.report({
                loc: flagsProperty.loc,
                messageId: 'message',
                data: { parent },
              });
            }
          },
        }
      : {};
  },
});
