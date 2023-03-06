/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { noDuplicateShortCharacters } from './rules/no-duplicate-short-characters';
import { flagMinMaxDefault } from './rules/flag-min-max-default';
import { flagSummary } from './rules/flag-summary';
import { flagCasing } from './rules/flag-casing';
import { extractMessageFlags } from './rules/extract-message-flags';
import { flagCrossReferences } from './rules/flag-cross-references';
import { commandSummary } from './rules/command-summary';
import { commandExamples } from './rules/command-example';
import { extractMessageCommand } from './rules/extract-message-command';
import { jsonFlag } from './rules/no-json-flag';
import { dashH } from './rules/dash-h';
import { noSfdxCommandImport } from './rules/migration/no-sfdx-command-import';
import { sfdxFlagsProperty } from './rules/migration/sfdx-flags-property';
import { useSfCommandFlags } from './rules/migration/use-sf-command-flags';
import { noThisUx } from './rules/migration/no-this-ux';
import { noThisOrg } from './rules/migration/no-this-org';
import { runMatchesClassType } from './rules/run-matches-class-type';
import { noDeprecatedProperties } from './rules/migration/no-deprecated-properties';
import { shouldParseFlags } from './rules/migration/should-parse-flags';
import { noThisFlags } from './rules/migration/no-this-flags';
import { getConnectionWithVersion } from './rules/get-connections-with-version';
import { noOclifFlagsCommandImport } from './rules/no-oclif-flags-command-import';
import { noBuiltinFlags } from './rules/migration/no-builtin-flags';
import { dashO } from './rules/dash-o';
import { readOnlyProperties } from './rules/read-only-properties';
import { noTimeFlags } from './rules/migration/no-time-flags';
import { idFlagSuggestions } from './rules/id-flag-suggestions';
import { noIdFlags } from './rules/migration/no-id-flags';
import { noFilepathFlags } from './rules/migration/no-filepath-flags';
import { noNumberFlags } from './rules/migration/no-number-flags';
import { noSplitExamples } from './rules/no-split-examples';
import { noUsernameProperties } from './rules/migration/no-username-properties';
import { noUnnecessaryProperties } from './rules/no-unnecessary-properties';
import { encourageAliasDeprecation } from './rules/migration/encourage-alias-deprecation';
import { noUnnecessaryAliases } from './rules/no-unnecessary-aliases';
import { noMissingMessages } from './rules/no-missing-messages';
import { noArgsParseWithoutStrictFalse } from './rules/no-args-parse-without-strict-false';
import { noHyphenAliases } from './rules/no-hyphens-aliases';
import { noClassesInCommandReturnType } from './rules/no-classes-in-command-return-type';

const library = {
  plugins: ['sf-plugin'],
  rules: {
    'sf-plugin/no-missing-messages': 'error',
  },
};

const recommended = {
  plugins: ['sf-plugin'],
  rules: {
    ...library.rules,
    'sf-plugin/command-example': 'warn',
    'sf-plugin/flag-min-max-default': 'warn',
    'sf-plugin/no-hardcoded-messages-flags': 'warn',
    'sf-plugin/no-hardcoded-messages-commands': 'warn',
    'sf-plugin/get-connection-with-version': 'warn',
    'sf-plugin/dash-o': 'warn',
    'sf-plugin/command-summary': 'error',
    'sf-plugin/no-duplicate-short-characters': 'error',
    'sf-plugin/no-h-short-char': 'error',
    'sf-plugin/flag-case': 'error',
    'sf-plugin/flag-summary': 'error',
    'sf-plugin/flag-cross-references': 'error',
    'sf-plugin/no-json-flag': 'error',
    'sf-plugin/run-matches-class-type': 'error',
    'sf-plugin/no-oclif-flags-command-import': 'error',
    'sf-plugin/read-only-properties': 'warn',
    'sf-plugin/id-flag-suggestions': 'warn',
    'sf-plugin/no-split-examples': 'error',
    'sf-plugin/no-unnecessary-properties': 'warn',
    'sf-plugin/no-unnecessary-aliases': 'error',
    'sf-plugin/no-args-parse-without-strict-false': 'error',
    'sf-plugin/no-hyphens-aliases': 'error',
    'sf-plugin/no-classes-in-command-return-type': 'error',
  },
};

export = {
  configs: {
    recommended,
    library,
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
        'sf-plugin/no-time-flags': 'error',
        'sf-plugin/no-id-flags': 'error',
        'sf-plugin/no-username-properties': 'error',
        'sf-plugin/encourage-alias-deprecation': 'warn',
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
    'no-json-flag': jsonFlag,
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
    'dash-o': dashO,
    'read-only-properties': readOnlyProperties,
    'no-time-flags': noTimeFlags,
    'id-flag-suggestions': idFlagSuggestions,
    'no-id-flags': noIdFlags,
    'no-filepath-flags': noFilepathFlags,
    'no-number-flags': noNumberFlags,
    'no-split-examples': noSplitExamples,
    'no-username-properties': noUsernameProperties,
    'no-unnecessary-properties': noUnnecessaryProperties,
    'encourage-alias-deprecation': encourageAliasDeprecation,
    'no-unnecessary-aliases': noUnnecessaryAliases,
    'no-missing-messages': noMissingMessages,
    'no-args-parse-without-strict-false': noArgsParseWithoutStrictFalse,
    'no-hyphens-aliases': noHyphenAliases,
    'no-classes-in-command-return-type': noClassesInCommandReturnType,
  },
};
