/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { noFlagTypeAssertions } from '../../src/rules/no-flag-type-assertions';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('runMatchesClassType', noFlagTypeAssertions, {
  valid: [],
  invalid: [
    {
      name: 'type assertion on flags (identifier)',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'summary' }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    const foo = flags.foo as string
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    const foo = flags.foo
  }
}
`,
    },
    {
      name: 'type assertion on flags (literal)',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'summary' }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    const foo = flags['foo-bar'] as string
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    const foo = flags['foo-bar']
  }
}
`,
    },
    {
      name: 'type assertion on this.flags (identifier)',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'summary' }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    const foo = this.flags.foo as string
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    const foo = this.flags.foo
  }
}
`,
    },
    {
      name: 'type assertion on this.flags (literal)',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'summary' }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    const foo = this.flags['foo-bar'] as string
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    const foo = this.flags['foo-bar']
  }
}
`,
    },
    {
      name: 'type assertion as part of object creation',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'summary' }],
      code: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    const foo = { bar: this.flags['foo-bar'] as string}
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<Foo> {
  public async run(): Promise<Bar> {
    const foo = { bar: this.flags['foo-bar']}
  }
}
`,
    },
  ],
});
