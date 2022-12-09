/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { useSfCommandFlags } from '../../../src/rules/migration/useSfCommandFlags';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('useSfCommandFlags', useSfCommandFlags, {
  valid: [
    {
      name: 'sf flags',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly flags = {
    foo: Flags.boolean()
  }
}

`,
    },
    {
      name: 'Not in commands dir',
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<string> {
  public static flagsConfig: FlagsConfig = {
    foo: flags.boolean()
  }
}

`,
    },
  ],
  invalid: [
    {
      name: 'sfdx style lowercase flags',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    foo: flags.boolean()
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    foo: Flags.boolean()
  }
}
`,
    },
  ],
});
