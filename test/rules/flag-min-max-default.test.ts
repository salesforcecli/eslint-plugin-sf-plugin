/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { flagMinMaxDefault } from '../../src/rules/flag-min-max-default';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('flagMinMaxDefault', flagMinMaxDefault, {
  valid: [
    {
      name: 'has min, max, default',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.integer({
      min: 1,
      max: 5,
      default: 2
    })
  }
}

`,
    },

    {
      name: 'not commands directory',
      filename: path.normalize('foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.integer({
      min: 1,
      max: 5
    }),
  }
}

`,
    },

    // duration flags use defaultValue instead of default
    {
      name: 'correct setup for a Duration flag',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.duration({
      min: 1,
      max: 5,
      defaultValue: 2
    }),
  }
}

`,
    },
  ],
  invalid: [
    {
      name: 'missing default',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'message',
        },
      ],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.integer({
      min: 5
    }),
  }
}
`,
    },
    {
      name: 'missing defaultValue on a duratino flag',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'message',
        },
      ],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.duration({
      min: 5
    }),
  }
}
`,
    },
    {
      errors: [
        {
          messageId: 'message',
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),

      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.integer({
      max: 5
    }),
  }
}
`,
    },
    {
      errors: [
        {
          messageId: 'message',
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),

      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.integer({
      min: 3,
      max: 5
    }),
  }
}
`,
    },
  ],
});
