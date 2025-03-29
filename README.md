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

## Features

- Detects untranslated literal strings in JSX components
- Configurable with ESLint settings
- Works with React and i18next

## Todo  

- [ ] Add AI API key integration  
- [ ] Accept a list of sentences as JSON key-value pairs  
- [ ] Add translation file support or generate multiple translations in different languages  
- [ ] Improve CLI user interface

## License

MIT
