/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { jsonFlag } from '../../src/rules/jsonFlag';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('jsonFlag', jsonFlag, {
  valid: [
    {
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: 'foo'
    }),
  }
}

`,
    },
    {
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    json: Flags.boolean({}),
  }
}

`,
    },
  ],
  invalid: [
    {
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    json: Flags.boolean({
      description: 'foo'
    }),
  }
}
`,
    },
  ],
});
