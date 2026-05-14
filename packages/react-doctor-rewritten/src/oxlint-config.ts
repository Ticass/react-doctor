import { createRequire } from "node:module";
import type { ProjectInfo } from "./types.js";
import { isTailwindAtLeast, parseTailwindMajorMinor } from "./utils/parse-tailwind-major-minor.js";

const esmRequire = createRequire(import.meta.url);

export type RuleSeverity = "error" | "warn" | "off";

export const NEXTJS_RULES: Record<string, RuleSeverity> = {
  "react-doctor/nextjs-no-img-element": "warn",
  "react-doctor/nextjs-async-client-component": "error",
  "react-doctor/nextjs-no-a-element": "warn",
  "react-doctor/nextjs-no-use-search-params-without-suspense": "warn",
  "react-doctor/nextjs-no-client-fetch-for-server-data": "warn",
  "react-doctor/nextjs-missing-metadata": "warn",
  "react-doctor/nextjs-no-client-side-redirect": "warn",
  "react-doctor/nextjs-no-redirect-in-try-catch": "warn",
  "react-doctor/nextjs-image-missing-sizes": "warn",
  "react-doctor/nextjs-no-native-script": "warn",
  "react-doctor/nextjs-inline-script-missing-id": "warn",
  "react-doctor/nextjs-no-font-link": "warn",
  "react-doctor/nextjs-no-css-link": "warn",
  "react-doctor/nextjs-no-polyfill-script": "warn",
  "react-doctor/nextjs-no-head-import": "error",
  "react-doctor/nextjs-no-side-effect-in-get-handler": "error",
};

export const REACT_NATIVE_RULES: Record<string, RuleSeverity> = {
  "react-doctor/rn-no-raw-text": "error",
  "react-doctor/rn-no-deprecated-modules": "error",
  "react-doctor/rn-no-legacy-expo-packages": "warn",
  "react-doctor/rn-no-dimensions-get": "warn",
  "react-doctor/rn-no-inline-flatlist-renderitem": "warn",
  "react-doctor/rn-no-legacy-shadow-styles": "warn",
  "react-doctor/rn-prefer-reanimated": "warn",
  "react-doctor/rn-no-single-element-style-array": "warn",
  "react-doctor/rn-prefer-pressable": "warn",
  "react-doctor/rn-prefer-expo-image": "warn",
  "react-doctor/rn-no-non-native-navigator": "warn",
  "react-doctor/rn-no-scroll-state": "error",
  "react-doctor/rn-no-scrollview-mapped-list": "warn",
  "react-doctor/rn-no-inline-object-in-list-item": "warn",
  "react-doctor/rn-animate-layout-property": "error",
  "react-doctor/rn-prefer-content-inset-adjustment": "warn",
  "react-doctor/rn-pressable-shared-value-mutation": "warn",
  "react-doctor/rn-list-data-mapped": "warn",
  "react-doctor/rn-list-callback-per-row": "warn",
  "react-doctor/rn-list-recyclable-without-types": "warn",
  "react-doctor/rn-animation-reaction-as-derived": "warn",
  "react-doctor/rn-bottom-sheet-prefer-native": "warn",
  "react-doctor/rn-scrollview-dynamic-padding": "warn",
  "react-doctor/rn-style-prefer-boxshadow": "warn",
};

export const TANSTACK_START_RULES: Record<string, RuleSeverity> = {
  "react-doctor/tanstack-start-route-property-order": "error",
  "react-doctor/tanstack-start-no-direct-fetch-in-loader": "warn",
  "react-doctor/tanstack-start-server-fn-validate-input": "warn",
  "react-doctor/tanstack-start-no-useeffect-fetch": "warn",
  "react-doctor/tanstack-start-missing-head-content": "warn",
  "react-doctor/tanstack-start-no-anchor-element": "warn",
  "react-doctor/tanstack-start-server-fn-method-order": "error",
  "react-doctor/tanstack-start-no-navigate-in-render": "warn",
  "react-doctor/tanstack-start-no-dynamic-server-fn-import": "error",
  "react-doctor/tanstack-start-no-use-server-in-handler": "error",
  "react-doctor/tanstack-start-no-secrets-in-loader": "error",
  "react-doctor/tanstack-start-get-mutation": "warn",
  "react-doctor/tanstack-start-redirect-in-try-catch": "warn",
  "react-doctor/tanstack-start-loader-parallel-fetch": "warn",
};

