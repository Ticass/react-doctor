import type { EsTreeNode } from "./es-tree-node.js";

export const isMemberProperty = (node: EsTreeNode, propertyName: string): boolean =>
  node.type === "MemberExpression" &&
  node.property?.type === "Identifier" &&
  node.property.name === propertyName;
