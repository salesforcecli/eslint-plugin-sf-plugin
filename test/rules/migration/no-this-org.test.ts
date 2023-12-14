/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noThisOrg } from '../../../src/rules/migration/no-this-org';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noThisOrg', noThisOrg, {
  valid: [
    {
      name: 'org from flags',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    'target-org': Flags.requiredOrgFlag(),
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch)
    console.log(flags['target-org'])
  }
}
`,
    },
    {
      name: 'top-level org prop',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  private org: Org
  public static flags = {
    'target-org': Flags.requiredOrgFlag(),
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch);
    this.org = flags['target-org'];
    console.log(this.org);
  }
}
`,
    },
  ],
  invalid: [
    {
      name: 'has org property, needs to set this.org',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'setThisOrg' }],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  private org: Org;
  public static flags = {
    'target-org': Flags.requiredOrgFlag(),
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch);
    console.log(this.org);
  }
}
`,
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  private org: Org;
  public static flags = {
    'target-org': Flags.requiredOrgFlag(),
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch);this.org = flags['target-org'];
    console.log(this.org);
  }
}
`,
    },
    {
      name: 'has no org property, offer suggestions',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'noThisOrg',
          suggestions: [
            {
              messageId: 'useFlags',
              output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    'target-org': Flags.requiredOrgFlag(),
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch);
    console.log(flags['target-org']);
  }
}
`,
            },
            {
              messageId: 'instanceProp',
              output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    'target-org': Flags.requiredOrgFlag(),
  }
  private org: Org;
public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch);
    console.log(this.org);
  }
}
`,
            },
          ],
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    'target-org': Flags.requiredOrgFlag(),
  }
  public async run(): Promise<ScratchCreateResponse> {
    const {flags} = await this.parse(EnvCreateScratch);
    console.log(this.org);
  }
}
`,
      output: null,
    },
    //     {
    //       name: 'uses this.flags in run (autofix)',
    //       filename: path.normalize('src/commands/foo.ts'),
    //       errors: [{ messageId: 'noThisFlags' }],
    //       code: `
    // export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
    //   public static flags = {
    //     foo: flags.string({ char: 'f', description: 'foo flag' }),
    //   }
    //   public async run(): Promise<ScratchCreateResponse> {
    //     const {flags} = await this.parse(EnvCreateScratch)
    //     console.log(this.flags.foo)
    //   }
    // }
    // `,
    //       output: `
    // export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
    //   public static flags = {
    //     foo: flags.string({ char: 'f', description: 'foo flag' }),
    //   }
    //   public async run(): Promise<ScratchCreateResponse> {
    //     const {flags} = await this.parse(EnvCreateScratch)
    //     console.log(flags.foo)
    //   }
    // }
    // `,
    //     },
  ],
});
