import type { EsTreeNode } from "../../../utils/es-tree-node.js";
import type { RuleContext } from "../../../utils/rule-context.js";
import type { Rule } from "../../../utils/rule.js";
import type { DeprecatedReactImportRuleOptions } from "./deprecated-react-import-rule-options.js";

export const createDeprecatedReactImportRule = ({
  source,
  messages,
  handleExtraSource,
}: DeprecatedReactImportRuleOptions): Rule => ({
  create: (context: RuleContext) => {
    const namespaceBindings = new Set<string>();

    return {
      ImportDeclaration(node: EsTreeNode) {
        const sourceValue = node.source?.value;
        if (typeof sourceValue !== "string") return;
        if (handleExtraSource?.(node, context)) return;
        if (sourceValue !== source) return;

        for (const specifier of node.specifiers ?? []) {
          if (specifier.type === "ImportSpecifier") {
            const importedName = specifier.imported?.name;
            if (!importedName) continue;
            const message = messages.get(importedName);
            if (message) context.report({ node: specifier, message });
            continue;
          }
          if (
            specifier.type === "ImportDefaultSpecifier" ||
            specifier.type === "ImportNamespaceSpecifier"
          ) {
            const localName = specifier.local?.name;
            if (localName) namespaceBindings.add(localName);
          }
        }
      },
      MemberExpression(node: EsTreeNode) {
        if (namespaceBindings.size === 0) return;
        if (node.computed) return;
        if (node.object?.type !== "Identifier") return;
        if (!namespaceBindings.has(node.object.name)) return;
        if (node.property?.type !== "Identifier") return;
        const message = messages.get(node.property.name);
        if (message) context.report({ node, message });
      },
    };
  },
});
