import type { EsTreeNode } from "../../../utils/es-tree-node.js";

export const isInsideEventHandler = (
  node: EsTreeNode,
  handlerBindingNames: Set<string>,
): boolean => {
  let cursor: EsTreeNode | null = node.parent ?? null;
  while (cursor) {
    if (
      cursor.type === "ArrowFunctionExpression" ||
      cursor.type === "FunctionExpression" ||
      cursor.type === "FunctionDeclaration"
    ) {
      let outer: EsTreeNode | null = cursor.parent ?? null;
      while (outer) {
        if (outer.type === "JSXAttribute") {
          const attrName = outer.name?.type === "JSXIdentifier" ? outer.name.name : null;
          if (attrName && /^on[A-Z]/.test(attrName)) return true;
          return false;
        }
        if (outer.type === "VariableDeclarator") {
          const declaredName = outer.id?.type === "Identifier" ? outer.id.name : null;
          return Boolean(declaredName && handlerBindingNames.has(declaredName));
        }
        if (outer.type === "Program") return false;
        outer = outer.parent ?? null;
      }
      return false;
    }
    cursor = cursor.parent ?? null;
  }
  return false;
};
