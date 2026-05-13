import type { EsTreeNode } from "../../../utils/es-tree-node.js";
import { walkInsideStatementBlocks } from "../../../utils/walk-inside-statement-blocks.js";

export const collectReturnExpressions = (componentBody: EsTreeNode): EsTreeNode[] => {
  if (componentBody?.type !== "BlockStatement") return [];
  const returns: EsTreeNode[] = [];
  for (const statement of componentBody.body ?? []) {
    if (statement.type === "ReturnStatement" && statement.argument) {
      returns.push(statement.argument);
      continue;
    }
    // Walk into IfStatement / TryStatement etc. for early-return JSX,
    // but stop at any nested function.
    walkInsideStatementBlocks(statement, (child) => {
      if (child.type === "ReturnStatement" && child.argument) {
        returns.push(child.argument);
      }
    });
  }
  return returns;
};
