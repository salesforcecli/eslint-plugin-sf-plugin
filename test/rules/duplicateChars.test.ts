/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { noDuplicateShortCharacters } from '../../src/rules/noDuplicateShortCharacters';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no duplicate short characters', noDuplicateShortCharacters, {
  valid: [
    // example with different chars
    `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      char: 'a'
    }),
    'some-literal': Flags.string({
      char: 'b'
    }),
  }
}

`,
    // example with some chars not present
    `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
    }),
    'some-literal': Flags.string({
      char: 'b'
    }),
  }
}

`,
  ],
  invalid: [
    {
      errors: [
        {
          messageId: 'message',
          data: { flag2: 'alias', flag1: 'some-literal', char: "'a'" },
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      char: 'a'
    }),
    'some-literal': Flags.string({
      char: 'a'
    }),
  }
}
`,
    },
  ],
});
