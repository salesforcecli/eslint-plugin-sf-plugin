/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noUnnecessaryAliases } from '../../src/rules/no-unnecessary-aliases';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no unnecessary aliases', noUnnecessaryAliases, {
  valid: [
    {
      name: 'aliases are not a permutation',
      filename: path.normalize('src/commands/foo/bar/baz.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['bar:baz', 'bar:qux'];
}
`,
    },

    {
      name: 'not in commands dir',
      filename: path.normalize('src/shared/foo/bar/baz.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
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
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['bar:baz:foo', 'bar:qux'];
}
`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
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
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['bar:baz:foo'];
}
`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
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
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = ['bar:baz:foo', 'baz:bar:foo'];
}
`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly aliases = [ ];
}
`,
    },
  ],
});
