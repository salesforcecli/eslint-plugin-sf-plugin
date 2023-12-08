/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { esmMessageImport } from '../../src/rules/esm-message-import';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('esmMessageImport', esmMessageImport, {
  valid: [
    {
      name: 'new loader method',
      code: 'Messages.importMessagesDirectoryFromMetaUrl(import.meta.url)',
    },
    {
      name: 'old loader method but not ESM',
      code: 'Messages.importMessagesDirectory(__dirname)',
    },
    {
      name: 'leave the unrelated import alone',
      code: `
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
`,
    },
    {
      name: 'imports used by other code',
      code: `
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

Messages.importMessagesDirectoryFromMetaUrl(import.meta.url)

const foo = dirname('foo/bar')
const foo = fileURLToPath('file:///foo/bar')
`,
    },
  ],
  invalid: [
    {
      name: 'new loader with extra imports updates the import',
      errors: [
        {
          messageId: 'changeImport',
        },
      ],
      code: `
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
Messages.importMessagesDirectory(dirname(fileURLToPath(import.meta.url)))
`,
      // other code (ex: prettier) can handle the extra whitespaces
      output: `
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
Messages.importMessagesDirectoryFromMetaUrl(import.meta.url)
`,
    },
    {
      name: 'new loader with extra imports updates the import',
      errors: [
        {
          messageId: 'unnecessaryImport',
        },
        {
          messageId: 'unnecessaryImport',
        },
      ],
      code: `
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
Messages.importMessagesDirectoryFromMetaUrl(import.meta.url)
`,
      // other code (ex: prettier) can handle the extra whitespaces
      output: `


Messages.importMessagesDirectoryFromMetaUrl(import.meta.url)
`,
    },
  ],
});
