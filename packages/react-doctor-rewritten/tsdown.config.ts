import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "tsdown";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8")) as {
  version: string;
};

// HACK: agent-install's parseSkillManifest silently returns `null` when
// frontmatter is missing or invalid `name:` / `description:` fields,
// which would cause `react-doctor install` to print success while writing
// zero files. Validate at build time so a broken SKILL.md is caught here.
const assertSkillManifestParseable = (manifestPath: string): void => {
  const raw = fs.readFileSync(manifestPath, "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error(`SKILL.md at ${manifestPath} is missing YAML frontmatter (--- ... ---).`);
  }
  const frontmatter = match[1] ?? "";
  const hasName = /^[ \t]*name[ \t]*:[ \t]*\S/m.test(frontmatter);
  const hasDescription = /^[ \t]*description[ \t]*:[ \t]*\S/m.test(frontmatter);
  if (!hasName || !hasDescription) {
    throw new Error(
      `SKILL.md at ${manifestPath} must declare both "name:" and "description:" in frontmatter (got name=${hasName}, description=${hasDescription}).`,
    );
  }
};

const copySkillToDist = (): void => {
  const skillSource = path.resolve("../../skills/react-doctor");
  const skillTarget = path.resolve("dist/skills/react-doctor");
  if (!fs.existsSync(skillSource)) {
    throw new Error(`Skill source missing at ${skillSource}; expected to ship dist/skills/`);
  }
  assertSkillManifestParseable(path.join(skillSource, "SKILL.md"));
  fs.rmSync(skillTarget, { recursive: true, force: true });
  fs.mkdirSync(skillTarget, { recursive: true });
  fs.cpSync(skillSource, skillTarget, { recursive: true });
};

export default defineConfig([
  {
    entry: {
      cli: "./src/cli.ts",
    },
    external: ["oxlint", "knip", "knip/session", "agent-install"],
    dts: true,
    target: "node22",
    platform: "node",
    env: {
      VERSION: process.env.VERSION ?? packageJson.version,
    },
    fixedExtension: false,
    hooks: {
      "build:done": () => {
        copySkillToDist();
      },
    },
  },
  {
    entry: {
      index: "./src/index.ts",
    },
    external: ["oxlint", "knip", "knip/session", "agent-install"],
    dts: true,
    target: "node22",
    platform: "node",
    fixedExtension: false,
  },
  {
    entry: {
      "react-doctor-plugin": "./src/plugin/index.ts",
    },
    target: "node22",
    platform: "node",
    fixedExtension: false,
  },
]);
