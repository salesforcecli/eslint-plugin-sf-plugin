/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import { ESLintUtils } from '@typescript-eslint/utils';
import { noMessagesLoad } from '../../src/rules/no-messages-load';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('noMessagesLoad', noMessagesLoad, {
  valid: [
    {
      name: 'messages.loadMessages',
      code: "const messages = Messages.loadMessages('foo', 'bar')",
    },
  ],
  invalid: [
    {
      name: 'messages.load',
      errors: [
        {
          messageId: 'message',
        },
      ],
      code: "const messages = Messages.load('foo', 'bar', ['a', 'b'])",
      output: "const messages = Messages.loadMessages('foo', 'bar')",
    },
  ],
});
