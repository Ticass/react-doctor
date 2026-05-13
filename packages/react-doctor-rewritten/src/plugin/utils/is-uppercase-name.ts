import { UPPERCASE_PATTERN } from "../constants.js";

export const isUppercaseName = (name: string): boolean => UPPERCASE_PATTERN.test(name);
