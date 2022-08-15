/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { flagMinMaxDefault } from '../../src/rules/flagMinMaxDefault';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('flagMinMaxDefault', flagMinMaxDefault, {
  valid: [
    {
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.integer({
      min: 1,
      max: 5,
      default: 2
    })
  }
}

`,
    },

    {
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.integer({
      min: 1,
      max: 5
    }),
  }
}

`,
    },

    // duration flags use defaultValue instead of default
    {
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.duration({
      min: 1,
      max: 5,
      defaultValue: 2
    }),
  }
}

`,
    },
  ],
  invalid: [
    {
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'message',
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.integer({
      min: 5
    }),
  }
}
`,
    },
    {
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'message',
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.duration({
      min: 5
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
      filename: path.normalize('src/commands/foo.ts'),

      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.integer({
      max: 5
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
      filename: path.normalize('src/commands/foo.ts'),

      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.integer({
      min: 3,
      max: 5
    }),
  }
}
`,
    },
  ],
});
