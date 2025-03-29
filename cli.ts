#!/usr/bin/env node
import { defaultConfig, filterLiteralStringErrors } from "./index.js";
import type { LintResult } from "./index.js";
import path from "path";
import fs from "fs";
import { Command } from "commander";

interface CLIOptions {
  format: string;
}

const program = new Command();

program
  .name("i18n-react-lint")
  .description("CLI to run ESLint with i18next and React configurations")
  .version("1.2.21");

program
  .argument("[directory]", "Path to the directory to lint (defaults to current directory)")
  .option("-f, --format <format>", "Output format (json, text)", "text")
  .action(async (directory: string = ".", options: CLIOptions) => {
    try {
      const targetPath = directory ? path.resolve(process.cwd(), directory) : process.cwd();
      
      if (!fs.existsSync(targetPath)) {
        console.error(`Error: Directory "${targetPath}" does not exist.`);
        process.exit(1);
      }

      console.log(`Linting directory: ${targetPath}`);
      const results = await filterLiteralStringErrors(targetPath);
      
      if (options.format === "json") {
        console.log(JSON.stringify(results, null, 2));
      } else {
        // Default text format
        if (results.length === 0) {
          console.log("No linting issues found.");
        } else {
          let errorCount = 0;
          let warningCount = 0;
          
          results.forEach((result: LintResult) => {
            if (result.errors.length > 0) {
              console.log(`\nFile: ${result.filePath}`);
              result.errors.forEach(error => {
                if (error.severity === 2) errorCount++;
                if (error.severity === 1) warningCount++;
                
                const severity = error.severity === 2 ? "Error" : "Warning";
                console.log(`  ${severity}: ${error.message} (${error.line}:${error.column})`);
              });
            }
          });
          
          console.log(`\nLinting completed with ${errorCount} errors and ${warningCount} warnings.`);
        }
      }
    } catch (error) {
      console.error("Error during linting:", error);
      process.exit(1);
    }
  });

program.parse(); 