// HACK: every diagnostic from `eslint-plugin-react-hooks` (the React
// Compiler frontend, oxlint-namespaced as `react-hooks-js`) ships at
// `"error"` severity. Each one represents a code shape the compiler
// cannot optimize — leaving the surrounding component un-memoized at
// runtime — so we want the GitHub Action's default `--fail-on error`
// to trip on these. PR #140 silently downgraded the whole map to
// `"warn"` as part of a broader refactor, which made "React Compiler
// can't optimize this code" diagnostics stop counting toward
// `errorCount` and stop failing CI; restored here.
// HACK: complementary rule surface from
// `eslint-plugin-react-you-might-not-need-an-effect` (#187). These
// fire alongside react-doctor's native `state-and-effects` rules when
// the plugin is installed, providing additional anti-pattern
// detection for effects. Severities are `warn` to match the rest of
// the effects-rule cohort and avoid changing CI pass/fail behavior
// for projects that adopt the plugin.
const YOU_MIGHT_NOT_NEED_EFFECT_RULES: Record<string, RuleSeverity> = {
  "effect/no-derived-state": "warn",
  "effect/no-chain-state-updates": "warn",
  "effect/no-event-handler": "warn",
  "effect/no-adjust-state-on-prop-change": "warn",
  "effect/no-reset-all-state-on-prop-change": "warn",
  "effect/no-pass-live-state-to-parent": "warn",
  "effect/no-pass-data-to-parent": "warn",
  "effect/no-initialize-state": "warn",
};

const REACT_COMPILER_RULES: Record<string, RuleSeverity> = {
  "react-hooks-js/set-state-in-render": "error",
  "react-hooks-js/immutability": "error",
  "react-hooks-js/refs": "error",
  "react-hooks-js/purity": "error",
  "react-hooks-js/hooks": "error",
  "react-hooks-js/set-state-in-effect": "error",
  "react-hooks-js/globals": "error",
  "react-hooks-js/error-boundaries": "error",
  "react-hooks-js/preserve-manual-memoization": "error",
  "react-hooks-js/unsupported-syntax": "error",
  "react-hooks-js/component-hook-factories": "error",
  "react-hooks-js/static-components": "error",
  "react-hooks-js/use-memo": "error",
  "react-hooks-js/void-use-memo": "error",
  "react-hooks-js/incompatible-library": "error",
  "react-hooks-js/todo": "error",
};

interface OxlintConfigOptions {
  pluginPath: string;
  project: ProjectInfo;
  customRulesOnly?: boolean;
  extendsPaths?: string[];
  ignoredTags?: ReadonlySet<string>;
}

interface JsPluginEntry {
  name: string;
  specifier: string;
}

type ReactHooksJsPluginEntry = JsPluginEntry;

interface ResolvedReactHooksJsPlugin {
  entry: ReactHooksJsPluginEntry;
  /** Rule names exported by the loaded plugin (e.g. "void-use-memo"). */
  availableRuleNames: ReadonlySet<string>;
}

interface MaybePluginModule {
  rules?: Record<string, unknown>;
  default?: { rules?: Record<string, unknown> };
}

const readPluginRuleNames = (pluginSpecifier: string): ReadonlySet<string> => {
  // HACK: oxlint resolves the plugin itself at scan time; we just need
  // a fast rule-name listing to filter our config so we don't
  // reference rules that don't exist in the user's installed version
  // (e.g. older eslint-plugin-react-hooks releases do not expose every
  // compiler rule). Failing to read the module is non-fatal — we fall
  // back to enabling every rule we have
  // configured for and let oxlint surface the mismatch (which preserves
  // pre-fix behavior for unknown plugin shapes).
  try {
    const pluginModule: MaybePluginModule = esmRequire(pluginSpecifier);
    const rules = pluginModule.rules ?? pluginModule.default?.rules;
    if (rules === undefined) return new Set();
    return new Set(Object.keys(rules));
  } catch {
    return new Set();
  }
};

