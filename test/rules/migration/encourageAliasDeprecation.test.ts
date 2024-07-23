/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { encourageAliasDeprecation } from '../../../src/rules/migration/encourage-alias-deprecation';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('encourageAliasDeprecation', encourageAliasDeprecation, {
  valid: [
    {
      name: 'alias with deprecation',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['foo'];
  public static readonly deprecateAliases = true;
}`,
    },
    {
      name: 'Not in commands dir',
      filename: path.normalize('foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<string> {
  public static readonly aliases = ['foo'];
}`,
    },
    {
      name: 'flag alias with deprecation',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly flags = {
    foo: Flags.string({
      aliases: ['bar'],
      deprecateAliases: true,
    })
  }
}`,
    },
  ],
  invalid: [
    //
    {
      name: 'aliases without deprecation',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'command',
          suggestions: [
            {
              messageId: 'command',
              output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly deprecateAliases = true;public static readonly aliases = ['foo'];
}`,
            },
          ],
        },
      ],
      output: null,
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['foo'];
}`,
    },
    {
      name: 'flag alias without deprecation',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'flag',
          suggestions: [
            {
              messageId: 'flag',
              output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly flags = {
    foo: Flags.string({
      deprecateAliases:true,aliases: ['bar'],
    })
  }
}`,
            },
          ],
        },
      ],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly flags = {
    foo: Flags.string({
      aliases: ['bar'],
    })
  }
}`,
      output: null,
    },
  ],
});
