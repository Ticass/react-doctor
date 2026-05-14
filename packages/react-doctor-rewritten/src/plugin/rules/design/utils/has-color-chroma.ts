import { COLOR_CHROMA_THRESHOLD } from "../../../constants.js";
import type { ParsedRgb } from "../../../utils/parsed-rgb.js";

export const hasColorChroma = (parsed: ParsedRgb): boolean =>
  Math.max(parsed.red, parsed.green, parsed.blue) -
    Math.min(parsed.red, parsed.green, parsed.blue) >=
  COLOR_CHROMA_THRESHOLD;
