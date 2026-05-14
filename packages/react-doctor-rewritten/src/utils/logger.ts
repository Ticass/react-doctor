import { highlighter } from "./highlighter.js";

let isSilent = false;

export const setLoggerSilent = (silent: boolean): void => {
  isSilent = silent;
};

export const isLoggerSilent = (): boolean => isSilent;

export const logger = {
  error(...args: unknown[]) {
    // HACK: errors must always be visible on stderr — even in silent
    // (--json / --hide-branding) modes.  Silencing them makes failures
    // completely invisible to users running in CI with output redirected
    // to a file, leaving only a bare "exit code 1" with no diagnosis.
    console.error(highlighter.error(args.join(" ")));
  },
  warn(...args: unknown[]) {
    if (isSilent) return;
    console.warn(highlighter.warn(args.join(" ")));
  },
  info(...args: unknown[]) {
    if (isSilent) return;
    console.log(highlighter.info(args.join(" ")));
  },
  success(...args: unknown[]) {
    if (isSilent) return;
    console.log(highlighter.success(args.join(" ")));
  },
  dim(...args: unknown[]) {
    if (isSilent) return;
    console.log(highlighter.dim(args.join(" ")));
  },
  log(...args: unknown[]) {
    if (isSilent) return;
    console.log(args.join(" "));
  },
  break() {
    if (isSilent) return;
    console.log("");
  },
};
