/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { flagCrossReferences } from '../../src/rules/flag-cross-references';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('cross-references exist for dependsOn, exclusive, exactlyOne', flagCrossReferences, {
  valid: [
    {
      name: 'dependent flag exists',
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
    {
      name: 'non-static definition of flags is supported',
      filename: path.normalize('src/commands/foo.ts'),
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
      name: '2 exclusive flags that refer to each other',
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
      name: '2 exactlyOne flags that refer to each other',
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
    {
      filename: path.normalize('src/foo.ts'),
      name: 'anything is ok outside the commands directory',
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
      name: 'exclusive refers to non-existent flag',
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
      name: 'dependsOn refers to non-existent flag',
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
      name: 'exactlyOne refers to non-existent flag',
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
