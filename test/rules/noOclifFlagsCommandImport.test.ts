/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { noOclifFlagsCommandImport } from '../../src/rules/noOclifFlagsCommandImport';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noOclifFlagsCommandImport', noOclifFlagsCommandImport, {
  valid: [
    {
      name: 'sf command import',
      filename: path.normalize('src/commands/foo.ts'),
      code: "import {Flags, SfCommand} from '@salesforce/sf-plugins-core'",
    },
    {
      name: 'other oclif imports',
      filename: path.normalize('src/commands/foo.ts'),
      code: "import {Interfaces} from '@oclif/core'",
    },
  ],
  invalid: [
    {
      name: 'import Flags and Command from @oclif/core',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'flags' }, { messageId: 'command' }],
      // it only removes one per pass.  The next round would take out the `Commands` import, too
      code: `
import {Flags,Command} from '@oclif/core';
import {Foo,Bar} from '@something';
import {Fooz,Barz} from '@something2';
`,
      output: `
import {Command} from '@oclif/core';
import {Foo,Bar} from '@something';
import {Fooz,Barz} from '@something2';
`,
    },
    {
      name: 'import Flags from @oclif/core',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'flags' }],
      code: "import {Flags,Interfaces} from '@oclif/core'",
      output: "import {Interfaces} from '@oclif/core'",
    },
    {
      name: 'import Flags from @oclif/core',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'flags' }],
      code: "import {Flags} from '@oclif/core'",
      output: "import {} from '@oclif/core'",
    },
    {
      name: 'import Command from @oclif/core',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'command' }],
      code: "import {Command} from '@oclif/core'",
      output: "import {} from '@oclif/core'",
    },
    {
      name: 'import Command from @oclif/core',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'command' }],
      code: "import {Command,Interfaces} from '@oclif/core'",
      output: "import {Interfaces} from '@oclif/core'",
    },
    {
      name: 'empty import should just be removed',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'empty' }],
      code: "import {} from '@oclif/core'",
      output: '',
    },
  ],
});
