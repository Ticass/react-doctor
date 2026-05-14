import type { EsTreeNode } from "./es-tree-node.js";

// HACK: walk a MemberExpression chain (computed or not) down to the
// underlying root identifier. `state.nested.items` -> "state",
// `items[0]` -> "items". Returns null if the chain bottoms out at
// anything other than a plain Identifier (e.g. a CallExpression,
// `this`, etc.). Bare Identifiers also resolve to themselves.
//
// When `followCallChains` is true, also walks past the receiver of
// any intermediate CallExpression - `items.toSorted().filter(fn)` ->
// "items". Off by default because most callers want the receiver of
// the call (e.g. for "did this assignment write to props?"), not the
// expression that produced the receiver.
export const getRootIdentifierName = (
  node: EsTreeNode | undefined | null,
  options?: { followCallChains?: boolean },
): string | null => {
  if (!node) return null;
  if (node.type === "Identifier") return node.name;
  const followCallChains = options?.followCallChains === true;
  let cursor: EsTreeNode | undefined = node;
  while (cursor) {
    if (cursor.type === "MemberExpression") {
      cursor = cursor.object;
      continue;
    }
    if (followCallChains && cursor.type === "CallExpression") {
      const callee = cursor.callee;
      if (callee?.type !== "MemberExpression") return null;
      cursor = callee.object;
      continue;
    }
    break;
  }
  return cursor?.type === "Identifier" ? cursor.name : null;
};