const resolveReactHooksJsPlugin = (
  hasReactCompiler: boolean,
  customRulesOnly: boolean,
): ResolvedReactHooksJsPlugin | null => {
  if (!hasReactCompiler || customRulesOnly) return null;
  let pluginSpecifier: string;
  try {
    pluginSpecifier = esmRequire.resolve("eslint-plugin-react-hooks");
  } catch {
    return null;
  }
  return {
    entry: { name: "react-hooks-js", specifier: pluginSpecifier },
    availableRuleNames: readPluginRuleNames(pluginSpecifier),
  };
};

interface ResolvedYouMightNotNeedEffectPlugin {
  entry: JsPluginEntry;
  availableRuleNames: ReadonlySet<string>;
}

// HACK: oxlint-namespaces this third-party ESLint plugin under
// `effect` so the long upstream package name doesn't clutter rule
// keys. Issue #187 — adds the plugin's complementary rule surface
// alongside react-doctor's native `state-and-effects` rules. The
// plugin is opt-in: skipped when not installed (peer is optional).
const YOU_MIGHT_NOT_NEED_EFFECT_NAMESPACE = "effect";

const resolveYouMightNotNeedEffectPlugin = (
  customRulesOnly: boolean,
): ResolvedYouMightNotNeedEffectPlugin | null => {
  if (customRulesOnly) return null;
  let pluginSpecifier: string;
  try {
    pluginSpecifier = esmRequire.resolve("eslint-plugin-react-you-might-not-need-an-effect");
  } catch {
    return null;
  }
  return {
    entry: { name: YOU_MIGHT_NOT_NEED_EFFECT_NAMESPACE, specifier: pluginSpecifier },
    availableRuleNames: readPluginRuleNames(pluginSpecifier),
  };
};

const filterRulesToAvailable = (
  rules: Record<string, RuleSeverity>,
  pluginNamespace: string,
  availableRuleNames: ReadonlySet<string>,
): Record<string, RuleSeverity> => {
  // Empty `availableRuleNames` means we couldn't introspect the plugin
  // (e.g. exotic export shape). Fall back to the unfiltered rule set so
  // we don't silently disable rules in supported configurations.
  if (availableRuleNames.size === 0) return rules;
  const ruleKeyPrefix = `${pluginNamespace}/`;
  const filtered: Record<string, RuleSeverity> = {};
  for (const [ruleKey, severity] of Object.entries(rules)) {
    if (!ruleKey.startsWith(ruleKeyPrefix)) {
      filtered[ruleKey] = severity;
      continue;
    }
    const ruleName = ruleKey.slice(ruleKeyPrefix.length);
    if (availableRuleNames.has(ruleName)) {
      filtered[ruleKey] = severity;
    }
  }
  return filtered;
};

export const TANSTACK_QUERY_RULES: Record<string, RuleSeverity> = {
  "react-doctor/query-stable-query-client": "warn",
  "react-doctor/query-no-rest-destructuring": "warn",
  "react-doctor/query-no-void-query-fn": "warn",
  "react-doctor/query-no-query-in-effect": "warn",
  "react-doctor/query-mutation-missing-invalidation": "warn",
  "react-doctor/query-no-usequery-for-mutation": "warn",
};

const BUILTIN_REACT_RULES: Record<string, RuleSeverity> = {
  "react/rules-of-hooks": "error",
  "react/no-direct-mutation-state": "error",
  "react/jsx-no-duplicate-props": "error",
  "react/jsx-key": "error",
  "react/no-children-prop": "warn",
  "react/no-danger": "warn",
  "react/jsx-no-script-url": "error",
  "react/no-render-return-value": "warn",
  "react/no-string-refs": "warn",
  "react/no-is-mounted": "warn",
  "react/require-render-return": "error",
  "react/no-unknown-property": "warn",
};

const BUILTIN_A11Y_RULES: Record<string, RuleSeverity> = {
  "jsx-a11y/alt-text": "error",
  "jsx-a11y/anchor-is-valid": "warn",
  "jsx-a11y/click-events-have-key-events": "warn",
  "jsx-a11y/no-static-element-interactions": "warn",
  "jsx-a11y/role-has-required-aria-props": "error",
  "jsx-a11y/no-autofocus": "warn",
  "jsx-a11y/heading-has-content": "warn",
  "jsx-a11y/html-has-lang": "warn",
  "jsx-a11y/no-redundant-roles": "warn",
  "jsx-a11y/scope": "warn",
  "jsx-a11y/tabindex-no-positive": "warn",
  "jsx-a11y/label-has-associated-control": "warn",
  "jsx-a11y/no-distracting-elements": "error",
  "jsx-a11y/iframe-has-title": "warn",
};

