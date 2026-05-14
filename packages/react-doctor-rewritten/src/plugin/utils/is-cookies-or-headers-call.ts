import { MUTATION_METHOD_NAMES } from "../constants.js";
import type { EsTreeNode } from "./es-tree-node.js";

export const isCookiesOrHeadersCall = (node: EsTreeNode, methodName: string): boolean => {
  if (node.type !== "CallExpression" || node.callee?.type !== "MemberExpression") return false;
  const { object, property } = node.callee;
  if (property?.type !== "Identifier" || !MUTATION_METHOD_NAMES.has(property.name)) return false;
  if (object?.type !== "CallExpression" || object.callee?.type !== "Identifier") return false;
  return object.callee.name === methodName;
};
