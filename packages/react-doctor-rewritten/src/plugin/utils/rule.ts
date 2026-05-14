import type { RuleContext } from "./rule-context.js";
import type { RuleExample } from "./rule-example.js";
import type { RuleVisitors } from "./rule-visitors.js";

export interface Rule {
  recommendation?: string;
  examples?: RuleExample[];
  create: (context: RuleContext) => RuleVisitors;
}
