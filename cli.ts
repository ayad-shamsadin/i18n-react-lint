#!/usr/bin/env bun
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
  .name("eslint-integration")
  .description("CLI to run ESLint with i18next and React configurations")
  .version("0.1.0");

program
  .argument("<directory>", "Path to the directory to lint")
  .option("-f, --format <format>", "Output format (json, text)", "text")
  .action(async (directory: string, options: CLIOptions) => {
    try {
      // Check if directory exists
      const targetPath = path.resolve(process.cwd(), directory);
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