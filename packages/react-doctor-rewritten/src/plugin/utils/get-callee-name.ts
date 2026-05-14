import type { EsTreeNode } from "./es-tree-node.js";

export const getCalleeName = (node: EsTreeNode): string | null => {
  if (node.callee?.type === "Identifier") return node.callee.name;
  if (node.callee?.type === "MemberExpression" && node.callee.property?.type === "Identifier") {
    return node.callee.property.name;
  }
  return null;
};
