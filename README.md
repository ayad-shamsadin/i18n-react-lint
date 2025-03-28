# i18n-lint

ESLint integration for i18next that helps detect untranslated literal strings in React applications.

## Installation

```bash
# Using npm
npm install i18n-react-lint --save-dev

# Using yarn
yarn add i18n-react-lint --dev

# Using bun
bun add i18n-react-lint --dev
```

## Usage

### Command Line

```bash
# Run the linter on a directory
npx i18n-react-lint ./path/to/your/project

# Run with specific output format
npx i18n-react-lint ./path/to/your/project --format json
```

### API

```typescript
import { filterLiteralStringErrors } from 'i18n-react-lint';

async function findErrors() {
  const results = await filterLiteralStringErrors('./path/to/your/project');
  console.log(results);
}

findErrors();
```

## Features

- Detects untranslated literal strings in JSX components
- Configurable with ESLint settings
- Works with React and i18next
- Provides both CLI and programmatic API

## Configuration

The default configuration includes:
- TypeScript ESLint recommended rules
- React ESLint recommended rules
- i18next ESLint recommended rules

## License

MIT
