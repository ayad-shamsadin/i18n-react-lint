import { ESLint } from "eslint";
import i18next from "eslint-plugin-i18next";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import path from "path";

export interface LintError {
  message: string;
  line: number;
  column: number;
  severity: number;
  ruleId?: string | null;
}

export interface LintResult {
  filePath: string;
  errors: LintError[];
}

export function createESLintInstance(config: any, parentPath: string) {
  const cwd = path.resolve(process.cwd(), parentPath);
  return new ESLint({
    overrideConfigFile: true,
    overrideConfig: defineConfig(config),
    cwd,
  });
}

export const defaultConfig = [
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

export async function lintDirectory(targetPath: string, config = defaultConfig) {
  const eslint = createESLintInstance(config, targetPath);
  const results = await eslint.lintFiles(["**/*.{js,mjs,cjs,ts,jsx,tsx}"]);
  return results;
}

export async function filterLiteralStringErrors(targetPath: string, config = defaultConfig) {
  const eslint = createESLintInstance(config, targetPath);
  const results = await eslint.lintFiles(["**/*.{js,mjs,cjs,ts,jsx,tsx}"]);
  
  const filteredResults: LintResult[] = [];
  
  for (const result of results) {
    const literalStringErrors = result.messages.filter(
      message => message.message.includes("disallow literal string")
    );
    
    if (literalStringErrors.length > 0) {
      filteredResults.push({
        filePath: result.filePath,
        errors: literalStringErrors.map(error => ({
          message: error.message,
          line: error.line,
          column: error.column,
          severity: error.severity,
          ruleId: error.ruleId
        }))
      });
    }
  }
  
  return filteredResults;
}