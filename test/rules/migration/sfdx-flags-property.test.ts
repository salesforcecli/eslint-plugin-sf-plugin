/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { sfdxFlagsProperty } from '../../../src/rules/migration/sfdx-flags-property';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('sfdxFlagsProperty', sfdxFlagsProperty, {
  valid: [
    {
      name: 'sf flags',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
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
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<string> {
  public static flagsConfig: FlagsConfig = {
    foo: flags.boolean()
  }
}

`,
    },
  ],
  invalid: [
    // 1 fixer for the flagsConfig => flags prop
    {
      name: 'sfdx style flagsConfig',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'flagsConfig' }, { messageId: 'flagsConfigType' }],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flagsConfig: FlagsConfig = {
    foo: flags.boolean()
  }
}
`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags: FlagsConfig = {
    foo: flags.boolean()
  }
}
`,
    },
    // next fixer to remove the FlagsConfig type
    {
      name: 'sfdx style flagsConfig',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'flagsConfigType' }],
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    foo: flags.boolean()
  }
}
`,
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags: FlagsConfig = {
    foo: flags.boolean()
  }
}
`,
    },
  ],
});
