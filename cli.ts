#!/usr/bin/env node
import { defaultConfig, filterLiteralStringErrors } from "./index.js";
import type { LintResult } from "./index.js";
import path from "path";
import fs from "fs";
import { Command } from "commander";
import { processLintResultsWithAI } from "./ai-helper.js";

interface CLIOptions {
  format: string;
}

interface AIOptions {
  output: string;
  apiKey: string;
}

const program = new Command();

program
  .name("i18n-react-lint")
  .description("CLI to run ESLint with i18next and React configurations")
  .version("1.2.23");

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

program
  .command("use-ai")
  .description("Use AI to generate translation keys from linting results")
  .argument("[directory]", "Path to the directory to lint (defaults to current directory)")
  .requiredOption("-k, --api-key <key>", "Gemini API key (or set GEMINI_API_KEY env variable)")
  .option("-o, --output <path>", "Path to save the generated file", "translations.json")
  .action(async (directory: string = ".", options: AIOptions) => {
    try {
      const targetPath = directory ? path.resolve(process.cwd(), directory) : process.cwd();
      
      if (!fs.existsSync(targetPath)) {
        console.error(`Error: Directory "${targetPath}" does not exist.`);
        process.exit(1);
      }

      console.log(`Analyzing linting results with AI for directory: ${targetPath}`);
      const results = await filterLiteralStringErrors(targetPath);
      
      if (results.length === 0) {
        console.log("No linting issues found. Nothing to process with AI.");
        return;
      }
      
      // Use environment variable if no API key is provided through option
      const apiKey = options.apiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("Error: Gemini API key is required. Provide it with --api-key or set GEMINI_API_KEY environment variable.");
        process.exit(1);
      }
      
      // Output the linting results
      if (results.length > 0) {
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
        
        console.log(`\nFound ${errorCount} errors and ${warningCount} warnings.`);
      }
      
      // Handle case when no output is provided (terminal only)
      const outputPath = options.output === "translations.json" && !process.argv.includes("-o") && !process.argv.includes("--output") 
        ? undefined 
        : options.output;
      
      console.log(`Processing ${results.length} files with AI...`);
      await processLintResultsWithAI(results, apiKey, outputPath);
      console.log("AI processing completed successfully.");
    } catch (error) {
      console.error("Error during AI processing:", error);
      process.exit(1);
    }
  });

program.parse(); 