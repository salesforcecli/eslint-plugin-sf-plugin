/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { spreadBaseFlags } from '../../src/rules/spread-base-flags';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('spread-base-flags', spreadBaseFlags, {
  valid: [
    {
      name: 'spreads base flags when required',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class Top extends Base<ScratchCreateResponse> {
  public static flags = {
    ...Base.flags,
    alias: Flags.string({
      summary: 'foo',
      char: 'a'
    })
  }
}
`,
    },
    {
      name: 'does not apply to SfCommand',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class Top extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: 'foo',
      char: 'a'
    })
  }
}
`,
    },
  ],
  invalid: [
    {
      name: 'does not spread base flags',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }],
      code: `
export default class Top extends BaseCommand<Foo> {
  public static flags = {
    json: Flags.boolean({
      char: 'h',
      default: true,
      dependsOn: ['myOtherFlag']
    })
  }
}
`,
    },
  ],
});
