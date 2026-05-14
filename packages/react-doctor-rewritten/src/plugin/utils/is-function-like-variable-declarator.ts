import type { EsTreeNode } from "./es-tree-node.js";

// HACK: barrier-frame predicate used by `createComponentPropStackTracker`
// - a non-component arrow / function-expression VariableDeclarator
// pushes an empty stack frame so closed-over names from an outer
// component don't leak into the helper's prop check.
export const isFunctionLikeVariableDeclarator = (node: EsTreeNode): boolean => {
  if (node.type !== "VariableDeclarator") return false;
  return node.init?.type === "ArrowFunctionExpression" || node.init?.type === "FunctionExpression";
};
