import type { EsTreeNode } from "./es-tree-node.js";

export const hasDirective = (programNode: EsTreeNode, directive: string): boolean =>
  Boolean(
    programNode.body?.some(
      (statement: EsTreeNode) =>
        statement.type === "ExpressionStatement" &&
        statement.expression?.type === "Literal" &&
        statement.expression.value === directive,
    ),
  );
