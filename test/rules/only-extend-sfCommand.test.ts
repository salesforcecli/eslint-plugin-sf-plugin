/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { onlyExtendSfCommand } from "../../src/rules/only-extend-sfCommand";

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('only-extend-SfCommand', onlyExtendSfCommand, {
  valid: [
    {
      name: 'extends SfCommand directly',
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
    {
      name: 'not a command, can extend something else',
      filename: path.normalize('src/base/foo.ts'),
      code: `
export default class MyFormatter extends Formatter {
}

`,
    },
  ],
  invalid: [
    {
      name: 'does not extend SfCommand directly',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }],
      code: `
export default class EnvCreateScratch extends BaseCommand<Foo> {
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
