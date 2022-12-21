/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { readOnlyProperties } from '../../src/rules/readOnlyProperties';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('readOnlyProperties', readOnlyProperties, {
  valid: [
    {
      name: 'correct example for a command',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly summary = 'foo'
  public static readonly examples = 'baz'
}
`,
    },
    {
      name: 'not an sf command',
      code: `
export default class EnvCreateScratch extends somethingElse<ScratchCreateResponse> {
  public static description = 'bar'
}
`,
    },
    {
      name: 'not in the commands folder',
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static description = 'bar'
  public static summary = 'baz'
}
`,
    },
  ],
  invalid: [
    {
      name: 'does not have readonly',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'message',
          data: { prop: 'description' },
        },
        {
          messageId: 'message',
          data: { prop: 'summary' },
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static description = 'bar'
  public static summary = 'baz'
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly description = 'bar'
  public static readonly summary = 'baz'
}
`,
    },
  ],
});
