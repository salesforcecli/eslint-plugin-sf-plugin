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
    `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      char: 'a'
    }),
  }
}
`,
    // summary only
    `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: messages.getMessage('foo')
    }),
  }
}
`,
    `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: messages.getMessage('foo'),
      description: messages.getMessage('bar')
    }),
  }
}
`,
    `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      description: messages.getMessage('bar')
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
