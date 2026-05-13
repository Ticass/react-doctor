import { MUTATION_METHOD_NAMES } from "../constants.js";
import type { EsTreeNode } from "./es-tree-node.js";

export const isMutatingDbCall = (node: EsTreeNode): boolean => {
  if (node.type !== "CallExpression" || node.callee?.type !== "MemberExpression") return false;
  const { property } = node.callee;
  return property?.type === "Identifier" && MUTATION_METHOD_NAMES.has(property.name);
};
