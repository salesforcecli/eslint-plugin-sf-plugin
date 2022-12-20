/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { runMatchesClassType } from '../../src/rules/run-matches-class-type';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('runMatchesClassType', runMatchesClassType, {
  valid: [
    {
      name: 'Custom Type',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public async run(): Promise<ScratchCreateResponse> {
    console.log('hi')
  }
}

`,
    },
    {
      name: 'standard type',
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<string> {
  public async run(): Promise<string> {
    console.log('hi')
  }
}

`,
    },
  ],
  invalid: [
    {
      name: 'non-matching types',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'summary' }, { messageId: 'summary' }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    console.log('hi')
  }
}
`,
      output: null,
    },
    {
      name: 'unknown on class will change to match Run method',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'summary' }],
      output: `
export default class EnvCreateScratch extends SfCommand<Bar> {
  public async run(): Promise<Bar> {
    console.log('hi')
  }
}`,
      code: `
export default class EnvCreateScratch extends SfCommand<unknown> {
  public async run(): Promise<Bar> {
    console.log('hi')
  }
}`,
    },
  ],
});
