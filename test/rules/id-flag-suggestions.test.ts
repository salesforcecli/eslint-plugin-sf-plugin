/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { idFlagSuggestions } from '../../src/rules/id-flag-suggestions';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('idFlagSuggestions', idFlagSuggestions, {
  valid: [
    {
      name: 'salesforceId flag with length and startsWith',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static flags = {
    verbose: Flags.salesforceId({
      length: 15,
      startsWith: '00D',
    }),
  }
}

`,
    },
  ],
  invalid: [
    {
      name: 'neither',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'message',
          suggestions: [
            {
              messageId: 'typeSuggestion',
              output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    id: Flags.salesforceId({startsWith: '000',
    }),
  }
}
`,
            },
            {
              messageId: 'lengthSuggestionBoth',
              output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    id: Flags.salesforceId({length: 'both',
    }),
  }
}
`,
            },
            {
              messageId: 'lengthSuggestion15',
              output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    id: Flags.salesforceId({length: 15,
    }),
  }
}
`,
            },
            {
              messageId: 'lengthSuggestion18',
              output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    id: Flags.salesforceId({length: 18,
    }),
  }
}
`,
            },
          ],
        },
      ],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    id: Flags.salesforceId({
    }),
  }
}
`,
    },
    {
      name: 'only has length (uses literal)',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'message',
          suggestions: [
            {
              messageId: 'typeSuggestion',
              output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    'some-flag': Flags.salesforceId({startsWith: '000',
      length: 15,
    }),
  }
}
`,
            },
          ],
        },
      ],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    'some-flag': Flags.salesforceId({
      length: 15,
    }),
  }
}
`,
    },
    {
      name: 'only has type',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [
        {
          messageId: 'message',
          suggestions: [
            {
              messageId: 'lengthSuggestionBoth',
              output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    foo: Flags.salesforceId({length: 'both',
      startsWith: '000',
    }),
  }
}
`,
            },
            {
              messageId: 'lengthSuggestion15',
              output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    foo: Flags.salesforceId({length: 15,
      startsWith: '000',
    }),
  }
}
`,
            },
            {
              messageId: 'lengthSuggestion18',
              output: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    foo: Flags.salesforceId({length: 18,
      startsWith: '000',
    }),
  }
}
`,
            },
          ],
        },
      ],
      code: `
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
  public static flags = {
    foo: Flags.salesforceId({
      startsWith: '000',
    }),
  }
}
`,
    },
  ],
});
