/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { flagCasing } from '../../src/rules/flagCasing';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('flagCasing', flagCasing, {
  valid: [
    `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({}),
    'some-literal': Flags.string({}),
  }
}

`,
  ],
  invalid: [
    {
      errors: [
        {
          messageId: 'message',
          data: { flagName: 'Alias' },
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    Alias: Flags.string({}),
    'some-literal': Flags.string({}),
  }
}
`,
    },
    {
      errors: [
        {
          messageId: 'message',
          data: { flagName: 'Alias' },
        },
        {
          messageId: 'message',
          data: { flagName: 'some-Literal' },
        },
      ],
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
