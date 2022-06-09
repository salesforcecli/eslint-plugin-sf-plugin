/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { flagCrossReferences } from '../../src/rules/flagCrossReferences';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('cross-references exist for dependsOn, exclusive, exactlyOne', flagCrossReferences, {
  valid: [
    `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      dependsOn: ['some-literal']
    }),
    'some-literal': Flags.string({}),
  }
}
`,
    `
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
    `
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
  ],
  invalid: [
    {
      errors: [
        {
          messageId: 'missingFlag',
          data: { flagName: 'noflag' },
        },
      ],
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
