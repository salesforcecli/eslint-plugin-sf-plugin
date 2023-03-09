/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { noClassesInCommandReturnType } from '../../src/rules/no-classes-in-command-return-type';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: path.join(path.join(__dirname, '..')),
  },
});

ruleTester.run('noClassesInCommandReturnType', noClassesInCommandReturnType, {
  valid: [
    {
      name: 'return a type',
      code: `
export type FooReturn = { foo: string }
export default class EnvCreateScratch extends SfCommand<FooReturn> {
  public async run(): Promise<FooReturn> {
    return {foo: 'bar'}
  }
}
`,
    },
    {
      name: 'return an interface',
      code: `
export interface FooReturn { foo: string }
export default class EnvCreateScratch extends SfCommand<FooReturn> {
  public async run(): Promise<FooReturn> {
    return {foo: 'bar'}
  }
}
`,
    },
  ],
  invalid: [
    {
      name: 'return a class',
      errors: [{ messageId: 'summary' }],
      code: `
export class FooReturn {}
export default class EnvCreateScratch extends SfCommand<FooReturn> {
  public async run(): Promise<FooReturn> {
    return new Foo();
  }
}
`,
      output: null,
    },
    {
      name: 'return a class inside an interface',
      errors: [{ messageId: 'summary' }],
      code: `
export class FooClass {}
export interface FooReturn {
  foo: FooClass
}
export default class EnvCreateScratch extends SfCommand<FooReturn> {
  public async run(): Promise<FooReturn> {
    return {
      foo: new FooClass()
    };
  }
}
`,
      output: null,
    },
    {
      name: 'return a class inside an type',
      errors: [{ messageId: 'summary' }],
      code: `
export class FooClass {}
export type FooReturn = {
  foo: FooClass
}
export default class EnvCreateScratch extends SfCommand<FooReturn> {
  public async run(): Promise<FooReturn> {
    return {
      foo: new FooClass()
    };
  }
}
`,
      output: null,
    },
    {
      name: 'return an imported class',
      errors: [{ messageId: 'summary' }],
      code: `
import { Messages } from '@salesforce/core';
export type FooReturn = {
  foo: Messages
}
export default class EnvCreateScratch extends SfCommand<FooReturn> {
  public async run(): Promise<FooReturn> {
    return {
      foo: new Messages()
    };
  }
}
`,
      output: null,
    },
  ],
});
