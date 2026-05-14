import type { EsTreeNode } from "./es-tree-node.js";
import { isUppercaseName } from "./is-uppercase-name.js";

export const isComponentDeclaration = (node: EsTreeNode): boolean =>
  node.type === "FunctionDeclaration" && Boolean(node.id?.name) && isUppercaseName(node.id.name);
