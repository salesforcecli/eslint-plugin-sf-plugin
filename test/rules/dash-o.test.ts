/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';

import { dashO } from '../../src/rules/dash-o';
import { RuleTester } from '@typescript-eslint/rule-tester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('dashO', dashO, {
  valid: [
    {
      name: 'does not use -o',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: 'foo',
      char: 'a'
    }),
  }
}
`,
    },
    {
      name: 'uses -o for an org-like flag',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    hub: Flags.requiredOrgFlag({
      summary: 'foo',
      char: 'o'
    }),
  }
}
`,
    },
    {
      name: 'uses -o for an hub-like flag',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    hub: Flags.requiredHubFlag({
      summary: 'foo',
      char: 'o'
    }),
  }
}
`,
    },
    {
      name: 'not in commands directory',
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    json: Flags.boolean({
      char: 'o'
    }),
  }
}
`,
    },
  ],
  invalid: [
    {
      name: 'uses -o',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    json: Flags.boolean({
      char: 'o'
    }),
  }
}
`,
    },
  ],
});
