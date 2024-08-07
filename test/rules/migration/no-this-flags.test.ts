/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noThisFlags } from '../../../src/rules/migration/no-this-flags';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noThisFlags', noThisFlags, {
  valid: [
    {
      name: 'Custom Type',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
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
import {SfCommand} from '@salesforce/sf-plugins-core';
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
      errors: [
        {
          messageId: 'noThisFlags',
          suggestions: [
            {
              messageId: 'useFlags',
              output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: flags.string({ char: 'f', description: 'foo flag' }),
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch)
  }
  public otherMethod() {
    console.log(flags.foo)
  }
}
`,
            },
            {
              messageId: 'instanceProp',
              output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: flags.string({ char: 'f', description: 'foo flag' }),
  }
  private flags: Interfaces.InferredFlags<typeof EnvCreateScratch.flags>;public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch)
  }
  public otherMethod() {
    console.log(this.flags.foo)
  }
}
`,
            },
          ],
        },
      ],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
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
      output: null,
    },
    {
      name: 'sets this.flags',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'instanceProp' }],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: flags.string({ char: 'f', description: 'foo flag' }),
  }
  private flags: Interfaces.InferredFlags<typeof ScratchCreateResponse.flags>;
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch);
    console.log(this.flags)
  }
}
`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: flags.string({ char: 'f', description: 'foo flag' }),
  }
  private flags: Interfaces.InferredFlags<typeof ScratchCreateResponse.flags>;
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch);this.flags = flags;
    console.log(this.flags)
  }
}
`,
    },
    {
      name: 'uses this.flags in run (autofix)',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'noThisFlags' }],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
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
import {SfCommand} from '@salesforce/sf-plugins-core';
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
