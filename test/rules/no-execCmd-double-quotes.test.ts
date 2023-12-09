/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { RuleTester } from '@typescript-eslint/rule-tester';

import { noExecCmdDoubleQuotes } from '../../src/rules/no-execCmd-double-quotes';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('call getConnection with version', noExecCmdDoubleQuotes, {
  valid: [
    {
      name: 'single quotes in literal',
      code: 'execCmd("foo bar \'arg with space\'")',
    },

    {
      name: 'single quotes in template literal',
      code: "execCmd(`foo bar 'arg with space' ${templateProp}`)",
    },
  ],
  invalid: [
    {
      name: 'doublequotes in a string literal',
      errors: [
        {
          messageId: 'message',
        },
      ],
      code: 'execCmd(\'foo bar "arg with space"\')',
    },
    {
      name: 'doublequotes in a template literal',
      errors: [
        {
          messageId: 'message',
        },
      ],
      code: 'execCmd(`foo bar "arg with space" ${templateProp}`)',
    },
  ],
});
