import { GoogleGenerativeAI} from "@google/generative-ai";
import fs from "node:fs";
import path from "path";
import type { LintResult } from "./index.js";

interface AITranslationResult {
  [key: string]: string;
}

export async function processLintResultsWithAI(
  results: LintResult[],
  apiKey: string,
  outputPath?: string
): Promise<AITranslationResult> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required. Please provide a valid API key.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro-exp-03-25",
    systemInstruction: 
      "You are an assistant that extracts literal strings from linting error messages and converts them into translation keys and values. The output must be a JSON object where:\n" +
      "The key is a kabab-case version of the original string, prefixed with a relevant category if needed (e.g., loading-message for <loading>).\n" +
      "The value is the original string formatted for translation.\n" +
      "Ignore placeholders (e.g., {variable}) and keep them in the translated string as {variable}.\n" +
      "Use meaningful naming conventions for keys.\n" +
      "DO NOT create template strings in values. Only create simple string values, not complex templates like \"{t(\\\"category-description\\\")} is required\".\n" +
      "IMPORTANT: DO NOT USE MARKDOWN FORMATTING OR CODE BLOCKS. Return ONLY the raw JSON object without any ``` markers.",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const formattedLintResults = results.map(result => {
    return {
      filePath: result.filePath,
      errors: result.errors.map(error => ({
        message: error.message,
        line: error.line,
        column: error.column
      }))
    };
  });

  const result = await chatSession.sendMessage(
    JSON.stringify(formattedLintResults, null, 2)
  );
  
  const responseText = result.response.text();
  
  const cleanedResponseText = cleanMarkdownCodeBlocks(responseText);
  let translationData: AITranslationResult = {};
  try {
    translationData = JSON.parse(cleanedResponseText);
  } catch (error) {
    console.error("Failed to parse AI response as JSON:", error);
    console.log("Attempting to extract JSON from response...");
    const extractedJson = extractJsonFromText(responseText);
    if (extractedJson) {
      try {
        translationData = JSON.parse(extractedJson);
        console.log("Successfully extracted and parsed JSON from response.");
      } catch (jsonError) {
        console.error("Failed to parse extracted JSON:", jsonError);
        console.log("Raw response:", responseText);
        return {}; // Return empty object if all parsing methods fail
      }
    } else {
      console.log("Raw response:", responseText);
      return {}; // Return empty object if extraction fails
    }
  }
  
  // Save to file if path is provided
  if (outputPath) {
    const fullPath = path.resolve(process.cwd(), outputPath);
    const dirname = path.dirname(fullPath);
    
    // Ensure directory exists
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, JSON.stringify(translationData, null, 2));
    console.log(`Translation JSON saved to: ${fullPath}`);
  } else {
    // Only show in terminal if no outputPath
    console.log("Generated translations:");
    console.log(JSON.stringify(translationData, null, 2));
  }
  
  return translationData;
}

/**
 * Cleans markdown code blocks from a string
 * Handles formats like ```json\n{...}\n``` and ```\n{...}\n```
 */
function cleanMarkdownCodeBlocks(text: string): string {
  // Check if the text is wrapped in a markdown code block
  const codeBlockRegex = /^```(?:json|javascript|js)?[\s\n]*([\s\S]*?)[\s\n]*```$/;
  const match = text.trim().match(codeBlockRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  return text;
}

/**
 * Tries to extract a JSON object from text, even if it's wrapped in other content
 */
function extractJsonFromText(text: string): string | null {
  // Look for patterns that might indicate a JSON object
  const jsonRegex = /\{[\s\S]*?\}/g;
  const matches = text.match(jsonRegex);
  
  if (!matches || matches.length === 0) {
    return null;
  }
  
  // Try to get the largest match, which is likely the complete JSON
  let largestMatch = '';
  for (const match of matches) {
    if (match.length > largestMatch.length) {
      largestMatch = match;
    }
  }
  
  return largestMatch;
} 