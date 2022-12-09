/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { getConnectionWithVersion } from '../../src/rules/getConnectionsWithVersion';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('call getConnection with version', getConnectionWithVersion, {
  valid: [
    {
      name: 'passes in version',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public async run(): Promise<ScratchCreateResponse> {
    const conn = flags['target-org'].getConnection(flags['api-version']);
  }
}
`,
    },

    {
      name: 'not in commands dir',
      filename: path.normalize('src/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public async run(): Promise<ScratchCreateResponse> {
    const conn = flags['target-org'].getConnection(flags['api-version']);
  }
}
`,
    },
  ],
  invalid: [
    {
      name: 'calls getConnection without version',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'addVersion',
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public async run(): Promise<ScratchCreateResponse> {
    const conn = flags['target-org'].getConnection();
  }
}
`,
    },
  ],
});
