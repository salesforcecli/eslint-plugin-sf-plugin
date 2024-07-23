/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noDuplicateShortCharacters } from '../../src/rules/no-duplicate-short-characters';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no duplicate short characters', noDuplicateShortCharacters, {
  valid: [
    {
      name: 'all flags use different chars',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      char: 'a',
      aliases: ['d']
    }),
    'some-literal': Flags.string({
      char: 'b',
      aliases: ['c']
    }),
  }
}

`,
    },

    {
      name: 'some flags have no char',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
    }),
    'some-literal': Flags.string({
      char: 'b'
    }),
  }
}

`,
    },

    {
      name: 'not in commands dir',
      filename: path.normalize('src/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      char: 'b'
    }),
    'some-literal': Flags.string({
      char: 'b'
    }),
  }
}

`,
    },
  ],
  invalid: [
    {
      name: 'character was already used as a character',
      errors: [
        {
          messageId: 'charCollision',
          data: { flag2: 'foo', flag1: 'some-literal', char: 'a' },
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.string({
      char: 'a'
    }),
    'some-literal': Flags.string({
      char: 'a'
    }),
  }
}
`,
    },
    {
      name: 'character was already used as an alias',
      errors: [
        {
          messageId: 'charCollision',
          data: { flag2: 'foo', flag1: 'some-literal', char: 'b' },
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.string({
      char: 'a',
      aliases: ['b']
    }),
    'some-literal': Flags.string({
      char: 'b'
    }),
  }
}
`,
    },
    {
      name: 'alias already used as an alias',
      errors: [
        {
          messageId: 'aliasCollision',
          data: { flag2: 'foo', flag1: 'some-literal', alias: 'c' },
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.string({
      char: 'a',
      aliases: ['c']
    }),
    'some-literal': Flags.string({
      char: 'b',
      aliases: ['c']
    }),
  }
}
`,
    },
    {
      name: 'alias already used as a flag',
      errors: [
        {
          messageId: 'aliasCollision',
          data: { flag2: 'foo', flag1: 'some-literal', alias: 'foo' },
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.string({
      char: 'a',
      aliases: ['c']
    }),
    'some-literal': Flags.string({
      char: 'b',
      aliases: ['foo']
    }),
  }
}
`,
    },
    {
      name: 'flag already used as an alias',
      errors: [
        {
          messageId: 'flagCollision',
          data: { flag2: 'foo', flag1: 'some-literal', alias: 'foo' },
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    foo: Flags.string({
      char: 'a',
      aliases: ['some-literal']
    }),
    'some-literal': Flags.string({
      char: 'b',
    }),
  }
}
`,
    },
  ],
});
