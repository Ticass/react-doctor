import type { EsTreeNode } from "./es-tree-node.js";

export const getCallbackStatements = (callback: EsTreeNode): EsTreeNode[] => {
  if (callback.body?.type === "BlockStatement") {
    return callback.body.body ?? [];
  }
  return callback.body ? [callback.body] : [];
};
