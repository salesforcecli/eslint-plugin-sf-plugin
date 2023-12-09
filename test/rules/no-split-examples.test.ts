/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noSplitExamples } from '../../src/rules/no-split-examples';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noSplitExamples', noSplitExamples, {
  valid: [
    {
      name: 'correct examples with getMessages',
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly examples = messages.getMessages('examples')
}
`,
    },
    {
      name: 'not an sf command',
      code: `
export default class EnvCreateScratch extends somethingElse<ScratchCreateResponse> {
  public static readonly examples = message.getMessage('examples').split(EOL)
}
`,
    },
    {
      name: 'not in the commands folder',
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly examples = message.getMessage('examples').split(EOL)
}
`,
    },
  ],
  invalid: [
    {
      name: 'getMessages with split',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'message',
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly examples = message.getMessage('examples').split(EOL);
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly examples = message.getMessages('examples');
}
`,
    },
  ],
});
