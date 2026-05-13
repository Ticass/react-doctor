import { SUBSCRIPTION_METHOD_NAMES } from "../../../constants.js";
import type { EsTreeNode } from "../../../utils/es-tree-node.js";

export const isSubscribeLikeCallExpression = (node: EsTreeNode): boolean => {
  if (node?.type !== "CallExpression") return false;
  if (node.callee?.type !== "MemberExpression") return false;
  if (node.callee.property?.type !== "Identifier") return false;
  return SUBSCRIPTION_METHOD_NAMES.has(node.callee.property.name);
};
