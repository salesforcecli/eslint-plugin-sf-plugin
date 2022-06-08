export const getFlagName = (node):string => {
  switch (node.key.type) {
    case "Identifier":
      return node.key.name;
      break;
    case "Literal":
      return node.key.value as string;
      break;
    default:
      throw new Error(`Unknown flag type ${node.key.type}`);
  }
}

export const isFlag = (node): boolean => node.value?.type === 'CallExpression' && node.value?.callee?.type === 'MemberExpression' && node.value?.callee?.object?.type === 'Identifier' && node.value?.callee?.object?.name === 'Flags'

export const isFlagsStaticProperty = (node): boolean => node.key?.name === 'flags' && node.accessibility === 'public' && node.static;
