/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noUnnecessaryProperties } from '../../src/rules/no-unnecessary-properties';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noUnnecessaryProperties', noUnnecessaryProperties, {
  valid: [
    {
      name: 'correct example for a command',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static requiresProject = true
  public static notInTargetList = false
}
`,
    },
    {
      name: 'other static properties with no value',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static org: Org
}
`,
    },
    {
      name: 'populated aliases  for a command',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static aliases = ['foo']
}
`,
    },
    {
      name: 'not an sf command',
      code: `
export default class EnvCreateScratch extends somethingElse<ScratchCreateResponse> {
  public static requiresProject = false
}
`,
    },
    {
      name: 'not in the commands folder',
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
   public static requiresProject = false
}
`,
    },
  ],
  invalid: [
    {
      name: 'empty aliases',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'messageEmpty',
          data: { prop: 'aliases' },
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = []
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  
}
`,
    },

    {
      name: '2 properties set to false',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'messageFalse',
          data: { prop: 'hidden' },
        },
        {
          messageId: 'messageFalse',
          data: { prop: 'requiresProject' },
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static hidden = false
  public static requiresProject = false
  public static somethingElse = true
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  
  
  public static somethingElse = true
}
`,
    },
  ],
});
