/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
/* eslint-disable complexity */

import { ASTUtils, AST_NODE_TYPES, ESLintUtils, ParserServices, TSESTree } from '@typescript-eslint/utils';
import { Messages, SfError, StructuredMessage } from '@salesforce/core';
import * as ts from 'typescript';

const methods = ['createError', 'createWarning', 'createInfo', 'getMessage', 'getMessages'] as const;

export const noMissingMessages = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    docs: {
      description: 'Checks core Messages usage for correct usage of named messages and message tokens',
      recommended: 'error',
    },
    messages: {
      missing: 'the message "{{messageKey}}" does not exist in the messages file {{fileKey}}',
      placeholders:
        'the message "{{messageKey}}" in the messages file {{fileKey}} expects {{placeholderCount}} token(s) but received {{argumentCount}}',
      actionPlaceholders:
        'the actions for message "{{messageKey}}" in the messages file {{fileKey}} expects {{placeholderCount}} tokens(s) but received {{argumentCount}}',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    Messages.importMessagesDirectory(process.cwd());

    const loadedMessages = new Map<string, Messages<string>>();
    const loadedMessageBundles = new Map<string, string>();
    const parserServices = ESLintUtils.getParserServices(context);

    return {
      // load any messages, by const name, that are loaded in the file
      VariableDeclarator(node): void {
        if (
          node.init &&
          node.id.type === AST_NODE_TYPES.Identifier &&
          node.init.type === AST_NODE_TYPES.CallExpression &&
          node.init.callee.type === AST_NODE_TYPES.MemberExpression &&
          node.init.callee.object.type === AST_NODE_TYPES.Identifier &&
          node.init.callee.object.name === 'Messages' &&
          node.init.callee.property.type === AST_NODE_TYPES.Identifier &&
          node.init.callee.property.name.startsWith('load') &&
          node.init.arguments[0].type === AST_NODE_TYPES.Literal &&
          typeof node.init.arguments[0].value === 'string' &&
          node.init.arguments[1].type === AST_NODE_TYPES.Literal &&
          typeof node.init.arguments[1].value === 'string'
        ) {
          loadedMessages.set(
            node.id.name,
            Messages.loadMessages(node.init.arguments[0].value, node.init.arguments[1].value)
          );
          loadedMessageBundles.set(node.id.name, node.init.arguments[1].value);
        }
      },
      CallExpression(node): void {
        if (
          // we don't both if we never loaded any messages
          loadedMessages.size &&
          node.callee.type === AST_NODE_TYPES.MemberExpression &&
          node.callee.object.type === AST_NODE_TYPES.Identifier &&
          loadedMessages.has(node.callee.object.name) &&
          node.callee.property.type === AST_NODE_TYPES.Identifier &&
          // the key needs to be a string so we can look it up
          node.arguments[0].type === AST_NODE_TYPES.Literal &&
          typeof node.arguments[0].value === 'string' &&
          isMessagesMethod(node.callee.property.name)
        ) {
          const bundleConstant = node.callee.object.name;
          const messageKey = node.arguments[0].value;
          const fileKey = loadedMessageBundles.get(bundleConstant);
          const messageTokensCount = getTokensCount(parserServices, node.arguments[1]);
          const actionTokensCount = getTokensCount(parserServices, node.arguments[2]);
          let result: StructuredMessage | SfError | string | string[];
          try {
            // execute some method on Messages so we can inspect the result
            // we are intentionally passing it no tokens so that we can see residual %s etc in the text
            result = loadedMessages.get(bundleConstant)[node.callee.property.name](messageKey);
          } catch (e) {
            // we never found the message at all, we can report and exit
            return context.report({
              node: node.arguments[0],
              messageId: 'missing',
              data: {
                messageKey,
                fileKey,
              },
            });
          }
          const resolvedMessage = getMessage(result);
          const messagePlaceholderCount = getPlaceholderCount(resolvedMessage);
          if (typeof messageTokensCount === 'number' && messagePlaceholderCount !== messageTokensCount) {
            context.report({
              // if there's not a second argument, we can report on the first
              node: node.arguments[1] ?? node.arguments[0],
              messageId: 'placeholders',
              data: {
                placeholderCount: messagePlaceholderCount,
                argumentCount: messageTokensCount,
                fileKey,
                messageKey,
              },
            });
          }
          // it's an SfError or a StructuredMessage, check the actions
          if (typeof actionTokensCount === 'number' && typeof result !== 'string' && !Array.isArray(result)) {
            const actionPlaceholderCount = getPlaceholderCount(result.actions ?? []);
            if (actionPlaceholderCount !== actionTokensCount) {
              context.report({
                node: node.arguments[2] ?? node.arguments[0],
                messageId: 'actionPlaceholders',
                data: {
                  placeholderCount: actionPlaceholderCount,
                  argumentCount: actionTokensCount,
                  fileKey,
                  messageKey,
                },
              });
            }
          }
        }
      },
    };
  },
});

// util.format placeholders https://nodejs.org/api/util.html#utilformatformat-args
const placeHolderersRegex = new RegExp(/(%s)|(%d)|(%i)|(%f)|(%j)|(%o)|(%O)|(%c)/g);

const isMessagesMethod = (method: string): method is (typeof methods)[number] =>
  methods.includes(method as (typeof methods)[number]);

const getTokensCount = (parserServices: ParserServices, node?: TSESTree.Node): number | undefined => {
  if (!node) {
    return 0;
  }
  if (ASTUtils.isNodeOfType(AST_NODE_TYPES.ArrayExpression)(node)) {
    return node.elements.length ?? 0;
  }
  const realNode = parserServices.esTreeNodeToTSNodeMap.get(node);
  const checker = parserServices.program.getTypeChecker();

  const underlyingNode = checker.getSymbolAtLocation(realNode)?.getDeclarations()?.[0];
  // the literal value might not be an array, but it might a reference to an array
  if (
    underlyingNode &&
    ts.isVariableDeclaration(underlyingNode) &&
    ts.isArrayLiteralExpression(underlyingNode.initializer)
  ) {
    return underlyingNode.initializer.elements.length;
  }

  return;
};

const getMessage = (result: string | string[] | SfError | StructuredMessage): string | string[] => {
  if (typeof result === 'string') {
    return result;
  }
  if (Array.isArray(result)) {
    return result;
  }
  if ('message' in result) {
    return result.message;
  }
};

const getPlaceholderCount = (message: string | string[]): number => {
  if (typeof message === 'string') {
    return (message.match(placeHolderersRegex) || []).length;
  }

  return message.reduce((count, m) => count + (m.match(placeHolderersRegex) || []).length, 0);
};
