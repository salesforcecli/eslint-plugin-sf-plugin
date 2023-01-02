/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import {
  isInCommandDirectory,
  ancestorsContainsSfCommand,
  getSfCommand,
  getSfImportFromProgram,
} from '../../shared/commands';
import { getFlagsStaticPropertyFromCommandClass } from '../../shared/flags';

const propertyMap = new Map<
  string,
  { flag: string; message: 'requires' | 'supports' | 'requiresHub'; flagName: string }
>([
  [
    'requiresUsername',
    {
      flag: 'requiredOrgFlagWithDeprecations',
      flagName: 'target-org',
      message: 'requires',
    },
  ],
  ['supportsUsername', { flag: 'optionalOrgFlagWithDeprecations', flagName: 'target-org', message: 'supports' }],
  [
    'requiresDevhubUsername',
    {
      flag: 'requiredHubFlagWithDeprecations',
      flagName: 'target-dev-hub',

      message: 'requiresHub',
    },
  ],
]);

export const noUsernameProperties = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Convert requiresUsername and supportusername to username flags',
      recommended: 'error',
    },
    messages: {
      requires:
        'Class property requiresUsername is not available on SfCommand and should be removed.  Import `requiredOrgFlagWithDeprecations` from `@salesforce/sf-plugins-core` and add it to the flags object.',
      requiresHub:
        'Class property requiresDevhubUsername is not available on SfCommand and should be removed.  Import `requiredHubFlagWithDeprecations` from `@salesforce/sf-plugins-core` and add it to the flags object.',
      supports:
        'Class property supportUsername is not available on SfCommand and should be removed.  Import `optionalOrgFlagWithDeprecations` from `@salesforce/sf-plugins-core` and add it to the flags object.',
    },
    type: 'problem',
    schema: [],
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return isInCommandDirectory(context)
      ? {
          PropertyDefinition(node): void {
            if (ancestorsContainsSfCommand(context.getAncestors())) {
              if (node.key.type === AST_NODE_TYPES.Identifier && propertyMap.has(node.key.name)) {
                const mappedMetadata = propertyMap.get(node.key.name);

                // ensure the import exists
                const ancestors = context.getAncestors();
                const source = context.getSourceCode();
                const importDeclaration = getSfImportFromProgram(ancestors[0]);
                if (!source.getText(importDeclaration).includes(mappedMetadata.flag)) {
                  const fixedImport = source
                    .getText(importDeclaration)
                    .replace(/{(.*)}/g, `{$1, ${mappedMetadata.flag}}`);
                  context.report({
                    node: importDeclaration,
                    messageId: mappedMetadata.message,
                    fix: (fixer) => {
                      return fixer.replaceText(importDeclaration, fixedImport);
                    },
                  });
                }

                // add the flag if not already present

                const outerClass = getSfCommand(ancestors);
                const flagsProperty = getFlagsStaticPropertyFromCommandClass(outerClass);

                if (!source.getText(flagsProperty).includes(mappedMetadata.flag)) {
                  const addedFlag = `'${mappedMetadata.flagName}': ${mappedMetadata.flag},`;
                  context.report({
                    node: importDeclaration,
                    messageId: mappedMetadata.message,
                    fix: (fixer) => {
                      return fixer.insertTextAfterRange(
                        [flagsProperty.value.range[0] + 1, flagsProperty.value.range[0] + 1],
                        addedFlag
                      );
                    },
                  });
                }

                // remove the property
                context.report({
                  node,
                  messageId: mappedMetadata.message,
                  data: {
                    property: node.key.name,
                  },
                  fix: (fixer) => {
                    return fixer.remove(node);
                  },
                });
              }
            }
          },
        }
      : {};
  },
});
