import { TANSTACK_SERVER_FN_NAMES } from "../../../constants.js";
import type { EsTreeNode } from "../../../utils/es-tree-node.js";
import { getCalleeName } from "../../../utils/get-callee-name.js";
import type { ServerFnChainInfo } from "./server-fn-chain-info.js";

export const walkServerFnChain = (outerNode: EsTreeNode): ServerFnChainInfo => {
  const result: ServerFnChainInfo = {
    isServerFnChain: false,
    specifiedMethod: null,
    hasInputValidator: false,
  };

  let currentNode: EsTreeNode = outerNode.callee?.object;

  while (currentNode?.type === "CallExpression") {
    const calleeName = getCalleeName(currentNode);

    if (calleeName && TANSTACK_SERVER_FN_NAMES.has(calleeName)) {
      result.isServerFnChain = true;

      const optionsArgument = currentNode.arguments?.[0];
      if (optionsArgument?.type === "ObjectExpression") {
        for (const property of optionsArgument.properties ?? []) {
          if (
            property.key?.type === "Identifier" &&
            property.key.name === "method" &&
            property.value?.type === "Literal" &&
            typeof property.value.value === "string"
          ) {
            result.specifiedMethod = property.value.value;
          }
        }
      }
    }

    if (calleeName === "inputValidator") {
      result.hasInputValidator = true;
    }

    if (currentNode.callee?.type === "MemberExpression") {
      currentNode = currentNode.callee.object;
    } else {
      break;
    }
  }

  return result;
};
