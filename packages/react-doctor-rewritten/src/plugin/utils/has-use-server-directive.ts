import type { EsTreeNode } from "./es-tree-node.js";

export const hasUseServerDirective = (node: EsTreeNode): boolean => {
  if (node.body?.type !== "BlockStatement") return false;
  return Boolean(
    node.body.body?.some(
      (statement: EsTreeNode) =>
        statement.type === "ExpressionStatement" && statement.directive === "use server",
    ),
  );
};
