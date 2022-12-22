/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { noIdFlags } from '../../../src/rules/migration/no-id-flags';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noBuiltinFlags', noIdFlags, {
  valid: [
    {
      name: 'salesforceId flag',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    verbose: Flags.salesforceId({
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
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    verbose: Flags.id({}),
  }
}

`,
    },
  ],
  invalid: [
    {
      name: 'id flag',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    verbose: Flags.id({
      summary: 'foo'
    }),
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    verbose: Flags.salesforceId({
      summary: 'foo'
    }),
  }
}
`,
    },
  ],
});
