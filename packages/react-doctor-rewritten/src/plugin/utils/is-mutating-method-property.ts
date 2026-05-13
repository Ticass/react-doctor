import { MUTATING_HTTP_METHODS } from "../constants.js";
import type { EsTreeNode } from "./es-tree-node.js";

// HACK: extracted so `findSideEffect` can re-use the EXACT same shape
// predicate when it goes hunting for the literal method to render in
// the diagnostic. Previously `findSideEffect` used a looser `key.name
// === "method"` predicate and could pick a non-Literal `method:` entry
// (when duplicate keys are present), producing
// `"fetch() with method undefined"` in the message.
export const isMutatingMethodProperty = (property: EsTreeNode): boolean =>
  property.type === "Property" &&
  property.key?.type === "Identifier" &&
  property.key.name === "method" &&
  property.value?.type === "Literal" &&
  typeof property.value.value === "string" &&
  MUTATING_HTTP_METHODS.has(property.value.value.toUpperCase());
