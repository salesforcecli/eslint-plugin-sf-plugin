import { Rule } from "eslint";
import { isFlag } from "../shared/flags";
export function extractMessage(context: Rule.RuleContext): Rule.RuleListener {
  return {
    Property(node) {
      if (node.type === 'Property' && node.key.type === 'Identifier' && (node.key.name === 'summary' || node.key.name === 'description') && context.getAncestors().some( a => isFlag(a))) {
        if (node.value.type === 'Literal') {
          context.report({
            node,
            message: `Summary/Description property should use messages.getMessage instead of hardcoding the message.  See https://github.com/forcedotcom/sfdx-core/blob/v3/MIGRATING_V2-V3.md#messages`
          });
        }

      }

    }
  }
}
