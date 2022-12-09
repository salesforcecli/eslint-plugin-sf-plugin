/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { sfdxFlagsProperty } from '../../../src/rules/migration/sfdxFlagsProperty';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('sfdxFlagsProperty', sfdxFlagsProperty, {
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
    // 1 fixer for the flagsConfig => flags prop
    {
      name: 'sfdx style flagsConfig',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'flagsConfig' }, { messageId: 'flagsConfigType' }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flagsConfig: FlagsConfig = {
    foo: flags.boolean()
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags: FlagsConfig = {
    foo: flags.boolean()
  }
}
`,
    },
    // next fixer to remove the FlagsConfig type
    {
      name: 'sfdx style flagsConfig',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'flagsConfigType' }],
      output: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    foo: flags.boolean()
  }
}
`,
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags: FlagsConfig = {
    foo: flags.boolean()
  }
}
`,
    },
  ],
});
