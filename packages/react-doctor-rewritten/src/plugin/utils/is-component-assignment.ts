import type { EsTreeNode } from "./es-tree-node.js";
import { isUppercaseName } from "./is-uppercase-name.js";

export const isComponentAssignment = (node: EsTreeNode): boolean =>
  node.type === "VariableDeclarator" &&
  node.id?.type === "Identifier" &&
  isUppercaseName(node.id.name) &&
  Boolean(node.init) &&
  (node.init.type === "ArrowFunctionExpression" || node.init.type === "FunctionExpression");
