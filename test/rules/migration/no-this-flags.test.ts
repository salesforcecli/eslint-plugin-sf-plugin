/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { noThisFlags } from '../../../src/rules/migration/no-this-flags';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noThisFlags', noThisFlags, {
  valid: [
    {
      name: 'Custom Type',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: flags.string({ char: 'f', description: 'foo flag' }),
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch)
    console.log(flags.foo)
  }
}
`,
    },
    {
      name: 'Not in commands dir',
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: flags.string({ char: 'f', description: 'foo flag' }),
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch)
    console.log(flags.foo)
  }
}
`,
    },
  ],
  invalid: [
    {
      name: 'uses this.flags',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'noThisFlags' }],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: flags.string({ char: 'f', description: 'foo flag' }),
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch)
  }
  public otherMethod() {
    console.log(this.flags.foo)
  }
}
`,
    },
    {
      name: 'uses this.flags in run (autofix)',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'noThisFlags' }],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: flags.string({ char: 'f', description: 'foo flag' }),
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch)
    console.log(this.flags.foo)
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: flags.string({ char: 'f', description: 'foo flag' }),
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch)
    console.log(flags.foo)
  }
}
`,
    },
  ],
});
