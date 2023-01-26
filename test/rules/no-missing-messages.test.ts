/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import path from 'path';
import { ESLintUtils } from '@typescript-eslint/utils';
import { noMissingMessages } from '../../src/rules/no-missing-messages';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: path.join(path.join(__dirname, '..')),
  },
});

const fileKey = 'test';

ruleTester.run('noMissingMessages', noMissingMessages, {
  valid: [
    {
      name: 'correct examples with getMessage',
      code: `
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('eslint-plugin-sf-plugin', 'test');
console.log(messages.getMessage('basic'));
console.log(messages.getMessages('array'));
console.log(messages.getMessage('basic2Placeholders', ['foo', 'bar']));
console.log(messages.getMessages('arrayWith3Placeholders', ['a', 'b', 'c']));
console.log(messages.getMessages('nested.something'));
`,
    },
    {
      name: 'placeholders can be a reference',
      code: `
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('eslint-plugin-sf-plugin', 'test');
const tokens = ['foo', 'bar']
console.log(messages.getMessage('basic2Placeholders', tokens));
`,
    },
    {
      name: 'creating an error with just a key',
      code: `
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('eslint-plugin-sf-plugin', 'test');
console.log(messages.createError('eName'));
console.log(messages.createError('eWith3Placeholders', ['a', 'b', 'c']));
`,
    },
    {
      name: 'error with Actions',
      code: `
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('eslint-plugin-sf-plugin', 'test');
console.log(messages.createError('eWithActionsHaving4Placeholders', undefined, ['a', 'b', 'c', 'd']));
`,
    },
    {
      name: 'info with Actions',
      code: `
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('eslint-plugin-sf-plugin', 'test');
console.log(messages.createInfo('iName'));
console.log(messages.createInfo('iWithActions', undefined, ['a']));
`,
    },
  ],
  invalid: [
    {
      name: 'message has placeholders but no tokens are passed',
      errors: [
        {
          messageId: 'placeholders',
          data: { placeholderCount: 2, argumentCount: 0, fileKey, messageKey: 'basic2Placeholders' },
        },
        {
          messageId: 'placeholders',
          data: { placeholderCount: 2, argumentCount: 0, fileKey, messageKey: 'basic2Placeholders' },
        },
      ],
      code: `
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('eslint-plugin-sf-plugin', 'test');
console.log(messages.getMessage('basic2Placeholders'));
console.log(messages.getMessage('basic2Placeholders', []));
`,
    },
    {
      name: 'message has placeholders wrong number of tokens are passed',
      errors: [
        {
          messageId: 'placeholders',
          data: { placeholderCount: 2, argumentCount: 1, fileKey, messageKey: 'basic2Placeholders' },
        },
        {
          messageId: 'placeholders',
          data: { placeholderCount: 2, argumentCount: 3, fileKey, messageKey: 'basic2Placeholders' },
        },
      ],
      code: `
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('eslint-plugin-sf-plugin', 'test');
console.log(messages.getMessage('basic2Placeholders', ['a']));
console.log(messages.getMessage('basic2Placeholders', ['a', 'b', 'c']));
`,
    },
    {
      name: 'messages with wrong number of placeholders',
      errors: [
        {
          messageId: 'placeholders',
          data: { placeholderCount: 3, argumentCount: 1, fileKey, messageKey: 'arrayWith3Placeholders' },
        },
        {
          messageId: 'placeholders',
          data: { placeholderCount: 3, argumentCount: 2, fileKey, messageKey: 'arrayWith3Placeholders' },
        },
      ],
      code: `
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('eslint-plugin-sf-plugin', 'test');
console.log(messages.getMessages('arrayWith3Placeholders', ['a']));
console.log(messages.getMessages('arrayWith3Placeholders', ['a', 'b', ]));
`,
    },
    {
      name: 'messages with wrong number of placeholders as variable',
      errors: [
        {
          messageId: 'placeholders',
          data: { placeholderCount: 3, argumentCount: 1, fileKey, messageKey: 'arrayWith3Placeholders' },
        },
        {
          messageId: 'placeholders',
          data: { placeholderCount: 3, argumentCount: 2, fileKey, messageKey: 'arrayWith3Placeholders' },
        },
      ],
      code: `
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('eslint-plugin-sf-plugin', 'test');
const oneToken = ['a'];
const twoTokens = ['a', 'b'];
console.log(messages.getMessages('arrayWith3Placeholders', oneToken));
console.log(messages.getMessages('arrayWith3Placeholders', twoTokens));
`,
    },
    {
      name: 'error with actions with wrong number of placeholders',
      errors: [
        {
          messageId: 'actionPlaceholders',
          data: { placeholderCount: 4, argumentCount: 1, fileKey, messageKey: 'eWithActionsHaving4Placeholders' },
        },
        {
          messageId: 'actionPlaceholders',
          data: { placeholderCount: 4, argumentCount: 3, fileKey, messageKey: 'eWithActionsHaving4Placeholders' },
        },
        {
          messageId: 'actionPlaceholders',
          data: { placeholderCount: 4, argumentCount: 0, fileKey, messageKey: 'eWithActionsHaving4Placeholders' },
        },
      ],
      code: `
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('eslint-plugin-sf-plugin', 'test');
console.log(messages.createError('eWithActionsHaving4Placeholders', undefined, ['a']));
console.log(messages.createError('eWithActionsHaving4Placeholders', undefined, ['a', 'b', 'c']));
console.log(messages.createError('eWithActionsHaving4Placeholders'));
`,
    },
    {
      name: 'createInfo missing message',
      errors: [
        {
          messageId: 'missing',
          data: { fileKey, messageKey: 'foo' },
        },
      ],
      code: `
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('eslint-plugin-sf-plugin', 'test');
console.log(messages.createInfo('foo', undefined, ['a']));
`,
    },
    {
      name: 'createInfo wrong tokens',
      errors: [
        {
          messageId: 'placeholders',
          data: { fileKey, messageKey: 'iName', placeholderCount: 0, argumentCount: 1 },
        },
        {
          messageId: 'actionPlaceholders',
          data: { fileKey, messageKey: 'iWithActions', placeholderCount: 1, argumentCount: 2 },
        },
      ],
      code: `
import { Messages } from '@salesforce/core';
Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('eslint-plugin-sf-plugin', 'test');
console.log(messages.createInfo('iName', ['a']));
console.log(messages.createInfo('iWithActions', undefined, ['a', 'b']));
`,
    },
  ],
});
