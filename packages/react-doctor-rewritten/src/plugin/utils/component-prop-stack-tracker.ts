import type { RuleVisitors } from "./rule-visitors.js";

export interface ComponentPropStackTracker {
  isPropName: (name: string) => boolean;
  getCurrentPropNames: () => Set<string>;
  visitors: RuleVisitors;
}
