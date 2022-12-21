/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { noTimeFlags } from '../../../src/rules/migration/no-time-flags';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noTimeFlags', noTimeFlags, {
  valid: [
    {
      name: 'duration flag',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    wait: Flags.duration({
      char: 'w',
      unit: 'minutes',
      default: Duration.minutes(DeployCommand.DEFAULT_WAIT_MINUTES),
      min: Duration.minutes(1),
      description: messages.getMessage('flags.wait'),
      longDescription: messages.getMessage('flagsLong.wait'),
    })
  }
}
`,
    },
    {
      name: 'not in command directory',
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    wait: Flags.minutes({
      default: Duration.minutes(DeployCommand.DEFAULT_WAIT_MINUTES),
      min: Duration.minutes(1),
    }),
  }
}

`,
    },
  ],
  invalid: [
    {
      name: 'has a minutes flag',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'message', data: { time: 'minutes' } }],
      code: `
    export default class EnvCreateScratch extends SfCommand<Foo> {
      public static flags = {
        wait: Flags.minutes({
          default: Duration.minutes(DeployCommand.DEFAULT_WAIT_MINUTES),
          min: Duration.minutes(1),
          min: Duration.minutes(8),
        }),
      }
    }
    `,
      output: `
    export default class EnvCreateScratch extends SfCommand<Foo> {
      public static flags = {
        wait: Flags.duration({ unit: 'minutes',
          defaultValue: DeployCommand.DEFAULT_WAIT_MINUTES,
          min: 1,
          min: 8,
        }),
      }
    }
    `,
    },
  ],
});
