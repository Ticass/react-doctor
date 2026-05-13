import type { EsTreeNode } from "../../../utils/es-tree-node.js";

export const getOpeningElementTagName = (
  openingElement: EsTreeNode | null | undefined,
): string | null => {
  if (!openingElement) return null;
  if (openingElement.name?.type === "JSXIdentifier") return openingElement.name.name;
  if (openingElement.name?.type === "JSXMemberExpression") {
    let cursor = openingElement.name;
    while (cursor.type === "JSXMemberExpression") {
      cursor = cursor.property;
    }
    if (cursor?.type === "JSXIdentifier") return cursor.name;
  }
  return null;
};
