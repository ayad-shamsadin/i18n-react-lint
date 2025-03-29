# i18n-lint

ESLint integration for i18next that helps detect untranslated literal strings in React applications.

## Installation

```bash
# Using npm
npm install -g i18n-react-lint

# Using yarn
yarn global add i18n-react-lint

# Using bun
bun add -g i18n-react-lint
```

## Usage

### Command Line

```bash
# Run the linter on a directory
npx i18n-react-lint ./path/to/your/project

# Run with specific output format
npx i18n-react-lint ./path/to/your/project --format json
```

```bash
# Run the linter on a directory
i18n-react-lint ./path/to/your/project

# Run with specific output format
i18n-react-lint ./path/to/your/project --format json
```

### AI Integration

You can use AI to automatically generate translation keys from your linting results:

```bash
# Run with AI integration to generate translation keys
i18n-react-lint use-ai ./path/to/your/project --api-key YOUR_GEMINI_API_KEY

# Or use environment variable for API key
export GEMINI_API_KEY=your_api_key
i18n-react-lint use-ai ./path/to/your/project

# Specify custom output file
i18n-react-lint use-ai ./path/to/your/project --output ./locales/translations.json

# View results in terminal only (without saving to file)
i18n-react-lint use-ai ./path/to/your/project --api-key YOUR_KEY
```

This will:
1. Run the linter to find untranslated strings
2. Process them with Google's Gemini AI
3. Generate a JSON file with translation keys and values

## Features

- Detects untranslated literal strings in JSX components
- Configurable with ESLint settings
- Works with React and i18next
- AI-powered translation key generation using Google's Gemini API

## Todo  

- [x] Add AI API key integration  
- [x] Accept a list of sentences as JSON key-value pairs  
- [ ] Add translation file support or generate multiple translations in different languages  
- [ ] Improve CLI user interface

## License

MIT
