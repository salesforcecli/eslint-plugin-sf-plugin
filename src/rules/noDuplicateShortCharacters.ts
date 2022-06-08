import { Rule } from "eslint";
import { isFlagsStaticProperty } from "../shared/flags";
export function noDuplicateShortCharacters(context: Rule.RuleContext): Rule.RuleListener {
  return {
    PropertyDefinition(node) {
      // is "public static flags" property
      if (isFlagsStaticProperty(node)) {
        const charFlagMap = new Map();
        node.value.properties.forEach((flag) => {
            // only if it has a char prop
            if ( flag.value.arguments?.[0]?.properties.some((p) => p.key.name === "char") ) {
              const char = flag.value.arguments[0].properties.find((p) => p.key.name === "char").value.raw;
              const flagName = flag.key.name ?? flag.key.value;
              if (!charFlagMap.has(char)) {
                charFlagMap.set(char, flagName);
              } else {
                context.report({
                  node,
                  message: `Flag '${flagName}' and '${charFlagMap.get(char)}' share duplicate character ${char}`
                });
              }
            }
          });
      }
    }
  }
}