export const GLOBAL_REACT_DOCTOR_RULES: Record<string, RuleSeverity> = {
  "react-doctor/no-derived-state-effect": "warn",
  "react-doctor/no-fetch-in-effect": "warn",
  "react-doctor/no-mirror-prop-effect": "warn",
  "react-doctor/no-mutable-in-deps": "error",
  "react-doctor/no-cascading-set-state": "warn",
  "react-doctor/no-effect-chain": "warn",
  "react-doctor/no-effect-event-handler": "warn",
  "react-doctor/no-effect-event-in-deps": "error",
  "react-doctor/no-event-trigger-state": "warn",
  "react-doctor/no-prop-callback-in-effect": "warn",
  "react-doctor/no-derived-useState": "warn",
  "react-doctor/no-direct-state-mutation": "warn",
  "react-doctor/no-set-state-in-render": "warn",
  "react-doctor/prefer-use-effect-event": "warn",
  "react-doctor/prefer-useReducer": "warn",
  "react-doctor/prefer-use-sync-external-store": "warn",
  "react-doctor/rerender-lazy-state-init": "warn",
  "react-doctor/rerender-functional-setstate": "warn",
  "react-doctor/rerender-dependencies": "error",
  "react-doctor/rerender-state-only-in-handlers": "warn",
  "react-doctor/rerender-defer-reads-hook": "warn",
  "react-doctor/advanced-event-handler-refs": "warn",
  "react-doctor/effect-needs-cleanup": "error",

  "react-doctor/no-giant-component": "warn",
  "react-doctor/no-render-in-render": "warn",
  "react-doctor/no-many-boolean-props": "warn",
  "react-doctor/no-react19-deprecated-apis": "warn",
  "react-doctor/no-render-prop-children": "warn",
  "react-doctor/no-nested-component-definition": "error",
  "react-doctor/react-compiler-destructure-method": "warn",
  "react-doctor/no-legacy-class-lifecycles": "error",
  "react-doctor/no-legacy-context-api": "error",
  "react-doctor/no-default-props": "warn",
  "react-doctor/no-react-dom-deprecated-apis": "warn",

  "react-doctor/no-usememo-simple-expression": "warn",
  "react-doctor/no-layout-property-animation": "error",
  "react-doctor/rerender-memo-with-default-value": "warn",
  "react-doctor/rerender-memo-before-early-return": "warn",
  "react-doctor/rerender-transitions-scroll": "warn",
  "react-doctor/rerender-derived-state-from-hook": "warn",
  "react-doctor/async-defer-await": "warn",
  "react-doctor/async-await-in-loop": "warn",
  "react-doctor/rendering-animate-svg-wrapper": "warn",
  "react-doctor/rendering-hoist-jsx": "warn",
  "react-doctor/rendering-hydration-mismatch-time": "warn",
  "react-doctor/no-inline-prop-on-memo-component": "warn",
  "react-doctor/rendering-hydration-no-flicker": "warn",
  "react-doctor/rendering-script-defer-async": "warn",
  "react-doctor/rendering-usetransition-loading": "warn",

  "react-doctor/no-transition-all": "warn",
  "react-doctor/no-global-css-variable-animation": "error",
  "react-doctor/no-large-animated-blur": "warn",
  "react-doctor/no-scale-from-zero": "warn",
  "react-doctor/no-permanent-will-change": "warn",

  "react-doctor/no-eval": "error",
  "react-doctor/no-secrets-in-client-code": "warn",

  "react-doctor/no-generic-handler-names": "warn",

  "react-doctor/js-flatmap-filter": "warn",
  "react-doctor/js-combine-iterations": "warn",
  "react-doctor/js-tosorted-immutable": "warn",
  "react-doctor/js-hoist-regexp": "warn",
  "react-doctor/js-hoist-intl": "warn",
  "react-doctor/js-cache-property-access": "warn",
  "react-doctor/js-length-check-first": "warn",
  "react-doctor/js-min-max-loop": "warn",
  "react-doctor/js-set-map-lookups": "warn",
  "react-doctor/js-batch-dom-css": "warn",
  "react-doctor/js-index-maps": "warn",
  "react-doctor/js-cache-storage": "warn",
  "react-doctor/js-early-exit": "warn",

  "react-doctor/no-barrel-import": "warn",
  "react-doctor/no-dynamic-import-path": "warn",
  "react-doctor/no-full-lodash-import": "warn",
  "react-doctor/no-moment": "warn",
  "react-doctor/prefer-dynamic-import": "warn",
  "react-doctor/use-lazy-motion": "warn",
  "react-doctor/no-undeferred-third-party": "warn",

  "react-doctor/no-array-index-as-key": "warn",
  "react-doctor/no-polymorphic-children": "warn",
  "react-doctor/rendering-conditional-render": "warn",
  "react-doctor/rendering-svg-precision": "warn",
  "react-doctor/no-prevent-default": "warn",
  "react-doctor/no-uncontrolled-input": "warn",
  "react-doctor/no-document-start-view-transition": "warn",
  "react-doctor/no-flush-sync": "warn",

  "react-doctor/server-auth-actions": "error",
  "react-doctor/server-after-nonblocking": "warn",
  "react-doctor/server-no-mutable-module-state": "error",
  "react-doctor/server-cache-with-object-literal": "warn",
  "react-doctor/server-hoist-static-io": "warn",
  "react-doctor/server-dedup-props": "warn",
  "react-doctor/server-sequential-independent-await": "warn",
  "react-doctor/server-fetch-without-revalidate": "warn",

  "react-doctor/client-passive-event-listeners": "warn",
  "react-doctor/client-localstorage-no-version": "warn",

  "react-doctor/no-inline-bounce-easing": "warn",
  "react-doctor/no-z-index-9999": "warn",
  "react-doctor/no-inline-exhaustive-style": "warn",
  "react-doctor/no-side-tab-border": "warn",
  "react-doctor/no-pure-black-background": "warn",
  "react-doctor/no-gradient-text": "warn",
  "react-doctor/no-dark-mode-glow": "warn",
  "react-doctor/no-justified-text": "warn",
  "react-doctor/no-tiny-text": "warn",
  "react-doctor/no-wide-letter-spacing": "warn",
  "react-doctor/no-gray-on-colored-background": "warn",
  "react-doctor/no-layout-transition-inline": "warn",
  "react-doctor/no-disabled-zoom": "error",
  "react-doctor/no-outline-none": "warn",
  "react-doctor/no-long-transition-duration": "warn",

  "react-doctor/design-no-bold-heading": "warn",
  "react-doctor/design-no-redundant-padding-axes": "warn",
  "react-doctor/design-no-redundant-size-axes": "warn",
  "react-doctor/design-no-space-on-flex-children": "warn",
  "react-doctor/design-no-three-period-ellipsis": "warn",
  "react-doctor/design-no-default-tailwind-palette": "warn",
  "react-doctor/design-no-vague-button-label": "warn",

  "react-doctor/async-parallel": "warn",
};

