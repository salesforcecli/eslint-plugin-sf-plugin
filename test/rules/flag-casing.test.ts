/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { flagCasing } from '../../src/rules/flag-casing';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('flagCasing', flagCasing, {
  valid: [
    {
      name: 'correct flag casing for hyphenated and non-hyphenated',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({}),
    'some-literal': Flags.string({}),
  }
}
`,
    },
    {
      name: 'not in commands directory',
      filename: path.normalize('src/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    Alias: Flags.string({}),
    'some-literal': Flags.string({}),
  }
}
`,
    },
  ],
  invalid: [
    {
      name: 'capitalized non-hyphenated flag',
      errors: [
        {
          messageId: 'message',
          data: { flagName: 'Alias' },
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    Alias: Flags.string({}),
    'some-literal': Flags.string({}),
  }
}
`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    'alias': Flags.string({}),
    'some-literal': Flags.string({}),
  }
}
`,
    },
    {
      name: 'both flags are capitalized incorrectly',
      errors: [
        {
          messageId: 'message',
          data: { flagName: 'Alias' },
        },
        {
          messageId: 'message',
          data: { flagName: 'some-Literal' },
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    Alias: Flags.string({}),
    'some-Literal': Flags.string({}),
  }
}
`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    'alias': Flags.string({}),
    'some-literal': Flags.string({}),
  }
}
`,
    },
  ],
});
