import {
  CLEANUP_LIKE_RELEASE_CALLEE_NAMES,
  TIMER_CLEANUP_CALLEE_NAMES,
  UNSUBSCRIPTION_METHOD_NAMES,
} from "../../../constants.js";
import type { EsTreeNode } from "../../../utils/es-tree-node.js";

export const isReleaseLikeCall = (
  callNode: EsTreeNode,
  knownBoundReleaseNames: ReadonlySet<string>,
): boolean => {
  if (callNode?.type !== "CallExpression") return false;
  const callee = callNode.callee;
  if (callee?.type === "Identifier") {
    if (TIMER_CLEANUP_CALLEE_NAMES.has(callee.name)) return true;
    if (CLEANUP_LIKE_RELEASE_CALLEE_NAMES.has(callee.name)) return true;
    if (knownBoundReleaseNames.has(callee.name)) return true;
    return false;
  }
  if (callee?.type === "MemberExpression" && callee.property?.type === "Identifier") {
    return UNSUBSCRIPTION_METHOD_NAMES.has(callee.property.name);
  }
  return false;
};
