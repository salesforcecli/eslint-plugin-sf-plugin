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

export = {
  configs: {
    recommended: {
      plugins: ['sf-plugin'],
      rules: {
        'sf-plugin/no-duplicate-short-characters': 'error',
        'sf-plugin/flag-case': 'error',
        'sf-plugin/no-hardcoded-messages': 'warn',
        'sf-plugin/flag-cross-references': 'error',
      },
    },
  },
  rules: {
    'no-duplicate-short-characters': noDuplicateShortCharacters,
    'flag-case': flagCasing,
    'no-hardcoded-messages': extractMessage,
    'flag-cross-references': flagCrossReferences,
  },
};
