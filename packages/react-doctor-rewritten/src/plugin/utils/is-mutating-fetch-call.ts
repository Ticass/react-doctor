import type { EsTreeNode } from "./es-tree-node.js";
import { isMutatingMethodProperty } from "./is-mutating-method-property.js";

export const isMutatingFetchCall = (node: EsTreeNode): boolean => {
  if (node.type !== "CallExpression") return false;
  if (node.callee?.type !== "Identifier" || node.callee.name !== "fetch") return false;
  const optionsArgument = node.arguments?.[1];
  if (!optionsArgument || optionsArgument.type !== "ObjectExpression") return false;
  return Boolean(optionsArgument.properties?.some(isMutatingMethodProperty));
};
