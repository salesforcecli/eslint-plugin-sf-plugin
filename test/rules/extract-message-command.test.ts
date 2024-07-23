/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { extractMessageCommand } from '../../src/rules/extract-message-command';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no hardcoded summary/description on command', extractMessageCommand, {
  valid: [
    {
      name: 'messages for command description and summary',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly description = messages.getMessage('description');
  public static readonly summary = messages.getMessage('summary');
}
`,
    },
    {
      name: 'messages for command description',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
 public static readonly description = messages.getMessage('description');
}
`,
    },
    {
      name: 'messages for command summary',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
   public static readonly summary = messages.getMessage('summary');
}
`,
    },
    {
      name: 'not an sf command',
      filename: path.normalize('src/foo.ts'),
      code: `
export default class EnvCreateScratch extends SomethingElse<ScratchCreateResponse> {
  public static readonly description = 'foo';
  public static readonly summary = 'bar';
}
`,
    },
    {
      name: 'not in the commands folder',
      filename: path.normalize('src/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly description = 'foo';
  public static readonly summary = 'bar';
}
`,
    },
  ],
  invalid: [
    {
      name: 'summary uses messages but description does not',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'message',
        },
      ],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
 public static readonly description = 'foo';
 public static readonly summary = messages.getMessage('summary');
}
`,
    },
    {
      name: '2 errors when neither uses messages',
      errors: [
        {
          messageId: 'message',
        },
        {
          messageId: 'message',
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),

      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
 public static readonly description = 'foo';
 public static readonly summary = 'bar';
}
`,
    },
  ],
});
