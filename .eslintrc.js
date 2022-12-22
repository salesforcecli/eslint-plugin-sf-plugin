/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
module.exports = {
  parserOptions: {
    sourceType: 'module',
  },
  extends: [
    'eslint-config-salesforce-typescript',
    'eslint-config-salesforce-license',
    'plugin:eslint-plugin/recommended',
  ],
  ignorePatterns: ['dist'],
};
