/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noDefaultDependsOnFlags } from "../../src/rules/no-default-depends-on-flags";

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noDefaultDependsOnFlags', noDefaultDependsOnFlags, {
  valid: [
    {
      name: 'does not use default and dependsOn',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
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
      name: 'uses dependsOn and default',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
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
