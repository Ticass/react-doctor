import { CONTROLLED_INPUT_ELEMENTS, INDEX_PARAMETER_NAMES } from "../constants.js";
import { findJsxAttribute, hasJsxAttribute, isHookCall, walkAst } from "../helpers.js";
import type { EsTreeNode, Rule, RuleContext } from "../types.js";

const extractIndexName = (node: EsTreeNode): string | null => {
  if (node.type === "Identifier" && INDEX_PARAMETER_NAMES.has(node.name)) return node.name;

  if (node.type === "TemplateLiteral") {
    const indexExpression = node.expressions?.find(
      (expression: EsTreeNode) =>
        expression.type === "Identifier" && INDEX_PARAMETER_NAMES.has(expression.name),
    );
    if (indexExpression) return indexExpression.name;
  }

  if (
    node.type === "CallExpression" &&
    node.callee?.type === "MemberExpression" &&
    node.callee.object?.type === "Identifier" &&
    INDEX_PARAMETER_NAMES.has(node.callee.object.name) &&
    node.callee.property?.type === "Identifier" &&
    node.callee.property.name === "toString"
  )
    return node.callee.object.name;

  if (
    node.type === "CallExpression" &&
    node.callee?.type === "Identifier" &&
    node.callee.name === "String" &&
    node.arguments?.[0]?.type === "Identifier" &&
    INDEX_PARAMETER_NAMES.has(node.arguments[0].name)
  )
    return node.arguments[0].name;

  return null;
};

const isInsideStaticPlaceholderMap = (node: EsTreeNode): boolean => {
  let current = node;
  while (current.parent) {
    current = current.parent;
    if (
      current.type === "CallExpression" &&
      current.callee?.type === "MemberExpression" &&
      current.callee.property?.name === "map"
    ) {
      const receiver = current.callee.object;
      if (receiver?.type === "CallExpression") {
        const callee = receiver.callee;
        if (
          callee?.type === "MemberExpression" &&
          callee.object?.type === "Identifier" &&
          callee.object.name === "Array" &&
          callee.property?.name === "from"
        )
          return true;
      }
      if (
        receiver?.type === "NewExpression" &&
        receiver.callee?.type === "Identifier" &&
        receiver.callee.name === "Array"
      )
        return true;
    }
  }
  return false;
};

export const noArrayIndexAsKey: Rule = {
  create: (context: RuleContext) => ({
    JSXAttribute(node: EsTreeNode) {
      if (node.name?.type !== "JSXIdentifier" || node.name.name !== "key") return;
      if (!node.value || node.value.type !== "JSXExpressionContainer") return;

      const indexName = extractIndexName(node.value.expression);
      if (!indexName) return;
      if (isInsideStaticPlaceholderMap(node)) return;

      context.report({
        node,
        message: `Array index "${indexName}" used as key — causes bugs when list is reordered or filtered`,
      });
    },
  }),
};

const PREVENT_DEFAULT_ELEMENTS: Record<string, string> = {
  form: "onSubmit",
  a: "onClick",
};

const containsPreventDefaultCall = (node: EsTreeNode): boolean => {
  let didFindPreventDefault = false;
  walkAst(node, (child) => {
    if (didFindPreventDefault) return;
    if (
      child.type === "CallExpression" &&
      child.callee?.type === "MemberExpression" &&
      child.callee.property?.type === "Identifier" &&
      child.callee.property.name === "preventDefault"
    ) {
      didFindPreventDefault = true;
    }
  });
  return didFindPreventDefault;
};

export const noPreventDefault: Rule = {
  create: (context: RuleContext) => ({
    JSXOpeningElement(node: EsTreeNode) {
      const elementName = node.name?.type === "JSXIdentifier" ? node.name.name : null;
      if (!elementName) return;

      const targetEventProp = PREVENT_DEFAULT_ELEMENTS[elementName];
      if (!targetEventProp) return;

      const eventAttribute = findJsxAttribute(node.attributes ?? [], targetEventProp);
      if (!eventAttribute?.value || eventAttribute.value.type !== "JSXExpressionContainer") return;

      const expression = eventAttribute.value.expression;
      if (
        expression?.type !== "ArrowFunctionExpression" &&
        expression?.type !== "FunctionExpression"
      )
        return;

      if (!containsPreventDefaultCall(expression)) return;

      const message =
        elementName === "form"
          ? "preventDefault() on <form> onSubmit — form won't work without JavaScript. Consider using a server action for progressive enhancement"
          : "preventDefault() on <a> onClick — use a <button> or routing component instead";

      context.report({ node, message });
    },
  }),
};

export const renderingConditionalRender: Rule = {
  create: (context: RuleContext) => ({
    LogicalExpression(node: EsTreeNode) {
      if (node.operator !== "&&") return;

      const isRightJsx = node.right?.type === "JSXElement" || node.right?.type === "JSXFragment";
      if (!isRightJsx) return;

      if (
        node.left?.type === "MemberExpression" &&
        node.left.property?.type === "Identifier" &&
        node.left.property.name === "length"
      ) {
        context.report({
          node,
          message:
            "Conditional rendering with .length can render '0' — use .length > 0 or Boolean(.length)",
        });
      }
    },
  }),
};

export const noUncontrolledInput: Rule = {
  create: (context: RuleContext) => {
    // Tracks state variables initialized as undefined so we can detect the
    // uncontrolled→controlled flip: useState(undefined) then used as value={x}.
    const undefinedStateVars = new Set<string>();

    return {
      VariableDeclarator(node: EsTreeNode) {
        if (node.id?.type !== "ArrayPattern") return;
        if (!isHookCall(node.init, "useState")) return;
        const stateElement = node.id.elements?.[0];
        if (stateElement?.type !== "Identifier") return;
        const args = node.init.arguments ?? [];
        // useState() and useState(undefined) both produce an undefined initial value
        const startsUndefined =
          args.length === 0 || (args[0]?.type === "Identifier" && args[0].name === "undefined");
        if (startsUndefined) undefinedStateVars.add(stateElement.name);
      },

      JSXOpeningElement(node: EsTreeNode) {
        const elementName = node.name?.type === "JSXIdentifier" ? node.name.name : null;
        if (!elementName || !CONTROLLED_INPUT_ELEMENTS.has(elementName)) return;

        const attributes = node.attributes ?? [];
        const valueAttr = findJsxAttribute(attributes, "value");
        const defaultValueAttr = findJsxAttribute(attributes, "defaultValue");
        const hasOnChange = hasJsxAttribute(attributes, "onChange");
        const hasReadOnly = hasJsxAttribute(attributes, "readOnly");

        if (valueAttr && !hasOnChange && !hasReadOnly) {
          context.report({
            node: valueAttr,
            message: `<${elementName} value={...}> without onChange or readOnly — add an onChange handler or use defaultValue for an uncontrolled input`,
          });
        }

        // defaultValue is silently ignored on a controlled input
        if (valueAttr && defaultValueAttr) {
          context.report({
            node: defaultValueAttr,
            message: `<${elementName}> has both value and defaultValue — defaultValue is ignored on controlled inputs, remove it`,
          });
        }

        // Detect the undefined→string flip: starts uncontrolled, becomes controlled on first update
        if (valueAttr?.value?.type === "JSXExpressionContainer") {
          const expression = valueAttr.value.expression;
          if (expression?.type === "Identifier" && undefinedStateVars.has(expression.name)) {
            context.report({
              node: valueAttr,
              message: `"${expression.name}" is initialized as undefined — the input starts uncontrolled and switches to controlled on first update, use "" as the initial value instead`,
            });
          }
        }
      },
    };
  },
};
