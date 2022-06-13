/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { extractMessageCommand } from '../../src/rules/extractMessageCommand';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no hardcoded summary/description on command', extractMessageCommand, {
  valid: [
    {
      filename: 'src/commands/foo.ts',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly description = messages.getMessage('description');
  public static readonly summary = messages.getMessage('summary');
}
`,
    },
    // description only
    {
      filename: 'src/commands/foo.ts',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
 public static readonly description = messages.getMessage('description');
}
`,
    },
    // summary only
    {
      filename: 'src/commands/foo.ts',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
   public static readonly summary = messages.getMessage('summary');
}
`,
    },
    // not an sf command
    {
      filename: 'src/foo.ts',
      code: `
export default class EnvCreateScratch extends SomethingElse<ScratchCreateResponse> {
  public static readonly description = 'foo';
  public static readonly summary = 'bar';
}
`,
    },
    // all sorts of violations but not in the commands directory
    {
      filename: 'src/foo.ts',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly description = 'foo';
  public static readonly summary = 'bar';
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
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
 public static readonly description = 'foo';
 public static readonly summary = messages.getMessage('summary');
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
 public static readonly description = 'foo';
 public static readonly summary = 'bar';
}
`,
    },
  ],
});
