/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noUsernameProperties } from '../../../src/rules/migration/no-username-properties';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noUsernameProperties', noUsernameProperties, {
  valid: [
    {
      name: 'sf flags',
      filename: path.normalize('src/commands/foo.ts'),
      code: `
import { SfCommand, Flags, requiredOrgFlagWithDeprecations } from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<ScratchCreateResponse> {
  public static readonly flags = {
    'target-org': Flags.requiredOrgFlag(),
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
  public static readonly requiresUsername = true;
}

`,
    },
  ],
  invalid: [
    {
      name: 'requiresUsername',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'requires' }, { messageId: 'requires' }],
      code: `
import {Flags, SfCommand} from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
    public static readonly requiresUsername = true;
    public static readonly flags = {
      foo: Flags.boolean(),
    }
}`,
      output: `
import {Flags, SfCommand, requiredOrgFlagWithDeprecations} from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
    public static readonly requiresUsername = true;
    public static readonly flags = {'target-org': requiredOrgFlagWithDeprecations,
      foo: Flags.boolean(),
    }
}`,
    },
    {
      name: 'requiresUsername removal',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'requires' }],
      output: `
import {Flags, SfCommand, requiredOrgFlagWithDeprecations} from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
    
    public static readonly flags = {'target-org': requiredOrgFlagWithDeprecations,
      foo: Flags.boolean(),
    }
}`,
      code: `
import {Flags, SfCommand, requiredOrgFlagWithDeprecations} from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
    public static readonly requiresUsername = true;
    public static readonly flags = {'target-org': requiredOrgFlagWithDeprecations,
      foo: Flags.boolean(),
    }
}`,
    },
    {
      name: 'supportsUsername',

      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'supports' }, { messageId: 'supports' }],
      code: `
import {foo} from 'bar';
import {Flags, SfCommand} from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
    public static readonly supportsUsername = true;
    public static readonly flags = {
      foo: Flags.boolean(),
    }
}`,
      output: `
import {foo} from 'bar';
import {Flags, SfCommand, optionalOrgFlagWithDeprecations} from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
    public static readonly supportsUsername = true;
    public static readonly flags = {'target-org': optionalOrgFlagWithDeprecations,
      foo: Flags.boolean(),
    }
}`,
    },
    {
      name: 'supportsUsername removal',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'supports' }],
      output: `
import {Flags, SfCommand, optionalOrgFlagWithDeprecations} from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
    
    public static readonly flags = {'target-org': optionalOrgFlagWithDeprecations,
      foo: Flags.boolean(),
    }
}`,
      code: `
import {Flags, SfCommand, optionalOrgFlagWithDeprecations} from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
    public static readonly supportsUsername = true;
    public static readonly flags = {'target-org': optionalOrgFlagWithDeprecations,
      foo: Flags.boolean(),
    }
}`,
    },
    {
      name: 'hub (requiresDevhubUsername)',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'requiresHub' }, { messageId: 'requiresHub' }],
      code: `
import {Flags, SfCommand} from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
    public static readonly requiresDevhubUsername = true;
    public static readonly flags = {
      foo: Flags.boolean(),
    }
}`,
      output: `
import {Flags, SfCommand, requiredHubFlagWithDeprecations} from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
    public static readonly requiresDevhubUsername = true;
    public static readonly flags = {'target-dev-hub': requiredHubFlagWithDeprecations,
      foo: Flags.boolean(),
    }
}`,
    },
    {
      name: 'hub (requiresDevhubUsername) removal',
      filename: path.normalize('src/commands/foo.ts'),
      errors: [{ messageId: 'requiresHub' }],
      output: `
import {Flags, SfCommand, requiredHubFlagWithDeprecations} from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
    
    public static readonly flags = {'target-dev-hub': requiredHubFlagWithDeprecations,
      foo: Flags.boolean(),
    }
}`,
      code: `
import {Flags, SfCommand, requiredHubFlagWithDeprecations} from '@salesforce/sf-plugins-core';
import {SfCommand} from '@salesforce/sf-plugins-core';
export default class EnvCreateScratch extends SfCommand<Foo> {
    public static readonly requiresDevhubUsername = true;
    public static readonly flags = {'target-dev-hub': requiredHubFlagWithDeprecations,
      foo: Flags.boolean(),
    }
}`,
    },
  ],
});
