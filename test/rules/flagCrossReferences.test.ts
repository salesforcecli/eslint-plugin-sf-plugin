/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { flagCrossReferences } from '../../src/rules/flagCrossReferences';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('cross-references exist for dependsOn, exclusive, exactlyOne', flagCrossReferences, {
  valid: [
    {
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      dependsOn: ['some-literal']
    }),
    'some-literal': Flags.string({}),
  }
}
`,
    },
    // non static other definition of flags
    {
      code: `
    export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      dependsOn: ['some-literal']
    }),
    'some-literal': Flags.string({}),
  }
  private flags: CmdFlags;
}
`,
    },
    {
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      exclusive: ['some-literal']
    }),
    'some-literal': Flags.string({
      exclusive: ['alias']
    }),
  }
}
`,
    },
    {
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      exactlyOne: ['some-literal', 'alias']
    }),
    'some-literal': Flags.string({
      exactlyOne: ['some-literal', 'alias']
    }),
  }
}
`,
    },
    // would be invalid except not in commands folder
    {
      filename: path.normalize('src/foo.ts'),

      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      exclusive: ['noflag']
    }),
    'some-literal': Flags.string({ }),
  }
}`,
    },
  ],
  invalid: [
    {
      errors: [
        {
          messageId: 'missingFlag',
          data: { flagName: 'noflag' },
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),

      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      exclusive: ['noflag']
    }),
    'some-literal': Flags.string({ }),
  }
}
`,
    },
    {
      errors: [
        {
          messageId: 'missingFlag',
          data: { flagName: 'noflag' },
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      dependsOn: ['noflag']
    }),
    'some-literal': Flags.string({ }),
  }
}
`,
    },
    {
      errors: [
        {
          messageId: 'missingFlag',
          data: { flagName: 'noflag' },
        },
        {
          messageId: 'missingFlag',
          data: { flagName: 'noflag' },
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      exactlyOne: ['noflag', 'some-literal']
    }),
    'some-literal': Flags.string({
      exactlyOne: ['noflag', 'some-literal']
     }),
  }
}
`,
    },
  ],
});
