/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { extractMessage } from '../../src/rules/extractMessage';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no duplicate short characters', extractMessage, {
  valid: [
    // no messages is fine
    {
      filename: 'src/commands/foo.ts',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      char: 'a'
    }),
  }
}
`,
    },
    // summary only
    {
      filename: 'src/commands/foo.ts',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: messages.getMessage('foo')
    }),
  }
}
`,
    },
    {
      filename: 'src/commands/foo.ts',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: messages.getMessage('foo'),
      description: messages.getMessage('bar')
    }),
  }
}
`,
    },
    {
      filename: 'src/commands/foo.ts',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      description: messages.getMessage('bar')
    }),
  }
}
`,
    },
    // all sorts of violations but not in the commands directory
    {
      filename: 'src/foo.ts',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      description: 'foo',
      summary: 'foo'
    }),
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
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: "hardcode"
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
      ],
      filename: 'src/commands/foo.ts',

      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      description: "hardcode"
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
    alias: Flags.string({
      summary: "hardcode",
      description: "hardcode, too"
    }),
  }
}
`,
    },
  ],
});
