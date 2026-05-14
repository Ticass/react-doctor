import type { EsTreeNode } from "./es-tree-node.js";

export const getEffectCallback = (node: EsTreeNode): EsTreeNode | null => {
  if (!node.arguments?.length) return null;
  const callback = node.arguments[0];
  if (callback.type === "ArrowFunctionExpression" || callback.type === "FunctionExpression") {
    return callback;
  }
  return null;
};
