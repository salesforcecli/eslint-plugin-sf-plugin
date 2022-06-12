/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { flagSummary } from '../../src/rules/flagSummary';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('flagSummary', flagSummary, {
  valid: [
    {
      filename: 'src/commands/foo.ts',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: 'foo'
    }),
  }
}

`,
    },

    {
      filename: 'foo.ts',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({}),
  }
}

`,
    },
  ],
  invalid: [
    {
      filename: 'src/commands/foo.ts',
      errors: [
        {
          messageId: 'message',
          data: { flagName: 'Alias' },
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      description: 'foo'
    }),
  }
}
`,
    },
    {
      errors: [
        {
          messageId: 'message',
        },
        {
          messageId: 'message',
        },
      ],
      filename: 'src/commands/foo.ts',

      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    Alias: Flags.string({}),
    'some-Literal': Flags.string({}),
  }
}
`,
    },
  ],
});
