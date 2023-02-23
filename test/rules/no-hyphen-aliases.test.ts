/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { noHyphenAliases } from '../../src/rules/no-hyphens-aliases';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no hyphen aliases', noHyphenAliases, {
  valid: [
    {
      name: 'aliases without hyphens',
      filename: path.normalize('src/commands/foo/bar/baz.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: 'foo',
      aliases: ['f', 'fooflag']
    }),
  }
}
`,
    },
  ],
  invalid: [
    {
      name: 'hyphen short char',
      errors: [
        {
          messageId: 'summary',
        },
      ],
      filename: path.normalize('src/commands/foo/bar/baz.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: 'foo',
      aliases: ['-f']
    }),
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: 'foo',
      aliases: ['f']
    }),
  }
}
`,
    },
    {
      name: 'double hyphen word alias',
      errors: [
        {
          messageId: 'summary',
        },
      ],
      filename: path.normalize('src/commands/foo/bar/baz.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: 'foo',
      aliases: ['--fooflag']
    }),
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: 'foo',
      aliases: ['fooflag']
    }),
  }
}
`,
    },

    {
      name: 'both, together',
      errors: [
        {
          messageId: 'summary',
        },
        {
          messageId: 'summary',
        },
      ],
      filename: path.normalize('src/commands/foo/bar/baz.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: 'foo',
      aliases: ['-f', '--fooflag']
    }),
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: 'foo',
      aliases: ['f', 'fooflag']
    }),
  }
}
`,
    },
  ],
});
