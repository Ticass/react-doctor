import type { EsTreeNode } from "./es-tree-node.js";

export interface RuleVisitors {
  [selector: string]: ((node: EsTreeNode) => void) | (() => void);
}
