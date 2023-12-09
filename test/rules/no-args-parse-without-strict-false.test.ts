/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noArgsParseWithoutStrictFalse } from '../../src/rules/no-args-parse-without-strict-false';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noArgsParseWithoutStrictFalse', noArgsParseWithoutStrictFalse, {
  valid: [
    {
      name: 'Parses as expected',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly strict = false;
  public async run(): Promise<ScratchCreateResponse> {
    const {flags, args, argv} = await this.parse(EnvCreateScratch);
  }
}
`,
    },
    {
      name: 'No args parsed',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch);
  }
}
    `,
    },
    {
      name: 'Not in commands dir',
      filename: path.normalize('foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public async run(): Promise<ScratchCreateResponse> {
    const {flags, args, argv} = await this.parse(EnvCreateScratch);
  }
}
`,
    },
    {
      name: 'Not sf command dir',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SomethingElse<ScratchCreateResponse> {
  public async run(): Promise<ScratchCreateResponse> {
    const {flags, args, argv} = await this.parse(EnvCreateScratch);
  }
}
`,
    },
  ],
  invalid: [
    {
      name: 'parses args/var without strict=false',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'summary' }],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public async run(): Promise<ScratchCreateResponse> {
    const {flags, args, argv} = await this.parse(EnvCreateScratch);
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly strict = false;public async run(): Promise<ScratchCreateResponse> {
    const {flags, args, argv} = await this.parse(EnvCreateScratch);
  }
}
`,
    },
    {
      name: 'parses args/var and strict=true',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'summary' }],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly strict = true;
  public async run(): Promise<ScratchCreateResponse> {
    const {flags, args, argv} = await this.parse(EnvCreateScratch);
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly strict = false;
  public async run(): Promise<ScratchCreateResponse> {
    const {flags, args, argv} = await this.parse(EnvCreateScratch);
  }
}
`,
    },
  ],
});
