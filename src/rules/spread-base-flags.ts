/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { isInCommandDirectory } from '../shared/commands';
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import {
  getBaseFlagsStaticPropertyFromCommandClass,
  getFlagsStaticPropertyFromCommandClass,
} from '../shared/flags';

export const spreadBaseFlags = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description:
        "When not directly extending SfCommand, the parent's flags must be spread like flags = { ...{{parent}}.{{property}} }",
    },
    messages: {
      message:
        "When not directly extending SfCommand, the parent's flags must be spread like flags = { ...{{parent}}.{{property}} }",
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
            if (flagsProperty) {
              // @ts-expect-error SpreadElement (...) on property==='flags' (BaseCommand.flags)
              const flags = flagsProperty?.value?.properties?.find(
                (f) => f.type === 'SpreadElement' && f.argument.property?.name === 'flags'
              );
              // @ts-expect-error name will not be undefined because we're in a command class, which has to at least extend Command
              const parent = node.superClass?.name;

              if (parent !== 'SfCommand' && !flags) {
                context.report({
                  loc: flagsProperty.loc,
                  messageId: 'message',
                  data: { parent, property: 'flags' },
                });
              }
            }

            const baseFlagsProperty = getBaseFlagsStaticPropertyFromCommandClass(node);
            if (baseFlagsProperty) {
              // @ts-expect-error SpreadElement (...) on property==='baseFlags' (BaseCommand.baseFlags)
              const baseFlags = baseFlagsProperty.value?.properties?.find(
                (f) => f.type === 'SpreadElement' && f.argument.property?.name === 'baseFlags'
              );
              // @ts-expect-error name will not be undefined because we're in a command class, which has to at least extend Command
              const parent = node.superClass?.name;

              if (parent !== 'SfCommand' && !baseFlags) {
                context.report({
                  loc: baseFlagsProperty.loc,
                  messageId: 'message',
                  data: { parent, property: 'baseFlags' },
                });
              }
            }
          },
        }
      : {};
  },
});
