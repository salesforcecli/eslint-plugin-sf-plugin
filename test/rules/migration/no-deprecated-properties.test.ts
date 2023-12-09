/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noDeprecatedProperties } from '../../../src/rules/migration/no-deprecated-properties';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noDeprecatedProperties', noDeprecatedProperties, {
  valid: [
    {
      name: 'sf flags',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly flags = {
        foo: Flags.boolean()
  }
}

`,
    },
    {
      name: 'Not in commands dir',
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<string> {
  public static readonly args = true;
}

`,
    },
  ],
  invalid: [
    //
    {
      name: 'varargs',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'property', data: { property: 'varargs' } }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static readonly varargs = 'foo';
  public static ok = true;
}`,
      output: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  
  public static ok = true;
}`,
    },
    {
      name: 'all the invalid things',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        { messageId: 'property', data: { property: 'varargs' } },
        { messageId: 'property', data: { property: 'supportsDevhubUsername' } },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static readonly varargs = true;
  public static readonly supportsDevhubUsername = true;
  public static readonly requiresProject = true;
}`,
      output: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  
  
  public static readonly requiresProject = true;
}`,
    },
  ],
});
