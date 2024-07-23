/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noFilepathFlags } from '../../../src/rules/migration/no-filepath-flags';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noFilepathFlags', noFilepathFlags, {
  valid: [
    {
      name: 'filepath flag',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    verbose: Flags.file({
      summary: 'foo'
    }),
  }
}

`,
    },
    {
      name: 'not in command directory',
      filename: path.normalize('foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    verbose: Flags.filepath({}),
  }
}

`,
    },
  ],
  invalid: [
    {
      name: 'filepath flag',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    verbose: Flags.filepath({
      summary: 'foo'
    }),
  }
}
`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    verbose: Flags.file({
      summary: 'foo'
    }),
  }
}
`,
    },
  ],
});
