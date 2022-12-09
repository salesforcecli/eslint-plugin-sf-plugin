/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { noSfdxCommandImport } from '../../../src/rules/migration/noSfdxCommandImport';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noSfdxCommandImport', noSfdxCommandImport, {
  valid: [
    {
      name: 'sf import and base class',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {Flags, SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {}
`,
    },
    {
      name: 'Not in commands dir',
      filename: path.normalize('foo.ts'),
      code: `
import {Flags, Command} from '@salesforce/command';
export default class EnvCreateScratch extends SfdxCommand {}
`,
    },
  ],
  invalid: [
    {
      name: 'sfdx import',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'import' }],
      code: `
import {Flags, Command} from '@salesforce/command';
`,
      output: `
import {Flags, SfCommand} from '@salesforce/sf-plugins-core';
`,
    },
    {
      name: 'sfdx base class',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'superClass' }],
      code: `
export default class EnvCreateScratch extends SfdxCommand {}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<unknown> {}
`,
    },
    {
      name: 'both',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'import' }, { messageId: 'superClass' }],
      code: `
import {Flags, Command} from '@salesforce/command';
export default class EnvCreateScratch extends SfdxCommand {}
`,
      output: `
import {Flags, SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<unknown> {}
`,
    },
  ],
});
