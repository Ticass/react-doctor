import type { RuleVisitors } from "./rule-visitors.js";

export interface ComponentBindingStackTracker {
  isInsideComponent: () => boolean;
  isBoundName: (name: string) => boolean;
  addBindingToCurrentFrame: (name: string) => void;
  visitors: RuleVisitors;
}
