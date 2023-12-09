/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { extractMessageFlags } from '../../src/rules/extract-message-flags';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('summary/description messages format', extractMessageFlags, {
  valid: [
    {
      name: 'no messages',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      char: 'a'
    }),
  }
}
`,
    },
    {
      name: 'summary uses messages',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: messages.getMessage('flags.alias.summary')
    }),
  }
}
`,
    },
    {
      name: 'summary and description use messages',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: messages.getMessage('flags.alias.summary'),
      description: messages.getMessage('flags.alias.description')
    }),
  }
}
`,
    },
    {
      name: 'description uses messages',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      description: messages.getMessage('flags.alias.description')
    }),
  }
}
`,
    },
    {
      name: 'flag with a hyphen',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    'hyphen-flag': Flags.string({
      description: messages.getMessage('flags.hyphen-flag.description')
    }),
  }
}
`,
    },
    {
      name: 'not in commands dir',
      filename: path.normalize('src/foo.ts'),
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      description: 'foo',
      summary: 'foo'
    }),
  }
}
`,
    },
  ],
  invalid: [
    {
      name: 'hardcoded summary',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'message',
        },
      ],
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: "hardcode"
    }),
  }
}
`,
      output: null,
    },
    {
      name: 'hardcoded description',
      errors: [
        {
          messageId: 'message',
        },
      ],
      filename: path.normalize('src/commands/foo.ts'),
      output: null,

      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      description: "hardcode"
    }),
  }
}
`,
    },
    {
      name: '2 errors when both are hardcoded',
      output: null,

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
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      summary: "hardcode",
      description: "hardcode, too"
    }),
  }
}
`,
    },
    {
      name: 'wrong summary name',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'summaryFormat',
          data: { name: 'name' },
        },
      ],
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    name: Flags.string({
      summary: messages.getMessage('flags.name.summary'),
    }),
  }
}
`,
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    name: Flags.string({
      summary: messages.getMessage('flags.name'),
    }),
  }
}
`,
    },
    {
      name: 'description flag naming',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'descriptionFormat',
          data: { name: 'alias' },
        },
      ],
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      description: messages.getMessage('flags.alias.description')
    }),
  }
}
`,
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    alias: Flags.string({
      description: messages.getMessage('flags.name.desc')
    }),
  }
}
`,
    },
    {
      name: 'description flag naming with a hyphen',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'descriptionFormat',
          data: { name: 'hyphen-flag' },
        },
      ],
      output: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    'hyphen-flag': Flags.string({
      description: messages.getMessage('flags.hyphen-flag.description')
    }),
  }
}
`,
      code: `
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    'hyphen-flag': Flags.string({
      description: messages.getMessage('flags.hyphenFlag.desc')
    }),
  }
}
`,
    },
  ],
});
