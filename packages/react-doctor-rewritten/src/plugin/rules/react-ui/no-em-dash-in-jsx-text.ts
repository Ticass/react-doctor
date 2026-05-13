import { EM_DASH_CHARACTER } from "../../constants.js";
import { defineRule } from "../../utils/define-rule.js";
import type { EsTreeNode } from "../../utils/es-tree-node.js";
import type { Rule } from "../../utils/rule.js";
import type { RuleContext } from "../../utils/rule-context.js";
import { isInsideExcludedAncestor } from "./utils/is-inside-excluded-ancestor.js";

export const noEmDashInJsxText = defineRule<Rule>({
  create: (context: RuleContext) => ({
    JSXText(jsxTextNode: EsTreeNode) {
      const textValue = typeof jsxTextNode.value === "string" ? jsxTextNode.value : "";
      if (!textValue.includes(EM_DASH_CHARACTER)) return;
      if (isInsideExcludedAncestor(jsxTextNode)) return;
      context.report({
        node: jsxTextNode,
        message:
          "Em dash (—) in JSX text reads as model output — replace with comma, colon, semicolon, or parentheses",
      });
    },
  }),
});
