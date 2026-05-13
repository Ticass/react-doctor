import type { EsTreeNode } from "./es-tree-node.js";

// HACK: collects every locally-bound name introduced by a parameter list,
// recursing into nested object/array patterns. We need every binding so
// `noDerivedUseState` can detect e.g. `function Foo({ user: { name } })` ->
// `useState(name)` (false negative if we only added "user").
export const collectPatternNames = (pattern: EsTreeNode | null, into: Set<string>): void => {
  if (!pattern) return;

  if (pattern.type === "Identifier") {
    into.add(pattern.name);
    return;
  }

  if (pattern.type === "AssignmentPattern") {
    collectPatternNames(pattern.left, into);
    return;
  }

  if (pattern.type === "RestElement") {
    collectPatternNames(pattern.argument, into);
    return;
  }

  if (pattern.type === "ArrayPattern") {
    for (const element of pattern.elements ?? []) {
      collectPatternNames(element, into);
    }
    return;
  }

  if (pattern.type === "ObjectPattern") {
    for (const property of pattern.properties ?? []) {
      if (property.type === "RestElement") {
        collectPatternNames(property.argument, into);
        continue;
      }
      if (property.type === "Property") {
        // The bound name lives in `property.value` (which may itself be
        // a nested pattern). The `property.key` is the source-side name
        // and only matters when it equals `property.value` (shorthand).
        collectPatternNames(property.value, into);
      }
    }
  }
};
