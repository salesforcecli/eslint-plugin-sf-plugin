import { Rule } from "eslint";
import { getFlagName, isFlag } from "../shared/flags";

export function flagCasing(context: Rule.RuleContext): Rule.RuleListener {
  return {
    Property(node) {
      if (isFlag(node)) {
        const flagName = getFlagName(node);
        if (flagName.toLowerCase() !== flagName) {
          context.report({
            node,
            message: `Flag '${flagName}' should be lowercase (use kebab-case to separate words)`
          });
        }

      }
    }
  }
}
