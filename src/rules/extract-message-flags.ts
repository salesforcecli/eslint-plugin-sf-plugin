/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleCreator } from '@typescript-eslint/utils/eslint-utils';
import { AST_NODE_TYPES, ASTUtils } from '@typescript-eslint/utils';
import { isFlag, resolveFlagName } from '../shared/flags';
import { ancestorsContainsSfCommand, isInCommandDirectory } from '../shared/commands';

export const extractMessageFlags = RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Use loaded messages and separate files for messages.  Follow the message naming guidelines',
      recommended: 'stylistic',
    },
    fixable: 'code',
    messages: {
      summaryFormat:
        'The summary message should be named flags.{{name}}.summary.  See https://github.com/salesforcecli/cli/wiki/Write-Useful-Messages#key-names',
      descriptionFormat:
        'The description message should be named flags.{{name}}.description.  See https://github.com/salesforcecli/cli/wiki/Write-Useful-Messages#key-names',
      message:
        'Summary/Description property should use messages.getMessage instead of hardcoding the message.  See https://github.com/forcedotcom/sfdx-core/blob/v3/MIGRATING_V2-V3.md#messages',
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
              (node.key.name === 'summary' || node.key.name === 'description') &&
              ancestors.some((a) => isFlag(a)) &&
              ancestorsContainsSfCommand(ancestors)
            ) {
              if (node.value.type === AST_NODE_TYPES.Literal) {
                context.report({
                  node,
                  messageId: 'message',
                });
              }
              const flag = ancestors.filter(ASTUtils.isNodeOfType(AST_NODE_TYPES.Property)).find((a) => isFlag(a));
              const flagName = flag ? resolveFlagName(flag) : undefined;
              if (
                flagName &&
                node.value.type === AST_NODE_TYPES.CallExpression &&
                node.value.callee.type === AST_NODE_TYPES.MemberExpression &&
                node.value.callee.object.type === AST_NODE_TYPES.Identifier &&
                node.value.callee.object.name === 'messages' &&
                node.value.arguments[0].type === AST_NODE_TYPES.Literal &&
                typeof node.value.arguments[0].value === 'string' &&
                node.value.arguments[0].value !== `flags.${flagName}.${node.key.name}`
              ) {
                const textToReplace = node.value.arguments[0];
                const target = node.value.callee;
                const prop = node.key.name;
                context.report({
                  node: target,
                  data: { name: flagName },
                  messageId: node.key.name === 'summary' ? 'summaryFormat' : 'descriptionFormat',
                  fix: (fixer) => fixer.replaceText(textToReplace, `'flags.${flagName}.${prop}'`),
                });
              }
            }
          },
        }
      : {};
  },
});
