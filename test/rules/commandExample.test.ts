/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { commandExamples } from '../../src/rules/commandExamples';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('commandExamples', commandExamples, {
  valid: [
    // example with different chars
    {
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly summary = 'foo'
  public static readonly examples = 'baz'

}
`,
    },
    // not an sfCommand
    {
      code: `
export default class EnvCreateScratch extends somethingElse<ScratchCreateResponse> {
  // stuff
}
`,
    },
    // violation but in wrong folder
    {
      filename: 'foo.ts',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly description = 'bar'
  public static readonly summary = 'baz'
}
`,
    },
  ],
  invalid: [
    {
      filename: 'src/commands/foo.ts',
      errors: [
        {
          messageId: 'example',
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly description = 'bar'
  public static readonly summary = 'baz'
}
`,
    },
  ],
});
