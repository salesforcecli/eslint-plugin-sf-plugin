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

export = {
  configs: {
    recommended: {
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
      },
    },
  },
  rules: {
    'no-h-short-char': dashH,
    'no-duplicate-short-characters': noDuplicateShortCharacters,
    'flag-case': flagCasing,
    'flag-summary': flagSummary,
    'no-hardcoded-messages-flags': extractMessageFlags,
    'no-hardcoded-messages-commands': extractMessageCommand,
    'flag-cross-references': flagCrossReferences,
    'command-summary': commandSummary,
    'command-example': commandExamples,
    'json-flag': jsonFlag,
    'flag-min-max-default': flagMinMaxDefault,
  },
};
