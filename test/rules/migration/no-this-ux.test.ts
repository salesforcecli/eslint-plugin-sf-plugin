/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noThisUx } from '../../../src/rules/migration/no-this-ux';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noThisUx', noThisUx, {
  valid: [
    {
      name: 'Custom Type',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public async run(): Promise<ScratchCreateResponse> {
    this.log('hi')
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
  public async run(): Promise<string> {
    this.ux.log('hi')
  }
}

`,
    },
  ],
  invalid: [
    {
      name: 'basic this.ux.something',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }, { messageId: 'message' }],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    this.ux.log('ui');
    this.ux.table(stuff)
  }
}
`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    this.log('ui');
    this.table(stuff)
  }
}
`,
    },
    {
      name: 'spinners',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'spinner' }, { messageId: 'spinner' }],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Bar> {
  public async run(): Promise<Bar> {
    this.ux.startSpinner('go');
    this.ux.stopSpinner('done!');
  }
}`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Bar> {
  public async run(): Promise<Bar> {
    this.spinner.start('go');
    this.spinner.stop('done!');
  }
}`,
    },
    {
      name: 'styled json',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message' }],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Bar> {
  public async run(): Promise<Bar> {
    this.ux.logJson('blah');
  }
}`,
      output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Bar> {
  public async run(): Promise<Bar> {
    this.styledJSON('blah');
  }
}`,
    },
  ],
});