// HACK: includes every rule that COULD be enabled by createOxlintConfig
// regardless of framework / TanStack flags. Used only by
// validateRuleRegistration to assert RULE_CATEGORY_MAP / RULE_HELP_MAP
// metadata coverage; we want to catch metadata gaps for all conditional
// rules, not just the ones active in the current scan's framework.
export const ALL_REACT_DOCTOR_RULE_KEYS: ReadonlySet<string> = new Set([
  ...Object.keys(GLOBAL_REACT_DOCTOR_RULES),
  ...Object.keys(NEXTJS_RULES),
  ...Object.keys(REACT_NATIVE_RULES),
  ...Object.keys(TANSTACK_START_RULES),
  ...Object.keys(TANSTACK_QUERY_RULES),
]);

export const FRAMEWORK_SPECIFIC_RULE_KEYS: ReadonlySet<string> = new Set([
  ...Object.keys(NEXTJS_RULES),
  ...Object.keys(REACT_NATIVE_RULES),
  ...Object.keys(TANSTACK_START_RULES),
  ...Object.keys(TANSTACK_QUERY_RULES),
]);

interface RuleMetadataEntry {
  requires?: ReadonlyArray<string>;
  tags: ReadonlySet<string>;
}

const EMPTY_TAGS: ReadonlySet<string> = new Set();
const TEST_NOISE_TAGS: ReadonlySet<string> = new Set(["test-noise"]);
const DESIGN_AND_TEST_NOISE_TAGS: ReadonlySet<string> = new Set(["design", "test-noise"]);

