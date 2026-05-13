import type { EsTreeNode } from "./es-tree-node.js";
import { isSetterIdentifier } from "./is-setter-identifier.js";

export const isSetterCall = (node: EsTreeNode): boolean =>
  node.type === "CallExpression" &&
  node.callee?.type === "Identifier" &&
  isSetterIdentifier(node.callee.name);
