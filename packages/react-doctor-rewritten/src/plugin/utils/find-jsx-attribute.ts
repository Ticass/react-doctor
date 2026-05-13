import type { EsTreeNode } from "./es-tree-node.js";

export const findJsxAttribute = (
  attributes: EsTreeNode[],
  attributeName: string,
): EsTreeNode | undefined =>
  attributes?.find(
    (attribute: EsTreeNode) =>
      attribute.type === "JSXAttribute" &&
      attribute.name?.type === "JSXIdentifier" &&
      attribute.name.name === attributeName,
  );
