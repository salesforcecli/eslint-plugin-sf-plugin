/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { noUnnecessaryAliases } from '../../src/rules/no-unnecessary-aliases';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no unnecessary aliases', noUnnecessaryAliases, {
  valid: [
    {
      name: 'aliases are not a permutation',
      filename: path.normalize('src/commands/foo/bar/baz.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['bar:baz', 'bar:qux'];
}
`,
    },

    {
      name: 'not in commands dir',
      filename: path.normalize('src/shared/foo/bar/baz.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['foo:baz:bar'];
}
`,
    },
  ],
  invalid: [
    {
      name: 'one alias is a permutation, but there is another that is not',
      errors: [
        {
          messageId: 'summary',
        },
      ],
      filename: path.normalize('src/commands/foo/bar/baz.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['bar:baz:foo', 'bar:qux'];
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = [ 'bar:qux'];
}
`,
    },
    {
      name: 'only alias is a permutation',
      errors: [
        {
          messageId: 'summary',
        },
      ],
      filename: path.normalize('src/commands/foo/bar/baz.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['bar:baz:foo'];
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  
}
`,
    },
    {
      name: 'multiple aliases are a permutation',
      errors: [
        {
          messageId: 'summary',
        },
        {
          messageId: 'summary',
        },
      ],
      filename: path.normalize('src/commands/foo/bar/baz.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['bar:baz:foo', 'baz:bar:foo'];
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = [ ];
}
`,
    },
  ],
});
