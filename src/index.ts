/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { noDuplicateShortCharacters } from './rules/noDuplicateShortCharacters';
import { flagMinMaxDefault } from './rules/flagMinMaxDefault';
import { flagSummary } from './rules/flagSummary';
import { flagCasing } from './rules/flagCasing';
import { extractMessageFlags } from './rules/extractMessageFlags';
import { flagCrossReferences } from './rules/flagCrossReferences';
import { commandSummary } from './rules/commandSummary';
import { commandExamples } from './rules/commandExamples';
import { extractMessageCommand } from './rules/extractMessageCommand';
import { jsonFlag } from './rules/jsonFlag';
import { dashH } from './rules/dash-h';
import { noSfdxCommandImport } from './rules/migration/noSfdxCommandImport';
import { sfdxFlagsProperty } from './rules/migration/sfdxFlagsProperty';
import { useSfCommandFlags } from './rules/migration/useSfCommandFlags';
import { noThisUx } from './rules/migration/no-this-ux';
import { noThisOrg } from './rules/migration/noThisOrg';
import { runMatchesClassType } from './rules/runMatchesClassType';
import { noDeprecatedProperties } from './rules/migration/noDeprecatedProperties';
import { shouldParseFlags } from './rules/migration/shouldParseFlags';
import { noThisFlags } from './rules/migration/noThisFlags';
import { getConnectionWithVersion } from './rules/getConnectionsWithVersion';
import { noOclifFlagsCommandImport } from './rules/noOclifFlagsCommandImport';
import { noBuiltinFlags } from './rules/migration/noBuiltinFlags';

const recommended = {
  plugins: ['sf-plugin'],
  rules: {
    'sf-plugin/command-summary': 'error',
    'sf-plugin/command-example': 'warn',
    'sf-plugin/no-duplicate-short-characters': 'error',
    'sf-plugin/no-h-short-char': 'error',
    'sf-plugin/flag-case': 'error',
    'sf-plugin/flag-summary': 'error',
    'sf-plugin/no-hardcoded-messages-flags': 'warn',
    'sf-plugin/no-hardcoded-messages-commands': 'warn',
    'sf-plugin/flag-cross-references': 'error',
    'sf-plugin/json-flag': 'error',
    'sf-plugin/flag-min-max-default': 'warn',
    'sf-plugin/run-matches-class-type': 'error',
    'sf-plugin/get-connection-with-version': 'warn',
    'sf-plugin/no-oclif-flags-command-import': 'error',
  },
};
export = {
  configs: {
    recommended,
    migration: {
      plugins: ['sf-plugin'],
      rules: {
        ...recommended.rules,
        'sf-plugin/no-sfdx-command-import': 'error',
        'sf-plugin/sfdx-flags-property': 'error',
        'sf-plugin/use-sf-command-flags': 'error',
        'sf-plugin/no-this-ux': 'error',
        'sf-plugin/no-deprecated-properties': 'error',
        'sf-plugin/should-parse-flags': 'error',
        'sf-plugin/no-this-org': 'error',
        'sf-plugin/no-this-flags': 'error',
        'sf-plugin/no-builtin-flags': 'error',
      },
    },
  },
  rules: {
    'no-h-short-char': dashH,
    'no-duplicate-short-characters': noDuplicateShortCharacters,
    'run-matches-class-type': runMatchesClassType,
    'flag-case': flagCasing,
    'flag-summary': flagSummary,
    'no-hardcoded-messages-flags': extractMessageFlags,
    'no-hardcoded-messages-commands': extractMessageCommand,
    'flag-cross-references': flagCrossReferences,
    'command-summary': commandSummary,
    'command-example': commandExamples,
    'json-flag': jsonFlag,
    'flag-min-max-default': flagMinMaxDefault,
    'no-sfdx-command-import': noSfdxCommandImport,
    'sfdx-flags-property': sfdxFlagsProperty,
    'use-sf-command-flags': useSfCommandFlags,
    'no-this-ux': noThisUx,
    'no-deprecated-properties': noDeprecatedProperties,
    'should-parse-flags': shouldParseFlags,
    'no-this-org': noThisOrg,
    'no-this-flags': noThisFlags,
    'get-connection-with-version': getConnectionWithVersion,
    'no-oclif-flags-command-import': noOclifFlagsCommandImport,
    'no-builtin-flags': noBuiltinFlags,
  },
};
