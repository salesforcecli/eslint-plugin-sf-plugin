/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { noDuplicateShortCharacters } from './rules/noDuplicateShortCharacters';
import { flagCasing } from './rules/flagCasing';
import { extractMessage } from './rules/extractMessage';
import { flagCrossReferences } from './rules/flagCrossReferences';

module.exports = {
  configs: {
    recommended: {
      plugins: ['@salesforce/eslint-plugin-sf-plugin'],
      env: ['node'],
      rules: {
        '@salesforce/eslint-plugin-sf-plugin/no-duplicate-short-characters': 'error',
        '@salesforce/eslint-plugin-sf-plugin/flag-case': 'error',
        '@salesforce/eslint-plugin-sf-plugin/no-hardcoded-messages': 'warn',
        '@salesforce/eslint-plugin-sf-plugin/flag-cross-references': 'error',
      },
    },
  },
  rules: {
    'no-duplicate-short-characters': {
      create: noDuplicateShortCharacters,
    },
    'flag-case': {
      create: flagCasing,
    },
    'no-hardcoded-messages': {
      create: extractMessage,
    },
    'flag-cross-references': {
      create: flagCrossReferences,
    },
  },
};
