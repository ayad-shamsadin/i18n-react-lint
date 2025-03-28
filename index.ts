import { ESLint } from "eslint";
import i18next from "eslint-plugin-i18next";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import path from "path";

function createESLintInstance(config: any, parentPath: string) {
  const cwd = path.resolve(process.cwd(), parentPath);
  return new ESLint({
    overrideConfigFile: true,
    overrideConfig: defineConfig(config),
    cwd,
  });
}

const config = [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  i18next.configs["flat/recommended"],
  {
    rules: {
      "i18next/no-literal-string": ["error", { mode: "jsx-text-only" }],
      "react/react-in-jsx-scope": ["off"],
    },
  },
];

const eslint = createESLintInstance(config, "../../hossien/falta-dashboard/app/[locale]/");

const results = await eslint.lintFiles(["**/*.{js,mjs,cjs,ts,jsx,tsx}"]);

console.log(results.map((result) => result.messages));
