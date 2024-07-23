/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';
import { shouldParseFlags } from '../../../src/rules/migration/should-parse-flags';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('shouldParseFlags', shouldParseFlags, {
  valid: [
    {
      name: 'Parses as expected',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.boolean()
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch);
  }
}
`,
    },
    {
      name: 'No flags to parse',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
    export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
      public async run(): Promise<ScratchCreateResponse> {}
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
        foo: Flags.boolean()
      }
      public async run(): Promise<ScratchCreateResponse> {}
    }
    `,
    },
  ],
  invalid: [
    {
      name: 'missing parse, will add',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'summary' }],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.boolean()
  }
  public async run(): Promise<ScratchCreateResponse> {
    console.log('hi')
  }
}
`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.boolean()
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch);console.log('hi')
  }
}
`,
    },
  ],
});
