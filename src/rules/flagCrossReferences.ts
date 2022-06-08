import { Rule } from "eslint";
import { isFlag, isFlagsStaticProperty } from "../shared/flags";

// properties that reference other flags by name
const propertyNames = ['dependsOn', 'exactlyOne', 'exclusive'];

export function flagCrossReferences(context: Rule.RuleContext): Rule.RuleListener {
  return {
    Property(node) {
      if (node.key.type === 'Identifier' && node.value.type === 'ArrayExpression' && node.value.elements.every(e => e.type === 'Literal' && e.raw) && propertyNames.includes(node.key.name) && context.getAncestors().some(a => isFlag(a))) {
        const flagsNode = context.getAncestors().find(a => isFlagsStaticProperty(a));

        const arrayValues = node.value.elements.map(e => e.type === 'Literal' ? e.value : undefined).filter(Boolean);

        if (flagsNode.type === 'PropertyDefinition' && flagsNode.key.type === 'Identifier' && flagsNode.value.type === 'ObjectExpression') {
          // get the names of all the flags as an array
          const flagNames = flagsNode.value.properties.map((flagProp) => {
            if (flagProp.type === 'Property') {
              if (flagProp.key.type === 'Identifier') {
                return flagProp.key.name
              } else if (
                flagProp.key.type === 'Literal') {
                return flagProp.key.value;
              }
            }
          })

          // for each of the _Literal_ values in the dependOn/exactlyOne/exclusive array
          arrayValues.forEach(value => {
            if (!flagNames.includes(value)) {
              context.report({
                node,
                message: `There is no flag named '${value}'`
              });
            }
          })

        }
      }
    }
  }
}
