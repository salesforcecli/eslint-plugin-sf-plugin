/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';

import { commandExamples } from '../../src/rules/command-example';
import { RuleTester } from '@typescript-eslint/rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('commandExamples', commandExamples, {
  valid: [
    {
      name: 'correct example for a command',
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
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
  // stuff
}
`,
    },
    {
      name: 'not in the commands folder',
      filename: path.normalize('foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly description = 'bar'
  public static readonly summary = 'baz'
}
`,
    },
  ],
  invalid: [
    {
      name: 'is missing examples',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'example',
        },
      ],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly description = 'bar'
  public static readonly summary = 'baz'
}
`,
    },
  ],
});