export const RULE_METADATA: ReadonlyMap<string, RuleMetadataEntry> = new Map([
  ["react-doctor/no-react19-deprecated-apis", { requires: ["react:19"], tags: TEST_NOISE_TAGS }],
  ["react-doctor/no-default-props", { requires: ["react:19"], tags: TEST_NOISE_TAGS }],
  ["react-doctor/no-react-dom-deprecated-apis", { requires: ["react:18"], tags: TEST_NOISE_TAGS }],
  ["react-doctor/prefer-use-effect-event", { requires: ["react:19"], tags: TEST_NOISE_TAGS }],

  ["react-doctor/nextjs-no-img-element", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  ["react-doctor/nextjs-async-client-component", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  ["react-doctor/nextjs-no-a-element", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  [
    "react-doctor/nextjs-no-use-search-params-without-suspense",
    { requires: ["nextjs"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/nextjs-no-client-fetch-for-server-data",
    { requires: ["nextjs"], tags: EMPTY_TAGS },
  ],
  ["react-doctor/nextjs-missing-metadata", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  ["react-doctor/nextjs-no-client-side-redirect", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  ["react-doctor/nextjs-no-redirect-in-try-catch", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  ["react-doctor/nextjs-image-missing-sizes", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  ["react-doctor/nextjs-no-native-script", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  ["react-doctor/nextjs-inline-script-missing-id", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  ["react-doctor/nextjs-no-font-link", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  ["react-doctor/nextjs-no-css-link", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  ["react-doctor/nextjs-no-polyfill-script", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  ["react-doctor/nextjs-no-head-import", { requires: ["nextjs"], tags: EMPTY_TAGS }],
  ["react-doctor/nextjs-no-side-effect-in-get-handler", { requires: ["nextjs"], tags: EMPTY_TAGS }],

  ["react-doctor/rn-no-raw-text", { requires: ["react-native"], tags: EMPTY_TAGS }],
  ["react-doctor/rn-no-deprecated-modules", { requires: ["react-native"], tags: EMPTY_TAGS }],
  ["react-doctor/rn-no-legacy-expo-packages", { requires: ["react-native"], tags: EMPTY_TAGS }],
  ["react-doctor/rn-no-dimensions-get", { requires: ["react-native"], tags: EMPTY_TAGS }],
  [
    "react-doctor/rn-no-inline-flatlist-renderitem",
    { requires: ["react-native"], tags: EMPTY_TAGS },
  ],
  ["react-doctor/rn-no-legacy-shadow-styles", { requires: ["react-native"], tags: EMPTY_TAGS }],
  ["react-doctor/rn-prefer-reanimated", { requires: ["react-native"], tags: EMPTY_TAGS }],
  [
    "react-doctor/rn-no-single-element-style-array",
    { requires: ["react-native"], tags: EMPTY_TAGS },
  ],
  ["react-doctor/rn-prefer-pressable", { requires: ["react-native"], tags: EMPTY_TAGS }],
  ["react-doctor/rn-prefer-expo-image", { requires: ["react-native"], tags: EMPTY_TAGS }],
  ["react-doctor/rn-no-non-native-navigator", { requires: ["react-native"], tags: EMPTY_TAGS }],
  ["react-doctor/rn-no-scroll-state", { requires: ["react-native"], tags: EMPTY_TAGS }],
  ["react-doctor/rn-no-scrollview-mapped-list", { requires: ["react-native"], tags: EMPTY_TAGS }],
  [
    "react-doctor/rn-no-inline-object-in-list-item",
    { requires: ["react-native"], tags: EMPTY_TAGS },
  ],
  ["react-doctor/rn-animate-layout-property", { requires: ["react-native"], tags: EMPTY_TAGS }],
  [
    "react-doctor/rn-prefer-content-inset-adjustment",
    { requires: ["react-native"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/rn-pressable-shared-value-mutation",
    { requires: ["react-native"], tags: EMPTY_TAGS },
  ],
  ["react-doctor/rn-list-data-mapped", { requires: ["react-native"], tags: EMPTY_TAGS }],
  ["react-doctor/rn-list-callback-per-row", { requires: ["react-native"], tags: EMPTY_TAGS }],
  [
    "react-doctor/rn-list-recyclable-without-types",
    { requires: ["react-native"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/rn-animation-reaction-as-derived",
    { requires: ["react-native"], tags: EMPTY_TAGS },
  ],
  ["react-doctor/rn-bottom-sheet-prefer-native", { requires: ["react-native"], tags: EMPTY_TAGS }],
  ["react-doctor/rn-scrollview-dynamic-padding", { requires: ["react-native"], tags: EMPTY_TAGS }],
  ["react-doctor/rn-style-prefer-boxshadow", { requires: ["react-native"], tags: EMPTY_TAGS }],

  [
    "react-doctor/tanstack-start-route-property-order",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/tanstack-start-no-direct-fetch-in-loader",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/tanstack-start-server-fn-validate-input",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/tanstack-start-no-useeffect-fetch",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/tanstack-start-missing-head-content",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/tanstack-start-no-anchor-element",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/tanstack-start-server-fn-method-order",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/tanstack-start-no-navigate-in-render",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/tanstack-start-no-dynamic-server-fn-import",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/tanstack-start-no-use-server-in-handler",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/tanstack-start-no-secrets-in-loader",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],
  ["react-doctor/tanstack-start-get-mutation", { requires: ["tanstack-start"], tags: EMPTY_TAGS }],
  [
    "react-doctor/tanstack-start-redirect-in-try-catch",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/tanstack-start-loader-parallel-fetch",
    { requires: ["tanstack-start"], tags: EMPTY_TAGS },
  ],

  ["react-doctor/query-stable-query-client", { requires: ["tanstack-query"], tags: EMPTY_TAGS }],
  ["react-doctor/query-no-rest-destructuring", { requires: ["tanstack-query"], tags: EMPTY_TAGS }],
  ["react-doctor/query-no-void-query-fn", { requires: ["tanstack-query"], tags: EMPTY_TAGS }],
  ["react-doctor/query-no-query-in-effect", { requires: ["tanstack-query"], tags: EMPTY_TAGS }],
  [
    "react-doctor/query-mutation-missing-invalidation",
    { requires: ["tanstack-query"], tags: EMPTY_TAGS },
  ],
  [
    "react-doctor/query-no-usequery-for-mutation",
    { requires: ["tanstack-query"], tags: EMPTY_TAGS },
  ],

  ["react-doctor/design-no-bold-heading", { tags: DESIGN_AND_TEST_NOISE_TAGS }],
  ["react-doctor/design-no-redundant-padding-axes", { tags: DESIGN_AND_TEST_NOISE_TAGS }],
  [
    "react-doctor/design-no-redundant-size-axes",
    { requires: ["tailwind:3.4"], tags: DESIGN_AND_TEST_NOISE_TAGS },
  ],
  ["react-doctor/design-no-space-on-flex-children", { tags: DESIGN_AND_TEST_NOISE_TAGS }],
  ["react-doctor/design-no-three-period-ellipsis", { tags: DESIGN_AND_TEST_NOISE_TAGS }],
  ["react-doctor/design-no-default-tailwind-palette", { tags: DESIGN_AND_TEST_NOISE_TAGS }],
  ["react-doctor/design-no-vague-button-label", { tags: DESIGN_AND_TEST_NOISE_TAGS }],
  ["react-doctor/no-side-tab-border", { tags: DESIGN_AND_TEST_NOISE_TAGS }],
  ["react-doctor/no-pure-black-background", { tags: DESIGN_AND_TEST_NOISE_TAGS }],
  ["react-doctor/no-gradient-text", { tags: DESIGN_AND_TEST_NOISE_TAGS }],
  ["react-doctor/no-dark-mode-glow", { tags: DESIGN_AND_TEST_NOISE_TAGS }],
]);

const buildCapabilities = (project: ProjectInfo): ReadonlySet<string> => {
  const capabilities = new Set<string>();

  capabilities.add(project.framework);
  if (project.framework === "expo" || project.framework === "react-native") {
    capabilities.add("react-native");
  }

  // HACK: when version detection fails (null), assume the latest React
  // major so every version-gated rule fires. Silently dropping rules
  // on detection failure was the worse outcome in practice.
  const reactMajor = project.reactMajorVersion;
  const effectiveReactMajor = reactMajor ?? 99;
  for (let major = 17; major <= effectiveReactMajor; major++) {
    capabilities.add(`react:${major}`);
  }

  if (project.tailwindVersion !== null) {
    capabilities.add("tailwind");
    const tailwind = parseTailwindMajorMinor(project.tailwindVersion);
    // HACK: when version is unparseable (dist-tag, workspace protocol),
    // assume latest so version-gated rules still fire.
    if (isTailwindAtLeast(tailwind, { major: 3, minor: 4 })) {
      capabilities.add("tailwind:3.4");
    }
  }

  if (project.hasReactCompiler) capabilities.add("react-compiler");
  if (project.hasTanStackQuery) capabilities.add("tanstack-query");
  if (project.hasTypeScript) capabilities.add("typescript");

  return capabilities;
};

const shouldEnableRule = (
  requires: ReadonlyArray<string> | undefined,
  tags: ReadonlySet<string>,
  capabilities: ReadonlySet<string>,
  ignoredTags: ReadonlySet<string>,
): boolean => {
  if (requires) {
    for (const capability of requires) {
      if (!capabilities.has(capability)) return false;
    }
  }
  for (const tag of tags) {
    if (ignoredTags.has(tag)) return false;
  }
  return true;
};

export const createOxlintConfig = ({
  pluginPath,
  project,
  customRulesOnly = false,
  extendsPaths = [],
  ignoredTags = new Set<string>(),
}: OxlintConfigOptions) => {
  const reactHooksJsPlugin = resolveReactHooksJsPlugin(project.hasReactCompiler, customRulesOnly);
  const reactCompilerRules = reactHooksJsPlugin
    ? filterRulesToAvailable(
        REACT_COMPILER_RULES,
        "react-hooks-js",
        reactHooksJsPlugin.availableRuleNames,
      )
    : {};

  const youMightNotNeedEffectPlugin = resolveYouMightNotNeedEffectPlugin(customRulesOnly);
  const youMightNotNeedEffectRules = youMightNotNeedEffectPlugin
    ? filterRulesToAvailable(
        YOU_MIGHT_NOT_NEED_EFFECT_RULES,
        YOU_MIGHT_NOT_NEED_EFFECT_NAMESPACE,
        youMightNotNeedEffectPlugin.availableRuleNames,
      )
    : {};

  const jsPlugins: JsPluginEntry[] = [];
  if (reactHooksJsPlugin) jsPlugins.push(reactHooksJsPlugin.entry);
  if (youMightNotNeedEffectPlugin) jsPlugins.push(youMightNotNeedEffectPlugin.entry);

  const capabilities = buildCapabilities(project);

  const enabledReactDoctorRules: Record<string, RuleSeverity> = {};
  const allRuleMaps = [
    GLOBAL_REACT_DOCTOR_RULES,
    NEXTJS_RULES,
    REACT_NATIVE_RULES,
    TANSTACK_START_RULES,
    TANSTACK_QUERY_RULES,
  ];
  for (const ruleMap of allRuleMaps) {
    for (const [ruleKey, severity] of Object.entries(ruleMap)) {
      const metadata = RULE_METADATA.get(ruleKey);
      if (!metadata) {
        if (FRAMEWORK_SPECIFIC_RULE_KEYS.has(ruleKey)) continue;
        enabledReactDoctorRules[ruleKey] = severity;
        continue;
      }
      if (shouldEnableRule(metadata.requires, metadata.tags, capabilities, ignoredTags)) {
        enabledReactDoctorRules[ruleKey] = severity;
      }
    }
  }

  return {
    ...(extendsPaths.length > 0 ? { extends: extendsPaths } : {}),
    categories: {
      correctness: "off",
      suspicious: "off",
      pedantic: "off",
      perf: "off",
      restriction: "off",
      style: "off",
      nursery: "off",
    },
    plugins: customRulesOnly ? [] : ["react", "jsx-a11y"],
    jsPlugins: [...jsPlugins, pluginPath],
    rules: {
      ...(customRulesOnly ? {} : BUILTIN_REACT_RULES),
      ...(customRulesOnly ? {} : BUILTIN_A11Y_RULES),
      ...reactCompilerRules,
      ...youMightNotNeedEffectRules,
      ...enabledReactDoctorRules,
    },
  };
};
