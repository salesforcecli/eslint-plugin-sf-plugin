/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { readOnlyProperties } from '../../src/rules/read-only-properties';

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
          messageId: 'readonly',
          data: { prop: 'description' },
        },
        {
          messageId: 'readonly',
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
    {
      name: 'does not have public or readonly',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'public',
          data: { prop: 'description' },
        },

        {
          messageId: 'public',
          data: { prop: 'summary' },
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  protected static readonly description = 'bar'
  protected static readonly summary = 'baz'
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly description = 'bar'
  public static readonly summary = 'baz'
}
`,
    },
    {
      name: 'aliases only modifies top-level, not flags (public)',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'public',
          data: { prop: 'aliases' },
        },
      ],
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = 'bar'
  public static readonly flags = {
    foo: flags.string({char: 'f', description: 'foo', aliases: ['g']}),
  }
}
`,
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  protected static readonly aliases = 'bar'
  public static readonly flags = {
    foo: flags.string({char: 'f', description: 'foo', aliases: ['g']}),
  }
}
`,
    },
    {
      name: 'aliases only modifies top-level, not flags (readonly)',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'readonly',
          data: { prop: 'aliases' },
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  protected static aliases = 'bar'
  public static readonly flags = {
    foo: flags.string({char: 'f', description: 'foo', aliases: ['g']}),
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  protected static readonly aliases = 'bar'
  public static readonly flags = {
    foo: flags.string({char: 'f', description: 'foo', aliases: ['g']}),
  }
}
`,
    },
  ],
});
