import type { EsTreeNode } from "../../../utils/es-tree-node.js";
import { walkAst } from "../../../utils/walk-ast.js";

export const collectIdentifierNames = (expression: EsTreeNode): Set<string> => {
  const names = new Set<string>();
  walkAst(expression, (child: EsTreeNode) => {
    if (child.type === "Identifier") names.add(child.name);
  });
  return names;
};
