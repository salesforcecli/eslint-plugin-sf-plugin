/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noDependsOnBooleanFlags } from '../../src/rules/no-depends-on-boolean-flags';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noDependsOnBooleanFlags', noDependsOnBooleanFlags, {
  valid: [
    {
      name: 'dependsOn non-boolean flag',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class DataQuery extends SfCommand<void> {
  public static readonly flags = {
    query: Flags.string({
      char: 'q',
      summary: messages.getMessage('flags.query.summary'),
      exactlyOne: ['query', 'file'],
    }),
    test: Flags.string({
      summary: 'test flag',
      dependsOn: ['query']
    }),
  }
}
`
    }
  ],
  invalid: [
    {
      name: 'dependsOn boolean flag',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class DataQuery extends SfCommand<void> {
  public static readonly flags = {
    ...orgFlags,
    bulk: Flags.boolean({
      char: 'b',
      default: false,
      summary: messages.getMessage('flags.bulk.summary'),
      exclusive: ['use-tooling-api'],
    }),
    wait: Flags.duration({
      unit: 'minutes',
      char: 'w',
      summary: messages.getMessage('flags.wait.summary'),
      dependsOn: ['bulk'],
      exclusive: ['async'],
    }),
  }
}
`,
    }
  ],
});
