/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { commandSummary } from '../../src/rules/commandSummary';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('commandSummary', commandSummary, {
  valid: [
    {
      filename: path.normalize('src/commands/foo.ts'),
      code:
        // example with different chars
        `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly summary = 'foo'
  public static readonly examples = 'baz'

}
`,
    },
    // not an sfCommand
    {
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends somethingElse<ScratchCreateResponse> {
  // stuff
}
`,
    },
    // not an command class
    {
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export abstract class StagedProgress<T> {
  private dataForTheStatus: T;
  private theStages: Stage;
}
  `,
    },
    // not an command directory
    {
      filename: path.normalize('src/shared/.ts'),
      code: `
export abstract class StagedProgress<T> {
  private dataForTheStatus: T;
  private theStages: Stage;
}
  `,
    },
  ],
  invalid: [
    {
      errors: [
        {
          messageId: 'summary',
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly description = 'bar'
  public static readonly examples = 'baz'
}
`,
    },
  ],
});
