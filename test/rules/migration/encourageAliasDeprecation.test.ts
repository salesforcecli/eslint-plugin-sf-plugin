/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { encourageAliasDeprecation } from '../../../src/rules/migration/encourage-alias-deprecation';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('encourageAliasDeprecation', encourageAliasDeprecation, {
  valid: [
    {
      name: 'alias with deprecation',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['foo'];
  public static readonly deprecateAliases = true;
}`,
    },
    {
      name: 'Not in commands dir',
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<string> {
  public static readonly aliases = ['foo'];
}`,
    },
    {
      name: 'flag alias with deprecation',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
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
      errors: [{ messageId: 'command' }],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['foo'];
}`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly deprecateAliases = true;public static readonly aliases = ['foo'];
}`,
    },
    {
      name: 'flag alias without deprecation',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'flag' }],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly flags = {
    foo: Flags.string({
      aliases: ['bar'],
    })
  }
}`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly flags = {
    foo: Flags.string({
      deprecateAliases:true,aliases: ['bar'],
    })
  }
}`,
    },
  ],
});
