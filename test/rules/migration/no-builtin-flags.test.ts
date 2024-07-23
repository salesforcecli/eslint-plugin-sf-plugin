/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noBuiltinFlags } from '../../../src/rules/migration/no-builtin-flags';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noBuiltinFlags', noBuiltinFlags, {
  valid: [
    {
      name: 'flags without json',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    verbose: Flags.boolean({
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
    verbose: Flags.builtin({}),
  }
}

`,
    },
  ],
  invalid: [
    {
      name: 'builtin flag',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    verbose: Flags.builtin({
      summary: 'foo'
    }),
  }
}
`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    verbose: Flags.boolean({
      summary: 'foo'
    }),
  }
}
`,
    },
    {
      name: 'builtin flag with no arguments',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    verbose: Flags.builtin(),
  }
}
`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    verbose: Flags.boolean(),
  }
}
`,
    },
  ],
});
