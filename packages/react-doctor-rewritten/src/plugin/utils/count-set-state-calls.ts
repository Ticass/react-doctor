import type { EsTreeNode } from "./es-tree-node.js";
import { isSetterCall } from "./is-setter-call.js";
import { walkAst } from "./walk-ast.js";

export const countSetStateCalls = (node: EsTreeNode): number => {
  let setStateCallCount = 0;
  walkAst(node, (child) => {
    if (isSetterCall(child)) setStateCallCount++;
  });
  return setStateCallCount;
};
